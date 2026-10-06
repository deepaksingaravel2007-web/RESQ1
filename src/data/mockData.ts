import { Incident, ResponderUnit, Hospital, EmergencyResource, PublicAlert, SystemStats, AuthUser } from '../types';

export const initialIncidents: Incident[] = [
  {
    id: 'RX-20481',
    type: 'medical',
    title: 'Multi-Vehicle Collision with Severe Trauma',
    description: 'Two cars and a bus involved at Anna Salai junction. Multiple passengers with critical head and limb injuries. Traffic blocked in northbound lane.',
    severity: 'critical',
    status: 'en_route',
    location: {
      lat: 13.0418,
      lng: 80.2341,
      address: 'Anna Salai near Panagal Park Signal, T Nagar',
      landmark: 'Near Usman Road Flyover',
      city: 'Chennai',
      district: 'Chennai Central'
    },
    peopleAffected: 3,
    reportedAt: '19:42:18',
    timestamp: Date.now() - 1000 * 60 * 14,
    assignedUnits: ['AMB-04', 'POL-12', 'FIRE-03'],
    nearestHospitalId: 'HOSP-01',
    etaMinutes: 4,
    callerPhone: '+91 98401 22910',
    callerName: 'Rajesh Sundaram',
    source: '112_hotline',
    resourcesRequired: ['ALS Ambulance', 'Hydraulic Spreader', 'Traffic Escort'],
    timeline: [
      {
        id: 'tl-1',
        time: '19:42:18',
        timestamp: Date.now() - 1000 * 60 * 14,
        title: 'Emergency Reported',
        description: 'Call received through 112 Command Switchboard. Critical trauma detected.',
        actor: 'Citizen Call (Rajesh S.)',
        type: 'report'
      },
      {
        id: 'tl-2',
        time: '19:43:05',
        timestamp: Date.now() - 1000 * 60 * 13,
        title: 'Location & AI Severity Verified',
        description: 'Auto-triaged by RESQ Engine. GPS pinned to Anna Salai junction.',
        actor: 'RESQ Triage Engine',
        type: 'verify'
      },
      {
        id: 'tl-3',
        time: '19:43:40',
        timestamp: Date.now() - 1000 * 60 * 12,
        title: 'Ambulance & Fire Dispatched',
        description: 'AMB-04 and FIRE-03 dispatched with priority sirens enabled.',
        actor: 'EOC Dispatcher S. Kumar',
        type: 'dispatch'
      },
      {
        id: 'tl-4',
        time: '19:44:20',
        timestamp: Date.now() - 1000 * 60 * 11,
        title: 'Police Highway Patrol Notified',
        description: 'POL-12 assigned for green corridor transit management.',
        actor: 'Traffic Ops Link',
        type: 'dispatch'
      },
      {
        id: 'tl-5',
        time: '19:45:10',
        timestamp: Date.now() - 1000 * 60 * 10,
        title: 'Hospital Emergency Room Alerted',
        description: 'Apollo Greams Road Trauma Bay 2 reserved. Blood bank O- placed on standby.',
        actor: 'ER Coordination Desk',
        type: 'hospital'
      }
    ]
  },
  {
    id: 'RX-20482',
    type: 'fire',
    title: 'Commercial Textile Store Structure Fire',
    description: 'Dense smoke and open flame emanating from 2nd floor godown. Synthetic textiles burning. Possible 8 employees trapped on terrace.',
    severity: 'critical',
    status: 'dispatching',
    location: {
      lat: 13.0872,
      lng: 80.2155,
      address: '2nd Avenue Commercial Complex, Anna Nagar East',
      landmark: 'Near Roundtana Tower',
      city: 'Chennai',
      district: 'Chennai North-Central'
    },
    peopleAffected: 8,
    reportedAt: '19:48:32',
    timestamp: Date.now() - 1000 * 60 * 8,
    assignedUnits: ['FIRE-04', 'AMB-07', 'DRONE-01'],
    nearestHospitalId: 'HOSP-02',
    etaMinutes: 6,
    callerPhone: '+91 94440 91823',
    callerName: 'Store Security Control',
    source: 'iot_sensor',
    resourcesRequired: ['Foam Tender', 'Aerial Hydraulic Platform', 'Smoke Exhaust'],
    timeline: [
      {
        id: 'tl-21',
        time: '19:48:32',
        timestamp: Date.now() - 1000 * 60 * 8,
        title: 'IoT Optical Smoke Sensor Triggered',
        description: 'Sensor ID SN-9941 flagged heat anomaly > 380°C and particulate density.',
        actor: 'Commercial Fire Grid IoT',
        type: 'report'
      },
      {
        id: 'tl-22',
        time: '19:49:15',
        timestamp: Date.now() - 1000 * 60 * 7,
        title: 'Command Escalation to 3-Alarm Alert',
        description: 'Dense commercial zone detected. Mutual aid requested.',
        actor: 'Control Officer M. Raman',
        type: 'verify'
      },
      {
        id: 'tl-23',
        time: '19:50:00',
        timestamp: Date.now() - 1000 * 60 * 6,
        title: 'Fire Unit 04 & Recon Drone Dispatched',
        description: 'Thermal drone deployed for rooftop survivor assessment.',
        actor: 'EOC Automation',
        type: 'dispatch'
      }
    ]
  },
  {
    id: 'RX-20483',
    type: 'medical',
    title: 'Acute Myocardial Infarction / Cardiac Arrest',
    description: '64-year-old male collapsed in residential apartment. CPR in progress by family member.',
    severity: 'high',
    status: 'on_scene',
    location: {
      lat: 13.0001,
      lng: 80.2668,
      address: '4th Seaward Road, Valmiki Nagar, Thiruvanmiyur',
      landmark: 'Opposite Beach Promenade Park',
      city: 'Chennai',
      district: 'Chennai South'
    },
    peopleAffected: 1,
    reportedAt: '19:35:10',
    timestamp: Date.now() - 1000 * 60 * 22,
    assignedUnits: ['AMB-11'],
    nearestHospitalId: 'HOSP-05',
    etaMinutes: 2,
    callerPhone: '+91 97911 34910',
    callerName: 'Dr. Anita Krishnan (Daughter)',
    source: 'citizen_app',
    resourcesRequired: ['Defibrillator AED', 'Mobile Tele-ECG'],
    timeline: [
      {
        id: 'tl-31',
        time: '19:35:10',
        timestamp: Date.now() - 1000 * 60 * 22,
        title: 'Citizen SOS Report',
        description: 'Emergency initiated via RESQ Citizen App with voice note.',
        actor: 'Anita Krishnan',
        type: 'report'
      },
      {
        id: 'tl-32',
        time: '19:36:00',
        timestamp: Date.now() - 1000 * 60 * 21,
        title: 'AMB-11 Dispatched with AED',
        description: 'Nearest paramedic unit routed with real-time tele-telemetry.',
        actor: 'EOC Medical Desk',
        type: 'dispatch'
      },
      {
        id: 'tl-33',
        time: '19:41:30',
        timestamp: Date.now() - 1000 * 60 * 15,
        title: 'Paramedic Arrived on Scene',
        description: 'Vitals monitored: Defibrillator applied, spontaneous pulse restored.',
        actor: 'Paramedic Lead AMB-11',
        type: 'on_scene'
      }
    ]
  },
  {
    id: 'RX-20484',
    type: 'flood',
    title: 'Severe Stormwater Backflow & Stranded Residents',
    description: 'Lake embankment overflow leading to 4.5 ft stagnant water in residential ground floors. Power cut executed by electricity board.',
    severity: 'high',
    status: 'en_route',
    location: {
      lat: 12.9792,
      lng: 80.2184,
      address: 'Ram Nagar South, Velachery Main Road',
      landmark: 'Near Velachery MRTS Station',
      city: 'Chennai',
      district: 'Chennai South'
    },
    peopleAffected: 6,
    reportedAt: '19:22:04',
    timestamp: Date.now() - 1000 * 60 * 35,
    assignedUnits: ['BOAT-02', 'POL-18'],
    nearestHospitalId: 'HOSP-03',
    etaMinutes: 7,
    callerPhone: '+91 98410 77412',
    callerName: 'Velachery Residents Welfare Assoc.',
    source: 'citizen_app',
    resourcesRequired: ['Inflatable Rescue Craft', 'Lifejackets', 'Medical Evacuation Cot'],
    timeline: [
      {
        id: 'tl-41',
        time: '19:22:04',
        timestamp: Date.now() - 1000 * 60 * 35,
        title: 'Flood Level Alert Pinned',
        description: 'Water level reached hazardous surge mark in Ram Nagar.',
        actor: 'Flood Sensor & Citizen',
        type: 'report'
      },
      {
        id: 'tl-42',
        time: '19:25:00',
        timestamp: Date.now() - 1000 * 60 * 32,
        title: 'Rescue Boat 02 Mobilized',
        description: 'NDRF trained water crew departing Guindy staging base.',
        actor: 'Disaster Cell',
        type: 'dispatch'
      }
    ]
  },
  {
    id: 'RX-20485',
    type: 'disaster',
    title: 'Industrial Chemical Vapor Leak Containment',
    description: 'Ammonia vapor relief valve rupture in industrial chemical storage facility. Toxic perimeter 400m radius.',
    severity: 'critical',
    status: 'verifying',
    location: {
      lat: 13.1645,
      lng: 80.2608,
      address: 'Manali Industrial Corridor Zone 3',
      landmark: 'Opposite Petrochem Gate 2',
      city: 'Chennai',
      district: 'Chennai North'
    },
    peopleAffected: 12,
    reportedAt: '19:51:10',
    timestamp: Date.now() - 1000 * 60 * 5,
    assignedUnits: ['FIRE-04'],
    nearestHospitalId: 'HOSP-04',
    etaMinutes: 9,
    callerPhone: '+91 94441 55001',
    callerName: 'Industrial Safety Inspector',
    source: 'iot_sensor',
    resourcesRequired: ['HAZMAT Level A Suits', 'Neutralizing Chemical Foam', 'Air Quality Scrubbers'],
    timeline: [
      {
        id: 'tl-51',
        time: '19:51:10',
        timestamp: Date.now() - 1000 * 60 * 5,
        title: 'Sensor Alert: NH3 High Concentration',
        description: 'Automated telemetry flagged 180 PPM ammonia vapor.',
        actor: 'Manali Industrial Sensor Network',
        type: 'report'
      },
      {
        id: 'tl-52',
        time: '19:52:00',
        timestamp: Date.now() - 1000 * 60 * 4,
        title: 'SACHET Disaster Alert Queued',
        description: 'Public shelter-in-place advisory drafted for 2km downwind perimeter.',
        actor: 'Disaster Management Unit',
        type: 'verify'
      }
    ]
  },
  {
    id: 'RX-20486',
    type: 'accident',
    title: 'Expressway Flyover Multi-Vehicle Pileup',
    description: 'Container truck skid causing rollover into two passenger sedans. Minor fuel leak on tarmac.',
    severity: 'moderate',
    status: 'dispatching',
    location: {
      lat: 13.0102,
      lng: 80.2155,
      address: 'Kathipara Junction Flyover cloverleaf, Guindy',
      landmark: 'Guindy Industrial Estate Entrance',
      city: 'Chennai',
      district: 'Chennai Central'
    },
    peopleAffected: 4,
    reportedAt: '19:30:15',
    timestamp: Date.now() - 1000 * 60 * 26,
    assignedUnits: ['POL-09', 'AMB-18'],
    nearestHospitalId: 'HOSP-03',
    etaMinutes: 5,
    callerPhone: '+91 99402 11099',
    callerName: 'Traffic Police Patrol',
    source: 'cctv_ai',
    resourcesRequired: ['Cranes/Wrecker', 'Sand absorbents'],
    timeline: [
      {
        id: 'tl-61',
        time: '19:30:15',
        timestamp: Date.now() - 1000 * 60 * 26,
        title: 'AI Traffic Cam Incident Flagged',
        description: 'CCTV AI detected stationary truck and collision optical impact.',
        actor: 'Smart City Vision AI',
        type: 'report'
      }
    ]
  },
  {
    id: 'RX-20478',
    type: 'medical',
    title: 'Elderly Heat Stroke & Dehydration Emergency',
    description: 'Patient stabilized and transported to General Hospital ER. Fully resolved.',
    severity: 'low',
    status: 'resolved',
    location: {
      lat: 13.0827,
      lng: 80.2707,
      address: 'Poonamallee High Road, Park Town',
      landmark: 'Near Central Railway Station',
      city: 'Chennai',
      district: 'Chennai Central'
    },
    peopleAffected: 1,
    reportedAt: '18:15:00',
    timestamp: Date.now() - 1000 * 60 * 105,
    assignedUnits: ['AMB-04'],
    nearestHospitalId: 'HOSP-02',
    callerPhone: '+91 98400 11223',
    callerName: 'Station Master Office',
    source: '112_hotline',
    timeline: [
      {
        id: 'tl-71',
        time: '18:15:00',
        timestamp: Date.now() - 1000 * 60 * 105,
        title: 'Incident Reported',
        description: 'Collapsed commuter at platform entrance.',
        actor: 'Station Police',
        type: 'report'
      },
      {
        id: 'tl-72',
        time: '18:18:00',
        timestamp: Date.now() - 1000 * 60 * 102,
        title: 'Paramedic On Scene',
        description: 'IV fluids administered.',
        actor: 'AMB-04 Crew',
        type: 'on_scene'
      },
      {
        id: 'tl-73',
        time: '18:42:00',
        timestamp: Date.now() - 1000 * 60 * 78,
        title: 'Handover at Hospital ER Completed',
        description: 'Vitals normal, admitted for overnight observation.',
        actor: 'RGGGH Triage',
        type: 'resolved'
      }
    ]
  }
];

