
import React, { useState } from 'react';
import { Appointment } from '../types';
import { Calendar, Clock, Video, MapPin, Plus, Check, ChevronRight } from 'lucide-react';

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
    <div className={`w-full glass-panel rounded-2xl p-4 border transition-all duration-500 ${isRiskMode ? 'border-red-500/40 bg-red-900/10' : 'border-indigo-500/20'}`}>
      <div className="flex justify-between items-center mb-3">
        <div>
           <h3 className={`text-sm font-bold uppercase tracking-wider ${isRiskMode ? 'text-red-300' : 'text-slate-400'}`}>
             Care Connect
           </h3>
        </div>
        {!showBooking && (
          <button 
            onClick={() => setShowBooking(true)}
            className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 hover:text-white transition"
          >
            <Plus size={12} /> New Appointment
          </button>
        )}
      </div>

      {showBooking ? (
        <div className="bg-slate-900/50 rounded-xl p-3 border border-white/5 animate-[fadeIn_0.3s]">
           <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
             <Calendar size={14} /> Schedule Visit
           </h4>
           
           <div className="space-y-2 mb-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Reason for visit</p>
              <div className="grid grid-cols-2 gap-2">
                {['Routine Check-up', 'Feeling Sick', 'Consultation', 'Refill Meds'].map(reason => (
                  <button 
                    key={reason}
                    onClick={() => setBookingReason(reason)}
                    className={`text-[10px] py-2 rounded-lg border transition-all ${
                      bookingReason === reason 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
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
               className={`flex-1 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                 bookingReason ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
               }`}
             >
               <Check size={14} /> Confirm
             </button>
             <button onClick={() => setShowBooking(false)} className="flex-1 bg-slate-800 text-slate-400 text-xs font-bold py-2 rounded-lg border border-slate-700 hover:bg-slate-700">
               Cancel
             </button>
           </div>
        </div>
      ) : (
        <>
          <p className="text-[10px] text-slate-500 mb-2">UPCOMING APPOINTMENT</p>
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
              <ChevronRight size={16} className="text-slate-600" />
            </div>
          ) : (
            <div className="text-center py-4 bg-slate-800/30 rounded-xl border border-white/5 border-dashed">
              <p className="text-xs text-slate-500">No upcoming appointments.</p>
              <button onClick={() => setShowBooking(true)} className="text-indigo-400 text-xs font-medium mt-1 hover:underline">
                Book Now
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentWidget;
