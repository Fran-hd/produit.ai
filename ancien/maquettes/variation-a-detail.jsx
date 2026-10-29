// Variation A — Product detail page (multi-tab form)

function PlaceholderImg({ w = 96, h = 96, label, hint, style }) {
  return (
    <div style={{ width: w, height: h, borderRadius: 6,
      background: `repeating-linear-gradient(135deg, #f4f2ec 0 8px, #ecebe5 8px 16px)`,
      border: "1px solid #e8e6e1", display: "grid", placeItems: "center",
      color: "#7a776e", fontSize: 10, fontFamily: A_TOKENS.mono, textAlign: "center", padding: 6, ...style }}>
      <div>
        {label && <div style={{ fontSize: 18, marginBottom: 2 }}>{label}</div>}
        {hint && <div style={{ opacity: 0.65 }}>{hint}</div>}
      </div>
    </div>
  );
}

function CompletenessPanelA() {
  const blocks = [
    { name: "Identité", value: 100 },
    { name: "Visuels", value: 80, hint: "Vue 3/4 manquante" },
    { name: "Libellés", value: 92 },
    { name: "Nomenclature", value: 100 },
    { name: "Logistique", value: 100 },
    { name: "Nutrition", value: 100 },
    { name: "Allergènes", value: 100 },
    { name: "Liens produits", value: 60, hint: "1 substitut requis" },
  ];
  return (
    <div style={{ padding: "14px 16px", borderTop: `1px solid ${A_TOKENS.border}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: A_TOKENS.textMuted, letterSpacing: 0.5, textTransform: "uppercase" }}>Complétude</div>
        <ProgressRing value={92} size={32} stroke={2.5} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {blocks.map(b => (
          <div key={b.name} style={{ fontSize: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ color: A_TOKENS.text }}>{b.name}</span>
              <span style={{ fontVariantNumeric: "tabular-nums", color: b.value === 100 ? A_TOKENS.accentText : A_TOKENS.textMuted, fontWeight: 500 }}>{b.value}%</span>
            </div>
            <div style={{ height: 3, background: "#ebe9e3", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${b.value}%`, height: "100%",
                background: b.value === 100 ? A_TOKENS.accent : b.value >= 70 ? A_TOKENS.warn : A_TOKENS.danger }} />
            </div>
            {b.hint && <div style={{ fontSize: 10.5, color: A_TOKENS.warnText, marginTop: 2 }}>↳ {b.hint}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldA({ label, value, mono, hint, locked, suggestion }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: 11, color: A_TOKENS.textMuted, marginBottom: 4, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
        {label}
        {locked && <span title="Verrouillé" style={{ fontSize: 9 }}>🔒</span>}
      </div>
      <div style={{ position: "relative" }}>
        <input defaultValue={value} readOnly={locked}
          style={{ width: "100%", padding: "7px 10px", border: `1px solid ${A_TOKENS.border}`,
          borderRadius: 5, background: locked ? "#f6f5f1" : "#fff", fontSize: 13,
          fontFamily: mono ? A_TOKENS.mono : "inherit", color: A_TOKENS.text, outline: "none",
          fontVariantNumeric: mono ? "tabular-nums" : "normal" }} />
        {suggestion && <div style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
          fontSize: 10, color: A_TOKENS.accentText, background: A_TOKENS.accentSoft, padding: "2px 6px", borderRadius: 3, fontWeight: 500 }}>
          ✨ {suggestion}
        </div>}
      </div>
      {hint && <div style={{ fontSize: 10.5, color: A_TOKENS.textSubtle, marginTop: 3 }}>{hint}</div>}
    </label>
  );
}

function IdentityTabA() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 720 }}>
      <FieldA label="Code EAN-13" value="3017620422003" mono locked />
      <FieldA label="Référence interne" value="ART-08412-FR" mono />
      <FieldA label="Marque" value="Ferrero" />
      <FieldA label="Sous-marque" value="Nutella" />
      <FieldA label="Format" value="750 g" />
      <FieldA label="Pays d'origine" value="Italie" />
      <div style={{ gridColumn: "1 / -1" }}>
        <FieldA label="Désignation officielle" value="Pâte à tartiner aux noisettes et au cacao"
          hint="Visible sur le bandeau étagère" />
      </div>
      <FieldA label="DLUO" value="12 mois" hint="Durée de conservation" />
      <FieldA label="Conditions de stockage" value="Ambiant · 18-22°C" />
    </div>
  );
}

