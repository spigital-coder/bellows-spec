import React from 'react';
import { SpecFormData } from '../types';
import { JointTechnicalDiagram } from './JointTechnicalDiagram';
import { Circle, Square, User } from 'lucide-react';
import { motion } from 'motion/react';
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

  const InputField = ({ label, section, field, placeholder, disabled, required }: { label: string, section: keyof SpecFormData, field: string, placeholder?: string, disabled?: boolean, required?: boolean }) => {
    const isObject = typeof formData[section] === 'object';
    const value = isObject ? (formData[section] as any)[field] : formData[section];
    return (
      <div className={`flex flex-col gap-1.5 ${disabled ? 'opacity-40' : ''}`}>
        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
          {label} {required && <span className="text-brand">*</span>}
        </label>
        <input
          type="text"
          required={required}
          value={value || ''}
          onChange={(e) => !disabled && handleChange(section, field, e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:border-brand focus:ring-4 focus:ring-brand/5 focus:outline-none disabled:cursor-not-allowed"
        />
      </div>
    );
  };

  const isCircular = formData.shape === 'circular';
  const selectedJoint = JOINT_TYPES.find(j => j.id === formData.selectedStyle);

  return (
    <div className="space-y-8">
      {/* Shape Selector & Technical Diagrams */}
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:p-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold uppercase tracking-widest text-slate-900">Bellow Shape</h3>
            <p className="text-sm text-slate-500">Select the cross-section geometry.</p>
          </div>
          <div className="flex w-full rounded-xl bg-slate-200 p-1 sm:w-auto">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, shape: 'rectangular' }))}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all sm:flex-initial ${
                !isCircular ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Square size={14} /> Rectangular
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, shape: 'circular' }))}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all sm:flex-initial ${
                isCircular ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Circle size={14} /> Circular
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <JointTechnicalDiagram 
            selectedStyle={formData.selectedStyle} 
            imageUrl={selectedJoint?.technicalImage}
          />
          
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
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
        <div className="border-b border-slate-100 pb-6">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Input Your Specifications</h2>
          <p className="mt-2 text-base text-slate-500 md:text-lg">Provide the engineering dimensions and design requirements below to receive a formal quotation.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Fabric Details */}
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Square size={20} />
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold text-slate-900">Fabric Details</h2>
                <p className="text-xs font-medium text-slate-400">Specify the critical dimensions of the fabric belt.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <InputField 
                label={isCircular ? '"A" Inside Diameter: (in)' : '"A" Inside Belt Dim.: (in)'} 
                section="fabricDetails" 
                field="dimA" 
                placeholder={isCircular ? "e.g. 24 in" : "Width"} 
              />
              <InputField 
                label={isCircular ? '"B" Inside Belt Dim. (N/A for Circular)' : '"B" Inside Belt Dim.: (in)'} 
                section="fabricDetails" 
                field="dimB" 
                placeholder="Height"
                disabled={isCircular}
              />
              <InputField label='"C" Width Between Clamp Bars: (in)' section="fabricDetails" field="dimC" placeholder="Width" />
              <InputField label='Width of Clamp Bars: (in)' section="fabricDetails" field="clampBarWidth" placeholder="e.g. 2 in" />
              <InputField label='Overall Belt Width: (in)' section="fabricDetails" field="overallBeltWidth" placeholder="Total" />
              <InputField 
                label='Corner Radius (Rec. Only): (in)' 
                section="fabricDetails" 
                field="cornerRadius" 
                disabled={isCircular}
                placeholder="e.g. 3 in"
              />
            </div>
          </section>

          {/* Duct Info */}
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Circle size={20} />
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold text-slate-900">Duct Info</h2>
                <p className="text-xs font-medium text-slate-400">Information about the mating ductwork.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <InputField 
                label={isCircular ? '"D" (One Side or Dia.): (in)' : '"D" (One Side or Dia.): (in)'} 
                section="ductInfo" 
                field="dimD" 
                placeholder="e.g. 24.5 in"
              />
              <InputField 
                label={isCircular ? '"W" (N/A for Circular)' : '"W" (Other Side): (in)'} 
                section="ductInfo" 
                field="dimW" 
                placeholder="Height"
                disabled={isCircular}
              />
              <InputField label='Width Between Clamps: (in)' section="ductInfo" field="widthBetweenClamps" />
              <InputField label='Flange (If Applicable): (in)' section="ductInfo" field="flange" />
              <InputField label='Duct Thickness: (in)' section="ductInfo" field="ductThickness" />
              <InputField label='Duct Material' section="ductInfo" field="ductMaterial" placeholder="e.g. Carbon Steel" />
            </div>
          </section>

          {/* Design & Movements */}
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <motion.div animate={{ rotate: 90 }}><Square size={20} /></motion.div>
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold text-slate-900">Design & Movements</h2>
                <p className="text-xs font-medium text-slate-400">Operational parameters and expected ranges.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <InputField label='P, Pressure: PSI' section="design" field="pressure" />
              <InputField label='T, Temperature: °F (or °C)' section="design" field="temperature" />
              <InputField label='Axial Compression: (in)' section="movements" field="axialCompression" />
              <InputField label='Axial Expansion: (in)' section="movements" field="axialExpansion" />
              <InputField label='Lateral: inches (in)' section="movements" field="lateral" />
              <InputField label='Quantity Required' section="quantity" field="quantity" />
            </div>
          </section>

          {/* Options & Notes */}
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Square size={20} strokeWidth={3} />
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold text-slate-900">Optional Features & Notes</h2>
                <p className="text-xs font-medium text-slate-400">Additional requirements and configuration.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Available Options</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(formData.optionalFeatures).map(([key, value]) => (
                  <label key={key} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                    value 
                      ? 'border-brand bg-brand/5 ring-1 ring-brand' 
                      : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                  }`}>
                    <div className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                      value ? 'border-brand bg-brand text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {value && <div className="h-2 w-2 rounded-full bg-white transition-all transform scale-100" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleChange('optionalFeatures', key, e.target.checked)}
                      className="sr-only"
                    />
                    <span className={`text-sm font-semibold transition-colors ${value ? 'text-slate-900' : 'text-slate-600'}`}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Application Notes</label>
              <textarea
                value={formData.applicationNotes}
                onChange={(e) => handleChange('applicationNotes', 'applicationNotes', e.target.value)}
                rows={4}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition-all focus:border-brand focus:ring-4 focus:ring-brand/5 focus:outline-none"
                placeholder="Describe operating conditions, media (gas/ash), or specific project requirements..."
              />
            </div>
          </section>

          {/* Contact Details Section */}
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 md:col-span-2">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <User size={20} />
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold text-slate-900">Contact Details</h2>
                <p className="text-xs font-medium text-slate-400">Please provide your details so our engineering team can connect and send a proposal.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Contact Name <span className="text-brand">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.contactDetails.name}
                  onChange={(e) => handleChange('contactDetails', 'name', e.target.value)}
                  placeholder="e.g. John Doe"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition-all focus:border-brand focus:ring-4 focus:ring-brand/5 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Phone Number <span className="text-brand">*</span></label>
                <input
                  type="tel"
                  required
                  value={formData.contactDetails.phone}
                  onChange={(e) => handleChange('contactDetails', 'phone', e.target.value)}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition-all focus:border-brand focus:ring-4 focus:ring-brand/5 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Email Address <span className="text-brand">*</span></label>
                <input
                  type="email"
                  required
                  value={formData.contactDetails.email}
                  onChange={(e) => handleChange('contactDetails', 'email', e.target.value)}
                  placeholder="e.g. john@company.com"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition-all focus:border-brand focus:ring-4 focus:ring-brand/5 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Company Name <span className="text-brand">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.contactDetails.companyName}
                  onChange={(e) => handleChange('contactDetails', 'companyName', e.target.value)}
                  placeholder="e.g. Bellows Systems Inc"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition-all focus:border-brand focus:ring-4 focus:ring-brand/5 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Country <span className="text-brand">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.contactDetails.country}
                  onChange={(e) => handleChange('contactDetails', 'country', e.target.value)}
                  placeholder="e.g. United States"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition-all focus:border-brand focus:ring-4 focus:ring-brand/5 focus:outline-none"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
