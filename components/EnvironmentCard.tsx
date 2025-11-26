import React, { useState } from 'react';
import { Thermometer, Fan } from 'lucide-react';

const EnvironmentCard: React.FC = () => {
  const [temp, setTemp] = useState(22);
  const [isPurifying, setIsPurifying] = useState(false);

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-4 flex flex-col justify-between overflow-hidden relative transition-all hover:bg-slate-800/60">
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1">
            Smart Room
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-white">{temp}°C</span>
            <span className="text-[10px] text-slate-500">Target</span>
          </div>
        </div>
        <button 
           onClick={() => setIsPurifying(!isPurifying)}
           className={`p-2 rounded-full transition-all ${isPurifying ? 'bg-indigo-500/20 text-indigo-400 animate-spin' : 'bg-slate-900/30 text-slate-500'}`}
        >
           <Fan size={16} />
        </button>
      </div>

      <div className="flex gap-2">
         <div className="flex-1 bg-slate-900/30 rounded-xl flex items-center justify-between px-3 py-2 border border-white/5">
            <button onClick={() => setTemp(t => t-1)} className="text-slate-400 hover:text-white active:scale-90 transition font-medium">-</button>
            <Thermometer size={14} className="text-slate-600" />
            <button onClick={() => setTemp(t => t+1)} className="text-slate-400 hover:text-white active:scale-90 transition font-medium">+</button>
         </div>
         <button
           onClick={() => setIsPurifying(!isPurifying)}
           className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-all active:scale-95 ${isPurifying ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800'}`}
         >
           {isPurifying ? 'Active' : 'Purify'}
         </button>
      </div>
    </div>
  );
};

export default EnvironmentCard;