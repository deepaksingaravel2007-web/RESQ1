import React, { useState } from 'react';
import { 
  Flame, 
  MapPin, 
  Truck, 
  Building2, 
  Boxes, 
  Map as MapIcon, 
  Bell, 
  BarChart3, 
  ClipboardList, 
  Settings, 
  ShieldAlert, 
  Activity, 
  ArrowUpRight, 
  Clock, 
  HeartPulse, 
  Search, 
  Filter, 
  CheckCircle2, 
  PhoneCall, 
  Send, 
  User, 
  Radio, 
  SlidersHorizontal,
  ChevronRight,
  TrendingDown,
  Layers
} from 'lucide-react';
import { 
  Incident, 
  ResponderUnit, 
  Hospital, 
  EmergencyResource, 
  PublicAlert, 
  SystemStats, 
  UserRole, 
  LanguageCode, 
  AuthUser,
  ThemeMode 
} from '../types';
import { LiveMap } from './LiveMap';
import { IncidentDrawer } from './IncidentDrawer';
import { SmartDispatchModal } from './SmartDispatchModal';
import { ResponderManagement } from './ResponderManagement';
import { HospitalCoordination } from './HospitalCoordination';
import { ResourceManagement } from './ResourceManagement';
import { AlertCenter } from './AlertCenter';
import { IncidentAnalytics } from './IncidentAnalytics';
import { IncidentTimelineModal } from './IncidentTimelineModal';
import { soundManager } from '../utils/audio';

