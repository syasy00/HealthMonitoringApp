import React, { useState, useEffect } from 'react';
import { Thermometer, ShieldAlert, Unlock, Pill, Moon, Sun, Snowflake, Flame, Info, X, ArrowLeft } from 'lucide-react';

const SmartDeviceGrid: React.FC = () => {
  const [temp, setTemp] = useState(22);
  const [isLocked, setIsLocked] = useState(true);
  const [medsDispensed, setMedsDispensed] = useState(false);
  const [lightMode, setLightMode] = useState<'circadian' | 'calm'>('circadian');
  
  // HFE: View State instead of Overlay
  const [viewMode, setViewMode] = useState<'controls' | 'help'>('controls');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleAction = (action: () => void, message: string) => {
    action();
    setFeedback(message);
  };

  // Cleaner button style: Borderless, subtle background, slightly shorter min-height
  const btnClass = "relative overflow-hidden bg-slate-800/30 rounded-2xl p-3 flex flex-col justify-between transition-all hover:bg-slate-800/50 active:scale-95 group min-h-[100px]";

  // HELP VIEW (Clean, dedicated space)
  if (viewMode === 'help') {
    return (
      <div className="h-full bg-slate-800/40 rounded-2xl p-4 border border-white/5 relative animate-[fadeIn_0.2s]">
        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
           <h3 className="text-xs font-bold text-white flex items-center gap-2">
             <Info size={14} className="text-indigo-400" /> Device Context
           </h3>
           <button onClick={() => setViewMode('controls')} className="text-slate-400 hover:text-white">
             <X size={16} />
           </button>
        </div>
        <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[220px] pr-1">
           <div className="flex gap-3">
             <div className="mt-0.5 p-1 bg-cyan-500/10 rounded text-cyan-400 shrink-0 h-fit"><Snowflake size={12} /></div>
             <div>
               <p className="text-xs font-bold text-slate-200">Fever Control</p>
               <p className="text-[10px] text-slate-500">Cooling protocol to prevent hyperthermia.</p>
             </div>
           </div>
           <div className="flex gap-3">
             <div className="mt-0.5 p-1 bg-emerald-500/10 rounded text-emerald-400 shrink-0 h-fit"><Pill size={12} /></div>
             <div>
               <p className="text-xs font-bold text-slate-200">Adherence</p>
               <p className="text-[10px] text-slate-500">Automated dosing prevents medication errors.</p>
             </div>
           </div>
           <div className="flex gap-3">
             <div className="mt-0.5 p-1 bg-red-500/10 rounded text-red-400 shrink-0 h-fit"><ShieldAlert size={12} /></div>
             <div>
               <p className="text-xs font-bold text-slate-200">EMS Protocol</p>
               <p className="text-[10px] text-slate-500">Auto-unlocks entry for emergency responders.</p>
             </div>
           </div>
           <div className="flex gap-3">
             <div className="mt-0.5 p-1 bg-purple-500/10 rounded text-purple-400 shrink-0 h-fit"><Moon size={12} /></div>
             <div>
               <p className="text-xs font-bold text-slate-200">Light Therapy</p>
               <p className="text-[10px] text-slate-500">Regulates cortisol and circadian rhythm.</p>
             </div>
           </div>
        </div>
        <button 
          onClick={() => setViewMode('controls')}
          className="mt-4 w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold rounded-xl transition-colors"
        >
          Return to Controls
        </button>
      </div>
    );
  }

  // CONTROLS VIEW
  return (
    <div className="relative h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 px-1">
         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Medical Controls</h3>
         <button 
           onClick={() => setViewMode('help')}
           className="text-slate-600 hover:text-indigo-400 transition p-1"
           title="Explain features"
         >
           <Info size={14} />
         </button>
      </div>

      <div className="grid grid-cols-2 gap-2 flex-1 relative">
        
        {/* 1. Fever Management */}
        <div className={btnClass}>
          <div className="flex justify-between items-start mb-1">
            <div className={`p-1.5 rounded-full ${temp < 20 ? 'bg-cyan-500/20 text-cyan-400' : (temp > 24 ? 'bg-orange-500/20 text-orange-400' : 'bg-indigo-500/20 text-indigo-400')}`}>
              {temp < 20 ? <Snowflake size={14} /> : (temp > 24 ? <Flame size={14} /> : <Thermometer size={14} />)}
            </div>
            <div className="text-right">
               <span className="text-lg font-bold text-white">{temp}°</span>
            </div>
          </div>
          
          <div className="mt-auto space-y-2">
             {/* Simplified Manual Controls */}
             <div className="flex justify-between items-center text-slate-400 text-xs font-bold bg-slate-900/20 rounded-lg">
               <button onClick={(e) => {e.stopPropagation(); setTemp(t => t-1)}} className="px-3 py-1 hover:text-white hover:bg-white/5 rounded">-</button>
               <button onClick={(e) => {e.stopPropagation(); setTemp(t => t+1)}} className="px-3 py-1 hover:text-white hover:bg-white/5 rounded">+</button>
             </div>
             
             {/* Preset Button */}
             <button 
               onClick={() => handleAction(() => setTemp(temp > 21 ? 18 : 24), "Protocol Activated")}
               className={`w-full text-[9px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors ${
                 temp > 21 
                   ? 'bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20' 
                   : 'bg-orange-500/10 text-orange-300 hover:bg-orange-500/20'
               }`}
             >
               {temp > 21 ? 'COOL DOWN' : 'WARM UP'}
             </button>
          </div>
        </div>

        {/* 2. Adherence (Meds) */}
        <button 
          onClick={() => handleAction(() => setMedsDispensed(true), "Logged: 4pm Dose Taken")}
          disabled={medsDispensed}
          className={`${btnClass} ${medsDispensed ? 'opacity-50' : 'hover:bg-slate-800/50'}`}
        >
          <div className={`p-1.5 rounded-full w-fit ${medsDispensed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
            <Pill size={14} />
          </div>
          <div className="text-left">
            <p className="text-[9px] text-slate-500 font-bold uppercase">Meds</p>
            <p className={`text-xs font-bold ${medsDispensed ? 'text-emerald-400' : 'text-slate-200'}`}>
              {medsDispensed ? 'Dispensed' : 'Dispense'}
            </p>
          </div>
        </button>

        {/* 3. EMS Protocol */}
        <button 
          onClick={() => handleAction(() => setIsLocked(!isLocked), !isLocked ? "Door Secured" : "EMS Access Enabled")}
          className={`${btnClass} ${!isLocked ? 'bg-red-900/10' : ''}`}
        >
          <div className={`p-1.5 rounded-full w-fit ${isLocked ? 'bg-slate-700/50 text-slate-400' : 'bg-red-500/20 text-red-400 animate-pulse'}`}>
            {isLocked ? <ShieldAlert size={14} /> : <Unlock size={14} />}
          </div>
          <div className="text-left">
            <p className="text-[9px] text-slate-500 font-bold uppercase">EMS Access</p>
            <p className={`text-xs font-bold ${isLocked ? 'text-slate-200' : 'text-red-400'}`}>
              {isLocked ? 'Secured' : 'Auto-Open'}
            </p>
          </div>
        </button>

        {/* 4. Light Therapy */}
        <button 
          onClick={() => handleAction(() => setLightMode(m => m === 'circadian' ? 'calm' : 'circadian'), "Light Therapy Adjusted")}
          className={btnClass}
        >
          <div className={`p-1.5 rounded-full w-fit ${lightMode === 'calm' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'}`}>
            {lightMode === 'calm' ? <Moon size={14} /> : <Sun size={14} />}
          </div>
          <div className="text-left">
            <p className="text-[9px] text-slate-500 font-bold uppercase">Therapy</p>
            <p className={`text-xs font-bold ${lightMode === 'calm' ? 'text-purple-300' : 'text-slate-200'}`}>
              {lightMode === 'calm' ? 'Calm' : 'Circadian'}
            </p>
          </div>
        </button>
      </div>
      
      {/* Sleek Feedback Bar */}
      {feedback && (
        <div className="absolute -top-8 left-0 right-0 bg-emerald-500/90 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg flex items-center justify-center animate-[slideDown_0.2s] z-30">
           {feedback}
        </div>
      )}
    </div>
  );
};

export default SmartDeviceGrid;