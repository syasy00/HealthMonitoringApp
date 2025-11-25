
import React, { useState, useEffect, useCallback } from 'react';
import { HealthData, ForecastPoint, SimulationAction, Appointment } from './types';
import BioAvatar from './components/BioAvatar';
import Assistant from './components/Assistant';
import ForecastWidget from './components/ForecastWidget';
import ActionSimulator from './components/ActionSimulator';
import MetricCard from './components/MetricCard';
import AppointmentWidget from './components/AppointmentWidget';
import { generateHealthInsight, generateForecast } from './services/gemini';
import { Activity, Bell, User, MessageSquareText, Sparkles, Menu, AlertTriangle } from 'lucide-react';

// --- MOCK DATA GENERATOR ---
const generateMockData = (): HealthData => {
  const historyLen = 20;
  const r = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
  const arr = (min: number, max: number) => Array.from({ length: historyLen }, () => r(min, max));

  return {
    energyLevel: r(40, 80),
    heartRate: {
      id: 'hr', name: 'Heart Rate', value: r(65, 95), unit: 'bpm',
      status: 'normal', trend: 'stable', history: arr(60, 100),
      description: 'Beats per minute.'
    },
    bloodPressureSys: {
      id: 'bp_sys', name: 'Systolic BP', value: r(115, 135), unit: 'mmHg',
      status: 'normal', trend: 'up', history: arr(110, 145),
      description: 'Upper arterial pressure.'
    },
    bloodPressureDia: {
      id: 'bp_dia', name: 'Diastolic BP', value: r(75, 85), unit: 'mmHg',
      status: 'normal', trend: 'stable', history: arr(70, 90),
      description: 'Lower arterial pressure.'
    },
    oxygenLevel: {
      id: 'spo2', name: 'SpO2', value: r(96, 99), unit: '%',
      status: 'normal', trend: 'stable', history: arr(95, 100),
      description: 'Oxygen saturation.'
    },
    temperature: {
      id: 'temp', name: 'Body Temp', value: 36.6, unit: '°C',
      status: 'normal', trend: 'stable', history: arr(36, 37),
      description: 'Core body temperature.'
    },
    stressLevel: {
      id: 'stress', name: 'Stress Load', value: r(30, 60), unit: '/100',
      status: 'normal', trend: 'down', history: arr(20, 80),
      description: 'HRV based stress score.'
    },
    hydration: {
      id: 'hydro', name: 'Hydration', value: r(30, 70), unit: '%',
      status: 'warning', trend: 'down', history: arr(40, 90),
      description: 'Estimated water levels.'
    }
  };
};

const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Emily Wei',
    specialty: 'General Practitioner',
    date: new Date(Date.now() + 86400000 * 5), // 5 days from now
    type: 'Video'
  }
];

