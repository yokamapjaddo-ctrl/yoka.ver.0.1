import { parse } from 'csv-parse/sync';
import { log } from '../lib/logger.js';
import { parseFeed } from '../lib/xml.js';

/**
 * 取得担当。HTTP で取ってきて「配列」にするところまで。
 * 中身の意味づけ（どの列が何か）は transformers 側で行う。
 * 対応形式: csv / json / rss（RSS2.0・Atom）
 */
export async function fetchRows({ url, sourceType }) {
  log.info(`取得開始: ${url}`);

  let res;
  try {
    res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'YOKA-ingest/0.1 (+https://github.com/) contact: yoka' },
    });
  } catch (e) {
    throw new Error(`ネットワークエラー（URLが正しいか、公開されているか確認）: ${e.message}`);
  }

  if (!res.ok) {
    throw new Error(`HTTPエラー ${res.status} ${res.statusText}（URLが変わった / 公開が終了した可能性）`);
  }

  const contentType = res.headers.get('content-type') || '';
  const buffer = Buffer.from(await res.arrayBuffer());
  const type = sourceType || guessType(url, contentType);

  let rows;
  if (type === 'json') {
    rows = pickArray(JSON.parse(decode(buffer)));
  } else if (type === 'rss') {
    rows = parseFeed(decode(buffer));
  } else {
    // 自治体CSVは Shift_JIS のことが多いので UTF-8 で読めなければ CP932 で読み直す
    rows = parse(decode(buffer), { columns: true, skip_empty_lines: true, bom: true, trim: true });
  }

  if (!Array.isArray(rows)) throw new Error('取得データが配列になりませんでした（形式を確認してください）');
  log.info(`取得成功: ${rows.length} 件 / 形式=${type} / content-type=${contentType}`);
  return { rows, sourceType: type };
}

function guessType(url, contentType) {
  if (/json/i.test(contentType) || /\.json(\?|$)/i.test(url)) return 'json';
  if (/xml|rss|atom/i.test(contentType) || /\.(xml|rss|rdf)(\?|$)/i.test(url) || /rss|feed|atom/i.test(url)) return 'rss';
  return 'csv';
}

/** UTF-8 で不正文字が出たら Shift_JIS(CP932) として読み直す */
function decode(buffer) {
  const utf8 = new TextDecoder('utf-8', { fatal: false }).decode(buffer);
  if (!utf8.includes('\uFFFD')) return utf8;
  try {
    return new TextDecoder('shift_jis').decode(buffer);
  } catch {
    return utf8;
  }
}

/** { data: [...] } や { result: { records: [...] } } のような包みを外す */
function pickArray(json) {
  if (Array.isArray(json)) return json;
  for (const key of ['data', 'records', 'items', 'results']) {
    if (Array.isArray(json?.[key])) return json[key];
  }
  if (Array.isArray(json?.result?.records)) return json.result.records;
  throw new Error('JSON の中に配列が見つかりません（キー名を確認して pickArray に追加してください）');
}