export const initialResponders: ResponderUnit[] = [
  {
    id: 'AMB-04',
    callsign: 'MEDIC-04-DELTA',
    name: 'Advanced Life Support Ambulance 04',
    type: 'ambulance',
    subType: 'ALS Mobile Trauma',
    status: 'en_route',
    location: {
      lat: 13.0490,
      lng: 80.2430,
      address: 'Moving south along Anna Salai corridor'
    },
    assignedIncidentId: 'RX-20481',
    personnelCount: 3,
    equipment: ['Multi-Param Monitor', 'Transport Ventilator', 'Trauma Resuscitation Kit', 'Suction Unit'],
    fuelPercent: 88,
    speedKmh: 54,
    contactNumber: '+91 98404 00004',
    etaToTargetMinutes: 4
  },
  {
    id: 'AMB-07',
    callsign: 'MEDIC-07-EAGLE',
    name: 'Advanced Cardiac Ambulance 07',
    type: 'ambulance',
    subType: 'ALS Mobile ICU',
    status: 'available',
    location: {
      lat: 13.0330,
      lng: 80.2220,
      address: 'Nandanam Staging Depot'
    },
    personnelCount: 3,
    equipment: ['12-Lead ECG Defibrillator', 'Infusion Pumps', 'Spinal Immobilizer', 'Intubation Set'],
    fuelPercent: 94,
    speedKmh: 0,
    contactNumber: '+91 98404 00007',
    etaToTargetMinutes: 6
  },
  {
    id: 'AMB-11',
    callsign: 'MEDIC-11-SIERRA',
    name: 'Rapid Paramedic Unit 11',
    type: 'ambulance',
    subType: 'ALS Fast Response',
    status: 'on_scene',
    location: {
      lat: 13.0001,
      lng: 80.2668,
      address: '4th Seaward Road, Thiruvanmiyur'
    },
    assignedIncidentId: 'RX-20483',
    personnelCount: 2,
    equipment: ['Automated External Defibrillator', 'Oxygen Kit', 'Burn Dressing Pack'],
    fuelPercent: 76,
    speedKmh: 0,
    contactNumber: '+91 98404 00011',
    etaToTargetMinutes: 0
  },
  {
    id: 'AMB-18',
    callsign: 'MEDIC-18-BRAVO',
    name: 'Basic Life Support Ambulance 18',
    type: 'ambulance',
    subType: 'BLS Medical Transport',
    status: 'available',
    location: {
      lat: 13.0600,
      lng: 80.2500,
      address: 'Thousand Lights Hub'
    },
    personnelCount: 2,
    equipment: ['Stretcher Trolley', 'Portable Oxygen', 'Splints & Collars'],
    fuelPercent: 82,
    speedKmh: 0,
    contactNumber: '+91 98404 00018',
    etaToTargetMinutes: 8
  },
  {
    id: 'FIRE-03',
    callsign: 'FIRE-03-PUMPER',
    name: 'Heavy Rescue Tender 03',
    type: 'fire',
    subType: 'Hydraulic Cutter & Spreader',
    status: 'en_route',
    location: {
      lat: 13.0530,
      lng: 80.2280,
      address: 'En route via Sterling Road to Anna Salai'
    },
    assignedIncidentId: 'RX-20481',
    personnelCount: 6,
    equipment: ['Jaws of Life Hydraulic Set', 'Thermal Imaging Camera', '4000L Water Tank', 'Class B Foam'],
    fuelPercent: 85,
    speedKmh: 48,
    contactNumber: '+91 98403 00003',
    etaToTargetMinutes: 5
  },
  {
    id: 'FIRE-04',
    callsign: 'FIRE-04-AERIAL',
    name: '54M High-Rise Turntable Ladder 04',
    type: 'fire',
    subType: 'Aerial Ladder Platform',
    status: 'available',
    location: {
      lat: 13.0890,
      lng: 80.2190,
      address: 'Anna Nagar Fire Rescue Station'
    },
    assignedIncidentId: 'RX-20482',
    personnelCount: 5,
    equipment: ['54-meter Telescopic Boom', 'Breathing Apparatus Bank', 'Positive Pressure Fan'],
    fuelPercent: 91,
    speedKmh: 0,
    contactNumber: '+91 98403 00004',
    etaToTargetMinutes: 7
  },
  {
    id: 'POL-12',
    callsign: 'POLICE-12-CORRIDOR',
    name: 'Highway Patrol Green Corridor 12',
    type: 'police',
    subType: 'Traffic Command Interceptor',
    status: 'en_route',
    location: {
      lat: 13.0360,
      lng: 80.2450,
      address: 'Teynampet Signal Green Corridor'
    },
    assignedIncidentId: 'RX-20481',
    personnelCount: 3,
    equipment: ['Automated PA Announcer', 'Traffic Barricades', 'First Aid Trauma Pack', 'Spike Strips'],
    fuelPercent: 79,
    speedKmh: 62,
    contactNumber: '+91 98401 00012',
    etaToTargetMinutes: 3
  },
  {
    id: 'POL-18',
    callsign: 'POLICE-18-PATROL',
    name: 'Rapid PCR Flying Squad 18',
    type: 'police',
    subType: 'Quick Reaction Team',
    status: 'available',
    location: {
      lat: 13.0110,
      lng: 80.2200,
      address: 'Guindy Station Sector'
    },
    personnelCount: 4,
    equipment: ['Night Vision Optics', 'High-Lumen Spotlights', 'Defensive Gear'],
    fuelPercent: 89,
    speedKmh: 0,
    contactNumber: '+91 98401 00018',
    etaToTargetMinutes: 5
  },
  {
    id: 'POL-09',
    callsign: 'POLICE-09-TRAFFIC',
    name: 'Traffic Division Recovery Unit 09',
    type: 'police',
    subType: 'Heavy Wrecker & Tow',
    status: 'available',
    location: {
      lat: 13.0150,
      lng: 80.2100,
      address: 'Kathipara Interchange Base'
    },
    personnelCount: 2,
    equipment: ['Heavy Duty Winch', 'Hazard Signalling Flare Bar', 'Oil Absorbent Granules'],
    fuelPercent: 95,
    speedKmh: 0,
    contactNumber: '+91 98401 00009',
    etaToTargetMinutes: 6
  },
  {
    id: 'BOAT-02',
    callsign: 'NDRF-BOAT-02',
    name: 'Disaster Swift Water Craft 02',
    type: 'rescue_boat',
    subType: 'Inflatable Zodiac Rescue',
    status: 'en_route',
    location: {
      lat: 12.9850,
      lng: 80.2200,
      address: 'Velachery Staging Canal'
    },
    assignedIncidentId: 'RX-20484',
    personnelCount: 4,
    equipment: ['Mercury 40HP Engine', '6x Flotation Vests', 'Throw Bags', 'Folding Spine Board'],
    fuelPercent: 96,
    speedKmh: 22,
    contactNumber: '+91 98406 00002',
    etaToTargetMinutes: 7
  },
  {
    id: 'DRONE-01',
    callsign: 'EOC-RECON-DRONE-01',
    name: 'Autonomous Aerial Thermal Recon 01',
    type: 'drone',
    subType: 'Tethered FLIR Quadcopter',
    status: 'available',
    location: {
      lat: 13.0420,
      lng: 80.2400,
      address: 'T Nagar Sector Rooftop Dock'
    },
    personnelCount: 1,
    equipment: ['Thermal 640x512 FLIR', '4K 30x Optical Zoom', 'Emergency Loudspeaker System'],
    fuelPercent: 92,
    speedKmh: 45,
    contactNumber: '+91 98407 00001',
    etaToTargetMinutes: 2
  }
];

