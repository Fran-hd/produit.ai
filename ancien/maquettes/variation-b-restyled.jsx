// Variation B (v2) — Restyled with C's data-dense aesthetic
// Cleaner layout: 2-column main + sidebar, no cramped wrapping.

function PillBC({ children, color = "neutral", style }) {
  const c = {
    neutral: { bg: "#f1f2f4", color: C_TOKENS.text, border: C_TOKENS.border },
    accent: { bg: C_TOKENS.accentSoft, color: C_TOKENS.accentText, border: "transparent" },
    green: { bg: C_TOKENS.greenSoft, color: "oklch(0.35 0.13 145)", border: "transparent" },
    amber: { bg: C_TOKENS.amberSoft, color: "oklch(0.42 0.13 70)", border: "transparent" },
    red: { bg: C_TOKENS.redSoft, color: "oklch(0.4 0.16 25)", border: "transparent" },
  }[color];
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "1px 7px",
    background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: 3,
    fontSize: 11, fontWeight: 500, whiteSpace: "nowrap", ...style }}>{children}</span>;
}

function SectionBC({ title, count, action, children, padded = true, style }) {
  return (
    <section style={{ background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 4, ...style }}>
      <header style={{ height: 32, padding: "0 12px", borderBottom: `1px solid ${C_TOKENS.border}`,
        background: C_TOKENS.headerBg, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontWeight: 600, color: C_TOKENS.text, letterSpacing: 0.2 }}>{title}</span>
          {count != null && <span style={{ color: C_TOKENS.textMuted, fontVariantNumeric: "tabular-nums" }}>· {count}</span>}
        </div>
        <div style={{ display: "flex", gap: 4 }}>{action}</div>
      </header>
      <div style={padded ? { padding: 12 } : null}>{children}</div>
    </section>
  );
}

function MiniBtnBC({ children, primary, style, ...rest }) {
  return (
    <button {...rest} style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 8px", height: 22, fontSize: 11.5, fontFamily: "inherit", whiteSpace: "nowrap",
      background: primary ? C_TOKENS.accent : "#fff",
      color: primary ? "#fff" : C_TOKENS.text,
      border: `1px solid ${primary ? C_TOKENS.accent : C_TOKENS.border}`,
      borderRadius: 3, cursor: "pointer", ...style
    }}>{children}</button>
  );
}

const thBC = (w, align = "left") => ({
  padding: "5px 10px", height: 28, background: C_TOKENS.headerBg,
  borderBottom: `1px solid ${C_TOKENS.border}`,
  fontSize: 10.5, fontWeight: 600, color: C_TOKENS.textMuted, textAlign: align,
  letterSpacing: 0.4, textTransform: "uppercase", width: w,
});
const tdBC = () => ({ padding: "7px 10px", borderBottom: `1px solid ${C_TOKENS.border}`,
  color: C_TOKENS.text, whiteSpace: "nowrap" });

