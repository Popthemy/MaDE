import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Template } from '../types';
import { LandingHero } from './landing/LandingHero';
import { SampleGrid } from './landing/SampleGrid';
import { IntentForm } from './landing/IntentForm';
import { ContactSection } from './landing/ContactSection';
import { BrandButton } from './shared/Atomic';

interface Props {
  onStart: (template: Template, initialData?: any, view?: 'editor' | 'preview') => void;
  onExploreTemplates: () => void;
}

export default function LandingPage({ onStart, onExploreTemplates }: Props) {
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Personal');

  const ROLES = ['Church / Fellowship', 'School / Students', 'Team / Organization', 'Personal'];

  const handleStartFlow = (template: Template, initialData: any[]) => {
    onStart(template, initialData, 'editor');
  };

  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-brand-primary/10 selection:text-brand-primary overflow-x-hidden">
      <LandingHero 
        onExploreTemplates={onExploreTemplates} 
        onCustomRequest={() => document.getElementById('intent-form')?.scrollIntoView({ behavior: 'smooth' })} 
      />

      <section id="samples" className="py-24 px-8 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-6xl mx-auto space-y-20">
          <SampleGrid onStart={handleStartFlow} onExploreTemplates={onExploreTemplates} />
          <IntentForm onStart={(t, d) => onStart(t, d, 'preview')} />
        </div>
      </section>

      {/* Enterprise/Beta Section */}
      <section className="py-32 px-8 border-t border-slate-100 bg-slate-50">
        <div className="max-w-2xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Enterprise Scaling</h2>
            <p className="text-xl text-slate-500">Secure your position for advanced cloud exports and API integrations.</p>
          </div>

          <div className="p-10 bg-white rounded-[3rem] border border-slate-200 space-y-8 shadow-xl">
            {!showLeadCapture ? (
              <BrandButton size="lg" className="w-full" onClick={() => setShowLeadCapture(true)}>
                Join Private Beta
              </BrandButton>
            ) : (
              <form className="space-y-6 text-left">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">Contact Channel</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        placeholder="your@organization.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">Vertical / Industry</label>
                    <div className="grid grid-cols-2 gap-3">
                      {ROLES.map(role => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setSelectedRole(role)}
                          className={`px-4 py-3 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-center gap-2 ${
                            selectedRole === role ? 'bg-brand-primary border-brand-primary text-white' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {selectedRole === role && <CheckCircle2 size={12} />}
                          {role.split(' / ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <BrandButton disabled className="w-full">
                  Join Waiting List
                </BrandButton>
                <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">Privacy First. GDPR/NDPR Ready.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
