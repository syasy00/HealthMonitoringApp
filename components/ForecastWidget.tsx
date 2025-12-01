
import React from 'react';
import { ForecastPoint } from '../types';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface ForecastWidgetProps {
  forecast: ForecastPoint[];
  loading?: boolean;
}

const ForecastWidget: React.FC<ForecastWidgetProps> = ({ forecast, loading }) => {
  // Simple logic to generate a text insight from the data
  const getForecastInsight = () => {
    if (forecast.length === 0) return "Gathering data...";
    const start = forecast[0].energy;
    const end = forecast[forecast.length - 1].energy;
    const diff = end - start;

    if (diff < -15) return "⚠️ Energy crash predicted. Hydrate now to stabilize.";
    if (diff > 5) return "✅ Energy levels rising. Peak expected in 2 hours.";
    return "⚖️ Stable energy projected. Maintain current rhythm.";
  };

  const getTrendIcon = () => {
    if (forecast.length === 0) return null;
    const diff = forecast[forecast.length - 1].energy - forecast[0].energy;
    if (diff < -15) return <TrendingDown size={14} className="text-red-400" />;
    if (diff > 5) return <TrendingUp size={14} className="text-emerald-400" />;
    return <Minus size={14} className="text-slate-400" />;
  };

  if (loading) {
    return (
      <div className="h-40 w-full glass-panel rounded-2xl animate-pulse flex items-center justify-center">
        <span className="text-slate-500 text-sm">Calculating body forecast...</span>
      </div>
    );
  }

  return (
    <div className="w-full glass-panel rounded-2xl p-4 border border-indigo-500/20">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-white text-sm font-bold flex items-center gap-2 uppercase tracking-wide">
            Predictive Fatigue
          </h3>
          <p className="text-[10px] text-slate-400">AI-driven energy estimation</p>
        </div>
        <div className="text-right flex items-center gap-1 bg-slate-900/50 px-2 py-1 rounded-lg border border-white/5">
             {getTrendIcon()}
             <span className="text-[10px] font-bold text-slate-300">4-Hour Outlook</span>
        </div>
      </div>

      {/* The Strategic Insight Line - Makes the graph actionable */}
      <div className="mb-4 text-xs font-medium text-indigo-300 bg-indigo-900/20 p-2 rounded-lg border border-indigo-500/20">
         {getForecastInsight()}
      </div>

      <div className="h-28 w-full">
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
              name="Energy"
            />
            {/* Dashed line for stress threshold */}
            <Area 
              type="monotone" 
              dataKey="stress" 
              stroke="#ef4444" 
              fill="transparent" 
              strokeWidth={1}
              strokeDasharray="4 4"
              name="Stress Load"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-1 flex justify-center gap-4 text-[9px] text-slate-500 uppercase font-bold tracking-wider">
         <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div> Predicted Energy
         </div>
         <div className="flex items-center gap-1">
            <div className="w-2 h-0.5 bg-red-500"></div> Stress Load
         </div>
      </div>
    </div>
  );
};

export default ForecastWidget;
