import React, { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  HeartPulse, 
  Wrench, 
  Users, 
  Home, 
  Plus, 
  Search, 
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { EmergencyResource } from '../types';
import { soundManager } from '../utils/audio';

interface ResourceManagementProps {
  resources: EmergencyResource[];
  onDeployResource: (id: string, count: number) => void;
}

export const ResourceManagement: React.FC<ResourceManagementProps> = ({
  resources,
  onDeployResource
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = resources.filter(r => {
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.location.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const lowStockItems = resources.filter(r => r.status === 'low_stock' || r.status === 'critical');

  const handleRequisition = (r: EmergencyResource) => {
    soundManager.playDispatchSquelch();
    alert(`Requisition request submitted for ${r.name}. Dispatching replenishment from State Disaster Logistics Depot.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            DISASTER LOGISTICS &amp; RESOURCE MANAGEMENT
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            CRITICAL STOCK SURVEILLANCE • MOBILE DEPOT ASSETS • REQUISITION MATRIX
          </p>
        </div>

        {/* Global Stock Stats */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300">
            Total Inventory: <b className="text-white">{resources.length} SKUs</b>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-400">
            Low Stock: <b>{resources.filter(r => r.status === 'low_stock').length}</b>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400">
            Critical Shortage: <b>{resources.filter(r => r.status === 'critical').length}</b>
          </div>
        </div>
      </div>

      {/* Low-Stock High-Priority Warning Banner */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 via-amber-950/40 to-slate-900/60 border border-red-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                CRITICAL INVENTORY ALERT
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {lowStockItems.map(item => `${item.name} (${item.available} ${item.unit} remaining)`).join(' • ')}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playEmergencyAlarm();
              alert('Emergency requisition dispatched to Tamil Nadu Medical Services Corporation (TNMSC).');
            }}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg transition-all shrink-0"
          >
            Emergency Requisition
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#090f1e] border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="medical">Medical Supplies &amp; Blood</option>
            <option value="equipment">Rescue Equipment</option>
            <option value="personnel">Active Duty Personnel</option>
            <option value="shelter">Evacuation Shelters</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resource or depot..."
              className="bg-slate-900 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none w-56"
            />
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playPing();
            alert('Custom Resource Entry modal (Demo simulated).');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const usedPercent = Math.round((item.inUse / item.total) * 100);

          return (
            <div key={item.id} className="double-bezel-shell hover:border-white/20 transition-all">
              <div className="double-bezel-core p-4.5 space-y-3.5 flex flex-col justify-between h-full">
                
                <div>
                  {/* Top Status & Category */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                      {item.category.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      item.status === 'critical' ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' :
                      item.status === 'low_stock' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Resource Name */}
                  <h3 className="font-bold text-sm text-white leading-snug">{item.name}</h3>
                  <div className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                    📍 {item.location}
                  </div>
                </div>

                {/* Stock Numbers & Utilization Bar */}
                <div className="space-y-2 pt-2 border-t border-white/5 font-mono">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-400">Available:</span>
                    <span className={`text-base font-black ${
                      item.status === 'critical' ? 'text-red-400' :
                      item.status === 'low_stock' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {item.available.toLocaleString()} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>In Use: {item.inUse.toLocaleString()}</span>
                    <span>Total: {item.total.toLocaleString()}</span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        usedPercent > 85 ? 'bg-red-500' : usedPercent > 65 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${usedPercent}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-slate-500">Updated {item.lastUpdated}</span>
                  <button
                    onClick={() => handleRequisition(item)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white border border-white/10 flex items-center gap-1 transition-colors"
                  >
                    <span>Requisition</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

