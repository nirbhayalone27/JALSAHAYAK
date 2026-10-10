/**
 * Automatically generated monitoring reports for Pune region dams
 * Scope: Strictly 10 Pune-Region Dams
 */

export interface MonitoringReport {
  id: string;
  reportCode: string;
  damId: string;
  damName: string;
  period: string;
  category: 'Monthly' | 'Event Based' | 'Simulation Reports';
  status: 'Generated' | 'Archived';
  generatedAt: string;
  summary: string;
  latestObservation: string;
  previousObservation: string;
  detectedChanges: string[];
  monitoringStatus: 'NORMAL' | 'WATCH' | 'ALERT';
  statusReasons: string[];
  scenarioDetails?: {
    name: string;
    inundatedAreaSqKm: number;
    maxDepthM: number;
    affectedVillages: number;
  };
  evidenceSources: string[];
  officialLimitations: string[];
}

export const MONITORING_REPORTS: MonitoringReport[] = [
  {
    id: 'rep-khadakwasla-oct2026',
    reportCode: 'Khadakwasla_Monitoring_Oct2026',
    damId: 'khadakwasla',
    damName: 'Khadakwasla Dam',
    period: '01 Oct – 08 Oct 2026',
    category: 'Event Based',
    status: 'Generated',
    generatedAt: '08 Oct 2026, 03:00 PM',
    summary: 'Comprehensive multi-date observation analysis indicates elevated reservoir storage (88.4%) following intense catchment inflows from upstream Panshet and Varasgaon reservoirs. Downstream Mutha spillway release channels reflect active regulated discharge.',
    latestObservation: '08 Oct 2026 (Sentinel-2 MSI 10m Optical)',
    previousObservation: '04 Oct 2026 (Sentinel-2 MSI 10m Optical)',
    detectedChanges: [
      'Reservoir water spread expanded by 1.8 km² (+9.5%)',
      'Downstream reflectance signature indicates active channel flow towards Pune Deccan riverbed',
      'NDWI mean shifted from 0.62 to 0.71'
    ],
    monitoringStatus: 'WATCH',
    statusReasons: [
      'Reservoir storage reached 88.4% of design capacity',
      'Elevated inflow persistence from Mutha catchment tributaries',
      'Downstream riverbed alerts coordinated with Pune Municipal Corporation'
    ],
    scenarioDetails: {
      name: 'Khadakwasla Spillway Surge Overtopping Scenario',
      inundatedAreaSqKm: 28.5,
      maxDepthM: 8.4,
      affectedVillages: 6
    },
    evidenceSources: [
      'European Space Agency (ESA) Copernicus Sentinel-2 MSI Optical Imagery',
      'Maharashtra Water Resources Department (WRD) Pune Division Reservoir Bulletin',
      'NASA/USGS SRTM 30m Digital Elevation Model',
      'India-WRIS National Dam Inventory'
    ],
    officialLimitations: [
      'Satellite observations detect surface water extent only and CANNOT measure internal structural dam integrity or masonry core health.',
      'Dam-break flood routing uses hydrodynamic equations and 30m DEM terrain data; actual inundation depends on local topography, structures, and gate operations.',
      'This intelligence report is for decision support and planning; official evacuations remain under the jurisdiction of Pune District Disaster Management Authority (DDMA).'
    ]
  },
  {
    id: 'rep-panshet-oct2026',
    reportCode: 'Panshet_Monitoring_Oct2026',
    damId: 'panshet',
    damName: 'Panshet Dam',
    period: '01 Oct – 08 Oct 2026',
    category: 'Monthly',
    status: 'Generated',
    generatedAt: '08 Oct 2026, 12:30 PM',
    summary: 'Monthly observation synthesis for Panshet and Varasgaon twin catchment system. Water volume stands at 78.1% FRL with normal seasonal headworks behavior.',
    latestObservation: '07 Oct 2026 (Sentinel-2 MSI)',
    previousObservation: '03 Oct 2026 (Sentinel-2 MSI)',
    detectedChanges: [
      'Catchment inflow expanded surface area by 4.1%',
      'Downstream Mutha river course clear through Khadakwasla entry'
    ],
    monitoringStatus: 'WATCH',
    statusReasons: [
      'Localized catchment rainfall of 85mm recorded in Western Ghats',
      'Coordination active with downstream Khadakwasla spillway'
    ],
    evidenceSources: ['Copernicus Sentinel-2', 'Maharashtra WRD Pune Division'],
    officialLimitations: [
      'Surface observation only; ground telemetry required for pore pressure and foundation seepage verification.'
    ]
  },
  {
    id: 'rep-chaskaman-oct2026',
    reportCode: 'Chaskaman_Monitoring_Oct2026',
    damId: 'chaskaman',
    damName: 'Chaskaman Dam',
    period: '01 Oct – 08 Oct 2026',
    category: 'Event Based',
    status: 'Generated',
    generatedAt: '08 Oct 2026, 09:15 AM',
    summary: 'Surge inflow event report following Bhima river headwater monsoon precipitation in Pune district.',
    latestObservation: '08 Oct 2026 (Sentinel-2 MSI)',
    previousObservation: '04 Oct 2026 (Sentinel-2 MSI)',
    detectedChanges: [
      'Bhima river inlet expansion into reservoir backwaters',
      'Active storage elevated by 6.8%'
    ],
    monitoringStatus: 'WATCH',
    statusReasons: [
      'Inflow exceedance of 14,200 m³/s into upstream reservoir'
    ],
    evidenceSources: ['Copernicus Sentinel-2', 'Bhima Basin Telemetry'],
    officialLimitations: [
      'Satellite revisit intervals do not capture flash hydrographs under heavy cloud cover.'
    ]
  },
  {
    id: 'rep-pawana-oct2026',
    reportCode: 'Pawana_Event_Oct2026',
    damId: 'pawana',
    damName: 'Pavana Dam',
    period: '25 Sep – 01 Oct 2026',
    category: 'Simulation Reports',
    status: 'Generated',
    generatedAt: '01 Oct 2026, 04:00 PM',
    summary: 'Baseline post-monsoon storage evaluation for Pavana reservoir supplying Pimpri-Chinchwad municipal region.',
    latestObservation: '08 Oct 2026 (Sentinel-2 MSI)',
    previousObservation: '04 Oct 2026 (Sentinel-2 MSI)',
    detectedChanges: [
      'Stable surface boundary matching historical median for early October'
    ],
    monitoringStatus: 'NORMAL',
    statusReasons: [
      'Storage at 79.4% with balanced upstream inflows and municipal drawdowns'
    ],
    evidenceSources: ['Copernicus Sentinel-2', 'Pawana WRD Division'],
    officialLimitations: [
      'Earthen embankment structural stability requires piezometer and inclinometer inspections.'
    ]
  }
];
