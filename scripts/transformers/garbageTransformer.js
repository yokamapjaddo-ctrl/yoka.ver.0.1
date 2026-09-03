import { createHash } from 'node:crypto';

/**
 * 大和市「資源とごみの分別一覧」CSV 用の変換。
 * 例: 品目名「アイロン」→ 区分「燃やせないごみ」 のような1行1品目のデータ。
 *
 * ★ 実CSVのヘッダー名は未確認です。1回実行すると、取り込めなかった行のヘッダー一覧が
 *   ログに出ます（"取り込めず" の keys を見る）。そこに出た実際の列名を
 *   FIELD_CANDIDATES に1つだけ残す形で書き換えてください。
 */
const FIELD_CANDIDATES = {
  recordId: [],
  itemName: ['品名'],
  disposalClass: ['分類'],
  note: ['出し方のポイント'],
  yomi: ['読み'],
  initial: ['品名頭文字'],
  similar: ['類似語'],
  updatedAt: [],
};

const pick = (row, keys) => {
  for (const k of keys) {
    if (row[k] != null && String(row[k]).trim() !== '') return String(row[k]).trim();
  }
  return null;
};

export function transform(rows, ctx) {
  const records = [];
  const skipped = [];

  rows.forEach((raw, i) => {
    const itemName = pick(raw, FIELD_CANDIDATES.itemName);
    const disposalClass = pick(raw, FIELD_CANDIDATES.disposalClass);

    // 品目名が取れない行は取り込まない（列名が違う可能性 → ログで気づける）
    if (!itemName) {
      skipped.push({ index: i, reason: '品目名の列が見つからない', keys: Object.keys(raw).join(',') });
      return;
    }

     const payload = {
      dataset: 'garbage_items',
      item_name: itemName,
      disposal_class: disposalClass,
      yomi: pick(raw, FIELD_CANDIDATES.yomi),
      initial: pick(raw, FIELD_CANDIDATES.initial),
      similar_words: pick(raw, FIELD_CANDIDATES.similar),
      note: pick(raw, FIELD_CANDIDATES.note),
    };
    
    records.push({
      municipality_id: ctx.municipality.id,
      category: ctx.category,
      title: itemName,
      description: disposalClass ? `区分: ${disposalClass}` : null,
      source_url: ctx.url,
      source_type: ctx.sourceType,
      license: ctx.license,
      // 品目名は一覧内で一意。ID列があれば recordId 側が優先される
      source_record_id: pick(raw, FIELD_CANDIDATES.recordId) || `item_${itemName}`,
      source_updated_at: normalizeDateTime(pick(raw, FIELD_CANDIDATES.updatedAt)),
      payload,
      raw,
      content_hash: hash(payload),
    });
  });

  return { records, skipped };
}

function normalizeDateTime(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function hash(obj) {
  return createHash('sha256').update(JSON.stringify(obj)).digest('hex');
}

export default { transform };
