// App.tsx (Fixed)
import React, { useEffect, useState } from 'react';
import { HealthData, Medication, ActivityData, Appointment, BodyPart, EnvironmentalState } from './types';
import BioAvatar from './components/BioAvatar';
import BioControls from './components/BioControls';
import NutriScanner from './components/NutriScanner';
import AppointmentWidget from './components/AppointmentWidget';
import MedicationManager from './components/MedicationManager';
import { Zap, ScanBarcode, Utensils, X, Brain, Activity, AlertCircle, ShieldAlert } from 'lucide-react';
import SymptomSelector from './components/SymptomSelector';
import AiDoctorFab from './components/AiDoctorFab';
import EmergencyOverlay from './components/EmergencyOverlay';

// Local type used by the nutrition scanner — not exported from ./types
type ScannedFood = {
  name: string;
  calories: number;
  [key: string]: any;
};

type LogActionType = 'water' | 'hear' | 'mood' | 'rest' | 'scan' | 'meds';

// --- MOCK DATA ---
const initialHealthData: HealthData = {
  energyLevel: 65,
  heartRate: {
    id: 'hr',
    name: 'Heart Rate',
    value: 82,
    unit: 'bpm',
    status: 'normal',
    trend: 'stable',
    history: [72, 75, 78, 76, 82],
    description: 'Slightly elevated'
  },
  bloodPressureSys: {
    id: 'bp_sys',
    name: 'BP Systolic',
    value: 128,
    unit: 'mmHg',
    status: 'normal',
    trend: 'up',
    history: [120, 122, 128],
    description: 'Monitor closely'
  },
  bloodPressureDia: {
    id: 'bp_dia',
    name: 'BP Diastolic',
    value: 82,
    unit: 'mmHg',
    status: 'normal',
    trend: 'stable',
    history: [80, 80, 82],
    description: 'Normal'
  },
  oxygenLevel: {
    id: 'spo2',
    name: 'SpO2',
    value: 97,
    unit: '%',
    status: 'normal',
    trend: 'stable',
    history: [98, 97, 97],
    description: 'Good'
  },
  temperature: {
    id: 'temp',
    name: 'Temp',
    value: 36.7,
    unit: '°C',
    status: 'normal',
    trend: 'stable',
    history: [36.5, 36.7],
    description: 'Normal'
  },
  stressLevel: {
    id: 'stress',
    name: 'Stress',
    value: 55,
    unit: '/100',
    status: 'normal',
    trend: 'up',
    history: [30, 40, 55],
    description: 'Moderate load'
  },
  hydration: {
    id: 'hydro',
    name: 'Hydration',
    value: 42,
    unit: '%',
    status: 'warning',
    trend: 'down',
    history: [60, 50, 42],
    description: 'Low hydration'
  },
  activeSymptoms: []
};

const initialActivity: ActivityData = {
  steps: 6432,
  goalSteps: 10000,
  activeMinutes: 45,
  caloriesBurned: 1240,
  standHours: 8
};

const initialMeds: Medication[] = [
  { id: '1', name: 'Vitamin D3', dosage: '1000 IU', time: '08:00 AM', taken: false, type: 'pill' },
  { id: '2', name: 'Omega-3', dosage: '500 mg', time: '12:00 PM', taken: false, type: 'pill' },
  { id: '3', name: 'Magnesium', dosage: '200 mg', time: '09:00 PM', taken: false, type: 'pill' }
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Emily Wei',
    specialty: 'Cardiology',
    date: new Date(Date.now() + 86400000 * 2),
    type: 'Video'
  }
];

const initialEnvironment: EnvironmentalState = {
  outdoorTempC: 32,
  airQualityIndex: 'Moderate',
  noiseLevelDb: 75,
  isRaining: false
};

function App() {
  const [healthData, setHealthData] = useState<HealthData>(initialHealthData);
  const [activity] = useState<ActivityData>(initialActivity);
  const [meds, setMeds] = useState<Medication[]>(initialMeds);

  const [aiInsight, setAiInsight] = useState(
    'Hydration is low. Log a glass of water to boost your twin.'
  );
  const [visualTrigger, setVisualTrigger] = useState<string | null>(null);

  const [environment, setEnvironment] = useState<EnvironmentalState>(initialEnvironment);
  const [doctorSuggestion, setDoctorSuggestion] = useState<string>("Don't forget your Vit D!");
  const [mood, setMood] = useState('Neutral');

  const [showScanner, setShowScanner] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);
  const [showDoctorMenu, setShowDoctorMenu] = useState(false);
  const [isSOSActive, setSOSActive] = useState(false);

  // --- SMART SUGGESTION LOGIC ---
  useEffect(() => {
    if (healthData.activeSymptoms && healthData.activeSymptoms.length > 0) {
      const latestSymptom = healthData.activeSymptoms[healthData.activeSymptoms.length - 1];
      switch (latestSymptom.id) {
        case 'headache':
          setDoctorSuggestion('Headache noted. Dim the lights and drink water.');
          break;
        case 'dizzy':
          setDoctorSuggestion('Feeling dizzy? Sit down and breathe slowly.');
          break;
        default:
          setDoctorSuggestion(`I've logged your ${latestSymptom.name}. Monitor closely.`);
      }
    } else if (environment.outdoorTempC > 30 && healthData.hydration.value < 60) {
      setDoctorSuggestion(`It's hot (${environment.outdoorTempC}°C). Critical hydration risk! Drink now.`);
    } else if (environment.noiseLevelDb > 70 && healthData.stressLevel.value > 50) {
      setDoctorSuggestion('High external noise detected. Stress is spiking. Find a quiet spot.');
    } else if (healthData.hydration.value < 50) {
      setDoctorSuggestion('Hydration is low. Drink water!');
    } else if (meds.some(m => !m.taken)) {
      setDoctorSuggestion('Time for your meds?');
    } else if (healthData.stressLevel.value > 60) {
      setDoctorSuggestion('Stress detected. Try breathing?');
    } else {
      setDoctorSuggestion("You're doing great, Alex!");
    }
  }, [healthData, meds, environment, mood]);

  const handleLogAction = (
    type: LogActionType,
    medId?: string,
    moodValue?: string
  ) => {
    if (type === 'scan') {
      setShowScanner(true);
      return;
    }

    if (type === 'mood' && moodValue) {
      setMood(moodValue);
      setAiInsight(`Mood logged as ${moodValue}. Analyzing bio-correlation...`);
      return;
    }

    if (type === 'hear') {
      setAiInsight(`Noise check complete. Current level: ${environment.noiseLevelDb} dB.`);
    }

    setVisualTrigger(type);
    setTimeout(() => setVisualTrigger(null), 2000);

    if (type === 'meds' && medId) {
      setMeds(prev =>
        prev.map(m => (m.id === medId ? { ...m, taken: true } : m))
      );
    }

    setHealthData(prev => {
      const newData: HealthData = JSON.parse(JSON.stringify(prev));

      if (type === 'water') {
        newData.hydration.value = Math.min(100, prev.hydration.value + 15);
        newData.hydration.status =
          newData.hydration.value > 50 ? 'normal' : 'warning';
        setAiInsight('Hydration logged. Levels normalizing.');
      }

      if (type === 'meds') {
        newData.bloodPressureSys.value = Math.max(
          110,
          prev.bloodPressureSys.value - 5
        );
        newData.heartRate.value = Math.max(60, prev.heartRate.value - 3);
        setAiInsight('Medication confirmed. Bio-availability increasing.');
      }

      if (type === 'rest') {
        newData.energyLevel = Math.min(100, prev.energyLevel + 20);
        newData.stressLevel.value = Math.max(
          10,
          prev.stressLevel.value - 10
        );
        setAiInsight('Rest logged. Battery recharging.');
      }

      return newData;
    });
  };

  const handleFoodLog = (food: ScannedFood) => {
    setShowScanner(false);
    setAiInsight(
      `Analyzed ${food.name}. ${food.calories}kcal logged. Energy projected to rise.`
    );
    setVisualTrigger('rest');
  };

  const handleTakeMed = (id: string) => {
    handleLogAction('meds', id);
  };

  const handleSymptomLog = (symptomId: string, symptomName: string) => {
    setHealthData(prev => ({
      ...prev,
      activeSymptoms: [
        ...(prev.activeSymptoms || []),
        {
          id: symptomId,
          name: symptomName,
          severity: 'mild',
          bodyPart: selectedBodyPart!,
          timestamp: new Date()
        }
      ]
    }));
    setAiInsight(`Logged ${symptomName}. Dr. Aura analyzing...`);
    setSelectedBodyPart(null);
    setShowDoctorMenu(false);
  };

  const handleDoctorClick = () => {
    setShowDoctorMenu(!showDoctorMenu);
    setSelectedBodyPart(null);
  };

  const handleSelectPartFromMenu = (part: BodyPart) => {
    setSelectedBodyPart(part);
  };

  const handleSOS = () => {
    setSOSActive(true);
  };

  const handleAddMed = () => {
    setAiInsight('Feature: Meds Add Modal would open here.');
  };

  return (
    <div className="h-screen w-full bg-[#05080f] flex items-center justify-center font-sans overflow-hidden selection:bg-indigo-500/30">
      <div className="w-full max-w-md h-full bg-[#0b0f19] flex flex-col relative shadow-2xl md:border-x border-white/5">
        {/* HEADER */}
        <header className="h-14 px-6 border-b border-white/5 bg-[#0b0f19]/90 backdrop-blur-xl flex items-center justify-between shrink-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={20} fill="currentColor" className="text-white" />
            </div>
            <span className="text-sm font-black tracking-wide text-white">
              AURA
            </span>
          </div>

          {/* SOS BUTTON */}
          <button
            onClick={handleSOS}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all animate-pulse-slow"
          >
            <ShieldAlert size={18} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 relative">
          {/* HERO CARD */}
          <div className="relative bg-slate-900/40 rounded-[2rem] border border-white/5 p-4 overflow-hidden flex flex-col shadow-2xl shadow-black/40">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* SYMPTOM SELECTOR OVERLAY */}
            {selectedBodyPart && (
              <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s]">
                <SymptomSelector
                  bodyPart={selectedBodyPart}
                  onClose={() => setSelectedBodyPart(null)}
                  onSelect={handleSymptomLog}
                />
              </div>
            )}

            {/* UNIFIED INTERFACE */}
            <BioControls
              onLogAction={handleLogAction}
              insight={aiInsight}
              medications={meds}
              environmentalState={environment}
            >
              <BioAvatar
                data={healthData}
                activityData={activity}
                environmentalState={environment}
                simulatedData={visualTrigger ? healthData : null}
                isRiskMode={false}
              />
            </BioControls>
          </div>

          {/* SECONDARY WIDGETS */}
          <div className="grid grid-cols-1 gap-3">
            <div className="relative w-full h-auto">
              <MedicationManager
                medications={meds}
                onTake={handleTakeMed}
                onAddMed={handleAddMed} onShowDetails={function (id: string): void {
                  throw new Error('Function not implemented.');
                } }              />
            </div>

            {/* NUTRITION WIDGET */}
            <div className={`relative w-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${showScanner ? 'h-[500px]' : 'h-24'} rounded-3xl overflow-hidden shadow-lg`}>
              {showScanner ? (
                <div className="absolute inset-0 bg-[#151925] border border-amber-500/20 z-40 flex flex-col">
                  <NutriScanner
                    onClose={() => setShowScanner(false)}
                    onLogFood={handleFoodLog}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setShowScanner(true)}
                  className="absolute inset-0 w-full h-full bg-[#151925] p-5 border border-white/5 flex items-center justify-between group hover:border-amber-500/30 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col items-start gap-1 relative z-10">
                    <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase flex items-center gap-2">
                      <Utensils size={12} fill="currentColor" /> NUTRITION AI
                    </span>
                    <span className="text-sm font-bold text-white group-hover:text-amber-100 transition-colors">
                      Scan Meal
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0f121d] border border-white/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white group-hover:scale-110 transition-all shadow-lg">
                    <ScanBarcode size={20} />
                  </div>
                </button>
              )}
            </div>
          </div>

          <div className="pb-6">
            <AppointmentWidget appointments={mockAppointments} />
          </div>
        </main>

        {/* GLOBAL OVERLAYS */}
        <EmergencyOverlay isOpen={isSOSActive} onClose={() => setSOSActive(false)} />

        {showDoctorMenu && !selectedBodyPart && (
          <div className="absolute bottom-24 right-5 z-[100] w-48 bg-[#151925]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl animate-[scaleIn_0.2s] origin-bottom-right">
            <div className="flex justify-between items-center mb-3 px-1 border-b border-white/5 pb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Where does it hurt?
              </span>
              <button
                onClick={() => setShowDoctorMenu(false)}
                className="text-slate-500 hover:text-white transition"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleSelectPartFromMenu('head')}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all text-left group"
              >
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white">
                  <Brain size={14} />
                </div>
                <span className="text-xs font-bold text-slate-300 group-hover:text-white">
                  Head / Mind
                </span>
              </button>
              <button
                onClick={() => handleSelectPartFromMenu('chest')}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all text-left group"
              >
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white">
                  <Activity size={14} />
                </div>
                <span className="text-xs font-bold text-slate-300 group-hover:text-white">
                  Chest / Heart
                </span>
              </button>
              <button
                onClick={() => handleSelectPartFromMenu('stomach')}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all text-left group"
              >
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white">
                  <AlertCircle size={14} />
                </div>
                <span className="text-xs font-bold text-slate-300 group-hover:text-white">
                  Stomach
                </span>
              </button>
            </div>
          </div>
        )}

        {!showScanner && (
          <AiDoctorFab
            onClick={handleDoctorClick}
            isOpen={showDoctorMenu || !!selectedBodyPart}
            suggestion={doctorSuggestion}
          />
        )}
      </div>
    </div>
  );
}

export default App;