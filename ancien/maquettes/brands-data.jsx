// Référentiel marques pour l'écran de gestion des marques
// Chaque marque est dérivée des SEED produits du D6 + enrichissements simulés.
// Champs : nom, typologie (PP/MN/MDD/ML/MPP/EXC), groupe actionnaire,
// pays, site web, année création, description, catégorie, confidence IA par champ.

const TYPOLOGIES = {
  PP:  { code: "PP",  label: "Premium Premium",   short: "Premium",      hue: 285, desc: "Marque leader, haut de gamme, forte image" },
  MN:  { code: "MN",  label: "Marque Nationale",  short: "Nationale",    hue: 250, desc: "Marque industrielle distribuée nationalement" },
  MDD: { code: "MDD", label: "Marque Distributeur",short: "Distributeur",hue: 145, desc: "Marque propre de l'enseigne (Carrefour, U…)" },
  MPP: { code: "MPP", label: "Marque Premier Prix",short: "1er prix",   hue: 65,  desc: "Marque économique d'entrée de gamme" },
  ML:  { code: "ML",  label: "Marque Locale",     short: "Locale",       hue: 35,  desc: "Marque régionale, terroir, AOP, fermière" },
  EXC: { code: "EXC", label: "Marque Exclusive",  short: "Exclusive",    hue: 320, desc: "Licence ou exclusivité d'enseigne" },
};

// Curated reference list of acquiring groups (used for autocomplete dropdown)
const GROUPS = [
  "Ferrero",
  "Nestlé",
  "Lactalis",
  "Danone",
  "Mondelēz International",
  "Unilever",
  "PepsiCo",
  "The Coca-Cola Company",
  "Heineken Group",
  "Barilla Group",
  "Bel Group",
  "Andros",
  "Bonduelle",
  "Saint-Hubert",
  "JDE Peet's",
  "LDC Groupe",
  "Labeyrie Fine Foods",
  "Soufflet",
  "Panzani (Ebro Foods)",
  "Carrefour",
  "Système U",
  "Auchan Retail",
  "Les Mousquetaires",
  "Indépendant",
];

// Country codes
const COUNTRIES = ["FR", "IT", "DE", "ES", "PT", "NL", "BE", "UK", "CH", "USA", "JP", "NZ", "MX"];

