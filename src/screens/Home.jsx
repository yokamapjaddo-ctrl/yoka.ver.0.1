import { Link } from 'react-router-dom';
import { useMunicipality } from '../context/MunicipalityContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { garbageService } from '../services/garbageService.js';
import { weatherService } from '../services/weatherService.js';
import { disasterService } from '../services/disasterService.js';
import { eventService } from '../services/eventService.js';
import { noticeService } from '../services/noticeService.js';
import { shopService } from '../services/shopService.js';
import Icon from '../components/ui/Icon.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import CategoryShortcut from '../components/ui/CategoryShortcut.jsx';
import ImagePlaceholder from '../components/ui/ImagePlaceholder.jsx';
import Badge from '../components/ui/Badge.jsx';
import GarbageCard from '../components/home/GarbageCard.jsx';
import WeatherPill from '../components/home/WeatherPill.jsx';
import DisasterBanner from '../components/home/DisasterBanner.jsx';
import NewsRow from '../components/news/NewsRow.jsx';
import { formatJa } from '../utils/date.js';

const SHORTCUTS = [
  { to: '/calendar', icon: 'calendar', label: 'イベント', bg: 'var(--pink)', fg: 'var(--pink-ink)' },
  { to: '/calendar', icon: 'trash', label: 'ごみカレンダー', bg: 'var(--green)', fg: 'var(--green-ink)' },
  { to: '/disaster', icon: 'shield', label: '防災情報', bg: 'var(--sky)', fg: 'var(--blue-ink)' },
  { to: '/map', icon: 'shop', label: 'お店・施設', bg: 'var(--amber)', fg: 'var(--amber-ink)' },
];

export default function Home() {
  const { municipalityId, municipality, areaId } = useMunicipality();
  const { data: today } = useAsync(() => garbageService.today(municipalityId, areaId), [municipalityId, areaId]);
  const { data: next } = useAsync(() => garbageService.next(municipalityId, areaId), [municipalityId, areaId]);
  const { data: weather } = useAsync(() => weatherService.today(municipalityId), [municipalityId]);
  const { data: alert } = useAsync(() => disasterService.current(municipalityId), [municipalityId]);
  const { data: events } = useAsync(() => eventService.list(municipalityId), [municipalityId]);
  const { data: notices } = useAsync(() => noticeService.list(municipalityId), [municipalityId]);
  const { data: shops } = useAsync(() => shopService.list(municipalityId), [municipalityId]);

  return (
    <div className="screen">
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#fff', padding: '6px 20px 10px', paddingTop: 'calc(6px + var(--safe-top))',
      }}>
        <Link to="/notices" aria-label="お知らせ" style={{ width: 44, height: 44, display: 'grid', placeItems: 'center' }}>
          <Icon name="bell" size={23} color="var(--navy)" />
        </Link>
        <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '.14em', color: 'var(--navy)' }}>YOKA</span>
        <Link to="/mypage" aria-label="マイページ" style={{ width: 44, height: 44, display: 'grid', placeItems: 'center' }}>
          <Icon name="user" size={23} color="var(--navy)" />
        </Link>
      </header>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 20px 0' }}>
        <Link to="/settings/region" style={{
          display: 'flex', alignItems: 'center', gap: 8, minHeight: 44, padding: '0 16px',
          borderRadius: 22, background: '#fff', boxShadow: '0 1px 4px rgba(18,58,107,.10)',
          fontSize: 16, fontWeight: 600, color: 'var(--navy)',
        }}>
          <Icon name="pin" size={17} color="var(--blue)" />
          {municipality?.name || '地域を選択'}
          <Icon name="chevronRight" size={13} color="var(--sub)" strokeWidth={2.4} />
        </Link>
        <WeatherPill weather={weather} />
      </div>

      <GarbageCard today={today} next={next} />
      <DisasterBanner alert={alert} />

      <SectionHeader title="みんなのニュース" to="/notices" />
      <div className="card" style={{ margin: '0 20px', overflow: 'hidden' }}>
        {(events || []).map((ev) => (
          <NewsRow key={ev.id} to={`/events/${ev.id}`} title={`${ev.title}が開催されます`}
            meta={`${formatJa(ev.date)} ${ev.start_time}〜${ev.end_time} ${ev.place}`} imageLabel={ev.image_label} />
        ))}
      </div>

      <nav style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '22px 20px 0' }}>
        {SHORTCUTS.map((s) => <CategoryShortcut key={s.label} {...s} />)}
      </nav>

      <SectionHeader title="自治体からのお知らせ" to="/notices" />
      <div className="card" style={{ margin: '0 20px', overflow: 'hidden' }}>
        {(notices || []).filter((n) => n.category === 'city' || n.category === 'garbage').map((n) => (
          <Link key={n.id} to={n.link || '/notices'} className="row-link">
            <Badge tone={n.category} />
            <span className="row-link__label" style={{ fontSize: 15 }}>{n.title}</span>
          </Link>
        ))}
      </div>

      <SectionHeader title="近くのお店・施設" to="/map" />
      <div className="hscroll" style={{ padding: '0 20px 6px' }}>
        {(shops || []).map((s) => (
          <Link key={s.id} to="/map" style={{ flex: 'none', width: 150 }}>
            <ImagePlaceholder label={s.image_label} height={92} radius={16} />
            <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 8, color: 'var(--ink)' }}>{s.name}</div>
            <div className="sub" style={{ fontSize: 12, marginTop: 2 }}>{s.meta}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
