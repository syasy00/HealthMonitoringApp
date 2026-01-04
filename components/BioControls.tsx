import React from 'react';
import { GlassWater, Moon, Smile, Ear } from 'lucide-react';

type LogActionType = 'water' | 'hear' | 'mood' | 'rest' | 'meds';

interface BioControlsProps {
  onLogAction: (type: LogActionType, medId?: string, mood?: string) => void;
}

const BioControls: React.FC<BioControlsProps> = ({ onLogAction }) => {
  return (
    <div className="w-full bg-white rounded-[2rem] p-3 shadow-sm border border-slate-100 flex items-stretch h-24 gap-3">
      
      <ControlButton 
        icon={Ear} 
        label="Check" 
        sub="Noise" 
        color="text-teal-600" 
        bgColor="bg-teal-50"
        onClick={() => onLogAction('hear')} 
      />
      
      <ControlButton 
        icon={Smile} 
        label="Log" 
        sub="Mood" 
        color="text-indigo-600" 
        bgColor="bg-indigo-50"
        onClick={() => onLogAction('mood', undefined, 'Happy')} 
      />
      
      {/* Divider */}
      <div className="w-[1px] bg-slate-100 my-2" />

      <ControlButton 
        icon={GlassWater} 
        label="Add" 
        sub="Water" 
        color="text-blue-500" 
        bgColor="bg-blue-50"
        onClick={() => onLogAction('water')} 
        highlight
      />
      
      <ControlButton 
        icon={Moon} 
        label="Track" 
        sub="Sleep" 
        color="text-violet-600" 
        bgColor="bg-violet-50"
        onClick={() => onLogAction('rest')} 
      />

    </div>
  );
};

const ControlButton = ({ icon: Icon, label, sub, onClick, color, bgColor, highlight }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 group relative overflow-hidden ${highlight ? 'bg-slate-50 ring-1 ring-slate-100' : 'hover:bg-slate-50'}`}
  >
    <div className={`p-2.5 rounded-full transition-colors ${bgColor} ${color} shadow-sm group-hover:scale-110 duration-300`}>
      <Icon size={22} strokeWidth={2.5} />
    </div>
    <div className="flex flex-col items-center leading-none gap-0.5">
      <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide">{label}</span>
      <span className="text-[9px] font-bold text-slate-400">{sub}</span>
    </div>
  </button>
);

export default BioControls;