// HERO — single horizontal block, no wrap
function HeroBC() {
  return (
    <section style={{ background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 4,
      padding: "14px 16px", display: "flex", gap: 16, alignItems: "center" }}>
      <div style={{ width: 64, height: 64, border: `1px solid ${C_TOKENS.border}`, borderRadius: 4,
        background: "#fafbfc", display: "grid", placeItems: "center", fontSize: 32, flexShrink: 0 }}>🍫</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: C_TOKENS.textMuted,
          fontFamily: C_TOKENS.mono, marginBottom: 4, whiteSpace: "nowrap" }}>
          <span>EAN <span style={{ color: C_TOKENS.text, fontWeight: 500 }}>3017620422003</span></span>
          <span style={{ color: C_TOKENS.textSubtle }}>·</span>
          <span>ART-08412-FR</span>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: C_TOKENS.text, margin: 0, letterSpacing: -0.2,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          Nutella pâte à tartiner — 750 g
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, whiteSpace: "nowrap", overflow: "hidden" }}>
          <PillBC color="green"><I.check size={10} /> Validé</PillBC>
          <PillBC>Ferrero · Nutella</PillBC>
          <PillBC>Épicerie sucrée › Pâtes à tartiner</PillBC>
          <span style={{ fontSize: 11, color: C_TOKENS.textSubtle }}>Modifié il y a 2h · M. Lefèvre</span>
        </div>
      </div>
      <div style={{ width: 1, height: 56, background: C_TOKENS.border }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 8px" }}>
        <div style={{ fontSize: 24, fontWeight: 600, color: C_TOKENS.text, fontVariantNumeric: "tabular-nums",
          lineHeight: 1, fontFamily: C_TOKENS.mono }}>92<span style={{ fontSize: 14, color: C_TOKENS.textMuted, fontWeight: 400 }}>%</span></div>
        <div style={{ fontSize: 10, color: C_TOKENS.textMuted, marginTop: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>Complétude</div>
      </div>
      <div style={{ width: 1, height: 56, background: C_TOKENS.border }} />
      <div style={{ display: "flex", gap: 6 }}>
        <MiniBtnBC>Aperçu</MiniBtnBC>
        <MiniBtnBC>Historique</MiniBtnBC>
        <MiniBtnBC primary><I.check size={11} /> Publier</MiniBtnBC>
      </div>
    </section>
  );
}

// COMPLETENESS — full table, single column on the side
function CompletenessBC() {
  const blocks = [
    { l: "Identité", v: 100 }, { l: "Visuels", v: 80, hint: "3/4 manquante" },
    { l: "Libellés", v: 92 }, { l: "Nomenclature", v: 100 },
    { l: "Logistique", v: 100 }, { l: "Nutrition", v: 100 },
    { l: "Allergènes", v: 100 }, { l: "Liens", v: 60, hint: "Substitut requis" },
  ];
  return (
    <SectionBC title="Complétude" count="92%" padded={false}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <tbody>
          {blocks.map((b, i) => (
            <tr key={b.l} style={{ background: i % 2 ? C_TOKENS.rowAlt : "#fff" }}>
              <td style={{ padding: "6px 10px", color: C_TOKENS.text, borderBottom: i < 7 ? `1px solid ${C_TOKENS.border}` : "none" }}>
                <div>{b.l}</div>
                {b.hint && <div style={{ fontSize: 10.5, color: "oklch(0.42 0.13 70)", marginTop: 1 }}>↳ {b.hint}</div>}
              </td>
              <td style={{ padding: "6px 10px", borderBottom: i < 7 ? `1px solid ${C_TOKENS.border}` : "none", width: 110 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ flex: 1, height: 3, background: "#e7e9ec", borderRadius: 1, overflow: "hidden" }}>
                    <div style={{ width: `${b.v}%`, height: "100%",
                      background: b.v === 100 ? C_TOKENS.green : b.v >= 70 ? C_TOKENS.amber : C_TOKENS.red }} />
                  </div>
                  <span style={{ fontFamily: C_TOKENS.mono, fontSize: 11, fontVariantNumeric: "tabular-nums",
                    width: 28, textAlign: "right", color: b.v === 100 ? "oklch(0.4 0.13 145)" : C_TOKENS.text, fontWeight: 600 }}>{b.v}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionBC>
  );
}

// WORKFLOW
function WorkflowBC() {
  const steps = [
    { l: "Brouillon", done: true }, { l: "À valider", done: true },
    { l: "Validé", current: true }, { l: "Publié" },
  ];
  return (
    <SectionBC title="Workflow">
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 10 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.l}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%",
                background: s.done ? C_TOKENS.green : s.current ? "#fff" : "#e7e9ec",
                border: s.current ? `2px solid ${C_TOKENS.accent}` : "none",
                display: "grid", placeItems: "center" }}>
                {s.done && <I.check size={10} stroke="#fff" strokeWidth={2.5} />}
                {s.current && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C_TOKENS.accent }} />}
              </div>
              <div style={{ fontSize: 10.5, color: s.current ? C_TOKENS.text : C_TOKENS.textMuted,
                marginTop: 5, fontWeight: s.current ? 600 : 400 }}>{s.l}</div>
            </div>
            {i < 3 && <div style={{ height: 1, flex: 0.4, background: s.done ? C_TOKENS.green : "#e7e9ec", marginBottom: 14 }} />}
          </React.Fragment>
        ))}
      </div>
      <MiniBtnBC primary style={{ width: "100%", justifyContent: "center", height: 26 }}>
        Publier l'article
      </MiniBtnBC>
    </SectionBC>
  );
}

// ACTIVITY
function ActivityBC() {
  const items = [
    { who: "M. Lefèvre", what: "a modifié les visuels", when: "il y a 2h" },
    { who: "Système", what: "a suggéré 5 liens", when: "il y a 4h", system: true },
    { who: "C. Dubois", what: "a validé la nutrition", when: "hier" },
    { who: "M. Lefèvre", what: "a créé l'article", when: "il y a 3 jours" },
  ];
  return (
    <SectionBC title="Activité" padded={false}>
      {items.map((a, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "8px 12px",
          borderBottom: i < items.length - 1 ? `1px solid ${C_TOKENS.border}` : "none",
          background: i % 2 ? C_TOKENS.rowAlt : "#fff" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%",
            background: a.system ? C_TOKENS.accent : C_TOKENS.green, marginTop: 5, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0, fontSize: 11.5, lineHeight: 1.4 }}>
            <span style={{ fontWeight: 600, color: C_TOKENS.text }}>{a.who}</span>{" "}
            <span style={{ color: C_TOKENS.textMuted }}>{a.what}</span>
            <div style={{ fontSize: 10.5, color: C_TOKENS.textSubtle, marginTop: 1, fontFamily: C_TOKENS.mono }}>{a.when}</div>
          </div>
        </div>
      ))}
    </SectionBC>
  );
}

// VISUALS — packaging-net layout (boîte dépliée)
// Disposition cross : 5(haut) / 3(gauche)·1(face)·2(profil)·4(dos) / 6(bas)
function PackFace({ n, label, filled, primary, required, em, w, h, style }) {
  const empty = !filled;
  return (
    <div style={{ position: "relative", width: w, height: h,
      border: required && empty ? `1.5px dashed ${C_TOKENS.red}` : `1px solid ${C_TOKENS.borderStrong || C_TOKENS.border}`,
      background: filled ? "#fafbfc" : (required ? C_TOKENS.redSoft : "#fff"),
      display: "grid", placeItems: "center", overflow: "hidden", boxSizing: "border-box", ...style }}>
      {/* slot number badge */}
      <div style={{ position: "absolute", top: -1, left: -1, width: 18, height: 18,
        background: "#1c1f23", color: "#fff", fontSize: 10, fontWeight: 700,
        fontFamily: C_TOKENS.mono, display: "grid", placeItems: "center", zIndex: 2 }}>{n}</div>

      {filled ? (
        <div style={{ fontSize: Math.min(w, h) * 0.42, lineHeight: 1, opacity: 0.85 }}>{em}</div>
      ) : (
        <div style={{ textAlign: "center", color: required ? "oklch(0.4 0.16 25)" : C_TOKENS.textMuted, padding: 4 }}>
          <I.upload size={14} style={{ marginBottom: 3 }} />
          <div style={{ fontSize: 10.5, fontWeight: 600, lineHeight: 1.1 }}>{label}</div>
          {required && <div style={{ fontSize: 9.5, marginTop: 2, fontWeight: 500 }}>requis</div>}
        </div>
      )}

      {primary && (
        <div style={{ position: "absolute", top: 4, right: 4, padding: "1px 5px",
          background: C_TOKENS.greenSoft, color: "oklch(0.35 0.13 145)", fontSize: 9.5,
          fontWeight: 700, borderRadius: 2 }}>★ PRINC.</div>
      )}

      {filled && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, fontSize: 9.5,
          color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, background: "rgba(255,255,255,0.92)",
          padding: "2px 6px", borderTop: `1px solid ${C_TOKENS.border}`, textAlign: "center",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
      )}
    </div>
  );
}

