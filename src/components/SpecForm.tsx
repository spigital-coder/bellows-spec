import React from 'react';
import { SpecFormData, FormErrors } from '../types';
import { JointTechnicalDiagram } from './JointTechnicalDiagram';
import { Circle, Square, User, Ruler, Wind, Activity, Sliders } from 'lucide-react';
import { motion } from 'motion/react';
import { JOINT_TYPES } from '../constants';

export const validateForm = (formData: SpecFormData): FormErrors => {
  const errors: FormErrors = {};

  const checkRequired = (val: string, key: string, label: string) => {
    if (!val || val.trim() === '') {
      errors[key] = `${label} is required.`;
    }
  };

  // 1. Required checks
  checkRequired(formData.fabricDetails.dimA, 'fabricDetails.dimA', formData.shape === 'circular' ? '"A" Inside Diameter' : '"A" Inside Belt Dim.');
  if (formData.shape === 'rectangular') {
    checkRequired(formData.fabricDetails.dimB, 'fabricDetails.dimB', '"B" Inside Belt Dim.');
  }
  checkRequired(formData.fabricDetails.dimC, 'fabricDetails.dimC', '"C" Width Between Clamp Bars');
  checkRequired(formData.fabricDetails.clampBarWidth, 'fabricDetails.clampBarWidth', 'Width of Clamp Bars');
  checkRequired(formData.fabricDetails.overallBeltWidth, 'fabricDetails.overallBeltWidth', 'Overall Belt Width');

  checkRequired(formData.ductInfo.dimD, 'ductInfo.dimD', '"D" (One Side or Dia.)');
  if (formData.shape === 'rectangular') {
    checkRequired(formData.ductInfo.dimW, 'ductInfo.dimW', '"W" (Other Side)');
  }
  checkRequired(formData.ductInfo.widthBetweenClamps, 'ductInfo.widthBetweenClamps', 'Width Between Clamps');

  checkRequired(formData.design.pressure, 'design.pressure', 'Pressure');
  checkRequired(formData.design.temperature, 'design.temperature', 'Temperature');
  checkRequired(formData.quantity, 'quantity', 'Quantity Required');

  checkRequired(formData.contactDetails.name, 'contactDetails.name', 'Contact Name');
  checkRequired(formData.contactDetails.phone, 'contactDetails.phone', 'Phone Number');
  checkRequired(formData.contactDetails.email, 'contactDetails.email', 'Email Address');
  checkRequired(formData.contactDetails.companyName, 'contactDetails.companyName', 'Company Name');
  checkRequired(formData.contactDetails.country, 'contactDetails.country', 'Country');

  // 2. Format checks (only run if field has value)
  const name = formData.contactDetails.name;
  if (name && name.trim() !== '') {
    if (!/^[A-Za-z\s]+$/.test(name)) {
      errors['contactDetails.name'] = 'Contact Name must contain only letters and spaces.';
    }
  }

  const phone = formData.contactDetails.phone;
  if (phone && phone.trim() !== '') {
    if (!/^[0-9\s+\-()]+$/.test(phone)) {
      errors['contactDetails.phone'] = 'Phone must contain only numbers and phone symbols (+ - ( )).';
    }
  }

  const companyName = formData.contactDetails.companyName;
  if (companyName && companyName.trim() !== '') {
    if (!/^[A-Za-z\s]+$/.test(companyName)) {
      errors['contactDetails.companyName'] = 'Company Name must contain only letters and spaces.';
    }
  }

  const country = formData.contactDetails.country;
  if (country && country.trim() !== '') {
    if (!/^[A-Za-z\s]+$/.test(country)) {
      errors['contactDetails.country'] = 'Country must contain only letters and spaces.';
    }
  }

  const ductMaterial = formData.ductInfo.ductMaterial;
  if (ductMaterial && ductMaterial.trim() !== '') {
    if (!/^[A-Za-z\s]+$/.test(ductMaterial)) {
      errors['ductInfo.ductMaterial'] = 'Duct Material must contain only letters and spaces.';
    }
  }

  // Number format validator
  const isNumber = (val: string) => {
    if (!val || val.trim() === '') return true;
    return /^[+-]?[0-9]+(?:\.[0-9]+)?$/.test(val.trim());
  };

  if (formData.fabricDetails.dimA && !isNumber(formData.fabricDetails.dimA)) {
    errors['fabricDetails.dimA'] = 'Must be a valid number.';
  }
  if (formData.shape === 'rectangular' && formData.fabricDetails.dimB && !isNumber(formData.fabricDetails.dimB)) {
    errors['fabricDetails.dimB'] = 'Must be a valid number.';
  }
  if (formData.fabricDetails.dimC && !isNumber(formData.fabricDetails.dimC)) {
    errors['fabricDetails.dimC'] = 'Must be a valid number.';
  }
  if (formData.fabricDetails.clampBarWidth && !isNumber(formData.fabricDetails.clampBarWidth)) {
    errors['fabricDetails.clampBarWidth'] = 'Must be a valid number.';
  }
  if (formData.fabricDetails.overallBeltWidth && !isNumber(formData.fabricDetails.overallBeltWidth)) {
    errors['fabricDetails.overallBeltWidth'] = 'Must be a valid number.';
  }
  if (formData.shape === 'rectangular' && formData.fabricDetails.cornerRadius && !isNumber(formData.fabricDetails.cornerRadius)) {
    errors['fabricDetails.cornerRadius'] = 'Must be a valid number.';
  }

  if (formData.ductInfo.dimD && !isNumber(formData.ductInfo.dimD)) {
    errors['ductInfo.dimD'] = 'Must be a valid number.';
  }
  if (formData.shape === 'rectangular' && formData.ductInfo.dimW && !isNumber(formData.ductInfo.dimW)) {
    errors['ductInfo.dimW'] = 'Must be a valid number.';
  }
  if (formData.ductInfo.widthBetweenClamps && !isNumber(formData.ductInfo.widthBetweenClamps)) {
    errors['ductInfo.widthBetweenClamps'] = 'Must be a valid number.';
  }
  if (formData.ductInfo.flange && !isNumber(formData.ductInfo.flange)) {
    errors['ductInfo.flange'] = 'Must be a valid number.';
  }
  if (formData.ductInfo.ductThickness && !isNumber(formData.ductInfo.ductThickness)) {
    errors['ductInfo.ductThickness'] = 'Must be a valid number.';
  }

  if (formData.design.pressure && !isNumber(formData.design.pressure)) {
    errors['design.pressure'] = 'Must be a valid number.';
  }
  if (formData.design.temperature && !isNumber(formData.design.temperature)) {
    errors['design.temperature'] = 'Must be a valid number.';
  }
  if (formData.movements.axialCompression && !isNumber(formData.movements.axialCompression)) {
    errors['movements.axialCompression'] = 'Must be a valid number.';
  }
  if (formData.movements.axialExpansion && !isNumber(formData.movements.axialExpansion)) {
    errors['movements.axialExpansion'] = 'Must be a valid number.';
  }
  if (formData.movements.lateral && !isNumber(formData.movements.lateral)) {
    errors['movements.lateral'] = 'Must be a valid number.';
  }
  if (formData.quantity && !isNumber(formData.quantity)) {
    errors['quantity'] = 'Quantity must be a valid number.';
  }

  return errors;
};

