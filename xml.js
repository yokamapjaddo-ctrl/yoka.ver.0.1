/**
 * RSS 2.0 / RDF / Atom を配列にする最小パーサ。
 * 自治体の緊急情報フィードは構造が単純なので、汎用XMLライブラリは入れない。
 * 取り出すのは <item> / <entry> の直下要素だけ。
 */
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function unescapeXml(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, e) => ENTITIES[e])
    .trim();
}

/** 1件分のXML断片を { タグ名: 値 } に開く。名前空間の接頭辞は落とす */
function entryToObject(fragment) {
  const out = {};
  const tag = /<([a-z0-9_:.-]+)([^>]*?)(?:\/>|>([\s\S]*?)<\/\1>)/gi;
  let m;
  while ((m = tag.exec(fragment)) !== null) {
    const name = m[1].replace(/^.*:/, '').toLowerCase();
    const attrs = m[2] || '';
    let value = m[3] != null ? unescapeXml(m[3]) : '';
    // Atom の <link href="..."/> は属性側に本体がある
    if (!value) {
      const href = /href\s*=\s*["']([^"']+)["']/i.exec(attrs);
      if (href) value = href[1];
    }
    // 入れ子が残っている場合はタグを落として本文だけ拾う
    if (/<[a-z]/i.test(value)) value = unescapeXml(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
    if (value && !out[name]) out[name] = value;
  }
  return out;
}

export function parseFeed(xml) {
  const items = [];
  const block = /<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = block.exec(xml)) !== null) items.push(entryToObject(m[2]));
  if (!items.length) {
    throw new Error('フィード内に <item> / <entry> が見つかりません（RSSではないURLの可能性）');
  }
  return items;
}