export const initialHospitals: Hospital[] = [
  {
    id: 'HOSP-01',
    name: 'Apollo Hospitals, Greams Road',
    type: 'Trauma Level 1 & Super Specialty',
    location: {
      lat: 13.0560,
      lng: 80.2512,
      address: '21 Greams Lane, Thousand Lights, Chennai'
    },
    capacityPercent: 78,
    icuBeds: { total: 45, available: 6 },
    generalBeds: { total: 420, available: 68 },
    ventilators: { total: 32, available: 4 },
    bloodAvailability: {
      'O-': 'Low',
      'O+': 'Surplus',
      'A+': 'Adequate',
      'B+': 'Surplus',
      'AB+': 'Adequate',
      'AB-': 'Critical'
    },
    erStatus: 'Near Capacity',
    ambulanceBays: { total: 8, occupied: 6 },
    contactPhone: '+91 44 2829 0200',
    distanceKm: 2.8,
    etaMinutes: 7
  },
  {
    id: 'HOSP-02',
    name: 'Rajiv Gandhi Govt General Hospital (RGGGH)',
    type: 'Apex Government Tertiary & Trauma Center',
    location: {
      lat: 13.0815,
      lng: 80.2785,
      address: 'EVR Periyar Salai, Park Town, Chennai'
    },
    capacityPercent: 86,
    icuBeds: { total: 80, available: 11 },
    generalBeds: { total: 1200, available: 145 },
    ventilators: { total: 60, available: 9 },
    bloodAvailability: {
      'O-': 'Adequate',
      'O+': 'Surplus',
      'A+': 'Surplus',
      'B+': 'Surplus',
      'AB+': 'Surplus',
      'AB-': 'Low'
    },
    erStatus: 'High Volume',
    ambulanceBays: { total: 16, occupied: 12 },
    contactPhone: '+91 44 2530 5000',
    distanceKm: 6.2,
    etaMinutes: 14
  },
  {
    id: 'HOSP-03',
    name: 'MIOT International Hospital',
    type: 'Orthopaedic, Trauma & Multi-Organ Specialty',
    location: {
      lat: 13.0195,
      lng: 80.1872,
      address: '4/112 Mount Poonamallee High Rd, Manapakkam'
    },
    capacityPercent: 62,
    icuBeds: { total: 38, available: 14 },
    generalBeds: { total: 500, available: 190 },
    ventilators: { total: 28, available: 11 },
    bloodAvailability: {
      'O-': 'Surplus',
      'O+': 'Surplus',
      'A+': 'Adequate',
      'B+': 'Surplus',
      'AB+': 'Adequate',
      'AB-': 'Adequate'
    },
    erStatus: 'Normal',
    ambulanceBays: { total: 10, occupied: 3 },
    contactPhone: '+91 44 4200 2288',
    distanceKm: 5.4,
    etaMinutes: 11
  },
  {
    id: 'HOSP-04',
    name: 'Govt Stanley Medical College & Hospital',
    type: 'Government Burn & Toxicological Specialty',
    location: {
      lat: 13.1070,
      lng: 80.2870,
      address: 'Old Jail Rd, Royapuram, Chennai'
    },
    capacityPercent: 74,
    icuBeds: { total: 50, available: 12 },
    generalBeds: { total: 850, available: 210 },
    ventilators: { total: 35, available: 8 },
    bloodAvailability: {
      'O-': 'Low',
      'O+': 'Adequate',
      'A+': 'Surplus',
      'B+': 'Adequate',
      'AB+': 'Adequate',
      'AB-': 'Low'
    },
    erStatus: 'High Volume',
    ambulanceBays: { total: 8, occupied: 4 },
    contactPhone: '+91 44 2528 0900',
    distanceKm: 9.8,
    etaMinutes: 19
  },
  {
    id: 'HOSP-05',
    name: 'Fortis Malar Hospital, Adyar',
    type: 'Cardiac Sciences & Emergency Trauma',
    location: {
      lat: 13.0062,
      lng: 80.2575,
      address: 'Gandhi Nagar, 1st Main Rd, Adyar, Chennai'
    },
    capacityPercent: 68,
    icuBeds: { total: 24, available: 7 },
    generalBeds: { total: 180, available: 42 },
    ventilators: { total: 16, available: 5 },
    bloodAvailability: {
      'O-': 'Adequate',
      'O+': 'Surplus',
      'A+': 'Adequate',
      'B+': 'Surplus',
      'AB+': 'Surplus',
      'AB-': 'Adequate'
    },
    erStatus: 'Normal',
    ambulanceBays: { total: 6, occupied: 2 },
    contactPhone: '+91 44 4289 2222',
    distanceKm: 4.1,
    etaMinutes: 9
  },
  {
    id: 'HOSP-06',
    name: 'SIMS Hospital, Vadapalani',
    type: 'Multi-Specialty & Neuro-Trauma Care',
    location: {
      lat: 13.0505,
      lng: 80.2100,
      address: 'Jawaharlal Nehru Salai, Vadapalani, Chennai'
    },
    capacityPercent: 71,
    icuBeds: { total: 30, available: 9 },
    generalBeds: { total: 345, available: 88 },
    ventilators: { total: 20, available: 6 },
    bloodAvailability: {
      'O-': 'Low',
      'O+': 'Adequate',
      'A+': 'Surplus',
      'B+': 'Surplus',
      'AB+': 'Adequate',
      'AB-': 'Critical'
    },
    erStatus: 'Normal',
    ambulanceBays: { total: 6, occupied: 3 },
    contactPhone: '+91 44 2000 2001',
    distanceKm: 3.5,
    etaMinutes: 8
  }
];

