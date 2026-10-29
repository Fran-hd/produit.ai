// F3 · Liaisons — Graphe écosystème d'un produit
// Format: graphe radial centré sur un produit pivot, montrant ses liaisons
// par type (doublons, équivalents, variantes, substituts, cross-sell, pack).
// Permet de naviguer en cliquant sur un nœud (le pivot devient le nouveau centre).

function LinksF3() {
  const allClusters = window.LINK_CLUSTERS || [];
  const types = window.LINK_TYPES || {};

  // Build product index: map productId -> {product, clusters: [{cluster, role, otherProducts}]}
  const productIndex = React.useMemo(() => {
    const idx = {};
    for (const cl of allClusters) {
      cl.products.forEach((p, i) => {
        if (!idx[p.id]) idx[p.id] = { product: p, links: [] };
        const others = cl.products.filter(o => o.id !== p.id);
        idx[p.id].links.push({ cluster: cl, role: i === 0 ? "primary" : "member", others });
      });
    }
    return idx;
  }, []);

  // Default pivot: Nutella 750g (the most-connected product in our dataset)
  const allPivots = Object.values(productIndex);
  const defaultPivot = allPivots
    .sort((a, b) => b.links.length - a.links.length)[0]?.product;

  const [pivotId, setPivotId] = React.useState(defaultPivot?.id || allPivots[0]?.product.id);
  const [enabledTypes, setEnabledTypes] = React.useState(
    Object.fromEntries(Object.keys(types).map(k => [k, true]))
  );
  const [hoveredNode, setHoveredNode] = React.useState(null);

  const pivotEntry = productIndex[pivotId];

  // Group links by type
  const linksByType = React.useMemo(() => {
    if (!pivotEntry) return {};
    const groups = {};
    for (const link of pivotEntry.links) {
      const tCode = link.cluster.type;
      if (!enabledTypes[tCode]) continue;
      if (!groups[tCode]) groups[tCode] = [];
      // Each "other" becomes a node
      for (const other of link.others) {
        // Avoid duplicates (same product across clusters)
        if (groups[tCode].some(n => n.product.id === other.id)) continue;
        groups[tCode].push({
          product: other,
          cluster: link.cluster,
          confidence: link.cluster.confidence,
          status: link.cluster.status,
        });
      }
    }
    return groups;
  }, [pivotEntry, enabledTypes]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%",
      background: C_TOKENS.bg, fontFamily: C_TOKENS.font, color: C_TOKENS.text, fontSize: 12 }}>

      {/* Top bar */}
      <div style={{ height: 38, padding: "0 14px", background: C_TOKENS.headerBg,
        borderBottom: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: C_TOKENS.accent, color: "#fff",
            display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>P</div>
          <span style={{ fontWeight: 600 }}>Produit.ai</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 4px" }}>/</span>
          <span style={{ color: C_TOKENS.textMuted }}>Articles › Liaisons</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 2px" }}>›</span>
          <span style={{ fontWeight: 500 }}>Graphe écosystème</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>
          {pivotEntry?.links.length || 0} liaisons depuis ce produit
        </span>
        <div style={{ width: 1, height: 18, background: C_TOKENS.border }} />
        <button style={f3TabBtn}><I.download size={11} /> Exporter SVG</button>
        <button style={f3TabBtn}><I.plus size={11} /> Lier produit…</button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "grid",
        gridTemplateColumns: "240px minmax(0, 1fr) 320px", overflow: "hidden" }}>

        {/* LEFT — type legend & filters */}
        <aside style={{ background: "#fff", borderRight: `1px solid ${C_TOKENS.border}`,
          overflow: "auto", padding: "12px 0" }}>
          <div style={{ padding: "0 14px 8px", fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
            textTransform: "uppercase", letterSpacing: 0.5 }}>Types affichés</div>

          {Object.values(types).map(t => {
            const count = (linksByType[t.code] || []).length;
            const totalForType = pivotEntry?.links.filter(l => l.cluster.type === t.code).length || 0;
            const has = totalForType > 0;
            return (
              <button key={t.code} onClick={() => setEnabledTypes(s => ({ ...s, [t.code]: !s[t.code] }))}
                disabled={!has}
                style={{ width: "100%", padding: "7px 14px", display: "flex", alignItems: "center", gap: 9,
                  background: "transparent", border: "none", textAlign: "left",
                  cursor: has ? "pointer" : "default", fontFamily: "inherit",
                  opacity: has ? 1 : 0.4 }}>
                <input type="checkbox" checked={enabledTypes[t.code]} readOnly disabled={!has}
                  style={{ accentColor: t.color, width: 13, height: 13, flexShrink: 0 }} />
                <div style={{ width: 18, height: 18, borderRadius: 3, background: t.color, color: "#fff",
                  display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, lineHeight: 1, flexShrink: 0 }}>
                  {t.icon}
                </div>
                <span style={{ flex: 1, fontSize: 11.5,
                  fontWeight: enabledTypes[t.code] && has ? 600 : 500,
                  color: C_TOKENS.text,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.label}</span>
                <span style={{ fontSize: 10.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
                  fontVariantNumeric: "tabular-nums" }}>{totalForType}</span>
              </button>
            );
          })}

          <div style={{ padding: "12px 14px 6px", marginTop: 12,
            borderTop: `1px solid ${C_TOKENS.border}`,
            fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
            textTransform: "uppercase", letterSpacing: 0.5 }}>Légende liens</div>

          <div style={{ padding: "0 14px", display: "flex", flexDirection: "column", gap: 6,
            fontSize: 11, color: C_TOKENS.textMuted, lineHeight: 1.5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="40" height="6"><line x1="0" y1="3" x2="40" y2="3" stroke={C_TOKENS.text} strokeWidth="2" /></svg>
              <span>Lien validé</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="40" height="6"><line x1="0" y1="3" x2="40" y2="3" stroke={C_TOKENS.textMuted} strokeWidth="1.5" strokeDasharray="3 3" /></svg>
              <span>Proposition IA</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: window.confColor(0.95), border: "1px solid #fff" }} />
              <span>Confiance haute (≥90%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: window.confColor(0.80), border: "1px solid #fff" }} />
              <span>Confiance moyenne</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: window.confColor(0.60), border: "1px solid #fff" }} />
              <span>À vérifier (&lt;75%)</span>
            </div>
          </div>

          <div style={{ padding: "12px 14px 6px", marginTop: 12,
            borderTop: `1px solid ${C_TOKENS.border}`,
            fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
            textTransform: "uppercase", letterSpacing: 0.5 }}>Naviguer</div>
          <div style={{ padding: "0 14px 8px", fontSize: 11, color: C_TOKENS.textMuted, lineHeight: 1.5 }}>
            Cliquez sur un nœud pour le placer au centre du graphe.
          </div>

        </aside>

        {/* CENTER — graph */}
        <main style={{ position: "relative", overflow: "hidden",
          background: "radial-gradient(circle at center, #fff 0%, oklch(0.98 0.005 250) 100%)" }}>
          {pivotEntry ? (
            <RadialGraph
              pivot={pivotEntry.product}
              linksByType={linksByType}
              types={types}
              onPivot={setPivotId}
              onHover={setHoveredNode}
              hovered={hoveredNode} />
          ) : (
            <div style={{ padding: 60, textAlign: "center", color: C_TOKENS.textMuted }}>
              Aucun produit sélectionné.
            </div>
          )}
        </main>

        {/* RIGHT — pivot info & node detail */}
        <aside style={{ background: "#fff", borderLeft: `1px solid ${C_TOKENS.border}`,
          display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Pivot info */}
          {pivotEntry && (
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C_TOKENS.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
                textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                Produit pivot
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 56, height: 56, borderRadius: 8,
                  background: C_TOKENS.headerBg, border: `1px solid ${C_TOKENS.border}`,
                  display: "grid", placeItems: "center", fontSize: 32, lineHeight: 1, flexShrink: 0 }}>
                  {pivotEntry.product.glyph}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C_TOKENS.text }}>
                    {pivotEntry.product.brand}
                  </div>
                  <div style={{ fontSize: 11.5, color: C_TOKENS.text, marginBottom: 3,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {pivotEntry.product.name}
                  </div>
                  <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
                    fontVariantNumeric: "tabular-nums" }}>
                    {pivotEntry.product.fmt} · {pivotEntry.product.ean}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hovered node detail */}
          <div style={{ flex: 1, overflow: "auto" }}>
            {hoveredNode ? (
              <NodeDetail node={hoveredNode} types={types} onPivot={(id) => { setPivotId(id); setHoveredNode(null); }} />
            ) : (
              <div style={{ padding: "12px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
                  textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                  Liaisons par type
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {Object.values(types).map(t => {
                    const count = pivotEntry?.links.filter(l => l.cluster.type === t.code).length || 0;
                    if (!count) return null;
                    return (
                      <div key={t.code} style={{ display: "grid",
                        gridTemplateColumns: "auto 1fr auto", gap: 9, alignItems: "center",
                        padding: "6px 8px", background: t.soft, borderRadius: 4 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 4, background: t.color, color: "#fff",
                          display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 }}>
                          {t.icon}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: C_TOKENS.text }}>{t.label}</div>
                          <div style={{ fontSize: 10, color: C_TOKENS.textMuted, lineHeight: 1.3 }}>{t.desc}</div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: t.color,
                          fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 14, padding: 9, background: C_TOKENS.headerBg,
                  borderRadius: 4, fontSize: 11, color: C_TOKENS.textMuted, lineHeight: 1.5 }}>
                  💡 Survolez un nœud pour voir le détail de la liaison, cliquez pour le placer au centre.
                </div>
              </div>
            )}
          </div>

        </aside>
      </div>

      {/* Status */}
      <div style={{ height: 24, padding: "0 14px", background: C_TOKENS.headerBg,
        borderTop: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 16, fontSize: 11,
        color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, flexShrink: 0 }}>
        <span>Graphe écosystème <strong style={{ color: C_TOKENS.text }}>v0.9</strong></span>
        <span>{Object.values(linksByType).reduce((s, a) => s + a.length, 0)} nœuds affichés</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: C_TOKENS.green, fontWeight: 600 }}>● Index liens à jour</span>
        <span>M. Lefèvre</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// RadialGraph — pivot at center, types on rings around it
