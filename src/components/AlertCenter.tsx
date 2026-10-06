import React, { useState } from 'react';
import { 
  Radio, 
  Send, 
  CloudRain, 
  Flame, 
  Globe2, 
  ShieldAlert, 
  HeartPulse, 
  AlertTriangle, 
  Eye, 
  Clock, 
  Users, 
  CheckCircle2, 
  Volume2, 
  X,
  Plus,
  Car
} from 'lucide-react';
import { PublicAlert, LanguageCode } from '../types';
import { soundManager } from '../utils/audio';
import { speakText } from '../utils/speech';

interface AlertCenterProps {
  alerts: PublicAlert[];
  onPublishAlert: (alert: PublicAlert) => void;
  lang: LanguageCode;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({
  alerts,
  onPublishAlert,
  lang
}) => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [previewTab, setPreviewTab] = useState<LanguageCode>('en');

  // Form states
  const [category, setCategory] = useState<PublicAlert['category']>('weather');
  const [severity, setSeverity] = useState<PublicAlert['severity']>('high');
  const [targetType, setTargetType] = useState<PublicAlert['targetType']>('district');
  const [targetArea, setTargetArea] = useState<string>('Chennai Metro & Coastal Chengalpattu');
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [msgEn, setMsgEn] = useState<string>('NDMA Alert: Squally winds and intense rainfall expected. Avoid underpasses and coastal roads.');
  const [msgTa, setMsgTa] = useState<string>('தேசிய பேரிடர் எச்சரிக்கை: பலத்த காற்றுடன் கனமழை பெய்ய வாய்ப்புள்ளது. பொதுமக்கள் நீர் தேங்கிய பகுதிகளைத் தவிர்க்கவும்.');
  const [msgHi, setMsgHi] = useState<string>('एनडीएमए चेतावनी: तेज हवाओं और भारी बारिश का अलर्ट। जलभराव वाले क्षेत्रों और अंडरपास से दूर रहें।');
  const [expiryHours, setExpiryHours] = useState<string>('6');

  const handleOpenCreate = () => {
    soundManager.playPing();
    setCreateModalOpen(true);
  };

  const handleReadAlert = (alertText: string, alertLang: LanguageCode) => {
    soundManager.playPing();
    speakText(alertText, alertLang);
  };

