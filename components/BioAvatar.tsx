import React from 'react';
import { HealthData, ActivityData, BodyPart, EnvironmentalState } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Footprints,
  Activity,
  Wind,
  Droplets,
  Brain,
  Thermometer,
  HeartPulse
} from 'lucide-react';

interface BioAvatarProps {
  data: HealthData;
  activityData?: ActivityData;
  environmentalState?: EnvironmentalState;
  simulatedData?: HealthData | null;
  isRiskMode?: boolean;
  highlightedMetric?: string | null;
  onMetricSelect?: (metricId: string | null) => void;
  onClickPart?: (part: string) => void;
  onScan?: () => void;
  onBodyPartClick?: (part: BodyPart) => void;
}

// 3D Floating Tag Component
const HolographicTag = ({
  label,
  value,
  unit,
  xOffset,
  y,
  delay,
  color,
  icon: Icon,
  align = 'left'
}: any) => (
  <motion.div
    className="absolute flex items-center gap-2 pointer-events-none z-30"
    style={{
      left: `calc(50% + ${xOffset}px)`,
      top: y,
      transform: 'translateZ(40px)',
      flexDirection: align === 'right' ? 'row-reverse' : 'row'
    }}
    animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
    transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay } }}
  >
    <div
      className={`w-4 h-[1px] ${
        color === '#ff2a2a' ? 'bg-red-500/50' : 'bg-cyan-500/50'
      }`}
    />
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
        color === '#ff2a2a'
          ? 'border-red-500/50 bg-red-950/95'
          : 'border-cyan-500/50 bg-slate-800/95'
      } backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.8)]`}
    >
      <Icon
        size={12}
        className={color === '#ff2a2a' ? 'text-red-400' : 'text-cyan-400'}
      />
      <div
        className={`flex flex-col leading-none ${
          align === 'right' ? 'items-end' : 'items-start'
        }`}
      >
        <span
          className={`text-sm font-black font-mono ${
            color === '#ff2a2a' ? 'text-red-400' : 'text-white'
          }`}
        >
          {value}{' '}
          <span className="opacity-60 text-[9px] font-medium">{unit}</span>
        </span>
        <span
          className={`text-[7px] font-bold uppercase tracking-widest ${
            color === '#ff2a2a' ? 'text-red-400' : 'text-cyan-500'
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  </motion.div>
);

