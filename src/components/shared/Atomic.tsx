import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
}

export const BrandButton: React.FC<BrandButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  loading,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold transition-all rounded-xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90',
    secondary: 'bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20 hover:bg-brand-secondary/90',
    outline: 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
    ghost: 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon && <Icon size={size === 'sm' ? 14 : 18} />}
      {children}
    </button>
  );
};

interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ number, title, subtitle, className = '' }) => (
  <div className={`flex items-start gap-4 ${className}`}>
    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-mono text-sm text-slate-400 shrink-0">
      {number}
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
    </div>
  </div>
);

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, color = 'brand-primary' }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 bg-white border border-slate-100 rounded-3xl space-y-4 hover:shadow-2xl transition-all group"
  >
    <div className={`w-12 h-12 bg-${color}/10 rounded-2xl flex items-center justify-center text-${color} group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <h4 className="text-xl font-bold text-slate-900">{title}</h4>
    <p className="text-sm text-slate-500 leading-relaxed font-medium">{description}</p>
  </motion.div>
);
