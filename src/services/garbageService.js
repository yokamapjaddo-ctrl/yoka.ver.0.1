import { source } from './dataSource.js';
import { todayIso } from '../utils/date.js';

export const garbageService = {
  list: (municipalityId, areaId) => source.list('garbage', { municipalityId, filters: { area_id: areaId } }),
  async today(municipalityId, areaId) {
    const rows = await garbageService.list(municipalityId, areaId);
    return rows.find((r) => r.date === todayIso()) || null;
  },
  async next(municipalityId, areaId) {
    const rows = await garbageService.list(municipalityId, areaId);
    const iso = todayIso();
    return rows.filter((r) => r.date >= iso).sort((a, b) => a.date.localeCompare(b.date))[0] || null;
  },
};
