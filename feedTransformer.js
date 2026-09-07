import { createHash } from 'node:crypto';

/**
 * 自治体の緊急情報RSS / お知らせRSS 用の変換。
 * RSS2.0（title/link/description/pubDate/guid）と Atom（title/link/summary/updated/id）の
 * どちらでも同じ形になるよう、候補キーを並べて拾う。
 */
const F = {
  title: ['title'],
  body: ['description', 'summary', 'content', 'encoded'],
  link: ['link', 'id'],
  published: ['pubdate', 'published', 'updated', 'date'],
  guid: ['guid', 'id', 'link'],
};

const pick = (row, keys) => {
  for (const k of keys) {
    const v = row[k];
    if (v != null && String(v).trim() !== '') return String(v).trim();
  }
  return null;
};

/** 緊急度の推定。判断材料は本文の語のみで、無ければ通常のお知らせ扱い */
const URGENT = /(避難|警報|特別警報|緊急|災害|地震|津波|土砂|氾濫|停電|断水|開設)/;

export function transform(rows, ctx) {
  const records = [];
  const skipped = [];

  rows.forEach((raw, i) => {
    const title = pick(raw, F.title);
    if (!title) {
      skipped.push({ index: i, reason: 'title が無い', keys: Object.keys(raw).join(',') });
      return;
    }

    const link = pick(raw, F.link);
    const publishedAt = normalizeDateTime(pick(raw, F.published));
    const body = pick(raw, F.body);
    const urgent = URGENT.test(title + ' ' + (body || ''));

    const payload = {
      dataset: ctx.category === 'disaster' ? 'disaster_feed' : 'notice_feed',
      kind: ctx.category === 'disaster' ? (urgent ? 'alert' : 'info') : 'notice',
      title,
      body,
      link,
      published_at: publishedAt,
      urgent,
    };

    records.push({
      municipality_id: ctx.municipality.id,
      category: ctx.category,
      title,
      description: body ? body.slice(0, 400) : null,
      source_url: link || ctx.url,
      source_type: ctx.sourceType,
      license: ctx.license,
      source_record_id: pick(raw, F.guid) || `feed_${title}_${publishedAt || i}`,
      source_updated_at: publishedAt,
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
