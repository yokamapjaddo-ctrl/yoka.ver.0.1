import { source } from './dataSource.js';

export const transportService = {
  list: (municipalityId, filters) => source.list('transport', { municipalityId, filters }),
  get: (id) => source.get('transport', id),
};
