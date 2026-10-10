import { MAHARASHTRA_DAMS } from '../data/dams';

export interface LiveMonitoringItem {
  id: string;
  damName: string;
  district: string;
  river: string;
  lastObservation: string;
  observedChange: string;
  status: 'NORMAL' | 'WATCH' | 'ALERT';
  lastChecked: string;
  quality: string;
}

export const monitoringService = {
  async getLiveMonitoringFeed(): Promise<LiveMonitoringItem[]> {
    const feed = MAHARASHTRA_DAMS.map((dam) => ({
      id: dam.id,
      damName: dam.name,
      district: dam.district,
      river: dam.river,
      lastObservation: dam.lastObservation,
      observedChange: dam.detectedChange,
      status: dam.monitoringStatus as any,
      lastChecked: '2 mins ago',
      quality: 'Sentinel-2 (10m) / Good',
    }));
    return Promise.resolve(feed);
  },
};
