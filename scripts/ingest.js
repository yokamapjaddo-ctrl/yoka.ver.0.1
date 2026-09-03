#!/usr/bin/env node
/**
 * 取り込みの入口。
 *   node ingest.js --municipality=yamato_kanagawa --dataset=garbage [--dry-run]
 *
 * 流れ: 設定を解決 → HTTP取得 → 整形 → 差分判定 → Supabase反映 → ログ出力
 */
import { resolveSource } from './config/sources.js';
import { fetchRows } from './collectors/httpCollector.js';
import garbageTransformer from './transformers/garbageTransformer.js';
import { createAdminClient } from './services/supabaseAdmin.js';
import { syncRecords, writeRunLog } from './services/ingestService.js';
import { log } from './lib/logger.js';

const TRANSFORMERS = { garbage: garbageTransformer };

function arg(name, fallback = null) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
}

async function main() {
  const startedAt = new Date().toISOString();
  const municipalityId = arg('municipality', 'yamato_kanagawa');
  const datasetKey = arg('dataset', 'garbage');
  const dryRun = process.argv.includes('--dry-run');

  log.info(`=== YOKA ingest 開始 (municipality=${municipalityId}, dataset=${datasetKey}, dryRun=${dryRun}) ===`);

  const source = resolveSource(municipalityId, datasetKey);
  const supabase = createAdminClient();

  let stats = { inserted: 0, updated: 0, unchanged: 0, inactivated: 0 };
  let fetchedCount = 0;
  let skippedCount = 0;

  try {
    const { rows, sourceType } = await fetchRows(source);
    fetchedCount = rows.length;

    const transformer = TRANSFORMERS[source.transformer];
    if (!transformer) throw new Error(`transformer が見つかりません: ${source.transformer}`);

    const { records, skipped } = transformer.transform(rows, { ...source, sourceType });
    skippedCount = skipped.length;

    if (skipped.length) {
      log.warn(`${skipped.length} 件を取り込めませんでした（列名が想定と違う可能性）`);
      log.warn('例: ' + JSON.stringify(skipped.slice(0, 3)));
    }
    if (!records.length) {
      throw new Error('整形後の件数が0件です。transformers/garbageTransformer.js の列名設定（FIELD_CANDIDATES）を実データに合わせてください。');
    }

    stats = await syncRecords(supabase, {
      municipalityId: source.municipality.id,
      category: source.category,
      records,
      dryRun,
    });

    log.summary('取り込み結果', {
      自治体: `${source.municipality.name} (${source.municipality.id})`,
      カテゴリ: source.category,
      取得件数: fetchedCount,
      整形成功: records.length,
      取り込めず: skippedCount,
      新規: stats.inserted,
      更新: stats.updated,
      変更なし: stats.unchanged,
      非表示化: stats.inactivated,
      モード: dryRun ? 'dry-run（書き込みなし）' : '本番書き込み',
    });

    if (!dryRun) {
      await writeRunLog(supabase, {
        municipality_id: source.municipality.id,
        category: source.category,
        source_url: source.url,
        fetched_count: fetchedCount,
        inserted_count: stats.inserted,
        updated_count: stats.updated,
        unchanged_count: stats.unchanged,
        inactivated_count: stats.inactivated,
        skipped_count: skippedCount,
        status: 'success',
        started_at: startedAt,
      });
    }

    log.info('=== 正常終了 ===');
  } catch (e) {
    log.error(e.message);
    if (!dryRun) {
      try {
        await writeRunLog(supabase, {
          municipality_id: municipalityId,
          category: datasetKey,
          fetched_count: fetchedCount,
          skipped_count: skippedCount,
          status: 'error',
          error_message: e.message,
          started_at: startedAt,
        });
      } catch { /* ログ保存の失敗は無視 */ }
    }
    process.exit(1); // GitHub Actions を赤くして失敗に気づけるようにする
  }
}

main();
