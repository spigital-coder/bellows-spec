import React from 'react';
import { SpecFormData } from '../types';
import { JointTechnicalDiagram } from './JointTechnicalDiagram';
import { Circle, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JOINT_TYPES } from '../constants';

interface Props {
  formData: SpecFormData;
  setFormData: React.Dispatch<React.SetStateAction<SpecFormData>>;
}

export const SpecForm: React.FC<Props> = ({ formData, setFormData }) => {
  const handleChange = (section: keyof SpecFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' 
        ? { ...(prev[section] as any), [field]: value }
        : value
    }));
  };

  const InputField = ({ label, section, field, placeholder, disabled }: { label: string, section: keyof SpecFormData, field: string, placeholder?: string, disabled?: boolean }) => (
    <div className={`flex flex-col gap-1 ${disabled ? 'opacity-40' : ''}`}>
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</label>
      <input
        type="text"
        value={(formData[section] as any)[field] || ''}
        onChange={(e) => !disabled && handleChange(section, field, e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="rounded border border-slate-200 bg-white px-3 py-2 text-sm transition-colors focus:border-brand focus:outline-none disabled:cursor-not-allowed"
      />
    </div>
  );

  const isCircular = formData.shape === 'circular';
  const selectedJoint = JOINT_TYPES.find(j => j.id === formData.selectedStyle);

  return (
    <div className="space-y-8">
      {/* Shape Selector & Technical Diagrams */}
      <div className="space-y-6">
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">Bellow Shape</h3>
            <p className="text-xs text-slate-500">Select the cross-section geometry.</p>
          </div>
          <div className="flex rounded-xl bg-slate-200 p-1">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, shape: 'rectangular' }))}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                !isCircular ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Square size={14} /> Rectangular
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, shape: 'circular' }))}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                isCircular ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Circle size={14} /> Circular
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <JointTechnicalDiagram 
            selectedStyle={formData.selectedStyle} 
            imageUrl={selectedJoint?.technicalImage}
          />
          
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Reference: {isCircular ? 'Circular' : 'Rectangular'}
                </span>
              </div>
              <div className="flex gap-1">
                <div className="h-1 w-3 rounded-full bg-slate-200" />
                <div className="h-1 w-1 rounded-full bg-slate-200" />
              </div>
            </div>
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-white p-4">
              <img 
                src={isCircular 
                  ? "https://www.bellows-systems.com/wp-content/uploads/2026/04/CIRCLE.jpg"
                  : "https://www.bellows-systems.com/wp-content/uploads/2026/04/RECTANGLE.jpg"
                }
                className="h-full w-full object-contain"
                alt={isCircular ? "Circular Reference" : "Rectangular Reference"}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-sans text-2xl font-bold text-slate-900">Input Your Specifications</h2>
          <p className="text-sm text-slate-500">Provide the engineering dimensions and design requirements below.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
        {/* Fabric Details */}
        <section className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <div className="h-2 w-2 rounded-full bg-brand" />
            <h2 className="font-sans text-lg font-semibold text-slate-800">Fabric Details</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField 
              label={isCircular ? '"A" Inside Diameter' : '"A" Inside Belt Dim.'} 
              section="fabricDetails" 
              field="dimA" 
              placeholder={isCircular ? "Diameter" : "One side"} 
            />
            <InputField 
              label={isCircular ? '"B" (N/A for Circular)' : '"B" Inside Belt Dim.'} 
              section="fabricDetails" 
              field="dimB" 
              placeholder="Other side"
              disabled={isCircular}
            />
            <InputField label='"C" Width Between Clamp Bars' section="fabricDetails" field="dimC" />
            <InputField label='Width of Clamp Bars' section="fabricDetails" field="clampBarWidth" />
            <InputField label='Overall Belt Width' section="fabricDetails" field="overallBeltWidth" />
            <InputField 
              label='Corner Radius (Rec. Only)' 
              section="fabricDetails" 
              field="cornerRadius" 
              disabled={isCircular}
            />
          </div>
        </section>

        {/* Duct Info */}
        <section className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <div className="h-2 w-2 rounded-full bg-brand" />
            <h2 className="font-sans text-lg font-semibold text-slate-800">Duct Info</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField 
              label={isCircular ? '"D" Inside Diameter' : '"D" (One side or Dia.)'} 
              section="ductInfo" 
              field="dimD" 
            />
            <InputField 
              label={isCircular ? '"W" (N/A for Circular)' : '"W" (Other side)'} 
              section="ductInfo" 
              field="dimW" 
              disabled={isCircular}
            />
            <InputField label='Width Between Clamps' section="ductInfo" field="widthBetweenClamps" />
            <InputField label='Flange (If Applicable)' section="ductInfo" field="flange" />
            <InputField label='Duct Thickness' section="ductInfo" field="ductThickness" />
            <InputField label='Duct Material' section="ductInfo" field="ductMaterial" />
          </div>
        </section>

        {/* Design & Movements */}
        <section className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <div className="h-2 w-2 rounded-full bg-brand" />
            <h2 className="font-sans text-lg font-semibold text-slate-800">Design & Movements</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label='P, Pressure' section="design" field="pressure" />
            <InputField label='T, Temperature' section="design" field="temperature" />
            <InputField label='Axial Compression' section="movements" field="axialCompression" />
            <InputField label='Axial Expansion' section="movements" field="axialExpansion" />
            <InputField label='Lateral' section="movements" field="lateral" />
            <InputField label='Quantity' section="quantity" field="quantity" />
          </div>
        </section>

        {/* Options & Notes */}
        <section className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <div className="h-2 w-2 rounded-full bg-brand" />
            <h2 className="font-sans text-lg font-semibold text-slate-800">Optional Features & Notes</h2>
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Optional Features</label>
            <div className="flex flex-wrap gap-4">
              {Object.entries(formData.optionalFeatures).map(([key, value]) => (
                <label key={key} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleChange('optionalFeatures', key, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Application Notes</label>
            <textarea
              value={formData.applicationNotes}
              onChange={(e) => handleChange('applicationNotes', 'applicationNotes', e.target.value)}
              rows={3}
              className="rounded border border-slate-200 bg-white px-3 py-2 text-sm transition-colors focus:border-brand focus:outline-none"
              placeholder="Enter any specific requirements or environmental conditions..."
            />
          </div>
        </section>
      </div>
    </div>
  </div>
);
};
