import React, { useEffect, useState } from 'react';
import {
  HealthData,
  Medication,
  ActivityData,
  Appointment,
  BodyPart,
  EnvironmentalState
} from './types';
import BioAvatar from './components/BioAvatar';
import BioControls from './components/BioControls';
import NutriScanner from './components/NutriScanner';
import AppointmentWidget from './components/AppointmentWidget';
import MedicationManager from './components/MedicationManager';
import Assistant from './components/Assistant';
import WellnessPage from './components/WellnessPage'; // <--- ADDED IMPORT
import {
  Zap,
  ScanBarcode,
  Utensils,
  Activity,
  ShieldAlert,
  Info,
  Sparkles,
  User,
  MessageSquare
} from 'lucide-react';
import SymptomSelector from './components/SymptomSelector';
import AiDoctorFab from './components/AiDoctorFab';
import EmergencyOverlay from './components/EmergencyOverlay';

type ScannedFood = { name: string; calories: number; [key: string]: any; };
type LogActionType = 'water' | 'hear' | 'mood' | 'rest' | 'scan' | 'meds';

// --- INITIAL DATA ---
const initialHealthData: HealthData = {
  energyLevel: 65,
  heartRate: { id: 'hr', name: 'Heart Rate', value: 82, unit: 'bpm', status: 'normal', trend: 'stable', history: [], description: '' },
  bloodPressureSys: { id: 'bp_sys', name: 'BP Systolic', value: 128, unit: 'mmHg', status: 'normal', trend: 'up', history: [], description: '' },
  bloodPressureDia: { id: 'bp_dia', name: 'BP Diastolic', value: 82, unit: 'mmHg', status: 'normal', trend: 'stable', history: [], description: '' },
  oxygenLevel: { id: 'spo2', name: 'SpO2', value: 98, unit: '%', status: 'normal', trend: 'stable', history: [], description: '' },
  temperature: { id: 'temp', name: 'Temp', value: 36.6, unit: '°C', status: 'normal', trend: 'stable', history: [], description: '' },
  stressLevel: { id: 'stress', name: 'Stress', value: 42, unit: '/100', status: 'normal', trend: 'down', history: [], description: '' },
  hydration: { id: 'hydro', name: 'Hydration', value: 45, unit: '%', status: 'warning', trend: 'down', history: [], description: '' },
  activeSymptoms: []
};

const initialActivity: ActivityData = { steps: 6432, goalSteps: 10000, activeMinutes: 45, caloriesBurned: 1240, standHours: 8 };
const initialMeds: Medication[] = [
  { id: '1', name: 'Vitamin D3', dosage: '1000 IU', time: '08:00 AM', taken: true, type: 'pill' },
  { id: '2', name: 'Omega-3', dosage: '500 mg', time: '12:00 PM', taken: false, type: 'pill' },
  { id: '3', name: 'Magnesium', dosage: '200 mg', time: '09:00 PM', taken: false, type: 'pill' }
];
const mockAppointments: Appointment[] = [{ id: '1', doctorName: 'Dr. Emily Wei', specialty: 'Cardiology', date: new Date(Date.now() + 86400000 * 2), type: 'Video' }];
const initialEnvironment: EnvironmentalState = { outdoorTempC: 28, airQualityIndex: 'Good', noiseLevelDb: 45, isRaining: false };