function VisualsBC() {
  // Box dimensions for the unfold (Nutella-like jar — but keep box metaphor: tall narrow sides, square front)
  // Face: 200×260 ; Sides: 90×260 ; Top/Bottom: 200×90
  const FACE_W = 200, FACE_H = 260, SIDE_W = 96, TOP_H = 96;

  return (
    <SectionBC
      title="Visuels — vue boîte dépliée"
      count="4 / 6 faces · JPG · ≥ 1200 px"
      action={<>
        <MiniBtnBC><I.upload size={11} /> Importer</MiniBtnBC>
        <MiniBtnBC><I.sparkle size={11} /> Recadrer auto</MiniBtnBC>
        <MiniBtnBC><I.grid size={11} /> Grille</MiniBtnBC>
      </>}
    >
      <div style={{ display: "flex", gap: 24, alignItems: "stretch" }}>
        {/* The unfold canvas */}
        <div style={{
          flex: "0 0 auto",
          background: "#f7f8f9",
          backgroundImage: `linear-gradient(${C_TOKENS.border} 1px, transparent 1px), linear-gradient(90deg, ${C_TOKENS.border} 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
          border: `1px solid ${C_TOKENS.border}`, borderRadius: 3,
          padding: 22,
          display: "grid",
          gridTemplateColumns: `${SIDE_W}px ${FACE_W}px ${SIDE_W}px ${SIDE_W}px`,
          gridTemplateRows: `${TOP_H}px ${FACE_H}px ${TOP_H}px`,
          gap: 0,
          width: "max-content",
        }}>
          {/* Row 1 : empty | top(5) | empty | empty */}
          <div></div>
          <PackFace n={5} label="Haut" filled={true} em="📦" w={FACE_W} h={TOP_H} />
          <div></div>
          <div></div>

          {/* Row 2 : left(3) | face(1) | profile(2) | back(4) */}
          <PackFace n={3} label="Côté gauche" filled={true} em="📋" w={SIDE_W} h={FACE_H} />
          <PackFace n={1} label="Face" filled={true} primary em="🍫" w={FACE_W} h={FACE_H} />
          <PackFace n={2} label="Côté droit" filled={true} em="📜" w={SIDE_W} h={FACE_H} />
          <PackFace n={4} label="Dos / Nutrition" filled={true} em="📊" w={SIDE_W} h={FACE_H} />

          {/* Row 3 : empty | bottom(6) | empty | empty */}
          <div></div>
          <PackFace n={6} label="Bas" filled={false} required={true} w={FACE_W} h={TOP_H} />
          <div></div>
          <div></div>
        </div>

        {/* Right-hand legend / face manager */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: C_TOKENS.textMuted, letterSpacing: 0.4,
            textTransform: "uppercase", marginBottom: 2 }}>Faces du packaging</div>
          {[
            { n: 1, l: "Face produit", st: "✓", primary: true, em: "🍫" },
            { n: 2, l: "Côté droit (storytelling)", st: "✓", em: "📜" },
            { n: 3, l: "Côté gauche (ingrédients)", st: "✓", em: "📋" },
            { n: 4, l: "Dos (valeurs nutritionnelles)", st: "✓", em: "📊" },
            { n: 5, l: "Haut (logo / découpe)", st: "✓", em: "📦" },
            { n: 6, l: "Bas (code-barres)", st: "manquant", missing: true },
          ].map(f => (
            <div key={f.n} style={{ display: "flex", alignItems: "center", gap: 8,
              padding: "5px 9px", border: `1px solid ${C_TOKENS.border}`,
              background: f.missing ? C_TOKENS.redSoft : "#fff", borderRadius: 3, fontSize: 11.5 }}>
              <div style={{ width: 18, height: 18, background: "#1c1f23", color: "#fff", fontSize: 10, fontWeight: 700,
                fontFamily: C_TOKENS.mono, display: "grid", placeItems: "center", flexShrink: 0 }}>{f.n}</div>
              <span style={{ flex: 1, minWidth: 0, color: C_TOKENS.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.l}</span>
              {f.primary && <PillBC color="green" style={{ fontSize: 9.5, padding: "0 5px" }}>★</PillBC>}
              {f.missing
                ? <PillBC color="red" style={{ fontSize: 10 }}>requis</PillBC>
                : <span style={{ color: "oklch(0.4 0.13 145)", fontWeight: 700, fontSize: 13, fontFamily: C_TOKENS.mono }}>✓</span>}
            </div>
          ))}
          <div style={{ marginTop: "auto", padding: "8px 10px", border: `1px dashed ${C_TOKENS.borderStrong || C_TOKENS.border}`,
            borderRadius: 3, fontSize: 11, color: C_TOKENS.textMuted, textAlign: "center", background: "#fafbfc" }}>
            Glisser une image sur une face<br/>pour l'attribuer
          </div>
        </div>
      </div>
    </SectionBC>
  );
}

// LABELS — token-based template builder
// Each channel has a STRUCTURE (typed tokens + literal separators) that compiles to a final string.

const TOKEN_TYPES = {
  produit:       { color: C_TOKENS.accent, label: "Désignation", value: "Pâte à tartiner" },
  marque:        { color: C_TOKENS.green,  label: "MARQUE",      value: "NUTELLA", upper: true },
  conditionnement: { color: C_TOKENS.amber, label: "Conditionnement", value: "le pot" },
  poids:         { color: "oklch(0.55 0.04 280)", label: "Poids", value: "750 g" },
  format:        { color: "oklch(0.55 0.04 280)", label: "Format", value: "750 g" },
  parfum:        { color: C_TOKENS.red,    label: "Parfum",      value: "Noisettes & cacao" },
  variante:      { color: C_TOKENS.accent, label: "Variante",    value: "Original" },
};

function Token({ type, sep, suggested, ghost }) {
  if (sep != null) {
    return <span style={{ padding: "0 2px", color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, fontSize: 11.5,
      whiteSpace: "pre", userSelect: "none" }}>{sep}</span>;
  }
  const t = TOKEN_TYPES[type];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 7px", height: 22,
      background: ghost ? "transparent" : `color-mix(in oklch, ${t.color} 14%, white)`,
      border: `1px ${ghost ? "dashed" : "solid"} ${t.color}`,
      color: t.color, fontSize: 11, fontWeight: 600, borderRadius: 3,
      letterSpacing: 0.2, fontFamily: "inherit", whiteSpace: "nowrap" }}>
      <span style={{ width: 5, height: 5, borderRadius: 1, background: t.color }} />
      {`{${t.label.toLowerCase()}}`}
      {suggested && <I.sparkle size={9} style={{ marginLeft: 1 }} />}
    </span>
  );
}

function RenderedToken({ type }) {
  const t = TOKEN_TYPES[type];
  return (
    <span style={{ color: t.color, fontWeight: 600 }}>
      {t.upper ? t.value.toUpperCase() : t.value}
    </span>
  );
}

// Compose template + separators into a sequence
function StructureRow({ struct, channel, limit, active }) {
  // struct = ["produit", " ", "marque", ", ", "conditionnement", " de ", "poids"]
  // Compute rendered length
  let rendered = "";
  struct.forEach(s => {
    if (TOKEN_TYPES[s]) rendered += TOKEN_TYPES[s].upper ? TOKEN_TYPES[s].value.toUpperCase() : TOKEN_TYPES[s].value;
    else rendered += s;
  });
  const over = rendered.length > limit;
  const pct = Math.min(100, (rendered.length / limit) * 100);

  return (
    <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C_TOKENS.border}`,
      background: active ? "oklch(0.985 0.01 250)" : "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ minWidth: 130, fontSize: 12, fontWeight: 600, color: C_TOKENS.text }}>{channel.name}</div>
        <div style={{ fontSize: 10, color: C_TOKENS.textMuted, textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600 }}>Structure</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 50, height: 3, background: "#e7e9ec", borderRadius: 1, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%",
              background: over ? C_TOKENS.red : pct > 90 ? C_TOKENS.amber : C_TOKENS.green }} />
          </div>
          <span style={{ fontFamily: C_TOKENS.mono, fontSize: 11, color: over ? C_TOKENS.red : C_TOKENS.textMuted, fontVariantNumeric: "tabular-nums", width: 50, textAlign: "right" }}>
            {rendered.length}/{limit}
          </span>
        </div>
      </div>
      {/* Template chips row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 0, alignItems: "center",
        padding: "6px 8px", background: "#fafbfc", border: `1px solid ${C_TOKENS.border}`,
        borderRadius: 3, marginBottom: 6 }}>
        {struct.map((s, i) =>
          TOKEN_TYPES[s]
            ? <Token key={i} type={s} />
            : <Token key={i} sep={s} />
        )}
        <button style={{ marginLeft: 6, padding: "0 6px", height: 22, fontSize: 11, color: C_TOKENS.textMuted,
          background: "transparent", border: `1px dashed ${C_TOKENS.border}`, borderRadius: 3, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 3, fontFamily: "inherit" }}>
          <I.plus size={10} /> jeton
        </button>
      </div>
      {/* Rendered preview */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 12.5, lineHeight: 1.4 }}>
        <span style={{ fontSize: 10, color: C_TOKENS.textMuted, textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600, minWidth: 50 }}>Rendu</span>
        <span style={{ flex: 1, color: C_TOKENS.text }}>
          {struct.map((s, i) =>
            TOKEN_TYPES[s]
              ? <RenderedToken key={i} type={s} />
              : <span key={i} style={{ color: C_TOKENS.textMuted }}>{s}</span>
          )}
        </span>
      </div>
    </div>
  );
}

function LabelsBC() {
  const channels = [
    { name: "Étagère", limit: 32,
      struct: ["produit", " ", "marque", " ", "poids"] },
    { name: "Caisse / TPE", limit: 24,
      struct: ["marque", " ", "poids"] },
    { name: "Site marchand", limit: 80, active: true,
      struct: ["produit", " ", "marque", ", ", "conditionnement", " de ", "poids"] },
    { name: "Marketing long", limit: 240,
      struct: ["produit", " aux ", "parfum", " — ", "marque", ", ", "conditionnement", " de ", "poids"] },
  ];

  // Variables side panel
  return (
    <SectionBC title="Libellés multi-canal — éditeur de structure" count="4 canaux · 92%" padded={false}
      action={<>
        <MiniBtnBC><I.sparkle size={11} /> Suggérer</MiniBtnBC>
        <MiniBtnBC><I.copy size={11} /> Templates</MiniBtnBC>
      </>}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 240px" }}>
        {/* Channels structures */}
        <div style={{ borderRight: `1px solid ${C_TOKENS.border}` }}>
          {channels.map((c, i) =>
            <StructureRow key={c.name} struct={c.struct} channel={c} limit={c.limit} active={c.active} />
          )}
        </div>
        {/* Variables panel */}
        <div style={{ background: C_TOKENS.headerBg, padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C_TOKENS.textMuted, textTransform: "uppercase",
            letterSpacing: 0.4, marginBottom: 8 }}>Variables disponibles</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {Object.entries(TOKEN_TYPES).map(([k, t]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 6px",
                background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, cursor: "grab" }}>
                <Token type={k} ghost />
                <span style={{ flex: 1, minWidth: 0, fontSize: 10.5, color: C_TOKENS.textMuted, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: C_TOKENS.mono }}>
                  {t.upper ? t.value.toUpperCase() : t.value}
                </span>
                <I.more size={11} style={{ color: C_TOKENS.textSubtle }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: "8px 10px", background: C_TOKENS.accentSoft,
            border: `1px solid oklch(0.85 0.06 250)`, borderRadius: 3, fontSize: 11, color: C_TOKENS.accentText, lineHeight: 1.4 }}>
            <strong style={{ display: "block", marginBottom: 3 }}>Astuce</strong>
            Glissez une variable dans une structure, ou tapez du texte libre comme séparateur (ex&nbsp;: «&nbsp;,&nbsp;» «&nbsp;de&nbsp;»).
          </div>
        </div>
      </div>

      {/* Hidden — keep old progress fragment from accidental match */}
      <div style={{ display: "none" }}>removed</div>
    </SectionBC>
  );
}

