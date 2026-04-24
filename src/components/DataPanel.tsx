import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { DesignData, InputMode, Template } from '../types';
import { Upload, FileSpreadsheet, Keyboard, Trash2, Plus, Play, Image as ImageIcon, Copy, Check } from 'lucide-react';

interface Props {
  template: Template;
  data: DesignData[];
  onDataChange: (data: DesignData[]) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function DataPanel({ template, data, onDataChange, onGenerate, isGenerating }: Props) {
  const [mode, setMode] = useState<InputMode>('manual');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCsvResults = (results: any) => {
    const newData: DesignData[] = results.data.map((row: any, i: number) => {
      const mappedValues: Record<string, any> = {};
      // Map labels back to keys if they match
      Object.keys(row).forEach(csvHeader => {
        const placeholder = template.placeholders.find(p => 
          p.label === csvHeader || p.key === csvHeader
        );
        const key = placeholder ? placeholder.key : csvHeader;
        mappedValues[key] = row[csvHeader];
      });

      return {
        id: `csv-${Date.now()}-${i}`,
        values: mappedValues,
      };
    });
    onDataChange(newData);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: processCsvResults
      });
    }
  };

  const handleCsvPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value) {
      Papa.parse(value, {
        header: true,
        skipEmptyLines: true,
        complete: processCsvResults
      });
    }
  };

  const addManualRow = () => {
    onDataChange([
      ...data,
      { id: `manual-${Date.now()}`, values: {} }
    ]);
  };

  const updateRow = (id: string, key: string, value: string) => {
    onDataChange(data.map(row => 
      row.id === id ? { ...row, values: { ...row.values, [key]: value } } : row
    ));
  };

  const removeRow = (id: string) => {
    onDataChange(data.filter(row => row.id !== id));
  };

  const isRowMissingFields = (row: DesignData) => {
    return template.placeholders.some(p => {
      if (p.isFrame) return false;
      const val = row.values[p.key];
      const hasVal = val !== undefined && val !== null && String(val).trim() !== '';
      const isOptional = p.type === 'image' && !!p.staticUrl;
      return !hasVal && !isOptional;
    });
  };

  // Get labels from template placeholders for the CSV guide
  const templateLabels = Array.from(new Set(
    template.placeholders
      .filter(p => !p.staticUrl || p.isFrame)
      .map(p => p.label)
  ));

  const templateKeys = Array.from(new Set(
    template.placeholders
      .filter(p => !p.staticUrl || p.isFrame)
      .map(p => p.key)
  ));
  
  const dataKeys = Array.from(new Set(data.flatMap(row => Object.keys(row.values))));
  
  // Unique union of keys, preserving template order first
  const allKeys = Array.from(new Set([...templateKeys, ...dataKeys]));

  const isImageKey = (key: string) => {
    return template.placeholders.some(p => p.key === key && p.type === 'image');
  };

  const copyCsvTemplate = () => {
    const csvHeaders = templateLabels.join(',');
    navigator.clipboard.writeText(csvHeaders);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 flex flex-col gap-8 text-slate-900">
      {/* Modes Toggle */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div className="flex gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200">
          <button 
            onClick={() => setMode('csv')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all text-sm font-bold uppercase tracking-widest ${mode === 'csv' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'hover:bg-white text-slate-400'}`}
          >
            <FileSpreadsheet size={18} /> CSV Upload
          </button>
          <button 
            onClick={() => setMode('manual')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all text-sm font-bold uppercase tracking-widest ${mode === 'manual' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'hover:bg-white text-slate-400'}`}
          >
            <Keyboard size={18} /> Manual Input
          </button>
        </div>

        <button 
          onClick={onGenerate}
          disabled={isGenerating || data.length === 0}
          className="flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-xl shadow-brand-primary/20"
        >
          {isGenerating ? 'Processing...' : (
            <>
              <Play size={20} className="fill-current" />
              Generate {data.length} Designs
            </>
          )}
        </button>
      </div>

      {mode === 'csv' ? (
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row gap-12 items-stretch">
            <div className="flex-1 flex flex-col gap-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-2 hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all cursor-pointer group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".csv" 
                  onChange={handleCsvUpload} 
                />
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-brand-primary/10 transition-all text-slate-400 group-hover:text-brand-primary">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800 text-sm">Upload CSV File</p>
                  <p className="text-xs text-slate-400">headers must match blueprint labels</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="bg-white px-3 text-slate-300">Or Paste Raw Data</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <textarea 
                  onChange={handleCsvPaste}
                  placeholder="Paste your CSV data here...&#10;Label 1, Label 2&#10;Value A, Value B"
                  className="w-full h-32 bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-xs font-mono focus:bg-white focus:ring-1 focus:ring-brand-primary/20 outline-none transition-all resize-none shadow-inner"
                />
              </div>
            </div>

            <div className="w-full md:w-80 space-y-6 flex flex-col">
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">CSV Guide & Mapping</h4>
                <p className="text-xs text-slate-500 leading-relaxed italic">Your file headers or pasted data must exactly match the blueprint labels below.</p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner grow">
                 <p className="text-[10px] text-slate-400 mb-3 uppercase tracking-[0.2em] font-bold">Required Labels</p>
                 <div className="bg-white p-4 rounded-xl border border-slate-100 font-mono text-[11px] break-all mb-4 text-brand-primary font-bold shadow-sm">
                    {templateLabels.length > 0 ? templateLabels.join(', ') : 'No placeholders defined'}
                 </div>
                 <button 
                  onClick={copyCsvTemplate}
                  className="w-full py-2.5 bg-white hover:bg-brand-primary/5 border border-slate-100 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all text-slate-600 hover:text-brand-primary shadow-sm"
                 >
                    {copied ? <Check size={14} className="text-brand-accent" /> : <Copy size={14} />}
                    {copied ? 'Headers Copied' : 'Copy Blueprint Labels'}
                 </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 h-[600px]">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-auto relative flex-1">
             <table className="w-full text-left border-separate border-spacing-0">
                <thead className="sticky top-0 z-30">
                   <tr className="bg-slate-50/95 backdrop-blur-sm">
                      <th className="sticky top-0 z-40 p-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 w-16 bg-slate-50/95 backdrop-blur-sm">#</th>
                      {allKeys.map(key => {
                        const isMainKey = templateKeys.includes(key);
                        const placeholder = template.placeholders.find(p => p.key === key);
                        const displayLabel = placeholder?.label || key;
                        
                        return (
                          <th key={key} className="sticky top-0 z-40 p-6 text-slate-400 border-b border-slate-100 whitespace-nowrap min-w-[200px] bg-slate-50/95 backdrop-blur-sm">
                             <div className="flex flex-col gap-1.5 items-start">
                                <div className="flex items-center gap-2">
                                   {isImageKey(key) && <ImageIcon size={14} className="text-brand-secondary" />}
                                   <span className="text-brand-primary font-bold tracking-tight text-xs bg-brand-primary/5 px-2.5 py-1 rounded-md border border-brand-primary/10 uppercase">
                                      {displayLabel}
                                   </span>
                                   {isMainKey && <span className="text-[9px] px-2 py-0.5 bg-brand-primary text-white rounded-md font-bold uppercase tracking-tighter">Required</span>}
                                </div>
                                <span className="text-[9px] text-slate-300 italic font-sans lowercase">Bound: {`{${key}}`}</span>
                             </div>
                          </th>
                        );
                      })}
                      <th className="p-6 border-b border-slate-100 w-16"></th>
                   </tr>
                </thead>
                 <tbody className="divide-y divide-slate-100">
                   {data.map((row, index) => {
                      const isMissing = isRowMissingFields(row);
                      return (
                        <tr key={row.id} className={`hover:bg-brand-primary/[0.02] transition-colors group ${isMissing ? 'bg-red-50/30' : ''}`}>
                           <td className="p-6 text-xs text-slate-300 font-mono italic">
                              <div className="flex items-center gap-2">
                                 {index + 1}
                                 {isMissing && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" title="Missing required fields" />}
                              </div>
                           </td>
                           {allKeys.map(key => {
                              const placeholder = template.placeholders.find(p => p.key === key);
                              const isRequired = !!placeholder && (!placeholder.staticUrl || placeholder.isFrame);
                              const val = row.values[key];
                              const isEmpty = isRequired && (val === undefined || val === null || String(val).trim() === '');
                              
                              return (
                                <td key={key} className="p-2 border-slate-100">
                                   <div className="grow px-4">
                                      {isImageKey(key) ? (
                                         <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl bg-slate-50 border flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner transition-all ${isEmpty ? 'border-red-200 ring-2 ring-red-50' : 'border-slate-100'}`}>
                                               {row.values[key] ? (
                                                  <img src={row.values[key]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                               ) : template.placeholders.find(p => p.key === key)?.staticUrl ? (
                                                  <img 
                                                     src={template.placeholders.find(p => p.key === key)?.staticUrl} 
                                                     className="w-full h-full object-cover opacity-10" 
                                                     referrerPolicy="no-referrer" 
                                                  />
                                               ) : (
                                                  <ImageIcon size={16} className={isEmpty ? "text-red-300" : "text-slate-300"} />
                                               )}
                                            </div>
                                            <input 
                                               value={row.values[key] || ''}
                                               onChange={(e) => updateRow(row.id, key, e.target.value)}
                                               placeholder={template.placeholders.find(p => p.key === key)?.staticUrl ? "Using Template Default..." : "Image URL..."}
                                               className={`grow bg-slate-50/50 border rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 transition-all outline-none font-medium text-slate-600 ${isEmpty ? 'border-red-100 focus:ring-red-200' : 'border-transparent focus:ring-brand-primary/20'}`}
                                            />
                                            <label className={`shrink-0 p-2 hover:bg-brand-primary/10 rounded-xl cursor-pointer transition-all ${isEmpty ? 'text-red-400' : 'text-brand-primary'}`}>
                                               <Upload size={16} />
                                               <input 
                                                  type="file" 
                                                   className="hidden" 
                                                  accept="image/*" 
                                                  onChange={(e) => {
                                                     const file = e.target.files?.[0];
                                                     if (file) {
                                                        const url = URL.createObjectURL(file);
                                                        updateRow(row.id, key, url);
                                                     }
                                                  }}
                                               />
                                            </label>
                                         </div>
                                      ) : (
                                         <input 
                                            value={row.values[key] || ''}
                                            onChange={(e) => updateRow(row.id, key, e.target.value)}
                                            placeholder={`Enter ${template.placeholders.find(p => p.key === key)?.label || key}...`}
                                            className={`w-full bg-slate-50/50 border rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 transition-all outline-none font-medium text-slate-600 ${isEmpty ? 'border-red-100 focus:ring-red-200 bg-red-50/50' : 'border-transparent focus:ring-brand-primary/20'}`}
                                         />
                                      )}
                                   </div>
                                </td>
                              );
                           })}
                           <td className="p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                 onClick={() => removeRow(row.id)}
                                 className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              >
                                 <Trash2 size={18} />
                              </button>
                           </td>
                        </tr>
                      );
                   })}
                   {data.length === 0 && (
                      <tr>
                        <td colSpan={allKeys.length + 3} className="p-16 text-center text-slate-400 italic bg-slate-50/30">
                           No data entries found in current blueprint session.
                        </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
          <button 
             onClick={addManualRow}
             className="flex items-center justify-center gap-3 w-full py-5 bg-white hover:bg-brand-primary/5 border-2 border-dashed border-slate-200 rounded-3xl transition-all text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-brand-primary shadow-sm hover:border-brand-primary/30"
          >
             <Plus size={20} /> Provision New Identity Field
          </button>
        </div>
      )}
    </div>
  );
}
