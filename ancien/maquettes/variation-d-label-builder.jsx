// Variation D — Dedicated Label Structure Builder
// Full-screen workspace, ultra-clear, practical for cat managers.
// Pass: cohérence visuelle alignée sur le reste du PIM (palette tokenisée,
// icônes vectorielles uniquement, badges unifiés, vignettes "Face",
// 3 familles de variables au lieu de 9 couleurs ad-hoc).

function LabelBuilderD() {
  const [activeChannel, setActiveChannel] = React.useState(2); // Site marchand
  const [activeProduct, setActiveProduct] = React.useState(0);
  const [contracturesOn, setContracturesOn] = React.useState(true);

  // ── DESIGN SYSTEM ────────────────────────────────────────────
  // Trois familles de variables, chacune avec un token de couleur défini.
  // Plus jamais de couleurs ad-hoc.
  // Trois familles, chacune avec un contraste AA garanti :
  //   dot   = couleur saturée (badges, dots, sous-lignes)
  //   soft  = fond chip lisible (≥ 6% de saturation, pas un blanc cassé)
  //   text  = texte sur soft (≥ 4.5:1)
  const FAMILIES = {
    identite:  { label: "Identité",  dot: "oklch(0.52 0.18 255)", soft: "oklch(0.94 0.05 255)", text: "oklch(0.34 0.16 255)" },
    emballage: { label: "Emballage", dot: "oklch(0.52 0.14 295)", soft: "oklch(0.94 0.05 295)", text: "oklch(0.34 0.13 295)" },
    attribut:  { label: "Attribut",  dot: "oklch(0.52 0.13 165)", soft: "oklch(0.93 0.06 165)", text: "oklch(0.34 0.12 165)" },
  };

  // PRODUCT VARIABLES — populated from PIM
  const variables = [
    { key: "produit",         label: "Désignation",       fam: "identite",  value: "Pâtes coquillettes",  icon: "tag" },
    { key: "marque",          label: "Marque",            fam: "identite",  value: "PANZANI",             icon: "tag",     upper: true },
    { key: "conditionnement", label: "Conditionnement",   fam: "emballage", value: "le paquet",           icon: "package" },
    { key: "poids",           label: "Poids / Volume",    fam: "emballage", value: "500g",                icon: "package" },
    { key: "format",          label: "Format",            fam: "emballage", value: "500g",                icon: "package" },
    { key: "parfum",          label: "Parfum / Saveur",   fam: "attribut",  value: null,                  icon: "sparkle", empty: true, help: "ex : fraise, vanille, choco" },
    { key: "qualifiant",      label: "Qualifiant",        fam: "attribut",  value: "Tradition",           icon: "sparkle", help: "ex : fermier, bio, plein air, label rouge" },
    { key: "origine",         label: "Origine",           fam: "attribut",  value: "France",              icon: "globe" },
    { key: "qte_paquet",      label: "Qté / paquet",      fam: "emballage", value: null,                  icon: "package", empty: true },
  ];

  const TOK = Object.fromEntries(variables.map(v => [v.key, v]));

  // CONTRACTURES — abbreviations dictionary
  const CONTRACTURES = [
    { full: "Paquet",        short: "Pqt",   cat: "Conditionnement" },
    { full: "Sachet",        short: "Scht",  cat: "Conditionnement" },
    { full: "Boîte",         short: "Bte",   cat: "Conditionnement" },
    { full: "Bouteille",     short: "Btle",  cat: "Conditionnement" },
    { full: "Bocal",         short: "Bcl",   cat: "Conditionnement" },
    { full: "Pot",           short: "Pot",   cat: "Conditionnement" },
    { full: "Berlingot",     short: "Berl",  cat: "Conditionnement" },
    { full: "Brique",        short: "Brq",   cat: "Conditionnement" },
    { full: "Conserve",      short: "Cons",  cat: "Conditionnement" },
    { full: "Tube",          short: "Tb",    cat: "Conditionnement" },
    { full: "Pack",          short: "Pck",   cat: "Conditionnement" },
    { full: "Lot",           short: "Lt",    cat: "Conditionnement" },
    { full: "Avec",          short: "Av",    cat: "Mots de liaison" },
    { full: "Sans",          short: "Ss",    cat: "Mots de liaison" },
    { full: "Pour",          short: "Pr",    cat: "Mots de liaison" },
    { full: "Petit",         short: "Pt",    cat: "Qualificatifs" },
    { full: "Grand",         short: "Gd",    cat: "Qualificatifs" },
    { full: "Moyen",         short: "Moy",   cat: "Qualificatifs" },
    { full: "Bio",           short: "Bio",   cat: "Qualificatifs" },
    { full: "Surgelé",       short: "Surg",  cat: "Qualificatifs" },
    { full: "Tradition",     short: "Trad",  cat: "Qualificatifs" },
    { full: "Fermier",       short: "Ferm",  cat: "Qualificatifs" },
    { full: "Plein air",     short: "Pl.air",cat: "Qualificatifs" },
    { full: "Label rouge",   short: "Lab.R", cat: "Qualificatifs" },
    { full: "Chocolat",      short: "Choco", cat: "Saveurs" },
    { full: "Vanille",       short: "Van",   cat: "Saveurs" },
    { full: "Fraise",        short: "Frse",  cat: "Saveurs" },
    { full: "Framboise",     short: "Fbse",  cat: "Saveurs" },
  ];

  function contract(value) {
    if (!value) return value;
    let out = value;
    CONTRACTURES.forEach(c => {
      const re = new RegExp(`\\b${c.full}\\b`, "gi");
      out = out.replace(re, c.short);
    });
    return out;
  }

  const groupedContractures = CONTRACTURES.reduce((acc, c) => {
    (acc[c.cat] = acc[c.cat] || []).push(c);
    return acc;
  }, {});

  // Sample products for the multi-product preview
  const products = [
    { values: { produit: "Pâtes coquillettes",            marque: "PANZANI",    conditionnement: "le paquet", poids: "500g",     qualifiant: "Tradition" } },
    { values: { produit: "Glace à l'Eau Sirop Fraise",    marque: "FLOUP",      conditionnement: "le sachet", poids: "4 x 130g" } },
    { values: { produit: "Filet de poulet",                marque: "Loué",       conditionnement: "la barquette", poids: "2 x 120g", qualifiant: "fermier" } },
    { values: { produit: "Pâte à tartiner",               marque: "NUTELLA",    conditionnement: "le pot",    poids: "750g" } },
    { values: { produit: "Eau minérale plate",            marque: "CRISTALINE", conditionnement: "le pack",   poids: "6 x 1,5L" } },
  ];

  // Channels with their structure
  const channels = [
    { id: "etagere", name: "Étagère",      icon: "store",     limit: 32,
      desc: "Étiquette de gondole, rayons.",
      struct: [{ t: "var", k: "produit" }, { t: "lit", v: " " }, { t: "var", k: "qualifiant", optional: true }, { t: "lit", v: " ", optional: true }, { t: "var", k: "marque" }, { t: "lit", v: " " }, { t: "var", k: "poids" }] },
    { id: "caisse", name: "Caisse / TPE",  icon: "receipt",   limit: 24,
      desc: "Ticket de caisse imprimé. Qualifiant omis si dépassement (contracture sinon).",
      struct: [{ t: "var", k: "marque" }, { t: "lit", v: " " }, { t: "var", k: "qualifiant", optional: true, contractAggressive: true }, { t: "lit", v: " ", optional: true }, { t: "var", k: "poids" }] },
    { id: "site", name: "Site marchand",   icon: "cart",      limit: 80,
      desc: "Titre produit e-commerce et drive.",
      struct: [{ t: "var", k: "produit" }, { t: "lit", v: " " }, { t: "var", k: "qualifiant", optional: true }, { t: "lit", v: " ", optional: true }, { t: "var", k: "marque" }, { t: "lit", v: ", " }, { t: "var", k: "conditionnement" }, { t: "lit", v: " de " }, { t: "var", k: "poids" }] },
    { id: "long", name: "Marketing long",  icon: "megaphone", limit: 240,
      desc: "Description longue, fiches détaillées.",
      struct: [{ t: "var", k: "produit" }, { t: "lit", v: " " }, { t: "var", k: "qualifiant", optional: true }, { t: "lit", v: " — ", optional: true, fallback: " — " }, { t: "var", k: "marque" }, { t: "lit", v: ", " }, { t: "var", k: "conditionnement" }, { t: "lit", v: " de " }, { t: "var", k: "poids" }] },
  ];

  const channel = channels[activeChannel];

  function renderFor(product, struct, limit) {
    // Two-pass: try with optional slots ON, fallback to OFF if over limit.
    function build(includeOptional, aggressive) {
      let out = "";
      struct.forEach(s => {
        if (s.optional && !includeOptional) return;
        if (s.t === "lit") { out += s.v; return; }
        const v = product.values[s.k];
        if (v == null) {
          if (s.optional) return;
          out += `{${s.k}}`;
          return;
        }
        let val = TOK[s.k]?.upper ? v.toUpperCase() : v;
        if (contracturesOn || aggressive) val = contract(val);
        out += val;
      });
      // Cleanup double spaces from dropped optional slots
      return out.replace(/\s{2,}/g, " ").replace(/\s,/g, ",").trim();
    }
    let result = build(true, false);
    if (limit && result.length > limit) {
      const aggressive = build(true, true);
      if (aggressive.length <= limit) return aggressive;
      const dropped = build(false, contracturesOn);
      return dropped;
    }
    return result;
  }

  // ── ATOMS ─────────────────────────────────────────────────────
  function ChipVar({ k, large, optional }) {
    const v = TOK[k];
    const fam = FAMILIES[v.fam];
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6,
        padding: large ? "5px 10px 5px 8px" : "3px 8px 3px 6px",
        background: fam.soft,
        border: optional ? `1px dashed ${fam.dot}` : `1px solid ${fam.dot}`,
        color: fam.text,
        fontSize: large ? 12.5 : 11, fontWeight: 600, borderRadius: 3,
        whiteSpace: "nowrap", fontFamily: "inherit" }}
        title={optional ? "Slot optionnel — omis si vide ou si dépassement de limite" : undefined}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: fam.dot, flexShrink: 0 }} />
        {v.label}
        {optional && (
          <span style={{ marginLeft: 2, fontSize: 9, fontWeight: 700, color: fam.dot,
            border: `1px solid ${fam.dot}`, borderRadius: 2, padding: "0 3px",
            letterSpacing: 0.3, lineHeight: 1.4 }}>±</span>
        )}
      </span>
    );
  }

  function ChipLit({ v, large }) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", padding: large ? "5px 8px" : "3px 6px",
        background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 3,
        fontSize: large ? 12 : 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
        whiteSpace: "pre", letterSpacing: 0.3 }}>
        {v === " " ? "␣" : v.replace(/ /g, "·")}
      </span>
    );
  }

  // Placeholder visuel "Face" identique à l'écran A
  function FaceTile({ size = 32 }) {
    return (
      <div style={{ width: size, height: size, background: "#fafbfc",
        border: `1px solid ${C_TOKENS.border}`, borderRadius: 3,
        display: "grid", placeItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: size > 30 ? 9 : 8, color: C_TOKENS.textSubtle, letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 600 }}>Face</span>
      </div>
    );
  }

  // Status pill — couleurs renforcées pour lisibilité
  function StatusPill({ kind }) {
    const map = {
      ok:    { color: "oklch(0.34 0.14 155)", bg: "oklch(0.93 0.07 155)", dot: "oklch(0.5 0.16 155)", label: "Conforme" },
      over:  { color: "oklch(0.36 0.13 65)",  bg: "oklch(0.94 0.08 75)",  dot: "oklch(0.62 0.17 65)",  label: "Dépassement" },
      empty: { color: "oklch(0.38 0.18 25)",  bg: "oklch(0.94 0.06 25)",  dot: "oklch(0.55 0.2 25)",   label: "Incomplet" },
    };
    const s = map[kind];
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px 2px 6px",
        background: s.bg, color: s.color, fontSize: 10.5, fontWeight: 600, borderRadius: 3, whiteSpace: "nowrap" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
        {s.label}
      </span>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C_TOKENS.bg, fontFamily: C_TOKENS.font, color: C_TOKENS.text, fontSize: 12 }}>

      {/* Top bar */}
      <div style={{ height: 38, padding: "0 14px", background: C_TOKENS.headerBg, borderBottom: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0, whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: C_TOKENS.accent, color: "#fff",
            display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>P</div>
          <span style={{ fontWeight: 600 }}>Produit.ai</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 4px" }}>/</span>
          <span style={{ color: C_TOKENS.textMuted }}>Templates</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 2px" }}>›</span>
          <span style={{ fontWeight: 500 }}>Libellés multi-canal — Épicerie</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>Auto-save · 4s</span>
        <div style={{ width: 1, height: 18, background: C_TOKENS.border }} />
        <button style={{ padding: "4px 10px", background: "#fff", border: `1px solid ${C_TOKENS.border}`,
          borderRadius: 3, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit" }}>Tester sur 240 articles</button>
        <button style={{ padding: "4px 10px", background: C_TOKENS.accent, color: "#fff", border: "none",
          borderRadius: 3, fontSize: 11.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Appliquer le template</button>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "240px minmax(0, 1fr) 280px", overflow: "hidden" }}>

        {/* LEFT — channel list */}
        <div style={{ background: "#fff", borderRight: `1px solid ${C_TOKENS.border}`, overflow: "auto", padding: "12px 0" }}>
          <div style={{ padding: "0 14px 8px", fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
            letterSpacing: 0.4 }}>CANAUX DE DIFFUSION</div>
          {channels.map((c, i) => {
            const ChIcon = I[c.icon];
            const isActive = activeChannel === i;
            return (
              <button key={c.id} onClick={() => setActiveChannel(i)}
                style={{ width: "100%", padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10,
                  background: isActive ? C_TOKENS.accentSoft : "transparent",
                  borderLeft: isActive ? `3px solid ${C_TOKENS.accent}` : "3px solid transparent",
                  border: "none", borderBottom: `1px solid ${C_TOKENS.border}`,
                  textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                  color: isActive ? C_TOKENS.accentText : C_TOKENS.text }}>
                <div style={{ width: 28, height: 28, borderRadius: 4, background: isActive ? "#fff" : "#fafbfc",
                  border: `1px solid ${C_TOKENS.border}`, display: "grid", placeItems: "center", flexShrink: 0,
                  color: isActive ? C_TOKENS.accentText : C_TOKENS.textMuted }}>
                  <ChIcon size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted, marginTop: 1, lineHeight: 1.35,
                    whiteSpace: "normal", fontWeight: 400 }}>{c.desc}</div>
                  <div style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10,
                    color: C_TOKENS.textSubtle, fontFamily: C_TOKENS.mono }}>
                    max {c.limit}c · {c.struct.filter(s => s.t === "var").length} var.
                  </div>
                </div>
              </button>
            );
          })}
          <div style={{ padding: "10px 14px" }}>
            <button style={{ width: "100%", padding: "8px 10px", background: "#fff",
              border: `1px dashed ${C_TOKENS.border}`, borderRadius: 4, fontSize: 11.5, color: C_TOKENS.textMuted,
              cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
              <I.plus size={11} /> Nouveau canal
            </button>
          </div>
        </div>

        {/* CENTER — builder + preview */}
        <div style={{ overflow: "auto", padding: 20, background: C_TOKENS.bg, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 5, background: "#fff",
              border: `1px solid ${C_TOKENS.border}`, display: "grid", placeItems: "center",
              color: C_TOKENS.accentText }}>
              {React.createElement(I[channel.icon], { size: 17 })}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: C_TOKENS.text, letterSpacing: -0.2, lineHeight: 1.1 }}>
                {channel.name}
              </div>
              <div style={{ fontSize: 11.5, color: C_TOKENS.textMuted, marginTop: 2 }}>
                {channel.desc} · max {channel.limit} caractères
              </div>
            </div>
          </div>

          {/* THE BUILDER */}
          <section style={{ background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 4 }}>
            <header style={{ height: 32, padding: "0 14px", borderBottom: `1px solid ${C_TOKENS.border}`,
              background: C_TOKENS.headerBg, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11.5, fontWeight: 600 }}>Structure du libellé</div>
              <div style={{ display: "flex", gap: 4 }}>
                <button style={smBtnD}><I.history size={11} /> Annuler</button>
                <button style={smBtnD}><I.copy size={11} /> Dupliquer</button>
                <button style={smBtnD}><I.sparkle size={11} /> Suggérer</button>
              </div>
            </header>

            {/* Visual flow */}
            <div style={{ padding: "20px 18px", background: "#fafbfc",
              borderBottom: `1px solid ${C_TOKENS.border}` }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                {channel.struct.map((s, i) => (
                  <React.Fragment key={i}>
                    {s.t === "var"
                      ? <ChipVar k={s.k} large optional={s.optional} />
                      : <ChipLit v={s.v} large />}
                    {i < channel.struct.length - 1 && (
                      <span style={{ color: C_TOKENS.textSubtle, fontSize: 13, userSelect: "none" }}>+</span>
                    )}
                  </React.Fragment>
                ))}
                <span style={{ color: C_TOKENS.textSubtle, fontSize: 13, userSelect: "none" }}>+</span>
                <button style={{ display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "5px 10px", background: "#fff", border: `1px dashed ${C_TOKENS.borderStrong}`,
                  borderRadius: 3, fontSize: 11.5, color: C_TOKENS.textMuted, cursor: "pointer", fontFamily: "inherit" }}>
                  <I.plus size={11} /> Ajouter
                </button>
              </div>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C_TOKENS.textSubtle }}>
                <I.info size={11} />
                Glissez les variables depuis le panneau de droite, ou ajoutez du texte libre comme séparateur.
              </div>
            </div>

            {/* Live render */}
            <div style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
                letterSpacing: 0.4, marginBottom: 8 }}>RENDU SUR LE PRODUIT ACTIF</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                background: "#fafbfc", border: `1px solid ${C_TOKENS.border}`, borderRadius: 4 }}>
                <FaceTile size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, color: C_TOKENS.text, lineHeight: 1.3, fontWeight: 500 }}>
                    {channel.struct.map((s, i) => {
                      if (s.t === "lit") return <span key={i} style={{ color: C_TOKENS.textMuted }}>{s.v}</span>;
                      const v = products[activeProduct].values[s.k];
                      const tok = TOK[s.k];
                      const fam = FAMILIES[tok.fam];
                      return (
                        <span key={i} style={{ color: fam.text, fontWeight: 600, padding: "0 1px",
                          borderBottom: `1.5px solid ${fam.dot}`, marginRight: 1 }}>
                          {tok.upper ? (v || `{${s.k}}`).toUpperCase() : (v || `{${s.k}}`)}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: C_TOKENS.mono, fontSize: 13, fontWeight: 600,
                    color: renderFor(products[activeProduct], channel.struct, channel.limit).length > channel.limit ? "oklch(0.5 0.2 25)" : "oklch(0.42 0.16 155)",
                    fontVariantNumeric: "tabular-nums" }}>
                    {renderFor(products[activeProduct], channel.struct, channel.limit).length} / {channel.limit}
                  </div>
                  <div style={{ width: 80, height: 4, background: "#e7e9ec", borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, renderFor(products[activeProduct], channel.struct, channel.limit).length / channel.limit * 100)}%`,
                      height: "100%", background: "oklch(0.55 0.16 155)" }} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* REVERSE PARSE — identify variables from an existing label */}
          <ReverseParser variables={variables} families={FAMILIES} />

          {/* MULTI-PRODUCT PREVIEW */}
          <section style={{ background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 4 }}>
            <header style={{ height: 32, padding: "0 14px", borderBottom: `1px solid ${C_TOKENS.border}`,
              background: C_TOKENS.headerBg, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11.5, fontWeight: 600 }}>Aperçu sur 240 articles · échantillon</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                <StatusPill kind="ok" />
                <span style={{ color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>236</span>
                <StatusPill kind="over" />
                <span style={{ color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>3</span>
                <StatusPill kind="empty" />
                <span style={{ color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>1</span>
              </div>
            </header>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: 48 }} />
                <col style={{ width: 130 }} />
                <col />
                <col style={{ width: 90 }} />
                <col style={{ width: 110 }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={thBC()}></th>
                  <th style={thBC()}>EAN / Article</th>
                  <th style={thBC()}>Libellé généré</th>
                  <th style={thBC()}>Long.</th>
                  <th style={thBC()}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => {
                  const out = renderFor(p, channel.struct, channel.limit);
                  const over = out.length > channel.limit;
                  const isActive = i === activeProduct;
                  return (
                    <tr key={i} onClick={() => setActiveProduct(i)}
                      style={{ background: isActive ? C_TOKENS.accentSoft : (i % 2 ? C_TOKENS.rowAlt : "#fff"), cursor: "pointer" }}>
                      <td style={{ ...tdBC(), padding: "4px 8px" }}>
                        <FaceTile size={28} />
                      </td>
                      <td style={{ ...tdBC(), fontFamily: C_TOKENS.mono, fontSize: 11, color: C_TOKENS.textMuted }}>
                        EAN-{(3017620422003 + i * 1000).toString().slice(-7)}
                      </td>
                      <td style={{ ...tdBC(), color: C_TOKENS.text, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {channel.struct.map((s, j) => {
                          if (s.t === "lit") return <span key={j} style={{ color: C_TOKENS.textMuted }}>{s.v}</span>;
                          const v = p.values[s.k];
                          const tok = TOK[s.k];
                          const fam = FAMILIES[tok.fam];
                          return <span key={j} style={{ color: fam.text, fontWeight: 600 }}>
                            {tok.upper ? (v || "—").toUpperCase() : (v || "—")}
                          </span>;
                        })}
                      </td>
                      <td style={{ ...tdBC(), fontFamily: C_TOKENS.mono, fontSize: 11.5, color: over ? "oklch(0.5 0.2 25)" : C_TOKENS.text, fontVariantNumeric: "tabular-nums", fontWeight: over ? 600 : 400 }}>
                        {out.length} / {channel.limit}
                      </td>
                      <td style={tdBC()}>
                        <StatusPill kind={over ? "over" : "ok"} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

        </div>

        {/* RIGHT — variables + tools */}
        <div style={{ background: "#fff", borderLeft: `1px solid ${C_TOKENS.border}`, overflow: "auto" }}>

          {/* Variables */}
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C_TOKENS.border}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
              letterSpacing: 0.4, marginBottom: 8 }}>VARIABLES PRODUIT</div>
            <div style={{ position: "relative" }}>
              <I.search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: C_TOKENS.textSubtle }} />
              <input placeholder="Rechercher une variable…"
                style={{ width: "100%", padding: "5px 10px 5px 26px", border: `1px solid ${C_TOKENS.border}`,
                  borderRadius: 3, fontSize: 11.5, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          {/* Group variables by family */}
          {Object.entries(FAMILIES).map(([famKey, fam]) => {
            const vars = variables.filter(v => v.fam === famKey);
            if (!vars.length) return null;
            return (
              <div key={famKey} style={{ padding: "10px 14px", borderBottom: `1px solid ${C_TOKENS.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: fam.dot }} />
                  <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4 }}>
                    {fam.label.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, height: 1, background: C_TOKENS.border }} />
                  <span style={{ fontSize: 10, color: C_TOKENS.textSubtle, fontFamily: C_TOKENS.mono }}>{vars.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {vars.map(v => {
                    const VIcon = I[v.icon];
                    return (
                      <div key={v.key} draggable
                        style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px",
                          background: v.empty ? "oklch(0.96 0.05 75)" : "#fff",
                          border: `1px solid ${v.empty ? "oklch(0.78 0.12 75)" : C_TOKENS.border}`, borderRadius: 3,
                          cursor: "grab" }}>
                        <div style={{ width: 22, height: 22, borderRadius: 3, background: fam.soft,
                          border: `1px solid ${fam.dot}`, display: "grid", placeItems: "center", flexShrink: 0,
                          color: fam.text }}>
                          <VIcon size={12} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: C_TOKENS.text, lineHeight: 1.2,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.label}</div>
                          <div style={{ fontSize: 10.5, color: v.empty ? "oklch(0.4 0.15 65)" : C_TOKENS.textMuted, marginTop: 1, fontWeight: v.empty ? 600 : 400,
                            fontFamily: C_TOKENS.mono, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {v.empty ? "à renseigner" : (v.upper ? v.value.toUpperCase() : v.value)}
                          </div>
                        </div>
                        <I.more size={12} style={{ color: C_TOKENS.textSubtle, flexShrink: 0 }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Separators */}
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C_TOKENS.border}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
              letterSpacing: 0.4, marginBottom: 8 }}>SÉPARATEURS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {[" ", ", ", " — ", " · ", " de ", " - ", " | "].map((s, i) => (
                <button key={i} style={{ padding: "3px 8px", background: "#fafbfc",
                  border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, fontSize: 11, color: C_TOKENS.textMuted,
                  fontFamily: C_TOKENS.mono, cursor: "pointer", whiteSpace: "pre" }}>
                  {s === " " ? "␣" : s}
                </button>
              ))}
              <button style={{ padding: "3px 8px", background: "#fff",
                border: `1px dashed ${C_TOKENS.border}`, borderRadius: 3, fontSize: 11, color: C_TOKENS.textMuted,
                fontFamily: "inherit", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3 }}>
                <I.plus size={10} /> texte
              </button>
            </div>
          </div>

          {/* Contractures */}
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C_TOKENS.border}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4 }}>CONTRACTURES</div>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, color: C_TOKENS.textMuted, cursor: "pointer" }}>
                <input type="checkbox" checked={contracturesOn} onChange={e => setContracturesOn(e.target.checked)}
                  style={{ width: 11, height: 11, margin: 0 }} />
                appliquer
              </label>
            </div>
            <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted, marginBottom: 8, lineHeight: 1.4 }}>
              Abréviations standard pour gagner des caractères.
            </div>
            {Object.entries(groupedContractures).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: C_TOKENS.textSubtle, marginBottom: 4, fontWeight: 600 }}>{cat}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {items.map(c => (
                    <span key={c.full} title={`${c.full} → ${c.short}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "2px 6px", background: "#fafbfc",
                        border: `1px solid ${C_TOKENS.border}`, borderRadius: 3,
                        fontSize: 10.5, fontFamily: C_TOKENS.mono, color: C_TOKENS.text, cursor: "default" }}>
                      <span style={{ color: C_TOKENS.textMuted }}>{c.full}</span>
                      <span style={{ color: C_TOKENS.textSubtle }}>→</span>
                      <span style={{ color: C_TOKENS.accentText, fontWeight: 600 }}>{c.short}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Templates */}
          <div style={{ padding: "10px 14px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
              letterSpacing: 0.4, marginBottom: 8 }}>MODÈLES PRÊTS À L'EMPLOI</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { n: "Standard épicerie", x: "produit + MARQUE, conditionnement de poids" },
                { n: "Frais court",       x: "MARQUE poids" },
                { n: "Drive long",        x: "produit — MARQUE, format" },
                { n: "DPH",               x: "produit MARQUE qualifiant poids" },
              ].map((t, i) => (
                <button key={i} style={{ padding: "7px 10px", background: "#fafbfc",
                  border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, textAlign: "left",
                  cursor: "pointer", fontFamily: "inherit" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: C_TOKENS.text }}>{t.n}</div>
                  <div style={{ fontSize: 10, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, marginTop: 2,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.x}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{ height: 24, padding: "0 14px", background: C_TOKENS.headerBg, borderTop: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, flexShrink: 0 }}>
        <span>Template <strong style={{ color: C_TOKENS.text }}>épicerie-v3</strong></span>
        <span>{channel.struct.length} segments</span>
        <span>{channel.struct.filter(s => s.t === "var").length} variables</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: "oklch(0.42 0.16 155)", fontWeight: 600 }}>● 240 articles éligibles</span>
        <span>v3.2 · Mme Lefèvre · à l'instant</span>
      </div>
    </div>
  );
}

const smBtnD = { display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px",
  height: 22, fontSize: 11, fontFamily: "inherit", background: "#fff",
  color: C_TOKENS.text, border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, cursor: "pointer" };

window.LabelBuilderD = LabelBuilderD;

// ─────────────────────────────────────────────────────────────────
// ReverseParser — colle un libellé existant et identifie les variables
// (matching gourmand sur les valeurs connues + listes contrôlées).
// ─────────────────────────────────────────────────────────────────
function ReverseParser({ variables, families }) {
  const samples = [
    "Pâtes coquillettes PANZANI, le paquet de 500g",
    "NUTELLA pâte à tartiner — pot de 750g, France",
    "Eau minérale plate CRISTALINE pack de 6 x 1,5L",
    "Glace à l'Eau Sirop Fraise FLOUP, sachet 4 x 130g",
  ];
  const [input, setInput] = React.useState(samples[0]);

  // Dictionnaires de référence (en pratique : viendraient du PIM / référentiels)
  const KNOWN = {
    marque:          ["PANZANI", "NUTELLA", "CRISTALINE", "FLOUP", "BARILLA", "LACTEL", "HARRYS", "FERRERO", "MUTTI"],
    conditionnement: ["paquet", "sachet", "boîte", "bouteille", "bocal", "pot", "berlingot", "brique", "conserve", "tube", "pack", "lot"],
    origine:         ["France", "Italie", "Espagne", "Belgique", "Allemagne", "UE"],
    qualifiant:      ["Tradition", "Bio", "Nature", "Original", "Light", "fermier", "plein air", "label rouge"],
    parfum:          ["Chocolat", "Vanille", "Fraise", "Framboise", "Citron", "Caramel", "Pistache"],
  };
  const POIDS_RE = /\b(\d+\s*(?:[x×]\s*\d+(?:[.,]\d+)?\s*)?(?:g|kg|ml|cl|l|L)\b)/i;
  const CONDIT_RE = new RegExp(`\\b(?:le |la |un |une |de |du )?(${KNOWN.conditionnement.join("|")})\\b`, "i");

  // Detect tokens in the input. Returns ordered tokens with key/varKey/value/start/end.
  const tokens = React.useMemo(() => {
    const found = [];

    function pushMatch(re, varKey) {
      const m = input.match(re);
      if (m && m.index != null) {
        found.push({ varKey, value: m[0], start: m.index, end: m.index + m[0].length });
      }
    }

    // Exact lookups (case-sensitive for brand, insensitive for others)
    KNOWN.marque.forEach(b => {
      const idx = input.indexOf(b);
      if (idx >= 0) found.push({ varKey: "marque", value: b, start: idx, end: idx + b.length });
    });
    pushMatch(POIDS_RE, "poids");
    pushMatch(CONDIT_RE, "conditionnement");
    KNOWN.origine.forEach(o => {
      const idx = input.indexOf(o);
      if (idx >= 0) found.push({ varKey: "origine", value: o, start: idx, end: idx + o.length });
    });
    KNOWN.qualifiant.forEach(o => {
      const idx = input.toLowerCase().indexOf(o.toLowerCase());
      if (idx >= 0) found.push({ varKey: "qualifiant", value: input.substr(idx, o.length), start: idx, end: idx + o.length });
    });
    KNOWN.parfum.forEach(o => {
      const idx = input.toLowerCase().indexOf(o.toLowerCase());
      if (idx >= 0) found.push({ varKey: "parfum", value: input.slice(idx, idx + o.length), start: idx, end: idx + o.length });
    });

    // Sort and dedupe overlapping (keep first)
    found.sort((a, b) => a.start - b.start);
    const clean = [];
    for (const f of found) {
      if (!clean.some(c => f.start < c.end && f.end > c.start)) clean.push(f);
    }

    // The leading text before the first match is treated as "produit" (designation)
    const segments = [];
    let cursor = 0;
    let designationTaken = false;
    clean.forEach(c => {
      if (c.start > cursor) {
        const txt = input.slice(cursor, c.start).trim();
        if (txt && !designationTaken && c.varKey !== "produit") {
          segments.push({ varKey: "produit", value: txt, kind: "match" });
          designationTaken = true;
        } else if (txt) {
          segments.push({ varKey: null, value: input.slice(cursor, c.start), kind: "lit" });
        }
      }
      segments.push({ varKey: c.varKey, value: c.value, kind: "match" });
      cursor = c.end;
    });
    if (cursor < input.length) {
      const tail = input.slice(cursor);
      if (tail.trim()) segments.push({ varKey: null, value: tail, kind: "lit" });
    }
    return segments;
  }, [input]);

  const matched = tokens.filter(t => t.kind === "match");
  const matchedKeys = new Set(matched.map(t => t.varKey));
  const missing = variables.filter(v => !matchedKeys.has(v.key) && !v.empty);
  const totalVars = variables.length;
  const matchedCount = matched.length;
  const confidence = Math.round((matchedCount / totalVars) * 100);

  return (
    <section style={{ background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 4 }}>
      <header style={{ height: 32, padding: "0 14px", borderBottom: `1px solid ${C_TOKENS.border}`,
        background: C_TOKENS.headerBg, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <I.scan size={13} style={{ color: C_TOKENS.accentText }} />
          <div style={{ fontSize: 11.5, fontWeight: 600 }}>Identifier les variables d'un libellé existant</div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, color: C_TOKENS.textMuted }}>
          <span>Confiance</span>
          <span style={{ fontFamily: C_TOKENS.mono, fontWeight: 700,
            color: confidence > 60 ? "oklch(0.42 0.16 155)" : confidence > 30 ? "oklch(0.45 0.16 65)" : "oklch(0.5 0.2 25)" }}>
            {confidence}%
          </span>
        </div>
      </header>

      {/* Input */}
      <div style={{ padding: "14px 18px 10px", borderBottom: `1px solid ${C_TOKENS.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4, marginBottom: 6 }}>
          LIBELLÉ EXISTANT (collez un titre, un libellé caisse, un export…)
        </div>
        <textarea value={input} onChange={e => setInput(e.target.value)} rows={2}
          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${C_TOKENS.border}`,
            borderRadius: 3, fontSize: 13, fontFamily: "inherit", outline: "none", resize: "vertical",
            color: C_TOKENS.text, lineHeight: 1.4, boxSizing: "border-box" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
          <span style={{ fontSize: 10.5, color: C_TOKENS.textSubtle, marginRight: 4, alignSelf: "center" }}>Exemples :</span>
          {samples.map((s, i) => (
            <button key={i} onClick={() => setInput(s)}
              style={{ padding: "2px 8px", background: "#fafbfc", border: `1px solid ${C_TOKENS.border}`,
                borderRadius: 3, fontSize: 10.5, color: C_TOKENS.textMuted, cursor: "pointer", fontFamily: "inherit",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>
              {s.length > 32 ? s.slice(0, 32) + "…" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Highlighted preview */}
      <div style={{ padding: "12px 18px", borderBottom: `1px solid ${C_TOKENS.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4, marginBottom: 6 }}>
          ANALYSE
        </div>
        <div style={{ padding: "10px 12px", background: "#fafbfc", border: `1px solid ${C_TOKENS.border}`,
          borderRadius: 3, fontSize: 14, lineHeight: 1.7 }}>
          {tokens.length === 0
            ? <span style={{ color: C_TOKENS.textSubtle, fontStyle: "italic", fontSize: 12 }}>Saisissez un libellé pour lancer l'analyse…</span>
            : tokens.map((t, i) => {
                if (t.kind === "lit") {
                  return <span key={i} style={{ color: C_TOKENS.textMuted }}>{t.value}</span>;
                }
                const v = variables.find(x => x.key === t.varKey);
                const fam = v ? families[v.fam] : null;
                if (!fam) return <span key={i}>{t.value}</span>;
                return (
                  <span key={i} title={v.label}
                    style={{ position: "relative", color: fam.text, fontWeight: 600,
                      background: fam.soft, padding: "2px 5px", borderRadius: 3,
                      borderBottom: `2px solid ${fam.dot}`, marginRight: 2 }}>
                    {t.value}
                    <sup style={{ marginLeft: 4, fontSize: 9, fontWeight: 700, opacity: 0.85, fontFamily: C_TOKENS.mono, letterSpacing: 0.3 }}>
                      {v.label.toUpperCase()}
                    </sup>
                  </span>
                );
              })}
        </div>
      </div>

      {/* Mapping table */}
      <div style={{ padding: "12px 18px 14px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4, marginBottom: 8 }}>
          VARIABLES IDENTIFIÉES · {matchedCount}/{totalVars}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
          {variables.map(v => {
            const fam = families[v.fam];
            const hit = matched.find(m => m.varKey === v.key);
            return (
              <div key={v.key}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px",
                  background: hit ? fam.soft : "#fafbfc",
                  border: `1px solid ${hit ? fam.dot : C_TOKENS.border}`, borderRadius: 3 }}>
                <div style={{ width: 18, height: 18, borderRadius: 2, background: hit ? fam.dot : "transparent",
                  border: hit ? "none" : `1px dashed ${C_TOKENS.borderStrong}`,
                  display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}>
                  {hit ? <I.check size={11} /> : null}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: hit ? fam.text : C_TOKENS.textMuted, fontWeight: 600, lineHeight: 1.2 }}>
                    {v.label}
                  </div>
                  <div style={{ fontSize: 11, color: C_TOKENS.text, fontFamily: hit ? "inherit" : C_TOKENS.mono,
                    fontWeight: hit ? 500 : 400, marginTop: 1,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {hit ? hit.value : <span style={{ color: C_TOKENS.textSubtle, fontStyle: "italic" }}>non détecté</span>}
                  </div>
                </div>
                {hit && (
                  <button title="Modifier le mapping"
                    style={{ width: 20, height: 20, padding: 0, background: "transparent", border: "none",
                      borderRadius: 2, cursor: "pointer", color: C_TOKENS.textMuted, display: "grid", placeItems: "center" }}>
                    <I.edit size={11} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontSize: 11, color: C_TOKENS.textMuted, lineHeight: 1.4, flex: 1 }}>
            {missing.length === 0
              ? <span><I.check size={11} style={{ verticalAlign: "-1px", color: "oklch(0.5 0.16 155)" }} /> Toutes les variables connues ont été identifiées.</span>
              : <span><I.warning size={11} style={{ verticalAlign: "-1px", color: "oklch(0.55 0.18 65)" }} /> {missing.length} variable{missing.length > 1 ? "s" : ""} non détectée{missing.length > 1 ? "s" : ""} : {missing.map(m => m.label.toLowerCase()).join(", ")}.</span>}
          </div>
          <button style={{ ...smBtnD, height: 26, padding: "4px 10px", fontSize: 11.5, background: C_TOKENS.accent, color: "#fff", border: "none", fontWeight: 500 }}>
            <I.sparkle size={11} /> Pousser dans la fiche produit
          </button>
        </div>
      </div>
    </section>
  );
}
