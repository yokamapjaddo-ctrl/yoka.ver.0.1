import { useState } from 'react';
import { useMunicipality } from '../context/MunicipalityContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { garbageService } from '../services/garbageService.js';
import { eventService } from '../services/eventService.js';
import ScreenHeader from '../components/layout/ScreenHeader.jsx';
import { monthGrid, todayIso, formatJa, WEEK } from '../utils/date.js';
import { Link } from 'react-router-dom';

export default function CalendarScreen() {
  const { municipalityId, municipality, areaId, areaName } = useMunicipality();
  const [ym, setYm] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() + 1 }; });
  const [selected, setSelected] = useState(todayIso());

  const { data: garbage } = useAsync(() => garbageService.list(municipalityId, areaId), [municipalityId, areaId]);
  const { data: events } = useAsync(() => eventService.list(municipalityId), [municipalityId]);

  const byDate = {};
  (garbage || []).forEach((g) => { (byDate[g.date] ||= []).push({ id: g.id, title: g.type, kind: 'ごみ', color: g.color }); });
  (events || []).forEach((e) => { (byDate[e.date] ||= []).push({ id: e.id, title: e.title, kind: e.category === '行政' ? '行政' : 'イベント', color: e.category === '行政' ? '#1f5fbf' : '#e8608e', link: `/events/${e.id}` }); });

  const grid = monthGrid(ym.y, ym.m);
  const shift = (n) => setYm(({ y, m }) => {
    const d = new Date(y, m - 1 + n, 1);
    return { y: d.getFullYear(), m: d.getMonth() + 1 };
  });

  const upcoming = Object.keys(byDate).filter((d) => d >= todayIso()).sort().slice(0, 4);

  return (
    <div className="screen">
      <ScreenHeader title="ごみカレンダー" subtitle={`${municipality?.name || ''} ${areaName || ''}`} />

      <div style={{ background: '#fff', padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => shift(-1)} style={{ width: 44, height: 44, fontSize: 18, color: 'var(--sub)' }}>‹</button>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{ym.y}年{ym.m}月</div>
          <button onClick={() => shift(1)} style={{ width: 44, height: 44, fontSize: 18, color: 'var(--sub)' }}>›</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
          {WEEK.map((w, i) => (
            <div key={w} style={{ textAlign: 'center', fontSize: 12, padding: '6px 0', color: i === 0 ? 'var(--danger)' : i === 6 ? 'var(--blue)' : 'var(--sub)' }}>{w}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', rowGap: 2 }}>
          {grid.map((d) => {
            const items = byDate[d.iso] || [];
            const isSel = selected === d.iso;
            return (
              <button key={d.iso} onClick={() => setSelected(d.iso)}
                style={{ minHeight: 46, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                <span style={{
                  width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 15,
                  background: isSel ? 'var(--navy)' : 'transparent',
                  color: !d.inMonth ? '#c6ceda' : isSel ? '#fff' : d.dow === 0 ? 'var(--danger)' : d.dow === 6 ? 'var(--blue)' : 'var(--ink)',
                  fontWeight: d.inMonth ? 500 : 400,
                }}>{d.day}</span>
                <span style={{ display: 'flex', gap: 3, height: 5 }}>
                  {d.inMonth && items.slice(0, 3).map((it) => (
                    <i key={it.id} style={{ width: 5, height: 5, borderRadius: '50%', background: it.color, display: 'block' }} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ margin: '16px 16px 0', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px 8px', fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>{formatJa(selected)} の予定</div>
        {(byDate[selected] || []).length === 0 && (
          <div className="sub" style={{ padding: '0 16px 16px', fontSize: 15 }}>予定はありません</div>
        )}
        {(byDate[selected] || []).map((it) => (
          <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 16px', borderTop: '1px solid #eef1f6' }}>
            <i style={{ width: 8, height: 8, borderRadius: '50%', background: it.color, display: 'block' }} />
            {it.link
              ? <Link to={it.link} style={{ flex: 1, fontSize: 15, color: 'var(--ink)' }}>{it.title}</Link>
              : <span style={{ flex: 1, fontSize: 15 }}>{it.title}</span>}
            <span className="sub" style={{ fontSize: 12.5 }}>{it.kind}</span>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, margin: '24px 20px 10px' }}>今後の予定</h2>
      <div className="card" style={{ margin: '0 16px', padding: '4px 16px 8px' }}>
        {upcoming.map((iso) => (
          <div key={iso} style={{ padding: '12px 0', borderBottom: '1px solid #eef1f6' }}>
            <div className="sub">{formatJa(iso)}</div>
            {byDate[iso].map((it) => <div key={it.id} style={{ fontSize: 15, marginTop: 6 }}>{it.title}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}
