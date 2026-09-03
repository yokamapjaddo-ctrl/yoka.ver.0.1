import { Link } from 'react-router-dom';
import ImagePlaceholder from '../ui/ImagePlaceholder.jsx';

export default function NewsRow({ to, title, meta, imageLabel = '写真' }) {
  return (
    <Link to={to || '#'} className="row-link" style={{ padding: '15px 16px' }}>
      <span style={{ flex: 1 }}>
        <b style={{ display: 'block', fontSize: 15.5, fontWeight: 600, lineHeight: 1.4 }}>{title}</b>
        <span className="sub" style={{ display: 'block', marginTop: 5, fontSize: 12.5 }}>{meta}</span>
      </span>
      <ImagePlaceholder label={imageLabel} height={56} width={62} />
    </Link>
  );
}
