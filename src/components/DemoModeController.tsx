import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  X, 
  CheckCircle2, 
  Flame, 
  Truck, 
  ShieldAlert, 
  Building2, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { Incident, ResponderUnit, Hospital } from '../types';
import { soundManager } from '../utils/audio';

interface DemoModeControllerProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectDemoIncident: (incident: Incident) => void;
  onUpdateDemoIncident: (updated: Partial<Incident>) => void;
  onSelectIncident: (incident: Incident) => void;
}

export const DemoModeController: React.FC<DemoModeControllerProps> = ({
  isOpen,
  onClose,
  onInjectDemoIncident,
  onUpdateDemoIncident,
  onSelectIncident
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [timerSeconds, setTimerSeconds] = useState<number>(6);

  const demoIncidentId = 'RX-DEMO-99';

  const demoSteps = [
    {
      step: 1,
      title: '1. Incident Detected by Vision AI',
      desc: 'CCTV Camera #88 at Kathipara Flyover registers 3-car pileup with structural rollover impact.',
      action: 'Flagged on Switchboard'
    },
    {
      step: 2,
      title: '2. Location Pinned on Tactical Map',
      desc: 'Dual-band GPS coordinates geocoded: 13.0102° N, 80.2155° E (Kathipara Cloverleaf). Pulsing red marker active.',
      action: 'Pulsing Marker Activated'
    },
    {
      step: 3,
      title: '3. Severity Triaged to CRITICAL',
      desc: 'AI Triage Engine calculates 4 trapped casualties, fuel vapor hazard, and rapid transit requirement.',
      action: 'Multi-Agency Alert Triggered'
    },
    {
      step: 4,
      title: '4. Nearest Ambulance Dispatched',
      desc: 'AMB-07 (Advanced Cardiac Mobile ICU, 2.4 km away) scrambled with priority sirens.',
      action: 'AMB-07 En Route'
    },
    {
      step: 5,
      title: '5. Highway Police Patrol Assigned',
      desc: 'POL-18 assigned to open green emergency transit corridor and clear rubbernecking traffic.',
      action: 'Green Corridor Cleared'
    },
    {
      step: 6,
      title: '6. Hospital Trauma ICU Alerted',
      desc: 'MIOT International receives telemetry. Trauma Bay 1 reserved with 2 units O- blood placed on standby.',
      action: 'Trauma Bay 1 Reserved'
    },
    {
      step: 7,
      title: '7. Responders Transit with Live ETA',
      desc: 'Speed: 62 km/h. Distance drops from 2.4 km to 0.4 km. ETA reduces to 2 minutes.',
      action: 'Telemetry Streaming'
    },
    {
      step: 8,
      title: '8. Paramedics On Scene & Stabilizing',
      desc: 'Paramedic crew arrives on scene. Jaws of life deployed, 3 casualties extracted and vitals stabilized.',
      action: 'Casualties Extracted'
    },
    {
      step: 9,
      title: '9. Hospital Handover Completed',
      desc: 'Patients safely received at MIOT Trauma ER. Vitals synchronized with state health grid.',
      action: 'Clinical Transfer Logged'
    },
    {
      step: 10,
      title: '10. Incident Marked RESOLVED',
      desc: 'Wreckage cleared, highway lanes reopened. Post-incident response audit finalized in 06m 12s.',
      action: 'Mission Complete'
    }
  ];

  // Execute Step Effects
  const executeStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: {
        soundManager.playEmergencyAlarm();
        const initialDemoInc: Incident = {
          id: demoIncidentId,
          type: 'accident',
          title: 'DEMO: Major Multi-Vehicle Pileup (Kathipara Flyover)',
          description: 'High-speed 3-vehicle collision with overturned sedan. 4 casualties trapped. Fuel leak hazard.',
          severity: 'critical',
          status: 'reported',
          location: {
            lat: 13.0102,
            lng: 80.2155,
            address: 'Kathipara Junction Flyover Cloverleaf, Guindy',
            city: 'Chennai',
            district: 'Chennai Central'
          },
          peopleAffected: 4,
          reportedAt: new Date().toLocaleTimeString('en-IN', { hour12: false }),
          timestamp: Date.now(),
          assignedUnits: [],
          nearestHospitalId: 'HOSP-03',
          etaMinutes: 8,
          source: 'cctv_ai',
          timeline: [
            {
              id: 'dtl-1',
              time: 'Just now',
              timestamp: Date.now(),
              title: 'CCTV Vision AI Flagged',
              description: 'Impact optical shock detected.',
              actor: 'Kathipara Vision AI',
              type: 'report'
            }
          ]
        };
        onInjectDemoIncident(initialDemoInc);
        onSelectIncident(initialDemoInc);
        break;
      }
      case 2: {
        soundManager.playPing();
        onUpdateDemoIncident({ status: 'verifying' });
        break;
      }
      case 3: {
        soundManager.playEmergencyAlarm();
        onUpdateDemoIncident({ severity: 'critical', status: 'dispatching' });
        break;
      }
      case 4: {
        soundManager.playDispatchSquelch();
        onUpdateDemoIncident({ 
          assignedUnits: ['AMB-07'],
          status: 'en_route',
          etaMinutes: 6 
        });
        break;
      }
      case 5: {
        soundManager.playDispatchSquelch();
        onUpdateDemoIncident({ 
          assignedUnits: ['AMB-07', 'POL-18'],
          etaMinutes: 4 
        });
        break;
      }
      case 6: {
        soundManager.playPing();
        onUpdateDemoIncident({ nearestHospitalId: 'HOSP-03' });
        break;
      }
      case 7: {
        soundManager.playPing();
        onUpdateDemoIncident({ etaMinutes: 2 });
        break;
      }
      case 8: {
        soundManager.playDispatchSquelch();
        onUpdateDemoIncident({ status: 'on_scene', etaMinutes: 0 });
        break;
      }
      case 9: {
        soundManager.playPing();
        onUpdateDemoIncident({ status: 'transporting' });
        break;
      }
      case 10: {
        soundManager.playSuccess();
        onUpdateDemoIncident({ status: 'resolved' });
        break;
      }
    }
  };

  // Automated tick
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setCurrentStep((curr) => {
            if (curr >= 10) {
              setIsPlaying(false);
              return 10;
            }
            const next = curr + 1;
            executeStep(next);
            return next;
          });
          return 7;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, currentStep]);

  // Initial trigger when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsPlaying(true);
      setTimerSeconds(6);
      executeStep(1);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < 10) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setTimerSeconds(7);
      executeStep(next);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setIsPlaying(true);
    setTimerSeconds(6);
    executeStep(1);
  };

  if (!isOpen) return null;

  const currentObj = demoSteps[currentStep - 1];

  return (
    <div className="fixed top-18 right-4 sm:right-8 z-50 w-full max-w-md bg-[#090f1e]/95 backdrop-blur-2xl border-2 border-amber-500/50 rounded-3xl p-5 shadow-2xl animate-fade-in font-mono text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <div className="text-white font-black text-sm tracking-wide">
              SIMULATED EMERGENCY SCENARIO
            </div>
            <div className="text-[10px] text-amber-400 font-bold">
              MAJOR ROAD ACCIDENT — CHENNAI (STEP {currentStep}/10)
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="my-3">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>Simulation Progress</span>
          <span className="text-amber-400 font-bold">{currentStep * 10}% Complete</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
            style={{ width: `${currentStep * 10}%` }}
          />
        </div>
      </div>

      {/* Step Detail Card */}
      <div className="p-3.5 rounded-2xl bg-[#0c1426] border border-white/10 space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-sm">
            {currentObj.title}
          </span>
          {isPlaying && (
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">
              Next in {timerSeconds}s
            </span>
          )}
        </div>
        <p className="text-slate-300 text-xs font-sans leading-relaxed">
          {currentObj.desc}
        </p>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">TRIGGER:</span>
          <span className="text-emerald-400 font-bold">● {currentObj.action}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-colors ${
            isPlaying 
              ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 hover:bg-amber-900/80' 
              : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'Pause' : 'Resume'}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentStep >= 10}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-white/10 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span>Next Step</span>
        </button>

        <button
          onClick={handleRestart}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10"
          title="Restart Scenario"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

