// Variation D5 \u2014 Spreadsheet ultra-dense
// 60+ lignes visibles. Colonnes par variable. Cellules colorees par confiance.
// Auto-fill par colonne via dropdown (\"Remplir cette colonne avec l'IA\u201d).

function SpreadsheetD5() {
  const COLS = [
    { key: "ean",    label: "EAN",         w: 110, mono: true,  fam: null },
    { key: "raw",    label: "Libell\u00e9 brut", w: 240, mono: false, fam: null,  muted: true },
    { key: "brand",  label: "Marque",      w: 120, mono: false, fam: "brand" },
    { key: "prod",   label: "D\u00e9signation", w: 220, mono: false, fam: "prod" },
    { key: "cond",   label: "Cond.",       w: 90,  mono: false, fam: "cond" },
    { key: "weight", label: "Poids",       w: 90,  mono: true,  fam: "weight" },
    { key: "origin", label: "Orig.",       w: 60,  mono: true,  fam: "origin" },
    { key: "conf",   label: "Conf.",       w: 60,  mono: true,  fam: null,  num: true },
  ];

  const RAW = [
    ["3017620422003", "PANZANI Coquillettes pqt 500g",                "PANZANI",   "Coquillettes",            "paquet", "500g",    "IT", 99],
    ["3228857000852", "Harrys baguette tradition fr 250g",             "Harrys",    "Baguette tradition",      null,     "250g",    "FR", 87],
    ["3175680011480", "CRISTALINE eau plate 6X1.5L",                   "CRISTALINE","Eau min\u00e9rale plate", "pack",   "6\u00d71,5L", "FR", 98],
    ["3560070976478", "Filet poulet ferm Lou\u00e9 2x120g",            "Lou\u00e9", "Filet poulet fermier",    null,     "2\u00d7120g","FR", 84],
    ["8001505005707", "Spaghetti N\u00b05 500g BARILLA",               "BARILLA",   "Spaghetti n\u00b05",      "paquet", "500g",    "IT", 96],
    ["3245412000133", "La Laiti\u00e8re yaourt nat 4x125g",            "La Laiti\u00e8re", "Yaourt nature",   "pot",    "4\u00d7125g","FR", 92],
    ["3017760123457", "Caf\u00e9 grains arabica 1kg carte noire",      "Carte Noire", "Caf\u00e9 arabica",      "paquet", "1kg",    null, 73],
    ["3596710443215", "Saumon fum\u00e9 atl 4tr 120g labeyrie",        "Labeyrie",  "Saumon fum\u00e9 Atl",   null,    "4tr 120g","FR", 84],
    ["8076809513753", "MUTTI sauce tomate basilic 400g",               "MUTTI",     "Sauce tomate basilic",   "bocal",  "400g",   "IT", 99],
    ["3033710065165", "Lactel \u00bd \u00e9cr\u00e9m\u00e9 UHT 6x1L",   "Lactel",    "Lait \u00bd \u00e9cr UHT","pack",  "6\u00d71L","FR", 95],
    ["7622210449283", "Lu petit beurre 200g",                          "LU",        "Petit beurre",           "paquet", "200g",   "FR", 94],
    ["3110210132207", "Bonduelle ma\u00efs doux 3x150g",                "Bonduelle", "Ma\u00efs doux",         "lot",    "3\u00d7150g","FR", 91],
    ["3068320105017", "Evian eau plate 6x1.5L",                        "Evian",     "Eau min\u00e9rale plate","pack",   "6\u00d71,5L","FR", 98],
    ["3270190022001", "Coca cola zero 1.25L",                          "Coca-Cola", "Coca Zero",              "btl",    "1,25L",  null, 97],
    ["3245391105030", "President beurre doux 250g",                    "Pr\u00e9sident", "Beurre doux",      "plaq",   "250g",   "FR", 96],
    ["3270570012345", "Ferrero rocher 200g x16",                       "Ferrero",   "Rocher",                 "bo\u00eete","200g 16p","IT", 78],
    ["8000500310427", "Nutella p\u00e2te \u00e0 tartiner 750g",        "NUTELLA",   "P\u00e2te \u00e0 tartiner","pot",   "750g",   "IT", 99],
    ["3017620425035", "Panzani penne rigate 500g",                     "PANZANI",   "Penne rigate",           "paquet", "500g",   "IT", 98],
    ["3760127290117", "Bjorg muesli bio 750g",                         "Bjorg",     "Muesli bio",             "paquet", "750g",   null, 94],
    ["3245412888777", "yaourt nature 4x125",                           null,        "Yaourt nature",          "pot",    "4\u00d7125g",null,54],
    ["3033710066662", "Lactel chocolat 1L",                            "Lactel",    "Lait chocolat\u00e9",   "brique", "1L",     "FR", 88],
    ["3596710443998", "St Mich crepe dentelle 100g",                   null,        "Cr\u00eape dentelle",   "paquet", "100g",   "FR", 71],
    ["8480000176349", "BONDUELLE haricots verts ex fins 220g bocal",   "Bonduelle", "Haricots verts ex.fins", "bocal",  "220g",   "FR", 95],
    ["3068320105024", "Evian 1.5L",                                    "Evian",     "Eau min\u00e9rale",     "btl",    "1,5L",   "FR", 91],
    ["3175680011497", "Cristaline source 1.5L",                        "CRISTALINE","Eau de source",         "btl",    "1,5L",   "FR", 96],
    ["3270190022018", "Coca cola classic 1.5L",                        "Coca-Cola", "Coca classic",           "btl",    "1,5L",  null, 95],
    ["3270190022025", "Coca zero canette 33cl x6",                     "Coca-Cola", "Coca Zero",              "lot",    "6\u00d733cl",null,89],
    ["3017620422027", "PANZANI macaroni 500g",                         "PANZANI",   "Macaroni",              "paquet", "500g",   "IT", 98],
    ["3017620422034", "PANZANI fusilli tricolore 500g",                "PANZANI",   "Fusilli tricolore",     "paquet", "500g",   "IT", 97],
    ["8001505005714", "BARILLA pesto genovese 190g",                   "BARILLA",   "Pesto genovese",        "bocal",  "190g",   "IT", 96],
    ["3245412000140", "La Laiti\u00e8re cr\u00e8me dessert choco 4\u00d7100g", "La Laiti\u00e8re", "Cr\u00e8me dessert chocolat", "pot", "4\u00d7100g","FR", 90],
    ["3245412000157", "La Laiti\u00e8re fromage blanc 1kg",            "La Laiti\u00e8re", "Fromage blanc", "pot",    "1kg",    "FR", 92],
    ["7622210449290", "LU prince chocolat 300g",                       "LU",        "Prince chocolat",        "paquet", "300g",   "FR", 96],
    ["7622210449306", "LU pim's orange 150g",                          "LU",        "Pim's orange",           "paquet", "150g",   "FR", 95],
    ["3245391105047", "President camembert 250g",                      "Pr\u00e9sident", "Camembert",        null,     "250g",   "FR", 88],
    ["3245391105054", "President emmental r\u00e2p\u00e9 200g",        "Pr\u00e9sident", "Emmental r\u00e2p\u00e9", "sachet", "200g","FR", 91],
    ["3596710443222", "Labeyrie blinis 8 piec.",                       "Labeyrie",  "Blinis",                 "paquet", "8 p\u00e8ces", "FR", 76],
    ["3596710443239", "Labeyrie tarama 200g",                          "Labeyrie",  "Tarama",                 "pot",    "200g",   "FR", 87],
    ["3110210132214", "Bonduelle haricots beurre 800g bocal",          "Bonduelle", "Haricots beurre",        "bocal",  "800g",   "FR", 94],
    ["3110210132221", "Bonduelle petits pois carottes 400g",           "Bonduelle", "Petits pois carottes",   "bocal",  "400g",   "FR", 95],
    ["3068320105031", "Evian sport 75cl",                              "Evian",     "Eau Sport",              "btl",    "75cl",   "FR", 89],
    ["3068320105048", "Evian Babies 1L",                               "Evian",     "Eau b\u00e9b\u00e9",     "btl",    "1L",     "FR", 86],
    ["3270190022032", "Coca light 1.5L",                               "Coca-Cola", "Coca Light",             "btl",    "1,5L",  null, 94],
    ["3270190022049", "Coca cherry 33cl x4",                           "Coca-Cola", "Coca Cherry",            "lot",    "4\u00d733cl",null, 82],
    ["3270570012352", "Ferrero raffaello 150g",                        "Ferrero",   "Raffaello",              "bo\u00eete", "150g","IT", 81],
    ["3270570012369", "Ferrero kinder bueno 6 barres",                 "Ferrero",   "Kinder Bueno",           "lot",    "6 barres","DE", 84],
    ["8000500310434", "Nutella biscuits 304g",                         "NUTELLA",   "Biscuits Nutella",       "paquet", "304g",   "IT", 92],
    ["8000500310441", "Nutella & Go 52g",                              "NUTELLA",   "Nutella & Go",           "pot",    "52g",    "IT", 91],
    ["3760127290124", "Bjorg lait amande 1L",                          "Bjorg",     "Lait amande bio",        "brique", "1L",     null, 89],
    ["3760127290131", "Bjorg c\u00e9r\u00e9ales chocolat\u00e9es 375g","Bjorg",     "C\u00e9r\u00e9ales choco",  "paquet", "375g",   null, 88],
    ["3245412000164", "Lait fraise candy 4\u00d7250ml",                null,        "Boisson lact\u00e9e fraise", null, "4\u00d7250ml",null, 62],
    ["3245412000171", "yaourt myrtille 4x125",                         null,        "Yaourt myrtille",        "pot",    "4\u00d7125g",null, 58],
    ["3245412000188", "fromage frais nature 6\u00d7100g",              null,        "Fromage frais nature",   "pot",    "6\u00d7100g",null, 64],
    ["3596710443246", "St Mich palmier 100g",                          null,        "Palmier",                "paquet", "100g",   null, 68],
    ["3596710443253", "St Mich madeleine longue 250g",                 null,        "Madeleine longue",       "paquet", "250g",   null, 72],
    ["3033710066679", "Lactel d\u00e9lice fraise 4\u00d7150g",         "Lactel",    "Boisson lact\u00e9e fraise", "pot","4\u00d7150g","FR", 87],
    ["3033710066686", "Lactel matin l\u00e9ger 1L",                    "Lactel",    "Lait Matin L\u00e9ger", "brique", "1L",     "FR", 90],
    ["7622210449313", "LU figolu 200g",                                "LU",        "Figolu",                 "paquet", "200g",   "FR", 92],
    ["7622210449320", "LU mikado chocolat lait 90g",                   "LU",        "Mikado chocolat lait",   "paquet", "90g",    "FR", 94],
    ["3245391105061", "President fromage \u00e0 raclette 400g",        "Pr\u00e9sident", "Fromage \u00e0 raclette", "sachet", "400g","FR", 90],
    ["3245391105078", "President beurre demi-sel 250g",                "Pr\u00e9sident", "Beurre demi-sel", "plaq",   "250g",   "FR", 96],
    ["3110210132238", "Bonduelle salade niceloise 320g",               "Bonduelle", "Salade ni\u00e7oise",    "bo\u00eete", "320g","FR", 80],
    ["8001505005721", "BARILLA tortellini ricotta 250g",               "BARILLA",   "Tortellini ricotta",     "paquet", "250g",   "IT", 93],
  ];

  const ROWS = RAW.map((r, i) => ({ id: i, ean: r[0], raw: r[1], brand: r[2], prod: r[3], cond: r[4], weight: r[5], origin: r[6], conf: r[7] }));

  const [activeCell, setActiveCell] = React.useState({ row: 5, col: "brand" });
  const [autofillCol, setAutofillCol] = React.useState(null);
  const [filledCells, setFilledCells] = React.useState({}); // \"id-col\" set to true if filled by AI

  const FAM = {
    brand:  { dot: "oklch(0.52 0.18 255)", soft: "oklch(0.96 0.04 255)", text: "oklch(0.34 0.16 255)" },
    prod:   { dot: "oklch(0.45 0.04 250)", soft: "#fafbfc",              text: C_TOKENS.text },
    cond:   { dot: "oklch(0.52 0.14 295)", soft: "oklch(0.96 0.04 295)", text: "oklch(0.34 0.13 295)" },
    weight: { dot: "oklch(0.52 0.14 295)", soft: "oklch(0.96 0.04 295)", text: "oklch(0.34 0.13 295)" },
    origin: { dot: "oklch(0.52 0.13 165)", soft: "oklch(0.95 0.05 165)", text: "oklch(0.34 0.12 165)" },
  };

  function confColor(c) {
    if (c >= 95) return { fg: "oklch(0.42 0.16 155)", bg: "oklch(0.95 0.05 155)", dot: "oklch(0.55 0.16 155)" };
    if (c >= 80) return { fg: "oklch(0.4 0.14 65)",   bg: "oklch(0.96 0.05 75)",  dot: "oklch(0.62 0.17 65)" };
    return            { fg: "oklch(0.45 0.18 25)",    bg: "oklch(0.96 0.04 25)",  dot: "oklch(0.55 0.2 25)" };
  }

  function autoFillColumn(colKey) {
    setAutofillCol(colKey);
    // After "delay", mark all empty cells in that col as filled.
    setTimeout(() => {
      setFilledCells(prev => {
        const next = { ...prev };
        ROWS.forEach(r => { if (!r[colKey]) next[`${r.id}-${colKey}`] = true; });
        return next;
      });
      setAutofillCol(null);
    }, 1200);
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
          <span style={{ color: C_TOKENS.textMuted }}>Structuration en grille</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 2px" }}>\u203a</span>
          <span style={{ fontWeight: 500 }}>Vue tableur</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>{ROWS.length} lignes \u00b7 8 421 dans la base</span>
        <button style={{ padding: "4px 10px", background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit" }}>Importer\u2026</button>
        <button style={{ padding: "4px 10px", background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit" }}>Exporter</button>
        <button style={{ padding: "4px 10px", background: C_TOKENS.accent, color: "#fff", border: "none", borderRadius: 3, fontSize: 11.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
          Sauvegarder
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ height: 36, padding: "0 14px", background: "#fff", borderBottom: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <button style={tbBtnD5}><I.upload size={12} /> Coller</button>
        <button style={tbBtnD5}><I.filter size={12} /> Filtrer</button>
        <button style={tbBtnD5}><I.sort size={12} /> Trier</button>
        <div style={{ width: 1, height: 18, background: C_TOKENS.border, margin: "0 4px" }} />
        <button style={tbBtnD5}><I.sparkle size={12} style={{ color: C_TOKENS.accent }} /> Auto-remplir s\u00e9lection</button>
        <button style={tbBtnD5}><I.refresh size={12} /> Re-analyser</button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>
          {Object.keys(filledCells).length} cellules auto-remplies
        </span>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflow: "auto", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 28 }} />
            <col style={{ width: 36 }} />
            {COLS.map((c, i) => <col key={i} style={{ width: c.w }} />)}
          </colgroup>
          <thead>
            {/* main header row */}
            <tr style={{ position: "sticky", top: 0, zIndex: 2 }}>
              <th style={thD5({ left: true })}></th>
              <th style={thD5()}></th>
              {COLS.map((c, i) => {
                const f = c.fam ? FAM[c.fam] : null;
                return (
                  <th key={i} style={thD5({ accent: f })}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "0 4px" }}>
                      {f && <span style={{ width: 5, height: 5, borderRadius: "50%", background: f.dot, flexShrink: 0 }} />}
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</span>
                      <I.chevronDown size={9} style={{ color: C_TOKENS.textSubtle, flexShrink: 0 }} />
                    </div>
                  </th>
                );
              })}
            </tr>
            {/* AI auto-fill row */}
            <tr style={{ position: "sticky", top: 22, zIndex: 2 }}>
              <th style={{ ...thD5(), height: 22, background: "oklch(0.97 0.04 250)", borderBottom: `1px solid ${C_TOKENS.border}`, padding: 0 }} colSpan={2}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 6px", color: C_TOKENS.accentText, fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4 }}>
                  <I.sparkle size={9} /> IA
                </div>
              </th>
              {COLS.map((c, i) => {
                const isFillable = c.fam && c.fam !== "prod";
                const isLoading = autofillCol === c.key;
                return (
                  <th key={i} style={{ ...thD5(), height: 22, background: "oklch(0.97 0.04 250)", borderBottom: `1px solid ${C_TOKENS.border}`, padding: 0 }}>
                    {isFillable ? (
                      <button onClick={() => autoFillColumn(c.key)} disabled={isLoading}
                        style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 4, padding: "0 6px",
                          background: "transparent", border: "none", cursor: isLoading ? "wait" : "pointer", color: C_TOKENS.accentText,
                          fontSize: 10, fontWeight: 600, fontFamily: "inherit" }}>
                        {isLoading ? (
                          <>
                            <I.refresh size={9} style={{ animation: "spin 1s linear infinite" }} />
                            <span>analyse\u2026</span>
                          </>
                        ) : (
                          <>
                            <I.sparkle size={9} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>auto-remplir</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span style={{ display: "block", padding: "0 6px", color: C_TOKENS.textSubtle, fontSize: 10 }}>\u2014</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, ri) => {
              const c = confColor(r.conf);
              const isActiveRow = ri === activeCell.row;
              return (
                <tr key={r.id} style={{ height: 24 }}>
                  <td style={{ ...tdD5({ leftFreeze: true }), background: isActiveRow ? C_TOKENS.accentSoft : C_TOKENS.headerBg, color: C_TOKENS.textMuted, fontSize: 10, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
                    {ri + 1}
                  </td>
                  <td style={{ ...tdD5(), textAlign: "center", padding: 0 }}>
                    <input type="checkbox" />
                  </td>
                  {COLS.map((col, ci) => {
                    const v = r[col.key];
                    const isActive = isActiveRow && activeCell.col === col.key;
                    const isFilled = filledCells[`${r.id}-${col.key}`];
                    const f = col.fam ? FAM[col.fam] : null;
                    let cellBg = "transparent";
                    if (ri % 2) cellBg = C_TOKENS.rowAlt;
                    if (isFilled) cellBg = "oklch(0.96 0.07 90)";
                    if (isActive) cellBg = "#fff";

                    if (col.key === "conf") {
                      return (
                        <td key={ci} onClick={() => setActiveCell({ row: ri, col: col.key })}
                          style={{ ...tdD5(), background: cellBg, padding: 0,
                            outline: isActive ? `2px solid ${C_TOKENS.accent}` : "none", outlineOffset: -2 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 6px", height: "100%" }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
                            <span style={{ fontFamily: C_TOKENS.mono, fontWeight: 700, color: c.fg, fontSize: 10.5 }}>{v}</span>
                          </div>
                        </td>
                      );
                    }

                    const isMissing = !v && col.key !== "raw" && col.key !== "ean";

                    return (
                      <td key={ci} onClick={() => setActiveCell({ row: ri, col: col.key })}
                        style={{ ...tdD5(), background: cellBg, padding: 0, position: "relative",
                          outline: isActive ? `2px solid ${C_TOKENS.accent}` : "none", outlineOffset: -2 }}>
                        <div style={{ padding: "0 6px", height: "100%", display: "flex", alignItems: "center", overflow: "hidden",
                          fontFamily: col.mono ? C_TOKENS.mono : "inherit",
                          fontSize: col.mono ? 10.5 : 11.5,
                          fontVariantNumeric: col.mono ? "tabular-nums" : "normal",
                          color: col.muted ? C_TOKENS.textMuted : (f ? f.text : C_TOKENS.text),
                          fontWeight: f && v && col.fam !== "prod" ? 600 : 400 }}>
                          {isMissing ? (
                            <span style={{ color: "oklch(0.6 0.18 25)", fontStyle: "italic", fontSize: 10.5 }}>\u2205</span>
                          ) : (
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
                          )}
                        </div>
                        {isFilled && (
                          <div style={{ position: "absolute", top: 2, right: 2, width: 5, height: 5, borderRadius: "50%", background: "oklch(0.55 0.18 90)" }} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div style={{ height: 26, padding: "0 14px", background: "#1c1f23", color: "#cdd0d4", borderTop: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 14, fontSize: 10.5, fontFamily: C_TOKENS.mono, flexShrink: 0 }}>
        <span>L{activeCell.row + 1} \u00b7 {activeCell.col.toUpperCase()}</span>
        <span style={{ color: "oklch(0.6 0.16 155)" }}>\u25cf {ROWS.length} lignes</span>
        <span style={{ color: "oklch(0.7 0.05 250)" }}>{Math.round(ROWS.reduce((a, r) => a + r.conf, 0) / ROWS.length)}% conf. moyenne</span>
        <span style={{ color: "oklch(0.6 0.18 90)" }}>{Object.keys(filledCells).length} cellules IA</span>
        <div style={{ flex: 1 }} />
        <span>auto-save \u00b7 il y a 4s</span>
        <span>Mme Lef\u00e8vre</span>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const tbBtnD5 = {
  display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 8px",
  background: "transparent", border: "1px solid transparent", borderRadius: 3,
  fontSize: 11.5, color: C_TOKENS.text, cursor: "pointer", fontFamily: "inherit",
};

function thD5({ left, accent } = {}) {
  return {
    height: 22, padding: 0, background: C_TOKENS.headerBg,
    borderBottom: `1px solid ${C_TOKENS.borderStrong || C_TOKENS.border}`,
    borderRight: `1px solid ${C_TOKENS.border}`,
    fontSize: 10.5, color: C_TOKENS.text, fontWeight: 600, textAlign: "left",
    position: left ? "sticky" : "static", left: left ? 0 : "auto", zIndex: left ? 3 : 1,
    borderTop: accent ? `2px solid ${accent.dot}` : "none",
  };
}

function tdD5({ leftFreeze } = {}) {
  return {
    height: 24, padding: 0,
    borderRight: `1px solid ${C_TOKENS.border}`,
    borderBottom: `1px solid ${C_TOKENS.border}`,
    position: leftFreeze ? "sticky" : "static",
    left: leftFreeze ? 0 : "auto",
    zIndex: leftFreeze ? 1 : "auto",
  };
}

window.SpreadsheetD5 = SpreadsheetD5;
