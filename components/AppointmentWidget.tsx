
import React, { useState } from 'react';
import { Appointment } from '../types';
import { Calendar, Clock, Video, MapPin, Plus, Check, Phone, Ambulance, HeartPulse, ChevronLeft } from 'lucide-react';

interface AppointmentWidgetProps {
  appointments: Appointment[];
  isRiskMode?: boolean;
}

const AppointmentWidget: React.FC<AppointmentWidgetProps> = ({ appointments: initialAppointments, isRiskMode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [showBooking, setShowBooking] = useState(false);
  const [showSOS, setShowSOS] = useState(false);

  const nextAppointment = appointments.length > 0 ? appointments[0] : null;

  const handleBook = () => {
    // Mock booking a new appointment
    const newAppt: Appointment = {
      id: Math.random().toString(),
      doctorName: 'Dr. Sarah Chen',
      specialty: 'Cardiologist',
      date: new Date(Date.now() + 86400000 * 2), // 2 days from now
      type: 'In-Person'
    };
    setAppointments([newAppt, ...appointments].sort((a, b) => a.date.getTime() - b.date.getTime()));
    setShowBooking(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // --- SOS EMERGENCY VIEW ---
  if (showSOS) {
    return (
      <div className="w-full bg-red-950/60 backdrop-blur-xl rounded-2xl p-4 border border-red-500/50 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.3)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-red-100 uppercase tracking-wider flex items-center gap-2">
            <Ambulance size={18} className="animate-bounce" /> Emergency Mode
          </h3>
          <button onClick={() => setShowSOS(false)} className="p-1 bg-red-900/50 rounded-full text-red-300 hover:bg-red-800 transition">
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 transition-transform active:scale-95 text-lg">
            <Phone size={24} /> CALL 911
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-slate-800/80 hover:bg-slate-700 text-white p-3 rounded-xl flex flex-col items-center gap-2 border border-white/10 active:scale-95 transition">
              <HeartPulse size={24} className="text-pink-400" />
              <span className="text-xs font-bold">Call Dr. Chen</span>
            </button>
            <button className="bg-slate-800/80 hover:bg-slate-700 text-white p-3 rounded-xl flex flex-col items-center gap-2 border border-white/10 active:scale-95 transition">
              <Phone size={24} className="text-emerald-400" />
              <span className="text-xs font-bold">Call Family</span>
            </button>
          </div>
          <p className="text-[10px] text-center text-red-300 mt-2">Location shared with emergency services automatically.</p>
        </div>
      </div>
    );
  }

  // --- STANDARD VIEW ---
  return (
    <div className={`w-full glass-panel rounded-2xl p-4 border transition-all duration-500 ${isRiskMode ? 'border-red-500/40 bg-red-900/10' : 'border-indigo-500/20'}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
           <h3 className={`text-sm font-bold uppercase tracking-wider ${isRiskMode ? 'text-red-300' : 'text-slate-400'}`}>
             Care Connect
           </h3>
           <p className="text-[10px] text-slate-500">Upcoming Visits & Booking</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setShowSOS(true)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all active:scale-95 flex items-center gap-1 ${isRiskMode ? 'bg-red-600 text-white shadow-lg shadow-red-900/50 animate-pulse' : 'bg-red-900/20 text-red-400 border border-red-500/20 hover:bg-red-900/40'}`}
            >
                SOS
            </button>
            <button 
              onClick={() => setShowBooking(true)}
              className={`p-2 rounded-full transition-all active:scale-95 border ${isRiskMode ? 'bg-slate-800 text-red-300 border-red-500/30' : 'bg-slate-800 text-indigo-400 border-white/10 hover:bg-slate-700'}`}
            >
              <Plus size={18} />
            </button>
        </div>
      </div>

      {showBooking ? (
        <div className="bg-slate-900/50 rounded-xl p-3 border border-white/5 animate-[fadeIn_0.3s]">
           <p className="text-xs text-slate-300 mb-3">Book next available slot?</p>
           <div className="flex gap-2">
             <button onClick={handleBook} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1">
               <Check size={14} /> Confirm
             </button>
             <button onClick={() => setShowBooking(false)} className="flex-1 bg-slate-800 text-slate-400 text-xs font-bold py-2 rounded-lg">
               Cancel
             </button>
           </div>
        </div>
      ) : (
        <>
          {nextAppointment ? (
            <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5 flex gap-3 items-center">
              <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white font-bold text-xs leading-none ${isRiskMode ? 'bg-red-500' : 'bg-indigo-500'}`}>
                 <span>{nextAppointment.date.getDate()}</span>
                 <span className="text-[9px] opacity-75">{nextAppointment.date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white">{nextAppointment.doctorName}</h4>
                <p className="text-xs text-slate-400">{nextAppointment.specialty}</p>
                <div className="flex items-center gap-3 mt-1.5">
                   <span className="text-[10px] flex items-center gap-1 text-slate-500 bg-slate-900/50 px-1.5 py-0.5 rounded">
                     <Clock size={10} /> {formatTime(nextAppointment.date)}
                   </span>
                   <span className="text-[10px] flex items-center gap-1 text-slate-500 bg-slate-900/50 px-1.5 py-0.5 rounded">
                     {nextAppointment.type === 'Video' ? <Video size={10} /> : <MapPin size={10} />} {nextAppointment.type}
                   </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 bg-slate-800/30 rounded-xl border border-white/5 border-dashed">
              <p className="text-xs text-slate-500">No upcoming appointments.</p>
              <button onClick={() => setShowBooking(true)} className="text-indigo-400 text-xs font-medium mt-1 hover:underline">
                Schedule Check-up
              </button>
            </div>
          )}
        </>
      )}
      
      {isRiskMode && !showBooking && (
         <div className="mt-3 text-[10px] text-red-300 flex items-center gap-1.5 bg-red-900/30 p-2 rounded-lg border border-red-500/20">
           <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
           Vitals unstable. Recommendation: Contact Emergency.
         </div>
      )}
    </div>
  );
};

export default AppointmentWidget;