function App() {
  const [healthData, setHealthData] = useState<HealthData>(initialHealthData);
  const [activity] = useState<ActivityData>(initialActivity);
  const [meds, setMeds] = useState<Medication[]>(initialMeds);
  const [aiInsight, setAiInsight] = useState('Hydration is low. Drink water to boost energy.');
  const [visualTrigger, setVisualTrigger] = useState<string | null>(null);
  const [environment, setEnvironment] = useState<EnvironmentalState>(initialEnvironment);
  const [doctorSuggestion, setDoctorSuggestion] = useState<string>("Remember your Omega-3 with lunch.");
  
  // UI States
  const [showScanner, setShowScanner] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);
  const [isSOSActive, setSOSActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'monitor' | 'wellness' | 'profile'>('monitor');

  // --- LOGIC ENGINE ---
  const handleLogAction = (type: LogActionType, medId?: string, moodValue?: string) => {
    setVisualTrigger(type);
    setTimeout(() => setVisualTrigger(null), 2000);

    if (type === 'scan') { setShowScanner(true); return; }

    if (type === 'hear') {
        const newNoise = Math.floor(Math.random() * (65 - 35) + 35);
        setEnvironment(prev => ({ ...prev, noiseLevelDb: newNoise }));
        setAiInsight(`Noise analyzed: ${newNoise}dB. Environment is safe.`);
    }

    if (type === 'mood' && moodValue) {
        setAiInsight(`Mood logged: ${moodValue}. Adjusting bio-metrics...`);
        setHealthData(prev => ({
            ...prev,
            stressLevel: { ...prev.stressLevel, value: moodValue === 'Stressed' || moodValue === 'Anxious' ? 75 : 25 },
            heartRate: { ...prev.heartRate, value: moodValue === 'Anxious' ? 95 : 72 }
        }));
    }

    if (type === 'rest') {
        setAiInsight("Sleep tracked. Energy projected to rise +20%.");
        setHealthData(prev => ({
            ...prev,
            energyLevel: Math.min(100, prev.energyLevel + 20),
            stressLevel: { ...prev.stressLevel, value: Math.max(10, prev.stressLevel.value - 15) }
        }));
    }
    
    if (type === 'water') {
      setHealthData(prev => ({ ...prev, hydration: { ...prev.hydration, value: Math.min(100, prev.hydration.value + 15) } }));
      setAiInsight("Good job! Hydration levels rising.");
    }

    if (type === 'meds' && medId) {
      setMeds(prev => prev.map(m => (m.id === medId ? { ...m, taken: true } : m)));
      setAiInsight("Medication confirmed. Tracking adherence.");
    }
  };

  const handleSymptomLog = (symptomId: string, symptomName: string) => {
    setHealthData(prev => ({ 
        ...prev, 
        activeSymptoms: [...(prev.activeSymptoms || []), { id: symptomId, name: symptomName, severity: 'mild', bodyPart: selectedBodyPart!, timestamp: new Date() }] 
    }));
    setDoctorSuggestion(`I've noted your ${symptomName}. Monitoring vitals.`);
    setSelectedBodyPart(null);
  };

  return (
    <div className="h-screen w-full bg-[#f8fafc] flex items-center justify-center font-sans overflow-hidden">
      <div className="w-full max-w-md h-full bg-white sm:rounded-[3rem] sm:h-[95vh] sm:border-[8px] sm:border-white sm:shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-slate-900/5">
        
        {/* HEADER */}
        <header className="h-16 px-6 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-xl z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap size={20} fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hello, Alex</span>
              <span className="text-sm font-black text-slate-900 tracking-tight">Daily Vitals</span>
            </div>
          </div>
          <button onClick={() => setSOSActive(true)} className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-colors">
            <ShieldAlert size={18} />
          </button>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-4 relative pb-24">
          
          {activeTab === 'monitor' ? (
            <div className="space-y-6 animate-in slide-in-from-left duration-300">
              {/* --- MONITOR TAB --- */}
              <div className="relative h-[440px] w-full bg-gradient-to-b from-indigo-50/60 via-slate-50/50 to-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col items-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-[80px] pointer-events-none" />

                {aiInsight && (
                  <div className="absolute top-5 z-20 animate-in slide-in-from-top-2 w-auto max-w-[90%]">
                    <div className="bg-white/80 backdrop-blur-xl border border-indigo-100 px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-3">
                      <Info size={16} className="text-indigo-500 shrink-0" />
                      <p className="text-xs font-bold text-slate-700 leading-snug">{aiInsight}</p>
                    </div>
                  </div>
                )}

                {selectedBodyPart && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md animate-in fade-in duration-200">
                    <SymptomSelector bodyPart={selectedBodyPart} onClose={() => setSelectedBodyPart(null)} onSelect={handleSymptomLog} />
                  </div>
                )}

                <div className="w-full h-full pt-10 pb-4">
                  <BioAvatar
                    data={healthData}
                    activityData={activity}
                    environmentalState={environment}
                    simulatedData={visualTrigger ? healthData : null}
                    isRiskMode={false}
                    onBodyPartClick={setSelectedBodyPart}
                  />
                </div>
              </div>

              <div className="-mt-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Quick Log</h3>
                <BioControls onLogAction={handleLogAction} />
              </div>

              <div className="space-y-4">
                <MedicationManager medications={meds} onTake={(id) => handleLogAction('meds', id)} onAddMed={() => {}} onShowDetails={() => {}} />
                
                <button
                  onClick={() => setShowScanner(true)}
                  className="w-full h-20 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between px-6 hover:border-indigo-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <ScanBarcode size={22} />
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-bold text-slate-900">Scan Meal</span>
                      <span className="block text-[10px] font-medium text-slate-400">Log calories & nutrients</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-orange-500 transition-colors">
                    <Utensils size={14} />
                  </div>
                </button>

                <AppointmentWidget appointments={mockAppointments} />
              </div>
            </div>
          ) : activeTab === 'wellness' ? (
            // --- WELLNESS TAB ---
            <WellnessPage healthData={healthData} activityData={activity} />
          ) : (
            // --- PROFILE TAB ---
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 pt-20">
               <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                 <User size={32} />
               </div>
               <p className="font-medium">Profile Settings Coming Soon</p>
            </div>
          )}
        </main>

        {/* BOTTOM NAV */}
        <nav className="h-[80px] px-8 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex items-center justify-between absolute bottom-0 w-full z-40 pb-2">
          <NavButton active={activeTab === 'monitor'} onClick={() => setActiveTab('monitor')} icon={Activity} label="Monitor" />
          <NavButton active={activeTab === 'wellness'} onClick={() => setActiveTab('wellness')} icon={Sparkles} label="Wellness" />
          <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Profile" />
        </nav>

        {/* --- OVERLAYS --- */}
        {showScanner && (
          <div className="absolute inset-0 z-[60] bg-slate-900">
             <NutriScanner onClose={() => setShowScanner(false)} onLogFood={(f) => { setShowScanner(false); setAiInsight(`Logged ${f.name}.`); }} />
          </div>
        )}

        {showAssistant && (
           <div className="absolute inset-0 z-[70] bg-white animate-in slide-in-from-bottom-full duration-300">
             <Assistant onClose={() => setShowAssistant(false)} healthData={healthData} />
           </div>
        )}

        <EmergencyOverlay isOpen={isSOSActive} onClose={() => setSOSActive(false)} />
        
        {!showScanner && !showAssistant && (
          <AiDoctorFab 
            onClick={() => setShowAssistant(true)} 
            isOpen={false} 
            suggestion={doctorSuggestion} 
          />
        )}
      </div>
    </div>
  );
}

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button onClick={onClick} className="group flex flex-col items-center gap-1.5 w-16">
    <div className={`p-1.5 rounded-xl transition-all duration-300 ${active ? 'bg-indigo-50 text-indigo-600 -translate-y-1 shadow-sm' : 'text-slate-400 group-hover:text-slate-600'}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </div>
    {active && <span className="text-[10px] font-bold text-indigo-600 animate-in fade-in slide-in-from-bottom-1">{label}</span>}
  </button>
);

export default App;