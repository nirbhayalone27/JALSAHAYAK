import { MAHARASHTRA_ALERTS, DamAlert } from '../data/alerts';

export const alertService = {
  async getAllAlerts(): Promise<DamAlert[]> {
    return Promise.resolve([...MAHARASHTRA_ALERTS]);
  },

  async getAlertsBySeverity(severity: string): Promise<DamAlert[]> {
    if (severity === 'All') return Promise.resolve([...MAHARASHTRA_ALERTS]);
    return Promise.resolve(
      MAHARASHTRA_ALERTS.filter(
        (a) => a.severity.toLowerCase() === severity.toLowerCase()
      )
    );
  },

  async getAlertsForDam(damId: string): Promise<DamAlert[]> {
    return Promise.resolve(
      MAHARASHTRA_ALERTS.filter((a) => a.damId === damId)
    );
  },
};
