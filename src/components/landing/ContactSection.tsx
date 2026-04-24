import React from 'react';
import { Mail, Phone, Building2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-32 px-8 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[100px] -mr-96 -mt-96" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-20 items-start">
          <div className="md:w-1/2 space-y-8">
            <div className="space-y-4">
              <h4 className="text-brand-primary font-bold uppercase tracking-widest text-[11px]">Get in touch</h4>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                Ready to deploy <br />
                <span className="text-brand-primary">at scale?</span>
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-md">
                Whether you're a large organization or a growing community, we're here to help you automate your design workflows.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-brand-primary group-hover:text-white transition-all transform group-hover:rotate-3 shadow-slate-200/50">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Email Support</p>
                  <p className="text-lg font-bold text-slate-900">hello@massdesign.app</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-brand-primary group-hover:text-white transition-all transform group-hover:-rotate-3 shadow-slate-200/50">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Call Us</p>
                  <p className="text-lg font-bold text-slate-900">+234 (0) 800-DESIGN</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-brand-primary group-hover:text-white transition-all transform group-hover:rotate-3 shadow-slate-200/50">
                  <Building2 size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Headquarters</p>
                  <p className="text-lg font-bold text-slate-900 text-balance">Tech Hub, Herbert Macaulay Way, Yaba, Lagos</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 w-full">
            <form 
              className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-brand-primary/5 border border-slate-100 space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Jane Doe"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="jane@example.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 focus:outline-none focus:border-brand-primary focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Inquiry Type</label>
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 focus:outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer">
                    <option>Enterprise Integration</option>
                    <option>Bulk Education Licenses</option>
                    <option>Community Partnership</option>
                    <option>Technical Support</option>
                  </select>
              </div>
              <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">How can we help?</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us about your project requirements..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 focus:outline-none focus:border-brand-primary focus:bg-white transition-all resize-none"
                  />
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-brand-primary text-white font-bold rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
