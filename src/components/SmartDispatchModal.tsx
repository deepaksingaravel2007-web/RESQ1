import React from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Truck, 
  ShieldAlert, 
  Flame, 
  Clock, 
  Navigation, 
  CheckCircle, 
  Cpu, 
  AlertCircle 
} from 'lucide-react';
import { Incident, ResponderUnit } from '../types';
import { soundManager } from '../utils/audio';

interface SmartDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
  responders: ResponderUnit[];
  onAssignUnit: (incidentId: string, unitId: string) => void;
  onAssignAllRecommended: (incidentId: string, unitIds: string[]) => void;
}

export const SmartDispatchModal: React.FC<SmartDispatchModalProps> = ({
  isOpen,
  onClose,
  incident,
  responders,
  onAssignUnit,
  onAssignAllRecommended
}) => {
  if (!isOpen || !incident) return null;

  // AI Recommendation Logic: Filter available or closest responders and score them
  const recommendedUnits = [
    {
      unit: responders.find(r => r.id === 'AMB-07') || responders[0],
      role: 'Primary Medical Evac',
      score: 98,
      distanceKm: 2.4,
      etaMin: 6,
      reason: 'ALS Mobile ICU equipped. Zero en-route traffic on Nandanam corridor.',
      badge: 'TOP MEDICAL MATCH'
    },
    {
      unit: responders.find(r => r.id === 'FIRE-04') || responders[4],
      role: 'Heavy Suppression / Rescue',
      score: 94,
      distanceKm: 3.1,
      etaMin: 8,
      reason: '54m Turntable Ladder & Foam Tender standby at Teynampet.',
      badge: 'EQUIPMENT MATCH'
    },
    {
      unit: responders.find(r => r.id === 'POL-18') || responders[7],
      role: 'Perimeter & Traffic Clearing',
      score: 96,
      distanceKm: 1.8,
      etaMin: 5,
      reason: 'Closest mobile unit to Kathipara/Panagal sector. Rapid green corridor escort.',
      badge: 'FASTEST ARRIVAL'
    }
  ];

  const handleDispatchSingle = (unitId: string) => {
    soundManager.playDispatchSquelch();
    onAssignUnit(incident.id, unitId);
  };

  const handleDispatchAll = () => {
    soundManager.playEmergencyAlarm();
    const ids = recommendedUnits.map(r => r.unit.id);
    onAssignAllRecommended(incident.id, ids);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      
      {/* Container */}
      <div className="relative w-full max-w-2xl bg-[#090f1d] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c1426]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white uppercase tracking-wider">
                  INTELLIGENT DISPATCH RECOMMENDATION
                </h2>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  AI ENGINE v4.2
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                Target Incident: #{incident.id} • {incident.title.slice(0, 40)}...
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

        {/* Disclaimer Strip */}
        <div className="px-6 py-2.5 bg-amber-950/20 border-b border-amber-500/20 flex items-center gap-2 text-[11px] font-mono text-amber-200">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Simulated Multi-Factor Dispatch Model: Distance (35%) • Availability (25%) • Equipment (20%) • Traffic (20%)</span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>RECOMMENDED UNITS ({recommendedUnits.length})</span>
            <span className="text-emerald-400">All Units Telemetry Online</span>
          </div>

          <div className="space-y-3.5">
            {recommendedUnits.map((item, idx) => {
              const isAlreadyAssigned = incident.assignedUnits.includes(item.unit.id);
              
              return (
                <div 
                  key={idx} 
                  className={`double-bezel-shell transition-all ${
                    isAlreadyAssigned ? 'opacity-70 border-emerald-500/40' : 'hover:border-amber-500/50'
                  }`}
                >
                  <div className="double-bezel-core p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          {item.badge}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          Match: {item.score}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.unit.type === 'ambulance' ? <Truck className="w-4 h-4 text-emerald-400" /> :
                         item.unit.type === 'fire' ? <Flame className="w-4 h-4 text-red-400" /> :
                         <ShieldAlert className="w-4 h-4 text-yellow-400" />}
                        <span className="text-sm font-bold text-white font-mono">{item.unit.name}</span>
                        <span className="text-xs text-slate-400 font-mono">({item.unit.id})</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                        <span>Distance: <b className="text-slate-200">{item.distanceKm} km</b></span>
                        <span>•</span>
                        <span>ETA: <b className="text-emerald-400">{item.etaMin} min</b></span>
                        <span>•</span>
                        <span>Status: <b className="text-yellow-300">{item.unit.status.toUpperCase()}</b></span>
                      </div>

                      <p className="text-[11px] text-slate-400 italic">
                        {item.reason}
                      </p>
                    </div>

                    <div className="shrink-0 flex sm:flex-col items-center gap-2">
                      {isAlreadyAssigned ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>ASSIGNED</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDispatchSingle(item.unit.id)}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-red-900/40 transition-all active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>DISPATCH</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Dispatch All Action */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 font-semibold text-xs hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDispatchAll}
              className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-red-900/40 border border-red-400/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>DISPATCH ALL RECOMMENDED UNITS</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

