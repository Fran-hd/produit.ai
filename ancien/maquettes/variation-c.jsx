// Variation C — Data-dense tableur pro (spreadsheet-like)
// Focus: import / export / bulk editing through a powerful grid

const C_TOKENS = {
  bg: "#ffffff",
  surface: "#ffffff",
  border: "#e1e3e6",
  borderStrong: "#cdd0d4",
  headerBg: "#f4f5f7",
  rowAlt: "#fbfcfd",
  rowHover: "#f0f4f7",
  text: "#1c1f23",
  textMuted: "#5b6068",
  textSubtle: "#8a8f97",
  accent: "oklch(0.5 0.16 250)",
  accentSoft: "oklch(0.96 0.04 250)",
  accentText: "oklch(0.35 0.14 250)",
  green: "oklch(0.55 0.13 145)",
  greenSoft: "oklch(0.95 0.05 145)",
  red: "oklch(0.58 0.16 25)",
  redSoft: "oklch(0.96 0.05 25)",
  amber: "oklch(0.7 0.13 75)",
  amberSoft: "oklch(0.96 0.06 75)",
  font: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

function CellC({ children, value, type, error, edited, locked, align = "left", style }) {
  let bg = "transparent";
  if (error) bg = C_TOKENS.redSoft;
  else if (edited) bg = "oklch(0.97 0.04 90)";
  else if (locked) bg = "#f7f8f9";
  return (
    <td style={{ padding: "0 8px", height: 28, borderRight: `1px solid ${C_TOKENS.border}`,
      background: bg, fontSize: 12, color: C_TOKENS.text, position: "relative",
      fontFamily: type === "ean" || type === "num" ? C_TOKENS.mono : "inherit",
      fontVariantNumeric: type === "num" || type === "ean" ? "tabular-nums" : "normal",
      textAlign: align, ...style }}>
      {children ?? value}
      {error && <div style={{ position: "absolute", top: 2, right: 2, width: 5, height: 5, background: C_TOKENS.red, borderRadius: "50%" }} />}
      {edited && !error && <div style={{ position: "absolute", top: 2, right: 2, width: 5, height: 5, background: C_TOKENS.amber, borderRadius: "50%" }} />}
    </td>
  );
}

function ProductGridC() {
  const [active, setActive] = React.useState({ row: 1, col: 3 });

  const headers = ["EAN", "Désignation", "Marque", "Format", "Catégorie", "Nutri-Score", "Prix HT", "Compl.", "Statut", "Visuels"];
  const rows = [
    ["3017620422003", "Nutella pâte à tartiner", "Ferrero", "750 g", "Pâtes à tartiner", "E", "5,49 €", 92, "validated", 4],
    ["3228857000852", "Baguette tradition fr.", "Harrys", "250 g", "Pains", "B", "1,29 €", 64, "in_review", 2],
    ["3175680011480", "Eau minérale plate", "Cristaline", "6 × 1,5 L", "Eaux", "A", "2,15 €", 100, "validated", 5],
    ["3560070976478", "Filet poulet fermier", "Loué", "2 × 120 g", "Découpes", "—", "8,90 €", 38, "draft", 1, { errors: [3, 5] }],
    ["8001505005707", "Pâtes spaghetti n°5", "Barilla", "500 g", "Pâtes sèches", "A", "1,89 €", 88, "validated", 3],
    ["3245412000133", "Yaourt nature lait ent.", "La Laitière", "4 × 125 g", "Yaourts", "B", "2,79 €", 71, "in_review", 2, { edited: [1, 6] }],
    ["3017760123457", "Café en grains arabica", "Carte Noire", "1 kg", "Cafés", "—", "—", 22, "draft", 0, { errors: [5, 6] }],
    ["3596710443215", "Saumon fumé Atlantique", "Labeyrie", "4 tr · 120 g", "Saumon", "C", "6,49 €", 81, "in_review", 3],
    ["8076809513753", "Sauce tomate basilic", "Mutti", "400 g", "Sauces", "B", "1,69 €", 95, "validated", 4],
    ["3033710065165", "Lait demi-écrémé UHT", "Lactel", "6 × 1 L", "Laits", "B", "5,40 €", 100, "validated", 4],
    ["7613034626844", "Céréales Fitness chocolat", "Nestlé", "375 g", "Céréales", "C", "3,99 €", 78, "in_review", 3, { edited: [4] }],
    ["3268840001005", "Beurre doux plaquette", "Président", "250 g", "Beurres", "D", "2,49 €", 100, "validated", 5],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C_TOKENS.bg, fontFamily: C_TOKENS.font, color: C_TOKENS.text, fontSize: 13 }}>
      {/* Compact top bar */}
      <div style={{ height: 38, padding: "0 12px", background: C_TOKENS.headerBg, borderBottom: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 12, fontSize: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: C_TOKENS.accent, color: "#fff",
            display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>P</div>
          <span style={{ fontWeight: 600, color: C_TOKENS.text }}>Produit.ai</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 4px" }}>/</span>
          <span>Articles</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 2px" }}>›</span>
          <span style={{ fontWeight: 500 }}>Vue grille — Tous</span>
        </div>
        <div style={{ flex: 1 }} />
        {[
          { label: "Fichier", icon: I.upload },
          { label: "Édition", icon: I.edit },
          { label: "Affichage", icon: I.list },
          { label: "Données", icon: I.refresh },
        ].map(m => (
          <button key={m.label} style={{ padding: "3px 8px", background: "transparent", border: "none",
            fontSize: 12, color: C_TOKENS.text, cursor: "pointer", borderRadius: 4 }}>{m.label}</button>
        ))}
        <div style={{ width: 1, height: 18, background: C_TOKENS.border, margin: "0 4px" }} />
        <span style={{ fontSize: 11, color: C_TOKENS.textMuted }}>Auto-save · il y a 12s</span>
      </div>

      {/* Toolbar */}
      <div style={{ height: 44, padding: "0 12px", background: "#fff", borderBottom: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 6 }}>
        <button style={tbBtnC}><I.upload size={13} /> Importer CSV</button>
        <button style={tbBtnC}><I.download size={13} /> Exporter</button>
        <div style={{ width: 1, height: 22, background: C_TOKENS.border, margin: "0 4px" }} />
        <button style={tbBtnC}><I.plus size={13} /> Ligne</button>
        <button style={tbBtnC}><I.filter size={13} /> Filtres <span style={{ background: C_TOKENS.accentSoft, color: C_TOKENS.accentText, padding: "0 5px", borderRadius: 3, marginLeft: 3, fontSize: 11, fontWeight: 600 }}>3</span></button>
        <button style={tbBtnC}><I.sort size={13} /> Tri</button>
        <button style={tbBtnC}><I.grid size={13} /> Colonnes</button>
        <div style={{ width: 1, height: 22, background: C_TOKENS.border, margin: "0 4px" }} />
        <button style={tbBtnC}><I.sparkle size={13} /> Auto-enrichir</button>
        <div style={{ flex: 1 }} />
        <div style={{ position: "relative" }}>
          <I.search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: C_TOKENS.textSubtle }} />
          <input placeholder="Rechercher dans la grille…"
            style={{ padding: "5px 10px 5px 26px", border: `1px solid ${C_TOKENS.border}`, borderRadius: 5, fontSize: 12, width: 220, fontFamily: "inherit", outline: "none" }} />
        </div>
      </div>

      {/* Filters/chips */}
      <div style={{ padding: "8px 12px", background: "#fff", borderBottom: `1px solid ${C_TOKENS.border}`, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", fontSize: 11.5 }}>
        <span style={{ color: C_TOKENS.textMuted, fontSize: 11 }}>Filtres :</span>
        <span style={chipC}>Catégorie = <strong style={{ color: C_TOKENS.text }}>Épicerie</strong> <I.x size={10} /></span>
        <span style={chipC}>Complétude &lt; <strong style={{ color: C_TOKENS.text }}>100%</strong> <I.x size={10} /></span>
        <span style={chipC}>Modifié <strong style={{ color: C_TOKENS.text }}>cette semaine</strong> <I.x size={10} /></span>
        <span style={{ color: C_TOKENS.textMuted, fontSize: 11, marginLeft: 8 }}>· 12 / 8 421 articles</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: C_TOKENS.textMuted, fontSize: 11 }}>3 cellules en erreur · 4 modifiées non sauvegardées</span>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflow: "auto", background: "#fff" }}>
        <table style={{ borderCollapse: "collapse", fontSize: 12, width: "100%", minWidth: 1400 }}>
          <thead>
            <tr style={{ position: "sticky", top: 0, zIndex: 2 }}>
              <th style={{ ...thC, width: 32, position: "sticky", left: 0, background: C_TOKENS.headerBg, zIndex: 3 }}></th>
              <th style={{ ...thC, width: 32 }}></th>
              {headers.map((h, i) => (
                <th key={h} style={{ ...thC, minWidth: i === 1 ? 200 : i === 4 ? 140 : i === 0 ? 130 : 90 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "space-between" }}>
                    <span>{h}</span>
                    <I.chevronDown size={10} style={{ color: C_TOKENS.textSubtle }} />
                  </div>
                </th>
              ))}
            </tr>
            <tr style={{ position: "sticky", top: 28, zIndex: 2 }}>
              <th style={{ ...thC, width: 32, height: 22, position: "sticky", left: 0, background: C_TOKENS.headerBg, zIndex: 3 }}></th>
              <th style={{ ...thC, width: 32, height: 22 }}></th>
              {headers.map((h, i) => (
                <th key={i} style={{ ...thC, height: 22, padding: 0, background: "#fff", borderBottom: `1px solid ${C_TOKENS.border}` }}>
                  <input placeholder={i === 7 || i === 9 ? "≥" : ""} style={{ width: "100%", height: "100%", padding: "0 8px",
                    background: "transparent", border: "none", outline: "none", fontSize: 11, color: C_TOKENS.textMuted, fontFamily: "inherit" }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => {
              const meta = r[10] || {};
              const isActive = active.row === ri;
              return (
                <tr key={ri} style={{ background: ri % 2 ? C_TOKENS.rowAlt : "#fff" }}>
                  <td style={{ width: 32, padding: "0 4px", borderRight: `1px solid ${C_TOKENS.border}`, borderBottom: `1px solid ${C_TOKENS.border}`,
                    background: isActive ? C_TOKENS.accentSoft : C_TOKENS.headerBg, color: C_TOKENS.textMuted, fontSize: 11,
                    textAlign: "center", position: "sticky", left: 0, zIndex: 1, fontVariantNumeric: "tabular-nums" }}>{ri + 1}</td>
                  <td style={{ width: 32, textAlign: "center", borderRight: `1px solid ${C_TOKENS.border}`, borderBottom: `1px solid ${C_TOKENS.border}` }}>
                    <input type="checkbox" defaultChecked={ri === 1 || ri === 5} />
                  </td>
                  <CellC value={r[0]} type="ean" />
                  <CellC value={r[1]} edited={meta.edited?.includes(1)} />
                  <CellC value={r[2]} />
                  <CellC value={r[3]} type="num" />
                  <CellC value={r[4]} edited={meta.edited?.includes(4)} />
                  <CellC error={meta.errors?.includes(5)}>
                    {r[5] !== "—" ? (
                      <div style={{ display: "inline-block", width: 18, height: 18, borderRadius: 3,
                        background: { A: "oklch(0.65 0.15 145)", B: "oklch(0.7 0.13 110)", C: "oklch(0.78 0.13 90)", D: "oklch(0.7 0.14 50)", E: "oklch(0.6 0.16 30)" }[r[5]],
                        color: "#fff", fontSize: 11, fontWeight: 700, textAlign: "center", lineHeight: "18px" }}>{r[5]}</div>
                    ) : <span style={{ color: C_TOKENS.red, fontWeight: 600 }}>manquant</span>}
                  </CellC>
                  <CellC value={r[6]} type="num" align="right" error={meta.errors?.includes(6)} edited={meta.edited?.includes(6)} />
                  <CellC>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, height: 4, background: "#e7e9ec", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${r[7]}%`, height: "100%",
                          background: r[7] >= 80 ? C_TOKENS.green : r[7] >= 50 ? C_TOKENS.amber : C_TOKENS.red }} />
                      </div>
                      <span style={{ fontFamily: C_TOKENS.mono, fontSize: 11, color: C_TOKENS.textMuted, fontVariantNumeric: "tabular-nums", width: 26, textAlign: "right" }}>{r[7]}</span>
                    </div>
                  </CellC>
                  <CellC>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "1px 6px", borderRadius: 3,
                      background: r[8] === "validated" ? C_TOKENS.greenSoft : r[8] === "in_review" ? C_TOKENS.amberSoft : "#f1f2f4",
                      color: r[8] === "validated" ? "oklch(0.35 0.13 145)" : r[8] === "in_review" ? "oklch(0.42 0.13 70)" : C_TOKENS.textMuted,
                      fontSize: 11, fontWeight: 500 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%",
                        background: r[8] === "validated" ? C_TOKENS.green : r[8] === "in_review" ? C_TOKENS.amber : C_TOKENS.textSubtle }} />
                      {r[8] === "validated" ? "Validé" : r[8] === "in_review" ? "À valider" : "Brouillon"}
                    </div>
                  </CellC>
                  <CellC type="num" align="right">
                    <span style={{ color: r[9] === 0 ? C_TOKENS.red : C_TOKENS.text, fontWeight: r[9] === 0 ? 600 : 400 }}>{r[9]}</span>
                  </CellC>
                </tr>
              );
            })}
            {/* Active cell highlight indicator at row 2 col 4 */}
            <tr><td colSpan={12} style={{ borderBottom: `1px solid ${C_TOKENS.border}`, height: 0 }}></td></tr>
          </tbody>
        </table>

        {/* Floating cell-edit popover */}
        <div style={{ position: "absolute", top: 232, left: 540, width: 220, background: "#fff",
          border: `2px solid ${C_TOKENS.accent}`, borderRadius: 6, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: 10, zIndex: 4 }}>
          <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>
            B6 · Désignation
          </div>
          <input defaultValue="Yaourt nature lait entier"
            style={{ width: "100%", padding: "5px 7px", border: `1px solid ${C_TOKENS.border}`, borderRadius: 4, fontSize: 13, fontFamily: "inherit", outline: "none", marginBottom: 6 }} />
          <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted, marginBottom: 4 }}>Suggestions ✨</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {["Yaourt nature au lait entier 4×125g", "Yaourt nature entier — La Laitière", "La Laitière yaourt nature entier"].map(s => (
              <div key={s} style={{ padding: "4px 6px", borderRadius: 3, fontSize: 11.5, color: C_TOKENS.text, cursor: "pointer", background: "#fafbfc" }}>{s}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{ height: 26, padding: "0 12px", background: C_TOKENS.headerBg, borderTop: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>
        <span>L 12 · C 10</span>
        <span>Sélection: <strong style={{ color: C_TOKENS.text }}>2 lignes</strong></span>
        <span>Σ Compl. moy: <strong style={{ color: C_TOKENS.text }}>74,8%</strong></span>
        <div style={{ flex: 1 }} />
        <span style={{ color: C_TOKENS.amber, fontWeight: 600 }}>● 4 modifs non sauvegardées</span>
        <span style={{ color: C_TOKENS.red, fontWeight: 600 }}>● 3 erreurs</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}

const tbBtnC = { display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 9px", background: "transparent",
  border: "none", borderRadius: 4, fontSize: 12, color: C_TOKENS.text, cursor: "pointer", fontFamily: "inherit" };
const thC = { padding: "6px 8px", height: 28, background: C_TOKENS.headerBg, borderBottom: `1px solid ${C_TOKENS.border}`,
  borderRight: `1px solid ${C_TOKENS.border}`, fontSize: 11, fontWeight: 600, color: C_TOKENS.text, textAlign: "left", letterSpacing: 0.2 };
const chipC = { display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", background: C_TOKENS.headerBg,
  border: `1px solid ${C_TOKENS.border}`, borderRadius: 999, color: C_TOKENS.textMuted, cursor: "pointer" };

window.ProductGridC = ProductGridC;
window.C_TOKENS = C_TOKENS;
