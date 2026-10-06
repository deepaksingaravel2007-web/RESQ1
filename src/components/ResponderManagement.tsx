import React, { useState } from 'react';
import { 
  Truck, 
  Flame, 
  ShieldAlert, 
  Compass, 
  BatteryMedium, 
  Gauge, 
  Users, 
  PhoneCall, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Radio,
  SlidersHorizontal,
  LayoutGrid,
  List
} from 'lucide-react';
import { ResponderUnit, ResponderStatus, ResponderType } from '../types';
import { soundManager } from '../utils/audio';

interface ResponderManagementProps {
  responders: ResponderUnit[];
  onUpdateStatus: (unitId: string, newStatus: ResponderStatus) => void;
}

export const ResponderManagement: React.FC<ResponderManagementProps> = ({
  responders,
  onUpdateStatus
}) => {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filter logic
  const filtered = responders.filter(r => {
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesSearch = 
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.callsign.toLowerCase().includes(search.toLowerCase()) ||
      r.equipment.some(e => e.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ResponderStatus) => {
    switch (status) {
      case 'available':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">AVAILABLE</span>;
      case 'en_route':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-950 text-yellow-300 border border-yellow-700 animate-pulse">EN ROUTE</span>;
      case 'dispatched':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-700">DISPATCHED</span>;
      case 'on_scene':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">ON SCENE</span>;
      case 'busy':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950/70 text-red-300 border border-red-800">BUSY</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-slate-500 border border-slate-700">OFFLINE</span>;
    }
  };

  const getUnitIcon = (type: ResponderType) => {
    switch (type) {
      case 'ambulance':
        return <Truck className="w-4 h-4 text-emerald-400" />;
      case 'fire':
        return <Flame className="w-4 h-4 text-red-400" />;
      case 'police':
        return <ShieldAlert className="w-4 h-4 text-yellow-400" />;
      default:
        return <Radio className="w-4 h-4 text-emerald-300" />;
    }
  };

  const handleCallUnit = (r: ResponderUnit) => {
    soundManager.playDispatchSquelch();
    alert(`Connecting Secure Line to ${r.callsign} (${r.contactNumber})...`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            RESPONSE FLEET TELEMETRY
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            LIVE GPS COORDINATION • ENCRYPTED DMR / VHF SATELLITE COMMS
          </p>
        </div>

        {/* Fleet KPI Quick Strip */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300">
            Total: <b className="text-white">{responders.length}</b>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
            Available: <b>{responders.filter(r => r.status === 'available').length}</b>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            Active: <b>{responders.filter(r => r.status === 'en_route' || r.status === 'on_scene').length}</b>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#090f1e] border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none"
          >
            <option value="all">All Vehicle Types</option>
            <option value="ambulance">Ambulances</option>
            <option value="fire">Fire Tenders</option>
            <option value="police">Police Patrols</option>
            <option value="rescue_boat">Rescue Crafts</option>
            <option value="drone">Aerial Drones</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="en_route">En Route</option>
            <option value="on_scene">On Scene</option>
            <option value="dispatched">Dispatched</option>
            <option value="busy">Busy</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, callsign, equipment..."
              className="bg-slate-900 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none w-52"
            />
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === 'cards' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === 'table' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-[#090f1e] border border-white/10">
          <p className="text-sm font-mono text-slate-400">No response units match current filters.</p>
        </div>
      )}

      {/* Card Grid View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((resp) => (
            <div key={resp.id} className="double-bezel-shell hover:border-white/20 transition-all">
              <div className="double-bezel-core p-4.5 space-y-3.5">
                
                {/* Card Top: Icon, ID, Callsign, Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                      {getUnitIcon(resp.type)}
                    </div>
                    <div>
                      <div className="font-mono font-bold text-sm text-white flex items-center gap-2">
                        <span>{resp.id}</span>
                        <span className="text-[10px] font-normal text-slate-400">({resp.subType})</span>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400">{resp.callsign}</div>
                    </div>
                  </div>
                  <div>{getStatusBadge(resp.status)}</div>
                </div>

                {/* Location & Speed */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 text-xs font-mono space-y-1">
                  <div className="text-slate-300 truncate">📍 {resp.location.address}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                    <span>Speed: <b className="text-white">{resp.speedKmh || 0} km/h</b></span>
                    <span>Fuel: <b className="text-emerald-400">{resp.fuelPercent}%</b></span>
                    <span>Crew: <b className="text-white">{resp.personnelCount}</b></span>
                  </div>
                </div>

                {/* Equipment Pills */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    ONBOARD EQUIPMENT
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {resp.equipment.slice(0, 3).map((eq, i) => (
                      <span key={i} className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-slate-300 border border-white/5">
                        {eq}
                      </span>
                    ))}
                    {resp.equipment.length > 3 && (
                      <span className="text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-slate-400">
                        +{resp.equipment.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions & Status Override */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <select
                    value={resp.status}
                    onChange={(e) => onUpdateStatus(resp.id, e.target.value as ResponderStatus)}
                    className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-[11px] font-mono text-slate-300 focus:outline-none"
                  >
                    <option value="available">Set Available</option>
                    <option value="en_route">Set En Route</option>
                    <option value="on_scene">Set On Scene</option>
                    <option value="busy">Set Busy</option>
                    <option value="offline">Set Offline</option>
                  </select>

                  <button
                    onClick={() => handleCallUnit(resp)}
                    className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs flex items-center gap-1 font-mono transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Radio</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="double-bezel-shell overflow-hidden">
          <div className="double-bezel-core overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-slate-300">
              <thead className="bg-[#0c1426] text-slate-400 text-[10px] uppercase border-b border-white/10">
                <tr>
                  <th className="p-3.5">Unit ID</th>
                  <th className="p-3.5">Type &amp; Callsign</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Speed / Fuel</th>
                  <th className="p-3.5">Equipment</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((resp) => (
                  <tr key={resp.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      {getUnitIcon(resp.type)}
                      <span>{resp.id}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-white">{resp.name}</div>
                      <div className="text-[10px] text-cyan-400">{resp.callsign}</div>
                    </td>
                    <td className="p-3.5">{getStatusBadge(resp.status)}</td>
                    <td className="p-3.5 max-w-[200px] truncate">{resp.location.address}</td>
                    <td className="p-3.5">
                      <div>{resp.speedKmh || 0} km/h</div>
                      <div className="text-[10px] text-emerald-400">{resp.fuelPercent}% fuel</div>
                    </td>
                    <td className="p-3.5 text-[10px] text-slate-400 max-w-[180px] truncate">
                      {resp.equipment.join(', ')}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleCallUnit(resp)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] border border-white/10"
                      >
                        Radio Line
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

