
import React, { useState, useEffect } from 'react';
import { Scan, Camera, Utensils, Zap, Droplets, AlertTriangle, Check } from 'lucide-react';
import { ScannedFood } from '../types';

const NutriScannerWidget: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScannedFood | null>(null);

  const simulateScan = () => {
    setIsScanning(true);
    setScanResult(null);
    
    // Mock Scan Delay
    setTimeout(() => {
      setIsScanning(false);
      // Mock AI Result
      setScanResult({
        name: 'Spicy Ramen Bowl',
        calories: 540,
        warning: 'High Sodium Content',
        bioImpact: [
          { metric: 'Hydration', change: -12, unit: '%', isPositive: false },
          { metric: 'Body Temp', change: +0.4, unit: '°C', isPositive: false },
          { metric: 'Energy', change: +15, unit: 'pts', isPositive: true },
        ]
      });
    }, 2500);
  };

  const reset = () => {
    setScanResult(null);
  };

  return (
    <div className="w-full relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-800/40 backdrop-blur-sm p-4 min-h-[180px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
         <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
           <Scan size={14} className="text-indigo-400" /> Bio-Nutri Scanner
         </h3>
         <span className="text-[9px] bg-slate-900/50 px-2 py-1 rounded text-slate-500 border border-white/5">
           AI METABOLIC ANALYSIS
         </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        
        {/* IDLE STATE */}
        {!isScanning && !scanResult && (
          <button 
            onClick={simulateScan}
            className="group relative flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-600 flex items-center justify-center group-hover:border-indigo-500 group-hover:bg-slate-800 transition-colors">
               <Camera size={24} className="text-slate-500 group-hover:text-indigo-400" />
            </div>
            <p className="text-xs font-bold text-slate-400 group-hover:text-white">Tap to Scan Meal</p>
          </button>
        )}

        {/* SCANNING STATE */}
        {isScanning && (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
             <div className="absolute inset-0 bg-indigo-500/5 animate-pulse rounded-xl"></div>
             <div className="w-full h-1 bg-indigo-500 shadow-[0_0_15px_#6366f1] absolute top-0 animate-[scan_2s_infinite_linear]"></div>
             
             <div className="flex flex-col items-center gap-2 z-10">
                <Utensils size={24} className="text-indigo-300 animate-bounce" />
                <p className="text-xs font-mono text-indigo-300">ANALYZING BIO-STRUCTURE...</p>
             </div>
          </div>
        )}

        {/* RESULT STATE */}
        {scanResult && (
          <div className="w-full animate-[fadeIn_0.3s]">
             <div className="flex items-start justify-between mb-3">
               <div>
                 <h4 className="text-lg font-bold text-white leading-none">{scanResult.name}</h4>
                 <p className="text-xs text-slate-500 mt-1">{scanResult.calories} kcal • Processed</p>
               </div>
               <button onClick={reset} className="p-1 bg-slate-700/50 rounded-full hover:bg-slate-600 text-slate-400">
                 <Check size={14} />
               </button>
             </div>

             {scanResult.warning && (
               <div className="mb-3 flex items-center gap-2 bg-amber-900/20 border border-amber-500/30 px-3 py-2 rounded-lg">
                  <AlertTriangle size={14} className="text-amber-400" />
                  <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wide">Warning: {scanResult.warning}</span>
               </div>
             )}

             <div className="grid grid-cols-3 gap-2">
               {scanResult.bioImpact.map((impact, idx) => (
                 <div key={idx} className="bg-slate-900/60 rounded-lg p-2 border border-white/5 flex flex-col items-center text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-bold mb-1">{impact.metric}</span>
                    <span className={`text-sm font-bold ${impact.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {impact.change > 0 ? '+' : ''}{impact.change}{impact.unit}
                    </span>
                 </div>
               ))}
             </div>
          </div>
        )}
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

export default NutriScannerWidget;
