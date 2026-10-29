// Liaisons entre articles — mock data shared across F1/F2/F3 variations.
// 8 types of links: doublon, equiv-mdd, equiv-mn, variant, version, substitute, cross-sell, pack.
// Each cluster groups 2..N products. Some clusters are validated, others pending IA review.

const LINK_TYPES = {
  doublon: {
    code: "doublon", label: "Doublon", icon: "≡",
    desc: "Fiches dupliquées du même produit — à fusionner",
    color: "oklch(0.55 0.18 25)", soft: "oklch(0.97 0.04 25)", hue: 25,
    action: "Fusionner",
    severity: "high",
  },
  "equiv-mdd": {
    code: "equiv-mdd", label: "Équivalent MDD", icon: "⇄",
    desc: "Même produit en marques distributeurs différentes",
    color: "oklch(0.50 0.16 250)", soft: "oklch(0.97 0.04 250)", hue: 250,
    action: "Lier",
    severity: "med",
  },
  "equiv-mn": {
    code: "equiv-mn", label: "Équivalent MN", icon: "⇆",
    desc: "Produits comparables, marques nationales différentes",
    color: "oklch(0.55 0.14 280)", soft: "oklch(0.97 0.04 280)", hue: 280,
    action: "Lier",
    severity: "med",
  },
  variant: {
    code: "variant", label: "Variante format", icon: "◇",
    desc: "Même produit, formats ou conditionnements différents",
    color: "oklch(0.55 0.13 200)", soft: "oklch(0.97 0.04 200)", hue: 200,
    action: "Grouper",
    severity: "low",
  },
  version: {
    code: "version", label: "Version successive", icon: "↻",
    desc: "Refonte packaging ou nouvelle recette du même produit",
    color: "oklch(0.55 0.12 60)", soft: "oklch(0.97 0.04 60)", hue: 60,
    action: "Successeur",
    severity: "low",
  },
  substitute: {
    code: "substitute", label: "Substitut", icon: "≈",
    desc: "Prend le relais en cas de rupture",
    color: "oklch(0.50 0.14 30)", soft: "oklch(0.97 0.04 30)", hue: 30,
    action: "Définir substitut",
    severity: "med",
  },
  "cross-sell": {
    code: "cross-sell", label: "Complémentaire", icon: "+",
    desc: "Cross-sell — produits achetés ensemble",
    color: "oklch(0.55 0.14 145)", soft: "oklch(0.97 0.04 145)", hue: 145,
    action: "Recommander",
    severity: "low",
  },
  pack: {
    code: "pack", label: "Pack ↔ unité", icon: "▦",
    desc: "Lien entre un lot et ses unités",
    color: "oklch(0.50 0.14 320)", soft: "oklch(0.97 0.04 320)", hue: 320,
    action: "Grouper",
    severity: "low",
  },
};

// Quick visual placeholder: emoji glyph for each product (faute de visuels réels)
const P = (id, ean, name, brand, fmt, glyph, opts = {}) => ({
  id, ean, name, brand, fmt, glyph,
  category: opts.category || "Épicerie sucrée › Pâtes à tartiner",
  price: opts.price,
  pricePerKg: opts.pricePerKg,
  origin: opts.origin || "France",
  labels: opts.labels || [],
  ingredients: opts.ingredients,
  enseigne: opts.enseigne, // for MDD products
  status: opts.status || "validated",
  ref: opts.ref,
});

// ─────────────────────────────────────────────────────────────────────────
// CLUSTERS — each is a group of linked products with detection metadata
// ─────────────────────────────────────────────────────────────────────────

