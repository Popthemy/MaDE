import { useState, useEffect } from 'react';
import { Template, DesignData } from '../types';
import { INITIAL_TEMPLATE, DEFAULT_PLACEHOLDERS } from '../constants';
import { renderDesign } from '../lib/renderer';

export type ViewType = 'landing' | 'templates' | 'editor' | 'preview' | 'manual';

export function useMassDesign() {
  const [template, setTemplate] = useState<Template>(() => {
    // Initial load from URL if available
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('t');
    if (encoded) {
      try {
        const payload = JSON.parse(decodeURIComponent(escape(atob(encoded))));
        
        // Sanitize and ensure data integrity for imported templates
        const sanitizePlaceholders = (pls: any[]) => pls.map((p: any) => ({
          ...p,
          id: p.id || `p-${Math.random().toString(36).substr(2, 9)}`,
          label: p.label || p.l || p.key || p.k || 'Unnamed Field',
          key: p.key || p.k || 'field',
          type: p.type || p.t || 'text',
          x: p.x !== undefined ? p.x : 0,
          y: p.y !== undefined ? p.y : 0,
          width: p.width || p.w || 100,
          height: p.height || p.h || 40,
          fontSize: p.fontSize || p.f || 24,
          fill: p.fill || p.c || '#000000',
          align: p.align || p.a || 'left',
          fontFamily: p.fontFamily || 'Inter'
        }));

        // Handle Compressed payload
        if (payload.p) {
          return {
            id: payload.id || 'shared',
            name: payload.n || 'Shared Design',
            width: payload.w || INITIAL_TEMPLATE.width,
            height: payload.h || INITIAL_TEMPLATE.height,
            backgroundUrl: payload.b,
            category: payload.cat,
            tags: payload.tags,
            description: payload.desc,
            thumbnail: payload.thumb,
            sampleData: payload.sd,
            placeholders: sanitizePlaceholders(payload.p.map((p: any) => ({
              k: p.k,
              l: p.l,
              t: p.t,
              x: p.x,
              y: p.y,
              w: p.w,
              h: p.h,
              f: p.f,
              c: p.c,
              a: p.a,
              r: p.r,
              z: p.z,
              ox: p.ox,
              oy: p.oy,
              if: p.if,
              su: p.su
            })))
          };
        }

        // Handle Full Object payload (Legacy or external imports)
        return {
          id: payload.id || 'imported',
          name: payload.name || 'Imported Design',
          ...INITIAL_TEMPLATE,
          ...payload,
          placeholders: sanitizePlaceholders(payload.placeholders || [])
        };
      } catch (e) {
        console.error('Failed to parse shared template', e);
      }
    }
    return {
      id: 'default',
      name: 'New Template',
      ...INITIAL_TEMPLATE,
      placeholders: DEFAULT_PLACEHOLDERS
    };
  });
  
  const [data, setData] = useState<DesignData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [view, setView] = useState<ViewType>(() => {
    // Bootstrap directly to editor if a template is present in URL
    const params = new URLSearchParams(window.location.search);
    return params.has('t') ? 'editor' : 'landing';
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);

  // Auto-generate if we land with data
  useEffect(() => {
    if (view === 'preview' && data.length > 0 && !data[0].previewUrl) {
      handleGenerate();
    }
  }, [view]);

  const handleTemplateSelection = (newTemplate: Template, initialData?: any[], forceView?: 'editor' | 'preview') => {
    setTemplate(newTemplate);
    if (initialData) {
      setData(initialData);
      setView(forceView || 'editor');
    } else {
      setView('editor');
    }
  };

  const handleStartScratch = () => {
    setTemplate({
      id: `scratch-${Date.now()}`,
      name: 'Custom Template',
      ...INITIAL_TEMPLATE,
      placeholders: []
    });
    setData([]);
    setView('editor');
  };

  const handleShare = async () => {
    setIsSharing(true);
    await new Promise(r => setTimeout(r, 800));

    const essential = {
      p: template.placeholders.map(p => ({
        k: p.key,
        l: p.label,
        t: p.type,
        x: Math.round(p.x),
        y: Math.round(p.y),
        w: Math.round(p.width),
        h: Math.round(p.height),
        f: p.fontSize,
        c: p.fill,
        a: p.align,
        r: p.rotation,
        z: p.zoom,
        ox: p.offsetX,
        oy: p.offsetY,
        if: p.isFrame,
        su: p.staticUrl
      })),
      b: template.backgroundUrl,
      n: template.name,
      w: template.width,
      h: template.height,
      id: template.id,
      cat: template.category,
      tags: template.tags,
      desc: template.description,
      thumb: template.thumbnail,
      sd: template.sampleData
    };
    
    try {
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(essential))));
      const url = `${window.location.origin}${window.location.pathname}?t=${encoded}`;
      await navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2500);
    } catch (e) {
      console.error('Share failed:', e);
      alert('Template data is too large to share via URL.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setView('preview');
    
    const processedData = [...data];
    const cache = new Map<string, string>();

    for (let i = 0; i < processedData.length; i++) {
       const item = processedData[i];
       // Create a stable key for the data values
       const cacheKey = JSON.stringify(item.values);
       
       if (cache.has(cacheKey)) {
         processedData[i] = { ...item, previewUrl: cache.get(cacheKey) };
       } else {
         const previewUrl = await renderDesign(template, item);
         processedData[i] = { ...item, previewUrl };
         cache.set(cacheKey, previewUrl);
       }
       
       // Update state incrementally for better UX
       setData([...processedData]);
    }
    
    setIsGenerating(false);
  };

  const handleItemUpdate = async (id: string, values: Record<string, string>) => {
    const newData = data.map(item => item.id === id ? { ...item, values } : item);
    setData(newData);
    
    const updatedItem = newData.find(item => item.id === id);
    if (updatedItem) {
      const previewUrl = await renderDesign(template, updatedItem);
      setData(newData.map(item => item.id === id ? { ...item, previewUrl } : item));
    }
  };

  const handleTemplateUpdate = async (newTemplate: Template) => {
    setTemplate(newTemplate);
    if (data.length > 0) {
      setIsGenerating(true);
      const updatedData = [...data];
      const cache = new Map<string, string>();

      for (let i = 0; i < updatedData.length; i++) {
        const item = updatedData[i];
        const cacheKey = JSON.stringify(item.values);

        if (cache.has(cacheKey)) {
          updatedData[i] = { ...item, previewUrl: cache.get(cacheKey) };
        } else {
          const previewUrl = await renderDesign(newTemplate, updatedData[i]);
          updatedData[i] = { ...updatedData[i], previewUrl };
          cache.set(cacheKey, previewUrl);
        }
        
        setData([...updatedData]);
      }
      setIsGenerating(false);
    }
  };

  return {
    template,
    setTemplate,
    data,
    setData,
    isGenerating,
    isSharing,
    view,
    setView,
    editingId,
    setEditingId,
    showCopied,
    handleGenerate,
    handleShare,
    handleTemplateSelection,
    handleStartScratch,
    handleItemUpdate,
    handleTemplateUpdate
  };
}
