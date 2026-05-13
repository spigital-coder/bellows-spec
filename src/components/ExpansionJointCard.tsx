import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { JointType } from '../types';

interface Props {
  type: JointType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const ExpansionJointCard: React.FC<Props> = ({ type, isSelected, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(type.id)}
      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
        isSelected 
          ? 'border-brand bg-brand-light shadow-lg' 
          : 'border-slate-200 bg-white hover:border-brand/20 hover:shadow-md'
      }`}
    >
      {isSelected && (
        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white shadow-sm">
          <Check size={14} strokeWidth={3} />
        </div>
      )}
      
      <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-white p-2 border border-slate-100">
        {type.image ? (
          <img 
            src={type.image} 
            alt={type.name} 
            className="h-full w-full object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Simplified SVG representation of a joint */
          <svg viewBox="0 0 100 60" className="h-full w-full text-slate-400">
            <rect x="10" y="20" width="10" height="20" fill="currentColor" opacity="0.3" />
            <rect x="80" y="20" width="10" height="20" fill="currentColor" opacity="0.3" />
            <path 
              d={isSelected ? "M 20 30 Q 50 10 80 30" : "M 20 30 L 80 30"} 
              stroke="currentColor" 
              strokeWidth="3" 
              fill="none" 
              className="transition-all duration-500"
            />
            <text x="50" y="50" textAnchor="middle" fontSize="6" className="font-mono fill-slate-500">
              {type.id}
            </text>
          </svg>
        )}
      </div>
      
      <h3 className={`text-sm font-bold tracking-tight ${isSelected ? 'text-brand' : 'text-slate-900'}`}>
        {type.name}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        {type.description}
      </p>
    </motion.div>
  );
};
