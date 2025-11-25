
import React, { useState, useEffect, useCallback } from 'react';
import { HealthData, ForecastPoint, SimulationAction, Appointment, DeviceStatus } from './types';
import BioAvatar from './components/BioAvatar';
import Assistant from './components/Assistant';
import ForecastWidget from './components/ForecastWidget';
import ActionSimulator from './components/ActionSimulator';
import MetricCard from './components/MetricCard';
import AppointmentWidget from './components/AppointmentWidget';
import EnvironmentCard from './components/EnvironmentCard';
import { generateHealthInsight, generateForecast } from './services/gemini';
import { Bell, MessageSquareText, Watch, RefreshCw, Activity, Sparkles, User } from 'lucide-react';

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
    
    // Simulate API latency & Sync delay
    await new Promise(r => setTimeout(r, 1200));
    
    const newData = generateMockData();
    
    // Logic for mock status
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
    
    // Parallel fetch AI
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
      
      {/* App Container - Fixed Height */}
      <div className="w-full max-w-md h-full bg-slate-950 relative flex flex-col shadow-2xl border-x border-slate-900">
        
        {/* --- HEADER --- */}
        <header className="px-6 pt-6 pb-2 z-20 bg-gradient-to-b from-slate-950 via-slate-950/90 to-transparent flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              {/* Status Bar */}
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase flex items-center gap-1.5 mb-1">
                 <Watch size={10} className={deviceStatus.isConnected ? "text-indigo-400" : "text-slate-600"} />
                 {deviceStatus.isSyncing ? "SYNCING..." : "CONNECTED"} 
                 <span className="text-slate-700">•</span> 
                 {deviceStatus.batteryLevel}%
              </span>
              
              {/* Greeting */}
              <h1 className="text-xl font-bold text-white leading-tight">Good Morning, Alex</h1>
              
              {/* AI Insight (Moved here for cleanliness) */}
              <div className="mt-2 flex items-start gap-2 max-w-[280px]">
                <div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${isEmergency ? 'bg-red-500 animate-ping' : 'bg-indigo-400'}`} />
                <p className={`text-xs font-medium leading-relaxed transition-colors duration-500 ${isEmergency ? 'text-red-300' : 'text-indigo-200'}`}>
                  {isRiskMode ? "Simulating adverse health event. Vitals destabilizing." : insight}
                </p>
              </div>
            </div>

            <button onClick={refreshData} disabled={loading} className="p-2.5 bg-slate-800/50 rounded-full border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95">
               {deviceStatus.isSyncing ? <RefreshCw size={20} className="animate-spin text-indigo-400" /> : <Bell size={20} />}
            </button>
          </div>
        </header>

        {/* --- HERO SECTION: BIO AVATAR (Top Fixed) --- */}
        <div className="relative h-[38%] flex-shrink-0 flex flex-col items-center justify-center z-10 transition-all duration-500">
           {/* Visual Avatar */}
           <BioAvatar 
             data={healthData} 
             simulatedData={simulatedData}
             wellnessScore={wellnessScore}
             isRiskMode={isRiskMode}
           />
        </div>

        {/* --- SCROLLABLE CONTENT (Bottom) --- */}
        <div className="flex-1 bg-slate-900/80 backdrop-blur-xl rounded-t-[2.5rem] border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col z-20 overflow-hidden relative">
          
          {/* Scroll Fade Overlay */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-900/80 to-transparent z-30 pointer-events-none" />

          {/* Main Content Area - with padding at bottom for nav bar */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-28">
            
            {/* 1. Action Simulator (Effect Preview) */}
            <div className="animate-[fadeIn_0.3s]">
               <ActionSimulator 
                 onSimulate={handleSimulation}
                 onClear={clearSimulation}
                 activeActionId={activeSimulationId}
               />
            </div>

            {/* 2. Live Vitals & IoT Grid (Monitor + Control) */}
            <div className="animate-[fadeIn_0.4s]">
              <div className="flex justify-between items-end mb-3 ml-1 mr-1">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Vitals & Environment</h2>
                <span className="text-[10px] text-slate-600 font-medium">Updated Now</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <MetricCard vital={displayData.heartRate} onClick={() => {}} isCompact isDeviceMetric />
                <MetricCard vital={displayData.oxygenLevel} onClick={() => {}} isCompact isDeviceMetric />
                <MetricCard vital={displayData.stressLevel} onClick={() => {}} isCompact />
                <MetricCard vital={displayData.hydration} onClick={() => {}} isCompact />
                {/* Environment Card (Control) */}
                <EnvironmentCard />
                {/* Keep one BP card or swap for other data */}
                <MetricCard vital={displayData.bloodPressureSys} onClick={() => {}} isCompact />
              </div>
            </div>
            
            {/* 3. Care Connect (Appointments & SOS) */}
            <div className="animate-[fadeIn_0.5s]">
                <AppointmentWidget appointments={mockAppointments} isRiskMode={isRiskMode} />
            </div>

            {/* 4. Forecast (Prediction) */}
            <div className="animate-[fadeIn_0.6s]">
               <ForecastWidget forecast={forecast} loading={loading} />
            </div>

          </div>
        </div>

        {/* Floating AI Assistant Button (Adjusted position) */}
        <div className="absolute bottom-24 right-6 z-50">
           <button 
             onClick={() => setAssistantOpen(true)}
             className="w-14 h-14 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/40 flex items-center justify-center text-white hover:scale-110 hover:-rotate-3 transition-all duration-300 border border-white/20 group"
           >
             <MessageSquareText size={24} fill="currentColor" className="text-white group-hover:animate-pulse" />
           </button>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0f172a] border-t border-slate-800 z-40 px-6 py-4 pb-6">
          <div className="flex justify-around items-center">
            <button 
              onClick={() => setActiveTab('monitor')}
              className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'monitor' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Activity size={24} strokeWidth={activeTab === 'monitor' ? 2.5 : 2} />
              <span className={`text-[10px] font-bold ${activeTab === 'monitor' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>Monitor</span>
              {activeTab === 'monitor' && <div className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />}
            </button>
            
            <button 
              onClick={() => setActiveTab('goals')}
              className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'goals' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Sparkles size={24} strokeWidth={activeTab === 'goals' ? 2.5 : 2} />
              <span className={`text-[10px] font-bold ${activeTab === 'goals' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>Goals</span>
              {activeTab === 'goals' && <div className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />}
            </button>
            
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'profile' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
              <span className={`text-[10px] font-bold ${activeTab === 'profile' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>Profile</span>
              {activeTab === 'profile' && <div className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />}
            </button>
          </div>
        </div>

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
