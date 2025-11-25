
import React from 'react';
import { HealthData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface BioAvatarProps {
  data: HealthData;
  simulatedData?: HealthData | null; // For "What If" scenarios
  isRiskMode?: boolean;
  wellnessScore?: number;
  onClickPart?: (part: string) => void;
}

const BioAvatar: React.FC<BioAvatarProps> = ({ data, simulatedData, isRiskMode = false, wellnessScore = 85, onClickPart }) => {
  // Use simulated data if available for visualization, otherwise real data
  const displayData = simulatedData || data;
  const isSimulating = !!simulatedData;

  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical': return '#ef4444'; 
      case 'warning': return '#f59e0b'; 
      default: return '#10b981'; 
    }
  };

  const heartColor = getStatusColor(displayData.heartRate.status);
  const lungsColor = getStatusColor(displayData.oxygenLevel.status);
  
  // Hydration visual: Blue if good, Yellow/Dry if bad
  const hydrationColor = displayData.hydration.value > 60 ? '#3b82f6' : '#d97706';
  const hydrationOpacity = displayData.hydration.value / 150; // More opaque = more water

  const auraColor = isRiskMode 
    ? '#ef4444' // Red for risk
    : isSimulating 
      ? '#8b5cf6' // Purple for positive simulation
      : (displayData.stressLevel.status === 'normal' ? '#10b981' : '#ef4444'); // Green/Red for live status

  return (
    <div className="relative w-full h-full flex justify-center items-center py-6">
      
      {/* Dynamic Background Aura */}
      <motion.div 
        animate={{ 
          scale: isRiskMode ? [1, 1.2, 1] : [1, 1.1, 1],
          opacity: isRiskMode ? 0.6 : (isSimulating ? 0.4 : 0.2),
          backgroundColor: auraColor
        }}
        transition={{ duration: isRiskMode ? 0.8 : 4, repeat: Infinity }}
        className="absolute w-72 h-72 rounded-full blur-[60px] pointer-events-none"
      />

      {/* Wellness Score Central Display (HFE: Chunking info into one number) */}
      {!isSimulating && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-10">
          <span className="text-[140px] font-bold text-white tracking-tighter">{wellnessScore}</span>
        </div>
      )}

      {/* Main Body SVG */}
      <svg 
        viewBox="0 0 200 400" 
        className={`h-[380px] w-auto drop-shadow-2xl transition-all duration-500 z-10 ${isSimulating ? 'scale-105' : 'scale-100'}`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Body Container */}
        <path 
          d="M100 30C115 30 125 40 125 55C125 65 120 75 110 80L135 90L155 120L145 180L130 150L130 220L145 350H115L110 240H90L85 350H55L70 220L70 150L55 180L45 120L65 90L90 80C80 75 75 65 75 55C75 40 85 30 100 30Z" 
          fill="rgba(30, 41, 59, 0.85)" 
          stroke={isRiskMode ? "#f87171" : (isSimulating ? "#8b5cf6" : "rgba(255, 255, 255, 0.3)")}
          strokeWidth={isSimulating ? "3" : "1.5"}
          className="transition-all duration-500"
        />

        {/* Brain / Stress */}
        <motion.circle 
          cx="100" cy="55" r="18" 
          fill={displayData.stressLevel.value > 50 ? '#ef4444' : '#6366f1'} 
          fillOpacity={displayData.stressLevel.value / 100}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: isRiskMode ? 0.5 : 2, repeat: Infinity }}
        />

        {/* Lungs / Oxygen */}
        <motion.path 
          d="M80 100 Q100 120 120 100 Q115 140 100 135 Q85 140 80 100Z" 
          fill={lungsColor}
          fillOpacity="0.4"
          animate={{ scale: isRiskMode ? [1, 0.95, 1] : [1, 1.05, 1] }}
          transition={{ duration: isRiskMode ? 1 : 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Heart Beat */}
        <motion.path 
          d="M95 115 C95 110 85 105 85 115 C85 125 95 135 100 140 C105 135 115 125 115 115 C115 105 105 110 105 115"
          fill={heartColor}
          fillOpacity="0.9"
          transform="translate(-2, 0)"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 60 / displayData.heartRate.value, repeat: Infinity, ease: "linear" }}
          filter="url(#glow)"
        />

        {/* Hydration / Stomach Area */}
        <motion.path
          d="M85 180 Q100 200 115 180 Q110 230 100 225 Q90 230 85 180Z"
          fill={hydrationColor}
          fillOpacity={hydrationOpacity}
          className="transition-colors duration-500"
        />
      </svg>
      
      {/* Simulation Feedback Labels */}
      <AnimatePresence>
        {isSimulating && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute bottom-20 text-white px-4 py-2 rounded-full backdrop-blur-md shadow-xl border z-20 ${
              isRiskMode ? 'bg-red-600/90 border-red-400' : 'bg-indigo-600/90 border-indigo-400'
            }`}
          >
            <p className="text-sm font-bold">{isRiskMode ? 'Visualizing Danger...' : 'Previewing Benefit...'}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context Labels - Only show criticals or in simulation */}
      {!isSimulating && (
        <>
          <div className="absolute top-12 right-2 glass-panel px-3 py-2 rounded-2xl border border-white/10 flex flex-col items-center min-w-[70px]">
            <span className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Stress</span>
            <div className="text-lg font-bold text-white leading-none mt-1">{data.stressLevel.value}</div>
          </div>
          <div className="absolute top-40 left-0 glass-panel px-3 py-2 rounded-2xl border border-white/10 flex flex-col items-center min-w-[70px]">
            <span className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Water</span>
            <div className="text-lg font-bold text-blue-400 leading-none mt-1">{data.hydration.value}%</div>
          </div>
          
          <div className="absolute bottom-10 bg-slate-900/50 backdrop-blur px-4 py-1 rounded-full border border-white/5">
             <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Body Harmony: <span className="text-white font-bold text-sm ml-1">{wellnessScore}</span></span>
          </div>
        </>
      )}
    </div>
  );
};

export default BioAvatar;
