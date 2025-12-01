import React from 'react';
import { BodyPart } from '../types';
import { X, Activity, Zap, CloudFog, AlertCircle, Circle } from 'lucide-react';

interface SymptomSelectorProps {
  bodyPart: BodyPart;
  onClose: () => void;
  onSelect: (symptomId: string, symptomName: string) => void;
}

// Simple Wind Icon (if lucide-react version doesn't have it yet, though standard usually does)
const Wind = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>
);

// Map body parts to specific symptoms
const symptomsByPart: Record<BodyPart, { id: string, label: string, icon: any }[]> = {
  head: [
    { id: 'headache', label: 'Headache', icon: Zap },
    { id: 'dizzy', label: 'Dizziness', icon: Activity },
    { id: 'fog', label: 'Brain Fog', icon: CloudFog },
  ],
  chest: [
    { id: 'palpitations', label: 'Racing Heart', icon: Activity },
    { id: 'breath', label: 'Short Breath', icon: Wind },
  ],
  stomach: [
    { id: 'nausea', label: 'Nausea', icon: AlertCircle },
    { id: 'bloating', label: 'Bloating', icon: Circle },
  ],
  legs: [], // Can add 'Cramps', 'Fatigue' later
  general: []
};

const SymptomSelector: React.FC<SymptomSelectorProps> = ({ bodyPart, onClose, onSelect }) => {
  const options = symptomsByPart[bodyPart] || [];

  if (options.length === 0) return null;

  return (
    <div 
      className="absolute z-[60] min-w-[180px] bg-[#151925]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl animate-[scaleIn_0.2s] origin-center"
      // Positioned centrally for now, but in a real app you might want to position it near the click coordinates
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
    >
      
      {/* Header */}
      <div className="flex justify-between items-center mb-3 px-1 border-b border-white/5 pb-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {bodyPart} CHECK
        </span>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition">
          <X size={14} />
        </button>
      </div>
      
      {/* Symptom List */}
      <div className="flex flex-col gap-1">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id, opt.label)}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group text-left border border-transparent hover:border-white/5 active:scale-95"
          >
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
               <opt.icon size={16} />
            </div>
            <span className="text-xs font-bold text-slate-300 group-hover:text-white">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SymptomSelector;