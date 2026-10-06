export type EmergencyType = 
  | 'medical' 
  | 'fire' 
  | 'accident' 
  | 'flood' 
  | 'earthquake' 
  | 'disaster' 
  | 'crime' 
  | 'other';

export type SeverityLevel = 'critical' | 'high' | 'moderate' | 'low';

export type IncidentStatus = 
  | 'reported' 
  | 'verifying' 
  | 'dispatching' 
  | 'en_route' 
  | 'on_scene' 
  | 'transporting' 
  | 'resolved';

export interface LocationCoordinate {
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
  city: string;
  district: string;
}

export interface IncidentTimelineEvent {
  id: string;
  time: string;
  timestamp: number;
  title: string;
  description: string;
  actor: string;
  type: 'report' | 'verify' | 'dispatch' | 'en_route' | 'on_scene' | 'hospital' | 'resolved';
}

export interface Incident {
  id: string;
  type: EmergencyType;
  title: string;
  description: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  location: LocationCoordinate;
  peopleAffected: string | number;
  reportedAt: string;
  timestamp: number;
  assignedUnits: string[];
  nearestHospitalId?: string;
  etaMinutes?: number;
  callerPhone?: string;
  callerName?: string;
  source: 'citizen_app' | 'iot_sensor' | 'cctv_ai' | '112_hotline';
  timeline: IncidentTimelineEvent[];
  resourcesRequired?: string[];
  notes?: string;
}

export type ResponderType = 'ambulance' | 'fire' | 'police' | 'rescue_boat' | 'drone';
export type ResponderStatus = 'available' | 'dispatched' | 'en_route' | 'on_scene' | 'busy' | 'offline';

export interface ResponderUnit {
  id: string;
  callsign: string;
  name: string;
  type: ResponderType;
  subType: string;
  status: ResponderStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  assignedIncidentId?: string;
  personnelCount: number;
  equipment: string[];
  fuelPercent: number;
  speedKmh?: number;
  contactNumber: string;
  etaToTargetMinutes?: number;
}

export interface Hospital {
  id: string;
  name: string;
  type: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  capacityPercent: number;
  icuBeds: {
    total: number;
    available: number;
  };
  generalBeds: {
    total: number;
    available: number;
  };
  ventilators: {
    total: number;
    available: number;
  };
  bloodAvailability: {
    [key: string]: 'Surplus' | 'Adequate' | 'Low' | 'Critical';
  };
  erStatus: 'Normal' | 'High Volume' | 'Near Capacity' | 'Critical Surge';
  ambulanceBays: {
    total: number;
    occupied: number;
  };
  contactPhone: string;
  distanceKm?: number;
  etaMinutes?: number;
}

export interface EmergencyResource {
  id: string;
  name: string;
  category: 'vehicles' | 'medical' | 'equipment' | 'personnel' | 'shelter';
  total: number;
  available: number;
  inUse: number;
  unit: string;
  status: 'available' | 'low_stock' | 'critical';
  location: string;
  lastUpdated: string;
}

export interface PublicAlert {
  id: string;
  title: string;
  category: 'weather' | 'flood' | 'fire' | 'earthquake' | 'safety' | 'medical' | 'traffic' | 'disaster';
  severity: 'critical' | 'high' | 'warning' | 'info';
  message: {
    en: string;
    ta: string;
    hi: string;
  };
  targetArea: string;
  targetType: 'city' | 'district' | 'radius' | 'polygon';
  radiusKm?: number;
  issuedAt: string;
  expiresAt: string;
  authority: string;
  active: boolean;
  reachCount: number;
}

export type UserRole = 
  | 'citizen' 
  | 'responder' 
  | 'hospital' 
  | 'police_fire' 
  | 'control_officer' 
  | 'admin';

export type LanguageCode = 'en' | 'ta' | 'hi';
export type ThemeMode = 'dark' | 'light';

export interface SystemStats {
  activeIncidents: number;
  criticalIncidents: number;
  respondersActive: number;
  availableAmbulances: number;
  hospitalCapacityPercent: number;
  avgResponseTimeMin: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badgeNumber: string;
  department: string;
  clearanceLevel: string;
  avatar?: string;
  phoneNumber?: string;
  stationOrUnit?: string;
}
