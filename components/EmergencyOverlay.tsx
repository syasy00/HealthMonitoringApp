
import React, { useEffect } from 'react';
import { Phone, Ambulance, HeartPulse, X, ShieldAlert, MapPin } from 'lucide-react';

interface EmergencyOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyOverlay: React.FC<EmergencyOverlayProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Lock scroll
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-red-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-[fadeIn_0.2s]">
      
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-red-900/50 rounded-full text-red-200 hover:bg-red-800 transition border border-red-500/30"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-6 animate-ping shadow-[0_0_50px_rgba(239,68,68,0.6)]">
           <ShieldAlert size={40} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-widest text-center">Emergency</h2>
        <p className="text-red-200 text-sm text-center mb-10 max-w-[200px]">
          Location & Vitals are being broadcast to responders.
        </p>

        <div className="w-full space-y-4">
          <button className="w-full group relative overflow-hidden bg-red-600 hover:bg-red-500 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-red-900/50 transition-transform active:scale-95 text-xl border border-red-400">
             <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
             <Ambulance size={32} /> CALL 911
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button className="bg-slate-900/80 hover:bg-slate-800 text-white p-4 rounded-2xl flex flex-col items-center gap-2 border border-white/10 active:scale-95 transition">
              <HeartPulse size={28} className="text-pink-400" />
              <span className="text-sm font-bold">Call Doctor</span>
            </button>
            <button className="bg-slate-900/80 hover:bg-slate-800 text-white p-4 rounded-2xl flex flex-col items-center gap-2 border border-white/10 active:scale-95 transition">
              <Phone size={28} className="text-emerald-400" />
              <span className="text-sm font-bold">Call Family</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 text-red-300/60 text-xs font-mono border border-red-500/20 px-3 py-1 rounded-full">
           <MapPin size={10} />
           <span>LAT: 40.7128 • LNG: -74.0060</span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyOverlay;
