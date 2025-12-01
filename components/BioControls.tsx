import React, { useState, ReactNode } from 'react';
import {
  Wind,
  Moon,
  Droplets,
  Check,
  Zap,
  Sparkles,
  BedDouble,
  GlassWater,
  Smile,
  X,
  Ear
} from 'lucide-react';
import { Medication, EnvironmentalState } from '../types';

type LogActionType = 'water' | 'hear' | 'mood' | 'rest' | 'meds';

interface BioControlsProps {
  onLogAction: (type: LogActionType, medId?: string, mood?: string) => void;
  insight?: string;
  medications?: Medication[];
  environmentalState?: EnvironmentalState;
  children?: ReactNode;
}

const MOOD_OPTIONS = ['Happy', 'Stressed', 'Calm', 'Tired', 'Anxious'];
const NOISE_THRESHOLD_DB = 75;

const BioControls: React.FC<BioControlsProps> = ({
  onLogAction,
  insight,
  medications = [],
  environmentalState,
  children
}) => {
  const [activeLog, setActiveLog] = useState<string | null>(null);
  const [waterCount, setWaterCount] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);

  const [noiseTriageStatus, setNoiseTriageStatus] =
    useState<'idle' | 'normal' | 'high'>('idle');
  const [currentMood, setCurrentMood] = useState('Neutral');
  const [showMoodSelector, setShowMoodSelector] = useState(false);

  const handleLog = (
    id: string,
    type: LogActionType,
    mood?: string
  ) => {
    setActiveLog(id);
    onLogAction(type, undefined, mood);

    if (type === 'water') setWaterCount(prev => prev + 1);
    if (type === 'mood' && mood) setCurrentMood(mood);
    if (type === 'rest') setSleepHours(prev => prev + 1);

    if (type === 'hear' && environmentalState) {
      const currentNoise = environmentalState.noiseLevelDb;
      setNoiseTriageStatus(
        currentNoise >= NOISE_THRESHOLD_DB ? 'high' : 'normal'
      );
    }

    setTimeout(() => setActiveLog(null), 1500);
  };

  const MoodSelector: React.FC<{ onClose: () => void }> = ({
    onClose
  }) => (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#151925]/95 backdrop-blur-xl border border-indigo-500/50 rounded-2xl p-2 shadow-2xl animate-[scaleIn_0.2s] origin-bottom min-w-[200px]">
      <div className="flex justify-between mb-2">
        <span className="text-[9px] font-black text-slate-400 uppercase">
          How are you feeling?
        </span>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
      <div className="flex gap-1 flex-wrap justify-center">
        {MOOD_OPTIONS.map(mood => (
          <button
            key={mood}
            onClick={() => {
              handleLog('mood_check', 'mood', mood);
              onClose();
            }}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
              currentMood === mood
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );

  const hearButtonColor =
    noiseTriageStatus === 'high'
      ? 'bg-red-500/20 border-red-400 text-red-400'
      : noiseTriageStatus === 'normal'
      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
      : 'bg-white/5 border-transparent text-teal-400';

  const hearLabel =
    noiseTriageStatus === 'high'
      ? 'Danger'
      : noiseTriageStatus === 'normal'
      ? 'OK'
      : 'Check Noise';

  // The w-full h-full is now a flex column to stack header, main, and dock.
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      {/* HEADER + INSIGHT - NOW STATIC AT THE TOP */}
      <div className="shrink-0 flex flex-col pt-6 px-6 gap-3 z-50">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
            <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">
              Connected to Smartwatch
            </span>
          </div>
        </div>

        {insight && (
          <div className="self-center flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#0f121d]/90 border border-white/10 backdrop-blur-xl shadow-xl animate-[slideDown_0.4s] z-50">
            <Sparkles size={12} className="text-indigo-400 shrink-0" />
            <p className="text-[10px] font-medium text-slate-200 leading-none text-center max-w-[240px] truncate">
              {insight}
            </p>
          </div>
        )}
      </div>

      {/* MAIN STAGE – Adjusted padding to prevent overlap with dock */}
      <div className="flex-1 relative flex items-center justify-center py-4"> 
        {showMoodSelector && (
          <MoodSelector onClose={() => setShowMoodSelector(false)} />
        )}

        <div className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* COMMAND DOCK - Now static at the bottom of the flex column, NOT absolute to BioControls */}
      <div className="shrink-0 w-full px-5 pb-6 mt-2 z-50">
        <div className="relative bg-[#1a1f2e]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-2 shadow-2xl flex items-stretch gap-2 h-20">
          {/* 1. HEAR / NOISE CHECK */}
          <button
            onClick={() => handleLog('hear_check', 'hear')}
            className={`flex-[1.5] h-full flex flex-col items-center justify-center gap-1 rounded-[1.5rem] transition-all duration-300 border ${
              activeLog === 'hear_check'
                ? 'bg-teal-500 border-teal-400 text-white shadow-lg'
                : hearButtonColor
            }`}
          >
            {activeLog === 'hear_check' ? (
              <Check size={20} />
            ) : (
              <Ear size={18} />
            )}
            <div className="flex flex-col items-center leading-none mt-1">
              <span className="text-[8px] font-bold uppercase tracking-wider">
                {hearLabel}
              </span>
              {noiseTriageStatus === 'high' && (
                <span className="text-[7px] font-mono opacity-80 animate-pulse">
                  LOUD! {environmentalState?.noiseLevelDb} dB
                </span>
              )}
              {noiseTriageStatus === 'normal' && (
                <span className="text-[7px] font-mono opacity-80">
                  Quiet
                </span>
              )}
              {noiseTriageStatus === 'idle' && (
                <span className="text-[7px] font-mono opacity-80">
                  Check Noise
                </span>
              )}
            </div>
          </button>

          {/* 2. MOOD CHECK */}
          <button
            onClick={() => setShowMoodSelector(true)}
            className={`flex-1 h-full flex flex-col items-center justify-center gap-1 rounded-[1.5rem] transition-all duration-300 border ${
              currentMood !== 'Neutral'
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400'
            }`}
          >
            <Smile size={18} />
            <div className="flex flex-col items-center leading-none mt-1">
              <span className="text-[8px] font-bold uppercase tracking-wider">
                Mood
              </span>
              <span className="text-[7px] opacity-60 font-mono">
                {currentMood}
              </span>
            </div>
          </button>

          {/* 3. HYDRATE */}
          <button
            onClick={() => handleLog('water', 'water')}
            className={`flex-1 h-full flex flex-col items-center justify-center gap-1 rounded-[1.5rem] transition-all duration-300 border ${
              activeLog === 'water'
                ? 'bg-blue-500 border-blue-400 text-white'
                : 'bg-white/5 border-white/5 hover:bg-white/10 text-blue-400'
            }`}
          >
            {activeLog === 'water' ? (
              <Check size={20} />
            ) : (
              <GlassWater size={18} />
            )}
            {!activeLog && (
              <div className="flex flex-col items-center leading-none mt-1">
                <span className="text-[8px] font-bold uppercase tracking-wider">
                  Drink
                </span>
                <span className="text-[7px] font-mono opacity-80">
                  {waterCount > 0 ? `${waterCount} cups` : '+250ml'}
                </span>
              </div>
            )}
          </button>

          {/* 4. SLEEP */}
          <button
            onClick={() => handleLog('rest', 'rest')}
            className={`flex-1 h-full flex flex-col items-center justify-center gap-1 rounded-[1.5rem] transition-all duration-300 border ${
              activeLog === 'rest'
                ? 'bg-purple-500 border-purple-400 text-white'
                : 'bg-white/5 border-white/5 hover:bg-white/10 text-purple-400'
            }`}
          >
            {activeLog === 'rest' ? (
              <Check size={20} />
            ) : (
              <BedDouble size={18} />
            )}
            {!activeLog && (
              <div className="flex flex-col items-center leading-none mt-1">
                <span className="text-[8px] font-bold uppercase tracking-wider">
                  Sleep
                </span>
                <span className="text-[7px] font-mono opacity-80">
                  {sleepHours > 0 ? `${sleepHours}h` : '+1h'}
                </span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* SYNC TOAST */}
      {activeLog && (
        <div className="absolute bottom-32 left-0 right-0 flex justify-center z-40 animate-[slideUp_0.3s] pointer-events-none">
          <div className="px-4 py-2 rounded-full bg-indigo-500/90 text-white flex items-center gap-2 shadow-lg backdrop-blur-md border border-white/20">
            <Zap size={14} fill="currentColor" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Syncing Twin...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BioControls;