import { source } from './dataSource.js';

export const shopService = {
  list: (municipalityId, filters) => source.list('shops', { municipalityId, filters }),
  get: (id) => source.get('shops', id),
};
