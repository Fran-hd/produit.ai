// V2 — Galerie de cartes-logos avec filtres lat\u00e9raux
// Approche tr\u00e8s visuelle : grille de cartes 220\u00d7180, gros logos color\u00e9s,
// sidebar de filtres facett\u00e9s, drawer en bas pour le d\u00e9tail.

function BrandsV2() {
  const T = window.C_TOKENS;
  const BRANDS = window.BRANDS;
  const TYPOLOGIES = window.TYPOLOGIES;
  const GROUPS = window.GROUPS;

  const [search, setSearch] = React.useState("");
  const [filterTypos, setFilterTypos] = React.useState(new Set()); // empty = all
  const [filterGroups, setFilterGroups] = React.useState(new Set());
  const [filterCountries, setFilterCountries] = React.useState(new Set());
  const [filterStatus, setFilterStatus] = React.useState("all"); // all|incomplete|missing-logo|low-conf
  const [activeId, setActiveId] = React.useState(null);
  const [sortBy, setSortBy] = React.useState("name"); // name|articles|completeness

  const toggleSet = (setter, val) => {
    setter(s => {
      const ns = new Set(s);
      if (ns.has(val)) ns.delete(val); else ns.add(val);
      return ns;
    });
  };

  // Computed lists
  const allCountries = React.useMemo(() => {
    const s = new Set();
    BRANDS.forEach(b => { if (b.country) s.add(b.country); });
    return [...s].sort();
  }, []);
  const allGroups = React.useMemo(() => {
    const m = {};
    BRANDS.forEach(b => {
      const g = b.group || "(non renseigné)";
      m[g] = (m[g] || 0) + 1;
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, []);

  const computeBrandStatus = (b) => {
    const conf = b.conf || {};
    const missing = Object.values(conf).filter(c => c === 0).length;
    const lowConf = Object.values(conf).filter(c => c > 0 && c < 80).length;
    const total = Object.keys(conf).length || 7;
    const filled = total - missing;
    return { missing, lowConf, completeness: Math.round(filled / total * 100), needsAttention: missing > 0 || lowConf > 0 };
  };

  const filtered = React.useMemo(() => {
    let out = BRANDS.map(b => ({ ...b, status: computeBrandStatus(b) }));
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(b =>
        b.name.toLowerCase().includes(q) ||
        (b.group || "").toLowerCase().includes(q) ||
        (b.aka || []).some(a => a.toLowerCase().includes(q)));
    }
    if (filterTypos.size > 0) out = out.filter(b => filterTypos.has(b.typo));
    if (filterGroups.size > 0) out = out.filter(b => filterGroups.has(b.group || "(non renseigné)"));
    if (filterCountries.size > 0) out = out.filter(b => filterCountries.has(b.country));
    if (filterStatus === "incomplete") out = out.filter(b => b.status.missing > 0);
    else if (filterStatus === "missing-logo") out = out.filter(b => b.conf?.logo === 0);
    else if (filterStatus === "low-conf") out = out.filter(b => b.status.lowConf > 0);

    if (sortBy === "name") out.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "articles") out.sort((a, b) => b.articleCount - a.articleCount);
    else if (sortBy === "completeness") out.sort((a, b) => a.status.completeness - b.status.completeness);
    return out;
  }, [search, filterTypos, filterGroups, filterCountries, filterStatus, sortBy]);

  const totalActive = filterTypos.size + filterGroups.size + filterCountries.size + (filterStatus !== "all" ? 1 : 0);

  return (
    <div style={{
      display: "flex", height: "100%", background: "#f6f6f4",
      fontFamily: T.font, color: T.text, fontSize: 13,
    }}>

      {/* ─── Sidebar filtres ──────────────────────────────── */}
      <div style={{
        width: 240, background: "#fff", borderRight: `1px solid ${T.border}`,
        flexShrink: 0, overflow: "auto", display: "flex", flexDirection: "column",
      }}>
        {/* Brand */}
        <div style={{
          padding: "14px 16px", borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6, background: T.accent,
            color: "#fff", display: "grid", placeItems: "center",
            fontWeight: 700, fontSize: 13,
          }}>P</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Marques</div>
            <div style={{ fontSize: 10.5, color: T.textSubtle, marginTop: 1 }}>{BRANDS.length} fiches</div>
          </div>
        </div>

        {/* Filter sections */}
        <FilterFacet title="Typologie">
          {Object.values(TYPOLOGIES).map(t => {
            const count = BRANDS.filter(b => b.typo === t.code).length;
            const checked = filterTypos.has(t.code);
            const ts = window.typoStyle(t.code);
            return (
              <FacetItem key={t.code} checked={checked}
                onClick={() => toggleSet(setFilterTypos, t.code)} count={count}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  minWidth: 32, height: 18, padding: "0 5px", borderRadius: 3,
                  background: ts.bg, color: ts.fg,
                  border: `1px solid ${ts.border}`,
                  fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4,
                  fontFamily: T.mono, marginRight: 7,
                }}>{t.code}</span>
                <span>{t.short}</span>
              </FacetItem>
            );
          })}
        </FilterFacet>

        <FilterFacet title="Statut IA">
          <FacetItem checked={filterStatus === "all"} onClick={() => setFilterStatus("all")}>
            Toutes les marques
          </FacetItem>
          <FacetItem checked={filterStatus === "incomplete"} onClick={() => setFilterStatus("incomplete")}
            count={BRANDS.filter(b => computeBrandStatus(b).missing > 0).length}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "oklch(0.55 0.2 25)", marginRight: 7,
            }} />
            <span>Champs manquants</span>
          </FacetItem>
          <FacetItem checked={filterStatus === "missing-logo"} onClick={() => setFilterStatus("missing-logo")}
            count={BRANDS.filter(b => b.conf?.logo === 0).length}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "oklch(0.55 0.2 25)", marginRight: 7,
            }} />
            <span>Logo manquant</span>
          </FacetItem>
          <FacetItem checked={filterStatus === "low-conf"} onClick={() => setFilterStatus("low-conf")}
            count={BRANDS.filter(b => computeBrandStatus(b).lowConf > 0).length}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "oklch(0.62 0.17 65)", marginRight: 7,
            }} />
            <span>Suggestions à valider</span>
          </FacetItem>
        </FilterFacet>

        <FilterFacet title="Groupe actionnaire" collapsible>
          {allGroups.slice(0, 12).map(([g, count]) => {
            const checked = filterGroups.has(g);
            return (
              <FacetItem key={g} checked={checked}
                onClick={() => toggleSet(setFilterGroups, g)} count={count}>
                <span style={{
                  fontStyle: g === "(non renseigné)" ? "italic" : "normal",
                  color: g === "(non renseigné)" ? T.textSubtle : "inherit",
                }}>{g}</span>
              </FacetItem>
            );
          })}
        </FilterFacet>

        <FilterFacet title="Pays" collapsible>
          {allCountries.map(c => {
            const count = BRANDS.filter(b => b.country === c).length;
            const checked = filterCountries.has(c);
            return (
              <FacetItem key={c} checked={checked}
                onClick={() => toggleSet(setFilterCountries, c)} count={count}>
                <span style={{ fontSize: 14, marginRight: 7 }}>{countryFlag(c)}</span>
                <span style={{ fontFamily: T.mono, fontWeight: 500 }}>{c}</span>
                <span style={{ color: T.textMuted, marginLeft: 6 }}>· {countryName(c)}</span>
              </FacetItem>
            );
          })}
        </FilterFacet>

        {totalActive > 0 && (
          <div style={{
            padding: 12, borderTop: `1px solid ${T.border}`,
            background: T.accentSoft, marginTop: "auto",
          }}>
            <button onClick={() => {
              setFilterTypos(new Set()); setFilterGroups(new Set());
              setFilterCountries(new Set()); setFilterStatus("all");
            }}
              style={{
                width: "100%", padding: "6px 10px", background: "#fff",
                border: `1px solid ${T.accent}`, borderRadius: 4,
                fontSize: 11.5, color: T.accentText, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              Réinitialiser ({totalActive} actif{totalActive > 1 ? "s" : ""})
            </button>
          </div>
        )}
      </div>

      {/* ─── Main ─────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{
          height: 50, padding: "0 22px", background: "#fff",
          borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
        }}>
          <div style={{
            position: "relative", display: "flex", alignItems: "center",
            background: "#f4f5f7", border: `1px solid ${T.border}`,
            borderRadius: 5, padding: "0 12px", height: 32, flex: 1, maxWidth: 400,
          }}>
            <I.search size={14} style={{ color: T.textSubtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une marque par nom, alias, groupe…"
              style={{
                flex: 1, marginLeft: 10, height: 30, padding: 0, border: "none",
                background: "transparent", fontSize: 13, fontFamily: "inherit",
                color: T.text, outline: "none",
              }} />
          </div>
          <div style={{
            fontFamily: T.mono, fontSize: 12, color: T.textMuted,
            fontVariantNumeric: "tabular-nums",
          }}>
            {filtered.length} / {BRANDS.length}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 11.5, color: T.textMuted,
          }}>
            <span>Trier :</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{
                height: 28, padding: "0 8px", border: `1px solid ${T.border}`,
                borderRadius: 4, background: "#fff", fontSize: 12,
                fontFamily: "inherit", cursor: "pointer",
              }}>
              <option value="name">Nom A→Z</option>
              <option value="articles">Articles ↓</option>
              <option value="completeness">Complétude ↑</option>
            </select>
          </div>
          <button style={{
            padding: "6px 12px", background: T.accent, color: "#fff", border: "none",
            borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: "pointer",
            fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            <I.plus size={12} /> Nouvelle marque
          </button>
        </div>

        {/* Grid */}
        <div style={{
          flex: 1, overflow: "auto", padding: 22,
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 14, alignContent: "flex-start",
          }}>
            {filtered.map(b => (
              <BrandCard key={b.id} brand={b}
                active={activeId === b.id}
                onClick={() => setActiveId(b.id)} />
            ))}
            {filtered.length === 0 && (
              <div style={{
                gridColumn: "1 / -1", padding: "80px 20px",
                textAlign: "center", color: T.textSubtle,
                fontStyle: "italic", fontSize: 13,
              }}>
                Aucune marque ne correspond aux filtres.
              </div>
            )}
          </div>
        </div>

        {/* Bottom drawer detail */}
        {activeId && (
          <BrandDrawer brand={filtered.find(b => b.id === activeId) || BRANDS.find(b => b.id === activeId)}
            onClose={() => setActiveId(null)} />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function FilterFacet({ title, children, collapsible = false }) {
  const T = window.C_TOKENS;
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ borderBottom: `1px solid ${T.border}`, padding: "10px 14px 12px" }}>
      <div onClick={() => collapsible && setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 10.5, fontWeight: 700, color: T.textSubtle,
          letterSpacing: 0.6, textTransform: "uppercase",
          marginBottom: 6, cursor: collapsible ? "pointer" : "default",
        }}>
        <span style={{ flex: 1 }}>{title}</span>
        {collapsible && (open ? <I.chevronDown size={11} /> : <I.chevronRight size={11} />)}
      </div>
      {open && <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>{children}</div>}
    </div>
  );
}

