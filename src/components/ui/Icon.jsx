const P = {
  home: <path d="M4 11l8-6.5 8 6.5v8.5H4V11Z" />,
  pin: <><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" /><circle cx="12" cy="10" r="2.4" /></>,
  calendar: <><rect x="4" y="5.5" width="16" height="14" rx="3" /><path d="M8 3.5v4M16 3.5v4M4 10h16" /></>,
  bell: <><path d="M18 16v-5a6 6 0 1 0-12 0v5l-1.5 2.5h15L18 16Z" /><path d="M10 19.5a2 2 0 0 0 4 0" /></>,
  user: <><circle cx="12" cy="8.5" r="3.6" /><path d="M4.8 20c1-3.7 3.8-5.4 7.2-5.4S18.2 16.3 19.2 20" /></>,
  shield: <path d="M12 3.5l7 2.5v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9v-6l7-2.5Z" />,
  trash: <><path d="M6 7h12l-1 12.5H7L6 7Z" /><path d="M4 7h16M10 4h4" /></>,
  shop: <><path d="M4 10h16v9H4v-9Z" /><path d="M4 10l2-4.5h12L20 10" /></>,
  bookmark: <path d="M7 4h10v16l-5-4-5 4V4Z" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  chevronLeft: <path d="M15 6l-6 6 6 6" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" /></>,
  phone: <path d="M6 4h4l2 4-2.5 2a10 10 0 0 0 4.5 4.5L16 12l4 2v4a2 2 0 0 1-2 2C11 20 4 13 4 6a2 2 0 0 1 2-2Z" />,
  doc: <><rect x="5" y="3.5" width="14" height="17" rx="2.5" /><path d="M8.5 8h7M8.5 12h7M8.5 16h4" /></>,
  building: <><path d="M5 20V9l7-4 7 4v11" /><path d="M10 20v-6h4v6" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" /></>,
  target: <><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>,
  list: <path d="M5 7h14M5 12h14M5 17h14" />,
  filter: <><path d="M4 8h10M18 8h2M4 16h4M12 16h8" /><circle cx="16" cy="8" r="2" /><circle cx="10" cy="16" r="2" /></>,
};

export default function Icon({ name, size = 22, color = 'currentColor', fill = 'none', strokeWidth = 1.9 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name]}
    </svg>
  );
}
