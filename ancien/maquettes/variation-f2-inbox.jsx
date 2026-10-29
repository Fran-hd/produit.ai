// F2 · Liaisons — Inbox IA
// Format: file de revue focalisée, un cluster à la fois, raccourcis Y/N/J/K
// Variations explorées : keyboard-first, comparaison visuelle large, decision queue.

function LinksF2() {
  const allClusters = window.LINK_CLUSTERS || [];
  const types = window.LINK_TYPES || {};

  // Only pending clusters in inbox
  const initial = React.useMemo(() => allClusters.filter(c => c.status === "pending"), []);
  const [queue, setQueue] = React.useState(initial);
  const [history, setHistory] = React.useState([]); // {cluster, action}
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [filterType, setFilterType] = React.useState("all");

  const visibleQueue = filterType === "all"
    ? queue
    : queue.filter(c => c.type === filterType);
  const cluster = visibleQueue[activeIdx];

  function decide(action) {
    if (!cluster) return;
    setHistory(h => [{ cluster, action }, ...h].slice(0, 30));
    setQueue(q => q.filter(c => c.id !== cluster.id));
    setActiveIdx(i => Math.min(i, visibleQueue.length - 2));
  }

  function undo() {
    if (!history.length) return;
    const [last, ...rest] = history;
    setQueue(q => [last.cluster, ...q]);
    setHistory(rest);
  }

  // Keyboard shortcuts
  React.useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "j" || e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, visibleQueue.length - 1)); }
      else if (e.key === "k" || e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
      else if (e.key === "y" || e.key === "Enter") { e.preventDefault(); decide("validate"); }
      else if (e.key === "n") { e.preventDefault(); decide("reject"); }
      else if (e.key === "s") { e.preventDefault(); decide("snooze"); }
      else if (e.key === "u") { e.preventDefault(); undo(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visibleQueue, history]);

  const counts = React.useMemo(() => {
    const out = { all: queue.length };
    for (const c of queue) out[c.type] = (out[c.type] || 0) + 1;
    return out;
  }, [queue]);

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
          <span style={{ fontWeight: 500 }}>Inbox IA</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11,
          color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>
          <I.sparkle size={11} style={{ color: C_TOKENS.accent }} />
          {visibleQueue.length} propositions IA
          <span style={{ color: C_TOKENS.textSubtle }}>·</span>
          {history.length} traitées
        </span>
        <div style={{ width: 1, height: 18, background: C_TOKENS.border }} />
        <button onClick={undo} disabled={!history.length}
          style={{ ...f2TabBtn, opacity: history.length ? 1 : 0.5, cursor: history.length ? "pointer" : "default" }}>
          ↶ Annuler <kbd style={f2Kbd}>U</kbd>
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "grid",
        gridTemplateColumns: "240px minmax(0, 1fr) 280px", overflow: "hidden" }}>

        {/* LEFT — type filter rail */}
        <aside style={{ background: "#fff", borderRight: `1px solid ${C_TOKENS.border}`,
          overflow: "auto", padding: "12px 0" }}>
          <div style={{ padding: "0 14px 8px", fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
            textTransform: "uppercase", letterSpacing: 0.5 }}>File de revue</div>

          <F2RailButton id="all" active={filterType} setActive={(v) => { setFilterType(v); setActiveIdx(0); }}
            label="Tous types" count={counts.all || 0} />

          {Object.values(types).map(t => (
            counts[t.code] ? (
              <F2RailButton key={t.code} id={t.code} active={filterType}
                setActive={(v) => { setFilterType(v); setActiveIdx(0); }}
                label={t.label} count={counts[t.code]}
                color={t.color} icon={t.icon} />
            ) : null
          ))}

          {/* History recap */}
          <div style={{ padding: "12px 14px 6px", marginTop: 12,
            borderTop: `1px solid ${C_TOKENS.border}`,
            fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
            textTransform: "uppercase", letterSpacing: 0.5,
            display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Historique</span>
            <span style={{ fontFamily: C_TOKENS.mono, color: C_TOKENS.textMuted, fontSize: 9.5 }}>
              {history.length}
            </span>
          </div>
          {history.length === 0 && (
            <div style={{ padding: "0 14px", fontSize: 11, color: C_TOKENS.textMuted, lineHeight: 1.5 }}>
              Vos décisions s'afficheront ici.
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {history.slice(0, 8).map((h, i) => {
              const t = types[h.cluster.type];
              const meta = ACTION_META[h.action];
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8,
                  padding: "5px 14px", fontSize: 11 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 2, background: t.color,
                    color: "#fff", display: "grid", placeItems: "center", fontSize: 9, fontWeight: 700,
                    flexShrink: 0 }}>
                    {t.icon}
                  </div>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    color: C_TOKENS.textMuted }}>
                    {h.cluster.title}
                  </span>
                  <span style={{ fontSize: 9.5, color: meta.color, fontWeight: 600,
                    fontFamily: C_TOKENS.mono }}>
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </aside>

        {/* CENTER — focus card */}
        <main style={{ overflow: "auto", padding: 22, background: C_TOKENS.bg }}>
          {!cluster ? (
            <F2EmptyState count={history.length} />
          ) : (
            <F2FocusCard cluster={cluster} types={types}
              idx={activeIdx} total={visibleQueue.length}
              onValidate={() => decide("validate")}
              onReject={() => decide("reject")}
              onSnooze={() => decide("snooze")}
              onPrev={() => setActiveIdx(i => Math.max(i - 1, 0))}
              onNext={() => setActiveIdx(i => Math.min(i + 1, visibleQueue.length - 1))} />
          )}
        </main>

        {/* RIGHT — queue + shortcuts */}
        <aside style={{ background: "#fff", borderLeft: `1px solid ${C_TOKENS.border}`,
          display: "flex", flexDirection: "column", overflow: "hidden" }}>

          <div style={{ padding: "12px 14px 8px", fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
            textTransform: "uppercase", letterSpacing: 0.5,
            display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Suivants</span>
            <span style={{ fontFamily: C_TOKENS.mono, fontSize: 10, color: C_TOKENS.textSubtle }}>
              <kbd style={f2Kbd}>J</kbd> <kbd style={f2Kbd}>K</kbd>
            </span>
          </div>

          <div style={{ flex: 1, overflow: "auto", paddingBottom: 8 }}>
            {visibleQueue.slice(0, 12).map((c, i) => {
              const t = types[c.type];
              return (
                <button key={c.id} onClick={() => setActiveIdx(i)}
                  style={{ width: "100%", padding: "8px 14px",
                    background: i === activeIdx ? "oklch(0.97 0.03 250)" : "transparent",
                    borderLeft: i === activeIdx ? `3px solid ${C_TOKENS.accent}` : "3px solid transparent",
                    border: "none", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                    display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 8,
                    borderBottom: `1px solid ${C_TOKENS.border}` }}>
                  <div style={{ width: 18, height: 18, borderRadius: 3, background: t.color, color: "#fff",
                    display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700 }}>
                    {t.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: i === activeIdx ? 600 : 500,
                      color: C_TOKENS.text, overflow: "hidden", textOverflow: "ellipsis",
                      whiteSpace: "nowrap", marginBottom: 1 }}>{c.title}</div>
                    <div style={{ fontSize: 10, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>
                      {c.products.length} prod · {window.fmtConfidence(c.confidence)}
                    </div>
                  </div>
                  <div style={{ width: 4, height: 28, borderRadius: 2,
                    background: window.confColor(c.confidence) }} />
                </button>
              );
            })}
            {visibleQueue.length > 12 && (
              <div style={{ padding: "8px 14px", fontSize: 10.5, color: C_TOKENS.textMuted,
                fontFamily: C_TOKENS.mono }}>
                +{visibleQueue.length - 12} clusters en attente…
              </div>
            )}
          </div>

          {/* Shortcuts cheatsheet */}
          <div style={{ padding: "10px 14px", borderTop: `1px solid ${C_TOKENS.border}`,
            background: C_TOKENS.headerBg, flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
              textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Raccourcis</div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 10px",
              fontSize: 10.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>
              <span><kbd style={f2Kbd}>Y</kbd></span><span style={{ color: C_TOKENS.text }}>Valider la liaison</span>
              <span><kbd style={f2Kbd}>N</kbd></span><span style={{ color: C_TOKENS.text }}>Rejeter</span>
              <span><kbd style={f2Kbd}>S</kbd></span><span style={{ color: C_TOKENS.text }}>Reporter</span>
              <span><kbd style={f2Kbd}>U</kbd></span><span style={{ color: C_TOKENS.text }}>Annuler</span>
              <span><kbd style={f2Kbd}>J</kbd>/<kbd style={f2Kbd}>K</kbd></span><span style={{ color: C_TOKENS.text }}>Naviguer</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Status */}
      <div style={{ height: 24, padding: "0 14px", background: C_TOKENS.headerBg,
        borderTop: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 16, fontSize: 11,
        color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, flexShrink: 0 }}>
        <span>Inbox IA <strong style={{ color: C_TOKENS.text }}>v1.2</strong></span>
        <span>{visibleQueue.length} restants · {history.length} traités cette session</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: C_TOKENS.green, fontWeight: 600 }}>● IA en ligne</span>
        <span>M. Lefèvre</span>
      </div>
    </div>
  );
}

const ACTION_META = {
  validate: { label: "✓ validé", color: "oklch(0.45 0.13 145)" },
  reject:   { label: "✗ rejeté", color: "oklch(0.55 0.18 25)" },
  snooze:   { label: "⏱ reporté", color: "oklch(0.55 0.13 90)" },
};

function F2RailButton({ id, active, setActive, label, count, color, icon }) {
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

function F2EmptyState({ count }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 60, textAlign: "center", height: "100%", gap: 16 }}>
      <div style={{ width: 56, height: 56, borderRadius: 14,
        background: "oklch(0.95 0.06 145)", color: "oklch(0.45 0.13 145)",
        display: "grid", placeItems: "center", fontSize: 28 }}>
        ✓
      </div>
      <div>
        <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600 }}>Boîte vide</h3>
        <p style={{ margin: 0, fontSize: 12.5, color: C_TOKENS.textMuted, lineHeight: 1.5, maxWidth: 360 }}>
          Toutes les propositions IA ont été traitées. {count > 0 ? `Vous avez décidé sur ${count} clusters dans cette session.` : ""}
          <br/>L'IA scanne en continu le catalogue — de nouvelles liaisons apparaîtront dès qu'elles seront détectées.
        </p>
      </div>
    </div>
  );
}

