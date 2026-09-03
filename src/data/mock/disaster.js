export const disaster = [
  {
    id: 'ds-alert-1', municipality_id: 'kanagawa-yamato', kind: 'alert', level: 'warning', active: true,
    title: '大雨注意報が発表されています', body: '土砂災害・低い土地の浸水に注意してください。',
    published_at: '9/3 14:30', source: '気象庁発表',
  },
  {
    id: 'ds-evac-1', municipality_id: 'kanagawa-yamato', kind: 'evacuation', active: false,
    title: '避難所開設情報はありません', published_at: '9/3 14:30',
  },
  {
    id: 'ds-weather-1', municipality_id: 'kanagawa-yamato', kind: 'weather', active: true,
    summary: '雨のちくもり', temp_high: 25, temp_low: 20, rain_probability: 80,
  },
];
