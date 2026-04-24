import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Template } from '../../types';
import { SAMPLE_TEMPLATES } from '../../constants';

interface IntentFormProps {
  onStart: (template: Template, initialData: any[]) => void;
}

const ROLES = ['Church / Fellowship', 'School / Students', 'Team / Organization', 'Personal'];

export const IntentForm: React.FC<IntentFormProps> = ({ onStart }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'birthday',
    role: 'Personal',
    intent: '',
    volume: '10'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const type = formData.type as keyof typeof SAMPLE_TEMPLATES;
    const template = SAMPLE_TEMPLATES[type] as Template;
    
    const vol = parseInt(formData.volume) || 1;
    const initialData = Array.from({ length: Math.min(vol, 5) }).map((_, i) => ({
      id: `user-${i}`,
      values: {
        name: i === 0 ? (formData.name || 'Your Name') : `Sample Name ${i + 1}`,
        photo: `https://picsum.photos/seed/user${i}/800/800`,
        course: formData.intent || 'Achievement Unlocked',
      }
    }));

    onStart(template, initialData);
  };

  return (
    <div id="intent-form" className="max-w-2xl mx-auto pt-10">
      <div className="p-10 bg-white border border-slate-200 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-secondary" />
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <h4 className="text-2xl font-bold text-slate-900">Personalize your output</h4>
            <p className="text-sm text-slate-400 font-medium">Configure your target volume and design intent.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">User Profile</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ROLES.map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({...formData, role})}
                    className={`px-3 py-3 rounded-xl border text-[10px] font-bold transition-all ${
                      formData.role === role ? 'bg-brand-primary border-brand-primary text-white scale-105 shadow-lg shadow-brand-primary/20' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {role.split(' / ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">Sample Name</label>
              <input 
                type="text" 
                placeholder="e.g. Ama Mensah"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">Volume Intent (Batch)</label>
              <input 
                type="number" 
                placeholder="e.g. 50"
                value={formData.volume}
                onChange={e => setFormData({...formData, volume: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">Visual Context</label>
              <input 
                type="text" 
                placeholder="e.g. Monthly Fellowship, Graduation Award, New Hire Welcome"
                value={formData.intent}
                onChange={e => setFormData({...formData, intent: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">Design Blueprint</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner appearance-none cursor-pointer"
              >
                <option value="birthday">Birthday Celebration Post</option>
                <option value="certificate">Hall of Fame Certificate</option>
                <option value="member">New Member / Team Card</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20 group"
          >
            Generate Batch Preview 
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};