export const initialResources: EmergencyResource[] = [
  {
    id: 'RES-01',
    name: 'Medical Liquid Oxygen Cylinders (47L D-Type)',
    category: 'medical',
    total: 240,
    available: 18,
    inUse: 222,
    unit: 'cylinders',
    status: 'low_stock',
    location: 'Central Medical Supplies Depot, Nandanam',
    lastUpdated: '10m ago'
  },
  {
    id: 'RES-02',
    name: 'Emergency O-Negative Universal Blood Bags',
    category: 'medical',
    total: 80,
    available: 12,
    inUse: 68,
    unit: 'units',
    status: 'critical',
    location: 'Tamil Nadu Blood Transfusion Council Hub',
    lastUpdated: '5m ago'
  },
  {
    id: 'RES-03',
    name: 'Inflatable Flood Rescue Rafts & Outboards',
    category: 'equipment',
    total: 35,
    available: 24,
    inUse: 11,
    unit: 'crafts',
    status: 'available',
    location: 'NDRF Sector 4 Arakkonam Staging Base',
    lastUpdated: '25m ago'
  },
  {
    id: 'RES-04',
    name: 'Hydraulic Heavy Rescue Combi-Tools',
    category: 'equipment',
    total: 28,
    available: 19,
    inUse: 9,
    unit: 'kits',
    status: 'available',
    location: 'State Fire & Rescue HQ',
    lastUpdated: '15m ago'
  },
  {
    id: 'RES-05',
    name: 'High-Lumen Emergency Lighting Towers & GenSets',
    category: 'equipment',
    total: 50,
    available: 38,
    inUse: 12,
    unit: 'generators',
    status: 'available',
    location: 'Disaster Relief Yard, Guindy',
    lastUpdated: '40m ago'
  },
  {
    id: 'RES-06',
    name: 'Active Duty Paramedics & Emergency EMTs',
    category: 'personnel',
    total: 120,
    available: 34,
    inUse: 86,
    unit: 'officers',
    status: 'available',
    location: 'Metro Emergency Grid',
    lastUpdated: '2m ago'
  },
  {
    id: 'RES-07',
    name: 'Temporary Cyclone & Relief Shelter Capacity',
    category: 'shelter',
    total: 5000,
    available: 3850,
    inUse: 1150,
    unit: 'cots',
    status: 'available',
    location: 'Community Halls across Zone 8-13',
    lastUpdated: '1h ago'
  },
  {
    id: 'RES-08',
    name: 'Water Purification Tablets & Emergency Sachets',
    category: 'medical',
    total: 50000,
    available: 46200,
    inUse: 3800,
    unit: 'tablets',
    status: 'available',
    location: 'Public Health Storage, Kilpauk',
    lastUpdated: '1h ago'
  }
];

