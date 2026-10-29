// V3 — Tableau enrichi full-width avec actions en masse
// Pour les power users : tri, sélection multi, édition inline,
// bulk validation IA, export. Densité haute style D6 mais avec logos visibles.

function BrandsV3() {
  const T = window.C_TOKENS;
  const BRANDS = window.BRANDS;
  const TYPOLOGIES = window.TYPOLOGIES;

  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState(new Set());
  const [sortKey, setSortKey] = React.useState("name");
  const [sortDir, setSortDir] = React.useState("asc");
  const [edits, setEdits] = React.useState({});
  const [decisions, setDecisions] = React.useState({});
  const [editingCell, setEditingCell] = React.useState(null); // {id, field}

  const setField = (id, key, val) => {
    setEdits(e => ({ ...e, [id]: { ...(e[id] || {}), [key]: val === "" ? null : val } }));
  };

  const toggleSel = (id) => {
    setSelected(s => {
      const ns = new Set(s);
      if (ns.has(id)) ns.delete(id); else ns.add(id);
      return ns;
    });
  };

  const list = React.useMemo(() => {
    let out = BRANDS.map(b => ({ ...b, ...(edits[b.id] || {}) }));
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(b =>
        b.name.toLowerCase().includes(q) ||
        (b.group || "").toLowerCase().includes(q));
    }
    out.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === "articleCount" || sortKey === "skuCount" || sortKey === "founded") {
        av = av || 0; bv = bv || 0;
        return sortDir === "asc" ? av - bv : bv - av;
      }
      av = (av || "").toString().toLowerCase();
      bv = (bv || "").toString().toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return out;
  }, [search, sortKey, sortDir, edits]);

  const allSelected = list.length > 0 && list.every(b => selected.has(b.id));

  // Bulk action: accept all suggestions for selected rows
  const bulkAcceptAll = () => {
    setDecisions(d => {
      const nd = { ...d };
      selected.forEach(id => {
        const b = BRANDS.find(x => x.id === id);
        if (!b) return;
        const row = { ...(nd[id] || {}) };
        Object.entries(b.conf || {}).forEach(([f, c]) => {
          if (c > 0 && c < 95) row[f] = "y";
        });
        nd[id] = row;
      });
      return nd;
    });
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "#fff", fontFamily: T.font, color: T.text, fontSize: 12.5,
    }}>

      {/* ─── Top bar ─────────────────────────────────────── */}
      <div style={{
        height: 44, padding: "0 18px", borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", gap: 14, flexShrink: 0, background: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6, background: T.accent,
            color: "#fff", display: "grid", placeItems: "center",
            fontWeight: 700, fontSize: 13,
          }}>P</div>
          <span style={{ fontWeight: 600 }}>Produit.ai</span>
          <span style={{ color: T.textSubtle }}>›</span>
          <span style={{ fontWeight: 500 }}>Marques · Tableau enrichi</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11.5, color: T.textMuted, fontFamily: T.mono }}>
          {list.length} marques
        </span>
      </div>

      {/* ─── Toolbar / bulk bar ──────────────────────────── */}
      {selected.size === 0 ? (
        <div style={{
          height: 42, padding: "0 18px", borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", gap: 8, flexShrink: 0, background: "#fbfcfd",
        }}>
          <div style={{
            position: "relative", display: "flex", alignItems: "center",
            background: "#fff", border: `1px solid ${T.border}`,
            borderRadius: 4, padding: "0 10px", height: 28, width: 280,
          }}>
            <I.search size={12} style={{ color: T.textSubtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
              style={{
                flex: 1, marginLeft: 8, height: 26, padding: 0, border: "none",
                background: "transparent", fontSize: 12, fontFamily: "inherit",
                color: T.text, outline: "none",
              }} />
          </div>
          <button style={{
            padding: "4px 10px", background: "#fff", border: `1px solid ${T.border}`,
            borderRadius: 4, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            <I.filter size={11} /> Filtrer
          </button>
          <button style={{
            padding: "4px 10px", background: "#fff", border: `1px solid ${T.border}`,
            borderRadius: 4, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            <I.list size={11} /> Colonnes
          </button>
          <div style={{ flex: 1 }} />
          <button style={{
            padding: "4px 10px", background: "#fff", border: `1px solid ${T.border}`,
            borderRadius: 4, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 4, color: T.accentText,
          }}>
            <I.sparkle size={11} /> Enrichir tout
          </button>
          <button style={{
            padding: "4px 10px", background: "#fff", border: `1px solid ${T.border}`,
            borderRadius: 4, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            <I.download size={11} /> Export CSV
          </button>
          <button style={{
            padding: "4px 12px", background: T.accent, color: "#fff", border: "none",
            borderRadius: 4, fontSize: 11.5, fontWeight: 500, cursor: "pointer",
            fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            <I.plus size={11} /> Nouvelle
          </button>
        </div>
      ) : (
        <div style={{
          height: 42, padding: "0 18px", borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
          background: T.accentSoft, color: T.accentText,
        }}>
          <span style={{
            fontSize: 12, fontWeight: 600,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <span style={{
              fontFamily: T.mono, padding: "1px 7px",
              background: T.accent, color: "#fff", borderRadius: 3,
              fontSize: 11, fontWeight: 700,
            }}>{selected.size}</span>
            sélectionnée{selected.size > 1 ? "s" : ""}
          </span>
          <div style={{ flex: 1 }} />
          <button onClick={bulkAcceptAll} style={{
            padding: "5px 11px", background: "#fff", border: `1px solid oklch(0.7 0.12 155)`,
            borderRadius: 4, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
            color: "oklch(0.4 0.13 155)", fontWeight: 500,
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            <I.check size={11} /> Valider toutes les suggestions
          </button>
          <button style={{
            padding: "5px 11px", background: "#fff", border: `1px solid ${T.border}`,
            borderRadius: 4, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            <I.tag size={11} /> Changer typologie
          </button>
          <button style={{
            padding: "5px 11px", background: "#fff", border: `1px solid ${T.border}`,
            borderRadius: 4, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            <I.folder size={11} /> Rattacher au groupe…
          </button>
          <button style={{
            padding: "5px 11px", background: "#fff", border: `1px solid ${T.border}`,
            borderRadius: 4, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
            color: "oklch(0.5 0.18 25)",
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            <I.trash size={11} /> Archiver
          </button>
          <button onClick={() => setSelected(new Set())} style={{
            padding: "5px 9px", background: "transparent", border: `1px solid transparent`,
            borderRadius: 4, fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
            color: T.accentText,
          }}>Désélectionner</button>
        </div>
      )}

      {/* ─── Table ───────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        <table style={{
          borderCollapse: "separate", borderSpacing: 0, width: "100%",
          fontSize: 12,
        }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 2, background: T.headerBg }}>
            <tr>
              <Th width={36} sticky>
                <input type="checkbox" checked={allSelected}
                  onChange={() => {
                    if (allSelected) setSelected(new Set());
                    else setSelected(new Set(list.map(b => b.id)));
                  }}
                  style={{ margin: 0, cursor: "pointer" }} />
              </Th>
              <Th width={48} sticky>Logo</Th>
              <SortTh label="Marque" k="name" sortKey={sortKey} sortDir={sortDir}
                onSort={(k, d) => { setSortKey(k); setSortDir(d); }} sticky width={200} />
              <SortTh label="Typo" k="typo" sortKey={sortKey} sortDir={sortDir}
                onSort={(k, d) => { setSortKey(k); setSortDir(d); }} width={90} />
              <SortTh label="Groupe Actionnaire" k="group" sortKey={sortKey} sortDir={sortDir}
                onSort={(k, d) => { setSortKey(k); setSortDir(d); }} width={210} />
              <SortTh label="Pays" k="country" sortKey={sortKey} sortDir={sortDir}
                onSort={(k, d) => { setSortKey(k); setSortDir(d); }} width={90} />
              <SortTh label="Catégorie" k="category" sortKey={sortKey} sortDir={sortDir}
                onSort={(k, d) => { setSortKey(k); setSortDir(d); }} width={170} />
              <SortTh label="Site web" k="website" sortKey={sortKey} sortDir={sortDir}
                onSort={(k, d) => { setSortKey(k); setSortDir(d); }} width={150} />
              <SortTh label="Fondée" k="founded" sortKey={sortKey} sortDir={sortDir}
                onSort={(k, d) => { setSortKey(k); setSortDir(d); }} width={70} align="right" />
              <SortTh label="Articles" k="articleCount" sortKey={sortKey} sortDir={sortDir}
                onSort={(k, d) => { setSortKey(k); setSortDir(d); }} width={70} align="right" />
              <Th width={100}>Complétude</Th>
              <Th width={36}></Th>
            </tr>
          </thead>
          <tbody>
            {list.map((b, idx) => {
              const isSel = selected.has(b.id);
              return (
                <BrandTableRow key={b.id} brand={b} idx={idx}
                  selected={isSel} onSel={() => toggleSel(b.id)}
                  editingCell={editingCell?.id === b.id ? editingCell.field : null}
                  startEdit={(field) => setEditingCell({ id: b.id, field })}
                  endEdit={() => setEditingCell(null)}
                  setField={(k, v) => setField(b.id, k, v)} />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── Footer ──────────────────────────────────────── */}
      <div style={{
        height: 30, padding: "0 18px", borderTop: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", gap: 14, flexShrink: 0,
        background: "#fbfcfd", fontSize: 11, color: T.textMuted, fontFamily: T.mono,
        fontVariantNumeric: "tabular-nums",
      }}>
        <span>{list.length} lignes</span>
        <span>·</span>
        <span>{Object.keys(edits).length} modifié{Object.keys(edits).length > 1 ? "s" : ""}</span>
        <span>·</span>
        <span>{BRANDS.reduce((s, b) => s + Object.values(b.conf || {}).filter(c => c > 0 && c < 95).length, 0)} suggestions IA en attente</span>
        <div style={{ flex: 1 }} />
        <span>Cmd+S pour sauvegarder · Espace pour sélectionner · ↑/↓ pour naviguer</span>
      </div>
    </div>
  );
}

function Th({ children, width, sticky, align }) {
  const T = window.C_TOKENS;
  return (
    <th style={{
      width, minWidth: width, padding: "8px 10px",
      textAlign: align || "left", fontSize: 10.5, fontWeight: 600,
      color: T.textMuted, letterSpacing: 0.4, textTransform: "uppercase",
      borderBottom: `1px solid ${T.borderStrong}`,
      borderRight: `1px solid ${T.border}`,
      background: T.headerBg,
      position: sticky ? "sticky" : "static",
      left: sticky ? 0 : "auto",
      zIndex: sticky ? 1 : "auto",
      whiteSpace: "nowrap",
    }}>{children}</th>
  );
}

function SortTh({ label, k, sortKey, sortDir, onSort, width, sticky, align }) {
  const T = window.C_TOKENS;
  const active = sortKey === k;
  return (
    <th onClick={() => {
      if (active) onSort(k, sortDir === "asc" ? "desc" : "asc");
      else onSort(k, "asc");
    }}
      style={{
        width, minWidth: width, padding: "8px 10px",
        textAlign: align || "left", fontSize: 10.5, fontWeight: 600,
        color: active ? T.accentText : T.textMuted,
        letterSpacing: 0.4, textTransform: "uppercase",
        borderBottom: `1px solid ${T.borderStrong}`,
        borderRight: `1px solid ${T.border}`,
        background: T.headerBg, cursor: "pointer", userSelect: "none",
        whiteSpace: "nowrap",
      }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        flexDirection: align === "right" ? "row-reverse" : "row",
      }}>
        {label}
        {active && (sortDir === "asc"
          ? <I.chevronUp size={10} />
          : <I.chevronDown size={10} />)}
      </span>
    </th>
  );
}

function BrandTableRow({ brand, idx, selected, onSel, editingCell, startEdit, endEdit, setField }) {
  const T = window.C_TOKENS;
  const TYPOLOGIES = window.TYPOLOGIES;
  const t = TYPOLOGIES[brand.typo];
  const ts = window.typoStyle(brand.typo);
  const logo = window.brandLogoStyle(brand);
  const initials = window.brandInitials(brand.name);
  const conf = brand.conf || {};

  const fields = ["typo", "group", "country", "category", "website", "founded"];
  const total = fields.length + 1; // + logo
  const filled = fields.filter(f => brand[f] != null && brand[f] !== "").length + (conf.logo > 0 ? 1 : 0);
  const completeness = Math.round(filled / total * 100);

  const altBg = idx % 2 === 0 ? "#fff" : T.rowAlt;
  const rowBg = selected ? T.accentSoft : altBg;

  const cellBg = (field) => {
    const c = conf[field];
    if (c === 0 || brand[field] == null || brand[field] === "") {
      return "repeating-linear-gradient(45deg, transparent 0 4px, oklch(0.96 0.02 80) 4px 5px)";
    }
    if (c == null || c >= 95) return "transparent";
    if (c >= 80) return "oklch(0.98 0.04 75)";
    return "oklch(0.98 0.03 25)";
  };
  const cellFg = (field) => {
    const c = conf[field];
    if (c === 0 || brand[field] == null || brand[field] === "") return T.textSubtle;
    if (c == null || c >= 95) return T.text;
    if (c >= 80) return "oklch(0.38 0.13 65)";
    return "oklch(0.4 0.18 25)";
  };

  return (
    <tr style={{ background: rowBg }}>
      {/* Checkbox */}
      <Td sticky bg={rowBg} center>
        <input type="checkbox" checked={selected} onChange={onSel}
          style={{ margin: 0, cursor: "pointer" }} />
      </Td>

      {/* Logo */}
      <Td sticky bg={rowBg} center>
        <div style={{
          width: 28, height: 28, borderRadius: 4,
          background: logo.bg, color: logo.fg,
          display: "grid", placeItems: "center",
          fontWeight: 700, fontSize: 10.5, letterSpacing: 0.3,
          border: `1px solid oklch(0 0 0 / 0.08)`,
          position: "relative",
        }}>
          {initials}
          {conf.logo === 0 && (
            <span style={{
              position: "absolute", top: -2, right: -2,
              width: 8, height: 8, borderRadius: "50%",
              background: "oklch(0.62 0.17 65)",
              border: "1.5px solid #fff",
            }} />
          )}
        </div>
      </Td>

      {/* Name */}
      <Td sticky bg={rowBg}>
        <div style={{
          display: "flex", flexDirection: "column", gap: 1,
          maxWidth: 200, overflow: "hidden",
        }}>
          <span style={{
            fontWeight: 600, fontSize: 12.5,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{brand.name}</span>
          {brand.aka && brand.aka.length > 0 && brand.aka[0] !== brand.name.toUpperCase() && (
            <span style={{
              fontSize: 10, color: T.textSubtle, fontFamily: T.mono,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>aka {brand.aka.slice(0, 2).join(", ")}</span>
          )}
        </div>
      </Td>

      {/* Typology */}
      <Td bg={cellBg("typo")} fg={cellFg("typo")}>
        {brand.typo ? (
          <span style={{
            display: "inline-flex", alignItems: "center", height: 18,
            padding: "0 6px", borderRadius: 3,
            background: ts.bg, color: ts.fg, border: `1px solid ${ts.border}`,
            fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4,
            fontFamily: T.mono,
          }}>{brand.typo}</span>
        ) : <ConfBadge c={conf.typo} />}
      </Td>

      {/* Group */}
      <EditableCell value={brand.group} editing={editingCell === "group"}
        onStart={() => startEdit("group")} onEnd={endEdit}
        onChange={v => setField("group", v)}
        bg={cellBg("group")} fg={cellFg("group")} conf={conf.group}
        placeholder="—" />

      {/* Country */}
      <Td bg={cellBg("country")} fg={cellFg("country")}>
        {brand.country ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 12 }}>{countryFlag(brand.country)}</span>
            <span style={{ fontFamily: T.mono, fontWeight: 600, fontSize: 11.5 }}>{brand.country}</span>
          </span>
        ) : <ConfBadge c={conf.country} />}
      </Td>

      {/* Category */}
      <EditableCell value={brand.category} editing={editingCell === "category"}
        onStart={() => startEdit("category")} onEnd={endEdit}
        onChange={v => setField("category", v)}
        bg={cellBg("category")} fg={cellFg("category")} conf={conf.category} />

      {/* Website */}
      <EditableCell value={brand.website} editing={editingCell === "website"}
        onStart={() => startEdit("website")} onEnd={endEdit}
        onChange={v => setField("website", v)}
        bg={cellBg("website")} fg={cellFg("website")} conf={conf.website} mono />

      {/* Founded */}
      <Td bg={cellBg("founded")} fg={cellFg("founded")} align="right" mono>
        {brand.founded || <ConfBadge c={conf.founded} />}
      </Td>

      {/* Articles */}
      <Td align="right" mono>
        <span style={{ fontWeight: 600 }}>{brand.articleCount}</span>
      </Td>

      {/* Completeness bar */}
      <Td>
        <CompletenessBar pct={completeness} />
      </Td>

      {/* Action */}
      <Td center>
        <button style={{
          width: 22, height: 22, padding: 0, background: "transparent",
          border: "none", borderRadius: 3, cursor: "pointer",
          color: T.textSubtle, display: "grid", placeItems: "center",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#eef0f2"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <I.more size={13} />
        </button>
      </Td>
    </tr>
  );
}

function Td({ children, bg, fg, align, mono, sticky, center }) {
  const T = window.C_TOKENS;
  return (
    <td style={{
      padding: "0 10px", height: 36,
      background: bg || "transparent",
      color: fg || T.text,
      borderBottom: `1px solid ${T.border}`,
      borderRight: `1px solid ${T.border}`,
      fontSize: 12,
      textAlign: center ? "center" : (align || "left"),
      fontFamily: mono ? T.mono : "inherit",
      fontVariantNumeric: mono ? "tabular-nums" : "normal",
      position: sticky ? "sticky" : "static",
      left: sticky ? 0 : "auto",
      zIndex: sticky ? 1 : "auto",
      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      maxWidth: 0,
    }}>
      {children}
    </td>
  );
}

function ConfBadge({ c }) {
  const T = window.C_TOKENS;
  if (c === 0 || c == null) {
    return (
      <span style={{
        fontSize: 10, color: "oklch(0.5 0.05 80)",
        fontStyle: "italic", letterSpacing: 0.3,
      }}>non détecté</span>
    );
  }
  return null;
}

function EditableCell({ value, editing, onStart, onEnd, onChange, bg, fg, conf, mono, placeholder }) {
  const T = window.C_TOKENS;
  const [draft, setDraft] = React.useState(value || "");
  React.useEffect(() => { setDraft(value || ""); }, [value]);

  if (editing) {
    return (
      <td style={{
        padding: 0, height: 36, background: "#fff",
        borderBottom: `1px solid ${T.border}`,
        borderRight: `1px solid ${T.border}`,
        position: "relative",
      }}>
        <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
          onBlur={() => { onChange(draft); onEnd(); }}
          onKeyDown={e => {
            if (e.key === "Enter") { onChange(draft); onEnd(); }
            else if (e.key === "Escape") { setDraft(value || ""); onEnd(); }
          }}
          style={{
            width: "100%", height: 36, padding: "0 10px",
            border: `2px solid ${T.accent}`, background: "#fff",
            fontSize: 12, fontFamily: mono ? T.mono : "inherit",
            color: T.text, outline: "none", boxSizing: "border-box",
          }} />
      </td>
    );
  }
  return (
    <Td bg={bg} fg={fg} mono={mono}>
      <span onClick={onStart} style={{ cursor: "text", display: "block" }}>
        {value || <ConfBadge c={conf} /> || <span style={{ color: T.textSubtle }}>{placeholder}</span>}
      </span>
    </Td>
  );
}

function CompletenessBar({ pct }) {
  const T = window.C_TOKENS;
  let color = "oklch(0.55 0.13 145)"; // green
  if (pct < 90) color = "oklch(0.65 0.16 75)"; // amber
  if (pct < 60) color = "oklch(0.6 0.18 25)"; // red
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{
        flex: 1, height: 5, background: "#eef0f2", borderRadius: 3,
        overflow: "hidden", maxWidth: 60,
      }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color }} />
      </div>
      <span style={{
        fontSize: 10.5, color: T.textMuted, fontFamily: T.mono,
        fontVariantNumeric: "tabular-nums", fontWeight: 600,
      }}>{pct}%</span>
    </div>
  );
}

window.BrandsV3 = BrandsV3;
