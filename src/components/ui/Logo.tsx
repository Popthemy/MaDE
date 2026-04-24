import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  className?: string;
  onClick?: () => void;
}

export default function Logo({ className = '', onClick }: Props) {
  return (
    <div 
      className={`flex items-center gap-3 cursor-pointer select-none group ${className}`} 
      onClick={onClick}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-brand-primary/20 blur-lg rounded-full group-hover:bg-brand-primary/40 transition-colors" />
        <div className="relative w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 transform group-hover:rotate-6 transition-all duration-300">
          <Sparkles className="text-white" size={24} />
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-primary transition-colors">
          Mass<span className="text-brand-primary font-black tracking-tighter">Design</span>
        </h1>
        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium leading-none">
          Automate Impact
        </p>
      </div>
    </div>
  );
}
