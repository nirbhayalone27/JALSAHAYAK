import {
  SatelliteObservation,
  DetectedChange,
  getObservationsForDam,
  calculateSatelliteChange,
} from '../data/observations';
import { MAHARASHTRA_DAMS, MaharashtraDam } from '../data/dams';

export const satelliteService = {
  /**
   * Retrieves all available Copernicus Sentinel satellite observations for any selected dam
   */
  async getObservationsForDam(damId: string): Promise<SatelliteObservation[]> {
    return Promise.resolve(getObservationsForDam(damId));
  },

  /**
   * Retrieves a specific satellite observation by date for a dam
   */
  async getObservationByDate(damId: string, date: string): Promise<SatelliteObservation | null> {
    const list = getObservationsForDam(damId);
    const obs = list.find((o) => o.date === date);
    return Promise.resolve(obs ? { ...obs } : null);
  },

  /**
   * Performs evidence-based multi-date satellite comparison for a dam's AOI
   */
  async compareObservations(
    damId: string,
    dateA: string,
    dateB: string
  ): Promise<{
    observationA: SatelliteObservation | null;
    observationB: SatelliteObservation | null;
    changes: DetectedChange[];
  }> {
    const dam = MAHARASHTRA_DAMS.find((d) => d.id.toLowerCase() === damId.toLowerCase()) || MAHARASHTRA_DAMS[0];
    const obsA = await this.getObservationByDate(damId, dateA);
    const obsB = await this.getObservationByDate(damId, dateB);

    if (!obsA || !obsB) {
      return {
        observationA: obsA,
        observationB: obsB,
        changes: [],
      };
    }

    const changes = calculateSatelliteChange(dam, obsA, obsB);

    return {
      observationA: obsA,
      observationB: obsB,
      changes,
    };
  },
};
