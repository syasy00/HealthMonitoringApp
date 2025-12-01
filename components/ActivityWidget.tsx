import React from 'react';
import { ActivityData } from '../types';
import { Footprints, Flame, Timer } from 'lucide-react';

interface ActivityWidgetProps {
  data: ActivityData;
}

const ActivityWidget: React.FC<ActivityWidgetProps> = ({ data }) => {
  const percentage = Math.min(100, Math.round((data.steps / data.goalSteps) * 100));
  
  // SVG Config for the ring
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="h-full w-full bg-[#0f121d] rounded-3xl p-5 flex flex-col justify-between border border-white/5 relative overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

      {/* Header */}
      <div className="flex justify-between items-start z-10 mb-2">
        <div className="flex items-center gap-2 text-slate-400">
          <Footprints size={14} className="text-orange-400" />
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-300">Activity</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 font-bold">{percentage}% GOAL</span>
      </div>

      {/* Main Content Grid */}
      <div className="flex items-center gap-4 z-10 h-full">
        
        {/* Left: Progress Ring */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90">
            {/* Track */}
            <circle
              cx="50%" cy="50%" r={radius}
              fill="transparent"
              stroke="#1e293b"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Indicator */}
            <circle
              cx="50%" cy="50%" r={radius}
              fill="transparent"
              stroke="#f97316" // Orange-500
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black text-white leading-none tracking-tight">{data.steps.toLocaleString()}</span>
            <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Steps</span>
          </div>
        </div>

        {/* Right: Stats Vertical Stack */}
        <div className="flex-1 flex flex-col justify-center gap-3">
           {/* Calories */}
           <div className="bg-[#151925] rounded-xl p-2.5 flex items-center justify-between border border-white/5 relative overflow-hidden group hover:border-orange-500/20 transition-all">
              <div className="flex items-center gap-2 relative z-10">
                 <div className="p-1 rounded bg-orange-500/10">
                    <Flame size={12} className="text-orange-400" fill="currentColor" fillOpacity={0.6} />
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Burn</span>
              </div>
              <div className="text-right relative z-10">
                 <span className="text-sm font-black text-white">{data.caloriesBurned}</span>
                 <span className="text-[8px] text-slate-500 ml-0.5 font-bold">kcal</span>
              </div>
           </div>

           {/* Active Time */}
           <div className="bg-[#151925] rounded-xl p-2.5 flex items-center justify-between border border-white/5 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
              <div className="flex items-center gap-2 relative z-10">
                 <div className="p-1 rounded bg-emerald-500/10">
                    <Timer size={12} className="text-emerald-400" />
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Active</span>
              </div>
              <div className="text-right relative z-10">
                 <span className="text-sm font-black text-white">{data.activeMinutes}</span>
                 <span className="text-[8px] text-slate-500 ml-0.5 font-bold">min</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ActivityWidget;