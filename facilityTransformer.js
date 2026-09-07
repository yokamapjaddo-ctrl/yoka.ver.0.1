import { createHash } from 'node:crypto';

/**
 * 避難所・公共施設CSV 用の変換。
 * 自治体ごとに列名が違うため、よくある表記を候補として並べて拾う。
 * 1回 dry-run すると、拾えなかった行のヘッダー一覧がログに出る。
 */
const F = {
  recordId: ['ID', 'id', '施設ID', 'No', 'NO', '番号'],
  name: ['名称', '施設名', '避難所名称', '避難場所名称', '施設名称', 'name'],
  kana: ['名称_カナ', 'カナ', 'ふりがな', '名称カナ'],
  address: ['住所', '所在地', '所在地_連結表記', '所在地住所', 'address'],
  lat: ['緯度', 'lat', 'latitude'],
  lng: ['経度', 'lon', 'lng', 'longitude'],
  tel: ['電話番号', 'TEL', 'tel', '連絡先'],
  capacity: ['収容人数', '想定収容人数', '収容可能人数', 'capacity'],
  ward: ['区', '区名', '行政区'],
  note: ['備考', '説明', '概要'],
  url: ['URL', 'url', 'ホームページ'],
};

// 「洪水: 1 / 崖崩れ: 0」のような災害種別フラグ列
const HAZARD_COLUMNS = ['洪水', '崖崩れ', '土石流', '地滑り', '高潮', '地震', '津波', '大規模な火事', '内水氾濫', '火山現象'];
const TRUE_VALUES = new Set(['1', '○', '◯', '〇', 'o', 'O', '対応', 'true', 'TRUE', 'はい', 'あり']);

const pick = (row, keys) => {
  for (const k of keys) {
    if (row[k] != null && String(row[k]).trim() !== '') return String(row[k]).trim();
  }
  return null;
};

const num = (v) => {
  if (v == null) return null;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
};

export function transform(rows, ctx) {
  const records = [];
  const skipped = [];

  rows.forEach((raw, i) => {
    const name = pick(raw, F.name);
    if (!name) {
      skipped.push({ index: i, reason: '施設名の列が見つからない', keys: Object.keys(raw).join(',') });
      return;
    }

    const hazards = HAZARD_COLUMNS.filter((h) => raw[h] != null && TRUE_VALUES.has(String(raw[h]).trim()));
    const address = pick(raw, F.address);

    const payload = {
      dataset: ctx.dataset || 'facilities',
      facility_category: ctx.facilityCategory || 'shelter',
      name,
      kana: pick(raw, F.kana),
      address,
      lat: num(pick(raw, F.lat)),
      lng: num(pick(raw, F.lng)),
      tel: pick(raw, F.tel),
      capacity: num(pick(raw, F.capacity)),
      ward_name: pick(raw, F.ward),
      hazards,
      note: pick(raw, F.note),
      url: pick(raw, F.url),
    };

    records.push({
      municipality_id: ctx.municipality.id,
      category: ctx.category,
      title: name,
      description: address,
      source_url: ctx.url,
      source_type: ctx.sourceType,
      license: ctx.license,
      source_record_id: pick(raw, F.recordId) || `facility_${name}_${address || i}`,
      source_updated_at: null,
      payload,
      raw,
      content_hash: hash(payload),
    });
  });

  return { records, skipped };
}

function hash(obj) {
  return createHash('sha256').update(JSON.stringify(obj)).digest('hex');
}

export default { transform };
