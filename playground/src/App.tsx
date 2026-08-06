import { useEffect, useMemo, useState } from "react";
import catalog from "./foundation-catalog.json";

type ThemeMode = "light" | "dark" | "high-contrast" | "high-contrast-dark";
type View = "colors" | "catalog";

type CatalogGroup = {
  id: string;
  name: string;
  idRange: { min: number; max: number };
  components: {
    id: number;
    name: string;
    displayName: string;
    fileKind: string;
  }[];
};

const groups = catalog.groups as CatalogGroup[];

const THEMES: { id: ThemeMode; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "high-contrast", label: "High contrast" },
  { id: "high-contrast-dark", label: "HC dark" },
];

type Swatch = { name: string; token: string };

const SURFACE_SWATCHES: Swatch[] = [
  { name: "Canvas", token: "--color-bg-canvas" },
  { name: "Base", token: "--color-bg-base" },
  { name: "Subtle", token: "--color-bg-subtle" },
  { name: "Muted", token: "--color-bg-muted" },
  { name: "Surface 1", token: "--color-surface-1" },
  { name: "Surface 2", token: "--color-surface-2" },
  { name: "Card", token: "--color-surface-card" },
  { name: "Sunken", token: "--color-surface-sunken" },
];

const TEXT_SWATCHES: Swatch[] = [
  { name: "Primary", token: "--color-text-primary" },
  { name: "Secondary", token: "--color-text-secondary" },
  { name: "Tertiary", token: "--color-text-tertiary" },
  { name: "Quaternary", token: "--color-text-quaternary" },
  { name: "Link", token: "--color-text-link" },
  { name: "Inverse", token: "--color-text-inverse" },
];

const ACTION_SWATCHES: Swatch[] = [
  { name: "Primary", token: "--color-primary" },
  { name: "Primary hover", token: "--color-primary-hover" },
  { name: "Secondary", token: "--color-secondary" },
  { name: "Success", token: "--color-success" },
  { name: "Warning", token: "--color-warning" },
  { name: "Danger", token: "--color-danger" },
  { name: "Info", token: "--color-info" },
  { name: "Focus", token: "--color-focus-ring" },
];

const DOMAIN_SWATCHES: Swatch[] = [
  { name: "AI", token: "--color-ai" },
  { name: "Automation", token: "--color-automation" },
  { name: "Billing", token: "--color-billing" },
  { name: "Security", token: "--color-security" },
  { name: "Notifications", token: "--color-notifications" },
];

const CHART_SWATCHES: Swatch[] = Array.from({ length: 8 }, (_, i) => ({
  name: `Chart ${i + 1}`,
  token: `--color-chart-${i + 1}`,
}));

