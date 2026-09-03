import { source } from './dataSource.js';

export const municipalityService = {
  list: () => source.list('municipalities'),
  get: (id) => source.get('municipalities', id),
  async prefectures() {
    const rows = await source.list('municipalities');
    const map = new Map();
    rows.forEach((m) => {
      if (!map.has(m.prefecture)) map.set(m.prefecture, { prefecture: m.prefecture, cities: [] });
      map.get(m.prefecture).cities.push(m);
    });
    return [...map.values()];
  },
};
