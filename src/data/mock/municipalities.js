export const municipalities = [
  {
    id: 'kanagawa-yamato', prefecture: '神奈川県', name: '大和市', status: 'live',
    center: { lat: 35.4877, lng: 139.4619 },
    garbage_areas: [
      { id: 'chuo-rinkan', name: '中央林間エリア' },
      { id: 'yamato-eki', name: '大和駅周辺エリア' },
    ],
    contact: '046-260-5126',
  },
  { id: 'kanagawa-ebina', prefecture: '神奈川県', name: '海老名市', status: 'planned', center: { lat: 35.4463, lng: 139.3907 }, garbage_areas: [] },
  { id: 'kanagawa-zama', prefecture: '神奈川県', name: '座間市', status: 'planned', center: { lat: 35.4886, lng: 139.3948 }, garbage_areas: [] },
  { id: 'fukuoka-city', prefecture: '福岡県', name: '福岡市', status: 'planned', center: { lat: 33.5904, lng: 130.4017 }, garbage_areas: [] },
  { id: 'kyoto-city', prefecture: '京都府', name: '京都市', status: 'planned', center: { lat: 35.0116, lng: 135.7681 }, garbage_areas: [] },
];