// NOMENCLATURE — single row of attributes
function NomenBC() {
  const attrs = [
    { k: "Type pâte", v: "Cacao + noisettes" },
    { k: "Nutri-Score", v: "E" },
    { k: "Sans h. palme", v: "Non" },
    { k: "Bio / Label", v: "—", warn: true },
    { k: "Texture", v: "Onctueuse" },
    { k: "% noisettes", v: "13%" },
  ];
  return (
    <SectionBC
      title="Nomenclature"
      count="Épicerie sucrée › Pâtes à tartiner · n1.1"
      action={<MiniBtnBC><I.edit size={11} /> Reclasser</MiniBtnBC>}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, fontSize: 11.5 }}>
        {attrs.map(a => (
          <div key={a.k} style={{ padding: "8px 10px",
            background: a.warn ? C_TOKENS.amberSoft : "#fafbfc",
            border: `1px solid ${a.warn ? "oklch(0.85 0.07 75)" : C_TOKENS.border}`, borderRadius: 3 }}>
            <div style={{ fontSize: 10, color: C_TOKENS.textMuted, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600 }}>{a.k}</div>
            <div style={{ fontWeight: 600, color: a.warn ? "oklch(0.42 0.13 70)" : C_TOKENS.text,
              fontFamily: a.v.match(/^[\d—%]/) ? C_TOKENS.mono : "inherit", fontSize: 13 }}>{a.v}</div>
          </div>
        ))}
      </div>
    </SectionBC>
  );
}

