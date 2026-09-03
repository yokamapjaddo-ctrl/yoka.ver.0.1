import { log } from '../lib/logger.js';

const TABLE = 'source_records';

/**
 * 差分を見て、必要な行だけ書き込む。
 *  - DBに無い          → INSERT（status は 'pending' で登録）
 *  - content_hash 変化 → UPDATE（status は既存のまま維持）
 *  - 変化なし          → 何もしない
 *  - 今回のデータに無い → status = 'inactive'（物理削除はしない）
 */
export async function syncRecords(supabase, { municipalityId, category, records, dryRun = false }) {
  const { data: existing, error } = await supabase
    .from(TABLE)
    .select('id, source_record_id, content_hash, status')
    .eq('municipality_id', municipalityId)
    .eq('category', category);

  if (error) throw new Error(`Supabase読み取りエラー: ${error.message}`);

  const existingMap = new Map((existing || []).map((r) => [r.source_record_id, r]));
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

  // 今回の取得結果に含まれない既存行 → inactive（すでに inactive のものは触らない）
  const incomingIds = new Set(records.map((r) => r.source_record_id));
  const toInactivate = (existing || []).filter((r) => !incomingIds.has(r.source_record_id) && r.status !== 'inactive');

  if (dryRun) {
    log.warn('dry-run のため書き込みはしません');
  } else {
    if (toInsert.length) {
      const { error: e } = await supabase.from(TABLE).insert(toInsert);
      if (e) throw new Error(`Supabase書き込みエラー(INSERT): ${e.message}`);
    }
    for (const row of toUpdate) {
      const { id, ...rest } = row;
      const { error: e } = await supabase.from(TABLE).update(rest).eq('id', id);
      if (e) throw new Error(`Supabase書き込みエラー(UPDATE id=${id}): ${e.message}`);
    }
    if (toInactivate.length) {
      const { error: e } = await supabase
        .from(TABLE)
        .update({ status: 'inactive', fetched_at: now })
        .in('id', toInactivate.map((r) => r.id));
      if (e) throw new Error(`Supabase書き込みエラー(inactive): ${e.message}`);
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
