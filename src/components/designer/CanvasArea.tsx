import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import { Move } from 'lucide-react';
import { Template, Placeholder, DesignData } from '../../types';
import { DEFAULT_CANVAS_SIZE } from '../../constants';
import { PlaceholderItem } from './PlaceholderItem';

interface CanvasAreaProps {
  template: Template;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  updatePlaceholder: (id: string, attr: Partial<Placeholder>) => void;
  dataSample?: DesignData;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({ 
  template, 
  selectedId, 
  setSelectedId, 
  updatePlaceholder,
  dataSample
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [isBgLoading, setIsBgLoading] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.parentElement?.offsetWidth || 0;
        const containerHeight = containerRef.current.parentElement?.offsetHeight || 0;
        const scaleW = (containerWidth - 64) / template.width;
        const scaleH = (containerHeight - 64) / template.height;
        setCanvasScale(Math.min(scaleW, scaleH, 1));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (template.backgroundUrl) {
      setIsBgLoading(true);
      const img = new Image();
      img.src = template.backgroundUrl;
      img.onload = () => {
        setBgImage(img);
        setIsBgLoading(false);
      };
      img.onerror = () => setIsBgLoading(false);
    } else {
      setBgImage(null);
      setIsBgLoading(false);
    }
  }, [template.backgroundUrl]);

  return (
    <div className="flex-1 flex justify-center bg-slate-50 items-center overflow-auto rounded-[3rem] relative p-12 group border border-slate-100 shadow-inner">
      <div 
        ref={containerRef}
        className="impact-shadow bg-white relative border border-slate-200 rounded-lg overflow-hidden shadow-2xl transition-all"
        style={{ 
          width: template.width * canvasScale, 
          height: template.height * canvasScale,
        }}
      >
        {isBgLoading && (
          <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
             <div className="w-12 h-12 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin" />
             <span className="text-[10px] font-bold text-brand-primary animate-pulse uppercase tracking-[0.3em]">Architecting...</span>
          </div>
        )}
        <div className="w-full h-full">
           <Stage 
            width={template.width * canvasScale} 
            height={template.height * canvasScale}
            ref={stageRef}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) {
                setSelectedId(null);
              }
            }}
            scaleX={canvasScale}
            scaleY={canvasScale}
          >
            <Layer>
              <Rect width={template.width} height={template.height} fill="#FFFFFF" />
              {bgImage && (
                <KonvaImage 
                  image={bgImage} 
                  width={template.width} 
                  height={template.height} 
                />
              )}
              {template.placeholders.map((p) => (
                <PlaceholderItem 
                  key={p.id}
                  placeholder={p}
                  isSelected={p.id === selectedId}
                  onSelect={() => setSelectedId(p.id)}
                  onChange={(attr) => updatePlaceholder(p.id, attr)}
                  dataSample={dataSample}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
      
      {template.placeholders.length === 0 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-full border border-slate-200 shadow-lg text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary animate-in slide-in-from-bottom-4 duration-1000">
           <Move size={14} /> Drag & Drop Blueprint Elements
        </div>
      )}
    </div>
  );
};
