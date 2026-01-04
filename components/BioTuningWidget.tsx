import React, { useState, useEffect } from 'react';
import { Play, Pause, Zap, Moon, X, Wind } from 'lucide-react';

interface BioTuningWidgetProps {
  currentStress: number;
  currentEnergy: number;
}

const BioTuningWidget: React.FC<BioTuningWidgetProps> = () => {
  const [activeProgram, setActiveProgram] = useState<'focus' | 'calm' | null>(null);
  const [breathPhase, setBreathPhase] = useState('Inhale');
  const [timer, setTimer] = useState(0);

  // Breathing Logic (4-7-8 Technique for Calm, Box for Focus)
  useEffect(() => {
    if (!activeProgram) return;

    const interval = setInterval(() => {
      setTimer(t => t + 1);
      
      // Simple 4-4-4-4 Box Breathing Cycle (16s total)
      const t = timer % 16;
      if (t < 4) setBreathPhase('Inhale');
      else if (t < 8) setBreathPhase('Hold');
      else if (t < 12) setBreathPhase('Exhale');
      else setBreathPhase('Hold');
      
    }, 1000);

    return () => clearInterval(interval);
  }, [activeProgram, timer]);

  return (
    <div className="relative w-full bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 overflow-hidden">
      
      {/* 1. SELECTION SCREEN */}
      <div className={`transition-all duration-500 ${activeProgram ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>
        <div className="flex gap-3">
          <button 
            onClick={() => { setActiveProgram('focus'); setTimer(0); }}
            className="flex-1 p-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-500 hover:border-indigo-200 hover:shadow-md transition-all group relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100/50 rounded-full -translate-y-6 translate-x-6 blur-xl" />
             <div className="p-2 bg-white rounded-xl w-fit mb-3 shadow-sm group-hover:scale-110 transition-transform">
               <Zap size={18} className="text-amber-500" />
             </div>
             <div className="text-left">
               <span className="block text-sm font-black text-slate-900">Focus</span>
               <span className="block text-[10px] font-medium text-slate-400 mt-0.5">Box Breathing</span>
             </div>
          </button>

          <button 
            onClick={() => { setActiveProgram('calm'); setTimer(0); }}
            className="flex-1 p-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-500 hover:border-indigo-200 hover:shadow-md transition-all group relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-16 h-16 bg-violet-100/50 rounded-full -translate-y-6 translate-x-6 blur-xl" />
             <div className="p-2 bg-white rounded-xl w-fit mb-3 shadow-sm group-hover:scale-110 transition-transform">
               <Moon size={18} className="text-violet-500" />
             </div>
             <div className="text-left">
               <span className="block text-sm font-black text-slate-900">Relax</span>
               <span className="block text-[10px] font-medium text-slate-400 mt-0.5">4-7-8 Breath</span>
             </div>
          </button>
        </div>
      </div>

      {/* 2. ACTIVE BREATHING SESSION OVERLAY */}
      {activeProgram && (
        <div className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
           {/* Close Button */}
           <button 
             onClick={() => setActiveProgram(null)}
             className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
           >
             <X size={16} />
           </button>

           {/* Breathing Animation Circle */}
           <div className="relative flex items-center justify-center mb-4">
              {/* Expanding Ring */}
              <div 
                className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-[4000ms] ease-in-out
                ${breathPhase === 'Inhale' ? 'scale-110 border-indigo-500 bg-indigo-50' : 
                  breathPhase === 'Exhale' ? 'scale-75 border-slate-200 bg-slate-50' : 
                  'scale-100 border-indigo-300'}`}
              >
                <Wind size={32} className={`transition-colors duration-1000 ${breathPhase === 'Inhale' ? 'text-indigo-600' : 'text-slate-300'}`} />
              </div>
              
              {/* Pulsing Aura */}
              <div className={`absolute inset-0 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-[4000ms] ${breathPhase === 'Inhale' ? 'scale-150 opacity-100' : 'scale-50 opacity-0'}`} />
           </div>

           {/* Text Guide */}
           <div className="text-center">
             <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest transition-all">{breathPhase}</h3>
             <p className="text-xs font-medium text-slate-400 mt-1">
               {activeProgram === 'focus' ? 'Box Breathing Technique' : 'Relaxation Rhythm'}
             </p>
           </div>
        </div>
      )}

    </div>
  );
};

export default BioTuningWidget;