function VisualsTabA() {
  const slots = [
    { label: "Face", filled: true, primary: true, hint: "1200×1200" },
    { label: "Dos", filled: true, hint: "1200×1200" },
    { label: "3/4", filled: false, required: true },
    { label: "Détail", filled: true },
    { label: "Lifestyle", filled: false },
    { label: "Packshot", filled: true },
  ];
  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: A_TOKENS.text }}>Visuels produit</div>
          <div style={{ fontSize: 12, color: A_TOKENS.textMuted, marginTop: 2 }}>
            4 / 6 obligatoires · JPG/PNG · min. 1200 px côté
          </div>
        </div>
        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 11px",
          background: A_TOKENS.text, color: "#fff", border: "none", borderRadius: 5, fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
          <I.upload size={13} /> Importer
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
        {slots.map((s, i) => (
          <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 8,
            border: s.required && !s.filled ? `1.5px dashed ${A_TOKENS.warn}` : `1px solid ${A_TOKENS.border}`,
            background: s.filled ? "#fff" : "#faf9f5", overflow: "hidden",
            display: "grid", placeItems: "center" }}>
            {s.filled ? (
              <PlaceholderImg w="100%" h="100%" label={["🍫","📦","🥜","🛒"][i % 4]} hint={s.label} style={{ borderRadius: 0, border: "none" }} />
            ) : (
              <div style={{ textAlign: "center", color: A_TOKENS.textMuted, fontSize: 11 }}>
                <I.upload size={18} style={{ color: A_TOKENS.textSubtle, marginBottom: 4 }} />
                <div style={{ fontWeight: 500, color: s.required ? A_TOKENS.warnText : A_TOKENS.textMuted }}>{s.label}</div>
                {s.required && <div style={{ fontSize: 10, marginTop: 2, color: A_TOKENS.warnText }}>requis</div>}
              </div>
            )}
            {s.primary && <div style={{ position: "absolute", top: 6, left: 6 }}><ChipA tone="success">★ Principal</ChipA></div>}
            {s.filled && <button style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: 4,
              background: "rgba(255,255,255,0.9)", border: `1px solid ${A_TOKENS.border}`, cursor: "pointer", padding: 0,
              display: "grid", placeItems: "center" }}><I.more size={13} /></button>}
          </div>
        ))}
      </div>

      <div style={{ border: `1.5px dashed ${A_TOKENS.borderStrong}`, borderRadius: 8, padding: "20px 16px",
        textAlign: "center", background: "#fafaf6" }}>
        <I.upload size={20} style={{ color: A_TOKENS.textMuted, marginBottom: 6 }} />
        <div style={{ fontSize: 13, fontWeight: 500, color: A_TOKENS.text, marginBottom: 2 }}>
          Glisser-déposer pour ajouter des visuels
        </div>
        <div style={{ fontSize: 11.5, color: A_TOKENS.textMuted }}>
          ou <span style={{ color: A_TOKENS.accentText, fontWeight: 500, cursor: "pointer" }}>parcourir</span> · jusqu'à 20 fichiers
        </div>
      </div>
    </div>
  );
}

