import React, { useState, useEffect } from 'react';
import { Placeholder, Template, DesignData } from '../types';
import { DesignerToolbar } from './designer/DesignerToolbar';
import { CanvasArea } from './designer/CanvasArea';
import { useHistory } from '../hooks/useHistory';
import { Undo2, Redo2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  template: Template;
  onChange: (template: Template) => void;
  dataSample?: DesignData;
}

export default function TemplateDesigner({ template, onChange, dataSample }: Props) {
  const { 
    state: currentTemplate, 
    set: setHistory, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useHistory(template);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Sync with prop when template ID changes (e.g. new template from gallery)
  useEffect(() => {
    if (template.id !== currentTemplate.id) {
       setHistory(template);
    }
  }, [template.id]);

  // Sync back to parent
  useEffect(() => {
    if (currentTemplate !== template) {
      onChange(currentTemplate);
    }
  }, [currentTemplate]);

  const addPlaceholder = (type: 'text' | 'image', isFrame = false) => {
    const newId = `p-${Date.now()}`;
    const count = currentTemplate.placeholders.filter(p => p.type === type).length;
    const keyBase = isFrame ? 'frame' : (type === 'text' ? 'field' : 'photo');
    
    // Scale baseline defaults (optimized for 1080p) to the current template resolution
    const resolutionScale = Math.max(0.5, (currentTemplate.width + currentTemplate.height) / 2160);
    
    const newPlaceholder: Placeholder = {
      id: newId,
      type,
      key: `${keyBase}_${count + 1}`,
      label: `${isFrame ? 'Frame' : type === 'text' ? 'Text Field' : 'Image Field'} ${count + 1}`,
      x: Math.round(100 * resolutionScale),
      y: Math.round(100 * resolutionScale),
      width: Math.round((type === 'text' ? 400 : 200) * resolutionScale),
      height: Math.round((type === 'text' ? 80 : 200) * resolutionScale),
      isFrame,
      ...(type === 'text' ? { 
        fontSize: Math.round(32 * resolutionScale), 
        fill: '#FFFFFF', 
        fontFamily: 'Inter', 
        align: 'left',
        wrap: 'none'
      } : {}),
    };
    setHistory({
      ...currentTemplate,
      placeholders: [...currentTemplate.placeholders, newPlaceholder],
    });
    setSelectedId(newId);
  };

  const updatePlaceholder = (id: string, attr: Partial<Placeholder>) => {
    setHistory({
      ...currentTemplate,
      placeholders: currentTemplate.placeholders.map((p) => p.id === id ? { ...p, ...attr } : p),
    });
  };

  const updateTemplate = (attr: Partial<Template>) => {
    setHistory({ ...currentTemplate, ...attr });
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setHistory({
      ...currentTemplate,
      placeholders: currentTemplate.placeholders.filter((p) => p.id !== selectedId),
    });
    setSelectedId(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      }

      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName);
      if (isInput) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        removeSelected();
      }

      // Quick type-to-rename: if user starts typing while an item is selected
      if (selectedId && /^[a-zA-Z0-9\s]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const input = document.querySelector('input[placeholder="The text shown in designer..."]') as HTMLInputElement;
        if (input) {
          input.focus();
          const p = currentTemplate.placeholders.find(pl => pl.id === selectedId);
          if (p) {
            updatePlaceholder(selectedId, { 
              label: e.key,
              key: e.key.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
            });
          }
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, currentTemplate, undo, redo]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto p-6 text-slate-900 animate-in fade-in duration-700 relative">
      <div className="absolute top-10 left-[400px] z-50 flex items-center gap-2 p-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={undo}
          disabled={!canUndo}
          className={`p-2.5 rounded-xl transition-all ${canUndo ? 'text-slate-900 hover:bg-slate-50' : 'text-slate-300'}`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
        </motion.button>
        <div className="h-4 w-px bg-slate-100 mx-0.5" />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={redo}
          disabled={!canRedo}
          className={`p-2.5 rounded-xl transition-all ${canRedo ? 'text-slate-900 hover:bg-slate-50' : 'text-slate-300'}`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={18} />
        </motion.button>
      </div>

      <DesignerToolbar 
        template={currentTemplate} 
        selectedId={selectedId}
        addPlaceholder={addPlaceholder}
        updateTemplate={updateTemplate}
        updatePlaceholder={updatePlaceholder}
        removeSelected={removeSelected}
      />
      <CanvasArea 
        template={currentTemplate} 
        selectedId={selectedId} 
        setSelectedId={setSelectedId}
        updatePlaceholder={updatePlaceholder}
        dataSample={dataSample}
      />
    </div>
  );
}
