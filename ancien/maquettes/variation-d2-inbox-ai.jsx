// Variation D2 — Inbox AI : file de propositions IA triées par confiance.
// Clavier-first (J/K/Y/N/U), sweep par seuil de confiance, auto-validation > 95%.

function LabelInboxAI() {
  // 60+ libellés simulés avec leurs propositions de structuration.
  const SEED = [
    { ean: "3017620422003", raw: "PANZANI Coquillettes pqt 500g",                conf: 99, brand: "PANZANI",     prod: "Coquillettes",            cond: "paquet", weight: "500g",     origin: null, conserv: "ambiant" },
    { ean: "3228857000852", raw: "Harrys baguette tradition fr 250g",             conf: 97, brand: "Harrys",      prod: "Baguette",                cond: null,     weight: "250g",     origin: "FR", qualif: "tradition", conserv: "frais" },
    { ean: "3175680011480", raw: "CRISTALINE eau plate 6X1.5L",                   conf: 98, brand: "CRISTALINE",  prod: "Eau minérale plate",      cond: "pack",   weight: "9L",       origin: null, qty: "×6", unitformat: "1,5L", conserv: "ambiant" },
    { ean: "3560070976478", raw: "Filet poulet ferm Loué 2x120g",                 conf: 88, brand: "Loué",        prod: "Filet de poulet",         cond: "barquette", weight: "240g", origin: "FR", qualif: "fermier", qty: "×2", unitformat: "120g", conserv: "frais" },
    { ean: "8001505005707", raw: "Spaghetti N°5 500g BARILLA",                    conf: 96, brand: "BARILLA",     prod: "Spaghetti",               cond: "paquet", weight: "500g",     origin: "IT", variety: "n°5", conserv: "ambiant" },
    { ean: "3245412000133", raw: "La Laitière yaourt nat 4x125g",                 conf: 92, brand: "La Laitière", prod: "Yaourt nature lait entier", cond: "pot",  weight: "500g",    origin: null, qty: "×4", unitformat: "125g", conserv: "frais" },
    { ean: "3017760123457", raw: "Café grains arabica 1kg carte noire",           conf: 73, brand: "Carte Noire", prod: "Café arabica",            cond: "paquet", weight: "1 kg",     origin: null, texture: "en grains", conserv: "ambiant" },
    { ean: "3596710443215", raw: "Saumon fumé atlantique 4tr 120g labeyrie",      conf: 84, brand: "Labeyrie",    prod: "Saumon fumé Atlantique",  cond: "barquette", weight: "120g", origin: null, qty: "×4 tr", conserv: "frais" },
    { ean: "8076809513753", raw: "MUTTI sauce tomate basilic 400g",               conf: 99, brand: "MUTTI",       prod: "Sauce tomate basilic",    cond: "bocal",  weight: "400g",     origin: "IT", flavor: "basilic", conserv: "ambiant" },
    { ean: "3033710065165", raw: "Lactel ½ écrémé UHT 6x1L",                       conf: 95, brand: "Lactel",      prod: "Lait demi-écrémé UHT",    cond: "pack",   weight: "6L",       origin: null, qty: "×6", unitformat: "1L", conserv: "ambiant" },
    { ean: "7622210449283", raw: "Lu petit beurre 200g",                          conf: 94, brand: "LU",          prod: "Petit beurre",            cond: "paquet", weight: "200g",     origin: null, conserv: "ambiant" },
    { ean: "3110210132207", raw: "Bonduelle maïs doux 3x150g",                    conf: 91, brand: "Bonduelle",   prod: "Maïs doux",               cond: "lot",    weight: "450g",     origin: null, qty: "×3", unitformat: "150g", conserv: "ambiant" },
    { ean: "3068320105017", raw: "Evian eau plate 6x1.5L",                        conf: 98, brand: "Evian",       prod: "Eau minérale plate",      cond: "pack",   weight: "9L",       origin: "FR", qty: "×6", unitformat: "1,5L", conserv: "ambiant" },
    { ean: "3270190022001", raw: "Coca cola zero 1.25L",                          conf: 97, brand: "Coca-Cola",   prod: "Coca Zero",               cond: "bouteille", weight: "1,25L", origin: null, claim: "zéro sucre", conserv: "ambiant" },
    { ean: "3245391105030", raw: "President beurre doux 250g",                    conf: 96, brand: "Président",   prod: "Beurre",                  cond: "plaquette", weight: "250g", origin: "FR", qualif: "doux", conserv: "frais" },
    { ean: "3270570012345", raw: "Ferrero rocher 200g x16",                       conf: 78, brand: "Ferrero",     prod: "Rocher",                  cond: "boîte", weight: "200g",      origin: null, qty: "×16", conserv: "ambiant" },
    { ean: "8000500310427", raw: "Nutella pâte à tartiner 750g",                  conf: 99, brand: "NUTELLA",     prod: "Pâte à tartiner",         cond: "pot",   weight: "750g",     origin: "IT", flavor: "noisette", conserv: "ambiant" },
    { ean: "3017620425035", raw: "Panzani penne rigate 500g",                     conf: 98, brand: "PANZANI",     prod: "Penne",                   cond: "paquet", weight: "500g",     origin: "IT", variety: "rigate", conserv: "ambiant" },
    { ean: "3245412000234", raw: "Lait fraise candy nesquik 250ml x4",            conf: 62, brand: null,          prod: "Boisson lactée",          cond: null,    weight: "1L",       origin: null, qty: "×4", unitformat: "250ml", flavor: "fraise" },
    { ean: "3760127290117", raw: "Bjorg muesli bio 750g",                         conf: 94, brand: "Bjorg",       prod: "Muesli",                  cond: "paquet", weight: "750g",     origin: null, qualif: "bio", label: "Bio EU", conserv: "ambiant" },
    { ean: "3596710443998", raw: "St Mich crepe dentelle 100g",                   conf: 71, brand: null,          prod: "Crêpe dentelle",          cond: "paquet", weight: "100g",     origin: null, conserv: "ambiant" },
    { ean: "8480000176349", raw: "BONDUELLE haricots verts extra fins 220g bocal",conf: 95, brand: "Bonduelle",   prod: "Haricots verts",          cond: "bocal", weight: "220g",      origin: null, qualif: "extra-fins", conserv: "ambiant" },
    { ean: "3068320105024", raw: "Evian 1.5L",                                    conf: 91, brand: "Evian",       prod: "Eau minérale plate",      cond: "bouteille", weight: "1,5L", origin: null, conserv: "ambiant" },
    { ean: "3245412888777", raw: "yaourt nature 4x125",                           conf: 54, brand: null,          prod: "Yaourt nature",           cond: "pot",    weight: "500g",     origin: null, qty: "×4", unitformat: "125g", conserv: "frais" },
    { ean: "3033710066662", raw: "Lactel chocolat 1L",                            conf: 88, brand: "Lactel",      prod: "Lait chocolaté",          cond: "brique", weight: "1L",       origin: null, flavor: "chocolat", conserv: "ambiant" },
  ];
  // Densify: duplicate to ~60+ rows
  const ALL = React.useMemo(() => {
    const out = [];
    for (let i = 0; i < 3; i++) SEED.forEach((s, j) => out.push({ ...s, ean: s.ean.slice(0, -2) + String(10 + i * SEED.length + j).padStart(2, "0"), id: `${i}-${j}` }));
    return out;
  }, []);

  const [filter, setFilter] = React.useState("review"); // review | low | high | all
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [decisions, setDecisions] = React.useState({}); // id -> 'y' | 'n' | 'u'
  const [structView, setStructView] = React.useState("found"); // all | found | missing
  const [collapsedFams, setCollapsedFams] = React.useState({});

  const filtered = React.useMemo(() => {
    return ALL.filter(r => {
      const d = decisions[r.id];
      if (d === "y" || d === "n") return false;
      if (filter === "review") return r.conf < 95;
      if (filter === "low") return r.conf < 80;
      if (filter === "high") return r.conf >= 95;
      return true;
    });
  }, [ALL, filter, decisions]);

  const current = filtered[activeIdx];

  React.useEffect(() => {
    function onKey(e) {
      if (!current) return;
      if (e.key === "j" || e.key === "ArrowDown") { setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); e.preventDefault(); }
      else if (e.key === "k" || e.key === "ArrowUp") { setActiveIdx(i => Math.max(i - 1, 0)); e.preventDefault(); }
      else if (e.key === "y") { setDecisions(d => ({ ...d, [current.id]: "y" })); }
      else if (e.key === "n") { setDecisions(d => ({ ...d, [current.id]: "n" })); }
      else if (e.key === "u") { setDecisions(d => ({ ...d, [current.id]: "u" })); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, filtered.length]);

  const stats = {
    total: ALL.length,
    auto: ALL.filter(r => r.conf >= 95).length,
    review: ALL.filter(r => r.conf >= 80 && r.conf < 95).length,
    low: ALL.filter(r => r.conf < 80).length,
    decided: Object.keys(decisions).length,
  };

  const FAM = {
    identite:   { dot: "oklch(0.52 0.18 255)", soft: "oklch(0.94 0.05 255)", text: "oklch(0.34 0.16 255)", label: "Identité" },
    qualif:     { dot: "oklch(0.55 0.16 35)",  soft: "oklch(0.95 0.05 35)",  text: "oklch(0.38 0.15 35)",  label: "Qualifiant" },
    emballage:  { dot: "oklch(0.52 0.14 295)", soft: "oklch(0.94 0.05 295)", text: "oklch(0.34 0.13 295)", label: "Emballage" },
    caract:     { dot: "oklch(0.52 0.13 165)", soft: "oklch(0.93 0.06 165)", text: "oklch(0.34 0.12 165)", label: "Caractéristiques" },
    service:    { dot: "oklch(0.45 0.04 250)", soft: "#f1f3f5",              text: C_TOKENS.text,          label: "Service" },
  };

  // 15 segments structurés en 5 familles, alignés sur l'éditeur D
  const SEGMENTS = [
    // Identité
    { key: "brand",       fam: "identite",  label: "Marque",          help: "ex : PANZANI, NUTELLA" },
    { key: "prod",        fam: "identite",  label: "Désignation",     help: "ex : Spaghetti, Yaourt" },
    { key: "submark",     fam: "identite",  label: "Sous-marque",     help: "ex : Le Bistrot, Matin Léger" },
    { key: "variety",     fam: "identite",  label: "N° de variété",   help: "ex : n°5, rigate" },
    // Qualifiant
    { key: "qualif",      fam: "qualif",    label: "Qualifiant",      help: "ex : fermier, bio, plein air" },
    { key: "label",       fam: "qualif",    label: "Label / Certif.", help: "ex : AOP, Label Rouge, MSC" },
    { key: "claim",       fam: "qualif",    label: "Allégation",      help: "ex : sans sucre, allégé" },
    // Emballage
    { key: "cond",        fam: "emballage", label: "Conditionnement", help: "ex : paquet, bocal, pot" },
    { key: "weight",      fam: "emballage", label: "Poids / Volume",  help: "ex : 500g, 1,5L" },
    { key: "qty",         fam: "emballage", label: "Quantité pièces", help: "ex : ×4, lot de 6" },
    { key: "unitformat",  fam: "emballage", label: "Format unitaire", help: "ex : 4 × 125g" },
    // Caractéristiques
    { key: "origin",      fam: "caract",    label: "Origine",         help: "ex : France, UE, Italie" },
    { key: "flavor",      fam: "caract",    label: "Saveur / Parfum", help: "ex : chocolat, vanille" },
    { key: "texture",     fam: "caract",    label: "Texture / forme", help: "ex : moulu, en grains" },
    // Service
    { key: "conserv",     fam: "service",   label: "Conservation",    help: "ex : frais, surgelé, ambiant" },
  ];

  function confColor(c) {
    if (c >= 95) return { fg: "oklch(0.42 0.16 155)", bg: "oklch(0.93 0.07 155)", dot: "oklch(0.55 0.16 155)" };
    if (c >= 80) return { fg: "oklch(0.4 0.14 65)",   bg: "oklch(0.94 0.08 75)",  dot: "oklch(0.62 0.17 65)" };
    return            { fg: "oklch(0.45 0.18 25)",    bg: "oklch(0.94 0.06 25)",  dot: "oklch(0.55 0.2 25)" };
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
          <span style={{ color: C_TOKENS.textMuted }}>Inbox structuration</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 2px" }}>›</span>
          <span style={{ fontWeight: 500 }}>400 218 libellés</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>{stats.decided} décisions · auto-save</span>
        <button style={{ padding: "4px 10px", background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit" }}>Paramètres IA</button>
        <button style={{ padding: "4px 10px", background: C_TOKENS.accent, color: "#fff", border: "none", borderRadius: 3, fontSize: 11.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Auto-valider 247 982</button>
      </div>

      {/* Stats strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", borderBottom: `1px solid ${C_TOKENS.border}`, background: "#fff", flexShrink: 0 }}>
        {[
          { label: "Total", val: stats.total.toLocaleString("fr"), sub: "libellés importés", fg: C_TOKENS.text },
          { label: "Auto-validables", val: "247 982", sub: "confiance ≥ 95%", fg: "oklch(0.42 0.16 155)" },
          { label: "À réviser", val: "118 549", sub: "80–94%", fg: "oklch(0.45 0.16 65)" },
          { label: "Faible confiance", val: "33 687", sub: "< 80% — attention", fg: "oklch(0.5 0.2 25)" },
          { label: "Traités aujourd'hui", val: stats.decided.toString(), sub: "par Mme Lefèvre", fg: C_TOKENS.accentText },
        ].map((s, i) => (
          <div key={i} style={{ padding: "10px 14px", borderRight: i < 4 ? `1px solid ${C_TOKENS.border}` : "none" }}>
            <div style={{ fontSize: 10, color: C_TOKENS.textMuted, fontWeight: 700, letterSpacing: 0.4 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: s.fg, fontVariantNumeric: "tabular-nums", lineHeight: 1.1, marginTop: 2 }}>{s.val}</div>
            <div style={{ fontSize: 10.5, color: C_TOKENS.textSubtle, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", background: "#fff", borderBottom: `1px solid ${C_TOKENS.border}`, flexShrink: 0 }}>
        {[
          { id: "review", label: "À réviser", count: 118549, dot: "oklch(0.62 0.17 65)" },
          { id: "low", label: "Faible confiance", count: 33687, dot: "oklch(0.55 0.2 25)" },
          { id: "high", label: "Auto (≥ 95%)", count: 247982, dot: "oklch(0.55 0.16 155)" },
          { id: "all", label: "Toutes", count: stats.total, dot: C_TOKENS.textSubtle },
        ].map(t => (
          <button key={t.id} onClick={() => { setFilter(t.id); setActiveIdx(0); }}
            style={{ padding: "5px 10px", background: filter === t.id ? C_TOKENS.accentSoft : "transparent",
              color: filter === t.id ? C_TOKENS.accentText : C_TOKENS.text,
              border: filter === t.id ? `1px solid ${C_TOKENS.accent}` : `1px solid transparent`,
              borderRadius: 3, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit", fontWeight: filter === t.id ? 600 : 500,
              display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.dot }} />
            {t.label}
            <span style={{ color: C_TOKENS.textMuted, fontSize: 10.5, fontFamily: C_TOKENS.mono, marginLeft: 2 }}>{t.count.toLocaleString("fr")}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10.5, color: C_TOKENS.textSubtle, fontFamily: C_TOKENS.mono }}>{filtered.length} en file</span>
      </div>

      {/* Main split */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)", overflow: "hidden" }}>

        {/* LEFT: list */}
        <div style={{ overflow: "auto", borderRight: `1px solid ${C_TOKENS.border}`, background: "#fff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 38 }} />
              <col style={{ width: 50 }} />
              <col style={{ width: 110 }} />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th style={thBC()}>#</th>
                <th style={thBC()}>Conf.</th>
                <th style={thBC()}>EAN</th>
                <th style={thBC()}>Libellé brut → proposé</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const c = confColor(r.conf);
                const isActive = i === activeIdx;
                const dec = decisions[r.id];
                return (
                  <tr key={r.id} onClick={() => setActiveIdx(i)}
                    style={{ background: isActive ? C_TOKENS.accentSoft : (i % 2 ? C_TOKENS.rowAlt : "#fff"),
                      borderLeft: isActive ? `3px solid ${C_TOKENS.accent}` : "3px solid transparent",
                      cursor: "pointer" }}>
                    <td style={{ ...tdBC(), fontFamily: C_TOKENS.mono, color: C_TOKENS.textSubtle, fontSize: 10.5 }}>{i + 1}</td>
                    <td style={{ ...tdBC(), padding: "3px 6px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "1px 6px",
                        background: c.bg, color: c.fg, fontFamily: C_TOKENS.mono, fontWeight: 700, fontSize: 10.5, borderRadius: 2 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: c.dot }} />
                        {r.conf}
                      </span>
                    </td>
                    <td style={{ ...tdBC(), fontFamily: C_TOKENS.mono, fontSize: 10.5, color: C_TOKENS.textMuted }}>{r.ean}</td>
                    <td style={{ ...tdBC(), padding: "3px 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <span style={{ color: C_TOKENS.textMuted }}>{r.raw}</span>
                      <span style={{ color: C_TOKENS.textSubtle, margin: "0 6px" }}>→</span>
                      {r.brand && <span style={{ color: FAM.identite.text, fontWeight: 600 }}>{r.brand}</span>}
                      {r.prod && <span> {r.prod}</span>}
                      {r.weight && <span style={{ color: FAM.emballage.text, fontWeight: 600 }}> {r.weight}</span>}
                      {dec && (
                        <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700,
                          color: dec === "y" ? "oklch(0.42 0.16 155)" : dec === "n" ? "oklch(0.5 0.2 25)" : C_TOKENS.textMuted }}>
                          • {dec === "y" ? "validé" : dec === "n" ? "rejeté" : "reporté"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* RIGHT: focused detail */}
        <div style={{ overflow: "auto", background: C_TOKENS.bg, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          {current ? (
            <>
              {/* header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontFamily: C_TOKENS.mono, fontSize: 11, color: C_TOKENS.textMuted }}>
                  {activeIdx + 1} / {filtered.length}
                </div>
                <div style={{ fontFamily: C_TOKENS.mono, fontSize: 11, color: C_TOKENS.textMuted }}>EAN-{current.ean}</div>
                <div style={{ flex: 1 }} />
                {(() => {
                  const c = confColor(current.conf);
                  return (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px",
                      background: c.bg, color: c.fg, fontFamily: C_TOKENS.mono, fontWeight: 700, fontSize: 11, borderRadius: 3 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />
                      Confiance {current.conf}%
                    </span>
                  );
                })()}
              </div>

              {/* before / after */}
              <div style={{ background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C_TOKENS.border}`, background: C_TOKENS.headerBg }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4 }}>LIBELLÉ BRUT</div>
                  <div style={{ fontSize: 14, color: C_TOKENS.text, marginTop: 2, fontFamily: C_TOKENS.mono }}>{current.raw}</div>
                </div>
                <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C_TOKENS.border}`, background: C_TOKENS.headerBg, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4, flex: 1 }}>STRUCTURE PROPOSÉE</div>
                  <div style={{ display: "inline-flex", border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, overflow: "hidden", background: "#fff" }}>
                    {[
                      { id: "all", label: "Tout" },
                      { id: "found", label: "Détectés" },
                      { id: "missing", label: "Manquants" },
                    ].map((m, idx) => (
                      <button key={m.id} onClick={() => setStructView(m.id)}
                        style={{ padding: "3px 8px",
                          background: structView === m.id ? C_TOKENS.accentSoft : "#fff",
                          color: structView === m.id ? C_TOKENS.accentText : C_TOKENS.textMuted,
                          fontWeight: structView === m.id ? 600 : 400,
                          fontSize: 10.5, border: "none",
                          borderLeft: idx > 0 ? `1px solid ${C_TOKENS.border}` : "none",
                          cursor: "pointer", fontFamily: "inherit" }}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {(() => {
                    // Group segments by family
                    const byFam = {};
                    SEGMENTS.forEach(s => {
                      (byFam[s.fam] = byFam[s.fam] || []).push(s);
                    });
                    const famOrder = ["identite", "qualif", "emballage", "caract", "service"];
                    return famOrder.map(famKey => {
                      const segs = byFam[famKey] || [];
                      const visible = segs.filter(s => {
                        const v = current[s.key];
                        if (structView === "found") return !!v;
                        if (structView === "missing") return !v;
                        return true;
                      });
                      if (visible.length === 0) return null;
                      const f = FAM[famKey];
                      const filled = segs.filter(s => current[s.key]).length;
                      const total = segs.length;
                      const collapsed = collapsedFams[famKey];
                      return (
                        <div key={famKey} style={{ marginBottom: 4 }}>
                          <button onClick={() => setCollapsedFams(c => ({ ...c, [famKey]: !c[famKey] }))}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
                              background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit",
                              borderTop: `1px solid ${C_TOKENS.border}` }}>
                            <I.chevronRight size={10} style={{ color: C_TOKENS.textMuted, transform: collapsed ? "rotate(0deg)" : "rotate(90deg)", transition: "transform 0.1s" }} />
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: f.dot, flexShrink: 0 }} />
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: f.text, letterSpacing: 0.3, textTransform: "uppercase", flex: 1, textAlign: "left" }}>{f.label}</span>
                            <span style={{ fontSize: 10, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>{filled}/{total}</span>
                            <span style={{ display: "inline-flex", gap: 2 }}>
                              {segs.map((_, i) => (
                                <span key={i} style={{ width: 5, height: 5, borderRadius: "50%",
                                  background: i < filled ? f.dot : "#e7e9ec" }} />
                              ))}
                            </span>
                          </button>
                          {!collapsed && (
                            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 28px", rowGap: 4, columnGap: 8, alignItems: "center", fontSize: 12, padding: "4px 14px 8px 30px" }}>
                              {visible.map(s => {
                                const v = current[s.key];
                                return (
                                  <React.Fragment key={s.key}>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: C_TOKENS.textMuted, fontWeight: 500 }}>
                                      {s.label}
                                    </div>
                                    <div style={{ padding: "3px 7px", background: v ? f.soft : "transparent",
                                      border: `1px solid ${v ? f.dot : C_TOKENS.border}`, borderRadius: 3,
                                      color: v ? f.text : C_TOKENS.textSubtle,
                                      fontStyle: v ? "normal" : "italic", fontWeight: v ? 600 : 400,
                                      fontSize: 11.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                      {v || s.help}
                                    </div>
                                    <button title="Modifier" style={{ width: 22, height: 22, border: "none", background: "transparent", cursor: "pointer", color: C_TOKENS.textSubtle, display: "grid", placeItems: "center", borderRadius: 3 }}>
                                      <I.edit size={10} />
                                    </button>
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* shortcuts */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <ShortcutBtnD2 letter="Y" label="Valider" color="oklch(0.42 0.16 155)" bg="oklch(0.93 0.07 155)" onClick={() => setDecisions(d => ({ ...d, [current.id]: "y" }))} />
                <ShortcutBtnD2 letter="N" label="Rejeter" color="oklch(0.5 0.2 25)" bg="oklch(0.94 0.06 25)" onClick={() => setDecisions(d => ({ ...d, [current.id]: "n" }))} />
                <ShortcutBtnD2 letter="U" label="Reporter" color={C_TOKENS.textMuted} bg="#fafbfc" onClick={() => setDecisions(d => ({ ...d, [current.id]: "u" }))} />
                <div style={{ flex: 1 }} />
                <ShortcutBtnD2 letter="K" label="Préc." color={C_TOKENS.textMuted} bg="#fff" onClick={() => setActiveIdx(i => Math.max(i - 1, 0))} />
                <ShortcutBtnD2 letter="J" label="Suiv." color={C_TOKENS.textMuted} bg="#fff" onClick={() => setActiveIdx(i => Math.min(i + 1, filtered.length - 1))} />
              </div>

              {/* signals */}
              <div style={{ background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 4, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4, marginBottom: 6 }}>SIGNAUX IA</div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4, fontSize: 11.5 }}>
                  <li style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <I.check size={11} style={{ color: "oklch(0.5 0.16 155)" }} />
                    Marque <strong>{current.brand || "?"}</strong> trouvée dans le référentiel (1247 occurrences).
                  </li>
                  <li style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <I.check size={11} style={{ color: "oklch(0.5 0.16 155)" }} />
                    Format poids reconnu : <span style={{ fontFamily: C_TOKENS.mono }}>{current.weight}</span>.
                  </li>
                  {current.qualif && (
                    <li style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                      <I.sparkle size={11} style={{ color: "oklch(0.55 0.16 35)", flexShrink: 0, marginTop: 2 }} />
                      <span>
                        «&nbsp;<strong style={{ color: "oklch(0.38 0.15 35)" }}>{current.qualif}</strong>&nbsp;» détaché de la désignation et classé comme <strong>qualifiant</strong> — il peut varier (bio, plein air, label rouge…) sans changer le produit. <a href="#" onClick={e => e.preventDefault()} style={{ color: C_TOKENS.accentText, textDecoration: "none" }}>Réintégrer dans le titre ?</a>
                      </span>
                    </li>
                  )}
                  {!current.cond && (
                    <li style={{ display: "flex", gap: 6, alignItems: "center", color: "oklch(0.45 0.16 65)" }}>
                      <I.warning size={11} />
                      Conditionnement non détecté — catégorie suggérée : <span style={{ fontFamily: C_TOKENS.mono }}>paquet</span> (78%).
                    </li>
                  )}
                  {!current.origin && (
                    <li style={{ display: "flex", gap: 6, alignItems: "center", color: C_TOKENS.textMuted }}>
                      <I.info size={11} />
                      Origine non présente dans le libellé brut.
                    </li>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "grid", placeItems: "center", color: C_TOKENS.textMuted }}>
              <div style={{ textAlign: "center" }}>
                <I.check size={32} style={{ color: "oklch(0.55 0.16 155)" }} />
                <div style={{ fontSize: 14, marginTop: 8, fontWeight: 600 }}>File traitée — ouf.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* status bar with shortcuts */}
      <div style={{ height: 28, padding: "0 14px", background: "#1c1f23", color: "#cdd0d4", borderTop: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 14, fontSize: 11, fontFamily: C_TOKENS.mono, flexShrink: 0 }}>
        <KbdD2 k="J" /><span>suivant</span>
        <KbdD2 k="K" /><span>précédent</span>
        <KbdD2 k="Y" /><span>valider</span>
        <KbdD2 k="N" /><span>rejeter</span>
        <KbdD2 k="U" /><span>reporter</span>
        <KbdD2 k="⌘K" /><span>commande</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: "oklch(0.6 0.16 155)" }}>● {stats.decided} décisions</span>
        <span>v3.2 · Mme Lefèvre</span>
      </div>
    </div>
  );
}

function ShortcutBtnD2({ letter, label, color, bg, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px",
      background: bg, color, border: `1px solid ${color}`, borderRadius: 3, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 12.5 }}>
      <span style={{ display: "inline-grid", placeItems: "center", width: 18, height: 18, background: "#fff", color, borderRadius: 2, fontFamily: C_TOKENS.mono, fontSize: 10.5, fontWeight: 700, border: `1px solid ${color}` }}>{letter}</span>
      {label}
    </button>
  );
}

function KbdD2({ k }) {
  return <kbd style={{ padding: "1px 6px", background: "#2a2e34", color: "#fff", borderRadius: 2, fontFamily: C_TOKENS.mono, fontSize: 10.5, fontWeight: 700, border: "1px solid #3a3e44" }}>{k}</kbd>;
}

window.LabelInboxAI = LabelInboxAI;
