import React, { useState, useEffect, useCallback } from 'react';
import { HealthData, ForecastPoint, SimulationAction, Appointment, DeviceStatus } from './types';
import BioAvatar from './components/BioAvatar';
import Assistant from './components/Assistant';
import ForecastWidget from './components/ForecastWidget';
import ActionSimulator from './components/ActionSimulator';
import AppointmentWidget from './components/AppointmentWidget';
import SmartDeviceGrid from './components/SmartDeviceGrid';
import { generateHealthInsight, generateForecast } from './services/gemini';
import { MessageSquareText, Watch, Activity, Sparkles, User, Flame } from 'lucide-react';

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
      
      {/* App Container */}
      <div className="w-full max-w-md h-full bg-slate-950 relative shadow-2xl border-x border-slate-900 overflow-hidden">
        
        {/* --- HEADER (FIXED TOP Z-10) --- */}
        {/* Z-10 is lower than Scroll Sheet (Z-50) so sheet covers it */}
        <header className="absolute top-0 left-0 right-0 px-6 pt-6 pb-2 z-10 pointer-events-none">
          <div className="flex justify-between items-start pointer-events-auto">
            <div className="flex flex-col max-w-[75%]">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 w-fit mb-2 shadow-lg">
                 <Watch size={10} className={deviceStatus.isConnected ? "text-emerald-400" : "text-slate-600"} />
                 <span className="text-[9px] font-bold text-slate-400 tracking-wider">
                   {deviceStatus.isSyncing ? "SYNCING..." : "CONNECTED"}
                 </span>
                 <span className="text-[9px] font-bold text-slate-600">•</span>
                 <span className="text-[9px] font-bold text-slate-400">{deviceStatus.batteryLevel}%</span>
              </div>
              
              <h1 className="text-xl font-bold text-white leading-tight drop-shadow-lg">Good Morning, Alex</h1>
              
              <p className={`text-xs mt-2 font-medium leading-relaxed transition-colors duration-500 drop-shadow-md ${isEmergency ? 'text-red-300' : 'text-slate-200'}`}>
                {isRiskMode ? "Alert: Simulating adverse event." : insight}
              </p>
            </div>

            {/* Harmony Score */}
            <div className="flex flex-col items-center">
               <div className="relative">
                 <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 backdrop-blur-md shadow-lg ${
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

        {/* --- BIO AVATAR (FIXED BACKGROUND Z-0) --- */}
        {/* Adjusted pt to 32 (128px) to safely clear header while keeping layout tight */}
        <div className="absolute top-0 left-0 w-full h-[540px] z-0 flex items-center justify-center pt-32">
           <BioAvatar 
             data={healthData} 
             simulatedData={simulatedData}
             wellnessScore={wellnessScore}
             isRiskMode={isRiskMode}
             highlightedMetric={activeHighlight}
             onMetricSelect={setActiveHighlight}
           />
        </div>

        {/* --- CONTENT SCROLL (COVER SHEET Z-50) --- */}
        {/* Z-50 ensures this is on top of Header. bg-slate-950 ensures no transparency ghosting. */}
        <div className="absolute inset-0 z-50 overflow-y-auto no-scrollbar pb-24">
          
          {/* Spacer to show Avatar initially - Adjusted to 480px to reveal bottom metrics */}
          <div className="w-full h-[480px] shrink-0 pointer-events-none" />

          {/* Sliding Sheet */}
          <div className="w-full min-h-screen bg-slate-950 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] border-t border-white/10 p-5 pb-32 transition-all relative">
             
             {/* Handle bar for visual cue */}
             <div className="w-full flex justify-center mb-6">
                <div className="w-12 h-1 bg-slate-800 rounded-full" />
             </div>

             {/* CONTROL DECK (Simulator + Smart Home) */}
            <div className="animate-[fadeIn_0.3s]">
               <div className="flex justify-between items-center mb-2 px-1">
                 <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Control Deck</h2>
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
            <div className="animate-[fadeIn_0.5s] mt-5">
                <AppointmentWidget appointments={mockAppointments} isRiskMode={isRiskMode} />
            </div>

            {/* FORECAST */}
            <div className="animate-[fadeIn_0.6s] mt-5">
               <ForecastWidget forecast={forecast} loading={loading} />
            </div>
          </div>
        </div>

        {/* Floating AI Button (Fixed Z-[60]) */}
        <div className="absolute bottom-24 right-6 z-[60]">
           <button 
             onClick={() => setAssistantOpen(true)}
             className="w-12 h-12 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center text-white hover:scale-105 hover:bg-indigo-500 transition-all border border-white/10 group"
           >
             <MessageSquareText size={20} fill="currentColor" className="text-white" />
           </button>
        </div>

        {/* Bottom Navigation (Fixed Z-[60]) */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0f172a]/95 backdrop-blur-xl border-t border-slate-800 z-[60] px-6 py-4 pb-6">
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