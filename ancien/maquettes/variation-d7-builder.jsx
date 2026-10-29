// Variation D7 — Drag & Drop Label Structure Builder
// Top: drop zone with reorderable tokens (the "structure")
// Right: palette of product variables + separators + formatters
// Bottom: live before/after preview table on real products

// Inline editable separator slot — MUST be defined outside the parent
// component so its component identity is stable across re-renders.
// Otherwise React tears down the input on every keystroke and focus is lost.
function SepSlotD7({
  idx, sepTok, dragOver, onDropZoneDragOver, onDropZoneLeave, onDropZoneDrop,
  structure, setStructure, updateToken, removeToken, tokens,
}) {
  const active = dragOver.active && dragOver.idx === idx;
  const inputRef = React.useRef(null);
  const valueRef = React.useRef(sepTok ? sepTok.text : "");

  // External sync: only overwrite the input when upstream value
  // changes AND it doesn't match what we last committed locally.
  React.useEffect(() => {
    const upstream = sepTok ? sepTok.text : "";
    if (inputRef.current && upstream !== valueRef.current) {
      valueRef.current = upstream;
      // Only overwrite if the input is NOT focused, to avoid clobbering caret
      if (document.activeElement !== inputRef.current) {
        inputRef.current.value = upstream;
      }
    }
  }, [sepTok ? sepTok.text : null, sepTok ? sepTok.id : null]);

  const onInput = (e) => {
    const text = e.target.value;
    valueRef.current = text;

    if (sepTok) {
      if (text === "") {
        // Don't remove yet — keep input mounted while focused.
        return;
      }
      if (text !== sepTok.text) {
        updateToken(sepTok.id, { text });
      }
    } else if (text !== "") {
      const newId = "t" + Date.now() + Math.random().toString(36).slice(2, 5);
      const next = [...structure];
      next.splice(Math.max(0, Math.min(idx, next.length)), 0, { type: "sep", text, id: newId });
      setStructure(next);
    }
  };

  const onBlurCommit = (e) => {
    const text = e.target.value;
    if (sepTok && text === "") {
      removeToken(sepTok.id);
    }
  };

  return (
    <div
      style={{
        display: "inline-flex", alignItems: "stretch",
        alignSelf: "stretch",
        background: active ? "oklch(0.95 0.06 250)" : "transparent",
        borderRadius: 3,
        position: "relative",
      }}
    >
      <input
        ref={inputRef}
        type="text"
        defaultValue={sepTok ? sepTok.text : ""}
        onInput={onInput}
        onBlur={onBlurCommit}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); }
        }}
        // Prevent the input's native text-drop behavior so the parent zone
        // handler can catch palette/reorder drags that land on this input.
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes("application/x-builder-token") ||
              e.dataTransfer.types.includes("application/x-builder-reorder")) {
            e.preventDefault();
          }
        }}
        onDrop={(e) => {
          if (e.dataTransfer.types.includes("application/x-builder-token") ||
              e.dataTransfer.types.includes("application/x-builder-reorder")) {
            e.preventDefault();
            // Let the event bubble to the zone's onDrop handler
          }
        }}
        aria-label="Séparateur"
        title={sepTok ? `Séparateur : "${sepTok.text.replace(/ /g, '␣')}". Effacez pour le retirer.` : "Tapez un séparateur (espace, virgule, tiret…)"}
        style={{
          width: 36,
          minWidth: 14,
          // Always show a faint border on empty slots so they're discoverable
          border: `1px dashed ${sepTok ? tokens.border : "oklch(0.88 0 0)"}`,
          background: sepTok ? "oklch(0.985 0 0)" : "transparent",
          borderRadius: 3,
          padding: "0 4px",
          margin: "0 1px",
          fontFamily: tokens.mono,
          fontSize: 12,
          color: tokens.text,
          outline: "none",
          textAlign: "center",
          whiteSpace: "pre",
          cursor: "text",
          transition: "border-color 120ms",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = tokens.accent;
          e.currentTarget.style.borderStyle = "solid";
        }}
        onMouseEnter={(e) => {
          if (document.activeElement !== e.currentTarget && !sepTok) {
            e.currentTarget.style.borderColor = tokens.textSubtle;
          }
        }}
        onMouseLeave={(e) => {
          if (document.activeElement !== e.currentTarget) {
            e.currentTarget.style.borderColor = sepTok ? tokens.border : "oklch(0.88 0 0)";
            e.currentTarget.style.borderStyle = "dashed";
          }
        }}
      />
    </div>
  );
}

