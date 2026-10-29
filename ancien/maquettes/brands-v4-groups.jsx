// V4 — Vue groupes actionnaires (treemap-like)
// Visualise la structure : Groupe → Marques rattachées.
// Chaque groupe est une "carte" qui contient ses marques en mosaïque
// dimensionnée par nombre d'articles.

function BrandsV4() {
  const T = window.C_TOKENS;
  const BRANDS = window.BRANDS;
  const TYPOLOGIES = window.TYPOLOGIES;

  const [search, setSearch] = React.useState("");
  const [activeBrandId, setActiveBrandId] = React.useState(null);
  const [collapsed, setCollapsed] = React.useState(new Set());

  // Group brands by group actionnaire
  const groups = React.useMemo(() => {
    const m = {};
    BRANDS.forEach(b => {
      const g = b.group || "(non rattachées)";
      if (!m[g]) m[g] = { name: g, brands: [], totalArticles: 0, missingGroup: !b.group };
      m[g].brands.push(b);
      m[g].totalArticles += (b.articleCount || 0);
      if (!b.group) m[g].missingGroup = true;
    });
    return Object.values(m).sort((a, b) => {
      // unmatched group last
      if (a.name === "(non rattachées)") return 1;
      if (b.name === "(non rattachées)") return -1;
      return b.totalArticles - a.totalArticles;
    });
  }, []);

  const filteredGroups = React.useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    return groups.map(g => ({
      ...g,
      brands: g.brands.filter(b =>
        b.name.toLowerCase().includes(q) ||
        g.name.toLowerCase().includes(q) ||
        (b.aka || []).some(a => a.toLowerCase().includes(q))
      ),
    })).filter(g => g.brands.length > 0);
  }, [search, groups]);

  const totalBrands = BRANDS.length;
  const orphan = BRANDS.filter(b => !b.group).length;

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "#f6f6f4", fontFamily: T.font, color: T.text, fontSize: 13,
    }}>
      {/* ─── Top bar ─────────────────────────────────────── */}
      <div style={{
        height: 44, padding: "0 18px", background: "#fff",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", gap: 14, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6, background: T.accent,
            color: "#fff", display: "grid", placeItems: "center",
            fontWeight: 700, fontSize: 13,
          }}>P</div>
          <span style={{ fontWeight: 600 }}>Produit.ai</span>
          <span style={{ color: T.textSubtle }}>›</span>
          <span style={{ fontWeight: 500 }}>Marques par groupe actionnaire</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11.5, color: T.textMuted, fontFamily: T.mono }}>
          {groups.length} groupes · {totalBrands} marques · {orphan > 0 ? `${orphan} sans groupe` : "0 orphelines"}
        </span>
      </div>

      {/* ─── Toolbar ─────────────────────────────────────── */}
      <div style={{
        height: 44, padding: "0 18px", background: "#fff",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
      }}>
        <div style={{
          position: "relative", display: "flex", alignItems: "center",
          background: "#f4f5f7", border: `1px solid ${T.border}`,
          borderRadius: 5, padding: "0 10px", height: 30, width: 280,
        }}>
          <I.search size={13} style={{ color: T.textSubtle }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une marque ou un groupe…"
            style={{
              flex: 1, marginLeft: 8, height: 28, padding: 0, border: "none",
              background: "transparent", fontSize: 12.5, fontFamily: "inherit",
              color: T.text, outline: "none",
            }} />
        </div>
        <button onClick={() => setCollapsed(new Set(groups.map(g => g.name)))} style={{
          padding: "5px 11px", background: "#fff", border: `1px solid ${T.border}`,
          borderRadius: 4, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", gap: 5, color: T.textMuted,
        }}>
          <I.chevronUp size={11} /> Tout replier
        </button>
        <button onClick={() => setCollapsed(new Set())} style={{
          padding: "5px 11px", background: "#fff", border: `1px solid ${T.border}`,
          borderRadius: 4, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", gap: 5, color: T.textMuted,
        }}>
          <I.chevronDown size={11} /> Tout déplier
        </button>
        <div style={{ flex: 1 }} />
        <button style={{
          padding: "5px 11px", background: "#fff", border: `1px solid ${T.accent}`,
          color: T.accentText, borderRadius: 4, fontSize: 11.5, cursor: "pointer",
          fontFamily: "inherit", fontWeight: 500,
          display: "inline-flex", alignItems: "center", gap: 5,
        }}>
          <I.sparkle size={11} /> Détecter doublons & rattachements
        </button>
      </div>

      {/* ─── Content ─────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "auto", padding: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 1400, margin: "0 auto" }}>
          {filteredGroups.map(g => (
            <GroupCard key={g.name} group={g}
              collapsed={collapsed.has(g.name)}
              onToggle={() => {
                setCollapsed(s => {
                  const ns = new Set(s);
                  if (ns.has(g.name)) ns.delete(g.name); else ns.add(g.name);
                  return ns;
                });
              }}
              activeBrandId={activeBrandId}
              onBrandClick={setActiveBrandId} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function GroupCard({ group, collapsed, onToggle, activeBrandId, onBrandClick }) {
  const T = window.C_TOKENS;
  const isOrphan = group.name === "(non rattachées)";
  const groupHue = window.hashHue(group.name);
  const accentColor = isOrphan ? "oklch(0.55 0.18 25)" : `oklch(0.5 0.14 ${groupHue})`;
  const bgTint = isOrphan ? "oklch(0.97 0.04 25)" : `oklch(0.97 0.03 ${groupHue})`;

  // Compute typology mix
  const mix = {};
  group.brands.forEach(b => { mix[b.typo] = (mix[b.typo] || 0) + 1; });

  // Sort brands by article count
  const sortedBrands = [...group.brands].sort((a, b) => (b.articleCount || 0) - (a.articleCount || 0));

  const totalIncomplete = group.brands.filter(b => {
    return Object.values(b.conf || {}).some(c => c === 0);
  }).length;

  return (
    <div style={{
      background: "#fff", border: `1px solid ${T.border}`,
      borderLeft: `3px solid ${accentColor}`,
      borderRadius: 6, overflow: "hidden",
    }}>
      {/* Header */}
      <div onClick={onToggle} style={{
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        cursor: "pointer", background: bgTint,
        borderBottom: collapsed ? "none" : `1px solid ${T.border}`,
      }}>
        <div style={{
          width: 22, height: 22, display: "grid", placeItems: "center",
          color: T.textMuted, flexShrink: 0,
        }}>
          {collapsed ? <I.chevronRight size={13} /> : <I.chevronDown size={13} />}
        </div>

        {/* Group avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: 6,
          background: accentColor, color: "#fff",
          display: "grid", placeItems: "center",
          fontWeight: 700, fontSize: 14, letterSpacing: 0.3,
          flexShrink: 0,
        }}>
          {isOrphan ? <I.warning size={16} /> : window.brandInitials(group.name)}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14.5, fontWeight: 700, color: T.text,
            fontStyle: isOrphan ? "italic" : "normal",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            {isOrphan ? "Marques sans groupe" : group.name}
            {isOrphan && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 7px",
                background: "oklch(0.97 0.04 25)", color: "oklch(0.45 0.18 25)",
                border: "1px solid oklch(0.85 0.08 25)", borderRadius: 3,
                letterSpacing: 0.3, textTransform: "uppercase",
              }}>à rattacher</span>
            )}
          </div>
          <div style={{
            fontSize: 11.5, color: T.textMuted, marginTop: 2,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span><strong style={{ color: T.text, fontFamily: T.mono }}>{group.brands.length}</strong> marque{group.brands.length > 1 ? "s" : ""}</span>
            <span style={{ color: T.textSubtle }}>·</span>
            <span><strong style={{ color: T.text, fontFamily: T.mono }}>{group.totalArticles.toLocaleString("fr-FR")}</strong> articles</span>
            {totalIncomplete > 0 && (
              <>
                <span style={{ color: T.textSubtle }}>·</span>
                <span style={{ color: "oklch(0.5 0.18 25)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "oklch(0.55 0.2 25)",
                  }} />
                  {totalIncomplete} fiche{totalIncomplete > 1 ? "s" : ""} à compléter
                </span>
              </>
            )}
          </div>
        </div>

        {/* Typology mix pills */}
        {!isOrphan && (
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            {Object.entries(mix).sort((a, b) => b[1] - a[1]).map(([typo, count]) => {
              const ts = window.typoStyle(typo);
              return (
                <span key={typo} title={`${count} marque(s) ${typo}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 4, height: 22,
                  padding: "0 8px", borderRadius: 3,
                  background: ts.bg, color: ts.fg, border: `1px solid ${ts.border}`,
                  fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3,
                  fontFamily: T.mono,
                }}>
                  <span>{typo}</span>
                  <span style={{ opacity: 0.7 }}>×{count}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Brand mosaic */}
      {!collapsed && (
        <div style={{ padding: 12 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 8,
          }}>
            {sortedBrands.map(b => (
              <BrandTile key={b.id} brand={b} active={activeBrandId === b.id}
                onClick={() => onBrandClick(b.id)} />
            ))}
            {!isOrphan && (
              <button style={{
                background: "transparent", border: `1px dashed ${T.borderStrong}`,
                borderRadius: 5, padding: "10px 12px",
                fontSize: 12, color: T.textMuted, cursor: "pointer",
                fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
                justifyContent: "center", minHeight: 64,
              }}>
                <I.plus size={12} /> Rattacher une marque
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BrandTile({ brand, active, onClick }) {
  const T = window.C_TOKENS;
  const TYPOLOGIES = window.TYPOLOGIES;
  const t = TYPOLOGIES[brand.typo];
  const ts = window.typoStyle(brand.typo);
  const logo = window.brandLogoStyle(brand);
  const initials = window.brandInitials(brand.name);
  const conf = brand.conf || {};
  const missing = Object.values(conf).filter(c => c === 0).length;

  return (
    <div onClick={onClick} style={{
      background: "#fff", border: `1px solid ${active ? T.accent : T.border}`,
      borderRadius: 5, padding: "8px 10px",
      display: "flex", alignItems: "center", gap: 10,
      cursor: "pointer", position: "relative",
      boxShadow: active ? `0 0 0 3px ${T.accentSoft}` : "none",
    }}>
      {/* Logo */}
      <div style={{
        width: 32, height: 32, borderRadius: 5,
        background: logo.bg, color: logo.fg,
        display: "grid", placeItems: "center",
        fontWeight: 700, fontSize: 11, letterSpacing: 0.3,
        border: `1px solid oklch(0 0 0 / 0.08)`,
        flexShrink: 0,
      }}>{initials}</div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12.5, fontWeight: 600, color: T.text,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{brand.name}</span>
          <span style={{
            display: "inline-flex", alignItems: "center", height: 14,
            padding: "0 4px", borderRadius: 2,
            background: ts.bg, color: ts.fg, border: `1px solid ${ts.border}`,
            fontSize: 8.5, fontWeight: 700, letterSpacing: 0.3,
            fontFamily: T.mono, flexShrink: 0,
          }}>{brand.typo}</span>
        </div>
        <div style={{
          fontSize: 10.5, color: T.textSubtle, marginTop: 1,
          fontFamily: T.mono, fontVariantNumeric: "tabular-nums",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span>{brand.articleCount} art.</span>
          {missing > 0 && (
            <span title={`${missing} champ(s) manquant(s)`} style={{
              display: "inline-flex", alignItems: "center", gap: 2,
              color: "oklch(0.5 0.18 25)",
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "oklch(0.55 0.2 25)",
              }} />
              {missing}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

window.BrandsV4 = BrandsV4;
