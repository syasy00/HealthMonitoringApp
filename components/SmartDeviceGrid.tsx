
import React, { useState } from 'react';
import { Thermometer, Lock, Unlock, Pill, Lightbulb, Fan } from 'lucide-react';

const SmartDeviceGrid: React.FC = () => {
  const [temp, setTemp] = useState(22);
  const [isLocked, setIsLocked] = useState(true);
  const [medsDispensed, setMedsDispensed] = useState(false);
  const [lightsOn, setLightsOn] = useState(true);

  // Common button style
  const btnClass = "relative overflow-hidden bg-slate-800/40 border border-white/5 rounded-2xl p-3 flex flex-col justify-between transition-all hover:bg-slate-800/60 active:scale-95 group";

  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      
      {/* 1. Smart Thermostat */}
      <div className={btnClass}>
        <div className="flex justify-between items-start">
          <div className="p-1.5 bg-indigo-500/20 rounded-full text-indigo-400">
            <Thermometer size={14} />
          </div>
          <span className="text-lg font-bold text-white">{temp}°</span>
        </div>
        <div className="flex gap-1 mt-2">
           <button onClick={() => setTemp(t => t-1)} className="flex-1 bg-slate-900/50 rounded hover:bg-white/10 text-xs py-1 text-slate-400">-</button>
           <button onClick={() => setTemp(t => t+1)} className="flex-1 bg-slate-900/50 rounded hover:bg-white/10 text-xs py-1 text-slate-400">+</button>
        </div>
        <span className="absolute bottom-1 right-2 text-[8px] text-slate-500 uppercase tracking-widest">HVAC</span>
      </div>

      {/* 2. Pill Dispenser */}
      <button 
        onClick={() => setMedsDispensed(true)}
        disabled={medsDispensed}
        className={`${btnClass} ${medsDispensed ? 'opacity-50 cursor-default' : 'hover:border-emerald-500/30'}`}
      >
        <div className="flex justify-between items-start w-full">
          <div className={`p-1.5 rounded-full ${medsDispensed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
            <Pill size={14} />
          </div>
          {medsDispensed && <span className="text-[8px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">DONE</span>}
        </div>
        <div className="text-left mt-1">
          <p className="text-[10px] text-slate-400">4:00 PM Dose</p>
          <p className={`text-xs font-bold ${medsDispensed ? 'text-emerald-400' : 'text-white'}`}>
            {medsDispensed ? 'Dispensed' : 'Dispense'}
          </p>
        </div>
      </button>

      {/* 3. Smart Lock */}
      <button 
        onClick={() => setIsLocked(!isLocked)}
        className={`${btnClass} ${!isLocked ? 'border-amber-500/30 bg-amber-900/10' : ''}`}
      >
        <div className="flex justify-between items-start w-full">
          <div className={`p-1.5 rounded-full ${isLocked ? 'bg-slate-700 text-slate-400' : 'bg-amber-500/20 text-amber-400'}`}>
            {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
          </div>
        </div>
        <div className="text-left mt-1">
          <p className="text-[10px] text-slate-400">Front Door</p>
          <p className={`text-xs font-bold ${isLocked ? 'text-slate-200' : 'text-amber-400'}`}>
            {isLocked ? 'Secured' : 'Unlocked'}
          </p>
        </div>
      </button>

      {/* 4. Smart Lights */}
      <button 
        onClick={() => setLightsOn(!lightsOn)}
        className={btnClass}
      >
        <div className="flex justify-between items-start w-full">
          <div className={`p-1.5 rounded-full ${lightsOn ? 'bg-yellow-500/20 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]' : 'bg-slate-700 text-slate-500'}`}>
            <Lightbulb size={14} className={lightsOn ? "fill-yellow-400/20" : ""} />
          </div>
          <div className={`w-1.5 h-1.5 rounded-full ${lightsOn ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
        </div>
        <div className="text-left mt-1">
          <p className="text-[10px] text-slate-400">Ambience</p>
          <p className="text-xs font-bold text-white">
            {lightsOn ? 'Relax Mode' : 'Off'}
          </p>
        </div>
      </button>

    </div>
  );
};

export default SmartDeviceGrid;
