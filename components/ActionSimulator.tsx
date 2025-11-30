
import React, { useState } from 'react';
import { SimulationAction } from '../types';
import { Pill, Wind, Moon, AlertTriangle, Coffee, Utensils, Zap, Droplets, RotateCcw, HelpCircle, X, Sparkles, Play } from 'lucide-react';

interface ActionSimulatorProps {
  onSimulate: (action: SimulationAction, isRisk: boolean) => void;
  onClear: () => void;
  activeActionId: string | null;
}

const healthyActions: SimulationAction[] = [
  {
    id: 'water',
    label: 'Drink Water',
    icon: Droplets,
    color: 'bg-blue-500',
    effect: { hydration: { value: 95, status: 'normal', unit: '%', id: 'hydro', name: 'Hydration', trend: 'up', history: [], description: '' }, energyLevel: 85 },
    description: 'Boosts hydration + Energy'
  },
  {
    id: 'meds',
    label: 'Take Meds',
    icon: Pill,
    color: 'bg-emerald-500',
    effect: { bloodPressureSys: { value: 118, status: 'normal', unit: 'mmHg', id: 'bp', name: 'BP', trend: 'down', history: [], description: '' }, heartRate: { value: 72, status: 'normal', unit: 'bpm', id: 'hr', name: 'HR', trend: 'down', history: [], description: '' } },
    description: 'Stabilizes BP & Heart Rate'
  },
  {
    id: 'breathe',
    label: 'Deep Breath',
    icon: Wind,
    color: 'bg-indigo-500',
    effect: { stressLevel: { value: 25, status: 'normal', unit: '/100', id: 'stress', name: 'Stress', trend: 'down', history: [], description: '' }, heartRate: { value: 65, status: 'normal', unit: 'bpm', id: 'hr', name: 'HR', trend: 'down', history: [], description: '' } },
    description: 'Lowers Cortisol (Stress)'
  },
  {
    id: 'rest',
    label: 'Short Nap',
    icon: Moon,
    color: 'bg-purple-500',
    effect: { energyLevel: 95, stressLevel: { value: 15, status: 'normal', unit: '/100', id: 'stress', name: 'Stress', trend: 'down', history: [], description: '' } },
    description: 'Restores Energy Battery'
  }
];

const riskFactors: SimulationAction[] = [
  {
    id: 'skip_meds',
    label: 'Skip Meds',
    icon: AlertTriangle,
    color: 'bg-red-500',
    effect: { bloodPressureSys: { value: 155, status: 'critical', unit: 'mmHg', id: 'bp', name: 'BP', trend: 'up', history: [], description: '' }, heartRate: { value: 110, status: 'warning', unit: 'bpm', id: 'hr', name: 'HR', trend: 'up', history: [], description: '' }, stressLevel: { value: 75, status: 'warning', unit: '/100', id: 'stress', name: 'Stress', trend: 'up', history: [], description: '' } },
    description: 'Spikes Blood Pressure'
  },
  {
    id: 'caffeine',
    label: 'Double Coffee',
    icon: Coffee,
    color: 'bg-amber-600',
    effect: { heartRate: { value: 105, status: 'warning', unit: 'bpm', id: 'hr', name: 'HR', trend: 'up', history: [], description: '' }, hydration: { value: 30, status: 'warning', unit: '%', id: 'hydro', name: 'Hydration', trend: 'down', history: [], description: '' }, stressLevel: { value: 65, status: 'warning', unit: '/100', id: 'stress', name: 'Stress', trend: 'up', history: [], description: '' } },
    description: 'Increases Heart Rate'
  },
  {
    id: 'salt',
    label: 'Salty Meal',
    icon: Utensils,
    color: 'bg-orange-500',
    effect: { bloodPressureSys: { value: 145, status: 'warning', unit: 'mmHg', id: 'bp', name: 'BP', trend: 'up', history: [], description: '' }, hydration: { value: 40, status: 'warning', unit: '%', id: 'hydro', name: 'Hydration', trend: 'down', history: [], description: '' } },
    description: 'Causes Dehydration'
  },
  {
    id: 'panic',
    label: 'High Stress',
    icon: Zap,
    color: 'bg-rose-600',
    effect: { heartRate: { value: 130, status: 'critical', unit: 'bpm', id: 'hr', name: 'HR', trend: 'up', history: [], description: '' }, oxygenLevel: { value: 94, status: 'warning', unit: '%', id: 'spo2', name: 'SpO2', trend: 'down', history: [], description: '' }, stressLevel: { value: 95, status: 'critical', unit: '/100', id: 'stress', name: 'Stress', trend: 'up', history: [], description: '' } },
    description: 'Triggers Fight-or-Flight'
  }
];