function F2FocusCard({ cluster: c, types, idx, total, onValidate, onReject, onSnooze, onPrev, onNext }) {
  const t = types[c.type];
  const conf = window.fmtConfidence(c.confidence);
  const confC = window.confColor(c.confidence);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>

      {/* Position indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
        fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
        fontVariantNumeric: "tabular-nums" }}>
        <button onClick={onPrev} disabled={idx === 0} style={{ ...f2NavBtn, opacity: idx === 0 ? 0.4 : 1 }}>
          <I.chevronLeft size={12} />
        </button>
        <span><strong style={{ color: C_TOKENS.text }}>{idx + 1}</strong> / {total}</span>
        <button onClick={onNext} disabled={idx >= total - 1} style={{ ...f2NavBtn, opacity: idx >= total - 1 ? 0.4 : 1 }}>
          <I.chevronRight size={12} />
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5,
          padding: "2px 8px", background: "#fff",
          border: `1px solid ${C_TOKENS.border}`, borderRadius: 11 }}>
          <I.sparkle size={10} style={{ color: C_TOKENS.accent }} />
          Détecté par IA · {c.detectedAt}
        </span>
      </div>

      {/* Main card */}
      <div style={{ background: "#fff", border: `1px solid ${C_TOKENS.border}`,
        borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>

        {/* Header strip — colored by type */}
        <div style={{ padding: "16px 22px", background: t.soft,
          borderBottom: `1px solid ${C_TOKENS.border}`,
          display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 8, background: t.color, color: "#fff",
            display: "grid", placeItems: "center", fontSize: 22, fontWeight: 700, lineHeight: 1, flexShrink: 0 }}>
            {t.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: t.color,
                textTransform: "uppercase", letterSpacing: 0.5 }}>{t.label}</span>
              <span style={{ fontSize: 10, color: C_TOKENS.textSubtle, fontFamily: C_TOKENS.mono }}>#{c.id}</span>
            </div>
            <h2 style={{ margin: "0 0 3px", fontSize: 17, fontWeight: 600, color: C_TOKENS.text,
              lineHeight: 1.3 }}>{c.title}</h2>
            <p style={{ margin: 0, fontSize: 12, color: C_TOKENS.textMuted, lineHeight: 1.4 }}>
              {t.desc}
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: confC,
              fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {conf}
            </div>
            <div style={{ fontSize: 10, color: C_TOKENS.textMuted, marginTop: 2,
              textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>Confiance</div>
          </div>
        </div>

        {/* Reasoning */}
        <div style={{ padding: "14px 22px", borderBottom: `1px solid ${C_TOKENS.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
            textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8,
            display: "inline-flex", alignItems: "center", gap: 5 }}>
            <I.sparkle size={11} style={{ color: C_TOKENS.accent }} />
            Pourquoi l'IA propose ce regroupement
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none",
            display: "flex", flexDirection: "column", gap: 5 }}>
            {c.rules.map((r, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9,
                fontSize: 12, color: C_TOKENS.text, lineHeight: 1.45 }}>
                <span style={{ color: t.color, fontWeight: 700, fontSize: 13, marginTop: -1 }}>→</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
          {c.reason && (
            <p style={{ margin: "10px 0 0", padding: "9px 12px",
              background: C_TOKENS.headerBg, borderLeft: `3px solid ${t.color}`, borderRadius: 3,
              fontSize: 11.5, color: C_TOKENS.text, lineHeight: 1.5 }}>
              {c.reason}
            </p>
          )}
        </div>

        {/* Members compare grid */}
        <div style={{ padding: "14px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
              textTransform: "uppercase", letterSpacing: 0.5 }}>
              Produits regroupés ({c.products.length})
            </div>
            <button style={f2TabBtn}>
              <I.plus size={11} /> Ajouter au cluster
            </button>
          </div>
          <div style={{ display: "grid",
            gridTemplateColumns: c.products.length <= 2 ? "1fr 1fr"
              : c.products.length <= 3 ? "1fr 1fr 1fr"
              : "1fr 1fr 1fr 1fr",
            gap: 8 }}>
            {c.products.map((p, i) => (
              <F2MemberCard key={p.id} p={p} primary={i === 0} type={t} cluster={c}
                main={c.products[0]} />
            ))}
          </div>
        </div>
      </div>

      {/* Decision bar */}
      <div style={{ marginTop: 16, padding: 14, background: "#fff",
        border: `1px solid ${C_TOKENS.border}`, borderRadius: 8,
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8, alignItems: "center" }}>
        <button onClick={onValidate}
          style={{ padding: "10px 14px", background: "oklch(0.50 0.14 145)", color: "#fff",
            border: "none", borderRadius: 5, fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <I.check size={14} /> Valider · {t.action}
          <kbd style={f2KbdLight}>Y</kbd>
        </button>
        <button onClick={onSnooze}
          style={{ padding: "10px 14px", background: "#fff", color: C_TOKENS.text,
            border: `1px solid ${C_TOKENS.border}`, borderRadius: 5, fontSize: 13, fontWeight: 500,
            cursor: "pointer", fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          ⏱ Reporter <kbd style={f2Kbd}>S</kbd>
        </button>
        <button onClick={onReject}
          style={{ padding: "10px 14px", background: "#fff", color: "oklch(0.45 0.18 25)",
            border: `1px solid oklch(0.85 0.06 25)`, borderRadius: 5, fontSize: 13, fontWeight: 500,
            cursor: "pointer", fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <I.x size={13} /> Rejeter <kbd style={f2Kbd}>N</kbd>
        </button>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 8px" }}>
          <span style={{ fontSize: 10, color: C_TOKENS.textMuted, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: 0.5 }}>Suivant</span>
          <button onClick={onNext} style={{ ...f2NavBtn, marginTop: 2 }}>
            <I.chevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function F2MemberCard({ p, primary, type, cluster, main }) {
  const t = type;
  const isMaster = primary && cluster.type === "doublon";
  const isDup = cluster.type === "doublon" && !primary;

  return (
    <div style={{
      border: `1px solid ${isMaster ? t.color : C_TOKENS.border}`,
      borderTop: `3px solid ${isMaster ? t.color : isDup ? "oklch(0.80 0.10 25)" : C_TOKENS.border}`,
      borderRadius: 5,
      background: isDup ? "oklch(0.99 0.01 25)" : "#fff",
      padding: 10,
      display: "flex", flexDirection: "column", gap: 7,
      opacity: p.status === "duplicate" || p.status === "archived" ? 0.7 : 1 }}>

      {/* glyph + badges */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <div style={{ width: 44, height: 44, borderRadius: 5,
          background: C_TOKENS.headerBg, border: `1px solid ${C_TOKENS.border}`,
          display: "grid", placeItems: "center", fontSize: 26, lineHeight: 1, flexShrink: 0 }}>
          {p.glyph}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", marginBottom: 2 }}>
            {isMaster && (
              <span style={{ fontSize: 9, padding: "1px 5px",
                background: t.color, color: "#fff", borderRadius: 2, fontWeight: 700,
                letterSpacing: 0.3 }}>MAÎTRE</span>
            )}
            {p.status === "duplicate" && (
              <span style={{ fontSize: 9, padding: "1px 5px",
                background: C_TOKENS.redSoft, color: C_TOKENS.red, borderRadius: 2,
                fontWeight: 700 }}>DOUBLON</span>
            )}
            {p.status === "archived" && (
              <span style={{ fontSize: 9, padding: "1px 5px",
                background: C_TOKENS.headerBg, color: C_TOKENS.textMuted, borderRadius: 2,
                fontWeight: 700 }}>ARCHIVÉ</span>
            )}
            {p.enseigne && (
              <span style={{ fontSize: 9, padding: "1px 5px",
                background: C_TOKENS.headerBg, color: C_TOKENS.textMuted, borderRadius: 2,
                fontWeight: 600 }}>{p.enseigne}</span>
            )}
            {(p.labels || []).map(l => (
              <span key={l} style={{ fontSize: 9, padding: "1px 5px",
                background: "oklch(0.95 0.05 145)", color: "oklch(0.40 0.12 145)", borderRadius: 2,
                fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>{l}</span>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C_TOKENS.text,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.brand}</div>
        </div>
      </div>

      <div style={{ fontSize: 11.5, color: C_TOKENS.text, lineHeight: 1.3,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        overflow: "hidden" }}>
        {p.name}
      </div>

      {/* tabular data */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3px 8px",
        fontSize: 10.5, fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>
        <span style={{ color: C_TOKENS.textMuted }}>EAN</span>
        <span style={{ color: C_TOKENS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {p.ean}
        </span>
        <span style={{ color: C_TOKENS.textMuted }}>Format</span>
        <span style={{ color: C_TOKENS.text }}>{p.fmt}</span>
        {p.price != null && (
          <>
            <span style={{ color: C_TOKENS.textMuted }}>Prix</span>
            <span style={{ color: C_TOKENS.text, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 6 }}>
              {p.price.toFixed(2).replace(".", ",")} €
              {p.pricePerKg && main.pricePerKg && p !== main && (
                <PriceDeltaF2 a={main.pricePerKg} b={p.pricePerKg} />
              )}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function PriceDeltaF2({ a, b }) {
  const d = ((b - a) / a) * 100;
  if (Math.abs(d) < 0.5) return null;
  const up = d > 0;
  return (
    <span style={{
      color: up ? C_TOKENS.red : C_TOKENS.green,
      fontWeight: 700, fontSize: 9.5,
      padding: "1px 4px", borderRadius: 2,
      background: up ? C_TOKENS.redSoft : C_TOKENS.greenSoft,
    }}>
      {up ? "▲" : "▼"} {Math.abs(d).toFixed(0)}%
    </span>
  );
}

const f2TabBtn = { display: "inline-flex", alignItems: "center", gap: 5,
  padding: "4px 10px", height: 26, fontSize: 11.5, fontFamily: "inherit",
  background: "#fff", color: C_TOKENS.text, border: `1px solid ${C_TOKENS.border}`,
  borderRadius: 3, cursor: "pointer" };

const f2NavBtn = { width: 24, height: 24, padding: 0, display: "inline-flex",
  alignItems: "center", justifyContent: "center",
  background: "#fff", border: `1px solid ${C_TOKENS.border}`,
  borderRadius: 4, cursor: "pointer", color: C_TOKENS.text };

const f2Kbd = { fontFamily: C_TOKENS.mono, fontSize: 10, padding: "1px 5px",
  background: C_TOKENS.headerBg, border: `1px solid ${C_TOKENS.border}`,
  borderRadius: 3, color: C_TOKENS.text, fontWeight: 600, marginLeft: 4 };

const f2KbdLight = { fontFamily: C_TOKENS.mono, fontSize: 10, padding: "1px 5px",
  background: "rgba(255,255,255,.25)", border: "1px solid rgba(255,255,255,.4)",
  borderRadius: 3, color: "#fff", fontWeight: 600, marginLeft: 4 };

window.LinksF2 = LinksF2;
