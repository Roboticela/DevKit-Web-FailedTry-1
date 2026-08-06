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
import { ResponsiveGrid, GridItem } from "@devkit/ResponsiveGrid";
import { Container } from "@devkit/Container";
import { SafeArea } from "@devkit/SafeArea";
import { Surface, CardSurface, PanelSurface, WidgetSurface, ModalSurface } from "@devkit/Surface";
import { Overlay } from "@devkit/Overlay";
import { GlassSurface } from "@devkit/GlassSurface";
import { FrostedSurface } from "@devkit/FrostedSurface";
import { ShadowLayer } from "@devkit/ShadowLayer";
import { RoundedCorner, ShapeNested } from "@devkit/RoundedCorner";
import { CircleShape } from "@devkit/CircleShape";
import { PillShape } from "@devkit/PillShape";
import { AvatarShape } from "@devkit/AvatarShape";
import { Border } from "@devkit/Border";
import { Divider } from "@devkit/Divider";
import { Section } from "@devkit/Section";
import { StackLayout } from "@devkit/StackLayout";
import { DensityProvider, type DensityMode } from "@devkit/DensityProvider";
import { Space } from "@devkit/Space";
import { useTheme, type ThemeId } from "@devkit/ThemeProvider";

type View = "shape" | "theme" | "surface" | "spacing" | "grid" | "typography" | "colors" | "catalog";

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

