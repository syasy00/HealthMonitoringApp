import React, { useState } from 'react';
import { Appointment } from '../types';
import { Calendar, Clock, Video, MapPin, Plus, ChevronRight, User } from 'lucide-react';

interface AppointmentWidgetProps {
  appointments: Appointment[];
  isRiskMode?: boolean;
}

const AppointmentWidget: React.FC<AppointmentWidgetProps> = ({ 
  appointments: initialAppointments, 
  isRiskMode
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingReason, setBookingReason] = useState<string>('');

  const nextAppointment = appointments.length > 0 ? appointments[0] : null;

  const handleBook = () => {
    const newAppt: Appointment = {
      id: Math.random().toString(),
      doctorName: 'Dr. Sarah Chen',
      specialty: bookingReason || 'General Check-up',
      date: new Date(Date.now() + 86400000 * 2),
      type: 'In-Person'
    };
    setAppointments([newAppt, ...appointments].sort((a, b) => a.date.getTime() - b.date.getTime()));
    setShowBooking(false);
    setBookingReason('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full bg-[#0f121d] rounded-3xl p-5 border border-white/5 relative overflow-hidden">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
           <h3 className="text-[10px] font-black tracking-widest text-slate-300 uppercase leading-none mb-1">
             CARE CONNECT
           </h3>
           <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
             Upcoming Appointment
           </p>
        </div>
        {!showBooking && (
          <button 
            onClick={() => setShowBooking(true)}
            className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 hover:text-white transition bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20"
          >
            <Plus size={12} strokeWidth={3} /> New
          </button>
        )}
      </div>

      {showBooking ? (
        <div className="bg-[#151925] rounded-2xl p-4 border border-white/5 animate-[fadeIn_0.3s]">
           <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
             <Calendar size={14} className="text-indigo-400" /> Schedule Visit
           </h4>
           
           <div className="space-y-2 mb-4">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Reason for visit</p>
              <div className="grid grid-cols-2 gap-2">
                {['Routine Check-up', 'Feeling Sick', 'Consultation', 'Refill Meds'].map(reason => (
                  <button 
                    key={reason}
                    onClick={() => setBookingReason(reason)}
                    className={`text-[10px] py-2.5 rounded-xl border transition-all font-medium ${
                      bookingReason === reason 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                        : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
           </div>

           <div className="flex gap-2">
             <button 
               onClick={handleBook} 
               disabled={!bookingReason}
               className={`flex-1 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                 bookingReason ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'
               }`}
             >
               Confirm
             </button>
             <button onClick={() => setShowBooking(false)} className="flex-1 bg-transparent text-slate-400 text-xs font-bold py-2.5 rounded-xl border border-white/10 hover:bg-white/5 hover:text-white transition">
               Cancel
             </button>
           </div>
        </div>
      ) : (
        <>
          {nextAppointment ? (
            <div className="group bg-[#151925] rounded-2xl p-4 border border-white/5 flex gap-4 items-center relative overflow-hidden transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-black/20">
              
              {/* Date Block */}
              <div className="flex flex-col items-center justify-center w-14 h-14 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-900/50 text-white shrink-0">
                 <span className="text-lg font-black leading-none">{nextAppointment.date.getDate()}</span>
                 <span className="text-[9px] font-bold opacity-80 uppercase mt-0.5">{nextAppointment.date.toLocaleDateString('en-US', { month: 'short' })}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{nextAppointment.doctorName}</h4>
                <p className="text-[10px] text-slate-400 font-medium mb-2">{nextAppointment.specialty}</p>
                
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0a0c14] border border-white/5">
                     <Clock size={10} className="text-slate-400" />
                     <span className="text-[10px] text-slate-300 font-mono font-bold">{formatTime(nextAppointment.date)}</span>
                   </div>
                   
                   <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0a0c14] border border-white/5">
                     {nextAppointment.type === 'Video' ? <Video size={10} className="text-emerald-400" /> : <MapPin size={10} className="text-amber-400" />} 
                     <span className="text-[10px] text-slate-300 font-bold">{nextAppointment.type}</span>
                   </div>
                </div>
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <ChevronRight size={20} className="text-slate-500" />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-[#151925] rounded-2xl border border-white/5 border-dashed flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600">
                 <User size={20} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">No upcoming visits</p>
              <button onClick={() => setShowBooking(true)} className="text-indigo-400 text-xs font-bold hover:text-indigo-300 transition mt-1">
                Schedule Now
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentWidget;