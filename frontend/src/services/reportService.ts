import { MONITORING_REPORTS, MonitoringReport } from '../data/reports';

export const reportService = {
  async getAllReports(): Promise<MonitoringReport[]> {
    return Promise.resolve([...MONITORING_REPORTS]);
  },

  async getReportsByCategory(category: string): Promise<MonitoringReport[]> {
    if (category === 'All Reports') return Promise.resolve([...MONITORING_REPORTS]);
    return Promise.resolve(
      MONITORING_REPORTS.filter((r) => r.category === category)
    );
  },

  async getReportById(id: string): Promise<MonitoringReport | null> {
    const report = MONITORING_REPORTS.find((r) => r.id === id);
    return Promise.resolve(report ? { ...report } : null);
  },
};
