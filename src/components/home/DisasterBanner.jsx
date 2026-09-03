import { Link } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';

/** 防災は他カテゴリより視認性を高くする */
export default function DisasterBanner({ alert }) {
  if (!alert) return null;
  return (
    <Link to="/disaster" className="alert" style={{
      display: 'flex', alignItems: 'center', gap: 12, margin: '14px 20px 0', color: 'var(--danger-ink)',
    }}>
      <span style={{ width: 34, height: 34, borderRadius: 11, background: 'var(--danger)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 19, fontWeight: 700 }}>!</span>
      <span style={{ flex: 1 }}>
        <b style={{ display: 'block', fontSize: 16 }}>{alert.title}</b>
        <span style={{ fontSize: 13, color: '#8a4a44' }}>{alert.published_at} {alert.source}</span>
      </span>
      <Icon name="chevronRight" size={16} color="var(--danger-ink)" strokeWidth={2.4} />
    </Link>
  );
}