function SwatchGrid({ items }: { items: Swatch[] }) {
  return (
    <div className="swatch-grid">
      {items.map((s) => (
        <div className="swatch dk-theme-transition" key={s.token}>
          <div className="swatch-chip" style={{ background: `var(${s.token})` }} />
          <div className="swatch-meta">
            <p className="swatch-name">{s.name}</p>
            <p className="swatch-token">{s.token}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("devkit-playground-theme");
    if (
      saved === "dark" ||
      saved === "high-contrast" ||
      saved === "high-contrast-dark" ||
      saved === "light"
    ) {
      return saved;
    }
    return "light";
  });
  const [view, setView] = useState<View>("colors");
  const [activeGroup, setActiveGroup] = useState<string>("all");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (theme === "high-contrast") document.documentElement.dataset.contrast = "high";
    else delete document.documentElement.dataset.contrast;
    localStorage.setItem("devkit-playground-theme", theme);
  }, [theme]);

  const visible = useMemo(
    () => (activeGroup === "all" ? groups : groups.filter((g) => g.id === activeGroup)),
    [activeGroup]
  );

  return (
    <div className="playground">
      <header className="playground-header">
        <div>
          <h1 className="playground-brand">DevKit</h1>
          <p className="playground-sub">
            Color Token System — semantic foundations for light, dark, and high-contrast themes.
            Edit <code>registry/components/color-tokens</code> and refresh.
          </p>
        </div>
        <div className="theme-bar" role="group" aria-label="Theme">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className="theme-btn"
              aria-pressed={theme === t.id}
              onClick={() => setTheme(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="tabs" role="tablist" aria-label="Playground views">
        <button
          type="button"
          className="tab"
          role="tab"
          aria-current={view === "colors" ? "true" : undefined}
          onClick={() => setView("colors")}
        >
          Color Lab
        </button>
        <button
          type="button"
          className="tab"
          role="tab"
          aria-current={view === "catalog" ? "true" : undefined}
          onClick={() => setView("catalog")}
        >
          Layer 1 Catalog
        </button>
      </div>

      {view === "colors" ? (
        <>
          <section className="section">
            <h2 className="section-title">Surfaces</h2>
            <p className="section-meta">Layered backgrounds — soft light, deep dark (not pure black).</p>
            <SwatchGrid items={SURFACE_SWATCHES} />
          </section>

          <section className="section">
            <h2 className="section-title">Text</h2>
            <p className="section-meta">Hierarchy with AA-oriented contrast on base surfaces.</p>
            <SwatchGrid items={TEXT_SWATCHES} />
            <div className="demo-card dk-theme-transition" style={{ marginTop: "1rem" }}>
              <div className="text-stack">
                <p style={{ color: "var(--color-text-primary)", fontSize: "1.25rem", fontWeight: 600 }}>
                  Primary — The quick brown fox
                </p>
                <p style={{ color: "var(--color-text-secondary)" }}>Secondary — Supporting copy</p>
                <p style={{ color: "var(--color-text-tertiary)", fontSize: "0.875rem" }}>
                  Tertiary — Metadata and captions
                </p>
                <p style={{ color: "var(--color-text-link)" }}>Link — Learn more</p>
              </div>
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">Actions & status</h2>
            <p className="section-meta">Primary / secondary actions and semantic status colors.</p>
            <SwatchGrid items={ACTION_SWATCHES} />
            <div className="demo-row" style={{ marginTop: "1rem" }}>
              <button type="button" className="demo-btn demo-btn-primary">
                Primary
              </button>
              <button type="button" className="demo-btn demo-btn-secondary">
                Secondary
              </button>
              <button type="button" className="demo-btn demo-btn-danger">
                Danger
              </button>
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">Product domains</h2>
            <p className="section-meta">AI, automation, billing, security, notifications.</p>
            <SwatchGrid items={DOMAIN_SWATCHES} />
          </section>

          <section className="section">
            <h2 className="section-title">Charts</h2>
            <p className="section-meta">Eight series tokens for analytics surfaces.</p>
            <SwatchGrid items={CHART_SWATCHES} />
          </section>

          <section className="section">
            <h2 className="section-title">Materials</h2>
            <p className="section-meta">Translucent overlays and chrome fills.</p>
            <div className="demo-row">
              {(
                [
                  ["Scrim", "var(--color-overlay-scrim)"],
                  ["Material thin", "var(--color-material-thin)"],
                  ["Material regular", "var(--color-material-regular)"],
                  ["Selected", "var(--color-selected)"],
                ] as const
              ).map(([label, bg]) => (
                <div
                  key={label}
                  className="demo-card dk-theme-transition"
                  style={{
                    background: bg,
                    borderColor: "var(--color-border)",
                    minHeight: "5rem",
                  }}
                >
                  <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <nav className="tabs" aria-label="Foundation groups">
            <button
              type="button"
              className="tab"
              aria-current={activeGroup === "all" ? "true" : undefined}
              onClick={() => setActiveGroup("all")}
            >
              All (100)
            </button>
            {groups.map((g) => (
              <button
                key={g.id}
                type="button"
                className="tab"
                aria-current={activeGroup === g.id ? "true" : undefined}
                onClick={() => setActiveGroup(g.id)}
              >
                {g.name}
              </button>
            ))}
          </nav>

          {visible.map((group) => (
            <section className="section" key={group.id} id={group.id}>
              <h2 className="section-title">{group.name}</h2>
              <p className="section-meta">
                IDs {group.idRange.min}–{group.idRange.max} · {group.components.length} packages
              </p>
              <div className="card-grid">
                {group.components.map((comp) => {
                  const ready = comp.name === "color-tokens" ||
                    comp.name === "light-theme" ||
                    comp.name === "dark-theme" ||
                    comp.name === "high-contrast-theme" ||
                    comp.name === "semantic-colors" ||
                    comp.name === "accent-color-system";
                  return (
                    <article className="stub-card dk-theme-transition" key={comp.name}>
                      <span className="stub-id">#{comp.id}</span>
                      <h3 className="stub-name">{comp.displayName}</h3>
                      <p className="stub-slug">{comp.name}</p>
                      <span className={ready ? "badge badge-ready" : "badge"}>
                        {ready ? "Ready" : "Empty stub"}
                      </span>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
