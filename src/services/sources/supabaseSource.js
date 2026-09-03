import { supabase } from '../../lib/supabaseClient.js';

// mockSource と同じシグネチャ。差し替えは VITE_DATA_SOURCE=supabase だけ。
export async function list(table, { municipalityId, filters = {} } = {}) {
  if (!supabase) throw new Error('Supabase is not configured');
  let q = supabase.from(table).select('*');
  if (municipalityId) q = q.eq('municipality_id', municipalityId);
  Object.entries(filters).forEach(([k, v]) => { if (v != null) q = q.eq(k, v); });
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function get(table, id) {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}
