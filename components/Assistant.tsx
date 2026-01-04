import React, { useState } from 'react';
import { Send, X, Bot, User, Sparkles } from 'lucide-react';
import { HealthData } from '../types';

interface AssistantProps {
  onClose: () => void;
  healthData: HealthData;
}

const Assistant: React.FC<AssistantProps> = ({ onClose, healthData }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hello Alex! I see your hydration is at ${healthData.hydration.value}%. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "I've logged that for you. Based on your current vitals, I recommend taking a short 5-minute break to lower your stress levels." 
      }]);
    }, 1000);
    
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Dr. Aura</h3>
            <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
              {msg.role === 'ai' ? <Sparkles size={14} /> : <User size={14} />}
            </div>
            <div className={`p-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
              msg.role === 'ai' 
                ? 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm' 
                : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Dr. Aura..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-900 placeholder:text-slate-400"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;