export const initialAlerts: PublicAlert[] = [
  {
    id: 'ALT-901',
    title: 'Severe Cyclonic Wind & Urban Rain Advisory',
    category: 'weather',
    severity: 'high',
    message: {
      en: 'NDMA / IMD Alert: Squally wind speeds 65-75 kmph accompanied by intense rainfall spells across North Coastal districts. Stay indoors and avoid waterlogged underpasses.',
      ta: 'தேசிய பேரிடர் எச்சரிக்கை: வட கடலோர மாவட்டங்களில் 65-75 கி.மீ வேகத்தில் பலத்த காற்றுடன் கனமழை பெய்ய வாய்ப்புள்ளது. பொதுமக்கள் நீர் தேங்கிய பகுதிகளைத் தவிர்க்கவும்.',
      hi: 'एनडीएमए चेतावनी: उत्तरी तटीय क्षेत्रों में 65-75 किमी/घंटा की गति से तेज हवाओं और भारी बारिश का अलर्ट। जलभराव वाले क्षेत्रों और अंडरपास से दूर रहें।'
    },
    targetArea: 'Chennai Metro & Coastal Chengalpattu',
    targetType: 'district',
    issuedAt: '18:00:00',
    expiresAt: '06:00:00 (Next Day)',
    authority: 'Tamil Nadu State Disaster Management Authority (TNSDMA)',
    active: true,
    reachCount: 482000
  },
  {
    id: 'ALT-902',
    title: 'Chemical Vapor Exclusion Zone - Manali Corridor',
    category: 'disaster',
    severity: 'critical',
    message: {
      en: 'CRITICAL HAZMAT: Ammonia vapor dispersion detected in Manali Zone 3. Residents within 2km radius must close all windows, turn off AC units and wear moist cloth masks.',
      ta: 'அவசர அபாய எச்சரிக்கை: மணலி பகுதி 3ல் அம்மோனியா வாயு கசிவு கண்டறியப்பட்டுள்ளது. 2 கி.மீ சுற்றளவிலுள்ள மக்கள் ஜன்னல்களை மூடி, ஈர துணி முகக்கவசம் அணியவும்.',
      hi: 'आपातकालीन चेतावनी: मनाली जोन 3 में अमोनिया गैस रिसाव। 2 किमी के दायरे में सभी नागरिक खिड़कियां बंद रखें और गीले कपड़े का मास्क पहनें।'
    },
    targetArea: 'Manali Industrial Sector, 2.5km Radius',
    targetType: 'radius',
    radiusKm: 2.5,
    issuedAt: '19:52:00',
    expiresAt: '22:00:00',
    authority: 'RESQ Hazmat Rapid Action Group',
    active: true,
    reachCount: 38400
  },
  {
    id: 'ALT-903',
    title: 'Emergency Medical Green Corridor Active - Anna Salai',
    category: 'traffic',
    severity: 'warning',
    message: {
      en: 'Police Notice: Green corridor active between Panagal Park and Apollo Greams Road. Civilian vehicles must yield right-of-way to flashing red sirens.',
      ta: 'போக்குவரத்து அறிவிப்பு: பனகல் பார்க் முதல் அப்பல்லோ மருத்துவமனை வரை அவசர அவசரப்பாதை நடைமுறையில் உள்ளது. பொதுமக்கள் அவசர வாகனங்களுக்கு வழிவிடவும்.',
      hi: 'यातायात सूचना: पानागल पार्क से अपोलो अस्पताल तक ग्रीन कॉरिडोर सक्रिय है। एम्बुलेंस को तुरंत रास्ता दें।'
    },
    targetArea: 'Anna Salai Arterial Route',
    targetType: 'city',
    issuedAt: '19:44:00',
    expiresAt: '20:30:00',
    authority: 'Greater Chennai Traffic Police Control',
    active: true,
    reachCount: 92000
  }
];

