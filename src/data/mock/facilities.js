const M = 'kanagawa-yamato';

export const facilities = [
  { id: 'fa-library', municipality_id: M, category: 'public', name: '大和市立図書館', meta: '公共施設 ・ 徒歩8分', hours: '9:00〜21:00', lat: 35.4869, lng: 139.4614, pin: { top: 140, left: 36 }, color: '#2c7be5' },
  { id: 'fa-cityhall', municipality_id: M, category: 'public', name: '大和市役所', meta: '公共施設 ・ 徒歩10分', hours: '8:30〜17:15', lat: 35.4875, lng: 139.4604, pin: { top: 118, left: 205 }, color: '#2c7be5' },
  { id: 'fa-clinic', municipality_id: M, category: 'hospital', name: '大和中央クリニック', meta: '内科・小児科 ・ 徒歩6分', hours: '9:00〜18:00', lat: 35.4881, lng: 139.4632, pin: { top: 90, left: 88 }, color: '#e0483f' },
  { id: 'fa-sportscenter', municipality_id: M, category: 'shelter', name: '大和スポーツセンター', meta: '指定避難所 ・ 1.2km', capacity: 1200, lat: 35.4835, lng: 139.4522, pin: { top: 108, left: 212 }, color: '#2c7be5' },
  { id: 'fa-school', municipality_id: M, category: 'shelter', name: '大和市立中央林間小学校', meta: '指定避難所 ・ 0.6km', capacity: 800, lat: 35.5133, lng: 139.4442, pin: { top: 58, left: 150 }, color: '#2c7be5' },
  { id: 'fa-park', municipality_id: M, category: 'park', name: '引地台公園', meta: '公園 ・ 徒歩15分', lat: 35.4712, lng: 139.4585, pin: { top: 244, left: 160 }, color: '#39a06a' },
];
