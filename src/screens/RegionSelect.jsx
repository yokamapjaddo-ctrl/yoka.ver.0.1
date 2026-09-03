import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync.js';
import { municipalityService } from '../services/municipalityService.js';
import { useMunicipality } from '../context/MunicipalityContext.jsx';

const ROW_H = 46;
const PAD = 92;

/** iOS 風ホイールピッカー（1 列） */
function WheelColumn({ items, index, onIndexChange, renderNote }) {
  const ref = useRef(null);

  useEffect(() => { if (ref.current) ref.current.scrollTop = index * ROW_H; }, [items]);

  const handleScroll = (e) => {
    const i = Math.max(0, Math.min(items.length - 1, Math.round(e.currentTarget.scrollTop / ROW_H)));
    if (i !== index) onIndexChange(i);
  };

  return (
    <div ref={ref} onScroll={handleScroll} className="hscroll"
      style={{
        flex: 1, height: 230, overflowY: 'auto', display: 'block',
        scrollSnapType: 'y mandatory', padding: `${PAD}px 0`,
        WebkitOverflowScrolling: 'touch',
      }}>
      {items.map((it, i) => (
        <button key={it.key} onClick={() => ref.current?.scrollTo({ top: i * ROW_H, behavior: 'smooth' })}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', height: ROW_H, scrollSnapAlign: 'center',
            fontSize: i === index ? 19 : 17,
            fontWeight: i === index ? 700 : 500,
            color: i === index ? 'var(--ink)' : '#a7b2c2',
          }}>
          {it.label}
          {i === index && renderNote && <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--sub)' }}>{renderNote(it)}</span>}
        </button>
      ))}
    </div>
  );
}

export default function RegionSelect({ mode = 'onboarding' }) {
  const navigate = useNavigate();
  const { municipalityId, areaId, select } = useMunicipality();
  const { data: groups } = useAsync(() => municipalityService.prefectures(), []);
  const [prefIdx, setPrefIdx] = useState(0);
  const [cityIdx, setCityIdx] = useState(0);

  // 保存済みの地域があれば初期位置に反映（ハードコードしない）
  useEffect(() => {
    if (!groups) return;
    const gi = groups.findIndex((g) => g.cities.some((c) => c.id === municipalityId));
    if (gi >= 0) {
      setPrefIdx(gi);
      setCityIdx(Math.max(0, groups[gi].cities.findIndex((c) => c.id === municipalityId)));
    }
  }, [groups, municipalityId]);

  if (!groups) return null;
  const pref = groups[prefIdx];
  const city = pref.cities[cityIdx] || pref.cities[0];

  const save = () => {
    const area = city.garbage_areas?.[0]?.id || (city.id === municipalityId ? areaId : null);
    select(city.id, area);
    navigate('/', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column',
      padding: '24px 24px 34px', paddingTop: 'calc(24px + var(--safe-top))',
      paddingBottom: 'calc(34px + var(--safe-bottom))',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--navy)', display: 'grid', placeItems: 'center' }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff' }} />
        </span>
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '.14em', color: 'var(--navy)' }}>YOKA</span>
      </div>

      <h1 style={{ fontSize: 23, fontWeight: 700, margin: '26px 0 0', lineHeight: 1.5 }}>
        {mode === 'change' ? '地域を変更します' : <>お住まいの地域を<br />選んでください</>}
      </h1>
      <p className="sub" style={{ fontSize: 14, lineHeight: 1.7, marginTop: 10 }}>
        あとからいつでも変更できます。選んだ地域のごみ・防災・イベント情報が表示されます。
      </p>

      <div style={{ display: 'flex', marginTop: 22, fontSize: 13, fontWeight: 700, color: 'var(--sub)' }}>
        <span style={{ flex: 1, paddingLeft: 4 }}>都道府県</span>
        <span style={{ flex: 1, paddingLeft: 12 }}>市区町村</span>
      </div>

      <div style={{ position: 'relative', marginTop: 8, borderRadius: 18, background: 'var(--bg)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: PAD, left: 8, right: 8, height: ROW_H, borderRadius: 12, background: 'var(--sky)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: ROW_H, background: 'linear-gradient(var(--bg), rgba(247,249,252,0))', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: ROW_H, background: 'linear-gradient(rgba(247,249,252,0), var(--bg))', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
          <WheelColumn
            items={groups.map((g) => ({ key: g.prefecture, label: g.prefecture }))}
            index={prefIdx}
            onIndexChange={(i) => { setPrefIdx(i); setCityIdx(0); }}
          />
          <div style={{ width: 1, background: 'var(--line)', margin: `${PAD}px 0` }} />
          <WheelColumn
            items={pref.cities.map((c) => ({ key: c.id, label: c.name, status: c.status }))}
            index={cityIdx}
            onIndexChange={setCityIdx}
            renderNote={(it) => (it.status === 'live' ? '対応済み' : '準備中')}
          />
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--sub)', marginBottom: 12 }}>
        選択中：<b style={{ color: 'var(--navy)' }}>{pref.prefecture} {city.name}</b>
      </p>
      <button className="btn-primary" onClick={save}>この地域で始める</button>
    </div>
  );
}
