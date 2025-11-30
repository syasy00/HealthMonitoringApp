import React, { useState, useRef, useEffect } from 'react';
import { Activity, Zap, Fingerprint, ChevronLeft, RotateCcw, Timer, Wind, Target } from 'lucide-react';

type TestType = 'menu' | 'lung' | 'reflex' | 'tremor';

const HealthTestsWidget: React.FC = () => {
  const [activeTest, setActiveTest] = useState<TestType>('menu');

  return (
    <div className="w-full glass-panel rounded-2xl p-4 border border-indigo-500/20 relative overflow-hidden min-h-[240px] flex flex-col transition-all">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {activeTest !== 'menu' && (
            <button 
              onClick={() => setActiveTest('menu')} 
              className="p-1 -ml-2 text-slate-400 hover:text-white transition"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Activity size={14} className="text-indigo-400" /> Active Health Tests
          </h3>
        </div>
        {activeTest === 'menu' && (
          <span className="text-[9px] bg-slate-900/50 px-2 py-1 rounded text-slate-500 border border-white/5">
            SELECT TEST
          </span>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 relative">
        {activeTest === 'menu' && <TestMenu onSelect={setActiveTest} />}
        {activeTest === 'lung' && <LungTest />}
        {activeTest === 'reflex' && <ReflexTest />}
        {activeTest === 'tremor' && <TremorTest />}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const TestMenu = ({ onSelect }: { onSelect: (t: TestType) => void }) => (
  <div className="grid grid-cols-3 gap-3 h-full animate-[fadeIn_0.3s]">
    <button onClick={() => onSelect('lung')} className="bg-slate-800/40 hover:bg-slate-800 border border-white/5 hover:border-cyan-500/50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all group">
      <div className="p-3 rounded-full bg-cyan-900/20 text-cyan-400 group-hover:scale-110 transition">
        <Wind size={20} />
      </div>
      <div className="text-center">
        <div className="text-[10px] font-bold text-slate-200">Pulmonary</div>
        <div className="text-[8px] text-slate-500">Lung Capacity</div>
      </div>
    </button>

    <button onClick={() => onSelect('reflex')} className="bg-slate-800/40 hover:bg-slate-800 border border-white/5 hover:border-amber-500/50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all group">
      <div className="p-3 rounded-full bg-amber-900/20 text-amber-400 group-hover:scale-110 transition">
        <Zap size={20} />
      </div>
      <div className="text-center">
        <div className="text-[10px] font-bold text-slate-200">Neuro-Reflex</div>
        <div className="text-[8px] text-slate-500">Reaction Time</div>
      </div>
    </button>

    <button onClick={() => onSelect('tremor')} className="bg-slate-800/40 hover:bg-slate-800 border border-white/5 hover:border-pink-500/50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all group">
      <div className="p-3 rounded-full bg-pink-900/20 text-pink-400 group-hover:scale-110 transition">
        <Fingerprint size={20} />
      </div>
      <div className="text-center">
        <div className="text-[10px] font-bold text-slate-200">Stability</div>
        <div className="text-[8px] text-slate-500">Tremor Check</div>
      </div>
    </button>
  </div>
);

// 1. LUNG TEST
const LungTest = () => {
  const [state, setState] = useState<'idle' | 'inhale' | 'holding' | 'result'>('idle');
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startInhale = () => setState('inhale');
  const startHold = () => {
    setState('holding');
    startTimeRef.current = Date.now();
    setDuration(0);
    timerRef.current = window.setInterval(() => {
      setDuration((Date.now() - startTimeRef.current) / 1000);
    }, 100);
  };
  const stopHold = () => {
    if (state !== 'holding') return;
    if (timerRef.current) clearInterval(timerRef.current);
    setState('result');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full animate-[fadeIn_0.3s]">
      {state === 'idle' && (
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-4 max-w-[200px]">Test CO2 tolerance & stress resilience. Inhale deep, then hold.</p>
          <button onClick={startInhale} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-full transition shadow-lg shadow-cyan-900/50">START</button>
        </div>
      )}
      {state === 'inhale' && (
        <div className="text-center">
          <div className="text-cyan-300 font-bold text-sm animate-pulse mb-4">INHALE DEEPLY...</div>
          <button onMouseDown={startHold} onTouchStart={startHold} className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-200 font-bold text-xs flex items-center justify-center animate-bounce">HOLD</button>
        </div>
      )}
      {state === 'holding' && (
        <div onMouseUp={stopHold} onTouchEnd={stopHold} className="text-center cursor-grabbing w-full h-full flex flex-col items-center justify-center">
          <div className="text-4xl font-black text-white tabular-nums mb-2">{duration.toFixed(1)}s</div>
          <p className="text-[10px] text-cyan-300 animate-pulse">HOLDING...</p>
        </div>
      )}
      {state === 'result' && (
        <div className="text-center">
           <div className="text-xs text-slate-500 uppercase font-bold mb-1">Result</div>
           <div className="text-3xl font-black text-white mb-2">{duration.toFixed(1)}s</div>
           <p className="text-[10px] text-slate-400 mb-4">{duration > 30 ? "Excellent Capacity" : "Below Average"}</p>
           <button onClick={() => setState('idle')} className="text-xs text-slate-500 hover:text-white flex items-center justify-center gap-1"><RotateCcw size={12}/> Retry</button>
        </div>
      )}
    </div>
  );
};

// 2. REFLEX TEST
const ReflexTest = () => {
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'now' | 'early' | 'result'>('idle');
  const [time, setTime] = useState(0);
  const timerId = useRef<number | null>(null);
  const startTime = useRef<number>(0);

  const startGame = () => {
    setGameState('waiting');
    const randomDelay = Math.random() * 2000 + 1500; // 1.5s - 3.5s
    timerId.current = window.setTimeout(() => {
      setGameState('now');
      startTime.current = Date.now();
    }, randomDelay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      if (timerId.current) clearTimeout(timerId.current);
      setGameState('early');
    } else if (gameState === 'now') {
      const reactionTime = Date.now() - startTime.current;
      setTime(reactionTime);
      setGameState('result');
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center animate-[fadeIn_0.3s]">
      {gameState === 'idle' && (
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-4 max-w-[200px]">Tap immediately when the screen turns <span className="text-emerald-400">GREEN</span>.</p>
          <button onClick={startGame} className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-full transition shadow-lg shadow-amber-900/50">START</button>
        </div>
      )}
      
      {(gameState === 'waiting' || gameState === 'now' || gameState === 'early') && (
        <div 
          onMouseDown={handleClick}
          onTouchStart={handleClick}
          className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-colors duration-0 ${
            gameState === 'waiting' ? 'bg-rose-900/80' : 
            gameState === 'now' ? 'bg-emerald-500' : 'bg-slate-800'
          }`}
        >
          {gameState === 'waiting' && <p className="text-rose-200 font-bold animate-pulse">WAIT FOR GREEN...</p>}
          {gameState === 'now' && <p className="text-white text-2xl font-black scale-150">TAP NOW!</p>}
          {gameState === 'early' && (
             <div className="text-center">
               <p className="text-white font-bold mb-2">Too Early!</p>
               <button onClick={(e) => { e.stopPropagation(); startGame(); }} className="px-4 py-2 bg-white/20 rounded-full text-xs">Retry</button>
             </div>
          )}
        </div>
      )}

      {gameState === 'result' && (
        <div className="text-center">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">Reaction Time</div>
          <div className={`text-4xl font-black mb-2 ${time < 250 ? 'text-emerald-400' : 'text-amber-400'}`}>{time}ms</div>
          <p className="text-[10px] text-slate-400 mb-4">{time < 250 ? "Elite Reflexes ⚡" : "Signs of Fatigue 💤"}</p>
          <button onClick={startGame} className="text-xs text-slate-500 hover:text-white flex items-center justify-center gap-1"><RotateCcw size={12}/> Retry</button>
        </div>
      )}
    </div>
  );
};

// 3. TREMOR TEST
const TremorTest = () => {
  const [state, setState] = useState<'idle' | 'testing' | 'result'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const lastPos = useRef({ x: 0, y: 0 });
  const movementSum = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const startTest = () => {
    setState('testing');
    setTimeLeft(5);
    movementSum.current = 0;
    
    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endTest = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setScore(Math.floor(movementSum.current));
    setState('result');
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (state !== 'testing') return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    if (lastPos.current.x !== 0) {
      const dist = Math.sqrt(Math.pow(clientX - lastPos.current.x, 2) + Math.pow(clientY - lastPos.current.y, 2));
      movementSum.current += dist;
    }
    lastPos.current = { x: clientX, y: clientY };
  };

  return (
    <div className="h-full flex flex-col items-center justify-center animate-[fadeIn_0.3s]">
       {state === 'idle' && (
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-4 max-w-[200px]">Test neuromuscular stability. Hold the button and keep your finger/cursor <b className="text-white">absolutely still</b>.</p>
          <button onMouseDown={startTest} onTouchStart={startTest} className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-full transition shadow-lg shadow-pink-900/50">HOLD TO TEST</button>
        </div>
      )}

      {state === 'testing' && (
        <div 
          className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center cursor-crosshair z-20"
          onMouseMove={handleMove}
          onTouchMove={handleMove}
          onMouseUp={endTest}
          onTouchEnd={endTest}
        >
          <Target size={48} className="text-pink-500 animate-pulse mb-4" />
          <div className="text-2xl font-black text-white mb-1">{timeLeft}s</div>
          <p className="text-xs text-pink-300 font-bold uppercase tracking-widest">Keep Steady!</p>
        </div>
      )}

      {state === 'result' && (
        <div className="text-center">
          <div className="text-xs text-slate-500 uppercase font-bold mb-1">Jitter Score</div>
          <div className={`text-3xl font-black mb-2 ${score < 100 ? 'text-emerald-400' : 'text-rose-400'}`}>{score}</div>
          <p className="text-[10px] text-slate-400 mb-4">{score < 50 ? "Rock Solid 🗿" : score < 200 ? "Minor Tremors" : "High Instability"}</p>
          <button onClick={() => setState('idle')} className="text-xs text-slate-500 hover:text-white flex items-center justify-center gap-1"><RotateCcw size={12}/> Retry</button>
        </div>
      )}
    </div>
  );
};

export default HealthTestsWidget;