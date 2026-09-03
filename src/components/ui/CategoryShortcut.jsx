import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

export default function CategoryShortcut({ to, icon, label, bg, fg }) {
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: 10, minHeight: 56, padding: '0 14px',
      borderRadius: 16, background: bg, color: fg, fontWeight: 600, fontSize: 14.5,
    }}>
      <span style={{ width: 30, height: 30, borderRadius: 10, background: '#fff', display: 'grid', placeItems: 'center' }}>
        <Icon name={icon} size={17} color={fg} />
      </span>
      {label}
    </Link>
  );
}
