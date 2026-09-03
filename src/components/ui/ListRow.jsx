import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

export default function ListRow({ label, note, right, to, onClick, chevron = true }) {
  const inner = (
    <>
      <span className="row-link__label">
        {label}
        {note && <span className="sub" style={{ display: 'block', marginTop: 4 }}>{note}</span>}
      </span>
      {right && <span className="sub">{right}</span>}
      {chevron && <Icon name="chevronRight" size={15} color="#98a4b7" strokeWidth={2.4} />}
    </>
  );
  if (to) return <Link className="row-link" to={to}>{inner}</Link>;
  return <button className="row-link" onClick={onClick}>{inner}</button>;
}
