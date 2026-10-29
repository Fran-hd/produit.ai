// Variation D4 \u2014 Diff Review (batch signing)
// Avant / apr\u00e8s c\u00f4te \u00e0 c\u00f4te. Vue diff comme dans un code review.
// L'utilisateur \u00ab signe \u00bb un commit qui structure N libell\u00e9s en bloc.

function DiffReviewD4() {
  // Ligne = un libell\u00e9 brut + sa proposition structur\u00e9e
  const ROWS = [
    { id: 1, ean: "3017620422003", before: "PANZANI Coquillettes pqt 500g",
      after: { brand: "PANZANI", prod: "Coquillettes", cond: "paquet", weight: "500g", origin: null }, conf: 99, status: "auto" },
    { id: 2, ean: "8001505005707", before: "Spaghetti N\u00b05 500g BARILLA",
      after: { brand: "BARILLA", prod: "Spaghetti n\u00b05", cond: "paquet", weight: "500g", origin: "IT" }, conf: 96, status: "auto" },
    { id: 3, ean: "3175680011480", before: "CRISTALINE eau plate 6X1.5L",
      after: { brand: "CRISTALINE", prod: "Eau min\u00e9rale plate", cond: "pack", weight: "6 \u00d7 1,5L", origin: null }, conf: 98, status: "auto" },
    { id: 4, ean: "3228857000852", before: "Harrys baguette tradition fr 250g",
      after: { brand: "Harrys", prod: "Baguette tradition", cond: null, weight: "250g", origin: "FR" }, conf: 87, status: "review" },
    { id: 5, ean: "3560070976478", before: "Filet poulet ferm Lou\u00e9 2x120g",
      after: { brand: "Lou\u00e9", prod: "Filet de poulet fermier", cond: null, weight: "2 \u00d7 120g", origin: "FR" }, conf: 84, status: "review" },
    { id: 6, ean: "3245412000133", before: "La Laiti\u00e8re yaourt nat 4x125g",
      after: { brand: "La Laiti\u00e8re", prod: "Yaourt nature lait entier", cond: "pot", weight: "4 \u00d7 125g", origin: null }, conf: 92, status: "auto" },
    { id: 7, ean: "8076809513753", before: "MUTTI sauce tomate basilic 400g",
      after: { brand: "MUTTI", prod: "Sauce tomate basilic", cond: "bocal", weight: "400g", origin: "IT" }, conf: 99, status: "auto" },
    { id: 8, ean: "3033710065165", before: "Lactel \u00bd \u00e9cr\u00e9m\u00e9 UHT 6x1L",
      after: { brand: "Lactel", prod: "Lait demi-\u00e9cr\u00e9m\u00e9 UHT", cond: "pack", weight: "6 \u00d7 1L", origin: null }, conf: 95, status: "auto" },
    { id: 9, ean: "3017760123457", before: "Caf\u00e9 grains arabica 1kg carte noire",
      after: { brand: "Carte Noire", prod: "Caf\u00e9 en grains arabica", cond: "paquet", weight: "1 kg", origin: null }, conf: 73, status: "review" },
    { id: 10, ean: "3596710443215", before: "Saumon fum\u00e9 atlantique 4tr 120g labeyrie",
      after: { brand: "Labeyrie", prod: "Saumon fum\u00e9 Atlantique", cond: null, weight: "4 tr \u00b7 120g", origin: null }, conf: 84, status: "review" },
    { id: 11, ean: "3245412888777", before: "yaourt nature 4x125",
      after: { brand: null, prod: "Yaourt nature", cond: "pot", weight: "4 \u00d7 125g", origin: null }, conf: 54, status: "manual" },
    { id: 12, ean: "8000500310427", before: "Nutella p\u00e2te \u00e0 tartiner 750g",
      after: { brand: "NUTELLA", prod: "P\u00e2te \u00e0 tartiner", cond: "pot", weight: "750g", origin: "IT" }, conf: 99, status: "auto" },
    { id: 13, ean: "3270570012345", before: "Ferrero rocher 200g x16",
      after: { brand: "Ferrero", prod: "Rocher", cond: "bo\u00eete", weight: "200g \u00b7 16p", origin: null }, conf: 78, status: "review" },
    { id: 14, ean: "3068320105017", before: "Evian eau plate 6x1.5L",
      after: { brand: "Evian", prod: "Eau min\u00e9rale plate", cond: "pack", weight: "6 \u00d7 1,5L", origin: "FR" }, conf: 98, status: "auto" },
    { id: 15, ean: "3245391105030", before: "President beurre doux 250g",
      after: { brand: "Pr\u00e9sident", prod: "Beurre doux", cond: "plaquette", weight: "250g", origin: "FR" }, conf: 96, status: "auto" },
  ];

  const [selected, setSelected] = React.useState(() => {
    const s = {};
    ROWS.forEach(r => { s[r.id] = r.status === "auto"; });
    return s;
  });
  const [expandedId, setExpandedId] = React.useState(7);

  const FAM = {
    brand:  { dot: "oklch(0.52 0.18 255)", soft: "oklch(0.94 0.05 255)", text: "oklch(0.34 0.16 255)", label: "MARQUE" },
    prod:   { dot: "oklch(0.45 0.04 250)", soft: "#fafbfc",              text: C_TOKENS.text,          label: "D\u00c9SIGNATION" },
    cond:   { dot: "oklch(0.52 0.14 295)", soft: "oklch(0.94 0.05 295)", text: "oklch(0.34 0.13 295)", label: "CONDIT." },
    weight: { dot: "oklch(0.52 0.14 295)", soft: "oklch(0.94 0.05 295)", text: "oklch(0.34 0.13 295)", label: "POIDS" },
    origin: { dot: "oklch(0.52 0.13 165)", soft: "oklch(0.93 0.06 165)", text: "oklch(0.34 0.12 165)", label: "ORIGINE" },
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  function statusPill(status) {
    if (status === "auto") return { bg: "oklch(0.93 0.07 155)", fg: "oklch(0.42 0.16 155)", dot: "oklch(0.55 0.16 155)", label: "AUTO" };
    if (status === "review") return { bg: "oklch(0.94 0.08 75)", fg: "oklch(0.4 0.14 65)", dot: "oklch(0.62 0.17 65)", label: "REVUE" };
    return { bg: "oklch(0.94 0.06 25)", fg: "oklch(0.45 0.18 25)", dot: "oklch(0.55 0.2 25)", label: "MANUEL" };
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C_TOKENS.bg, fontFamily: C_TOKENS.font, color: C_TOKENS.text, fontSize: 12 }}>

      {/* Top bar */}
      <div style={{ height: 38, padding: "0 14px", background: C_TOKENS.headerBg, borderBottom: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: C_TOKENS.accent, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>P</div>
          <span style={{ fontWeight: 600 }}>Produit.ai</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 4px" }}>/</span>
          <span style={{ color: C_TOKENS.textMuted }}>Diff review</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 2px" }}>\u203a</span>
          <span style={{ fontWeight: 500 }}>Batch #2847 \u00b7 15 libell\u00e9s</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>analyse termin\u00e9e \u00b7 il y a 8s</span>
        <button style={{ padding: "4px 10px", background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit" }}>Tout d\u00e9plier</button>
      </div>

      {/* Subbar : commit message style */}
      <div style={{ padding: "12px 18px", background: "#fff", borderBottom: `1px solid ${C_TOKENS.border}`, display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <I.history size={16} style={{ color: C_TOKENS.textMuted }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C_TOKENS.text }}>Structuration automatique \u2014 import CSV "fournisseur_metro_2025-04-27.csv"</div>
          <div style={{ fontSize: 11, color: C_TOKENS.textMuted, marginTop: 2, fontFamily: C_TOKENS.mono }}>
            +15 \u22120 \u00b7 15 libell\u00e9s analys\u00e9s \u00b7 9 auto-validables \u00b7 5 \u00e0 r\u00e9viser \u00b7 1 manuel
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {[
            { label: "Auto", count: 9, color: "oklch(0.55 0.16 155)" },
            { label: "Revue", count: 5, color: "oklch(0.62 0.17 65)" },
            { label: "Manuel", count: 1, color: "oklch(0.55 0.2 25)" },
          ].map((s, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px",
              background: "#fff", border: `1px solid ${s.color}55`, borderRadius: 3, fontSize: 11.5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
              {s.label}
              <strong style={{ fontFamily: C_TOKENS.mono, color: s.color }}>{s.count}</strong>
            </span>
          ))}
        </div>
      </div>

      {/* Diff list */}
      <div style={{ flex: 1, overflow: "auto", background: C_TOKENS.bg }}>
        <div style={{ padding: "0 0 60px 0" }}>
          {ROWS.map((r, idx) => {
            const isExpanded = r.id === expandedId;
            const isSelected = !!selected[r.id];
            const sp = statusPill(r.status);
            return (
              <div key={r.id} style={{ borderBottom: `1px solid ${C_TOKENS.border}`, background: isExpanded ? "#fff" : "transparent" }}>
                {/* Header row */}
                <div onClick={() => setExpandedId(isExpanded ? null : r.id)}
                  style={{ display: "grid", gridTemplateColumns: "32px 28px 80px 70px 1fr 130px 32px",
                    alignItems: "center", padding: "8px 14px", gap: 10, cursor: "pointer",
                    background: isExpanded ? C_TOKENS.headerBg : (idx % 2 ? C_TOKENS.rowAlt : "#fff"),
                    borderLeft: isSelected ? `3px solid ${C_TOKENS.accent}` : "3px solid transparent" }}>
                  <input type="checkbox" checked={isSelected} onClick={e => e.stopPropagation()}
                    onChange={e => setSelected(s => ({ ...s, [r.id]: e.target.checked }))} />
                  <I.chevronRight size={11} style={{ color: C_TOKENS.textSubtle, transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.1s" }} />
                  <span style={{ fontFamily: C_TOKENS.mono, fontSize: 10.5, color: C_TOKENS.textSubtle }}>{r.ean.slice(-7)}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "1px 7px",
                    background: sp.bg, color: sp.fg, fontFamily: C_TOKENS.mono, fontWeight: 700, fontSize: 10, borderRadius: 2, justifySelf: "start" }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: sp.dot }} />
                    {sp.label}
                  </span>
                  <span style={{ fontSize: 12, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.before}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: C_TOKENS.textMuted, justifySelf: "end" }}>
                    confiance{" "}
                    <strong style={{ fontFamily: C_TOKENS.mono,
                      color: r.conf >= 95 ? "oklch(0.42 0.16 155)" : r.conf >= 80 ? "oklch(0.4 0.14 65)" : "oklch(0.45 0.18 25)" }}>
                      {r.conf}%
                    </strong>
                  </span>
                  <button style={{ width: 22, height: 22, border: "none", background: "transparent", cursor: "pointer", color: C_TOKENS.textSubtle, display: "grid", placeItems: "center", borderRadius: 3, justifySelf: "center" }}>
                    <I.more size={13} />
                  </button>
                </div>

                {/* Expanded diff */}
                {isExpanded && (
                  <div style={{ padding: "0 14px 14px 14px", background: "#fff" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 12px 1fr", gap: 8 }}>
                      {/* Before pane */}
                      <div style={{ border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, overflow: "hidden", background: "oklch(0.97 0.04 25)" }}>
                        <div style={{ padding: "5px 10px", background: "oklch(0.94 0.06 25)", borderBottom: `1px solid ${C_TOKENS.border}`,
                          fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4, color: "oklch(0.4 0.16 25)" }}>
                          \u2212 LIBELL\u00c9 BRUT (non structur\u00e9)
                        </div>
                        <div style={{ padding: "12px 14px", fontFamily: C_TOKENS.mono, fontSize: 13, color: C_TOKENS.text }}>
                          {r.before}
                        </div>
                        <div style={{ padding: "8px 14px", borderTop: `1px solid ${C_TOKENS.border}`, fontSize: 10.5, color: C_TOKENS.textMuted }}>
                          aucune variable extraite \u00b7 lecture brute uniquement
                        </div>
                      </div>

                      {/* Arrow column */}
                      <div style={{ display: "grid", placeItems: "center", color: C_TOKENS.textSubtle }}>
                        <I.chevronRight size={16} />
                      </div>

                      {/* After pane */}
                      <div style={{ border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, overflow: "hidden", background: "oklch(0.97 0.05 155)" }}>
                        <div style={{ padding: "5px 10px", background: "oklch(0.93 0.07 155)", borderBottom: `1px solid ${C_TOKENS.border}`,
                          fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4, color: "oklch(0.36 0.14 155)", display: "flex", alignItems: "center" }}>
                          + STRUCTURE PROPOS\u00c9E
                          <div style={{ flex: 1 }} />
                          <span style={{ fontFamily: C_TOKENS.mono, color: "oklch(0.42 0.16 155)" }}>{r.conf}%</span>
                        </div>
                        <div style={{ padding: "10px 14px", display: "grid", gridTemplateColumns: "100px 1fr", rowGap: 5, columnGap: 10, alignItems: "center", fontSize: 12 }}>
                          {[
                            { fam: "brand",  v: r.after.brand },
                            { fam: "prod",   v: r.after.prod },
                            { fam: "cond",   v: r.after.cond },
                            { fam: "weight", v: r.after.weight },
                            { fam: "origin", v: r.after.origin },
                          ].map((row, i) => {
                            const f = FAM[row.fam];
                            return (
                              <React.Fragment key={i}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, color: f.text, fontWeight: 700, letterSpacing: 0.4 }}>
                                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: f.dot }} />
                                  {f.label}
                                </span>
                                <span style={{ fontFamily: C_TOKENS.mono, fontSize: 12, color: row.v ? f.text : C_TOKENS.textSubtle, fontStyle: row.v ? "normal" : "italic", fontWeight: row.v ? 600 : 400 }}>
                                  {row.v || "\u2205 non d\u00e9tect\u00e9"}
                                </span>
                              </React.Fragment>
                            );
                          })}
                        </div>
                        <div style={{ padding: "8px 14px", borderTop: `1px solid ${C_TOKENS.border}`, fontSize: 10.5, color: C_TOKENS.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
                          <I.sparkle size={11} style={{ color: C_TOKENS.accent }} />
                          {Object.values(r.after).filter(Boolean).length} variables extraites \u00b7 g\u00e9n\u00e9rera 4 libell\u00e9s par canal
                        </div>
                      </div>
                    </div>

                    {/* Inline actions */}
                    <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
                      <button style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px",
                        background: "oklch(0.93 0.07 155)", color: "oklch(0.42 0.16 155)", border: "1px solid oklch(0.55 0.16 155)", borderRadius: 3, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                        <I.check size={11} /> Accepter
                      </button>
                      <button style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px",
                        background: "#fff", color: C_TOKENS.text, border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit" }}>
                        <I.edit size={11} /> Modifier
                      </button>
                      <button style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px",
                        background: "#fff", color: "oklch(0.5 0.2 25)", border: "1px solid oklch(0.5 0.2 25)", borderRadius: 3, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit" }}>
                        <I.x size={11} /> Rejeter
                      </button>
                      <div style={{ flex: 1 }} />
                      <span style={{ fontSize: 10.5, color: C_TOKENS.textSubtle, fontFamily: C_TOKENS.mono }}>
                        sources : Marques (1247), Conditionnement (39 contractures), R\u00e8gle poids #4
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom commit bar */}
      <div style={{ padding: "12px 18px", background: "#1c1f23", color: "#fff",
        display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <input type="checkbox" checked={selectedCount === ROWS.length}
          onChange={e => setSelected(Object.fromEntries(ROWS.map(r => [r.id, e.target.checked])))}
          style={{ accentColor: "#fff" }} />
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>
            {selectedCount} / {ROWS.length} libell\u00e9s s\u00e9lectionn\u00e9s
          </div>
          <div style={{ fontSize: 10.5, color: "oklch(0.7 0.05 250)", marginTop: 1 }}>
            seront sign\u00e9s comme batch #2847 par Mme Lef\u00e8vre
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <input placeholder="Message du commit (optionnel)\u2026" defaultValue="Import M\u00e9tro avril 2025"
          style={{ padding: "6px 10px", background: "#2a2e34", border: "1px solid #3a3e44", color: "#fff",
            borderRadius: 3, fontSize: 11.5, width: 240, fontFamily: "inherit", outline: "none" }} />
        <button style={{ padding: "6px 10px", background: "transparent", border: "1px solid #4a4e54", color: "#cdd0d4", borderRadius: 3, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit" }}>
          Annuler
        </button>
        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px",
          background: "oklch(0.55 0.16 155)", color: "#fff", border: "none", borderRadius: 3, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
          <I.check size={14} />
          Signer le batch ({selectedCount})
        </button>
      </div>
    </div>
  );
}

window.DiffReviewD4 = DiffReviewD4;
