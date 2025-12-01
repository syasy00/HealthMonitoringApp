import React, { useState, useEffect } from 'react';
import { MessageSquareHeart, X, Sparkles, Bot } from 'lucide-react';

interface AiDoctorFabProps {
  onClick: () => void;
  isOpen?: boolean;
  suggestion?: string; // New prop for dynamic advice
}

const AiDoctorFab: React.FC<AiDoctorFabProps> = ({ onClick, isOpen, suggestion }) => {
  const [showBubble, setShowBubble] = useState(false);

  // Auto-show bubble if there's a new suggestion
  useEffect(() => {
    if (suggestion) {
      setShowBubble(true);
      const timer = setTimeout(() => setShowBubble(false), 6000); // Hide after 6s
      return () => clearTimeout(timer);
    }
  }, [suggestion]);

  return (
    <div className="absolute bottom-6 right-6 z-[60] flex flex-col items-end gap-2 pointer-events-auto">
       
       {/* Chat Bubble */}
       {showBubble && !isOpen && (
         <div className="relative bg-white text-slate-900 px-4 py-3 rounded-2xl rounded-br-sm shadow-xl animate-[scaleIn_0.3s] origin-bottom-right max-w-[160px] border-2 border-indigo-500 mb-2">
            <div className="flex items-start gap-2">
               <Sparkles size={12} className="text-indigo-600 mt-0.5 shrink-0" />
               <p className="text-xs font-bold leading-snug">
                 {suggestion || "How are you feeling?"}
               </p>
            </div>
            {/* Close */}
            <button 
              onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
              className="absolute -top-2 -left-2 bg-slate-200 text-slate-500 rounded-full p-1 hover:bg-slate-300"
            >
              <X size={10} />
            </button>
         </div>
       )}

       {/* The AI Assistant Button */}
       <button 
         onClick={onClick}
         className="group relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white/20 flex items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.8)] transition-all active:scale-95"
         style={{ perspective: '500px' }} 
       >
          {/* Inner Glow/Ring */}
          <div className="absolute inset-1 rounded-full border border-white/10 bg-white/5"></div>
          
          {/* Ping Animation for Alertness */}
          <div className="absolute inset-0 bg-indigo-400 rounded-full opacity-0 group-hover:animate-ping"></div>
          
          {/* AI Icon with 3D Animation */}
          <Bot 
            size={32} 
            className={`relative z-10 text-white drop-shadow-md ${showBubble && !isOpen ? 'animate-wave-3d' : ''}`}
          />
          
          {/* Status Dot */}
          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-indigo-900 rounded-full shadow-sm z-20"></div>
       </button>

       {/* Define the 3D wave animation */}
       <style>{`
        @keyframes wave3d {
          0%, 100% { transform: rotateY(0deg) rotateZ(0deg); }
          25% { transform: rotateY(-25deg) rotateZ(-10deg); }
          75% { transform: rotateY(25deg) rotateZ(10deg); }
        }
        .animate-wave-3d {
          animation: wave3d 2s ease-in-out infinite;
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default AiDoctorFab;