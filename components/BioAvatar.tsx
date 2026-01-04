import React from 'react';
import { HealthData, ActivityData, BodyPart, EnvironmentalState } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints, Activity, Wind, Droplets, Brain, Thermometer, HeartPulse } from 'lucide-react';

interface BioAvatarProps {
  data: HealthData;
  activityData?: ActivityData;
  environmentalState?: EnvironmentalState;
  simulatedData?: HealthData | null;
  isRiskMode?: boolean;
  onBodyPartClick?: (part: BodyPart) => void;
}

// Medical Card Style Tag
const DataTag = ({ label, value, unit, x, y, right, delay, icon: Icon, warning, align = 'left' }: any) => (
  <motion.div
    className="absolute z-30 pointer-events-none"
    style={{ 
      top: y,
      // Use left or right positioning based on props
      ...(right ? { right: right, left: 'auto' } : { left: x }) 
    }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
    transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }, opacity: { duration: 0.5 } }}
  >
    <div className={`flex items-center gap-0 ${align === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* 1. Connector Dot */}
      <div className={`w-2 h-2 rounded-full border-2 border-white shadow-sm z-10 ${warning ? 'bg-rose-500' : 'bg-indigo-400'}`} />
      
      {/* 2. Connector Line */}
      <div className={`h-[1px] w-6 ${warning ? 'bg-rose-200' : 'bg-indigo-200'}`} />

      {/* 3. The Card */}
      <div className={`
        flex items-center gap-2.5 px-3 py-2 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border backdrop-blur-md
        ${warning 
          ? 'bg-rose-50/95 border-rose-100 text-rose-700' 
          : 'bg-white/90 border-white/60 text-slate-700'
        }
      `}>
        <div className={`p-1.5 rounded-full ${warning ? 'bg-white/50' : 'bg-indigo-50'}`}>
          <Icon size={14} className={warning ? 'text-rose-500' : 'text-indigo-500'} />
        </div>
        
        <div className={`flex flex-col leading-none ${align === 'right' ? 'items-end' : 'items-start'}`}>
          <span className="text-[13px] font-black tracking-tight">
            {value} <span className="text-[10px] font-semibold opacity-60">{unit}</span>
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider opacity-50 mt-0.5">{label}</span>
        </div>
      </div>

    </div>
  </motion.div>
);

const BioAvatar: React.FC<BioAvatarProps> = ({
  data,
  activityData,
  simulatedData,
  isRiskMode = false,
  onBodyPartClick
}) => {
  const displayData = simulatedData || data;
  // FIX: Defined inside body to avoid TS error
  const isSimulating = !!simulatedData;
  
  const STROKE_COLOR = "#94a3b8"; // Slate-400
  
  return (
    <div className="relative w-full h-full flex justify-center items-center">
      
      {/* DATA LAYER - Full width container to spread tags out */}
      <div className="absolute inset-0 w-full h-full px-4 pointer-events-none">
        {/* Left Side Tags (Using 'x' / left positioning) */}
        <DataTag label="Oxygen" value={displayData.oxygenLevel.value} unit="%" x="2%" y="20%" delay={0} icon={Wind} align="right" />
        <DataTag label="Temp" value={displayData.temperature.value} unit="°C" x="4%" y="42%" delay={1} icon={Thermometer} align="right" />
        <DataTag label="Steps" value={activityData?.steps ? Math.round(activityData.steps/1000) + 'k' : '6k'} unit="" x="6%" y="64%" delay={2} icon={Footprints} align="right" />

        {/* Right Side Tags (Using 'right' positioning for perfect alignment) */}
        <DataTag label="Stress" value={displayData.stressLevel.value} unit="" right="2%" y="15%" delay={0.5} icon={Brain} warning={displayData.stressLevel.value > 50} />
        <DataTag label="Heart" value={displayData.heartRate.value} unit="bpm" right="4%" y="38%" delay={1.5} icon={Activity} />
        <DataTag label="Water" value={displayData.hydration.value} unit="%" right="6%" y="58%" delay={2.5} icon={Droplets} warning={displayData.hydration.value < 50} />
        <DataTag label="BP" value={displayData.bloodPressureSys.value} unit="" right="8%" y="78%" delay={3} icon={HeartPulse} />
      </div>

      {/* AVATAR GRAPHIC - Reduced width to preventing overlapping */}
      <div className="relative z-10 w-[200px] h-[360px] translate-y-2">
        <svg viewBox="0 0 200 400" className="w-full h-full" style={{ filter: 'drop-shadow(0px 15px 30px rgba(99, 102, 241, 0.15))' }}>
          
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </linearGradient>
          </defs>

          {/* Body Silhouette */}
          <path 
            d="M100 30 C115 30 125 40 125 55 C125 68 118 75 110 78 L140 85 L160 130 L145 180 L125 150 L125 220 L140 360 H115 L110 240 H90 L85 360 H60 L75 220 L75 150 L55 180 L40 130 L60 85 L90 78 C82 75 75 68 75 55 C75 40 85 30 100 30Z"
            fill="url(#bodyGradient)"
            stroke={STROKE_COLOR}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Internal Structure */}
          <path d="M100 30 V78 M100 78 L140 85 M100 78 L60 85 M100 78 V150" stroke={STROKE_COLOR} strokeWidth="1" strokeOpacity="0.3" fill="none" />
          
          {/* Active Heartbeat */}
          <circle cx="100" cy="100" r="4" fill="#f43f5e" className="animate-pulse">
             <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
             <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1s" repeatCount="indefinite" />
          </circle>

          {/* Hydration Fill Effect */}
          <mask id="body-fill-mask">
             <path d="M100 30 C115 30 125 40 125 55 C125 68 118 75 110 78 L140 85 L160 130 L145 180 L125 150 L125 220 L140 360 H115 L110 240 H90 L85 360 H60 L75 220 L75 150 L55 180 L40 130 L60 85 L90 78 C82 75 75 68 75 55 C75 40 85 30 100 30Z" fill="white" />
          </mask>
          <rect 
            x="0" 
            y={400 - (displayData.hydration.value * 3.5)} 
            width="200" 
            height="400" 
            fill="#3b82f6" 
            fillOpacity="0.1" 
            mask="url(#body-fill-mask)" 
            className="transition-all duration-1000 ease-in-out"
          />

        </svg>

        {/* Click Zones */}
        <svg viewBox="0 0 200 400" className="absolute inset-0 w-full h-full pointer-events-auto">
           <circle cx="100" cy="50" r="25" fill="transparent" className="cursor-pointer hover:fill-indigo-500/10" onClick={(e) => { e.stopPropagation(); onBodyPartClick?.('head'); }} />
           <circle cx="100" cy="100" r="30" fill="transparent" className="cursor-pointer hover:fill-indigo-500/10" onClick={(e) => { e.stopPropagation(); onBodyPartClick?.('chest'); }} />
           <circle cx="100" cy="170" r="30" fill="transparent" className="cursor-pointer hover:fill-indigo-500/10" onClick={(e) => { e.stopPropagation(); onBodyPartClick?.('stomach'); }} />
        </svg>
      </div>

      <AnimatePresence>
        {isSimulating && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-0 bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl shadow-indigo-500/30 z-40"
          >
            SIMULATION MODE
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BioAvatar;