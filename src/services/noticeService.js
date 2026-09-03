import { source } from './dataSource.js';

export const noticeService = {
  list: (municipalityId, filters) => source.list('notices', { municipalityId, filters }),
  get: (id) => source.get('notices', id),
};
