import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync.js';
import { eventService } from '../services/eventService.js';
import { useFavorites } from '../hooks/useFavorites.js';
import ScreenHeader from '../components/layout/ScreenHeader.jsx';
import ImagePlaceholder from '../components/ui/ImagePlaceholder.jsx';
import FavoriteButton from '../components/ui/FavoriteButton.jsx';
import Badge from '../components/ui/Badge.jsx';
import Icon from '../components/ui/Icon.jsx';
import { formatJa } from '../utils/date.js';

export default function EventDetail() {
  const { eventId } = useParams();
  const { data: ev } = useAsync(() => eventService.get(eventId), [eventId]);
  const { isFav, toggle } = useFavorites();
  const [added, setAdded] = useState(false);

  if (!ev) return null;

  return (
    <div className="screen" style={{ background: '#fff', minHeight: '100vh', paddingBottom: 'calc(24px + var(--safe-bottom))' }}>
      <ScreenHeader title="イベント詳細" back right={<FavoriteButton active={isFav(ev.id)} onClick={() => toggle(ev.id)} />} />
      <ImagePlaceholder label={ev.image_label} height={196} radius={0} />

      <div style={{ padding: '18px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ flex: 1, fontSize: 23, fontWeight: 700, margin: 0, lineHeight: 1.35 }}>{ev.title}</h1>
          <Badge tone="event">{ev.category}</Badge>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, fontSize: 15 }}>
          <Icon name="calendar" size={17} color="var(--blue)" />
          {formatJa(ev.date)} {ev.start_time}〜{ev.end_time}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, fontSize: 15 }}>
          <Icon name="pin" size={17} color="var(--blue)" />
          {ev.place}（{ev.address}）
        </div>

        <p style={{ fontSize: 15, lineHeight: 1.75, color: '#3e4b5e', margin: '16px 0 0', textWrap: 'pretty' }}>{ev.description}</p>

        <dl style={{ display: 'grid', gridTemplateColumns: '88px 1fr', rowGap: 11, margin: '20px 0 0', fontSize: 14.5 }}>
          <dt className="sub">カテゴリ</dt><dd style={{ margin: 0 }}>{ev.category}</dd>
          <dt className="sub">主催</dt><dd style={{ margin: 0 }}>{ev.organizer}</dd>
          <dt className="sub">問い合わせ</dt><dd style={{ margin: 0 }}><a href={`tel:${ev.contact}`}>{ev.contact}</a></dd>
        </dl>

        <div style={{ marginTop: 20, height: 150, borderRadius: 16, background: '#e8eee7', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.7) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(255,255,255,.7) 0 1px, transparent 1px 40px)' }} />
          <span style={{ position: 'absolute', top: 52, left: '50%', marginLeft: -15, width: 30, height: 30, borderRadius: '50% 50% 50% 4px', transform: 'rotate(-45deg)', background: '#e8608e' }} />
          <span style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontSize: 12, color: '#5e6b7e' }}>{ev.place}</span>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <button className="btn-accent" onClick={() => setAdded(true)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
          <Icon name="calendar" size={19} color="#fff" strokeWidth={2} />
          {added ? 'カレンダーに追加しました' : 'カレンダーに追加'}
        </button>
      </div>
    </div>
  );
}
