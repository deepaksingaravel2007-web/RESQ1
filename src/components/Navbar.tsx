import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Bell, 
  Volume2, 
  VolumeX, 
  Play, 
  Search, 
  UserCheck, 
  Radio, 
  Flame, 
  Globe2, 
  Menu, 
  X,
  KeyRound,
  LogOut,
  ChevronDown,
  User,
  Sun,
  Moon
} from 'lucide-react';
import { UserRole, LanguageCode, AuthUser, ThemeMode } from '../types';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  lang: LanguageCode;
  onLangChange: (lang: LanguageCode) => void;
  onOpenReport: () => void;
  onOpenDemo: () => void;
  onOpenAIAssistant: () => void;
  onOpenCriticalAlert: () => void;
  activeCriticalCount: number;
  unreadNotifications: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  currentUser,
  onOpenLogin,
  onLogout,
  theme,
  onToggleTheme,
  lang,
  onLangChange,
  onOpenReport,
  onOpenDemo,
  onOpenCriticalAlert,
  activeCriticalCount,
  unreadNotifications,
  searchQuery,
  onSearchChange,
  currentView,
  onViewChange
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const istTime = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const utcTime = now.toISOString().substring(11, 19);
      setTimeStr(`${istTime} IST | ${utcTime} UTC`);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSoundToggle = () => {
    const enabled = soundManager.toggleSound();
    setSoundEnabled(enabled);
  };

  const roles: { id: UserRole; label: string }[] = [
    { id: 'control_officer', label: 'EOC Officer' },
    { id: 'citizen', label: 'Citizen' },
    { id: 'responder', label: 'Responder' },
    { id: 'hospital', label: 'Hospital' },
    { id: 'police_fire', label: 'Police/Fire' },
    { id: 'admin', label: 'Administrator' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070c18]/90 backdrop-blur-xl border-b border-white/10 px-4 lg:px-6 py-2.5 transition-all">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand & Tactical Live Strip */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onViewChange('landing')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/40 border border-red-500/30 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070c18] animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white">RESQ</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/50">
                  CRISIS-OPS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-tight">
                India 112 / NDMA Coordinated Grid
              </p>
            </div>
          </button>

          {/* Tactical Status Pill in Red, Green & Yellow */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-300 font-bold">112 Grid Operational</span>
            <span className="text-yellow-400 font-mono text-[11px] border-l border-white/10 pl-2">
              {timeStr}
            </span>
          </div>
        </div>

        {/* Center: Global Search & Navigation Links */}
        <div className="hidden lg:flex items-center gap-3 flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-yellow-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search incidents, AMB/FIRE units, hospitals, sectors..." 
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/30 transition-all font-mono"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1"
              >
                ×
              </button>
            )}
          </div>

          {/* Quick view switchers */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10 shrink-0 text-xs font-mono">
            <button
              onClick={() => onViewChange('command')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                currentView === 'command' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Command
            </button>
            <button
              onClick={() => onViewChange('landing')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                currentView === 'landing' 
                  ? 'bg-yellow-500 text-slate-950 shadow-sm font-black' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Portal
            </button>
          </div>
        </div>

        {/* Right: Actions, Language, Demo, Audio & Roles */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Demo Mode Button (Tactical Yellow) */}
          <button
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 border border-yellow-500/50 text-xs font-bold shadow-sm transition-all active:scale-95 group"
            title="Launch 60s Simulated Emergency Scenario"
          >
            <Play className="w-3.5 h-3.5 fill-yellow-300 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Demo Mode</span>
          </button>

          {/* Report Emergency Button (Critical Red) */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black tracking-wide shadow-lg shadow-red-700/40 border border-red-400/50 transition-all active:scale-95"
          >
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>SOS Report</span>
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleSoundToggle}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:text-white' 
                : 'bg-red-950/40 border-red-800/40 text-red-400'
            }`}
            title={soundEnabled ? 'Emergency Audio Alert Chimes On' : 'Audio Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Mode Toggle (Dark EOC Tactical / Light Command Daylight) */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-all ${
              theme === 'light'
                ? 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 shadow-sm'
                : 'bg-slate-800/80 border-white/10 text-slate-300 hover:text-white hover:bg-slate-700/80'
            }`}
            title={theme === 'dark' ? 'Switch to Daylight / High-Contrast Mode' : 'Switch to Dark EOC Tactical Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-yellow-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Critical Alert Bell */}
          <button
            onClick={onOpenCriticalAlert}
            className="relative p-2 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="High Priority Critical Incidents"
          >
            <Bell className="w-4 h-4 text-yellow-400" />
            {activeCriticalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {activeCriticalCount}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <div className="relative group">
            <div className="flex items-center gap-1 bg-slate-900 border border-white/10 rounded-xl p-1 text-[11px] font-semibold text-slate-300">
              <Globe2 className="w-3.5 h-3.5 text-slate-400 ml-1" />
              {(['en', 'ta', 'hi'] as LanguageCode[]).map((l) => (
                <button
                  key={l}
                  onClick={() => onLangChange(l)}
                  className={`px-1.5 py-0.5 rounded uppercase font-bold transition-colors ${
                    lang === l ? 'bg-red-600 text-white' : 'hover:text-white text-slate-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Operator Authentication Pill & Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  soundManager.playPing();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                className="hidden md:flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 rounded-xl px-2.5 py-1 text-xs font-mono transition-all text-left shadow-sm"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                  {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden xl:block">
                  <div className="text-[11px] font-bold text-white leading-none truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] text-emerald-400 leading-tight">
                    {currentUser.badgeNumber}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#090f1d] border border-white/15 rounded-2xl p-3 shadow-2xl space-y-2.5 text-xs font-mono z-50 animate-fade-in">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                    <div className="text-white font-bold">{currentUser.name}</div>
                    <div className="text-slate-400 text-[10px] truncate">{currentUser.email}</div>
                    <div className="text-slate-400 text-[10px] pt-1 border-t border-white/5 truncate">{currentUser.department}</div>
                    <div className="text-[9px] text-emerald-300 font-bold uppercase">{currentUser.clearanceLevel}</div>
                  </div>

                  <div className="pt-1 space-y-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenLogin();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-yellow-300 font-bold flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Switch Role / Operator</span>
                      </span>
                      <span className="text-[10px] text-slate-400">6 Roles</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-red-300 font-bold flex items-center gap-2 border border-red-800/30 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Lock Terminal / Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                soundManager.playPing();
                onOpenLogin();
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono transition-all shadow-md active:scale-95"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2.5 pb-2 font-mono text-xs">
          {currentUser ? (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400">{currentUser.badgeNumber} • {currentUser.role}</div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-bold text-[10px]"
              >
                Switch Role
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-2 rounded-xl bg-emerald-600 text-white font-bold text-center"
            >
              Sign In to Terminal
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => { onViewChange('command'); setMobileMenuOpen(false); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium text-center ${
                currentView === 'command' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Command Center
            </button>
            <button
              onClick={() => { onViewChange('landing'); setMobileMenuOpen(false); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium text-center ${
                currentView === 'landing' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Public Portal
            </button>
          </div>

          {/* Mobile Theme Mode Switcher */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-white/10">
            <span className="text-slate-300 font-bold">Theme Mode</span>
            <button
              onClick={() => {
                onToggleTheme();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-bold border border-white/10 active:scale-95"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-yellow-300">Daylight Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-slate-700">Night Tactical</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

