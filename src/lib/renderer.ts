import { Template, DesignData } from '../types';
import { DEFAULT_CANVAS_SIZE } from '../constants';

/**
 * Renders a design to a data URL using a hidden canvas.
 */
export async function renderDesign(template: Template, data: DesignData): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = template.width || DEFAULT_CANVAS_SIZE;
    canvas.height = template.height || DEFAULT_CANVAS_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve('');

    const imagesToLoad: { p: any; img: HTMLImageElement }[] = [];

    // 1. Load background
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = template.backgroundUrl || '';

    bgImg.onload = async () => {
      // Draw background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (template.backgroundUrl) {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      }

      // Identify images to load (User Photos and Frames)
      const imagePlaceholders = template.placeholders.filter(p => p.type === 'image');
      
      const loadedImages = await Promise.all(imagePlaceholders.map(async (p) => {
        const primaryUrl = data.values[p.key];
        const secondaryUrl = p.staticUrl;

        const load = (url: string): Promise<HTMLImageElement | null> => {
          return new Promise(rel => {
            if (!url || typeof url !== 'string' || url.trim() === "") return rel(null);
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = url;
            img.onload = () => {
              console.log(`[Renderer] Successfully loaded ${p.isFrame ? 'Frame' : 'Image'} (${p.key}): ${url.slice(0, 30)}...`);
              rel(img);
            };
            img.onerror = (e) => {
              console.warn(`[Renderer] Failed to load ${p.isFrame ? 'Frame' : 'Image'} (${p.key}): ${url.slice(0, 30)}...`, e);
              rel(null);
            };
          });
        };

        // Try primary (record-specific) first, then fallback to secondary (template-default)
        let img = (primaryUrl && primaryUrl.trim() !== "") ? await load(primaryUrl) : null;
        
        if (!img && secondaryUrl) {
          console.log(`[Renderer] Logic: Using template default for ${p.key}`);
          img = await load(secondaryUrl);
        }
        
        return { p, img };
      }));

      // Draw everything in order of placeholders (layers)
      for (const p of template.placeholders) {
        ctx.save();
        
        // Konva rotates around the (x, y) origin. 
        ctx.translate(p.x, p.y);
        if (p.rotation) {
          ctx.rotate((p.rotation * Math.PI) / 180);
        }

        if (p.type === 'text') {
          const text = data.values[p.key] || `{${p.key}}`;
          ctx.font = `${p.fontSize}px ${p.fontFamily || 'Inter'}`;
          ctx.fillStyle = p.fill || '#FFFFFF';
          ctx.textAlign = (p.align as CanvasTextAlign) || 'left';
          ctx.textBaseline = 'middle';
          
          let drawX = 0;
          if (p.align === 'center') drawX = p.width / 2;
          if (p.align === 'right') drawX = p.width;

          if (p.wrap === 'word' || p.wrap === 'char') {
            let currentFontSize = p.fontSize || 24;
            let lines: string[] = [];
            
            // Auto-resize font if any single word is wider than the container
            const words = text.split(' ');
            const calculateLines = (fSize: number) => {
              ctx.font = `${fSize}px ${p.fontFamily || 'Inter'}`;
              const lns: string[] = [];
              let line = '';
              for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                if (ctx.measureText(testLine).width > p.width && n > 0) {
                  lns.push(line);
                  line = words[n] + ' ';
                } else {
                  line = testLine;
                }
              }
              lns.push(line);
              return lns;
            };

            // Ensure even the longest word fits or we hit minimum size
            while (currentFontSize > 8) {
              ctx.font = `${currentFontSize}px ${p.fontFamily || 'Inter'}`;
              const hasOverflowingWord = words.some(w => ctx.measureText(w).width > p.width);
              if (!hasOverflowingWord) break;
              currentFontSize -= 1;
            }

            lines = calculateLines(currentFontSize);
            const lineHeight = currentFontSize * 1.2;
            ctx.font = `${currentFontSize}px ${p.fontFamily || 'Inter'}`;

            const totalHeight = lines.length * lineHeight;
            let startY = (p.height - totalHeight) / 2 + lineHeight / 2;

            lines.forEach((l, i) => {
              ctx.fillText(l.trim(), drawX, startY + i * lineHeight);
            });
          } else {
            // Auto-resize text helper (Single line)
            let currentFontSize = p.fontSize || 24;
            ctx.font = `${currentFontSize}px ${p.fontFamily || 'Inter'}`;
            while (ctx.measureText(text).width > p.width && currentFontSize > 10) {
              currentFontSize -= 2;
              ctx.font = `${currentFontSize}px ${p.fontFamily || 'Inter'}`;
            }
            
            ctx.fillText(text, drawX, p.height / 2);
          }
        } else {
          const loaded = loadedImages.find(li => li.p.id === p.id);
          if (loaded?.img) {
            // Apply Zoom and Offset (Pan)
            // 1. Get base values from placeholder, allow override from data.values
            const zoom = parseFloat(data.values[`__zoom_${p.key}`]) || p.zoom || 1;
            const offsetX = parseFloat(data.values[`__offX_${p.key}`]) || p.offsetX || 0;
            const offsetY = parseFloat(data.values[`__offY_${p.key}`]) || p.offsetY || 0;

            // Draw image with "Cover" fit + Zoom/Offset
            const img = loaded.img;
            const aspect = img.width / img.height;
            const targetAspect = p.width / p.height;
            
            let sx, sy, sw, sh;
            if (aspect > targetAspect) {
              sh = img.height;
              sw = img.height * targetAspect;
              sx = (img.width - sw) / 2;
              sy = 0;
            } else {
              sw = img.width;
              sh = img.width / targetAspect;
              sx = 0;
              sy = (img.height - sh) / 2;
            }

            // Apply Zoom (Scale the source rectangle)
            const zoomFactor = 1 / Math.max(0.1, zoom);
            const zoomedSw = sw * zoomFactor;
            const zoomedSh = sh * zoomFactor;
            
            // Apply Offset (percentage of image dimensions)
            const finalSx = sx + (sw - zoomedSw) / 2 + (offsetX * (img.width / 100));
            const finalSy = sy + (sh - zoomedSh) / 2 + (offsetY * (img.height / 100));
            
            // Draw at (0,0) because we translated to p.x, p.y
            ctx.drawImage(img, finalSx, finalSy, zoomedSw, zoomedSh, 0, 0, p.width, p.height);
          }
        }
        
        ctx.restore();
      }

      resolve(canvas.toDataURL('image/png'));
    };

    bgImg.onerror = () => resolve('');
    if (!template.backgroundUrl) bgImg.onload!(new Event('load') as any);
  });
}
