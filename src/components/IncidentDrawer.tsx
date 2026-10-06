import React from 'react';
import { 
  X, 
  Flame, 
  HeartPulse, 
  Car, 
  Waves, 
  Building2, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Users, 
  Truck, 
  Hospital as HospitalIcon, 
  PhoneCall, 
  Navigation, 
  CheckCircle2, 
  Send, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Incident, Hospital, ResponderUnit } from '../types';
import { soundManager } from '../utils/audio';

interface IncidentDrawerProps {
  incident: Incident | null;
  onClose: () => void;
  hospitals: Hospital[];
  responders: ResponderUnit[];
  onOpenDispatch: (incident: Incident) => void;
  onViewDetails: (incident: Incident) => void;
  onMarkResolved: (incidentId: string) => void;
}

export const IncidentDrawer: React.FC<IncidentDrawerProps> = ({
  incident,
  onClose,
  hospitals,
  responders,
  onOpenDispatch,
  onViewDetails,
  onMarkResolved
}) => {
  if (!incident) return null;

  const nearestHospital = hospitals.find(h => h.id === incident.nearestHospitalId) || hospitals[0];
  const assignedResponderUnits = responders.filter(r => incident.assignedUnits.includes(r.id));

  const handleDispatchClick = () => {
    soundManager.playDispatchSquelch();
    onOpenDispatch(incident);
  };

  const handleResolveClick = () => {
    soundManager.playSuccess();
    onMarkResolved(incident.id);
  };

  const handleContactUnit = (unitId: string) => {
    soundManager.playPing();
    alert(`Connecting encrypted VHF radio line to ${unitId}... (Simulated EOC Comms)`);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-[#080d1b] border-l border-white/15 shadow-2xl flex flex-col animate-slide-left overflow-hidden">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0c1426] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            incident.severity === 'critical' ? 'bg-red-950/80 border-red-500/50 text-red-400' :
            incident.severity === 'high' ? 'bg-orange-950/80 border-orange-500/50 text-orange-400' :
            'bg-amber-950/80 border-amber-500/50 text-amber-400'
          }`}>
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black text-white">INCIDENT #{incident.id}</span>
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                incident.severity === 'critical' ? 'bg-red-600 text-white' :
                incident.severity === 'high' ? 'bg-orange-600 text-white' :
                'bg-yellow-600 text-slate-900'
              }`}>
                {incident.severity}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5 uppercase">
              {incident.type} EMERGENCY • {incident.status.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        
        {/* Incident Summary Card */}
        <div className="double-bezel-shell">
          <div className="double-bezel-core p-4 space-y-3">
            <h3 className="text-sm font-bold text-white leading-snug">{incident.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{incident.description}</p>
            
            <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">PEOPLE AFFECTED</span>
                <span className="text-white font-bold">{incident.peopleAffected} persons</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">TIME REPORTED</span>
                <span className="text-slate-200">{incident.reportedAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Coordinates */}
        <div className="p-3.5 rounded-2xl bg-[#0c1426] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5 font-bold uppercase">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              Location Pinned
            </span>
            <span className="text-cyan-400 font-bold">
              {incident.location.lat.toFixed(4)}°N, {incident.location.lng.toFixed(4)}°E
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 text-xs text-slate-200 font-mono">
            {incident.location.address}
          </div>
        </div>

        {/* Assigned Responders */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
              ASSIGNED RESPONDERS ({assignedResponderUnits.length})
            </span>
            {incident.etaMinutes && (
              <span className="text-xs font-mono text-emerald-400 font-bold">
                ETA: ~{incident.etaMinutes} min
              </span>
            )}
          </div>

          {assignedResponderUnits.length === 0 ? (
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs font-mono text-red-300">
              No units assigned yet. Tap "DISPATCH" below to scramble nearest response.
            </div>
          ) : (
            <div className="space-y-2">
              {assignedResponderUnits.map((u) => (
                <div key={u.id} className="p-3 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[10px] text-slate-400">Status: {u.status.toUpperCase()}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleContactUnit(u.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                    title="Radio Contact"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nearest Hospital Alerted */}
        {nearestHospital && (
          <div className="p-3.5 rounded-2xl bg-[#0c1426] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5 font-bold uppercase">
                <HospitalIcon className="w-3.5 h-3.5 text-emerald-400" />
                Nearest Trauma Center
              </span>
              <span className="text-emerald-400 font-bold">
                ICU: {nearestHospital.icuBeds.available}/{nearestHospital.icuBeds.total} free
              </span>
            </div>
            <div className="font-semibold text-xs text-white">
              {nearestHospital.name}
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5">
              <span>Status: {nearestHospital.erStatus}</span>
              <span>Distance: ~{nearestHospital.distanceKm} km</span>
            </div>
          </div>
        )}

        {/* Incident Timeline */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider block">
            RECENT TIMELINE EVENTS
          </span>
          <div className="space-y-2 border-l border-white/15 pl-3 ml-1 text-xs font-mono">
            {incident.timeline.map((evt) => (
              <div key={evt.id} className="relative pb-2">
                <span className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-cyan-400" />
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{evt.time}</span>
                  <span className="text-slate-500">{evt.actor}</span>
                </div>
                <div className="font-bold text-slate-200 mt-0.5">{evt.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{evt.description}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Action Buttons */}
      <div className="p-4 border-t border-white/10 bg-[#0c1426] space-y-2">
        <div className="grid grid-cols-2 gap-2">
          
          {/* DISPATCH Button */}
          <button
            onClick={handleDispatchClick}
            className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-900/40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>DISPATCH</span>
          </button>

          {/* VIEW DETAILS Button */}
          <button
            onClick={() => onViewDetails(incident)}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>VIEW DETAILS</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* CONTACT UNIT Button */}
          <button
            onClick={() => handleContactUnit(incident.assignedUnits[0] || 'DISPATCH-CONTROL')}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10"
          >
            <PhoneCall className="w-3 h-3 text-cyan-400" />
            <span>CONTACT UNIT</span>
          </button>

          {/* MARK RESOLVED Button */}
          <button
            onClick={handleResolveClick}
            className="py-2 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>MARK RESOLVED</span>
          </button>
        </div>
      </div>

    </div>
  );
};

