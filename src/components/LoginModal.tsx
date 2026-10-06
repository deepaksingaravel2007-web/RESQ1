import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  Building2, 
  Radio, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Flame, 
  Fingerprint, 
  ShieldCheck,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { mockAuthUsers } from '../data/mockData';
import { soundManager } from '../utils/audio';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout
}) => {
  if (!isOpen) return null;

  // Active Login Mode: 'quick_roles' or 'manual_creds'
  const [authMode, setAuthMode] = useState<'quick_roles' | 'manual_creds'>('quick_roles');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser ? currentUser.role : 'control_officer');
  
  // Manual credentials form state
  const [emailOrBadge, setEmailOrBadge] = useState<string>('officer.raman@resq.gov.in');
  const [password, setPassword] = useState<string>('••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberTerminal, setRememberTerminal] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRoleCardClick = (user: AuthUser) => {
    soundManager.playPing();
    setSelectedRole(user.role);
    setEmailOrBadge(user.email);
  };

  const handleQuickLoginSubmit = (user: AuthUser) => {
    soundManager.playSuccess();
    onLogin(user);
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    soundManager.playPing();

    setTimeout(() => {
      // Find matching mock user by email, badge or role
      const matched = mockAuthUsers.find(
        u => u.email.toLowerCase() === emailOrBadge.trim().toLowerCase() ||
             u.badgeNumber.toLowerCase() === emailOrBadge.trim().toLowerCase() ||
             u.name.toLowerCase().includes(emailOrBadge.trim().toLowerCase())
      ) || mockAuthUsers.find(u => u.role === selectedRole) || mockAuthUsers[0];

      soundManager.playSuccess();
      setIsSubmitting(false);
      onLogin(matched);
      onClose();
    }, 450);
  };

  const handleLogoutAction = () => {
    soundManager.playDispatchSquelch();
    onLogout();
    onClose();
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'control_officer':
        return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'responder':
        return <Truck className="w-5 h-5 text-emerald-400" />;
      case 'hospital':
        return <Building2 className="w-5 h-5 text-emerald-400" />;
      case 'police_fire':
        return <Flame className="w-5 h-5 text-yellow-400" />;
      case 'citizen':
        return <UserCheck className="w-5 h-5 text-yellow-300" />;
      case 'admin':
        return <Radio className="w-5 h-5 text-red-400" />;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'control_officer':
        return 'border-red-500/40 bg-red-950/40 text-red-300';
      case 'responder':
        return 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300';
      case 'hospital':
        return 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300';
      case 'police_fire':
        return 'border-yellow-500/40 bg-yellow-950/40 text-yellow-300';
      case 'citizen':
        return 'border-yellow-500/40 bg-yellow-950/40 text-yellow-300';
      case 'admin':
        return 'border-red-500/40 bg-red-950/40 text-red-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto font-sans">
      
      {/* Outer Tactical Card Container */}
      <div className="relative w-full max-w-2xl bg-[#080d1b] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto double-bezel-shell">
        <div className="double-bezel-core">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 bg-[#0c1426] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-950/70 border border-red-500/40 flex items-center justify-center text-red-400 shadow-lg shadow-red-950">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white uppercase tracking-wider font-mono">
                    RESQ SECURE TERMINAL
                  </h2>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    ● Encrypted ISO 22301
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-400">
                  Mission-Critical Emergency Operations Center (EOC 112)
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

          {/* Currently Logged In Banner (if active) */}
          {currentUser && (
            <div className="px-6 py-3 bg-[#0a1122] border-b border-white/10 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400">Authenticated Terminal Session:</span>
                <span className="font-bold text-white">{currentUser.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {currentUser.badgeNumber}
                </span>
              </div>
              <button
                onClick={handleLogoutAction}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-[11px] font-bold transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}

          {/* Mode Selector Tabs (Quick Role Switch vs Manual Form) */}
          <div className="flex border-b border-white/10 bg-[#080d1b] text-xs font-mono">
            <button
              onClick={() => { soundManager.playPing(); setAuthMode('quick_roles'); }}
              className={`flex-1 py-3 px-4 text-center font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
                authMode === 'quick_roles'
                  ? 'border-yellow-400 text-yellow-300 bg-yellow-950/15'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Fingerprint className="w-4 h-4 text-yellow-400" />
              <span>1-Click Role Login (Demo &amp; Testing)</span>
            </button>

            <button
              onClick={() => { soundManager.playPing(); setAuthMode('manual_creds'); }}
              className={`flex-1 py-3 px-4 text-center font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${
                authMode === 'manual_creds'
                  ? 'border-red-500 text-red-300 bg-red-950/15'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <KeyRound className="w-4 h-4 text-red-400" />
              <span>Badge ID / Password Credentials</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            
            {/* TAB 1: 1-Click Role Login Cards */}
            {authMode === 'quick_roles' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 uppercase tracking-wider font-bold">
                    SELECT OPERATIONAL IDENTITY TO LOGIN
                  </span>
                  <span className="text-emerald-400">All 6 System Roles Available</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {mockAuthUsers.map((user) => {
                    const isSelected = selectedRole === user.role;

                    return (
                      <div
                        key={user.id}
                        onClick={() => handleRoleCardClick(user)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#0e172a] border-yellow-400/80 shadow-lg shadow-yellow-950/40 ring-1 ring-yellow-400/40'
                            : 'bg-slate-900/80 border-white/10 hover:border-white/20 hover:bg-slate-900'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-xl bg-slate-800/90 border border-white/10 group-hover:scale-105 transition-transform">
                                {getRoleIcon(user.role)}
                              </div>
                              <div>
                                <h3 className="text-xs font-bold text-white group-hover:text-yellow-300 transition-colors">
                                  {user.name}
                                </h3>
                                <p className="text-[10px] text-slate-400 font-mono">
                                  {user.badgeNumber}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
                            )}
                          </div>

                          <div className="text-[11px] text-slate-300 font-mono line-clamp-1">
                            {user.department}
                          </div>

                          <div className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase w-fit border ${getRoleBadgeColor(user.role)}`}>
                            {user.clearanceLevel}
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-400">{user.email}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickLoginSubmit(user);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all active:scale-95 flex items-center gap-1"
                          >
                            <span>Enter</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Login Button with Selected Role */}
                <button
                  type="button"
                  onClick={() => {
                    const chosen = mockAuthUsers.find(u => u.role === selectedRole) || mockAuthUsers[0];
                    handleQuickLoginSubmit(chosen);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-red-950/60 border border-red-400/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Fingerprint className="w-4 h-4 text-amber-200" />
                  <span>AUTHENTICATE AS {selectedRole.replace('_', ' ').toUpperCase()}</span>
                </button>
              </div>
            )}

            {/* TAB 2: Manual Credentials Form */}
            {authMode === 'manual_creds' && (
              <form onSubmit={handleManualSubmit} className="space-y-4">
                
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs font-mono text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Email or Service Badge Input */}
                <div className="space-y-1.5 font-mono">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Service Email / Badge Number
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-yellow-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={emailOrBadge}
                      onChange={(e) => setEmailOrBadge(e.target.value)}
                      placeholder="e.g. officer.raman@resq.gov.in or EOC-CMD-001"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Use any demo email or badge number from the 1-Click tab.
                  </p>
                </div>

                {/* Password / Emergency PIN */}
                <div className="space-y-1.5 font-mono">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Terminal Security PIN / Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-red-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter security PIN (Demo accepts any PIN)"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Terminal Checkbox */}
                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={rememberTerminal}
                      onChange={(e) => setRememberTerminal(e.target.checked)}
                      className="rounded bg-slate-800 border-white/20 text-red-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Remember terminal authentication</span>
                  </label>
                  <span className="text-[10px] text-emerald-400">2FA Verified</span>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-red-950/60 border border-red-400/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4 text-amber-200" />
                  <span>{isSubmitting ? 'VERIFYING CREDENTIALS...' : 'AUTHENTICATE & ENTER TERMINAL'}</span>
                </button>
              </form>
            )}

          </div>

          {/* Footer Security Advisory */}
          <div className="px-6 py-3 bg-[#070c18] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-yellow-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>OFFICIAL USE ONLY • UNLAWFUL ACCESS PROSECUTED UNDER IT ACT 2000</span>
            </span>
            <span className="text-slate-500">RESQ v4.8 SECURE GATEWAY</span>
          </div>

        </div>
      </div>

    </div>
  );
};

