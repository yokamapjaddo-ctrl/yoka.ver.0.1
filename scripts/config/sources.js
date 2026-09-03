import { getMunicipality } from './municipalities.js';

/**
 * データ取得元の定義。
 * URL はコードに書かず、環境変数（GitHub Secrets）から読む。
 * 新しいデータ種別を増やすときは DATASETS に 1 エントリ追加する。
 */
export const DATASETS = {
  garbage: {
    category: 'garbage',
    // 環境変数名は  SOURCE_URL_<自治体>_<データ種別>  の形（大文字）
    urlEnvKey: (municipalityId) => `SOURCE_URL_${municipalityId.toUpperCase()}_GARBAGE`,
    typeEnvKey: (municipalityId) => `SOURCE_TYPE_${municipalityId.toUpperCase()}_GARBAGE`,
    transformer: 'garbage',
  },
  // events: { category: 'events', urlEnvKey: (m) => `SOURCE_URL_${m.toUpperCase()}_EVENTS`, ... }
};

export function resolveSource(municipalityId, datasetKey) {
  const municipality = getMunicipality(municipalityId);
  const dataset = DATASETS[datasetKey];
  if (!dataset) {
    throw new Error(`未登録の dataset: ${datasetKey}（scripts/config/sources.js に追加してください）`);
  }

  const urlKey = dataset.urlEnvKey(municipalityId);
  const url = process.env[urlKey];
  if (!url) {
    throw new Error(`環境変数 ${urlKey} が未設定です。GitHub Secrets（またはローカルの .env）に配布URLを入れてください。`);
  }

  const declaredType = process.env[dataset.typeEnvKey(municipalityId)];
  return {
    municipality,
    category: dataset.category,
    transformer: dataset.transformer,
    url,
    sourceType: declaredType || null, // null なら collector 側で自動判定
    license: municipality.defaultLicense,
  };
}
