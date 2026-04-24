import React, { useState, useEffect } from 'react';
import { Placeholder, Template } from '../types';
import { DesignerToolbar } from './designer/DesignerToolbar';
import { CanvasArea } from './designer/CanvasArea';

interface Props {
  template: Template;
  onChange: (template: Template) => void;
}

export default function TemplateDesigner({ template, onChange }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addPlaceholder = (type: 'text' | 'image', isFrame = false) => {
    const newId = `p-${Date.now()}`;
    const count = template.placeholders.filter(p => p.type === type).length;
    const keyBase = isFrame ? 'frame' : (type === 'text' ? 'field' : 'photo');
    
    const newPlaceholder: Placeholder = {
      id: newId,
      type,
      key: `${keyBase}_${count + 1}`,
      label: `${isFrame ? 'Frame' : type === 'text' ? 'Text Field' : 'Image Field'} ${count + 1}`,
      x: 100,
      y: 100,
      width: 200,
      height: type === 'text' ? 50 : 200,
      isFrame,
      ...(type === 'text' ? { fontSize: 24, fill: '#FFFFFF', fontFamily: 'Inter', align: 'left' } : {}),
    };
    onChange({
      ...template,
      placeholders: [...template.placeholders, newPlaceholder],
    });
    setSelectedId(newId);
  };

  const updatePlaceholder = (id: string, attr: Partial<Placeholder>) => {
    onChange({
      ...template,
      placeholders: template.placeholders.map((p) => p.id === id ? { ...p, ...attr } : p),
    });
  };

  const updateTemplate = (attr: Partial<Template>) => {
    onChange({ ...template, ...attr });
  };

  const removeSelected = () => {
    if (!selectedId) return;
    onChange({
      ...template,
      placeholders: template.placeholders.filter((p) => p.id !== selectedId),
    });
    setSelectedId(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName);
      if (isInput) return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        removeSelected();
      }

      // Quick type-to-rename: if user starts typing while an item is selected
      if (selectedId && /^[a-zA-Z0-9\s]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const input = document.querySelector('input[placeholder="e.g. Student Name"]') as HTMLInputElement;
        if (input) {
          input.focus();
          // To ensure the first character is captured and overwrites the selection
          // we set the value manually if the input was focused via this shortcut
          const p = template.placeholders.find(pl => pl.id === selectedId);
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
  }, [selectedId, template]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto p-6 text-slate-900 animate-in fade-in duration-700">
      <DesignerToolbar 
        template={template} 
        selectedId={selectedId}
        addPlaceholder={addPlaceholder}
        updateTemplate={updateTemplate}
        updatePlaceholder={updatePlaceholder}
        removeSelected={removeSelected}
      />
      <CanvasArea 
        template={template} 
        selectedId={selectedId} 
        setSelectedId={setSelectedId}
        updatePlaceholder={updatePlaceholder}
      />
    </div>
  );
}
