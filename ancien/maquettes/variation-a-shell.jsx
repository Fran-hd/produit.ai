// Variation A — Sobre & dense (Linear-like)
// Fiche article multi-onglets, dark sidebar + canvas clair

const A_TOKENS = {
  bg: "#fafaf8",
  surface: "#ffffff",
  border: "#e8e6e1",
  borderStrong: "#d4d1ca",
  text: "#1a1916",
  textMuted: "#6b6962",
  textSubtle: "#9a978f",
  sidebarBg: "#1a1916",
  sidebarText: "#cfccc4",
  sidebarMuted: "#7a776e",
  sidebarHover: "#252320",
  accent: "oklch(0.55 0.12 130)",   // olive
  accentSoft: "oklch(0.95 0.04 130)",
  accentText: "oklch(0.32 0.08 130)",
  warn: "oklch(0.7 0.14 70)",
  warnSoft: "oklch(0.96 0.05 80)",
  warnText: "oklch(0.42 0.13 60)",
  danger: "oklch(0.58 0.16 25)",
  font: "'Inter', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

const A_TABS = ["Identité", "Visuels", "Libellés", "Nomenclature", "Liens", "Logistique", "Nutrition", "Historique"];

function ChipA({ children, tone = "neutral", style }) {
  const tones = {
    neutral: { bg: "#f1efea", color: "#3a3833", border: "#e0ddd6" },
    success: { bg: A_TOKENS.accentSoft, color: A_TOKENS.accentText, border: "transparent" },
    warn: { bg: A_TOKENS.warnSoft, color: A_TOKENS.warnText, border: "transparent" },
    info: { bg: "#eef2f6", color: "#42566c", border: "transparent" },
    danger: { bg: "#fbecea", color: "#8a3a2f", border: "transparent" },
  };
  const t = tones[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500,
      padding: "2px 8px", borderRadius: 4, background: t.bg, color: t.color, border: `1px solid ${t.border}`,
      letterSpacing: 0.1, ...style }}>{children}</span>
  );
}

function ProgressRing({ value, size = 36, stroke = 3 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  const color = value >= 80 ? A_TOKENS.accent : value >= 50 ? A_TOKENS.warn : A_TOKENS.danger;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#ebe9e3" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset .4s" }} />
    </svg>
  );
}

function SidebarA({ active, onNav }) {
  const nav = [
    { id: "dash", label: "Tableau de bord", icon: I.chart },
    { id: "list", label: "Articles", icon: I.package, count: 8421 },
    { id: "draft", label: "Brouillons", icon: I.edit, count: 142, indent: true },
    { id: "review", label: "À valider", icon: I.warning, count: 38, indent: true },
    { id: "validated", label: "Validés", icon: I.check, indent: true },
    { id: "nomen", label: "Nomenclature", icon: I.folder },
    { id: "links", label: "Liens produits", icon: I.link },
    { id: "import", label: "Import / Export", icon: I.upload },
  ];
  return (
    <aside style={{ width: 220, background: A_TOKENS.sidebarBg, color: A_TOKENS.sidebarText,
      display: "flex", flexDirection: "column", flexShrink: 0, fontSize: 13 }}>
      <div style={{ padding: "16px 14px 12px", display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: A_TOKENS.accent,
          display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13, color: "#fff" }}>P</div>
        <div style={{ fontWeight: 600, color: "#fff", letterSpacing: -0.1 }}>Produit.ai</div>
      </div>
      <div style={{ padding: "0 8px 12px" }}>
        <div style={{ position: "relative" }}>
          <I.search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: A_TOKENS.sidebarMuted }} />
          <input placeholder="Rechercher" style={{ width: "100%", padding: "6px 9px 6px 28px", background: "#252320",
            border: "1px solid #2e2c28", borderRadius: 6, color: "#fff", fontSize: 12.5, fontFamily: "inherit", outline: "none" }} />
          <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
            fontSize: 10, color: A_TOKENS.sidebarMuted, fontFamily: A_TOKENS.mono }}>⌘K</span>
        </div>
      </div>
      <nav style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: 1 }}>
        {nav.map(n => {
          const isActive = active === n.id;
          return (
            <button key={n.id} onClick={() => onNav?.(n.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: `5px ${n.indent ? 22 : 9}px 5px ${n.indent ? 28 : 9}px`,
                background: isActive ? A_TOKENS.sidebarHover : "transparent",
                border: "none", color: isActive ? "#fff" : A_TOKENS.sidebarText,
                borderRadius: 5, cursor: "pointer", fontSize: 12.5, fontFamily: "inherit", textAlign: "left", width: "100%" }}>
              {!n.indent && <n.icon size={14} />}
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.count != null && <span style={{ fontSize: 11, color: A_TOKENS.sidebarMuted, fontVariantNumeric: "tabular-nums" }}>{n.count}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{ marginTop: 16, padding: "8px 8px 4px" }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: A_TOKENS.sidebarMuted, letterSpacing: 0.5,
          textTransform: "uppercase", padding: "4px 9px 6px" }}>Mes filtres</div>
        {["Mes brouillons", "Boulangerie · 2026", "EAN sans visuel"].map(f => (
          <button key={f} style={{ display: "block", width: "100%", padding: "5px 9px",
            background: "transparent", border: "none", color: A_TOKENS.sidebarText,
            fontSize: 12.5, fontFamily: "inherit", textAlign: "left", borderRadius: 5, cursor: "pointer" }}>
            <span style={{ color: A_TOKENS.sidebarMuted, marginRight: 6 }}>#</span>{f}
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }}></div>
      <div style={{ padding: 10, borderTop: "1px solid #252320", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "oklch(0.55 0.12 60)", display: "grid", placeItems: "center", color: "#fff", fontSize: 11, fontWeight: 600 }}>ML</div>
        <div style={{ flex: 1, lineHeight: 1.2 }}>
          <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 500 }}>M. Lefèvre</div>
          <div style={{ fontSize: 11, color: A_TOKENS.sidebarMuted }}>Cat. Manager</div>
        </div>
      </div>
    </aside>
  );
}

window.A_TOKENS = A_TOKENS;
window.A_TABS = A_TABS;
window.ChipA = ChipA;
window.ProgressRing = ProgressRing;
window.SidebarA = SidebarA;
