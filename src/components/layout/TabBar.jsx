import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';

const TABS = [
  { to: '/', label: 'ホーム', icon: 'home' },
  { to: '/map', label: 'マップ', icon: 'pin' },
  { to: '/calendar', label: 'カレンダー', icon: 'calendar' },
  { to: '/notices', label: 'お知らせ', icon: 'bell' },
  { to: '/mypage', label: 'マイページ', icon: 'user' },
];

export default function TabBar() {
  return (
    <nav style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20,
      background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--line)', paddingBottom: 'var(--safe-bottom)',
    }}>
      <div style={{ display: 'flex' }}>
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.to === '/'} style={({ isActive }) => ({
            flex: 1, minHeight: 56, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 4,
            color: isActive ? 'var(--navy)' : '#98a4b7',
          })}>
            <Icon name={t.icon} size={23} />
            <span style={{ fontSize: 10.5, fontWeight: 600 }}>{t.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
