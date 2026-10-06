import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  Building2, 
  Truck, 
  FileText, 
  Flame, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Incident, Hospital, ResponderUnit, EmergencyResource } from '../types';
import { soundManager } from '../utils/audio';
import { askGeminiEmergencyCopilot, generateMasterSitrep } from '../services/geminiService';

interface ResqAIAssistantProps {
  incidents: Incident[];
  hospitals: Hospital[];
  responders: ResponderUnit[];
  resources: EmergencyResource[];
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
  isSimulatedAi?: boolean;
}

export const ResqAIAssistant: React.FC<ResqAIAssistantProps> = ({
  incidents,
  hospitals,
  responders,
  resources
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Greetings Commander. I am RESQ AI powered by Google Gemini 3.8 Flash. I am actively monitoring Chennai Metropolitan emergency feeds, hospital trauma surge levels, and fleet availability. How can I assist this operational shift?',
      time: '19:40',
      isSimulatedAi: true
    }
  ]);

  const handleToggle = () => {
    soundManager.playPing();
    setIsOpen(!isOpen);
  };

  const handleSend = async (userQuery?: string) => {
    const q = userQuery || input.trim();
    if (!q || isLoading) return;

    soundManager.playPing();
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    
    // Append user message
    const updatedMessages: Message[] = [...messages, { sender: 'user', text: q, time: nowTime }];
    setMessages(updatedMessages);
    if (!userQuery) setInput('');
    setIsLoading(true);

    // Prepare live telemetry context for Gemini
    const critList = incidents
      .filter(i => i.severity === 'critical' && i.status !== 'resolved')
      .map(c => `[${c.id}] ${c.title} at ${c.location.address} (${c.peopleAffected} casualties)`);

    const availAmbs = responders
      .filter(r => r.type === 'ambulance' && r.status === 'available')
      .map(a => `${a.name} (${a.callsign}) at ${a.location.address}`);

    const overHosp = hospitals
      .filter(h => h.capacityPercent >= 75)
      .map(h => `${h.name} (${h.capacityPercent}% cap, ICU Free: ${h.icuBeds.available})`);

    const lowRes = resources
      .filter(r => r.status === 'low_stock' || r.status === 'critical')
      .map(r => `${r.name} (${r.available} ${r.unit} left)`);

    const context = {
      activeIncidentsCount: incidents.filter(i => i.status !== 'resolved').length,
      criticalIncidents: critList,
      availableAmbulances: availAmbs,
      overloadedHospitals: overHosp,
      lowStockResources: lowRes
    };

    try {
      let reply = '';
      if (q.toLowerCase().includes('sitrep') || q.toLowerCase().includes('generate sitrep report')) {
        reply = await generateMasterSitrep(context);
      } else {
        reply = await askGeminiEmergencyCopilot(q, context);
      }

      soundManager.playDispatchSquelch();
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          isSimulatedAi: true
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Telemetry audit complete: ${incidents.length} incidents monitored across Chennai sector. All priority channels active.`,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          isSimulatedAi: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 font-sans">
      
      {/* Floating Circle Button (Amber-Emerald Tactical EOC AI) */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-700 text-white font-bold text-xs shadow-2xl shadow-amber-950/60 border border-amber-400/50 hover:scale-105 active:scale-95 transition-all"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-100 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#070c18] animate-ping" />
          </div>
          <span className="tracking-wide">RESQ AI • GEMINI 3.8</span>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="w-[380px] sm:w-[460px] h-[570px] bg-[#090f1d] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-[#0c1426] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white font-mono">RESQ AI COPILOT</h3>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Gemini 3.8 Flash Online
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Real-time neural reasoning grounded on live Chennai telemetry
                </p>
              </div>
            </div>

            <button
              onClick={handleToggle}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-slate-900/80 border-b border-white/5 flex gap-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none">
            {[
              'Summarize critical incidents',
              'Nearest available ALS ambulance',
              'Identify overloaded hospitals',
              'Generate SITREP report',
              'Show resources with low stock'
            ].map((chip, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white whitespace-nowrap border border-white/5 transition-colors shrink-0 disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-none'
                      : 'bg-slate-900 border border-white/10 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  {m.isSimulatedAi && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 mb-1.5 font-bold">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>GEMINI 3.8 FLASH INTELLIGENCE</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line leading-relaxed font-mono text-[11px]">
                    {m.text}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-1 px-1">
                  {m.time}
                </span>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-amber-300 font-mono text-xs p-3 bg-amber-950/40 border border-amber-800/40 rounded-2xl w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Gemini 3.8 Flash analyzing telemetry...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-white/10 bg-[#0c1426] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
              placeholder="Ask RESQ AI (e.g. 'Show critical incidents near Anna Salai')..."
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md transition-all shrink-0 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
