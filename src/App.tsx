import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TemplateDesigner from './components/TemplateDesigner';
import DataPanel from './components/DataPanel';
import BulkPreview from './components/BulkPreview';
import ItemEditor from './components/ItemEditor';
import LandingPage from './components/LandingPage';
import TemplateGallery from './components/TemplateGallery';
import ManualPage from './components/ManualPage';
import Logo from './components/ui/Logo';
import GlobalNavbar, { ViewType } from './components/layout/GlobalNavbar';
import { useMassDesign } from './hooks/useMassDesign';
import { Sparkles, Share2, Download, Upload } from 'lucide-react';

export default function App() {
  const {
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
  } = useMassDesign();

  const editingItem = data.find(i => i.id === editingId);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-primary selection:text-white bg-brand-background text-slate-900">
      <GlobalNavbar 
        currentView={view} 
        onNavigate={(v) => setView(v as ViewType)}
        hasData={data.length > 0}
      />

      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {view === 'landing' && (
              <LandingPage 
                onStart={handleTemplateSelection} 
                onExploreTemplates={() => setView('templates')} 
              />
            )}
            
            {view === 'manual' && <ManualPage />}
            
            {view === 'templates' && (
              <TemplateGallery 
                onSelect={handleTemplateSelection}
                onBack={() => setView('landing')}
                onStartScratch={handleStartScratch}
              />
            )}
            
            {(view === 'editor' || view === 'preview') && (
              <div className="flex-1 bg-white">
                <div className="absolute top-4 left-4 z-40 px-4 py-2 bg-white/80 hover:bg-white border border-slate-200 rounded-full transition-all backdrop-blur-md shadow-sm">
                  <button 
                    onClick={() => setView('templates')}
                    className="text-xs font-bold flex items-center gap-2 text-slate-600"
                  >
                    ← Blueprints
                  </button>
                </div>
                
                {view === 'editor' ? (
                  <div className="flex flex-col">
                    <header className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center text-center">
                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-mono text-slate-500 mb-6 uppercase tracking-widest">
                          <Sparkles size={14} className="text-brand-primary" /> Professional Stationery Automation
                       </div>
                       <h2 className="text-4xl md:text-6xl font-bold max-w-3xl mb-6 leading-tight text-slate-900">
                          Design Once. Generate <span className="text-brand-primary italic">Thousands.</span>
                       </h2>
                       <p className="text-slate-500 max-w-xl text-sm md:text-lg mb-10">
                          The institution-grade design tool for high-volume graphic generation. Clean, private, and fully offline-capable.
                       </p>
                    </header>

                    <section className="mb-20">
                       <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-mono text-sm text-slate-400">01</div>
                            <h2 className="text-2xl font-bold">Blueprint Architect</h2>
                          </div>
                          <div className="flex items-center gap-3">
                            {showCopied && (
                              <motion.span 
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[10px] font-mono text-brand-accent font-bold uppercase tracking-widest"
                              >
                                ✓ Link Copied
                              </motion.span>
                            )}
                            <div className="flex bg-slate-50 border border-slate-200 p-1.5 rounded-2xl gap-2">
                               <button onClick={handleShare} disabled={isSharing} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 disabled:opacity-50 text-slate-600 rounded-xl text-xs font-bold transition-all">
                                 {isSharing ? <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" /> : <Share2 size={14} />}
                                 Share Link
                               </button>
                               <button onClick={() => {
                                 const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
                                 const url = URL.createObjectURL(blob);
                                 const a = document.createElement('a');
                                 a.href = url;
                                 a.download = `${template.name.replace(/\s+/g, '_').toLowerCase()}_blueprint.json`;
                                 a.click();
                               }} className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl text-xs font-bold shadow-lg transition-all">
                                 <Download size={14} /> Export
                               </button>
                               <label className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 text-slate-400 cursor-pointer rounded-xl text-xs font-bold transition-all">
                                 <Upload size={14} /> Import
                                 <input type="file" accept=".json" className="hidden" onChange={(e) => {
                                   const file = e.target.files?.[0];
                                   if (file) {
                                     const reader = new FileReader();
                                     reader.onload = (re) => {
                                       try {
                                         const imported = JSON.parse(re.target?.result as string);
                                         if (imported.placeholders) setTemplate(imported);
                                       } catch (err) { alert('Invalid Blueprint'); }
                                     };
                                     reader.readAsText(file);
                                   }
                                 }} />
                               </label>
                            </div>
                          </div>
                       </div>
                       <TemplateDesigner template={template} onChange={setTemplate} />
                    </section>

                    <section id="data-input" className="mb-20">
                       <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center gap-4">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-mono text-sm text-slate-400">02</div>
                          <h3 className="text-2xl font-bold">Provision Bulk Data</h3>
                       </div>
                       <DataPanel template={template} data={data} onDataChange={setData} onGenerate={handleGenerate} isGenerating={isGenerating} />
                    </section>
                  </div>
                ) : (
                  <BulkPreview 
                     data={data} 
                     template={template}
                     onBack={() => setView('editor')} 
                     onEdit={setEditingId}
                  />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {editingItem && (
        <ItemEditor 
           item={editingItem} 
           template={template} 
           onClose={() => setEditingId(null)} 
           onUpdate={handleItemUpdate}
           onTemplateUpdate={handleTemplateUpdate}
        />
      )}

      {(view === 'landing' || view === 'manual') && (
        <footer className="bg-slate-50 border-t border-slate-200 py-20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
              <div className="col-span-1 md:col-span-2 space-y-6">
                <Logo />
                <p className="text-sm text-slate-500 max-w-sm font-medium">
                  Create at scale without the stress. High-velocity automation for teams and organizations focused on efficiency and impact.
                </p>
              </div>
              <div>
                <h5 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-black mb-6">Strategy</h5>
                <ul className="flex flex-col gap-4 text-sm text-slate-500 font-medium font-mono uppercase text-[10px] tracking-widest">
                  <li className="hover:text-brand-primary transition-colors cursor-pointer">Design Automation</li>
                  <li className="hover:text-brand-primary transition-colors cursor-pointer">Bulk Production</li>
                  <li className="hover:text-brand-primary transition-colors cursor-pointer">Data Integration</li>
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-black mb-6">Contact</h5>
                <ul className="flex flex-col gap-4 text-sm text-slate-500 font-medium font-mono uppercase text-[10px] tracking-widest">
                  <li>Lagos, Nigeria</li>
                  <li className="text-brand-primary">team@massdesign.io</li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.4em] font-bold">
                © 2026 MassDesign | Built for impact at scale
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}


