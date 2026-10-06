import React from 'react';
import { 
  Flame, 
  ArrowRight, 
  ShieldAlert, 
  Activity, 
  MapPin, 
  Truck, 
  Building2, 
  Boxes, 
  Radio, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Navigation,
  Compass,
  AlertTriangle,
  HeartPulse,
  Radar,
  Users,
  Play,
  KeyRound
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/mockData';
import { soundManager } from '../utils/audio';

interface LandingPageProps {
  lang: LanguageCode;
  onOpenReport: () => void;
  onOpenCommand: () => void;
  onOpenDemo: () => void;
  onOpenLogin?: () => void;
  activeCount: number;
  criticalCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onOpenReport,
  onOpenCommand,
  onOpenDemo,
  onOpenLogin,
  activeCount,
  criticalCount
}) => {
  const t = translations[lang] || translations.en;

  const handleReportClick = () => {
    soundManager.playEmergencyAlarm();
    onOpenReport();
  };

  const handleCommandClick = () => {
    soundManager.playPing();
    onOpenCommand();
  };

  const handleDemoClick = () => {
    soundManager.playDispatchSquelch();
    onOpenDemo();
  };

  return (
    <div className="relative min-h-screen bg-[#060a14] text-slate-100 overflow-hidden tactical-grid">
      
      {/* Ambient Gradient Glows (Red, Yellow, Green emergency colors) */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-red-950/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[350px] bg-yellow-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-950/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20">
        
        {/* Eyebrow Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-red-500/40 text-red-400 text-[11px] font-mono uppercase tracking-[0.2em] shadow-lg shadow-red-950/40">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>National Crisis-Tech Architecture • 112 Standard</span>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] uppercase">
            ONE PLATFORM. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-300 to-emerald-400">
              EVERY EMERGENCY.
            </span> <br />
            ONE COORDINATED RESPONSE.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 font-normal tracking-wide max-w-2xl mx-auto">
            {t.heroSubtitle} Connect emergency detection, location, responders, hospitals, resources, alerts and incident intelligence into one unified command platform.
          </p>
        </div>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          
          {/* Primary CTA: Report Emergency (Red) */}
          <button
            onClick={handleReportClick}
            className="group relative inline-flex items-center gap-4 px-7 py-4 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-base shadow-xl shadow-red-700/50 border border-red-400/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{t.reportEmergencyBtn}</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <Flame className="w-4 h-4 text-white" />
            </div>
          </button>

          {/* Secondary CTA: Open Command Center (Tactical Emerald Green) */}
          <button
            onClick={handleCommandClick}
            className="group relative inline-flex items-center gap-4 px-7 py-4 rounded-full bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-100 font-semibold text-base shadow-lg shadow-black/60 border border-emerald-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{t.commandCenterBtn}</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 text-emerald-300" />
            </div>
          </button>

          {/* Demo Mode Quick Launch (Tactical Warning Yellow/Amber) */}
          <button
            onClick={handleDemoClick}
            className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold text-sm transition-all active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-amber-300" />
            <span>{t.demoModeBtn}</span>
          </button>

          {/* Operator Login Button */}
          {onOpenLogin && (
            <button
              onClick={() => {
                soundManager.playPing();
                onOpenLogin();
              }}
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/15 font-semibold text-sm transition-all active:scale-[0.98] shadow-lg shadow-black/40"
            >
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Operator Login</span>
            </button>
          )}
        </div>

        {/* System Status Strip (Red, Green, Yellow) */}
        <div className="max-w-4xl mx-auto double-bezel-shell mb-16 border-emerald-500/30">
          <div className="double-bezel-core px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white uppercase tracking-wider">SYSTEM STATUS</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Emergency Network Operational</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>24/7 Multi-Agency Monitoring</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span>Instant SOS Dispatch Ready</span>
            </div>
          </div>
        </div>

        {/* Hero Visual: Interactive Live-Style Emergency Map Preview */}
        <div className="double-bezel-shell max-w-6xl mx-auto shadow-2xl">
          <div className="double-bezel-core p-4 sm:p-6 relative overflow-hidden bg-[#0a101f]">
            
            {/* Top Map HUD Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10 text-xs">
              <div className="flex items-center gap-3 font-mono">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/60 border border-red-800/60 text-red-400 font-bold">
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                  <span>ACTIVE SECTOR: CHENNAI METRO (ZONE-04)</span>
                </div>
                <span className="text-slate-400 hidden sm:inline">24 INCIDENTS LOGGED • 47 UNITS ACTIVE</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">● 18 Ambulances Free</span>
                <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/40">● 12 Police PCR On Patrol</span>
                <span className="px-2 py-0.5 rounded bg-orange-950/80 text-orange-400 border border-orange-800/40">● 8 Fire Engines Standby</span>
              </div>
            </div>

            {/* Tactical Map Mock Grid with Animated Radar Points */}
            <div className="relative h-[380px] sm:h-[460px] rounded-2xl bg-[#070d1a] border border-white/10 overflow-hidden tactical-dots flex items-center justify-center">
              
              {/* Radar Sweeping Beam */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-[500px] h-[500px] rounded-full border border-blue-500/40 relative">
                  <div className="w-[320px] h-[320px] rounded-full border border-blue-500/30 absolute inset-0 m-auto" />
                  <div className="w-[160px] h-[160px] rounded-full border border-blue-500/20 absolute inset-0 m-auto" />
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-beacon" />
                </div>
              </div>

              {/* Sample Incident Pin 1: Anna Salai Critical */}
              <div className="absolute top-[32%] left-[48%] group cursor-pointer" onClick={onOpenCommand}>
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-12 h-12 rounded-full bg-red-500/30 animate-ping" />
                  <span className="absolute w-6 h-6 rounded-full bg-red-600/60 animate-pulse" />
                  <div className="relative w-8 h-8 rounded-full bg-red-600 border-2 border-white flex items-center justify-center shadow-lg shadow-red-950">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                </div>
                {/* Micro tooltip pill */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-red-500/40 text-slate-100 text-[10px] px-2.5 py-1 rounded-lg whitespace-nowrap shadow-xl z-20 font-mono">
                  <span className="text-red-400 font-bold">CRITICAL: #RX-20481</span> • 3 injured • 4m ETA
                </div>
              </div>

              {/* Sample Incident Pin 2: Velachery Flood */}
              <div className="absolute top-[68%] left-[62%] group cursor-pointer" onClick={onOpenCommand}>
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-orange-500/30 animate-ping" />
                  <div className="relative w-7 h-7 rounded-full bg-orange-600 border-2 border-white flex items-center justify-center shadow-lg">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-orange-500/40 text-slate-100 text-[10px] px-2 py-0.5 rounded-lg whitespace-nowrap shadow-xl z-20 font-mono">
                  <span className="text-orange-400 font-bold">HIGH: #RX-20484</span> • Flood Ingress
                </div>
              </div>

              {/* Active Ambulance Marker */}
              <div className="absolute top-[38%] left-[38%] flex items-center gap-1.5 bg-blue-900/80 border border-blue-400/40 px-2 py-1 rounded-full shadow-lg text-[10px] font-mono text-blue-200">
                <Truck className="w-3 h-3 text-cyan-400 animate-bounce" />
                <span>AMB-04 • 54 km/h</span>
              </div>

              {/* Active Police Unit Marker */}
              <div className="absolute top-[26%] left-[58%] flex items-center gap-1.5 bg-indigo-900/80 border border-indigo-400/40 px-2 py-1 rounded-full shadow-lg text-[10px] font-mono text-indigo-200">
                <ShieldAlert className="w-3 h-3 text-indigo-400" />
                <span>POL-12 • Green Corridor</span>
              </div>

              {/* Hospital Node Marker */}
              <div className="absolute top-[20%] left-[32%] flex items-center gap-1.5 bg-slate-900/90 border border-emerald-500/40 px-2.5 py-1 rounded-xl shadow-lg text-[10px] font-mono text-emerald-300">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Apollo Greams • ICU 82%</span>
              </div>

              {/* Safe Zone Sector */}
              <div className="absolute bottom-[14%] left-[16%] flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-xl shadow-lg text-[10px] font-mono text-emerald-300">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Safe Evacuation Zone A-3</span>
              </div>

              {/* Simulated Navigation Route Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M 390 180 Q 450 160 480 155" 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="3" 
                  strokeDasharray="6 4" 
                  className="animate-pulse"
                />
              </svg>

              {/* Bottom Quick Action Overlay */}
              <div className="absolute bottom-4 right-4 z-20">
                <button
                  onClick={onOpenCommand}
                  className="px-4 py-2 rounded-xl bg-slate-900/95 border border-white/20 text-xs font-semibold text-white shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  <Compass className="w-3.5 h-3.5 text-red-400" />
                  <span>Launch Live Fullscreen Map</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section (01 Detect -> 06 Analyze) */}
      <section className="relative py-24 border-t border-white/5 bg-[#050812]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-red-400 bg-red-950/50 px-3 py-1 rounded-full border border-red-800/40">
              MISSION LIFECYCLE
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              HOW RESQ OPERATES
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              A synchronized 6-stage emergency protocol connecting citizens, field responders, and hospital ICUs in under 120 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Detect',
                desc: 'Citizen SOS apps, 112 hotline ingestion, IoT smoke/seismic sensors, and AI computer-vision traffic cameras register distress signals instantaneously.',
                icon: Radar,
                color: 'text-red-400',
                border: 'border-red-500/20'
              },
              {
                step: '02',
                title: 'Locate',
                desc: 'Automated reverse-geocoding, dual-band GNSS positioning, and network trilateration pin the incident coordinate with 5-meter urban accuracy.',
                icon: MapPin,
                color: 'text-orange-400',
                border: 'border-orange-500/20'
              },
              {
                step: '03',
                title: 'Dispatch',
                desc: 'Intelligent multi-agency dispatch algorithms calculate distance, traffic congestion, and equipment readiness to scramble the closest optimal ALS ambulance, fire tender, or patrol car.',
                icon: Truck,
                color: 'text-amber-400',
                border: 'border-amber-500/20'
              },
              {
                step: '04',
                title: 'Coordinate',
                desc: 'Simultaneous green corridors are signaled to traffic signals, and nearby trauma centers reserve critical ICU beds and O-negative blood reserves prior to victim arrival.',
                icon: Building2,
                color: 'text-emerald-400',
                border: 'border-emerald-500/20'
              },
              {
                step: '05',
                title: 'Resolve',
                desc: 'First responders stream live vitals and telemetry back to the EOC Command Center, stabilizing victims on-scene and executing clinical triage transfers.',
                icon: CheckCircle2,
                color: 'text-emerald-400',
                border: 'border-emerald-500/20'
              },
              {
                step: '06',
                title: 'Analyze',
                desc: 'Post-incident auditing automatically quantifies detection-to-arrival latency, resource consumption, and geographic vulnerability hotspots.',
                icon: BarChart3,
                color: 'text-yellow-400',
                border: 'border-yellow-500/20'
              }
            ].map((item, idx) => (
              <div key={idx} className="double-bezel-shell hover:border-white/20 transition-all group">
                <div className="double-bezel-core p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-2xl font-black text-slate-600 group-hover:text-slate-300 transition-colors">
                        {item.step}
                      </span>
                      <div className={`p-2.5 rounded-xl bg-slate-900 border ${item.border}`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>STATUS: RECEPTIVE</span>
                    <span className="text-emerald-400">LATENCY &lt; 200MS</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Asymmetric Bento Grid */}
      <section className="relative py-24 bg-[#060a14] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 bg-amber-950/50 px-3 py-1 rounded-full border border-amber-800/40">
              TACTICAL CAPABILITIES
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ENGINEERED FOR HIGH-PRESSURE EMERGENCIES
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Inspired by India 112, FEMA EOC standards, and Google Crisis Response geospatial mapping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {/* Bento Card 1: Intelligent Emergency Detection (Col span 2) - Red Critical */}
            <div className="md:col-span-2 double-bezel-shell border-red-500/30">
              <div className="double-bezel-core p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-red-400 uppercase tracking-widest font-bold">
                      TRIAGE ENGINE
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Intelligent Emergency Detection</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Automated multi-channel ingestion triages emergencies based on casualty severity, caller vocal distress analysis, and structural sensor inputs to eliminate critical dispatch delays.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-white/5 font-mono text-xs text-slate-300 flex items-center justify-between">
                  <span>AI Triage Accuracy: 99.4%</span>
                  <span className="text-emerald-400 font-bold">● ISO 22301 Ready</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Hospital Surge Coordination - Emerald Green Safe */}
            <div className="double-bezel-shell border-emerald-500/30">
              <div className="double-bezel-core p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 w-fit mb-4">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Hospital Coordination</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Live ICU bed counts, ventilator availability, and blood bank reserves synchronized across public and private hospitals.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-emerald-300">
                  Apollo • RGGGH • MIOT Synced
                </div>
              </div>
            </div>

            {/* Bento Card 3: NDMA SACHET Disaster Alerts - Amber Yellow Warning */}
            <div className="double-bezel-shell border-amber-500/30">
              <div className="double-bezel-core p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-400 w-fit mb-4">
                    <Radio className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Emergency Alerts</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    CAP-compliant broadcast system targeting citizens by geographic polygons, SMS, cell-broadcast, and multilingual audio.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-amber-300">
                  Targeting Radius &amp; Sector
                </div>
              </div>
            </div>

            {/* Bento Card 4: Resource Tracking & Logistics - Yellow/Amber */}
            <div className="double-bezel-shell border-yellow-500/30">
              <div className="double-bezel-core p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="p-2.5 rounded-xl bg-yellow-950/60 border border-yellow-500/40 text-yellow-400 w-fit mb-4">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Resource Logistics</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Track oxygen cylinders, NDRF rescue rafts, Hazmat neutralizing foam, and generators with low-stock automatic triggers.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-yellow-300">
                  Stock Alerts &amp; Deployment
                </div>
              </div>
            </div>

            {/* Bento Card 5: Real-Time Incident Analytics (Col span 2) */}
            <div className="md:col-span-2 double-bezel-shell">
              <div className="double-bezel-core p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                      DATA INTELLIGENCE
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Incident Analytics &amp; Vulnerability Heatmaps</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Audits response times across districts, identifies peak emergency hours, and plots recurring incident clusters for preventative municipal planning.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/90 border border-white/5 text-center font-mono">
                  <div>
                    <div className="text-xs text-slate-400">Mean Dispatch</div>
                    <div className="text-sm font-bold text-white">01m 24s</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Arrival ETA</div>
                    <div className="text-sm font-bold text-emerald-400">06m 12s</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Resolution Rate</div>
                    <div className="text-sm font-bold text-blue-400">96.8%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 6: Multi-Agency Interoperability */}
            <div className="double-bezel-shell">
              <div className="double-bezel-core p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 w-fit mb-4">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">6-Role Access</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Tailored operational views for Citizens, Paramedics, Doctors, Fire Chiefs, Police Patrols, and Command Officers.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-cyan-300">
                  Role-Based Security
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom Call To Action Section */}
      <section className="relative py-20 border-t border-white/10 bg-gradient-to-b from-[#060a14] to-[#0a1226]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            READY FOR LIVE EMERGENCY COORDINATION?
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto mb-8">
            Experience the full command center workflow or simulate an end-to-end multi-agency rescue scenario.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleCommandClick}
              className="px-8 py-4 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-red-700/30 transition-all hover:scale-105"
            >
              Enter Live Command Center
            </button>
            <button
              onClick={handleDemoClick}
              className="px-8 py-4 rounded-full bg-slate-900 border border-amber-500/40 hover:bg-slate-800 text-amber-300 font-semibold text-sm transition-all"
            >
              Simulate 60s Demo Scenario
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

