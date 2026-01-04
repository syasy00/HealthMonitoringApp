import React, { useState } from 'react';
import { Appointment } from '../types';
import { Calendar, Clock, Video, MapPin, Plus, X } from 'lucide-react';

interface AppointmentWidgetProps {
  appointments: Appointment[];
  onAddAppointment?: (appt: Omit<Appointment, 'id'>) => void;
}

const AppointmentWidget: React.FC<AppointmentWidgetProps> = ({ appointments, onAddAppointment }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  // FIX: Explicitly define the state type to allow both 'Video' and 'In-Person'
  const [newAppt, setNewAppt] = useState<{
    doctorName: string;
    specialty: string;
    type: 'Video' | 'In-Person';
    dateStr: string;
    timeStr: string;
  }>({ 
    doctorName: '', 
    specialty: '', 
    type: 'Video', 
    dateStr: '', 
    timeStr: '' 
  });

  const nextAppointment = appointments[0];
  const sortedAppointments = [...appointments].sort((a,b) => a.date.getTime() - b.date.getTime());

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(onAddAppointment && newAppt.doctorName) {
          // Construct Date object safely
          const dateTime = new Date(`${newAppt.dateStr}T${newAppt.timeStr}`);
          
          onAddAppointment({
              doctorName: newAppt.doctorName,
              specialty: newAppt.specialty,
              type: newAppt.type,
              date: !isNaN(dateTime.getTime()) ? dateTime : new Date() // Fallback to now if invalid
          });
          
          setShowAddForm(false);
          // Reset form
          setNewAppt({ doctorName: '', specialty: '', type: 'Video', dateStr: '', timeStr: '' });
      }
  };

  return (
    <div className="w-full bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 relative overflow-hidden transition-all duration-300">
      
      {/* Header */}
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
        <div className="flex gap-2">
            {appointments.length > 0 && (
                <button onClick={() => setShowAll(!showAll)} className="text-xs font-bold text-slate-400 hover:text-indigo-600">
                    {showAll ? 'Hide' : 'View All'}
                </button>
            )}
            <button 
                onClick={() => setShowAddForm(true)}
                className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-600 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100"
            >
                <Plus size={16} strokeWidth={2.5} />
            </button>
        </div>
      </div>

      {/* Content: List or Single Card */}
      {showAll ? (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {sortedAppointments.map(appt => (
                  <div key={appt.id} className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm border border-slate-100 shrink-0 text-center">
                         <span className="text-[8px] font-bold text-slate-400 uppercase">{appt.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                         <span className="text-sm font-black text-slate-900 leading-none">{appt.date.getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{appt.doctorName}</h4>
                          <p className="text-[10px] text-slate-500">{appt.specialty} • {formatTime(appt.date)}</p>
                      </div>
                  </div>
              ))}
          </div>
      ) : (
          <>
            {nextAppointment ? (
                <div className="relative bg-slate-50 rounded-2xl p-4 border border-slate-100 flex gap-4 items-center group cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-100 transition-all">
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
                </div>
            ) : (
                <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs font-medium text-slate-400">No upcoming visits</p>
                    <button onClick={() => setShowAddForm(true)} className="text-xs font-bold text-indigo-600 mt-1 hover:underline">Schedule one</button>
                </div>
            )}
          </>
      )}

      {/* ADD APPOINTMENT MODAL */}
      {showAddForm && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 rounded-[2rem] p-5 flex flex-col animate-in fade-in duration-200">
              <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-900">Schedule Visit</h4>
                  <button onClick={() => setShowAddForm(false)} className="p-1 rounded-full bg-slate-100 hover:bg-slate-200"><X size={16}/></button>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1 overflow-y-auto">
                  <input 
                    type="text" placeholder="Dr. Name" required
                    value={newAppt.doctorName} onChange={e => setNewAppt({...newAppt, doctorName: e.target.value})}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                  <input 
                    type="text" placeholder="Specialty (e.g. Cardio)" required
                    value={newAppt.specialty} onChange={e => setNewAppt({...newAppt, specialty: e.target.value})}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex gap-2">
                      <input 
                        type="date" required
                        value={newAppt.dateStr} onChange={e => setNewAppt({...newAppt, dateStr: e.target.value})}
                        className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                      />
                      <input 
                        type="time" required
                        value={newAppt.timeStr} onChange={e => setNewAppt({...newAppt, timeStr: e.target.value})}
                        className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                      />
                  </div>
                  <div className="flex gap-2">
                       <button type="button" onClick={() => setNewAppt({...newAppt, type: 'Video'})} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${newAppt.type === 'Video' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>Video</button>
                       <button type="button" onClick={() => setNewAppt({...newAppt, type: 'In-Person'})} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${newAppt.type === 'In-Person' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>In-Person</button>
                  </div>

                  <button type="submit" className="mt-auto w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700">
                      Confirm Booking
                  </button>
              </form>
          </div>
      )}

    </div>
  );
};

export default AppointmentWidget;