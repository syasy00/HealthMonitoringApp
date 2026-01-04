import React from 'react';
import { ActivityData } from '../types';
import { Flame, Footprints } from 'lucide-react';

interface ActivityWidgetProps {
  data: ActivityData;
}

const ActivityWidget: React.FC<ActivityWidgetProps> = ({ data }) => {
  return (
    <div className="w-full h-full bg-slate-900 rounded-[2rem] p-4 shadow-lg shadow-slate-200 flex flex-col justify-between relative overflow-hidden group">
       {/* Dark Card for contrast in the grid */}
       
       <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl -translate-y-8 translate-x-8" />

       <div className="flex justify-between items-start relative z-10">
          <div className="p-2 bg-white/10 text-white rounded-xl backdrop-blur-md">
             <Flame size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-black text-white">{data.caloriesBurned}</span>
       </div>
       
       <div className="relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Kcal Burned</span>
          <div className="flex items-center gap-1 mt-1">
             <Footprints size={12} className="text-emerald-400" />
             <span className="text-[10px] font-bold text-slate-300">{(data.steps / 1000).toFixed(1)}k Steps</span>
          </div>
       </div>
    </div>
  );
};

export default ActivityWidget;