  const handlePublish = () => {
    soundManager.playEmergencyAlarm();

    const newAlert: PublicAlert = {
      id: `ALT-${Math.floor(900 + Math.random() * 100)}`,
      title: `${category.toUpperCase()} ALERT: ${targetArea}`,
      category,
      severity,
      message: {
        en: msgEn,
        ta: msgTa,
        hi: msgHi
      },
      targetArea,
      targetType,
      radiusKm: targetType === 'radius' ? radiusKm : undefined,
      issuedAt: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      expiresAt: `${expiryHours} Hours from now`,
      authority: 'Tamil Nadu State Disaster Management Cell (TNSDMA)',
      active: true,
      reachCount: targetType === 'city' ? 1200000 : targetType === 'district' ? 450000 : 85000
    };

    onPublishAlert(newAlert);
    setCreateModalOpen(false);
    alert(`Public broadcast transmitted across cell towers & SMS channels. Estimated reach: ${newAlert.reachCount.toLocaleString()} citizens.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            DISASTER ALERT BROADCAST SYSTEM
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            CAP (COMMON ALERTING PROTOCOL) • CELL BROADCAST • NDMA SACHET GATEWAY
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-900/40 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Disaster Alert</span>
        </button>
      </div>

      {/* Active Broadcasts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>ACTIVE CELL BROADCASTS ({alerts.length})</span>
          <span className="text-emerald-400">Gateway Status: Operational</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {alerts.map((al) => (
            <div key={al.id} className="double-bezel-shell hover:border-white/20 transition-all">
              <div className="double-bezel-core p-5 space-y-4 flex flex-col justify-between h-full">
                
                <div>
                  {/* Top Bar: Category & Severity */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{al.category.toUpperCase()}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      al.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' :
                      al.severity === 'high' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                      al.severity === 'warning' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {al.severity}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white leading-snug">{al.title}</h3>
                  <div className="text-[11px] font-mono text-cyan-400 mt-1">
                    📍 Target: {al.targetArea} ({al.targetType})
                  </div>

                  {/* Message content in current language */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-white/5 text-xs text-slate-200 leading-relaxed font-sans">
                    {al.message[lang] || al.message.en}
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="space-y-2 pt-2 border-t border-white/5 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      Reach: <b className="text-white">{al.reachCount.toLocaleString()}</b>
                    </span>
                    <span>Expires: {al.expiresAt}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 truncate max-w-[160px]">
                      {al.authority}
                    </span>
                    <button
                      onClick={() => handleReadAlert(al.message[lang] || al.message.en, lang)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
                      title="Read broadcast aloud"
                    >
                      <Volume2 className="w-3 h-3 text-cyan-400" />
                      <span>Audio</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE ALERT MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#090f1d] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c1426]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-600/30 border border-red-500/50 text-red-400">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-mono uppercase tracking-wider">
                    CREATE PUBLIC EMERGENCY BROADCAST
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    COMMON ALERTING PROTOCOL (CAP-IN v1.2)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Category & Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold uppercase text-[10px]">
                    Alert Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PublicAlert['category'])}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                  >
                    <option value="weather">Weather / Cyclone</option>
                    <option value="flood">Flood / Surge</option>
                    <option value="fire">Fire / Industrial</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="safety">Public Safety</option>
                    <option value="medical">Medical Surge</option>
                    <option value="traffic">Traffic Emergency Corridor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold uppercase text-[10px]">
                    Severity Level
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as PublicAlert['severity'])}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                  >
                    <option value="critical">Critical (Red Alert)</option>
                    <option value="high">High (Orange Alert)</option>
                    <option value="warning">Warning (Yellow Alert)</option>
                    <option value="info">Advisory (Blue)</option>
                  </select>
                </div>
              </div>

              {/* Geographic Targeting */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold uppercase text-[10px]">
                    Targeting Topology
                  </label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value as PublicAlert['targetType'])}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                  >
                    <option value="city">Entire City</option>
                    <option value="district">Specific District</option>
                    <option value="radius">Radial Geofence (KM)</option>
                    <option value="polygon">Custom Polygon</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-bold uppercase text-[10px]">
                    Target Area Name / Sector
                  </label>
                  <input
                    type="text"
                    value={targetArea}
                    onChange={(e) => setTargetArea(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Multilingual Messages Inputs */}
              <div className="space-y-3 font-mono text-xs">
                <span className="block text-slate-400 font-bold uppercase text-[10px]">
                  Multilingual Alert Transmissions (Mandatory for NDMA compliance)
                </span>

                <div>
                  <label className="block text-slate-500 text-[10px] mb-0.5">English (EN):</label>
                  <textarea
                    value={msgEn}
                    onChange={(e) => setMsgEn(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] mb-0.5">தமிழ் (Tamil):</label>
                  <textarea
                    value={msgTa}
                    onChange={(e) => setMsgTa(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] mb-0.5">हिन्दी (Hindi):</label>
                  <textarea
                    value={msgHi}
                    onChange={(e) => setMsgHi(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none font-sans text-xs"
                  />
                </div>
              </div>

              {/* Citizen Phone Preview */}
              <div className="double-bezel-shell">
                <div className="double-bezel-core p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      Live Citizen Handset Notification Preview
                    </span>
                    
                    <div className="flex gap-1">
                      {(['en', 'ta', 'hi'] as LanguageCode[]).map(l => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setPreviewTab(l)}
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                            previewTab === l ? 'bg-red-600 text-white' : 'text-slate-400'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-red-500/30 text-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-red-400 font-bold font-mono text-[11px] mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                      <span>EMERGENCY ALERT: {targetArea.toUpperCase()}</span>
                    </div>
                    <p className="font-sans">
                      {previewTab === 'en' ? msgEn : previewTab === 'ta' ? msgTa : msgHi}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 font-semibold text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="flex-[2] py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs font-mono uppercase tracking-wider shadow-xl shadow-red-900/40 border border-red-400/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT CELL BROADCAST NOW</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

