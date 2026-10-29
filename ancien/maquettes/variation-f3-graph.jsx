// F3 · Liaisons — Matrice gamme × alternatives
// Format: grille 3×3 centrée sur un produit pivot (MDD).
//   Ligne du haut    = Marque Nationale (concurrents)
//   Ligne du milieu  = MDD (équivalents autres enseignes ; le pivot occupe le centre)
//   Ligne du bas     = Premier Prix (alternatives bas de gamme)
// Chaque cellule vide est un slot "+" qui ouvre un picker pour lier un produit.

const F3_TIERS = [
  { code: "MN",   label: "Marque Nationale", short: "MN",
    desc: "Concurrents directs marques nationales — benchmark prix & positionnement.",
    color: "oklch(0.50 0.16 250)", soft: "oklch(0.97 0.04 250)" },
  { code: "MDD",  label: "MDD", short: "MDD",
    desc: "Marques distributeurs équivalentes — autres enseignes.",
    color: "oklch(0.50 0.14 145)", soft: "oklch(0.97 0.04 145)" },
  { code: "PP",   label: "Premier Prix", short: "PP",
    desc: "Alternatives premier prix / hard discount.",
    color: "oklch(0.55 0.13 60)",  soft: "oklch(0.97 0.04 60)" },
];

// Heuristic: classify a product into MN / MDD / PP based on brand & enseigne.
const MDD_BRANDS = new Set([
  "Carrefour", "Carrefour Bio", "U", "U Bio", "Système U", "Casino", "Casino Bio",
  "Monoprix", "Monoprix Bio", "Auchan", "Marque Repère", "Repère",
]);
const PP_BRANDS = new Set([
  "Marque Repère", "Eco+", "Pouce", "Top Budget", "Carrefour Essentiel", "U Essentiel",
  "Belle France", "Première Moisson", "Eridanous",
]);

function classifyTier(p) {
  if (p.tier) return p.tier;
  if (PP_BRANDS.has(p.brand)) return "PP";
  if (p.enseigne || MDD_BRANDS.has(p.brand)) return "MDD";
  return "MN";
}

// ─────────────────────────────────────────────────────────────────────────

