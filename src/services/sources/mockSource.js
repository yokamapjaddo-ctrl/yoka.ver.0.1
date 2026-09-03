import { municipalities } from '../../data/mock/municipalities.js';
import { garbage } from '../../data/mock/garbage.js';
import { events } from '../../data/mock/events.js';
import { disaster } from '../../data/mock/disaster.js';
import { facilities } from '../../data/mock/facilities.js';
import { shops } from '../../data/mock/shops.js';
import { notices } from '../../data/mock/notices.js';
import { transport } from '../../data/mock/transport.js';

const TABLES = { municipalities, garbage, events, disaster, facilities, shops, notices, transport };
const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

export async function list(table, { municipalityId, filters = {} } = {}) {
  await delay();
  const rows = TABLES[table] || [];
  return rows.filter((row) => {
    if (municipalityId && row.municipality_id && row.municipality_id !== municipalityId) return false;
    return Object.entries(filters).every(([k, v]) => v == null || row[k] === v);
  });
}

export async function get(table, id) {
  await delay();
  return (TABLES[table] || []).find((row) => row.id === id) || null;
}
