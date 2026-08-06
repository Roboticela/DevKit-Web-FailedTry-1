import { useEffect, useMemo, useState, type ReactNode } from "react";
import catalog from "./foundation-catalog.json";
import { DisplayText } from "@devkit/DisplayText";
import { Heading } from "@devkit/Heading";
import { Title } from "@devkit/Title";
import { Subtitle } from "@devkit/Subtitle";
import { BodyText } from "@devkit/BodyText";
import { Caption } from "@devkit/Caption";
import { Label } from "@devkit/Label";
import { HelperText } from "@devkit/HelperText";
import { CodeText } from "@devkit/CodeText";
import { NumericDisplay } from "@devkit/NumericDisplay";

type ThemeMode = "light" | "dark" | "high-contrast" | "high-contrast-dark";
type View = "colors" | "typography" | "catalog";

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

const READY = new Set([
  "color-tokens",
  "typography-tokens",
  "font-family-tokens",
  "font-weight-tokens",
  "font-size-tokens",
  "line-height-tokens",
  "letter-spacing-tokens",
  "light-theme",
  "dark-theme",
  "high-contrast-theme",
  "semantic-colors",
  "accent-color-system",
  "display-text",
  "heading",
  "title",
  "subtitle",
  "body-text",
  "caption",
  "label",
  "helper-text",
  "code-text",
  "numeric-display",
]);

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

function TypeRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="type-row">
      <Caption className="type-row-label">{label}</Caption>
      <div className="type-row-sample">{children}</div>
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
  const [view, setView] = useState<View>("typography");
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
            Foundation labs — Color Tokens and Typography System. Edit packages under{" "}
            <code>registry/components/</code> and hot-reload.
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
        {(
          [
            ["typography", "Typography Lab"],
            ["colors", "Color Lab"],
            ["catalog", "Layer 1 Catalog"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className="tab"
            role="tab"
            aria-current={view === id ? "true" : undefined}
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "typography" ? (
        <>
          <section className="section">
            <h2 className="section-title">Hierarchy</h2>
            <p className="section-meta">
              Fluid scale across mobile → tablet → desktop. Resize the window to see clamp() adapt.
            </p>
            <div className="demo-card type-stack">
              <TypeRow label="Display">
                <DisplayText>Display — Impact moments</DisplayText>
              </TypeRow>
              <TypeRow label="Hero">
                <DisplayText variant="hero">Hero — Feature statement</DisplayText>
              </TypeRow>
              <TypeRow label="Page title">
                <Title variant="page">Page title — Workspace</Title>
              </TypeRow>
              <TypeRow label="Section">
                <Title variant="section">Section title — Overview</Title>
              </TypeRow>
              <TypeRow label="Subtitle">
                <Subtitle>Subtitle — Supporting line under a title</Subtitle>
              </TypeRow>
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">Heading levels</h2>
            <p className="section-meta">Semantic h1–h6 with responsive metrics.</p>
            <div className="demo-card type-stack">
              {([1, 2, 3, 4, 5, 6] as const).map((level) => (
                <TypeRow key={level} label={`H${level}`}>
                  <Heading level={level}>Heading level {level}</Heading>
                </TypeRow>
              ))}
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">Reading & UI text</h2>
            <div className="demo-card type-stack">
              <TypeRow label="Body">
                <BodyText>
                  Body — Enterprise interfaces need calm, readable copy with comfortable line height
                  and room to breathe across languages.
                </BodyText>
              </TypeRow>
              <TypeRow label="Small body">
                <BodyText size="sm">
                  Small body — Dense secondary reading for side panels and descriptions.
                </BodyText>
              </TypeRow>
              <TypeRow label="Caption">
                <Caption>Caption — Updated 2 hours ago · Metadata</Caption>
              </TypeRow>
              <TypeRow label="Label">
                <Label>Label — Email address</Label>
              </TypeRow>
              <TypeRow label="Helper">
                <HelperText>Helper — Use your work email for SSO.</HelperText>
              </TypeRow>
              <TypeRow label="Button">
                <span className="dk-type-button">Button text</span>
                {" · "}
                <span className="dk-type-button dk-type-button-sm">Small</span>
                {" · "}
                <span className="dk-type-button dk-type-button-lg">Large</span>
              </TypeRow>
              <TypeRow label="Badge">
                <span className="dk-type-badge" style={{ color: "var(--color-primary)" }}>
                  Active
                </span>
              </TypeRow>
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">Code, numbers & tables</h2>
            <div className="demo-card type-stack">
              <TypeRow label="Code">
                <CodeText>const token = &quot;--text-body-size&quot;;</CodeText>
              </TypeRow>
              <TypeRow label="Numeric">
                <NumericDisplay>1,234,567.89</NumericDisplay>
              </TypeRow>
              <TypeRow label="Statistics">
                <NumericDisplay variant="stat">98.6%</NumericDisplay>
              </TypeRow>
              <TypeRow label="Table">
                <span className="dk-type-table-header">Status</span>
                {" · "}
                <span className="dk-type-table">In progress</span>
              </TypeRow>
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">Truncation & wrapping</h2>
            <div className="demo-row">
              <div className="demo-card" style={{ maxWidth: "14rem" }}>
                <Caption>Truncate</Caption>
                <BodyText truncate>
                  This line will ellipsis when it overflows the narrow card width.
                </BodyText>
              </div>
              <div className="demo-card" style={{ maxWidth: "16rem" }}>
                <Caption>Line clamp 2</Caption>
                <BodyText clamp={2}>
                  Two-line clamp keeps dense lists readable while preserving hierarchy and avoiding
                  layout collapse on long localized strings.
                </BodyText>
              </div>
              <div className="demo-card" style={{ maxWidth: "16rem" }}>
                <Caption>Hyphens / wrap</Caption>
                <BodyText hyphens>
                  Localization-friendly wrapping for exceptionallylongcompoundwords and narrow
                  columns.
                </BodyText>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {view === "colors" ? (
        <>
          <section className="section">
            <h2 className="section-title">Surfaces</h2>
            <p className="section-meta">Layered backgrounds — soft light, deep dark.</p>
            <SwatchGrid items={SURFACE_SWATCHES} />
          </section>
          <section className="section">
            <h2 className="section-title">Text colors</h2>
            <SwatchGrid items={TEXT_SWATCHES} />
          </section>
          <section className="section">
            <h2 className="section-title">Actions & status</h2>
            <SwatchGrid items={ACTION_SWATCHES} />
          </section>
          <section className="section">
            <h2 className="section-title">Product domains</h2>
            <SwatchGrid items={DOMAIN_SWATCHES} />
          </section>
          <section className="section">
            <h2 className="section-title">Charts</h2>
            <SwatchGrid items={CHART_SWATCHES} />
          </section>
        </>
      ) : null}

      {view === "catalog" ? (
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
                  const ready = READY.has(comp.name);
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
      ) : null}
    </div>
  );
}
