import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MousePointer2, ArrowRight } from 'lucide-react';
import { BrandButton } from '../shared/Atomic';

interface LandingHeroProps {
  onExploreTemplates: () => void;
  onCustomRequest: () => void;
}

const ROTATING_WORDS = [
  'Profiles',
  'Certificates',
  'Testimonials',
  'Quote Posts',
  'Birthday Cards'
];

export const LandingHero: React.FC<LandingHeroProps> = ({ onExploreTemplates, onCustomRequest }) => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-8 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-8">
            <MousePointer2 size={12} /> Pro-Grade Design Automation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-6">
            Design once. <br />
            <span className="text-brand-primary">Generate 100s</span> of{' '} <br />
            <span className="inline-grid h-[1.1em] overflow-hidden align-top text-brand-primary">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="col-start-1 row-start-1"
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>{' '} in seconds.
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Create a single template, upload your data, and instantly produce consistent, branded graphics—without repetitive work.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm font-mono uppercase tracking-[0.2em] text-slate-400">
            <span>⚡ No design repetition</span>
            <span>📊 Works with your CSV</span>
            <span className="text-brand-accent">🎨 Always on-brand</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <BrandButton size="lg" onClick={onExploreTemplates} icon={ArrowRight} className="flex-row-reverse">
            Generate Your First Batch
          </BrandButton>
          <BrandButton size="lg" variant="outline" onClick={onCustomRequest}>
            Custom Request
          </BrandButton>
        </motion.div>
      </div>
    </section>
  );
};
