import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMunicipality } from '../context/MunicipalityContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { noticeService } from '../services/noticeService.js';
import Chip from '../components/ui/Chip.jsx';
import Badge from '../components/ui/Badge.jsx';

const FILTERS = [
  { key: 'all', label: 'すべて' },
  { key: 'city', label: '自治体' },
  { key: 'disaster', label: '防災' },
  { key: 'event', label: 'イベント' },
  { key: 'garbage', label: 'ごみ' },
];

export default function Notices() {
  const { municipalityId } = useMunicipality();
  const [filter, setFilter] = useState('all');
  const { data: notices } = useAsync(() => noticeService.list(municipalityId), [municipalityId]);
  const rows = (notices || []).filter((n) => filter === 'all' || n.category === filter);

  return (
    <div className="screen">
      <div style={{ background: '#fff', padding: '14px 20px 16px', paddingTop: 'calc(14px + var(--safe-top))' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>お知らせ</h1>
        <div className="hscroll" style={{ marginTop: 14 }}>
          {FILTERS.map((f) => (
            <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>{f.label}</Chip>
          ))}
        </div>
      </div>

      <div className="card" style={{ margin: 16, overflow: 'hidden' }}>
        {rows.map((n) => (
          <Link key={n.id} to={n.link || '#'} className="row-link" style={{ display: 'block', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <Badge tone={n.category} />
              <span className="sub" style={{ fontSize: 12 }}>{n.published_at}</span>
            </div>
            <div style={{ fontSize: 15.5, fontWeight: 600, marginTop: 9, lineHeight: 1.5, color: 'var(--ink)' }}>{n.title}</div>
          </Link>
        ))}
        {rows.length === 0 && <div className="sub" style={{ padding: 20, fontSize: 15 }}>お知らせはありません</div>}
      </div>
    </div>
  );
}
