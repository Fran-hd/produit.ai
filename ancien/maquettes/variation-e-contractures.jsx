// Variation E — Dictionnaire de contractures (onglet dédié)
// Full-screen workspace pour gérer le dictionnaire des abréviations.
// Tableau éditable + ajout / catégories / scope / test.

function ContracturesE() {
  const [search, setSearch] = React.useState("");
  const [activeCat, setActiveCat] = React.useState("all");
  const [editingId, setEditingId] = React.useState(2);
  const [testText, setTestText] = React.useState("Paquet de 6 sachets de pâtes à tartiner Chocolat noisettes — sans huile de palme");

  const initial = (window.CONTRACTURES_INITIAL || []).map(r => ({
    ...r,
    scope: [...r.scope],
    // Three length variants. If the dataset doesn't define them yet, derive
    // sensible defaults: re-use `short` when it fits the budget, otherwise
    // truncate `full` to N chars. Users can override per cell.
    short9: r.short9 != null ? r.short9 : (r.short.length <= 9 ? r.full.length <= 9 ? r.full : r.short : r.full.slice(0, 9)),
    short6: r.short6 != null ? r.short6 : (r.short.length <= 6 ? r.short : r.full.slice(0, 6)),
    short3: r.short3 != null ? r.short3 : (r.short.length <= 3 ? r.short : r.full.slice(0, 3)),
  }));

  const [rows, setRows] = React.useState(initial);

  const cats = [
    { id: "all", l: "Toutes", n: rows.length },
    { id: "Conditionnement", l: "Conditionnement", n: rows.filter(r => r.cat === "Conditionnement").length, color: C_TOKENS.amber },
    { id: "Mots de liaison", l: "Mots de liaison", n: rows.filter(r => r.cat === "Mots de liaison").length, color: "oklch(0.55 0.04 280)" },
    { id: "Qualificatifs", l: "Qualificatifs", n: rows.filter(r => r.cat === "Qualificatifs").length, color: C_TOKENS.green },
    { id: "Saveurs", l: "Saveurs", n: rows.filter(r => r.cat === "Saveurs").length, color: "oklch(0.55 0.12 290)" },
    { id: "Unités", l: "Unités", n: rows.filter(r => r.cat === "Unités").length, color: C_TOKENS.accent },
  ];

  const filtered = rows.filter(r =>
    (activeCat === "all" || r.cat === activeCat) &&
    (search === "" || r.full.toLowerCase().includes(search.toLowerCase()) || r.short.toLowerCase().includes(search.toLowerCase()))
  );

  // Apply contractures to test text
  function applyTo(text) {
    let out = text;
    const matches = [];
    rows.forEach(r => {
      const re = new RegExp(`\\b${r.full}\\b`, "gi");
      if (re.test(out)) {
        matches.push(r);
        out = out.replace(re, r.short);
      }
    });
    return { out, matches };
  }
  const tested = applyTo(testText);

  const catColor = (cat) => cats.find(c => c.id === cat)?.color || C_TOKENS.textMuted;

  function toggleScope(id, scope) {
    setRows(rs => rs.map(r => r.id === id ? { ...r, scope: r.scope.includes(scope) ? r.scope.filter(s => s !== scope) : [...r.scope, scope] } : r));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C_TOKENS.bg, fontFamily: C_TOKENS.font, color: C_TOKENS.text, fontSize: 12 }}>
      {/* Top bar */}
      <div style={{ height: 38, padding: "0 14px", background: C_TOKENS.headerBg, borderBottom: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0, whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: C_TOKENS.accent, color: "#fff",
            display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>P</div>
          <span style={{ fontWeight: 600 }}>Produit.ai</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 4px" }}>/</span>
          <span style={{ color: C_TOKENS.textMuted }}>Référentiels</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 2px" }}>›</span>
          <span style={{ fontWeight: 500 }}>Dictionnaire des contractures</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>v3.2 · {rows.length} entrées</span>
        <div style={{ width: 1, height: 18, background: C_TOKENS.border }} />
        <button style={tabBtn}><I.upload size={11} /> Importer</button>
        <button style={tabBtn}><I.download size={11} /> Exporter</button>
        <button style={{ ...tabBtn, background: C_TOKENS.accent, color: "#fff", border: "none" }}>
          <I.check size={11} /> Publier
        </button>
      </div>

      {/* Top-level tabs (so user lands on Contractures tab in a Référentiels module) */}
      <div style={{ height: 32, padding: "0 14px", background: "#fff", borderBottom: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", flexShrink: 0, whiteSpace: "nowrap" }}>
        {[
          { l: "Marques" }, { l: "Catégories" }, { l: "Unités de mesure" },
          { l: "Contractures", count: rows.length, active: true },
          { l: "Allergènes" }, { l: "Labels & certifications" },
        ].map(t => (
          <button key={t.l} style={{ padding: "0 14px", height: 32, background: "transparent", border: "none",
            fontSize: 12, color: t.active ? C_TOKENS.accentText : C_TOKENS.textMuted,
            fontWeight: t.active ? 600 : 400, fontFamily: "inherit", cursor: "pointer",
            borderBottom: t.active ? `2px solid ${C_TOKENS.accent}` : "2px solid transparent",
            display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
            {t.l}
            {t.count != null && <span style={{ fontSize: 10, padding: "0 5px", background: C_TOKENS.headerBg, color: C_TOKENS.textMuted, borderRadius: 2, fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Body : 3 columns — categories nav | table | inspector */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "220px minmax(0, 1fr) 320px", overflow: "hidden" }}>

        {/* LEFT — categories */}
        <div style={{ background: "#fff", borderRight: `1px solid ${C_TOKENS.border}`, overflow: "auto", padding: "12px 0" }}>
          <div style={{ padding: "0 14px 8px", fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
            textTransform: "uppercase", letterSpacing: 0.5 }}>Catégories</div>
          {cats.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)}
              style={{ width: "100%", padding: "8px 14px", display: "flex", alignItems: "center", gap: 9,
                background: activeCat === c.id ? C_TOKENS.accentSoft : "transparent",
                borderLeft: activeCat === c.id ? `3px solid ${C_TOKENS.accent}` : "3px solid transparent",
                border: "none", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
              {c.color
                ? <div style={{ width: 8, height: 8, borderRadius: 1, background: c.color, flexShrink: 0 }} />
                : <I.list size={11} style={{ color: C_TOKENS.textMuted }} />}
              <span style={{ flex: 1, fontSize: 12, fontWeight: activeCat === c.id ? 600 : 500,
                color: activeCat === c.id ? C_TOKENS.accentText : C_TOKENS.text }}>{c.l}</span>
              <span style={{ fontSize: 10.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>{c.n}</span>
            </button>
          ))}
          <div style={{ padding: "10px 14px", marginTop: 6, borderTop: `1px solid ${C_TOKENS.border}` }}>
            <button style={{ width: "100%", padding: "6px 10px", background: "#fff",
              border: `1px dashed ${C_TOKENS.border}`, borderRadius: 3, fontSize: 11.5, color: C_TOKENS.textMuted,
              fontFamily: "inherit", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
              <I.plus size={11} /> Catégorie
            </button>
          </div>

          {/* Quick stats */}
          <div style={{ padding: "12px 14px", marginTop: 10, borderTop: `1px solid ${C_TOKENS.border}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
              textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Statistiques</div>
            {[
              { l: "Système", v: rows.filter(r => r.system).length, c: C_TOKENS.accent },
              { l: "Personnalisées", v: rows.filter(r => !r.system).length, c: C_TOKENS.green },
              { l: "Verrouillées", v: rows.filter(r => r.locked).length, c: C_TOKENS.amber },
              { l: "Usages totaux", v: rows.reduce((a, b) => a + b.usage, 0).toLocaleString("fr"), c: C_TOKENS.text },
            ].map(s => (
              <div key={s.l} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 11.5 }}>
                <span style={{ color: C_TOKENS.textMuted }}>{s.l}</span>
                <span style={{ fontFamily: C_TOKENS.mono, color: s.c, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER — table */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", background: C_TOKENS.bg }}>
          {/* Toolbar */}
          <div style={{ height: 44, padding: "0 14px", background: "#fff", borderBottom: `1px solid ${C_TOKENS.border}`,
            display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
              <I.search size={12} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: C_TOKENS.textSubtle }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une contracture (mot complet ou abréviation)…"
                style={{ width: "100%", padding: "6px 10px 6px 28px", border: `1px solid ${C_TOKENS.border}`,
                  borderRadius: 3, fontSize: 12, fontFamily: "inherit", outline: "none" }} />
            </div>
            <button style={tabBtn}><I.filter size={11} /> Filtres</button>
            <button style={tabBtn}><I.sort size={11} /> Trier par usage</button>
            <div style={{ width: 1, height: 22, background: C_TOKENS.border, margin: "0 4px" }} />
            <button style={{ ...tabBtn, background: C_TOKENS.accent, color: "#fff", border: "none" }}>
              <I.plus size={11} /> Nouvelle contracture
            </button>
          </div>

          {/* Table */}
          <div style={{ flex: 1, overflow: "auto", background: "#fff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: 32 }} />
                <col style={{ width: 140 }} />
                <col style={{ width: 130 }} />
                <col style={{ width: 110 }} />
                <col style={{ width: 90 }} />
                <col />
              </colgroup>
              <thead>
                <tr style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <th style={th()}><input type="checkbox" /></th>
                  <th style={th()}>Mot complet</th>
                  <th style={th()}>Contracture · 9 car.</th>
                  <th style={th()}>Contracture · 6 car.</th>
                  <th style={th()}>Contracture · 3 car.</th>
                  <th style={th()}>Catégorie</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const isEditing = r.id === editingId;
                  return (
                    <tr key={r.id} onClick={() => setEditingId(r.id)}
                      style={{ background: isEditing ? "oklch(0.97 0.03 250)" : (i % 2 ? C_TOKENS.rowAlt : "#fff"),
                        cursor: "pointer", borderLeft: isEditing ? `2px solid ${C_TOKENS.accent}` : "2px solid transparent" }}>
                      <td style={td()} onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                      <td style={{ ...td(), fontWeight: 500, color: C_TOKENS.text }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          {r.locked && <I.lock size={10} style={{ color: C_TOKENS.textSubtle }} />}
                          {r.full}
                          {r.system && <span style={{ fontSize: 9, padding: "0 4px", background: C_TOKENS.headerBg, color: C_TOKENS.textSubtle, borderRadius: 2, fontWeight: 500, letterSpacing: 0.3 }}>SYS</span>}
                        </span>
                      </td>
                      <ContractureCell row={r} field="short9" max={9} setRows={setRows} />
                      <ContractureCell row={r} field="short6" max={6} setRows={setRows} />
                      <ContractureCell row={r} field="short3" max={3} setRows={setRows} />
                      <td style={td()}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <div style={{ width: 6, height: 6, borderRadius: 1, background: catColor(r.cat) }} />
                          <span style={{ color: C_TOKENS.text }}>{r.cat}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT — inspector / detail panel */}
        <Inspector
          row={rows.find(x => x.id === editingId) || rows[0]}
          cats={cats}
          setRows={setRows}
          toggleScope={toggleScope}
        />
      </div>

      {/* TEST BAR — bottom */}
      <div style={{ background: "#fff", borderTop: `1px solid ${C_TOKENS.border}`, padding: "10px 14px", display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
          textTransform: "uppercase", letterSpacing: 0.5, flexShrink: 0 }}>Tester :</div>
        <input value={testText} onChange={e => setTestText(e.target.value)}
          style={{ flex: 1, padding: "6px 10px", border: `1px solid ${C_TOKENS.border}`, borderRadius: 3,
            fontSize: 12, fontFamily: "inherit", outline: "none" }} />
        <I.chevronRight size={12} style={{ color: C_TOKENS.textSubtle }} />
        <div style={{ flex: 1, padding: "6px 10px", border: `1px solid ${C_TOKENS.green}`, background: C_TOKENS.greenSoft,
          borderRadius: 3, fontSize: 12, color: C_TOKENS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {tested.out}
        </div>
        <span style={{ fontFamily: C_TOKENS.mono, fontSize: 11, color: C_TOKENS.textMuted, whiteSpace: "nowrap" }}>
          {testText.length} → <strong style={{ color: "oklch(0.4 0.13 145)" }}>{tested.out.length}</strong>
          <span style={{ color: C_TOKENS.green, marginLeft: 4 }}>(−{testText.length - tested.out.length}c)</span>
        </span>
        <span style={{ fontSize: 11, color: C_TOKENS.textMuted, whiteSpace: "nowrap" }}>
          {tested.matches.length} contracture{tested.matches.length > 1 ? "s" : ""} appliquée{tested.matches.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Status */}
      <div style={{ height: 24, padding: "0 14px", background: C_TOKENS.headerBg, borderTop: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, flexShrink: 0 }}>
        <span>Dictionnaire <strong style={{ color: C_TOKENS.text }}>fr-FR · v3.2</strong></span>
        <span>{rows.length} entrées · {filtered.length} affichées</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: C_TOKENS.amber, fontWeight: 600 }}>● 2 modifs non publiées</span>
        <span>M. Lefèvre · à l'instant</span>
      </div>
    </div>
  );
}

function Inspector({ row: r, cats, setRows, toggleScope }) {
  const [tab, setTab] = React.useState("variantes");
  const channels = [
    { id: "étagère", l: "Étiquette gondole", short: "Gondole", limit: 32 },
    { id: "caisse",  l: "Caisse / TPE",       short: "Caisse",  limit: 24 },
    { id: "site",    l: "Site marchand",      short: "Site",    limit: 80 },
    { id: "long",    l: "Marketing long",     short: "Long",    limit: 240 },
  ];

  return (
    <aside style={{ background: "#fff", borderLeft: `1px solid ${C_TOKENS.border}`,
      overflow: "hidden", display: "flex", flexDirection: "column", minWidth: 0 }}>

      {/* Header */}
      <header style={{ padding: "12px 14px", borderBottom: `1px solid ${C_TOKENS.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: C_TOKENS.textMuted,
            textTransform: "uppercase", letterSpacing: 0.5 }}>Édition · #{r.id}</span>
          <span style={{ flex: 1 }} />
          {r.locked && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3,
              fontSize: 10, color: C_TOKENS.amber, fontWeight: 600 }}>
              <I.lock size={9} /> Verrouillé
            </span>
          )}
        </div>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: C_TOKENS.text,
          lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis" }}>
          {r.full}
        </h2>
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8,
          fontSize: 10.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
          fontVariantNumeric: "tabular-nums" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 1,
              background: cats.find(c => c.id === r.cat)?.color || C_TOKENS.textMuted }} />
            {r.cat}
          </span>
          <span style={{ color: C_TOKENS.textSubtle }}>·</span>
          <span>{r.system ? "système" : "perso"}</span>
          <span style={{ color: C_TOKENS.textSubtle }}>·</span>
          <span>{r.usage.toLocaleString("fr")} usages</span>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{ display: "flex", borderBottom: `1px solid ${C_TOKENS.border}`,
        background: C_TOKENS.headerBg, flexShrink: 0 }}>
        {[
          { id: "variantes", l: "Variantes" },
          { id: "regles",    l: "Règles" },
          { id: "canaux",    l: "Canaux", n: r.scope.length },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: "8px 0", height: 32, background: tab === t.id ? "#fff" : "transparent",
              border: "none", borderBottom: tab === t.id ? `2px solid ${C_TOKENS.accent}` : "2px solid transparent",
              fontSize: 11.5, fontWeight: tab === t.id ? 600 : 500,
              color: tab === t.id ? C_TOKENS.accentText : C_TOKENS.textMuted,
              fontFamily: "inherit", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            {t.l}
            {t.n != null && (
              <span style={{ fontSize: 9.5, padding: "0 4px", background: tab === t.id ? C_TOKENS.accentSoft : "#fff",
                color: tab === t.id ? C_TOKENS.accentText : C_TOKENS.textMuted,
                borderRadius: 2, fontFamily: C_TOKENS.mono,
                border: `1px solid ${C_TOKENS.border}` }}>{t.n}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Body — scrollable */}
      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>

        {tab === "variantes" && (
          <div style={{ padding: 14 }}>
            <InspLabel>Mot complet</InspLabel>
            <input defaultValue={r.full} disabled={r.locked}
              style={{ ...inp(r.locked), marginBottom: 14 }} />

            <InspLabel hint={`${r.full.length} car. au total`}>Variantes courtes</InspLabel>
            <div style={{ border: `1px solid ${C_TOKENS.border}`, borderRadius: 4, overflow: "hidden" }}>
              {[
                { f: "short9", max: 9 },
                { f: "short6", max: 6 },
                { f: "short3", max: 3 },
              ].map(({ f, max }, i) => {
                const v = r[f] || "";
                const over = v.length > max;
                const exact = v.length === max;
                const saved = r.full.length - v.length;
                return (
                  <div key={f} style={{ display: "grid", gridTemplateColumns: "44px 1fr 60px",
                    alignItems: "center",
                    borderTop: i ? `1px solid ${C_TOKENS.border}` : "none",
                    background: over ? "oklch(0.985 0.02 30)" : "#fff" }}>
                    <div style={{ padding: "0 0 0 10px", fontSize: 11, fontWeight: 600,
                      color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
                      fontVariantNumeric: "tabular-nums" }}>
                      {max}c
                    </div>
                    <input
                      defaultValue={v}
                      disabled={r.locked}
                      key={`${r.id}-${f}-${v}`}
                      maxLength={max + 4}
                      onBlur={e => {
                        const nv = e.currentTarget.value.trim();
                        if (nv !== v) setRows(rs => rs.map(x => x.id === r.id ? { ...x, [f]: nv } : x));
                      }}
                      onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
                      style={{
                        width: "100%", boxSizing: "border-box",
                        padding: "8px 8px", fontSize: 13,
                        fontFamily: C_TOKENS.mono, fontWeight: 700,
                        color: over ? C_TOKENS.red : C_TOKENS.accentText,
                        background: "transparent",
                        border: "none", borderLeft: `1px solid ${C_TOKENS.border}`,
                        borderRight: `1px solid ${C_TOKENS.border}`,
                        outline: "none",
                      }}
                    />
                    <div style={{ padding: "0 10px 0 0", textAlign: "right",
                      fontSize: 10.5, fontFamily: C_TOKENS.mono,
                      fontVariantNumeric: "tabular-nums",
                      color: over ? C_TOKENS.red : (saved > 0 ? "oklch(0.45 0.13 145)" : C_TOKENS.textSubtle),
                      fontWeight: over || exact ? 700 : 500 }}>
                      {over
                        ? `+${v.length - max}`
                        : (exact ? `${v.length}/${max}` : (saved > 0 ? `−${saved}c` : `${v.length}/${max}`))}
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 10.5, color: C_TOKENS.textSubtle, lineHeight: 1.45 }}>
              Le moteur choisit la plus longue variante qui rentre dans le budget du canal.
            </p>
          </div>
        )}

        {tab === "regles" && (
          <div style={{ padding: 14 }}>
            <InspLabel>Catégorie</InspLabel>
            <select defaultValue={r.cat}
              style={{ ...inp(false), appearance: "none", marginBottom: 14,
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%235b6068' fill='none' stroke-width='1.5'/></svg>")`,
                backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", paddingRight: 22 }}>
              {cats.filter(c => c.id !== "all").map(c => <option key={c.id}>{c.l}</option>)}
            </select>

            <InspLabel>Casse</InspLabel>
            <Segmented name="case" defaultValue="ins" options={[
              { id: "ins",  l: "Insensible" },
              { id: "sens", l: "Sensible" },
            ]} />

            <div style={{ height: 12 }} />

            <InspLabel>Mode de remplacement</InspLabel>
            <Segmented name="match" defaultValue="word" options={[
              { id: "word", l: "Mot entier" },
              { id: "any",  l: "Substring" },
            ]} />

            <div style={{ height: 14 }} />

            <details style={{ fontSize: 11.5, color: C_TOKENS.textMuted }}>
              <summary style={{ cursor: "pointer", padding: "6px 0", fontWeight: 500,
                color: C_TOKENS.text }}>Synonymes & exclusions</summary>
              <div style={{ paddingTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                <div>
                  <InspLabel>Synonymes</InspLabel>
                  <input placeholder="ex: paquet, pqt, pkt"
                    style={inp(false)} />
                </div>
                <div>
                  <InspLabel>Ne pas appliquer si suivi de</InspLabel>
                  <input placeholder="ex: cadeau, surprise"
                    style={inp(false)} />
                </div>
              </div>
            </details>
          </div>
        )}

        {tab === "canaux" && (
          <div style={{ padding: 14 }}>
            <InspLabel hint={`${r.scope.length}/${channels.length} actifs`}>
              Canaux où appliquer
            </InspLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {channels.map(s => {
                const on = r.scope.includes(s.id);
                return (
                  <label key={s.id}
                    style={{ display: "grid", gridTemplateColumns: "16px 1fr auto",
                      alignItems: "center", gap: 9,
                      padding: "9px 10px",
                      border: `1px solid ${on ? C_TOKENS.accent : C_TOKENS.border}`,
                      borderRadius: 4,
                      background: on ? C_TOKENS.accentSoft : "#fff",
                      cursor: "pointer" }}>
                    <input type="checkbox" checked={on}
                      onChange={() => toggleScope(r.id, s.id)}
                      style={{ margin: 0, accentColor: C_TOKENS.accent }} />
                    <span style={{ fontSize: 12, color: C_TOKENS.text,
                      fontWeight: on ? 600 : 500, minWidth: 0,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {s.l}
                    </span>
                    <span style={{ fontFamily: C_TOKENS.mono, fontSize: 10,
                      color: C_TOKENS.textMuted, fontVariantNumeric: "tabular-nums" }}>
                      {s.limit}c
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <footer style={{ padding: "10px 14px", borderTop: `1px solid ${C_TOKENS.border}`,
        background: C_TOKENS.headerBg, display: "flex", gap: 6, flexShrink: 0 }}>
        <button style={{ flex: 1, padding: "7px 10px", background: C_TOKENS.accent, color: "#fff",
          border: "none", borderRadius: 3, fontSize: 12, fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit" }}>
          Enregistrer
        </button>
        <button title="Dupliquer" style={iconBtn}>
          <I.copy size={12} />
        </button>
        <button title={r.locked ? "Verrouillé" : "Supprimer"}
          style={{ ...iconBtn, color: r.locked ? C_TOKENS.textSubtle : C_TOKENS.red,
            cursor: r.locked ? "not-allowed" : "pointer", opacity: r.locked ? 0.5 : 1 }}>
          <I.trash size={12} />
        </button>
      </footer>
    </aside>
  );
}

function InspLabel({ children, hint }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between",
      marginBottom: 6 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: C_TOKENS.textMuted,
        textTransform: "uppercase", letterSpacing: 0.5 }}>{children}</span>
      {hint && (
        <span style={{ fontSize: 10, color: C_TOKENS.textSubtle, fontFamily: C_TOKENS.mono,
          fontVariantNumeric: "tabular-nums" }}>{hint}</span>
      )}
    </div>
  );
}

function Segmented({ name, defaultValue, options }) {
  const [v, setV] = React.useState(defaultValue);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      border: `1px solid ${C_TOKENS.border}`, borderRadius: 4, overflow: "hidden",
      background: "#fff" }}>
      {options.map((o, i) => {
        const active = v === o.id;
        return (
          <button key={o.id} type="button" onClick={() => setV(o.id)}
            style={{ padding: "7px 8px", fontSize: 11.5,
              fontWeight: active ? 600 : 500, fontFamily: "inherit",
              background: active ? C_TOKENS.accentSoft : "#fff",
              color: active ? C_TOKENS.accentText : C_TOKENS.textMuted,
              border: "none",
              borderLeft: i ? `1px solid ${C_TOKENS.border}` : "none",
              cursor: "pointer", whiteSpace: "nowrap",
              overflow: "hidden", textOverflow: "ellipsis" }}>
            {o.l}
          </button>
        );
      })}
    </div>
  );
}

const iconBtn = { width: 30, height: 28, padding: 0, display: "inline-flex",
  alignItems: "center", justifyContent: "center",
  background: "#fff", border: `1px solid ${C_TOKENS.border}`,
  borderRadius: 3, cursor: "pointer", color: C_TOKENS.text };

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: C_TOKENS.textMuted, textTransform: "uppercase",
        letterSpacing: 0.4, marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

function ContractureCell({ row, field, max, setRows }) {
  const value = row[field] != null ? row[field] : "";
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const inputRef = React.useRef(null);

  React.useEffect(() => { if (editing && inputRef.current) inputRef.current.select(); }, [editing]);

  const over = value.length > max;
  const exact = value.length === max;
  const saved = row.full.length - value.length;

  function commit() {
    const v = draft.trim();
    if (v !== value) {
      setRows(rs => rs.map(r => r.id === row.id ? { ...r, [field]: v } : r));
    }
    setEditing(false);
  }
  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  return (
    <td style={td()} onClick={e => { e.stopPropagation(); if (!row.locked && !editing) { setDraft(value); setEditing(true); } }}>
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value.slice(0, max + 4))}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === "Enter") { e.preventDefault(); commit(); }
            else if (e.key === "Escape") { e.preventDefault(); cancel(); }
          }}
          maxLength={max + 4}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "2px 6px", fontSize: 11.5,
            fontFamily: C_TOKENS.mono, fontWeight: 700,
            color: over ? C_TOKENS.red : C_TOKENS.accentText,
            background: over ? "oklch(0.97 0.04 30)" : C_TOKENS.accentSoft,
            border: `1px solid ${over ? C_TOKENS.red : C_TOKENS.accent}`,
            borderRadius: 2, outline: "none",
          }}
        />
      ) : (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: row.locked ? "not-allowed" : "text" }}
             title={row.locked ? "Verrouillé" : `Cliquer pour modifier · max ${max} car.`}>
          <span style={{
            fontFamily: C_TOKENS.mono, fontWeight: 700,
            color: over ? C_TOKENS.red : C_TOKENS.accentText,
            background: over ? "oklch(0.97 0.04 30)" : C_TOKENS.accentSoft,
            padding: "2px 8px", borderRadius: 3, fontSize: 11.5,
            border: `1px solid ${over ? C_TOKENS.red : "transparent"}`,
            opacity: row.locked ? 0.65 : 1,
          }}>{value || <span style={{ opacity: 0.4 }}>—</span>}</span>
          <span style={{
            color: over ? "#fff" : (saved > 0 ? "oklch(0.32 0.14 145)" : C_TOKENS.textSubtle),
            background: over ? C_TOKENS.red : (saved > 0 ? "oklch(0.92 0.10 145)" : "transparent"),
            border: saved > 0 && !over ? `1px solid oklch(0.78 0.12 145)` : "1px solid transparent",
            padding: saved > 0 || over ? "1px 6px" : 0,
            borderRadius: 3,
            fontSize: 11, fontFamily: C_TOKENS.mono,
            fontVariantNumeric: "tabular-nums",
            fontWeight: 700,
            letterSpacing: 0.2,
          }}>
            {over ? `+${value.length - max}c` : `−${saved}c`}
          </span>
        </div>
      )}
    </td>
  );
}

const inp = (locked) => ({ width: "100%", padding: "6px 9px", border: `1px solid ${C_TOKENS.border}`,
  borderRadius: 3, fontSize: 12, fontFamily: "inherit", outline: "none",
  background: locked ? "#fafbfc" : "#fff", color: locked ? C_TOKENS.textMuted : C_TOKENS.text });

const tabBtn = { display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", height: 26,
  fontSize: 11.5, fontFamily: "inherit", background: "#fff", color: C_TOKENS.text,
  border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, cursor: "pointer" };

const th = () => ({ padding: "7px 10px", height: 30, background: C_TOKENS.headerBg,
  borderBottom: `1px solid ${C_TOKENS.border}`,
  fontSize: 10.5, fontWeight: 600, color: C_TOKENS.textMuted, textAlign: "left",
  letterSpacing: 0.4, textTransform: "uppercase" });

const td = () => ({ padding: "7px 10px", borderBottom: `1px solid ${C_TOKENS.border}`,
  color: C_TOKENS.text, whiteSpace: "nowrap", verticalAlign: "middle" });

window.ContracturesE = ContracturesE;