export const systemStats: SystemStats = {
  activeIncidents: 24,
  criticalIncidents: 6,
  respondersActive: 47,
  availableAmbulances: 18,
  hospitalCapacityPercent: 72,
  avgResponseTimeMin: '08:42'
};

export const translations = {
  en: {
    appName: 'RESQ',
    tagline: 'Smart Emergency Response & Management Platform',
    heroTitle: 'ONE PLATFORM. EVERY EMERGENCY. ONE COORDINATED RESPONSE.',
    heroSubtitle: 'Detect. Coordinate. Respond. Recover.',
    reportEmergencyBtn: 'Report Emergency',
    commandCenterBtn: 'Open Command Center',
    demoModeBtn: 'Simulate Incident Demo',
    systemStatus: 'SYSTEM STATUS: 24/7 Monitoring Active',
    networkOperational: 'Emergency Network Operational',
    liveTracking: 'Live Response Tracking',
    howItWorks: 'How It Works',
    features: 'Platform Capabilities',
    whatIsHappening: 'WHAT IS HAPPENING?',
    currentLocation: 'Current Location',
    useMyLocation: 'Use My Current Location',
    peopleAffected: 'People Affected',
    severity: 'Severity Level',
    sendAlert: 'SEND EMERGENCY ALERT',
    critical: 'Critical',
    high: 'High',
    moderate: 'Moderate',
    low: 'Low',
    dispatchNow: 'DISPATCH NOW',
    viewDetails: 'VIEW DETAILS',
    contactUnit: 'CONTACT UNIT',
    navigate: 'NAVIGATE',
    markResolved: 'MARK RESOLVED',
    readAloud: 'Read Aloud'
  },
  ta: {
    appName: 'ரெஸ்க்யூ (RESQ)',
    tagline: 'நவீன அவசரக்கால மீட்பு மற்றும் ஒருங்கிணைப்பு தளம்',
    heroTitle: 'ஒரே தளம். ஒவ்வொரு அவசரநிலைக்கும். ஒரு ஒருங்கிணைந்த மீட்பு.',
    heroSubtitle: 'கண்டறிதல். ஒருங்கிணைத்தல். விரைந்து செயல்படுதல். மீட்டெடுத்தல்.',
    reportEmergencyBtn: 'அவசர உதவி கோருக',
    commandCenterBtn: 'கட்டளை மையம் திறக்க',
    demoModeBtn: 'மாதிரி ஒத்திகை செய்க',
    systemStatus: 'கணினி நிலை: 24/7 கண்காணிப்பு செயல்பாட்டில் உள்ளது',
    networkOperational: 'அவசர நெட்வொர்க் தயார் நிலையில் உள்ளது',
    liveTracking: 'நேரடி மீட்பு கண்காணிப்பு',
    howItWorks: 'செயல்முறை விளக்கம்',
    features: 'தளத்தின் திறன்கள்',
    whatIsHappening: 'என்ன நிகழ்ந்தது? அவசர விபரம்',
    currentLocation: 'தற்போதைய இருப்பிடம்',
    useMyLocation: 'எனது ஜிபிஎஸ் இருப்பிடத்தைப் பயன்படுத்து',
    peopleAffected: 'பாதிக்கப்பட்ட நபர்கள்',
    severity: 'தீவிரத்தன்மை நிலை',
    sendAlert: 'அவசர எச்சரிக்கை அனுப்புக',
    critical: 'மிக அவசரம் (Critical)',
    high: 'உயர்மட்டம் (High)',
    moderate: 'மிதமானது (Moderate)',
    low: 'குறைவானது (Low)',
    dispatchNow: 'உடனே அனுப்புக',
    viewDetails: 'விவரங்களை காண்க',
    contactUnit: 'குழுவை தொடர்பு கொள்க',
    navigate: 'வழிகாட்டுதல்',
    markResolved: 'முடிவுற்றதாக குறிக்கவும்',
    readAloud: 'வாசித்து காட்டு'
  },
  hi: {
    appName: 'रेस्क्यू (RESQ)',
    tagline: 'स्मार्ट आपातकालीन प्रतिक्रिया और समन्वय प्लेटफॉर्म',
    heroTitle: 'एक प्लेटफॉर्म। हर आपातकाल। एक समन्वित प्रतिक्रिया।',
    heroSubtitle: 'पहचान। समन्वय। त्वरित कार्रवाई। पुनर्प्राप्ति।',
    reportEmergencyBtn: 'आपातकालीन रिपोर्ट करें',
    commandCenterBtn: 'कमांड सेंटर खोलें',
    demoModeBtn: 'आपातकालीन डेमो चलाएं',
    systemStatus: 'सिस्टम स्थिति: 24/7 लाइव मॉनिटरिंग सक्रिय',
    networkOperational: 'आपातकालीन नेटवर्क पूरी तरह चालू',
    liveTracking: 'लाइव रिस्पांस ट्रैकिंग',
    howItWorks: 'यह कैसे काम करता है',
    features: 'प्लेटफ़ॉर्म क्षमताएं',
    whatIsHappening: 'क्या हुआ है? आपात स्थिति बताएं',
    currentLocation: 'वर्तमान स्थान',
    useMyLocation: 'मेरे वर्तमान स्थान का उपयोग करें',
    peopleAffected: 'प्रभावित लोग',
    severity: 'गंभीरता का स्तर',
    sendAlert: 'आपातकालीन अलर्ट भेजें',
    critical: 'अत्यंत गंभीर (Critical)',
    high: 'उच्च (High)',
    moderate: 'मध्यम (Moderate)',
    low: 'सामान्य (Low)',
    dispatchNow: 'तुरंत रवाना करें',
    viewDetails: 'विवरण देखें',
    contactUnit: 'इकाई से संपर्क करें',
    navigate: 'मार्ग देखें',
    markResolved: 'समाधान चिह्नित करें',
    readAloud: 'बोलकर सुनाएं'
  }
};

