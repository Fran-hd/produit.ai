// Variation D6 — Spreadsheet IA (mix D2 + D5)
// Tableau ultra-dense où chaque colonne montre la suggestion IA inline avec confiance.
// Clic ligne → panneau latéral détaillé (15 segments groupés par famille, signaux IA, J/K/Y/N).

function SpreadsheetAID6() {
  // Reuse the same SEED structure as D2 (15-segment model)
  const SEED = [
    { ean: "3017620422003", raw: "PANZANI Coquillettes pqt 500g",                conf: 99, brand: "PANZANI",     prod: "Coquillettes",            cond: "paquet", weight: "500g",     origin: "IT", conserv: "ambiant" },
    { ean: "3228857000852", raw: "Harrys baguette tradition fr 250g",             conf: 87, brand: "Harrys",      prod: "Baguette",                cond: null,     weight: "250g",     origin: "FR", qualif: "tradition", conserv: "frais" },
    { ean: "3175680011480", raw: "HEINEKEN biere lager 12X25cl",                  conf: 96, brand: "HEINEKEN",    prod: "Bière lager",            cond: "pack",   weight: "3L",       origin: "NL", qty: "×12", unitformat: "25cl", conserv: "ambiant" },
    { ean: "3560070976478", raw: "Filet poulet ferm Loué 2x120g",                 conf: 84, brand: "Loué",        prod: "Filet de poulet",         cond: "barquette", weight: "240g", origin: "FR", qualif: "fermier", qty: "×2", unitformat: "120g", conserv: "frais" },
    { ean: "8001505005707", raw: "Spaghetti N°5 500g BARILLA",                    conf: 96, brand: "BARILLA",     prod: "Spaghetti",               cond: "paquet", weight: "500g",     origin: "IT", variety: "n°5", conserv: "ambiant" },
    { ean: "3245412000133", raw: "La Laitière yaourt nat 4x125g",                 conf: 92, brand: "La Laitière", prod: "Yaourt nature",           cond: "pot",    weight: "500g",     origin: "FR", qty: "×4", unitformat: "125g", conserv: "frais" },
    { ean: "3017760123457", raw: "Café grains arabica 1kg carte noire",           conf: 73, brand: "Carte Noire", prod: "Café arabica",            cond: "paquet", weight: "1kg",      origin: null, texture: "en grains", conserv: "ambiant" },
    { ean: "3596710443215", raw: "Gigot agneau Bigoot 1.8kg origine NZ",            conf: 84, brand: "Bigoot",      prod: "Gigot d'agneau",         cond: "pièce",  weight: "1,8kg",    origin: "NZ", conserv: "frais" },
    { ean: "8076809513753", raw: "MUTTI sauce tomate basilic 400g",               conf: 99, brand: "MUTTI",       prod: "Sauce tomate basilic",    cond: "bocal",  weight: "400g",     origin: "IT", flavor: "basilic", conserv: "ambiant" },
    { ean: "3033710065165", raw: "Lactel ½ écrémé UHT 6x1L",                       conf: 95, brand: "Lactel",      prod: "Lait ½ écr UHT",           cond: "pack",   weight: "6L",       origin: "FR", qty: "×6", unitformat: "1L", conserv: "ambiant" },
    { ean: "7622210449283", raw: "Lu petit beurre 200g",                          conf: 94, brand: "LU",          prod: "Petit beurre",            cond: "paquet", weight: "200g",     origin: "FR", conserv: "ambiant" },
    { ean: "3110210132207", raw: "Bonduelle maïs doux 3x150g",                    conf: 91, brand: "Bonduelle",   prod: "Maïs doux",               cond: "lot",    weight: "450g",     origin: null, qty: "×3", unitformat: "150g", conserv: "ambiant" },
    { ean: "3068320105017", raw: "Evian eau plate 6x1.5L",                        conf: 98, brand: "Evian",       prod: "Eau minérale plate",      cond: "pack",   weight: "9L",       origin: "FR", qty: "×6", unitformat: "1,5L", conserv: "ambiant" },
    { ean: "3270190022001", raw: "COCA-COLA light 6X1.25L",                       conf: 96, brand: "Coca-Cola",   prod: "Coca light",              cond: "pack",   weight: "7,5L",    origin: null, qty: "×6", unitformat: "1,25L", claim: "light", conserv: "ambiant" },
    { ean: "3245391105030", raw: "President beurre doux 250g",                    conf: 96, brand: "Président",   prod: "Beurre",                  cond: "plaq.",  weight: "250g",     origin: "FR", qualif: "doux", conserv: "frais" },
    { ean: "3270570012345", raw: "KINDER Surprise edition Noel x4",                conf: 88, brand: "KINDER",      prod: "Surprise Noël",           cond: "boîte",  weight: "80g",      origin: "IT", qty: "×4", conserv: "ambiant" },
    { ean: "8000500310427", raw: "Nutella pâte à tartiner 750g",                  conf: 99, brand: "NUTELLA",     prod: "Pâte à tartiner",         cond: "pot",    weight: "750g",     origin: "IT", flavor: "noisette", conserv: "ambiant" },
    { ean: "3017620425035", raw: "Panzani penne rigate 500g",                     conf: 98, brand: "PANZANI",     prod: "Penne",                   cond: "paquet", weight: "500g",     origin: "IT", variety: "rigate", conserv: "ambiant" },
    { ean: "3760127290117", raw: "Bjorg muesli bio 750g",                         conf: 94, brand: "Bjorg",       prod: "Muesli",                  cond: "paquet", weight: "750g",     origin: null, qualif: "bio", label: "Bio EU", conserv: "ambiant" },
    { ean: "3245412888777", raw: "yaourt nature 4x125",                           conf: 54, brand: null,          prod: "Yaourt nature",           cond: "pot",    weight: "500g",     origin: null, qty: "×4", unitformat: "125g", conserv: "frais" },
    { ean: "3033710066662", raw: "Lactel chocolat 1L",                            conf: 88, brand: "Lactel",      prod: "Lait chocolaté",          cond: "brique", weight: "1L",       origin: "FR", flavor: "chocolat", conserv: "ambiant" },
    { ean: "3596710443998", raw: "BRIDEL Ma Mozzarella tranches 200g x12",           conf: 91, brand: "BRIDEL",      prod: "Mozzarella tranches",     cond: "sachet", weight: "200g",     origin: "FR", qty: "×12", conserv: "frais" },
    { ean: "8480000176349", raw: "BONDUELLE haricots verts ex fins 220g bocal",   conf: 95, brand: "Bonduelle",   prod: "Haricots verts",          cond: "bocal",  weight: "220g",     origin: "FR", qualif: "extra-fins", conserv: "ambiant" },
    { ean: "3068320105024", raw: "Evian 1.5L",                                    conf: 91, brand: "Evian",       prod: "Eau minérale",            cond: "btl",    weight: "1,5L",     origin: "FR", conserv: "ambiant" },
    { ean: "3245412000234", raw: "Lait fraise candy nesquik 250ml x4",            conf: 62, brand: null,          prod: "Boisson lactée",          cond: null,     weight: "1L",       origin: null, qty: "×4", unitformat: "250ml", flavor: "fraise" },
    { ean: "3270190022018", raw: "Coca cola classic 1.5L",                        conf: 95, brand: "Coca-Cola",   prod: "Coca classic",            cond: "btl",    weight: "1,5L",     origin: null, conserv: "ambiant" },
    { ean: "3017620422027", raw: "PANZANI macaroni 500g",                         conf: 98, brand: "PANZANI",     prod: "Macaroni",                cond: "paquet", weight: "500g",     origin: "IT", conserv: "ambiant" },
    { ean: "3017620422034", raw: "PANZANI fusilli tricolore 500g",                conf: 97, brand: "PANZANI",     prod: "Fusilli tricolore",       cond: "paquet", weight: "500g",     origin: "IT", conserv: "ambiant" },
    { ean: "8001505005714", raw: "BARILLA pesto genovese 190g",                   conf: 96, brand: "BARILLA",     prod: "Pesto genovese",          cond: "bocal",  weight: "190g",     origin: "IT", flavor: "basilic", conserv: "ambiant" },
    { ean: "3245412000140", raw: "La Laitière crème dessert choco 4×100g",        conf: 90, brand: "La Laitière", prod: "Crème dessert chocolat",  cond: "pot",    weight: "400g",     origin: "FR", qty: "×4", unitformat: "100g", flavor: "chocolat", conserv: "frais" },
    { ean: "7622210449290", raw: "LU prince chocolat 300g",                       conf: 96, brand: "LU",          prod: "Prince chocolat",         cond: "paquet", weight: "300g",     origin: "FR", flavor: "chocolat", conserv: "ambiant" },
    { ean: "3245391105047", raw: "Reblochon Savoie fermier 450g",                  conf: 88, brand: "La Tournette",  prod: "Reblochon de Savoie",     cond: "meule",  weight: "450g",     origin: "FR", qualif: "fermier", label: "AOP", conserv: "frais" },
    { ean: "3245391105054", raw: "ENTREMONT Emmental rape francais 500g",            conf: 95, brand: "ENTREMONT",   prod: "Emmental râpé",           cond: "sachet", weight: "500g",     origin: "FR", conserv: "frais" },
    { ean: "3596710443222", raw: "Mimolette 3 mois affinage 220g",                  conf: 81, brand: "Isigny Ste-Mère", prod: "Mimolette 3 mois",       cond: "part",   weight: "220g",     origin: "FR", qualif: "affinée", conserv: "frais" },
    { ean: "3110210132214", raw: "Bonduelle haricots beurre 800g bocal",          conf: 94, brand: "Bonduelle",   prod: "Haricots beurre",         cond: "bocal",  weight: "800g",     origin: "FR", conserv: "ambiant" },
    { ean: "3068320105031", raw: "Evian sport 75cl",                              conf: 89, brand: "Evian",       prod: "Eau Sport",               cond: "btl",    weight: "75cl",     origin: "FR", conserv: "ambiant" },
    { ean: "3270570012352", raw: "Ferrero raffaello 150g",                        conf: 81, brand: "Ferrero",     prod: "Raffaello",               cond: "boîte",  weight: "150g",     origin: "IT", conserv: "ambiant" },
    { ean: "8000500310434", raw: "Nutella biscuits 304g",                         conf: 92, brand: "NUTELLA",     prod: "Biscuits Nutella",        cond: "paquet", weight: "304g",     origin: "IT", conserv: "ambiant" },
    { ean: "3760127290124", raw: "Bjorg lait amande 1L",                          conf: 89, brand: "Bjorg",       prod: "Lait amande bio",         cond: "brique", weight: "1L",       origin: null, qualif: "bio", label: "Bio EU", conserv: "ambiant" },
    { ean: "3245412000164", raw: "Lait fraise candy 4×250ml",                     conf: 62, brand: null,          prod: "Boisson lactée fraise",   cond: null,     weight: "1L",       origin: null, qty: "×4", unitformat: "250ml", flavor: "fraise" },
    { ean: "3245412000171", raw: "yaourt myrtille 4x125",                         conf: 58, brand: null,          prod: "Yaourt myrtille",         cond: "pot",    weight: "500g",     origin: null, qty: "×4", unitformat: "125g", flavor: "myrtille", conserv: "frais" },
    { ean: "3245412000188", raw: "fromage frais nature 6×100g",                   conf: 64, brand: null,          prod: "Fromage frais nature",    cond: "pot",    weight: "600g",     origin: null, qty: "×6", unitformat: "100g", conserv: "frais" },
    { ean: "3596710443246", raw: "St Mich palmier 100g",                          conf: 68, brand: null,          prod: "Palmier",                 cond: "paquet", weight: "100g",     origin: "FR", conserv: "ambiant" },
    { ean: "3033710066679", raw: "Lactel délice fraise 4×150g",                   conf: 87, brand: "Lactel",      prod: "Boisson lactée fraise",   cond: "pot",    weight: "600g",     origin: "FR", qty: "×4", unitformat: "150g", flavor: "fraise", conserv: "frais" },
    { ean: "3033710066686", raw: "Lactel matin léger 1L",                         conf: 90, brand: "Lactel",      prod: "Lait Matin Léger",        cond: "brique", weight: "1L",       origin: "FR", conserv: "ambiant" },
    { ean: "7622210449313", raw: "LU figolu 200g",                                conf: 92, brand: "LU",          prod: "Figolu",                  cond: "paquet", weight: "200g",     origin: "FR", conserv: "ambiant" },
    { ean: "7622210449320", raw: "LU mikado chocolat lait 90g",                   conf: 94, brand: "LU",          prod: "Mikado",                  cond: "paquet", weight: "90g",      origin: "FR", flavor: "chocolat lait", conserv: "ambiant" },
    { ean: "3245391105061", raw: "President fromage à raclette 400g",             conf: 90, brand: "Président",   prod: "Fromage à raclette",      cond: "sachet", weight: "400g",     origin: "FR", conserv: "frais" },
    { ean: "3245391105078", raw: "President beurre demi-sel 250g",                conf: 96, brand: "Président",   prod: "Beurre demi-sel",         cond: "plaq.", weight: "250g",      origin: "FR", qualif: "demi-sel", conserv: "frais" },
    { ean: "3110210132238", raw: "Bonduelle salade niceloise 320g",               conf: 80, brand: "Bonduelle",   prod: "Salade niçoise",          cond: "boîte",  weight: "320g",     origin: "FR", conserv: "ambiant" },
    { ean: "8001505005721", raw: "BARILLA tortellini ricotta 250g",               conf: 93, brand: "BARILLA",     prod: "Tortellini ricotta",      cond: "paquet", weight: "250g",     origin: "IT", flavor: "ricotta", conserv: "frais" },
    { ean: "3245412000195", raw: "creme dessert vanille 4x100",                   conf: 60, brand: null,          prod: "Crème dessert vanille",   cond: "pot",    weight: "400g",     origin: null, qty: "×4", unitformat: "100g", flavor: "vanille", conserv: "frais" },
    { ean: "3033710066693", raw: "Lactel ribot 1L",                               conf: 85, brand: "Lactel",      prod: "Lait ribot",              cond: "brique", weight: "1L",       origin: "FR", conserv: "frais" },
    { ean: "3270190022056", raw: "Coca cola sans cafeine 1.5L",                   conf: 88, brand: "Coca-Cola",   prod: "Coca sans caféine",       cond: "btl",    weight: "1,5L",     origin: null, claim: "sans caféine", conserv: "ambiant" },
    { ean: "8000500310458", raw: "Kinder schoko bons 200g",                       conf: 79, brand: "Ferrero",     prod: "Schoko-Bons",             cond: "sachet", weight: "200g",     origin: "DE", conserv: "ambiant" },
    { ean: "7622210449337", raw: "LU palmito 200g",                               conf: 90, brand: "LU",          prod: "Palmito",                 cond: "paquet", weight: "200g",     origin: "FR", conserv: "ambiant" },
    { ean: "3245391105085", raw: "President chevre frais 100g",                   conf: 84, brand: "Président",   prod: "Chèvre frais",            cond: null,     weight: "100g",     origin: "FR", conserv: "frais" },
    { ean: "3110210132245", raw: "Bonduelle champignons 230g",                    conf: 92, brand: "Bonduelle",   prod: "Champignons",             cond: "bocal",  weight: "230g",     origin: null, conserv: "ambiant" },
    { ean: "3760127290148", raw: "Bjorg compote pomme 4x100g",                    conf: 88, brand: "Bjorg",       prod: "Compote pomme bio",       cond: "gourde", weight: "400g",     origin: null, qty: "×4", unitformat: "100g", qualif: "bio", label: "Bio EU", conserv: "ambiant" },
    { ean: "3270570012383", raw: "ferrero kinder maxi 21g x10",                   conf: 76, brand: "Ferrero",     prod: "Kinder Maxi",             cond: "lot",    weight: "210g",     origin: "DE", qty: "×10", unitformat: "21g", conserv: "ambiant" },
    { ean: "3245412000201", raw: "fromage blanc 0% 4x125g",                       conf: 66, brand: null,          prod: "Fromage blanc 0%",        cond: "pot",    weight: "500g",     origin: null, qty: "×4", unitformat: "125g", claim: "0% MG", conserv: "frais" },
    { ean: "3596710443260", raw: "Labeyrie foie gras canard mi-cuit 180g",        conf: 86, brand: "Labeyrie",    prod: "Foie gras canard",        cond: "verrine", weight: "180g",    origin: "FR", qualif: "mi-cuit", conserv: "frais" },
    { ean: "3068320105055", raw: "Evian 50cl x12",                                conf: 90, brand: "Evian",       prod: "Eau minérale",            cond: "lot",    weight: "6L",       origin: "FR", qty: "×12", unitformat: "50cl", conserv: "ambiant" },
  ];

  const FAM = {
    identite:   { dot: "oklch(0.52 0.18 255)", soft: "oklch(0.94 0.05 255)", text: "oklch(0.34 0.16 255)", label: "Identité" },
    qualif:     { dot: "oklch(0.55 0.16 35)",  soft: "oklch(0.95 0.05 35)",  text: "oklch(0.38 0.15 35)",  label: "Qualifiant" },
    emballage:  { dot: "oklch(0.52 0.14 295)", soft: "oklch(0.94 0.05 295)", text: "oklch(0.34 0.13 295)", label: "Emballage" },
    caract:     { dot: "oklch(0.52 0.13 165)", soft: "oklch(0.93 0.06 165)", text: "oklch(0.34 0.12 165)", label: "Caractéristiques" },
    service:    { dot: "oklch(0.45 0.04 250)", soft: "#f1f3f5",              text: C_TOKENS.text,          label: "Service" },
  };

  const SEGMENTS = [
    { key: "brand",       fam: "identite",  label: "Marque" },
    { key: "prod",        fam: "identite",  label: "Désignation" },
    { key: "submark",     fam: "identite",  label: "Sous-marque" },
    { key: "variety",     fam: "identite",  label: "N° variété" },
    { key: "qualif",      fam: "qualif",    label: "Qualifiant" },
    { key: "label",       fam: "qualif",    label: "Label / Certif." },
    { key: "claim",       fam: "qualif",    label: "Allégation" },
    { key: "cond",        fam: "emballage", label: "Conditionnement" },
    { key: "weight",      fam: "emballage", label: "Poids / Volume" },
    { key: "qty",         fam: "emballage", label: "Quantité pièces" },
    { key: "unitformat",  fam: "emballage", label: "Format unitaire" },
    { key: "origin",      fam: "caract",    label: "Origine" },
    { key: "flavor",      fam: "caract",    label: "Saveur / Parfum" },
    { key: "texture",     fam: "caract",    label: "Texture / forme" },
    { key: "conserv",     fam: "service",   label: "Conservation" },
  ];

  // Columns visible in the spreadsheet (subset of segments — most informative)
  const COLS = [
    { key: "brand",      label: "Marque",        w: 105, fam: "identite" },
    { key: "prod",       label: "Désignation",   w: 175, fam: "identite" },
    { key: "qualif",     label: "Qualifiant",    w: 95,  fam: "qualif" },
    { key: "cond",       label: "Cond.",         w: 75,  fam: "emballage" },
    { key: "weight",     label: "Poids/Vol.",    w: 75,  fam: "emballage", mono: true },
    { key: "qty",        label: "Qté",           w: 50,  fam: "emballage", mono: true },
    { key: "origin",     label: "Orig.",         w: 50,  fam: "caract", mono: true },
    { key: "flavor",     label: "Saveur",        w: 90,  fam: "caract" },
  ];

  const [sortKey, setSortKey] = React.useState("conf");
  const [sortDir, setSortDir] = React.useState("asc"); // asc = lowest confidence first
  const [filter, setFilter] = React.useState("review"); // review | low | high | all
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [focusedFieldKey, setFocusedFieldKey] = React.useState(null); // key of currently keyboard-focused segment field, or null
  const [decisions, setDecisions] = React.useState({});
  const [fieldDecisions, setFieldDecisions] = React.useState({}); // { [rowId]: { [fieldKey]: 'y' | 'n' } }
  const setFieldDecision = React.useCallback((rowId, fieldKey, val) => {
    setFieldDecisions(d => {
      const row = { ...(d[rowId] || {}) };
      if (val == null) delete row[fieldKey];
      else row[fieldKey] = val;
      return { ...d, [rowId]: row };
    });
  }, []);
  const [structView, setStructView] = React.useState("all");
  const [collapsedFams, setCollapsedFams] = React.useState({});
  const [panelOpen, setPanelOpen] = React.useState(true);

  const initialAll = React.useMemo(() => SEED.map((s, j) => ({ ...s, id: `r-${j}` })), []);
  const [edits, setEdits] = React.useState({}); // id -> partial overrides
  const ALL = React.useMemo(() => initialAll.map(r => ({ ...r, ...(edits[r.id] || {}) })), [initialAll, edits]);

  const setField = React.useCallback((id, key, val) => {
    setEdits(e => ({ ...e, [id]: { ...(e[id] || {}), [key]: val === "" ? null : val } }));
  }, []);

  // Option dictionaries for select cells.
  // Brand and Désignation pull from the live data + a curated reference list,
  // de-duped, so the user can pick any existing value or scroll the catalog.
  const OPTIONS = React.useMemo(() => {
    const brandsFromData = Array.from(new Set(SEED.map(r => r.brand).filter(Boolean)));
    const brandsRef = [
      "Président", "Lactel", "Yoplait", "Danone", "Activia", "Nestlé", "Nesquik", "Ricoré",
      "Bonne Maman", "St Mamet", "Andros", "Materne", "Charles & Alice",
      "Lustucru", "Panzani", "Barilla", "Buitoni", "Rana",
      "Coca-Cola", "Orangina", "Schweppes", "Evian", "Cristaline", "Volvic", "Badoit",
      "Lindt", "Lu", "Belin", "Bjorg", "Saint Hubert", "Elle & Vire",
      "Findus", "Picard", "Père Dodu", "Le Gaulois", "Fleury Michon",
      "Herta", "Justin Bridou", "Aoste", "Madrange",
      "Tipiak", "St Michel", "Brossard", "Pasquier", "Harrys",
      "Carrefour", "Marque Repère", "U", "Auchan", "Monoprix Gourmet",
      "Sans marque",
    ];
    const prodsFromData = Array.from(new Set(SEED.map(r => r.prod).filter(Boolean)));
    const prodsRef = [
      "Lait", "Yaourt", "Fromage blanc", "Crème fraîche", "Beurre", "Petit-suisse",
      "Œufs", "Jambon", "Saucisson", "Poulet rôti", "Saumon fumé",
      "Pâtes", "Riz", "Semoule", "Quinoa", "Lentilles", "Haricots",
      "Sauce tomate", "Pesto", "Mayonnaise", "Moutarde", "Vinaigrette",
      "Pain de mie", "Biscottes", "Céréales", "Muesli", "Petit beurre",
      "Eau plate", "Eau gazeuse", "Jus d'orange", "Soda", "Cola",
      "Café", "Thé", "Chocolat en poudre", "Pâte à tartiner",
      "Chocolat", "Bonbons", "Glace", "Sorbet",
      "Conserve de légumes", "Fruits au sirop", "Compote",
      "Pizza", "Plat préparé", "Légumes surgelés",
    ];
    return {
      brand: Array.from(new Set([...brandsFromData, ...brandsRef])).sort((a, b) => a.localeCompare(b)),
      prod:  Array.from(new Set([...prodsFromData, ...prodsRef])).sort((a, b) => a.localeCompare(b)),
      cond: ["paquet", "pack", "lot", "pot", "bocal", "bouteille", "btl", "boîte", "barquette", "brique", "sachet", "plaq.", "verrine", "gourde"],
      origin: ["FR", "IT", "ES", "DE", "BE", "PT", "GR", "UK", "UE", "Hors UE"],
      conserv: ["ambiant", "frais", "surgelé", "épicerie sèche"],
      qualif: ["bio", "fermier", "tradition", "extra-fins", "doux", "demi-sel", "mi-cuit", "plein air", "AOP", "label rouge"],
      flavor: ["chocolat", "vanille", "fraise", "myrtille", "noisette", "basilic", "ricotta", "nature", "menthe", "caramel"],
      label: ["Bio EU", "AOP", "AOC", "IGP", "Label Rouge", "MSC", "Fairtrade", "Demeter", "ASC"],
      texture: ["en grains", "moulu", "instantané", "soluble", "concentré", "en morceaux", "fluide"],
    };
  }, []);

  const filtered = React.useMemo(() => {
    let rows = ALL.filter(r => {
      const d = decisions[r.id];
      if (d === "y" || d === "n") return false;
      if (filter === "review") return r.conf < 95;
      if (filter === "low") return r.conf < 80;
      if (filter === "high") return r.conf >= 95;
      return true;
    });
    rows = [...rows].sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number") return sortDir === "asc" ? va - vb : vb - va;
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
    return rows;
  }, [ALL, filter, decisions, sortKey, sortDir]);

  const current = filtered[activeIdx];

  // Reset focused field when row changes
  React.useEffect(() => { setFocusedFieldKey(null); }, [current && current.id]);

  // Ordered list of focusable segment keys in the right panel — respects
  // family order, the structView filter (all/found/missing), and collapsed families.
  const visibleFieldKeys = React.useMemo(() => {
    if (!current) return [];
    const famOrder = ["identite", "qualif", "emballage", "caract", "service"];
    const byFam = {};
    SEGMENTS.forEach(s => { (byFam[s.fam] = byFam[s.fam] || []).push(s); });
    const out = [];
    famOrder.forEach(fk => {
      if (collapsedFams[fk]) return;
      const segs = byFam[fk] || [];
      segs.forEach(s => {
        const v = current[s.key];
        if (structView === "found" && !v) return;
        if (structView === "missing" && v) return;
        out.push(s.key);
      });
    });
    return out;
  }, [current, structView, collapsedFams]);

  React.useEffect(() => {
    function onKey(e) {
      if (!current) return;
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;

      const inPanel = panelOpen && focusedFieldKey != null;

      // Field-level navigation when a panel field is focused
      if (inPanel) {
        const idx = visibleFieldKeys.indexOf(focusedFieldKey);
        if (e.key === "ArrowDown" || e.key === "j") {
          e.preventDefault();
          if (idx < visibleFieldKeys.length - 1) setFocusedFieldKey(visibleFieldKeys[idx + 1]);
          else setFocusedFieldKey(null); // exit panel focus, fall back to row nav
          return;
        }
        if (e.key === "ArrowUp" || e.key === "k") {
          e.preventDefault();
          if (idx > 0) setFocusedFieldKey(visibleFieldKeys[idx - 1]);
          else setFocusedFieldKey(null);
          return;
        }
        if (e.key === "Tab") {
          e.preventDefault();
          const dir = e.shiftKey ? -1 : 1;
          const ni = idx + dir;
          if (ni >= 0 && ni < visibleFieldKeys.length) setFocusedFieldKey(visibleFieldKeys[ni]);
          return;
        }
        if (e.key === "y" || e.key === "Y") {
          e.preventDefault();
          if (current[focusedFieldKey]) setFieldDecision(current.id, focusedFieldKey, "y");
          // auto-advance to next field
          const ni = idx + 1;
          if (ni < visibleFieldKeys.length) setFocusedFieldKey(visibleFieldKeys[ni]);
          return;
        }
        if (e.key === "n" || e.key === "N") {
          e.preventDefault();
          if (current[focusedFieldKey]) setFieldDecision(current.id, focusedFieldKey, "n");
          const ni = idx + 1;
          if (ni < visibleFieldKeys.length) setFocusedFieldKey(visibleFieldKeys[ni]);
          return;
        }
        if (e.key === "u" || e.key === "U") {
          e.preventDefault();
          setFieldDecision(current.id, focusedFieldKey, null);
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setFocusedFieldKey(null);
          return;
        }
        // Enter handled by the field itself (opens edit)
        return;
      }

      // Row-level navigation (no field focused)
      if (e.key === "ArrowDown" || e.key === "j") {
        setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); e.preventDefault();
      }
      else if (e.key === "ArrowUp" || e.key === "k") {
        setActiveIdx(i => Math.max(i - 1, 0)); e.preventDefault();
      }
      else if (e.key === "ArrowRight" || e.key === "l") {
        // Enter the panel — focus first visible field
        if (panelOpen && visibleFieldKeys.length) {
          setFocusedFieldKey(visibleFieldKeys[0]);
          e.preventDefault();
        }
      }
      else if (e.key === "y" || e.key === "Y") { setDecisions(d => ({ ...d, [current.id]: "y" })); }
      else if (e.key === "n" || e.key === "N") { setDecisions(d => ({ ...d, [current.id]: "n" })); }
      else if (e.key === "u" || e.key === "U") { setDecisions(d => ({ ...d, [current.id]: "u" })); }
      else if (e.key === "Escape") { setPanelOpen(false); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, filtered.length, panelOpen, focusedFieldKey, visibleFieldKeys, setFieldDecision]);

  const stats = {
    total: ALL.length,
    auto: ALL.filter(r => r.conf >= 95).length,
    review: ALL.filter(r => r.conf >= 80 && r.conf < 95).length,
    low: ALL.filter(r => r.conf < 80).length,
    decided: Object.keys(decisions).length,
  };

  function confColor(c) {
    if (c >= 95) return { fg: "oklch(0.42 0.16 155)", bg: "oklch(0.94 0.07 155)", dot: "oklch(0.55 0.16 155)" };
    if (c >= 80) return { fg: "oklch(0.4 0.14 65)",   bg: "oklch(0.95 0.08 75)",  dot: "oklch(0.62 0.17 65)" };
    return            { fg: "oklch(0.45 0.18 25)",    bg: "oklch(0.95 0.06 25)",  dot: "oklch(0.55 0.2 25)" };
  }

  // Per-segment confidence — deterministic per (row, segKey), distributed around row.conf
  // with a stable jitter so each row shows a varied profile (some greens, some oranges, some reds).
  function segConf(row, segKey) {
    const v = row[segKey];
    if (v == null || v === "") return null;
    // Stable hash on rowId + segKey → integer 0..99
    const seed = (row.id || "") + "|" + segKey;
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
    const noise = Math.abs(h) % 35; // 0..34
    // Per-segment difficulty bias — some fields are easier to extract than others
    const easy = { origin: +6, qty: +5, weight: +3, cond: +2, ean: +6 };
    const hard = { flavor: -10, qualif: -8, claim: -7, texture: -7, submark: -6, variety: -5, conserv: -4, prod: -2 };
    const bias = easy[segKey] || hard[segKey] || 0;
    // Shape: anchor on row.conf, spread ±17 with an asymmetric pull toward bias
    let c = row.conf - 12 + noise + bias;
    return Math.max(55, Math.min(99, c));
  }

  // Stable hash → hue, gives each brand a recognizable but soft color
  function hashHue(s) {
    let h = 0;
    for (let i = 0; i < (s || "").length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return Math.abs(h) % 360;
  }

  function thumbStyle(brand) {
    const hue = hashHue(brand || "?");
    return {
      bg: `oklch(0.92 0.05 ${hue})`,
      fg: `oklch(0.38 0.14 ${hue})`,
      ring: `oklch(0.78 0.08 ${hue})`,
    };
  }

  function brandInitials(brand) {
    if (!brand) return "?";
    const words = brand.replace(/[^\p{L}\s-]/gu, "").split(/[\s-]+/).filter(Boolean);
    if (!words.length) return "?";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  // Tiny SVG icon by category — derived from prod label keywords
  function categoryGlyph(prod) {
    const p = (prod || "").toLowerCase();
    if (/eau|cola|jus|boisson|lait/.test(p))      return "bottle";
    if (/yaourt|fromage|beurre|crème/.test(p))    return "tub";
    if (/poulet|saumon|viande|poisson/.test(p))   return "tray";
    if (/pain|baguette|biscuit|muesli|céréale|petit beurre/.test(p)) return "loaf";
    if (/chocolat|nutella|tartiner|rocher|pâte/.test(p)) return "jar";
    if (/sauce|tomate|maïs|conserve/.test(p))     return "can";
    if (/café|thé/.test(p))                       return "bag";
    return "box";
  }

  function ThumbGlyph({ kind, color, size = 16 }) {
    const s = { style: { width: size, height: size, color, flexShrink: 0 } };
    const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
    if (kind === "bottle") return <svg {...s} viewBox="0 0 24 24"><g {...stroke}><path d="M10 3h4v3l1 2v11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8l1-2V3z"/></g></svg>;
    if (kind === "tub")    return <svg {...s} viewBox="0 0 24 24"><g {...stroke}><path d="M5 8h14l-1 11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 8zM4 8h16M9 5h6"/></g></svg>;
    if (kind === "tray")   return <svg {...s} viewBox="0 0 24 24"><g {...stroke}><rect x="3" y="9" width="18" height="9" rx="1.5"/><path d="M3 13h18"/></g></svg>;
    if (kind === "loaf")   return <svg {...s} viewBox="0 0 24 24"><g {...stroke}><path d="M4 13c0-3 4-5 8-5s8 2 8 5v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5z"/><path d="M8 12v6M12 12v6M16 12v6"/></g></svg>;
    if (kind === "jar")    return <svg {...s} viewBox="0 0 24 24"><g {...stroke}><path d="M7 4h10v3H7zM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7z"/></g></svg>;
    if (kind === "can")    return <svg {...s} viewBox="0 0 24 24"><g {...stroke}><ellipse cx="12" cy="6" rx="6" ry="2"/><path d="M6 6v12c0 1.1 2.7 2 6 2s6-.9 6-2V6"/></g></svg>;
    if (kind === "bag")    return <svg {...s} viewBox="0 0 24 24"><g {...stroke}><path d="M7 6h10l-1 14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1L7 6zM7 6V4h10v2"/></g></svg>;
    return <svg {...s} viewBox="0 0 24 24"><g {...stroke}><rect x="4" y="6" width="16" height="14" rx="1.5"/><path d="M4 10h16"/></g></svg>;
  }

  // Local product photos by EAN — drop files in photos/<ean>.{jpg,png,webp} to override the glyph.
  // Map is built at module load; missing entries fall back to the styled glyph thumb.
  function localPhoto(ean) {
    const map = window.__PRODUCT_PHOTOS__ || {};
    return map[String(ean || "").replace(/\D/g, "")] || null;
  }

  function ProductThumb({ row, size = 36 }) {
    const t = thumbStyle(row.brand);
    const glyph = categoryGlyph(row.prod);
    const initials = brandInitials(row.brand);
    const [imgError, setImgError] = React.useState(false);
    const reso = size >= 80 ? "400" : "200";
    const url = localPhoto(row.ean);
    return (
      <div style={{
        width: size, height: size, borderRadius: 4,
        background: imgError || !url ? t.bg : "#fff", color: t.fg,
        border: `1px solid ${imgError || !url ? t.ring : "oklch(0.88 0.01 250)"}`,
        display: "grid", placeItems: "center", position: "relative",
        flexShrink: 0, overflow: "hidden",
      }}>
        {url && !imgError ? (
          <img src={url} alt={row.prod || ""} loading="lazy"
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: 1 }} />
        ) : (
          <>
            <ThumbGlyph kind={glyph} color={t.fg} size={Math.round(size * 0.55)} />
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              fontSize: Math.max(8, Math.round(size * 0.22)),
              fontWeight: 700, letterSpacing: 0.3,
              textAlign: "center", padding: "1px 2px",
              background: t.fg, color: t.bg, lineHeight: 1.1,
            }}>
              {initials}
            </div>
          </>
        )}
      </div>
    );
  }


  // SearchableSelect — combobox with search input on top + filtered options below
  function SearchableSelect({ value, options, onCommit, onCancel, mono, autoFocus = true, anchor = "below" }) {
    const [query, setQuery] = React.useState("");
    const [highlight, setHighlight] = React.useState(0);
    const inputRef = React.useRef(null);
    const listRef = React.useRef(null);
    const rootRef = React.useRef(null);

    React.useEffect(() => { if (autoFocus && inputRef.current) inputRef.current.focus(); }, [autoFocus]);

    // close on outside click
    React.useEffect(() => {
      const onDown = (e) => {
        if (rootRef.current && !rootRef.current.contains(e.target)) {
          onCancel();
        }
      };
      document.addEventListener("mousedown", onDown);
      return () => document.removeEventListener("mousedown", onDown);
    }, [onCancel]);

    const filtered = React.useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return options;
      return options.filter(o => o.toLowerCase().includes(q));
    }, [query, options]);

    React.useEffect(() => { setHighlight(0); }, [query]);
    React.useEffect(() => {
      if (listRef.current) {
        const el = listRef.current.children[highlight];
        if (el) el.scrollIntoView({ block: "nearest" });
      }
    }, [highlight]);

    const handleKey = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setHighlight(h => Math.min(filtered.length, h + 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight(h => Math.max(0, h - 1)); }
      else if (e.key === "Enter") {
        e.preventDefault();
        if (highlight === 0 && query.trim() && !filtered.some(o => o.toLowerCase() === query.trim().toLowerCase())) {
          onCommit(query.trim()); // free-form value when typed something not in options
        } else {
          const idx = highlight === 0 && filtered.length ? 0 : Math.max(0, highlight - 0);
          if (filtered[idx] != null) onCommit(filtered[idx]);
          else if (query.trim()) onCommit(query.trim());
        }
      } else if (e.key === "Escape") { e.preventDefault(); onCancel(); }
      else if (e.key === "Tab") { onCommit(query || value || ""); }
    };

    return (
      <div ref={rootRef} style={{
        position: "absolute", left: 0, right: 0, [anchor === "below" ? "top" : "bottom"]: 0, zIndex: 50,
        background: "#fff", border: `1px solid ${C_TOKENS.accent}`,
        boxShadow: "0 4px 12px oklch(0 0 0 / 0.12)", borderRadius: 3, overflow: "hidden",
        minWidth: 160, fontFamily: "inherit",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 6px", borderBottom: `1px solid ${C_TOKENS.border}`, background: "#fff" }}>
          <I.search size={11} style={{ color: C_TOKENS.textSubtle, flexShrink: 0 }} />
          <input ref={inputRef} type="text" value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Rechercher ou saisir…"
            style={{ flex: 1, height: 24, padding: 0, border: "none", background: "transparent",
              fontSize: 11, fontFamily: mono ? C_TOKENS.mono : "inherit", color: C_TOKENS.text, outline: "none" }} />
          {query && (
            <span onClick={() => onCommit("")} title="Vider"
              style={{ fontSize: 10, color: C_TOKENS.textSubtle, cursor: "pointer", padding: "0 2px" }}>×</span>
          )}
        </div>
        <div ref={listRef} style={{ maxHeight: 180, overflowY: "auto", background: "#fff" }}>
          {/* Free-form first row when query doesn't match anything */}
          {query.trim() && !filtered.some(o => o.toLowerCase() === query.trim().toLowerCase()) && (
            <div onMouseDown={e => { e.preventDefault(); onCommit(query.trim()); }}
              onMouseEnter={() => setHighlight(0)}
              style={{ padding: "4px 8px", fontSize: 11, cursor: "pointer",
                background: highlight === 0 ? C_TOKENS.accentSoft : "transparent",
                color: C_TOKENS.text, display: "flex", alignItems: "center", gap: 6,
                fontFamily: mono ? C_TOKENS.mono : "inherit" }}>
              <span style={{ fontSize: 9, color: C_TOKENS.textSubtle, fontWeight: 600, letterSpacing: 0.4 }}>＋</span>
              <span>Ajouter "<strong>{query.trim()}</strong>"</span>
            </div>
          )}
          {filtered.length === 0 && !query.trim() && (
            <div style={{ padding: "8px 10px", fontSize: 11, color: C_TOKENS.textSubtle, fontStyle: "italic" }}>Aucune option</div>
          )}
          {filtered.map((o, i) => {
            const showFreeForm = query.trim() && !filtered.some(x => x.toLowerCase() === query.trim().toLowerCase());
            const idx = showFreeForm ? i + 1 : i;
            const isHi = idx === highlight;
            const isCurrent = o === value;
            return (
              <div key={o}
                onMouseDown={e => { e.preventDefault(); onCommit(o); }}
                onMouseEnter={() => setHighlight(idx)}
                style={{ padding: "4px 8px", fontSize: 11, cursor: "pointer",
                  background: isHi ? C_TOKENS.accentSoft : (isCurrent ? "oklch(0.97 0 0)" : "transparent"),
                  color: C_TOKENS.text, fontWeight: isCurrent ? 600 : 400,
                  fontFamily: mono ? C_TOKENS.mono : "inherit",
                  display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o}</span>
                {isCurrent && <I.check size={10} style={{ color: C_TOKENS.accent, flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // EditableCell — inline input or select; click to edit, Enter/Esc to commit/cancel
  function EditableCell({ row, col }) {
    const value = row[col.key];
    const empty = value == null || value === "";
    const f = FAM[col.fam];
    const cellConf = empty ? 0 : (segConf(row, col.key) ?? 0);
    const lowCell = !empty && cellConf < 80;
    const opts = OPTIONS[col.key];
    const [editing, setEditing] = React.useState(false);
    const [draft, setDraft] = React.useState(value || "");
    const inputRef = React.useRef(null);

    React.useEffect(() => { setDraft(value || ""); }, [value]);
    React.useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

    const commit = (v) => { setField(row.id, col.key, v); setEditing(false); };
    const cancel = () => { setDraft(value || ""); setEditing(false); };

    // Confidence-driven background — mirrors PanelEditableField so left & right stay coherent.
    let bg, textColor;
    if (empty) {
      bg = "repeating-linear-gradient(45deg, transparent 0 4px, oklch(0.95 0.02 80) 4px 5px)";
      textColor = C_TOKENS.textSubtle;
    } else if (cellConf >= 95) {
      bg = "oklch(0.97 0.04 155)";
      textColor = "oklch(0.32 0.1 155)";
    } else if (cellConf >= 80) {
      bg = "oklch(0.96 0.07 75)";
      textColor = "oklch(0.38 0.13 65)";
    } else {
      bg = "oklch(0.96 0.05 25)";
      textColor = "oklch(0.4 0.18 25)";
    }

    const baseStyle = {
      padding: "0 6px",
      fontSize: 11,
      fontFamily: col.mono ? C_TOKENS.mono : "inherit",
      color: textColor,
      fontStyle: empty ? "italic" : "normal",
      fontWeight: empty ? 400 : 600,
      background: bg,
      borderLeft: empty ? `2px solid ${C_TOKENS.border}` : `2px solid ${f.dot}`,
      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      height: 22, lineHeight: "22px",
      display: "flex", alignItems: "center", gap: 4,
    };

    if (editing) {
      if (opts) {
        return (
          <div style={{ ...baseStyle, padding: 0, background: "#fff", overflow: "visible", position: "relative" }}>
            <span style={{ flex: 1, opacity: 0 }}>{value || "—"}</span>
            <SearchableSelect
              value={value || ""}
              options={opts}
              mono={col.mono}
              onCommit={commit}
              onCancel={cancel}
            />
          </div>
        );
      }
      return (
        <div style={{ ...baseStyle, padding: 0, background: "#fff" }}>
          <input ref={inputRef} type="text" value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={() => commit(draft)}
            onKeyDown={e => {
              if (e.key === "Enter") commit(draft);
              else if (e.key === "Escape") cancel();
            }}
            style={{ width: "100%", height: 22, padding: "0 6px", border: `1px solid ${C_TOKENS.accent}`,
              background: "#fff", fontSize: 11, fontFamily: col.mono ? C_TOKENS.mono : "inherit", color: C_TOKENS.text, outline: "none", borderRadius: 0 }} />
        </div>
      );
    }

    return (
      <div onClick={(e) => { e.stopPropagation(); setEditing(true); }}
        style={{ ...baseStyle, cursor: "text" }}>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{empty ? "—" : value}</span>
        {lowCell && <I.warning size={9} style={{ color: "oklch(0.55 0.18 65)", flexShrink: 0 }} />}
      </div>
    );
  }

  function PanelEditableField({ rowId, fieldKey, value, fam, options, placeholder, conf, decision, onDecision, focused, onFocus }) {
    const [editing, setEditing] = React.useState(false);
    const [draft, setDraft] = React.useState(value || "");
    const [hover, setHover] = React.useState(false);
    const inputRef = React.useRef(null);
    const wrapRef = React.useRef(null);

    React.useEffect(() => { setDraft(value || ""); setEditing(false); }, [value, rowId]);
    React.useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

    // Scroll focused field into view when keyboard-focused
    React.useEffect(() => {
      if (!focused || !wrapRef.current) return;
      const el = wrapRef.current;
      const scroller = el.closest("[data-panel-scroll]");
      if (!scroller) return;
      const er = el.getBoundingClientRect();
      const sr = scroller.getBoundingClientRect();
      if (er.top < sr.top + 40) {
        scroller.scrollTop -= (sr.top + 40 - er.top);
      } else if (er.bottom > sr.bottom - 8) {
        scroller.scrollTop += (er.bottom - (sr.bottom - 8));
      }
    }, [focused]);

    // Open edit on Enter when focused (no input target)
    React.useEffect(() => {
      if (!focused) return;
      function onEnter(e) {
        if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
        if (e.key === "Enter" || e.key === "e" || e.key === "E") {
          e.preventDefault();
          e.stopPropagation();
          setEditing(true);
        }
      }
      window.addEventListener("keydown", onEnter, true);
      return () => window.removeEventListener("keydown", onEnter, true);
    }, [focused]);

    const commit = (v) => { setField(rowId, fieldKey, v); setEditing(false); };
    const cancel = () => { setDraft(value || ""); setEditing(false); };
    const v = value;

    if (editing) {
      const sharedStyle = {
        width: "100%", height: 22, padding: "0 6px",
        border: `1px solid ${C_TOKENS.accent}`, background: "#fff",
        fontSize: 11, fontFamily: "inherit", color: C_TOKENS.text,
        outline: "none", borderRadius: 2,
      };
      if (options) {
        return (
          <div style={{ position: "relative", height: 22 }}>
            <SearchableSelect
              value={value || ""}
              options={options}
              onCommit={commit}
              onCancel={cancel}
            />
          </div>
        );
      }
      return (
        <input ref={inputRef} type="text" value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => commit(draft)}
          onKeyDown={e => {
            if (e.key === "Enter") commit(draft);
            else if (e.key === "Escape") cancel();
          }}
          placeholder={placeholder}
          style={sharedStyle} />
      );
    }

    // Decision overrides confidence-based styling
    let bg, border, valueColor;
    if (decision === "y") {
      // Validated — solid green
      bg = "oklch(0.96 0.06 155)";
      border = "oklch(0.55 0.16 155)";
      valueColor = "oklch(0.3 0.12 155)";
    } else if (decision === "n") {
      // Rejected — muted, struck through
      bg = "oklch(0.97 0.01 25)";
      border = "oklch(0.85 0.04 25)";
      valueColor = "oklch(0.55 0.05 25)";
    } else if (!v) {
      bg = "repeating-linear-gradient(45deg, transparent 0 4px, oklch(0.95 0.02 80) 4px 5px)";
      border = C_TOKENS.border;
      valueColor = C_TOKENS.textSubtle;
    } else if (conf == null || conf >= 95) {
      bg = "oklch(0.97 0.04 155)";
      border = "oklch(0.85 0.08 155)";
      valueColor = "oklch(0.32 0.1 155)";
    } else if (conf >= 80) {
      bg = "oklch(0.96 0.07 75)";
      border = "oklch(0.82 0.13 75)";
      valueColor = "oklch(0.38 0.13 65)";
    } else {
      bg = "oklch(0.96 0.05 25)";
      border = "oklch(0.82 0.14 25)";
      valueColor = "oklch(0.4 0.18 25)";
    }

    const isValidated = decision === "y";
    const isRejected = decision === "n";
    // Show Y/N pill buttons on hover OR when keyboard-focused (so users see targets while navigating)
    const showActions = (hover || focused) && v && !editing;

    return (
      <div ref={wrapRef} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={() => onFocus && onFocus()}
        title={v ? (conf != null ? `Cliquer pour modifier · confiance ${conf}%` : "Cliquer pour modifier") : "Cliquer pour saisir"}
        style={{ display: "flex", alignItems: "center", gap: 4,
          padding: "0 2px 0 6px", background: bg,
          border: `${focused ? 2 : 1}px solid ${focused ? C_TOKENS.accent : border}`,
          borderLeftWidth: focused ? 2 : (isValidated ? 3 : 1),
          borderRadius: 2,
          fontSize: 11, height: 22,
          boxShadow: focused ? `0 0 0 3px ${C_TOKENS.accentSoft}` : "none",
          overflow: "hidden", position: "relative" }}>
        <span onClick={() => !isRejected && setEditing(true)}
          style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            color: valueColor,
            fontStyle: v ? "normal" : "italic", fontWeight: v ? 600 : 400,
            textDecoration: isRejected ? "line-through" : "none",
            lineHeight: "20px", cursor: isRejected ? "default" : "text" }}>
          {v || placeholder || "non détecté"}
        </span>

        {/* Validated indicator (always visible when decided) */}
        {isValidated && !showActions && (
          <I.check size={11} style={{ color: "oklch(0.45 0.16 155)", flexShrink: 0 }} />
        )}
        {isRejected && !showActions && (
          <I.x size={11} style={{ color: "oklch(0.55 0.05 25)", flexShrink: 0 }} />
        )}
        {!isValidated && !isRejected && v && conf != null && !showActions && (
          <span style={{ fontFamily: C_TOKENS.mono, fontSize: 9.5, fontWeight: 700, color: valueColor,
            fontVariantNumeric: "tabular-nums", flexShrink: 0, opacity: 0.85, paddingRight: 4 }}>
            {conf}
          </span>
        )}

        {/* Hover actions: ✓ validate / ✗ reject / ↺ undo */}
        {showActions && (
          <div style={{ display: "inline-flex", gap: 2, flexShrink: 0 }}>
            {!isValidated && (
              <button onClick={(e) => { e.stopPropagation(); onDecision && onDecision("y"); }}
                title="Valider (Y)"
                style={{ width: 18, height: 18, padding: 0, background: "#fff",
                  color: "oklch(0.45 0.16 155)",
                  border: `1px solid oklch(0.7 0.12 155)`, borderRadius: 2,
                  cursor: "pointer", display: "grid", placeItems: "center" }}>
                <I.check size={10} />
              </button>
            )}
            {!isRejected && (
              <button onClick={(e) => { e.stopPropagation(); onDecision && onDecision("n"); }}
                title="Rejeter (N)"
                style={{ width: 18, height: 18, padding: 0, background: "#fff",
                  color: "oklch(0.5 0.18 25)",
                  border: `1px solid oklch(0.7 0.13 25)`, borderRadius: 2,
                  cursor: "pointer", display: "grid", placeItems: "center" }}>
                <I.x size={10} />
              </button>
            )}
            {(isValidated || isRejected) && (
              <button onClick={(e) => { e.stopPropagation(); onDecision && onDecision(null); }}
                title="Annuler"
                style={{ width: 18, height: 18, padding: 0, background: "#fff",
                  color: C_TOKENS.textMuted,
                  border: `1px solid ${C_TOKENS.border}`, borderRadius: 2,
                  cursor: "pointer", display: "grid", placeItems: "center", fontSize: 11 }}>
                ↺
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  function HeaderCell({ col }) {
    const f = col.fam ? FAM[col.fam] : null;
    const sorted = sortKey === col.key;
    return (
      <th onClick={() => { if (sorted) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(col.key); setSortDir("asc"); } }}
        style={{ padding: "5px 6px", height: 26, background: C_TOKENS.headerBg,
          borderBottom: `1px solid ${C_TOKENS.border}`, borderRight: `1px solid ${C_TOKENS.border}`,
          fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4,
          textTransform: "uppercase", textAlign: "left", cursor: "pointer", userSelect: "none",
          position: "sticky", top: 0, zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {f && <span style={{ width: 5, height: 5, borderRadius: "50%", background: f.dot, flexShrink: 0 }} />}
          <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{col.label}</span>
          {sorted && <span style={{ color: C_TOKENS.text, fontSize: 9 }}>{sortDir === "asc" ? "▲" : "▼"}</span>}
        </div>
      </th>
    );
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
          <span style={{ color: C_TOKENS.textMuted }}>Spreadsheet IA</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 2px" }}>›</span>
          <span style={{ fontWeight: 500 }}>400 218 libellés</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>{stats.decided} décisions · auto-save</span>
        <button style={{ padding: "4px 10px", background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <I.download size={12} /> Export
        </button>
        <button style={{ padding: "4px 10px", background: C_TOKENS.accent, color: "#fff", border: "none", borderRadius: 3, fontSize: 11.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <I.sparkle size={12} /> Auto-valider 247 982
        </button>
      </div>

      {/* Filter tabs + actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", background: "#fff", borderBottom: `1px solid ${C_TOKENS.border}`, flexShrink: 0 }}>
        {[
          { id: "review", label: "À réviser", count: 118549, dot: "oklch(0.62 0.17 65)" },
          { id: "low", label: "Faible confiance", count: 33687, dot: "oklch(0.55 0.2 25)" },
          { id: "high", label: "Auto (≥ 95%)", count: 247982, dot: "oklch(0.55 0.16 155)" },
          { id: "all", label: "Toutes", count: stats.total, dot: C_TOKENS.textSubtle },
        ].map(t => (
          <button key={t.id} onClick={() => { setFilter(t.id); setActiveIdx(0); }}
            style={{ padding: "4px 10px", background: filter === t.id ? C_TOKENS.accentSoft : "transparent",
              color: filter === t.id ? C_TOKENS.accentText : C_TOKENS.text,
              border: filter === t.id ? `1px solid ${C_TOKENS.accent}` : `1px solid transparent`,
              borderRadius: 3, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit", fontWeight: filter === t.id ? 600 : 500,
              display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.dot }} />
            {t.label}
            <span style={{ color: C_TOKENS.textMuted, fontSize: 10.5, fontFamily: C_TOKENS.mono, marginLeft: 2, fontVariantNumeric: "tabular-nums" }}>{t.count.toLocaleString("fr")}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: focusedFieldKey ? C_TOKENS.accent : C_TOKENS.textSubtle, fontFamily: C_TOKENS.mono, fontWeight: focusedFieldKey ? 600 : 400 }}>
          {focusedFieldKey
            ? <>champ focus · <kbd style={kbdInlineD6}>Y</kbd> valider · <kbd style={kbdInlineD6}>N</kbd> rejeter · <kbd style={kbdInlineD6}>U</kbd> annuler · <kbd style={kbdInlineD6}>↵</kbd> modifier · <kbd style={kbdInlineD6}>↑↓</kbd> champ · <kbd style={kbdInlineD6}>Esc</kbd> sortir</>
            : <>{filtered.length} en file · <kbd style={kbdInlineD6}>↑↓</kbd> ligne · <kbd style={kbdInlineD6}>→</kbd> entrer panneau · <kbd style={kbdInlineD6}>Y/N/U</kbd> décider</>
          }
        </span>
      </div>

      {/* Main split: spreadsheet + side panel */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: panelOpen ? "minmax(0, 1fr) 460px" : "minmax(0, 1fr)", overflow: "hidden" }}>

        {/* SPREADSHEET */}
        <div style={{ overflow: "auto", background: "#fff", borderRight: panelOpen ? `1px solid ${C_TOKENS.border}` : "none" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 32 }} />
              <col style={{ width: 60 }} />
              <col style={{ width: 105 }} />
              <col style={{ width: 195 }} />
              {COLS.map(c => <col key={c.key} style={{ width: c.w }} />)}
              <col style={{ width: 70 }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ padding: "5px 4px", height: 28, background: C_TOKENS.headerBg, borderBottom: `1px solid ${C_TOKENS.border}`, borderRight: `1px solid ${C_TOKENS.border}`, fontSize: 10, color: C_TOKENS.textMuted, position: "sticky", top: 0, zIndex: 1 }}>#</th>
                <th onClick={() => { if (sortKey === "conf") setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey("conf"); setSortDir("asc"); } }}
                  style={{ padding: "5px 6px", height: 28, background: C_TOKENS.headerBg, borderBottom: `1px solid ${C_TOKENS.border}`, borderRight: `1px solid ${C_TOKENS.border}`, fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4, textTransform: "uppercase", textAlign: "left", cursor: "pointer", position: "sticky", top: 0, zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Conf.
                    {sortKey === "conf" && <span style={{ color: C_TOKENS.text, fontSize: 9 }}>{sortDir === "asc" ? "▲" : "▼"}</span>}
                  </div>
                </th>
                <th style={{ padding: "5px 6px", height: 28, background: C_TOKENS.headerBg, borderBottom: `1px solid ${C_TOKENS.border}`, borderRight: `1px solid ${C_TOKENS.border}`, fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4, textTransform: "uppercase", textAlign: "left", position: "sticky", top: 0, zIndex: 1 }}>EAN</th>
                <th style={{ padding: "5px 6px", height: 28, background: C_TOKENS.headerBg, borderBottom: `1px solid ${C_TOKENS.border}`, borderRight: `1px solid ${C_TOKENS.border}`, fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4, textTransform: "uppercase", textAlign: "left", position: "sticky", top: 0, zIndex: 1 }}>Libellé brut</th>
                {COLS.map(c => <HeaderCell key={c.key} col={c} />)}
                <th style={{ padding: "5px 6px", height: 28, background: C_TOKENS.headerBg, borderBottom: `1px solid ${C_TOKENS.border}`, fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4, textTransform: "uppercase", textAlign: "center", position: "sticky", top: 0, zIndex: 1 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const c = confColor(r.conf);
                const isActive = i === activeIdx;
                const dec = decisions[r.id];
                return (
                  <tr key={r.id} onClick={() => { setActiveIdx(i); setPanelOpen(true); }}
                    style={{ background: isActive ? C_TOKENS.accentSoft : (i % 2 ? C_TOKENS.rowAlt : "#fff"),
                      cursor: "pointer", opacity: dec ? 0.5 : 1 }}>
                    <td style={{ borderBottom: `1px solid ${C_TOKENS.border}`, borderRight: `1px solid ${C_TOKENS.border}`, padding: "0 4px", fontFamily: C_TOKENS.mono, color: C_TOKENS.textSubtle, fontSize: 11, textAlign: "right", height: 24, lineHeight: "24px", borderLeft: isActive ? `3px solid ${C_TOKENS.accent}` : "3px solid transparent" }}>
                      {i + 1}
                    </td>
                    <td style={{ borderBottom: `1px solid ${C_TOKENS.border}`, borderRight: `1px solid ${C_TOKENS.border}`, padding: "0 6px", height: 24 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "1px 6px",
                        background: c.bg, color: c.fg, fontFamily: C_TOKENS.mono, fontWeight: 700, fontSize: 11, borderRadius: 2 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: c.dot }} />
                        {r.conf}
                      </span>
                    </td>
                    <td style={{ borderBottom: `1px solid ${C_TOKENS.border}`, borderRight: `1px solid ${C_TOKENS.border}`, padding: "0 8px", fontFamily: C_TOKENS.mono, fontSize: 11.5, fontWeight: 400, color: C_TOKENS.text, height: 24, lineHeight: "24px", letterSpacing: 0.3 }}>
                      {(() => {
                        const ean = String(r.ean || "");
                        if (ean.length <= 6) return <strong>{ean}</strong>;
                        return (
                          <>
                            <strong style={{ fontWeight: 700 }}>{ean.slice(0, 3)}</strong>
                            <span style={{ color: C_TOKENS.textMuted }}>{ean.slice(3, -3)}</span>
                            <strong style={{ fontWeight: 700 }}>{ean.slice(-3)}</strong>
                          </>
                        );
                      })()}
                    </td>
                    <td style={{ borderBottom: `1px solid ${C_TOKENS.border}`, borderRight: `1px solid ${C_TOKENS.border}`, padding: "0 6px", fontSize: 11, color: C_TOKENS.textMuted, height: 24, lineHeight: "24px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.raw}
                    </td>
                    {COLS.map(col => (
                      <td key={col.key} style={{ borderBottom: `1px solid ${C_TOKENS.border}`, borderRight: `1px solid ${C_TOKENS.border}`, padding: 0, height: 24 }}>
                        <EditableCell row={r} col={col} />
                      </td>
                    ))}
                    <td style={{ borderBottom: `1px solid ${C_TOKENS.border}`, padding: "0 4px", height: 24, textAlign: "center" }}>
                      <div style={{ display: "inline-flex", gap: 2 }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setDecisions(d => ({ ...d, [r.id]: "y" }))}
                          title="Valider (Y)"
                          style={{ width: 18, height: 18, padding: 0, background: dec === "y" ? "oklch(0.55 0.16 155)" : "#fff",
                            color: dec === "y" ? "#fff" : "oklch(0.42 0.16 155)",
                            border: `1px solid ${dec === "y" ? "oklch(0.55 0.16 155)" : C_TOKENS.border}`,
                            borderRadius: 2, cursor: "pointer", display: "grid", placeItems: "center" }}>
                          <I.check size={10} />
                        </button>
                        <button onClick={() => setDecisions(d => ({ ...d, [r.id]: "n" }))}
                          title="Rejeter (N)"
                          style={{ width: 18, height: 18, padding: 0, background: dec === "n" ? "oklch(0.55 0.2 25)" : "#fff",
                            color: dec === "n" ? "#fff" : "oklch(0.5 0.2 25)",
                            border: `1px solid ${dec === "n" ? "oklch(0.55 0.2 25)" : C_TOKENS.border}`,
                            borderRadius: 2, cursor: "pointer", display: "grid", placeItems: "center" }}>
                          <I.x size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Footer summary */}
          <div style={{ padding: "8px 14px", borderTop: `1px solid ${C_TOKENS.border}`, background: C_TOKENS.headerBg,
            fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, display: "flex", gap: 16 }}>
            <span>Cellule colorée : valeur détectée par l'IA</span>
            <span style={{ color: C_TOKENS.textSubtle }}>Cellule rayée : champ non détecté</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              <I.warning size={9} style={{ color: "oklch(0.55 0.18 65)" }} /> = confiance &lt; 80%
            </span>
            <span style={{ marginLeft: "auto", color: C_TOKENS.textSubtle }}>Cliquer une cellule pour la modifier · Entrée valide · Échap annule</span>
            <span style={{ flex: 1 }} />
            <span>Clic ligne ou Y/N pour décider</span>
          </div>
        </div>

        {/* SIDE PANEL — full segment detail (15 segments) */}
        {panelOpen && current && (
          <div data-panel-scroll style={{ overflow: "auto", background: C_TOKENS.bg, display: "flex", flexDirection: "column" }}>
            {/* Panel header */}
            <div style={{ padding: "6px 12px", background: "#fff", borderBottom: `1px solid ${C_TOKENS.border}`, display: "flex", alignItems: "center", gap: 8, position: "sticky", top: 0, zIndex: 2 }}>
              <div style={{ fontFamily: C_TOKENS.mono, fontSize: 11, color: C_TOKENS.textMuted }}>{activeIdx + 1} / {filtered.length}</div>
              <button onClick={() => setActiveIdx(i => Math.max(i - 1, 0))} title="Précédent (K)"
                style={{ width: 22, height: 22, padding: 0, background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, cursor: "pointer", display: "grid", placeItems: "center" }}>
                <I.chevronUp size={11} />
              </button>
              <button onClick={() => setActiveIdx(i => Math.min(i + 1, filtered.length - 1))} title="Suivant (J)"
                style={{ width: 22, height: 22, padding: 0, background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, cursor: "pointer", display: "grid", placeItems: "center" }}>
                <I.chevronDown size={11} />
              </button>
              <div style={{ flex: 1 }} />
              <button onClick={() => setPanelOpen(false)}
                style={{ width: 22, height: 22, padding: 0, background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, cursor: "pointer", display: "grid", placeItems: "center" }}>
                <I.x size={11} />
              </button>
            </div>

            <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Hero — thumb seul centré, puis EAN + légende dessous */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <ProductThumb row={current} size={70} />
                <div style={{ fontFamily: C_TOKENS.mono, fontSize: 13, fontWeight: 400, color: C_TOKENS.text, letterSpacing: 0.3, display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4, fontFamily: C_TOKENS.font }}>EAN</span>
                  {(() => {
                    const ean = String(current.ean || "");
                    if (ean.length <= 6) return <strong>{ean}</strong>;
                    return (
                      <span>
                        <strong style={{ fontWeight: 700 }}>{ean.slice(0, 3)}</strong>
                        <span style={{ color: C_TOKENS.textMuted }}>{ean.slice(3, -3)}</span>
                        <strong style={{ fontWeight: 700 }}>{ean.slice(-3)}</strong>
                      </span>
                    );
                  })()}
                </div>
                {(() => {
                  const segs = SEGMENTS;
                  const buckets = { high: 0, mid: 0, low: 0, none: 0 };
                  segs.forEach(s => {
                    const c = segConf(current, s.key);
                    if (c == null) buckets.none++;
                    else if (c >= 95) buckets.high++;
                    else if (c >= 80) buckets.mid++;
                    else buckets.low++;
                  });
                  return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 10, fontFamily: C_TOKENS.font, color: C_TOKENS.textMuted, fontVariantNumeric: "tabular-nums", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <span style={{ width: 7, height: 7, borderRadius: 2, background: "oklch(0.97 0.04 155)", border: "1px solid oklch(0.85 0.08 155)" }} />
                        <span style={{ color: C_TOKENS.text, fontWeight: 600 }}>{buckets.high}</span> fiables
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <span style={{ width: 7, height: 7, borderRadius: 2, background: "oklch(0.96 0.07 75)", border: "1px solid oklch(0.82 0.13 75)" }} />
                        <span style={{ color: C_TOKENS.text, fontWeight: 600 }}>{buckets.mid}</span> à vérifier
                      </span>
                      {buckets.low > 0 && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                          <span style={{ width: 7, height: 7, borderRadius: 2, background: "oklch(0.96 0.05 25)", border: "1px solid oklch(0.82 0.14 25)" }} />
                          <span style={{ color: C_TOKENS.text, fontWeight: 600 }}>{buckets.low}</span> incertains
                        </span>
                      )}
                      <span style={{ paddingLeft: 4, borderLeft: `1px solid ${C_TOKENS.border}`, fontFamily: C_TOKENS.mono }}>
                        <span style={{ color: C_TOKENS.text, fontWeight: 600 }}>{segs.length - buckets.none}</span>
                        <span style={{ color: C_TOKENS.textSubtle }}>/{segs.length}</span>
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Libellé brut + structure proposée — combined, tighter */}
              <div style={{ background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ padding: "5px 10px", borderBottom: `1px solid ${C_TOKENS.border}`, display: "flex", alignItems: "baseline", gap: 8 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4 }}>LIBELLÉ BRUT</div>
                  <div style={{ fontSize: 11.5, color: C_TOKENS.text, fontFamily: C_TOKENS.mono, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current.raw}</div>
                </div>
                <div style={{ padding: "5px 10px", background: C_TOKENS.headerBg, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4, flex: 1 }}>STRUCTURE PROPOSÉE</div>
                  {(() => {
                    // Count fiables (≥95) that are NOT yet validated
                    const fd = fieldDecisions[current.id] || {};
                    const candidates = SEGMENTS.filter(s => {
                      const sc = segConf(current, s.key);
                      return sc != null && sc >= 95 && fd[s.key] !== "y";
                    });
                    if (candidates.length === 0) return null;
                    return (
                      <button onClick={() => {
                        setFieldDecisions(d => {
                          const row = { ...(d[current.id] || {}) };
                          candidates.forEach(s => { row[s.key] = "y"; });
                          return { ...d, [current.id]: row };
                        });
                      }}
                        title="Valider tous les segments à confiance ≥ 95%"
                        style={{ padding: "1px 7px", background: "oklch(0.55 0.16 155)", color: "#fff",
                          border: "none", borderRadius: 3, fontSize: 10, fontWeight: 600, cursor: "pointer",
                          fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <I.check size={9} />
                        Valider {candidates.length} fiable{candidates.length > 1 ? "s" : ""}
                      </button>
                    );
                  })()}
                  <div style={{ display: "inline-flex", border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, overflow: "hidden", background: "#fff" }}>
                    {[
                      { id: "all", label: "Tout" },
                      { id: "found", label: "Détectés" },
                      { id: "missing", label: "Manquants" },
                    ].map((m, idx) => (
                      <button key={m.id} onClick={() => setStructView(m.id)}
                        style={{ padding: "1px 6px",
                          background: structView === m.id ? C_TOKENS.accentSoft : "#fff",
                          color: structView === m.id ? C_TOKENS.accentText : C_TOKENS.textMuted,
                          fontWeight: structView === m.id ? 600 : 400,
                          fontSize: 10, border: "none",
                          borderLeft: idx > 0 ? `1px solid ${C_TOKENS.border}` : "none",
                          cursor: "pointer", fontFamily: "inherit" }}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Segments grouped by family */}
              <div style={{ background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 4 }}>
                {(() => {
                  const byFam = {};
                  SEGMENTS.forEach(s => { (byFam[s.fam] = byFam[s.fam] || []).push(s); });
                  const famOrder = ["identite", "qualif", "emballage", "caract", "service"];
                  return famOrder.map((famKey, fi) => {
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
                    const fd = fieldDecisions[current.id] || {};
                    const validated = segs.filter(s => current[s.key] && fd[s.key] === "y").length;
                    const allValidated = validated > 0 && validated === filled;
                    const collapsed = collapsedFams[famKey];
                    return (
                      <div key={famKey} style={{ borderTop: fi > 0 ? `1px solid ${C_TOKENS.border}` : "none" }}>
                        <button onClick={() => setCollapsedFams(c => ({ ...c, [famKey]: !c[famKey] }))}
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: 7, padding: "4px 10px",
                            background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                          <I.chevronRight size={9} style={{ color: C_TOKENS.textMuted, transform: collapsed ? "rotate(0deg)" : "rotate(90deg)", transition: "transform 0.1s" }} />
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: f.dot, flexShrink: 0 }} />
                          <span style={{ fontSize: 10, fontWeight: 700, color: f.text, letterSpacing: 0.3, textTransform: "uppercase", flex: 1, textAlign: "left" }}>{f.label}</span>
                          {allValidated && (
                            <span title="Famille entièrement validée"
                              style={{ display: "inline-flex", alignItems: "center", gap: 2,
                                color: "oklch(0.45 0.16 155)", fontSize: 9.5, fontWeight: 700 }}>
                              <I.check size={10} />
                            </span>
                          )}
                          <span style={{ fontSize: 9.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>
                            {validated > 0 && (
                              <span style={{ color: "oklch(0.45 0.16 155)", fontWeight: 700 }}>{validated}·</span>
                            )}{filled}/{total}
                          </span>
                        </button>
                        {!collapsed && (
                          <div style={{ display: "grid", gridTemplateColumns: "115px 1fr", rowGap: 2, columnGap: 6, padding: "0 10px 5px 24px", alignItems: "center" }}>
                            {visible.map(s => {
                              const v = current[s.key];
                              const sc = segConf(current, s.key);
                              const fd = (fieldDecisions[current.id] || {})[s.key];
                              return (
                                <React.Fragment key={s.key}>
                                  <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted, fontWeight: 500, paddingTop: 3 }}>{s.label}</div>
                                  <PanelEditableField rowId={current.id} fieldKey={s.key} value={v} fam={f}
                                    options={OPTIONS[s.key]} placeholder={s.hint || "non détecté"} conf={sc}
                                    decision={fd}
                                    focused={focusedFieldKey === s.key}
                                    onFocus={() => setFocusedFieldKey(s.key)}
                                    onDecision={(val) => setFieldDecision(current.id, s.key, val)} />
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

              {/* AI signals */}
              <div style={{ background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 4, padding: "5px 10px" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: C_TOKENS.textMuted, letterSpacing: 0.4, marginBottom: 4 }}>SIGNAUX IA</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 10.5 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <I.check size={11} style={{ color: "oklch(0.55 0.16 155)" }} />
                    <span style={{ color: C_TOKENS.textMuted }}>Marque trouvée dans le référentiel marques (412 occurrences)</span>
                  </div>
                  {current.conf < 90 && (
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <I.warning size={11} style={{ color: "oklch(0.55 0.18 65)" }} />
                      <span style={{ color: C_TOKENS.textMuted }}>Désignation ambiguë — variante proche détectée dans 3 produits</span>
                    </div>
                  )}
                  {!current.cond && (
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <I.warning size={11} style={{ color: "oklch(0.55 0.2 25)" }} />
                      <span style={{ color: C_TOKENS.textMuted }}>Conditionnement non détecté dans le libellé brut</span>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <I.info size={11} style={{ color: C_TOKENS.textSubtle }} />
                    <span style={{ color: C_TOKENS.textMuted }}>Contractures appliquées : pqt → paquet, ½ → demi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky decision bar */}
            <div style={{ marginTop: "auto", padding: 10, background: "#fff", borderTop: `1px solid ${C_TOKENS.border}`, position: "sticky", bottom: 0,
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              <button onClick={() => setDecisions(d => ({ ...d, [current.id]: "y" }))}
                style={{ padding: "7px 10px", background: "oklch(0.55 0.16 155)", color: "#fff", border: "none", borderRadius: 3, fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <I.check size={12} /> Valider <kbd style={{ marginLeft: 3, fontFamily: C_TOKENS.mono, fontSize: 10, background: "rgba(255,255,255,0.3)", padding: "0 4px", borderRadius: 2 }}>Y</kbd>
              </button>
              <button onClick={() => setDecisions(d => ({ ...d, [current.id]: "n" }))}
                style={{ padding: "7px 10px", background: "oklch(0.55 0.2 25)", color: "#fff", border: "none", borderRadius: 3, fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <I.x size={12} /> Rejeter <kbd style={{ marginLeft: 3, fontFamily: C_TOKENS.mono, fontSize: 10, background: "rgba(255,255,255,0.3)", padding: "0 4px", borderRadius: 2 }}>N</kbd>
              </button>
              <button onClick={() => setDecisions(d => ({ ...d, [current.id]: "u" }))}
                style={{ padding: "7px 10px", background: "#fff", color: C_TOKENS.text, border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, fontSize: 11.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                Reporter <kbd style={{ marginLeft: 3, fontFamily: C_TOKENS.mono, fontSize: 10, background: C_TOKENS.headerBg, padding: "0 4px", borderRadius: 2, border: `1px solid ${C_TOKENS.border}` }}>U</kbd>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.SpreadsheetAID6 = SpreadsheetAID6;

const kbdInlineD6 = {
  display: "inline-block",
  padding: "1px 5px",
  margin: "0 1px",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 10,
  fontWeight: 600,
  background: "#fff",
  color: "oklch(0.42 0.13 250)",
  border: "1px solid oklch(0.78 0.08 250)",
  borderRadius: 2,
  lineHeight: 1.4,
};
