/**
 * Evidence-based alerts for Pune region dams
 */

export interface DamAlert {
  id: string;
  damId: string;
  damName: string;
  district: string;
  severity: 'High' | 'Medium' | 'Low' | 'Update';
  title: string;
  reason: string;
  timeAgo: string;
  timestamp: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  evidence: {
    metric: string;
    value: string;
    threshold: string;
  };
  recommendedAction: string;
}

export const MAHARASHTRA_ALERTS: DamAlert[] = [
  {
    id: 'alt-01',
    damId: 'khadakwasla',
    damName: 'Khadakwasla Dam',
    district: 'Pune',
    severity: 'High',
    title: 'Water level exceeding threshold',
    reason: 'Reservoir level reached 88.4% of design capacity with +9.5% surface spread increase. Downstream Mutha river discharge channels active towards Deccan riverbed.',
    timeAgo: '2 hours ago',
    timestamp: '08 Oct 2026, 02:20 PM',
    status: 'Active',
    evidence: {
      metric: 'Reservoir Storage',
      value: '88.4%',
      threshold: '80.0% (Watch), 85.0% (High)'
    },
    recommendedAction: 'Verify spillway radial gates readiness. Coordinate discharge telemetry with Pune Municipal Corporation (PMC) and Disaster Management Authority.'
  },
  {
    id: 'alt-02',
    damId: 'panshet',
    damName: 'Panshet Dam',
    district: 'Pune',
    severity: 'Medium',
    title: 'Unusual change in water spread',
    reason: 'Sentinel-2 observation indicates Ambi river catchment expansion after 85mm localized rainfall in Western Ghats headwaters.',
    timeAgo: '5 hours ago',
    timestamp: '08 Oct 2026, 11:15 AM',
    status: 'Active',
    evidence: {
      metric: 'Catchment Rainfall',
      value: '85 mm / 24h',
      threshold: '60 mm'
    },
    recommendedAction: 'Monitor cascade discharge telemetry into downstream Khadakwasla reservoir.'
  },
  {
    id: 'alt-03',
    damId: 'chaskaman',
    damName: 'Chaskaman Dam',
    district: 'Pune',
    severity: 'Medium',
    title: 'Inflow increase detected',
    reason: 'Upper Bhima river tributary runoff producing sharp inflow surge into Chaskaman reservoir backwaters.',
    timeAgo: '8 hours ago',
    timestamp: '08 Oct 2026, 08:30 AM',
    status: 'Active',
    evidence: {
      metric: 'River Inflow',
      value: '14,200 m³/s',
      threshold: '10,000 m³/s'
    },
    recommendedAction: 'Prepare canal discharge schedules and notify Rajgurunagar (Khed) sub-division authorities.'
  },
  {
    id: 'alt-04',
    damId: 'varasgaon',
    damName: 'Varasgaon Dam',
    district: 'Pune',
    severity: 'Low',
    title: 'Catchment storage observation update',
    reason: 'Mose river valley inflow stabilizes following post-monsoon drawdown. Dam body pore pressure normal.',
    timeAgo: '12 hours ago',
    timestamp: '08 Oct 2026, 04:10 AM',
    status: 'Active',
    evidence: {
      metric: 'Piezometer Pressure',
      value: '0.42 MPa',
      threshold: '< 0.65 MPa'
    },
    recommendedAction: 'Maintain scheduled telemetry sync with Khadakwasla irrigation division.'
  },
  {
    id: 'alt-05',
    damId: 'pawana',
    damName: 'Pavana Dam',
    district: 'Pune',
    severity: 'Update',
    title: 'New satellite observation available',
    reason: 'Cloud-free Sentinel-2 MSI tile processed successfully. Pavana reservoir surface water mask extracted.',
    timeAgo: '1 day ago',
    timestamp: '07 Oct 2026, 03:45 PM',
    status: 'Acknowledged',
    evidence: {
      metric: 'Image Quality',
      value: 'Cloud cover 0.6%',
      threshold: '< 15%'
    },
    recommendedAction: 'Routine catalog update completed. Pimpri-Chinchwad intake telemetry verified.'
  }
];
