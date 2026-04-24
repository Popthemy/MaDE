import React, { useRef } from 'react';
import { Plus, Type, Image as ImageIcon, Upload, Trash2 } from 'lucide-react';
import { Template, Placeholder } from '../../types';

interface DesignerToolbarProps {
  template: Template;
  selectedId: string | null;
  addPlaceholder: (type: 'text' | 'image', isFrame?: boolean) => void;
  updateTemplate: (attr: Partial<Template>) => void;
  updatePlaceholder: (id: string, attr: Partial<Placeholder>) => void;
  removeSelected: () => void;
}

export const DesignerToolbar: React.FC<DesignerToolbarProps> = ({
  template,
  selectedId,
  addPlaceholder,
  updateTemplate,
  updatePlaceholder,
  removeSelected
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const selectedPlaceholder = template.placeholders.find(p => p.id === selectedId);

  // Auto-focus and select label when selection changes
  React.useEffect(() => {
    if (selectedId && labelInputRef.current) {
      labelInputRef.current.focus();
      labelInputRef.current.select();
    }
  }, [selectedId]);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        updateTemplate({ 
          backgroundUrl: url,
          width: img.width,
          height: img.height
        });
      };
    }
  };

  return (
    <div className="w-full lg:w-80 flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-col gap-6">
      {/* Add Elements */}
      <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col gap-4 shadow-sm">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Plus size={20} className="text-brand-primary" />
          Add Elements
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => addPlaceholder('text')}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-brand-primary/5 rounded-2xl border border-slate-100 transition-all group"
          >
            <Type size={24} className="group-hover:text-brand-primary mb-2 text-slate-400 transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Text Field</span>
          </button>
          <button 
            onClick={() => addPlaceholder('image')}
            className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-brand-primary/5 rounded-2xl border border-slate-100 transition-all group"
          >
            <ImageIcon size={24} className="group-hover:text-brand-primary mb-2 text-slate-400 transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Image Field</span>
          </button>
        </div>
        <button 
          onClick={() => addPlaceholder('image', true)}
          className="w-full py-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 text-[10px] font-bold uppercase tracking-widest transition-all text-slate-500"
        >
          Add Frame Overlay
        </button>
      </div>

      {/* Background */}
      <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col gap-4 shadow-sm">
        <h3 className="text-lg font-bold flex items-center justify-between">
          Background
          {template.backgroundUrl?.startsWith('blob:') && (
             <span className="text-[10px] text-brand-primary animate-pulse font-bold">LOCAL SESSION</span>
          )}
        </h3>
        
        <div className="space-y-3">
           <input 
             type="text" 
             value={template.backgroundUrl?.startsWith('blob:') ? '' : (template.backgroundUrl || '')}
             onChange={(e) => updateTemplate({ backgroundUrl: e.target.value })}
             placeholder="Remote Backdrop URL"
             className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-primary outline-none transition-all placeholder:text-slate-300"
           />

           <div className="flex items-center gap-3">
              <div className="h-px bg-slate-100 grow" />
              <span className="text-[10px] text-slate-300 font-bold">OR</span>
              <div className="h-px bg-slate-100 grow" />
           </div>

           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/*"
             onChange={handleBgUpload}
           />
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="w-full py-4 bg-slate-50 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
           >
              <Upload size={14} />
              Upload Backdrop
           </button>
        </div>

        {template.backgroundUrl && (
          <button 
            onClick={() => updateTemplate({ backgroundUrl: undefined })}
            className="text-[10px] uppercase tracking-widest font-bold text-red-400 hover:text-red-500 transition-colors pt-2 text-center"
          >
            Remove Background
          </button>
        )}
      </div>

      {/* Properties */}
      {selectedPlaceholder && (
        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col gap-6 shadow-sm relative overflow-hidden md:col-span-2 lg:col-span-1">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary" />
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold">
                {selectedPlaceholder.type === 'text' ? 'Text Properties' : 
                 selectedPlaceholder.isFrame ? 'Frame Properties' : 'Image Properties'}
              </h3>
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-tight">{selectedPlaceholder.label}</span>
            </div>
            <button 
              onClick={removeSelected} 
              className="p-2 hover:bg-red-50 text-red-300 hover:text-red-500 rounded-xl transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block font-bold">Field Label</label>
                <input 
                  ref={labelInputRef}
                  type="text" 
                  value={selectedPlaceholder.label}
                  onChange={(e) => {
                    updatePlaceholder(selectedId!, { label: e.target.value });
                  }}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-3 text-sm focus:border-brand-primary focus:bg-white outline-none font-bold"
                  placeholder="The text shown in designer..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Mapping Key</label>
                  <button 
                    onClick={() => {
                      const newKey = selectedPlaceholder.label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                      updatePlaceholder(selectedId!, { key: newKey });
                    }}
                    className="text-[9px] text-brand-primary font-bold uppercase hover:underline"
                  >
                    Sync to Label
                  </button>
                </div>
                <input 
                  type="text" 
                  value={selectedPlaceholder.key}
                  onChange={(e) => {
                    const cleanKey = e.target.value.replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                    updatePlaceholder(selectedId!, { key: cleanKey });
                  }}
                  className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 font-mono text-[11px] focus:ring-2 focus:ring-brand-primary outline-none"
                  placeholder="CSV Column Name..."
                />
                <p className="text-[9px] text-slate-400 mt-2 font-medium">
                  Maps to table column: <span className="text-brand-primary font-bold">{`{${selectedPlaceholder.key}}`}</span>
                </p>
              </div>

              {/* Text Layout Controls */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Text Style</label>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <div className="flex gap-1 p-1 bg-slate-50 border border-slate-100 rounded-xl grow">
                      <button 
                        onClick={() => updatePlaceholder(selectedId!, { wrap: 'none' })}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${selectedPlaceholder.wrap === 'none' || !selectedPlaceholder.wrap ? 'bg-white text-brand-primary shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:bg-white/50'}`}
                      >
                        Single
                      </button>
                      <button 
                        onClick={() => updatePlaceholder(selectedId!, { wrap: 'word' })}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${selectedPlaceholder.wrap === 'word' ? 'bg-white text-brand-primary shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:bg-white/50'}`}
                      >
                        Wrap
                      </button>
                    </div>
                    <button 
                      onClick={() => updatePlaceholder(selectedId!, { fontWeight: selectedPlaceholder.fontWeight === 'bold' ? 'normal' : 'bold' })}
                      className={`px-4 rounded-xl border transition-all ${selectedPlaceholder.fontWeight === 'bold' ? 'bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20 scale-105' : 'bg-white border-slate-200 text-slate-600 hover:border-brand-primary/40'}`}
                      title="Toggle Bold"
                    >
                      <span className="font-black text-xs">B</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <button 
                      onClick={() => updatePlaceholder(selectedId!, { fontSize: Math.max(8, (selectedPlaceholder.fontSize || 24) - 2) })}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 hover:text-brand-primary hover:border-brand-primary transition-all shadow-sm active:scale-95"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-xs font-black text-slate-900 mono">{selectedPlaceholder.fontSize || 24}</span>
                      <span className="text-[8px] text-slate-400 block font-bold tracking-tighter uppercase">PX SIZE</span>
                    </div>
                    <button 
                      onClick={() => updatePlaceholder(selectedId!, { fontSize: (selectedPlaceholder.fontSize || 24) + 2 })}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 hover:text-brand-primary hover:border-brand-primary transition-all shadow-sm active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {selectedPlaceholder.type === 'text' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block font-bold">Font Size</label>
                  <input 
                    type="number" 
                    value={selectedPlaceholder.fontSize || 24}
                    onChange={(e) => updatePlaceholder(selectedId!, { fontSize: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-sm text-slate-700 font-bold focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Color</label>
                    <span className="text-[10px] font-mono text-slate-400">{selectedPlaceholder.fill || '#FFFFFF'}</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="color" 
                      value={selectedPlaceholder.fill || '#FFFFFF'}
                      onChange={(e) => updatePlaceholder(selectedId!, { fill: e.target.value })}
                      className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer overflow-hidden p-0"
                    />
                  </div>
                </div>
              </div>
            )}

            {(selectedPlaceholder.type === 'image' || selectedPlaceholder.isFrame) && (
               <div className="space-y-4 pt-2 border-t border-slate-100 mt-2">
                  <div className="relative">
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 block font-bold">Asset Source URL</label>
                    <div className="flex gap-2">
                       <input 
                        type="text" 
                        value={selectedPlaceholder.staticUrl?.startsWith('blob:') ? '' : (selectedPlaceholder.staticUrl || '')}
                        onChange={(e) => updatePlaceholder(selectedId!, { staticUrl: e.target.value })}
                        placeholder="Public Image URL..."
                        className="grow bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5 text-xs focus:bg-white outline-none font-medium"
                      />
                      <label className="shrink-0 p-3 bg-slate-100 hover:bg-brand-primary/10 text-slate-400 hover:text-brand-primary rounded-xl cursor-pointer transition-all border border-slate-200">
                        <Upload size={14} />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              updatePlaceholder(selectedId!, { staticUrl: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {selectedPlaceholder.staticUrl && (
                    <div className="p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 space-y-3">
                       <p className="text-[10px] text-brand-primary font-bold leading-tight">
                         You have an asset attached. Apply this to all designs in your batch output?
                       </p>
                       <div className="flex gap-2">
                         <button 
                            onClick={() => updatePlaceholder(selectedId!, { staticUrl: selectedPlaceholder.staticUrl })}
                            className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-brand-primary text-white rounded-lg shadow-sm"
                         >
                            Apply to all
                         </button>
                         <button 
                            onClick={() => updatePlaceholder(selectedId!, { staticUrl: undefined })}
                            className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-white text-red-400 border border-red-100 rounded-lg"
                         >
                            Remove
                         </button>
                       </div>
                    </div>
                  )}
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
