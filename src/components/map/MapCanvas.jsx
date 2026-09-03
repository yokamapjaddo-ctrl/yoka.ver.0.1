import Icon from '../ui/Icon.jsx';

/**
 * 地図の描画レイヤー。将来 MapKit / Mapbox / Google Maps に差し替える際は
 * このコンポーネントだけを置き換える（places の形は変えない）。
 * pin: { top, left } は暫定。実装時は lat/lng を投影して座標を出す。
 */
export default function MapCanvas({ places, selectedId, onSelect, height = 430 }) {
  return (
    <div style={{ position: 'relative', height, background: '#e8eee7', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.7) 0 1px, transparent 1px 46px), repeating-linear-gradient(90deg, rgba(255,255,255,.7) 0 1px, transparent 1px 46px)',
      }} />
      <div style={{ position: 'absolute', top: 120, left: -30, width: 460, height: 26, background: '#fff', transform: 'rotate(-12deg)' }} />
      <div style={{ position: 'absolute', top: 0, left: 150, width: 22, height: '100%', background: '#dce6f2' }} />
      <div style={{ position: 'absolute', top: 180, left: 60, width: 110, height: 80, borderRadius: 12, background: '#d6e9d2' }} />
      <div style={{ position: 'absolute', top: 198, left: 180, width: 16, height: 16, borderRadius: '50%', background: 'var(--blue)', boxShadow: '0 0 0 8px rgba(44,123,229,.18)' }} />

      {places.map((p) => (
        <button key={p.id} onClick={() => onSelect(p.id)} aria-label={p.name}
          style={{ position: 'absolute', top: p.pin?.top ?? 0, left: p.pin?.left ?? 0, width: 40, height: 44, display: 'grid', placeItems: 'start center' }}>
          <span style={{
            width: 32, height: 32, borderRadius: '50% 50% 50% 4px', transform: 'rotate(-45deg)',
            background: p.id === selectedId ? 'var(--navy)' : p.color, boxShadow: '0 3px 8px rgba(0,0,0,.18)',
            display: 'grid', placeItems: 'center',
          }}>
            <span style={{ transform: 'rotate(45deg)', width: 11, height: 11, borderRadius: '50%', background: '#fff' }} />
          </span>
        </button>
      ))}

      <button aria-label="現在地" style={{ position: 'absolute', right: 14, bottom: 74, width: 46, height: 46, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 10px rgba(18,58,107,.2)', display: 'grid', placeItems: 'center' }}>
        <Icon name="target" size={20} color="var(--navy)" />
      </button>
      <button aria-label="一覧で見る" style={{ position: 'absolute', right: 14, bottom: 18, width: 46, height: 46, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 10px rgba(18,58,107,.2)', display: 'grid', placeItems: 'center' }}>
        <Icon name="list" size={20} color="var(--navy)" />
      </button>
    </div>
  );
}
