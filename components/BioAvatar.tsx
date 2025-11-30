
import React from 'react';
import { HealthData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Wind, Droplets, Brain, HeartPulse, Thermometer } from 'lucide-react';

interface BioAvatarProps {
  data: HealthData;
  simulatedData?: HealthData | null; // For "What If" scenarios
  isRiskMode?: boolean;
  wellnessScore?: number;
  highlightedMetric?: string | null;
  onMetricSelect?: (metricId: string | null) => void;
  onClickPart?: (part: string) => void;
}

const BioAvatar: React.FC<BioAvatarProps> = ({ 
  data, 
  simulatedData, 
  isRiskMode = false, 
  wellnessScore = 90,
  highlightedMetric,
  onMetricSelect,
}) => {
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
  
  // Hydration visual logic
  const hydrationVal = displayData.hydration.value;
  const hydrationColor = hydrationVal > 60 ? '#3b82f6' : '#d97706';
  
  // Wave animation variants for hydration
  const waveVariants = {
    animate: {
      d: [
        "M85 200 Q100 210 115 200 Q110 230 100 225 Q90 230 85 200Z",
        "M85 195 Q100 185 115 195 Q110 230 100 225 Q90 230 85 195Z",
        "M85 200 Q100 210 115 200 Q110 230 100 225 Q90 230 85 200Z"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    high: { scaleY: 1.2, translateY: -10 },
    low: { scaleY: 0.7, translateY: 10 }
  };

  const auraColor = isRiskMode 
    ? '#ef4444' // Red for risk
    : isSimulating 
      ? '#8b5cf6' // Purple for positive simulation
      : (displayData.stressLevel.status === 'normal' ? '#10b981' : '#ef4444'); // Green/Red for live status

  // --- SPOTLIGHT LOGIC ---
  // When a metric is active, other parts dim to 0.1 opacity (stronger contrast), active part goes to 1
  const getOpacity = (keys: string[]) => {
    if (!highlightedMetric) return 1; // Default visibility
    return keys.includes(highlightedMetric) ? 1 : 0.1;
  };

  const getGlow = (keys: string[]) => {
    if (keys.includes(highlightedMetric || '')) return "url(#glow)";
    return undefined;
  };

  // Helper for floating metric cards
  const MetricFloat = ({ id, label, value, unit, icon: Icon, color, delay, position, align = 'left' }: any) => {
    const isActive = highlightedMetric === id;
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: isActive ? 1.05 : 1,
          zIndex: isActive ? 50 : 20
        }}
        transition={{ delay: delay || 0 }}
        className={`absolute ${position} flex ${align === 'right' ? 'justify-end' : 'justify-start'} w-28 cursor-pointer tap-target`}
        onClick={(e) => {
          e.stopPropagation(); // Prevent background click
          onMetricSelect && onMetricSelect(isActive ? null : id);
        }}
      >
        <div className={`
          backdrop-blur-md rounded-xl px-3 py-2 flex flex-col items-center min-w-[75px] 
          transition-all duration-200 border shadow-lg
          ${isActive 
            ? 'bg-slate-800 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-110 ring-1 ring-indigo-400/50' 
            : 'bg-slate-950/80 border-slate-700/60 hover:bg-slate-900 hover:border-slate-500 shadow-black/60'}
        `}>
          <div className="flex items-center gap-1.5 mb-1">
             <Icon size={12} className={color} />
             <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{label}</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className={`text-lg font-bold leading-none ${color === 'text-red-400' ? 'text-red-400' : 'text-white'}`}>{value}</span>
            {unit && <span className="text-[9px] text-slate-400 font-medium ml-0.5">{unit}</span>}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div 
      className="relative w-full h-full flex justify-center items-center py-6 overflow-visible"
      onClick={() => onMetricSelect && onMetricSelect(null)} // Click background to clear highlight
    >
      
      {/* Dynamic Background Aura */}
      <motion.div 
        animate={{ 
          scale: isRiskMode ? [1, 1.2, 1] : [1, 1.1, 1],
          opacity: isRiskMode ? 0.6 : (isSimulating ? 0.4 : 0.2),
          backgroundColor: auraColor
        }}
        transition={{ duration: isRiskMode ? 0.8 : 4, repeat: Infinity }}
        className="absolute w-64 h-64 rounded-full blur-[60px] pointer-events-none"
      />
      
      {/* --- BACKGROUND WATERMARK SCORE (BEHIND AVATAR) --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-10 pointer-events-none">
         <span className={`text-[180px] font-black leading-none ${
           wellnessScore > 80 ? 'text-emerald-400' : wellnessScore > 50 ? 'text-amber-400' : 'text-red-400'
         }`}>
           {wellnessScore}
         </span>
      </div>

      {/* --- HUD METRICS (SYMMETRICAL 3-ROW GRID) --- */}
      
      {/* ROW 1: HEAD LEVEL */}
      <MetricFloat 
        id="hr"
        label="HR" 
        value={displayData.heartRate.value} 
        unit="bpm"
        icon={Activity}
        color={displayData.heartRate.status === 'critical' ? 'text-red-400' : 'text-emerald-400'}
        delay={0.1}
        position="top-[12%] left-4"
        align="left"
      />
      <MetricFloat 
        id="stress"
        label="Stress" 
        value={displayData.stressLevel.value} 
        unit=""
        icon={Brain}
        color={displayData.stressLevel.value > 60 ? 'text-red-400' : 'text-indigo-400'}
        delay={0.2}
        position="top-[12%] right-4"
        align="right"
      />

      {/* ROW 2: TORSO LEVEL */}
      <MetricFloat 
        id="hydration"
        label="Water" 
        value={displayData.hydration.value} 
        unit="%"
        icon={Droplets}
        color={hydrationVal < 40 ? 'text-amber-400' : 'text-blue-400'}
        delay={0.4}
        position="top-[42%] left-2"
        align="left"
      />
      <MetricFloat 
        id="spo2"
        label="SpO2" 
        value={displayData.oxygenLevel.value} 
        unit="%"
        icon={Wind}
        color={displayData.oxygenLevel.status === 'critical' ? 'text-red-400' : 'text-sky-400'}
        delay={0.3}
        position="top-[42%] right-2"
        align="right"
      />

      {/* ROW 3: LEGS LEVEL */}
      <MetricFloat 
        id="temp"
        label="Temp" 
        value={displayData.temperature.value} 
        unit="°C"
        icon={Thermometer}
        color={displayData.temperature.value > 37.5 ? 'text-red-400' : 'text-amber-200'}
        delay={0.6}
        position="bottom-[18%] left-4"
        align="left"
      />
      <MetricFloat 
        id="bp"
        label="BP" 
        value={`${displayData.bloodPressureSys.value}/${displayData.bloodPressureDia.value}`} 
        unit=""
        icon={HeartPulse}
        color={displayData.bloodPressureSys.value > 140 ? 'text-red-400' : 'text-rose-300'}
        delay={0.5}
        position="bottom-[18%] right-4"
        align="right"
      />

      {/* Main Body SVG */}
      <svg 
        viewBox="0 0 200 400" 
        className={`h-[340px] w-auto drop-shadow-2xl transition-all duration-500 z-10 cursor-pointer ${isSimulating ? 'scale-105' : 'scale-100'}`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Body Container (Visible for Temp/BP or standard) */}
        <motion.path 
          d="M100 30C115 30 125 40 125 55C125 65 120 75 110 80L135 90L155 120L145 180L130 150L130 220L145 350H115L110 240H90L85 350H55L70 220L70 150L55 180L45 120L65 90L90 80C80 75 75 65 75 55C75 40 85 30 100 30Z" 
          fill="rgba(30, 41, 59, 0.95)" 
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="1.5"
          animate={{
             stroke: ['bp', 'temp'].includes(highlightedMetric || '') ? '#fbbf24' : (isRiskMode ? "#f87171" : "rgba(255, 255, 255, 0.15)"),
             strokeWidth: ['bp', 'temp'].includes(highlightedMetric || '') ? 3 : 1.5,
             opacity: highlightedMetric && !['bp', 'temp'].includes(highlightedMetric) ? 0.1 : 1
          }}
          className="transition-all duration-500"
        />

        {/* Brain / Stress */}
        <motion.circle 
          cx="100" cy="55" r="18" 
          fill={displayData.stressLevel.value > 50 ? '#ef4444' : '#6366f1'} 
          fillOpacity={displayData.stressLevel.value / 100}
          animate={{ 
            opacity: getOpacity(['stress']),
            scale: highlightedMetric === 'stress' ? [1, 1.2, 1] : 1
          }}
          filter={getGlow(['stress'])}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Lungs / Oxygen */}
        <motion.path 
          d="M80 100 Q100 120 120 100 Q115 140 100 135 Q85 140 80 100Z" 
          fill={lungsColor}
          fillOpacity="0.4"
          animate={{ 
             scale: isRiskMode ? [1, 0.95, 1] : [1, 1.05, 1],
             opacity: getOpacity(['spo2'])
          }}
          filter={getGlow(['spo2'])}
          transition={{ duration: isRiskMode ? 1 : 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Heart Beat */}
        <motion.path 
          d="M95 115 C95 110 85 105 85 115 C85 125 95 135 100 140 C105 135 115 125 115 115 C115 105 105 110 105 115"
          fill={heartColor}
          fillOpacity="0.9"
          transform="translate(-2, 0)"
          animate={{ 
             scale: [1, 1.25, 1],
             opacity: getOpacity(['hr']) 
          }}
          filter={getGlow(['hr']) || "url(#glow)"}
          transition={{ duration: 60 / displayData.heartRate.value, repeat: Infinity, ease: "linear" }}
        />

        {/* Hydration / Stomach Area - Dynamic Wave */}
        <motion.path
          d="M85 180 Q100 200 115 180 Q110 230 100 225 Q90 230 85 180Z"
          fill={hydrationColor}
          fillOpacity={0.8}
          animate={["animate", hydrationVal > 70 ? "high" : "low"]}
          style={{ opacity: getOpacity(['hydration']) }}
          filter={getGlow(['hydration'])}
          variants={waveVariants}
        />
      </svg>
      
      {/* Simulation Feedback Labels */}
      <AnimatePresence>
        {isSimulating && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute bottom-20 text-white px-5 py-2 rounded-full backdrop-blur-md shadow-xl border z-20 ${
              isRiskMode ? 'bg-red-600/90 border-red-400' : 'bg-indigo-600/90 border-indigo-400'
            }`}
          >
            <p className="text-sm font-bold tracking-wide shadow-black drop-shadow-md">
              {isRiskMode ? '⚠ VISUALIZING DANGER' : '✨ PREVIEWING BENEFIT'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BioAvatar;
