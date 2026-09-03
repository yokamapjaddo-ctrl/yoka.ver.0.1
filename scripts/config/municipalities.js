/**
 * 自治体の定義。municipality_id をコード内に散らさず、ここだけで管理する。
 * 他自治体を追加するときは、この配列に1つ足すだけ。
 */
export const MUNICIPALITIES = {
  yamato_kanagawa: {
    id: 'yamato_kanagawa',
    prefecture: '神奈川県',
    name: '大和市',
    // 大和市オープンデータ（ごみ関連ページ）は CC BY 4.0
    defaultLicense: 'CC BY 4.0 / 出典: 大和市 資源・ごみ関連情報データ（オープンデータ）',
  },
};

export function getMunicipality(id) {
  const m = MUNICIPALITIES[id];
  if (!m) {
    throw new Error(`未登録の municipality_id: ${id}（scripts/config/municipalities.js に追加してください）`);
  }
  return m;
}
