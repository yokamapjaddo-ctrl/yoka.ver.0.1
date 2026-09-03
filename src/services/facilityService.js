import { source } from './dataSource.js';

export const facilityService = {
  list: (municipalityId, filters) => source.list('facilities', { municipalityId, filters }),
  get: (id) => source.get('facilities', id),
};
