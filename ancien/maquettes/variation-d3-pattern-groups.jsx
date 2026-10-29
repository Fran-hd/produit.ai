// Variation D3 — Pattern groups
// Au lieu d'\u00e9diter ligne par ligne : l'IA cluster les libell\u00e9s par "pattern" (m\u00eame structure d\u00e9tect\u00e9e),
// l'utilisateur valide / corrige UN pattern \u2192 toutes les lignes du cluster sont sign\u00e9es en bloc.

function PatternGroupsD3() {
  const PATTERNS = [
    {
      id: "p1",
      regex: "{MARQUE} {PRODUIT} {COND.} {POIDS}",
      sample: "PANZANI Coquillettes pqt 500g",
      count: 3127,
      conf: 96,
      brands: ["PANZANI", "BARILLA", "LU", "Lactel", "Pr\u00e9sident"],
      examples: [
        "PANZANI Coquillettes pqt 500g",
        "BARILLA Spaghetti pqt 500g",
        "LU Petit beurre pqt 200g",
        "Lactel UHT brique 1L",
        "Pr\u00e9sident Beurre doux plaq 250g",
      ],
      structure: [
        { fam: "brand",  v: "PANZANI" },
        { fam: "prod",   v: "Coquillettes" },
        { fam: "cond",   v: "pqt" },
        { fam: "weight", v: "500g" },
      ],
    },
    {
      id: "p2",
      regex: "{MARQUE} {PRODUIT} {LOT}\u00d7{POIDS}",
      sample: "Evian eau plate 6\u00d71.5L",
      count: 1842,
      conf: 94,
      brands: ["Evian", "CRISTALINE", "Volvic", "Coca-Cola", "Bonduelle"],
      examples: [
        "Evian eau plate 6\u00d71.5L",
        "CRISTALINE eau plate 6\u00d71.5L",
        "Volvic source 6\u00d71L",
        "Coca-Cola zero 4\u00d71.25L",
        "Bonduelle ma\u00efs doux 3\u00d7150g",
      ],
      structure: [
        { fam: "brand",  v: "Evian" },
        { fam: "prod",   v: "Eau min\u00e9rale plate" },
        { fam: "weight", v: "6 \u00d7 1,5L" },
      ],
    },
    {
      id: "p3",
      regex: "{PRODUIT} {MARQUE} {POIDS}",
      sample: "Spaghetti N\u00b05 500g BARILLA",
      count: 894,
      conf: 88,
      brands: ["BARILLA", "Carte Noire", "Bjorg"],
      examples: [
        "Spaghetti N\u00b05 500g BARILLA",
        "Caf\u00e9 grains arabica 1kg Carte Noire",
        "Muesli bio 750g Bjorg",
      ],
      structure: [
        { fam: "prod",   v: "Spaghetti n\u00b05" },
        { fam: "weight", v: "500g" },
        { fam: "brand",  v: "BARILLA" },
      ],
    },
    {
      id: "p4",
      regex: "{MARQUE} {PRODUIT} {VARIANTE} {POIDS} {ORIGINE}",
      sample: "Lou\u00e9 Filet poulet ferm 2\u00d7120g FR",
      count: 612,
      conf: 92,
      brands: ["Lou\u00e9", "Labeyrie", "Fleury Michon"],
      examples: [
        "Lou\u00e9 Filet poulet ferm 2\u00d7120g FR",
        "Labeyrie Saumon fum\u00e9 atl 4tr 120g",
        "Fleury Michon Jambon \u00e0 l'\u00e9touff\u00e9e 4tr 140g",
      ],
      structure: [
        { fam: "brand",   v: "Lou\u00e9" },
        { fam: "prod",    v: "Filet de poulet" },
        { fam: "variant", v: "fermier" },
        { fam: "weight",  v: "2 \u00d7 120g" },
        { fam: "origin",  v: "FR" },
      ],
    },
    {
      id: "p5",
      regex: "{PRODUIT} {POIDS} \u2014 marque non d\u00e9tect\u00e9e",
      sample: "yaourt nature 4x125",
      count: 287,
      conf: 54,
      brands: ["?", "?", "?"],
      examples: [
        "yaourt nature 4x125",
        "lait fraise 250ml x4",
        "biscuit choco 180g",
      ],
      structure: [
        { fam: "brand",  v: null },
        { fam: "prod",   v: "Yaourt nature" },
        { fam: "weight", v: "4 \u00d7 125g" },
      ],
    },
    {
      id: "p6",
      regex: "Format inconnu \u2014 r\u00e9vision manuelle",
      sample: "Filet poulet x6 Loue ferm grillade IGP",
      count: 143,
      conf: 38,
      brands: ["?"],
      examples: [
        "Filet poulet x6 Loue ferm grillade IGP",
        "ProMix \u00e9co 3+1 gratuit lot familial",
        "St Mich crepe dent c\u00b3 100g",
      ],
      structure: [],
    },
  ];

  const [activeId, setActiveId] = React.useState("p1");
  const [signed, setSigned] = React.useState({}); // pattern id -> 'y' | 'n'
  const [bulkSelected, setBulkSelected] = React.useState({ p1: true, p2: true, p4: true });

  const active = PATTERNS.find(p => p.id === activeId);

  const FAM = {
    brand:   { dot: "oklch(0.52 0.18 255)", soft: "oklch(0.94 0.05 255)", text: "oklch(0.34 0.16 255)", label: "MARQUE" },
    prod:    { dot: "oklch(0.45 0.04 250)", soft: "#fafbfc",              text: C_TOKENS.text,          label: "D\u00c9SIGNATION" },
    cond:    { dot: "oklch(0.52 0.14 295)", soft: "oklch(0.94 0.05 295)", text: "oklch(0.34 0.13 295)", label: "CONDIT." },
    weight:  { dot: "oklch(0.52 0.14 295)", soft: "oklch(0.94 0.05 295)", text: "oklch(0.34 0.13 295)", label: "POIDS" },
    variant: { dot: "oklch(0.52 0.13 165)", soft: "oklch(0.93 0.06 165)", text: "oklch(0.34 0.12 165)", label: "VARIANTE" },
    origin:  { dot: "oklch(0.52 0.13 165)", soft: "oklch(0.93 0.06 165)", text: "oklch(0.34 0.12 165)", label: "ORIGINE" },
  };

  function confColor(c) {
    if (c >= 90) return { fg: "oklch(0.42 0.16 155)", bg: "oklch(0.93 0.07 155)", dot: "oklch(0.55 0.16 155)" };
    if (c >= 75) return { fg: "oklch(0.4 0.14 65)",   bg: "oklch(0.94 0.08 75)",  dot: "oklch(0.62 0.17 65)" };
    return            { fg: "oklch(0.45 0.18 25)",    bg: "oklch(0.94 0.06 25)",  dot: "oklch(0.55 0.2 25)" };
  }

  const totalSelected = Object.entries(bulkSelected).filter(([_, v]) => v)
    .reduce((acc, [pid]) => acc + (PATTERNS.find(p => p.id === pid)?.count || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C_TOKENS.bg, fontFamily: C_TOKENS.font, color: C_TOKENS.text, fontSize: 12 }}>

      {/* Top bar */}
      <div style={{ height: 38, padding: "0 14px", background: C_TOKENS.headerBg, borderBottom: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: C_TOKENS.accent, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>P</div>
          <span style={{ fontWeight: 600 }}>Produit.ai</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 4px" }}>/</span>
          <span style={{ color: C_TOKENS.textMuted }}>Structuration par patterns</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 2px" }}>\u203a</span>
          <span style={{ fontWeight: 500 }}>6 905 libell\u00e9s \u00b7 6 patterns d\u00e9tect\u00e9s</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>v3.2 \u00b7 Mme Lef\u00e8vre</span>
      </div>

      {/* Banner */}
      <div style={{ padding: "10px 14px", background: "oklch(0.97 0.04 255)", borderBottom: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <I.sparkle size={14} style={{ color: C_TOKENS.accent }} />
        <div style={{ fontSize: 12.5 }}>
          <strong>Au lieu de d\u00e9cider 6 905 fois \u2014 d\u00e9cidez 6 fois.</strong>{" "}
          <span style={{ color: C_TOKENS.textMuted }}>L'IA a regroup\u00e9 les libell\u00e9s par structure d\u00e9tect\u00e9e. Validez un pattern, toutes les lignes du cluster sont sign\u00e9es.</span>
        </div>
      </div>

      {/* Main split: clusters list / detail */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)", overflow: "hidden" }}>

        {/* LEFT: clusters */}
        <div style={{ overflow: "auto", borderRight: `1px solid ${C_TOKENS.border}`, background: "#fff", padding: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4 }}>CLUSTERS D\u00c9TECT\u00c9S</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>
              tri\u00e9s par volume
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PATTERNS.map(p => {
              const c = confColor(p.conf);
              const isActive = p.id === activeId;
              const isSigned = signed[p.id];
              const checked = !!bulkSelected[p.id];
              return (
                <div key={p.id} onClick={() => setActiveId(p.id)}
                  style={{ border: `1px solid ${isActive ? C_TOKENS.accent : C_TOKENS.border}`, borderRadius: 4,
                    background: isActive ? C_TOKENS.accentSoft : "#fff", padding: "10px 12px", cursor: "pointer",
                    boxShadow: isActive ? `0 0 0 2px ${C_TOKENS.accent}22` : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="checkbox" checked={checked} onClick={e => e.stopPropagation()}
                      onChange={e => setBulkSelected(b => ({ ...b, [p.id]: e.target.checked }))} />
                    <span style={{ fontFamily: C_TOKENS.mono, fontSize: 11, color: C_TOKENS.textMuted }}>{p.id.toUpperCase()}</span>
                    <span style={{ flex: 1 }} />
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "1px 7px",
                      background: c.bg, color: c.fg, fontFamily: C_TOKENS.mono, fontWeight: 700, fontSize: 10.5, borderRadius: 2 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot }} />
                      {p.conf}%
                    </span>
                    {isSigned === "y" && <span style={{ fontSize: 10, fontWeight: 700, color: "oklch(0.42 0.16 155)", display: "inline-flex", alignItems: "center", gap: 3 }}><I.check size={11} /> sign\u00e9</span>}
                    {isSigned === "n" && <span style={{ fontSize: 10, fontWeight: 700, color: "oklch(0.5 0.2 25)" }}>rejet\u00e9</span>}
                  </div>

                  {/* regex pattern */}
                  <div style={{ fontFamily: C_TOKENS.mono, fontSize: 12, marginTop: 8, color: C_TOKENS.text }}>
                    {p.regex.split(/(\{[^}]+\})/).filter(Boolean).map((tok, i) => {
                      const m = tok.match(/^\{([^}]+)\}$/);
                      if (m) {
                        const famKey = ({ "MARQUE": "brand", "PRODUIT": "prod", "COND.": "cond", "POIDS": "weight", "LOT": "weight", "VARIANTE": "variant", "ORIGINE": "origin" })[m[1]] || "prod";
                        const f = FAM[famKey];
                        return <span key={i} style={{ background: f.soft, color: f.text, padding: "1px 5px", borderRadius: 2, border: `1px solid ${f.dot}`, fontWeight: 600, fontSize: 10.5 }}>{m[1]}</span>;
                      }
                      return <span key={i} style={{ color: C_TOKENS.textMuted }}>{tok}</span>;
                    })}
                  </div>

                  {/* sample + stats */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6, fontSize: 11 }}>
                    <span style={{ color: C_TOKENS.textSubtle, fontStyle: "italic", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      \u201c{p.sample}\u201d
                    </span>
                    <span style={{ fontFamily: C_TOKENS.mono, color: C_TOKENS.textMuted, fontWeight: 600 }}>
                      {p.count.toLocaleString("fr")} libell\u00e9s
                    </span>
                  </div>

                  {/* mini bar */}
                  <div style={{ marginTop: 6, display: "flex", gap: 1, height: 4, borderRadius: 2, overflow: "hidden" }}>
                    {p.brands.slice(0, 8).map((_, i) => (
                      <div key={i} style={{ flex: 1, background: `oklch(${0.55 + i * 0.03} 0.14 ${250 + i * 12})` }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: pattern detail */}
        <div style={{ overflow: "auto", background: C_TOKENS.bg, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          {active && (
            <>
              {/* header */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontFamily: C_TOKENS.mono, fontSize: 13, fontWeight: 700, color: C_TOKENS.text }}>{active.id.toUpperCase()}</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: C_TOKENS.text, fontVariantNumeric: "tabular-nums" }}>{active.count.toLocaleString("fr")}</span>
                <span style={{ fontSize: 13, color: C_TOKENS.textMuted }}>libell\u00e9s correspondant \u00e0 ce pattern</span>
                <div style={{ flex: 1 }} />
                {(() => {
                  const c = confColor(active.conf);
                  return (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px",
                      background: c.bg, color: c.fg, fontFamily: C_TOKENS.mono, fontWeight: 700, fontSize: 11.5, borderRadius: 3 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />
                      Confiance {active.conf}%
                    </span>
                  );
                })()}
              </div>

              {/* structure du pattern */}
              <div style={{ background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 4, padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4, marginBottom: 10 }}>STRUCTURE COMMUNE</div>
                {active.structure.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {active.structure.map((row, i) => {
                      const f = FAM[row.fam];
                      return (
                        <div key={i} style={{ display: "inline-flex", flexDirection: "column", padding: "6px 10px",
                          border: `1px solid ${row.v ? f.dot : C_TOKENS.border}`, borderRadius: 3,
                          background: row.v ? f.soft : "#fafbfc", minWidth: 90 }}>
                          <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4, color: f.text }}>{f.label}</span>
                          <span style={{ fontSize: 12.5, color: row.v ? f.text : C_TOKENS.textSubtle, fontWeight: 600,
                            fontStyle: row.v ? "normal" : "italic", marginTop: 2 }}>
                            {row.v || "non d\u00e9tect\u00e9"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ color: C_TOKENS.textMuted, fontStyle: "italic", fontSize: 12 }}>
                    Pas de structure commune \u2014 ce cluster regroupe des libell\u00e9s atypiques qui n\u00e9cessitent une revue manuelle.
                  </div>
                )}
              </div>

              {/* exemples */}
              <div style={{ background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ padding: "8px 14px", borderBottom: `1px solid ${C_TOKENS.border}`, background: C_TOKENS.headerBg, display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4 }}>\u00c9CHANTILLON ({active.examples.length} sur {active.count.toLocaleString("fr")})</span>
                  <div style={{ flex: 1 }} />
                  <button style={{ padding: "2px 8px", background: "transparent", border: "none", fontSize: 11, color: C_TOKENS.accentText, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
                    Voir tout \u2192
                  </button>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <tbody>
                    {active.examples.map((ex, i) => (
                      <tr key={i} style={{ background: i % 2 ? C_TOKENS.rowAlt : "#fff" }}>
                        <td style={{ padding: "6px 14px", fontFamily: C_TOKENS.mono, fontSize: 10.5, color: C_TOKENS.textSubtle, width: 90, borderBottom: i < active.examples.length - 1 ? `1px solid ${C_TOKENS.border}` : "none" }}>
                          EAN-{(3017620422003 + i * 37).toString().slice(-7)}
                        </td>
                        <td style={{ padding: "6px 14px", color: C_TOKENS.text, borderBottom: i < active.examples.length - 1 ? `1px solid ${C_TOKENS.border}` : "none" }}>
                          {ex}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* actions sur le pattern */}
              <div style={{ background: "oklch(0.97 0.04 250)", border: `1px solid ${C_TOKENS.accent}55`, borderRadius: 4, padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.accentText, letterSpacing: 0.4, marginBottom: 8 }}>ACTION SUR CE CLUSTER</div>
                <div style={{ fontSize: 12.5, marginBottom: 10, color: C_TOKENS.text }}>
                  Sur les <strong>{active.count.toLocaleString("fr")} libell\u00e9s</strong> de ce cluster :
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setSigned(s => ({ ...s, [active.id]: "y" }))}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px",
                      background: "oklch(0.5 0.16 155)", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 12.5 }}>
                    <I.check size={13} />
                    Valider la structure pour {active.count.toLocaleString("fr")} libell\u00e9s
                  </button>
                  <button onClick={() => setSigned(s => ({ ...s, [active.id]: "n" }))}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px",
                      background: "#fff", color: "oklch(0.5 0.2 25)", border: "1px solid oklch(0.5 0.2 25)", borderRadius: 3, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 12.5 }}>
                    <I.x size={13} />
                    Rejeter le pattern
                  </button>
                  <button style={{ padding: "7px 12px", background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, cursor: "pointer", fontFamily: "inherit", fontWeight: 500, fontSize: 12.5, color: C_TOKENS.text }}>
                    \u00c9diter la structure\u2026
                  </button>
                  <button style={{ padding: "7px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, color: C_TOKENS.textMuted }}>
                    Casser en sous-clusters
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom bulk action bar */}
      <div style={{ padding: "10px 18px", background: "#1c1f23", color: "#fff", borderTop: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: "#cdd0d4" }}>
          {Object.values(bulkSelected).filter(Boolean).length} clusters s\u00e9lectionn\u00e9s
        </span>
        <span style={{ fontFamily: C_TOKENS.mono, fontSize: 14, fontWeight: 700, color: "#fff" }}>
          {totalSelected.toLocaleString("fr")} libell\u00e9s
        </span>
        <span style={{ fontSize: 11, color: "oklch(0.7 0.06 250)" }}>seront sign\u00e9s en bloc</span>
        <div style={{ flex: 1 }} />
        <button style={{ padding: "6px 12px", background: "transparent", border: "1px solid #4a4e54", color: "#cdd0d4", borderRadius: 3, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
          Tout d\u00e9s\u00e9lectionner
        </button>
        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
          background: "oklch(0.55 0.16 155)", color: "#fff", border: "none", borderRadius: 3, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
          <I.check size={14} />
          Valider {totalSelected.toLocaleString("fr")} libell\u00e9s en bloc
        </button>
      </div>
    </div>
  );
}

window.PatternGroupsD3 = PatternGroupsD3;
