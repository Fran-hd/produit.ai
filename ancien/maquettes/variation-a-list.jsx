// Variation A — Article list (Linear-like dense table)

function StatusDotA({ status }) {
  const map = {
    validated: { color: A_TOKENS.accent, label: "Validé" },
    in_review: { color: A_TOKENS.warn, label: "À valider" },
    draft: { color: "#9a978f", label: "Brouillon" },
  };
  const s = map[status] || map.draft;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: A_TOKENS.text }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }} />
      {s.label}
    </div>
  );
}

function ProductListA() {
  const [selected, setSelected] = React.useState(new Set(["art_8413"]));
  const toggleAll = () => setSelected(selected.size === PRODUCTS.length ? new Set() : new Set(PRODUCTS.map(p => p.id)));
  const toggle = id => {
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelected(n);
  };

  return (
    <div style={{ display: "flex", height: "100%", background: A_TOKENS.bg, fontFamily: A_TOKENS.font, color: A_TOKENS.text }}>
      <SidebarA active="list" />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header bar */}
        <div style={{ height: 50, padding: "0 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${A_TOKENS.border}`, background: A_TOKENS.surface }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: A_TOKENS.text }}>Articles</div>
            <div style={{ fontSize: 11, color: A_TOKENS.textMuted, marginTop: 1 }}>8 421 articles · 142 brouillons · 38 à valider</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 11px",
              background: "#fff", border: `1px solid ${A_TOKENS.border}`, borderRadius: 5, fontSize: 12.5, color: A_TOKENS.text, cursor: "pointer", fontWeight: 500 }}>
              <I.upload size={13} /> Import EAN
            </button>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 11px",
              background: A_TOKENS.text, color: "#fff", border: "none", borderRadius: 5, fontSize: 12.5, cursor: "pointer", fontWeight: 500 }}>
              <I.plus size={13} /> Nouvel article
            </button>
          </div>
        </div>

        {/* Quick EAN bar */}
        <div style={{ padding: "12px 18px", background: "#f5f3ed", borderBottom: `1px solid ${A_TOKENS.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <I.scan size={16} style={{ color: A_TOKENS.accentText }} />
          <div style={{ fontSize: 12.5, color: A_TOKENS.text, fontWeight: 500 }}>Création rapide par EAN</div>
          <input placeholder="Saisir ou scanner un EAN-13…"
            style={{ flex: 1, maxWidth: 360, padding: "6px 10px", border: `1px solid ${A_TOKENS.border}`,
              borderRadius: 5, background: "#fff", fontSize: 13, fontFamily: A_TOKENS.mono, outline: "none" }} />
          <button style={{ padding: "6px 11px", background: A_TOKENS.accent, color: "#fff",
            border: "none", borderRadius: 5, fontSize: 12.5, cursor: "pointer", fontWeight: 500 }}>Créer la fiche</button>
          <span style={{ fontSize: 11, color: A_TOKENS.textMuted }}>L'article est créé vide, à enrichir</span>
        </div>

        {/* Filter bar */}
        <div style={{ padding: "10px 18px", borderBottom: `1px solid ${A_TOKENS.border}`, background: A_TOKENS.surface,
          display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative", flex: "0 0 280px" }}>
            <I.search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: A_TOKENS.textSubtle }} />
            <input placeholder="Rechercher par EAN, libellé, marque…"
              style={{ width: "100%", padding: "6px 9px 6px 28px", border: `1px solid ${A_TOKENS.border}`,
                borderRadius: 5, fontSize: 12.5, fontFamily: "inherit", outline: "none" }} />
          </div>
          {[
            { label: "Statut", value: "Tous" },
            { label: "Catégorie", value: "Toutes" },
            { label: "Marque", value: "Toutes" },
            { label: "Complétude", value: "≥ 0%" },
            { label: "Propriétaire", value: "Tous" },
          ].map(f => (
            <button key={f.label} style={{ display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 9px", background: "#fff", border: `1px solid ${A_TOKENS.border}`,
              borderRadius: 5, fontSize: 12, color: A_TOKENS.text, cursor: "pointer" }}>
              <span style={{ color: A_TOKENS.textMuted }}>{f.label}:</span>
              <span style={{ fontWeight: 500 }}>{f.value}</span>
              <I.chevronDown size={11} style={{ color: A_TOKENS.textMuted }} />
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button style={{ padding: "5px 8px", background: "transparent", border: "none", cursor: "pointer", color: A_TOKENS.textMuted }}><I.list size={15} /></button>
          <button style={{ padding: "5px 8px", background: "transparent", border: "none", cursor: "pointer", color: A_TOKENS.textSubtle }}><I.grid size={15} /></button>
        </div>

        {/* Selection bar (when applicable) */}
        {selected.size > 0 && (
          <div style={{ padding: "8px 18px", background: "#1a1916", color: "#fff", display: "flex", alignItems: "center", gap: 12, fontSize: 12.5 }}>
            <span style={{ fontWeight: 500 }}>{selected.size} sélectionné{selected.size > 1 ? "s" : ""}</span>
            <span style={{ color: "#7a776e" }}>·</span>
            <button style={{ background: "transparent", border: "none", color: "#cfccc4", cursor: "pointer", fontSize: 12.5, padding: 0 }}>Changer le statut</button>
            <button style={{ background: "transparent", border: "none", color: "#cfccc4", cursor: "pointer", fontSize: 12.5, padding: 0 }}>Reclasser</button>
            <button style={{ background: "transparent", border: "none", color: "#cfccc4", cursor: "pointer", fontSize: 12.5, padding: 0 }}>Assigner à…</button>
            <button style={{ background: "transparent", border: "none", color: "#cfccc4", cursor: "pointer", fontSize: 12.5, padding: 0 }}>Exporter</button>
            <div style={{ flex: 1 }} />
            <button onClick={() => setSelected(new Set())} style={{ background: "transparent", border: "none", color: "#7a776e", cursor: "pointer" }}>
              <I.x size={14} />
            </button>
          </div>
        )}

        {/* Table */}
        <div style={{ flex: 1, overflowY: "auto", background: A_TOKENS.surface }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ position: "sticky", top: 0, background: "#fafaf6", zIndex: 1 }}>
                <th style={thA(40)}><input type="checkbox" checked={selected.size === PRODUCTS.length} onChange={toggleAll} /></th>
                <th style={thA()}>EAN</th>
                <th style={thA()}>Article</th>
                <th style={thA()}>Marque</th>
                <th style={thA()}>Catégorie</th>
                <th style={thA(70, "right")}>Visuels</th>
                <th style={thA(110)}>Complétude</th>
                <th style={thA(95)}>Statut</th>
                <th style={thA(95)}>Propriétaire</th>
                <th style={thA(80, "right")}>Modifié</th>
                <th style={thA(30)}></th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p, i) => {
                const sel = selected.has(p.id);
                return (
                  <tr key={p.id} style={{ borderTop: `1px solid ${A_TOKENS.border}`,
                    background: sel ? A_TOKENS.accentSoft : "transparent" }}>
                    <td style={tdA()}><input type="checkbox" checked={sel} onChange={() => toggle(p.id)} /></td>
                    <td style={{ ...tdA(), fontFamily: A_TOKENS.mono, fontSize: 11.5, color: A_TOKENS.textMuted }}>{p.ean}</td>
                    <td style={tdA()}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 4, background: "#f4f2ec",
                          display: "grid", placeItems: "center", fontSize: 15 }}>{["🍫","🥖","💧","🍗","🍝","🥛","☕","🐟"][i]}</div>
                        <div>
                          <div style={{ color: A_TOKENS.text, fontWeight: 500 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: A_TOKENS.textSubtle }}>{p.format}</div>
                        </div>
                      </div>
                    </td>
                    <td style={tdA()}>{p.brand}</td>
                    <td style={{ ...tdA(), color: A_TOKENS.textMuted, fontSize: 11.5 }}>{p.category}</td>
                    <td style={{ ...tdA(), textAlign: "right", fontVariantNumeric: "tabular-nums",
                      color: p.images === 0 ? A_TOKENS.danger : A_TOKENS.text, fontWeight: 500 }}>{p.images}</td>
                    <td style={tdA()}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: "#ebe9e3", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: `${p.completeness}%`, height: "100%",
                            background: p.completeness >= 80 ? A_TOKENS.accent : p.completeness >= 50 ? A_TOKENS.warn : A_TOKENS.danger }} />
                        </div>
                        <span style={{ fontSize: 11, color: A_TOKENS.textMuted, fontVariantNumeric: "tabular-nums", width: 28, textAlign: "right" }}>{p.completeness}%</span>
                      </div>
                    </td>
                    <td style={tdA()}><StatusDotA status={p.status} /></td>
                    <td style={{ ...tdA(), color: p.owner === "—" ? A_TOKENS.textSubtle : A_TOKENS.text }}>{p.owner}</td>
                    <td style={{ ...tdA(), textAlign: "right", color: A_TOKENS.textMuted, fontSize: 11.5 }}>{p.updated}</td>
                    <td style={tdA()}><button style={{ padding: 2, background: "transparent", border: "none", cursor: "pointer", color: A_TOKENS.textSubtle }}><I.more size={14} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "8px 18px", borderTop: `1px solid ${A_TOKENS.border}`, background: A_TOKENS.surface,
          display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11.5, color: A_TOKENS.textMuted }}>
          <span>1–8 sur 8 421</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button style={pageBtn}><I.chevronLeft size={12} /></button>
            <span style={{ padding: "0 8px" }}>1 / 1 053</span>
            <button style={pageBtn}><I.chevronRight size={12} /></button>
          </div>
        </div>
      </main>
    </div>
  );
}

const thA = (w, align = "left") => ({
  padding: "9px 12px", textAlign: align, fontSize: 11, fontWeight: 500,
  color: A_TOKENS.textMuted, letterSpacing: 0.3, textTransform: "uppercase",
  borderBottom: `1px solid ${A_TOKENS.border}`, width: w,
});
const tdA = () => ({ padding: "8px 12px", color: A_TOKENS.text });
const pageBtn = { padding: "3px 5px", background: "transparent", border: `1px solid ${A_TOKENS.border}`, borderRadius: 4, cursor: "pointer", color: A_TOKENS.textMuted, display: "grid", placeItems: "center" };

window.ProductListA = ProductListA;
