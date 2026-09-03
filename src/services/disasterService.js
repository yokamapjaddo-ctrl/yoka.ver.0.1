import { source } from './dataSource.js';

export const disasterService = {
  list: (municipalityId) => source.list('disaster', { municipalityId }),
  async current(municipalityId) {
    const rows = await disasterService.list(municipalityId);
    return rows.find((r) => r.kind === 'alert' && r.active) || null;
  },
  async evacuation(municipalityId) {
    const rows = await disasterService.list(municipalityId);
    return rows.find((r) => r.kind === 'evacuation') || null;
  },
  shelters: (municipalityId) => source.list('facilities', { municipalityId, filters: { category: 'shelter' } }),
};
