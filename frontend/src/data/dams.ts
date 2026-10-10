/**
 * Authoritative Pune Region Dam Inventory Dataset
 * Source aligned with India-WRIS & Maharashtra Water Resources Department (WRD)
 * Scope: STRICTLY 10 PUNE-REGION DAMS ONLY
 */

export interface MaharashtraDam {
  id: string;
  name: string;
  river: string;
  district: string;
  state: 'Maharashtra';
  latitude: number;
  longitude: number;
  damType: string;
  heightM: number;
  lengthM: number;
  capacityMCM: number; // Million Cubic Meters
  currentLevelPct: number;
  yearCompleted: number;
  monitoringStatus: 'NORMAL' | 'WATCH' | 'ALERT' | 'CRITICAL';
  riskLevel: 'Low' | 'Medium' | 'High';
  lastObservation: string;
  previousObservation: string;
  detectedChange: string;
  imageUrl: string;
  downstreamSettlements: Array<{
    name: string;
    distanceKm: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    arrivalTimeHours: number;
    latitude: number;
    longitude: number;
  }>;
  reservoirCoordinates: Array<[number, number]>;
}

export const MAHARASHTRA_DAMS: MaharashtraDam[] = [
  {
    id: 'khadakwasla',
    name: 'Khadakwasla Dam',
    river: 'Mutha',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.4357,
    longitude: 73.7618,
    damType: 'Masonry gravity',
    heightM: 32,
    lengthM: 1539,
    capacityMCM: 86,
    currentLevelPct: 88.4,
    yearCompleted: 1879,
    monitoringStatus: 'NORMAL',
    riskLevel: 'Medium',
    lastObservation: '08 Oct 2026',
    previousObservation: '04 Oct 2026',
    detectedChange: 'High reservoir volume; routine gated discharge active',
    imageUrl: '/assets/dams/khadakwasla.jpg',
    downstreamSettlements: [
      { name: 'Pune (Deccan / Riverbed)', distanceKm: 14, riskLevel: 'Medium', arrivalTimeHours: 1.1, latitude: 18.5167, longitude: 73.8400 },
      { name: 'Bund Garden', distanceKm: 20, riskLevel: 'Low', arrivalTimeHours: 2.0, latitude: 18.5350, longitude: 73.8850 },
      { name: 'Sangam Bridge', distanceKm: 17, riskLevel: 'Medium', arrivalTimeHours: 1.5, latitude: 18.5312, longitude: 73.8682 }
    ],
    reservoirCoordinates: [
      [18.42, 73.72], [18.44, 73.75], [18.46, 73.78]
    ]
  },
  {
    id: 'panshet',
    name: 'Panshet Dam',
    river: 'Ambi / Mutha',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.3756,
    longitude: 73.6194,
    damType: 'Earthfill',
    heightM: 70,
    lengthM: 1039,
    capacityMCM: 303,
    currentLevelPct: 78.1,
    yearCompleted: 1972,
    monitoringStatus: 'WATCH',
    riskLevel: 'Medium',
    lastObservation: '07 Oct 2026',
    previousObservation: '03 Oct 2026',
    detectedChange: 'Unusual monitoring observation — upstream water inflow rising',
    imageUrl: '/assets/dams/panshet.jpg',
    downstreamSettlements: [
      { name: 'Khadakwasla', distanceKm: 22, riskLevel: 'Medium', arrivalTimeHours: 1.8, latitude: 18.4357, longitude: 73.7618 },
      { name: 'Pune City (Sinhagad Rd)', distanceKm: 34, riskLevel: 'High', arrivalTimeHours: 3.2, latitude: 18.5204, longitude: 73.8567 },
      { name: 'Hadapsar', distanceKm: 46, riskLevel: 'Low', arrivalTimeHours: 5.5, latitude: 18.5089, longitude: 73.9259 }
    ],
    reservoirCoordinates: [
      [18.35, 73.58], [18.38, 73.57], [18.41, 73.62], [18.37, 73.64]
    ]
  },
  {
    id: 'varasgaon',
    name: 'Varasgaon Dam',
    river: 'Mose / Mutha',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.3975,
    longitude: 73.5933,
    damType: 'Earthfill and gravity masonry',
    heightM: 63,
    lengthM: 785,
    capacityMCM: 374,
    currentLevelPct: 66.7,
    yearCompleted: 1993,
    monitoringStatus: 'NORMAL',
    riskLevel: 'Low',
    lastObservation: '06 Oct 2026',
    previousObservation: '02 Oct 2026',
    detectedChange: 'Normal seasonal fluctuation within bounds',
    imageUrl: '/assets/dams/varasgaon.svg',
    downstreamSettlements: [
      { name: 'Khadakwasla', distanceKm: 24, riskLevel: 'Low', arrivalTimeHours: 2.0, latitude: 18.4357, longitude: 73.7618 },
      { name: 'Pune (Warje)', distanceKm: 32, riskLevel: 'Low', arrivalTimeHours: 3.5, latitude: 18.4811, longitude: 73.8018 }
    ],
    reservoirCoordinates: [
      [18.38, 73.56], [18.42, 73.58], [18.40, 73.61]
    ]
  },
  {
    id: 'temghar',
    name: 'Temghar Dam',
    river: 'Mutha',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5261,
    longitude: 73.5350,
    damType: 'Masonry gravity',
    heightM: 42,
    lengthM: 1075,
    capacityMCM: 105,
    currentLevelPct: 81.0,
    yearCompleted: 2010,
    monitoringStatus: 'NORMAL',
    riskLevel: 'Low',
    lastObservation: '07 Oct 2026',
    previousObservation: '03 Oct 2026',
    detectedChange: 'Minor seepage treatment monitoring stable',
    imageUrl: '/assets/dams/temghar.svg',
    downstreamSettlements: [
      { name: 'Pirangut', distanceKm: 16, riskLevel: 'Low', arrivalTimeHours: 1.4, latitude: 18.5117, longitude: 73.6764 },
      { name: 'Kothrud', distanceKm: 30, riskLevel: 'Low', arrivalTimeHours: 2.8, latitude: 18.5074, longitude: 73.8077 }
    ],
    reservoirCoordinates: [
      [18.51, 73.51], [18.54, 73.54], [18.56, 73.56]
    ]
  },
  {
    id: 'mulshi',
    name: 'Mulshi Dam',
    river: 'Mula',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5303,
    longitude: 73.4983,
    damType: 'Gravity masonry',
    heightM: 49,
    lengthM: 1533,
    capacityMCM: 572,
    currentLevelPct: 71.5,
    yearCompleted: 1927,
    monitoringStatus: 'NORMAL',
    riskLevel: 'Low',
    lastObservation: '07 Oct 2026',
    previousObservation: '03 Oct 2026',
    detectedChange: 'Hydroelectric intake operating normally',
    imageUrl: '/assets/dams/mulshi.svg',
    downstreamSettlements: [
      { name: 'Paud', distanceKm: 18, riskLevel: 'Low', arrivalTimeHours: 1.8, latitude: 18.5350, longitude: 73.6150 },
      { name: 'Pune (Kothrud)', distanceKm: 42, riskLevel: 'Low', arrivalTimeHours: 4.5, latitude: 18.5074, longitude: 73.8077 }
    ],
    reservoirCoordinates: [
      [18.50, 73.45], [18.54, 73.48], [18.56, 73.53]
    ]
  },
  {
    id: 'pawana',
    name: 'Pavana Dam',
    river: 'Pavana',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.6653,
    longitude: 73.4981,
    damType: 'Earthfill and gravity',
    heightM: 42,
    lengthM: 1329,
    capacityMCM: 271,
    currentLevelPct: 79.4,
    yearCompleted: 1972,
    monitoringStatus: 'NORMAL',
    riskLevel: 'Low',
    lastObservation: '08 Oct 2026',
    previousObservation: '04 Oct 2026',
    detectedChange: 'Pimpri-Chinchwad municipal intake operating steady',
    imageUrl: '/assets/dams/pawana.jpg',
    downstreamSettlements: [
      { name: 'Talegaon Dabhade', distanceKm: 20, riskLevel: 'Low', arrivalTimeHours: 1.8, latitude: 18.7300, longitude: 73.6800 },
      { name: 'Pimpri-Chinchwad', distanceKm: 38, riskLevel: 'Low', arrivalTimeHours: 3.5, latitude: 18.6298, longitude: 73.7997 }
    ],
    reservoirCoordinates: [
      [18.64, 73.46], [18.68, 73.49], [18.70, 73.53]
    ]
  },
  {
    id: 'bhama_askhed',
    name: 'Bhama Askhed Dam',
    river: 'Bhama',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.8105,
    longitude: 73.7483,
    damType: 'Earthfill and gravity',
    heightM: 51,
    lengthM: 1425,
    capacityMCM: 217,
    currentLevelPct: 75.3,
    yearCompleted: 2000,
    monitoringStatus: 'NORMAL',
    riskLevel: 'Low',
    lastObservation: '08 Oct 2026',
    previousObservation: '04 Oct 2026',
    detectedChange: 'Municipal water supply feeder channels running nominal',
    imageUrl: '/assets/dams/bhama_askhed.jpg',
    downstreamSettlements: [
      { name: 'Khed (Rajgurunagar)', distanceKm: 18, riskLevel: 'Low', arrivalTimeHours: 1.6, latitude: 18.8540, longitude: 73.9140 },
      { name: 'Chakan', distanceKm: 26, riskLevel: 'Low', arrivalTimeHours: 2.5, latitude: 18.7600, longitude: 73.8500 },
      { name: 'Alandi', distanceKm: 36, riskLevel: 'Low', arrivalTimeHours: 3.8, latitude: 18.6775, longitude: 73.8967 }
    ],
    reservoirCoordinates: [
      [18.79, 73.71], [18.82, 73.75], [18.84, 73.78]
    ]
  },
  {
    id: 'chaskaman',
    name: 'Chaskaman Dam',
    river: 'Bhima',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.9172,
    longitude: 73.8169,
    damType: 'Earthfill and gravity masonry',
    heightM: 46,
    lengthM: 953,
    capacityMCM: 241,
    currentLevelPct: 83.2,
    yearCompleted: 1999,
    monitoringStatus: 'NORMAL',
    riskLevel: 'Medium',
    lastObservation: '08 Oct 2026',
    previousObservation: '04 Oct 2026',
    detectedChange: 'Reservoir filling elevated; controlled canal release scheduled',
    imageUrl: '/assets/dams/chaskaman.svg',
    downstreamSettlements: [
      { name: 'Rajgurunagar', distanceKm: 14, riskLevel: 'Medium', arrivalTimeHours: 1.2, latitude: 18.8540, longitude: 73.9140 },
      { name: 'Shirur', distanceKm: 55, riskLevel: 'Low', arrivalTimeHours: 5.0, latitude: 18.8260, longitude: 74.3780 }
    ],
    reservoirCoordinates: [
      [18.90, 73.77], [18.93, 73.81], [18.95, 73.85]
    ]
  },
  {
    id: 'dimbhe',
    name: 'Dimbhe Dam',
    river: 'Ghod',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 19.1028,
    longitude: 73.7489,
    damType: 'Gravity masonry and earthfill',
    heightM: 67,
    lengthM: 852,
    capacityMCM: 382,
    currentLevelPct: 77.0,
    yearCompleted: 2000,
    monitoringStatus: 'NORMAL',
    riskLevel: 'Low',
    lastObservation: '07 Oct 2026',
    previousObservation: '03 Oct 2026',
    detectedChange: 'Catchment headwaters steady with normal Ghod river discharges',
    imageUrl: '/assets/dams/dimbhe.jpg',
    downstreamSettlements: [
      { name: 'Ghodegaon', distanceKm: 12, riskLevel: 'Low', arrivalTimeHours: 1.0, latitude: 19.0300, longitude: 73.8300 },
      { name: 'Manchar', distanceKm: 28, riskLevel: 'Low', arrivalTimeHours: 2.6, latitude: 19.0060, longitude: 73.9430 },
      { name: 'Shirur', distanceKm: 68, riskLevel: 'Low', arrivalTimeHours: 6.2, latitude: 18.8260, longitude: 74.3780 }
    ],
    reservoirCoordinates: [
      [19.08, 73.71], [19.11, 73.75], [19.13, 73.78]
    ]
  },
  {
    id: 'yedgaon',
    name: 'Yedgaon Dam',
    river: 'Kukadi',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 19.1764,
    longitude: 73.9686,
    damType: 'Earthfill and masonry gravity',
    heightM: 29,
    lengthM: 4511,
    capacityMCM: 94,
    currentLevelPct: 72.8,
    yearCompleted: 1977,
    monitoringStatus: 'NORMAL',
    riskLevel: 'Low',
    lastObservation: '06 Oct 2026',
    previousObservation: '02 Oct 2026',
    detectedChange: 'Kukadi left bank canal distribution running normally',
    imageUrl: '/assets/dams/yedgaon.jpg',
    downstreamSettlements: [
      { name: 'Junnar', distanceKm: 10, riskLevel: 'Low', arrivalTimeHours: 0.9, latitude: 19.2080, longitude: 73.8760 },
      { name: 'Narayangaon', distanceKm: 15, riskLevel: 'Low', arrivalTimeHours: 1.3, latitude: 19.1200, longitude: 73.9800 },
      { name: 'Otur', distanceKm: 22, riskLevel: 'Low', arrivalTimeHours: 2.0, latitude: 19.2600, longitude: 73.9900 }
    ],
    reservoirCoordinates: [
      [19.16, 73.93], [19.18, 73.97], [19.20, 74.00]
    ]
  }
];

export const MAHARASHTRA_DISTRICTS = Array.from(
  new Set(MAHARASHTRA_DAMS.map((d) => d.district))
).sort();

export const MAHARASHTRA_RIVERS = Array.from(
  new Set(MAHARASHTRA_DAMS.map((d) => d.river))
).sort();

export const MAHARASHTRA_DAM_TYPES = Array.from(
  new Set(MAHARASHTRA_DAMS.map((d) => d.damType))
).sort();

export const getDamById = (id: string): MaharashtraDam | undefined => {
  return MAHARASHTRA_DAMS.find((d) => d.id === id);
};

export const getAllDams = (): MaharashtraDam[] => {
  return MAHARASHTRA_DAMS;
};
