import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowLeft, Layout, Users, FileText } from 'lucide-react';
import Logo from '../ui/Logo';

export type ViewType = 'landing' | 'templates' | 'editor' | 'preview' | 'manual';

interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  icon?: React.ReactNode;
}

interface Props {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  hasData?: boolean;
}

export default function GlobalNavbar({ currentView, onNavigate, hasData }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isEditorView = currentView === 'editor' || currentView === 'preview';
  
  const navItems: NavItem[] = [
    { 
      label: 'Samples', 
      onClick: () => {
        if (currentView !== 'landing') onNavigate('landing');
        setTimeout(() => document.getElementById('samples')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    },
    { 
      label: 'Manual', 
      active: currentView === 'manual',
      onClick: () => onNavigate('manual') 
    },
    { 
      label: 'Contact', 
      onClick: () => {
        if (currentView !== 'landing') onNavigate('landing');
        setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  ];

  return (
    <nav className="h-20 border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
      <div className="flex items-center gap-8">
        <Logo onClick={() => onNavigate('landing')} />
        
        {/* Desktop Internal Switcher (only for editor/preview) */}
        {isEditorView && (
          <div className="hidden md:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button 
              onClick={() => onNavigate('editor')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'editor' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layout size={14} /> <span>Design Editor</span>
            </button>
            <button 
              onClick={() => onNavigate('preview')}
              disabled={!hasData}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'preview' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-900 disabled:opacity-30'
              }`}
            >
              <Users size={14} /> <span>Bulk Preview</span>
            </button>
          </div>
        )}
      </div>

      {/* Desktop Main Navigation */}
      {!isEditorView && (
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`text-sm font-bold transition-colors ${
                item.active ? 'text-brand-primary' : 'text-slate-500 hover:text-brand-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => onNavigate('templates')}
            className={`px-6 py-3 rounded-full text-xs font-bold transition-all uppercase tracking-widest ${
              currentView === 'templates' 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600'
            }`}
          >
            Explore Templates
          </button>
        </div>
      )}

      {/* Mobile Toggle */}
      <button 
        className="md:hidden p-2 text-slate-600 hover:text-brand-primary transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-8 md:hidden flex flex-col gap-6"
          >
            {isEditorView && (
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                <button 
                  onClick={() => { setIsMenuOpen(false); onNavigate('editor'); }}
                  className={`flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-bold transition-all ${
                    currentView === 'editor' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400'
                  }`}
                >
                  <Layout size={14} /> Editor
                </button>
                <button 
                  onClick={() => { setIsMenuOpen(false); onNavigate('preview'); }}
                  disabled={!hasData}
                  className={`flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-bold transition-all ${
                    currentView === 'preview' ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 disabled:opacity-30'
                  }`}
                >
                  <Users size={14} /> Preview
                </button>
              </div>
            )}

            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { setIsMenuOpen(false); item.onClick?.(); }}
                className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4 text-left"
              >
                {item.label}
              </button>
            ))}
            
            <button 
              onClick={() => { setIsMenuOpen(false); onNavigate('templates'); }}
              className={`w-full py-5 rounded-2xl font-bold font-mono uppercase tracking-widest text-xs transition-all ${
                currentView === 'templates' 
                  ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20' 
                  : 'bg-slate-50 text-slate-600 border border-slate-200'
              }`}
            >
              Templates Library
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
