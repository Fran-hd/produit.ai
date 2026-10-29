// Shared dictionary of contractures (abbreviations) used by:
//  - Variation E (Dictionnaire de contractures, full management screen)
//  - Variations D7a / D7b / D7c (Constructeur de libellé)
//
// Exposed on `window` so non-module Babel scripts can read it without imports.
//
// Schema:
//   { id, full, short, cat, scope: ["étagère"|"caisse"|"site"|"site mobile"|"marketing"],
//     usage, locked, system }
//
// `scope` items are CHANNEL identifiers used by the label-builder. The list
// must intersect with D7's CHANNELS so we can auto-filter contractures per
// active model:
//   shelf  → "étagère"
//   tpe    → "caisse"
//   web    → "site"
//   mkt    → "marketing"
// (mobile maps to "site mobile" if needed in the future.)

window.CONTRACTURES_INITIAL = [
  // Conditionnement
  { id: 1,  full: "Paquet",     short: "Pqt",  cat: "Conditionnement", scope: ["étagère", "caisse"], usage: 1247, locked: false, system: true },
  { id: 2,  full: "Sachet",     short: "Scht", cat: "Conditionnement", scope: ["étagère", "caisse"], usage: 892,  locked: false, system: true },
  { id: 3,  full: "Boîte",      short: "Bte",  cat: "Conditionnement", scope: ["étagère", "caisse", "site"], usage: 2104, locked: true,  system: true },
  { id: 4,  full: "Bouteille",  short: "Btle", cat: "Conditionnement", scope: ["étagère", "caisse"], usage: 1583, locked: false, system: true },
  { id: 5,  full: "Bocal",      short: "Bcl",  cat: "Conditionnement", scope: ["étagère"], usage: 412,  locked: false, system: true },
  { id: 6,  full: "Pot",        short: "Pot",  cat: "Conditionnement", scope: ["étagère"], usage: 678,  locked: false, system: true },
  { id: 7,  full: "Berlingot",  short: "Berl", cat: "Conditionnement", scope: ["étagère", "caisse"], usage: 156,  locked: false, system: false },
  { id: 8,  full: "Brique",     short: "Brq",  cat: "Conditionnement", scope: ["étagère", "caisse"], usage: 743,  locked: false, system: true },
  { id: 9,  full: "Conserve",   short: "Cons", cat: "Conditionnement", scope: ["étagère"], usage: 528,  locked: false, system: true },
  { id: 10, full: "Tube",       short: "Tb",   cat: "Conditionnement", scope: ["étagère", "caisse"], usage: 314,  locked: false, system: true },
  { id: 11, full: "Pack",       short: "Pck",  cat: "Conditionnement", scope: ["étagère", "caisse"], usage: 996,  locked: false, system: true },
  { id: 12, full: "Lot",        short: "Lt",   cat: "Conditionnement", scope: ["étagère", "caisse"], usage: 1782, locked: false, system: true },
  { id: 13, full: "Rouleau",    short: "Rlx",  cat: "Conditionnement", scope: ["étagère"], usage: 287,  locked: false, system: true },
  { id: 14, full: "Barquette",  short: "Bqte", cat: "Conditionnement", scope: ["étagère", "caisse"], usage: 624,  locked: false, system: true },
  { id: 15, full: "Bidon",      short: "Bid",  cat: "Conditionnement", scope: ["étagère"], usage: 198,  locked: false, system: true },
  // Mots de liaison
  { id: 16, full: "Avec",       short: "Av",   cat: "Mots de liaison", scope: ["caisse"], usage: 3214, locked: false, system: true },
  { id: 17, full: "Sans",       short: "Ss",   cat: "Mots de liaison", scope: ["caisse"], usage: 2876, locked: false, system: true },
  { id: 18, full: "Pour",       short: "Pr",   cat: "Mots de liaison", scope: ["caisse"], usage: 1543, locked: false, system: true },
  { id: 19, full: "À la",       short: "à",    cat: "Mots de liaison", scope: ["caisse"], usage: 987,  locked: false, system: false },
  { id: 20, full: "De la",      short: "de",   cat: "Mots de liaison", scope: ["caisse"], usage: 654,  locked: false, system: false },
  // Qualificatifs
  { id: 21, full: "Petit",      short: "Pt",   cat: "Qualificatifs", scope: ["étagère", "caisse"], usage: 1245, locked: false, system: true },
  { id: 22, full: "Grand",      short: "Gd",   cat: "Qualificatifs", scope: ["étagère", "caisse"], usage: 1378, locked: false, system: true },
  { id: 23, full: "Moyen",      short: "Moy",  cat: "Qualificatifs", scope: ["étagère"], usage: 567,  locked: false, system: true },
  { id: 24, full: "Bio",        short: "Bio",  cat: "Qualificatifs", scope: ["étagère", "caisse", "site"], usage: 4521, locked: true,  system: true },
  { id: 25, full: "Surgelé",    short: "Surg", cat: "Qualificatifs", scope: ["étagère", "caisse"], usage: 2104, locked: false, system: true },
  { id: 26, full: "Tradition",  short: "Trad", cat: "Qualificatifs", scope: ["étagère"], usage: 432,  locked: false, system: true },
  { id: 27, full: "Allégé",     short: "Allg", cat: "Qualificatifs", scope: ["étagère"], usage: 312,  locked: false, system: false },
  { id: 28, full: "Premium",    short: "Prem", cat: "Qualificatifs", scope: ["étagère"], usage: 287,  locked: false, system: false },
  // Saveurs
  { id: 29, full: "Chocolat",   short: "Choco",cat: "Saveurs",       scope: ["étagère", "caisse"], usage: 1876, locked: false, system: true },
  { id: 30, full: "Vanille",    short: "Van",  cat: "Saveurs",       scope: ["étagère", "caisse"], usage: 1245, locked: false, system: true },
  { id: 31, full: "Fraise",     short: "Frse", cat: "Saveurs",       scope: ["étagère", "caisse"], usage: 987,  locked: false, system: true },
  { id: 32, full: "Framboise",  short: "Fbse", cat: "Saveurs",       scope: ["étagère", "caisse"], usage: 743,  locked: false, system: true },
  { id: 33, full: "Noisette",   short: "Noist",cat: "Saveurs",       scope: ["étagère"], usage: 521,  locked: false, system: false },
  { id: 34, full: "Caramel",    short: "Carml",cat: "Saveurs",       scope: ["étagère"], usage: 412,  locked: false, system: false },
  // Unités
  { id: 35, full: "Kilogramme", short: "kg",   cat: "Unités",        scope: ["étagère", "caisse", "site"], usage: 8231,  locked: true, system: true },
  { id: 36, full: "Gramme",     short: "g",    cat: "Unités",        scope: ["étagère", "caisse", "site"], usage: 12453, locked: true, system: true },
  { id: 37, full: "Litre",      short: "L",    cat: "Unités",        scope: ["étagère", "caisse", "site"], usage: 4231,  locked: true, system: true },
  { id: 38, full: "Centilitre", short: "cl",   cat: "Unités",        scope: ["étagère", "caisse", "site"], usage: 1543,  locked: true, system: true },
  { id: 39, full: "Millilitre", short: "ml",   cat: "Unités",        scope: ["étagère", "caisse", "site"], usage: 987,   locked: true, system: true },
];

