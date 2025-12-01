
import React from 'react';
import { VitalSign } from '../types';
import { ArrowUp, ArrowDown, Minus, Info, Watch } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  vital: VitalSign;
  onClick: () => void;
  isCompact?: boolean;
  isDeviceMetric?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ vital, onClick, isCompact = false, isDeviceMetric = false }) => {
  const isCritical = vital.status === 'critical';
  const isWarning = vital.status === 'warning';
  
  let borderColor = 'border-slate-700';
  let bgColor = 'bg-slate-800/40';
  let iconColor = 'text-slate-400';

  if (isCritical) {
    borderColor = 'border-red-500/50';
    bgColor = 'bg-red-900/20';
    iconColor = 'text-red-400';
  } else if (isWarning) {
    borderColor = 'border-amber-500/50';
    bgColor = 'bg-amber-900/20';
    iconColor = 'text-amber-400';
  } else {
    borderColor = 'border-emerald-500/30';
    bgColor = 'bg-emerald-900/10';
    iconColor = 'text-emerald-400';
  }

  // Transform history array for Recharts
  const chartData = vital.history.map((val, idx) => ({ i: idx, val }));

  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border ${borderColor} ${bgColor} backdrop-blur-md transition-all active:scale-95 cursor-pointer hover:shadow-lg ${isCompact ? 'p-3' : 'p-5'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold flex items-center gap-1">
            {vital.name}
            {/* HFE: Watch icon for device data visibility */}
            {isDeviceMetric ? (
               <Watch size={10} className="text-indigo-400" />
            ) : (
               <Info size={12} className="opacity-50" />
            )}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-bold ${isCritical ? 'text-red-400' : 'text-white'}`}>
              {vital.value}
            </span>
            <span className="text-sm text-slate-500 font-medium">{vital.unit}</span>
          </div>
        </div>
        
        <div className={`flex flex-col items-end ${iconColor}`}>
           {vital.trend === 'up' && <ArrowUp size={20} />}
           {vital.trend === 'down' && <ArrowDown size={20} />}
           {vital.trend === 'stable' && <Minus size={20} />}
           
           {/* HFE: Plain language status */}
           <span className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full bg-black/20">
             {vital.status.toUpperCase()}
           </span>
        </div>
      </div>

      {/* Sparkline Chart */}
      {!isCompact && (
        <div className="h-12 w-full mt-2 opacity-50">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <Area 
                type="monotone" 
                dataKey="val" 
                stroke={isCritical ? '#ef4444' : '#10b981'} 
                fill={isCritical ? '#ef4444' : '#10b981'} 
                fillOpacity={0.1} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* HFE: Descriptive text for lower literacy */}
      <div className="mt-3 text-xs text-slate-400 border-t border-white/5 pt-2">
        {vital.description}
      </div>
    </div>
  );
};

export default MetricCard;
