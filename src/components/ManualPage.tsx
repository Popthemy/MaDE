import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  GraduationCap, 
  Users, 
  ArrowLeft,
  Play,
  FileUp,
  FileDown,
  Share2,
  Layers,
  Settings,
  Palette,
  CheckCircle2,
  Zap,
  Layout
} from 'lucide-react';

export default function ManualPage() {
  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-brand-primary/10 selection:text-brand-primary overflow-x-hidden">
      {/* Main Content */}
      <main className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="text-brand-primary font-bold uppercase tracking-widest text-[11px] mb-4">Official Documentation</h4>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900">
                Master the art of <br />
                <span className="text-brand-primary italic">Design Automation</span>
              </h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto mt-6 leading-relaxed">
                MassDesign is engineered to eliminate repetitive tasks. This guide covers every architectural detail needed to generate impact at scale.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-40">
            {/* Target Audience */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold rounded-full uppercase tracking-widest">Target Ecosystems</span>
                <h3 className="text-4xl font-bold text-slate-900 leading-tight">Built for high-volume, <br /> high-integrity needs</h3>
                <p className="text-lg text-slate-500 leading-relaxed">
                  MassDesign isn't just another editor. It's a production engine for organizations that need to generate consistent quality for hundreds of recipients instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: 'Churches', desc: 'Fellowship celebrations, birth announcements, and weekly quotes.', icon: <Zap size={18} /> },
                  { title: 'Schools', desc: 'Graduation certificates, achievement awards, and student IDs.', icon: <GraduationCap size={18} /> },
                  { title: 'Teams', desc: 'Professional onboarding, employee of the month, and event tags.', icon: <Users size={18} /> },
                  { title: 'Creators', desc: 'Branded quote batches, testimonial series, and social media blitz scrolls.', icon: <Sparkles size={18} /> }
                ].map((item, index) => (
                  <div key={index} className="p-8 bg-slate-50 rounded-3xl space-y-4 hover:bg-white hover:shadow-2xl hover:shadow-brand-primary/5 transition-all group border border-transparent hover:border-slate-100">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Video Tutorial Placeholder */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-video lg:aspect-auto bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/40 to-transparent opacity-60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-2xl group-hover:scale-110 transition-transform">
                  <Play size={40} fill="currentColor" />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold uppercase tracking-widest text-[12px] mb-2">Watch Tutorial</p>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium">Template Creation Workflow (4:20)</p>
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=1200" 
                alt="Workspace" 
                className="w-full h-full object-cover opacity-30" 
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          {/* Deep Dive Features */}
          <div className="space-y-4 mb-16">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Core Concepts</h4>
            <h2 className="text-3xl font-bold text-slate-900">Architecture Components</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
            {/* Property Fields & Data Mapping */}
            <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] space-y-6 shadow-sm hover:shadow-2xl transition-all group">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary group-hover:scale-110 transition-all">
                <Settings size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Dynamic Mapping</h3>
                <p className="text-slate-500 leading-relaxed">
                  Use the <span className="font-bold text-slate-900 underline">Property Field</span> in the designer sidebar to connect elements to your data. Whatever key you use there (e.g., <code className="bg-slate-100 px-1.5 rounded text-xs">firstName</code>) must match your CSV column headers exactly.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-50">
                <p className="text-[10px] uppercase font-bold text-brand-primary tracking-widest mb-3">Professional Insight</p>
                <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-brand-primary italic text-slate-500 text-sm">
                  Mappings are case-sensitive. Always verify your CSV keys match your design fields for perfect, high-integrity automation.
                </div>
              </div>
            </div>

            {/* Overlays & Backdrops */}
            <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] space-y-6 shadow-sm hover:shadow-2xl transition-all group">
              <div className="w-16 h-16 bg-brand-secondary/10 rounded-2xl flex items-center justify-center text-brand-secondary group-hover:scale-110 transition-all">
                <Layers size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Global Aesthetics</h3>
                <p className="text-slate-500 leading-relaxed">
                  Apply a <span className="font-bold text-slate-900 underline">Backdrop</span> for full-canvas atmosphere, or a <span className="font-bold text-slate-900 underline">Frame Overlay</span> to add borders and branded texture that stays consistent across every single generated asset.
                </p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=400" 
                alt="Overlay Demo" 
                className="w-full h-40 object-cover rounded-[1.5rem] mt-4 border border-slate-100 shadow-inner group-hover:grayscale-0 grayscale transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Color Strategy */}
            <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] space-y-6 shadow-sm hover:shadow-2xl transition-all group">
              <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent group-hover:scale-110 transition-all">
                <Palette size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Smart Color Logic</h3>
                <p className="text-slate-500 leading-relaxed">
                  Applying a default color ensures every item in the batch stays on-brand. However, you can toggle <span className="font-bold text-slate-900 underline">Individual Modification</span> to give specific items unique accents based on achievement tiers.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <div className="w-10 h-10 rounded-2xl bg-brand-primary shadow-lg shadow-brand-primary/20 rotate-3" />
                <div className="w-10 h-10 rounded-2xl bg-brand-secondary shadow-lg shadow-brand-secondary/20 -rotate-6" />
                <div className="w-10 h-10 rounded-2xl bg-brand-accent shadow-lg shadow-brand-accent/20 rotate-12" />
              </div>
              <p className="text-xs text-slate-400 mt-4 italic font-medium">Example: Use Gold (#FFD700) for "Distinction" and Purple (#7C3AED) for "Merit" within the same batch.</p>
            </div>
          </div>

          {/* Import/Export & Sharing */}
          <div className="p-12 md:p-20 bg-slate-900 rounded-[4rem] text-white relative overflow-hidden group shadow-3xl shadow-slate-900/40">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary rounded-full blur-[150px] opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
              <div className="lg:col-span-1 space-y-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Share2 className="text-white" />
                </div>
                <h3 className="text-4xl font-bold leading-tight">Data Mobility & <br /> Collaborations</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  MassDesign is built to be portable. No proprietary lock-ins—just your data, wherever you need it.
                </p>
                <button 
                  className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                >
                  Start Building Now
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:col-span-2 bg-white/5 p-10 md:p-14 rounded-[3rem] backdrop-blur-md border border-white/10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FileDown className="text-brand-primary" size={24} />
                    <h4 className="text-xl font-bold italic">JSON Architecture</h4>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">Save your entire design ecosystem as a lightweight JSON file. Perfect for version control and organizational sharing.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FileUp className="text-brand-accent" size={24} />
                    <h4 className="text-xl font-bold italic">CSV Bulk Mapping</h4>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">Instantly populate thousands of designs by uploading a standard spreadsheet. We handle the heavy logic automatically.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Share2 className="text-brand-secondary" size={24} />
                    <h4 className="text-xl font-bold italic">Direct Share Link</h4>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">Get a direct shareable URL for your design blueprint. Recipients can preview live impact without creating an account.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-400" size={24} />
                    <h4 className="text-xl font-bold italic">Production Batch</h4>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">One-click ZIP downloads of your entire production batch. Every image is optimized for weight and quality.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-32 text-center text-[10px] text-slate-300 uppercase tracking-[0.4em] font-bold">
            © 2026 MassDesign Documentation | Version 2.0.4-Lagos
          </div>
        </div>
      </main>
    </div>
  );
}
