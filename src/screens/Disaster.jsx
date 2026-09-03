import { useState } from 'react';
import { useMunicipality } from '../context/MunicipalityContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { disasterService } from '../services/disasterService.js';
import { weatherService } from '../services/weatherService.js';
import ScreenHeader from '../components/layout/ScreenHeader.jsx';
import ListRow from '../components/ui/ListRow.jsx';
import Icon from '../components/ui/Icon.jsx';

const TOOLS = [
  { icon: 'doc', label: '防災マニュアル' },
  { icon: 'phone', label: '緊急連絡先' },
  { icon: 'building', label: '災害用伝言板' },
];

export default function Disaster() {
  const { municipalityId, municipality } = useMunicipality();
  const [tab, setTab] = useState('now');
  const { data: alert } = useAsync(() => disasterService.current(municipalityId), [municipalityId]);
  const { data: evac } = useAsync(() => disasterService.evacuation(municipalityId), [municipalityId]);
  const { data: weather } = useAsync(() => weatherService.today(municipalityId), [municipalityId]);
  const { data: shelters } = useAsync(() => disasterService.shelters(municipalityId), [municipalityId]);

  return (
    <div className="screen">
      <ScreenHeader title="防災・災害情報" back />
      <div style={{ display: 'flex', background: '#fff' }}>
        {[{ k: 'now', l: '現在の状況' }, { k: 'hazard', l: 'ハザードマップ' }].map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            flex: 1, minHeight: 48, fontSize: 15, fontWeight: tab === t.k ? 700 : 400,
            color: tab === t.k ? 'var(--blue-ink)' : 'var(--sub)',
            borderBottom: tab === t.k ? '2.5px solid var(--blue-ink)' : '1px solid #e3e8f0',
          }}>{t.l}</button>
        ))}
      </div>

      {tab === 'hazard' ? (
        <div className="card" style={{ margin: 16, padding: 0, overflow: 'hidden' }}>
          <div style={{ height: 320, background: '#e8eee7', display: 'grid', placeItems: 'center' }}>
            <span className="sub" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11 }}>ハザードマップ（自治体GISを埋め込み予定）</span>
          </div>
        </div>
      ) : (
        <>
          {alert && (
            <section className="alert" style={{ margin: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, color: 'var(--danger-ink)' }}>
                <span style={{ width: 22, height: 22, borderRadius: 7, background: 'var(--danger)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 14 }}>!</span>
                緊急のお知らせ
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--danger-ink)', marginTop: 12 }}>{alert.title}</div>
              <div style={{ fontSize: 14.5, color: '#8a4a44', marginTop: 8, lineHeight: 1.6 }}>{alert.body}</div>
              <div style={{ fontSize: 13, color: '#8a4a44', marginTop: 8 }}>{alert.published_at} {alert.source}</div>
            </section>
          )}

          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '8px 20px 8px' }}>避難情報</h2>
          <div className="card card--pad" style={{ margin: '0 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 34, height: 34, borderRadius: 11, background: 'var(--sky)', display: 'grid', placeItems: 'center' }}>
              <Icon name="building" size={18} color="var(--blue)" />
            </span>
            <span>
              <b style={{ display: 'block', fontSize: 15.5, fontWeight: 400 }}>{evac?.title}</b>
              <span className="sub" style={{ fontSize: 12.5 }}>（{evac?.published_at} 時点）</span>
            </span>
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '22px 20px 8px' }}>気象情報</h2>
          <div className="card card--pad" style={{ margin: '0 16px' }}>
            <div className="sub" style={{ fontSize: 14 }}>{municipality?.name}の天気</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14 }}>
              <span style={{ width: 52, height: 52, borderRadius: 16, background: '#dce6f2' }} />
              <div>
                <div style={{ fontSize: 14.5, color: '#3e4b5e' }}>{weather?.summary}</div>
                <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{weather?.temp_high}℃ / {weather?.temp_low}℃</div>
                <div style={{ fontSize: 13.5, color: 'var(--blue-ink)', marginTop: 5 }}>降水確率 {weather?.rain_probability}%</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '18px 16px 0' }}>
            {TOOLS.map((t) => (
              <button key={t.label} className="card" style={{ minHeight: 88, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 12.5, fontWeight: 600, color: 'var(--navy)' }}>
                <Icon name={t.icon} size={21} color="var(--blue)" />
                {t.label}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '24px 20px 8px' }}>指定避難所</h2>
          <div className="card" style={{ margin: '0 16px', overflow: 'hidden' }}>
            {(shelters || []).map((s) => (
              <ListRow key={s.id} to="/map" label={s.name} note={`${s.meta} ・ 収容 ${s.capacity?.toLocaleString()}人`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
