const TONES = {
  event: { bg: 'var(--pink)', fg: 'var(--pink-ink)', label: 'イベント' },
  garbage: { bg: 'var(--green)', fg: 'var(--green-ink)', label: 'ごみ' },
  city: { bg: 'var(--sky)', fg: 'var(--blue-ink)', label: '自治体' },
  disaster: { bg: 'var(--danger-bg)', fg: 'var(--danger-ink)', label: '防災' },
};

export default function Badge({ tone = 'city', children }) {
  const t = TONES[tone] || TONES.city;
  return (
    <span style={{ fontSize: 11.5, fontWeight: 600, background: t.bg, color: t.fg, borderRadius: 8, padding: '5px 9px' }}>
      {children || t.label}
    </span>
  );
}
