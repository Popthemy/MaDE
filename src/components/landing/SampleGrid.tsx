import React from 'react';
import { PartyPopper, GraduationCap, Users } from 'lucide-react';
import { SectionHeader } from '../shared/Atomic';
import { Template } from '../../types';
import { SAMPLE_TEMPLATES } from '../../constants';

interface SampleGridProps {
  onStart: (template: Template, initialData: any[]) => void;
  onExploreTemplates: () => void;
}

export const SampleGrid: React.FC<SampleGridProps> = ({ onStart, onExploreTemplates }) => {
  const handleSampleStart = (type: keyof typeof SAMPLE_TEMPLATES) => {
    const template = SAMPLE_TEMPLATES[type] as Template;
    const initialData = [
      {
        id: 'sample-1',
        values: {
          name: 'Sarah Adebayo',
          department: 'Engineering',
          photo: 'https://picsum.photos/seed/sarah/800/800',
          course: 'Full Stack Development',
        }
      }
    ];
    onStart(template, initialData);
  };

  return (
    <div className="space-y-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <SectionHeader 
          number="01" 
          title="Featured Blueprints" 
          subtitle="Professionally architected for mass impact" 
        />
        <button 
          onClick={onExploreTemplates}
          className="px-6 py-3 bg-white border border-slate-200 rounded-full text-xs font-bold hover:bg-slate-50 transition-all uppercase tracking-widest text-slate-600 shadow-sm"
        >
          Explore Template Library
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => handleSampleStart('birthday')}
          className="group relative p-8 bg-white border border-slate-200 hover:border-brand-primary/30 rounded-3xl text-left transition-all overflow-hidden shadow-sm hover:shadow-xl"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all text-brand-primary">
            <PartyPopper size={120} />
          </div>
          <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <PartyPopper className="text-brand-primary" size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Birthday Posts</h3>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">Perfect for communities, church fellowships, and office celebrations.</p>
        </button>

        <button 
          onClick={() => handleSampleStart('certificate')}
          className="group relative p-8 bg-white border border-slate-200 hover:border-brand-secondary/30 rounded-3xl text-left transition-all overflow-hidden shadow-sm hover:shadow-xl"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all text-brand-secondary">
            <GraduationCap size={120} />
          </div>
          <div className="w-12 h-12 bg-brand-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <GraduationCap className="text-brand-secondary" size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Certificates</h3>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">Generate professional awards and academic recognition with precision.</p>
        </button>

        <button 
          onClick={() => handleSampleStart('member')}
          className="group relative p-8 bg-white border border-slate-200 hover:border-brand-accent/30 rounded-3xl text-left transition-all overflow-hidden shadow-sm hover:shadow-xl"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all text-brand-accent">
            <Users size={120} />
          </div>
          <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users className="text-brand-accent" size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Team Welcome</h3>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">Instantly welcome new team members with consistent, branded graphics.</p>
        </button>
      </div>
    </div>
  );
};
