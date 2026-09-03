export default function WeatherPill({ weather }) {
  if (!weather) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9, minHeight: 44, padding: '0 15px',
      borderRadius: 22, background: '#fff', boxShadow: '0 1px 4px rgba(18,58,107,.10)',
    }}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#ffd35c' }} />
      <span style={{ lineHeight: 1.15 }}>
        <b style={{ display: 'block', fontSize: 15 }}>{weather.temp_high}℃</b>
        <span className="sub" style={{ fontSize: 11 }}>{weather.summary}</span>
      </span>
    </div>
  );
}
