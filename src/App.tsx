import React, { useState, useEffect } from 'react';
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
} from './types';
import { 
  initialIncidents, 
  initialResponders, 
  initialHospitals, 
  initialResources, 
  initialAlerts, 
  systemStats,
  defaultAuthUser,
  mockAuthUsers
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { CommandCenter } from './components/CommandCenter';
import { CitizenReportModal } from './components/CitizenReportModal';
import { CriticalAlertModal } from './components/CriticalAlertModal';
import { DemoModeController } from './components/DemoModeController';
import { ResqAIAssistant } from './components/ResqAIAssistant';
import { CitizenMobileView } from './components/CitizenMobileView';
import { ResponderMobileView } from './components/ResponderMobileView';
import { LoginModal } from './components/LoginModal';
import { soundManager } from './utils/audio';

export const App: React.FC = () => {
  // Primary datasets
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [responders, setResponders] = useState<ResponderUnit[]>(initialResponders);
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [resources, setResources] = useState<EmergencyResource[]>(initialResources);
  const [alerts, setAlerts] = useState<PublicAlert[]>(initialAlerts);
  const [stats, setStats] = useState<SystemStats>(systemStats);

  // User Authentication state (persisted to localStorage if available)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('resq_auth_user');
      return saved ? JSON.parse(saved) : defaultAuthUser;
    } catch {
      return defaultAuthUser;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Theme mode: dark (default tactical) or light (command daylight)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('resq_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const handleToggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('resq_theme', next);
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [theme]);

  // App settings & routing
  const [currentView, setCurrentView] = useState<'landing' | 'command'>('command');
  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser ? currentUser.role : 'control_officer');
  const [lang, setLang] = useState<LanguageCode>('en');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    try {
      localStorage.setItem('resq_auth_user', JSON.stringify(user));
    } catch {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole('citizen');
    try {
      localStorage.removeItem('resq_auth_user');
    } catch {}
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    const matched = mockAuthUsers.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      try {
        localStorage.setItem('resq_auth_user', JSON.stringify(matched));
      } catch {}
    }
  };

  // Active interaction states
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isCitizenReportOpen, setIsCitizenReportOpen] = useState<boolean>(false);
  const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false);
  const [isCriticalAlertOpen, setIsCriticalAlertOpen] = useState<boolean>(false);

  // Quick lookup for critical incident modal
  const mostCriticalIncident = incidents.find(i => i.severity === 'critical' && i.status !== 'resolved') || incidents[0];
  const activeCriticalCount = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;

  // Handlers
  const handleAddIncident = (newInc: Incident) => {
    setIncidents(prev => [newInc, ...prev]);
    setSelectedIncident(newInc);
    setCurrentView('command');
    setStats(prev => ({
      ...prev,
      activeIncidents: prev.activeIncidents + 1,
      criticalIncidents: newInc.severity === 'critical' ? prev.criticalIncidents + 1 : prev.criticalIncidents
    }));
  };

  const handleUpdateIncidentStatus = (incidentId: string, newStatus: Incident['status']) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const newTimelineEvent = {
          id: `tl-${Date.now()}`,
          time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
          timestamp: Date.now(),
          title: `Status updated to ${newStatus.toUpperCase()}`,
          description: `Incident moved to ${newStatus} phase by EOC controller.`,
          actor: 'EOC Controller',
          type: (newStatus === 'resolved' ? 'resolved' : 'dispatch') as 'resolved' | 'dispatch'
        };

        return {
          ...inc,
          status: newStatus,
          timeline: [...inc.timeline, newTimelineEvent]
        };
      }
      return inc;
    }));

    if (selectedIncident?.id === incidentId) {
      setSelectedIncident(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleAssignUnitToIncident = (incidentId: string, unitId: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const already = inc.assignedUnits.includes(unitId);
        const assigned = already ? inc.assignedUnits : [...inc.assignedUnits, unitId];
        return {
          ...inc,
          assignedUnits: assigned,
          status: inc.status === 'reported' ? 'dispatching' : inc.status
        };
      }
      return inc;
    }));

    // Update responder status to en_route
    setResponders(prev => prev.map(r => {
      if (r.id === unitId) {
        return {
          ...r,
          status: 'en_route',
          assignedIncidentId: incidentId
        };
      }
      return r;
    }));

    if (selectedIncident?.id === incidentId) {
      setSelectedIncident(prev => prev ? {
        ...prev,
        assignedUnits: prev.assignedUnits.includes(unitId) ? prev.assignedUnits : [...prev.assignedUnits, unitId]
      } : null);
    }
  };

  const handleAssignMultipleUnits = (incidentId: string, unitIds: string[]) => {
    unitIds.forEach(id => handleAssignUnitToIncident(incidentId, id));
  };

  const handleUpdateResponderStatus = (unitId: string, newStatus: ResponderUnit['status']) => {
    soundManager.playDispatchSquelch();
    setResponders(prev => prev.map(r => {
      if (r.id === unitId) {
        return { ...r, status: newStatus };
      }
      return r;
    }));
  };

  const handlePublishAlert = (newAlert: PublicAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  // Demo injection handlers
  const handleInjectDemoIncident = (demoInc: Incident) => {
    setIncidents(prev => {
      const filtered = prev.filter(i => i.id !== demoInc.id);
      return [demoInc, ...filtered];
    });
    setSelectedIncident(demoInc);
  };

  const handleUpdateDemoIncident = (updated: Partial<Incident>) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === 'RX-DEMO-99') {
        const merged = { ...inc, ...updated };
        if (selectedIncident?.id === 'RX-DEMO-99') {
          setSelectedIncident(merged);
        }
        return merged;
      }
      return inc;
    }));
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'light-mode bg-slate-100 text-slate-900' : 'bg-[#060a14] text-slate-100'} flex flex-col font-sans selection:bg-red-500/30 selection:text-red-200 transition-colors duration-150`}>
      
      {/* Universal Top Header */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        lang={lang}
        onLangChange={setLang}
        onOpenReport={() => setIsCitizenReportOpen(true)}
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenAIAssistant={() => {}}
        onOpenCriticalAlert={() => setIsCriticalAlertOpen(true)}
        activeCriticalCount={activeCriticalCount}
        unreadNotifications={3}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentView={currentView}
        onViewChange={(v) => setCurrentView(v as 'landing' | 'command')}
      />

      {/* Main View Container */}
      <div className="flex-1">
        {/* Role-Specific Overrides */}
        {currentRole === 'citizen' && currentView !== 'landing' ? (
          <CitizenMobileView
            onOpenReport={() => setIsCitizenReportOpen(true)}
            alerts={alerts}
            incidents={incidents}
            lang={lang}
          />
        ) : currentRole === 'responder' && currentView !== 'landing' ? (
          <ResponderMobileView
            activeIncident={mostCriticalIncident}
            hospital={hospitals[0]}
            onUpdateStatus={(st) => handleUpdateIncidentStatus(mostCriticalIncident.id, st)}
          />
        ) : currentView === 'landing' ? (
          <LandingPage
            lang={lang}
            onOpenReport={() => setIsCitizenReportOpen(true)}
            onOpenCommand={() => setCurrentView('command')}
            onOpenDemo={() => setIsDemoOpen(true)}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            activeCount={incidents.filter(i => i.status !== 'resolved').length}
            criticalCount={activeCriticalCount}
          />
        ) : (
          <CommandCenter
            incidents={incidents}
            responders={responders}
            hospitals={hospitals}
            resources={resources}
            alerts={alerts}
            stats={stats}
            currentRole={currentRole}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            lang={lang}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            onAssignUnitToIncident={handleAssignUnitToIncident}
            onAssignMultipleUnits={handleAssignMultipleUnits}
            onUpdateResponderStatus={handleUpdateResponderStatus}
            onPublishAlert={handlePublishAlert}
            onOpenReportModal={() => setIsCitizenReportOpen(true)}
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
            theme={theme}
          />
        )}
      </div>

      {/* Floating RESQ AI Assistant */}
      <ResqAIAssistant
        incidents={incidents}
        hospitals={hospitals}
        responders={responders}
        resources={resources}
      />

      {/* Citizen SOS Report Modal */}
      <CitizenReportModal
        isOpen={isCitizenReportOpen}
        onClose={() => setIsCitizenReportOpen(false)}
        lang={lang}
        onLangChange={setLang}
        onSubmitIncident={handleAddIncident}
      />

      {/* High-Priority Critical Alert Modal */}
      <CriticalAlertModal
        isOpen={isCriticalAlertOpen}
        onClose={() => setIsCriticalAlertOpen(false)}
        incident={mostCriticalIncident}
        onDispatchNow={(inc) => {
          setSelectedIncident(inc);
          setCurrentView('command');
        }}
        onViewIncident={(inc) => {
          setSelectedIncident(inc);
          setCurrentView('command');
        }}
      />

      {/* 60-90s Demo Mode Controller */}
      <DemoModeController
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onInjectDemoIncident={handleInjectDemoIncident}
        onUpdateDemoIncident={handleUpdateDemoIncident}
        onSelectIncident={setSelectedIncident}
      />

      {/* Secure Terminal Authentication & Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

    </div>
  );
};

