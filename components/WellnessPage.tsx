import React, { useEffect, useState } from 'react';
import ForecastWidget from './ForecastWidget';
import BioTuningWidget from './BioTuningWidget';
import EnvironmentCard from './EnvironmentCard';
import ActivityWidget from './ActivityWidget';
import { HealthData, ActivityData, ForecastPoint } from '../types';
import { Sparkles, Brain, Wind, Loader2, Zap, Activity, TrendingUp } from 'lucide-react';
// import { generateHealthInsight } from '../services/gemini'; // Uncomment when API is ready

interface WellnessPageProps {
  healthData: HealthData;
  activityData: ActivityData;
}

const WellnessPage: React.FC<WellnessPageProps> = ({ healthData, activityData }) => {
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. CALCULATE READINESS SCORE ---
  // A simple algorithm: Average of Energy, Oxygen, and (Inverse of) Stress
  // 95-100 = Peak, 80-94 = Good, <80 = Recovery Needed
  const readinessScore = Math.round(
    (healthData.energyLevel + (healthData.oxygenLevel.value >= 95 ? 100 : 85) + (100 - healthData.stressLevel.value)) / 3
  );

  let readinessLabel = 'Recovery Needed';
  let readinessColor = 'text-amber-500';
  let ringColor = '#f59e0b'; // Amber

  if (readinessScore >= 90) {
    readinessLabel = 'Peak Performance';
    readinessColor = 'text-emerald-500';
    ringColor = '#10b981'; // Emerald
  } else if (readinessScore >= 75) {
    readinessLabel = 'Good Condition';
    readinessColor = 'text-indigo-600';
    ringColor = '#4f46e5'; // Indigo
  }

  // --- 2. AI PREDICTION LOGIC ---
  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      try {
        // --- REAL AI INTEGRATION POINT ---
        // const prompt = `Current Energy: ${healthData.energyLevel}, Stress: ${healthData.stressLevel.value}... Predict next 3 hours.`;
        // const aiResult = await generateHealthInsight(prompt); 
        // setForecast(JSON.parse(aiResult));

        // --- SMART SIMULATION (Fallback) ---
        // Uses current vitals to "project" the trend
        const smartPrediction: ForecastPoint[] = [
          { time: 'Now', energy: healthData.energyLevel, stress: healthData.stressLevel.value },
          { 
            time: '+1h', 
            energy: Math.min(100, healthData.energyLevel + (healthData.hydration.value > 50 ? 5 : -5)), 
            stress: Math.max(10, healthData.stressLevel.value - 5) 
          },
          { 
            time: '+2h', 
            energy: Math.min(100, healthData.energyLevel + 10), 
            stress: Math.max(10, healthData.stressLevel.value - 15) 
          },
          { 
            time: '+3h', 
            energy: Math.min(100, healthData.energyLevel - 5), 
            stress: Math.max(10, healthData.stressLevel.value + 5) 
          },
        ];
        
        // Artificial delay to make it feel like "Thinking"
        setTimeout(() => {
            setForecast(smartPrediction);
            setLoading(false);
        }, 1200);

      } catch (error) {
        console.error("Prediction Failed", error);
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [healthData]);

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-32 px-1">
      
      {/* Page Header */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight">Wellness</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Recovery & Optimization</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
            {loading ? <Loader2 size={20} className="text-indigo-600 animate-spin" /> : <Sparkles size={20} className="text-indigo-600" />}
        </div>
      </div>

      {/* --- NEW READINESS CARD --- */}
      <section>
        <div className="w-full bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden">
            {/* Ambient Glow */}
            <div className={`absolute top-0 right-0 w-40 h-40 opacity-10 rounded-full blur-3xl -translate-y-10 translate-x-10 ${readinessScore >= 90 ? 'bg-emerald-500' : 'bg-indigo-500'}`} />

            <div className="z-10 flex flex-col justify-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                 <Activity size={12} /> Daily Readiness
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">{readinessScore}</span>
                <span className="text-lg font-bold text-slate-400">/100</span>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mt-2 text-[10px] font-bold uppercase tracking-wide border bg-white/50 ${readinessColor} border-slate-100`}>
                  {readinessScore >= 90 ? <Zap size={10} fill="currentColor" /> : <TrendingUp size={10} />}
                  {readinessLabel}
              </div>
            </div>
            
            {/* Circular Progress Ring */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Track */}
                    <circle cx="56" cy="56" r="42" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                    {/* Indicator */}
                    <circle 
                        cx="56" cy="56" r="42" 
                        stroke={ringColor} 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={264}
                        strokeDashoffset={264 - (264 * readinessScore) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                {/* Center Icon */}
                <div className={`absolute ${readinessColor}`}>
                    {readinessScore >= 90 ? <Zap size={32} fill="currentColor" /> : <Activity size={32} />}
                </div>
            </div>
        </div>
      </section>

      {/* AI Forecast Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Sparkles size={14} className="text-indigo-500" />
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {loading ? 'Analyzing Trends...' : 'AI Prediction'}
          </h3>
        </div>
        
        <div className={`transition-all duration-500 ${loading ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'}`}>
           <ForecastWidget forecast={forecast.length > 0 ? forecast : []} />
        </div>
      </section>

      {/* Neuro-Tuning Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Brain size={14} className="text-indigo-500" />
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Tuning</h3>
        </div>
        <BioTuningWidget 
          currentStress={healthData.stressLevel.value} 
          currentEnergy={healthData.energyLevel} 
        />
      </section>

      {/* Context Grid */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Wind size={14} className="text-indigo-500" />
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Context</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 h-44">
           <EnvironmentCard />
           <ActivityWidget data={activityData} />
        </div>
      </section>

    </div>
  );
};

export default WellnessPage;