import { source } from './dataSource.js';

export const eventService = {
  list: (municipalityId, filters) => source.list('events', { municipalityId, filters }),
  get: (id) => source.get('events', id),
};
