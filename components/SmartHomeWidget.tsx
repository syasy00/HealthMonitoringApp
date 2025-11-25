
import React from 'react';
import { SmartHomeState } from '../types';
import { Thermometer, Lock, Unlock, Zap, Pill, Fan, ShieldAlert } from 'lucide-react';

interface SmartHomeWidgetProps {
  homeState: SmartHomeState;
  onToggleLock: () => void;
  onDispensePill: () => void;
  onAdjustTemp: (val: number) => void;
  isEmergencyMode?: boolean;
}

const SmartHomeWidget: React.FC<SmartHomeWidgetProps> = ({ 
  homeState, 
  onToggleLock, 
  onDispensePill, 
  onAdjustTemp,
  isEmergencyMode = false
}) => {
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-center mb-1">
         <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Environment Control</h3>
         {isEmergencyMode && (
           <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-1 rounded animate-pulse">
             EMERGENCY PROTOCOL ACTIVE
           </span>
         )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Thermostat Control */}
        <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div className="p-2 bg-indigo-500/20 rounded-full text-indigo-400">
               <Thermometer size={18} />
             </div>
             <div className="text-right">
                <div className="text-2xl font-bold text-white">{homeState.temperature}°</div>
                <div className="text-[10px] text-slate-400">Room Temp</div>
             </div>
          </div>
          <div className="mt-3 flex items-center bg-slate-900 rounded-lg p-1">
             <button onClick={() => onAdjustTemp(-1)} className="flex-1 text-slate-400 hover:text-white font-bold">-</button>
             <div className="w-px h-4 bg-white/10"></div>
             <button onClick={() => onAdjustTemp(1)} className="flex-1 text-slate-400 hover:text-white font-bold">+</button>
          </div>
        </div>

        {/* Smart Lock */}
        <button 
          onClick={onToggleLock}
          className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${
            isEmergencyMode 
              ? 'bg-red-900/40 border-red-500' 
              : (homeState.isDoorLocked ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-amber-900/20 border-amber-500/30')
          }`}
        >
          <div className="flex justify-between items-start w-full">
             <div className={`p-2 rounded-full ${isEmergencyMode ? 'bg-red-500 text-white animate-bounce' : (homeState.isDoorLocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400')}`}>
               {isEmergencyMode ? <ShieldAlert size={18} /> : (homeState.isDoorLocked ? <Lock size={18} /> : <Unlock size={18} />)}
             </div>
             <div className={`w-2 h-2 rounded-full ${homeState.isDoorLocked ? 'bg-emerald-500' : 'bg-amber-500'} ${isEmergencyMode ? 'animate-ping' : ''}`}></div>
          </div>
          <div className="text-left mt-2">
            <div className={`font-bold text-sm ${isEmergencyMode ? 'text-red-300' : 'text-white'}`}>
              {isEmergencyMode ? 'EMS UNLOCK' : (homeState.isDoorLocked ? 'Secured' : 'Unlocked')}
            </div>
            <div className="text-[10px] text-slate-400">Front Door</div>
          </div>
        </button>

        {/* Pill Dispenser */}
        <button 
          onClick={onDispensePill}
          disabled={homeState.isPillDispensed}
          className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${
            homeState.isPillDispensed ? 'bg-slate-800/30 border-slate-700 opacity-60' : 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-900/40'
          }`}
        >
           <div className="flex justify-between items-start w-full">
             <div className="p-2 bg-white/20 rounded-full">
               <Pill size={18} />
             </div>
           </div>
           <div className="text-left mt-2">
             <div className="font-bold text-sm">
               {homeState.isPillDispensed ? 'Dispensed' : 'Dispense Meds'}
             </div>
             <div className="text-[10px] opacity-70">4:00 PM Dose</div>
           </div>
        </button>

         {/* Air Purifier */}
        <div className="bg-slate-800/50 p-3 rounded-2xl border border-white/5 flex flex-col justify-between">
           <div className="flex justify-between items-start w-full">
             <div className="p-2 bg-slate-700 rounded-full text-slate-300">
               <Fan size={18} className={homeState.airQuality !== 'Good' ? 'animate-spin' : ''} />
             </div>
             <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${homeState.airQuality === 'Good' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
               {homeState.airQuality}
             </span>
           </div>
           <div className="text-left mt-2">
             <div className="font-bold text-sm text-white">Air Filter</div>
             <div className="text-[10px] text-slate-400">Auto-Mode</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SmartHomeWidget;