const LINK_CLUSTERS = [
  // ── DOUBLONS ────────────────────────────────────────────────────────────
  {
    id: "cl-001", type: "doublon",
    title: "Nutella 750g — 3 fiches dupliquées",
    confidence: 0.97, status: "pending",
    detectedBy: "ia", rules: ["EAN identique", "Marque + format identiques", "Image hash similaire (98%)"],
    detectedAt: "il y a 2h", reviewer: null,
    reason: "Trois fiches partagent le même EAN 3017620422003 — l'une saisie par M. Lefèvre, deux importées du flux Ferrero.",
    products: [
      P("p-nut-1", "3017620422003", "Nutella pâte à tartiner", "Ferrero", "750 g", "🍫",
        { ref: "ART-08412-FR", price: 6.45, pricePerKg: 8.60, status: "validated" }),
      P("p-nut-1b", "3017620422003", "NUTELLA Pate Tartiner Noisettes", "Ferrero", "750g", "🍫",
        { ref: "ART-08412-DUP1", price: 6.45, pricePerKg: 8.60, status: "duplicate" }),
      P("p-nut-1c", "3017620422003", "Nutella 750g", "FERRERO", "750 g", "🍫",
        { ref: "ART-08412-DUP2", price: 6.45, pricePerKg: 8.60, status: "duplicate" }),
    ],
  },
  {
    id: "cl-002", type: "doublon",
    title: "Eau Cristaline 6×1.5L — fiches en double",
    confidence: 0.93, status: "pending",
    detectedBy: "ia", rules: ["EAN identique", "Format identique"],
    detectedAt: "il y a 5h",
    reason: "Deux EAN-13 identiques saisis avec des libellés légèrement différents.",
    products: [
      P("p-eau-1", "3175680011480", "Eau minérale plate", "Cristaline", "6 × 1,5 L", "💧",
        { category: "Boissons › Eaux", ref: "ART-08414-FR", price: 2.49, pricePerKg: 0.28 }),
      P("p-eau-1b", "3175680011480", "Cristaline eau plate pack 6", "Cristaline", "6×1.5L", "💧",
        { category: "Boissons › Eaux", ref: "ART-08414-DUP", price: 2.49, pricePerKg: 0.28, status: "duplicate" }),
    ],
  },
  {
    id: "cl-003", type: "doublon",
    title: "Yaourt La Laitière nature — 2 fiches",
    confidence: 0.78, status: "pending",
    detectedBy: "ia", rules: ["Nom + marque très proches (similarité 92%)", "Format différent — vérifier"],
    detectedAt: "il y a 1j",
    reason: "Probable doublon mais format diffère (4×125g vs 8×125g) — peut-être 2 références distinctes.",
    products: [
      P("p-yt-1", "3245412000133", "Yaourt nature au lait entier", "La Laitière", "4 × 125 g", "🥛",
        { category: "Frais › Yaourts", price: 2.95 }),
      P("p-yt-1b", "3245412000140", "Yaourt nature lait entier", "La Laitière", "8 × 125 g", "🥛",
        { category: "Frais › Yaourts", price: 5.60 }),
    ],
  },

  // ── ÉQUIVALENTS MDD ─────────────────────────────────────────────────────
  {
    id: "cl-010", type: "equiv-mdd",
    title: "Pâte à tartiner bio 750g — 4 enseignes",
    confidence: 0.89, status: "validated",
    detectedBy: "ia", rules: ["Composition similaire (>85%)", "Format identique", "Catégorie identique"],
    detectedAt: "il y a 3j", reviewer: "M. Lefèvre",
    reason: "Mêmes ingrédients principaux (noisettes, sucre, cacao bio) — différences mineures sur huiles végétales.",
    products: [
      P("p-mdd-c", "3270190021568", "Carrefour Bio pâte à tartiner", "Carrefour Bio", "750 g", "🍫",
        { enseigne: "Carrefour", labels: ["bio"], price: 4.20, pricePerKg: 5.60 }),
      P("p-mdd-u", "3256221501032", "U Bio pâte à tartiner noisettes", "U Bio", "750 g", "🍫",
        { enseigne: "Système U", labels: ["bio"], price: 4.10, pricePerKg: 5.47 }),
      P("p-mdd-cas", "3222476321890", "Casino Bio pâte à tartiner cacao", "Casino Bio", "750 g", "🍫",
        { enseigne: "Casino", labels: ["bio"], price: 4.35, pricePerKg: 5.80 }),
      P("p-mdd-mq", "3450440005637", "Monoprix Bio tartinade noisettes", "Monoprix Bio", "750 g", "🍫",
        { enseigne: "Monoprix", labels: ["bio"], price: 4.95, pricePerKg: 6.60 }),
    ],
  },
  {
    id: "cl-011", type: "equiv-mdd",
    title: "Eau de source 6×1.5L — 5 MDD",
    confidence: 0.82, status: "pending",
    detectedBy: "ia", rules: ["Volume identique", "Origine identique (Massif Central)"],
    detectedAt: "il y a 8h",
    reason: "5 marques distributeurs sourcent la même eau (vraisemblablement) — à confirmer avec l'embouteilleur.",
    products: [
      P("p-eau-c", "3270190230011", "Carrefour eau de source", "Carrefour", "6 × 1,5 L", "💧",
        { category: "Boissons › Eaux", enseigne: "Carrefour", price: 1.92 }),
      P("p-eau-u", "3256225320198", "U eau de source", "U", "6 × 1,5 L", "💧",
        { category: "Boissons › Eaux", enseigne: "Système U", price: 1.85 }),
      P("p-eau-l", "3560070451005", "Marque Repère eau source", "Marque Repère", "6 × 1,5 L", "💧",
        { category: "Boissons › Eaux", enseigne: "E.Leclerc", price: 1.78 }),
      P("p-eau-au", "3596710891234", "Auchan eau source", "Auchan", "6 × 1,5 L", "💧",
        { category: "Boissons › Eaux", enseigne: "Auchan", price: 1.89 }),
      P("p-eau-mq", "3450440112987", "Monoprix eau de source", "Monoprix", "6 × 1,5 L", "💧",
        { category: "Boissons › Eaux", enseigne: "Monoprix", price: 2.10 }),
    ],
  },

  // ── ÉQUIVALENTS MN ──────────────────────────────────────────────────────
  {
    id: "cl-020", type: "equiv-mn",
    title: "Pâtes à tartiner aux noisettes — concurrents directs",
    confidence: 0.85, status: "pending",
    detectedBy: "ia", rules: ["Catégorie identique", "Composition similaire (75%)", "Format proche"],
    detectedAt: "il y a 1j",
    reason: "Concurrents directs sur le rayon — utile pour benchmark prix et positionnement.",
    products: [
      P("p-nut", "3017620422003", "Nutella pâte à tartiner", "Ferrero", "750 g", "🍫",
        { price: 6.45, pricePerKg: 8.60 }),
      P("p-noc", "8001505005530", "Nocciolata", "Rigoni di Asiago", "700 g", "🍫",
        { price: 7.85, pricePerKg: 11.21, labels: ["bio"] }),
      P("p-nutel", "5410126731002", "Nutkao pâte à tartiner", "Nutkao", "650 g", "🍫",
        { price: 5.90, pricePerKg: 9.08 }),
      P("p-pdc", "8000500310427", "Pan di Stelle crema", "Mulino Bianco", "330 g", "🍫",
        { price: 4.95, pricePerKg: 15.00 }),
    ],
  },
  {
    id: "cl-021", type: "equiv-mn",
    title: "Pâtes spaghetti 500g — concurrents",
    confidence: 0.91, status: "validated",
    detectedBy: "rule", rules: ["Catégorie identique", "Format strictement identique"],
    detectedAt: "il y a 1 sem.", reviewer: "S. Bertrand",
    reason: "",
    products: [
      P("p-bar", "8001505005707", "Pâtes spaghetti n°5", "Barilla", "500 g", "🍝",
        { category: "Épicerie › Pâtes sèches", price: 1.85 }),
      P("p-pan", "8076809529082", "Spaghetti n°5", "Panzani", "500 g", "🍝",
        { category: "Épicerie › Pâtes sèches", price: 1.55 }),
      P("p-rum", "8076802085011", "Spaghetti", "De Cecco", "500 g", "🍝",
        { category: "Épicerie › Pâtes sèches", price: 2.10 }),
    ],
  },

  // ── VARIANTES FORMAT ────────────────────────────────────────────────────
  {
    id: "cl-030", type: "variant",
    title: "Nutella — gamme de formats",
    confidence: 1.0, status: "validated",
    detectedBy: "rule", rules: ["Même marque", "Même nom commercial", "Préfixe EAN identique"],
    detectedAt: "il y a 2 sem.", reviewer: "M. Lefèvre",
    reason: "",
    products: [
      P("p-nut-200", "3017620429216", "Nutella", "Ferrero", "200 g", "🍫", { price: 2.99, pricePerKg: 14.95 }),
      P("p-nut-400", "3017620422027", "Nutella", "Ferrero", "400 g", "🍫", { price: 4.20, pricePerKg: 10.50 }),
      P("p-nut-750", "3017620422003", "Nutella", "Ferrero", "750 g", "🍫", { price: 6.45, pricePerKg: 8.60 }),
      P("p-nut-1k", "3017620422010", "Nutella", "Ferrero", "1 kg", "🍫", { price: 8.10, pricePerKg: 8.10 }),
      P("p-nut-3k", "3017620421099", "Nutella seau", "Ferrero", "3 kg", "🍫", { price: 22.50, pricePerKg: 7.50 }),
    ],
  },
  {
    id: "cl-031", type: "variant",
    title: "Yaourt La Laitière — formats",
    confidence: 0.95, status: "pending",
    detectedBy: "ia", rules: ["Marque identique", "Recette identique probable"],
    detectedAt: "il y a 4j",
    reason: "",
    products: [
      P("p-yt-4", "3245412000133", "Yaourt nature lait entier", "La Laitière", "4 × 125 g", "🥛",
        { category: "Frais › Yaourts", price: 2.95 }),
      P("p-yt-8", "3245412000140", "Yaourt nature lait entier", "La Laitière", "8 × 125 g", "🥛",
        { category: "Frais › Yaourts", price: 5.60 }),
      P("p-yt-12", "3245412000157", "Yaourt nature lait entier", "La Laitière", "12 × 125 g", "🥛",
        { category: "Frais › Yaourts", price: 7.95 }),
    ],
  },

  // ── VERSIONS SUCCESSIVES ────────────────────────────────────────────────
  {
    id: "cl-040", type: "version",
    title: "Baguette Harrys — refonte 2024",
    confidence: 0.88, status: "pending",
    detectedBy: "ia", rules: ["Même EAN", "Image packaging très différente (66%)", "Date d'apparition récente"],
    detectedAt: "il y a 3j",
    reason: "Le packaging Harrys a été refondu en mars 2024 — l'ancienne fiche peut être archivée.",
    products: [
      P("p-bag-old", "3228857000852", "Baguette tradition française", "Harrys", "250 g", "🥖",
        { category: "Boulangerie › Pains", price: 1.65, status: "archived" }),
      P("p-bag-new", "3228857000852", "Baguette tradition française (nouveau pack)", "Harrys", "250 g", "🥖",
        { category: "Boulangerie › Pains", price: 1.75, status: "validated" }),
    ],
  },

  // ── SUBSTITUTS ──────────────────────────────────────────────────────────
  {
    id: "cl-050", type: "substitute",
    title: "Nutella 750g — substituts en rupture",
    confidence: 0.91, status: "validated",
    detectedBy: "merch", rules: ["Définis manuellement par M. Lefèvre"],
    detectedAt: "il y a 1 mois", reviewer: "M. Lefèvre",
    reason: "Plan de substitution validé par le merch.",
    products: [
      P("p-nut-main", "3017620422003", "Nutella", "Ferrero", "750 g", "🍫",
        { price: 6.45, pricePerKg: 8.60 }),
      P("p-noc-sub", "8001505005530", "Nocciolata bio", "Rigoni di Asiago", "700 g", "🍫",
        { price: 7.85, pricePerKg: 11.21, labels: ["bio"] }),
      P("p-pdc-sub", "8000500310427", "Pan di Stelle crema", "Mulino Bianco", "330 g", "🍫",
        { price: 4.95, pricePerKg: 15.00 }),
    ],
  },

  // ── CROSS-SELL ──────────────────────────────────────────────────────────
  {
    id: "cl-060", type: "cross-sell",
    title: "Pâte à tartiner ↔ pains & viennoiseries",
    confidence: 0.74, status: "pending",
    detectedBy: "ia", rules: ["Co-achat fréquent (panier 38%)", "Catégories complémentaires"],
    detectedAt: "il y a 2j",
    reason: "Suggestions de cross-sell pour la fiche Nutella.",
    products: [
      P("p-nut-cs", "3017620422003", "Nutella", "Ferrero", "750 g", "🍫",
        { price: 6.45 }),
      P("p-bag-cs", "3228857000852", "Baguette tradition", "Harrys", "250 g", "🥖",
        { category: "Boulangerie › Pains", price: 1.65 }),
      P("p-bri-cs", "3608580788317", "Brioche tranchée", "Pasquier", "500 g", "🥐",
        { category: "Boulangerie › Viennoiseries", price: 3.20 }),
      P("p-bis-cs", "7622210449283", "Biscottes au froment", "LU", "300 g", "🍞",
        { category: "Boulangerie › Biscottes", price: 1.95 }),
    ],
  },

  // ── PACK ↔ UNITÉ ────────────────────────────────────────────────────────
  {
    id: "cl-070", type: "pack",
    title: "Eau Cristaline — pack 6 ↔ unité",
    confidence: 1.0, status: "validated",
    detectedBy: "rule", rules: ["EAN-14 contient EAN-13 unitaire", "Multiplicateur cohérent"],
    detectedAt: "il y a 1 sem.", reviewer: "Auto",
    reason: "",
    products: [
      P("p-eau-pack", "3175680011480", "Eau minérale plate (pack 6)", "Cristaline", "6 × 1,5 L", "💧",
        { category: "Boissons › Eaux", price: 2.49, ref: "ART-08414-FR" }),
      P("p-eau-unit", "3175680011497", "Eau minérale plate", "Cristaline", "1,5 L", "💧",
        { category: "Boissons › Eaux", price: 0.49, ref: "ART-08414-UNIT" }),
    ],
  },
  {
    id: "cl-071", type: "pack",
    title: "Yaourt nature — pack 4 ↔ unité",
    confidence: 0.96, status: "pending",
    detectedBy: "ia", rules: ["Format multiple cohérent", "Marque identique"],
    detectedAt: "il y a 6j",
    reason: "",
    products: [
      P("p-yt-pack", "3245412000133", "Yaourt nature lait entier (4×125g)", "La Laitière", "4 × 125 g", "🥛",
        { category: "Frais › Yaourts", price: 2.95 }),
      P("p-yt-unit", "3245412000010", "Yaourt nature lait entier (unité)", "La Laitière", "125 g", "🥛",
        { category: "Frais › Yaourts", price: 0.85 }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

function clusterCounts(clusters) {
  const counts = {};
  for (const t of Object.keys(LINK_TYPES)) counts[t] = 0;
  counts.all = clusters.length;
  counts.pending = 0; counts.validated = 0;
  for (const c of clusters) {
    counts[c.type] = (counts[c.type] || 0) + 1;
    if (c.status === "pending") counts.pending++;
    else if (c.status === "validated") counts.validated++;
  }
  return counts;
}

function fmtConfidence(v) {
  return Math.round(v * 100) + "%";
}

function confColor(v) {
  if (v >= 0.9) return "oklch(0.45 0.13 145)";       // vert
  if (v >= 0.75) return "oklch(0.55 0.13 90)";        // ambre
  return "oklch(0.55 0.18 30)";                        // rouge
}

window.LINK_TYPES = LINK_TYPES;
window.LINK_CLUSTERS = LINK_CLUSTERS;
window.clusterCounts = clusterCounts;
window.fmtConfidence = fmtConfidence;
window.confColor = confColor;
