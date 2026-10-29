// F1 · Liaisons — Liste de clusters
// Format: vue dense avec liste de clusters (gauche) + panneau détail (droite)
// Style hérité de C_TOKENS / variation-c (data-dense Linear-like)

function LinksF1() {
  const clusters = window.LINK_CLUSTERS || [];
  const types = window.LINK_TYPES || {};
  const counts = window.clusterCounts ? window.clusterCounts(clusters) : {};

  const [activeType, setActiveType] = React.useState("all");
  const [activeStatus, setActiveStatus] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selectedId, setSelectedId] = React.useState(clusters[0]?.id);

  const filtered = clusters.filter(c => {
    if (activeType !== "all" && c.type !== activeType) return false;
    if (activeStatus !== "all" && c.status !== activeStatus) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())
        && !c.products.some(p => (p.name + p.brand + p.ean).toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const selected = filtered.find(c => c.id === selectedId) || filtered[0];

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
          <span style={{ color: C_TOKENS.textMuted }}>Articles</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 2px" }}>›</span>
          <span style={{ fontWeight: 500 }}>Liaisons</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>
          {counts.all || 0} clusters · {counts.pending || 0} à valider
        </span>
        <div style={{ width: 1, height: 18, background: C_TOKENS.border }} />
        <button style={f1TabBtn}><I.plus size={11} /> Lier manuellement</button>
        <button style={{ ...f1TabBtn, background: C_TOKENS.accent, color: "#fff", border: "none" }}>
          <I.check size={11} /> Tout valider IA
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "grid",
        gridTemplateColumns: "230px minmax(0, 1fr) 380px", overflow: "hidden" }}>

        {/* LEFT — type filter rail */}
        <div style={{ background: "#fff", borderRight: `1px solid ${C_TOKENS.border}`,
          overflow: "auto", padding: "12px 0" }}>
          <div style={{ padding: "0 14px 8px", fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
            textTransform: "uppercase", letterSpacing: 0.5 }}>Type de liaison</div>

          <F1RailButton id="all" active={activeType} setActive={setActiveType}
            label="Tous types" count={counts.all} />

          {Object.values(types).map(t => (
            <F1RailButton key={t.code} id={t.code} active={activeType} setActive={setActiveType}
              label={t.label} count={counts[t.code] || 0}
              color={t.color} icon={t.icon} severity={t.severity} />
          ))}

          <div style={{ padding: "12px 14px 6px", marginTop: 10,
            borderTop: `1px solid ${C_TOKENS.border}`,
            fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
            textTransform: "uppercase", letterSpacing: 0.5 }}>Statut</div>
          {[
            { id: "all", l: "Tous", n: counts.all },
            { id: "pending", l: "À valider", n: counts.pending, color: C_TOKENS.amber },
            { id: "validated", l: "Validés", n: counts.validated, color: C_TOKENS.green },
          ].map(s => (
            <button key={s.id} onClick={() => setActiveStatus(s.id)}
              style={{ width: "100%", padding: "7px 14px", display: "flex", alignItems: "center", gap: 9,
                background: activeStatus === s.id ? C_TOKENS.accentSoft : "transparent",
                borderLeft: activeStatus === s.id ? `3px solid ${C_TOKENS.accent}` : "3px solid transparent",
                border: "none", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
              {s.color && <div style={{ width: 6, height: 6, borderRadius: 3, background: s.color }} />}
              <span style={{ flex: 1, fontSize: 11.5,
                fontWeight: activeStatus === s.id ? 600 : 500,
                color: activeStatus === s.id ? C_TOKENS.accentText : C_TOKENS.text }}>{s.l}</span>
              <span style={{ fontSize: 10.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
                fontVariantNumeric: "tabular-nums" }}>{s.n || 0}</span>
            </button>
          ))}
        </div>

        {/* CENTER — clusters list */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", background: C_TOKENS.bg }}>
          {/* Toolbar */}
          <div style={{ height: 44, padding: "0 14px", background: "#fff",
            borderBottom: `1px solid ${C_TOKENS.border}`,
            display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
              <I.search size={12} style={{ position: "absolute", left: 9, top: "50%",
                transform: "translateY(-50%)", color: C_TOKENS.textSubtle }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un cluster, EAN, marque…"
                style={{ width: "100%", padding: "6px 10px 6px 28px",
                  border: `1px solid ${C_TOKENS.border}`,
                  borderRadius: 3, fontSize: 12, fontFamily: "inherit", outline: "none" }} />
            </div>
            <button style={f1TabBtn}><I.filter size={11} /> Filtres</button>
            <button style={f1TabBtn}><I.sort size={11} /> Trier par confiance</button>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflow: "auto" }}>
            {filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: "center", color: C_TOKENS.textMuted, fontSize: 12 }}>
                Aucun cluster ne correspond aux filtres.
              </div>
            )}
            {filtered.map(c => (
              <F1ClusterRow key={c.id} cluster={c} types={types}
                selected={c.id === selected?.id}
                onClick={() => setSelectedId(c.id)} />
            ))}
          </div>
        </div>

        {/* RIGHT — detail panel */}
        {selected && <F1Detail cluster={selected} types={types} />}
      </div>

      {/* Status */}
      <div style={{ height: 24, padding: "0 14px", background: C_TOKENS.headerBg,
        borderTop: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 16, fontSize: 11,
        color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, flexShrink: 0 }}>
        <span>Liaisons <strong style={{ color: C_TOKENS.text }}>fr-FR · v2.4</strong></span>
        <span>{filtered.length} affichés · {counts.pending} en attente IA</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: C_TOKENS.green, fontWeight: 600 }}>● Index liens à jour</span>
        <span>M. Lefèvre · à l'instant</span>
      </div>
    </div>
  );
}

