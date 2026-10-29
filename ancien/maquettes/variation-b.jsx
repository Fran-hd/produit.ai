// Variation B — Cards aérées, accent olive, plus chaleureux
// Focus: l'éditeur de liens produits avec drag & drop / graphe

const B_TOKENS = {
  bg: "#f7f5ef",
  surface: "#ffffff",
  cardBg: "#fefdf8",
  border: "#e6e1d4",
  borderStrong: "#d6cfb8",
  text: "#26241e",
  textMuted: "#6e6a5d",
  textSubtle: "#9a9685",
  accent: "oklch(0.55 0.12 130)",
  accentDark: "oklch(0.42 0.12 130)",
  accentSoft: "oklch(0.95 0.05 130)",
  cream: "#f1ecdb",
  coral: "oklch(0.65 0.15 35)",
  coralSoft: "oklch(0.96 0.04 35)",
  blue: "oklch(0.6 0.13 240)",
  blueSoft: "oklch(0.95 0.03 240)",
  amber: "oklch(0.7 0.13 75)",
  amberSoft: "oklch(0.96 0.05 80)",
  font: "'Inter', system-ui, sans-serif",
  serif: "'Fraunces', 'Times New Roman', serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

function PillB({ children, color = "neutral", style }) {
  const c = {
    neutral: { bg: "#efece2", color: "#3a382f" },
    olive: { bg: B_TOKENS.accentSoft, color: B_TOKENS.accentDark },
    coral: { bg: B_TOKENS.coralSoft, color: "oklch(0.4 0.13 35)" },
    blue: { bg: B_TOKENS.blueSoft, color: "oklch(0.4 0.12 240)" },
    amber: { bg: B_TOKENS.amberSoft, color: "oklch(0.42 0.13 60)" },
  }[color];
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 999,
    background: c.bg, color: c.color, fontSize: 11.5, fontWeight: 500, ...style }}>{children}</span>;
}

function CardB({ children, padding = 18, style }) {
  return <div style={{ background: B_TOKENS.cardBg, border: `1px solid ${B_TOKENS.border}`,
    borderRadius: 14, padding, boxShadow: "0 1px 0 rgba(0,0,0,0.02)", ...style }}>{children}</div>;
}

// Graph link editor — central focus card with surrounding link types
function LinkGraphB() {
  const linkGroups = [
    { type: "Substituts", color: B_TOKENS.coral, items: LINKS.substitute, angle: -120 },
    { type: "Compléments", color: B_TOKENS.accent, items: LINKS.complementary, angle: -60 },
    { type: "Variantes", color: B_TOKENS.blue, items: LINKS.variant, angle: 60 },
    { type: "Up-sell", color: B_TOKENS.amber, items: LINKS.upsell, angle: 120 },
  ];

  return (
    <div style={{ position: "relative", height: 460, background: `radial-gradient(circle at center, ${B_TOKENS.cream} 0%, ${B_TOKENS.bg} 70%)`,
      borderRadius: 14, border: `1px solid ${B_TOKENS.border}`, overflow: "hidden" }}>
      {/* SVG curves */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {linkGroups.map((g, gi) => {
          const cx = 50, cy = 50;
          const rad = (g.angle * Math.PI) / 180;
          const tx = cx + Math.cos(rad) * 32;
          const ty = cy + Math.sin(rad) * 32;
          return (
            <g key={g.type}>
              <path d={`M ${cx}% ${cy}% Q ${(cx+tx)/2}% ${(cy+ty)/2 - 5}% ${tx}% ${ty}%`}
                stroke={g.color} strokeWidth="1.5" fill="none" strokeDasharray="4 3" opacity="0.5" />
            </g>
          );
        })}
      </svg>

      {/* Central node */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
        width: 180, padding: 14, background: "#fff", border: `2px solid ${B_TOKENS.accent}`, borderRadius: 14,
        boxShadow: "0 6px 20px oklch(0.55 0.12 130 / 0.18)", textAlign: "center", zIndex: 2 }}>
        <div style={{ width: 56, height: 56, margin: "0 auto 8px", borderRadius: 12, background: B_TOKENS.cream, display: "grid", placeItems: "center", fontSize: 30 }}>🍫</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: B_TOKENS.text, marginBottom: 2 }}>Nutella 750g</div>
        <div style={{ fontSize: 10.5, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono }}>3017620422003</div>
      </div>

      {/* Link group nodes */}
      {linkGroups.map((g) => {
        const rad = (g.angle * Math.PI) / 180;
        const cx = 50 + Math.cos(rad) * 32;
        const cy = 50 + Math.sin(rad) * 32;
        return (
          <div key={g.type} style={{ position: "absolute", left: `${cx}%`, top: `${cy}%`,
            transform: "translate(-50%, -50%)", width: 158, zIndex: 1 }}>
            <div style={{ background: "#fff", border: `1.5px solid ${g.color}`, borderRadius: 12, padding: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: g.color }} />
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: B_TOKENS.text }}>{g.type}</span>
                </div>
                <span style={{ fontSize: 11, color: B_TOKENS.textMuted, fontVariantNumeric: "tabular-nums" }}>{g.items.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {g.items.slice(0, 2).map(it => (
                  <div key={it.ean} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 6px",
                    background: B_TOKENS.bg, borderRadius: 6, fontSize: 11 }}>
                    <span style={{ fontSize: 13 }}>{it.image}</span>
                    <span style={{ flex: 1, minWidth: 0, color: B_TOKENS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{it.name}</span>
                  </div>
                ))}
                {g.items.length > 2 && <div style={{ fontSize: 10.5, color: B_TOKENS.textMuted, padding: "0 6px" }}>+ {g.items.length - 2} autres</div>}
              </div>
            </div>
          </div>
        );
      })}

      {/* Legend / search */}
      <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6 }}>
        <PillB color="olive">Vue graphe</PillB>
        <PillB>Vue liste</PillB>
      </div>
      <div style={{ position: "absolute", top: 14, right: 14, padding: "5px 10px", background: "#fff",
        border: `1px solid ${B_TOKENS.border}`, borderRadius: 999, fontSize: 11.5, color: B_TOKENS.textMuted,
        display: "flex", alignItems: "center", gap: 6 }}>
        <I.search size={11} /> Glisser un EAN ici pour lier
      </div>
    </div>
  );
}

