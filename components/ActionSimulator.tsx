
import React, { useState } from 'react';
import { SimulationAction } from '../types';
import { Pill, Wind, Moon, AlertTriangle, Coffee, Utensils, Zap, Droplets, Activity } from 'lucide-react';

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
    description: 'Boosts hydration, improves cognitive function.'
  },
  {
    id: 'meds',
    label: 'Take Meds',
    icon: Pill,
    color: 'bg-emerald-500',
    effect: { bloodPressureSys: { value: 118, status: 'normal', unit: 'mmHg', id: 'bp', name: 'BP', trend: 'down', history: [], description: '' }, heartRate: { value: 72, status: 'normal', unit: 'bpm', id: 'hr', name: 'HR', trend: 'down', history: [], description: '' } },
    description: 'Stabilizes blood pressure and heart rhythm.'
  },
  {
    id: 'breathe',
    label: 'Deep Breath',
    icon: Wind,
    color: 'bg-indigo-500',
    effect: { stressLevel: { value: 25, status: 'normal', unit: '/100', id: 'stress', name: 'Stress', trend: 'down', history: [], description: '' }, heartRate: { value: 65, status: 'normal', unit: 'bpm', id: 'hr', name: 'HR', trend: 'down', history: [], description: '' } },
    description: 'Immediate reduction in cortisol and stress.'
  },
  {
    id: 'rest',
    label: 'Short Nap',
    icon: Moon,
    color: 'bg-purple-500',
    effect: { energyLevel: 95, stressLevel: { value: 15, status: 'normal', unit: '/100', id: 'stress', name: 'Stress', trend: 'down', history: [], description: '' } },
    description: 'Restores energy battery significantly.'
  }
];

const riskFactors: SimulationAction[] = [
  {
    id: 'skip_meds',
    label: 'Skip Meds',
    icon: AlertTriangle,
    color: 'bg-red-500',
    effect: { bloodPressureSys: { value: 155, status: 'critical', unit: 'mmHg', id: 'bp', name: 'BP', trend: 'up', history: [], description: '' }, heartRate: { value: 110, status: 'warning', unit: 'bpm', id: 'hr', name: 'HR', trend: 'up', history: [], description: '' }, stressLevel: { value: 75, status: 'warning', unit: '/100', id: 'stress', name: 'Stress', trend: 'up', history: [], description: '' } },
    description: 'Warning: High risk of hypertension spike.'
  },
  {
    id: 'caffeine',
    label: 'High Caffeine',
    icon: Coffee,
    color: 'bg-amber-600',
    effect: { heartRate: { value: 105, status: 'warning', unit: 'bpm', id: 'hr', name: 'HR', trend: 'up', history: [], description: '' }, hydration: { value: 30, status: 'warning', unit: '%', id: 'hydro', name: 'Hydration', trend: 'down', history: [], description: '' }, stressLevel: { value: 65, status: 'warning', unit: '/100', id: 'stress', name: 'Stress', trend: 'up', history: [], description: '' } },
    description: 'Increases heart rate and dehydration.'
  },
  {
    id: 'salt',
    label: 'High Salt Meal',
    icon: Utensils,
    color: 'bg-orange-500',
    effect: { bloodPressureSys: { value: 145, status: 'warning', unit: 'mmHg', id: 'bp', name: 'BP', trend: 'up', history: [], description: '' }, hydration: { value: 40, status: 'warning', unit: '%', id: 'hydro', name: 'Hydration', trend: 'down', history: [], description: '' } },
    description: 'Fluid retention causes BP increase.'
  },
  {
    id: 'panic',
    label: 'Panic Attack',
    icon: Zap,
    color: 'bg-rose-600',
    effect: { heartRate: { value: 130, status: 'critical', unit: 'bpm', id: 'hr', name: 'HR', trend: 'up', history: [], description: '' }, oxygenLevel: { value: 94, status: 'warning', unit: '%', id: 'spo2', name: 'SpO2', trend: 'down', history: [], description: '' }, stressLevel: { value: 95, status: 'critical', unit: '/100', id: 'stress', name: 'Stress', trend: 'up', history: [], description: '' } },
    description: 'Simulates physiological stress response.'
  }
];

const ActionSimulator: React.FC<ActionSimulatorProps> = ({ onSimulate, onClear, activeActionId }) => {
  const [mode, setMode] = useState<'healthy' | 'risk'>('healthy');

  const currentActions = mode === 'healthy' ? healthyActions : riskFactors;
  const activeDesc = [...healthyActions, ...riskFactors].find(a => a.id === activeActionId)?.description;
  const isRiskActive = riskFactors.some(r => r.id === activeActionId);

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-start mb-3 px-1">
         <div className="flex flex-col">
           <div className="flex items-center gap-2">
             <Activity size={16} className="text-indigo-400" />
             <h3 className="text-sm font-bold text-white uppercase tracking-wider">Health Action Preview</h3>
           </div>
           <p className="text-[10px] text-indigo-300/80 mt-1 ml-6">Tap to see how your body reacts <span className="italic">before</span> you act.</p>
         </div>
         {activeActionId && (
           <button onClick={onClear} className="text-xs text-slate-300 hover:text-white font-medium px-3 py-1 bg-slate-700/50 rounded-lg border border-white/10">
             Reset
           </button>
         )}
      </div>

      {/* Mode Toggles */}
      <div className="flex p-1 bg-slate-950/50 rounded-xl mb-4 border border-white/5">
        <button 
          onClick={() => { setMode('healthy'); onClear(); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'healthy' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Positive Actions
        </button>
        <button 
          onClick={() => { setMode('risk'); onClear(); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'risk' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Risk Factors
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-3 relative">
        {!activeActionId && (
           <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl animate-pulse pointer-events-none -z-10" />
        )}
        
        {currentActions.map((action) => {
          const isActive = activeActionId === action.id;
          const Icon = action.icon;
          
          return (
            <button
              key={action.id}
              onClick={() => isActive ? onClear() : onSimulate(action, mode === 'risk')}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 border ${
                isActive 
                  ? `${action.color} border-white/50 scale-105 shadow-lg shadow-${action.color.replace('bg-', '')}/40` 
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <div className={`p-2 rounded-full ${isActive ? 'bg-white/20' : 'bg-slate-900'}`}>
                <Icon size={20} className={isActive ? 'text-white' : (mode === 'risk' ? 'text-rose-400' : 'text-slate-400')} />
              </div>
              <span className={`text-[10px] font-medium text-center leading-tight ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Explanation of consequence */}
      {activeActionId && (
        <div className={`mt-4 p-3 border rounded-xl animate-[fadeIn_0.3s] ${isRiskActive ? 'bg-red-900/20 border-red-500/30' : 'bg-indigo-900/20 border-indigo-500/30'}`}>
           <div className="flex items-start gap-2">
             {isRiskActive ? <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" /> : <Pill size={16} className="text-indigo-400 shrink-0 mt-0.5" />}
             <p className={`text-xs ${isRiskActive ? 'text-red-200' : 'text-indigo-200'}`}>
               <span className="font-bold">{isRiskActive ? 'WARNING:' : 'PREDICTED BENEFIT:'}</span> {activeDesc}
             </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default ActionSimulator;
