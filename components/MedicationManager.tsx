import React, { useState } from 'react';
import { Medication } from '../types';
import { Pill, Check, Clock, Plus, X } from 'lucide-react';

interface MedicationManagerProps {
  medications: Medication[];
  onTake: (id: string) => void;
  onAddMed: (med: Omit<Medication, 'id' | 'taken'>) => void;
  onShowDetails: (id: string) => void; 
}

const MedicationManager: React.FC<MedicationManagerProps> = ({ 
  medications, 
  onTake,
  onAddMed
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '09:00 AM' });

  const allDone = medications.every(m => m.taken);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(newMed.name && newMed.dosage) {
          onAddMed({ ...newMed, type: 'pill' });
          setNewMed({ name: '', dosage: '', time: '09:00 AM' });
          setShowAddForm(false);
      }
  };

  return (
    <div className="w-full bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col gap-4 relative">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <div className="p-1.5 bg-emerald-100 rounded-lg">
               <Pill size={14} className="text-emerald-600" />
             </div>
             <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Routine</span>
           </div>
           <h3 className="text-lg font-black text-slate-900 leading-none">Medications</h3>
        </div>
        
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${allDone ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
          {medications.filter(m => m.taken).length}/{medications.length} Taken
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {medications.map((med) => (
          <div 
            key={med.id}
            className={`group relative flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${
              med.taken 
                ? 'bg-slate-50 border-slate-100 opacity-60' 
                : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${med.taken ? 'bg-slate-200 text-slate-400' : 'bg-indigo-50 text-indigo-600'}`}>
                <Pill size={18} />
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${med.taken ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {med.name}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                   <span>{med.dosage}</span>
                   <span className="w-1 h-1 rounded-full bg-slate-300" />
                   <div className="flex items-center gap-1">
                      <Clock size={10} /> {med.time}
                   </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onTake(med.id)}
              disabled={med.taken}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                med.taken 
                  ? 'bg-emerald-100 text-emerald-600' 
                  : 'bg-slate-100 text-slate-300 hover:bg-emerald-500 hover:text-white'
              }`}
            >
              <Check size={16} strokeWidth={3} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Add Button */}
      <button onClick={() => setShowAddForm(true)} className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs font-bold hover:bg-slate-50 hover:border-slate-400 hover:text-slate-600 transition flex items-center justify-center gap-2">
          <Plus size={14}/> Add Medication
      </button>

      {/* ADD MED MODAL */}
      {showAddForm && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 rounded-[2rem] p-5 flex flex-col animate-in fade-in duration-200">
              <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-slate-900">Add New Med</h4>
                  <button onClick={() => setShowAddForm(false)} className="p-1 rounded-full bg-slate-100"><X size={16}/></button>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
                  <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Medication Name</label>
                      <input 
                        type="text" placeholder="e.g. Ibuprofen" required
                        value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})}
                        className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                  </div>
                  <div className="flex gap-3">
                      <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Dosage</label>
                          <input 
                            type="text" placeholder="200mg" required
                            value={newMed.dosage} onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                            className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                          />
                      </div>
                      <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Time</label>
                          <input 
                            type="text" placeholder="09:00 AM" required
                            value={newMed.time} onChange={e => setNewMed({...newMed, time: e.target.value})}
                            className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                          />
                      </div>
                  </div>
                  <button type="submit" className="mt-auto w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700">
                      Save Medication
                  </button>
              </form>
          </div>
      )}
    </div>
  );
};

export default MedicationManager;