function LabelBuilderD7() {
  // Channel definitions (max length, label)
  const CHANNELS = [
    { id: "shelf",  name: "Étiquette rayon",   limit: 32 },
    { id: "tpe",    name: "TPE / Caisse",       limit: 24 },
    { id: "web",    name: "Site marchand",      limit: 70 },
    { id: "mkt",    name: "Marketing long",     limit: 120 },
  ];

  // Variable definitions (the building blocks the user drags in)
  // Each variable knows how to read from a product row.
  const VARIABLES = [
    { key: "brand",     label: "Marque",         family: "ident",   icon: "tag",     read: r => r.brand,     example: "PANZANI" },
    { key: "prod",      label: "Désignation",     family: "ident",  icon: "package", read: r => r.prod,      example: "Coquillettes" },
    { key: "variety",   label: "Variété",         family: "ident",  icon: "tag",     read: r => r.variety,   example: "tricolore" },
    { key: "qualif",    label: "Qualificatif",    family: "ident",  icon: "tag",     read: r => r.qualif,    example: "fermier" },
    { key: "flavor",    label: "Parfum / goût",   family: "ident",  icon: "tag",     read: r => r.flavor,    example: "basilic" },
    { key: "claim",     label: "Allégation",      family: "ident",  icon: "tag",     read: r => r.claim,     example: "zéro sucre" },

    { key: "weight",    label: "Grammage / volume", family: "format", icon: "scale",  read: r => r.weight,   example: "500g" },
    { key: "qty",       label: "Quantité (×N)",   family: "format",  icon: "hash",   read: r => r.qty,       example: "×4" },
    { key: "unitformat", label: "Format unitaire", family: "format", icon: "ruler",  read: r => r.unitformat, example: "125g" },
    { key: "cond",      label: "Conditionnement", family: "format",  icon: "package", read: r => r.cond,      example: "paquet" },

    { key: "origin",    label: "Origine",        family: "context", icon: "globe",   read: r => r.origin,    example: "FR" },
    { key: "label",     label: "Label / certif", family: "context", icon: "verified", read: r => r.label,    example: "AOP" },
    { key: "conserv",   label: "Conservation",   family: "context", icon: "thermo",  read: r => r.conserv,   example: "frais" },
  ];

  const FAMILIES = {
    ident:   { label: "Identité",   color: "oklch(0.42 0.16 250)", soft: "oklch(0.96 0.04 250)", border: "oklch(0.82 0.10 250)" },
    format:  { label: "Format",     color: "oklch(0.40 0.13 165)", soft: "oklch(0.96 0.04 165)", border: "oklch(0.78 0.10 165)" },
    context: { label: "Contexte",   color: "oklch(0.40 0.14 60)",  soft: "oklch(0.96 0.04 60)",  border: "oklch(0.80 0.10 60)" },
    sep:     { label: "Séparateur", color: "oklch(0.45 0 0)",      soft: "oklch(0.96 0 0)",      border: "oklch(0.82 0 0)" },
  };

  // Separators — special tokens (not bound to product data)
  const SEPARATORS = [
    { key: "space",   label: "espace",   render: " ",   visual: "·" },
    { key: "comma",   label: "virgule",  render: ", ",  visual: ", " },
    { key: "dash",    label: "tiret",    render: " - ", visual: " - " },
    { key: "pipe",    label: "barre",    render: " | ", visual: " | " },
    { key: "slash",   label: "slash",    render: " / ", visual: " / " },
  ];

  // Tiny icons (inline SVG)
  function Icon({ name, size = 12 }) {
    const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
    const map = {
      tag:      <><path d="M3 3h7l8 8-7 7-8-8V3z" {...stroke}/><circle cx="6.5" cy="6.5" r="1" {...stroke}/></>,
      package:  <><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z M3 7l9 4 9-4 M12 11v10" {...stroke}/></>,
      scale:    <><path d="M5 6h14 M12 6V4 M7 6l-3 8a3 3 0 006 0L7 6z M17 6l-3 8a3 3 0 006 0l-3-8z M7 21h10" {...stroke}/></>,
      hash:     <><path d="M5 9h14 M5 15h14 M9 3l-2 18 M17 3l-2 18" {...stroke}/></>,
      ruler:    <><path d="M3 17l14-14 4 4-14 14-4-4z M7 13l2 2 M10 10l2 2 M13 7l2 2" {...stroke}/></>,
      globe:    <><circle cx="12" cy="12" r="9" {...stroke}/><path d="M3 12h18 M12 3a13 13 0 010 18 M12 3a13 13 0 000 18" {...stroke}/></>,
      verified: <><path d="M12 2l3 2 3-1 1 3 3 2-2 3 1 3-3 1-2 3-3-2-3 2-2-3-3-1 1-3-2-3 3-2 1-3 3 1 3-2z M9 12l2 2 4-4" {...stroke}/></>,
      thermo:   <><path d="M10 14V4a2 2 0 014 0v10a4 4 0 11-4 0z" {...stroke}/><circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none"/></>,
      grip:     <><circle cx="9" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1" fill="currentColor" stroke="none"/></>,
      x:        <><path d="M5 5l14 14 M19 5L5 19" {...stroke}/></>,
      plus:     <><path d="M12 5v14 M5 12h14" {...stroke}/></>,
      gear:     <><circle cx="12" cy="12" r="3" {...stroke}/><path d="M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2" {...stroke}/></>,
      caret:    <><path d="M6 9l6 6 6-6" {...stroke}/></>,
      check:    <><path d="M5 12l5 5L20 7" {...stroke}/></>,
      copy:     <><rect x="9" y="9" width="11" height="11" rx="2" {...stroke}/><path d="M5 15V5a2 2 0 012-2h10" {...stroke}/></>,
      preview:  <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" {...stroke}/><circle cx="12" cy="12" r="3" {...stroke}/></>,
    };
    return <svg width={size} height={size} viewBox="0 0 24 24">{map[name] || null}</svg>;
  }

  // Real product rows — subset matching the photos we have, plus a few without
  const PRODUCTS = [
    { ean: "3270190022001", brand: "Coca-Cola",     prod: "Coca light",            cond: "pack",     weight: "7,5L",   qty: "×6",  unitformat: "1,25L", origin: null,  claim: "light",       conserv: "ambiant", actuel: "Coca cola light pack 6x1.25L" },
    { ean: "3270190022018", brand: "Coca-Cola",     prod: "Coca classic",          cond: "pack",     weight: "10L",    qty: "×8",  unitformat: "1,25L", origin: null,  claim: null,          conserv: "ambiant", actuel: "Coca cola classic 6+2 pack 8x1.25L" },
    { ean: "3245391105047", brand: "La Tournette",  prod: "Reblochon de Savoie",   cond: "meule",    weight: "450g",   qty: null,  unitformat: null,    origin: "FR",  qualif: "fermier",    label: "AOP", conserv: "frais", actuel: "Reblochon Savoie fermier 450g" },
    { ean: "3245391105054", brand: "ENTREMONT",     prod: "Emmental râpé",         cond: "sachet",   weight: "500g",   qty: null,  unitformat: null,    origin: "FR",  qualif: "français",   conserv: "frais", actuel: "ENTREMONT Emmental rape francais 500g" },
    { ean: "3270570012345", brand: "KINDER",        prod: "Surprise Noël",         cond: "boîte",    weight: "80g",    qty: "×4",  unitformat: null,    origin: "IT",  conserv: "ambiant",   actuel: "KINDER Surprise edition Noel x4" },
    { ean: "3596710443998", brand: "BRIDEL",        prod: "Mozzarella tranches",   cond: "sachet",   weight: "200g",   qty: "×12", unitformat: null,    origin: "FR",  conserv: "frais",     actuel: "BRIDEL Ma Mozzarella tranches 200g x12" },
    { ean: "3175680011480", brand: "HEINEKEN",      prod: "Bière lager",           cond: "pack",     weight: "3L",     qty: "×12", unitformat: "25cl",  origin: "NL",  conserv: "ambiant",   actuel: "HEINEKEN biere lager 12X25cl" },
    { ean: "3596710443215", brand: "Bigoot",        prod: "Gigot d'agneau",        cond: "pièce",    weight: "1,8kg",  qty: null,  unitformat: null,    origin: "NZ",  conserv: "frais",     actuel: "Gigot agneau Bigoot 1.8kg origine NZ" },
    { ean: "3596710443222", brand: "Isigny Ste-Mère", prod: "Mimolette 3 mois",    cond: "part",     weight: "220g",   qty: null,  unitformat: null,    origin: "FR",  qualif: "affinée",    conserv: "frais", actuel: "Mimolette 3 mois affinage 220g" },
    { ean: "3017620422003", brand: "PANZANI",       prod: "Coquillettes",          cond: "paquet",   weight: "500g",   qty: null,  unitformat: null,    origin: "IT",  conserv: "ambiant",   actuel: "PANZANI Coquillettes pqt 500g" },
  ];

  const photoFor = (ean) => (window.__PRODUCT_PHOTOS__ || {})[ean] || null;

  // Initial structure for the active channel — sensible default per channel
  const DEFAULT_STRUCTURES = {
    shelf: [
      { type: "var", varKey: "prod",   id: "t1", caseFmt: "title",  trunc: null, contract: false },
      { type: "sep", text: " ",      id: "t2" },
      { type: "var", varKey: "brand",  id: "t3", caseFmt: "upper",  trunc: null, contract: false },
      { type: "sep", text: " ",      id: "t4" },
      { type: "var", varKey: "weight", id: "t5", caseFmt: "asis",   trunc: null, contract: false },
    ],
    tpe: [
      { type: "var", varKey: "brand",  id: "t1", caseFmt: "upper",  trunc: 8,   contract: false },
      { type: "sep", text: " ",      id: "t2" },
      { type: "var", varKey: "prod",   id: "t3", caseFmt: "asis",   trunc: 10,  contract: true },
      { type: "sep", text: " ",      id: "t4" },
      { type: "var", varKey: "weight", id: "t5", caseFmt: "asis",   trunc: null, contract: true },
    ],
    web: [
      { type: "var", varKey: "prod",   id: "t1", caseFmt: "title",  trunc: null, contract: false },
      { type: "sep", text: " ",      id: "t2" },
      { type: "var", varKey: "brand",  id: "t3", caseFmt: "upper",  trunc: null, contract: false },
      { type: "sep", text: ", ",     id: "t4" },
      { type: "var", varKey: "cond",   id: "t5", caseFmt: "lower",  trunc: null, contract: false },
      { type: "sep", text: " ",      id: "t6" },
      { type: "var", varKey: "weight", id: "t7", caseFmt: "asis",   trunc: null, contract: false },
    ],
    mkt: [
      { type: "var", varKey: "prod",   id: "t1", caseFmt: "title",  trunc: null, contract: false },
      { type: "sep", text: " ",      id: "t2" },
      { type: "var", varKey: "brand",  id: "t3", caseFmt: "upper",  trunc: null, contract: false },
      { type: "sep", text: ", ",     id: "t4" },
      { type: "var", varKey: "qualif", id: "t5", caseFmt: "lower",  trunc: null, contract: false },
      { type: "sep", text: ", ",     id: "t6" },
      { type: "var", varKey: "origin", id: "t7", caseFmt: "asis",   trunc: null, contract: false },
      { type: "sep", text: ", ",     id: "t8" },
      { type: "var", varKey: "weight", id: "t9", caseFmt: "asis",   trunc: null, contract: false },
    ],
  };

  // Shared contractures dict — declarations moved below activeChannel.

  const applyCase = (s, fmt) => {
    if (!s) return s;
    if (fmt === "upper") return s.toUpperCase();
    if (fmt === "lower") return s.toLowerCase();
    if (fmt === "title") return s.replace(/\b\w/g, c => c.toUpperCase());
    return s;
  };
  // Apply contractures using the shared engine. Scope = active channel's
  // mapped scope tag (e.g. "caisse" for tpe). Globally-disabled ids are skipped.
  const applyContract = (s) => {
    if (!s) return s;
    const scopeTag = (window.CHANNEL_TO_CONTRACTURE_SCOPE || {})[activeChannel] || null;
    const result = (window.applyContractures || ((t) => ({ out: t, replacements: [] })))(
      s, contractures, { scope: scopeTag, disabledIds: disabledContractureIds, enabled: true }
    );
    return result.out;
  };
  const applyTrunc = (s, n) => {
    if (!s || !n) return s;
    return s.length > n ? s.slice(0, n) : s;
  };

  // Render a structure against a product row
  // Render a structure against a product row.
  //   opts.disableContract → skip contracture replacement (preview "off" mode)
  function renderStructure(structure, row, opts = {}) {
    const { disableContract = false } = opts;
    let out = "";
    structure.forEach(tok => {
      if (tok.type === "sep") {
        if (tok.text != null) {
          out += tok.text;
        } else {
          const sep = SEPARATORS.find(s => s.key === tok.sepKey);
          out += sep ? sep.render : "";
        }
      } else {
        const v = VARIABLES.find(v => v.key === tok.varKey);
        if (!v) return;
        let val = v.read(row);
        if (val == null) return;
        val = String(val);
        if (tok.contract && !disableContract) val = applyContract(val);
        val = applyCase(val, tok.caseFmt);
        if (tok.trunc) val = applyTrunc(val, tok.trunc);
        out += val;
      }
    });
    // Clean leading/trailing/duplicate spaces and orphan separators
    out = out.replace(/\s+/g, " ").replace(/^[ ,\-|/]+|[ ,\-|/]+$/g, "").trim();
    out = out.replace(/( ,)+/g, ",").replace(/,(\s*,)+/g, ",");
    return out;
  }

  // ---- State ----
  const [activeChannel, setActiveChannel] = React.useState("shelf");
  const [structures, setStructures] = React.useState(DEFAULT_STRUCTURES);
  // Contractures (shared dict from contractures-data.jsx) — editable in place
  // for the "léger edit" UX (toggle on/off + edit shorts).
  const [contractures, setContractures] = React.useState(() =>
    (window.CONTRACTURES_INITIAL || []).map(r => ({ ...r, scope: [...r.scope] }))
  );
  const [disabledContractureIds, setDisabledContractureIds] = React.useState(() => new Set());
  // Preview header toggle: show contractures applied in the "Nouveau libellé" column.
  const [previewWithContractures, setPreviewWithContractures] = React.useState(true);
  // Right-palette active tab: "vars" | "contractures"
  const [paletteTab, setPaletteTab] = React.useState("vars");
  const [contractureSearch, setContractureSearch] = React.useState("");
  const [contractureCat, setContractureCat] = React.useState("all");
  const [contractureScopeFilter, setContractureScopeFilter] = React.useState("auto"); // "auto" | "all"
  const [dragOver, setDragOver] = React.useState({ active: false, idx: -1 });
  const [draggingId, setDraggingId] = React.useState(null);
  const [justDragged, setJustDragged] = React.useState(false);
  const [editingTokenId, setEditingTokenId] = React.useState(null);
  const [showSeparators, setShowSeparators] = React.useState(true);

  const structure = structures[activeChannel];
  const channel = CHANNELS.find(c => c.id === activeChannel);
  // Active scope tag for contractures, derived from the active channel.
  const channelScope = (window.CHANNEL_TO_CONTRACTURE_SCOPE || {})[activeChannel] || null;

  const setStructure = (next) => setStructures(s => ({ ...s, [activeChannel]: next }));

  // ---- Drag handlers ----
  const onPaletteDragStart = (e, payload) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/x-builder-token", JSON.stringify(payload));
  };
  const onTokenDragStart = (e, tokenId) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/x-builder-reorder", tokenId);
    setDraggingId(tokenId);
  };
  const onTokenDragEnd = () => { setDraggingId(null); setDragOver({ active: false, idx: -1 }); };

  const onDropZoneDragOver = (e, insertIdx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = e.dataTransfer.types.includes("application/x-builder-reorder") ? "move" : "copy";
    setDragOver({ active: true, idx: insertIdx });
  };
  const onDropZoneLeave = () => setDragOver({ active: false, idx: -1 });

  const onDropZoneDrop = (e, insertIdx) => {
    e.preventDefault();
    const newPayload = e.dataTransfer.getData("application/x-builder-token");
    const reorderId = e.dataTransfer.getData("application/x-builder-reorder");
    if (newPayload) {
      const data = JSON.parse(newPayload);
      const newId = "t" + Date.now() + Math.random().toString(36).slice(2, 5);
      const newToken = data.kind === "var"
        ? { type: "var", varKey: data.key, id: newId, caseFmt: "asis", trunc: null, contract: false }
        : { type: "sep", text: (SEPARATORS.find(s => s.key === data.key)?.render) ?? " ", id: newId };
      const next = [...structure];
      next.splice(Math.max(0, Math.min(insertIdx, next.length)), 0, newToken);
      setStructure(next);
    } else if (reorderId) {
      const fromIdx = structure.findIndex(t => t.id === reorderId);
      if (fromIdx >= 0) {
        const next = [...structure];
        const [moved] = next.splice(fromIdx, 1);
        const adj = fromIdx < insertIdx ? insertIdx - 1 : insertIdx;
        next.splice(Math.max(0, Math.min(adj, next.length)), 0, moved);
        setStructure(next);
      }
    }
    setDragOver({ active: false, idx: -1 });
    setDraggingId(null);
  };

  const removeToken = (id) => setStructure(structure.filter(t => t.id !== id));
  const updateToken = (id, patch) => setStructure(structure.map(t => t.id === id ? { ...t, ...patch } : t));

  const clearStructure = () => setStructure([]);
  const resetStructure = () => setStructure(DEFAULT_STRUCTURES[activeChannel]);

  // ---- Styling ----
  const tokens = C_TOKENS;

  function FamilyDot({ family, size = 6 }) {
    return <span style={{ width: size, height: size, borderRadius: "50%", background: FAMILIES[family]?.color || tokens.textSubtle, flexShrink: 0 }} />;
  }

  // ---- Contractures palette (right pane, "Contractures" tab) -------------------
  // The dictionary lives at the project level (window.CONTRACTURES_INITIAL).
  // This panel offers the "léger édition" UX — toggle on/off, edit short forms
  // inline, filter by category and scope. Adds/deletes are intentionally NOT
  // surfaced here: those belong on the dedicated dictionary page.
  function ContracturesPanel({
    contractures, setContractures,
    disabledIds, setDisabledIds,
    search, setSearch,
    cat, setCat,
    scopeFilter, setScopeFilter,
    channelScope, channelName,
    tokens,
  }) {
    const [editingId, setEditingId] = React.useState(null);
    const [editingShort, setEditingShort] = React.useState("");

    const SCOPE_LABEL = { "étagère": "ét.", "caisse": "cs.", "site": "web", "site mobile": "mob.", "marketing": "mkt." };
    const SCOPE_COLOR = {
      "étagère": "oklch(0.55 0.13 250)",
      "caisse": "oklch(0.55 0.14 60)",
      "site": "oklch(0.50 0.12 165)",
      "site mobile": "oklch(0.50 0.12 165)",
      "marketing": "oklch(0.55 0.16 320)",
    };

    const cats = React.useMemo(() => {
      const seen = new Set();
      contractures.forEach(c => seen.add(c.cat));
      return ["all", ...Array.from(seen)];
    }, [contractures]);

    const filtered = React.useMemo(() => {
      const q = search.trim().toLowerCase();
      return contractures.filter(c => {
        if (cat !== "all" && c.cat !== cat) return false;
        if (scopeFilter === "auto" && channelScope && !c.scope.includes(channelScope)) return false;
        if (q && !c.full.toLowerCase().includes(q) && !c.short.toLowerCase().includes(q)) return false;
        return true;
      });
    }, [contractures, search, cat, scopeFilter, channelScope]);

    // Group filtered by category for visual rhythm
    const grouped = React.useMemo(() => {
      const out = {};
      filtered.forEach(c => { (out[c.cat] = out[c.cat] || []).push(c); });
      return out;
    }, [filtered]);

    const disabledCount = filtered.filter(c => disabledIds.has(c.id)).length;
    const activeCount = filtered.length - disabledCount;

    function toggle(id) {
      setDisabledIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
      });
    }
    function startEdit(c) {
      if (c.locked) return;
      setEditingId(c.id);
      setEditingShort(c.short);
    }
    function commitEdit() {
      if (editingId == null) return;
      const v = editingShort.trim();
      if (v) {
        setContractures(list => list.map(c => c.id === editingId ? { ...c, short: v } : c));
      }
      setEditingId(null);
      setEditingShort("");
    }
    function resetAll() {
      setDisabledIds(new Set());
      setContractures((window.CONTRACTURES_INITIAL || []).map(r => ({ ...r, scope: [...r.scope] })));
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        {/* Search + scope filter */}
        <div style={{ padding: "10px 14px 8px 14px", borderBottom: `1px solid ${tokens.border}`, background: "#fff", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: tokens.textSubtle, display: "inline-flex" }}>
              <Icon name="search" size={11} />
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une contracture…"
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "6px 24px 6px 24px", fontSize: 11.5,
                border: `1px solid ${tokens.border}`, borderRadius: 3,
                outline: "none", fontFamily: tokens.font,
              }}
              onFocus={e => e.currentTarget.style.borderColor = tokens.accent}
              onBlur={e => e.currentTarget.style.borderColor = tokens.border}
            />
            {search && (
              <button onClick={() => setSearch("")}
                style={{
                  position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
                  border: "none", background: "transparent", cursor: "pointer",
                  color: tokens.textSubtle, padding: 4, display: "inline-flex",
                }}>
                <Icon name="x" size={11} />
              </button>
            )}
          </div>

          {/* Scope filter row */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5 }}>
            <span style={{ color: tokens.textSubtle, letterSpacing: 0.3, textTransform: "uppercase", fontWeight: 700, fontSize: 9.5 }}>Portée</span>
            {[
              { id: "auto", label: channelScope ? `Canal · ${channelName}` : "Tous", title: channelScope ? `Affiche les contractures applicables au canal ${channelName} (scope: ${channelScope})` : "Aucun scope mappé pour ce canal — affiche tout" },
              { id: "all", label: "Tous canaux", title: "Affiche tout le dictionnaire, indépendamment du canal actif" },
            ].map(o => {
              const active = scopeFilter === o.id;
              return (
                <button key={o.id} onClick={() => setScopeFilter(o.id)} title={o.title}
                  style={{
                    padding: "3px 8px", fontSize: 10.5, fontWeight: 600,
                    background: active ? tokens.accentSoft : "#fff",
                    border: `1px solid ${active ? tokens.accent : tokens.border}`,
                    color: active ? tokens.accentText : tokens.textMuted,
                    borderRadius: 2, cursor: "pointer",
                  }}>{o.label}</button>
              );
            })}
          </div>
        </div>

        {/* Category chips */}
        <div style={{
          padding: "8px 14px", background: "#fff", borderBottom: `1px solid ${tokens.border}`,
          display: "flex", flexWrap: "wrap", gap: 4,
        }}>
          {cats.map(c => {
            const active = cat === c;
            const label = c === "all" ? "Toutes" : c;
            return (
              <button key={c} onClick={() => setCat(c)}
                style={{
                  padding: "3px 8px", fontSize: 10.5, fontWeight: 600,
                  background: active ? tokens.text : "oklch(0.97 0 0)",
                  color: active ? "#fff" : tokens.textMuted,
                  border: `1px solid ${active ? tokens.text : "oklch(0.92 0 0)"}`,
                  borderRadius: 2, cursor: "pointer",
                }}>{label}</button>
            );
          })}
        </div>

        {/* List — grouped by category */}
        <div style={{ flex: 1, overflow: "auto", padding: "6px 0" }}>
          {Object.keys(grouped).length === 0 && (
            <div style={{ padding: "20px 14px", fontSize: 11, color: tokens.textSubtle, textAlign: "center" }}>
              Aucune contracture ne correspond.
            </div>
          )}
          {Object.entries(grouped).map(([catName, rows]) => (
            <div key={catName}>
              <div style={{
                position: "sticky", top: 0, zIndex: 1,
                padding: "6px 14px 4px 14px",
                background: "linear-gradient(to bottom, #fafbfc 80%, transparent)",
                fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5,
                color: tokens.textSubtle, textTransform: "uppercase",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span>{catName}</span>
                <span style={{ fontFamily: tokens.mono, fontWeight: 600, color: tokens.textSubtle, opacity: 0.7 }}>
                  · {rows.length}
                </span>
              </div>
              {rows.map(c => {
                const disabled = disabledIds.has(c.id);
                const isEditing = editingId === c.id;
                return (
                  <div key={c.id} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "5px 14px",
                    background: disabled ? "transparent" : "#fff",
                    borderBottom: `1px solid oklch(0.96 0 0)`,
                    opacity: disabled ? 0.5 : 1,
                  }}>
                    {/* Toggle */}
                    <button
                      onClick={() => toggle(c.id)}
                      title={disabled ? "Activer" : "Désactiver"}
                      style={{
                        flexShrink: 0,
                        width: 22, height: 13, padding: 0,
                        background: disabled ? "oklch(0.88 0 0)" : tokens.accent,
                        border: "none", borderRadius: 7, cursor: "pointer",
                        position: "relative", transition: "background 120ms",
                      }}>
                      <span style={{
                        position: "absolute", top: 1.5, left: disabled ? 1.5 : 10.5,
                        width: 10, height: 10, borderRadius: "50%", background: "#fff",
                        transition: "left 120ms",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                      }} />
                    </button>

                    {/* Full → short */}
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                      <span style={{
                        fontSize: 11.5, color: tokens.text,
                        textDecoration: disabled ? "line-through" : "none",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>{c.full}</span>
                      <span style={{ color: tokens.textSubtle, fontSize: 10 }}>→</span>
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editingShort}
                          onChange={e => setEditingShort(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={e => {
                            if (e.key === "Enter") commitEdit();
                            if (e.key === "Escape") { setEditingId(null); setEditingShort(""); }
                          }}
                          style={{
                            width: 64, padding: "1px 4px", fontSize: 11,
                            fontFamily: tokens.mono, fontWeight: 700,
                            border: `1px solid ${tokens.accent}`,
                            borderRadius: 2, outline: "none",
                            color: tokens.accentText, background: tokens.accentSoft,
                          }}
                        />
                      ) : (
                        <button
                          onClick={() => startEdit(c)}
                          disabled={c.locked}
                          title={c.locked ? "Contracture verrouillée" : "Cliquer pour modifier"}
                          style={{
                            padding: "1px 6px", fontSize: 11,
                            fontFamily: tokens.mono, fontWeight: 700,
                            background: c.locked ? "oklch(0.96 0 0)" : tokens.accentSoft,
                            color: c.locked ? tokens.textSubtle : tokens.accentText,
                            border: `1px solid ${c.locked ? tokens.border : "oklch(0.85 0.07 250)"}`,
                            borderRadius: 2,
                            cursor: c.locked ? "default" : "pointer",
                            display: "inline-flex", alignItems: "center", gap: 3,
                          }}>
                          {c.short}
                          {c.locked && <span style={{ opacity: 0.7, fontSize: 9 }}>🔒</span>}
                        </button>
                      )}
                    </div>

                    {/* Scope dots */}
                    <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                      {c.scope.map(s => {
                        const isActiveScope = channelScope && s === channelScope;
                        return (
                          <span key={s}
                            title={s}
                            style={{
                              fontSize: 8.5, fontFamily: tokens.mono, fontWeight: 700,
                              padding: "1px 4px",
                              color: SCOPE_COLOR[s] || tokens.textSubtle,
                              background: isActiveScope ? "oklch(0.96 0.04 250)" : "transparent",
                              border: `1px solid ${isActiveScope ? SCOPE_COLOR[s] : "oklch(0.92 0 0)"}`,
                              borderRadius: 2,
                              textTransform: "uppercase",
                            }}>{SCOPE_LABEL[s] || s.slice(0, 3)}</span>
                        );
                      })}
                    </div>

                    {/* Usage */}
                    <span style={{
                      flexShrink: 0,
                      fontSize: 9.5, fontFamily: tokens.mono,
                      color: tokens.textSubtle, minWidth: 38, textAlign: "right",
                    }}>
                      {c.usage >= 1000 ? `${(c.usage / 1000).toFixed(1)}k` : c.usage}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: "8px 14px", borderTop: `1px solid ${tokens.border}`, background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: 10.5, color: tokens.textSubtle, fontFamily: tokens.mono,
        }}>
          <span>
            <span style={{ color: tokens.text, fontWeight: 700 }}>{activeCount}</span> actives
            {disabledCount > 0 && <> · <span style={{ color: tokens.textMuted }}>{disabledCount} désact.</span></>}
          </span>
          <button onClick={resetAll}
            style={{
              fontSize: 10.5, padding: "2px 6px",
              background: "transparent", border: `1px solid ${tokens.border}`,
              borderRadius: 2, cursor: "pointer", color: tokens.textMuted,
              fontFamily: tokens.font, fontWeight: 600,
            }}
            title="Réactiver toutes les contractures et restaurer les abréviations par défaut">
            Réinitialiser
          </button>
        </div>
      </div>
    );
  }

  // Token chip component (in the drop zone)
  function StructureToken({ tok, idx }) {
    const isVar = tok.type === "var";
    const v = isVar ? VARIABLES.find(x => x.key === tok.varKey) : null;
    const sep = !isVar ? SEPARATORS.find(x => x.key === tok.sepKey) : null;
    const fam = isVar ? v?.family : "sep";
    const F = FAMILIES[fam];
    const editing = editingTokenId === tok.id;

    const hasFmt = isVar && (tok.caseFmt !== "asis" || tok.trunc || tok.contract);

    return (
      <div
        data-token-chip="1"
        data-token-id={tok.id}
        style={{ display: "inline-flex", flexDirection: "column", gap: 4, position: "relative" }}
      >
        <div
          draggable
          onDragStart={(e) => { setJustDragged(false); onTokenDragStart(e, tok.id); }}
          onDragEnd={(e) => { setJustDragged(true); onTokenDragEnd(); setTimeout(() => setJustDragged(false), 50); }}
          onClick={(e) => {
            e.stopPropagation();
            // Suppress click that fires after a drag completes
            if (justDragged) return;
            if (isVar) setEditingTokenId(editing ? null : tok.id);
          }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: isVar ? "5px 8px 5px 8px" : "5px 8px",
            background: F.soft,
            border: `1.5px solid ${F.border}`,
            borderRadius: 4,
            color: F.color,
            fontSize: 12,
            fontWeight: 600,
            cursor: draggingId === tok.id ? "grabbing" : "grab",
            opacity: draggingId === tok.id ? 0.4 : 1,
            userSelect: "none",
            whiteSpace: "nowrap",
            position: "relative",
            transition: "opacity 120ms",
          }}
          title={isVar ? "Glisser pour réordonner · cliquer pour formatter" : "Glisser pour réordonner"}
        >
          <span style={{ color: F.color, opacity: 0.5, marginRight: -2 }}><Icon name="grip" size={10} /></span>
          {isVar ? (
            <>
              <Icon name={v.icon} size={11} />
              <span>{v.label}</span>
              {hasFmt && <span style={{ fontSize: 9, padding: "1px 4px", background: F.color, color: "#fff", borderRadius: 2, fontWeight: 700, letterSpacing: 0.3 }}>
                {[
                  tok.caseFmt === "upper" && "AA",
                  tok.caseFmt === "lower" && "aa",
                  tok.caseFmt === "title" && "Aa",
                  tok.contract && "ABR",
                  tok.trunc && `${tok.trunc}c`,
                ].filter(Boolean).join(" · ")}
              </span>}
            </>
          ) : (
            <span style={{ fontFamily: tokens.mono, fontSize: 11 }}>{sep?.label}</span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); removeToken(tok.id); }}
            style={{
              border: "none", background: "transparent", color: F.color, opacity: 0.5,
              cursor: "pointer", padding: 0, marginLeft: 2, display: "inline-flex", alignItems: "center",
            }}
            title="Retirer"
            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
          >
            <Icon name="x" size={10} />
          </button>
        </div>

        {/* Editor popover */}
        {editing && isVar && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 20,
            background: "#fff", border: `1px solid ${tokens.border}`, borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)",
            padding: 12, minWidth: 240,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: tokens.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Formatage · {v.label}</div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10.5, color: tokens.textSubtle, marginBottom: 4 }}>Casse</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[
                  { k: "asis",  l: "Tel quel" },
                  { k: "upper", l: "AA" },
                  { k: "lower", l: "aa" },
                  { k: "title", l: "Aa" },
                ].map(o => (
                  <button key={o.k} onClick={() => updateToken(tok.id, { caseFmt: o.k })}
                    style={{
                      flex: 1, padding: "5px 0", fontSize: 11,
                      background: tok.caseFmt === o.k ? F.color : "#fff",
                      color: tok.caseFmt === o.k ? "#fff" : tokens.text,
                      border: `1px solid ${tok.caseFmt === o.k ? F.color : tokens.border}`,
                      borderRadius: 3, cursor: "pointer", fontWeight: 600,
                    }}>{o.l}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10.5, color: tokens.textSubtle, marginBottom: 4 }}>Tronquer à</div>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <input type="number" min="1" max="40" value={tok.trunc || ""}
                  onChange={(e) => updateToken(tok.id, { trunc: e.target.value ? Number(e.target.value) : null })}
                  placeholder="—"
                  style={{
                    flex: 1, padding: "5px 8px", fontSize: 11,
                    border: `1px solid ${tokens.border}`, borderRadius: 3,
                    fontFamily: tokens.mono, outline: "none",
                  }}/>
                <span style={{ fontSize: 10.5, color: tokens.textSubtle }}>caractères</span>
                {tok.trunc && <button onClick={() => updateToken(tok.id, { trunc: null })}
                  style={{ border: "none", background: "transparent", cursor: "pointer", color: tokens.textSubtle, padding: 2 }}><Icon name="x" size={11}/></button>}
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, cursor: "pointer", padding: "5px 0" }}>
              <input type="checkbox" checked={tok.contract} onChange={(e) => updateToken(tok.id, { contract: e.target.checked })}/>
              Appliquer les contractures (paquet → pqt, etc.)
            </label>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: `1px solid ${tokens.border}` }}>
              <button onClick={() => updateToken(tok.id, { caseFmt: "asis", trunc: null, contract: false })}
                style={{ fontSize: 10.5, padding: "3px 8px", background: "#fff", border: `1px solid ${tokens.border}`, borderRadius: 3, cursor: "pointer", color: tokens.textSubtle }}>
                Réinitialiser
              </button>
              <button onClick={() => setEditingTokenId(null)}
                style={{ fontSize: 10.5, padding: "3px 8px", background: tokens.text, color: "#fff", border: `1px solid ${tokens.text}`, borderRadius: 3, cursor: "pointer", fontWeight: 600 }}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // (SepSlot is now SepSlotD7, defined at module scope above to keep
  //  component identity stable across re-renders so inputs don't unmount.)


  // Empty drop zone (when no tokens)
  function EmptyDropZone() {
    const active = dragOver.active;
    return (
      <div
        onDragOver={(e) => onDropZoneDragOver(e, 0)}
        onDragLeave={onDropZoneLeave}
        onDrop={(e) => onDropZoneDrop(e, 0)}
        style={{
          flex: 1, minHeight: 60, display: "flex", alignItems: "center", justifyContent: "center",
          border: `2px dashed ${active ? tokens.accent : tokens.border}`,
          borderRadius: 4,
          background: active ? "oklch(0.97 0.04 250)" : "#fafbfc",
          color: tokens.textSubtle,
          fontSize: 12,
        }}
      >
        Glissez une variable ou un séparateur depuis la palette →
      </div>
    );
  }

  // Live preview string for the structure (no real product — uses examples)
  const liveExample = renderStructure(structure, {
    brand: "PANZANI", prod: "Coquillettes", weight: "500g", cond: "paquet",
    qty: "×4", unitformat: "125g", origin: "FR", qualif: "tradition",
    flavor: null, claim: null, variety: null, label: null, conserv: "ambiant",
  });

  // ----- RENDER -----
  return (
    <div style={{
      width: "100%", height: "100%",
      background: tokens.bg, color: tokens.text,
      fontFamily: tokens.font, fontSize: 12.5,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* HEADER */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
        borderBottom: `1px solid ${tokens.border}`, background: "#fff",
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 4, background: tokens.accent,
          display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 12, letterSpacing: 0.5,
        }}>D7</div>
        <div style={{ fontSize: 13.5, fontWeight: 700 }}>Constructeur de libellé</div>
        <span style={{ fontSize: 11, color: tokens.textMuted, padding: "2px 6px", background: "oklch(0.96 0 0)", borderRadius: 3, fontFamily: tokens.mono }}>
          drag & drop · multi-canal · preview live
        </span>

        <div style={{ flex: 1 }} />

        <span style={{ fontSize: 11, color: tokens.textSubtle, fontFamily: tokens.mono }}>
          modèle actif · <span style={{ color: tokens.accentText, fontWeight: 700 }}>{channel.name}</span>
        </span>
        <button style={btnSmGhostD7}>
          <Icon name="copy" size={11}/> Dupliquer
        </button>
        <button style={btnSmPrimaryD7}>
          <Icon name="check" size={11}/> Appliquer aux articles
        </button>
      </div>

      {/* BODY: 3 columns — left models · main · right palette */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "220px minmax(0, 1fr) 280px", overflow: "hidden" }}>

        {/* LEFT: MODELS LIST */}
        <div style={{
          background: "#fafbfc", borderRight: `1px solid ${tokens.border}`,
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{
            padding: "12px 14px 8px 14px",
            borderBottom: `1px solid ${tokens.border}`,
            background: "#fff",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, color: tokens.textMuted, textTransform: "uppercase" }}>
                Modèles
              </div>
              <span style={{ fontSize: 10, color: tokens.textSubtle, fontFamily: tokens.mono }}>
                {CHANNELS.length}
              </span>
              <div style={{ flex: 1 }} />
              <button title="Nouveau modèle" style={{
                width: 20, height: 20, padding: 0, lineHeight: 1,
                background: "#fff", border: `1px solid ${tokens.border}`,
                borderRadius: 3, cursor: "pointer",
                fontSize: 14, fontWeight: 500, color: tokens.textMuted,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>+</button>
            </div>
            <div style={{ fontSize: 11, color: tokens.textSubtle, marginTop: 2 }}>
              Un modèle par canal de diffusion
            </div>
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: "6px 8px" }}>
            {CHANNELS.map(c => {
              const active = c.id === activeChannel;
              const tokensCount = structures[c.id].length;
              const sample = renderStructure(structures[c.id], {
                brand: "PANZANI", prod: "Coquillettes", weight: "500g", cond: "paquet",
                variety: "tricolore", origin: "FR",
              });
              const sampleLen = sample.length;
              const overSample = sampleLen > c.limit;
              return (
                <button key={c.id}
                  onClick={() => { setActiveChannel(c.id); setEditingTokenId(null); }}
                  style={{
                    width: "100%", textAlign: "left",
                    display: "block",
                    padding: "9px 10px 9px 12px",
                    marginBottom: 3,
                    background: active ? "#fff" : "transparent",
                    border: `1px solid ${active ? tokens.accent : "transparent"}`,
                    borderLeft: active ? `3px solid ${tokens.accent}` : "3px solid transparent",
                    borderRadius: 4,
                    cursor: "pointer",
                    boxShadow: active ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#fff"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <div style={{
                      fontSize: 12, fontWeight: active ? 700 : 600,
                      color: active ? tokens.accentText : tokens.text,
                      flex: 1, minWidth: 0,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {c.name}
                    </div>
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, letterSpacing: 0.3,
                      fontFamily: tokens.mono,
                      padding: "1px 5px",
                      background: active ? tokens.accentSoft : "oklch(0.96 0 0)",
                      color: active ? tokens.accentText : tokens.textMuted,
                      borderRadius: 2,
                    }}>
                      {c.limit}c
                    </span>
                  </div>
                  <div style={{
                    fontFamily: tokens.mono, fontSize: 10,
                    color: tokens.textSubtle,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    marginBottom: 5,
                  }} title={sample}>
                    {sample || <span style={{ fontStyle: "italic" }}>vide</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: tokens.textSubtle }}>
                    <span style={{ fontFamily: tokens.mono }}>{tokensCount} élém.</span>
                    <span style={{ width: 2, height: 2, borderRadius: "50%", background: tokens.textSubtle }} />
                    <span style={{
                      fontFamily: tokens.mono,
                      color: overSample ? tokens.red : tokens.textSubtle,
                      fontWeight: overSample ? 700 : 400,
                    }}>
                      {sampleLen}/{c.limit}
                    </span>
                    <div style={{ flex: 1 }} />
                    {/* mini progress bar */}
                    <div style={{
                      width: 36, height: 3, borderRadius: 2,
                      background: "oklch(0.92 0 0)", overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${Math.min(100, (sampleLen / c.limit) * 100)}%`,
                        height: "100%",
                        background: overSample ? tokens.red : (active ? tokens.accent : tokens.textMuted),
                      }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* footer actions for the active model */}
          <div style={{
            padding: "8px 10px", borderTop: `1px solid ${tokens.border}`,
            background: "#fff",
            display: "flex", flexDirection: "column", gap: 5,
          }}>
            <div style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4,
              color: tokens.textSubtle, textTransform: "uppercase",
              marginBottom: 2,
            }}>
              Modèle actif
            </div>
            <button style={btnSmGhostD7} onClick={resetStructure}>
              <Icon name="copy" size={11}/> Réinitialiser
            </button>
            <button style={btnSmGhostD7} onClick={clearStructure}>
              <Icon name="x" size={11}/> Vider
            </button>
            <button style={btnSmPrimaryD7}>
              <Icon name="check" size={11}/> Enregistrer
            </button>
          </div>
        </div>

        {/* MAIN COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", borderRight: `1px solid ${tokens.border}` }}>

          {/* === DROP ZONE === */}
          <div style={{ padding: "16px 20px", background: "#fff", borderBottom: `1px solid ${tokens.border}` }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, color: tokens.textMuted, textTransform: "uppercase" }}>
                Structure — {channel.name}
              </div>
              <div style={{ fontSize: 11, color: tokens.textSubtle }}>
                Glissez les variables depuis la palette →. Tapez les séparateurs entre les jetons. Cliquez un jeton pour le formatter.
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ fontSize: 10.5, color: tokens.textSubtle, fontFamily: tokens.mono }}>
                limite canal : {channel.limit} car.
              </div>
            </div>

            {/* The drop zone itself — always accepts drops; computes insert index from cursor X */}
            <div
              ref={(el) => { /* no ref needed for the zone; children carry refs */ }}
              onDragOver={(e) => {
                // Always accept palette/reorder drags here; narrow the slot index
                // by finding the nearest token-gap to the cursor — row-aware so
                // wrapping to a 2nd line doesn't snap back to row 1.
                if (!e.dataTransfer.types.includes("application/x-builder-token") &&
                    !e.dataTransfer.types.includes("application/x-builder-reorder")) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = e.dataTransfer.types.includes("application/x-builder-reorder") ? "move" : "copy";
                const zone = e.currentTarget;
                const chips = Array.from(zone.querySelectorAll("[data-token-chip='1']"));
                let idx = structure.length;
                if (chips.length === 0) {
                  idx = 0;
                } else {
                  const x = e.clientX, y = e.clientY;
                  // 1) Find chips on the same row as the cursor (Y inside chip rect, with tolerance).
                  const rects = chips.map(c => c.getBoundingClientRect());
                  let sameRow = chips.filter((_, i) => y >= rects[i].top - 4 && y <= rects[i].bottom + 4);
                  // 2) If cursor isn't on any row (gap between rows), pick the row whose
                  //    midline is closest to Y.
                  if (sameRow.length === 0) {
                    let bestRowMid = -1, bestDist = Infinity;
                    rects.forEach(r => {
                      const mid = (r.top + r.bottom) / 2;
                      const d = Math.abs(mid - y);
                      if (d < bestDist) { bestDist = d; bestRowMid = mid; }
                    });
                    sameRow = chips.filter((_, i) => {
                      const mid = (rects[i].top + rects[i].bottom) / 2;
                      return Math.abs(mid - bestRowMid) < 2;
                    });
                  }
                  // 3) Within that row, insert before the first chip whose center X > cursor X;
                  //    otherwise insert after the last chip in that row.
                  let placed = false;
                  for (let i = 0; i < sameRow.length; i++) {
                    const r = sameRow[i].getBoundingClientRect();
                    if (x < r.left + r.width / 2) {
                      const tokenId = sameRow[i].getAttribute("data-token-id");
                      const sIdx = structure.findIndex(t => t.id === tokenId);
                      idx = sIdx >= 0 ? sIdx : 0;
                      placed = true;
                      break;
                    }
                  }
                  if (!placed && sameRow.length > 0) {
                    const lastChip = sameRow[sameRow.length - 1];
                    const lastTokenId = lastChip.getAttribute("data-token-id");
                    const lastSIdx = structure.findIndex(t => t.id === lastTokenId);
                    // Insert after the last var chip on this row, after any trailing sep.
                    let after = lastSIdx + 1;
                    while (after < structure.length && structure[after].type === "sep") after++;
                    idx = after;
                  }
                }
                setDragOver({ active: true, idx });
              }}
              onDragLeave={(e) => {
                // Only clear if leaving the zone entirely (not entering a child)
                if (e.currentTarget.contains(e.relatedTarget)) return;
                setDragOver({ active: false, idx: -1 });
              }}
              onDrop={(e) => {
                if (!e.dataTransfer.types.includes("application/x-builder-token") &&
                    !e.dataTransfer.types.includes("application/x-builder-reorder")) return;
                e.preventDefault();
                // Recompute idx the same row-aware way as dragover
                const zone = e.currentTarget;
                const chips = Array.from(zone.querySelectorAll("[data-token-chip='1']"));
                let idx = structure.length;
                if (chips.length > 0) {
                  const x = e.clientX, y = e.clientY;
                  const rects = chips.map(c => c.getBoundingClientRect());
                  let sameRow = chips.filter((_, i) => y >= rects[i].top - 4 && y <= rects[i].bottom + 4);
                  if (sameRow.length === 0) {
                    let bestRowMid = -1, bestDist = Infinity;
                    rects.forEach(r => {
                      const mid = (r.top + r.bottom) / 2;
                      const d = Math.abs(mid - y);
                      if (d < bestDist) { bestDist = d; bestRowMid = mid; }
                    });
                    sameRow = chips.filter((_, i) => {
                      const mid = (rects[i].top + rects[i].bottom) / 2;
                      return Math.abs(mid - bestRowMid) < 2;
                    });
                  }
                  let placed = false;
                  for (let i = 0; i < sameRow.length; i++) {
                    const r = sameRow[i].getBoundingClientRect();
                    if (x < r.left + r.width / 2) {
                      const tokenId = sameRow[i].getAttribute("data-token-id");
                      const sIdx = structure.findIndex(t => t.id === tokenId);
                      idx = sIdx >= 0 ? sIdx : 0;
                      placed = true;
                      break;
                    }
                  }
                  if (!placed && sameRow.length > 0) {
                    const lastChip = sameRow[sameRow.length - 1];
                    const lastTokenId = lastChip.getAttribute("data-token-id");
                    const lastSIdx = structure.findIndex(t => t.id === lastTokenId);
                    let after = lastSIdx + 1;
                    while (after < structure.length && structure[after].type === "sep") after++;
                    idx = after;
                  }
                } else { idx = 0; }
                onDropZoneDrop(e, idx);
              }}
              style={{
                display: "flex", flexWrap: "wrap", alignItems: "center",
                columnGap: 4, rowGap: 8,
                minHeight: 70, padding: 12,
                background: "#fafbfc",
                border: `1.5px dashed ${dragOver.active ? tokens.accent : tokens.border}`,
                borderRadius: 6,
              }}
            >
              {structure.length === 0 ? <EmptyDropZone /> : (() => {
                // Build a sequence of var-tokens with the sep-slot indices between them.
                // CRITICAL: slot keys must be STABLE across sep create/delete so the
                // input doesn't unmount and lose focus. We key slots by their position
                // relative to var tokens, not by the sep id.
                const elements = [];
                const vars = structure
                  .map((t, i) => ({ t, i }))
                  .filter(x => x.t.type === "var");

                // Helper: find the sep token sitting at a given structure index range, if any
                const sepAt = (startIdx, endIdx) => {
                  for (let i = startIdx; i < endIdx; i++) {
                    if (structure[i] && structure[i].type === "sep") return { tok: structure[i], idx: i };
                  }
                  return null;
                };

                // Drop indicator: a vertical accent bar shown at the cursor's
                // computed insert position. Mapping: when dragOver.idx <= leading
                // sep's structure index, show before first chip; otherwise show
                // after the var chip whose structure-index < dragOver.idx <= nextVar.
                const indicator = (key) => (
                  <div key={key} style={{
                    width: 3, alignSelf: "stretch",
                    background: tokens.accent,
                    borderRadius: 2,
                    margin: "0 2px",
                    boxShadow: `0 0 6px ${tokens.accent}`,
                    flexShrink: 0,
                  }} />
                );

                // Determine visual insert position: count of var chips that
                // come BEFORE dragOver.idx in the structure array.
                const showIndicator = dragOver.active && dragOver.idx >= 0;
                const insertBeforeChipCount = showIndicator
                  ? structure.slice(0, dragOver.idx).filter(t => t.type === "var").length
                  : -1;

                // Leading slot (before first var)
                const firstVarIdx = vars.length ? vars[0].i : structure.length;
                const leading = sepAt(0, firstVarIdx);
                if (showIndicator && insertBeforeChipCount === 0) elements.push(indicator("ind-0"));
                elements.push(
                  <SepSlotD7
                    key="slot-lead"
                    idx={leading ? leading.idx : 0}
                    sepTok={leading ? leading.tok : null}
                    dragOver={dragOver}
                    onDropZoneDragOver={onDropZoneDragOver}
                    onDropZoneLeave={onDropZoneLeave}
                    onDropZoneDrop={onDropZoneDrop}
                    structure={structure}
                    setStructure={setStructure}
                    updateToken={updateToken}
                    removeToken={removeToken}
                    tokens={tokens}
                  />
                );

                vars.forEach((vEntry, k) => {
                  elements.push(
                    <StructureToken key={vEntry.t.id} tok={vEntry.t} idx={vEntry.i} />
                  );
                  // Show indicator AFTER this chip when insert position is after it
                  if (showIndicator && insertBeforeChipCount === k + 1) {
                    elements.push(indicator(`ind-after-${vEntry.t.id}`));
                  }
                  // Slot between this var and next var (or after last var)
                  const nextVarIdx = vars[k + 1] ? vars[k + 1].i : structure.length;
                  const between = sepAt(vEntry.i + 1, nextVarIdx);
                  // Insertion idx for a NEW sep here: just after this var
                  const insertIdx = between ? between.idx : vEntry.i + 1;
                  // Stable key: anchor to the preceding var token id, not the sep
                  const slotKey = `slot-after-${vEntry.t.id}`;
                  elements.push(
                    <SepSlotD7
                      key={slotKey}
                      idx={insertIdx}
                      sepTok={between ? between.tok : null}
                      dragOver={dragOver}
                      onDropZoneDragOver={onDropZoneDragOver}
                      onDropZoneLeave={onDropZoneLeave}
                      onDropZoneDrop={onDropZoneDrop}
                      structure={structure}
                      setStructure={setStructure}
                      updateToken={updateToken}
                      removeToken={removeToken}
                      tokens={tokens}
                    />
                  );
                });

                return <>{elements}</>;
              })()}
            </div>

            {/* Live preview row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, padding: "8px 10px", background: "oklch(0.97 0.02 165)", border: `1px solid oklch(0.85 0.06 165)`, borderRadius: 4 }}>
              <Icon name="preview" size={12} />
              <span style={{ fontSize: 10.5, color: tokens.textSubtle, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase" }}>Aperçu</span>
              <span style={{ fontFamily: tokens.mono, fontSize: 12.5, color: tokens.text, fontWeight: 600 }}>
                {liveExample || <span style={{ color: tokens.textSubtle, fontWeight: 400 }}>—</span>}
              </span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 10.5, color: tokens.textSubtle, fontFamily: tokens.mono }}>
                {liveExample.length} car.
              </span>
            </div>
          </div>

          {/* === PREVIEW TABLE — D6 spreadsheet style === */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", background: "#fff" }}>
            {/* Section header bar */}
            <div style={{
              height: 32, padding: "0 14px", background: tokens.headerBg,
              borderBottom: `1px solid ${tokens.border}`, display: "flex", alignItems: "center",
              gap: 10, flexShrink: 0,
            }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
                <span style={{ color: tokens.textSubtle }}>Avant</span>
                <span style={{ color: tokens.accent, fontSize: 11 }}>→</span>
                <span style={{
                  color: tokens.accentText,
                  background: tokens.accentSoft,
                  border: `1px solid ${tokens.accent}`,
                  padding: "1px 7px", borderRadius: 3,
                }}>Après · libellé restructuré</span>
              </div>
              <span style={{ fontSize: 11, color: tokens.textSubtle, fontFamily: tokens.mono }}>
                {PRODUCTS.length} produits · canal {channel.name}
              </span>
              <div style={{ flex: 1 }} />

              {/* Toggle: voir contractures appliquées */}
              <button
                onClick={() => setPreviewWithContractures(v => !v)}
                title={previewWithContractures
                  ? `Contractures appliquées (scope: ${channelScope || "tous canaux"})`
                  : "Contractures masquées — clic pour appliquer"}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "3px 9px", height: 22,
                  fontSize: 10.5, fontWeight: 600,
                  fontFamily: tokens.font,
                  background: previewWithContractures ? tokens.accentSoft : "#fff",
                  border: `1px solid ${previewWithContractures ? tokens.accent : tokens.border}`,
                  color: previewWithContractures ? tokens.accentText : tokens.textMuted,
                  borderRadius: 3, cursor: "pointer",
                }}
              >
                {/* Pill toggle */}
                <span style={{
                  display: "inline-block", width: 18, height: 10, borderRadius: 6,
                  background: previewWithContractures ? tokens.accent : "oklch(0.85 0 0)",
                  position: "relative", transition: "background 120ms",
                }}>
                  <span style={{
                    position: "absolute", top: 1, left: previewWithContractures ? 9 : 1,
                    width: 8, height: 8, borderRadius: "50%", background: "#fff",
                    transition: "left 120ms",
                  }} />
                </span>
                Contractures
                <span style={{
                  fontFamily: tokens.mono, fontSize: 9.5,
                  color: previewWithContractures ? tokens.accentText : tokens.textSubtle,
                  fontWeight: 500,
                }}>
                  {previewWithContractures ? "appliquées" : "masquées"}
                </span>
              </button>

              {(() => {
                const rendered = PRODUCTS.map(p => renderStructure(structure, p, { disableContract: !previewWithContractures }));
                const overCount = rendered.filter(s => s.length > channel.limit).length;
                if (overCount === 0) return (
                  <span style={{ fontSize: 11, color: tokens.green, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <Icon name="check" size={11}/>{PRODUCTS.length}/{PRODUCTS.length} dans la limite
                  </span>
                );
                return (
                  <span style={{ fontSize: 11, color: tokens.red, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
                    ⚠ {overCount}/{PRODUCTS.length} dépassent {channel.limit} car.
                  </span>
                );
              })()}
            </div>

            {/* Scrollable grid */}
            <div style={{ flex: 1, overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: 11.5 }}>
                <colgroup>
                  <col style={{ width: 38 }} />
                  <col style={{ width: 132 }} />
                  <col style={{ width: "38%" }} />
                  <col style={{ width: "50%" }} />
                  <col style={{ width: 58 }} />
                </colgroup>
                <thead>
                  <tr>
                    {[
                      { l: "#",                 a: "center", k: "n" },
                      { l: "EAN",               a: "left",   k: "ean" },
                      { l: "Libellé actuel",    a: "left",   k: "old" },
                      { l: "Nouveau libellé",   a: "left",   k: "new" },
                      { l: "Lng",               a: "right",  k: "len" },
                    ].map((h, i, arr) => {
                      const isNew = h.k === "new";
                      return (
                        <th key={i} style={{
                          padding: "5px 8px", height: 28,
                          background: isNew ? tokens.accentSoft : tokens.headerBg,
                          borderBottom: isNew
                            ? `2px solid ${tokens.accent}`
                            : `1px solid ${tokens.border}`,
                          borderRight: i < arr.length - 1 ? `1px solid ${tokens.border}` : "none",
                          borderLeft: isNew ? `2px solid ${tokens.accent}` : "none",
                          fontSize: 10, fontWeight: 700, letterSpacing: 0.4,
                          color: isNew ? tokens.accentText : tokens.textMuted,
                          textTransform: "uppercase",
                          textAlign: h.a, position: "sticky", top: 0, zIndex: 1,
                        }}>
                          {isNew && (
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 5,
                            }}>
                              <span style={{
                                width: 6, height: 6, borderRadius: "50%",
                                background: tokens.accent, display: "inline-block",
                              }} />
                              {h.l}
                            </span>
                          )}
                          {!isNew && h.l}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS.map((p, i) => {
                    const rendered = renderStructure(structure, p, { disableContract: !previewWithContractures });
                    const over = rendered.length > channel.limit;
                    const rowBg = i % 2 ? tokens.rowAlt : "#fff";
                    return (
                      <tr key={p.ean} style={{ background: rowBg }}>
                        <td style={{
                          height: 26, padding: "0 4px",
                          borderBottom: `1px solid ${tokens.border}`,
                          borderRight: `1px solid ${tokens.border}`,
                          fontFamily: tokens.mono, fontSize: 10.5,
                          color: tokens.textSubtle, textAlign: "center",
                          verticalAlign: "middle",
                        }}>{i + 1}</td>
                        <td style={{
                          height: 26, padding: "0 8px",
                          borderBottom: `1px solid ${tokens.border}`,
                          borderRight: `1px solid ${tokens.border}`,
                          fontFamily: tokens.mono, fontSize: 11.5,
                          color: tokens.text, fontWeight: 500,
                          verticalAlign: "middle",
                        }}>
                          {(() => {
                            const ean = String(p.ean);
                            return <><span style={{ color: tokens.textSubtle }}>{ean.slice(0, 3)}</span>{ean.slice(3)}</>;
                          })()}
                        </td>
                        <td style={{
                          height: 26, padding: "0 8px",
                          borderBottom: `1px solid ${tokens.border}`,
                          borderRight: `1px solid ${tokens.border}`,
                          fontSize: 11, color: tokens.textSubtle,
                          fontStyle: "normal",
                          verticalAlign: "middle",
                          background: "oklch(0.985 0.003 100)",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          textDecoration: "line-through",
                          textDecorationColor: "oklch(0.85 0.005 100)",
                        }} title={p.actuel}>
                          {p.actuel}
                        </td>
                        <td style={{
                          height: 26, padding: "0 10px",
                          borderBottom: `1px solid ${tokens.border}`,
                          borderRight: `1px solid ${tokens.border}`,
                          borderLeft: `2px solid ${tokens.accent}`,
                          verticalAlign: "middle",
                          background: over ? tokens.redSoft : "oklch(0.985 0.015 250)",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }} title={rendered}>
                          <span style={{
                            fontFamily: tokens.mono, fontSize: 12, fontWeight: 700,
                            color: over ? tokens.red : tokens.text,
                            letterSpacing: 0.1,
                          }}>
                            {rendered || <span style={{ color: tokens.textSubtle, fontWeight: 400 }}>—</span>}
                          </span>
                        </td>
                        <td style={{
                          height: 26, padding: "0 8px",
                          borderBottom: `1px solid ${tokens.border}`,
                          textAlign: "right", verticalAlign: "middle",
                          fontFamily: tokens.mono, fontSize: 11,
                          background: over ? tokens.redSoft : "transparent",
                        }}>
                          <span style={{ color: over ? tokens.red : tokens.textSubtle, fontWeight: over ? 700 : 500 }}>
                            {rendered.length}
                          </span>
                          <span style={{ color: tokens.textSubtle, fontWeight: 400 }}>/{channel.limit}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer summary — D6 style */}
            <div style={{
              padding: "6px 14px", borderTop: `1px solid ${tokens.border}`,
              background: tokens.headerBg,
              fontSize: 11, color: tokens.textMuted, fontFamily: tokens.mono,
              display: "flex", gap: 16, flexShrink: 0,
            }}>
              <span>Cellule rouge : libellé dépasse la limite canal</span>
              <span style={{ flex: 1 }} />
              {(() => {
                const lengths = PRODUCTS.map(p => renderStructure(structure, p, { disableContract: !previewWithContractures }).length);
                const avg = Math.round(lengths.reduce((a,b)=>a+b,0) / Math.max(lengths.length, 1));
                const max = Math.max(...lengths, 0);
                const min = Math.min(...lengths, 0);
                return <span>moy. {avg} car. · min {min} · max {max} · limite {channel.limit}</span>;
              })()}
            </div>
          </div>
        </div>

        {/* RIGHT: PALETTE */}
        <div style={{ background: "#fafbfc", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
          {/* Tab strip */}
          <div style={{
            display: "flex", borderBottom: `1px solid ${tokens.border}`,
            background: "#fff",
          }}>
            {(() => {
              const tabs = [
                { id: "vars", label: "Variables", count: VARIABLES.length },
                {
                  id: "contractures", label: "Contractures",
                  count: contractures.filter(c => contractureScopeFilter !== "auto" || !channelScope || c.scope.includes(channelScope)).length,
                },
              ];
              return tabs.map(t => {
                const active = paletteTab === t.id;
                return (
                  <button key={t.id}
                    onClick={() => setPaletteTab(t.id)}
                    style={{
                      flex: 1,
                      padding: "10px 8px 9px 8px",
                      background: active ? "#fff" : "#fafbfc",
                      border: "none",
                      borderBottom: active ? `2px solid ${tokens.accent}` : "2px solid transparent",
                      cursor: "pointer",
                      fontSize: 12, fontWeight: active ? 700 : 500,
                      color: active ? tokens.accentText : tokens.textMuted,
                      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}>
                    {t.label}
                    <span style={{
                      fontSize: 9.5, fontFamily: tokens.mono,
                      padding: "1px 5px", borderRadius: 2,
                      background: active ? tokens.accentSoft : "oklch(0.96 0 0)",
                      color: active ? tokens.accentText : tokens.textSubtle,
                      fontWeight: 600,
                    }}>{t.count}</span>
                  </button>
                );
              });
            })()}
          </div>

          {paletteTab === "vars" && (
            <div style={{ flex: 1, minHeight: 0, overflow: "auto", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "10px 14px 8px 14px", borderBottom: `1px solid ${tokens.border}`, background: "#fff" }}>
                <div style={{ fontSize: 11, color: tokens.textSubtle }}>
                  Glissez un élément vers la zone de structure
                </div>
              </div>

          {/* Variable groups by family */}
          {Object.entries(FAMILIES).filter(([k]) => k !== "sep").map(([famKey, fam]) => {
            const vars = VARIABLES.filter(v => v.family === famKey);
            return (
              <div key={famKey} style={{ padding: "10px 14px 12px 14px", borderBottom: `1px solid ${tokens.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <FamilyDot family={famKey} size={8} />
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: fam.color }}>
                    {fam.label}
                  </div>
                  <span style={{ fontSize: 10, color: tokens.textSubtle, fontFamily: tokens.mono }}>{vars.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {vars.map(v => {
                    const inStruct = structure.some(t => t.type === "var" && t.varKey === v.key);
                    return (
                      <div key={v.key}
                        draggable
                        onDragStart={(e) => onPaletteDragStart(e, { kind: "var", key: v.key })}
                        style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "6px 8px",
                          background: "#fff",
                          border: `1px solid ${tokens.border}`,
                          borderRadius: 3,
                          cursor: "grab",
                          fontSize: 11.5,
                          color: tokens.text,
                          opacity: inStruct ? 0.55 : 1,
                          position: "relative",
                        }}
                        title={`Exemple : ${v.example}`}
                      >
                        <span style={{ color: fam.color, opacity: 0.6 }}><Icon name="grip" size={10} /></span>
                        <span style={{ color: fam.color }}><Icon name={v.icon} size={12} /></span>
                        <span style={{ flex: 1, fontWeight: 600 }}>{v.label}</span>
                        <span style={{ fontSize: 10, color: tokens.textSubtle, fontFamily: tokens.mono, fontStyle: "italic" }}>
                          {v.example}
                        </span>
                        {inStruct && <span style={{ position: "absolute", top: 3, right: 3, width: 5, height: 5, borderRadius: "50%", background: tokens.accent }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Separator hint — users type separators directly in the structure zone */}
          <div style={{ padding: "12px 14px 14px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: tokens.textSubtle }} />
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: tokens.textMuted }}>
                Séparateurs
              </div>
            </div>
            <div style={{
              fontSize: 11, color: tokens.textMuted, lineHeight: 1.5,
              padding: "8px 10px", background: "#fff",
              border: `1px dashed ${tokens.border}`, borderRadius: 3,
            }}>
              Tapez directement entre deux variables — espace, virgule, tiret, <span style={{ fontFamily: tokens.mono }}>" — "</span>, <span style={{ fontFamily: tokens.mono }}>" / "</span>, ou n'importe quel caractère.
              Effacer le champ retire le séparateur.
            </div>
          </div>
            </div>
          )}

          {paletteTab === "contractures" && (
            <ContracturesPanel
              contractures={contractures} setContractures={setContractures}
              disabledIds={disabledContractureIds} setDisabledIds={setDisabledContractureIds}
              search={contractureSearch} setSearch={setContractureSearch}
              cat={contractureCat} setCat={setContractureCat}
              scopeFilter={contractureScopeFilter} setScopeFilter={setContractureScopeFilter}
              channelScope={channelScope} channelName={channel.name}
              tokens={tokens}
            />
          )}
        </div>
      </div>

      {/* FOOTER hint */}
      <div style={{ padding: "6px 16px", borderTop: `1px solid ${tokens.border}`, background: "#fafbfc",
        display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: tokens.textSubtle }}>
        <span><kbd style={kbdD7}>glisser</kbd> palette → structure</span>
        <span><kbd style={kbdD7}>taper</kbd> entre jetons → séparateur</span>
        <span><kbd style={kbdD7}>cliquer</kbd> jeton → formatter</span>
        <span><kbd style={kbdD7}>×</kbd> retirer · <kbd style={kbdD7}>glisser</kbd> pour réordonner</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: tokens.mono }}>{structure.length} éléments · canal {channel.name}</span>
      </div>
    </div>
  );
}

const btnSmGhostD7 = {
  display: "inline-flex", alignItems: "center", gap: 5,
  padding: "5px 10px", height: 26, fontSize: 11.5, fontWeight: 600,
  background: "#fff", color: C_TOKENS.text,
  border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, cursor: "pointer",
};
const btnSmPrimaryD7 = {
  display: "inline-flex", alignItems: "center", gap: 5,
  padding: "5px 10px", height: 26, fontSize: 11.5, fontWeight: 600,
  background: C_TOKENS.text, color: "#fff",
  border: `1px solid ${C_TOKENS.text}`, borderRadius: 3, cursor: "pointer",
};
const kbdD7 = {
  display: "inline-block",
  padding: "1px 5px",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 10, fontWeight: 600,
  background: "#fff", color: "oklch(0.42 0.13 250)",
  border: "1px solid oklch(0.78 0.08 250)",
  borderRadius: 2, lineHeight: 1.4,
};

window.LabelBuilderD7 = LabelBuilderD7;
