/**
 * Maharashtra Geographic Reference Data
 * Contains state boundary coordinates, major rivers, and principal cities
 * for authoritative visual grounding on the Maharashtra map.
 */

// Approximated boundary polygon enclosing the state of Maharashtra
export const MAHARASHTRA_BOUNDARY_COORDS: Array<[number, number]> = [
  [22.03, 72.65], // Dahanu / Gujarat border
  [21.65, 73.15],
  [21.60, 74.00], // Nandurbar / MP border
  [21.50, 75.00], // Jalgaon
  [21.45, 76.50], // Buldhana
  [21.65, 77.50], // Amravati
  [21.45, 78.50], // Wardha
  [21.60, 79.30], // Nagpur
  [21.45, 80.30], // Gondia / MP border
  [21.00, 80.85], // East border / Chhattisgarh
  [19.80, 80.50], // Gadchiroli
  [18.90, 80.30], // Sironcha / Telangana border
  [18.60, 79.50], // Chandrapur
  [18.80, 77.80], // Nanded / Telangana border
  [18.20, 77.30], // Latur / Karnataka border
  [17.80, 76.80], // Osmanabad
  [17.40, 75.90], // Solapur
  [16.80, 75.00], // Sangli / Karnataka border
  [15.80, 74.30], // Kolhapur / Goa border
  [15.75, 73.65], // Sindhudurg / Arabian Sea coast
  [16.50, 73.30], // Ratnagiri
  [17.30, 73.15],
  [18.20, 72.95], // Raigad
  [18.95, 72.80], // Mumbai coast
  [19.80, 72.75], // Palghar
  [20.50, 72.70],
  [22.03, 72.65]  // Close polygon
];

export interface MaharashtraCity {
  name: string;
  latitude: number;
  longitude: number;
  type: 'capital' | 'major';
}

export const MAHARASHTRA_CITIES: MaharashtraCity[] = [
  { name: 'Mumbai', latitude: 18.9220, longitude: 72.8347, type: 'capital' },
  { name: 'Pune', latitude: 18.5204, longitude: 73.8567, type: 'major' },
  { name: 'Nagpur', latitude: 21.1458, longitude: 79.0882, type: 'major' },
  { name: 'Nashik', latitude: 19.9975, longitude: 73.7898, type: 'major' },
  { name: 'Chh. Sambhajinagar', latitude: 19.8762, longitude: 75.3433, type: 'major' },
  { name: 'Solapur', latitude: 17.6599, longitude: 75.9064, type: 'major' },
  { name: 'Kolhapur', latitude: 16.7050, longitude: 74.2433, type: 'major' },
  { name: 'Satara', latitude: 17.6805, longitude: 73.9997, type: 'major' },
  { name: 'Nanded', latitude: 19.1383, longitude: 77.3210, type: 'major' },
  { name: 'Amravati', latitude: 20.9374, longitude: 77.7796, type: 'major' },
  { name: 'Thane', latitude: 19.2183, longitude: 72.9781, type: 'major' },
];

export interface MaharashtraRiver {
  name: string;
  coords: Array<[number, number]>;
}

export const MAHARASHTRA_RIVERS: MaharashtraRiver[] = [
  {
    name: 'Mutha River',
    coords: [
      [18.37, 73.55], // Western Ghats headwaters
      [18.38, 73.62], // Panshet
      [18.44, 73.76], // Khadakwasla
      [18.52, 73.85], // Pune City
      [18.53, 73.89], // Bund Garden
      [18.54, 74.05], // Confluence with Bhima
    ]
  },
  {
    name: 'Pavana River',
    coords: [
      [18.67, 73.48], // Pavana origin
      [18.66, 73.50], // Pavana Dam
      [18.73, 73.68], // Talegaon
      [18.63, 73.80], // Pimpri-Chinchwad
      [18.58, 73.83], // Sangvi confluence
    ]
  },
  {
    name: 'Bhima River',
    coords: [
      [19.07, 73.53], // Bhimashankar origin
      [18.92, 73.82], // Chaskaman Dam
      [18.85, 73.91], // Rajgurunagar
      [18.60, 74.20],
      [18.07, 75.12],
      [17.68, 75.33],
      [17.30, 75.90],
    ]
  },
  {
    name: 'Ghod River',
    coords: [
      [19.12, 73.68], // Western Ghats origin
      [19.10, 73.75], // Dimbhe Dam
      [19.03, 73.83], // Ghodegaon
      [18.83, 74.38], // Shirur confluence
    ]
  }
];
