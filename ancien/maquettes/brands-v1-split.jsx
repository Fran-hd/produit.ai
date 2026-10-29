// V1 — Split list (gauche) + panneau détail (droite)
// Style D6 mais aéré : lignes 56px, plus de padding, logos 40×40.
// Le panneau de droite est éditable inline avec confiance IA et chips Y/N.

function BrandsV1() {
  const T = window.C_TOKENS;
  const BRANDS = window.BRANDS;
  const TYPOLOGIES = window.TYPOLOGIES;
  const GROUPS = window.GROUPS;

  const [activeId, setActiveId] = React.useState(BRANDS[0].id);
  const [search, setSearch] = React.useState("");
  const [filterTypo, setFilterTypo] = React.useState("all");
  const [edits, setEdits] = React.useState({});
  const [decisions, setDecisions] = React.useState({}); // { [brandId]: { [field]: 'y'|'n' } }

  const list = React.useMemo(() => {
    let out = BRANDS.map(b => ({ ...b, ...(edits[b.id] || {}) }));
    if (filterTypo !== "all") out = out.filter(b => b.typo === filterTypo);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(b =>
        b.name.toLowerCase().includes(q) ||
        (b.group || "").toLowerCase().includes(q) ||
        (b.aka || []).some(a => a.toLowerCase().includes(q))
      );
    }
    return out.sort((a, b) => a.name.localeCompare(b.name));
  }, [search, filterTypo, edits]);

  const active = React.useMemo(
    () => list.find(b => b.id === activeId) || list[0],
    [list, activeId]
  );

  const setField = (id, key, val) => {
    setEdits(e => ({ ...e, [id]: { ...(e[id] || {}), [key]: val === "" ? null : val } }));
  };
  const setDecision = (id, field, val) => {
    setDecisions(d => {
      const row = { ...(d[id] || {}) };
      if (val == null) delete row[field];
      else row[field] = val;
      return { ...d, [id]: row };
    });
  };

  const counts = React.useMemo(() => {
    const c = { all: BRANDS.length };
    Object.keys(TYPOLOGIES).forEach(k => { c[k] = BRANDS.filter(b => b.typo === k).length; });
    return c;
  }, []);

  // Stats — overall AI completion
  const stats = React.useMemo(() => {
    const total = BRANDS.length;
    const fields = ["typo", "group", "country", "website", "founded", "category", "logo"];
    let filled = 0, missing = 0;
    BRANDS.forEach(b => {
      fields.forEach(f => {
        const v = f === "logo" ? !!b.palette : b[f];
        if (v != null && v !== "") filled++; else missing++;
      });
    });
    return { total, filled, missing, pct: Math.round(filled / (filled + missing) * 100) };
  }, []);

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
          <span style={{ color: T.textSubtle }}>/</span>
          <span style={{ color: T.textMuted }}>Référentiel</span>
          <span style={{ color: T.textSubtle }}>›</span>
          <span style={{ fontWeight: 500 }}>Marques</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: T.textMuted, fontFamily: T.mono }}>
          {stats.total} marques · {stats.pct}% de complétude
        </span>
        <button style={{
          padding: "5px 12px", background: "#fff", border: `1px solid ${T.border}`,
          borderRadius: 4, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", gap: 5,
        }}>
          <I.download size={12} /> Export
        </button>
        <button style={{
          padding: "5px 12px", background: T.accent, color: "#fff", border: "none",
          borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: "pointer",
          fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5,
        }}>
          <I.plus size={12} /> Nouvelle marque
        </button>
      </div>

      {/* ─── Filter row ──────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, padding: "10px 18px",
        background: "#fff", borderBottom: `1px solid ${T.border}`, flexShrink: 0,
      }}>
        <div style={{
          position: "relative", display: "flex", alignItems: "center",
          background: "#f4f5f7", border: `1px solid ${T.border}`,
          borderRadius: 5, padding: "0 10px", height: 28, width: 280,
        }}>
          <I.search size={13} style={{ color: T.textSubtle }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une marque, un groupe…"
            style={{
              flex: 1, marginLeft: 8, height: 26, padding: 0, border: "none",
              background: "transparent", fontSize: 12, fontFamily: "inherit",
              color: T.text, outline: "none",
            }} />
        </div>

        <div style={{ display: "flex", gap: 3, marginLeft: 4 }}>
          <FilterPill label="Toutes" count={counts.all} active={filterTypo === "all"}
            onClick={() => setFilterTypo("all")} />
          {Object.values(TYPOLOGIES).map(t => (
            <FilterPill key={t.code} label={t.code} sublabel={t.short}
              count={counts[t.code]} active={filterTypo === t.code}
              hue={t.hue}
              onClick={() => setFilterTypo(t.code)} />
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <button style={{
          padding: "4px 10px", background: "#fff", border: `1px solid ${T.border}`,
          borderRadius: 4, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", gap: 5, color: T.accentText,
        }}>
          <I.sparkle size={11} /> Enrichir tout (IA)
        </button>
      </div>

      {/* ─── Split: list + panel ─────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* List */}
        <div style={{
          width: 480, background: "#fff", borderRight: `1px solid ${T.border}`,
          overflow: "auto", flexShrink: 0,
        }}>
          {list.map(b => (
            <BrandRow key={b.id} brand={b} active={b.id === activeId}
              onClick={() => setActiveId(b.id)} />
          ))}
          {list.length === 0 && (
            <div style={{
              padding: "60px 20px", textAlign: "center", color: T.textSubtle,
              fontSize: 12, fontStyle: "italic",
            }}>
              Aucune marque ne correspond à votre recherche.
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div style={{ flex: 1, overflow: "auto", background: "#f6f6f4" }}>
          {active && <BrandDetail brand={active} setField={setField}
            decisions={decisions[active.id] || {}}
            onDecision={(field, val) => setDecision(active.id, field, val)} />}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Filter pill
// ─────────────────────────────────────────────────────────────
function FilterPill({ label, sublabel, count, active, hue, onClick }) {
  const T = window.C_TOKENS;
  const dotColor = hue != null ? `oklch(0.55 0.14 ${hue})` : T.textSubtle;
  return (
    <button onClick={onClick} title={sublabel}
      style={{
        padding: "4px 10px",
        background: active ? T.accentSoft : "transparent",
        color: active ? T.accentText : T.text,
        border: active ? `1px solid ${T.accent}` : `1px solid transparent`,
        borderRadius: 4, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
        fontWeight: active ? 600 : 500,
        display: "inline-flex", alignItems: "center", gap: 6, height: 26,
      }}>
      {hue != null && (
        <span style={{
          width: 6, height: 6, borderRadius: "50%", background: dotColor,
        }} />
      )}
      <span>{label}</span>
      <span style={{
        fontFamily: T.mono, fontVariantNumeric: "tabular-nums",
        fontSize: 10, color: active ? T.accentText : T.textSubtle,
        fontWeight: 500, opacity: 0.8,
      }}>{count}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// BrandRow — line in the left list
// ─────────────────────────────────────────────────────────────
function BrandRow({ brand, active, onClick }) {
  const T = window.C_TOKENS;
  const t = window.TYPOLOGIES[brand.typo] || {};
  const ts = window.typoStyle(brand.typo);
  const logo = window.brandLogoStyle(brand);
  const initials = window.brandInitials(brand.name);

  // Confidence summary — count fields with conf < 80 (need attention)
  const lowFields = Object.values(brand.conf || {}).filter(c => c > 0 && c < 80).length;
  const missing = Object.values(brand.conf || {}).filter(c => c === 0).length;

  return (
    <div onClick={onClick} style={{
      padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
      background: active ? T.accentSoft : "transparent",
      borderLeft: `3px solid ${active ? T.accent : "transparent"}`,
      borderBottom: `1px solid ${T.border}`,
      cursor: "pointer", height: 64,
    }}>
      {/* Logo */}
      <div style={{
        width: 40, height: 40, borderRadius: 6,
        background: logo.bg, color: logo.fg,
        display: "grid", placeItems: "center",
        fontWeight: 700, fontSize: 13, letterSpacing: 0.3,
        border: `1px solid oklch(0 0 0 / 0.08)`,
        flexShrink: 0, position: "relative",
      }}>
        {initials}
        {brand.conf?.logo === 0 && (
          <span style={{
            position: "absolute", top: -3, right: -3,
            width: 10, height: 10, borderRadius: "50%",
            background: "oklch(0.62 0.17 65)",
            border: "1.5px solid #fff",
          }} title="Logo manquant" />
        )}
      </div>

      {/* Name + sub */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, marginBottom: 2,
        }}>
          <span style={{
            fontWeight: 600, fontSize: 13.5,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{brand.name}</span>
          <span style={{
            display: "inline-flex", alignItems: "center", height: 16,
            padding: "0 5px", borderRadius: 3,
            background: ts.bg, color: ts.fg,
            border: `1px solid ${ts.border}`,
            fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4,
            fontFamily: T.mono, flexShrink: 0,
          }}>{brand.typo}</span>
        </div>
        <div style={{
          fontSize: 11.5, color: T.textMuted,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {brand.group || <span style={{ color: T.textSubtle, fontStyle: "italic" }}>Groupe non renseigné</span>}
          <span style={{ margin: "0 6px", color: T.textSubtle }}>·</span>
          <span style={{ fontFamily: T.mono, fontSize: 10.5 }}>{brand.country || "??"}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "flex-end",
        gap: 3, flexShrink: 0,
      }}>
        <span style={{
          fontFamily: T.mono, fontSize: 11, fontWeight: 600,
          fontVariantNumeric: "tabular-nums", color: T.text,
        }}>{brand.articleCount}</span>
        <span style={{
          fontSize: 9.5, color: T.textSubtle, letterSpacing: 0.3,
          textTransform: "uppercase", fontWeight: 600,
        }}>articles</span>
      </div>

      {/* IA status */}
      {(lowFields > 0 || missing > 0) && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "flex-end",
          gap: 2, flexShrink: 0, minWidth: 32,
        }}>
          {missing > 0 && (
            <span title={`${missing} champ(s) à renseigner`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                fontSize: 10, color: "oklch(0.5 0.18 25)", fontWeight: 600,
                fontFamily: T.mono,
              }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "oklch(0.55 0.2 25)",
              }} />
              {missing}
            </span>
          )}
          {lowFields > 0 && (
            <span title={`${lowFields} suggestion(s) à valider`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                fontSize: 10, color: "oklch(0.45 0.16 65)", fontWeight: 600,
                fontFamily: T.mono,
              }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "oklch(0.62 0.17 65)",
              }} />
              {lowFields}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BrandDetail — right panel
// ─────────────────────────────────────────────────────────────
function BrandDetail({ brand, setField, decisions, onDecision }) {
  const T = window.C_TOKENS;
  const t = window.TYPOLOGIES[brand.typo] || {};
  const ts = window.typoStyle(brand.typo);
  const logo = window.brandLogoStyle(brand);
  const initials = window.brandInitials(brand.name);

  return (
    <div style={{ padding: 24, maxWidth: 760 }}>

      {/* Hero card */}
      <div style={{
        background: "#fff", border: `1px solid ${T.border}`,
        borderRadius: 8, padding: 20, marginBottom: 16,
        display: "flex", gap: 18, alignItems: "flex-start",
      }}>
        {/* Big logo */}
        <div style={{ flexShrink: 0, position: "relative" }}>
          <div style={{
            width: 88, height: 88, borderRadius: 10,
            background: logo.bg, color: logo.fg,
            display: "grid", placeItems: "center",
            fontWeight: 700, fontSize: 30, letterSpacing: 0.5,
            border: `1px solid oklch(0 0 0 / 0.08)`,
          }}>
            {initials}
          </div>
          <button title={brand.conf?.logo === 0 ? "Téléverser un logo" : "Modifier le logo"}
            style={{
              position: "absolute", bottom: -6, right: -6,
              width: 28, height: 28, borderRadius: "50%",
              background: "#fff", color: T.text,
              border: `1px solid ${T.border}`,
              display: "grid", placeItems: "center",
              cursor: "pointer", boxShadow: "0 2px 4px oklch(0 0 0 / 0.08)",
            }}>
            <I.upload size={12} />
          </button>
        </div>

        {/* Header */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap",
          }}>
            <h1 style={{
              margin: 0, fontSize: 22, fontWeight: 700, color: T.text,
            }}>{brand.name}</h1>
            <span style={{
              display: "inline-flex", alignItems: "center", height: 22,
              padding: "0 8px", borderRadius: 4,
              background: ts.bg, color: ts.fg,
              border: `1px solid ${ts.border}`,
              fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
              fontFamily: T.mono,
            }}>
              {brand.typo} · {t.short}
            </span>
          </div>
          {brand.aka && brand.aka.length > 0 && (
            <div style={{
              fontSize: 11, color: T.textSubtle, marginBottom: 8,
              fontFamily: T.mono,
            }}>
              alias : {brand.aka.join(", ")}
            </div>
          )}
          {brand.desc ? (
            <p style={{
              margin: "8px 0 0", fontSize: 13, color: T.textMuted,
              lineHeight: 1.5,
            }}>{brand.desc}</p>
          ) : (
            <p style={{
              margin: "8px 0 0", fontSize: 12, fontStyle: "italic",
              color: T.textSubtle,
            }}>Aucune description renseignée.</p>
          )}

          {/* Counters */}
          <div style={{
            display: "flex", gap: 18, marginTop: 14,
            paddingTop: 12, borderTop: `1px solid ${T.border}`,
          }}>
            <Counter label="Articles" value={brand.articleCount} />
            <Counter label="SKU" value={brand.skuCount} />
            <Counter label="Sous-marques" value={(brand.sub || []).length} />
          </div>
        </div>
      </div>

      {/* AI banner if there are low-confidence fields */}
      <AIBanner brand={brand} />

      {/* Section: Identité */}
      <Section title="Identité de la marque" icon="tag">
        <Field label="Typologie" required>
          <TypologyPicker value={brand.typo}
            conf={brand.conf?.typo}
            decision={decisions.typo}
            onChange={v => setField(brand.id, "typo", v)}
            onDecision={v => onDecision("typo", v)} />
        </Field>
        <Field label="Groupe Actionnaire" required>
          <GroupPicker value={brand.group}
            conf={brand.conf?.group}
            decision={decisions.group}
            onChange={v => setField(brand.id, "group", v)}
            onDecision={v => onDecision("group", v)} />
        </Field>
        <Field label="Pays d'origine">
          <CountryPicker value={brand.country}
            conf={brand.conf?.country}
            decision={decisions.country}
            onChange={v => setField(brand.id, "country", v)}
            onDecision={v => onDecision("country", v)} />
        </Field>
        <Field label="Catégorie principale">
          <TextEdit value={brand.category}
            conf={brand.conf?.category}
            decision={decisions.category}
            onChange={v => setField(brand.id, "category", v)}
            onDecision={v => onDecision("category", v)} />
        </Field>
      </Section>

      {/* Section: Métadonnées */}
      <Section title="Informations complémentaires" icon="info">
        <Field label="Site web">
          <TextEdit value={brand.website}
            conf={brand.conf?.website}
            decision={decisions.website}
            onChange={v => setField(brand.id, "website", v)}
            onDecision={v => onDecision("website", v)}
            mono prefix="https://" />
        </Field>
        <Field label="Année de création">
          <TextEdit value={brand.founded}
            conf={brand.conf?.founded}
            decision={decisions.founded}
            onChange={v => setField(brand.id, "founded", v)}
            onDecision={v => onDecision("founded", v)}
            mono short />
        </Field>
      </Section>

      {/* Section: Sous-marques */}
      <Section title="Sous-marques rattachées" icon="folder"
        action={<button style={{
          padding: "3px 8px", background: "#fff", border: `1px solid ${T.border}`,
          borderRadius: 3, fontSize: 11, cursor: "pointer", fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", gap: 4, color: T.textMuted,
        }}><I.plus size={10} /> Ajouter</button>}>
        {(brand.sub || []).length === 0 ? (
          <div style={{
            padding: "12px 14px", fontSize: 12, fontStyle: "italic",
            color: T.textSubtle, background: "#fbfcfd",
            border: `1px dashed ${T.border}`, borderRadius: 4,
          }}>Aucune sous-marque rattachée.</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {brand.sub.map(s => (
              <span key={s} style={{
                padding: "4px 10px", background: "#fff",
                border: `1px solid ${T.border}`, borderRadius: 4,
                fontSize: 12, color: T.text,
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                <I.tag size={10} style={{ color: T.textSubtle }} />
                {s}
              </span>
            ))}
          </div>
        )}
      </Section>

      {/* Footer actions */}
      <div style={{
        display: "flex", justifyContent: "flex-end", gap: 8,
        marginTop: 8, paddingTop: 16,
      }}>
        <button style={{
          padding: "6px 14px", background: "#fff",
          border: `1px solid ${T.border}`, borderRadius: 4,
          fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          color: "oklch(0.5 0.18 25)",
          display: "inline-flex", alignItems: "center", gap: 5,
        }}>
          <I.trash size={12} /> Archiver
        </button>
        <button style={{
          padding: "6px 14px", background: "#fff",
          border: `1px solid ${T.border}`, borderRadius: 4,
          fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", gap: 5,
        }}>
          <I.history size={12} /> Historique
        </button>
        <button style={{
          padding: "6px 14px", background: T.accent, color: "#fff",
          border: "none", borderRadius: 4,
          fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", gap: 5,
        }}>
          <I.check size={12} /> Enregistrer
        </button>
      </div>
    </div>
  );
}

function Counter({ label, value }) {
  const T = window.C_TOKENS;
  return (
    <div>
      <div style={{
        fontSize: 18, fontWeight: 700, color: T.text,
        fontFamily: T.mono, fontVariantNumeric: "tabular-nums",
        lineHeight: 1.1,
      }}>{value}</div>
      <div style={{
        fontSize: 10, color: T.textSubtle, letterSpacing: 0.4,
        textTransform: "uppercase", fontWeight: 600, marginTop: 2,
      }}>{label}</div>
    </div>
  );
}

function AIBanner({ brand }) {
  const T = window.C_TOKENS;
  const lowFields = Object.entries(brand.conf || {}).filter(([k, c]) => c > 0 && c < 80);
  const missing = Object.entries(brand.conf || {}).filter(([k, c]) => c === 0);
  if (lowFields.length === 0 && missing.length === 0) return null;

  return (
    <div style={{
      background: "linear-gradient(180deg, oklch(0.97 0.04 250) 0%, #fff 100%)",
      border: `1px solid oklch(0.85 0.06 250)`,
      borderRadius: 6, padding: "12px 14px", marginBottom: 16,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        background: T.accentSoft, color: T.accent,
        display: "grid", placeItems: "center",
      }}>
        <I.sparkle size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>
          {missing.length > 0 && <>L'IA n'a pas trouvé {missing.length} champ{missing.length > 1 ? "s" : ""}</>}
          {missing.length > 0 && lowFields.length > 0 && " · "}
          {lowFields.length > 0 && <>{lowFields.length} suggestion{lowFields.length > 1 ? "s" : ""} à valider</>}
        </div>
        <div style={{ fontSize: 11.5, color: T.textMuted, marginTop: 2 }}>
          Cliquez sur ✓ pour accepter une suggestion ou modifiez la valeur directement.
        </div>
      </div>
      <button style={{
        padding: "5px 11px", background: "#fff",
        border: `1px solid ${T.accent}`, color: T.accentText,
        borderRadius: 4, fontSize: 11.5, fontWeight: 500, cursor: "pointer",
        fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5,
      }}>
        <I.refresh size={11} /> Relancer la recherche
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Generic section + field
// ─────────────────────────────────────────────────────────────
function Section({ title, icon, action, children }) {
  const T = window.C_TOKENS;
  const Ico = I[icon];
  return (
    <div style={{
      background: "#fff", border: `1px solid ${T.border}`,
      borderRadius: 6, padding: 16, marginBottom: 12,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
        paddingBottom: 10, borderBottom: `1px solid ${T.border}`,
      }}>
        {Ico && <Ico size={14} style={{ color: T.textMuted, flexShrink: 0 }} />}
        <span style={{
          fontSize: 12, fontWeight: 700, color: T.text,
          letterSpacing: 0.3, textTransform: "uppercase",
        }}>{title}</span>
        <div style={{ flex: 1 }} />
        {action}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  const T = window.C_TOKENS;
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "160px 1fr",
      gap: 12, alignItems: "center",
    }}>
      <label style={{
        fontSize: 12, color: T.textMuted, fontWeight: 500,
      }}>
        {label}
        {required && <span style={{ color: "oklch(0.55 0.2 25)", marginLeft: 3 }}>*</span>}
      </label>
      <div>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Field controls — share common confidence/decision UI
// ─────────────────────────────────────────────────────────────
function FieldShell({ value, conf, decision, onDecision, children, onClick, mono }) {
  const T = window.C_TOKENS;
  const [hover, setHover] = React.useState(false);
  const isValidated = decision === "y";
  const isRejected = decision === "n";
  const empty = value == null || value === "";

  // Determine bg by conf
  let bg, border, fg;
  if (isValidated) {
    bg = "oklch(0.97 0.05 155)"; border = "oklch(0.78 0.1 155)"; fg = "oklch(0.32 0.12 155)";
  } else if (isRejected) {
    bg = "oklch(0.97 0.01 25)"; border = "oklch(0.85 0.04 25)"; fg = "oklch(0.55 0.05 25)";
  } else if (empty) {
    bg = "repeating-linear-gradient(45deg, transparent 0 5px, oklch(0.95 0.02 80) 5px 6px)";
    border = T.border; fg = T.textSubtle;
  } else if (conf == null || conf >= 95) {
    bg = "oklch(0.98 0.02 155)"; border = "oklch(0.88 0.06 155)"; fg = T.text;
  } else if (conf >= 80) {
    bg = "oklch(0.98 0.04 75)"; border = "oklch(0.85 0.1 75)"; fg = "oklch(0.38 0.13 65)";
  } else {
    bg = "oklch(0.98 0.03 25)"; border = "oklch(0.85 0.1 25)"; fg = "oklch(0.4 0.18 25)";
  }

  const showActions = (hover || isValidated || isRejected) && conf != null && conf < 95 && conf > 0;

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 4,
        background: bg, border: `1px solid ${border}`, borderRadius: 4,
        height: 32, padding: "0 4px 0 10px",
        position: "relative", overflow: "hidden",
      }}>
      <div onClick={onClick} style={{
        flex: 1, display: "flex", alignItems: "center", gap: 6,
        fontSize: 13, color: fg,
        fontFamily: mono ? T.mono : "inherit",
        textDecoration: isRejected ? "line-through" : "none",
        cursor: onClick ? "text" : "default",
        minWidth: 0,
      }}>
        {children}
      </div>

      {/* Conf badge */}
      {conf != null && conf > 0 && conf < 95 && !isValidated && !isRejected && (
        <span style={{
          fontFamily: T.mono, fontSize: 10, fontWeight: 700,
          color: fg, fontVariantNumeric: "tabular-nums",
          flexShrink: 0, opacity: 0.85, paddingRight: 4,
        }}>
          {conf}
        </span>
      )}
      {conf === 0 && (
        <span style={{
          fontFamily: T.mono, fontSize: 9, fontWeight: 700,
          color: fg, letterSpacing: 0.5, flexShrink: 0, paddingRight: 4,
        }}>
          —
        </span>
      )}
      {conf >= 95 && !isValidated && !isRejected && (
        <I.check size={12} style={{
          color: "oklch(0.55 0.16 155)", flexShrink: 0, opacity: 0.6, marginRight: 4,
        }} />
      )}

      {/* Y/N actions for low-conf or already decided */}
      {(showActions || decision) && (
        <div style={{
          display: "inline-flex", gap: 3, flexShrink: 0,
          paddingLeft: 4, borderLeft: `1px solid ${border}`,
        }}>
          {!isValidated && (
            <button onClick={(e) => { e.stopPropagation(); onDecision("y"); }}
              title="Valider"
              style={{
                width: 22, height: 22, padding: 0, background: "#fff",
                color: "oklch(0.45 0.16 155)",
                border: `1px solid oklch(0.7 0.12 155)`, borderRadius: 3,
                cursor: "pointer", display: "grid", placeItems: "center",
              }}>
              <I.check size={12} />
            </button>
          )}
          {!isRejected && (
            <button onClick={(e) => { e.stopPropagation(); onDecision("n"); }}
              title="Rejeter"
              style={{
                width: 22, height: 22, padding: 0, background: "#fff",
                color: "oklch(0.5 0.18 25)",
                border: `1px solid oklch(0.7 0.13 25)`, borderRadius: 3,
                cursor: "pointer", display: "grid", placeItems: "center",
              }}>
              <I.x size={12} />
            </button>
          )}
          {decision && (
            <button onClick={(e) => { e.stopPropagation(); onDecision(null); }}
              title="Annuler"
              style={{
                width: 22, height: 22, padding: 0, background: "#fff",
                color: T.textMuted,
                border: `1px solid ${T.border}`, borderRadius: 3,
                cursor: "pointer", display: "grid", placeItems: "center", fontSize: 13,
              }}>↺</button>
          )}
        </div>
      )}
    </div>
  );
}

function TextEdit({ value, conf, decision, onChange, onDecision, mono, prefix, short }) {
  const T = window.C_TOKENS;
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value || "");
  React.useEffect(() => { setDraft(value || ""); }, [value]);

  if (editing) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
          onBlur={() => { onChange(draft); setEditing(false); }}
          onKeyDown={e => {
            if (e.key === "Enter") { onChange(draft); setEditing(false); }
            else if (e.key === "Escape") { setDraft(value || ""); setEditing(false); }
          }}
          style={{
            width: short ? 100 : "100%", height: 32, padding: "0 10px",
            border: `1px solid ${T.accent}`, borderRadius: 4,
            background: "#fff", fontSize: 13, fontFamily: mono ? T.mono : "inherit",
            color: T.text, outline: "none",
            boxShadow: `0 0 0 3px ${T.accentSoft}`,
          }} />
      </div>
    );
  }
  return (
    <FieldShell value={value} conf={conf} decision={decision}
      onDecision={onDecision} mono={mono}
      onClick={() => setEditing(true)}>
      {prefix && value && (
        <span style={{ color: T.textSubtle, fontFamily: T.mono, fontSize: 11.5 }}>{prefix}</span>
      )}
      <span style={{
        flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        fontStyle: !value ? "italic" : "normal",
        color: !value ? T.textSubtle : "inherit",
      }}>
        {value || "non détecté — cliquer pour saisir"}
      </span>
    </FieldShell>
  );
}

function TypologyPicker({ value, conf, decision, onChange, onDecision }) {
  const T = window.C_TOKENS;
  const TYPOLOGIES = window.TYPOLOGIES;
  const [open, setOpen] = React.useState(false);
  const t = TYPOLOGIES[value];
  const ts = window.typoStyle(value);

  return (
    <div style={{ position: "relative" }}>
      <FieldShell value={value} conf={conf} decision={decision}
        onDecision={onDecision} onClick={() => setOpen(o => !o)}>
        {t ? (
          <>
            <span style={{
              display: "inline-flex", alignItems: "center", height: 18,
              padding: "0 6px", borderRadius: 3,
              background: ts.bg, color: ts.fg,
              border: `1px solid ${ts.border}`,
              fontSize: 10, fontWeight: 700, letterSpacing: 0.4,
              fontFamily: T.mono, flexShrink: 0,
            }}>{value}</span>
            <span style={{ color: T.text }}>{t.label}</span>
            <I.chevronDown size={12} style={{ color: T.textSubtle, marginLeft: "auto" }} />
          </>
        ) : (
          <span style={{ flex: 1, color: T.textSubtle, fontStyle: "italic" }}>
            non détecté — choisir une typologie
          </span>
        )}
      </FieldShell>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{
            position: "fixed", inset: 0, zIndex: 49,
          }} />
          <div style={{
            position: "absolute", top: 36, left: 0, right: 0, zIndex: 50,
            background: "#fff", border: `1px solid ${T.border}`, borderRadius: 5,
            boxShadow: "0 6px 20px oklch(0 0 0 / 0.12)",
            overflow: "hidden",
          }}>
            {Object.values(TYPOLOGIES).map(opt => {
              const optS = window.typoStyle(opt.code);
              return (
                <div key={opt.code} onClick={() => { onChange(opt.code); setOpen(false); }}
                  style={{
                    padding: "10px 12px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 10,
                    background: opt.code === value ? T.accentSoft : "transparent",
                    borderBottom: `1px solid ${T.border}`,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = opt.code === value ? T.accentSoft : "#f6f6f4"}
                  onMouseLeave={(e) => e.currentTarget.style.background = opt.code === value ? T.accentSoft : "transparent"}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    minWidth: 38, height: 22, padding: "0 6px", borderRadius: 3,
                    background: optS.bg, color: optS.fg,
                    border: `1px solid ${optS.border}`,
                    fontSize: 10, fontWeight: 700, letterSpacing: 0.4,
                    fontFamily: T.mono,
                  }}>{opt.code}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>{opt.desc}</div>
                  </div>
                  {opt.code === value && <I.check size={13} style={{ color: T.accent }} />}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function GroupPicker({ value, conf, decision, onChange, onDecision }) {
  const T = window.C_TOKENS;
  const GROUPS = window.GROUPS;
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.filter(g => g.toLowerCase().includes(q));
  }, [query]);

  return (
    <div style={{ position: "relative" }}>
      <FieldShell value={value} conf={conf} decision={decision}
        onDecision={onDecision} onClick={() => setOpen(o => !o)}>
        <span style={{
          flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          fontStyle: !value ? "italic" : "normal",
          color: !value ? T.textSubtle : "inherit",
        }}>{value || "non détecté — choisir un groupe"}</span>
        <I.chevronDown size={12} style={{ color: T.textSubtle }} />
      </FieldShell>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{
            position: "fixed", inset: 0, zIndex: 49,
          }} />
          <div style={{
            position: "absolute", top: 36, left: 0, right: 0, zIndex: 50,
            background: "#fff", border: `1px solid ${T.border}`, borderRadius: 5,
            boxShadow: "0 6px 20px oklch(0 0 0 / 0.12)",
            overflow: "hidden",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "0 10px",
              borderBottom: `1px solid ${T.border}`,
            }}>
              <I.search size={11} style={{ color: T.textSubtle }} />
              <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher ou saisir un groupe…"
                style={{
                  flex: 1, height: 32, border: "none", background: "transparent",
                  fontSize: 12, fontFamily: "inherit", color: T.text, outline: "none",
                }} />
            </div>
            <div style={{ maxHeight: 220, overflowY: "auto" }}>
              {query.trim() && !filtered.includes(query.trim()) && (
                <div onClick={() => { onChange(query.trim()); setOpen(false); }}
                  style={{
                    padding: "8px 12px", cursor: "pointer",
                    background: T.accentSoft, color: T.accentText,
                    fontSize: 12, display: "flex", alignItems: "center", gap: 6,
                    borderBottom: `1px solid ${T.border}`,
                  }}>
                  <I.plus size={11} />
                  Ajouter "<strong>{query.trim()}</strong>"
                </div>
              )}
              {filtered.map(g => (
                <div key={g} onClick={() => { onChange(g); setOpen(false); }}
                  style={{
                    padding: "7px 12px", cursor: "pointer", fontSize: 12,
                    background: g === value ? T.accentSoft : "transparent",
                    color: T.text, fontWeight: g === value ? 600 : 400,
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = g === value ? T.accentSoft : "#f6f6f4"}
                  onMouseLeave={(e) => e.currentTarget.style.background = g === value ? T.accentSoft : "transparent"}>
                  <span style={{ flex: 1 }}>{g}</span>
                  {g === value && <I.check size={12} style={{ color: T.accent }} />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CountryPicker({ value, conf, decision, onChange, onDecision }) {
  const T = window.C_TOKENS;
  const COUNTRIES = window.COUNTRIES;
  const [open, setOpen] = React.useState(false);
  const flag = value ? countryFlag(value) : "";

  return (
    <div style={{ position: "relative" }}>
      <FieldShell value={value} conf={conf} decision={decision}
        onDecision={onDecision} onClick={() => setOpen(o => !o)}>
        {value ? (
          <>
            <span style={{ fontSize: 16 }}>{flag}</span>
            <span style={{ fontFamily: T.mono, fontWeight: 600 }}>{value}</span>
            <span style={{ color: T.textMuted }}>· {countryName(value)}</span>
            <I.chevronDown size={12} style={{ color: T.textSubtle, marginLeft: "auto" }} />
          </>
        ) : (
          <span style={{ flex: 1, color: T.textSubtle, fontStyle: "italic" }}>
            non détecté — choisir un pays
          </span>
        )}
      </FieldShell>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{
            position: "fixed", inset: 0, zIndex: 49,
          }} />
          <div style={{
            position: "absolute", top: 36, left: 0, zIndex: 50,
            background: "#fff", border: `1px solid ${T.border}`, borderRadius: 5,
            boxShadow: "0 6px 20px oklch(0 0 0 / 0.12)",
            overflow: "hidden", display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)", minWidth: 360,
          }}>
            {COUNTRIES.map(c => (
              <div key={c} onClick={() => { onChange(c); setOpen(false); }}
                style={{
                  padding: "8px 10px", cursor: "pointer",
                  background: c === value ? T.accentSoft : "transparent",
                  display: "flex", alignItems: "center", gap: 6, fontSize: 12,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = c === value ? T.accentSoft : "#f6f6f4"}
                onMouseLeave={(e) => e.currentTarget.style.background = c === value ? T.accentSoft : "transparent"}>
                <span style={{ fontSize: 14 }}>{countryFlag(c)}</span>
                <span style={{ fontFamily: T.mono, fontWeight: 600 }}>{c}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function countryFlag(c) {
  const flags = {
    FR: "🇫🇷", IT: "🇮🇹", DE: "🇩🇪", ES: "🇪🇸", PT: "🇵🇹",
    NL: "🇳🇱", BE: "🇧🇪", UK: "🇬🇧", CH: "🇨🇭", USA: "🇺🇸",
    JP: "🇯🇵", NZ: "🇳🇿", MX: "🇲🇽",
  };
  return flags[c] || "🌐";
}
function countryName(c) {
  const names = {
    FR: "France", IT: "Italie", DE: "Allemagne", ES: "Espagne", PT: "Portugal",
    NL: "Pays-Bas", BE: "Belgique", UK: "Royaume-Uni", CH: "Suisse", USA: "États-Unis",
    JP: "Japon", NZ: "Nouvelle-Zélande", MX: "Mexique",
  };
  return names[c] || c;
}

window.BrandsV1 = BrandsV1;