// ─────────────────────────────────────────────────────────────
// Brand seed — every brand visible in D6 plus a few extras
// to give the screen breathing room.
// `conf` is the AI confidence per inferred field (0–100).
// `_unset` = values the AI has NOT yet found (will appear as suggestions to validate)
// ─────────────────────────────────────────────────────────────
const BRANDS = [
  {
    id: "br-nutella", name: "Nutella", aka: ["NUTELLA"],
    typo: "PP", group: "Ferrero", country: "IT", website: "nutella.com",
    founded: 1964, category: "Pâtes à tartiner",
    desc: "Pâte à tartiner aux noisettes lancée à Alba en 1964, leader mondial du segment.",
    skuCount: 14, articleCount: 42,
    conf: { typo: 99, group: 99, country: 99, website: 96, founded: 92, category: 99, logo: 99 },
    sub: ["Nutella B-Ready", "Nutella Biscuits"],
    palette: { fg: "#3a1d10", bg: "#ffe9c4", accent: "#a83817" },
  },
  {
    id: "br-ferrero", name: "Ferrero", aka: ["FERRERO"],
    typo: "PP", group: "Ferrero", country: "IT", website: "ferrero.com",
    founded: 1946, category: "Confiseries",
    desc: "Groupe familial italien fondé à Alba (Piémont). Maison-mère de Nutella, Kinder, Tic Tac, Rocher.",
    skuCount: 28, articleCount: 87,
    conf: { typo: 99, group: 99, country: 99, website: 95, founded: 88, category: 96, logo: 99 },
    sub: ["Raffaello", "Schoko-Bons"],
    palette: { fg: "#3d1c0c", bg: "#fff0d8", accent: "#7a2818" },
  },
  {
    id: "br-kinder", name: "Kinder", aka: ["KINDER"],
    typo: "PP", group: "Ferrero", country: "IT", website: "kinder.com",
    founded: 1968, category: "Confiseries enfants",
    desc: "Marque enfantine du groupe Ferrero — Surprise, Bueno, Maxi, Schoko-Bons.",
    skuCount: 22, articleCount: 64,
    conf: { typo: 99, group: 99, country: 96, website: 94, founded: 86, category: 97, logo: 98 },
    sub: ["Kinder Surprise", "Kinder Maxi", "Kinder Bueno"],
    palette: { fg: "#7a0010", bg: "#ffe0e3", accent: "#c41020" },
  },
  {
    id: "br-coca-cola", name: "Coca-Cola", aka: ["COCA-COLA", "Coca Cola"],
    typo: "PP", group: "The Coca-Cola Company", country: "USA", website: "coca-cola.com",
    founded: 1886, category: "Sodas",
    desc: "Premier soda au monde. La marque-mère couvre Coca, Coca Light, Zéro, Cherry, Sans Caféine.",
    skuCount: 32, articleCount: 118,
    conf: { typo: 99, group: 99, country: 98, website: 99, founded: 99, category: 99, logo: 99 },
    sub: ["Coca-Cola Zéro", "Coca-Cola Light"],
    palette: { fg: "#ffffff", bg: "#d40000", accent: "#000000" },
  },
  {
    id: "br-evian", name: "Evian", aka: ["EVIAN"],
    typo: "PP", group: "Danone", country: "FR", website: "evian.com",
    founded: 1859, category: "Eaux minérales",
    desc: "Eau minérale naturelle d'Évian-les-Bains. Marque premium internationale du portefeuille Danone Waters.",
    skuCount: 11, articleCount: 38,
    conf: { typo: 99, group: 96, country: 99, website: 99, founded: 84, category: 99, logo: 98 },
    sub: ["Evian Sport"],
    palette: { fg: "#ffffff", bg: "#e8b4cf", accent: "#7a2c5f" },
  },
  {
    id: "br-heineken", name: "Heineken", aka: ["HEINEKEN"],
    typo: "PP", group: "Heineken Group", country: "NL", website: "heineken.com",
    founded: 1864, category: "Bières",
    desc: "Bière lager hollandaise diffusée dans plus de 190 pays.",
    skuCount: 18, articleCount: 51,
    conf: { typo: 99, group: 99, country: 99, website: 99, founded: 88, category: 99, logo: 99 },
    sub: ["Heineken 0.0", "Heineken Silver"],
    palette: { fg: "#ffffff", bg: "#0d8e3d", accent: "#e60023" },
  },
  {
    id: "br-barilla", name: "Barilla", aka: ["BARILLA"],
    typo: "PP", group: "Barilla Group", country: "IT", website: "barilla.com",
    founded: 1877, category: "Pâtes & sauces",
    desc: "Premier fabricant mondial de pâtes. Famille Barilla, Parme.",
    skuCount: 24, articleCount: 76,
    conf: { typo: 99, group: 99, country: 99, website: 98, founded: 92, category: 99, logo: 98 },
    sub: ["Barilla Pesto", "Barilla Tortellini"],
    palette: { fg: "#ffffff", bg: "#003896", accent: "#e30613" },
  },
  {
    id: "br-panzani", name: "Panzani", aka: ["PANZANI"],
    typo: "MN", group: "Panzani (Ebro Foods)", country: "FR", website: "panzani.fr",
    founded: 1950, category: "Pâtes & semoules",
    desc: "Marque française leader des pâtes en France, propriété du groupe espagnol Ebro Foods depuis 2005.",
    skuCount: 19, articleCount: 58,
    conf: { typo: 96, group: 84, country: 99, website: 95, founded: 78, category: 99, logo: 96 },
    sub: ["Coquillettes", "Penne", "Macaroni"],
    palette: { fg: "#ffffff", bg: "#003c8a", accent: "#ffce1f" },
  },
  {
    id: "br-lactel", name: "Lactel", aka: ["LACTEL"],
    typo: "MN", group: "Lactalis", country: "FR", website: "lactel.fr",
    founded: 1968, category: "Lait & boissons lactées",
    desc: "Marque ombrelle de lait UHT du groupe Lactalis. Gamme demi-écrémé, écrémé, entier, Matin Léger, ribot.",
    skuCount: 16, articleCount: 47,
    conf: { typo: 99, group: 99, country: 99, website: 99, founded: 82, category: 99, logo: 96 },
    sub: ["Matin Léger", "Lactel Ribot"],
    palette: { fg: "#003c8a", bg: "#ffffff", accent: "#e60012" },
  },
  {
    id: "br-president", name: "Président", aka: ["President", "PRESIDENT", "Président"],
    typo: "MN", group: "Lactalis", country: "FR", website: "president.fr",
    founded: 1968, category: "Beurres & fromages",
    desc: "Marque historique du groupe Lactalis. Beurres, camemberts, emmental, fromages frais.",
    skuCount: 32, articleCount: 94,
    conf: { typo: 99, group: 99, country: 99, website: 96, founded: 79, category: 99, logo: 95 },
    sub: ["Beurre doux", "Beurre demi-sel"],
    palette: { fg: "#0a2553", bg: "#ffffff", accent: "#c11424" },
  },
  {
    id: "br-la-laitiere", name: "La Laitière", aka: ["La Laitière"],
    typo: "PP", group: "Nestlé", country: "CH", website: "lalaitiere.fr",
    founded: 1973, category: "Yaourts & desserts lactés",
    desc: "Marque de desserts lactés haut de gamme de Nestlé inspirée du tableau de Vermeer.",
    skuCount: 21, articleCount: 67,
    conf: { typo: 92, group: 99, country: 96, website: 87, founded: 73, category: 99, logo: 92 },
    sub: ["Crème dessert", "Yaourt nature"],
    palette: { fg: "#3a2410", bg: "#f4ecd8", accent: "#7a4818" },
  },
  {
    id: "br-lu", name: "LU", aka: ["LU", "Lu"],
    typo: "PP", group: "Mondelēz International", country: "FR", website: "lu.com",
    founded: 1846, category: "Biscuits sucrés",
    desc: "Marque historique nantaise (Lefèvre-Utile), Petit Beurre, Prince, Pim's, Mikado, Palmito.",
    skuCount: 38, articleCount: 142,
    conf: { typo: 95, group: 99, country: 99, website: 92, founded: 95, category: 99, logo: 99 },
    sub: ["Petit Beurre", "Prince", "Mikado"],
    palette: { fg: "#ffffff", bg: "#e30613", accent: "#fdc500" },
  },
  {
    id: "br-bonduelle", name: "Bonduelle", aka: ["BONDUELLE"],
    typo: "MN", group: "Bonduelle", country: "FR", website: "bonduelle.com",
    founded: 1853, category: "Légumes en conserve",
    desc: "Groupe familial du Nord (Renescure). Maïs doux, haricots, champignons, salades en conserve.",
    skuCount: 27, articleCount: 89,
    conf: { typo: 99, group: 99, country: 99, website: 99, founded: 91, category: 99, logo: 95 },
    sub: ["Maïs doux", "Haricots verts"],
    palette: { fg: "#ffffff", bg: "#00843d", accent: "#ffce1f" },
  },
  {
    id: "br-bjorg", name: "Bjorg", aka: ["BJORG"],
    typo: "MN", group: "Indépendant", country: "FR", website: "bjorg.fr",
    founded: 1986, category: "Bio & diététique",
    desc: "Marque pionnière du bio en GMS. Lait amande, muesli, compotes bio.",
    skuCount: 29, articleCount: 84,
    conf: { typo: 88, group: 62, country: 88, website: 92, founded: 71, category: 99, logo: 88 },
    sub: ["Bjorg Bio", "Bjorg Sans Sucre"],
    palette: { fg: "#ffffff", bg: "#5b8a3a", accent: "#e8a13a" },
  },
  {
    id: "br-mutti", name: "Mutti", aka: ["MUTTI"],
    typo: "PP", group: "Indépendant", country: "IT", website: "mutti-parma.com",
    founded: 1899, category: "Sauces tomate",
    desc: "Conserves de tomates Mutti, Parme — leader italien.",
    skuCount: 12, articleCount: 31,
    conf: { typo: 92, group: 71, country: 99, website: 88, founded: 84, category: 99, logo: 78 },
    sub: [],
    palette: { fg: "#ffffff", bg: "#c1232b", accent: "#1a4d2e" },
  },
  {
    id: "br-loue", name: "Loué", aka: ["Loué", "LOUE"],
    typo: "ML", group: "LDC Groupe", country: "FR", website: "loue.fr",
    founded: 1959, category: "Volaille fermière",
    desc: "Volaille fermière Label Rouge de la Sarthe. Coopérative.",
    skuCount: 15, articleCount: 45,
    conf: { typo: 90, group: 78, country: 99, website: 86, founded: 64, category: 99, logo: 73 },
    sub: [],
    palette: { fg: "#3a2410", bg: "#fde8c2", accent: "#a8501c" },
  },
  {
    id: "br-harrys", name: "Harrys", aka: ["HARRYS", "Harry's"],
    typo: "MN", group: "Indépendant", country: "FR", website: "harrys.fr",
    founded: 1970, category: "Pains de mie & viennoiseries",
    desc: "Pain de mie, baguette américaine, beau-là, brioche tranchée. Marque du groupe Barilla en France.",
    skuCount: 18, articleCount: 51,
    conf: { typo: 87, group: 42, country: 88, website: 81, founded: 58, category: 99, logo: 84 },
    sub: ["Harrys Beau & Bon"],
    palette: { fg: "#ffffff", bg: "#f59c00", accent: "#7a3010" },
  },
  {
    id: "br-carte-noire", name: "Carte Noire", aka: ["CARTE NOIRE"],
    typo: "PP", group: "JDE Peet's", country: "FR", website: "cartenoire.fr",
    founded: 1978, category: "Cafés",
    desc: "Café français premium, racheté par Lavazza puis par JDE Peet's.",
    skuCount: 14, articleCount: 38,
    conf: { typo: 91, group: 68, country: 96, website: 84, founded: 62, category: 99, logo: 81 },
    sub: [],
    palette: { fg: "#ffffff", bg: "#1a0e08", accent: "#b8862e" },
  },
  {
    id: "br-bridel", name: "Bridel", aka: ["BRIDEL"],
    typo: "MN", group: "Lactalis", country: "FR", website: "bridel.fr",
    founded: 1850, category: "Beurres & laits",
    desc: "Marque historique laitière de Mayenne, intégrée à Lactalis depuis 1990.",
    skuCount: 11, articleCount: 28,
    conf: { typo: 84, group: 91, country: 99, website: 78, founded: 86, category: 96, logo: 71 },
    sub: [],
    palette: { fg: "#0a2553", bg: "#fff8e0", accent: "#c11424" },
  },
  {
    id: "br-entremont", name: "Entremont", aka: ["ENTREMONT"],
    typo: "MN", group: "Sodiaal", country: "FR", website: "entremont.com",
    founded: 1948, category: "Fromages",
    desc: "Emmental, raclette, fromages râpés. Coopérative Sodiaal.",
    skuCount: 16, articleCount: 44,
    conf: { typo: 88, group: 56, country: 99, website: 81, founded: 68, category: 99, logo: 76 },
    sub: [],
    palette: { fg: "#ffffff", bg: "#c4151c", accent: "#ffce1f" },
  },
  {
    id: "br-isigny-ste-mere", name: "Isigny Sainte-Mère", aka: ["Isigny Ste-Mère", "ISIGNY STE-MÈRE"],
    typo: "ML", group: "Coopérative Isigny Sainte-Mère", country: "FR", website: "isigny-ste-mere.com",
    founded: 1932, category: "Beurres & fromages AOP",
    desc: "Coopérative normande, beurre AOP, mimolette, camembert.",
    skuCount: 14, articleCount: 38,
    conf: { typo: 92, group: 38, country: 99, website: 71, founded: 58, category: 96, logo: 64 },
    sub: [],
    palette: { fg: "#0a2c1a", bg: "#fff8d8", accent: "#5b8a3a" },
  },
  {
    id: "br-labeyrie", name: "Labeyrie", aka: ["LABEYRIE"],
    typo: "PP", group: "Labeyrie Fine Foods", country: "FR", website: "labeyrie.com",
    founded: 1946, category: "Saumon fumé & foie gras",
    desc: "Maison landaise, leader du saumon fumé et du foie gras en France.",
    skuCount: 22, articleCount: 67,
    conf: { typo: 96, group: 91, country: 99, website: 92, founded: 78, category: 99, logo: 88 },
    sub: [],
    palette: { fg: "#ffffff", bg: "#7a2818", accent: "#c4a44a" },
  },
  {
    id: "br-bigoot", name: "Bigoot", aka: ["BIGOOT"],
    typo: "ML", group: null, country: null, website: null,
    founded: null, category: "Viandes & agneau",
    desc: null,
    skuCount: 4, articleCount: 8,
    conf: { typo: 54, group: 0, country: 0, website: 0, founded: 0, category: 71, logo: 0 },
    sub: [],
    palette: { fg: "#3a2410", bg: "#f4e8d8", accent: "#a8501c" },
  },
  {
    id: "br-la-tournette", name: "La Tournette", aka: ["La Tournette"],
    typo: "ML", group: null, country: "FR", website: null,
    founded: null, category: "Fromages AOP",
    desc: null,
    skuCount: 3, articleCount: 5,
    conf: { typo: 81, group: 0, country: 84, website: 0, founded: 0, category: 88, logo: 0 },
    sub: [],
    palette: { fg: "#0a2c1a", bg: "#e8f4d8", accent: "#5b8a3a" },
  },
  {
    id: "br-carrefour", name: "Carrefour", aka: ["CARREFOUR"],
    typo: "MDD", group: "Carrefour", country: "FR", website: "carrefour.fr",
    founded: 1959, category: "Marque distributeur (multi)",
    desc: "Marque de distributeur de l'enseigne Carrefour. Couvre tous les rayons.",
    skuCount: 287, articleCount: 1248,
    conf: { typo: 99, group: 99, country: 99, website: 99, founded: 96, category: 99, logo: 99 },
    sub: ["Carrefour Bio", "Carrefour Sensation", "Carrefour Classic'"],
    palette: { fg: "#ffffff", bg: "#0050a0", accent: "#e30613" },
  },
  {
    id: "br-marque-repere", name: "Marque Repère", aka: ["Marque Repère", "REPERE"],
    typo: "MDD", group: "Les Mousquetaires", country: "FR", website: null,
    founded: 1996, category: "Marque distributeur (multi)",
    desc: "Marque de distributeur Intermarché. Pâtes, conserves, frais, biscuits.",
    skuCount: 198, articleCount: 842,
    conf: { typo: 96, group: 88, country: 99, website: 0, founded: 71, category: 99, logo: 81 },
    sub: ["Pâturages", "Monique Ranou"],
    palette: { fg: "#ffffff", bg: "#e30613", accent: "#0a2553" },
  },
  {
    id: "br-u", name: "U", aka: ["U", "U Bio"],
    typo: "MDD", group: "Système U", country: "FR", website: "magasins-u.com",
    founded: 1983, category: "Marque distributeur (multi)",
    desc: "Marque de distributeur Système U. Couvre toutes les catégories.",
    skuCount: 312, articleCount: 1387,
    conf: { typo: 99, group: 96, country: 99, website: 92, founded: 78, category: 99, logo: 88 },
    sub: ["U Bio", "U Saveurs"],
    palette: { fg: "#ffffff", bg: "#e30613", accent: "#0050a0" },
  },
];

