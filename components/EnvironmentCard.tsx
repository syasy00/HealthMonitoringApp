import React, { useState } from 'react';
import { Thermometer, Fan } from 'lucide-react';

const EnvironmentCard: React.FC = () => {
  const [temp, setTemp] = useState(22);
  const [isPurifying, setIsPurifying] = useState(false);

  return (
    <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex flex-col justify-between overflow-hidden relative group transition-all hover:bg-slate-800/60">
      {/* Background Gradient for "Active" state */}
      <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent transition-opacity duration-500 pointer-events-none ${isPurifying ? 'opacity-100' : 'opacity-0'}`} />

      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col">
          <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold flex items-center gap-1">
            Smart Room
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-white">{temp}°C</span>
            <span className="text-[10px] text-slate-500">AC</span>
          </div>
        </div>
        <div className={`p-2 rounded-full bg-slate-700/50 text-slate-300 transition-all ${isPurifying ? 'animate-spin text-indigo-400 bg-indigo-900/30' : ''}`}>
           <Fan size={16} />
        </div>
      </div>

      <div className="mt-3 flex gap-2 z-10">
         <div className="flex-1 bg-slate-900/50 rounded-lg flex items-center justify-between px-2 py-1 border border-white/5">
            <button onClick={(e) => { e.stopPropagation(); setTemp(t => t-1)}} className="p-1 hover:text-indigo-400 text-slate-400 active:scale-90 transition">-</button>
            <Thermometer size={14} className="text-slate-600" />
            <button onClick={(e) => { e.stopPropagation(); setTemp(t => t+1)}} className="p-1 hover:text-indigo-400 text-slate-400 active:scale-90 transition">+</button>
         </div>
         <button
           onClick={(e) => { e.stopPropagation(); setIsPurifying(!isPurifying)}}
           className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all active:scale-95 ${isPurifying ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/20' : 'bg-slate-700/50 border-transparent text-slate-400 hover:bg-slate-700'}`}
         >
           {isPurifying ? 'Active' : 'Purify'}
         </button>
      </div>
    </div>
  );
};

export default EnvironmentCard;