function ProductDetailB() {
  return (
    <div style={{ display: "flex", height: "100%", background: B_TOKENS.bg, fontFamily: B_TOKENS.font, color: B_TOKENS.text, overflowY: "auto" }}>
      {/* Compact left nav */}
      <aside style={{ width: 64, background: B_TOKENS.surface, borderRight: `1px solid ${B_TOKENS.border}`,
        display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 4, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: B_TOKENS.accent, display: "grid", placeItems: "center",
          color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>P</div>
        {[
          { icon: I.chart },
          { icon: I.package, active: true },
          { icon: I.folder },
          { icon: I.link },
          { icon: I.upload },
        ].map((n, i) => (
          <button key={i} style={{ width: 38, height: 38, borderRadius: 9,
            background: n.active ? B_TOKENS.accentSoft : "transparent", border: "none", cursor: "pointer",
            color: n.active ? B_TOKENS.accentDark : B_TOKENS.textMuted, display: "grid", placeItems: "center" }}>
            <n.icon size={17} />
          </button>
        ))}
      </aside>

      <main style={{ flex: 1, padding: "20px 28px", minWidth: 0, maxWidth: "100%" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: B_TOKENS.textMuted, marginBottom: 14 }}>
          <span>Articles</span>
          <span>›</span>
          <span>Épicerie sucrée</span>
          <span>›</span>
          <span style={{ color: B_TOKENS.text, fontWeight: 500 }}>Nutella 750g</span>
        </div>

        {/* Hero card */}
        <CardB padding={20} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div style={{ width: 92, height: 92, borderRadius: 14, background: B_TOKENS.cream,
              border: `1px solid ${B_TOKENS.border}`, display: "grid", placeItems: "center", fontSize: 44, flexShrink: 0 }}>🍫</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <PillB color="olive"><I.check size={11} /> Validé</PillB>
                <PillB>Ferrero · Nutella</PillB>
                <span style={{ fontSize: 11, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono }}>EAN 3017620422003</span>
              </div>
              <h1 style={{ fontFamily: B_TOKENS.serif, fontSize: 28, fontWeight: 500, margin: 0,
                letterSpacing: -0.4, color: B_TOKENS.text, lineHeight: 1.1 }}>
                Nutella pâte à tartiner
              </h1>
              <div style={{ fontSize: 13.5, color: B_TOKENS.textMuted, marginTop: 4 }}>750 g · Italie · Modifié il y a 2h par M. Lefèvre</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <ProgressRing value={92} size={56} stroke={4.5} />
              <div style={{ fontSize: 11, color: B_TOKENS.textMuted, fontWeight: 500 }}>complétude</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignSelf: "flex-start" }}>
              <button style={{ padding: "8px 14px", background: "#fff", border: `1px solid ${B_TOKENS.border}`,
                borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: "pointer", color: B_TOKENS.text }}>Aperçu</button>
              <button style={{ padding: "8px 14px", background: B_TOKENS.accent, color: "#fff",
                border: "none", borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Publier</button>
            </div>
          </div>

          {/* Inline progress bars */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${B_TOKENS.border}` }}>
            {[
              { l: "Identité", v: 100 }, { l: "Visuels", v: 80 },
              { l: "Libellés", v: 92 }, { l: "Liens", v: 60 },
            ].map(b => (
              <div key={b.l}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12 }}>
                  <span style={{ color: B_TOKENS.textMuted }}>{b.l}</span>
                  <span style={{ fontWeight: 600, color: b.v === 100 ? B_TOKENS.accentDark : B_TOKENS.text, fontVariantNumeric: "tabular-nums" }}>{b.v}%</span>
                </div>
                <div style={{ height: 5, background: B_TOKENS.cream, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${b.v}%`, height: "100%", background: b.v === 100 ? B_TOKENS.accent : b.v >= 70 ? B_TOKENS.amber : B_TOKENS.coral, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </CardB>

        {/* Two columns: visuals + links */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16, marginBottom: 16 }}>
          {/* Visuals */}
          <CardB>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: B_TOKENS.serif, fontSize: 18, fontWeight: 500, color: B_TOKENS.text }}>Visuels</div>
                <div style={{ fontSize: 12, color: B_TOKENS.textMuted, marginTop: 2 }}>4 sur 6 obligatoires</div>
              </div>
              <button style={{ padding: "5px 11px", background: "#fff", border: `1px solid ${B_TOKENS.border}`,
                borderRadius: 7, fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, color: B_TOKENS.text }}>
                <I.upload size={12} /> Importer
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ aspectRatio: "1", borderRadius: 11, background: B_TOKENS.cream,
                display: "grid", placeItems: "center", fontSize: 64, position: "relative" }}>
                🍫
                <div style={{ position: "absolute", top: 8, left: 8 }}><PillB color="olive">★ Principal</PillB></div>
              </div>
              <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ borderRadius: 9, background: B_TOKENS.cream, display: "grid", placeItems: "center", fontSize: 26 }}>📦</div>
                  <div style={{ borderRadius: 9, background: B_TOKENS.cream, display: "grid", placeItems: "center", fontSize: 26 }}>🥜</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ borderRadius: 9, background: B_TOKENS.cream, display: "grid", placeItems: "center", fontSize: 26 }}>🛒</div>
                  <div style={{ borderRadius: 9, border: `1.5px dashed ${B_TOKENS.coral}`, background: B_TOKENS.coralSoft,
                    display: "grid", placeItems: "center", fontSize: 11, color: "oklch(0.4 0.13 35)", textAlign: "center", padding: 8, fontWeight: 500 }}>
                    Vue 3/4<br/>requise
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, padding: "10px 12px", border: `1.5px dashed ${B_TOKENS.borderStrong}`,
              borderRadius: 9, fontSize: 12, color: B_TOKENS.textMuted, textAlign: "center", background: "#fff" }}>
              Glisser-déposer pour ajouter
            </div>
          </CardB>

          {/* Labels */}
          <CardB>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: B_TOKENS.serif, fontSize: 18, fontWeight: 500, color: B_TOKENS.text }}>Libellés multi-canal</div>
                <div style={{ fontSize: 12, color: B_TOKENS.textMuted, marginTop: 2 }}>4 canaux configurés</div>
              </div>
              <PillB color="olive">92% complets</PillB>
            </div>
            {[
              { name: "Étagère", limit: 32, used: 27, value: "Nutella pâte tartiner 750g" },
              { name: "Caisse", limit: 24, used: 14, value: "NUTELLA 750G" },
              { name: "Site marchand", limit: 80, used: 56, value: "Nutella · Pâte à tartiner aux noisettes et cacao 750g" },
              { name: "Marketing long", limit: 240, used: 220, value: "Nutella, la pâte à tartiner unique au monde, à base de noisettes torréfiées et de cacao soigneusement sélectionné…" },
            ].map(c => (
              <div key={c.name} style={{ padding: "10px 0", borderBottom: `1px solid ${B_TOKENS.border}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: B_TOKENS.text }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>{c.used} / {c.limit}</div>
                </div>
                <div style={{ fontSize: 13, color: B_TOKENS.text, lineHeight: 1.4 }}>{c.value}</div>
              </div>
            ))}
          </CardB>
        </div>

        {/* Link graph - the focal point */}
        <CardB padding={0}>
          <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${B_TOKENS.border}` }}>
            <div>
              <div style={{ fontFamily: B_TOKENS.serif, fontSize: 18, fontWeight: 500, color: B_TOKENS.text }}>Liens entre produits</div>
              <div style={{ fontSize: 12, color: B_TOKENS.textMuted, marginTop: 2 }}>11 liens · 5 suggestions à examiner</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button style={{ padding: "5px 11px", background: B_TOKENS.accentSoft, color: B_TOKENS.accentDark,
                border: "none", borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}>
                <I.sparkle size={12} /> 5 suggestions
              </button>
              <button style={{ padding: "5px 11px", background: "#fff", border: `1px solid ${B_TOKENS.border}`,
                borderRadius: 7, fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, color: B_TOKENS.text }}>
                <I.plus size={12} /> Ajouter un lien
              </button>
            </div>
          </div>
          <div style={{ padding: 18 }}>
            <LinkGraphB />
          </div>
        </CardB>
      </main>
    </div>
  );
}

window.B_TOKENS = B_TOKENS;
window.ProductDetailB = ProductDetailB;