// ─────────────────────────────────────────────────────────────
// Helpers exported alongside data
// ─────────────────────────────────────────────────────────────

// Stable hash → hue
function hashHue(s) {
  let h = 0;
  for (let i = 0; i < (s || "").length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

// Brand initials
function brandInitials(name) {
  if (!name) return "?";
  const words = name.replace(/[^\p{L}\s-]/gu, "").split(/[\s-]+/).filter(Boolean);
  if (!words.length) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Paint a logo block — uses per-brand palette if available, otherwise auto from hash
function brandLogoStyle(brand) {
  if (brand.palette) return brand.palette;
  const hue = hashHue(brand.name || "?");
  return {
    fg: `oklch(0.34 0.14 ${hue})`,
    bg: `oklch(0.93 0.05 ${hue})`,
    accent: `oklch(0.5 0.16 ${hue})`,
  };
}

// Typology badge style
function typoStyle(code) {
  const t = TYPOLOGIES[code];
  if (!t) return { fg: "#5b6068", bg: "#eef0f2", border: "#cdd0d4" };
  return {
    fg: `oklch(0.32 0.13 ${t.hue})`,
    bg: `oklch(0.95 0.06 ${t.hue})`,
    border: `oklch(0.78 0.1 ${t.hue})`,
  };
}

window.BRANDS = BRANDS;
window.TYPOLOGIES = TYPOLOGIES;
window.GROUPS = GROUPS;
window.COUNTRIES = COUNTRIES;
window.brandInitials = brandInitials;
window.brandLogoStyle = brandLogoStyle;
window.typoStyle = typoStyle;
window.hashHue = hashHue;
