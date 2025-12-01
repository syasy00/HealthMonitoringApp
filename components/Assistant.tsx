import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, X, Volume2 } from 'lucide-react';
import { ChatMessage, HealthData } from '../types';
import { chatWithHealthAssistant } from '../services/gemini';

interface AssistantProps {
  isOpen: boolean;
  onClose: () => void;
  healthData: HealthData;
}

const Assistant: React.FC<AssistantProps> = ({ isOpen, onClose, healthData }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello. I'm Aura. I've looked at your vitals. How are you feeling right now?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await chatWithHealthAssistant(input, healthData, history);

    const modelMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, modelMsg]);
    setIsTyping(false);
  };

  // Simple mock for voice input (browser API)
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognition.start();
    } else {
      alert("Voice input not supported in this browser.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md h-[85vh] sm:h-[700px] bg-[#1e293b] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden border border-slate-700 animate-[slideUp_0.3s_ease-out]">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
               <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-bold text-white">Aura Assistant</h3>
              <p className="text-xs text-indigo-300">Always here for you</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start">
               <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-slate-700 flex gap-1">
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
           {/* HFE Suggestion Chips for Cognition Support */}
           <div className="flex gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
              <button onClick={() => setInput("Check my heart rate")} className="whitespace-nowrap px-3 py-1 bg-slate-800 rounded-full text-xs text-indigo-300 border border-indigo-900/50 hover:bg-indigo-900/30 transition">
                Check Heart
              </button>
              <button onClick={() => setInput("I feel dizzy")} className="whitespace-nowrap px-3 py-1 bg-slate-800 rounded-full text-xs text-indigo-300 border border-indigo-900/50 hover:bg-indigo-900/30 transition">
                I feel dizzy
              </button>
              <button onClick={() => setInput("Call emergency")} className="whitespace-nowrap px-3 py-1 bg-red-900/30 rounded-full text-xs text-red-300 border border-red-900/50 hover:bg-red-900/50 transition">
                Emergency
              </button>
           </div>

           <div className="flex gap-2">
             <button 
                onClick={startListening}
                className="p-3 bg-slate-800 text-slate-300 rounded-full hover:bg-slate-700 transition active:scale-95 border border-slate-700"
                aria-label="Speak"
              >
               <Mic size={24} />
             </button>
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="Ask Aura..."
               className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-5 text-sm focus:outline-none focus:border-indigo-500 text-white placeholder:text-slate-600"
             />
             <button 
               onClick={handleSend}
               className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition active:scale-95 shadow-lg shadow-indigo-900/20"
               disabled={!input.trim()}
             >
               <Send size={20} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;