function F1RailButton({ id, active, setActive, label, count, color, icon, severity }) {
  const isActive = active === id;
  return (
    <button onClick={() => setActive(id)}
      style={{ width: "100%", padding: "7px 14px", display: "flex", alignItems: "center", gap: 9,
        background: isActive ? C_TOKENS.accentSoft : "transparent",
        borderLeft: isActive ? `3px solid ${C_TOKENS.accent}` : "3px solid transparent",
        border: "none", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
      {color
        ? <div style={{ width: 18, height: 18, borderRadius: 3, background: color, color: "#fff",
            display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, lineHeight: 1, flexShrink: 0 }}>
            {icon}
          </div>
        : <I.list size={11} style={{ color: C_TOKENS.textMuted, marginLeft: 3 }} />}
      <span style={{ flex: 1, fontSize: 11.5,
        fontWeight: isActive ? 600 : 500,
        color: isActive ? C_TOKENS.accentText : C_TOKENS.text,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <span style={{ fontSize: 10.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
        fontVariantNumeric: "tabular-nums" }}>{count || 0}</span>
    </button>
  );
}

function F1ClusterRow({ cluster: c, types, selected, onClick }) {
  const t = types[c.type];
  const conf = window.fmtConfidence(c.confidence);
  const confC = window.confColor(c.confidence);

  return (
    <div onClick={onClick}
      style={{ display: "grid",
        gridTemplateColumns: "auto 1fr auto auto auto",
        alignItems: "center", gap: 12,
        padding: "10px 14px",
        borderBottom: `1px solid ${C_TOKENS.border}`,
        background: selected ? "oklch(0.97 0.03 250)" : "#fff",
        borderLeft: selected ? `3px solid ${C_TOKENS.accent}` : "3px solid transparent",
        cursor: "pointer" }}>

      {/* Type badge */}
      <div style={{ width: 26, height: 26, borderRadius: 4, background: t.color, color: "#fff",
        display: "grid", placeItems: "center", fontSize: 14, fontWeight: 700, lineHeight: 1, flexShrink: 0 }}
        title={t.label}>
        {t.icon}
      </div>

      {/* Title + meta */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: C_TOKENS.text,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</span>
          <span style={{ fontSize: 10, padding: "1px 6px", background: t.soft, color: t.color,
            borderRadius: 2, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
            {t.label}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10.5,
          color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>
          <span>{c.products.length} produits</span>
          <span style={{ color: C_TOKENS.textSubtle }}>·</span>
          <span>{c.detectedBy === "ia" ? "détecté IA" : c.detectedBy === "rule" ? "règle" : "manuel"}</span>
          <span style={{ color: C_TOKENS.textSubtle }}>·</span>
          <span>{c.detectedAt}</span>
        </div>
      </div>

      {/* Member glyphs preview */}
      <div style={{ display: "flex", gap: -4, alignItems: "center" }}>
        {c.products.slice(0, 5).map((p, i) => (
          <div key={p.id} title={`${p.brand} — ${p.name}`}
            style={{ width: 28, height: 28, borderRadius: 4,
              background: "#fff", border: `1px solid ${C_TOKENS.border}`,
              display: "grid", placeItems: "center", fontSize: 14,
              marginLeft: i ? -6 : 0, zIndex: 5 - i,
              boxShadow: "0 1px 2px rgba(0,0,0,.04)" }}>
            {p.glyph}
          </div>
        ))}
        {c.products.length > 5 && (
          <div style={{ marginLeft: -6, width: 28, height: 28, borderRadius: 4,
            background: C_TOKENS.headerBg, border: `1px solid ${C_TOKENS.border}`,
            display: "grid", placeItems: "center", fontSize: 10, fontWeight: 600,
            color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>
            +{c.products.length - 5}
          </div>
        )}
      </div>

      {/* Confidence */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3,
        minWidth: 60 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: confC,
          fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>{conf}</span>
        <div style={{ width: 50, height: 3, background: C_TOKENS.border, borderRadius: 2,
          overflow: "hidden" }}>
          <div style={{ width: `${c.confidence * 100}%`, height: "100%", background: confC }} />
        </div>
      </div>

      {/* Status */}
      <div style={{ minWidth: 76 }}>
        {c.status === "pending" ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 8px", background: C_TOKENS.amberSoft, color: C_TOKENS.amber,
            borderRadius: 3, fontSize: 10.5, fontWeight: 600 }}>
            ● À valider
          </span>
        ) : (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 8px", background: C_TOKENS.greenSoft, color: C_TOKENS.green,
            borderRadius: 3, fontSize: 10.5, fontWeight: 600 }}>
            <I.check size={9} /> Validé
          </span>
        )}
      </div>
    </div>
  );
}

function F1Detail({ cluster: c, types }) {
  const t = types[c.type];

  return (
    <aside style={{ background: "#fff", borderLeft: `1px solid ${C_TOKENS.border}`,
      display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

      {/* Header */}
      <header style={{ padding: "14px 16px", borderBottom: `1px solid ${C_TOKENS.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 22, height: 22, borderRadius: 4, background: t.color, color: "#fff",
            display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, lineHeight: 1 }}>
            {t.icon}
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: t.color }}>{t.label}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: C_TOKENS.textSubtle, fontFamily: C_TOKENS.mono }}>#{c.id}</span>
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: C_TOKENS.text,
          lineHeight: 1.3 }}>{c.title}</h2>
        <p style={{ margin: 0, fontSize: 11.5, color: C_TOKENS.textMuted, lineHeight: 1.5 }}>
          {t.desc}
        </p>
      </header>

      {/* Confidence + provenance */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C_TOKENS.border}`,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
            textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Confiance IA</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 700,
              color: window.confColor(c.confidence),
              fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>
              {window.fmtConfidence(c.confidence)}
            </span>
            <div style={{ flex: 1, height: 4, background: C_TOKENS.border, borderRadius: 2,
              overflow: "hidden" }}>
              <div style={{ width: `${c.confidence * 100}%`, height: "100%",
                background: window.confColor(c.confidence) }} />
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
            textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Détecté par</div>
          <div style={{ fontSize: 12, color: C_TOKENS.text, fontWeight: 500 }}>
            {c.detectedBy === "ia" ? "🤖 IA Produit.ai"
              : c.detectedBy === "rule" ? "⚙ Règle métier"
              : "👤 " + (c.reviewer || "Manuel")}
          </div>
          <div style={{ fontSize: 10.5, color: C_TOKENS.textSubtle, marginTop: 2 }}>
            {c.detectedAt}
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C_TOKENS.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
          textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Règles appliquées</div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none",
          display: "flex", flexDirection: "column", gap: 4 }}>
          {c.rules.map((r, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7,
              fontSize: 11.5, color: C_TOKENS.text, lineHeight: 1.4 }}>
              <span style={{ color: t.color, fontWeight: 700, marginTop: 1 }}>→</span>
              {r}
            </li>
          ))}
        </ul>
        {c.reason && (
          <p style={{ margin: "10px 0 0", padding: "8px 10px",
            background: t.soft, borderLeft: `3px solid ${t.color}`, borderRadius: 2,
            fontSize: 11, color: C_TOKENS.text, lineHeight: 1.5,
            fontStyle: "italic" }}>
            {c.reason}
          </p>
        )}
      </div>

      {/* Members compare */}
      <div style={{ flex: 1, overflow: "auto", padding: "12px 16px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
          textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
          Membres ({c.products.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {c.products.map((p, i) => (
            <F1Member key={p.id} p={p} primary={i === 0} cluster={c} type={t} />
          ))}
        </div>

        <button style={{ marginTop: 10, width: "100%", padding: "7px 10px",
          background: "#fff", border: `1px dashed ${C_TOKENS.border}`,
          borderRadius: 3, fontSize: 11.5, color: C_TOKENS.textMuted,
          fontFamily: "inherit", cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
          <I.plus size={11} /> Ajouter un produit au cluster
        </button>
      </div>

      {/* Footer actions */}
      <footer style={{ padding: "10px 14px", borderTop: `1px solid ${C_TOKENS.border}`,
        background: C_TOKENS.headerBg, display: "flex", gap: 6, flexShrink: 0 }}>
        {c.status === "pending" ? (
          <>
            <button style={{ flex: 1, padding: "7px 10px", background: t.color, color: "#fff",
              border: "none", borderRadius: 3, fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
              <I.check size={11} /> {t.action}
            </button>
            <button style={{ padding: "7px 12px", background: "#fff", color: C_TOKENS.text,
              border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, fontSize: 12,
              cursor: "pointer", fontFamily: "inherit" }}>
              Reporter
            </button>
            <button title="Rejeter" style={f1IconBtn}>
              <I.x size={12} />
            </button>
          </>
        ) : (
          <>
            <button style={{ flex: 1, padding: "7px 10px", background: "#fff",
              border: `1px solid ${C_TOKENS.border}`, color: C_TOKENS.text,
              borderRadius: 3, fontSize: 12, fontWeight: 500, cursor: "pointer",
              fontFamily: "inherit",
              display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
              <I.edit size={11} /> Modifier les liens
            </button>
            <button title="Délier" style={f1IconBtn}>
              <I.trash size={12} />
            </button>
          </>
        )}
      </footer>
    </aside>
  );
}

function F1Member({ p, primary, cluster, type }) {
  const c = cluster, t = type;
  const isMaster = primary && c.type === "doublon";
  const isDup = c.type === "doublon" && !primary;
  const main = c.products[0];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "40px 1fr auto",
      alignItems: "center", gap: 10,
      padding: "9px 10px",
      border: `1px solid ${isMaster ? t.color : C_TOKENS.border}`,
      borderLeft: `3px solid ${isMaster ? t.color : "transparent"}`,
      borderRadius: 4,
      background: isDup ? "oklch(0.99 0.01 25)" : "#fff",
      opacity: p.status === "duplicate" || p.status === "archived" ? 0.65 : 1 }}>
      <div style={{ width: 38, height: 38, borderRadius: 4,
        background: C_TOKENS.headerBg,
        border: `1px solid ${C_TOKENS.border}`,
        display: "grid", placeItems: "center", fontSize: 22, lineHeight: 1 }}>
        {p.glyph}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: C_TOKENS.text,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {p.brand}
          </span>
          {isMaster && (
            <span style={{ fontSize: 9, padding: "1px 5px",
              background: t.soft, color: t.color, borderRadius: 2, fontWeight: 700,
              letterSpacing: 0.3 }}>MAÎTRE</span>
          )}
          {p.status === "duplicate" && (
            <span style={{ fontSize: 9, padding: "1px 5px",
              background: C_TOKENS.redSoft, color: C_TOKENS.red, borderRadius: 2,
              fontWeight: 600 }}>DOUBLON</span>
          )}
          {p.status === "archived" && (
            <span style={{ fontSize: 9, padding: "1px 5px",
              background: C_TOKENS.headerBg, color: C_TOKENS.textMuted, borderRadius: 2,
              fontWeight: 600 }}>ARCHIVÉ</span>
          )}
          {p.enseigne && (
            <span style={{ fontSize: 9, padding: "1px 5px",
              background: C_TOKENS.headerBg, color: C_TOKENS.textMuted, borderRadius: 2,
              fontWeight: 500 }}>{p.enseigne}</span>
          )}
        </div>
        <div style={{ fontSize: 11.5, color: C_TOKENS.text, marginBottom: 3,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {p.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10,
          color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>
          <span>{p.fmt}</span>
          <span style={{ color: C_TOKENS.textSubtle }}>·</span>
          <span>{p.ean}</span>
          {p.price != null && (
            <>
              <span style={{ color: C_TOKENS.textSubtle }}>·</span>
              <span style={{ fontWeight: 600, color: C_TOKENS.text }}>{p.price.toFixed(2).replace(".", ",")} €</span>
              {p.pricePerKg && main.pricePerKg && p !== main && (
                <PriceDelta a={main.pricePerKg} b={p.pricePerKg} />
              )}
            </>
          )}
        </div>
      </div>
      <button title="Ouvrir la fiche"
        style={{ width: 26, height: 26, padding: 0, display: "grid", placeItems: "center",
          background: "transparent", border: "none", cursor: "pointer",
          color: C_TOKENS.textSubtle, borderRadius: 3 }}>
        <I.chevronRight size={14} />
      </button>
    </div>
  );
}

function PriceDelta({ a, b }) {
  const d = ((b - a) / a) * 100;
  if (Math.abs(d) < 0.5) return null;
  const up = d > 0;
  return (
    <span style={{
      color: up ? C_TOKENS.red : C_TOKENS.green,
      fontWeight: 600, fontSize: 9.5,
    }} title={`${up ? "+" : ""}${d.toFixed(1)}% vs maître`}>
      {up ? "▲" : "▼"} {Math.abs(d).toFixed(0)}%
    </span>
  );
}

const f1TabBtn = { display: "inline-flex", alignItems: "center", gap: 5,
  padding: "4px 10px", height: 26, fontSize: 11.5, fontFamily: "inherit",
  background: "#fff", color: C_TOKENS.text, border: `1px solid ${C_TOKENS.border}`,
  borderRadius: 3, cursor: "pointer" };

const f1IconBtn = { width: 30, height: 28, padding: 0, display: "inline-flex",
  alignItems: "center", justifyContent: "center",
  background: "#fff", border: `1px solid ${C_TOKENS.border}`,
  borderRadius: 3, cursor: "pointer", color: C_TOKENS.text };

window.LinksF1 = LinksF1;
