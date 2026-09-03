import { useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';

export default function ScreenHeader({ title, subtitle, back = false, right = null }) {
  const navigate = useNavigate();
  return (
    <header style={{
      background: 'var(--white)', padding: '6px 16px 14px',
      paddingTop: 'calc(6px + var(--safe-top))',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ width: 44 }}>
        {back && (
          <button aria-label="戻る" onClick={() => navigate(-1)} style={{ width: 44, height: 44, display: 'grid', placeItems: 'center' }}>
            <Icon name="chevronLeft" size={20} color="var(--navy)" strokeWidth={2.2} />
          </button>
        )}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
        {subtitle && <div className="sub" style={{ marginTop: 3 }}>{subtitle}</div>}
      </div>
      <div style={{ width: 44, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </header>
  );
}
