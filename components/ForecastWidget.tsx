import React from 'react';
import { ForecastPoint } from '../types';
import { TrendingUp } from 'lucide-react';

interface ForecastWidgetProps {
  forecast: ForecastPoint[];
}

const ForecastWidget: React.FC<ForecastWidgetProps> = ({ forecast }) => {
  return (
    <div className="w-full bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
         <div>
            <h4 className="text-lg font-black text-slate-900">Next 3 Hours</h4>
            <p className="text-xs text-slate-500 font-medium">Projected Biometrics</p>
         </div>
         <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-emerald-100">
            <TrendingUp size={12} /> Optimization Active
         </div>
      </div>

      {/* Chart Bars */}
      <div className="flex justify-between items-end h-32 px-2 gap-4">
        {forecast.map((point, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="relative w-full h-full flex items-end justify-center gap-1">
                    {/* Energy Bar (Blue) */}
                    <div 
                        style={{ height: `${point.energy}%` }} 
                        className="w-3 bg-indigo-500 rounded-full opacity-80 transition-all duration-1000"
                    />
                    {/* Stress Bar (Rose) */}
                    <div 
                        style={{ height: `${point.stress}%` }} 
                        className="w-3 bg-rose-400 rounded-full opacity-80 transition-all duration-1000"
                    />
                </div>
                <span className="text-[10px] font-bold text-slate-400">{point.time}</span>
            </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4">
         <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-bold text-slate-500">Energy</span>
         </div>
         <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <span className="text-[10px] font-bold text-slate-500">Stress</span>
         </div>
      </div>

    </div>
  );
};

export default ForecastWidget;