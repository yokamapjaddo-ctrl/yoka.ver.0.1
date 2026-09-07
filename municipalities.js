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
  fujisawa_kanagawa: {
    id: 'fujisawa_kanagawa',
    prefecture: '神奈川県',
    name: '藤沢市',
    // 藤沢市オープンデータ利用規約（2025-04-01版）で CC BY 4.0 と明記。
    // 規約は「改変して利用する場合」のクレジット文面を指定しているので、それに従う。
    defaultLicense: 'この情報は以下の著作物を改変して利用しています。藤沢市オープンデータ、藤沢市、クリエイティブ・コモンズ・ライセンス 表示 4.0',
  },
};

export function getMunicipality(id) {
  const m = MUNICIPALITIES[id];
  if (!m) {
    throw new Error(`未登録の municipality_id: ${id}（scripts/config/municipalities.js に追加してください）`);
  }
  return m;
}
