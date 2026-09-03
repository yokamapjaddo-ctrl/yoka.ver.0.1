import { useState } from 'react';
import { useMunicipality } from '../context/MunicipalityContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { shopService } from '../services/shopService.js';
import { facilityService } from '../services/facilityService.js';
import { useFavorites } from '../hooks/useFavorites.js';
import Chip from '../components/ui/Chip.jsx';
import Icon from '../components/ui/Icon.jsx';
import ImagePlaceholder from '../components/ui/ImagePlaceholder.jsx';
import FavoriteButton from '../components/ui/FavoriteButton.jsx';
import MapCanvas from '../components/map/MapCanvas.jsx';

const CATEGORIES = [
  { key: 'all', label: 'すべて' },
  { key: 'food', label: '飲食店' },
  { key: 'super', label: 'スーパー' },
  { key: 'public', label: '公共施設' },
  { key: 'hospital', label: '病院' },
  { key: 'park', label: '公園' },
  { key: 'shelter', label: '避難所' },
];

export default function MapScreen() {
  const { municipalityId } = useMunicipality();
  const [cat, setCat] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const { isFav, toggle } = useFavorites();

  const { data: shops } = useAsync(() => shopService.list(municipalityId), [municipalityId]);
  const { data: facilities } = useAsync(() => facilityService.list(municipalityId), [municipalityId]);

  const places = [...(shops || []), ...(facilities || [])];
  const visible = cat === 'all' ? places : places.filter((p) => p.category === cat);
  const selected = places.find((p) => p.id === selectedId) || visible[0] || null;

  return (
    <div className="screen">
      <div style={{ background: '#fff', padding: '8px 16px 12px', paddingTop: 'calc(8px + var(--safe-top))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, minHeight: 44, padding: '0 14px', borderRadius: 14, background: '#f1f4f9' }}>
            <Icon name="search" size={17} color="var(--sub)" strokeWidth={2} />
            <input placeholder="お店・施設を検索" style={{ flex: 1, border: 'none', background: 'none', fontSize: 15, outline: 'none' }} />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '0 6px', fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>
            <Icon name="filter" size={18} color="var(--navy)" />絞り込み
          </button>
        </div>
        <div className="hscroll" style={{ marginTop: 12 }}>
          {CATEGORIES.map((c) => (
            <Chip key={c.key} active={cat === c.key} onClick={() => { setCat(c.key); setSelectedId(null); }}>{c.label}</Chip>
          ))}
        </div>
      </div>

      <MapCanvas places={visible} selectedId={selected?.id} onSelect={setSelectedId} />

      {selected && (
        <div style={{ padding: '14px 16px 0' }}>
          <div className="card" style={{ padding: 14, display: 'flex', gap: 14 }}>
            <ImagePlaceholder label={selected.image_label || '施設写真'} height={92} width={92} radius={14} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>{selected.name}</div>
                  <div className="sub" style={{ fontSize: 12.5, marginTop: 4 }}>{selected.meta}</div>
                </div>
                <FavoriteButton active={isFav(selected.id)} onClick={() => toggle(selected.id)} />
              </div>
              {selected.hours && (
                <div style={{ fontSize: 13.5, marginTop: 9, color: selected.open_now === false ? 'var(--sub)' : 'var(--green-ink)', fontWeight: 600 }}>
                  {selected.open_now === false ? '営業時間外' : '営業中'}{' '}
                  <span className="sub" style={{ fontWeight: 400 }}>{selected.hours}</span>
                </div>
              )}
              {selected.rating && <div style={{ fontSize: 13.5, marginTop: 5 }}>★ {selected.rating} <span className="sub">({selected.reviews})</span></div>}
              {selected.capacity && <div style={{ fontSize: 13.5, marginTop: 5 }} className="sub">収容 {selected.capacity.toLocaleString()}人</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
