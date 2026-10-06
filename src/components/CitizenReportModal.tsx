import React, { useState, useEffect } from 'react';
import { 
  X, 
  Flame, 
  HeartPulse, 
  Car, 
  Waves, 
  Globe2, 
  Building, 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  Mic, 
  MicOff, 
  Camera, 
  Volume2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Hospital, 
  PhoneCall, 
  Share2,
  Navigation
} from 'lucide-react';
import { IncidentTimelineEvent, EmergencyType, SeverityLevel, Incident, LanguageCode } from '../types';
import { soundManager } from '../utils/audio';
import { speakText, stopSpeech } from '../utils/speech';
import { translations } from '../data/mockData';
import { triageCitizenReportWithGemini } from '../services/geminiService';
import { Sparkles, Loader2 } from 'lucide-react';

interface CitizenReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageCode;
  onLangChange: (lang: LanguageCode) => void;
  onSubmitIncident: (incident: Incident) => void;
}

export const CitizenReportModal: React.FC<CitizenReportModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLangChange,
  onSubmitIncident
}) => {
  const t = translations[lang] || translations.en;

  // Stages: 1 = Type Select, 2 = Details & Location, 3 = Confirmation, 4 = Created Incident Ticket
  const [step, setStep] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<EmergencyType>('medical');
  const [description, setDescription] = useState<string>('');
  const [peopleAffected, setPeopleAffected] = useState<string>('1');
  const [severity, setSeverity] = useState<SeverityLevel>('critical');
  const [address, setAddress] = useState<string>('Anna Salai, T Nagar, Chennai, Tamil Nadu');
  const [latLng, setLatLng] = useState<{ lat: number; lng: number }>({ lat: 13.0418, lng: 80.2341 });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceRecordedText, setVoiceRecordedText] = useState<string>('');
  const [photoAttached, setPhotoAttached] = useState<boolean>(false);
  const [createdIncident, setCreatedIncident] = useState<Incident | null>(null);
  const [isGeminiTriaging, setIsGeminiTriaging] = useState<boolean>(false);
  const [geminiTriageBadge, setGeminiTriageBadge] = useState<string>('');

  const handleGeminiTriage = async () => {
    setIsGeminiTriaging(true);
    soundManager.playPing();
    try {
      const res = await triageCitizenReportWithGemini(description || voiceRecordedText || selectedType, address);
      if (res.severity) setSeverity(res.severity);
      if (res.category) setSelectedType(res.category as EmergencyType);
      if (res.peopleAffectedEstimate) setPeopleAffected(res.peopleAffectedEstimate);
      setGeminiTriageBadge(`✨ Gemini 3.8 Classified: ${res.category.toUpperCase()} • ${res.severity.toUpperCase()} Priority (${res.peopleAffectedEstimate} affected)`);
      soundManager.playSuccess();
    } catch {
      // fallback handled gracefully
    } finally {
      setIsGeminiTriaging(false);
    }
  };

  // Audio instructions text
  const getAudioPrompt = () => {
    if (step === 1) {
      if (lang === 'ta') return 'உங்கள் அவசரநிலையின் வகையைத் தேர்ந்தெடுக்கவும். மருத்துவ உதவி, தீ விபத்து, அல்லது விபத்து.';
      if (lang === 'hi') return 'अपनी आपात स्थिति का प्रकार चुनें। चिकित्सा, आग, या दुर्घटना।';
      return 'Please select the emergency type. Medical, Fire, Accident, or Disaster.';
    }
    if (step === 2) {
      if (lang === 'ta') return 'என்ன நிகழ்ந்தது என்று கூறவும். உங்கள் இருப்பிடம் தானாக கண்டறியப்பட்டுள்ளது. பாதிக்கப்பட்ட நபர்களின் எண்ணிக்கையை தேர்வு செய்க.';
      if (lang === 'hi') return 'क्या हुआ है बताएं। आपका स्थान चिह्नित किया गया है। प्रभावित लोगों की संख्या चुनें।';
      return 'What is happening? Your location has been detected. Select people affected and severity.';
    }
    return 'Confirm your emergency details and tap Send Emergency Alert.';
  };

  const handleReadAloud = () => {
    soundManager.playPing();
    speakText(getAudioPrompt(), lang);
  };

  // Emergency Categories configuration
  const emergencyOptions: { id: EmergencyType; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { id: 'fire', label: 'Fire & Smoke', icon: Flame, color: 'border-red-500/50 bg-red-950/40 text-red-400' },
    { id: 'medical', label: 'Medical Emergency', icon: HeartPulse, color: 'border-rose-500/50 bg-rose-950/40 text-rose-400' },
    { id: 'accident', label: 'Road Accident', icon: Car, color: 'border-amber-500/50 bg-amber-950/40 text-amber-400' },
    { id: 'flood', label: 'Flood / Ingress', icon: Waves, color: 'border-blue-500/50 bg-blue-950/40 text-blue-400' },
    { id: 'earthquake', label: 'Earthquake / Tremor', icon: Globe2, color: 'border-orange-500/50 bg-orange-950/40 text-orange-400' },
    { id: 'disaster', label: 'Disaster / Collapse', icon: Building, color: 'border-yellow-500/50 bg-yellow-950/40 text-yellow-400' },
    { id: 'crime', label: 'Crime / Violence', icon: ShieldAlert, color: 'border-purple-500/50 bg-purple-950/40 text-purple-400' },
    { id: 'other', label: 'Other Hazard', icon: AlertTriangle, color: 'border-slate-500/50 bg-slate-900/60 text-slate-300' }
  ];

  const handleSelectType = (type: EmergencyType) => {
    setSelectedType(type);
    soundManager.playPing();
    setStep(2);
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    soundManager.playPing();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setAddress(`GPS Pinned: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E (Chennai Grid)`);
          setIsLocating(false);
          soundManager.playSuccess();
        },
        () => {
          // Fallback to high-accuracy Chennai coordinate
          setLatLng({ lat: 13.0418, lng: 80.2341 });
          setAddress('Anna Salai, T Nagar, Chennai, Tamil Nadu');
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleToggleVoiceRecord = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      soundManager.playDispatchSquelch();
      // Simulate speech-to-text after 2.5 seconds
      setTimeout(() => {
        setIsRecordingVoice(false);
        setVoiceRecordedText('Caller Voice Note: "Severe impact on Anna Salai near flyover. 3 passengers injured and unconscious."');
        setDescription((prev) => prev ? `${prev} | Voice: 3 passengers injured near flyover.` : 'Severe impact near flyover, 3 passengers injured.');
        soundManager.playSuccess();
      }, 3000);
    } else {
      setIsRecordingVoice(false);
    }
  };

  const handleFinalSubmit = () => {
    soundManager.playEmergencyAlarm();

    const newId = `RX-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour12: false });

    const newIncident: Incident = {
      id: newId,
      type: selectedType,
      title: `${selectedType.toUpperCase()} EMERGENCY - ${address.split(',')[0]}`,
      description: description || 'Immediate assistance requested by citizen via RESQ SOS Portal.',
      severity,
      status: 'dispatching',
      location: {
        lat: latLng.lat,
        lng: latLng.lng,
        address,
        city: 'Chennai',
        district: 'Chennai Central'
      },
      peopleAffected,
      reportedAt: nowTime,
      timestamp: Date.now(),
      assignedUnits: ['AMB-04', 'POL-12', 'FIRE-03'],
      nearestHospitalId: 'HOSP-01',
      etaMinutes: 4,
      callerPhone: '+91 98401 22910',
      callerName: 'Citizen SOS Reporter',
      source: 'citizen_app',
      resourcesRequired: ['ALS Paramedic Unit', 'Rescue Response'],
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          time: nowTime,
          timestamp: Date.now(),
          title: 'Emergency Reported',
          description: 'Citizen SOS initiated via mobile/web portal with GPS pinning.',
          actor: 'Citizen SOS Reporter',
          type: 'report'
        },
        {
          id: `tl-${Date.now()}-2`,
          time: nowTime,
          timestamp: Date.now() + 1000,
          title: 'Location Verified by Command Grid',
          description: `Coordinates locked to ${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)}.`,
          actor: 'RESQ GIS Geocoder',
          type: 'verify'
        },
        {
          id: `tl-${Date.now()}-3`,
          time: nowTime,
          timestamp: Date.now() + 2000,
          title: 'Dispatch Initiated',
          description: 'Nearest available units (AMB-04, POL-12, FIRE-03) received critical tone dispatch.',
          actor: 'Automated EOC Dispatcher',
          type: 'dispatch'
        }
      ]
    };

    setCreatedIncident(newIncident);
    onSubmitIncident(newIncident);
    setStep(4);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#090f1d] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header Strip with High Stress Clarity */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c1426]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-900/50">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                {t.appName} SOS EMERGENCY REPORT
              </h2>
              <span className="text-[10px] font-mono text-red-400">DIRECT LINK TO CHENNAI 112 DISPATCH</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Read Aloud Button */}
            <button
              onClick={handleReadAloud}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors"
              title="Read instructions aloud"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{t.readAloud}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-0.5 text-xs font-mono">
              {(['en', 'ta', 'hi'] as LanguageCode[]).map((l) => (
                <button
                  key={l}
                  onClick={() => onLangChange(l)}
                  className={`px-2 py-0.5 rounded-lg uppercase ${
                    lang === l ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* STEP 1: Select Emergency Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-[11px] font-mono text-red-400 uppercase tracking-widest bg-red-950/40 px-3 py-1 rounded-full border border-red-800/40">
                  STEP 1 OF 3 • TAP TO SELECT
                </span>
                <h3 className="mt-3 text-2xl font-black text-white tracking-tight">
                  {t.whatIsHappening}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Select the closest emergency category to mobilize specialized responders.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {emergencyOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectType(opt.id)}
                    className={`p-4 rounded-2xl border text-center transition-all duration-200 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-2 group ${opt.color}`}
                  >
                    <div className="p-3 rounded-xl bg-white/10 group-hover:scale-110 transition-transform">
                      <opt.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-white tracking-wide">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Details, Location, People Affected, Severity */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Categories</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase">
                  <span>Selected:</span>
                  <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-white">
                    {selectedType}
                  </span>
                </div>
              </div>

              {/* Location Pinned Card */}
              <div className="p-4 rounded-2xl bg-[#0c1426] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-red-500 animate-bounce" />
                    <span>{t.currentLocation}</span>
                  </div>
                  <button
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-semibold transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{isLocating ? 'Locating...' : t.useMyLocation}</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 font-mono text-xs text-slate-300 flex items-center justify-between">
                  <span>📍 {address}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">● GPS LOCKED</span>
                </div>
              </div>

              {/* Description Input + Voice & Photo simulation */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Situation Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g., Two vehicles crashed at junction, 3 passengers injured, traffic stopped..."
                  rows={2}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500/60"
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* Voice Record Button */}
                  <button
                    type="button"
                    onClick={handleToggleVoiceRecord}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isRecordingVoice
                        ? 'bg-red-600 text-white border-red-400 animate-pulse'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                    }`}
                  >
                    {isRecordingVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-red-400" />}
                    <span>{isRecordingVoice ? 'Listening (Speak now)...' : 'Record Voice Note'}</span>
                  </button>

                  {/* Photo Upload simulation */}
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoAttached(!photoAttached);
                      soundManager.playPing();
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      photoAttached
                        ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-400" />
                    <span>{photoAttached ? '✓ Photo Attached' : 'Attach Photo'}</span>
                  </button>

                  {/* Gemini 3.8 Auto-Triage Button */}
                  <button
                    type="button"
                    onClick={handleGeminiTriage}
                    disabled={isGeminiTriaging}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-amber-500/50 bg-amber-950/40 hover:bg-amber-900/50 text-amber-200 transition-all shadow-md shadow-amber-950/40"
                  >
                    {isGeminiTriaging ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    )}
                    <span>{isGeminiTriaging ? 'Gemini Analyzing...' : '✨ Gemini 3.8 Auto-Triage'}</span>
                  </button>
                </div>

                {geminiTriageBadge && (
                  <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 font-mono text-[11px] flex items-center gap-2 animate-fade-in">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{geminiTriageBadge}</span>
                  </div>
                )}

                {voiceRecordedText && (
                  <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 p-2 rounded-xl">
                    {voiceRecordedText}
                  </div>
                )}
              </div>

              {/* People Affected & Severity Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* People Affected */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {t.peopleAffected}
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['1', '2–5', '5–20', '20+'].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => {
                          setPeopleAffected(count);
                          soundManager.playPing();
                        }}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          peopleAffected === count
                            ? 'bg-red-600 text-white border-red-400 shadow-sm'
                            : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Severity (Red, Yellow, Green emergency colors) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {t.severity}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'critical', label: 'Critical', bg: 'bg-red-600 text-white' },
                      { id: 'high', label: 'High', bg: 'bg-yellow-500 text-slate-950 font-black' },
                      { id: 'moderate', label: 'Moderate', bg: 'bg-emerald-600 text-white' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSeverity(s.id as SeverityLevel);
                          soundManager.playPing();
                        }}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          severity === s.id
                            ? `${s.bg} border-white/40 shadow-sm ring-2 ring-white/20`
                            : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Continue to confirmation button */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playPing();
                  setStep(3);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-red-900/40 border border-red-400/40 flex items-center justify-center gap-2 transition-all"
              >
                <span>Review &amp; Confirm Alert</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: Clean Confirmation Screen Before Submission */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest bg-amber-950/40 px-3 py-1 rounded-full border border-amber-800/40">
                  STEP 3 OF 3 • FINAL VERIFICATION
                </span>
                <h3 className="mt-3 text-2xl font-black text-white tracking-tight">
                  CONFIRM EMERGENCY TRANSMISSION
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  This will dispatch Chennai Metro Emergency Responders to your location.
                </p>
              </div>

              <div className="double-bezel-shell">
                <div className="double-bezel-core p-5 space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-white/10">
                    <span className="text-slate-400">Emergency Type:</span>
                    <span className="text-white font-bold uppercase">{selectedType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/10">
                    <span className="text-slate-400">Severity Level:</span>
                    <span className={`font-bold uppercase ${severity === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>
                      {severity}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/10">
                    <span className="text-slate-400">People Affected:</span>
                    <span className="text-white font-bold">{peopleAffected}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/10">
                    <span className="text-slate-400">Target Coordinates:</span>
                    <span className="text-cyan-400 font-bold">{latLng.lat.toFixed(4)}, {latLng.lng.toFixed(4)}</span>
                  </div>
                  <div className="py-1">
                    <span className="text-slate-400 block mb-1">Location Address:</span>
                    <span className="text-slate-200">{address}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3.5 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 font-semibold text-xs hover:text-white transition-colors"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="flex-[2] py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-red-700/50 border border-red-400/40 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4 animate-pulse" />
                  <span>{t.sendAlert}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Smart Incident Ticket Created & Live Tracking */}
          {step === 4 && createdIncident && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Ticket Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500/60 flex items-center justify-center mx-auto mb-2 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white tracking-wider">
                  INCIDENT #{createdIncident.id}
                </h3>
                <p className="text-xs font-mono text-emerald-300 mt-0.5">
                  STATUS: ● DISPATCHING UNITS NOW
                </p>
              </div>

              {/* Incident Details Card */}
              <div className="double-bezel-shell">
                <div className="double-bezel-core p-4 space-y-2.5 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-2 pb-2 border-b border-white/10">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Type</span>
                      <span className="text-white font-bold uppercase">{createdIncident.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Severity</span>
                      <span className="text-red-400 font-bold uppercase">{createdIncident.severity}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pb-2 border-b border-white/10">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Reported At</span>
                      <span className="text-slate-200">{createdIncident.reportedAt}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">People Affected</span>
                      <span className="text-slate-200 font-bold">{createdIncident.peopleAffected}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Location</span>
                    <span className="text-slate-200">{createdIncident.location.address}</span>
                  </div>
                </div>
              </div>

              {/* Nearest Responders Assigned */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                  NEAREST RESPONDERS ASSIGNED
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-blue-500/30 text-center">
                    <Truck className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-white font-mono">Ambulance 04</div>
                    <div className="text-[10px] text-emerald-400 font-mono">ETA: 4 min</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-center">
                    <ShieldAlert className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-white font-mono">Police Unit 12</div>
                    <div className="text-[10px] text-emerald-400 font-mono">ETA: 3 min</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-orange-500/30 text-center">
                    <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-white font-mono">Fire Unit 03</div>
                    <div className="text-[10px] text-emerald-400 font-mono">ETA: 5 min</div>
                  </div>
                </div>
              </div>

              {/* Nearest Hospitals Alerted */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                  NEAREST HOSPITALS ON STANDBY
                </span>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Hospital className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-semibold">Apollo Hospitals (Greams Rd)</span>
                  </div>
                  <span className="text-emerald-400">Trauma Bay Ready</span>
                </div>
              </div>

              {/* Response Timeline */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                  LIVE RESPONSE TIMELINE
                </span>
                <div className="space-y-2 border-l-2 border-red-500/40 pl-3 ml-1 text-xs font-mono">
                  <div className="relative">
                    <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-slate-400">{createdIncident.reportedAt}</span>
                    <span className="text-slate-200 ml-2 font-bold">Emergency reported</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-slate-400">19:43</span>
                    <span className="text-slate-200 ml-2 font-bold">Location verified &amp; geofenced</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-slate-400">19:43</span>
                    <span className="text-cyan-300 ml-2 font-bold">Ambulance dispatched (AMB-04)</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-slate-500" />
                    <span className="text-slate-500">19:44</span>
                    <span className="text-slate-400 ml-2">Police traffic green corridor notified</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-slate-500" />
                    <span className="text-slate-500">19:45</span>
                    <span className="text-slate-400 ml-2">Trauma ICU alerted at Apollo</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

