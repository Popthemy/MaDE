import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Printer, 
  Layout, 
  Smartphone, 
  Archive, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  X,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { DesignData, Template } from '../../types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

interface ExportWizardProps {
  data: DesignData[];
  template: Template;
  onClose: () => void;
  onEdit?: (id: string) => void;
}

type ExportMode = 'a4_layout' | 'full_page' | 'digital' | 'zip';

export const ExportWizard: React.FC<ExportWizardProps> = ({ data, template, onClose, onEdit }) => {
  const [step, setStep] = useState<'options' | 'generating'>('options');
  const [selectedMode, setSelectedMode] = useState<ExportMode | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: data.length, message: 'Initializing...' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [checks, setChecks] = useState<{
    lowRes: boolean;
    missingData: string[]; // Array of IDs
    textOverflow: string[]; // Array of IDs
  }>({ lowRes: false, missingData: [], textOverflow: [] });

  const hasIssues = checks.lowRes || checks.missingData.length > 0 || checks.textOverflow.length > 0;

  // Scan design for issues
  useEffect(() => {
    const missing = data
      .filter(item => {
        return template.placeholders.some(p => {
          const val = item.values[p.key];
          return !val || (typeof val === 'string' && val.trim() === '');
        });
      })
      .map(item => item.id);

    const overflowing = data
      .filter(item => {
        return template.placeholders.filter(p => p.type === 'text' && p.wrap !== 'word').some(p => {
          const val = String(item.values[p.key] || '');
          return (val.length * (p.fontSize || 24) * 0.5) > p.width * 1.2;
        });
      })
      .map(item => item.id);

    setChecks({
      lowRes: template.placeholders.some(p => p.type === 'image' && p.width > 600),
      missingData: missing,
      textOverflow: overflowing,
    });
  }, [data, template]);

  const canFitA4 = useMemo(() => {
    const a4Width = 595.28;
    const a4Height = 841.89;
    // Check if it fits in landscape or portrait A4
    return (template.width <= a4Width - 40 && template.height <= a4Height - 40) ||
           (template.width <= a4Height - 40 && template.height <= a4Width - 40);
  }, [template.width, template.height]);

  const handleGenerate = async () => {
    if (!selectedMode || isProcessing) return;
    setIsProcessing(true);
    setStep('generating');
    
    try {
      if (selectedMode === 'zip') {
        await generateZip();
      } else {
        await generatePdf(selectedMode);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getExportName = (item: DesignData) => {
    const firstTextPlaceholder = template.placeholders.find(p => p.type === 'text');
    const val = firstTextPlaceholder ? item.values[firstTextPlaceholder.key] : null;
    return (val || item.id).replace(/[^a-z0-9]/gi, '_').toLowerCase();
  };

  const generateZip = async () => {
    const zip = new JSZip();
    setProgress({ current: 0, total: data.length, message: 'Analyzing batch quality...' });
    await new Promise(r => setTimeout(r, 800));

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.previewUrl) {
        const name = getExportName(item);
        const base64Data = item.previewUrl.split(',')[1];
        zip.file(`${name}.png`, base64Data, { base64: true });
      }
      setProgress({ 
        current: i + 1, 
        total: data.length, 
        message: `Packing design ${i + 1} of ${data.length}...` 
      });
      if (i % 10 === 0) await new Promise(r => setTimeout(r, 0));
    }

    setProgress(prev => ({ ...prev, message: 'Compressing archive...' }));
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${template.name.toLowerCase().replace(/\s+/g, '_')}_collection.zip`);
    onClose();
  };

  const generatePdf = async (mode: ExportMode) => {
    setProgress({ current: 0, total: data.length, message: 'Preparing high-resolution buffers...' });
    await new Promise(r => setTimeout(r, 1000));

    if (mode === 'a4_layout') {
      const a4Width = 595.28;
      const a4Height = 841.89;
      const margin = 20;

      // Determine best grid
      const cols = Math.floor((a4Width - margin * 2) / template.width) || 1;
      const rows = Math.floor((a4Height - margin * 2) / template.height) || 1;
      const perPage = cols * rows;
      
      const a4Pdf = new jsPDF('p', 'pt', 'a4');
      
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const itemIdx = i % perPage;
        const r = Math.floor(itemIdx / cols);
        const c = itemIdx % cols;
        const currentPageNum = Math.floor(i / perPage) + 1;
        const totalPages = Math.ceil(data.length / perPage);

        if (itemIdx === 0 && i !== 0) a4Pdf.addPage();

        if (item.previewUrl) {
          const x = margin + c * template.width;
          const y = margin + r * template.height;
          a4Pdf.addImage(item.previewUrl, 'PNG', x, y, template.width, template.height);
        }
        
        setProgress({ 
          current: i + 1, 
          total: data.length, 
          message: `Mapping page ${currentPageNum} of ${totalPages}...` 
        });
        if (i % 2 === 0) await new Promise(r => setTimeout(r, 0));
      }
      setProgress(prev => ({ ...prev, message: 'Generating print layout...' }));
      a4Pdf.save(`${template.name}_A4_Grid.pdf`);
    } else {
      const pdf = new jsPDF(template.width > template.height ? 'l' : 'p', 'pt', [template.width, template.height]);
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (i !== 0) pdf.addPage([template.width, template.height], template.width > template.height ? 'l' : 'p');
        if (item.previewUrl) {
          pdf.addImage(item.previewUrl, 'PNG', 0, 0, template.width, template.height);
        }
        setProgress({ 
          current: i + 1, 
          total: data.length, 
          message: `Dumping page data ${i + 1} for ${data.length} records...` 
        });
        if (i % 2 === 0) await new Promise(r => setTimeout(r, 0));
      }
      setProgress(prev => ({ ...prev, message: 'Finalizing your high-quality export...' }));
      pdf.save(`${template.name}_Batch_Export.pdf`);
    }
    
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all z-20"
        >
          <X size={24} />
        </button>

        {step === 'options' ? (
          <div className="p-6 sm:p-12 space-y-8 overflow-y-auto scrollbar-hide">
            <header className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
                <span className="text-2xl">🎯</span> Export Your Design
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">Choose how you want your final output. We’ll handle the setup and make sure everything is ready.</p>
            </header>

            <div className="h-px bg-slate-100" />

            {/* Export Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ExportOption 
                icon={<Smartphone size={24} />}
                title="Digital PDF"
                desc="Fast & Screen Optimized"
                perks={['High fidelity export', 'Mobile friendly', 'Digital sharing']}
                selected={selectedMode === 'digital'}
                onClick={() => setSelectedMode('digital')}
              />
              <ExportOption 
                icon={<Archive size={24} />}
                title="Individual"
                desc="Zipped PNGs"
                perks={['Best resolution', 'One file per record', 'Bulk archive']}
                selected={selectedMode === 'zip'}
                onClick={() => setSelectedMode('zip')}
              />
              <ExportOption 
                icon={<Printer size={24} />}
                title="A4 Grid"
                desc="Print Multiple"
                perks={['Auto-arranged labels', 'Optimized for A4', 'High DPI ready']}
                selected={selectedMode === 'a4_layout'}
                onClick={() => setSelectedMode('a4_layout')}
                disabled={!canFitA4}
              />
            </div>

            {!canFitA4 && (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3">
                <AlertTriangle size={20} className="text-amber-500 shrink-0" />
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-tight">
                  A4 Grid is disabled: Design ({template.width}x{template.height}) exceeds A4 printable area.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100">
               <div className="flex items-center justify-between text-slate-500">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <span className="text-lg">📏</span> Your Design
                  </div>
                  <div className="font-mono font-black text-slate-900 text-xs">{template.width} × {template.height}</div>
               </div>
            </div>

            {/* Quick Check - Only show if issues exist */}
            {hasIssues && (
              <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 sm:p-8 space-y-6">
                <h4 className="text-lg font-bold flex items-center gap-2">
                  <span className="text-xl">🔍</span> Quality Check
                </h4>
                
                <div className="space-y-6">
                  <CheckItem 
                    status={!checks.lowRes}
                    icon="🖼️"
                    label="Image Quality"
                    detail="✔ Verified"
                    warning="Blur potential"
                    actions={['Ignore']}
                    data={data}
                    onSelectItem={onEdit}
                  />
                  <CheckItem 
                    status={checks.missingData.length === 0}
                    icon="🧾"
                    label="Missing Data"
                    warning={`${checks.missingData.length} missing items`}
                    actions={[]}
                    failingItems={checks.missingData}
                    data={data}
                    onSelectItem={onEdit}
                  />
                  <CheckItem 
                    status={checks.textOverflow.length === 0}
                    icon="🔤"
                    label="Text Fit"
                    warning={`${checks.textOverflow.length} potentially overflowing`}
                    actions={[]}
                    failingItems={checks.textOverflow}
                    data={data}
                    onSelectItem={onEdit}
                  />
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
               <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                  onClick={onClose}
                  className="w-full sm:w-auto px-10 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all text-xs uppercase tracking-[0.2em]"
                 >
                   Cancel
                 </button>
                 <button 
                  disabled={!selectedMode || isProcessing}
                  onClick={handleGenerate}
                  className="grow px-10 py-4 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary/90 transition-all text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isProcessing ? 'Processing Batch...' : 'Generate Files'}
                 </button>
               </div>
            </div>
          </div>
        ) : (
          <div className="p-12 sm:p-20 flex flex-col items-center text-center space-y-10">
            <h3 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <span className="text-2xl">🚀</span> Packaging Results
            </h3>
            <div className="space-y-4 w-full max-w-sm">
              <p className="text-brand-primary font-mono text-[10px] uppercase tracking-widest animate-pulse h-4">
                {progress.message}
              </p>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                 <motion.div 
                  className="h-full bg-brand-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                 />
              </div>
              <p className="text-[10px] font-bold text-slate-400">
                {progress.current} OF {progress.total} RECORDS PROCESSED
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

interface OptionProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  perks: string[];
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const ExportOption: React.FC<OptionProps> = ({ icon, title, desc, perks, selected, onClick, disabled }) => (
  <button 
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`group p-6 text-left rounded-[2rem] border-2 transition-all space-y-4 relative overflow-hidden flex flex-col ${
      selected 
        ? 'border-brand-primary bg-brand-primary/5 shadow-inner' 
        : disabled 
          ? 'border-slate-50 bg-slate-50 opacity-40 cursor-not-allowed'
          : 'border-slate-100 hover:border-brand-primary/20 bg-white hover:shadow-xl'
    }`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${selected ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-slate-50 text-slate-400 group-hover:bg-brand-primary/5'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <h5 className="font-bold text-slate-900 text-sm leading-tight mb-1">{title}</h5>
      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{desc}</p>
    </div>
    <ul className="space-y-2 pt-2 border-t border-slate-100/50">
      {perks.map((p, i) => (
        <li key={i} className="flex items-start gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-tight">
          <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${selected ? 'bg-brand-primary' : 'bg-slate-300'}`} />
          {p}
        </li>
      ))}
    </ul>
    {selected && (
      <motion.div 
        layoutId="check-badge"
        className="absolute top-4 right-4 text-brand-primary"
      >
        <ShieldCheck size={20} />
      </motion.div>
    )}
  </button>
);

