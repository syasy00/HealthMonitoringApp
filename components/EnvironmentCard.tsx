import React from 'react';
import { CloudSun, Droplets } from 'lucide-react';

const EnvironmentCard: React.FC = () => {
  return (
    <div className="w-full h-full bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
       <div className="flex justify-between items-start">
          <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
             <CloudSun size={20} />
          </div>
          <span className="text-xl font-black text-slate-900">28°</span>
       </div>
       
       <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Outdoor</span>
          <div className="flex items-center gap-1 mt-1">
             <Droplets size={12} className="text-blue-400" />
             <span className="text-[10px] font-bold text-slate-600">Humidity 65%</span>
          </div>
       </div>
    </div>
  );
};

export default EnvironmentCard;