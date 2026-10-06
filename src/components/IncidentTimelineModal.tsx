import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  Building2, 
  Boxes, 
  Flame, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { Incident, Hospital, ResponderUnit } from '../types';

interface IncidentTimelineModalProps {
  incident: Incident | null;
  onClose: () => void;
  hospitals: Hospital[];
  responders: ResponderUnit[];
}

export const IncidentTimelineModal: React.FC<IncidentTimelineModalProps> = ({
  incident,
  onClose,
  hospitals,
  responders
}) => {
  if (!incident) return null;

  const nearestHospital = hospitals.find(h => h.id === incident.nearestHospitalId) || hospitals[0];
  const assignedUnits = responders.filter(r => incident.assignedUnits.includes(r.id));

  // The 7 lifecycle stages
  const stages: { id: string; label: string; desc: string }[] = [
    { id: 'report', label: 'REPORT', desc: 'Distress call or sensor flagged' },
    { id: 'verify', label: 'VERIFY', desc: 'GPS & severity triaged' },
    { id: 'dispatch', label: 'DISPATCH', desc: 'Units scrambled' },
    { id: 'en_route', label: 'EN ROUTE', desc: 'Sirens & green corridor' },
    { id: 'on_scene', label: 'ON SCENE', desc: 'Triage & stabilization' },
    { id: 'hospital', label: 'HOSPITAL', desc: 'Trauma bay handover' },
    { id: 'resolved', label: 'RESOLVED', desc: 'Log closed & debrief' }
  ];

  // Determine active stage index
  const stageOrder = ['reported', 'verifying', 'dispatching', 'en_route', 'on_scene', 'transporting', 'resolved'];
  const currentStageIdx = Math.max(0, stageOrder.indexOf(incident.status));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#090f1d] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#0c1426] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/30 border border-red-500/50 text-red-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-mono tracking-wider">
                  INCIDENT #{incident.id} AUDIT &amp; INVESTIGATION
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {incident.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {incident.title}
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

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Key Metrics Latency Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-center font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                Detection → Dispatch
              </span>
              <div className="text-xl font-black text-cyan-400 mt-1">01m 22s</div>
              <span className="text-[10px] text-emerald-400">Optimal (-38s under target)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-center font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                Dispatch → On-Scene Arrival
              </span>
              <div className="text-xl font-black text-emerald-400 mt-1">04m 10s</div>
              <span className="text-[10px] text-emerald-400">Fast Urban Transit Corridor</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-center font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                Arrival → Full Resolution
              </span>
              <div className="text-xl font-black text-purple-400 mt-1">28m 30s</div>
              <span className="text-[10px] text-slate-400">ER Admission &amp; Triage Handover</span>
            </div>
          </div>

          {/* Visual 7-Stage Progression Stepper */}
          <div className="double-bezel-shell">
            <div className="double-bezel-core p-5 space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider block">
                OPERATIONAL STAGE PROGRESSION
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 pt-2">
                {stages.map((stg, i) => {
                  const isDone = i <= currentStageIdx;
                  const isCurrent = i === currentStageIdx;

                  return (
                    <div 
                      key={stg.id} 
                      className={`p-2.5 rounded-xl border text-center font-mono transition-all ${
                        isCurrent ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950' :
                        isDone ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' :
                        'bg-slate-900/60 border-white/5 text-slate-500'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-slate-400">0{i+1}</div>
                      <div className="text-xs font-black mt-0.5">{stg.label}</div>
                      <div className="text-[9px] mt-1 line-clamp-1">{stg.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Overview Grid: Location, Casualties, Responders, Hospital */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            
            {/* Location & Casualty Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold pb-2 border-b border-white/10">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>Location &amp; Incident Parameters</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div>Address: <b className="text-white">{incident.location.address}</b></div>
                <div>Coordinates: <b className="text-cyan-400">{incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}</b></div>
                <div>People Affected: <b className="text-red-400 font-bold">{incident.peopleAffected} individuals</b></div>
                <div>Source Channel: <b className="text-purple-400 uppercase">{incident.source.replace('_', ' ')}</b></div>
              </div>
            </div>

            {/* Hospital & Responders Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold pb-2 border-b border-white/10">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Medical Facility &amp; Assigned Units</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div>Hospital: <b className="text-white">{nearestHospital.name}</b></div>
                <div>Trauma ICU Status: <b className="text-emerald-400">{nearestHospital.erStatus} ({nearestHospital.icuBeds.available} free)</b></div>
                <div>Assigned Fleet: <b className="text-cyan-300">{incident.assignedUnits.join(', ') || 'None'}</b></div>
                <div>Resources Used: <b className="text-slate-200">{incident.resourcesRequired?.join(', ') || 'Standard Trauma Pack'}</b></div>
              </div>
            </div>

          </div>

          {/* Full Chronological Incident Event Log */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider block">
              CHRONOLOGICAL AUDIT TRAIL
            </span>

            <div className="space-y-3 border-l-2 border-white/20 pl-4 ml-2 font-mono text-xs">
              {incident.timeline.map((evt) => (
                <div key={evt.id} className="relative pb-1">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <div className="flex flex-wrap items-center justify-between text-slate-400 text-[11px] mb-0.5">
                    <span className="font-bold text-cyan-300">{evt.time}</span>
                    <span className="text-slate-500 bg-white/5 px-2 py-0.5 rounded">{evt.actor}</span>
                  </div>
                  <div className="font-bold text-white text-sm">{evt.title}</div>
                  <p className="text-slate-300 text-xs mt-0.5">{evt.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#0c1426] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold uppercase transition-colors"
          >
            Close Audit
          </button>
        </div>

      </div>
    </div>
  );
};