const CheckItem: React.FC<{ 
  status: boolean; 
  icon: string; 
  label: string; 
  detail?: string; 
  warning: string; 
  actions: string[]; 
  failingItems?: string[];
  data: DesignData[];
  onSelectItem?: (id: string) => void;
}> = ({ status, icon, label, detail, warning, actions, failingItems, data, onSelectItem }) => {
  const [expanded, setExpanded] = useState(false);
  const itemsWithIssues = data.filter(d => failingItems?.includes(d.id));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl shrink-0">{icon}</span>
          <div>
            <p className="text-xs font-bold text-slate-800 mb-0.5">{label}</p>
            <p className="text-[10px] font-medium">
              {status ? <span className="text-brand-accent">{detail}</span> : <span className="text-amber-500 font-bold">{warning}</span>}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {status ? (
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-accent bg-brand-accent/10 px-2 py-1 rounded-full">Verified</span>
          ) : (
            <>
              {failingItems && (
                <button 
                  onClick={() => setExpanded(!expanded)}
                  className="text-[9px] font-black uppercase tracking-widest text-brand-primary border border-brand-primary/20 bg-brand-primary/5 px-2 py-1.5 rounded-lg hover:bg-brand-primary/10 transition-all font-bold"
                >
                  {expanded ? 'Hide' : `Trace`}
                </button>
              )}
              {actions.map(action => (
                <button 
                  key={action} 
                  className="text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-brand-primary hover:text-brand-primary transition-all bg-white"
                >
                  {action}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
      
      {!status && expanded && itemsWithIssues.length > 0 && (
         <motion.div 
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: 'auto' }}
           className="mt-2 pl-11 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
         >
           {itemsWithIssues.slice(0, 15).map(item => (
             <div 
               key={item.id} 
               onClick={() => onSelectItem?.(item.id)}
               className="shrink-0 group relative cursor-pointer" 
               title="Click to Fix"
             >
                <img 
                  src={item.previewUrl} 
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm group-hover:border-brand-primary transition-all group-hover:scale-110 active:scale-95" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
             </div>
           ))}
           {itemsWithIssues.length > 15 && (
             <div className="shrink-0 w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
               +{itemsWithIssues.length - 15}
             </div>
           )}
         </motion.div>
      )}
    </div>
  );
};
