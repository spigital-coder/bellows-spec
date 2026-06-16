import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  FileText, 
  Send, 
  ChevronRight, 
  Info, 
  CheckCircle2,
  Factory,
  MapPin,
  Globe
} from 'lucide-react';
import { JOINT_TYPES } from './constants';
import { SpecFormData } from './types';
import { ExpansionJointCard } from './components/ExpansionJointCard';
import { SpecForm } from './components/SpecForm';

const initialFormData: SpecFormData = {
  selectedStyle: 'FE-10',
  shape: 'rectangular',
  fabricDetails: {
    dimA: '',
    dimB: '',
    dimC: '',
    clampBarWidth: '',
    overallBeltWidth: '',
    cornerRadius: '',
  },
  ductInfo: {
    dimD: '',
    dimW: '',
    widthBetweenClamps: '',
    flange: '',
    ductThickness: '',
    ductMaterial: '',
  },
  design: {
    pressure: '',
    temperature: '',
  },
  movements: {
    axialCompression: '',
    axialExpansion: '',
    lateral: '',
  },
  quantity: '',
  applicationNotes: '',
  optionalFeatures: {
    accumulationPillow: false,
    linerBolted: false,
    linerWelded: false,
  },
  contactDetails: {
    name: '',
    phone: '',
    email: '',
    companyName: '',
    country: '',
  },
};

