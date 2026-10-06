import React from 'react';
import { 
  X, 
  Flame, 
  Send, 
  Eye, 
  MapPin, 
  Truck, 
  Clock, 
  Users, 
  AlertTriangle 
} from 'lucide-react';
import { Incident } from '../types';
import { soundManager } from '../utils/audio';

interface CriticalAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
  onDispatchNow: (incident: Incident) => void;
  onViewIncident: (incident: Incident) => void;
}

export const CriticalAlertModal: React.FC<CriticalAlertModalProps> = ({
  isOpen,
  onClose,
  incident,
  onDispatchNow,
  onViewIncident
}) => {
  if (!isOpen || !incident) return null;

  const handleDispatch = () => {
    soundManager.playDispatchSquelch();
    onDispatchNow(incident);
    onClose();
  };

  const handleView = () => {
    soundManager.playPing();
    onViewIncident(incident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#090f1d] border-2 border-red-500/80 rounded-3xl p-6 shadow-2xl critical-glow overflow-hidden">
        
        {/* Animated Top Pulse Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 animate-pulse" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-900/50">
            <Flame className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white ring-2 ring-red-600 animate-ping" />
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-red-400 flex items-center gap-1.5">
              <span>PRIORITY RED FLASH</span>
              <span>•</span>
              <span>INCIDENT #{incident.id}</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              CRITICAL EMERGENCY IN PROGRESS
            </h2>
          </div>
        </div>

        {/* Main Details Card */}
        <div className="p-4 rounded-2xl bg-[#0c1426] border border-white/10 space-y-3 font-mono text-xs mb-6">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Emergency Type:</span>
            <span className="text-white font-bold uppercase">{incident.type}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Location:</span>
            <span className="text-white font-bold truncate max-w-[240px] text-right">
              {incident.location.address}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Casualties Affected:</span>
            <span className="text-red-400 font-bold">{incident.peopleAffected} persons</span>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Nearest Available Ambulance:</span>
            <span className="text-cyan-400 font-bold">AMB-07 (2.4 km)</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-slate-400">Estimated Transit ETA:</span>
            <span className="text-emerald-400 font-black text-sm">06 MINUTES</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDispatch}
            className="py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs font-mono uppercase tracking-wider shadow-xl shadow-red-700/50 border border-red-400/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            <span>DISPATCH NOW</span>
          </button>

          <button
            onClick={handleView}
            className="py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs font-mono uppercase tracking-wider border border-white/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Eye className="w-4 h-4" />
            <span>VIEW INCIDENT</span>
          </button>
        </div>

      </div>
    </div>
  );
};