const ActionSimulator: React.FC<ActionSimulatorProps> = ({ onSimulate, onClear, activeActionId }) => {
  const [mode, setMode] = useState<'healthy' | 'risk'>('healthy');
  const [view, setView] = useState<'grid' | 'help'>('grid');

  const currentActions = mode === 'healthy' ? healthyActions : riskFactors;
  const isRiskActive = riskFactors.some(r => r.id === activeActionId);

  // HELP VIEW - SIMPLIFIED 3-STEP GUIDE
  if (view === 'help') {
     return (
       <div className="w-full h-full min-h-[160px] bg-slate-800/40 rounded-2xl border border-white/5 p-4 animate-[fadeIn_0.2s]">
         <div className="flex justify-between items-start mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
               <Sparkles size={14} className="text-indigo-400" /> Bio-Engine
            </h4>
            <button onClick={() => setView('grid')} className="text-slate-400 hover:text-white"><X size={16}/></button>
         </div>
         
         <div className="space-y-3 mb-3">
            <p className="text-xs text-slate-300 leading-relaxed">
              This tool predicts your body's reaction to different habits. 
              Tap an action to visualize the future effect on your vitals.
            </p>
         </div>
         
         <button onClick={() => setView('grid')} className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 rounded-lg text-xs font-bold text-indigo-300 transition border border-indigo-500/20">
           Return to Simulator
         </button>
       </div>
     );
  }

  // GRID VIEW
  return (
    <div className={`w-full relative rounded-2xl border p-4 transition-all duration-300 ${activeActionId ? 'bg-slate-800/60 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'bg-slate-800/30 border-white/5'}`}>
      <div className="flex justify-between items-center mb-4">
         <div>
           <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
             {activeActionId && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>}
             Body Simulator
           </h3>
           <p className="text-[10px] text-slate-500 font-medium">Test habits to predict future health</p>
         </div>
         
         <div className="flex gap-2">
            <button 
              onClick={() => setView('help')}
              className="text-slate-600 hover:text-indigo-400 transition p-1"
              title="Help"
            >
              <HelpCircle size={14} />
            </button>

            {/* Compact Mode Switcher */}
            <div className="flex bg-slate-900/50 rounded-lg p-0.5 border border-white/5">
                <button 
                  onClick={() => { setMode('healthy'); onClear(); }}
                  className={`px-2 py-0.5 text-[9px] font-bold rounded transition-all ${mode === 'healthy' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Health
                </button>
                <button 
                  onClick={() => { setMode('risk'); onClear(); }}
                  className={`px-2 py-0.5 text-[9px] font-bold rounded transition-all ${mode === 'risk' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Risk
                </button>
            </div>
         </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {currentActions.map((action) => {
          const isActive = activeActionId === action.id;
          const Icon = action.icon;
          
          return (
            <button
              key={action.id}
              onClick={() => isActive ? onClear() : onSimulate(action, mode === 'risk')}
              className={`relative flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? `${action.color} text-white shadow-lg scale-95 ring-2 ring-white/20` 
                  : 'bg-slate-800/40 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }`}
            >
              <Icon size={16} />
              <span className="text-[9px] font-bold truncate w-full text-center px-1 leading-tight">
                {action.label}
              </span>
              {isActive && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Active State Feedback Bar */}
      {activeActionId && (
        <div className="mt-3 flex justify-between items-center animate-[slideDown_0.2s] bg-slate-900/80 rounded-lg px-3 py-2 border border-indigo-500/30">
          <div className="flex items-center gap-2">
             <Play size={10} className="text-indigo-400 fill-indigo-400 animate-pulse" />
             <p className={`text-[10px] font-bold ${isRiskActive ? 'text-red-300' : 'text-indigo-300'}`}>
               Simulating: <span className="text-white font-normal">{[...healthyActions, ...riskFactors].find(a => a.id === activeActionId)?.description}</span>
             </p>
          </div>
          <button 
            onClick={onClear} 
            className="text-[9px] bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded font-bold transition flex items-center gap-1"
          >
            <RotateCcw size={10} /> STOP
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionSimulator;
