import React, { useState } from 'react';
import { Appointment } from '../types';
import { Calendar, Clock, Video, MapPin, Plus, ArrowRight } from 'lucide-react';

interface AppointmentWidgetProps {
  appointments: Appointment[];
}

const AppointmentWidget: React.FC<AppointmentWidgetProps> = ({ appointments }) => {
  const [showBooking, setShowBooking] = useState(false);
  const nextAppointment = appointments.length > 0 ? appointments[0] : null;

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 relative overflow-hidden">
      
      <div className="flex justify-between items-center mb-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <div className="p-1.5 bg-indigo-100 rounded-lg">
               <Calendar size={14} className="text-indigo-600" />
             </div>
             <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Upcoming</span>
           </div>
           <h3 className="text-lg font-black text-slate-900 leading-none">Visits</h3>
        </div>
        {!showBooking && (
          <button 
            onClick={() => setShowBooking(true)}
            className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-600 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {nextAppointment ? (
        <div className="relative bg-slate-50 rounded-2xl p-4 border border-slate-100 flex gap-4 items-center group cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-100 transition-all">
          
          {/* Calendar Date Icon */}
          <div className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0 text-center">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{nextAppointment.date.toLocaleDateString('en-US', { month: 'short' })}</span>
             <span className="text-xl font-black text-slate-900 leading-none mt-0.5">{nextAppointment.date.getDate()}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">{nextAppointment.doctorName}</h4>
            <p className="text-xs text-slate-500 font-medium mb-1.5">{nextAppointment.specialty}</p>
            
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-100">
                 <Clock size={10} className="text-slate-400" />
                 {formatTime(nextAppointment.date)}
               </div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-100">
                 {nextAppointment.type === 'Video' ? <Video size={10} className="text-emerald-500" /> : <MapPin size={10} className="text-amber-500" />} 
                 {nextAppointment.type}
               </div>
            </div>
          </div>
          
          <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
           <p className="text-xs font-medium text-slate-400">No upcoming visits</p>
           <button onClick={() => setShowBooking(true)} className="text-xs font-bold text-indigo-600 mt-1 hover:underline">Schedule one</button>
        </div>
      )}
    </div>
  );
};

export default AppointmentWidget;