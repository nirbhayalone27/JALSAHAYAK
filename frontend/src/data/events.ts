/**
 * Historical monitoring events and upcoming scheduled events
 * Scope: Strictly Pune Region Dams
 */

export interface MonitoringEvent {
  id: string;
  date: string;
  damName: string;
  district: string;
  eventType: 'Satellite change detected' | 'High inflow' | 'Water spread change' | 'Flood scenario analysed' | 'Gate Operation' | 'Heavy Rainfall (Forecast)';
  changeSummary: string;
  status: 'NORMAL' | 'WATCH' | 'ALERT';
  reportId?: string;
  location: string;
}

export const PAST_EVENTS: MonitoringEvent[] = [
  {
    id: 'evt-01',
    date: '08 Oct 2026',
    damName: 'Khadakwasla Dam',
    district: 'Pune',
    eventType: 'Satellite change detected',
    changeSummary: 'Water spread increased by +9.5% across Mutha reservoir basin',
    status: 'WATCH',
    reportId: 'rep-khadakwasla-oct2026',
    location: 'Khadakwasla Reservoir'
  },
  {
    id: 'evt-02',
    date: '07 Oct 2026',
    damName: 'Chaskaman Dam',
    district: 'Pune',
    eventType: 'High inflow',
    changeSummary: 'Upper Bhima catchment releases brought inflow to 14,200 m³/s',
    status: 'WATCH',
    reportId: 'rep-chaskaman-oct2026',
    location: 'Bhima Basin'
  },
  {
    id: 'evt-03',
    date: '05 Oct 2026',
    damName: 'Panshet Dam',
    district: 'Pune',
    eventType: 'Water spread change',
    changeSummary: 'Localized catchment expansion after 85mm Western Ghats rainfall',
    status: 'WATCH',
    reportId: 'rep-panshet-oct2026',
    location: 'Ambi Valley'
  },
  {
    id: 'evt-04',
    date: '02 Oct 2026',
    damName: 'Pavana Dam',
    district: 'Pune',
    eventType: 'Flood scenario analysed',
    changeSummary: 'Dam-break 60m breach simulation routed downstream to Pimpri-Chinchwad',
    status: 'NORMAL',
    reportId: 'rep-pawana-oct2026',
    location: 'Pavana River Corridor'
  },
  {
    id: 'evt-05',
    date: '28 Sep 2026',
    damName: 'Varasgaon Dam',
    district: 'Pune',
    eventType: 'Satellite change detected',
    changeSummary: 'Mose river post-monsoon normal storage boundary updated',
    status: 'NORMAL',
    reportId: 'rep-varasgaon-sep2026',
    location: 'Mose Valley'
  }
];

export const UPCOMING_EVENTS = [
  { date: '02 Oct 2026', event: 'Heavy Rainfall (Forecast)', location: 'Lonavala / Western Ghats' },
  { date: '03 Oct 2026', event: 'Inflow Increase (Expected)', location: 'Khadakwasla' },
  { date: '05 Oct 2026', event: 'Gate Operation (Planned)', location: 'Panshet' },
  { date: '10 Oct 2026', event: 'Maintenance Check', location: 'Pavana Dam' },
];
