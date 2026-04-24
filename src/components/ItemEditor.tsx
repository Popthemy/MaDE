import React from 'react';
import { DesignData, Template } from '../types';
import { X, Search, CheckCircle2 } from 'lucide-react';

interface Props {
  item: DesignData;
  template: Template;
  onUpdate: (id: string, values: Record<string, string>) => void;
  onTemplateUpdate: (template: Template) => void;
  onClose: () => void;
}

export default function ItemEditor({ item, template, onUpdate, onTemplateUpdate, onClose }: Props) {
  const handleChange = (key: string, value: string) => {
    onUpdate(item.id, { ...item.values, [key]: value });
  };

  const makeDefault = (key: string) => {
    const value = item.values[key];
    if (!value) return;
    
    onTemplateUpdate({
      ...template,
      placeholders: template.placeholders.map(p => 
        p.key === key ? { ...p, staticUrl: value } : p
      )
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] border border-slate-200 flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Preview Side */}
        <div className="flex-1 bg-slate-50 p-12 flex items-center justify-center relative group overflow-hidden">
           <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#7C3AED 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />
           <div className="w-full max-w-md aspect-square bg-white rounded-2xl impact-shadow overflow-hidden border border-slate-100 p-2 shadow-2xl">
              <img src={item.previewUrl} className="w-full h-full object-contain rounded-xl" alt="Current design" />
           </div>
           <div className="absolute top-6 left-6 px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-slate-200 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400">
              <Search size={14} className="text-brand-primary" /> LIVE RENDER
           </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-96 p-8 overflow-y-auto flex flex-col gap-8 bg-white border-l border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-slate-900">Refine Blueprint</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Individual Identity Adjustments</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {template.placeholders.filter(p => !p.staticUrl || p.isFrame).map(p => (
              <div key={p.id} className={`p-5 bg-slate-50/50 rounded-2xl border ${p.isFrame ? 'border-brand-primary/30 bg-brand-primary/5' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between mb-3">
                   <label className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                      {p.key} {p.isFrame && <span className="ml-2 text-brand-primary">[Asset Frame]</span>}
                   </label>
                   {p.staticUrl && (
                      <span className="text-[9px] text-brand-primary/60 font-bold uppercase tracking-tighter italic">Default Active</span>
                   )}
                </div>
                
                {p.type === 'image' ? (
                  <div className="flex flex-col gap-4">
                     <div className="flex flex-col gap-3">
                       <input 
                         type="text" 
                         value={item.values[p.key] || ''}
                         onChange={(e) => handleChange(p.key, e.target.value)}
                         placeholder={p.staticUrl ? "Using Blueprint Default..." : "Image URL..."}
                         className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:border-brand-primary outline-none shadow-inner"
                       />
                       {item.values[p.key] && (
                          <div className="flex flex-col gap-2">
                             <button 
                                onClick={() => makeDefault(p.key)}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary rounded-xl border border-brand-primary/20 transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm"
                             >
                                <CheckCircle2 size={14} />
                                Synchronize as Batch Default
                             </button>
                             <p className="text-[9px] text-slate-400 italic px-2 leading-snug">
                                * Syncing will apply this {p.isFrame ? 'frame' : 'image'} to all other entries in your current session.
                             </p>
                          </div>
                       )}
                     </div>

                     <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <span>Adjust Zoom</span>
                            <span className="text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">{Math.round((parseFloat(item.values[`__zoom_${p.key}`]) || p.zoom || 1) * 100)}%</span>
                          </div>
                          <input 
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.01"
                            value={item.values[`__zoom_${p.key}`] || p.zoom || 1}
                            onChange={(e) => handleChange(`__zoom_${p.key}`, e.target.value || "1")}
                            className="w-full accent-brand-primary h-1.5 rounded-lg appearance-none bg-slate-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Pan X</span>
                              <input 
                                type="range"
                                min="-100"
                                max="100"
                                step="1"
                                value={item.values[`__offX_${p.key}`] || p.offsetX || 0}
                                onChange={(e) => handleChange(`__offX_${p.key}`, e.target.value || "0")}
                                className="w-full accent-slate-300 h-1 rounded-lg appearance-none bg-slate-200"
                              />
                           </div>
                           <div className="space-y-2">
                              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Pan Y</span>
                              <input 
                                type="range"
                                min="-100"
                                max="100"
                                step="1"
                                value={item.values[`__offY_${p.key}`] || p.offsetY || 0}
                                onChange={(e) => handleChange(`__offY_${p.key}`, e.target.value || "0")}
                                className="w-full accent-slate-300 h-1 rounded-lg appearance-none bg-slate-200"
                              />
                           </div>
                        </div>
                     </div>
                  </div>
                ) : (
                  <input 
                    type="text" 
                    value={item.values[p.key] || ''}
                    onChange={(e) => handleChange(p.key, e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-primary outline-none font-medium shadow-inner"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
             <button 
                onClick={onClose}
                className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all active:scale-95 shadow-xl shadow-brand-primary/20"
             >
                Apply Blueprint Changes
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
