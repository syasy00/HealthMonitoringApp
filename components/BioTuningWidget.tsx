
import React, { useState, useEffect, useRef } from 'react';
import { BrainwaveMode } from '../types';
import { Waves, Play, Pause, Zap, Moon, Sun } from 'lucide-react';

interface BioTuningWidgetProps {
  currentStress: number;
  currentEnergy: number;
}

const BioTuningWidget: React.FC<BioTuningWidgetProps> = ({ currentStress, currentEnergy }) => {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<BrainwaveMode>('Neutral');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Suggest mode based on health data
  useEffect(() => {
    if (currentStress > 60) setMode('Relax');
    else if (currentEnergy < 40) setMode('Focus');
    else setMode('Neutral');
  }, [currentStress, currentEnergy]);

  // Wave Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      t += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      
      // Dynamic color based on mode
      let color = '#94a3b8'; // Neutral slate
      let amplitude = 10;
      let frequency = 0.05;
      let speed = 1;

      if (isActive) {
        if (mode === 'Relax') { color = '#818cf8'; amplitude = 15; frequency = 0.02; speed = 0.5; } // Slow Alpha (Indigo)
        if (mode === 'Focus') { color = '#34d399'; amplitude = 8; frequency = 0.1; speed = 2; } // Fast Gamma (Emerald)
        if (mode === 'Sleep') { color = '#f472b6'; amplitude = 25; frequency = 0.01; speed = 0.2; } // Deep Delta (Pink)
      } else {
        // "Stressed" jagged state if not active
        if (currentStress > 50) { color = '#f87171'; amplitude = 5; frequency = 0.3; speed = 3; }
      }

      ctx.strokeStyle = color;
      ctx.beginPath();

      for (let x = 0; x < canvas.width; x++) {
        // Jagged noise if stressed and not treating
        const noise = (!isActive && currentStress > 50) ? (Math.random() * 5) : 0;
        const y = canvas.height / 2 + Math.sin((x * frequency) + (t * speed)) * amplitude + noise;
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, mode, currentStress]);

  return (
    <div className="w-full glass-panel rounded-2xl p-4 border border-indigo-500/20 relative overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <div>
           <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
             <Waves size={16} className={isActive ? "text-indigo-400 animate-pulse" : "text-slate-500"} />
             Neuro-Tuning
           </h3>
           <p className="text-[10px] text-slate-400">
             {isActive ? `Entraining: ${mode} Protocol` : "Neural-Feedback Inactive"}
           </p>
        </div>
        
        {isActive ? (
           <button onClick={() => setIsActive(false)} className="p-2 bg-indigo-500/20 text-indigo-300 rounded-full hover:bg-indigo-500/30 transition">
             <Pause size={14} fill="currentColor" />
           </button>
        ) : (
           <button onClick={() => setIsActive(true)} className="p-2 bg-slate-800 text-slate-400 rounded-full hover:text-white border border-white/5 transition animate-pulse">
             <Play size={14} fill="currentColor" />
           </button>
        )}
      </div>

      {/* The Visualizer */}
      <div className="relative h-20 w-full bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden mb-3">
         <canvas ref={canvasRef} width={300} height={80} className="w-full h-full" />
         
         {!isActive && currentStress > 50 && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
             <span className="text-[10px] font-bold text-red-300 bg-red-900/50 px-2 py-1 rounded border border-red-500/20">
               ⚠️ High Beta Activity Detected
             </span>
           </div>
         )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
         {[
           { id: 'Relax', label: 'Calm', icon: Moon, color: 'hover:text-indigo-400 hover:border-indigo-500/50' },
           { id: 'Focus', label: 'Focus', icon: Zap, color: 'hover:text-emerald-400 hover:border-emerald-500/50' },
           { id: 'Sleep', label: 'Sleep', icon: Sun, color: 'hover:text-pink-400 hover:border-pink-500/50' },
         ].map((m) => (
           <button
             key={m.id}
             onClick={() => { setMode(m.id as BrainwaveMode); setIsActive(true); }}
             className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
               mode === m.id 
                 ? 'bg-slate-700 border-white/20 text-white shadow-lg' 
                 : `bg-slate-800/40 border-transparent text-slate-500 ${m.color}`
             }`}
           >
             <m.icon size={12} /> {m.label}
           </button>
         ))}
      </div>
    </div>
  );
};

export default BioTuningWidget;