function LinksF3() {
  const allClusters = window.LINK_CLUSTERS || [];
  const types = window.LINK_TYPES || {};

  // Index products and pre-classify each one with a tier
  const productIndex = React.useMemo(() => {
    const idx = {};
    for (const cl of allClusters) {
      cl.products.forEach((p, i) => {
        const tier = classifyTier(p);
        if (!idx[p.id]) idx[p.id] = { product: { ...p, tier }, links: [] };
        const others = cl.products.filter(o => o.id !== p.id)
          .map(o => ({ ...o, tier: classifyTier(o) }));
        idx[p.id].links.push({ cluster: cl, role: i === 0 ? "primary" : "member", others });
      });
    }
    return idx;
  }, []);

  const allEntries = Object.values(productIndex);

  // Default pivot: a MDD product with the most links (Carrefour Bio in the dataset)
  const defaultPivot =
    allEntries.filter(e => e.product.tier === "MDD")
      .sort((a, b) => b.links.length - a.links.length)[0]?.product
    || allEntries.sort((a, b) => b.links.length - a.links.length)[0]?.product;

  const [pivotId, setPivotId] = React.useState(defaultPivot?.id);
  // matrix[tier][col] = product | null
  const [matrix, setMatrix] = React.useState(() => buildInitialMatrix(defaultPivot, productIndex));
  const [pickerOpen, setPickerOpen] = React.useState(null); // {tier, col} | null

  // When pivot changes, rebuild the matrix
  React.useEffect(() => {
    if (!pivotId) return;
    const entry = productIndex[pivotId];
    if (!entry) return;
    setMatrix(buildInitialMatrix(entry.product, productIndex));
  }, [pivotId]);

  const pivotEntry = productIndex[pivotId];
  if (!pivotEntry) {
    return <div style={{ padding: 60, color: C_TOKENS.textMuted }}>Aucun produit pivot.</div>;
  }

  // Set of products already placed in the matrix (to exclude from picker)
  const usedIds = new Set();
  matrix.forEach(row => row.forEach(c => c && usedIds.add(c.id)));

  // All candidate products from clusters (anything that's a known product)
  const allProducts = allEntries
    .map(e => e.product)
    .filter(p => p.id !== pivotId);

  function addToTier(tierIdx, product) {
    setMatrix(m => {
      const next = m.map(r => r.slice());
      next[tierIdx] = [...next[tierIdx], { ...product, tier: F3_TIERS[tierIdx].code }];
      return next;
    });
    setPickerOpen(null);
  }
  function removeFromTier(tierIdx, productId) {
    if (productId === pivotId) return; // can't remove the pivot
    setMatrix(m => {
      const next = m.map(r => r.slice());
      next[tierIdx] = next[tierIdx].filter(p => p && p.id !== productId);
      return next;
    });
  }

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
          <span style={{ fontWeight: 500 }}>Matrice gamme</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>
          {usedIds.size - 1} alternatives liées
        </span>
        <div style={{ width: 1, height: 18, background: C_TOKENS.border }} />
        <button style={f3TabBtn}><I.download size={11} /> Exporter</button>
        <button style={f3TabBtn}><I.search size={11} /> Changer pivot…</button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 380px", overflow: "hidden" }}>

        {/* CENTER — matrix */}
        <main style={{ position: "relative", overflow: "auto",
          background: "oklch(0.985 0.005 250)", padding: "32px 40px" }}>

          <MatrixGrid
            tiers={F3_TIERS}
            matrix={matrix}
            pivot={pivotEntry.product}
            pivotId={pivotId}
            pivotEntry={pivotEntry}
            onSlotClick={(tier) => setPickerOpen({ tier })}
            onPivot={setPivotId}
            onRemove={removeFromTier}
            pickerOpen={pickerOpen}
          />

          {/* Picker as overlay */}
          {pickerOpen && (
            <TierPicker
              tier={F3_TIERS[pickerOpen.tier]}
              products={allProducts.filter(p => !usedIds.has(p.id))}
              targetTier={F3_TIERS[pickerOpen.tier].code}
              onClose={() => setPickerOpen(null)}
              onPick={(product) => addToTier(pickerOpen.tier, product)}
            />
          )}
        </main>

        {/* RIGHT — info panel */}
        <aside style={{ background: "#fff", borderLeft: `1px solid ${C_TOKENS.border}`,
          display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Pivot info */}
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
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                  <TierBadge tier={pivotEntry.product.tier} />
                </div>
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

          {/* Comparison summary */}
          <div style={{ flex: 1, overflow: "auto", padding: "12px 16px" }}>

            {/* AI suggestions */}
            <SuggestionsBlock
              pivot={pivotEntry.product}
              candidates={allProducts.filter(p => !usedIds.has(p.id))}
              onAdd={(product) => {
                const tierIdx = F3_TIERS.findIndex(t => t.code === classifyTier(product));
                const ti = tierIdx === -1 ? 0 : tierIdx;
                addToTier(ti, product);
              }}
            />

            <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
              textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8,
              marginTop: 16 }}>
              Comparatif par gamme
            </div>
            {F3_TIERS.map((t, ti) => {
              const cells = (matrix[ti] || []).filter(p => p && p.id !== pivotId);
              if (cells.length === 0) return null;
              return (
                <div key={t.code} style={{ marginBottom: 12,
                  border: `1px solid ${C_TOKENS.border}`, borderRadius: 5,
                  background: "#fff" }}>
                  <div style={{ padding: "7px 10px", background: t.soft,
                    borderBottom: `1px solid ${C_TOKENS.border}`,
                    display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 3, background: t.color,
                      color: "#fff", display: "grid", placeItems: "center",
                      fontSize: 9, fontWeight: 700 }}>{t.short}</div>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: C_TOKENS.text }}>{t.label}</span>
                    <div style={{ flex: 1 }} />
                    <span style={{ fontSize: 10.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
                      fontVariantNumeric: "tabular-nums" }}>{cells.length}</span>
                  </div>
                  <div>
                    {cells.map(p => (
                      <div key={p.id} style={{ padding: "7px 10px",
                        borderTop: `1px solid ${C_TOKENS.border}`,
                        display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16, lineHeight: 1 }}>{p.glyph}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C_TOKENS.text,
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {p.brand}
                          </div>
                          <div style={{ fontSize: 10, color: C_TOKENS.textMuted,
                            fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {p.fmt}{p.price != null ? ` · ${p.price.toFixed(2).replace(".", ",")} €` : ""}
                          </div>
                        </div>
                        {p.pricePerKg && pivotEntry.product.pricePerKg && (
                          <PriceDeltaF3 a={pivotEntry.product.pricePerKg} b={p.pricePerKg} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div style={{ padding: 9, background: C_TOKENS.headerBg,
              borderRadius: 4, fontSize: 11, color: C_TOKENS.textMuted, lineHeight: 1.5 }}>
              💡 La matrice positionne chaque alternative selon son niveau de gamme.
              Cliquez sur une cellule vide pour lier un produit.
            </div>
          </div>
        </aside>
      </div>

      {/* Status */}
      <div style={{ height: 24, padding: "0 14px", background: C_TOKENS.headerBg,
        borderTop: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 16, fontSize: 11,
        color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, flexShrink: 0 }}>
        <span>Matrice gamme <strong style={{ color: C_TOKENS.text }}>v0.9</strong></span>
        <span>{usedIds.size - 1} alternatives · {pivotEntry.links.length} liaisons IA détectées</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: C_TOKENS.green, fontWeight: 600 }}>● Index liens à jour</span>
        <span>M. Lefèvre</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Build initial matrix: place pivot at center; auto-fill from cluster data
// ─────────────────────────────────────────────────────────────────────────

function buildInitialMatrix(pivot, productIndex) {
  // matrix[ti] = array of products (variable length).
  // For the pivot's tier, the pivot is included; its position is preserved
  // by being placed at index 1 if there's >=1 same-tier sibling, else 0.
  const matrix = [[], [], []];
  if (!pivot) return matrix;

  const pivotTierIdx = F3_TIERS.findIndex(t => t.code === pivot.tier);
  const pTier = pivotTierIdx === -1 ? 1 : pivotTierIdx;

  // Auto-fill: walk pivot's links and place "others" by their tier
  const entry = productIndex[pivot.id];
  const candidatesByTier = { MN: [], MDD: [], PP: [] };
  if (entry) {
    const placed = new Set([pivot.id]);
    for (const link of entry.links) {
      for (const o of link.others) {
        if (placed.has(o.id)) continue;
        placed.add(o.id);
        const tier = classifyTier(o);
        if (candidatesByTier[tier]) {
          candidatesByTier[tier].push({ ...o, tier });
        }
      }
    }
  }

  F3_TIERS.forEach((t, ti) => {
    const list = candidatesByTier[t.code] || [];
    if (ti === pTier) {
      // Insert pivot in second position if siblings exist, else first
      if (list.length >= 1) {
        matrix[ti] = [list[0], pivot, ...list.slice(1)];
      } else {
        matrix[ti] = [pivot];
      }
    } else {
      matrix[ti] = list.slice(0, 6); // cap initial auto-fill
    }
  });

  return matrix;
}

// ─────────────────────────────────────────────────────────────────────────
// MatrixGrid
// ─────────────────────────────────────────────────────────────────────────

function MatrixGrid({ tiers, matrix, pivot, pivotId, pivotEntry, onSlotClick, onPivot, onRemove, pickerOpen }) {
  const CELL_W = 200; // fixed cell width so rows scroll uniformly

  // Max length of any row (to pad shorter rows visually)
  const maxLen = Math.max(...matrix.map(r => r.length), 3);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Header strip */}
      <div style={{ marginBottom: 18, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: C_TOKENS.textMuted, marginBottom: 3 }}>
          Matrice positionnement par gamme
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C_TOKENS.text, marginBottom: 4 }}>
          Écosystème de <span style={{ color: C_TOKENS.accent }}>{pivot.brand} {pivot.name}</span>
        </div>
        <div style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>
          {pivot.fmt} · EAN {pivot.ean}
        </div>
      </div>

      {/* The 3 rows. Each row has a sticky label + a horizontally scrollable strip. */}
      {tiers.map((t, ti) => {
        const cells = matrix[ti] || [];
        return (
          <div key={t.code} style={{ display: "grid",
            gridTemplateColumns: "168px minmax(0, 1fr)",
            gap: 10, marginBottom: 10 }}>

            {/* Sticky row label */}
            <div style={{
              display: "flex", flexDirection: "column", justifyContent: "center",
              padding: "12px 12px",
              background: t.soft, border: `1px solid ${t.color}`, borderRadius: 6,
              borderLeftWidth: 4, minWidth: 0, overflow: "hidden",
              position: "sticky", left: 0,
              height: 181,
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                alignSelf: "flex-start",
                height: 20, padding: "0 8px",
                background: t.color, color: "#fff",
                fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                borderRadius: 3, marginBottom: 7,
              }}>{t.short}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C_TOKENS.text,
                lineHeight: 1.25, marginBottom: 4 }}>{t.label}</div>
              <div style={{ fontSize: 10, color: C_TOKENS.textMuted, lineHeight: 1.4 }}>
                {t.desc}
              </div>
              <div style={{ marginTop: 6, fontSize: 9.5, color: t.color, fontWeight: 700,
                fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>
                {cells.length} alternative{cells.length > 1 ? "s" : ""}
              </div>
            </div>

            {/* Horizontally scrollable strip */}
            <div style={{ overflowX: "auto", overflowY: "hidden", minWidth: 0,
              paddingBottom: 4 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "stretch",
                paddingRight: 4, minWidth: "min-content" }}>

                {cells.map((cell, idx) => {
                  if (cell.id === pivotId) {
                    return (
                      <div key={cell.id} style={{ width: CELL_W, flexShrink: 0 }}>
                        <PivotCell pivot={pivot} pivotEntry={pivotEntry} tier={t} />
                      </div>
                    );
                  }
                  return (
                    <div key={cell.id} style={{ width: CELL_W, flexShrink: 0 }}>
                      <FilledCell product={cell} tier={t} pivot={pivot}
                        onPivot={() => onPivot(cell.id)}
                        onClear={() => onRemove(ti, cell.id)} />
                    </div>
                  );
                })}

                {/* Empty + slot at end */}
                <div style={{ width: CELL_W, flexShrink: 0 }}>
                  <EmptySlot tier={t}
                    isOpen={pickerOpen?.tier === ti}
                    onClick={() => onSlotClick(ti)} />
                </div>

              </div>
            </div>
          </div>
        );
      })}

      {/* Hint */}
      <div style={{ marginTop: 14, padding: "8px 12px",
        background: "transparent", color: C_TOKENS.textMuted,
        fontSize: 10.5, textAlign: "center" }}>
        ← Faites défiler horizontalement pour voir toutes les alternatives →
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Cells
// ─────────────────────────────────────────────────────────────────────────

function PivotCell({ pivot, pivotEntry, tier }) {
  return (
    <div style={{
      position: "relative",
      border: `2px solid ${C_TOKENS.accent}`,
      background: "oklch(0.99 0.012 80)",
      borderRadius: 6, padding: 11, height: 181,
      boxShadow: `0 0 0 3px ${tier.soft}`,
      display: "flex", flexDirection: "column",
    }}>
      {/* Tier strip — same as FilledCell so card heights/baselines align */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: tier.color,
        borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />

      {/* Pivot pill — overlay top-right, doesn't push content */}
      <div style={{
        position: "absolute", top: 8, right: 8,
        padding: "2px 7px", background: C_TOKENS.accent, color: "#fff",
        fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5,
        textTransform: "uppercase", borderRadius: 3,
      }}>
        ◉ Pivot
      </div>

      <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 7,
        paddingRight: 56 /* leave room for the Pivot pill */ }}>
        <div style={{ width: 40, height: 40, borderRadius: 5, background: tier.soft,
          border: `1px solid ${tier.color}`,
          display: "grid", placeItems: "center", fontSize: 24, lineHeight: 1, flexShrink: 0 }}>
          {pivot.glyph}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C_TOKENS.text,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {pivot.brand}
          </div>
          <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted, lineHeight: 1.3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {pivot.name}
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 10, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
        fontVariantNumeric: "tabular-nums",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 6, borderTop: `1px solid ${C_TOKENS.border}` }}>
        <span>{pivot.fmt}</span>
        {pivot.price != null && (
          <span style={{ fontWeight: 700, color: C_TOKENS.text, fontSize: 11 }}>
            {pivot.price.toFixed(2).replace(".", ",")} €
          </span>
        )}
      </div>
    </div>
  );
}

function FilledCell({ product, tier, pivot, onPivot, onClear }) {
  const [hover, setHover] = React.useState(false);

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        border: `1px solid ${C_TOKENS.border}`,
        background: "#fff",
        borderRadius: 6, padding: 12, height: 181,
        display: "flex", flexDirection: "column",
        cursor: "pointer",
        transition: "border-color 0.12s, box-shadow 0.12s",
        ...(hover ? { borderColor: tier.color, boxShadow: `0 2px 8px rgba(0,0,0,0.06)` } : {}),
      }}
      onClick={onPivot}>
      {/* Tier strip */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: tier.color, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} />

      {/* Remove button */}
      {hover && (
        <button onClick={(e) => { e.stopPropagation(); onClear(); }}
          style={{
            position: "absolute", top: 8, right: 8,
            width: 22, height: 22, borderRadius: 11,
            background: "#fff", border: `1px solid ${C_TOKENS.border}`,
            color: C_TOKENS.textMuted, cursor: "pointer",
            fontSize: 13, lineHeight: 1, fontFamily: "inherit",
            display: "grid", placeItems: "center",
          }} title="Retirer de la matrice">×</button>
      )}

      {(() => {
        const wPivot = parseFormatToBase(pivot.fmt);
        const wP = parseFormatToBase(product.fmt);
        const sameish = wPivot && wP && Math.abs(wP - wPivot) / wPivot <= 0.05;
        const isExact = sameish || (!wPivot && !wP) || product.fmt === pivot.fmt;
        const badgeColor = isExact ? "#1a7f3e" : "#b45309"; // green vs amber
        const badgeBg    = isExact ? "#e8f5ec" : "#fef3c7";
        return (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            alignSelf: "flex-start",
            padding: "2px 7px", borderRadius: 10,
            background: badgeBg, color: badgeColor,
            fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
            textTransform: "uppercase", marginBottom: 6,
            fontFamily: C_TOKENS.mono,
          }}>
            <span>{isExact ? "=" : "↻"}</span>
            <span>{isExact ? "Liaison exacte" : "Liaison redressée"}</span>
          </div>
        );
      })()}

      <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 7 }}>
        <div style={{ width: 40, height: 40, borderRadius: 5, background: tier.soft,
          border: `1px solid ${tier.color}`,
          display: "grid", placeItems: "center", fontSize: 24, lineHeight: 1, flexShrink: 0 }}>
          {product.glyph}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C_TOKENS.text,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.brand}
          </div>
          <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted, lineHeight: 1.3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.name}
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Footer: format + price + delta */}
      <div style={{ paddingTop: 6, borderTop: `1px solid ${C_TOKENS.border}` }}>
        <div style={{ fontSize: 10, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
          fontVariantNumeric: "tabular-nums",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.fmt}
          </span>
          {product.price != null && (
            <span style={{ fontWeight: 700, color: C_TOKENS.text, fontSize: 11 }}>
              {product.price.toFixed(2).replace(".", ",")} €
            </span>
          )}
        </div>
        {(() => {
          const wPivot = parseFormatToBase(pivot.fmt);
          const wP = parseFormatToBase(product.fmt);
          const hasPpk = product.pricePerKg && pivot.pricePerKg;
          const sameish = wPivot && wP && Math.abs(wP - wPivot) / wPivot <= 0.05;

          // No useful comparison
          if (!hasPpk && (!wPivot || !wP)) return null;

          // Grammages identical (or quasi) → exact match: just show €/kg delta on price
          if (sameish || !wPivot || !wP) {
            return hasPpk ? (
              <div style={{ marginTop: 3, fontSize: 10, fontFamily: C_TOKENS.mono,
                display: "flex", justifyContent: "flex-end" }}>
                <PriceDeltaF3 a={pivot.pricePerKg} b={product.pricePerKg} />
              </div>
            ) : null;
          }

          // Different grammages → 2-row redress mini-table
          const diff = wP - wPivot;
          const sign = diff > 0 ? "+" : "−";
          const diffAbs = Math.abs(diff);
          const pricePctRaw = hasPpk ? ((product.pricePerKg - pivot.pricePerKg) / pivot.pricePerKg) * 100 : null;
          const priceSign = pricePctRaw != null ? (pricePctRaw > 0 ? "+" : "−") : "";
          const priceUp = pricePctRaw != null && pricePctRaw > 0;
          const priceColor = pricePctRaw == null ? "#6b7280" : (priceUp ? "#dc2626" : "#1a7f3e");
          return (
            <div style={{
              marginTop: 5, padding: "5px 7px",
              background: "#fef3c7", border: `1px dashed #b45309`,
              borderRadius: 4,
              fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums",
              fontSize: 10.5, color: C_TOKENS.text,
              display: "grid",
              gridTemplateColumns: "auto auto 1fr auto auto",
              columnGap: 6, rowGap: 2,
              alignItems: "center",
              whiteSpace: "nowrap",
              lineHeight: 1.35,
            }}>
              {/* Row 1: grammage */}
              <span style={{ fontSize: 8.5, fontWeight: 700, color: "#b45309",
                letterSpacing: 0.5, textTransform: "uppercase" }}>Format</span>
              <span style={{ color: C_TOKENS.textMuted }}>{fmtBase(wPivot)}</span>
              <span style={{ color: C_TOKENS.textMuted, opacity: 0.55, justifySelf: "start" }}>→</span>
              <strong style={{ color: C_TOKENS.text, fontWeight: 700, justifySelf: "end" }}>{fmtBase(wP)}</strong>
              <span style={{
                padding: "1px 5px", background: "#b45309", color: "#fff",
                fontSize: 9, fontWeight: 700, borderRadius: 8, letterSpacing: 0.2,
                justifySelf: "end",
              }}>{sign}{fmtBase(diffAbs)}</span>

              {/* Row 2: prix au kg */}
              {hasPpk && (
                <>
                  <span style={{ fontSize: 8.5, fontWeight: 700, color: "#b45309",
                    letterSpacing: 0.5, textTransform: "uppercase" }}>€/kg</span>
                  <span style={{ color: C_TOKENS.textMuted }}>
                    {pivot.pricePerKg.toFixed(2).replace(".", ",")}
                  </span>
                  <span style={{ color: C_TOKENS.textMuted, opacity: 0.55, justifySelf: "start" }}>→</span>
                  <strong style={{ color: C_TOKENS.text, fontWeight: 700, justifySelf: "end" }}>
                    {product.pricePerKg.toFixed(2).replace(".", ",")}
                  </strong>
                  <span style={{
                    padding: "1px 5px", background: priceColor, color: "#fff",
                    fontSize: 9, fontWeight: 700, borderRadius: 8, letterSpacing: 0.2,
                    justifySelf: "end",
                  }}>{priceSign}{Math.abs(pricePctRaw).toFixed(0)}%</span>
                </>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function EmptySlot({ tier, isOpen, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        border: `1.5px dashed ${isOpen || hover ? tier.color : C_TOKENS.border}`,
        borderRadius: 6, padding: 12, height: 181,
        background: isOpen || hover ? tier.soft : "transparent",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
        cursor: "pointer", fontFamily: "inherit",
        color: isOpen || hover ? tier.color : C_TOKENS.textMuted,
        transition: "background 0.12s, border-color 0.12s",
      }}>
      <div style={{
        width: 36, height: 36, borderRadius: 18,
        border: `1.5px solid ${isOpen || hover ? tier.color : C_TOKENS.textSubtle}`,
        display: "grid", placeItems: "center",
        fontSize: 20, fontWeight: 400, lineHeight: 1,
      }}>+</div>
      <div style={{ fontSize: 11, fontWeight: 600 }}>
        Lier un produit
      </div>
      <div style={{ fontSize: 10, opacity: 0.85, textAlign: "center" }}>
        ({tier.short})
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Picker
// ─────────────────────────────────────────────────────────────────────────

function TierPicker({ tier, products, targetTier, onClose, onPick }) {
  const [q, setQ] = React.useState("");
  const inputRef = React.useRef(null);

  React.useEffect(() => { inputRef.current?.focus(); }, []);
  React.useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Suggestions: products whose tier matches target — these come first.
  const matching = products.filter(p => classifyTier(p) === targetTier);
  const others = products.filter(p => classifyTier(p) !== targetTier);
  const list = q.trim()
    ? [...matching, ...others].filter(p => {
        const s = (p.brand + " " + p.name + " " + p.fmt + " " + p.ean).toLowerCase();
        return s.includes(q.toLowerCase());
      }).slice(0, 12)
    : matching.slice(0, 8);

  return (
    <>
      {/* backdrop */}
      <div onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.18)", zIndex: 50 }} />

      <div role="dialog"
        style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          zIndex: 60, width: 420,
          background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 8,
          boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
          fontFamily: C_TOKENS.font, color: C_TOKENS.text,
        }}>
        <div style={{ padding: "11px 14px", borderBottom: `1px solid ${C_TOKENS.border}`,
          display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 4, background: tier.color,
            color: "#fff", display: "grid", placeItems: "center",
            fontSize: 10, fontWeight: 700 }}>{tier.short}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>
              Lier une alternative <span style={{ color: tier.color }}>{tier.label}</span>
            </div>
            <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted }}>
              {tier.desc}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 26, height: 26, border: "none", background: "transparent",
            color: C_TOKENS.textMuted, cursor: "pointer", fontSize: 16, lineHeight: 1,
            borderRadius: 3 }}>×</button>
        </div>

        <div style={{ padding: 12 }}>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
            placeholder="Rechercher par marque, nom, EAN…"
            style={{
              width: "100%", padding: "8px 10px", fontSize: 12,
              border: `1px solid ${C_TOKENS.border}`, borderRadius: 4,
              fontFamily: "inherit", color: C_TOKENS.text,
              outline: "none", boxSizing: "border-box", marginBottom: 8,
            }} />

          {!q.trim() && matching.length > 0 && (
            <div style={{ fontSize: 10, color: C_TOKENS.textMuted,
              textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700,
              padding: "0 2px 5px" }}>
              Suggestions {tier.short} ({matching.length})
            </div>
          )}

          <div style={{ maxHeight: 280, overflow: "auto",
            border: `1px solid ${C_TOKENS.border}`, borderRadius: 4 }}>
            {list.length === 0 ? (
              <div style={{ padding: "20px 12px", fontSize: 12, color: C_TOKENS.textMuted,
                textAlign: "center" }}>
                {q.trim() ? "Aucun produit." : "Aucune suggestion — saisissez une recherche."}
              </div>
            ) : list.map((p, i) => {
              const pTier = classifyTier(p);
              const matchesTier = pTier === targetTier;
              return (
                <button key={p.id} onClick={() => onPick(p)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 9,
                    padding: "8px 10px", background: "transparent", border: "none",
                    borderBottom: i < list.length - 1 ? `1px solid ${C_TOKENS.border}` : "none",
                    textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = C_TOKENS.headerBg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{p.glyph}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: C_TOKENS.text,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.brand}
                      </span>
                      <TierBadge tier={pTier} small mismatch={!matchesTier} />
                    </div>
                    <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 10, color: C_TOKENS.textMuted,
                      fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>
                      {p.fmt} · {p.ean}{p.price != null ? ` · ${p.price.toFixed(2).replace(".", ",")} €` : ""}
                    </div>
                  </div>
                  <span style={{ fontSize: 10.5, color: C_TOKENS.accent, fontWeight: 600,
                    flexShrink: 0 }}>+ Lier</span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6,
            fontSize: 10.5, color: C_TOKENS.textMuted }}>
            <span>esc pour fermer</span>
            <div style={{ flex: 1 }} />
            <button style={{
              padding: "5px 10px", fontSize: 11, background: "#fff",
              border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, cursor: "pointer",
              fontFamily: "inherit", color: C_TOKENS.text,
            }}>+ Créer un nouveau produit…</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// AI Suggestions — score candidate products by relevance to the pivot
// ─────────────────────────────────────────────────────────────────────────

// Parse a format string like "500g", "1.5 L", "6×33cl" into a comparable
// weight or volume in grams / ml. Returns null if not parseable.
function parseFormatToBase(fmt) {
  if (!fmt) return null;
  // Try multipack like "6×33cl" or "6 x 33 cl"
  const mm = fmt.match(/(\d+)\s*[x×]\s*(\d+[\.,]?\d*)\s*(g|kg|l|ml|cl)/i);
  if (mm) {
    const n = parseInt(mm[1], 10);
    const v = parseFloat(mm[2].replace(",", "."));
    return n * normalizeUnit(v, mm[3]);
  }
  const m = fmt.match(/(\d+[\.,]?\d*)\s*(g|kg|l|ml|cl)/i);
  if (!m) return null;
  return normalizeUnit(parseFloat(m[1].replace(",", ".")), m[2]);
}
function normalizeUnit(v, unit) {
  const u = unit.toLowerCase();
  if (u === "kg") return v * 1000;
  if (u === "l")  return v * 1000;
  if (u === "cl") return v * 10;
  return v; // g or ml
}

// Format a base-unit value (g or ml) for compact display
function fmtBase(v) {
  if (v == null) return "—";
  if (v >= 1000) {
    const k = v / 1000;
    return (k % 1 === 0 ? k.toFixed(0) : k.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""))
      .replace(".", ",") + "kg";
  }
  return Math.round(v) + "g";
}

function scoreCandidate(pivot, p) {
  // Returns { score: 0..1, reasons: [string] }
  const reasons = [];
  let s = 0;

  // Category match
  if (pivot.category && p.category && pivot.category === p.category) {
    s += 0.30; reasons.push("Catégorie identique");
  } else if (pivot.category && p.category) {
    const a = pivot.category.split("›")[0].trim().toLowerCase();
    const b = p.category.split("›")[0].trim().toLowerCase();
    if (a === b) { s += 0.18; reasons.push("Même rayon"); }
  }

  // Format match (with €/kg redress for slightly different grammages)
  const wPivot = parseFormatToBase(pivot.fmt);
  const wP = parseFormatToBase(p.fmt);
  if (pivot.fmt && p.fmt) {
    if (pivot.fmt === p.fmt) {
      s += 0.22; reasons.push("Format identique");
    } else if (wPivot && wP) {
      const ratio = wP / wPivot; // 1 = same, 0.8/1.2 = ±20%
      if (ratio >= 0.85 && ratio <= 1.15) {
        s += 0.20; reasons.push("Grammage proche (±15%)");
      } else if (ratio >= 0.5 && ratio <= 2 && pivot.pricePerKg && p.pricePerKg) {
        // Significantly different size, but a price-per-kg comparison is still meaningful
        s += 0.14; reasons.push("Format différent · redressé au €/kg");
      }
    }
  }

  // Labels (bio, sans gluten, …)
  const pivotLabels = new Set(pivot.labels || []);
  const pLabels = (p.labels || []).filter(l => pivotLabels.has(l));
  if (pLabels.length > 0) {
    s += 0.15;
    reasons.push(`Label ${pLabels.join(", ")} commun`);
  }

  // Price-per-kg proximity (closer = more comparable)
  if (pivot.pricePerKg && p.pricePerKg) {
    const ratio = Math.abs(pivot.pricePerKg - p.pricePerKg) / pivot.pricePerKg;
    if (ratio < 0.2) { s += 0.15; reasons.push("Prix au kg proche (±20%)"); }
    else if (ratio < 0.5) { s += 0.08; reasons.push("Positionnement prix comparable"); }
  }

  // Glyph match (same emoji = same product type heuristic)
  if (pivot.glyph && p.glyph && pivot.glyph === p.glyph) {
    s += 0.10;
    if (reasons.length === 0) reasons.push("Type de produit identique");
  }

  return { score: Math.min(s, 0.99), reasons: reasons.slice(0, 3) };
}

function SuggestionsBlock({ pivot, candidates, onAdd }) {
  const [showAll, setShowAll] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [tierFilter, setTierFilter] = React.useState("all"); // "all" | "MN" | "MDD" | "PP"

  // 1. Score every candidate
  const scoredAll = React.useMemo(() => {
    return candidates
      .map(p => ({ product: p, ...scoreCandidate(pivot, p), tier: classifyTier(p) }))
      .sort((a, b) => b.score - a.score);
  }, [pivot, candidates]);

  // 2. Filter: search query overrides the relevance threshold
  const q = query.trim().toLowerCase();
  const filtered = React.useMemo(() => {
    let list = scoredAll;
    if (q) {
      list = list.filter(s => {
        const p = s.product;
        return (
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.fmt && p.fmt.toLowerCase().includes(q)) ||
          (p.ean && p.ean.includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
        );
      });
    } else {
      // No query → keep only relevant suggestions
      list = list.filter(s => s.score > 0.15);
    }
    if (tierFilter !== "all") {
      list = list.filter(s => s.tier === tierFilter);
    }
    return list;
  }, [scoredAll, q, tierFilter]);

  const isSearching = q.length > 0;
  const visible = showAll || isSearching ? filtered : filtered.slice(0, 8);

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
          textTransform: "uppercase", letterSpacing: 0.5 }}>
          {isSearching ? "Recherche" : "Suggestions IA"}
        </span>
        <span style={{ fontSize: 10, padding: "1px 6px", background: C_TOKENS.accent,
          color: "#fff", borderRadius: 8, fontWeight: 700 }}>{filtered.length}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: C_TOKENS.textMuted }}>
          {isSearching ? "résultats" : "par pertinence"}
        </span>
      </div>

      {/* Search bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 9px", marginBottom: 7,
        border: `1px solid ${C_TOKENS.border}`, borderRadius: 4,
        background: "#fff",
      }}>
        <I.search size={11} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher marque, libellé, EAN…"
          style={{
            flex: 1, minWidth: 0,
            border: 0, outline: "none", background: "transparent",
            fontSize: 11.5, fontFamily: "inherit", color: C_TOKENS.text,
          }}
        />
        {query && (
          <button onClick={() => setQuery("")}
            style={{
              background: "transparent", border: 0, cursor: "pointer",
              color: C_TOKENS.textMuted, fontSize: 13, lineHeight: 1,
              padding: 2, fontFamily: "inherit",
            }}
            title="Effacer">×</button>
        )}
      </div>

      {/* Tier filter chips */}
      <div style={{ display: "flex", gap: 4, marginBottom: 9 }}>
        {[
          { code: "all", label: "Toutes" },
          ...F3_TIERS.map(t => ({ code: t.code, label: t.short, color: t.color, soft: t.soft })),
        ].map(opt => {
          const active = tierFilter === opt.code;
          return (
            <button key={opt.code} onClick={() => setTierFilter(opt.code)}
              style={{
                flex: 1, padding: "4px 6px", fontSize: 10.5, fontWeight: 700,
                background: active ? (opt.color || C_TOKENS.accent) : "#fff",
                color: active ? "#fff" : (opt.color || C_TOKENS.textMuted),
                border: `1px solid ${active ? (opt.color || C_TOKENS.accent) : C_TOKENS.border}`,
                borderRadius: 3, cursor: "pointer", fontFamily: "inherit",
              }}>{opt.label}</button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{
          padding: "16px 10px", fontSize: 11, color: C_TOKENS.textMuted,
          textAlign: "center", border: `1px dashed ${C_TOKENS.border}`,
          borderRadius: 4, background: C_TOKENS.headerBg,
        }}>
          {isSearching
            ? <>Aucun produit ne correspond à <strong>« {query} »</strong>.</>
            : "Aucune suggestion disponible."}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {visible.map(s => (
          <SuggestionCard key={s.product.id}
            suggestion={s} pivot={pivot} query={q}
            onAdd={() => onAdd(s.product)} />
        ))}
      </div>

      {!isSearching && filtered.length > 8 && (
        <button onClick={() => setShowAll(v => !v)}
          style={{ marginTop: 7, width: "100%", padding: "6px 8px",
            background: "transparent", border: `1px solid ${C_TOKENS.border}`,
            borderRadius: 3, fontSize: 11, color: C_TOKENS.textMuted,
            cursor: "pointer", fontFamily: "inherit" }}>
          {showAll
            ? "− Réduire"
            : `+ Voir ${filtered.length - 8} suggestions de plus`}
        </button>
      )}
    </div>
  );
}

function SuggestionCard({ suggestion, pivot, onAdd }) {
  const { product: p, score, reasons, tier } = suggestion;
  const t = F3_TIERS.find(x => x.code === tier) || F3_TIERS[0];
  const [hover, setHover] = React.useState(false);

  // Confidence color
  const conf = window.confColor ? window.confColor(score) : C_TOKENS.text;

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        border: `1px solid ${hover ? t.color : C_TOKENS.border}`,
        background: "#fff", borderRadius: 5, padding: "8px 10px 8px 11px",
        borderLeftWidth: 3, borderLeftColor: t.color,
        transition: "border-color 0.12s",
      }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0,
          marginTop: 2 }}>{p.glyph}</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 1 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C_TOKENS.text,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              minWidth: 0, flex: "0 1 auto" }}>
              {p.brand}
            </span>
            <TierBadge tier={tier} small />
          </div>
          <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted, lineHeight: 1.3,
            marginBottom: 4,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {p.name}
          </div>

          {/* Reasons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 5 }}>
            {reasons.map((r, i) => (
              <span key={i} style={{
                fontSize: 9.5, padding: "1px 6px",
                background: t.soft, color: t.color, borderRadius: 8,
                fontWeight: 600, whiteSpace: "nowrap",
              }}>{r}</span>
            ))}
          </div>

          {/* Footer: confidence + price + add */}
          <div style={{ display: "flex", alignItems: "center", gap: 7,
            fontSize: 10, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
            fontVariantNumeric: "tabular-nums" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: 4, background: conf }} />
              <span style={{ color: conf, fontWeight: 700 }}>
                {Math.round(score * 100)}%
              </span>
            </div>
            <span style={{ color: C_TOKENS.textSubtle }}>·</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis",
              whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
              {p.fmt}{p.price != null ? ` · ${p.price.toFixed(2).replace(".", ",")} €` : ""}
            </span>
            {p.pricePerKg && pivot.pricePerKg && (() => {
              const wPivot = parseFormatToBase(pivot.fmt);
              const wP = parseFormatToBase(p.fmt);
              const sameish = wPivot && wP && Math.abs(wP - wPivot) / wPivot <= 0.05;
              return (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                  {!sameish && (
                    <span title="Grammages différents — redressement par €/kg"
                      style={{
                        fontSize: 8.5, padding: "0 4px", height: 13, lineHeight: "13px",
                        background: t.soft, color: t.color,
                        borderRadius: 7, fontWeight: 700, letterSpacing: 0.3,
                      }}>↻</span>
                  )}
                  <PriceDeltaF3 a={pivot.pricePerKg} b={p.pricePerKg} />
                </span>
              );
            })()}
          </div>
        </div>

        <button onClick={onAdd}
          style={{
            flexShrink: 0,
            padding: "4px 8px", fontSize: 10.5, fontWeight: 700,
            background: hover ? t.color : "#fff",
            color: hover ? "#fff" : t.color,
            border: `1px solid ${t.color}`, borderRadius: 3,
            cursor: "pointer", fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 3,
            whiteSpace: "nowrap",
            transition: "background 0.12s, color 0.12s",
          }}
          title={`Ajouter à la ligne ${t.short}`}>
          + Lier
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Helpers (badges, price delta)
// ─────────────────────────────────────────────────────────────────────────

function TierBadge({ tier, small, mismatch }) {
  const t = F3_TIERS.find(x => x.code === tier);
  if (!t) return null;
  const sz = small ? { fs: 9, h: 14, px: 5 } : { fs: 9.5, h: 16, px: 6 };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      height: sz.h, padding: `0 ${sz.px}px`,
      background: mismatch ? "#fff" : t.color, color: mismatch ? t.color : "#fff",
      border: mismatch ? `1px dashed ${t.color}` : "none",
      fontSize: sz.fs, fontWeight: 700, letterSpacing: 0.4,
      borderRadius: 3,
    }} title={mismatch ? `Niveau différent : ${t.label}` : t.label}>
      {t.short}
    </span>
  );
}

function PriceDeltaF3({ a, b }) {
  const d = ((b - a) / a) * 100;
  if (Math.abs(d) < 0.5) return null;
  const up = d > 0;
  return (
    <span style={{
      color: up ? C_TOKENS.red : C_TOKENS.green,
      fontWeight: 700, fontSize: 9.5,
      padding: "1px 5px", borderRadius: 2,
      background: up ? C_TOKENS.redSoft : C_TOKENS.greenSoft,
      whiteSpace: "nowrap",
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
