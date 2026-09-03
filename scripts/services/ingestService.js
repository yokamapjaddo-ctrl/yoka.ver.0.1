import { log } from '../lib/logger.js';

const TABLE = 'source_records';
const PAGE = 1000;   // Supabase の1回の読み取り上限
const CHUNK = 500;   // 1回の書き込み件数

/** 既存行を全件読む（1000件ずつページング） */
async function fetchExisting(supabase, municipalityId, category) {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('id, source_record_id, content_hash, status')
      .eq('municipality_id', municipalityId)
      .eq('category', category)
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`Supabase読み取りエラー: ${error.message}`);
    rows.push(...data);
    if (data.length < PAGE) break;
  }
  return rows;
}

export async function syncRecords(supabase, { municipalityId, category, records, dryRun = false }) {
  const existing = await fetchExisting(supabase, municipalityId, category);
  log.info(`既存行: ${existing.length} 件`);

  const existingMap = new Map(existing.map((r) => [r.source_record_id, r]));
  const now = new Date().toISOString();

  const toInsert = [];
  const toUpdate = [];
  let unchanged = 0;

  for (const rec of records) {
    const prev = existingMap.get(rec.source_record_id);
    if (!prev) {
      toInsert.push({ ...rec, status: 'pending', fetched_at: now });
    } else if (prev.content_hash !== rec.content_hash) {
      toUpdate.push({ ...rec, id: prev.id, status: prev.status, fetched_at: now });
    } else {
      unchanged += 1;
    }
  }

  const incomingIds = new Set(records.map((r) => r.source_record_id));
  const toInactivate = existing.filter((r) => !incomingIds.has(r.source_record_id) && r.status !== 'inactive');

  if (dryRun) {
    log.warn('dry-run のため書き込みはしません');
  } else {
    for (let i = 0; i < toInsert.length; i += CHUNK) {
      const chunk = toInsert.slice(i, i + CHUNK);
      const { error } = await supabase
        .from(TABLE)
        .upsert(chunk, { onConflict: 'municipality_id,category,source_record_id', ignoreDuplicates: true });
      if (error) throw new Error(`Supabase書き込みエラー(UPSERT): ${error.message}`);
    }
    for (const row of toUpdate) {
      const { id, ...rest } = row;
      const { error } = await supabase.from(TABLE).update(rest).eq('id', id);
      if (error) throw new Error(`Supabase書き込みエラー(UPDATE id=${id}): ${error.message}`);
    }
    if (toInactivate.length) {
      const ids = toInactivate.map((r) => r.id);
      for (let i = 0; i < ids.length; i += CHUNK) {
        const { error } = await supabase
          .from(TABLE)
          .update({ status: 'inactive', fetched_at: now })
          .in('id', ids.slice(i, i + CHUNK));
        if (error) throw new Error(`Supabase書き込みエラー(inactive): ${error.message}`);
      }
    }
  }

  return {
    inserted: toInsert.length,
    updated: toUpdate.length,
    unchanged,
    inactivated: toInactivate.length,
  };
}

export async function writeRunLog(supabase, row) {
  const { error } = await supabase.from('ingest_runs').insert(row);
  if (error) log.warn(`実行ログの保存に失敗（処理自体は継続）: ${error.message}`);
}
