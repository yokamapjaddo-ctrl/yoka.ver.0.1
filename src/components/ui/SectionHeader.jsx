import { Link } from 'react-router-dom';

export default function SectionHeader({ title, to, actionLabel = 'もっと見る' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '26px 20px 10px' }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{title}</h2>
      {to && <Link to={to} style={{ fontSize: 13, fontWeight: 500 }}>{actionLabel} 〉</Link>}
    </div>
  );
}