// LINK GRAPH — bigger, cleaner
function LinkGraphBC() {
  const linkGroups = [
    { type: "Substituts", color: C_TOKENS.red, items: LINKS.substitute, x: 12, y: 25 },
    { type: "Variantes", color: C_TOKENS.accent, items: LINKS.variant, x: 76, y: 25 },
    { type: "Compléments", color: C_TOKENS.green, items: LINKS.complementary, x: 12, y: 70 },
    { type: "Up-sell", color: C_TOKENS.amber, items: LINKS.upsell, x: 76, y: 70 },
  ];
  return (
    <div style={{ position: "relative", height: 420, background: "#fafbfc",
      backgroundImage: `linear-gradient(${C_TOKENS.border} 1px, transparent 1px), linear-gradient(90deg, ${C_TOKENS.border} 1px, transparent 1px)`,
      backgroundSize: "24px 24px",
      border: `1px solid ${C_TOKENS.border}`, borderRadius: 3, overflow: "hidden" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {linkGroups.map((g) => (
          <line key={g.type} x1="50%" y1="50%" x2={`${g.x + 9}%`} y2={`${g.y + 7}%`}
            stroke={g.color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
        ))}
      </svg>

      {/* Center node */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
        width: 200, padding: "12px 14px", background: "#fff", border: `2px solid ${C_TOKENS.accent}`,
        borderRadius: 4, boxShadow: "0 4px 12px rgba(28,31,35,0.12)", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: 3, background: "#fafbfc",
            border: `1px solid ${C_TOKENS.border}`, display: "grid", placeItems: "center", fontSize: 26, flexShrink: 0 }}>🍫</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C_TOKENS.text, lineHeight: 1.2,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Nutella 750g</div>
            <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, marginTop: 2 }}>3017620422003</div>
          </div>
        </div>
      </div>

      {/* Group nodes */}
      {linkGroups.map((g) => (
        <div key={g.type} style={{ position: "absolute", left: `${g.x}%`, top: `${g.y}%`, width: 200 }}>
          <div style={{ background: "#fff", border: `1px solid ${C_TOKENS.border}`, borderTop: `2px solid ${g.color}`, borderRadius: 3, fontSize: 11.5 }}>
            <div style={{ padding: "5px 9px", borderBottom: `1px solid ${C_TOKENS.border}`,
              display: "flex", justifyContent: "space-between", background: C_TOKENS.headerBg, alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: C_TOKENS.text, fontSize: 11.5 }}>{g.type}</span>
              <span style={{ fontSize: 10.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>{g.items.length}</span>
            </div>
            {g.items.slice(0, 2).map((it, i) => (
              <div key={it.ean} style={{ display: "flex", alignItems: "center", gap: 7,
                padding: "5px 9px", borderTop: i ? `1px solid ${C_TOKENS.border}` : "none", fontSize: 11 }}>
                <span style={{ fontSize: 14 }}>{it.image}</span>
                <span style={{ flex: 1, minWidth: 0, color: C_TOKENS.text,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name}</span>
                <span style={{ fontFamily: C_TOKENS.mono, fontSize: 10, color: g.color, fontWeight: 700 }}>{Math.round(it.strength * 100)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Toolbar */}
      <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 4 }}>
        <PillBC color="accent">● Graphe</PillBC>
        <PillBC>○ Liste</PillBC>
        <PillBC>○ Matrice</PillBC>
      </div>
      <div style={{ position: "absolute", top: 10, right: 10, padding: "4px 9px",
        background: C_TOKENS.accentSoft, border: `1px solid oklch(0.85 0.06 250)`, borderRadius: 3,
        fontSize: 11, color: C_TOKENS.accentText, display: "flex", alignItems: "center", gap: 5, fontWeight: 500 }}>
        <I.sparkle size={11} /> 5 suggestions
      </div>
      <div style={{ position: "absolute", bottom: 10, left: 10, fontSize: 10.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono,
        background: "rgba(255,255,255,0.92)", padding: "3px 7px", borderRadius: 2, border: `1px solid ${C_TOKENS.border}` }}>
        Glisser un EAN ici · ⌘L pour lier
      </div>
    </div>
  );
}

// LINKS TABLE
function LinksTableBC() {
  const sections = [
    { type: "Substitut", color: C_TOKENS.red, items: LINKS.substitute },
    { type: "Complément", color: C_TOKENS.green, items: LINKS.complementary },
    { type: "Variante", color: C_TOKENS.accent, items: LINKS.variant },
    { type: "Up-sell", color: C_TOKENS.amber, items: LINKS.upsell },
    { type: "Accessoire", color: "oklch(0.55 0.04 280)", items: LINKS.accessory },
  ];
  const rows = sections.flatMap(s => s.items.map(it => ({ ...it, type: s.type, color: s.color })));
  return (
    <SectionBC title="Liens — vue tableau" count={`${rows.length} liens`} padded={false}
      action={<>
        <MiniBtnBC><I.plus size={11} /> Ajouter</MiniBtnBC>
        <MiniBtnBC><I.download size={11} /> CSV</MiniBtnBC>
      </>}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: 110 }} />
          <col style={{ width: 130 }} />
          <col />
          <col style={{ width: 110 }} />
          <col style={{ width: 100 }} />
          <col style={{ width: 120 }} />
          <col style={{ width: 36 }} />
        </colgroup>
        <thead>
          <tr>
            <th style={thBC()}>Type</th>
            <th style={thBC()}>EAN</th>
            <th style={thBC()}>Article cible</th>
            <th style={{ ...thBC(), textAlign: "right" }}>Force</th>
            <th style={thBC()}>Source</th>
            <th style={thBC()}>Validé par</th>
            <th style={thBC()}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 ? C_TOKENS.rowAlt : "#fff" }}>
              <td style={tdBC()}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 1, background: r.color }} />
                  <span style={{ fontWeight: 500 }}>{r.type}</span>
                </div>
              </td>
              <td style={{ ...tdBC(), fontFamily: C_TOKENS.mono, color: C_TOKENS.textMuted, fontSize: 11.5 }}>{r.ean}</td>
              <td style={{ ...tdBC(), overflow: "hidden", textOverflow: "ellipsis" }}>
                <span style={{ fontSize: 14, marginRight: 7 }}>{r.image}</span>
                <span style={{ color: C_TOKENS.text, fontWeight: 500 }}>{r.name}</span>
                <span style={{ color: C_TOKENS.textSubtle, fontSize: 11, marginLeft: 6 }}>· {r.brand}</span>
              </td>
              <td style={{ ...tdBC(), textAlign: "right" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 50, height: 3, background: "#e7e9ec", borderRadius: 1, overflow: "hidden" }}>
                    <div style={{ width: `${r.strength * 100}%`, height: "100%", background: r.color }} />
                  </div>
                  <span style={{ fontFamily: C_TOKENS.mono, fontSize: 11, color: C_TOKENS.text, fontVariantNumeric: "tabular-nums", width: 24, textAlign: "right" }}>{Math.round(r.strength * 100)}</span>
                </div>
              </td>
              <td style={tdBC()}>
                <PillBC color={i % 3 === 0 ? "accent" : i % 3 === 1 ? "neutral" : "green"} style={{ fontSize: 10 }}>
                  {i % 3 === 0 ? "Auto ✨" : i % 3 === 1 ? "Manuel" : "Co-achat"}
                </PillBC>
              </td>
              <td style={{ ...tdBC(), color: C_TOKENS.textMuted, fontSize: 11.5 }}>{i % 2 ? "M. Lefèvre" : "—"}</td>
              <td style={tdBC()}><button style={{ padding: 2, background: "transparent", border: "none", cursor: "pointer", color: C_TOKENS.textSubtle }}><I.more size={13} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionBC>
  );
}

function ProductDetailBC() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C_TOKENS.bg, fontFamily: C_TOKENS.font, color: C_TOKENS.text, fontSize: 12 }}>
      {/* Top app bar */}
      <div style={{ height: 38, padding: "0 14px", background: C_TOKENS.headerBg, borderBottom: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 12, fontSize: 12, flexShrink: 0, whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: C_TOKENS.accent, color: "#fff",
            display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>P</div>
          <span style={{ fontWeight: 600 }}>Produit.ai</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 4px" }}>/</span>
          <span style={{ color: C_TOKENS.textMuted }}>Articles</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 2px" }}>›</span>
          <span style={{ color: C_TOKENS.textMuted }}>Épicerie sucrée</span>
          <span style={{ color: C_TOKENS.textSubtle, margin: "0 2px" }}>›</span>
          <span style={{ fontWeight: 500 }}>Nutella 750g</span>
        </div>
        <div style={{ flex: 1 }} />
        {["Fichier", "Édition", "Affichage", "Données", "Aide"].map(m => (
          <button key={m} style={{ padding: "3px 8px", background: "transparent", border: "none",
            fontSize: 12, color: C_TOKENS.text, cursor: "pointer", borderRadius: 4, fontFamily: "inherit" }}>{m}</button>
        ))}
        <div style={{ width: 1, height: 18, background: C_TOKENS.border, margin: "0 4px" }} />
        <span style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>Auto-save · 12s</span>
      </div>

      {/* Toolbar */}
      <div style={{ height: 40, padding: "0 14px", background: "#fff", borderBottom: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 4, flexShrink: 0, whiteSpace: "nowrap" }}>
        <MiniBtnBC><I.chevronLeft size={11} /> Précédent</MiniBtnBC>
        <MiniBtnBC>Suivant <I.chevronRight size={11} /></MiniBtnBC>
        <div style={{ width: 1, height: 20, background: C_TOKENS.border, margin: "0 8px" }} />
        <MiniBtnBC><I.edit size={11} /> Éditer</MiniBtnBC>
        <MiniBtnBC><I.history size={11} /> Versions</MiniBtnBC>
        <MiniBtnBC><I.link size={11} /> Lier</MiniBtnBC>
        <MiniBtnBC><I.upload size={11} /> Visuels</MiniBtnBC>
        <div style={{ width: 1, height: 20, background: C_TOKENS.border, margin: "0 8px" }} />
        <MiniBtnBC><I.sparkle size={11} /> Auto-enrichir</MiniBtnBC>
        <MiniBtnBC><I.download size={11} /> Exporter</MiniBtnBC>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C_TOKENS.amber, fontWeight: 600, marginRight: 8 }}>● 2 modifs non sauvegardées</span>
        <MiniBtnBC primary><I.check size={11} /> Enregistrer</MiniBtnBC>
      </div>

      {/* Tabs */}
      <div style={{ height: 32, padding: "0 14px", background: "#fff", borderBottom: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden" }}>
        {[
          { l: "Vue d'ensemble", active: true },
          { l: "Identité" }, { l: "Visuels", count: 4 }, { l: "Libellés" }, { l: "Nomenclature" },
          { l: "Liens", count: 11 }, { l: "Logistique" }, { l: "Nutrition" }, { l: "Allergènes" }, { l: "Historique", count: 23 },
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

      {/* Body: 2-column layout, sidebar 280px */}
      <div style={{ flex: 1, overflow: "auto", background: C_TOKENS.bg }}>
        <div style={{ padding: 14, display: "grid", gridTemplateColumns: "minmax(0, 1fr) 280px", gap: 14 }}>
          {/* MAIN COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
            <HeroBC />
            <VisualsBC />
            <LabelsBC />
            <NomenBC />
            <SectionBC
              title="Liens entre produits"
              count="11 liens · 5 suggestions"
              padded={false}
              action={<>
                <MiniBtnBC><I.sparkle size={11} /> 5 suggestions</MiniBtnBC>
                <MiniBtnBC><I.plus size={11} /> Ajouter</MiniBtnBC>
              </>}
            >
              <div style={{ padding: 12 }}>
                <LinkGraphBC />
              </div>
            </SectionBC>
            <LinksTableBC />
          </div>

          {/* SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <WorkflowBC />
            <CompletenessBC />
            <ActivityBC />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{ height: 24, padding: "0 14px", background: C_TOKENS.headerBg, borderTop: `1px solid ${C_TOKENS.border}`,
        display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, flexShrink: 0, whiteSpace: "nowrap" }}>
        <span>Article ART-08412-FR</span>
        <span>Compl. <strong style={{ color: C_TOKENS.text }}>92%</strong></span>
        <span>Liens <strong style={{ color: C_TOKENS.text }}>11</strong></span>
        <span>Visuels <strong style={{ color: C_TOKENS.text }}>4/6</strong></span>
        <div style={{ flex: 1 }} />
        <span style={{ color: "oklch(0.4 0.13 145)", fontWeight: 600 }}>● Validé</span>
        <span>v1.4 · M. Lefèvre · il y a 2h</span>
      </div>
    </div>
  );
}

window.ProductDetailBC = ProductDetailBC;
