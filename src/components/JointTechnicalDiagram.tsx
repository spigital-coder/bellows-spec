import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  selectedStyle: string;
  imageUrl?: string;
}

export const JointTechnicalDiagram: React.FC<Props> = ({ selectedStyle, imageUrl }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-brand" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Technical Profile: {selectedStyle}</span>
        </div>
        <div className="flex gap-1">
          <div className="h-1 w-3 rounded-full bg-slate-200" />
          <div className="h-1 w-1 rounded-full bg-slate-200" />
        </div>
      </div>
      <div className="relative aspect-[21/9] w-full overflow-hidden bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStyle}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            <div className="relative h-full w-full overflow-hidden">
              <img 
                src={imageUrl}
                className="h-full w-full object-contain"
                alt={selectedStyle}
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Technical overlay indicators */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <div className="rounded-md bg-slate-900/5 px-2 py-1 text-[6px] font-bold text-slate-500 uppercase backdrop-blur-sm">Engineering Profile</div>
          <div className="rounded-md bg-slate-900/5 px-2 py-1 text-[6px] font-bold text-slate-500 uppercase backdrop-blur-sm">Scale: NTS</div>
        </div>
      </div>
    </div>
  );
};
