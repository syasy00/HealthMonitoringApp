import React, { useState, useEffect } from 'react';
import { Scan, Camera, X, Check, AlertTriangle, Utensils, Zap, Droplets } from 'lucide-react';

interface ScannedFood {
  name: string;
  calories: number;
  bioImpact: {
    metric: string;
    change: number;
    unit: string;
    isPositive: boolean;
  }[];
  warning?: string;
}

interface NutriScannerProps {
  onClose: () => void;
  onLogFood: (food: ScannedFood) => void;
}

const NutriScanner: React.FC<NutriScannerProps> = ({ onClose, onLogFood }) => {
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<ScannedFood | null>(null);

  // Simulate AI Analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      setScanning(false);
      setResult({
        name: 'Avocado Toast',
        calories: 320,
        bioImpact: [
          { metric: 'Energy', change: 15, unit: '%', isPositive: true },
          { metric: 'Satiety', change: 40, unit: '%', isPositive: true },
        ],
        warning: undefined // Or "High Sodium" etc.
      });
    }, 2500); // 2.5s scan simulation

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-xl animate-[fadeIn_0.3s]">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-6">
        <div className="flex items-center gap-2">
           <Scan size={18} className="text-indigo-400" />
           <span className="text-xs font-bold text-white tracking-widest uppercase">Nutri-Scan</span>
        </div>
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition">
           <X size={18} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
         
         {/* Scanning Viewfinder */}
         {scanning ? (
           <div className="relative w-64 h-64 rounded-3xl border-2 border-indigo-500/30 overflow-hidden flex items-center justify-center bg-slate-900/50">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&q=80')] bg-cover bg-center opacity-50 grayscale animate-pulse"></div>
              
              {/* Scan Line Animation */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_20px_#6366f1] animate-[scan_2s_infinite_linear]"></div>
              
              <div className="z-10 flex flex-col items-center gap-3">
                 <div className="p-3 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-500/50 animate-bounce">
                    <Camera size={24} className="text-indigo-400" />
                 </div>
                 <p className="text-xs font-mono text-indigo-300 font-bold uppercase tracking-wider">Analyzing...</p>
              </div>
           </div>
         ) : result ? (
           // Result Card
           <div className="w-full max-w-sm bg-[#151925] border border-white/10 rounded-3xl p-5 shadow-2xl animate-[slideUp_0.3s]">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-lg font-black text-white">{result.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{result.calories} kcal • Good Source of Fat</p>
                 </div>
                 <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <Check size={20} className="text-emerald-400" />
                 </div>
              </div>

              {/* Bio Impact Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                 {result.bioImpact.map((impact, idx) => (
                   <div key={idx} className="bg-slate-800/40 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${impact.isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                         {impact.metric === 'Energy' ? <Zap size={14} /> : <Utensils size={14} />}
                      </div>
                      <div>
                         <p className="text-[9px] text-slate-500 uppercase font-bold">{impact.metric}</p>
                         <p className={`text-xs font-black ${impact.isPositive ? 'text-white' : 'text-red-200'}`}>
                           {impact.change > 0 ? '+' : ''}{impact.change}{impact.unit}
                         </p>
                      </div>
                   </div>
                 ))}
              </div>

              <button 
                onClick={() => onLogFood(result)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-indigo-900/20"
              >
                Log Meal
              </button>
           </div>
         ) : null}

      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default NutriScanner;