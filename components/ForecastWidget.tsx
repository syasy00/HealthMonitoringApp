
import React from 'react';
import { ForecastPoint } from '../types';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ForecastWidgetProps {
  forecast: ForecastPoint[];
  loading?: boolean;
}

const ForecastWidget: React.FC<ForecastWidgetProps> = ({ forecast, loading }) => {
  if (loading) {
    return (
      <div className="h-40 w-full glass-panel rounded-2xl animate-pulse flex items-center justify-center">
        <span className="text-slate-500 text-sm">Calculating body forecast...</span>
      </div>
    );
  }

  return (
    <div className="w-full glass-panel rounded-2xl p-4 border border-indigo-500/20">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-white font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Future Projection
          </h3>
          <p className="text-xs text-slate-400">Predicted energy & stress over next 4h</p>
        </div>
        <div className="text-right">
             <span className="text-xs font-bold text-indigo-300 bg-indigo-900/30 px-2 py-1 rounded">AI Powered</span>
        </div>
      </div>

      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast}>
            <defs>
              <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10 }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Area 
              type="monotone" 
              dataKey="energy" 
              stroke="#8b5cf6" 
              fillOpacity={1} 
              fill="url(#colorEnergy)" 
              strokeWidth={3}
            />
            <Area 
              type="monotone" 
              dataKey="stress" 
              stroke="#ef4444" 
              fill="transparent" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 flex justify-center gap-4 text-[10px] text-slate-400">
         <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-indigo-500 rounded-full"></div> Energy
         </div>
         <div className="flex items-center gap-1">
            <div className="w-3 h-1 border-t-2 border-red-500 border-dashed"></div> Stress Risk
         </div>
      </div>
    </div>
  );
};

export default ForecastWidget;