// ─────────────────────────────────────────────────────────────────────────

function RadialGraph({ pivot, linksByType, types, onPivot, onHover, hovered }) {
  const W = 880, H = 720;
  const cx = W / 2, cy = H / 2;
  const [addOpen, setAddOpen] = React.useState(null); // {dir, x, y} | null
  const [addedSlots, setAddedSlots] = React.useState({}); // dir -> {brand, name, fmt, glyph, type}

  // Distribute types around the pivot. Each type gets a slice/sector.
  const visibleTypes = Object.values(types).filter(t => (linksByType[t.code] || []).length > 0);
  const N_T = visibleTypes.length;

  // Compute layout: each type gets a sector. Each node within a type
  // gets a position on a ring at radius determined by its order.
  // Use 2 rings to handle dense clusters.
  const nodes = [];
  visibleTypes.forEach((t, ti) => {
    const items = linksByType[t.code] || [];
    const sectorStart = (ti / N_T) * Math.PI * 2 - Math.PI / 2; // start at top
    const sectorEnd = ((ti + 1) / N_T) * Math.PI * 2 - Math.PI / 2;
    const sectorMid = (sectorStart + sectorEnd) / 2;
    const sectorWidth = sectorEnd - sectorStart;

    items.forEach((it, idx) => {
      const ring = idx >= 4 ? 1 : 0; // overflow to outer ring
      const inRing = items.length > 4 ? Math.min(items.length - (ring * 4), 4) : items.length;
      const ringIdx = idx % (Math.max(inRing, 1));
      const r = ring === 0 ? 200 : 295;

      let angle;
      if (inRing === 1) angle = sectorMid;
      else {
        const margin = sectorWidth * 0.15;
        const start = sectorStart + margin;
        const end = sectorEnd - margin;
        angle = start + (ringIdx / Math.max(inRing - 1, 1)) * (end - start);
      }

      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      nodes.push({ ...it, x, y, type: t, angle, ring, sectorMid });
    });
  });

  // Sector backgrounds (very subtle wedge per type)
  const sectorPaths = visibleTypes.map((t, ti) => {
    const sectorStart = (ti / N_T) * Math.PI * 2 - Math.PI / 2;
    const sectorEnd = ((ti + 1) / N_T) * Math.PI * 2 - Math.PI / 2;
    const r = 350;
    const x1 = cx + Math.cos(sectorStart) * r;
    const y1 = cy + Math.sin(sectorStart) * r;
    const x2 = cx + Math.cos(sectorEnd) * r;
    const y2 = cy + Math.sin(sectorEnd) * r;
    return { type: t, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`,
      labelAngle: (sectorStart + sectorEnd) / 2 };
  });

  // Build a flat searchable product list (excluding the pivot and already-added slots)
  const allProducts = React.useMemo(() => {
    const seen = new Set([pivot.id, ...Object.values(addedSlots).map(p => p.id)]);
    const out = [];
    for (const cl of (window.LINK_CLUSTERS || [])) {
      for (const p of cl.products) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        out.push(p);
      }
    }
    return out;
  }, [pivot.id, addedSlots]);

  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%", maxWidth: W, maxHeight: H }}>
        <defs>
          <radialGradient id="pivotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C_TOKENS.accent} stopOpacity="0.15" />
            <stop offset="100%" stopColor={C_TOKENS.accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sector backgrounds */}
        {sectorPaths.map(({ type: t, d }, i) => (
          <path key={i} d={d} fill={t.soft} opacity="0.4" />
        ))}

        {/* Sector labels */}
        {sectorPaths.map(({ type: t, labelAngle }, i) => {
          const r = 340;
          const x = cx + Math.cos(labelAngle) * r;
          const y = cy + Math.sin(labelAngle) * r;
          return (
            <g key={i}>
              <rect x={x - 60} y={y - 11} width="120" height="22" rx="11"
                fill="#fff" stroke={t.color} strokeWidth="1.5" />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={t.color}>
                {t.icon}  {t.label}
              </text>
            </g>
          );
        })}

        {/* Rings (subtle guides) */}
        <circle cx={cx} cy={cy} r="200" fill="none" stroke={C_TOKENS.border} strokeWidth="1" strokeDasharray="2 4" />
        <circle cx={cx} cy={cy} r="295" fill="none" stroke={C_TOKENS.border} strokeWidth="1" strokeDasharray="2 4" />

        {/* Pivot glow */}
        <circle cx={cx} cy={cy} r="120" fill="url(#pivotGlow)" />

        {/* Edges */}
        {nodes.map((n, i) => {
          const isHovered = hovered?.product.id === n.product.id;
          return (
            <line key={`e-${i}`}
              x1={cx} y1={cy} x2={n.x} y2={n.y}
              stroke={isHovered ? n.type.color : n.type.color}
              strokeOpacity={isHovered ? 1 : 0.55}
              strokeWidth={isHovered ? 2.5 : 1.5}
              strokeDasharray={n.status === "pending" ? "4 3" : "0"}
            />
          );
        })}

        {/* Pivot node */}
        <g style={{ cursor: "default" }}>
          <circle cx={cx} cy={cy} r="48" fill="#fff" stroke={C_TOKENS.accent} strokeWidth="3" />
          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="34">{pivot.glyph}</text>
        </g>
        <g>
          <rect x={cx - 80} y={cy + 56} width="160" height="42" rx="6"
            fill="#fff" stroke={C_TOKENS.border} strokeWidth="1" />
          <text x={cx} y={cy + 73} textAnchor="middle" fontSize="11" fontWeight="700" fill={C_TOKENS.text}>
            {truncate(pivot.brand, 22)}
          </text>
          <text x={cx} y={cy + 89} textAnchor="middle" fontSize="9.5" fill={C_TOKENS.textMuted}
            fontFamily={C_TOKENS.mono}>
            {pivot.fmt}
          </text>
        </g>

        {/* Add-slots: 4 cardinal placeholders around the pivot.
            User can click to attach a product above / right / below / left of the pivot. */}
        {(() => {
          const slotR = 130; // close to pivot, inside the inner ring
          const slots = [
            { dir: "N",  x: cx,            y: cy - slotR, label: "Ajouter au-dessus" },
            { dir: "E",  x: cx + slotR,    y: cy,          label: "Ajouter à droite" },
            { dir: "S",  x: cx,            y: cy + slotR,  label: "Ajouter en dessous" },
            { dir: "W",  x: cx - slotR,    y: cy,          label: "Ajouter à gauche" },
          ];
          return slots.map(s => {
            const filled = addedSlots[s.dir];
            const isOpen = addOpen?.dir === s.dir;
            if (filled) {
              return (
                <g key={`slot-${s.dir}`}>
                  <line x1={cx} y1={cy} x2={s.x} y2={s.y}
                    stroke={filled.type.color} strokeWidth="1.5"
                    strokeDasharray="4 3" opacity="0.7" />
                  <circle cx={s.x} cy={s.y} r="26" fill="#fff"
                    stroke={filled.type.color} strokeWidth="2" />
                  <text x={s.x} y={s.y + 6} textAnchor="middle" fontSize="20">{filled.glyph}</text>
                  <rect x={s.x - 50} y={s.y + 30} width="100" height="28" rx="4"
                    fill="#fff" stroke={filled.type.color} strokeWidth="1" />
                  <text x={s.x} y={s.y + 43} textAnchor="middle" fontSize="10" fontWeight="700"
                    fill={C_TOKENS.text}>{truncate(filled.brand, 14)}</text>
                  <text x={s.x} y={s.y + 54} textAnchor="middle" fontSize="9" fill={C_TOKENS.textMuted}
                    fontFamily={C_TOKENS.mono}>{filled.fmt}</text>
                </g>
              );
            }
            return (
              <g key={`slot-${s.dir}`} style={{ cursor: "pointer" }}
                onClick={() => setAddOpen(isOpen ? null : { dir: s.dir, x: s.x, y: s.y })}>
                <title>{s.label}</title>
                <line x1={cx} y1={cy} x2={s.x} y2={s.y}
                  stroke={C_TOKENS.textSubtle} strokeWidth="1"
                  strokeDasharray="2 4" opacity="0.5" />
                <rect x={s.x - 22} y={s.y - 22} width="44" height="44" rx="6"
                  fill="#fff"
                  stroke={isOpen ? C_TOKENS.accent : C_TOKENS.textSubtle}
                  strokeWidth={isOpen ? 2 : 1.5}
                  strokeDasharray={isOpen ? "0" : "3 3"} />
                <line x1={s.x - 8} y1={s.y} x2={s.x + 8} y2={s.y}
                  stroke={isOpen ? C_TOKENS.accent : C_TOKENS.textMuted} strokeWidth="2" strokeLinecap="round" />
                <line x1={s.x} y1={s.y - 8} x2={s.x} y2={s.y + 8}
                  stroke={isOpen ? C_TOKENS.accent : C_TOKENS.textMuted} strokeWidth="2" strokeLinecap="round" />
              </g>
            );
          });
        })()}

        {/* Other nodes */}
        {nodes.map((n, i) => {
          const isHovered = hovered?.product.id === n.product.id;
          const confC = window.confColor(n.confidence);
          return (
            <g key={`n-${i}`}
              onMouseEnter={() => onHover(n)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onPivot(n.product.id)}
              style={{ cursor: "pointer" }}>
              <circle cx={n.x} cy={n.y} r={isHovered ? 32 : 28}
                fill="#fff"
                stroke={isHovered ? n.type.color : C_TOKENS.border}
                strokeWidth={isHovered ? 3 : 1.5} />
              <text x={n.x} y={n.y + 7} textAnchor="middle" fontSize="22">{n.product.glyph}</text>
              {/* confidence dot */}
              <circle cx={n.x + 20} cy={n.y - 18} r="5" fill={confC} stroke="#fff" strokeWidth="1.5" />
              {/* label */}
              <g>
                <rect
                  x={n.x - 56} y={n.y + 32} width="112" height="32" rx="4"
                  fill="#fff" stroke={isHovered ? n.type.color : C_TOKENS.border}
                  strokeWidth={isHovered ? 1.5 : 1}
                  opacity={isHovered ? 1 : 0.95} />
                <text x={n.x} y={n.y + 46} textAnchor="middle" fontSize="10" fontWeight="700" fill={C_TOKENS.text}>
                  {truncate(n.product.brand, 16)}
                </text>
                <text x={n.x} y={n.y + 58} textAnchor="middle" fontSize="9" fill={C_TOKENS.textMuted}
                  fontFamily={C_TOKENS.mono}>
                  {n.product.fmt}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* HTML overlay picker — positioned over the slot when opened */}
      {addOpen && (
        <AddProductPicker
          dir={addOpen.dir}
          products={allProducts}
          types={types}
          onClose={() => setAddOpen(null)}
          onPick={(product, typeCode) => {
            setAddedSlots(s => ({
              ...s,
              [addOpen.dir]: { ...product, type: types[typeCode] || Object.values(types)[0] },
            }));
            setAddOpen(null);
          }}
        />
      )}
    </div>
  );
}

function AddProductPicker({ dir, products, types, onClose, onPick }) {
  const [q, setQ] = React.useState("");
  const [typeCode, setTypeCode] = React.useState(Object.keys(types)[0]);
  const inputRef = React.useRef(null);

  React.useEffect(() => { inputRef.current?.focus(); }, []);
  React.useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = q.trim()
    ? products.filter(p => {
        const s = (p.brand + " " + p.name + " " + p.fmt + " " + p.ean).toLowerCase();
        return s.includes(q.toLowerCase());
      }).slice(0, 8)
    : products.slice(0, 8);

  // Position the popover next to the slot direction
  const positions = {
    N: { top: "8%",    left: "50%", transform: "translateX(-50%)" },
    E: { top: "50%",   right: "6%", transform: "translateY(-50%)" },
    S: { bottom: "8%", left: "50%", transform: "translateX(-50%)" },
    W: { top: "50%",   left: "6%",  transform: "translateY(-50%)" },
  };
  const dirLabel = { N: "au-dessus", E: "à droite", S: "en dessous", W: "à gauche" }[dir];

  return (
    <>
      <div onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "transparent", zIndex: 5 }} />
      <div style={{
        position: "absolute", ...positions[dir], zIndex: 10,
        width: 320, background: "#fff",
        border: `1px solid ${C_TOKENS.border}`, borderRadius: 6,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
        padding: 10, fontFamily: C_TOKENS.font, fontSize: 12, color: C_TOKENS.text,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <I.plus size={12} />
          <span style={{ fontWeight: 700, fontSize: 11.5 }}>Ajouter un produit {dirLabel}</span>
          <div style={{ flex: 1 }} />
          <button onClick={onClose}
            style={{ width: 22, height: 22, border: "none", background: "transparent",
              color: C_TOKENS.textMuted, cursor: "pointer", fontSize: 14, lineHeight: 1,
              borderRadius: 3 }}>×</button>
        </div>

        {/* Type selector */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
          {Object.values(types).map(t => (
            <button key={t.code} onClick={() => setTypeCode(t.code)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "3px 7px", fontSize: 10.5, fontWeight: 600,
                background: typeCode === t.code ? t.color : "#fff",
                color: typeCode === t.code ? "#fff" : t.color,
                border: `1px solid ${t.color}`, borderRadius: 11,
                cursor: "pointer", fontFamily: "inherit" }}>
              <span style={{ fontSize: 10 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
          placeholder="Rechercher par marque, nom, EAN…"
          style={{
            width: "100%", padding: "6px 9px", fontSize: 11.5,
            border: `1px solid ${C_TOKENS.border}`, borderRadius: 3,
            fontFamily: "inherit", color: C_TOKENS.text,
            outline: "none", boxSizing: "border-box", marginBottom: 6,
          }} />

        {/* Results */}
        <div style={{ maxHeight: 220, overflow: "auto",
          border: `1px solid ${C_TOKENS.border}`, borderRadius: 3 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "14px 10px", fontSize: 11, color: C_TOKENS.textMuted,
              textAlign: "center" }}>Aucun produit.</div>
          ) : filtered.map(p => (
            <button key={p.id} onClick={() => onPick(p, typeCode)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 8,
                padding: "6px 8px", background: "transparent", border: "none",
                borderBottom: `1px solid ${C_TOKENS.border}`,
                textAlign: "left", cursor: "pointer", fontFamily: "inherit",
              }}
              onMouseEnter={e => e.currentTarget.style.background = C_TOKENS.headerBg}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{p.glyph}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C_TOKENS.text,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.brand} <span style={{ fontWeight: 400, color: C_TOKENS.textMuted }}>· {p.name}</span>
                </div>
                <div style={{ fontSize: 10, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.fmt} · {p.ean}
                </div>
              </div>
              <span style={{ fontSize: 10, color: C_TOKENS.accent, fontWeight: 600,
                flexShrink: 0 }}>+ Lier</span>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6,
          fontSize: 10, color: C_TOKENS.textMuted }}>
          <span>↵ pour valider · esc pour fermer</span>
          <div style={{ flex: 1 }} />
          <button style={{
            padding: "4px 8px", fontSize: 10.5, background: "#fff",
            border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, cursor: "pointer",
            fontFamily: "inherit", color: C_TOKENS.text,
          }}>+ Nouveau produit…</button>
        </div>
      </div>
    </>
  );
}

function truncate(s, n) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function NodeDetail({ node: n, types, onPivot }) {
  const t = n.type;
  const main = n.cluster.products[0];
  const confC = window.confColor(n.confidence);

  return (
    <div style={{ padding: "12px 16px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
        textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
        Détail du nœud
      </div>

      {/* Type pill */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
        padding: "3px 9px", background: t.soft, borderRadius: 11, marginBottom: 10 }}>
        <div style={{ width: 16, height: 16, borderRadius: 3, background: t.color, color: "#fff",
          display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700 }}>
          {t.icon}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: t.color }}>{t.label}</span>
      </div>

      {/* Product card */}
      <div style={{ border: `1px solid ${C_TOKENS.border}`, borderRadius: 5,
        padding: 10, marginBottom: 10, background: C_TOKENS.headerBg }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <div style={{ width: 42, height: 42, borderRadius: 4,
            background: "#fff", border: `1px solid ${C_TOKENS.border}`,
            display: "grid", placeItems: "center", fontSize: 24, lineHeight: 1, flexShrink: 0 }}>
            {n.product.glyph}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: C_TOKENS.text }}>{n.product.brand}</div>
            <div style={{ fontSize: 11, color: C_TOKENS.text, marginBottom: 2,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.product.name}</div>
            <div style={{ fontSize: 10, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
              fontVariantNumeric: "tabular-nums" }}>
              {n.product.fmt} · {n.product.ean}
            </div>
          </div>
        </div>
      </div>

      {/* Confidence */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
          textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Confiance</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: confC,
            fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>
            {window.fmtConfidence(n.confidence)}
          </span>
          <div style={{ flex: 1, height: 4, background: C_TOKENS.border, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${n.confidence * 100}%`, height: "100%", background: confC }} />
          </div>
          {n.status === "pending" ? (
            <span style={{ fontSize: 10, padding: "2px 6px",
              background: C_TOKENS.amberSoft, color: C_TOKENS.amber, borderRadius: 2,
              fontWeight: 600, whiteSpace: "nowrap" }}>● À valider</span>
          ) : (
            <span style={{ fontSize: 10, padding: "2px 6px",
              background: C_TOKENS.greenSoft, color: C_TOKENS.green, borderRadius: 2,
              fontWeight: 600, whiteSpace: "nowrap" }}>✓ Validé</span>
          )}
        </div>
      </div>

      {/* Cluster context */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
          textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Cluster</div>
        <div style={{ fontSize: 11.5, color: C_TOKENS.text, lineHeight: 1.4 }}>
          {n.cluster.title}
        </div>
        <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted, marginTop: 2,
          fontFamily: C_TOKENS.mono }}>
          {n.cluster.products.length} produits · {n.cluster.detectedAt}
        </div>
      </div>

      {/* Price delta if applicable */}
      {n.product.price != null && main.price != null && n.product.id !== main.id && (
        <div style={{ marginBottom: 10, padding: 8, background: C_TOKENS.headerBg,
          borderRadius: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
            textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>Prix</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: C_TOKENS.mono,
            fontVariantNumeric: "tabular-nums", fontSize: 11.5 }}>
            <span style={{ color: C_TOKENS.text, fontWeight: 600 }}>
              {n.product.price.toFixed(2).replace(".", ",")} €
            </span>
            {n.product.pricePerKg && main.pricePerKg && (
              <PriceDeltaF3 a={main.pricePerKg} b={n.product.pricePerKg} />
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <button onClick={() => onPivot(n.product.id)}
          style={{ padding: "7px 10px", background: C_TOKENS.accent, color: "#fff",
            border: "none", borderRadius: 3, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
          ⊕ Centrer sur ce produit
        </button>
        <button style={{ padding: "7px 10px", background: "#fff", color: C_TOKENS.text,
          border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, fontSize: 11.5,
          cursor: "pointer", fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
          <I.chevronRight size={11} /> Ouvrir la fiche
        </button>
        {n.status === "pending" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
            <button style={{ padding: "6px 10px", background: "oklch(0.50 0.14 145)", color: "#fff",
              border: "none", borderRadius: 3, fontSize: 11, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit" }}>
              ✓ Valider
            </button>
            <button style={{ padding: "6px 10px", background: "#fff", color: "oklch(0.45 0.18 25)",
              border: `1px solid oklch(0.85 0.06 25)`, borderRadius: 3, fontSize: 11,
              cursor: "pointer", fontFamily: "inherit" }}>
              ✗ Rejeter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PriceDeltaF3({ a, b }) {
  const d = ((b - a) / a) * 100;
  if (Math.abs(d) < 0.5) return null;
  const up = d > 0;
  return (
    <span style={{
      color: up ? C_TOKENS.red : C_TOKENS.green,
      fontWeight: 700, fontSize: 10,
      padding: "1px 5px", borderRadius: 2,
      background: up ? C_TOKENS.redSoft : C_TOKENS.greenSoft,
    }} title={`${up ? "+" : ""}${d.toFixed(1)}% vs pivot`}>
      {up ? "▲" : "▼"} {Math.abs(d).toFixed(0)}% vs pivot
    </span>
  );
}

const f3TabBtn = { display: "inline-flex", alignItems: "center", gap: 5,
  padding: "4px 10px", height: 26, fontSize: 11.5, fontFamily: "inherit",
  background: "#fff", color: C_TOKENS.text, border: `1px solid ${C_TOKENS.border}`,
  borderRadius: 3, cursor: "pointer" };

window.LinksF3 = LinksF3;
