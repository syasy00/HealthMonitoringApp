import React from 'react';
import { Medication } from '../types';
import { Pill, Check, Clock, Plus } from 'lucide-react';

interface MedicationManagerProps {
  medications: Medication[];
  onTake: (id: string) => void;
  // This could trigger a modal for adding new meds (omitted for brevity)
  onAddMed: () => void; 
  onShowDetails: (id: string) => void; 
}

const MedicationManager: React.FC<MedicationManagerProps> = ({ 
  medications, 
  onTake,
  onAddMed
}) => {
  const takenCount = medications.filter(m => m.taken).length;
  const totalCount = medications.length;
  const allDone = takenCount === totalCount && totalCount > 0;

  return (
    <div className="w-full bg-[#151925] rounded-3xl p-5 border border-white/5 flex flex-col shadow-lg">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex flex-col">
           <Pill size={14} className="text-emerald-400 mb-1" />
           <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase leading-none">
             MEDS ROUTINE
           </span>
           <span className="text-[10px] font-bold text-slate-500 uppercase leading-none">
             {allDone ? 'Routine Complete' : 'Due Soon'}
           </span>
        </div>
        
        {/* Status Box */}
        <div className={`px-3 py-1.5 rounded-xl border flex flex-col items-center justify-center min-w-[60px] transition-colors ${
          allDone 
            ? 'bg-emerald-900/20 border-emerald-500/20' 
            : 'bg-slate-800/40 border-white/5'
        }`}>
          <span className={`text-xs font-black ${allDone ? 'text-emerald-400' : 'text-slate-200'}`}>
            {takenCount}/{totalCount}
          </span>
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">
            TAKEN
          </span>
        </div>
      </div>

      {/* Meds List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 mt-3">
        {medications.map((med) => (
          <div 
            key={med.id}
            className={`group flex items-center justify-between p-3 rounded-xl transition-all ${
              med.taken 
                ? 'bg-slate-800/20 opacity-50' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {/* Left Side */}
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                med.taken ? 'bg-slate-800/50 text-slate-600' : 'bg-indigo-500/10 text-indigo-400'
              }`}>
                <Pill size={16} />
              </div>
              
              {/* Text Info */}
              <div className="flex flex-col gap-0.5">
                <span className={`text-xs font-bold ${med.taken ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                  {med.name}
                </span>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] text-slate-500 font-medium">{med.dosage}</span>
                   <div className="flex items-center gap-1">
                      <Clock size={8} className="text-indigo-400" />
                      <span className="text-[9px] text-indigo-300 font-mono">{med.time}</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Action Checkbox */}
            <button 
              onClick={() => onTake(med.id)}
              disabled={med.taken}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                med.taken 
                  ? 'bg-transparent text-emerald-500' 
                  : 'bg-slate-800 text-slate-600 hover:bg-emerald-500 hover:text-white border border-white/10'
              }`}
            >
              <Check size={14} strokeWidth={3} />
            </button>
          </div>
        ))}
        
        {/* Add New Button */}
        <button onClick={onAddMed} className="w-full text-indigo-400 hover:text-indigo-300 text-xs font-bold mt-3 py-2 border border-dashed border-indigo-500/30 rounded-xl flex items-center justify-center gap-2">
            <Plus size={14}/> Add New Medication
        </button>
      </div>
    </div>
  );
};

export default MedicationManager;