const BioAvatar: React.FC<BioAvatarProps> = ({
  data,
  activityData,
  environmentalState,
  simulatedData,
  isRiskMode = false,
  highlightedMetric,
  onMetricSelect,
  onScan,
  onBodyPartClick
}) => {
  const displayData = simulatedData || data;
  const isSimulating = !!simulatedData;

  const NEON_CYAN = '#00f3ff';
  const NEON_RED = '#ff2a2a';
  const NEON_AMBER = '#ffaa00';
  const NEON_ORANGE = '#f97316';

  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical':
        return NEON_RED;
      case 'warning':
        return NEON_AMBER;
      default:
        return NEON_CYAN;
    }
  };

  const heartColor = getStatusColor(displayData.heartRate.status);
  const bodyColor = isRiskMode ? NEON_RED : NEON_CYAN;

  const stepsPercentage = activityData
    ? Math.min(100, (activityData.steps / activityData.goalSteps) * 100)
    : 0;

  const bodyPath =
    'M100 20 C115 20 128 32 128 50 C128 65 120 75 110 80 L140 90 L165 130 L150 190 L130 160 L130 240 L145 380 H115 L110 260 H90 L85 380 H55 L70 240 L70 160 L50 190 L35 130 L60 90 L90 80 C80 75 72 65 72 50 C72 32 85 20 100 20Z';

  const InteractiveZone = ({
    part,
    d,
    cx,
    cy,
    r
  }: {
    part: BodyPart;
    d?: string;
    cx?: string;
    cy?: string;
    r?: string;
  }) => (
    <g
      onClick={e => {
        e.stopPropagation();
        onBodyPartClick?.(part);
      }}
      className="cursor-pointer group"
      style={{ pointerEvents: 'all' }}
    >
      {d ? (
        <path d={d} fill="transparent" stroke="none" />
      ) : (
        <circle cx={cx} cy={cy} r={r} fill="transparent" stroke="none" />
      )}
      {d ? (
        <path
          d={d}
          fill="white"
          fillOpacity="0"
          className="group-hover:fill-opacity-20 transition-all duration-300"
        />
      ) : (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="white"
          fillOpacity="0"
          className="group-hover:fill-opacity-20 transition-all duration-300"
        />
      )}
    </g>
  );

  const showNoiseStatic =
    environmentalState && environmentalState.noiseLevelDb > 70;
  const showRainEffect = environmentalState && environmentalState.isRaining;
  const showHeatHaze =
    environmentalState && environmentalState.outdoorTempC > 30;

  return (
    <div
      className="relative w-full h-full flex justify-center items-center overflow-visible"
      style={{ perspective: '800px' }}
      onClick={() => onMetricSelect && onMetricSelect(null)}
    >
      <motion.div
        className="relative w-full h-full flex justify-center items-center"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: [-8, 8, -8] }}
        transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
      >
        {/* TAGS */}
        <HolographicTag
          label="STRESS"
          value={displayData.stressLevel.value}
          unit="%"
          xOffset={70}
          y="15%"
          delay={0.2}
          icon={Brain}
          color={
            displayData.stressLevel.value > 50 ? NEON_RED : NEON_CYAN
          }
        />

        <HolographicTag
          label="HR"
          value={displayData.heartRate.value}
          unit="BPM"
          xOffset={75}
          y="34%"
          delay={0.4}
          icon={Activity}
          color={heartColor}
        />

        <HolographicTag
          label="SPO2"
          value={displayData.oxygenLevel.value}
          unit="%"
          xOffset={-140}
          y="34%"
          delay={0.5}
          icon={Wind}
          align="right"
          color={
            displayData.oxygenLevel.value < 95
              ? NEON_AMBER
              : NEON_CYAN
          }
        />

        <HolographicTag
          label="TEMP"
          value={displayData.temperature.value}
          unit="°C"
          xOffset={-145}
          y="54%"
          delay={2}
          icon={Thermometer}
          align="right"
          color={
            displayData.temperature.value > 37.5
              ? NEON_RED
              : NEON_AMBER
          }
        />

        <HolographicTag
          label="H2O"
          value={displayData.hydration.value}
          unit="%"
          xOffset={60}
          y="57%"
          delay={0.6}
          icon={Droplets}
          color={
            displayData.hydration.value < 50
              ? NEON_AMBER
              : NEON_CYAN
          }
        />

        <HolographicTag
          label="BP"
          value={`${displayData.bloodPressureSys.value}/${displayData.bloodPressureDia.value}`}
          unit=""
          xOffset={75}
          y="77%"
          delay={2.5}
          icon={HeartPulse}
          color={
            displayData.bloodPressureSys.value > 130
              ? NEON_RED
              : '#f43f5e'
          }
        />

        {/* ENVIRONMENT EFFECTS */}
        {showNoiseStatic && (
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none mix-blend-color-dodge"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 0.2, repeat: Infinity }}
          >
            <div className="absolute inset-0 bg-red-400 opacity-5" />
          </motion.div>
        )}

        {showRainEffect && (
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none"
            animate={{ y: [0, 40, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="100%" height="100%">
              <circle
                cx="50%"
                cy="50%"
                r="180"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeOpacity="0.2"
              />
            </svg>
          </motion.div>
        )}

        {showHeatHaze && (
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/3 z-20 pointer-events-none"
            animate={{
              opacity: [0.4, 0.6, 0.4],
              scaleY: [1, 1.05, 1],
              y: [0, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600/30 to-transparent blur-xl" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-red-500/20 to-transparent blur-lg" />
          </motion.div>
        )}

        {/* BACKGROUND + FITNESS RING */}
        <div
          className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
          style={{ transform: 'translateZ(-40px)' }}
        >
          {activityData && (
            <div className="absolute w-[250px] h-[250px] flex items-center justify-center">
              <svg
                className="w-full h-full"
                style={{ transform: 'rotate(-90deg)' }}
              >
                <circle
                  cx="125"
                  cy="125"
                  r="115"
                  stroke={bodyColor}
                  strokeWidth="1"
                  strokeOpacity="0.1"
                  fill="none"
                />
                <motion.circle
                  cx="125"
                  cy="125"
                  r="115"
                  stroke={NEON_ORANGE}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 1000' }}
                  animate={{
                    strokeDasharray: `${
                      (stepsPercentage / 100) * (2 * Math.PI * 115)
                    } 1000`
                  }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  style={{
                    filter: `drop-shadow(0 0 8px ${NEON_ORANGE})`
                  }}
                />
              </svg>
            </div>
          )}

          <motion.div
            animate={{
              top: ['10%', '90%', '10%'],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 5, ease: 'linear', repeat: Infinity }}
            className="absolute w-[80%] h-px bg-cyan-400/40 shadow-[0_0_20px_rgba(0,243,255,0.8)]"
          />
        </div>

        {/* FITNESS LABEL */}
        {activityData && (
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-orange-500/40 backdrop-blur-xl shadow-lg">
              <Footprints size={8} className="text-orange-400" />
              <span className="text-[10px] font-bold text-orange-100 tracking-wider font-mono">
                FITNESS: {Math.round(stepsPercentage)}%
              </span>
            </div>
          </motion.div>
        )}

        {/* AVATAR */}
        <svg
          viewBox="0 0 200 450"
          className={`h-[260px] w-auto transition-all duration-500 z-10 ${
            isSimulating
              ? 'drop-shadow-[0_0_15px_rgba(0,243,255,0.6)]'
              : ''
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter
              id="glow"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite
                in="SourceGraphic"
                in2="blur"
                operator="over"
              />
            </filter>
            <pattern
              id="hex-grid"
              width="16"
              height="14"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(0.8)"
            >
              <path
                d="M8 0 L16 4 L16 12 L8 16 L0 12 L0 4 Z"
                fill="none"
                stroke={bodyColor}
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
            </pattern>
            <pattern
              id="hex-grid-back"
              width="16"
              height="14"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(0.8)"
            >
              <path
                d="M8 0 L16 4 L16 12 L8 16 L0 12 L0 4 Z"
                fill="none"
                stroke={bodyColor}
                strokeWidth="0.5"
                strokeOpacity="0.1"
              />
            </pattern>
          </defs>

          <motion.path
            d={bodyPath}
            fill="url(#hex-grid-back)"
            stroke={bodyColor}
            strokeWidth="0.5"
            strokeOpacity="0.2"
            transform="scale(0.96) translate(4, 0)"
            style={{ filter: 'blur(1px)' }}
          />

          <motion.circle
            cx="100"
            cy="45"
            r="12"
            fill={
              displayData.stressLevel.value > 50 ? NEON_RED : NEON_CYAN
            }
            fillOpacity={0.2}
            filter="url(#glow)"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <motion.path
            d="M100 115 L108 122 L105 132 H95 L92 122 Z"
            fill={heartColor}
            fillOpacity={0.9}
            stroke="white"
            strokeWidth="1"
            animate={{
              scale: [1, 1.15, 1],
              filter: [
                `drop-shadow(0 0 5px ${heartColor})`,
                `drop-shadow(0 0 15px ${heartColor})`,
                `drop-shadow(0 0 5px ${heartColor})`
              ]
            }}
            transition={{
              duration: 60 / displayData.heartRate.value,
              repeat: Infinity,
              ease: 'circOut'
            }}
          />

          {data.activeSymptoms?.some(s => s.bodyPart === 'head') && (
            <motion.circle
              cx="100"
              cy="45"
              r="25"
              fill={NEON_RED}
              fillOpacity={0.2}
              filter="url(#glow)"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {data.activeSymptoms?.some(s => s.bodyPart === 'stomach') && (
            <motion.circle
              cx="100"
              cy="180"
              r="30"
              fill={NEON_AMBER}
              fillOpacity={0.2}
              filter="url(#glow)"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}

          <mask id="torso-mask">
            <path d="M90 160 L110 160 L105 240 L95 240 Z" fill="white" />
          </mask>

          <motion.rect
            x={85}
            y={240 - displayData.hydration.value * 0.8}
            width={30}
            height={100}
            fill={
              displayData.hydration.value > 50 ? '#3b82f6' : NEON_AMBER
            }
            mask="url(#torso-mask)"
            opacity={0.4}
            filter="url(#glow)"
            animate={{
              height: [
                displayData.hydration.value * 0.8,
                displayData.hydration.value * 0.8 + 5,
                displayData.hydration.value * 0.8
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <motion.path
            d={bodyPath}
            fill="url(#hex-grid)"
            stroke={bodyColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 3px ${bodyColor})` }}
          />

          {onBodyPartClick && (
            <g style={{ pointerEvents: 'all' }}>
              <InteractiveZone part="head" cx="100" cy="45" r="35" />
              <InteractiveZone
                part="chest"
                d="M70 80 H130 V140 H70 Z"
              />
              <InteractiveZone
                part="stomach"
                cx="100"
                cy="180"
                r="35"
              />
            </g>
          )}
        </svg>
      </motion.div>

      <AnimatePresence>
        {isSimulating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            style={{ transform: 'translateZ(60px)' }}
          >
            <div className="relative flex flex-col items-center">
              <div
                className={`w-32 h-32 absolute rounded-full blur-[50px] opacity-40 ${
                  isRiskMode ? 'bg-red-500' : 'bg-cyan-500'
                }`}
              />
              <div
                className={`px-4 py-2 border ${
                  isRiskMode
                    ? 'border-red-500/80 text-red-100 bg-red-950/90'
                    : 'border-cyan-500/80 text-cyan-100 bg-cyan-950/90'
                } rounded-lg backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center gap-3`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isRiskMode ? 'bg-red-500' : 'bg-cyan-400'
                  } animate-ping`}
                />
                <div className="flex flex-col">
                  <span className="text-[9px] opacity-70 tracking-widest font-mono">
                    SIMULATION
                  </span>
                  <span className="text-xs font-bold font-mono tracking-widest uppercase glow-text">
                    {isRiskMode ? 'CRITICAL' : 'OPTIMAL'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BioAvatar;