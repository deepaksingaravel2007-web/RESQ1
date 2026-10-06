import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Incident, ResponderUnit, Hospital } from '../types';
import { 
  Layers, 
  Flame, 
  Truck, 
  ShieldAlert, 
  Building2, 
  MapPin, 
  Navigation,
  Compass,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface LiveMapProps {
  incidents: Incident[];
  responders: ResponderUnit[];
  hospitals: Hospital[];
  selectedIncident: Incident | null;
  onSelectIncident: (incident: Incident) => void;
  onOpenDispatch: (incident: Incident) => void;
  theme?: 'dark' | 'light';
}

export const LiveMap: React.FC<LiveMapProps> = ({
  incidents,
  responders,
  hospitals,
  selectedIncident,
  onSelectIncident,
  onOpenDispatch,
  theme = 'dark'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Read optional Map API keys from environment
  const googleMapsKey = 
    (import.meta as unknown as { env?: { VITE_GOOGLE_MAPS_API_KEY?: string } }).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const mapboxToken = 
    (import.meta as unknown as { env?: { VITE_MAPBOX_TOKEN?: string } }).env?.VITE_MAPBOX_TOKEN || '';

  // Base Map Layer Provider State - Default to ESRI Dark Gray (Clean, Keyless, Zero Watermarks!)
  const [baseMapProvider, setBaseMapProvider] = useState<'esri-dark' | 'osm-dark' | 'google-road' | 'google-sat' | 'mapbox'>('esri-dark');

  // Layer Toggles
  const [layers, setLayers] = useState({
    incidents: true,
    ambulances: true,
    police: true,
    fire: true,
    hospitals: true,
    shelters: true,
    safeZones: true,
    blockedRoads: true
  });

  const [layersPanelOpen, setLayersPanelOpen] = useState<boolean>(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Chennai Metropolitan Emergency Grid
    const map = L.map(mapContainerRef.current, {
      center: [13.045, 80.235],
      zoom: 12.5,
      zoomControl: false,
      attributionControl: false
    });

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Base Tile Layer Changes (ESRI Dark Gray, OSM Dark, Google Maps, Mapbox)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    // Default: ESRI World Gray Canvas (Official, completely free, no API key needed, zero watermark!)
    let tileUrl = theme === 'light'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    let options: L.TileLayerOptions = {
      maxZoom: 18,
      className: ''
    };

    if (baseMapProvider === 'osm-dark') {
      tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      options = {
        maxZoom: 19,
        className: theme === 'light' ? '' : 'dark-tiles'
      };
    } else if (baseMapProvider === 'google-road') {
      tileUrl = googleMapsKey
        ? `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${googleMapsKey}`
        : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      options = { maxZoom: 20 };
    } else if (baseMapProvider === 'google-sat') {
      tileUrl = googleMapsKey
        ? `https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${googleMapsKey}`
        : 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      options = { maxZoom: 20 };
    } else if (baseMapProvider === 'mapbox' && mapboxToken) {
      const mapboxStyle = theme === 'light' ? 'light-v11' : 'dark-v11';
      tileUrl = `https://api.mapbox.com/styles/v1/mapbox/${mapboxStyle}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`;
      options = { maxZoom: 19, tileSize: 512, zoomOffset: -1 };
    }

    const newTileLayer = L.tileLayer(tileUrl, options).addTo(map);
    newTileLayer.bringToBack();
    tileLayerRef.current = newTileLayer;
  }, [baseMapProvider, googleMapsKey, mapboxToken, theme]);

  // Pan to selected incident if updated
  useEffect(() => {
    if (mapInstanceRef.current && selectedIncident) {
      mapInstanceRef.current.setView(
        [selectedIncident.location.lat, selectedIncident.location.lng],
        14,
        { animate: true }
      );
    }
  }, [selectedIncident]);

  // Update Markers & Overlays with Red, Green, and Yellow Tactical Scheme
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. INCIDENTS LAYER (Red = Critical, Yellow = High/Moderate, Green = Resolved)
    if (layers.incidents) {
      incidents.forEach((inc) => {
        let isCrit = inc.severity === 'critical' && inc.status !== 'resolved';
        let isHigh = inc.severity === 'high' && inc.status !== 'resolved';
        let isResolved = inc.status === 'resolved';

        let markerColor = '#ef4444'; // Red (Critical)
        let ringAnim = 'animate-radar-red';
        let iconSymbol = '🔥';
        let badgeColor = 'bg-red-600 text-white';

        if (isResolved) {
          markerColor = '#10b981'; // Green (Resolved)
          ringAnim = 'animate-radar-green';
          iconSymbol = '✓';
          badgeColor = 'bg-emerald-600 text-white';
        } else if (isHigh || inc.severity === 'moderate') {
          markerColor = '#facc15'; // Yellow (Warning/High)
          ringAnim = 'animate-radar-yellow';
          iconSymbol = '⚠';
          badgeColor = 'bg-yellow-500 text-slate-900 font-black';
        }

        const iconHtml = `
          <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${isCrit ? `<div style="position: absolute; width: 38px; height: 38px; border-radius: 9999px; background: rgba(239, 68, 68, 0.45);" class="animate-radar-red"></div>` : 
              isHigh ? `<div style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background: rgba(250, 204, 21, 0.35);" class="animate-radar-yellow"></div>` : ''}
            <div style="width: 26px; height: 26px; border-radius: 9999px; background: ${markerColor}; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.8); font-size: 12px; font-weight: bold; color: ${isResolved ? '#fff' : isHigh ? '#000' : '#fff'}; z-index: 10;">
              ${iconSymbol}
            </div>
            <div style="position: absolute; top: -14px; background: rgba(5,8,17,0.92); border: 1px solid ${markerColor}; color: #f8fafc; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 6px; white-space: nowrap; font-family: monospace; box-shadow: 0 2px 6px rgba(0,0,0,0.6);">
              ${inc.id}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-incident-marker',
          iconSize: [38, 38],
          iconAnchor: [19, 19]
        });

        const marker = L.marker([inc.location.lat, inc.location.lng], { icon: customIcon });

        marker.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <b style="color: ${markerColor};">${inc.id} • ${inc.severity.toUpperCase()}</b><br/>
            ${inc.title.slice(0, 36)}...<br/>
            <span style="color: #94a3b8;">${inc.location.address}</span>
          </div>
        `, { direction: 'top', offset: [0, -16] });

        marker.on('click', () => {
          onSelectIncident(inc);
        });

        group.addLayer(marker);
      });
    }

    // 2. RESPONDERS LAYER (Green = Available, Yellow = En Route / On Scene)
    responders.forEach((resp) => {
      let isVisible = false;
      let badgeColor = '#10b981'; // Green (Available)
      let iconSymbol = '🚑';

      if (resp.type === 'ambulance' && layers.ambulances) {
        isVisible = true;
        iconSymbol = '🚑';
      } else if (resp.type === 'fire' && layers.fire) {
        isVisible = true;
        iconSymbol = '🚒';
      } else if (resp.type === 'police' && layers.police) {
        isVisible = true;
        iconSymbol = '🚓';
      } else if (resp.type === 'rescue_boat' && layers.ambulances) {
        isVisible = true;
        iconSymbol = '🚤';
      } else if (resp.type === 'drone') {
        isVisible = true;
        iconSymbol = '🛸';
      }

      if (resp.status === 'en_route' || resp.status === 'on_scene') {
        badgeColor = '#facc15'; // Yellow (Active response)
      } else if (resp.status === 'busy') {
        badgeColor = '#ef4444'; // Red (Busy)
      }

      if (isVisible) {
        const iconHtml = `
          <div style="background: rgba(6, 10, 20, 0.95); border: 1.5px solid ${badgeColor}; border-radius: 9999px; padding: 2px 7px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.85); cursor: pointer; white-space: nowrap;">
            <span style="font-size: 10px;">${iconSymbol}</span>
            <span style="font-size: 9px; font-weight: 800; color: ${badgeColor}; font-family: monospace;">${resp.id}</span>
          </div>
        `;

        const respIcon = L.divIcon({
          html: iconHtml,
          className: 'responder-marker',
          iconSize: [50, 20],
          iconAnchor: [25, 10]
        });

        const marker = L.marker([resp.location.lat, resp.location.lng], { icon: respIcon });
        marker.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <b>${resp.name}</b><br/>
            Status: <span style="color: ${badgeColor};">${resp.status.toUpperCase()}</span> | Speed: ${resp.speedKmh || 0} km/h
          </div>
        `, { direction: 'top', offset: [0, -10] });
        group.addLayer(marker);
      }
    });

    // 3. HOSPITALS LAYER (Green = High Capacity, Yellow = Moderate, Red = Critical Surge)
    if (layers.hospitals) {
      hospitals.forEach((hosp) => {
        let hospStatusColor = '#10b981'; // Green
        if (hosp.capacityPercent >= 80) {
          hospStatusColor = '#ef4444'; // Red (Surge)
        } else if (hosp.capacityPercent >= 65) {
          hospStatusColor = '#facc15'; // Yellow (High volume)
        }

        const iconHtml = `
          <div style="background: rgba(6, 10, 20, 0.95); border: 1.5px solid ${hospStatusColor}; border-radius: 9999px; padding: 2px 7px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.85); cursor: pointer; white-space: nowrap;">
            <span style="font-size: 10px;">🏥</span>
            <span style="font-size: 9px; font-weight: 700; color: #f8fafc; font-family: monospace;">${hosp.name.split(' ')[0]}</span>
            <span style="font-size: 8px; font-weight: 800; color: ${hospStatusColor}; background: rgba(255,255,255,0.06); padding: 1px 4px; border-radius: 4px;">ICU ${hosp.icuBeds.available}</span>
          </div>
        `;

        const hospIcon = L.divIcon({
          html: iconHtml,
          className: 'hospital-marker',
          iconSize: [85, 20],
          iconAnchor: [42, 10]
        });

        const marker = L.marker([hosp.location.lat, hosp.location.lng], { icon: hospIcon });
        marker.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <b>${hosp.name}</b><br/>
            ER Status: <span style="color: ${hospStatusColor};">${hosp.erStatus}</span><br/>
            ICU Beds: ${hosp.icuBeds.available} free / ${hosp.icuBeds.total} total
          </div>
        `, { direction: 'top', offset: [0, -10] });
        group.addLayer(marker);
      });
    }

    // 4. SAFE ZONES (Operational Green)
    if (layers.safeZones) {
      const safeCircle = L.circle([13.0100, 80.2500], {
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.14,
        radius: 1200,
        dashArray: '4, 6'
      });
      safeCircle.bindTooltip('SAFE EVACUATION ZONE: Adyar Sector (Green Zone)', { permanent: false });
      group.addLayer(safeCircle);
    }

    // 5. BLOCKED ROADS (Alert Red)
    if (layers.blockedRoads) {
      const blockedPoly = L.polyline([
        [12.9820, 80.2150],
        [12.9780, 80.2190],
        [12.9750, 80.2220]
      ], {
        color: '#ef4444',
        weight: 5,
        opacity: 0.9,
        dashArray: '6, 8'
      });
      blockedPoly.bindTooltip('ROAD BLOCKED: 4ft Water Inundation (Hazard Red)', { permanent: false });
      group.addLayer(blockedPoly);
    }

    // 6. ROUTE LINE FOR SELECTED INCIDENT (High-visibility Yellow / Amber)
    if (selectedIncident && selectedIncident.assignedUnits.length > 0) {
      const firstUnit = responders.find(r => r.id === selectedIncident.assignedUnits[0]);
      if (firstUnit) {
        const routeLine = L.polyline([
          [firstUnit.location.lat, firstUnit.location.lng],
          [selectedIncident.location.lat, selectedIncident.location.lng]
        ], {
          color: '#facc15',
          weight: 4,
          opacity: 0.95,
          dashArray: '8, 6'
        });
        group.addLayer(routeLine);
      }
    }

  }, [incidents, responders, hospitals, layers, selectedIncident, onSelectIncident]);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([13.045, 80.235], 12.5, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-[#060a14] shadow-2xl">
      
      {/* Leaflet container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px] z-0" />

      {/* Floating Map HUD Top Left: Sector & Quick stats in Red, Green & Yellow */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 font-mono text-xs">
        <div className="flex items-center gap-2.5 bg-[#060a16]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-red-500/30 shadow-lg text-slate-200">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-extrabold text-white">CHENNAI GRID</span>
          <span className="text-yellow-400 font-bold border-l border-white/15 pl-2.5">
            {incidents.filter(i => i.status !== 'resolved').length} Active
          </span>
          <span className="text-emerald-400 font-bold border-l border-white/15 pl-2.5">
            {responders.filter(r => r.status === 'available').length} Free
          </span>
        </div>

        <button
          onClick={handleResetView}
          className="bg-[#060a16]/95 backdrop-blur-md p-2 rounded-xl border border-white/10 text-slate-300 hover:text-white shadow-lg transition-all"
          title="Recenter Map View"
        >
          <Compass className="w-4 h-4 text-yellow-400" />
        </button>
      </div>

      {/* Floating Map HUD Top Right: Layers & Base Map Engine Selector */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => setLayersPanelOpen(!layersPanelOpen)}
          className="flex items-center gap-2 bg-[#060a16]/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg text-xs font-semibold text-slate-200 hover:text-white transition-all"
        >
          <Layers className="w-4 h-4 text-yellow-400" />
          <span>Map Controls ({Object.values(layers).filter(Boolean).length}/8)</span>
        </button>

        {layersPanelOpen && (
          <div className="mt-2 w-60 bg-[#060a16]/98 backdrop-blur-2xl border border-white/15 rounded-2xl p-3.5 shadow-2xl space-y-2 text-xs font-mono animate-fade-in">
            
            {/* Base Map Engine Selector (Clean, Free, No Watermark!) */}
            <div className="text-[10px] text-yellow-400 uppercase tracking-widest font-bold pb-1 border-b border-white/10">
              MAP BASE ENGINE
            </div>
            <div className="space-y-1 pb-2 border-b border-white/10">
              {[
                { id: 'esri-dark', label: 'ESRI Dark Gray (Free & Clean)', badge: 'Active' },
                { id: 'osm-dark', label: 'OpenStreetMap Dark (Free)', badge: 'Ready' },
                { id: 'google-road', label: 'Google Maps (Roads)', badge: googleMapsKey ? 'Key Set' : 'Optional' },
                { id: 'google-sat', label: 'Google Satellite', badge: googleMapsKey ? 'Key Set' : 'Optional' },
                { id: 'mapbox', label: 'Mapbox Navigation', badge: mapboxToken ? 'Key Set' : 'Optional' }
              ].map(provider => (
                <button
                  key={provider.id}
                  onClick={() => {
                    if (provider.id.startsWith('google') && !googleMapsKey) {
                      alert('Google Maps tiles will render. If needed, configure VITE_GOOGLE_MAPS_API_KEY in .env.');
                    }
                    setBaseMapProvider(provider.id as typeof baseMapProvider);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-mono flex items-center justify-between transition-colors ${
                    baseMapProvider === provider.id
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{provider.label}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded ${
                    baseMapProvider === provider.id ? 'bg-white/20 text-white' : 'text-emerald-400'
                  }`}>
                    {provider.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Tactical Layers Toggle in Red, Green & Yellow */}
            <div className="text-[10px] text-yellow-400 uppercase tracking-widest font-bold pb-1 border-b border-white/10">
              TACTICAL LAYERS
            </div>

            {[
              { id: 'incidents', label: 'Live Incidents', color: 'text-red-400' },
              { id: 'ambulances', label: 'Ambulances (ALS/BLS)', color: 'text-emerald-400' },
              { id: 'police', label: 'Police Patrol & Corridors', color: 'text-yellow-400' },
              { id: 'fire', label: 'Fire Tenders & Aerial', color: 'text-red-400' },
              { id: 'hospitals', label: 'Hospitals & Trauma ICUs', color: 'text-emerald-400' },
              { id: 'safeZones', label: 'Safe Evacuation Zones', color: 'text-emerald-300' },
              { id: 'blockedRoads', label: 'Blocked Inundation Roads', color: 'text-red-400' }
            ].map(l => (
              <label 
                key={l.id} 
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-slate-200"
              >
                <span className={`flex items-center gap-2 ${l.color}`}>
                  <span>{l.label}</span>
                </span>
                <input
                  type="checkbox"
                  checked={layers[l.id as keyof typeof layers]}
                  onChange={() => toggleLayer(l.id as keyof typeof layers)}
                  className="rounded bg-slate-800 border-white/20 text-red-600 focus:ring-0 cursor-pointer"
                />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Left Legend: Red, Green & Yellow Status System */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-4 bg-[#060a16]/95 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg text-[11px] font-mono text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 font-bold">Critical (Red)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="text-yellow-300 font-bold">Warning/Active (Yellow)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-emerald-300 font-bold">Safe/Ready (Green)</span>
        </div>
      </div>

    </div>
  );
};