export const mockAuthUsers: AuthUser[] = [
  {
    id: 'USR-CMD-01',
    name: 'Officer M. Raman',
    email: 'officer.raman@resq.gov.in',
    role: 'control_officer',
    badgeNumber: 'EOC-CMD-001',
    department: 'National 112 Emergency Operations Center',
    clearanceLevel: 'Tier-1 Mission Critical Clearance',
    avatar: 'MR',
    phoneNumber: '+91 94440 11200',
    stationOrUnit: 'EOC Central Command Hub • Chennai'
  },
  {
    id: 'USR-MED-04',
    name: 'Capt. K. Senthil',
    email: 'paramedic.senthil@resq.gov.in',
    role: 'responder',
    badgeNumber: 'MEDIC-04-DELTA',
    department: 'Tamil Nadu Emergency Trauma Ambulance Service',
    clearanceLevel: 'Field Tactical Life Support Clearance',
    avatar: 'KS',
    phoneNumber: '+91 98404 00004',
    stationOrUnit: 'ALS Ambulance Unit 04'
  },
  {
    id: 'USR-HOSP-01',
    name: 'Dr. Anita Krishnan',
    email: 'er.anita@apollo.org',
    role: 'hospital',
    badgeNumber: 'HOSP-APOLLO-01',
    department: 'Apollo Greams Trauma & ICU Directorate',
    clearanceLevel: 'Clinical Emergency Authority',
    avatar: 'AK',
    phoneNumber: '+91 44 2829 0200',
    stationOrUnit: 'Emergency Trauma Center • Thousand Lights'
  },
  {
    id: 'USR-POL-12',
    name: 'Inspector R. Vijay',
    email: 'chief.vijay@tnfrs.gov.in',
    role: 'police_fire',
    badgeNumber: 'TN-POL-8821',
    department: 'Greater Chennai Police & Fire Mutual Response',
    clearanceLevel: 'Tactical Law Enforcement & Fire Command',
    avatar: 'RV',
    phoneNumber: '+91 98401 00012',
    stationOrUnit: 'Green Corridor Traffic Interceptor 12'
  },
  {
    id: 'USR-CIT-01',
    name: 'Priya Sundaram',
    email: 'citizen.priya@gmail.com',
    role: 'citizen',
    badgeNumber: 'CITIZEN-TN-491',
    department: 'Registered Citizen • Chennai Metro',
    clearanceLevel: 'Verified Citizen SOS Access',
    avatar: 'PS',
    phoneNumber: '+91 98401 22910',
    stationOrUnit: 'Anna Salai, T Nagar'
  },
  {
    id: 'USR-ADM-99',
    name: 'Chief Admin S. Anand',
    email: 'admin.anand@resq.gov.in',
    role: 'admin',
    badgeNumber: 'ADMIN-SYS-99',
    department: 'State Disaster Infrastructure & Telemetry Admin',
    clearanceLevel: 'Root Executive Administrator Clearance',
    avatar: 'SA',
    phoneNumber: '+91 99400 00099',
    stationOrUnit: 'EOC Technology & Telemetry Wing'
  }
];

export const defaultAuthUser: AuthUser = mockAuthUsers[0];

