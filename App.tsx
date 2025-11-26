
import React, { useState, useEffect, useCallback } from 'react';
import { HealthData, ForecastPoint, SimulationAction, Appointment, DeviceStatus } from './types';
import BioAvatar from './components/BioAvatar';
import Assistant from './components/Assistant';
import ForecastWidget from './components/ForecastWidget';
import ActionSimulator from './components/ActionSimulator';
import AppointmentWidget from './components/AppointmentWidget';
import SmartDeviceGrid from './components/SmartDeviceGrid'; // Updated Import
import { generateHealthInsight, generateForecast } from './services/gemini';
import { MessageSquareText, Watch, Activity, Sparkles, User, Info, ArrowRight, Flame } from 'lucide-react';

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
  
  // State for visual spotlighting
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [insight, setInsight] = useState<string>("Analyzing your daily bio-rhythms...");
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wellnessScore, setWellnessScore] = useState(85);
  const [activeTab, setActiveTab] = useState<'monitor' | 'goals' | 'profile'>('monitor');
  const [showOnboarding, setShowOnboarding] = useState(true);

  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    isConnected: true,
    batteryLevel: 82,
    lastSync: new Date(),
    deviceName: 'Aura Watch S7',
    isSyncing: false
  });

  const calculateWellnessScore = (data: HealthData) => {
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
    setDeviceStatus(prev => ({ ...prev, isSyncing: true }));
    
    await new Promise(r => setTimeout(r, 1200));
    
    const newData = generateMockData();
    
    if (newData.hydration.value < 40) newData.hydration.status = 'warning';
    if (newData.heartRate.value > 100) newData.heartRate.status = 'warning';

    setHealthData(newData);
    setWellnessScore(calculateWellnessScore(newData));
    setDeviceStatus(prev => ({ 
      ...prev, 
      isSyncing: false, 
      lastSync: new Date(),
      batteryLevel: Math.max(10, prev.batteryLevel - 1) 
    }));
    
    generateHealthInsight(newData).then(setInsight);
    generateForecast(newData).then(setForecast);
    
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSimulation = (action: SimulationAction, riskMode: boolean) => {
    setActiveSimulationId(action.id);
    setIsRiskMode(riskMode);
    
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
    setWellnessScore(calculateWellnessScore(mergedData));
  };

  const clearSimulation = () => {
    setSimulatedData(null);
    setActiveSimulationId(null);
    setIsRiskMode(false);
    setWellnessScore(calculateWellnessScore(healthData));
  };

  const displayData = simulatedData || healthData;
  const isEmergency = isRiskMode || displayData.heartRate.value > 120 || displayData.stressLevel.value > 80;

  return (
    <div className="h-screen max-h-screen bg-[#0f172a] text-slate-100 flex justify-center font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* Onboarding Overlay */}
      {showOnboarding && (
        <div className="absolute inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-[fadeIn_0.5s]">
           <div className="w-full max-w-sm bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
             <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center animate-pulse">
                  <Activity size={32} className="text-indigo-400" />
                </div>
             </div>
             <h2 className="text-2xl font-bold text-center text-white mb-2">Welcome to Aura</h2>
             <p className="text-sm text-slate-400 text-center mb-6 leading-relaxed">
               Your intelligent health companion. Here's how to use your new dashboard:
             </p>
             <div className="space-y-4 mb-8">
               <div className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-white/5">
                   <User size={16} className="text-indigo-400" />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-white">Digital Twin HUD</h3>
                   <p className="text-xs text-slate-400">Tap any metric card to see which body part it connects to.</p>
                 </div>
               </div>
               <div className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-white/5">
                   <Sparkles size={16} className="text-indigo-400" />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-white">Action Preview</h3>
                   <p className="text-xs text-slate-400">Simulate habits to see effects <i>before</i> you do them.</p>
                 </div>
               </div>
               <div className="flex gap-4 items-start">
                 <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-white/5">
                   <Activity size={16} className="text-indigo-400" />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-white">Smart Control</h3>
                   <p className="text-xs text-slate-400">Manage environment, medications, and security instantly.</p>
                 </div>
               </div>
             </div>
             <button 
               onClick={() => setShowOnboarding(false)}
               className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2"
             >
               Get Started <ArrowRight size={18} />
             </button>
           </div>
        </div>
      )}

      {/* App Container */}
      <div className="w-full max-w-md h-full bg-slate-950 relative flex flex-col shadow-2xl border-x border-slate-900">
        
        {/* --- HEADER --- */}
        <header className="px-6 pt-6 pb-2 z-20 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/50 border border-white/5 w-fit mb-2">
                 <Watch size={10} className={deviceStatus.isConnected ? "text-emerald-400" : "text-slate-600"} />
                 <span className="text-[9px] font-bold text-slate-400 tracking-wider">
                   {deviceStatus.isSyncing ? "SYNCING..." : "CONNECTED"}
                 </span>
                 <span className="text-[9px] font-bold text-slate-600">•</span>
                 <span className="text-[9px] font-bold text-slate-400">{deviceStatus.batteryLevel}%</span>
              </div>
              
              <h1 className="text-xl font-bold text-white leading-tight">Good Morning, Alex</h1>
              
              <p className={`text-xs mt-1 font-medium transition-colors duration-500 ${isEmergency ? 'text-red-300' : 'text-indigo-200/80'}`}>
                {isRiskMode ? "Alert: Simulating adverse event." : insight}
              </p>
            </div>

            {/* Harmony Score */}
            <div className="flex flex-col items-center">
               <div className="relative">
                 <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${
                   wellnessScore > 80 ? 'border-emerald-500/30 bg-emerald-500/10' : 
                   wellnessScore > 50 ? 'border-amber-500/30 bg-amber-500/10' : 'border-red-500/30 bg-red-500/10'
                 }`}>
                    <span className={`text-lg font-bold ${
                       wellnessScore > 80 ? 'text-emerald-400' : 
                       wellnessScore > 50 ? 'text-amber-400' : 'text-red-400'
                    }`}>{wellnessScore}</span>
                 </div>
                 <div className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-0.5 border border-white/5">
                   <Flame size={10} className={wellnessScore > 80 ? 'text-orange-400 fill-orange-400' : 'text-slate-600'} />
                 </div>
               </div>
            </div>
          </div>
        </header>

        {/* --- BIO AVATAR (HUD) --- */}
        <div className="relative h-[40%] flex-shrink-0 flex flex-col items-center justify-center z-10">
           <BioAvatar 
             data={healthData} 
             simulatedData={simulatedData}
             wellnessScore={wellnessScore}
             isRiskMode={isRiskMode}
             highlightedMetric={activeHighlight}
             onMetricSelect={setActiveHighlight}
           />
           <button onClick={() => setShowOnboarding(true)} className="absolute top-0 right-6 p-2 text-slate-600 hover:text-slate-400 transition">
             <Info size={16} />
           </button>
        </div>

        {/* --- CONTENT SCROLL --- */}
        <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col z-20 overflow-hidden relative border-t border-white/5">
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-28">
            
            {/* CONTROL DECK (Simulator + Smart Home) */}
            <div className="animate-[fadeIn_0.3s]">
               <div className="flex justify-between items-center mb-3 px-1">
                 <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Control Deck</h2>
               </div>
               
               <div className="grid grid-cols-1 gap-3">
                 <ActionSimulator 
                   onSimulate={handleSimulation}
                   onClear={clearSimulation}
                   activeActionId={activeSimulationId}
                 />
                 <SmartDeviceGrid />
               </div>
            </div>
            
            {/* CARE CONNECT */}
            <div className="animate-[fadeIn_0.5s]">
                <AppointmentWidget appointments={mockAppointments} isRiskMode={isRiskMode} />
            </div>

            {/* FORECAST */}
            <div className="animate-[fadeIn_0.6s]">
               <ForecastWidget forecast={forecast} loading={loading} />
            </div>

          </div>
        </div>

        {/* Floating AI Button */}
        <div className="absolute bottom-24 right-6 z-50">
           <button 
             onClick={() => setAssistantOpen(true)}
             className="w-12 h-12 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center text-white hover:scale-105 hover:bg-indigo-500 transition-all border border-white/10 group"
           >
             <MessageSquareText size={20} fill="currentColor" className="text-white" />
           </button>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0f172a]/90 backdrop-blur-xl border-t border-slate-800 z-40 px-6 py-4 pb-6">
          <div className="flex justify-around items-center">
            <button 
              onClick={() => setActiveTab('monitor')}
              className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'monitor' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Activity size={24} strokeWidth={activeTab === 'monitor' ? 2.5 : 2} />
              <span className={`text-[10px] font-bold ${activeTab === 'monitor' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>Monitor</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('goals')}
              className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'goals' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Sparkles size={24} strokeWidth={activeTab === 'goals' ? 2.5 : 2} />
              <span className={`text-[10px] font-bold ${activeTab === 'goals' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>Goals</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
              <span className={`text-[10px] font-bold ${activeTab === 'profile' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>Profile</span>
            </button>
          </div>
        </div>

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