// Channel id (D7) → contracture scope tag mapping.
window.CHANNEL_TO_CONTRACTURE_SCOPE = {
  shelf: "étagère",
  tpe:   "caisse",
  web:   "site",
  mkt:   "marketing",
};

window.CONTRACTURE_CATEGORIES = [
  { id: "Conditionnement", label: "Conditionnement", color: "oklch(0.65 0.12 60)"  /* amber */ },
  { id: "Mots de liaison", label: "Mots de liaison", color: "oklch(0.55 0.04 280)" },
  { id: "Qualificatifs",   label: "Qualificatifs",   color: "oklch(0.55 0.13 145)" /* green */ },
  { id: "Saveurs",         label: "Saveurs",         color: "oklch(0.55 0.12 290)" },
  { id: "Unités",          label: "Unités",          color: "oklch(0.5 0.16 250)"  /* blue */ },
];

// Apply contractures to a string. Returns { out, replacements }.
//  - dict: full contractures array
//  - opts.scope: which channel scope tag is active (e.g. "caisse"). When set,
//    only contractures whose scope[] includes this tag are applied.
//  - opts.disabledIds: Set or array of contracture ids to skip.
//  - opts.enabled: master on/off toggle (default true).
window.applyContractures = function applyContractures(text, dict, opts = {}) {
  const { scope = null, disabledIds = null, enabled = true } = opts;
  if (!enabled || !text || typeof text !== "string") return { out: text || "", replacements: [] };
  const disabled = disabledIds instanceof Set
    ? disabledIds
    : new Set(Array.isArray(disabledIds) ? disabledIds : []);
  const replacements = [];
  let out = text;
  // Sort by length desc so longer phrases ("À la") match before shorter ("À").
  const ordered = [...dict].sort((a, b) => b.full.length - a.full.length);
  for (const r of ordered) {
    if (disabled.has(r.id)) continue;
    if (scope && !r.scope.includes(scope)) continue;
    // Word-boundary, case-insensitive. Escape regex specials in `full`.
    const escaped = r.full.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "gi");
    if (re.test(out)) {
      replacements.push(r);
      out = out.replace(re, r.short);
    }
  }
  return { out, replacements };
};
