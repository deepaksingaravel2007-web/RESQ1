import React, { useState } from 'react';
import { 
  Building2, 
  HeartPulse, 
  Bed, 
  Wind, 
  Droplet, 
  PhoneCall, 
  Send, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Navigation,
  Activity,
  Plus
} from 'lucide-react';
import { Hospital } from '../types';
import { soundManager } from '../utils/audio';

interface HospitalCoordinationProps {
  hospitals: Hospital[];
  onReserveBed: (hospitalId: string, bedType: 'icu' | 'general') => void;
}

export const HospitalCoordination: React.FC<HospitalCoordinationProps> = ({
  hospitals,
  onReserveBed
}) => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState<boolean>(false);
  const [requestedPatientName, setRequestedPatientName] = useState<string>('');
  const [requestedBedType, setRequestedBedType] = useState<'icu' | 'general'>('icu');

  const handleRequestBed = (h: Hospital) => {
    setSelectedHospital(h);
    setRequestModalOpen(true);
    soundManager.playPing();
  };

  const handleConfirmBedReservation = () => {
    if (!selectedHospital) return;
    soundManager.playSuccess();
    onReserveBed(selectedHospital.id, requestedBedType);
    setRequestModalOpen(false);
    alert(`Success: 1 ${requestedBedType.toUpperCase()} Bed reserved at ${selectedHospital.name} for incoming trauma patient.`);
  };

  const handleContactHospital = (h: Hospital) => {
    soundManager.playDispatchSquelch();
    alert(`Connecting ER Triage Switchboard at ${h.name} (${h.contactPhone})...`);
  };

  const totalIcuAvailable = hospitals.reduce((acc, h) => acc + h.icuBeds.available, 0);
  const totalGeneralAvailable = hospitals.reduce((acc, h) => acc + h.generalBeds.available, 0);
  const totalVentilatorsAvailable = hospitals.reduce((acc, h) => acc + h.ventilators.available, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Header & Aggregate Capacity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            HOSPITAL EMERGENCY COORDINATION
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            REAL-TIME CLINICAL SURGE • TRAUMA BED RESERVATION • BLOOD BANK RESERVES
          </p>
        </div>

        {/* Aggregate Hospital Stats */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300">
            Hospitals Synced: <b className="text-white">{hospitals.length}</b>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
            ICU Beds Free: <b>{totalIcuAvailable}</b>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-400">
            Ventilators: <b>{totalVentilatorsAvailable}</b>
          </div>
        </div>
      </div>

      {/* Grid of Hospital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hospitals.map((hosp) => {
          const icuPercent = Math.round(((hosp.icuBeds.total - hosp.icuBeds.available) / hosp.icuBeds.total) * 100);
          const generalPercent = Math.round(((hosp.generalBeds.total - hosp.generalBeds.available) / hosp.generalBeds.total) * 100);
          const ventPercent = Math.round(((hosp.ventilators.total - hosp.ventilators.available) / hosp.ventilators.total) * 100);

          return (
            <div key={hosp.id} className="double-bezel-shell hover:border-white/20 transition-all">
              <div className="double-bezel-core p-5 space-y-4">
                
                {/* Header: Name, Specialty, ER Status */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      hosp.erStatus === 'Normal' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      hosp.erStatus === 'High Volume' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                    }`}>
                      {hosp.erStatus}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white leading-tight">{hosp.name}</h3>
                  <div className="text-[11px] font-mono text-cyan-400">{hosp.type}</div>
                  <div className="text-xs text-slate-400 font-mono truncate">📍 {hosp.location.address}</div>
                </div>

                {/* Distance and ETA */}
                <div className="flex items-center justify-between text-xs font-mono p-2 rounded-xl bg-slate-900/90 border border-white/5">
                  <span className="text-slate-300">Transit Distance: <b className="text-white">{hosp.distanceKm} km</b></span>
                  <span className="text-emerald-400 font-bold">ETA: ~{hosp.etaMinutes} min</span>
                </div>

                {/* Visual Capacity Bars */}
                <div className="space-y-2.5 font-mono text-xs">
                  
                  {/* ICU Capacity Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <HeartPulse className="w-3 h-3 text-red-400" />
                        ICU Beds ({hosp.icuBeds.available} Available)
                      </span>
                      <span className="font-bold text-white">{icuPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          icuPercent > 85 ? 'bg-red-500' : icuPercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${icuPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* General Beds Capacity Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Bed className="w-3 h-3 text-blue-400" />
                        General Ward ({hosp.generalBeds.available} Free)
                      </span>
                      <span className="font-bold text-white">{generalPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-blue-500 transition-all duration-500" 
                        style={{ width: `${generalPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Ventilators Capacity Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Wind className="w-3 h-3 text-cyan-400" />
                        Ventilators ({hosp.ventilators.available} Free)
                      </span>
                      <span className="font-bold text-white">{ventPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-cyan-500 transition-all duration-500" 
                        style={{ width: `${ventPercent}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Blood Availability Matrix */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    BLOOD BANK RESERVES
                  </span>
                  <div className="grid grid-cols-6 gap-1 text-center font-mono">
                    {Object.entries(hosp.bloodAvailability).map(([grp, level]) => (
                      <div key={grp} className="p-1 rounded bg-slate-900 border border-white/5">
                        <div className="text-[10px] font-bold text-white">{grp}</div>
                        <div className={`text-[8px] uppercase font-semibold ${
                          level === 'Critical' ? 'text-red-400' :
                          level === 'Low' ? 'text-amber-400' :
                          level === 'Adequate' ? 'text-blue-300' : 'text-emerald-400'
                        }`}>
                          {level.slice(0, 3)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleRequestBed(hosp)}
                    className="py-2 px-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-[11px] font-bold font-mono text-center transition-colors"
                  >
                    Request Bed
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playDispatchSquelch();
                      alert(`Transit corridor initialized towards ${hosp.name}.`);
                    }}
                    className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-[11px] font-bold font-mono text-center transition-colors"
                  >
                    Send Patient
                  </button>
                  <button
                    onClick={() => handleContactHospital(hosp)}
                    className="py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-[11px] font-mono flex items-center justify-center transition-colors"
                    title="Direct Phone Line"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Bed Reservation Modal */}
      {requestModalOpen && selectedHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#090f1d] border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-mono">
              RESERVE EMERGENCY BED • {selectedHospital.name.split(',')[0]}
            </h3>
            
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Bed Classification:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRequestedBedType('icu')}
                    className={`py-2 rounded-xl border text-center font-bold ${
                      requestedBedType === 'icu' ? 'bg-red-600 text-white border-red-400' : 'bg-slate-900 text-slate-400 border-white/10'
                    }`}
                  >
                    Trauma ICU Bed ({selectedHospital.icuBeds.available} free)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestedBedType('general')}
                    className={`py-2 rounded-xl border text-center font-bold ${
                      requestedBedType === 'general' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900 text-slate-400 border-white/10'
                    }`}
                  >
                    General Emergency Bed
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Patient Identifier / Name:</label>
                <input
                  type="text"
                  value={requestedPatientName}
                  onChange={(e) => setRequestedPatientName(e.target.value)}
                  placeholder="E.g. Casualty #1 (Severe Head Trauma)"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBedReservation}
                className="flex-[2] py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono uppercase tracking-wider"
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

