import React, { useState, ReactNode } from 'react';
import { SimulationAction, HealthData } from '../types';
import { Pill, Wind, Moon, AlertTriangle, Coffee, Utensils, Zap, Droplets, HelpCircle, Play, Activity, Brain, Thermometer, HeartPulse, Waves } from 'lucide-react';

interface ActionSimulatorProps {
  onSimulate: (action: SimulationAction, isRisk: boolean) => void;
  onClear: () => void;
  activeActionId: string | null;
  data: HealthData; // Added to render metrics inside the HUD
  children?: ReactNode;
}

const healthyActions: SimulationAction[] = [
  { id: 'water', label: 'Drink Water', icon: Droplets, color: 'bg-blue-500', effect: { hydration: { value: 95, status: 'normal', unit: '%', id: 'hydro', name: 'Hydration', trend: 'up', history: [], description: '' }, energyLevel: 85 }, description: 'Boosts hydration' },
  { id: 'meds', label: 'Take Meds', icon: Pill, color: 'bg-emerald-500', effect: { bloodPressureSys: { value: 118, status: 'normal', unit: 'mmHg', id: 'bp', name: 'BP', trend: 'down', history: [], description: '' }, heartRate: { value: 72, status: 'normal', unit: 'bpm', id: 'hr', name: 'HR', trend: 'down', history: [], description: '' } }, description: 'Stabilizes BP' },
  { id: 'breathe', label: 'Deep Breath', icon: Wind, color: 'bg-indigo-500', effect: { stressLevel: { value: 25, status: 'normal', unit: '/100', id: 'stress', name: 'Stress', trend: 'down', history: [], description: '' }, heartRate: { value: 65, status: 'normal', unit: 'bpm', id: 'hr', name: 'HR', trend: 'down', history: [], description: '' } }, description: 'Lowers Cortisol' },
  { id: 'rest', label: 'Short Nap', icon: Moon, color: 'bg-purple-500', effect: { energyLevel: 95, stressLevel: { value: 15, status: 'normal', unit: '/100', id: 'stress', name: 'Stress', trend: 'down', history: [], description: '' } }, description: 'Restores Energy' }
];

const riskFactors: SimulationAction[] = [
  { id: 'skip_meds', label: 'Skip Meds', icon: AlertTriangle, color: 'bg-red-500', effect: { bloodPressureSys: { value: 155, status: 'critical', unit: 'mmHg', id: 'bp', name: 'BP', trend: 'up', history: [], description: '' }, heartRate: { value: 110, status: 'warning', unit: 'bpm', id: 'hr', name: 'HR', trend: 'up', history: [], description: '' }, stressLevel: { value: 75, status: 'warning', unit: '/100', id: 'stress', name: 'Stress', trend: 'up', history: [], description: '' } }, description: 'Spikes BP' },
  { id: 'caffeine', label: 'Double Coffee', icon: Coffee, color: 'bg-amber-600', effect: { heartRate: { value: 105, status: 'warning', unit: 'bpm', id: 'hr', name: 'HR', trend: 'up', history: [], description: '' }, hydration: { value: 30, status: 'warning', unit: '%', id: 'hydro', name: 'Hydration', trend: 'down', history: [], description: '' }, stressLevel: { value: 65, status: 'warning', unit: '/100', id: 'stress', name: 'Stress', trend: 'up', history: [], description: '' } }, description: 'Increases HR' },
  { id: 'salt', label: 'Salty Meal', icon: Utensils, color: 'bg-orange-500', effect: { bloodPressureSys: { value: 145, status: 'warning', unit: 'mmHg', id: 'bp', name: 'BP', trend: 'up', history: [], description: '' }, hydration: { value: 40, status: 'warning', unit: '%', id: 'hydro', name: 'Hydration', trend: 'down', history: [], description: '' } }, description: 'Dehydrates' },
  { id: 'panic', label: 'High Stress', icon: Zap, color: 'bg-rose-600', effect: { heartRate: { value: 130, status: 'critical', unit: 'bpm', id: 'hr', name: 'HR', trend: 'up', history: [], description: '' }, oxygenLevel: { value: 94, status: 'warning', unit: '%', id: 'spo2', name: 'SpO2', trend: 'down', history: [], description: '' }, stressLevel: { value: 95, status: 'critical', unit: '/100', id: 'stress', name: 'Stress', trend: 'up', history: [], description: '' } }, description: 'Fight-or-Flight' }
];

