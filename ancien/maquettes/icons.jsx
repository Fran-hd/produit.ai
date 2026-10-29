// Lightweight inline SVG icons (stroke-based, sharp, 1.5px)
const Icon = ({ d, size = 16, fill = "none", stroke = "currentColor", strokeWidth = 1.5, style, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
    {d}
  </svg>
);

const I = {
  info: (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 8v.5M12 11v5"/></>} />,
  copy: (p) => <Icon {...p} d={<><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></>} />,
  search: (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />,
  filter: (p) => <Icon {...p} d={<><path d="M3 5h18M6 12h12M10 19h4"/></>} />,
  lock: (p) => <Icon {...p} d={<><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>} />,
  sort: (p) => <Icon {...p} d={<><path d="M3 6h13M3 12h9M3 18h5M17 4v16m0 0-3-3m3 3 3-3"/></>} />,
  plus: (p) => <Icon {...p} d={<><path d="M12 5v14M5 12h14"/></>} />,
  check: (p) => <Icon {...p} d={<path d="m5 12 5 5L20 7"/>} />,
  x: (p) => <Icon {...p} d={<path d="M6 6l12 12M18 6 6 18"/>} />,
  chevronRight: (p) => <Icon {...p} d={<path d="m9 6 6 6-6 6"/>} />,
  chevronDown: (p) => <Icon {...p} d={<path d="m6 9 6 6 6-6"/>} />,
  chevronUp: (p) => <Icon {...p} d={<path d="m6 15 6-6 6 6"/>} />,
  chevronLeft: (p) => <Icon {...p} d={<path d="m15 6-6 6 6 6"/>} />,
  upload: (p) => <Icon {...p} d={<><path d="M12 4v12m0-12-4 4m4-4 4 4"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></>} />,
  image: (p) => <Icon {...p} d={<><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m4 18 5-5 4 4 3-3 4 4"/></>} />,
  link: (p) => <Icon {...p} d={<><path d="M10 13a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 11a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></>} />,
  tag: (p) => <Icon {...p} d={<><path d="M20 12.5 12.5 20a1.5 1.5 0 0 1-2.1 0L4 13.5V5a1 1 0 0 1 1-1h8.5L20 10.4a1.5 1.5 0 0 1 0 2.1z"/><circle cx="8" cy="8" r="1"/></>} />,
  folder: (p) => <Icon {...p} d={<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"/>} />,
  edit: (p) => <Icon {...p} d={<><path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="m13 7 4 4"/></>} />,
  trash: (p) => <Icon {...p} d={<><path d="M4 7h16M9 7V4h6v3m-7 0v13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7"/></>} />,
  more: (p) => <Icon {...p} d={<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>} />,
  user: (p) => <Icon {...p} d={<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>} />,
  bell: (p) => <Icon {...p} d={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8z"/><path d="M10 21a2 2 0 0 0 4 0"/></>} />,
  package: (p) => <Icon {...p} d={<><path d="m3 8 9-5 9 5v8l-9 5-9-5z"/><path d="M3 8 12 13l9-5M12 13v10"/></>} />,
  list: (p) => <Icon {...p} d={<><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></>} />,
  grid: (p) => <Icon {...p} d={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>} />,
  download: (p) => <Icon {...p} d={<><path d="M12 4v12m0 0-4-4m4 4 4-4"/><path d="M4 20h16"/></>} />,
  refresh: (p) => <Icon {...p} d={<><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 4v4h-4"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 20v-4h4"/></>} />,
  sparkle: (p) => <Icon {...p} d={<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></>} />,
  warning: (p) => <Icon {...p} d={<><path d="M12 4 2 20h20L12 4z"/><path d="M12 10v5M12 18v.5"/></>} />,
  drag: (p) => <Icon {...p} d={<><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></>} />,
  history: (p) => <Icon {...p} d={<><path d="M12 8v5l3 2"/><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 4v4h4"/></>} />,
  scan: (p) => <Icon {...p} d={<><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M7 8v8M11 8v8M15 8v8"/></>} />,
  chart: (p) => <Icon {...p} d={<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>} />,
  flow: (p) => <Icon {...p} d={<><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M8 7l3 9M16 7l-3 9"/></>} />,
  store: (p) => <Icon {...p} d={<><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M9 20v-5h6v5"/></>} />,
  receipt: (p) => <Icon {...p} d={<><path d="M5 3v18l2-1.5L9 21l2-1.5L13 21l2-1.5L17 21l2-1.5V3l-2 1.5L15 3l-2 1.5L11 3 9 4.5 7 3 5 4.5z"/><path d="M8 8h8M8 12h8M8 16h5"/></>} />,
  cart: (p) => <Icon {...p} d={<><path d="M3 4h2l2.5 11.5a2 2 0 0 0 2 1.5h7.5a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></>} />,
  megaphone: (p) => <Icon {...p} d={<><path d="M3 10v4a1 1 0 0 0 1 1h3l9 5V4l-9 5H4a1 1 0 0 0-1 1z"/><path d="M19 8a4 4 0 0 1 0 8"/></>} />,
  globe: (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>} />,
};

window.I = I;
window.Icon = Icon;
