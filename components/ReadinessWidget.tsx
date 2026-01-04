import React from 'react';
import { HealthData } from '../types';
import { Activity, Battery, Zap } from 'lucide-react';

interface ReadinessWidgetProps {
  data: HealthData;
}

const ReadinessWidget: React.FC<ReadinessWidgetProps> = ({ data }) => {
  // Simple Mock Algorithm for Readiness
  const score = Math.round(
    (data.energyLevel * 0.4) + 
    ((100 - data.stressLevel.value) * 0.4) + 
    (data.oxygenLevel.value * 0.2)
  );

  let status = 'Low';
  let color = 'text-rose-500';
  let bg = 'bg-rose-500';
  let advice = 'Prioritize recovery today.';

  if (score > 80) {
    status = 'Prime';
    color = 'text-emerald-500';
    bg = 'bg-emerald-500';
    advice = 'Ready for intense load.';
  } else if (score > 50) {
    status = 'Good';
    color = 'text-amber-500';
    bg = 'bg-amber-500';
    advice = 'Maintain steady effort.';
  }

  return (
    <div className="w-full bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg shadow-slate-200">
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-40 h-40 ${bg} opacity-20 blur-[60px] rounded-full -translate-y-10 translate-x-10`} />

      <div className="flex justify-between items-start relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1 opacity-80">
            <Activity size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Readiness</span>
          </div>
          <h3 className="text-4xl font-black">{score}<span className="text-lg opacity-50">%</span></h3>
        </div>
        
        <div className={`px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold ${color}`}>
          {status}
        </div>
      </div>

      <div className="mt-4 relative z-10">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
          <div style={{ width: `${score}%` }} className={`h-full ${bg} rounded-full transition-all duration-1000`} />
        </div>
        <p className="text-xs font-medium text-slate-400">{advice}</p>
      </div>
    </div>
  );
};

export default ReadinessWidget;