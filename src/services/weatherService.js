import { source } from './dataSource.js';

// 本番では気象API/自治体APIをフロントから直接叩かず、
// Supabase Edge Function (例: /functions/v1/weather?municipality_id=...) を経由する。
export const weatherService = {
  async today(municipalityId) {
    const rows = await source.list('disaster', { municipalityId, filters: { kind: 'weather' } });
    return rows[0] || null;
  },
};