const THEMES: { id: ThemeId; label: string }[] = [
  { id: "system", label: "System" },
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
  "dynamic-theme",
  "elevation-tokens",
  "motion-tokens",
  "blur-tokens",
  "gradient-tokens",
  "theme-provider",
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
  "responsive-grid",
  "flex-layout",
  "stack-layout",
  "inline-layout",
  "spacer",
  "container",
  "section",
  "surface",
  "glass-surface",
  "frosted-surface",
  "shadow-layer",
  "overlay",
  "rounded-corner",
  "circle-shape",
  "pill-shape",
  "avatar-shape",
  "border",
  "divider",
  "separator",
  "safe-area",
  "aspect-ratio",
  "responsive-spacing",
  "margin-utilities",
  "padding-utilities",
  "gap-utilities",
  "content-width-manager",
  "auto-layout",
  "alignment-utilities",
  "distribution-utilities",
  "position-utilities",
  "overflow-utilities",
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
  const { theme, setTheme, resolvedTheme, systemTheme, setVars, clearVars, vars, registerTheme } =
    useTheme();
  const [view, setView] = useState<View>("shape");
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [density, setDensity] = useState<DensityMode>("comfortable");
  const [accent, setAccent] = useState("#0071e3");
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    registerTheme({
      id: "midnight",
      label: "Midnight",
      colorScheme: "dark",
      vars: {
        "--color-bg-canvas": "#070b16",
        "--color-bg-base": "#0b1020",
        "--color-bg-subtle": "#12182a",
        "--color-surface-card": "#151c30",
        "--color-surface-1": "#12182a",
        "--color-surface-2": "#151c30",
        "--color-text-primary": "#e8ecf8",
        "--color-text-secondary": "#9aa3bd",
        "--color-primary": "#7aa2ff",
        "--color-border-subtle": "#243049",
        "--color-border": "#2f3d5c",
      },
    });
  }, [registerTheme]);

  useEffect(() => {
    if (accent) setVars({ "--color-primary": accent, "--color-primary-hover": accent });
  }, [accent, setVars]);

  const visible = useMemo(
    () => (activeGroup === "all" ? groups : groups.filter((g) => g.id === activeGroup)),
    [activeGroup]
  );

  return (
    <DensityProvider density={density}>
    <div className="playground">
      <header className="playground-header">
        <div>
          <h1 className="playground-brand">DevKit</h1>
          <p className="playground-sub">
            Foundation labs — shape, surfaces, theme, spacing, grid, typography, and color. Edit
            packages under <code>registry/components/</code> and hot-reload.
          </p>
        </div>
        <div className="theme-bar" role="group" aria-label="Theme and density">
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
          <button
            type="button"
            className="theme-btn"
            aria-pressed={theme === "midnight"}
            onClick={() => setTheme("midnight")}
          >
            Midnight
          </button>
          {(["compact", "comfortable", "spacious"] as const).map((d) => (
            <button
              key={d}
              type="button"
              className="theme-btn"
              aria-pressed={density === d}
              onClick={() => setDensity(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </header>

      <div className="tabs" role="tablist" aria-label="Playground views">
        {(
          [
            ["shape", "Shape Lab"],
            ["surface", "Surface Lab"],
            ["theme", "Theme Lab"],
            ["spacing", "Spacing Lab"],
            ["grid", "Grid Lab"],
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

      {view === "shape" ? (
        <Container>
          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Radius scale</Title>
              <BodyText size="sm">Sharp → full. Density and breakpoints adjust semantic roles.</BodyText>
              <div className="shape-scale">
                {(
                  [
                    ["none", "var(--radius-none)"],
                    ["xs", "var(--radius-xs)"],
                    ["sm", "var(--radius-sm)"],
                    ["md", "var(--radius-md)"],
                    ["lg", "var(--radius-lg)"],
                    ["xl", "var(--radius-xl)"],
                    ["2xl", "var(--radius-2xl)"],
                    ["3xl", "var(--radius-3xl)"],
                    ["full", "var(--radius-full)"],
                  ] as const
                ).map(([name, token]) => (
                  <div key={name} className="shape-scale-item">
                    <div className="shape-scale-swatch dk-theme-transition" style={{ borderRadius: token }} />
                    <Caption>{name}</Caption>
                  </div>
                ))}
              </div>
            </StackLayout>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Semantic roles</Title>
              <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
                {(
                  [
                    ["Button", "dk-shape-button demo-btn demo-btn-primary"],
                    ["Input", "dk-shape-input shape-fake-input"],
                    ["Card", "dk-shape-card dk-surface dk-surface-card"],
                    ["Container", "dk-shape-container dk-surface dk-surface-panel"],
                  ] as const
                ).map(([label, cls]) => (
                  <GridItem key={label} span={{ sm: 4, md: 4, lg: 3 }}>
                    <div className={`${cls} dk-theme-transition shape-role-demo`}>
                      <Caption>{label}</Caption>
                    </div>
                  </GridItem>
                ))}
              </ResponsiveGrid>
            </StackLayout>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Circle · pill · avatar · chip</Title>
              <div className="shape-inline-row">
                <CircleShape size="sm" className="shape-fill">
                  <Caption>S</Caption>
                </CircleShape>
                <CircleShape size="md" className="shape-fill">
                  <Caption>M</Caption>
                </CircleShape>
                <CircleShape size="lg" className="shape-fill">
                  <Caption>L</Caption>
                </CircleShape>
                <PillShape>Filter</PillShape>
                <PillShape chip interactive as="button" type="button">
                  Chip
                </PillShape>
                <AvatarShape initials="DK" size="md" />
                <AvatarShape initials="SQ" size="md" corner="square" />
                <AvatarShape initials="SF" size="md" corner="soft" />
              </div>
              <Divider />
              <BodyText size="sm">Divider sits between shape groups.</BodyText>
            </StackLayout>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Nested radii</Title>
              <BodyText size="sm">Child radius = parent − inset — continuous Apple-like nesting.</BodyText>
              <RoundedCorner nest nestRadius="card" className="dk-surface dk-surface-card dk-surface-pad-md dk-theme-transition">
                <ShapeNested className="dk-surface dk-surface-sunken dk-surface-pad-sm dk-theme-transition">
                  <Caption>Nested surface</Caption>
                  <BodyText size="sm">Shares curvature with the parent card.</BodyText>
                </ShapeNested>
              </RoundedCorner>
              <Border tone="subtle" radius="lg" className="shape-border-demo dk-theme-transition">
                <Caption>Border + radius</Caption>
              </Border>
            </StackLayout>
          </Section>
        </Container>
      ) : null}

      {view === "surface" ? (
        <Container>
          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Roles</Title>
              <BodyText size="sm">
                Hierarchy through elevation and materials — soft borders, no heavy chrome.
              </BodyText>
              <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} equalHeight gap="tight">
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <CardSurface>
                    <Caption>Card</Caption>
                    <BodyText size="sm">Grouped content</BodyText>
                  </CardSurface>
                </GridItem>
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <PanelSurface>
                    <Caption>Panel</Caption>
                    <BodyText size="sm">Inset region</BodyText>
                  </PanelSurface>
                </GridItem>
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <WidgetSurface>
                    <Caption>Widget</Caption>
                    <NumericDisplay variant="stat">98%</NumericDisplay>
                  </WidgetSurface>
                </GridItem>
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <ShadowLayer level={3} stack>
                    <Caption>Shadow layer</Caption>
                    <BodyText size="sm">Elev 3 · no box-shadow</BodyText>
                  </ShadowLayer>
                </GridItem>
              </ResponsiveGrid>
            </StackLayout>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Materials</Title>
              <div className="surface-material-stage dk-theme-transition">
                <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
                  <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                    <GlassSurface stack>
                      <Caption>Glass</Caption>
                      <BodyText size="sm">Thin material + blur</BodyText>
                    </GlassSurface>
                  </GridItem>
                  <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                    <FrostedSurface stack>
                      <Caption>Frosted</Caption>
                      <BodyText size="sm">Thick material</BodyText>
                    </FrostedSurface>
                  </GridItem>
                  <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                    <Surface variant="card" material="material" elevation={2} stack>
                      <Caption>Material</Caption>
                      <BodyText size="sm">Regular chrome</BodyText>
                    </Surface>
                  </GridItem>
                </ResponsiveGrid>
              </div>
            </StackLayout>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Elevation scale</Title>
              <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} equalHeight gap="tight">
                {([0, 1, 2, 3, 4] as const).map((level) => (
                  <GridItem key={level} span={{ sm: 4, md: 4, lg: 2 }}>
                    <Surface elevation={level} stack>
                      <Caption>Elev {level}</Caption>
                      <BodyText size="sm">Layer</BodyText>
                    </Surface>
                  </GridItem>
                ))}
                <GridItem span={{ sm: 4, md: 4, lg: 2 }}>
                  <Surface sunken quiet stack>
                    <Caption>Sunken</Caption>
                    <BodyText size="sm">Recessed</BodyText>
                  </Surface>
                </GridItem>
              </ResponsiveGrid>
            </StackLayout>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Modal / overlay</Title>
              <button type="button" className="demo-btn demo-btn-primary" onClick={() => setOverlayOpen(true)}>
                Open modal
              </button>
              <Overlay open={overlayOpen} onClose={() => setOverlayOpen(false)} size="md">
                <Title variant="section">Confirm action</Title>
                <BodyText size="sm">
                  Overlay pairs a scrim with a modal surface. Escape or scrim click closes.
                </BodyText>
                <button type="button" className="demo-btn demo-btn-primary" onClick={() => setOverlayOpen(false)}>
                  Done
                </button>
              </Overlay>
              <ModalSurface size="sm" className="surface-inline-modal">
                <Caption>Inline modal face</Caption>
                <BodyText size="sm">Same chrome without the overlay root.</BodyText>
              </ModalSurface>
            </StackLayout>
          </Section>
        </Container>
      ) : null}

      {view === "theme" ? (
        <Container>
          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Theme Engine</Title>
              <BodyText size="sm">
                Preference <strong>{theme}</strong> · resolved <strong>{resolvedTheme}</strong> ·
                system <strong>{systemTheme}</strong>
              </BodyText>
              <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} equalHeight gap="tight">
                {[0, 1, 2, 3, 4].map((level) => (
                  <GridItem key={level} span={{ sm: 4, md: 4, lg: 2 }}>
                    <div className={`dk-elev-${level} dk-theme-transition grid-demo-cell`}>
                      <Caption>Elevation {level}</Caption>
                      <BodyText size="sm">Surface hierarchy</BodyText>
                    </div>
                  </GridItem>
                ))}
                <GridItem span={{ sm: 4, md: 4, lg: 2 }}>
                  <div className="dk-material dk-theme-transition grid-demo-cell">
                    <Caption>Material</Caption>
                    <BodyText size="sm">Blur token</BodyText>
                  </div>
                </GridItem>
              </ResponsiveGrid>
            </StackLayout>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Runtime accent</Title>
              <BodyText size="sm">
                setVars updates CSS variables on the document root instantly — no remount, no layout
                shift.
              </BodyText>
              <div className="theme-accent-row">
                <Label htmlFor="accent">Primary</Label>
                <input
                  id="accent"
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  aria-label="Primary accent color"
                />
                <button type="button" className="theme-btn" onClick={() => { clearVars(); setAccent("#0071e3"); }}>
                  Reset vars
                </button>
                <Caption>{Object.keys(vars).length ? `${Object.keys(vars).length} overrides` : "No overrides"}</Caption>
              </div>
              <button type="button" className="demo-btn demo-btn-primary dk-theme-transition">
                Primary action
              </button>
            </StackLayout>
          </Section>
        </Container>
      ) : null}

      {view === "spacing" ? (
        <Container>
          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Primitive scale</Title>
              <BodyText size="sm">
                4px unit · density <strong>{density}</strong> · resize for responsive semantic roles.
              </BodyText>
              <div className="space-scale">
                {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((n) => (
                  <div className="space-scale-row" key={n}>
                    <Caption className="space-scale-label">--space-{n}</Caption>
                    <div
                      className="space-scale-bar"
                      style={{ width: `var(--space-${n})`, minWidth: "2px" }}
                    />
                  </div>
                ))}
              </div>
            </StackLayout>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Semantic roles</Title>
              <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight">
                {(
                  [
                    ["Card", "card"],
                    ["Form", "form"],
                    ["Modal", "modal"],
                    ["Stack", "stack"],
                  ] as const
                ).map(([label, preset]) => (
                  <GridItem key={preset} span={{ sm: 4, md: 4, lg: 3 }}>
                    <Surface>
                      <Space preset={preset}>
                        <Caption>{label}</Caption>
                        <BodyText size="sm">Uses --space-{preset === "stack" ? "stack-gap" : preset === "card" ? "card-padding" : preset === "form" ? "form-gap" : "modal-padding"}</BodyText>
                      </Space>
                    </Surface>
                  </GridItem>
                ))}
              </ResponsiveGrid>
            </StackLayout>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Page / section / nav / table</Title>
              <div className="dk-space-section-gap">
                <Surface className="dk-space-nav-item">
                  <Caption>Nav item padding</Caption>
                </Surface>
                <div className="dk-space-table-cell" style={{ background: "var(--color-bg-subtle)", borderRadius: "0.5rem" }}>
                  <Caption>Table cell padding</Caption>
                </div>
                <div className="dk-content-width dk-content-width-prose">
                  <BodyText size="sm">Content width manager (prose) centers readable measure.</BodyText>
                </div>
              </div>
            </StackLayout>
          </Section>
        </Container>
      ) : null}

      {view === "grid" ? (
        <SafeArea>
          <Container>
            <Section>
              <StackLayout gap="var(--space-stack-gap)">
                <Title variant="section">Responsive columns</Title>
                <BodyText size="sm">
                  Resize the viewport — 4 → 8 → 12 columns. Touch gutters on phone, airy spacing on
                  desktop.
                </BodyText>
                <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} equalHeight>
                  {(
                    [
                      { sm: 4, md: 4, lg: 3 },
                      { sm: 4, md: 4, lg: 3 },
                      { sm: 4, md: 4, lg: 3 },
                      { sm: 4, md: 4, lg: 3 },
                      { sm: 4, md: 8, lg: 8 },
                      { sm: 4, md: 8, lg: 4 },
                      { sm: 4, md: 4, lg: 6 },
                      { sm: 4, md: 4, lg: 6 },
                    ] as const
                  ).map((span, i) => (
                    <GridItem key={i} span={span}>
                      <Surface className="grid-demo-cell">
                        <Caption>
                          {span.sm}/{span.md}/{span.lg}
                        </Caption>
                        <BodyText size="sm">Cell {i + 1}</BodyText>
                      </Surface>
                    </GridItem>
                  ))}
                </ResponsiveGrid>
              </StackLayout>
            </Section>

            <Section>
              <StackLayout gap="var(--space-stack-gap)">
                <Title variant="section">Equal height</Title>
                <BodyText size="sm">
                  Uneven copy in the same row — surfaces stretch to match the tallest cell (`equalHeight`).
                </BodyText>
                <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} equalHeight gap="tight">
                  <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                    <Surface className="grid-demo-cell">
                      <Caption>Short</Caption>
                      <BodyText size="sm">One line.</BodyText>
                    </Surface>
                  </GridItem>
                  <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                    <Surface className="grid-demo-cell">
                      <Caption>Medium</Caption>
                      <BodyText size="sm">
                        Two lines of supporting copy so the card grows and neighbors stretch with it.
                      </BodyText>
                    </Surface>
                  </GridItem>
                  <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                    <Surface className="grid-demo-cell">
                      <Caption>Tall</Caption>
                      <BodyText size="sm">
                        Longer body text fills this cell. Equal-height keeps the other two surfaces
                        aligned to this row height instead of collapsing to their content.
                      </BodyText>
                      <BodyText size="sm">Extra block to exaggerate the mismatch without the flag.</BodyText>
                    </Surface>
                  </GridItem>
                </ResponsiveGrid>
              </StackLayout>
            </Section>

            <Section>
              <StackLayout gap="var(--space-stack-gap)">
                <Title variant="section">Auto-fit</Title>
                <BodyText size="sm">Tracks grow/shrink with `minmax` — productivity on wide screens.</BodyText>
                <ResponsiveGrid autofit gap="tight">
                  {Array.from({ length: 6 }, (_, i) => (
                    <Surface key={i} className="grid-demo-cell">
                      <Caption>Autofit</Caption>
                      <BodyText size="sm">Card {i + 1}</BodyText>
                    </Surface>
                  ))}
                </ResponsiveGrid>
              </StackLayout>
            </Section>

            <Section>
              <StackLayout gap="var(--space-stack-gap)">
                <Title variant="section">Nested grid</Title>
                <ResponsiveGrid columns={{ sm: 4, lg: 12 }}>
                  <GridItem span={{ sm: 4, lg: 8 }}>
                    <Surface className="grid-demo-cell">
                      <Caption>Primary · nested</Caption>
                      <ResponsiveGrid nested columns={{ sm: 2, lg: 2 }} gap="tight" style={{ marginTop: "var(--space-3)" }}>
                        <GridItem span={1}>
                          <div className="grid-demo-nested">A</div>
                        </GridItem>
                        <GridItem span={1}>
                          <div className="grid-demo-nested">B</div>
                        </GridItem>
                      </ResponsiveGrid>
                    </Surface>
                  </GridItem>
                  <GridItem span={{ sm: 4, lg: 4 }}>
                    <Surface className="grid-demo-cell">
                      <Caption>Aside</Caption>
                      <BodyText size="sm">Stays in reading order on mobile (full width).</BodyText>
                    </Surface>
                  </GridItem>
                </ResponsiveGrid>
              </StackLayout>
            </Section>

            <Section>
              <StackLayout gap="var(--space-stack-gap)">
                <Title variant="section">Masonry</Title>
                <div className="dk-masonry">
                  {[4, 7, 5, 9, 6, 8, 5, 7].map((h, i) => (
                    <Surface key={i} className="grid-demo-cell" style={{ minHeight: `${h * 0.75}rem` }}>
                      <Caption>Tile {i + 1}</Caption>
                    </Surface>
                  ))}
                </div>
              </StackLayout>
            </Section>
          </Container>
        </SafeArea>
      ) : null}

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
    </DensityProvider>
  );
}
