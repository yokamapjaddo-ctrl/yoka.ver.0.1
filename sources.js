import { getMunicipality } from './municipalities.js';

/**
 * データ取得元の定義。
 * URL はコードに書かず、環境変数（GitHub Secrets）から読む。
 * 環境変数名は  SOURCE_URL_<自治体ID>_<データ種別>  の形（すべて大文字）。
 *   例: SOURCE_URL_FUJISAWA_KANAGAWA_DISASTER
 * 新しいデータ種別を増やすときは DATASETS に 1 エントリ追加する。
 */
export const DATASETS = {
  garbage: {
    category: 'garbage',
    transformer: 'garbage',
  },
  disaster: {
    category: 'disaster',
    transformer: 'feed',
    defaultSourceType: 'rss',
  },
  notices: {
    category: 'notices',
    transformer: 'feed',
    defaultSourceType: 'rss',
  },
  shelters: {
    category: 'facilities',
    transformer: 'facility',
    extra: { facilityCategory: 'shelter', dataset: 'shelters' },
  },
  facilities: {
    category: 'facilities',
    transformer: 'facility',
    extra: { facilityCategory: 'public', dataset: 'facilities' },
  },
};

const envKey = (municipalityId, datasetKey, prefix) =>
  `SOURCE_${prefix}_${municipalityId.toUpperCase()}_${datasetKey.toUpperCase()}`;

export function resolveSource(municipalityId, datasetKey) {
  const municipality = getMunicipality(municipalityId);
  const dataset = DATASETS[datasetKey];
  if (!dataset) {
    throw new Error(`未登録の dataset: ${datasetKey}（scripts/config/sources.js に追加してください）`);
  }

  const urlKey = envKey(municipalityId, datasetKey, 'URL');
  const url = process.env[urlKey];
  if (!url) {
    throw new Error(`環境変数 ${urlKey} が未設定です。GitHub Secrets（またはローカルの .env）に配布URLを入れてください。`);
  }

  const declaredType = process.env[envKey(municipalityId, datasetKey, 'TYPE')];
  return {
    municipality,
    datasetKey,
    category: dataset.category,
    transformer: dataset.transformer,
    url,
    // null なら collector 側で拡張子・content-type から自動判定
    sourceType: declaredType || dataset.defaultSourceType || null,
    license: process.env[envKey(municipalityId, datasetKey, 'LICENSE')] || municipality.defaultLicense,
    ...(dataset.extra || {}),
  };
}