// Helper Component for Metrics
const MetricChip = ({ label, value, unit, icon: Icon, color = "text-white" }: any) => (
  <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center shadow-lg min-w-[80px]">
    <div className="flex items-center gap-1.5 mb-1 opacity-70">
       <Icon size={10} className={color} />
       <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">{label}</span>
    </div>
    <div className="flex items-baseline gap-0.5">
       <span className={`text-lg font-black leading-none ${color === 'text-white' ? 'text-white' : color}`}>{value}</span>
       <span className="text-[9px] font-medium text-slate-500">{unit}</span>
    </div>
  </div>
);

const ActionSimulator: React.FC<ActionSimulatorProps> = ({ onSimulate, onClear, activeActionId, data, children }) => {
  const [mode, setMode] = useState<'healthy' | 'risk'>('healthy');
  const currentActions = mode === 'healthy' ? healthyActions : riskFactors;
  const isRiskActive = riskFactors.some(r => r.id === activeActionId);

  const renderActionButton = (action: SimulationAction) => {
    const isActive = activeActionId === action.id;
    const Icon = action.icon;
    return (
      <button
        key={action.id}
        onClick={() => isActive ? onClear() : onSimulate(action, mode === 'risk')}
        className={`relative w-20 h-20 flex flex-col items-center justify-center gap-2 rounded-2xl transition-all duration-300 group border ${
          isActive 
            ? `${action.color} border-transparent text-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-95 z-20` 
            : 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800 hover:border-white/10 hover:text-slate-200'
        }`}
      >
        <div className={`p-2 rounded-full transition-all ${isActive ? 'bg-white/20' : 'bg-slate-900/50 group-hover:bg-slate-700'}`}>
            <Icon size={18} />
        </div>
        <span className="text-[9px] font-bold tracking-wide text-center leading-none px-1">
          {action.label}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4 px-2 relative z-30">
         <div>
           <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-2">
             BODY SIMULATOR <HelpCircle size={12} className="text-slate-600" />
           </h3>
           <p className="text-[10px] text-slate-500 font-medium">Predict effects of habits</p>
         </div>
         <div className="flex bg-slate-950 rounded-lg p-0.5 border border-white/10">
            <button onClick={() => { setMode('healthy'); onClear(); }} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${mode === 'healthy' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Health</button>
            <button onClick={() => { setMode('risk'); onClear(); }} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${mode === 'risk' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Risk</button>
         </div>
      </div>
      
      {/* HUD LAYOUT */}
      <div className="flex-1 relative flex flex-col items-center">
          
          {/* 1. TOP CENTER METRICS */}
          <div className="flex justify-center gap-3 mb-2 relative z-20">
             <MetricChip label="HR" value={data.heartRate.value} unit="bpm" icon={Activity} color="text-emerald-400" />
             <MetricChip label="Stress" value={data.stressLevel.value} unit="" icon={Brain} color="text-indigo-400" />
          </div>

          {/* 2. MIDDLE & BOTTOM ROWS (Split Wing Layout) */}
          <div className="w-full flex justify-between items-center relative flex-1">
             
             {/* LEFT WING */}
             <div className="flex flex-col gap-4 z-20">
                <div className="flex items-center gap-3">
                   {renderActionButton(currentActions[0])} {/* Water Action */}
                   <MetricChip label="Water" value={data.hydration.value} unit="%" icon={Droplets} color="text-blue-400" />
                </div>
                <div className="flex items-center gap-3">
                   {renderActionButton(currentActions[1])} {/* Meds Action */}
                   <MetricChip label="Temp" value={data.temperature.value} unit="°C" icon={Thermometer} color="text-amber-200" />
                </div>
             </div>

             {/* CENTER AVATAR (Absolute Centered) */}
             <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-full h-full transform scale-110 translate-y-4">
                   {children}
                </div>
             </div>

             {/* RIGHT WING */}
             <div className="flex flex-col gap-4 z-20 items-end">
                <div className="flex items-center gap-3">
                   <MetricChip label="SpO2" value={data.oxygenLevel.value} unit="%" icon={Wind} color="text-sky-400" />
                   {renderActionButton(currentActions[2])} {/* Breath Action */}
                </div>
                <div className="flex items-center gap-3">
                   <MetricChip label="BP" value={`${data.bloodPressureSys.value}/${data.bloodPressureDia.value}`} unit="" icon={HeartPulse} color="text-rose-400" />
                   {renderActionButton(currentActions[3])} {/* Nap Action */}
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default ActionSimulator;