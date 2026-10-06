import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  HeartPulse, 
  Building2, 
  PhoneCall, 
  CheckCircle2, 
  Truck, 
  ShieldAlert, 
  Share2, 
  Radio 
} from 'lucide-react';
import { Incident, Hospital, ResponderStatus } from '../types';
import { soundManager } from '../utils/audio';

interface ResponderMobileViewProps {
  activeIncident: Incident | null;
  hospital: Hospital | null;
  onUpdateStatus: (newStatus: Incident['status']) => void;
}

export const ResponderMobileView: React.FC<ResponderMobileViewProps> = ({
  activeIncident,
  hospital,
  onUpdateStatus
}) => {
  const [unitStatus, setUnitStatus] = useState<ResponderStatus>('en_route');

  const handleStatusChange = (st: ResponderStatus, incStatus: Incident['status']) => {
    soundManager.playDispatchSquelch();
    setUnitStatus(st);
    onUpdateStatus(incStatus);
  };

  if (!activeIncident) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#070c18] p-6 text-center text-slate-400 font-mono flex flex-col justify-center items-center">
        <Truck className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
        <h3 className="text-white text-base font-bold">STANDBY IN SECTOR</h3>
        <p className="text-xs text-slate-500 mt-1">No emergency runsheet currently assigned to your unit.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#070c18] pb-12 text-slate-100 flex flex-col justify-between font-mono">
      
      {/* Top Mobile Bar */}
      <div className="bg-[#090f1d] px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-cyan-400" />
          <span className="font-extrabold text-sm text-white">UNIT AMB-04 (ALS)</span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase animate-pulse">
          {unitStatus.replace('_', ' ')}
        </span>
      </div>

      <div className="p-4 space-y-4 flex-1">
        
        {/* Active Incident Header Card */}
        <div className="p-4 rounded-3xl bg-red-950/40 border-2 border-red-500/60 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-red-400 uppercase">RUNSHEET #{activeIncident.id}</span>
            <span className="text-emerald-400 font-bold">ETA: ~{activeIncident.etaMinutes || 4} MIN</span>
          </div>
          <h2 className="text-base font-bold text-white font-sans">{activeIncident.title}</h2>
          <div className="text-xs text-slate-300 font-sans">{activeIncident.description}</div>
        </div>

        {/* Turn-by-turn Navigation Button */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${activeIncident.location.lat},${activeIncident.location.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundManager.playPing()}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50"
        >
          <Navigation className="w-4 h-4" />
          <span>Launch GPS Emergency Route</span>
        </a>

        {/* Target Location Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-xs space-y-1">
          <div className="text-slate-400 font-bold flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-red-400" />
            <span>Target Incident Location</span>
          </div>
          <div className="text-white font-sans">{activeIncident.location.address}</div>
          <div className="text-[10px] text-cyan-400">{activeIncident.location.lat.toFixed(4)}, {activeIncident.location.lng.toFixed(4)}</div>
        </div>

        {/* Casualty Clinical Vitals Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-xs space-y-2">
          <div className="text-slate-400 font-bold flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <span>Casualty Triage Parameters</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div>Affected: <b className="text-white">{activeIncident.peopleAffected}</b></div>
            <div>Severity: <b className="text-red-400 uppercase">{activeIncident.severity}</b></div>
            <div>SpO2: <b className="text-cyan-400">92% (Low)</b></div>
            <div>Pulse: <b className="text-emerald-400">118 BPM</b></div>
          </div>
        </div>

        {/* Receiving Hospital Card */}
        {hospital && (
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-xs space-y-2">
            <div className="text-slate-400 font-bold flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Receiving Facility (Apollo Greams Rd)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Trauma Bay 2 Reserved</span>
              <span className="text-emerald-400 font-bold">ICU Free: {hospital.icuBeds.available}</span>
            </div>
          </div>
        )}

        {/* Tactical Status Switcher Buttons */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            RESPONDER STATUS CONTROLS
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleStatusChange('en_route', 'en_route')}
              className={`py-3 rounded-xl border text-xs font-bold ${
                unitStatus === 'en_route' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-900 text-slate-300 border-white/10'
              }`}
            >
              En Route
            </button>
            <button
              onClick={() => handleStatusChange('on_scene', 'on_scene')}
              className={`py-3 rounded-xl border text-xs font-bold ${
                unitStatus === 'on_scene' ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-900 text-slate-300 border-white/10'
              }`}
            >
              On Scene
            </button>
            <button
              onClick={() => handleStatusChange('busy', 'transporting')}
              className={`py-3 rounded-xl border text-xs font-bold ${
                unitStatus === 'busy' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900 text-slate-300 border-white/10'
              }`}
            >
              Transporting
            </button>
            <button
              onClick={() => handleStatusChange('available', 'resolved')}
              className={`py-3 rounded-xl border text-xs font-bold ${
                unitStatus === 'available' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-900 text-slate-300 border-white/10'
              }`}
            >
              Mark Resolved
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