export default function App() {
  const [formData, setFormData] = useState<SpecFormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'performance' | 'movement'>('performance');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit-spec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Submission result:', result);
      
      setIsSubmitted(true);
      setFormData(initialFormData); // Reset form
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting specification:', error);
      alert('There was an error submitting your specification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="https://www.bellows-systems.com/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <img 
              src="https://www.bellows-systems.com/wp-content/uploads/2020/04/BS-Logo-White.png.webp" 
              alt="Bellows Systems Logo" 
              className="h-8 w-auto md:h-10"
              referrerPolicy="no-referrer"
            />
          </a>
          
          <nav className="flex items-center gap-4">
            <a 
              href="https://www.bellows-systems.com/" 
              className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white hover:text-slate-900 md:px-5 md:py-2 md:text-base"
            >
              <Globe size={16} className="md:hidden" />
              <span className="hidden md:inline">Back To Website</span>
              <span className="md:hidden">Website</span>
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Hero Section */}
        <section className="mb-12 grid items-center gap-8 md:mb-20 lg:grid-cols-2 lg:gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 text-center lg:text-left"
          >
            <h2 className="font-sans text-5xl font-semibold leading-[0.9] tracking-tight text-slate-900 md:text-7xl">
              Fabric <span className="text-brand">Expansion</span> Joints
            </h2>
            <p className="mx-auto max-w-md text-base leading-relaxed text-slate-500 md:text-lg lg:mx-0">
              Bellows Systems manufactures high-performance composite fabric expansion joints for low-pressure ducting, engineered to handle extreme temperatures and misalignment.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <button 
                onClick={() => document.getElementById('style-selection')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 font-bold text-white shadow-xl shadow-brand/20 transition-all hover:bg-brand-dark hover:shadow-brand/30 sm:w-auto"
              >
                Start Specification <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col rounded-3xl bg-slate-50 p-1 shadow-inner"
          >
            <div className="flex gap-1 p-1">
              <button
                onClick={() => setActiveTab('performance')}
                className={`flex-1 rounded-2xl py-3 text-xs font-bold uppercase tracking-widest transition-all md:text-sm ${
                  activeTab === 'performance' 
                    ? 'bg-white text-brand shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Performance
              </button>
              <button
                onClick={() => setActiveTab('movement')}
                className={`flex-1 rounded-2xl py-3 text-xs font-bold uppercase tracking-widest transition-all md:text-sm ${
                  activeTab === 'movement' 
                    ? 'bg-white text-brand shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Movements
              </button>
            </div>

            <div className="flex-1 p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'performance' ? (
                  <motion.div
                    key="performance"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <h3 className="font-sans text-xl font-semibold text-slate-900">Standard Performance Data</h3>
                    <div className="grid gap-4">
                      <div className="flex flex-col border-b border-slate-200 pb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Temperature Range</span>
                        <span className="text-xl font-bold text-slate-900">-20˚F to 1200˚F</span>
                      </div>
                      <div className="flex flex-col border-b border-slate-200 pb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Pressure Range</span>
                        <span className="text-xl font-bold text-slate-900">±60" of water (H2O) column</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="movement"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <h3 className="font-sans text-xl font-semibold text-slate-900">Movement Range</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-base">
                        <thead>
                          <tr className="border-b border-slate-300">
                            <th className="pb-2 font-bold text-slate-900">Belt Width</th>
                            <th className="pb-2 font-bold text-slate-900 text-center">Axial Comp</th>
                            <th className="pb-2 font-bold text-slate-900 text-center">Axial Ext</th>
                            <th className="pb-2 font-bold text-slate-900 text-center">Lat Mov</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {[
                            { w: '12″', c: '4.5″', e: '2.5″', l: '2.5″' },
                            { w: '18″', c: '6″', e: '3″', l: '4″' },
                            { w: '24″', c: '6″', e: '4″', l: '5″' }
                          ].map((row, idx) => (
                            <tr key={idx}>
                              <td className="py-3 font-bold text-slate-900">{row.w}</td>
                              <td className="py-3 text-center text-slate-600">{row.c}</td>
                              <td className="py-3 text-center text-slate-600">{row.e}</td>
                              <td className="py-3 text-center text-slate-600">{row.l}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>

        {/* Style Selection */}
        <section id="style-selection" className="mb-20 space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-brand">Step 01</h3>
              <h2 className="font-sans text-4xl font-semibold text-slate-900">Select Joint Style</h2>
            </div>
            <p className="max-w-xs text-sm text-slate-400 sm:text-right">
              Choose the profile that best matches your ducting configuration. Each style is engineered for specific movement and pressure profiles.
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {JOINT_TYPES.map(type => (
              <ExpansionJointCard
                key={type.id}
                type={type}
                isSelected={formData.selectedStyle === type.id}
                onSelect={(id) => {
                  setFormData(prev => ({ ...prev, selectedStyle: id }));
                  document.getElementById('spec-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </section>

        {/* Specification Form */}
        <section id="spec-form" className="mb-20 space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-brand">Step 02</h3>
              <h2 className="font-sans text-4xl font-semibold text-slate-900">Technical Specifications</h2>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-lg bg-slate-50 px-4 py-2 text-sm font-medium text-slate-500">
              <FileText size={14} />
              Selected: <span className="font-bold text-slate-900">{formData.selectedStyle}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <SpecForm formData={formData} setFormData={setFormData} />
            
            <div className="flex flex-col items-center justify-center gap-8 border-t border-slate-100 bg-slate-50/30 py-16 px-6 rounded-3xl">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Info size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Ready to Submit?</h3>
                <p className="max-w-md text-base leading-relaxed text-slate-500">
                  Our engineering team will review your specifications for technical feasibility and environmental compatibility before providing a formal quotation.
                </p>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-slate-900 px-10 py-5 text-xl font-bold text-white shadow-2xl shadow-slate-200 transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isSubmitting ? 'Processing Review...' : 'Submit Technical Review'} 
                  {!isSubmitting && <Send size={22} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-brand transition-transform duration-500 ease-out group-hover:translate-x-0" />
              </button>

              <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Response time typically within 24 business hours
              </div>
            </div>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-6">
              <img 
                src="https://www.bellows-systems.com/wp-content/uploads/2020/04/BS-Logo-White.png.webp" 
                alt="Bellows Systems Logo" 
                className="h-8 w-auto brightness-0"
                referrerPolicy="no-referrer"
              />
              <p className="text-sm text-slate-500 md:text-base">
                Leading manufacturer of metallic and fabric expansion joints since 1974.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Contact</h4>
              <div className="space-y-2 text-sm text-slate-500 md:text-base">
                <p className="flex items-center gap-2"><MapPin size={14} /> Houston, Texas, USA</p>
                <p className="flex items-center gap-2"><Globe size={14} /> www.bellows-systems.com</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Compliance</h4>
              <div className="space-y-2 text-sm text-slate-500 md:text-base">
                <p>CAGE CODE: 22727</p>
                <p>ISO 9001:2015 Certified</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Legal</h4>
              <p className="text-xs leading-relaxed text-slate-400">
                This drawing and all information herein are the sole property of Bellows Systems, Inc. and may not be reproduced without express written consent.
              </p>
            </div>
          </div>
          
          <div className="mt-12 border-t border-slate-200 pt-8 text-center text-xs font-bold uppercase tracking-widest text-slate-400 md:mt-16">
            © 2026 Bellows Systems Inc. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Success Toast */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-emerald-600 px-6 py-3 text-white shadow-2xl"
          >
            <CheckCircle2 size={20} />
            <span className="font-bold">Specification Submitted Successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
