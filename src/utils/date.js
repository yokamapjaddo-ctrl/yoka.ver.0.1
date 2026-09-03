export const WEEK = ['日', '月', '火', '水', '木', '金', '土'];

export const toDate = (iso) => new Date(iso + 'T00:00:00');
export const todayIso = () => new Date().toISOString().slice(0, 10);
export const formatMonthDay = (iso) => { const d = toDate(iso); return (d.getMonth() + 1) + '/' + d.getDate(); };
export const weekdayJa = (iso) => WEEK[toDate(iso).getDay()];
export const formatJa = (iso) => { const d = toDate(iso); return (d.getMonth() + 1) + '月' + d.getDate() + '日 (' + WEEK[d.getDay()] + ')'; };

export function monthGrid(year, month) {
  const first = new Date(year, month - 1, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    return { iso, day: d.getDate(), dow: d.getDay(), inMonth: d.getMonth() === month - 1 };
  });
}