interface CommandCenterProps {
  incidents: Incident[];
  responders: ResponderUnit[];
  hospitals: Hospital[];
  resources: EmergencyResource[];
  alerts: PublicAlert[];
  stats: SystemStats;
  currentRole: UserRole;
  currentUser?: AuthUser | null;
  onOpenLogin?: () => void;
  lang: LanguageCode;
  onUpdateIncidentStatus: (incidentId: string, newStatus: Incident['status']) => void;
  onAssignUnitToIncident: (incidentId: string, unitId: string) => void;
  onAssignMultipleUnits: (incidentId: string, unitIds: string[]) => void;
  onUpdateResponderStatus: (unitId: string, newStatus: ResponderUnit['status']) => void;
  onPublishAlert: (alert: PublicAlert) => void;
  onOpenReportModal: () => void;
  selectedIncident: Incident | null;
  onSelectIncident: (inc: Incident | null) => void;
  theme?: ThemeMode;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  incidents,
  responders,
  hospitals,
  resources,
  alerts,
  stats,
  currentRole,
  currentUser,
  onOpenLogin,
  lang,
  onUpdateIncidentStatus,
  onAssignUnitToIncident,
  onAssignMultipleUnits,
  onUpdateResponderStatus,
  onPublishAlert,
  onOpenReportModal,
  selectedIncident,
  onSelectIncident,
  theme = 'dark'
}) => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchIncident, setSearchIncident] = useState<string>('');

  // Modals state
  const [dispatchModalIncident, setDispatchModalIncident] = useState<Incident | null>(null);
  const [timelineModalIncident, setTimelineModalIncident] = useState<Incident | null>(null);

  const handleTabChange = (tab: string) => {
    soundManager.playPing();
    setActiveTab(tab);
  };

  const handleOpenDispatch = (incident: Incident) => {
    soundManager.playDispatchSquelch();
    setDispatchModalIncident(incident);
  };

  const handleViewTimeline = (incident: Incident) => {
    soundManager.playPing();
    setTimelineModalIncident(incident);
  };

  const handleMarkResolved = (incidentId: string) => {
    soundManager.playSuccess();
    onUpdateIncidentStatus(incidentId, 'resolved');
    if (selectedIncident?.id === incidentId) {
      onSelectIncident(null);
    }
  };

  // Filtered incidents for list view
  const filteredIncidents = incidents.filter(i => {
    const matchesSev = filterSeverity === 'all' || i.severity === filterSeverity;
    const matchesQuery = 
      i.title.toLowerCase().includes(searchIncident.toLowerCase()) ||
      i.location.address.toLowerCase().includes(searchIncident.toLowerCase()) ||
      i.id.toLowerCase().includes(searchIncident.toLowerCase());
    return matchesSev && matchesQuery;
  });

  const activeIncidentsCount = incidents.filter(i => i.status !== 'resolved').length;
  const criticalCount = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;

  return (
    <div className="flex h-[calc(100vh-65px)] bg-[#060a14] text-slate-100 overflow-hidden font-sans">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-[#070c18] border-r border-white/10 flex-col justify-between shrink-0 font-mono text-xs select-none">
        
        {/* Navigation list */}
        <div className="p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            COMMAND NAVIGATION
          </div>

          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'map', label: 'Live Map', icon: MapIcon },
            { id: 'incidents', label: 'Live Incidents', icon: MapPin, badge: activeIncidentsCount },
            { id: 'responders', label: 'Response Units', icon: Truck, badge: responders.length },
            { id: 'hospitals', label: 'Hospitals', icon: Building2 },
            { id: 'resources', label: 'Resources', icon: Boxes },
            { id: 'alerts', label: 'Alerts', icon: Bell, badge: alerts.length },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'history', label: 'Incident History', icon: ClipboardList }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Bottom: User Profile & System Status */}
        <div className="p-3 border-t border-white/10 bg-[#090f1d] space-y-2">
          <div 
            onClick={onOpenLogin}
            className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/90 border border-white/5 hover:border-emerald-500/40 cursor-pointer transition-all group"
            title="Click to Switch Operator / Role"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-300 font-bold group-hover:scale-105 transition-transform">
              {currentUser?.avatar || (currentUser ? currentUser.name.slice(0, 2).toUpperCase() : 'EO')}
            </div>
            <div className="truncate flex-1">
              <div className="font-bold text-white text-[11px] truncate group-hover:text-yellow-300 transition-colors">
                {currentUser?.name || 'Officer M. Raman'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentUser?.badgeNumber || 'EOC-CMD-001'} • {currentUser?.role || 'EOC'}
              </div>
            </div>
          </div>

          <div className="px-2 py-1 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Grid Nominal
            </span>
            <span className="font-mono">v4.8-PROD</span>
          </div>
        </div>

      </aside>

      {/* 2. MAIN CENTER CONTENT VIEW */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#060a14] p-4 lg:p-6 space-y-6">
        
        {/* KPI CARDS (Always visible on Overview/Map/Incidents) */}
        {(activeTab === 'overview' || activeTab === 'map' || activeTab === 'incidents') && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {[
              {
                id: 'active',
                title: 'ACTIVE INCIDENTS',
                value: activeIncidentsCount,
                color: 'text-amber-300',
                border: 'border-amber-500/40 bg-amber-950/20',
                sub: 'Active Grid Feed',
                onClick: () => { setFilterSeverity('all'); setActiveTab('incidents'); }
              },
              {
                id: 'critical',
                title: 'CRITICAL',
                value: criticalCount,
                color: 'text-red-400',
                border: 'border-red-500/50 bg-red-950/30 glow-red',
                sub: 'Immediate Priority SOS',
                onClick: () => { setFilterSeverity('critical'); setActiveTab('incidents'); }
              },
              {
                id: 'responders',
                title: 'RESPONDERS ACTIVE',
                value: 47,
                color: 'text-emerald-400',
                border: 'border-emerald-500/40 bg-emerald-950/20 glow-green',
                sub: 'Police, Fire & EMS',
                onClick: () => setActiveTab('responders')
              },
              {
                id: 'ambulances',
                title: 'AVAILABLE AMBULANCES',
                value: 18,
                color: 'text-emerald-300',
                border: 'border-emerald-500/30 bg-emerald-950/15',
                sub: 'ALS Mobile ICUs Ready',
                onClick: () => setActiveTab('responders')
              },
              {
                id: 'hospital',
                title: 'HOSPITAL CAPACITY',
                value: '72%',
                color: 'text-yellow-400',
                border: 'border-yellow-500/30 bg-yellow-950/15',
                sub: 'Apex Trauma Free: 48',
                onClick: () => setActiveTab('hospitals')
              },
              {
                id: 'response_time',
                title: 'AVG RESPONSE TIME',
                value: '08:42',
                color: 'text-emerald-400',
                border: 'border-emerald-500/30 bg-emerald-950/15',
                sub: 'Target SLA: 08:00',
                onClick: () => setActiveTab('analytics')
              }
            ].map((kpi) => (
              <div 
                key={kpi.id} 
                onClick={kpi.onClick}
                className={`double-bezel-shell cursor-pointer hover:scale-[1.02] transition-transform ${kpi.border}`}
              >
                <div className="double-bezel-core p-3.5 space-y-1 font-mono">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
                    {kpi.title}
                  </div>
                  <div className={`text-2xl font-black ${kpi.color}`}>
                    {kpi.value}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {kpi.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 1: OVERVIEW (Map Centerpiece + Split Incident Queue) */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-[550px]">
            
            {/* Center Map (2 Cols) */}
            <div className="xl:col-span-2 h-[550px] xl:h-auto">
              <LiveMap
                incidents={incidents}
                responders={responders}
                hospitals={hospitals}
                selectedIncident={selectedIncident}
                theme={theme}
                onSelectIncident={(inc) => {
                  soundManager.playPing();
                  onSelectIncident(inc);
                }}
                onOpenDispatch={handleOpenDispatch}
              />
            </div>

            {/* Right: Live Incident Feed & Quick Action Queue */}
            <div className="xl:col-span-1 space-y-3 flex flex-col h-[550px] xl:h-auto overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 font-mono text-xs">
                <span className="font-bold text-white uppercase flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500 animate-pulse" />
                  PRIORITY INCIDENT QUEUE
                </span>
                <span className="text-slate-400">{filteredIncidents.length} Records</span>
              </div>

              {/* Incidents Scrollable List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {filteredIncidents.map((inc) => {
                  const isSelected = selectedIncident?.id === inc.id;

                  return (
                    <div
                      key={inc.id}
                      onClick={() => {
                        soundManager.playPing();
                        onSelectIncident(inc);
                      }}
                      className={`double-bezel-shell cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-red-500 shadow-xl shadow-red-950/60' 
                          : 'hover:border-white/20'
                      }`}
                    >
                      <div className="double-bezel-core p-3.5 space-y-2">
                        <div className="flex items-start justify-between gap-2 font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-white">#{inc.id}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              inc.severity === 'critical' ? 'bg-red-600 text-white' :
                              inc.severity === 'high' ? 'bg-orange-600 text-white' :
                              'bg-amber-600 text-slate-900'
                            }`}>
                              {inc.severity}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{inc.reportedAt}</span>
                        </div>

                        <h4 className="text-xs font-bold text-white line-clamp-1">{inc.title}</h4>
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          📍 {inc.location.address}
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-white/5">
                          <span className="text-cyan-400">
                            {inc.assignedUnits.length} Assigned • ETA ~{inc.etaMinutes || 5}m
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDispatch(inc);
                            }}
                            className="px-2 py-1 rounded bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white text-[10px] font-bold font-mono transition-colors"
                          >
                            DISPATCH
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: FULLSCREEN LIVE MAP */}
        {activeTab === 'map' && (
          <div className="h-[750px] w-full">
            <LiveMap
              incidents={incidents}
              responders={responders}
              hospitals={hospitals}
              selectedIncident={selectedIncident}
              theme={theme}
              onSelectIncident={(inc) => {
                soundManager.playPing();
                onSelectIncident(inc);
              }}
              onOpenDispatch={handleOpenDispatch}
            />
          </div>
        )}

        {/* TAB 3: LIVE INCIDENTS TABLE / LIST */}
        {activeTab === 'incidents' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#090f1e] border border-white/10 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Severity Filter:</span>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1 text-slate-200 focus:outline-none"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical Only</option>
                  <option value="high">High Only</option>
                  <option value="moderate">Moderate Only</option>
                </select>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchIncident}
                  onChange={(e) => setSearchIncident(e.target.value)}
                  placeholder="Filter incident list..."
                  className="bg-slate-900 border border-white/10 rounded-xl pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="double-bezel-shell overflow-hidden">
              <div className="double-bezel-core overflow-x-auto">
                <table className="w-full text-left font-mono text-xs text-slate-300">
                  <thead className="bg-[#0c1426] text-slate-400 text-[10px] uppercase border-b border-white/10">
                    <tr>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Type &amp; Title</th>
                      <th className="p-3.5">Severity</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Casualties</th>
                      <th className="p-3.5">ETA</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredIncidents.map((inc) => (
                      <tr 
                        key={inc.id} 
                        onClick={() => onSelectIncident(inc)}
                        className="hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <td className="p-3.5 font-bold text-white">#{inc.id}</td>
                        <td className="p-3.5">
                          <div className="text-white font-semibold">{inc.title}</div>
                          <div className="text-[10px] text-slate-400 uppercase">{inc.type}</div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inc.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' :
                            inc.severity === 'high' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                            'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {inc.severity}
                          </span>
                        </td>
                        <td className="p-3.5 uppercase text-cyan-400 font-bold">{inc.status.replace('_', ' ')}</td>
                        <td className="p-3.5 max-w-[200px] truncate">{inc.location.address}</td>
                        <td className="p-3.5 text-red-400 font-bold">{inc.peopleAffected}</td>
                        <td className="p-3.5 text-emerald-400">~{inc.etaMinutes || 5} min</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDispatch(inc);
                            }}
                            className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold mr-2"
                          >
                            Dispatch
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewTimeline(inc);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                          >
                            Audit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RESPONSE FLEET MANAGEMENT */}
        {activeTab === 'responders' && (
          <ResponderManagement
            responders={responders}
            onUpdateStatus={onUpdateResponderStatus}
          />
        )}

        {/* TAB 5: HOSPITALS COORDINATION */}
        {activeTab === 'hospitals' && (
          <HospitalCoordination
            hospitals={hospitals}
            onReserveBed={(hospId, bedType) => {
              soundManager.playSuccess();
              alert(`Reserved ${bedType.toUpperCase()} bed at ${hospId}.`);
            }}
          />
        )}

        {/* TAB 6: DISASTER LOGISTICS & RESOURCES */}
        {activeTab === 'resources' && (
          <ResourceManagement
            resources={resources}
            onDeployResource={(id, count) => {
              soundManager.playDispatchSquelch();
            }}
          />
        )}

        {/* TAB 7: ALERT CENTER */}
        {activeTab === 'alerts' && (
          <AlertCenter
            alerts={alerts}
            onPublishAlert={onPublishAlert}
            lang={lang}
          />
        )}

        {/* TAB 8: INCIDENT ANALYTICS */}
        {activeTab === 'analytics' && (
          <IncidentAnalytics />
        )}

        {/* TAB 9: INCIDENT HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4 font-mono text-xs">
            <h3 className="text-lg font-bold text-white">RESOLVED INCIDENTS AUDIT ARCHIVE</h3>
            <div className="double-bezel-shell">
              <div className="double-bezel-core p-4">
                {incidents.filter(i => i.status === 'resolved').length === 0 ? (
                  <p className="text-slate-400">No resolved incidents in current session buffer.</p>
                ) : (
                  <div className="space-y-3">
                    {incidents.filter(i => i.status === 'resolved').map(res => (
                      <div key={res.id} className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-emerald-400">#{res.id} • RESOLVED</span>
                          <div className="text-white font-bold">{res.title}</div>
                          <div className="text-slate-400 text-[11px]">{res.location.address}</div>
                        </div>
                        <button
                          onClick={() => handleViewTimeline(res)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10"
                        >
                          View Audit Timeline
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 3. INCIDENT DRAWER (Slide-over when incident is selected) */}
      <IncidentDrawer
        incident={selectedIncident}
        onClose={() => onSelectIncident(null)}
        hospitals={hospitals}
        responders={responders}
        onOpenDispatch={handleOpenDispatch}
        onViewDetails={handleViewTimeline}
        onMarkResolved={handleMarkResolved}
      />

      {/* 4. SMART DISPATCH MODAL */}
      <SmartDispatchModal
        isOpen={!!dispatchModalIncident}
        onClose={() => setDispatchModalIncident(null)}
        incident={dispatchModalIncident}
        responders={responders}
        onAssignUnit={onAssignUnitToIncident}
        onAssignAllRecommended={onAssignMultipleUnits}
      />

      {/* 5. INCIDENT TIMELINE / INVESTIGATION MODAL */}
      <IncidentTimelineModal
        incident={timelineModalIncident}
        onClose={() => setTimelineModalIncident(null)}
        hospitals={hospitals}
        responders={responders}
      />

    </div>
  );
};