function App() {
  const [healthData, setHealthData] = useState<HealthData>(generateMockData());
  const [simulatedData, setSimulatedData] = useState<HealthData | null>(null);
  const [activeSimulationId, setActiveSimulationId] = useState<string | null>(null);
  const [isRiskMode, setIsRiskMode] = useState(false);
  
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [insight, setInsight] = useState<string>("Initializing Aura...");
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wellnessScore, setWellnessScore] = useState(85);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const calculateWellnessScore = (data: HealthData) => {
    // Simple algorithm to calculate a 0-100 score based on vitals
    let score = 100;
    if (data.stressLevel.value > 50) score -= 10;
    if (data.stressLevel.value > 80) score -= 20;
    if (data.hydration.value < 50) score -= 10;
    if (data.oxygenLevel.value < 95) score -= 15;
    if (data.heartRate.value > 100 || data.heartRate.value < 50) score -= 10;
    return Math.max(0, score);
  };

  const refreshData = useCallback(async () => {
    setLoading(true);
    // Simulate API latency
    await new Promise(r => setTimeout(r, 600));
    const newData = generateMockData();
    
    // Logic for mock status
    if (newData.hydration.value < 40) newData.hydration.status = 'warning';
    if (newData.heartRate.value > 100) newData.heartRate.status = 'warning';

    setHealthData(newData);
    setWellnessScore(calculateWellnessScore(newData));
    
    // Parallel fetch AI
    generateHealthInsight(newData).then(setInsight);
    generateForecast(newData).then(setForecast);
    
    setLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle Simulation (The "Out of the box" feature)
  const handleSimulation = (action: SimulationAction, riskMode: boolean) => {
    setActiveSimulationId(action.id);
    setIsRiskMode(riskMode);
    
    // Create a deep merge of the current data with the effect
    const mergedData = JSON.parse(JSON.stringify(healthData));
    
    Object.keys(action.effect).forEach((key) => {
      // @ts-ignore
      if (typeof action.effect[key] === 'object' && mergedData[key]) {
        // @ts-ignore
        mergedData[key] = { ...mergedData[key], ...action.effect[key] };
      } else {
        // @ts-ignore
        mergedData[key] = action.effect[key];
      }
    });
    
    setSimulatedData(mergedData);
    // Update score for simulation view
    setWellnessScore(calculateWellnessScore(mergedData));
  };

  const clearSimulation = () => {
    setSimulatedData(null);
    setActiveSimulationId(null);
    setIsRiskMode(false);
    setWellnessScore(calculateWellnessScore(healthData));
  };

  // Determine which data to show (Real vs Simulated)
  const displayData = simulatedData || healthData;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex justify-center overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* App Container */}
      <div className="w-full max-w-md h-full min-h-screen bg-slate-950 relative flex flex-col shadow-2xl overflow-y-auto pb-24 border-x border-slate-900">
        
        {/* Header */}
        <header className="px-6 py-6 flex justify-between items-start z-10 sticky top-0 bg-gradient-to-b from-slate-900 via-slate-900/90 to-transparent pb-8">
           <div className="flex flex-col">
             <span className="text-slate-400 text-sm font-medium">{getGreeting()}, Alex</span>
             <h1 className="text-2xl font-bold text-white leading-tight tracking-tight">Your Health Aura</h1>
             
             {/* Mode Indicator */}
             <div className="flex items-center gap-1.5 mt-2">
                 <span className={`w-2 h-2 rounded-full ${simulatedData ? (isRiskMode ? 'bg-red-500 animate-ping' : 'bg-indigo-500 animate-pulse') : 'bg-emerald-500'} `}></span>
                 <p className={`text-[10px] font-bold uppercase tracking-widest ${isRiskMode ? 'text-red-400' : 'text-slate-400'}`}>
                   {simulatedData ? (isRiskMode ? 'Risk Analysis' : 'Preview Mode') : 'Live Monitoring'}
                 </p>
               </div>
           </div>
           
           <button onClick={refreshData} disabled={loading} className="p-3 bg-slate-800/50 backdrop-blur-md rounded-2xl text-slate-400 hover:text-white border border-white/5 transition active:scale-95">
             <Bell size={20} />
             {/* Notification Dot */}
             <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
           </button>
        </header>

        {/* --- HERO SECTION: INTERACTIVE AVATAR --- */}
        <div className="relative z-0 -mt-4 px-4 min-h-[400px]">
           {/* Insight Pill */}
           <div className="absolute top-0 left-0 right-0 flex justify-center z-20 pointer-events-none">
             <div className={`backdrop-blur-xl px-5 py-3 rounded-2xl border shadow-2xl max-w-[90%] text-center transition-all duration-500 ${simulatedData ? (isRiskMode ? 'bg-red-900/80 border-red-500/50 translate-y-2' : 'bg-indigo-900/80 border-indigo-500/50 translate-y-2') : 'bg-slate-800/60 border-white/10'}`}>
               <p className={`text-xs font-medium flex items-center justify-center gap-2 leading-relaxed ${simulatedData ? (isRiskMode ? 'text-red-100' : 'text-indigo-100') : 'text-slate-200'}`}>
                  {isRiskMode ? <AlertTriangle size={14} className="text-red-400 shrink-0" /> : <Sparkles size={14} className={simulatedData ? "text-indigo-400 shrink-0" : "text-amber-400 shrink-0"} />}
                  {simulatedData ? "Visualizing effect on your body..." : insight}
               </p>
             </div>
           </div>

           <BioAvatar 
             data={healthData} 
             simulatedData={simulatedData}
             wellnessScore={wellnessScore}
             isRiskMode={isRiskMode}
           />
        </div>

        {/* --- MAIN DASHBOARD CONTENT --- */}
        <main className="px-5 space-y-8 relative z-10 -mt-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-10">
           
           {/* 1. Simulator Dock (Unique Feature) */}
           <section className={`backdrop-blur-xl p-5 rounded-[2rem] border shadow-2xl ring-1 transition-colors duration-500 ${isRiskMode ? 'bg-red-950/40 border-red-500/20 ring-red-500/10' : 'bg-slate-900/60 border-white/5 ring-white/5'}`}>
             <ActionSimulator 
               onSimulate={handleSimulation}
               onClear={clearSimulation}
               activeActionId={activeSimulationId}
             />
           </section>

           {/* 2. Live Vitals Grid (Core Dashboard Feature) */}
           <section>
              <div className="flex justify-between items-end mb-4 px-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Vital Statistics
                </h3>
                {simulatedData && <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${isRiskMode ? 'text-red-300 bg-red-500/20 border-red-500/30' : 'text-indigo-300 bg-indigo-500/20 border-indigo-500/30'}`}>PREVIEW VALUES</span>}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <MetricCard 
                  vital={displayData.heartRate} 
                  onClick={() => {}} 
                  isCompact 
                />
                <MetricCard 
                  vital={displayData.bloodPressureSys} 
                  onClick={() => {}} 
                  isCompact 
                />
                 <MetricCard 
                  vital={displayData.oxygenLevel} 
                  onClick={() => {}} 
                  isCompact 
                />
                <MetricCard 
                  vital={displayData.stressLevel} 
                  onClick={() => {}} 
                  isCompact 
                />
              </div>
           </section>
           
           {/* 3. Care Connect (Appointments) */}
           <section>
              <AppointmentWidget 
                appointments={mockAppointments}
                isRiskMode={isRiskMode}
              />
           </section>

           {/* 4. Forecast Widget (Predictive Feature) */}
           <section>
             <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider px-2">Forecast</h3>
             <ForecastWidget forecast={forecast} loading={loading} />
           </section>

        </main>

        <div className="h-12" /> {/* Spacer */}

        {/* Floating AI Fab */}
        <div className="fixed bottom-24 right-6 z-40">
           <button 
             onClick={() => setAssistantOpen(true)}
             className="group w-14 h-14 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/40 flex items-center justify-center text-white hover:scale-110 hover:-rotate-3 transition-all duration-300 border border-white/20 relative overflow-hidden"
           >
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-500 opacity-100 group-hover:opacity-90 transition-opacity"></div>
             <MessageSquareText size={24} fill="currentColor" className="text-white relative z-10" />
           </button>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-slate-950/80 backdrop-blur-xl border-t border-white/5 px-8 py-5 z-50 flex justify-between items-center pb-8">
            <button className="flex flex-col items-center gap-1.5 text-indigo-400 relative">
               <Activity size={24} />
               <span className="text-[10px] font-bold tracking-wide">Monitor</span>
               <span className="absolute -bottom-3 w-1 h-1 bg-indigo-400 rounded-full"></span>
            </button>
            <button className="flex flex-col items-center gap-1.5 text-slate-600 hover:text-slate-300 transition group">
               <Sparkles size={24} className="group-hover:text-amber-300 transition-colors" />
               <span className="text-[10px] font-medium tracking-wide">Goals</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 text-slate-600 hover:text-slate-300 transition">
               <User size={24} />
               <span className="text-[10px] font-medium tracking-wide">Profile</span>
            </button>
        </nav>

        {/* AI Assistant Modal */}
        <Assistant 
          isOpen={isAssistantOpen} 
          onClose={() => setAssistantOpen(false)} 
          healthData={healthData} 
        />

      </div>
    </div>
  );
}

export default App;
