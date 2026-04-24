import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight, 
  Eye, 
  Layers, 
  Clock, 
  Users, 
  PartyPopper, 
  GraduationCap, 
  Megaphone,
  Layout,
  MousePointer2,
  X
} from 'lucide-react';
import { SAMPLE_TEMPLATES } from '../constants';
import { Template } from '../types';
import { BrandButton } from './shared/Atomic';

interface Props {
  onSelect: (template: Template, initialData?: any) => void;
  onBack: () => void;
  onStartScratch: () => void;
}

const CATEGORIES = ['All', 'Celebrations', 'Certificates', 'Community', 'Announcements'];

export default function TemplateGallery({ onSelect, onBack, onStartScratch }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const templates = useMemo(() => Object.values(SAMPLE_TEMPLATES), []);
  
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, templates]);

  const handleUseTemplate = (template: Template) => {
    const initialData = [
      {
        id: 'sample-1',
        values: template.sampleData || {}
      }
    ];
    onSelect(template, initialData);
  };

  return (
    <div className="bg-brand-background text-slate-900 font-sans selection:bg-brand-primary selection:text-white">
      <main className="max-w-7xl mx-auto px-8 py-12 space-y-16">
        <div className="flex items-center justify-between">
           <button 
            onClick={onBack}
            className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2"
          >
            ← Back to Home
          </button>
          <BrandButton variant="outline" size="sm" onClick={onStartScratch} icon={Layout}>
            Start from scratch
          </BrandButton>
        </div>
        {/* Row 1: Intro Section */}
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 italic">
              Explore <span className="text-brand-primary underline decoration-brand-primary/30 decoration-4 underline-offset-8">Architected Designs</span>
            </h2>
            <p className="text-slate-500 leading-relaxed text-lg">
              Select a professional blueprint to begin your batch generation. Built for speed, impact, and high-volume consistency across your entire organization.
            </p>
          </motion.div>
        </div>


        {/* Row 2: Search & Controls Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-2 bg-slate-50 border border-slate-200 rounded-[2rem]">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search blueprints by name or intent..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-all font-medium"
            />
          </div>
          
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/50 rounded-2xl overflow-x-auto no-scrollbar w-full md:w-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-105' : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template) => (
              <motion.div
                layout
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group flex flex-col bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-brand-primary/40 hover:shadow-2xl hover:shadow-brand-primary/5 transition-all shadow-sm"
              >
                {/* Visual Preview Area */}
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 group-hover:brightness-105 transition-all">
                  <img 
                    src={template.thumbnail || template.backgroundUrl} 
                    alt={template.name}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                  
                  {/* Floating Tags */}
                  <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                    {template.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-brand-primary/90 backdrop-blur-md rounded-full text-[9px] font-bold text-white uppercase tracking-widest shadow-lg">
                        {tag}
                      </span>
                    ))}
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-bold text-white uppercase tracking-widest border border-white/30 font-medium">
                      {template.category}
                    </span>
                  </div>

                  {/* Quick Actions Hover */}
                  <div className="absolute inset-0 bg-brand-primary/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                    <button 
                      onClick={() => handleUseTemplate(template)}
                      className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                      Use this template
                    </button>
                    <button 
                      onClick={() => setPreviewTemplate(template)}
                      className="flex items-center gap-2 text-white hover:text-white text-xs font-bold uppercase tracking-widest transition-colors drop-shadow-md"
                    >
                      <Eye size={14} /> Preview data example
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900">{template.name}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed italic">
                        {template.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <Layers size={12} className="text-brand-primary" /> {template.placeholders.length} Fields
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <Users size={12} className="text-brand-secondary" /> Bulk-ready
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleUseTemplate(template)}
                    className="w-full py-4 mt-6 bg-slate-50 border border-slate-100 hover:border-brand-primary/30 hover:bg-brand-primary/5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 text-slate-400 hover:text-brand-primary"
                  >
                    Quick Edit Entry <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Start from scratch placeholder */}
          <button 
            onClick={onStartScratch}
            className="group flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] aspect-[4/3] md:aspect-auto p-12 hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all space-y-6 shadow-sm"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all text-slate-400">
              <Layout size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2 text-slate-900">Create from scratch</h3>
              <p className="text-xs text-slate-400 max-w-[200px] mx-auto uppercase tracking-widest font-bold">Absolute design freedom for specialists.</p>
            </div>
          </button>
        </div>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 sm:p-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewTemplate(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Preview Side */}
              <div className="flex-1 p-8 bg-slate-50">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-2xl border border-slate-200">
                  <img 
                    src={previewTemplate.thumbnail || previewTemplate.backgroundUrl} 
                    alt="Populated Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  
                  {/* Populated Data Overlays (Simplified representation) */}
                  <div className="absolute bottom-8 left-8 space-y-1">
                    <span className="px-2 py-1 bg-brand-primary text-white text-[10px] font-bold rounded uppercase tracking-widest shadow-lg">Prototype Output</span>
                    <h4 className="text-3xl font-bold text-white drop-shadow-md">{previewTemplate.sampleData?.name || 'John Doe'}</h4>
                  </div>
                </div>
              </div>

              {/* Info Side */}
              <div className="w-full md:w-[400px] p-12 space-y-10 flex flex-col justify-center bg-white">
                <div className="space-y-4">
                  <span className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                    Template Details
                  </span>
                  <h2 className="text-4xl font-bold tracking-tight text-slate-900">{previewTemplate.name}</h2>
                  <p className="text-slate-500 leading-relaxed italic">{previewTemplate.description}</p>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-bold">Includes {previewTemplate.placeholders.length} Configurable Fields</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.placeholders.map(p => (
                      <span key={p.id} className="px-3 py-2 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100 font-medium">
                        {p.key}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-8 space-y-4">
                  <button 
                    onClick={() => handleUseTemplate(previewTemplate)}
                    className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3"
                  >
                    Use this template <ArrowRight size={20} />
                  </button>
                  <button 
                    onClick={() => setPreviewTemplate(null)}
                    className="w-full py-4 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-widest"
                  >
                    Dismiss Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
