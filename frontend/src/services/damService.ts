import { MAHARASHTRA_DAMS, MaharashtraDam } from '../data/dams';

export interface DamFilterParams {
  search?: string;
  district?: string;
  river?: string;
  damType?: string;
  riskLevel?: string;
}

export const damService = {
  async getAllDams(): Promise<MaharashtraDam[]> {
    return Promise.resolve([...MAHARASHTRA_DAMS]);
  },

  async getDamById(id: string): Promise<MaharashtraDam | null> {
    const dam = MAHARASHTRA_DAMS.find((d) => d.id === id);
    return Promise.resolve(dam ? { ...dam } : null);
  },

  async filterDams(params: DamFilterParams): Promise<MaharashtraDam[]> {
    let result = [...MAHARASHTRA_DAMS];

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.river.toLowerCase().includes(q) ||
          d.district.toLowerCase().includes(q)
      );
    }

    if (params.district && params.district !== 'All Districts') {
      result = result.filter((d) => d.district === params.district);
    }

    if (params.river && params.river !== 'All Rivers') {
      result = result.filter((d) => d.river.toLowerCase().includes(params.river!.toLowerCase()));
    }

    if (params.damType && params.damType !== 'All Types' && params.damType !== 'All Dam Types') {
      result = result.filter((d) => d.damType.toLowerCase().includes(params.damType!.toLowerCase()));
    }

    if (params.riskLevel && params.riskLevel !== 'All Risk Levels') {
      result = result.filter((d) => d.riskLevel.toLowerCase() === params.riskLevel!.toLowerCase());
    }

    return Promise.resolve(result);
  }
};
