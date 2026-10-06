import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Calendar, 
  Activity, 
  Filter, 
  ShieldAlert 
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const IncidentAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D' | '3M' | '1Y'>('24H');

  const handleTimeRangeChange = (range: '24H' | '7D' | '30D' | '3M' | '1Y') => {
    soundManager.playPing();
    setTimeRange(range);
  };

  // 1. Incidents By Type
  const incidentsByTypeData = [
    { name: 'Medical', count: 42, color: '#ef4444' },
    { name: 'Accident', count: 31, color: '#f97316' },
    { name: 'Fire', count: 18, color: '#eab308' },
    { name: 'Flood', count: 12, color: '#06b6d4' },
    { name: 'Disaster', count: 8, color: '#a855f7' },
    { name: 'Crime', count: 14, color: '#6366f1' }
  ];

  // 2. Response Time Trends (Minutes)
  const responseTrendsData = [
    { time: '00:00', target: 8.0, actual: 6.4 },
    { time: '04:00', target: 8.0, actual: 5.8 },
    { time: '08:00', target: 8.0, actual: 9.2 },
    { time: '12:00', target: 8.0, actual: 8.6 },
    { time: '16:00', target: 8.0, actual: 10.4 },
    { time: '20:00', target: 8.0, actual: 8.4 },
    { time: 'Now', target: 8.0, actual: 7.1 }
  ];

  // 3. Peak Emergency Hours (Hour vs Incident Count)
  const peakHoursData = [
    { hour: '02h', count: 4 },
    { hour: '05h', count: 3 },
    { hour: '08h', count: 14 },
    { hour: '11h', count: 19 },
    { hour: '14h', count: 16 },
    { hour: '17h', count: 26 },
    { hour: '20h', count: 28 },
    { hour: '23h', count: 11 }
  ];

  // 4. District Hotspot Frequency
  const districtHotspots = [
    { name: 'T Nagar / Panagal', incidents: 34, severityIndex: 'Critical', avgEta: '5.2m' },
    { name: 'Anna Salai Corridor', incidents: 28, severityIndex: 'Critical', avgEta: '6.1m' },
    { name: 'Velachery Lowland', incidents: 22, severityIndex: 'High', avgEta: '7.8m' },
    { name: 'Guindy Kathipara', incidents: 19, severityIndex: 'High', avgEta: '5.9m' },
    { name: 'Manali Industrial', incidents: 11, severityIndex: 'Critical', avgEta: '9.4m' },
    { name: 'Adyar / Besant Nagar', incidents: 10, severityIndex: 'Moderate', avgEta: '4.8m' }
  ];

  const pieColors = ['#ef4444', '#f97316', '#eab308', '#06b6d4', '#a855f7', '#6366f1'];

  return (
    <div className="space-y-6">
      
      {/* Top Header & Range Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            INCIDENT INTELLIGENCE &amp; AUDIT METRICS
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            RESPONSE VELOCITY • HOTSPOT CLUSTERING • RESOURCE CONSUMPTION PATTERNS
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1 bg-[#090f1e] p-1 rounded-2xl border border-white/10 font-mono text-xs">
          {(['24H', '7D', '30D', '3M', '1Y'] as const).map(range => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                timeRange === range ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Incidents Logged', value: '125', trend: '+12% vs prior wk', color: 'text-white' },
          { label: 'Median Response Time', value: '07m 14s', trend: '-45s target beat', color: 'text-emerald-400' },
          { label: 'ICU Handover Latency', value: '03m 40s', trend: 'Apex Trauma Bays', color: 'text-cyan-400' },
          { label: 'Dispatch Precision Score', value: '98.6%', trend: 'Multi-Agency Synced', color: 'text-purple-400' }
        ].map((kpi, i) => (
          <div key={i} className="double-bezel-shell">
            <div className="double-bezel-core p-4 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                {kpi.label}
              </span>
              <div className={`text-2xl font-black font-mono ${kpi.color}`}>
                {kpi.value}
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>{kpi.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1: Response Time Trends & Peak Emergency Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Response Time Trends Chart */}
        <div className="double-bezel-shell">
          <div className="double-bezel-core p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div>
                <h3 className="font-bold text-sm text-white">Mean Response Time vs SLA Target</h3>
                <p className="text-[11px] font-mono text-slate-400">Target Benchmark: 8.0 min (112 Mandate)</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">
                SLA Compliance: 91.2%
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={responseTrendsData}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="m" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090f1e', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="actual" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" name="Actual (min)" />
                  <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1.5} dot={false} name="Target SLA" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Peak Hours Histogram */}
        <div className="double-bezel-shell">
          <div className="double-bezel-core p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div>
                <h3 className="font-bold text-sm text-white">Diurnal Peak Emergency Distribution</h3>
                <p className="text-[11px] font-mono text-slate-400">Peak Surge: 17:00 - 20:30 (Evening Commute)</p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800">
                Shift Surge Active
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHoursData}>
                  <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090f1e', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} name="Incident Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Charts Row 2: Incidents by Category & Hotspot Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Incidents by Type Pie/Bar */}
        <div className="double-bezel-shell lg:col-span-1">
          <div className="double-bezel-core p-5 space-y-4">
            <h3 className="font-bold text-sm text-white pb-2 border-b border-white/5">
              Incidents By Classification
            </h3>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentsByTypeData}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {incidentsByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090f1e', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
              {incidentsByTypeData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[idx] }} />
                  <span className="truncate">{item.name}: <b className="text-white">{item.count}</b></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* District Hotspot Table */}
        <div className="double-bezel-shell lg:col-span-2">
          <div className="double-bezel-core p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="font-bold text-sm text-white">Geographic Vulnerability Hotspots (Chennai Sector)</h3>
              <span className="text-[11px] font-mono text-slate-400">Calculated over past 30 days</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs text-slate-300">
                <thead className="bg-[#0c1426] text-slate-400 text-[10px] uppercase border-b border-white/10">
                  <tr>
                    <th className="p-2.5">Sector Cluster</th>
                    <th className="p-2.5">Incidents</th>
                    <th className="p-2.5">Severity</th>
                    <th className="p-2.5">Avg ETA</th>
                    <th className="p-2.5 text-right">Preemptive Staging</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {districtHotspots.map((h, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-2.5 font-bold text-white flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span>{h.name}</span>
                      </td>
                      <td className="p-2.5">{h.incidents} cases</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          h.severityIndex === 'Critical' ? 'bg-red-950 text-red-400 border border-red-800' :
                          h.severityIndex === 'High' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                          'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {h.severityIndex}
                        </span>
                      </td>
                      <td className="p-2.5 text-emerald-400 font-bold">{h.avgEta}</td>
                      <td className="p-2.5 text-right">
                        <span className="text-[10px] text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                          +1 Unit Dispatched
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