interface Props {
  formData: SpecFormData;
  setFormData: React.Dispatch<React.SetStateAction<SpecFormData>>;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  showErrors: boolean;
}

const SpecFormContext = React.createContext<{
  formData: SpecFormData;
  errors: FormErrors;
  showErrors: boolean;
  handleChange: (section: keyof SpecFormData, field: string, value: any) => void;
} | null>(null);

interface InputFieldProps {
  label: string;
  section: keyof SpecFormData;
  field: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, section, field, placeholder, disabled, required, type }) => {
  const context = React.useContext(SpecFormContext);
  if (!context) return null;
  const { formData, errors, showErrors, handleChange } = context;
  const isObject = typeof formData[section] === 'object';
  const value = isObject ? (formData[section] as any)[field] : formData[section];
  
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  
  const errorKey = isObject ? `${String(section)}.${field}` : String(section);
  const errorMsg = (showErrors || hasValue) ? errors[errorKey] : undefined;

  return (
    <div className={`flex flex-col gap-1.5 transition-all duration-300 ${disabled ? 'opacity-30 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between">
        <label className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${
          errorMsg && !disabled
            ? 'text-red-500' 
            : hasValue && !disabled ? 'text-brand' : 'text-slate-500'
        }`}>
          {label} {required && <span className="text-red-500 font-semibold">*</span>}
        </label>
        {hasValue && !disabled && !errorMsg && (
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Filled</span>
        )}
        {errorMsg && !disabled && (
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-600 bg-red-50 px-1.5 py-0.5 rounded">Error</span>
        )}
      </div>
      <div className="relative">
        <input
          type={type || "text"}
          required={required}
          value={value || ''}
          onChange={(e) => !disabled && handleChange(section, field, e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-xl border px-4 py-3 text-base text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:ring-4 focus:outline-none disabled:cursor-not-allowed ${
            errorMsg && !disabled
              ? 'border-red-300 bg-red-50/10 focus:border-red-500 focus:ring-red-500/5'
              : hasValue 
                ? 'border-emerald-200 bg-emerald-50/10 focus:border-emerald-500 focus:ring-emerald-500/5' 
                : 'border-slate-200 bg-white focus:border-brand focus:ring-brand/5'
          } hover:border-slate-300`}
        />
      </div>
      {errorMsg && !disabled && (
        <span className="text-xs text-red-500 font-medium animate-fade-in mt-1">{errorMsg}</span>
      )}
    </div>
  );
};

export const SpecForm: React.FC<Props> = ({ formData, setFormData, errors, setErrors, showErrors }) => {
  const handleChange = (section: keyof SpecFormData, field: string, value: any) => {
    const updated = {
      ...formData,
      [section]: typeof formData[section] === 'object' 
        ? { ...(formData[section] as any), [field]: value }
        : value
    };
    setFormData(updated);
    setErrors(validateForm(updated));
  };

  const isCircular = formData.shape === 'circular';
  const selectedJoint = JOINT_TYPES.find(j => j.id === formData.selectedStyle);

  return (
    <SpecFormContext.Provider value={{ formData, errors, showErrors, handleChange }}>
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
                <Ruler size={20} />
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
                required
              />
              <InputField 
                label={isCircular ? '"B" Inside Belt Dim. (N/A for Circular)' : '"B" Inside Belt Dim.: (in)'} 
                section="fabricDetails" 
                field="dimB" 
                placeholder="Height"
                disabled={isCircular}
                required={!isCircular}
              />
              <InputField label='"C" Width Between Clamp Bars: (in)' section="fabricDetails" field="dimC" placeholder="Width" required />
              <InputField label='Width of Clamp Bars: (in)' section="fabricDetails" field="clampBarWidth" placeholder="e.g. 2 in" required />
              <InputField label='Overall Belt Width: (in)' section="fabricDetails" field="overallBeltWidth" placeholder="Total" required />
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
                <Wind size={20} />
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold text-slate-900">Duct Info</h2>
                <p className="text-xs font-medium text-slate-400">Information about the mating ductwork.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <InputField 
                label='"D" (One Side or Dia.): (in)' 
                section="ductInfo" 
                field="dimD" 
                placeholder="e.g. 24.5 in"
                required
              />
              <InputField 
                label={isCircular ? '"W" (N/A for Circular)' : '"W" (Other Side): (in)'} 
                section="ductInfo" 
                field="dimW" 
                placeholder="Height"
                disabled={isCircular}
                required={!isCircular}
              />
              <InputField label='Width Between Clamps: (in)' section="ductInfo" field="widthBetweenClamps" required />
              <InputField label='Flange (If Applicable): (in)' section="ductInfo" field="flange" />
              <InputField label='Duct Thickness: (in)' section="ductInfo" field="ductThickness" />
              <InputField label='Duct Material' section="ductInfo" field="ductMaterial" placeholder="e.g. Carbon Steel" />
            </div>
          </section>

          {/* Design & Movements */}
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Activity size={20} />
              </div>
              <div>
                <h2 className="font-sans text-xl font-bold text-slate-900">Design & Movements</h2>
                <p className="text-xs font-medium text-slate-400">Operational parameters and expected ranges.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <InputField label='P, Pressure: PSI' section="design" field="pressure" required />
              <InputField label='T, Temperature: °F (or °C)' section="design" field="temperature" required />
              <InputField label='Axial Compression: (in)' section="movements" field="axialCompression" />
              <InputField label='Axial Expansion: (in)' section="movements" field="axialExpansion" />
              <InputField label='Lateral: inches (in)' section="movements" field="lateral" />
              <InputField label='Quantity Required' section="quantity" field="quantity" required />
            </div>
          </section>

          {/* Options & Notes */}
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Sliders size={20} />
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
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 md:col-span-2 animate-fade-in">
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
              <InputField 
                label="Contact Name" 
                section="contactDetails" 
                field="name" 
                placeholder="e.g. John Doe" 
                required 
              />
              <InputField 
                label="Phone Number" 
                section="contactDetails" 
                field="phone" 
                placeholder="e.g. +1 (555) 019-2834" 
                type="tel"
                required 
              />
              <InputField 
                label="Email Address" 
                section="contactDetails" 
                field="email" 
                placeholder="e.g. john@company.com" 
                type="email"
                required 
              />
              <InputField 
                label="Company Name" 
                section="contactDetails" 
                field="companyName" 
                placeholder="e.g. Bellows Systems Inc" 
                required 
              />
              <div className="sm:col-span-2 lg:col-span-1">
                <InputField 
                  label="Country" 
                  section="contactDetails" 
                  field="country" 
                  placeholder="e.g. United States" 
                  required 
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    </SpecFormContext.Provider>
  );
};
