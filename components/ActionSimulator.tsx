import React, { useState } from 'react';
import { SimulationAction } from '../types';
import { Pill, Wind, Moon, AlertTriangle, Coffee, Utensils, Zap, Droplets, RotateCcw } from 'lucide-react';

interface ActionSimulatorProps {
  onSimulate: (action: SimulationAction, isRisk: boolean) => void;
  onClear: () => void;
  activeActionId: string | null;
}

const healthyActions: SimulationAction[] = [
  {
    id: 'water',
    label: 'Water',
    icon: Droplets,
    color: 'bg-blue-500',
    effect: { hydration: { value: 95, status: 'normal', unit: '%', id: 'hydro', name: 'Hydration', trend: 'up', history: [], description: '' }, energyLevel: 85 },
    description: 'Boosts hydration.'
  },
  {
    id: 'meds',
    label: 'Meds',
    icon: Pill,
    color: 'bg-emerald-500',
    effect: { bloodPressureSys: { value: 118, status: 'normal', unit: 'mmHg', id: 'bp', name: 'BP', trend: 'down', history: [], description: '' }, heartRate: { value: 72, status: 'normal', unit: 'bpm', id: 'hr', name: 'HR', trend: 'down', history: [], description: '' } },
    description: 'Stabilizes BP.'
  },
  {
    id: 'breathe',
    label: 'Breathe',
    icon: Wind,
    color: 'bg-indigo-500',
    effect: { stressLevel: { value: 25, status: 'normal', unit: '/100', id: 'stress', name: 'Stress', trend: 'down', history: [], description: '' }, heartRate: { value: 65, status: 'normal', unit: 'bpm', id: 'hr', name: 'HR', trend: 'down', history: [], description: '' } },
    description: 'Reduces cortisol.'
  },
  {
    id: 'rest',
    label: 'Rest',
    icon: Moon,
    color: 'bg-purple-500',
    effect: { energyLevel: 95, stressLevel: { value: 15, status: 'normal', unit: '/100', id: 'stress', name: 'Stress', trend: 'down', history: [], description: '' } },
    description: 'Restores energy.'
  }
];

const riskFactors: SimulationAction[] = [
  {
    id: 'skip_meds',
    label: 'Skip Meds',
    icon: AlertTriangle,
    color: 'bg-red-500',
    effect: { bloodPressureSys: { value: 155, status: 'critical', unit: 'mmHg', id: 'bp', name: 'BP', trend: 'up', history: [], description: '' }, heartRate: { value: 110, status: 'warning', unit: 'bpm', id: 'hr', name: 'HR', trend: 'up', history: [], description: '' }, stressLevel: { value: 75, status: 'warning', unit: '/100', id: 'stress', name: 'Stress', trend: 'up', history: [], description: '' } },
    description: 'High BP risk.'
  },
  {
    id: 'caffeine',
    label: 'Caffeine',
    icon: Coffee,
    color: 'bg-amber-600',
    effect: { heartRate: { value: 105, status: 'warning', unit: 'bpm', id: 'hr', name: 'HR', trend: 'up', history: [], description: '' }, hydration: { value: 30, status: 'warning', unit: '%', id: 'hydro', name: 'Hydration', trend: 'down', history: [], description: '' }, stressLevel: { value: 65, status: 'warning', unit: '/100', id: 'stress', name: 'Stress', trend: 'up', history: [], description: '' } },
    description: 'HR spike.'
  },
  {
    id: 'salt',
    label: 'High Salt',
    icon: Utensils,
    color: 'bg-orange-500',
    effect: { bloodPressureSys: { value: 145, status: 'warning', unit: 'mmHg', id: 'bp', name: 'BP', trend: 'up', history: [], description: '' }, hydration: { value: 40, status: 'warning', unit: '%', id: 'hydro', name: 'Hydration', trend: 'down', history: [], description: '' } },
    description: 'Fluid retention.'
  },
  {
    id: 'panic',
    label: 'Panic',
    icon: Zap,
    color: 'bg-rose-600',
    effect: { heartRate: { value: 130, status: 'critical', unit: 'bpm', id: 'hr', name: 'HR', trend: 'up', history: [], description: '' }, oxygenLevel: { value: 94, status: 'warning', unit: '%', id: 'spo2', name: 'SpO2', trend: 'down', history: [], description: '' }, stressLevel: { value: 95, status: 'critical', unit: '/100', id: 'stress', name: 'Stress', trend: 'up', history: [], description: '' } },
    description: 'Stress response.'
  }
];

const ActionSimulator: React.FC<ActionSimulatorProps> = ({ onSimulate, onClear, activeActionId }) => {
  const [mode, setMode] = useState<'healthy' | 'risk'>('healthy');

  const currentActions = mode === 'healthy' ? healthyActions : riskFactors;
  const isRiskActive = riskFactors.some(r => r.id === activeActionId);

  return (
    <div className="w-full relative bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/5 p-4 transition-all hover:bg-slate-800/60">
      <div className="flex justify-between items-start mb-4">
         <div className="flex flex-col gap-0.5">
           <div className="flex items-center gap-2">
             <div className={`w-1.5 h-1.5 rounded-full ${mode === 'healthy' ? 'bg-indigo-400' : 'bg-red-400'}`} />
             <h3 className="text-sm font-bold text-slate-200">Action Preview</h3>
           </div>
           <p className="text-[10px] text-slate-500 ml-3.5">Tap to see body reaction</p>
         </div>
         <div className="flex bg-slate-900/50 rounded-lg p-0.5 border border-white/5">
            <button 
              onClick={() => { setMode('healthy'); onClear(); }}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${mode === 'healthy' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Health
            </button>
            <button 
              onClick={() => { setMode('risk'); onClear(); }}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${mode === 'risk' ? 'bg-red-900/50 text-red-200 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Risk
            </button>
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
              className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? `${action.color} text-white shadow-lg scale-105` 
                  : 'bg-slate-900/30 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              <Icon size={18} />
              <span className="text-[9px] font-bold truncate w-full text-center">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {activeActionId && (
        <div className="mt-3 flex justify-between items-center animate-[fadeIn_0.2s] bg-slate-900/40 rounded-lg p-2">
          <p className={`text-xs font-medium ${isRiskActive ? 'text-red-300' : 'text-indigo-300'}`}>
             {isRiskActive ? '⚠ Risk:' : '✨ Effect:'} <span className="text-slate-300 font-normal">{[...healthyActions, ...riskFactors].find(a => a.id === activeActionId)?.description}</span>
          </p>
          <button onClick={onClear} className="p-1.5 bg-slate-700/50 rounded-full text-slate-400 hover:text-white transition hover:bg-slate-600">
            <RotateCcw size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionSimulator;