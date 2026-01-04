import React, { useState, useEffect } from 'react';
import { X, Camera, Scan, Sparkles, Check, Clock, Utensils } from 'lucide-react';

interface NutriScannerProps {
  onClose: () => void;
  onLogFood: (food: { name: string; calories: number }) => void;
  history?: { name: string; calories: number; timestamp: Date }[];
}

const NutriScanner: React.FC<NutriScannerProps> = ({ onClose, onLogFood, history = [] }) => {
  const [scanning, setScanning] = useState(true);
  const [detected, setDetected] = useState<{name: string, calories: number} | null>(null);
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');

  // Simulate scanning process
  useEffect(() => {
    if (activeTab === 'scan' && scanning) {
        const timer = setTimeout(() => {
            setScanning(false);
            setDetected({ name: 'Avocado Toast & Egg', calories: 450 });
        }, 2500);
        return () => clearTimeout(timer);
    }
  }, [activeTab, scanning]);

  const handleReset = () => {
      setScanning(true);
      setDetected(null);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col relative animate-in slide-in-from-bottom duration-300">
      
      {/* Navbar */}
      <div className="flex justify-between items-center p-6 bg-white z-20 border-b border-slate-100">
         <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
            <Scan size={20} className="text-orange-500"/> NutriAI
         </h3>
         <button onClick={onClose} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100">
             <X size={20} className="text-slate-500" />
         </button>
      </div>

      {/* TABS */}
      <div className="flex p-2 gap-2 mx-6 mt-2 bg-slate-50 rounded-xl">
          <button 
            onClick={() => setActiveTab('scan')} 
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'scan' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
          >
              Scanner
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
          >
              Log History
          </button>
      </div>

      {/* SCANNER VIEW */}
      {activeTab === 'scan' && (
          <div className="flex-1 flex flex-col p-6 relative">
            <div className="flex-1 bg-slate-100 rounded-[2rem] overflow-hidden relative border-2 border-slate-200">
                
                {/* Simulated Camera Feed */}
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                    <p className="text-slate-400 font-medium text-xs">Camera Feed Active</p>
                </div>
                
                {scanning && (
                    <div className="absolute inset-0 bg-black/5 flex flex-col items-center justify-center gap-4">
                        <div className="w-48 h-48 border-2 border-white/50 rounded-[2rem] relative animate-pulse">
                            <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.5)] animate-[scan_2s_linear_infinite]" />
                        </div>
                        <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-slate-600 shadow-lg">
                            Analyzing food...
                        </span>
                    </div>
                )}

                {!scanning && detected && (
                     <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-end p-6 animate-in fade-in">
                        <div className="w-full bg-white rounded-3xl p-5 shadow-2xl mb-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="text-xl font-black text-slate-900">{detected.name}</h4>
                                    <div className="flex items-center gap-1 text-orange-500 text-xs font-bold mt-1">
                                        <Sparkles size={12} /> High Protein
                                    </div>
                                </div>
                                <span className="text-2xl font-black text-slate-900">{detected.calories} <span className="text-xs text-slate-400 font-bold">kcal</span></span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <div className="bg-slate-50 p-2 rounded-xl text-center">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Carbs</span>
                                    <span className="text-sm font-bold text-slate-700">45g</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-xl text-center">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Protein</span>
                                    <span className="text-sm font-bold text-slate-700">18g</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-xl text-center">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Fat</span>
                                    <span className="text-sm font-bold text-slate-700">22g</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => onLogFood(detected)}
                                className="w-full mt-4 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 flex items-center justify-center gap-2"
                            >
                                <Check size={18} strokeWidth={3} /> Log this meal
                            </button>
                        </div>
                        <button onClick={handleReset} className="text-white text-xs font-bold underline opacity-80 hover:opacity-100">
                            Scan something else
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-center">
                <button className="w-16 h-16 rounded-full border-4 border-slate-200 flex items-center justify-center bg-white shadow-sm hover:border-orange-200 transition-all">
                    <div className="w-12 h-12 rounded-full bg-orange-500" />
                </button>
            </div>
          </div>
      )}

      {/* HISTORY VIEW */}
      {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Today's Logs</h4>
              {history.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                      <p className="text-sm">No meals logged yet.</p>
                  </div>
              ) : (
                  history.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-500 shadow-sm">
                                  <Utensils size={18} />
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                      <Clock size={10} /> {item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </p>
                              </div>
                          </div>
                          <span className="text-sm font-black text-slate-900">{item.calories} kcal</span>
                      </div>
                  ))
              )}
          </div>
      )}
    </div>
  );
};

export default NutriScanner;