function FacetItem({ checked, onClick, count, children }) {
  const T = window.C_TOKENS;
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "5px 6px", borderRadius: 4, cursor: "pointer",
      background: checked ? T.accentSoft : "transparent",
      color: checked ? T.accentText : T.text,
    }}
      onMouseEnter={(e) => { if (!checked) e.currentTarget.style.background = "#f6f6f4"; }}
      onMouseLeave={(e) => { if (!checked) e.currentTarget.style.background = "transparent"; }}>
      <span style={{
        width: 14, height: 14, borderRadius: 3, flexShrink: 0,
        border: `1.5px solid ${checked ? T.accent : T.borderStrong}`,
        background: checked ? T.accent : "#fff",
        display: "grid", placeItems: "center",
      }}>
        {checked && <I.check size={10} style={{ color: "#fff" }} />}
      </span>
      <span style={{
        flex: 1, fontSize: 12, display: "flex", alignItems: "center",
        minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {children}
      </span>
      {count != null && (
        <span style={{
          fontFamily: T.mono, fontSize: 10, color: T.textSubtle,
          fontVariantNumeric: "tabular-nums",
        }}>{count}</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function BrandCard({ brand, active, onClick }) {
  const T = window.C_TOKENS;
  const t = window.TYPOLOGIES[brand.typo];
  const ts = window.typoStyle(brand.typo);
  const logo = window.brandLogoStyle(brand);
  const initials = window.brandInitials(brand.name);
  const status = brand.status;

  return (
    <div onClick={onClick} style={{
      background: "#fff", border: `1px solid ${active ? T.accent : T.border}`,
      borderRadius: 8, overflow: "hidden", cursor: "pointer",
      boxShadow: active ? `0 0 0 3px ${T.accentSoft}` : "0 1px 2px oklch(0 0 0 / 0.03)",
      display: "flex", flexDirection: "column",
      transition: "border-color 0.15s, box-shadow 0.15s",
    }}>
      {/* Logo zone */}
      <div style={{
        height: 100, background: logo.bg, color: logo.fg,
        display: "grid", placeItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        {brand.conf?.logo === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: "oklch(0.5 0.05 80)",
          }}>
            <I.image size={26} style={{ opacity: 0.4 }} />
            <span style={{ fontSize: 9.5, letterSpacing: 0.5, fontWeight: 600, opacity: 0.7 }}>
              LOGO MANQUANT
            </span>
          </div>
        ) : (
          <span style={{
            fontSize: 38, fontWeight: 700, letterSpacing: 0.5,
            fontFamily: T.font,
          }}>{initials}</span>
        )}

        {/* Top-right typology */}
        <span style={{
          position: "absolute", top: 8, right: 8,
          display: "inline-flex", alignItems: "center", height: 18,
          padding: "0 6px", borderRadius: 3,
          background: "oklch(1 0 0 / 0.95)", color: ts.fg,
          border: `1px solid ${ts.border}`,
          fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4,
          fontFamily: T.mono,
        }}>{brand.typo}</span>

        {/* Status indicators */}
        {(status.missing > 0 || status.lowConf > 0) && (
          <div style={{
            position: "absolute", top: 8, left: 8,
            display: "flex", gap: 4,
          }}>
            {status.missing > 0 && (
              <span title={`${status.missing} champ(s) manquant(s)`} style={{
                display: "inline-flex", alignItems: "center", gap: 3, height: 18,
                padding: "0 6px", borderRadius: 3,
                background: "oklch(0.97 0.04 25)",
                color: "oklch(0.45 0.18 25)",
                border: "1px solid oklch(0.85 0.08 25)",
                fontSize: 10, fontWeight: 700,
                fontFamily: T.mono,
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: "oklch(0.55 0.2 25)",
                }} />
                {status.missing}
              </span>
            )}
            {status.lowConf > 0 && (
              <span title={`${status.lowConf} suggestion(s)`} style={{
                display: "inline-flex", alignItems: "center", gap: 3, height: 18,
                padding: "0 6px", borderRadius: 3,
                background: "oklch(0.97 0.05 75)",
                color: "oklch(0.4 0.13 65)",
                border: "1px solid oklch(0.85 0.1 75)",
                fontSize: 10, fontWeight: 700,
                fontFamily: T.mono,
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: "oklch(0.62 0.17 65)",
                }} />
                {status.lowConf}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{
          fontWeight: 600, fontSize: 13.5, color: T.text,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{brand.name}</div>
        <div style={{
          fontSize: 11.5, color: T.textMuted,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {brand.group ? brand.group : <span style={{ color: T.textSubtle, fontStyle: "italic" }}>Groupe non renseigné</span>}
        </div>

        {/* Bottom row: country flag + article count */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: 6, paddingTop: 8, borderTop: `1px solid ${T.border}`,
          fontSize: 11, color: T.textMuted, fontFamily: T.mono,
          fontVariantNumeric: "tabular-nums",
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            {brand.country ? (
              <>
                <span style={{ fontSize: 12 }}>{countryFlag(brand.country)}</span>
                <span>{brand.country}</span>
              </>
            ) : <span style={{ color: T.textSubtle, fontStyle: "italic" }}>—</span>}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <I.package size={11} style={{ color: T.textSubtle }} />
            <span style={{ fontWeight: 600, color: T.text }}>{brand.articleCount}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function BrandDrawer({ brand, onClose }) {
  const T = window.C_TOKENS;
  const t = window.TYPOLOGIES[brand.typo];
  const ts = window.typoStyle(brand.typo);
  const logo = window.brandLogoStyle(brand);
  const initials = window.brandInitials(brand.name);
  const conf = brand.conf || {};

  const fields = [
    { key: "typo", label: "Typologie", value: brand.typo ? `${brand.typo} · ${t?.label}` : null },
    { key: "group", label: "Groupe", value: brand.group },
    { key: "country", label: "Pays", value: brand.country ? `${countryFlag(brand.country)} ${countryName(brand.country)}` : null },
    { key: "category", label: "Catégorie", value: brand.category },
    { key: "website", label: "Site web", value: brand.website ? `https://${brand.website}` : null },
    { key: "founded", label: "Fondée en", value: brand.founded },
  ];

  return (
    <div style={{
      borderTop: `1px solid ${T.border}`, background: "#fff",
      maxHeight: "55%", overflow: "auto", flexShrink: 0,
      boxShadow: "0 -8px 20px oklch(0 0 0 / 0.04)",
    }}>
      <div style={{
        padding: "14px 22px 8px", display: "flex", alignItems: "flex-start", gap: 16,
        borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0,
        background: "#fff", zIndex: 1,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 8,
          background: logo.bg, color: logo.fg,
          display: "grid", placeItems: "center",
          fontWeight: 700, fontSize: 20,
          border: `1px solid oklch(0 0 0 / 0.08)`,
          flexShrink: 0,
        }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{brand.name}</h2>
            <span style={{
              display: "inline-flex", alignItems: "center", height: 20,
              padding: "0 7px", borderRadius: 3,
              background: ts.bg, color: ts.fg, border: `1px solid ${ts.border}`,
              fontSize: 10, fontWeight: 700, letterSpacing: 0.4, fontFamily: T.mono,
            }}>{brand.typo}</span>
          </div>
          <div style={{ fontSize: 11.5, color: T.textMuted }}>
            {brand.articleCount} articles · {brand.skuCount} SKU
            {(brand.sub && brand.sub.length) ? ` · ${brand.sub.length} sous-marque${brand.sub.length > 1 ? "s" : ""}` : ""}
          </div>
        </div>
        <button style={{
          padding: "6px 12px", background: T.accent, color: "#fff", border: "none",
          borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: "pointer",
          fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5,
        }}>
          <I.edit size={12} /> Éditer
        </button>
        <button onClick={onClose} style={{
          width: 28, height: 28, padding: 0, background: "transparent",
          border: `1px solid ${T.border}`, borderRadius: 4, cursor: "pointer",
          display: "grid", placeItems: "center", color: T.textMuted,
        }}>
          <I.x size={13} />
        </button>
      </div>

      <div style={{ padding: "12px 22px 18px" }}>
        {brand.desc && (
          <p style={{ margin: "0 0 12px", fontSize: 12.5, color: T.textMuted, lineHeight: 1.5 }}>
            {brand.desc}
          </p>
        )}

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 8,
        }}>
          {fields.map(f => {
            const c = conf[f.key];
            let bg = "#fff", border = T.border, fg = T.text, badge = null;
            if (c === 0 || f.value == null) {
              bg = "repeating-linear-gradient(45deg, #fcfdfe 0 5px, #f4f5f7 5px 6px)";
              fg = T.textSubtle;
              badge = { label: "manquant", color: "oklch(0.5 0.18 25)" };
            } else if (c >= 95) {
              bg = "oklch(0.98 0.02 155)"; border = "oklch(0.88 0.06 155)";
            } else if (c >= 80) {
              bg = "oklch(0.98 0.04 75)"; border = "oklch(0.85 0.1 75)";
              badge = { label: c + "%", color: "oklch(0.42 0.13 65)" };
            } else {
              bg = "oklch(0.98 0.03 25)"; border = "oklch(0.85 0.1 25)";
              badge = { label: c + "%", color: "oklch(0.45 0.18 25)" };
            }
            return (
              <div key={f.key} style={{
                background: bg, border: `1px solid ${border}`, borderRadius: 5,
                padding: "8px 11px", display: "flex", flexDirection: "column", gap: 3,
                position: "relative",
              }}>
                <div style={{
                  fontSize: 10, color: T.textSubtle, fontWeight: 600,
                  letterSpacing: 0.4, textTransform: "uppercase",
                }}>{f.label}</div>
                <div style={{
                  fontSize: 13, color: fg, fontWeight: 500,
                  fontStyle: !f.value ? "italic" : "normal",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{f.value || "non renseigné"}</div>
                {badge && (
                  <span style={{
                    position: "absolute", top: 7, right: 9,
                    fontSize: 9.5, fontWeight: 700, color: badge.color,
                    fontFamily: T.mono, letterSpacing: 0.3,
                  }}>{badge.label}</span>
                )}
              </div>
            );
          })}
        </div>

        {brand.sub && brand.sub.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{
              fontSize: 10.5, color: T.textSubtle, fontWeight: 700,
              letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6,
            }}>Sous-marques</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {brand.sub.map(s => (
                <span key={s} style={{
                  padding: "4px 10px", background: "#f4f5f7",
                  border: `1px solid ${T.border}`, borderRadius: 4,
                  fontSize: 12, color: T.text,
                }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.BrandsV2 = BrandsV2;
