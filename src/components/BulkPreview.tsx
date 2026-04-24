import React, { useState } from 'react';
import { DesignData, Template } from '../types';
import { Download, Archive, Edit3, CheckCircle2, ChevronLeft, Zap } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ExportWizard } from './designer/ExportWizard';

interface Props {
  data: DesignData[];
  template: Template;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export default function BulkPreview({ data, template, onBack, onEdit }: Props) {
  const [showExport, setShowExport] = useState(false);

  const getExportName = (item: DesignData) => {
    const firstTextPlaceholder = template.placeholders.find(p => p.type === 'text');
    const val = firstTextPlaceholder ? item.values[firstTextPlaceholder.key] : null;
    return (val || item.id).replace(/[^a-z0-9]/gi, '_').toLowerCase();
  };

  const downloadSingle = (item: DesignData) => {
    if (!item.previewUrl) return;
    const name = getExportName(item);
    saveAs(item.previewUrl, `${name}.png`);
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    data.forEach((item) => {
      if (item.previewUrl) {
        const name = getExportName(item);
        const base64Data = item.previewUrl.split(',')[1];
        zip.file(`${name}.png`, base64Data, { base64: true });
      }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `bulk_designs_${Date.now()}.zip`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
           <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-2 group font-bold text-xs uppercase tracking-widest"
           >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back to Editor
           </button>
           <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
              Generated Results
              <span className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm rounded-full">
                {data.length} Designs
              </span>
           </h2>
        </div>

        <button 
          onClick={() => setShowExport(true)}
          className="flex items-center justify-center gap-2 px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all hover:scale-[1.02] active:scale-95 impact-shadow shadow-lg shadow-brand-primary/20"
        >
          <Zap size={20} />
          Export All Records
        </button>
      </div>

      {showExport && <ExportWizard data={data} template={template} onClose={() => setShowExport(false)} onEdit={(id) => { onEdit(id); setShowExport(false); }} />}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {data.map((item) => (
          <div key={item.id} className="group relative flex flex-col gap-4 bg-white p-4 rounded-3xl border border-slate-100 hover:border-brand-primary/20 transition-all impact-shadow shadow-sm">
             <div 
                className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 w-full shadow-inner"
                style={{ aspectRatio: `${template.width} / ${template.height}` }}
             >
                {item.previewUrl ? (
                   <img 
                      src={item.previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-contain animate-in fade-in duration-500"
                   />
                ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <div className="w-10 h-10 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                      <div className="space-y-2 w-full max-w-[120px]">
                         <div className="h-1.5 bg-slate-200 rounded-full w-full animate-pulse" />
                         <div className="h-1.5 bg-slate-200 rounded-full w-2/3 mx-auto animate-pulse" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-300 font-bold">
                         Architecting
                      </span>
                   </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-brand-primary/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                   <button 
                      onClick={() => onEdit(item.id)}
                      className="p-3 bg-white hover:scale-110 shadow-lg text-brand-primary rounded-full transition-all"
                      title="Edit Item"
                   >
                      <Edit3 size={20} />
                   </button>
                   <button 
                      onClick={() => downloadSingle(item)}
                      className="p-3 bg-brand-primary text-white hover:scale-110 shadow-lg rounded-full transition-all"
                      title="Download PNG"
                   >
                      <Download size={20} />
                   </button>
                </div>
             </div>

             <div className="flex items-center justify-between px-2">
                <div className="flex flex-col min-w-0">
                   <span className="text-sm font-bold truncate text-slate-900">
                      {(() => {
                         const firstTextPlaceholder = template.placeholders.find(p => p.type === 'text');
                         return firstTextPlaceholder ? (item.values[firstTextPlaceholder.key] || `No Data for ${firstTextPlaceholder.key}`) : `Design ${item.id.slice(0, 5)}`;
                      })()}
                   </span>
                   <span className="text-[10px] uppercase tracking-widest text-slate-400 truncate">
                      {(() => {
                         const textPlaceholders = template.placeholders.filter(p => p.type === 'text');
                         const secondary = textPlaceholders[1] || textPlaceholders[0];
                         return secondary ? (item.values[secondary.key] || `Mapped: ${secondary.key}`) : 'Draft Record';
                      })()}
                   </span>
                </div>
                <div className="shrink-0">
                   <CheckCircle2 size={18} className="text-brand-accent/50" />
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Soft Prompt: After Value Experience */}
      <div className="mt-12 p-10 bg-slate-50 border border-slate-200 rounded-[2rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 impact-shadow">
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[80px] -z-10" />
         <div className="space-y-4 max-w-xl text-center md:text-left">
            <h3 className="text-3xl font-bold tracking-tight text-slate-900">Want to generate for your <span className="text-brand-primary underline decoration-brand-primary/30 decoration-4 underline-offset-8">whole group</span>?</h3>
            <p className="text-slate-500 leading-relaxed">
               You've seen the preview. Now upload your full list of names and photos to generate 1,000+ designs in one click.
            </p>
         </div>
         <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button 
              onClick={onBack}
              className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
            >
               📦 Upload CSV (Bulk Create)
            </button>
            <button 
              onClick={() => setShowExport(true)}
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
               🚀 Export Results Now
            </button>
         </div>
      </div>
    </div>
  );
}