function LinksTabA() {
  const Section = ({ title, count, color, items, action }) => (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: A_TOKENS.text }}>{title}</div>
          <ChipA>{count}</ChipA>
        </div>
        <button style={{ background: "transparent", border: "none", color: A_TOKENS.textMuted, fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <I.plus size={12} /> Ajouter
        </button>
      </div>
      <div style={{ border: `1px solid ${A_TOKENS.border}`, borderRadius: 6, overflow: "hidden", background: "#fff" }}>
        {items.map((it, i) => (
          <div key={it.ean} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto auto",
            gap: 12, alignItems: "center", padding: "8px 12px",
            borderTop: i ? `1px solid ${A_TOKENS.border}` : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 4, background: "#f4f2ec",
              display: "grid", placeItems: "center", fontSize: 18 }}>{it.image}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: A_TOKENS.text, fontWeight: 500, lineHeight: 1.3 }}>{it.name}</div>
              <div style={{ fontSize: 11, color: A_TOKENS.textMuted, fontFamily: A_TOKENS.mono, marginTop: 1 }}>
                {it.ean} · {it.brand}{it.format ? ` · ${it.format}` : ""}
              </div>
            </div>
            <div style={{ width: 80 }}>
              <div style={{ fontSize: 10, color: A_TOKENS.textMuted, marginBottom: 2, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {Math.round(it.strength * 100)}%
              </div>
              <div style={{ height: 3, background: "#ebe9e3", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${it.strength * 100}%`, height: "100%", background: color }} />
              </div>
            </div>
            <ChipA tone="info">{["Auto","Manuel","Validé"][i % 3]}</ChipA>
            <button style={{ background: "transparent", border: "none", padding: 4, cursor: "pointer", color: A_TOKENS.textMuted }}>
              <I.more size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, padding: "10px 12px", background: A_TOKENS.accentSoft,
        border: `1px solid oklch(0.85 0.06 130)`, borderRadius: 6, fontSize: 12, color: A_TOKENS.accentText }}>
        <I.sparkle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <strong>5 suggestions</strong> de liens basées sur les co-achats et les attributs partagés. <span style={{ textDecoration: "underline", cursor: "pointer" }}>Examiner</span>
        </div>
      </div>
      <Section title="Substituabilité" count={3} color="oklch(0.55 0.16 25)" items={LINKS.substitute} />
      <Section title="Complémentarité" count={3} color="oklch(0.55 0.12 130)" items={LINKS.complementary} />
      <Section title="Variantes" count={3} color="oklch(0.6 0.13 240)" items={LINKS.variant} />
      <Section title="Up-sell" count={1} color="oklch(0.65 0.14 60)" items={LINKS.upsell} />
      <Section title="Accessoires" count={1} color="oklch(0.55 0.04 280)" items={LINKS.accessory} />
    </div>
  );
}

function NomenTabA() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 18, maxWidth: 900 }}>
      <div style={{ border: `1px solid ${A_TOKENS.border}`, borderRadius: 6, background: "#fff", padding: 6, fontSize: 12.5 }}>
        {NOMENCLATURE.map(n => (
          <div key={n.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 6px", borderRadius: 4,
              background: n.children ? "#f5f3ed" : "transparent", fontWeight: n.children ? 600 : 400 }}>
              {n.children ? <I.chevronDown size={13} /> : <span style={{ width: 13 }} />}
              <I.folder size={13} style={{ color: A_TOKENS.textMuted }} />
              <span style={{ flex: 1, color: A_TOKENS.text }}>{n.label}</span>
              <span style={{ color: A_TOKENS.textSubtle, fontSize: 11, fontVariantNumeric: "tabular-nums" }}>{n.count}</span>
            </div>
            {n.children?.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 6px 5px 24px",
                borderRadius: 4, background: c.current ? A_TOKENS.accentSoft : "transparent",
                color: c.current ? A_TOKENS.accentText : A_TOKENS.text, fontWeight: c.current ? 600 : 400 }}>
                <I.tag size={12} style={{ color: c.current ? A_TOKENS.accentText : A_TOKENS.textMuted }} />
                <span style={{ flex: 1 }}>{c.label}</span>
                <span style={{ fontSize: 11, fontVariantNumeric: "tabular-nums",
                  color: c.current ? A_TOKENS.accentText : A_TOKENS.textSubtle }}>{c.count}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: A_TOKENS.textMuted, marginBottom: 4 }}>Catégorie sélectionnée</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 500 }}>
            <span style={{ color: A_TOKENS.textMuted }}>Épicerie sucrée</span>
            <I.chevronRight size={12} style={{ color: A_TOKENS.textSubtle }} />
            <span style={{ color: A_TOKENS.text }}>Pâtes à tartiner</span>
          </div>
        </div>
        <div style={{ border: `1px solid ${A_TOKENS.border}`, borderRadius: 6, background: "#fff", padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: A_TOKENS.text, marginBottom: 10 }}>Attributs requis pour cette catégorie</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { k: "Type de pâte", v: "Cacao + noisettes", ok: true },
              { k: "Nutri-Score", v: "E", ok: true },
              { k: "Sans huile de palme", v: "Non", ok: true },
              { k: "Bio / Label", v: "—", warn: true },
              { k: "Texture", v: "Onctueuse", ok: true },
              { k: "% noisettes", v: "13%", ok: true },
            ].map(a => (
              <div key={a.k} style={{ padding: "8px 10px", background: a.warn ? A_TOKENS.warnSoft : "#faf9f5",
                borderRadius: 5, border: `1px solid ${a.warn ? "oklch(0.88 0.06 80)" : A_TOKENS.border}` }}>
                <div style={{ fontSize: 11, color: A_TOKENS.textMuted, marginBottom: 2 }}>{a.k}</div>
                <div style={{ fontSize: 12.5, color: a.warn ? A_TOKENS.warnText : A_TOKENS.text, fontWeight: 500 }}>{a.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelsTabA() {
  const channels = [
    { name: "Étagère", limit: 32, value: "Nutella pâte tartiner 750g" },
    { name: "Caisse / TPE", limit: 24, value: "NUTELLA 750G" },
    { name: "Site marchand", limit: 80, value: "Nutella · Pâte à tartiner aux noisettes et cacao 750g" },
    { name: "Marketing long", limit: 240, value: "Nutella, la pâte à tartiner unique au monde, à base de noisettes torréfiées et de cacao soigneusement sélectionné. À déguster sur du pain, des biscottes ou des pancakes pour un petit-déjeuner gourmand." },
  ];
  return (
    <div style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 14 }}>
      {channels.map(c => {
        const pct = Math.min(100, (c.value.length / c.limit) * 100);
        const over = c.value.length > c.limit;
        return (
          <div key={c.name} style={{ background: "#fff", border: `1px solid ${A_TOKENS.border}`, borderRadius: 6, padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: A_TOKENS.text }}>{c.name}</div>
              <div style={{ fontSize: 11, color: over ? A_TOKENS.danger : A_TOKENS.textMuted, fontFamily: A_TOKENS.mono, fontVariantNumeric: "tabular-nums" }}>
                {c.value.length} / {c.limit}
              </div>
            </div>
            <textarea defaultValue={c.value} rows={c.limit > 100 ? 3 : 1}
              style={{ width: "100%", padding: "7px 10px", border: `1px solid ${A_TOKENS.border}`,
                borderRadius: 5, background: "#fff", fontSize: 13, fontFamily: "inherit",
                color: A_TOKENS.text, outline: "none", resize: "vertical" }} />
            <div style={{ height: 2, background: "#ebe9e3", borderRadius: 1, overflow: "hidden", marginTop: 6 }}>
              <div style={{ width: `${pct}%`, height: "100%",
                background: over ? A_TOKENS.danger : pct > 90 ? A_TOKENS.warn : A_TOKENS.accent }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProductDetailA() {
  const [tab, setTab] = React.useState("Visuels");
  const renderTab = () => {
    switch (tab) {
      case "Identité": return <IdentityTabA />;
      case "Visuels": return <VisualsTabA />;
      case "Libellés": return <LabelsTabA />;
      case "Nomenclature": return <NomenTabA />;
      case "Liens": return <LinksTabA />;
      default: return <IdentityTabA />;
    }
  };
  return (
    <div style={{ display: "flex", height: "100%", background: A_TOKENS.bg, fontFamily: A_TOKENS.font, color: A_TOKENS.text }}>
      <SidebarA active="list" />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top breadcrumb */}
        <div style={{ height: 42, padding: "0 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${A_TOKENS.border}`, background: A_TOKENS.surface, fontSize: 12.5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: A_TOKENS.textMuted }}>
            <span>Articles</span>
            <I.chevronRight size={11} style={{ color: A_TOKENS.textSubtle }} />
            <span>Épicerie sucrée</span>
            <I.chevronRight size={11} style={{ color: A_TOKENS.textSubtle }} />
            <span style={{ color: A_TOKENS.text, fontWeight: 500 }}>Nutella 750g</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: A_TOKENS.textMuted }}>
            <button style={{ background: "transparent", border: "none", padding: 4, cursor: "pointer", color: A_TOKENS.textMuted }}><I.history size={15} /></button>
            <button style={{ background: "transparent", border: "none", padding: 4, cursor: "pointer", color: A_TOKENS.textMuted }}><I.bell size={15} /></button>
            <span style={{ width: 1, height: 14, background: A_TOKENS.border }} />
            <span style={{ fontSize: 11.5 }}>↑↓ navigue · ⌘S enregistre</span>
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: "16px 22px 0", background: A_TOKENS.surface }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
            <PlaceholderImg w={64} h={64} label="🍫" hint="Face" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 11, color: A_TOKENS.textMuted, fontFamily: A_TOKENS.mono }}>
                <span>EAN</span>
                <span style={{ color: A_TOKENS.text, fontWeight: 500 }}>3017620422003</span>
                <span>·</span>
                <span>ART-08412-FR</span>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: A_TOKENS.text, margin: 0, letterSpacing: -0.3 }}>
                Nutella pâte à tartiner — 750g
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                <ChipA tone="success"><I.check size={10} /> Validé</ChipA>
                <ChipA>Ferrero</ChipA>
                <ChipA tone="info">Épicerie sucrée › Pâtes à tartiner</ChipA>
                <span style={{ fontSize: 11, color: A_TOKENS.textSubtle }}>Modifié il y a 2h par M. Lefèvre</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button style={{ padding: "6px 12px", background: "#fff", border: `1px solid ${A_TOKENS.border}`,
                borderRadius: 5, fontSize: 12.5, color: A_TOKENS.text, cursor: "pointer", fontWeight: 500 }}>Aperçu</button>
              <button style={{ padding: "6px 12px", background: A_TOKENS.text, color: "#fff", border: "none",
                borderRadius: 5, fontSize: 12.5, cursor: "pointer", fontWeight: 500 }}>Enregistrer</button>
              <button style={{ padding: "6px 8px", background: "#fff", border: `1px solid ${A_TOKENS.border}`,
                borderRadius: 5, cursor: "pointer", display: "grid", placeItems: "center" }}><I.more size={14} /></button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, marginLeft: -8 }}>
            {A_TABS.map(t => {
              const isActive = t === tab;
              const counts = { Visuels: 4, Liens: 11, Historique: 23 };
              return (
                <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 12px", background: "transparent",
                  border: "none", fontSize: 12.5, fontWeight: 500,
                  color: isActive ? A_TOKENS.text : A_TOKENS.textMuted, cursor: "pointer",
                  borderBottom: isActive ? `2px solid ${A_TOKENS.text}` : "2px solid transparent",
                  marginBottom: -1, fontFamily: "inherit",
                  display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {t}
                  {counts[t] && <span style={{ fontSize: 10.5, padding: "1px 5px", background: "#ebe9e3", color: A_TOKENS.textMuted, borderRadius: 3, fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{counts[t]}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "20px 22px", overflowY: "auto", background: A_TOKENS.bg }}>
          {renderTab()}
        </div>
      </main>

      {/* Right rail */}
      <aside style={{ width: 280, borderLeft: `1px solid ${A_TOKENS.border}`, background: "#fff",
        display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${A_TOKENS.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: A_TOKENS.textMuted, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>Workflow</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {["Brouillon", "À valider", "Validé", "Publié"].map((s, i) => {
              const done = i < 2;
              const current = i === 2;
              return (
                <React.Fragment key={s}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%",
                      background: done ? A_TOKENS.accent : current ? "#fff" : "#ebe9e3",
                      border: current ? `2px solid ${A_TOKENS.accent}` : "none",
                      display: "grid", placeItems: "center", color: "#fff", fontSize: 10, fontWeight: 600 }}>
                      {done && <I.check size={10} stroke="#fff" strokeWidth={2.5} />}
                      {current && <div style={{ width: 6, height: 6, borderRadius: "50%", background: A_TOKENS.accent }} />}
                    </div>
                    <div style={{ fontSize: 9.5, color: current ? A_TOKENS.text : A_TOKENS.textMuted, marginTop: 4, fontWeight: current ? 600 : 400, textAlign: "center" }}>{s}</div>
                  </div>
                  {i < 3 && <div style={{ height: 1, flex: 0.5, background: done ? A_TOKENS.accent : "#ebe9e3", marginBottom: 14 }} />}
                </React.Fragment>
              );
            })}
          </div>
          <button style={{ width: "100%", marginTop: 10, padding: "7px 0", background: A_TOKENS.accent, color: "#fff",
            border: "none", borderRadius: 5, fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
            Publier l'article
          </button>
        </div>
        <CompletenessPanelA />
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${A_TOKENS.border}`, fontSize: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: A_TOKENS.textMuted, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>Activité</div>
          {[
            { who: "M. Lefèvre", what: "a modifié les visuels", when: "il y a 2h" },
            { who: "Système", what: "a suggéré 5 liens", when: "il y a 4h", system: true },
            { who: "C. Dubois", what: "a validé la nutrition", when: "hier" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 8, paddingBottom: 8, marginBottom: 8,
              borderBottom: i < 2 ? `1px solid ${A_TOKENS.border}` : "none" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.system ? A_TOKENS.warn : A_TOKENS.accent, marginTop: 5, flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1, lineHeight: 1.4 }}>
                <span style={{ color: A_TOKENS.text, fontWeight: 500 }}>{a.who}</span>{" "}
                <span style={{ color: A_TOKENS.textMuted }}>{a.what}</span>
                <div style={{ fontSize: 10.5, color: A_TOKENS.textSubtle, marginTop: 1 }}>{a.when}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

window.ProductDetailA = ProductDetailA;
window.PlaceholderImg = PlaceholderImg;
