import React, { useState } from 'react';
import { 
  Flame, 
  MapPin, 
  Bell, 
  PhoneCall, 
  Clock, 
  ShieldAlert, 
  Home, 
  Send, 
  User, 
  Activity,
  HeartPulse,
  Share2,
  Volume2
} from 'lucide-react';
import { Incident, PublicAlert, LanguageCode } from '../types';
import { soundManager } from '../utils/audio';
import { speakText } from '../utils/speech';
import { translations } from '../data/mockData';

interface CitizenMobileViewProps {
  onOpenReport: () => void;
  alerts: PublicAlert[];
  incidents: Incident[];
  lang: LanguageCode;
}

export const CitizenMobileView: React.FC<CitizenMobileViewProps> = ({
  onOpenReport,
  alerts,
  incidents,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'report' | 'alerts' | 'tracking' | 'profile'>('home');
  const t = translations[lang] || translations.en;

  const citizenIncidents = incidents.filter(i => i.source === 'citizen_app');

  const emergencyHotlines = [
    { label: 'India Emergency Service', number: '112', desc: 'All-in-one Police, Fire & Medical' },
    { label: 'Ambulance & Trauma', number: '108', desc: 'Free State Emergency Medical Service' },
    { label: 'Fire & Rescue Service', number: '101', desc: 'Fire Brigade & Disaster Extraction' },
    { label: 'Police Control Room', number: '100', desc: 'Law & Order Rapid Response' }
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#070c18] pb-24 text-slate-100 flex flex-col justify-between">
      
      {/* Top Mobile Bar */}
      <div className="sticky top-0 z-30 bg-[#090f1d]/90 backdrop-blur-md px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-xs">
            R
          </div>
          <span className="font-extrabold text-sm tracking-wider text-white">RESQ CITIZEN</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Connected to 112 Grid</span>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="p-4 space-y-5 flex-1">
        
        {activeTab === 'home' && (
          <>
            {/* Giant Central SOS Action */}
            <div className="text-center pt-2 pb-4">
              <button
                onClick={() => {
                  soundManager.playEmergencyAlarm();
                  onOpenReport();
                }}
                className="group relative w-full py-8 rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white font-black text-xl tracking-wider uppercase shadow-2xl shadow-red-950/80 border-2 border-red-400/60 transition-all active:scale-95 flex flex-col items-center justify-center gap-3"
              >
                <div className="relative">
                  <span className="absolute -inset-4 rounded-full bg-white/20 animate-ping" />
                  <div className="w-16 h-16 rounded-full bg-white text-red-600 flex items-center justify-center shadow-lg">
                    <Flame className="w-8 h-8 animate-pulse" />
                  </div>
                </div>
                <span>🚨 {t.reportEmergencyBtn}</span>
                <span className="text-xs font-mono font-normal text-red-100 uppercase tracking-widest">
                  Tap to mobilize instant assistance
                </span>
              </button>
            </div>

            {/* My Location Card */}
            <div className="double-bezel-shell">
              <div className="double-bezel-core p-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5 font-bold uppercase text-white">
                    <MapPin className="w-4 h-4 text-red-500" />
                    My Current Location
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">● GPS ACCURACY: 4M</span>
                </div>
                <div className="text-slate-200 text-xs">
                  Anna Salai, T Nagar, Chennai, Tamil Nadu
                </div>
              </div>
            </div>

            {/* Active Disaster Alerts in Sector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-bold uppercase">Active Local Alerts ({alerts.length})</span>
                <button onClick={() => setActiveTab('alerts')} className="text-cyan-400">View All</button>
              </div>

              {alerts.slice(0, 2).map((al) => (
                <div key={al.id} className="p-3 rounded-2xl bg-slate-900 border border-amber-500/30 text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-amber-300">{al.title}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-950 text-amber-400">
                      {al.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans">
                    {al.message[lang] || al.message.en}
                  </p>
                </div>
              ))}
            </div>

            {/* Emergency Hotline Quick Access */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase block">
                Direct Emergency Helplines
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono">
                {emergencyHotlines.map((h, i) => (
                  <a
                    key={i}
                    href={`tel:${h.number}`}
                    className="p-3 rounded-2xl bg-[#0c1426] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-lg font-black text-white">{h.number}</div>
                      <div className="text-[11px] font-bold text-slate-300">{h.label}</div>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1">{h.desc}</div>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-mono">DISASTER &amp; CIVIL ALERTS</h3>
            {alerts.map(a => (
              <div key={a.id} className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-amber-400 font-bold">{a.title}</span>
                  <span className="text-[10px] text-slate-400">{a.issuedAt}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {a.message[lang] || a.message.en}
                </p>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-2 border-t border-white/5">
                  <span>Target: {a.targetArea}</span>
                  <button 
                    onClick={() => speakText(a.message[lang] || a.message.en, lang)}
                    className="flex items-center gap-1 text-cyan-400"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Read Aloud</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TRACKING TAB */}
        {activeTab === 'tracking' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-mono">MY ACTIVE INCIDENTS</h3>
            {citizenIncidents.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-400">
                You have no active emergency tickets logged.
              </div>
            ) : (
              citizenIncidents.map(inc => (
                <div key={inc.id} className="p-4 rounded-2xl bg-slate-900 border border-red-500/40 space-y-2">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="font-bold text-white">#{inc.id}</span>
                    <span className="text-cyan-400 font-bold uppercase">{inc.status}</span>
                  </div>
                  <div className="text-xs text-slate-300">{inc.title}</div>
                  <div className="text-[11px] font-mono text-emerald-400">
                    Assigned: {inc.assignedUnits.join(', ') || 'Dispatching'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-4 font-mono text-xs">
            <h3 className="text-base font-bold text-white">CITIZEN PROFILE</h3>
            <div className="space-y-2 text-slate-300">
              <div>Name: <b className="text-white">Rajesh Sundaram</b></div>
              <div>Phone: <b className="text-white">+91 98401 22910</b></div>
              <div>Blood Group: <b className="text-red-400 font-bold">O Positive (O+)</b></div>
              <div>Emergency Contact: <b className="text-white">Dr. Anita (+91 97911 34910)</b></div>
              <div>Language: <b className="text-cyan-400 uppercase">{lang}</b></div>
            </div>
          </div>
        )}

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#090f1d]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center justify-around font-mono text-[10px]">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'report', label: 'Report', icon: Flame, special: true },
          { id: 'alerts', label: 'Alerts', icon: Bell },
          { id: 'tracking', label: 'Tracking', icon: Activity },
          { id: 'profile', label: 'Profile', icon: User }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundManager.playPing();
              if (tab.id === 'report') {
                onOpenReport();
              } else {
                setActiveTab(tab.id as typeof activeTab);
              }
            }}
            className={`flex flex-col items-center gap-1 transition-all ${
              tab.special 
                ? 'text-red-400 font-bold -translate-y-2' 
                : activeTab === tab.id 
                  ? 'text-white font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.special ? (
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-900/50">
                <tab.icon className="w-5 h-5 animate-pulse" />
              </div>
            ) : (
              <tab.icon className="w-4 h-4" />
            )}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
};

