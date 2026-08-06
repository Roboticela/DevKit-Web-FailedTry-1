import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
import { SafeArea, useSafeArea } from "@devkit/SafeArea";
import {
  AspectRatio,
  AspectVideo,
  AspectSquare,
  AspectCard,
  AspectA4,
  AspectMobile,
  AspectWidget,
  AspectStory,
  AspectUltrawide,
} from "@devkit/AspectRatio";
import {
  Visibility,
  VisibilityProvider,
  MobileOnly,
  TabletOnly,
  DesktopOnly,
  LargeScreens,
  LandscapeOnly,
  PortraitOnly,
  PrintMode,
  Foldables,
  AccessibilityMode,
  useMediaQuery,
  useVisibility,
} from "@devkit/ResponsiveVisibility";
import {
  BREAKPOINTS,
  BREAKPOINT_ORDER,
  BreakpointMatch,
  DeviceDetector,
  mq,
  useBreakpoint,
  useBreakpointSnapshot,
  useBreakpointValue,
  useContainerQuery,
  useDensity,
  useFoldable,
  useHoverCapability,
  useOrientation,
  usePointer,
  usePrefersReducedMotion,
  usePrefersReducedTransparency,
  useTouch,
  useBreakpointMatch,
} from "@devkit/BreakpointManager";
import {
  Surface,
  CardSurface,
  PanelSurface,
  WidgetSurface,
  ModalSurface,
  TooltipSurface,
  DropdownSurface,
  MenuSurface,
  SidePanelSurface,
  OverlaySurface,
} from "@devkit/Surface";
import { Overlay } from "@devkit/Overlay";
import { GlassSurface } from "@devkit/GlassSurface";
import { FrostedSurface } from "@devkit/FrostedSurface";
import { Elevation } from "@devkit/Elevation";
import { ShadowLayer } from "@devkit/ShadowLayer";
import { RoundedCorner, ShapeNested } from "@devkit/RoundedCorner";
import { CircleShape } from "@devkit/CircleShape";
import { PillShape } from "@devkit/PillShape";
import { AvatarShape } from "@devkit/AvatarShape";
import { Border } from "@devkit/Border";
import { Divider } from "@devkit/Divider";
import { Section } from "@devkit/Section";
import { StackLayout, Stack, HStack, VStack, InlineStack } from "@devkit/StackLayout";
import {
  Spacer,
  SpacerTiny,
  SpacerSmall,
  SpacerMedium,
  SpacerLarge,
  SpacerXL,
  SpacerSection,
  SpacerCard,
  SpacerForm,
  SpacerModal,
  SpacerNav,
  SpacerHero,
  FlexGrowSpacer,
} from "@devkit/Spacer";
import {
  Flex,
  FlexItem,
  FlexSpacer,
  FlexNavbar,
  FlexToolbar,
  FlexFormRow,
  FlexDashboardSummary,
  FlexActionGroup,
  FlexProfileHeader,
  FlexCardFooter,
  FlexFilterBar,
  FlexStatsRow,
  FlexButtonGroup,
} from "@devkit/FlexLayout";
import { DensityProvider, type DensityMode } from "@devkit/DensityProvider";
import { Space } from "@devkit/Space";
import { useTheme, type ThemeId } from "@devkit/ThemeProvider";
import { Motion, MotionStagger } from "@devkit/Motion";
import {
  HoverAnimation,
  PressAnimation,
  SkeletonAnimation,
  LoadingTransition,
  DragAnimation,
} from "@devkit/MotionPresets";
import { useReducedMotion, useMotionPreference, type MotionPreference } from "@devkit/useReducedMotion";
import {
  Icon,
  IconLabel,
  ICON_CATEGORIES,
  searchIcons,
  type IconVariant,
} from "@devkit/Icon";
import {
  IconButton,
  StatusIcon,
  AiIcon,
  IconBadge,
  AnimatedIcon,
} from "@devkit/IconExtras";

type View =
  | "breakpoints"
  | "visibility"
  | "aspect"
  | "safe-area"
  | "surface"
  | "section"
  | "spacer"
  | "flex"
  | "stack"
  | "container"
  | "icons"
  | "motion"
  | "elevation"
  | "shape"
  | "theme"
  | "spacing"
  | "grid"
  | "typography"
  | "colors"
  | "catalog";

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
  "fade-animation",
  "scale-animation",
  "slide-animation",
  "page-transition",
  "loading-transition",
  "hover-animation",
  "press-animation",
  "ripple-alternative",
  "drag-animation",
  "skeleton-animation",
  "icon",
  "icon-button",
  "animated-icon",
  "status-icon",
  "brand-icon",
  "file-icon",
  "social-icon",
  "ai-icon",
  "emoji-renderer",
  "icon-badge",
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
  "responsive-visibility",
  "device-detector",
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

function VisibilityModesDemo() {
  const [open, setOpen] = useState(true);
  return (
    <VStack gap="md">
      <button type="button" className="demo-btn" onClick={() => setOpen((v) => !v)}>
        Toggle visible={String(open)}
      </button>
      <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
        <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
          <Caption>hide</Caption>
          <Visibility visible={open} mode="hide" block className="vis-demo-tile">
            <BodyText size="sm">Unmounts when off</BodyText>
          </Visibility>
        </GridItem>
        <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
          <Caption>preserve</Caption>
          <Visibility visible={open} mode="preserve" block className="vis-demo-tile">
            <BodyText size="sm">Keeps layout space</BodyText>
          </Visibility>
        </GridItem>
        <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
          <Caption>collapse</Caption>
          <Visibility visible={open} mode="collapse" motion block className="vis-demo-tile">
            <BodyText size="sm">Animates closed</BodyText>
          </Visibility>
        </GridItem>
        <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
          <Caption>fade</Caption>
          <Visibility visible={open} mode="fade" motion block className="vis-demo-tile">
            <BodyText size="sm">Opacity transition</BodyText>
          </Visibility>
        </GridItem>
      </ResponsiveGrid>
    </VStack>
  );
}

function VisibilityMatchDemo() {
  const wide = useMediaQuery("(min-width: 1024px)");
  const showAdmin = useVisibility({ role: "admin", flag: "beta" });
  return (
    <Surface stack padding="sm" elevation={1} className="vis-demo-tile">
      <Caption>hooks</Caption>
      <BodyText size="sm">useMediaQuery ≥1024 → {String(wide)}</BodyText>
      <BodyText size="sm">useVisibility admin+beta → {String(showAdmin)}</BodyText>
    </Surface>
  );
}

function BreakpointLabPanel() {
  const snap = useBreakpointSnapshot();
  const bp = useBreakpoint();
  const cols = useBreakpointValue({ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 });
  const fromLg = useBreakpointMatch("lg", "up");
  const orientation = useOrientation();
  const pointer = usePointer();
  const hover = useHoverCapability();
  const touch = useTouch();
  const { dpr, dense } = useDensity();
  const fold = useFoldable();
  const reduceMotion = usePrefersReducedMotion();
  const reduceFx = usePrefersReducedTransparency();
  const cqRef = useRef<HTMLDivElement>(null);
  const cqMd = useContainerQuery(cqRef, { from: "md" });

  return (
    <div className="breakpoint-lab">
      <Container variant="dashboard" paddingY="section" as="main" aria-label="Breakpoint lab">
        <VStack gap="spacious">
          <VStack gap="sm">
            <Title variant="section">Breakpoint Manager</Title>
            <BodyText size="sm">
              Semantic xs→3xl scale — live viewport, capabilities, container queries. Provider syncs{" "}
              <CodeText>data-bp</CodeText> on{" "}
              <CodeText>&lt;html&gt;</CodeText>.
            </BodyText>
          </VStack>

          <Section title="Live snapshot" description="Resize / rotate — values update from the centralized manager.">
            <DeviceDetector className="bp-demo-snapshot">
              <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight">
                {(
                  [
                    ["breakpoint", bp],
                    ["width", `${snap.width}px`],
                    ["height", `${snap.height}px`],
                    ["orientation", orientation],
                    ["pointer", pointer],
                    ["hover", hover],
                    ["touch", String(touch)],
                    ["dpr", String(dpr)],
                    ["dense", String(dense)],
                    ["foldable", String(fold)],
                    ["reduced motion", String(reduceMotion)],
                    ["reduced transparency", String(reduceFx)],
                    ["hydrated", String(snap.hydrated)],
                    ["columns (value map)", String(cols)],
                    ["from lg", String(fromLg)],
                  ] as const
                ).map(([label, value]) => (
                  <GridItem key={label} span={{ sm: 2, md: 4, lg: 3 }}>
                    <Surface stack padding="sm" elevation={1}>
                      <Caption>{label}</Caption>
                      <BodyText size="sm">{value}</BodyText>
                    </Surface>
                  </GridItem>
                ))}
              </ResponsiveGrid>
            </DeviceDetector>
          </Section>

          <Section title="Semantic scale" description="Token · min-width · legacy alias">
            <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight">
              {BREAKPOINT_ORDER.map((token) => {
                const active = token === bp;
                return (
                  <GridItem key={token} span={{ sm: 2, md: 4, lg: 3 }}>
                    <div className={`bp-demo-token${active ? " is-active" : ""}`}>
                      <Caption>
                        {token} · {BREAKPOINTS[token]}px
                      </Caption>
                      <BodyText size="sm">{active ? "active" : "—"}</BodyText>
                    </div>
                  </GridItem>
                );
              })}
            </ResponsiveGrid>
          </Section>

          <Section title="BreakpointMatch" description="Conditional render via manager (no ad-hoc matchMedia).">
            <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight">
              <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                <BreakpointMatch above="md">
                  <div className="bp-demo-tile">above=md</div>
                </BreakpointMatch>
              </GridItem>
              <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                <BreakpointMatch only="lg" fallback={<div className="bp-demo-tile is-muted">only=lg (idle)</div>}>
                  <div className="bp-demo-tile">only=lg</div>
                </BreakpointMatch>
              </GridItem>
              <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                <BreakpointMatch below="sm">
                  <div className="bp-demo-tile">below=sm</div>
                </BreakpointMatch>
              </GridItem>
            </ResponsiveGrid>
            <Caption className="bp-demo-mq">mq.up(&quot;lg&quot;) → {mq.up("lg")}</Caption>
          </Section>

          <Section title="Container query" description="Resize the panel — independent of viewport breakpoint.">
            <div ref={cqRef} className="dk-cq bp-demo-cq">
              <BodyText size="sm">
                Panel width ≥ md (768)? <strong>{String(cqMd)}</strong>
              </BodyText>
              <div className="dk-cq-from-md bp-demo-tile">.dk-cq-from-md (CSS)</div>
            </div>
          </Section>
        </VStack>
      </Container>
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
  const [view, setView] = useState<View>("breakpoints");
  const [sectionOpen, setSectionOpen] = useState(true);
  const [sectionVisibleLog, setSectionVisibleLog] = useState("—");
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [density, setDensity] = useState<DensityMode>("comfortable");
  const [accent, setAccent] = useState("#0071e3");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [motionPref, setMotionPref] = useState<MotionPreference>("system");
  const [showModalDemo, setShowModalDemo] = useState(true);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [dragDemo, setDragDemo] = useState(false);
  const [iconQuery, setIconQuery] = useState("");
  const [iconCategory, setIconCategory] = useState<string>("all");
  const [iconVariant, setIconVariant] = useState<IconVariant>("outlined");
  const reducedMotion = useReducedMotion();
  useMotionPreference(motionPref);
  const safeInsets = useSafeArea();

  const iconResults = useMemo(() => {
    const list = searchIcons(iconQuery);
    return iconCategory === "all" ? list : list.filter((i) => i.category === iconCategory);
  }, [iconQuery, iconCategory]);

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
            Foundation labs — aspect, safe area, surface, section, spacer, flex, stack, container,
            icons, motion, elevation, shape, theme, spacing, grid, typography, and color. Edit
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
          {(["system", "full", "reduce"] as const).map((m) => (
            <button
              key={m}
              type="button"
              className="theme-btn"
              aria-pressed={motionPref === m}
              onClick={() => setMotionPref(m)}
            >
              motion:{m}
            </button>
          ))}
        </div>
      </header>

      <div className="tabs" role="tablist" aria-label="Playground views">
        {(
          [
            ["breakpoints", "Breakpoint Lab"],
            ["visibility", "Visibility Lab"],
            ["aspect", "Aspect Lab"],
            ["safe-area", "Safe Area Lab"],
            ["surface", "Surface Lab"],
            ["section", "Section Lab"],
            ["spacer", "Spacer Lab"],
            ["flex", "Flex Lab"],
            ["stack", "Stack Lab"],
            ["container", "Container Lab"],
            ["icons", "Icon Lab"],
            ["motion", "Motion Lab"],
            ["elevation", "Elevation Lab"],
            ["shape", "Shape Lab"],
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

      {view === "breakpoints" ? <BreakpointLabPanel /> : null}

      {view === "visibility" ? (
        <div className="visibility-lab">
          <VisibilityProvider roles={["admin", "editor"]} flags={{ beta: true, legacy: false }}>
            <Container variant="dashboard" paddingY="section" as="main" aria-label="Visibility lab">
              <VStack gap="spacious">
                <VStack gap="sm">
                  <Title variant="section">Responsive Visibility</Title>
                  <BodyText size="sm">
                    CSS presets for viewport / orientation / print / a11y, plus JS gates for roles,
                    flags, lazy mount, and intersection.
                  </BodyText>
                </VStack>

                <Section title="Viewport presets" description="Resize the window — only matching tiles stay visible.">
                  <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
                    {(
                      [
                        ["Mobile", MobileOnly],
                        ["Tablet", TabletOnly],
                        ["Desktop", DesktopOnly],
                        ["Large", LargeScreens],
                        ["Landscape", LandscapeOnly],
                        ["Portrait", PortraitOnly],
                        ["Foldables", Foldables],
                        ["A11y mode", AccessibilityMode],
                      ] as const
                    ).map(([label, Comp]) => (
                      <GridItem key={label} span={{ sm: 4, md: 4, lg: 3 }}>
                        <Comp block className="vis-demo-tile">
                          <Caption>{label}</Caption>
                          <BodyText size="sm">Visible now</BodyText>
                        </Comp>
                      </GridItem>
                    ))}
                  </ResponsiveGrid>
                  <PrintMode block className="vis-demo-tile vis-demo-print">
                    <Caption>Print Mode</Caption>
                    <BodyText size="sm">Only in print preview</BodyText>
                  </PrintMode>
                </Section>

                <Section title="Modes" description="hide · preserve · collapse · fade">
                  <VisibilityModesDemo />
                </Section>

                <Section title="Roles · flags · media">
                  <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight">
                    <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                      <Visibility role="admin" block className="vis-demo-tile">
                        <Caption>role=admin</Caption>
                        <BodyText size="sm">Shown via VisibilityProvider</BodyText>
                      </Visibility>
                    </GridItem>
                    <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                      <Visibility flag="beta" block className="vis-demo-tile">
                        <Caption>flag=beta</Caption>
                        <BodyText size="sm">Feature flag on</BodyText>
                      </Visibility>
                    </GridItem>
                    <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                      <Visibility flag="legacy" block className="vis-demo-tile">
                        <Caption>flag=legacy</Caption>
                        <BodyText size="sm">Should stay hidden</BodyText>
                      </Visibility>
                    </GridItem>
                    <GridItem span={{ sm: 4, md: 8, lg: 6 }}>
                      <Visibility above="md" block className="vis-demo-tile">
                        <Caption>above=md (JS media)</Caption>
                        <BodyText size="sm">matchMedia ≥ 768px</BodyText>
                      </Visibility>
                    </GridItem>
                    <GridItem span={{ sm: 4, md: 8, lg: 6 }}>
                      <VisibilityMatchDemo />
                    </GridItem>
                  </ResponsiveGrid>
                </Section>

                <Section
                  title="Lazy · intersection"
                  description="Scroll — heavy block mounts when near the viewport."
                >
                  <div className="vis-demo-scroll">
                    <BodyText size="sm">Scroll down…</BodyText>
                    <div className="vis-demo-spacer" />
                    <Visibility
                      lazy
                      intersection={{ rootMargin: "40px", threshold: 0.15 }}
                      motion
                      mode="fade"
                      block
                      className="vis-demo-tile vis-demo-heavy"
                    >
                      <Caption>lazy + intersection</Caption>
                      <BodyText size="sm">Mounted when intersecting</BodyText>
                    </Visibility>
                  </div>
                </Section>
              </VStack>
            </Container>
          </VisibilityProvider>
        </div>
      ) : null}

      {view === "aspect" ? (
        <div className="aspect-lab">
          <Container variant="dashboard" paddingY="section" as="main" aria-label="Aspect lab">
            <VStack gap="spacious">
              <VStack gap="sm">
                <Title variant="section">Aspect Ratio</Title>
                <BodyText size="sm">
                  Consistent proportions for media, charts, previews, and embeds — presets, fit, crop,
                  skeleton, lazy.
                </BodyText>
              </VStack>

              <Section title="Presets">
                <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
                  {(
                    [
                      ["1:1", AspectSquare],
                      ["16:9", AspectVideo],
                      ["4:3 / card", AspectCard],
                      ["9:16", AspectStory],
                      ["21:9", AspectUltrawide],
                      ["A4", AspectA4],
                      ["Mobile", AspectMobile],
                      ["Widget", AspectWidget],
                    ] as const
                  ).map(([label, Comp]) => (
                    <GridItem key={label} span={{ sm: 4, md: 4, lg: 3 }}>
                      <VStack gap="sm">
                        <Caption>{label}</Caption>
                        <Comp radius="md">
                          <div className="aspect-demo-fill">
                            <Caption>{label}</Caption>
                          </div>
                        </Comp>
                      </VStack>
                    </GridItem>
                  ))}
                </ResponsiveGrid>
              </Section>

              <Section title="Custom · fit · crop">
                <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
                  <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                    <Caption>ratio=1.618 (golden)</Caption>
                    <AspectRatio ratio={1.618} radius="lg">
                      <div className="aspect-demo-fill">φ</div>
                    </AspectRatio>
                  </GridItem>
                  <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                    <Caption>fit=contain</Caption>
                    <AspectRatio preset="16:9" fit="contain" radius="lg">
                      <div className="aspect-demo-letterbox">Contained</div>
                    </AspectRatio>
                  </GridItem>
                  <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                    <Caption>position=top</Caption>
                    <AspectRatio preset="card" position="top" radius="lg">
                      <div className="aspect-demo-crop">Top crop focus</div>
                    </AspectRatio>
                  </GridItem>
                </ResponsiveGrid>
              </Section>

              <Section title="Skeleton · responsive">
                <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
                  <GridItem span={{ sm: 4, md: 4, lg: 6 }}>
                    <Caption>loading skeleton</Caption>
                    <AspectRatio preset="16:9" loading="skeleton" radius="lg" />
                  </GridItem>
                  <GridItem span={{ sm: 4, md: 4, lg: 6 }}>
                    <Caption>preset base 9:16 → md 16:9</Caption>
                    <AspectRatio
                      preset={{ base: "9:16", md: "16:9" }}
                      motion
                      radius="lg"
                    >
                      <div className="aspect-demo-fill">Resize viewport</div>
                    </AspectRatio>
                  </GridItem>
                </ResponsiveGrid>
              </Section>
            </VStack>
          </Container>
        </div>
      ) : null}

      {view === "safe-area" ? (
        <div className="safe-area-lab" data-safe-debug>
          <Container variant="dashboard" paddingY="section" as="main" aria-label="Safe area lab">
            <VStack gap="spacious">
              <VStack gap="sm">
                <Title variant="section">Safe Area</Title>
                <BodyText size="sm">
                  Device insets for notches, Dynamic Island, keyboards, and browser chrome. Debug
                  outline is on for this lab.
                </BodyText>
              </VStack>

              <Section title="Live insets" description="From useSafeArea() — updates on resize / orientation / visualViewport.">
                <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight">
                  {(
                    [
                      ["top", safeInsets.top],
                      ["right", safeInsets.right],
                      ["bottom", safeInsets.bottom],
                      ["left", safeInsets.left],
                      ["keyboard", safeInsets.keyboard],
                    ] as const
                  ).map(([label, value]) => (
                    <GridItem key={label} span={{ sm: 2, md: 4, lg: 2 }}>
                      <Surface stack padding="sm" elevation={1}>
                        <Caption>{label}</Caption>
                        <BodyText size="sm">{value}px</BodyText>
                      </Surface>
                    </GridItem>
                  ))}
                  <GridItem span={{ sm: 4, md: 4, lg: 2 }}>
                    <Surface stack padding="sm" elevation={1}>
                      <Caption>orientation</Caption>
                      <BodyText size="sm">{safeInsets.orientation}</BodyText>
                    </Surface>
                  </GridItem>
                </ResponsiveGrid>
                <button type="button" className="demo-btn" onClick={() => safeInsets.refresh()}>
                  Refresh
                </button>
              </Section>

              <Section title="Edges">
                <VStack gap="md">
                  <SafeArea edges="all" className="safe-demo-box">
                    <Caption>edges=all</Caption>
                  </SafeArea>
                  <SafeArea edges="x" className="safe-demo-box">
                    <Caption>edges=x</Caption>
                  </SafeArea>
                  <SafeArea edges="y" className="safe-demo-box">
                    <Caption>edges=y</Caption>
                  </SafeArea>
                  <SafeArea top bottom left={false} right={false} className="safe-demo-box">
                    <Caption>top + bottom only</Caption>
                  </SafeArea>
                </VStack>
              </Section>

              <Section title="Modes" description="Nav, FAB, panel, and keyboard clearance.">
                <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
                  {(
                    [
                      ["nav", "Bottom nav clearance"],
                      ["fab", "FAB clearance"],
                      ["panel", "Floating panel gutters"],
                      ["keyboard", "Keyboard inset"],
                      ["fullscreen", "Fullscreen + titlebar"],
                      ["immersive", "Insets only"],
                    ] as const
                  ).map(([mode, label]) => (
                    <GridItem key={mode} span={{ sm: 4, md: 4, lg: 4 }}>
                      <SafeArea mode={mode} edges="all" className="safe-demo-box safe-demo-mode">
                        <Caption>{mode}</Caption>
                        <BodyText size="sm">{label}</BodyText>
                      </SafeArea>
                    </GridItem>
                  ))}
                </ResponsiveGrid>
              </Section>

              <Section title="Fixed chrome helpers">
                <div className="safe-demo-stage">
                  <BodyText size="sm">
                    SafeAreaBottomBar and SafeAreaFab pin to the safe viewport. On desktop insets are
                    often 0 — use a notched device or DevTools device mode to see padding.
                  </BodyText>
                  <div className="safe-demo-fake-chrome">
                    <SafeArea mode="nav" edges="bottom" className="safe-demo-box">
                      <Caption>Content above nav</Caption>
                    </SafeArea>
                    <div className="safe-demo-nav-preview">
                      <Caption>simulated tab bar · mode=nav adds clearance</Caption>
                    </div>
                  </div>
                </div>
              </Section>
            </VStack>
          </Container>
        </div>
      ) : null}

      {view === "section" ? (
        <div className="section-lab">
          <Container variant="dashboard" paddingY="section" as="main" aria-label="Section lab">
            <VStack gap="spacious">
              <VStack gap="sm">
                <Title variant="section">Section</Title>
                <BodyText size="sm">
                  Logical content groups — header, body, footer, collapse, sticky, empty/loading,
                  anchors, visibility hooks.
                </BodyText>
                <Caption>Visibility log: {sectionVisibleLog}</Caption>
              </VStack>

              <Section
                id="overview"
                title="Overview"
                description="Dashboard-width section with actions and footer."
                actions={<span className="section-chip">Export</span>}
                footer={<Caption>Updated just now</Caption>}
                width="dashboard"
                background="surface"
                elevated
                animate
                onVisible={({ visible, ratio }) =>
                  setSectionVisibleLog(visible ? `visible · ${(ratio * 100).toFixed(0)}%` : "hidden")
                }
              >
                <BodyText size="sm">
                  Body content sits in a semantic region. Heading level starts at h2 and nests
                  automatically.
                </BodyText>
              </Section>

              <Section
                title="Collapsible"
                description="Controlled open state with motion-aware expand/collapse."
                collapsible
                open={sectionOpen}
                onToggle={setSectionOpen}
                background="subtle"
                padded
              >
                <BodyText size="sm">
                  Collapse uses a grid 0fr→1fr transition and marks the panel inert while closed.
                </BodyText>
              </Section>

              <Section title="Loading" loading background="surface" width="reading" />

              <Section
                title="Empty inbox"
                empty
                emptyState={{
                  title: "No messages",
                  description: "When new activity arrives, it will show up in this section.",
                  action: <span className="section-chip">Refresh</span>,
                }}
                background="surface"
                width="reading"
              />

              <Section
                title="Sticky header"
                description="Scroll within the page to see the header pin."
                stickyHeader
                stickyOffset={0}
                background="canvas"
                width="wide"
              >
                <VStack gap="md">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="section-demo-block">
                      Sticky content block {i + 1}
                    </div>
                  ))}
                </VStack>
              </Section>

              <Section title="Parent" background="muted" width="default">
                <BodyText size="sm">Nested sections tighten padding and bump heading level.</BodyText>
                <Section nested title="Nested child" description="Automatic h3 under parent h2." elevated>
                  <BodyText size="sm">Nested body</BodyText>
                </Section>
              </Section>

              <Section flush width="reading" elevated background="surface">
                <Section.Header title="Compound API" actions={<span className="section-chip">Edit</span>} />
                <Section.Body>
                  <BodyText size="sm">Use Section.Header / Body / Footer for full control.</BodyText>
                </Section.Body>
                <Section.Footer>
                  <Caption>Compound footer</Caption>
                </Section.Footer>
              </Section>
            </VStack>
          </Container>
        </div>
      ) : null}

      {view === "spacer" ? (
        <div className="spacer-lab" data-spacer-debug>
          <Container variant="dashboard" paddingY="section" as="main" aria-label="Spacer lab">
            <VStack gap="spacious">
              <VStack gap="sm">
                <Title variant="section">Spacer</Title>
                <BodyText size="sm">
                  Tokenized whitespace — presets replace empty margins. Debug tint is on for this
                  lab.
                </BodyText>
              </VStack>

              <Title variant="section">Presets</Title>
              <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
                {(
                  [
                    ["tiny", SpacerTiny],
                    ["small", SpacerSmall],
                    ["medium", SpacerMedium],
                    ["large", SpacerLarge],
                    ["xl", SpacerXL],
                    ["section", SpacerSection],
                    ["card", SpacerCard],
                    ["form", SpacerForm],
                    ["modal", SpacerModal],
                    ["nav", SpacerNav],
                    ["hero", SpacerHero],
                  ] as const
                ).map(([name, Comp]) => (
                  <GridItem key={name} span={{ sm: 4, md: 4, lg: 3 }}>
                    <div className="spacer-demo-frame">
                      <Caption>{name}</Caption>
                      <div className="spacer-demo-panel">
                        <div className="spacer-demo-block">Above</div>
                        <Comp />
                        <div className="spacer-demo-block">Below</div>
                      </div>
                    </div>
                  </GridItem>
                ))}
              </ResponsiveGrid>

              <Title variant="section">Horizontal · grow · adaptive</Title>
              <Flex direction="row" align="center" className="spacer-demo-panel">
                <div className="spacer-demo-block">A</div>
                <Spacer axis="x" preset="card" />
                <div className="spacer-demo-block">B</div>
                <FlexGrowSpacer />
                <div className="spacer-demo-block">C</div>
              </Flex>

              <VStack gap="none" className="spacer-demo-panel">
                <Caption>adaptive in vertical stack</Caption>
                <div className="spacer-demo-block">Top</div>
                <Spacer axis="adaptive" preset="medium" />
                <div className="spacer-demo-block">Bottom</div>
              </VStack>

              <Flex direction="row" align="stretch" className="spacer-demo-panel">
                <div className="spacer-demo-block">Left</div>
                <Spacer axis="adaptive" preset="large" />
                <div className="spacer-demo-block">Right</div>
              </Flex>

              <Title variant="section">Responsive · separator · safe</Title>
              <div className="spacer-demo-panel">
                <div className="spacer-demo-block">Responsive preset</div>
                <Spacer preset={{ base: "small", md: "large", lg: "section" }} />
                <div className="spacer-demo-block">Grows with viewport</div>
              </div>

              <div className="spacer-demo-panel">
                <div className="spacer-demo-block">With separator</div>
                <Spacer preset="medium" separator />
                <div className="spacer-demo-block">Hairline through gap</div>
              </div>

              <div className="spacer-demo-panel">
                <Caption>safeArea=bottom + nav (includes home indicator when present)</Caption>
                <div className="spacer-demo-block">Content</div>
                <Spacer safeArea="bottom" preset="nav" />
              </div>
            </VStack>
          </Container>
        </div>
      ) : null}

      {view === "flex" ? (
        <div className="flex-lab">
          <Container variant="dashboard" paddingY="section" as="main" aria-label="Flex lab">
            <VStack gap="spacious">
              <VStack gap="sm">
                <Title variant="section">Flex Layout</Title>
                <BodyText size="sm">
                  Advanced flexbox without raw CSS — grow, shrink, basis, presets, responsive maps.
                </BodyText>
              </VStack>

              <Title variant="section">Core</Title>
              <Flex direction="row" align="center" justify="between" gap="comfortable" className="flex-demo-panel">
                <FlexItem>
                  <div className="flex-demo-block">Start</div>
                </FlexItem>
                <FlexSpacer />
                <FlexItem shrink={false}>
                  <div className="flex-demo-block">Pinned</div>
                </FlexItem>
                <FlexItem grow>
                  <div className="flex-demo-block">Grow</div>
                </FlexItem>
              </Flex>

              <Flex
                direction={{ base: "column", md: "row" }}
                gap={{ base: "compact", md: "comfortable" }}
                align={{ base: "stretch", md: "center" }}
                className="flex-demo-panel"
              >
                <FlexItem flex>
                  <div className="flex-demo-block">Responsive · column → row</div>
                </FlexItem>
                <FlexItem>
                  <div className="flex-demo-block">Item</div>
                </FlexItem>
                <FlexItem maxWidth="8rem">
                  <div className="flex-demo-block">max 8rem</div>
                </FlexItem>
              </Flex>

              <Flex equal gap="sm" className="flex-demo-panel">
                <div className="flex-demo-block">Equal</div>
                <div className="flex-demo-block">Equal</div>
                <div className="flex-demo-block">Equal</div>
              </Flex>

              <Title variant="section">Presets</Title>
              <FlexNavbar className="flex-demo-panel">
                <FlexItem>
                  <strong className="flex-demo-brand">Brand</strong>
                </FlexItem>
                <FlexItem>
                  <FlexActionGroup>
                    <span className="flex-chip">Search</span>
                    <span className="flex-chip">Account</span>
                  </FlexActionGroup>
                </FlexItem>
              </FlexNavbar>

              <FlexToolbar className="flex-demo-panel">
                <span className="flex-chip">Bold</span>
                <span className="flex-chip">Italic</span>
                <span className="flex-chip">Link</span>
                <FlexSpacer />
                <span className="flex-chip">More</span>
              </FlexToolbar>

              <FlexFormRow className="flex-demo-panel">
                <FlexItem flexRole="label">
                  <Label>Email</Label>
                </FlexItem>
                <FlexItem flexRole="control">
                  <div className="flex-demo-field">control grows</div>
                </FlexItem>
              </FlexFormRow>

              <FlexDashboardSummary className="flex-demo-panel">
                {["Revenue", "Users", "Latency", "Uptime"].map((t) => (
                  <FlexItem key={t}>
                    <div className="flex-demo-stat">
                      <Caption>{t}</Caption>
                      <BodyText size="sm">—</BodyText>
                    </div>
                  </FlexItem>
                ))}
              </FlexDashboardSummary>

              <FlexProfileHeader className="flex-demo-panel">
                <FlexItem flexRole="avatar">
                  <div className="flex-demo-avatar" aria-hidden />
                </FlexItem>
                <FlexItem flexRole="identity">
                  <BodyText size="sm">Alex Rivera</BodyText>
                  <Caption>Product design</Caption>
                </FlexItem>
                <FlexItem flexRole="actions">
                  <FlexActionGroup>
                    <span className="flex-chip">Message</span>
                    <span className="flex-chip">Follow</span>
                  </FlexActionGroup>
                </FlexItem>
              </FlexProfileHeader>

              <FlexCardFooter className="flex-demo-panel">
                <Caption>Updated 2h ago</Caption>
                <FlexActionGroup>
                  <span className="flex-chip">Share</span>
                  <span className="flex-chip">Edit</span>
                </FlexActionGroup>
              </FlexCardFooter>

              <FlexFilterBar className="flex-demo-panel">
                <div data-flex-role="filters">
                  <span className="flex-chip">Status</span>
                  <span className="flex-chip">Owner</span>
                  <span className="flex-chip">Date</span>
                </div>
                <div data-flex-role="actions">
                  <span className="flex-chip">Clear</span>
                </div>
              </FlexFilterBar>

              <FlexStatsRow className="flex-demo-panel">
                {["12k", "98%", "4.2", "31"].map((n, i) => (
                  <FlexItem key={n}>
                    <div className="flex-demo-stat">
                      <BodyText size="sm">{n}</BodyText>
                      <Caption>{["Views", "Health", "Score", "Open"][i]}</Caption>
                    </div>
                  </FlexItem>
                ))}
              </FlexStatsRow>

              <FlexButtonGroup className="flex-demo-panel" data-equal="true">
                <span className="flex-chip flex-chip-fill">Cancel</span>
                <span className="flex-chip flex-chip-fill">Save draft</span>
                <span className="flex-chip flex-chip-fill">Publish</span>
              </FlexButtonGroup>
            </VStack>
          </Container>
        </div>
      ) : null}

      {view === "stack" ? (
        <div className="stack-lab">
          <Container variant="dashboard" paddingY="section" as="main" aria-label="Stack lab">
            <VStack gap="spacious" as="div">
              <VStack gap="sm">
                <Title variant="section">Stack Layout</Title>
                <BodyText size="sm">
                  Preferred spacing layout — vertical, horizontal, inline. Token gaps replace manual
                  margins. Resize for responsive direction.
                </BodyText>
              </VStack>

              <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
                {(
                  [
                    ["compact", "Compact"],
                    ["comfortable", "Comfortable"],
                    ["spacious", "Spacious"],
                    ["responsive", "Responsive"],
                  ] as const
                ).map(([g, label]) => (
                  <GridItem key={g} span={{ sm: 4, md: 4, lg: 3 }}>
                    <div className="stack-demo-frame">
                      <Caption>{label}</Caption>
                      <VStack gap={g} className="stack-demo-panel">
                        <div className="stack-demo-block">A</div>
                        <div className="stack-demo-block">B</div>
                        <div className="stack-demo-block">C</div>
                      </VStack>
                    </div>
                  </GridItem>
                ))}
              </ResponsiveGrid>

              <Title variant="section">Horizontal · inline · distribute</Title>
              <VStack gap="md">
                <Caption>HStack · justify=between</Caption>
                <HStack gap="compact" justify="between" className="stack-demo-panel">
                  <div className="stack-demo-block">Start</div>
                  <div className="stack-demo-block">End</div>
                </HStack>
                <Caption>InlineStack · wrap</Caption>
                <InlineStack gap="sm" className="stack-demo-panel">
                  {["Design", "Tokens", "Layout", "Motion", "A11y", "Density"].map((t) => (
                    <span key={t} className="stack-chip">
                      {t}
                    </span>
                  ))}
                </InlineStack>
              </VStack>

              <Title variant="section">Responsive direction</Title>
              <Stack
                direction={{ base: "vertical", md: "horizontal" }}
                gap={{ base: "compact", md: "comfortable" }}
                align={{ base: "stretch", md: "center" }}
                className="stack-demo-panel stack-responsive-demo"
              >
                <div className="stack-demo-block stack-demo-grow">Column → Row at md</div>
                <div className="stack-demo-block">Item</div>
                <div className="stack-demo-block">Item</div>
              </Stack>

              <Title variant="section">Nested · separators · collapse</Title>
              <VStack gap="comfortable" separator className="stack-demo-panel">
                <BodyText size="sm">Outer with separators</BodyText>
                <VStack gap="compact" nested>
                  <Caption>Nested compact</Caption>
                  <BodyText size="sm">Empty siblings collapse automatically.</BodyText>
                  {null}
                  <div hidden>Hidden</div>
                  <BodyText size="sm">Still spaced evenly.</BodyText>
                </VStack>
                <HStack gap="sm" separator="strong" align="center">
                  <span className="stack-chip">One</span>
                  <span className="stack-chip">Two</span>
                  <span className="stack-chip">Three</span>
                </HStack>
              </VStack>

              <Title variant="section">Animate · virtual</Title>
              <HStack gap="md" align="start" wrap className="stack-animate-row">
                <VStack gap="sm" animate stagger className="stack-demo-panel stack-demo-grow">
                  <Caption>animate + stagger</Caption>
                  <div className="stack-demo-block">Enter 1</div>
                  <div className="stack-demo-block">Enter 2</div>
                  <div className="stack-demo-block">Enter 3</div>
                </VStack>
                <VStack
                  gap="none"
                  virtual={{ itemSize: 40, height: 160, overscan: 2 }}
                  className="stack-demo-panel stack-demo-grow"
                  aria-label="Virtualized stack"
                >
                  {Array.from({ length: 40 }, (_, i) => (
                    <div key={i} className="stack-demo-virtual-row">
                      Row {i + 1}
                    </div>
                  ))}
                </VStack>
              </HStack>
            </VStack>
          </Container>
        </div>
      ) : null}

      {view === "container" ? (
        <div className="container-lab">
          <Container variant="dashboard" paddingY="section" stack as="main" aria-label="Container lab">
            <Title variant="section">Responsive Container</Title>
            <BodyText size="sm">
              Mobile-first · safe-area · token padding · nested rhythm. Resize the viewport to see
              max-width and padding adapt.
            </BodyText>

            <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
              {(
                [
                  ["fluid", "Fluid"],
                  ["full", "Full"],
                  ["centered", "Centered"],
                  ["narrow", "Narrow"],
                  ["reading", "Reading"],
                  ["form", "Form"],
                  ["modal", "Modal"],
                  ["wide", "Wide"],
                  ["hero", "Hero"],
                  ["dashboard", "Dashboard"],
                ] as const
              ).map(([v, label]) => (
                <GridItem key={v} span={{ sm: 4, md: 4, lg: 3 }}>
                  <div className="container-variant-frame">
                    <Caption>{label}</Caption>
                    <Container variant={v} nested elevated paddingY="sm" className="container-variant-inner">
                      <BodyText size="sm">variant=&quot;{v}&quot;</BodyText>
                    </Container>
                  </div>
                </GridItem>
              ))}
            </ResponsiveGrid>

            <Title variant="section">Nested</Title>
            <Container variant="wide" elevated paddingY="md" stack className="container-nest-demo">
              <Caption>Outer · wide</Caption>
              <Container variant="reading" nested elevated paddingY="sm" stack>
                <Caption>Inner · reading (nested)</Caption>
                <BodyText size="sm">
                  Nested containers tighten padding and skip double safe-area insets so rhythm stays
                  consistent.
                </BodyText>
                <Container variant="form" nested surface paddingY="sm">
                  <Caption>Form nest</Caption>
                </Container>
              </Container>
            </Container>

            <Title variant="section">Custom · sticky · overflow</Title>
            <Container
              variant="custom"
              maxWidth="36rem"
              elevated
              paddingY="md"
              stack
              className="container-custom-demo"
            >
              <Caption>custom maxWidth=36rem</Caption>
              <BodyText size="sm">Use maxWidth for one-off measure without forking variants.</BodyText>
            </Container>
            <Container variant="reading" overflow="auto" elevated className="container-scroll-demo" paddingY="sm">
              <Caption>overflow=auto</Caption>
              <BodyText size="sm">
                Long content scrolls inside the container without shifting the page chrome. Safe for
                panels and modal bodies.
              </BodyText>
              <BodyText size="sm">
                Additional lines keep the scroll region intentional and contained for nested
                dashboards.
              </BodyText>
            </Container>
          </Container>
        </div>
      ) : null}

      {view === "icons" ? (
        <Container>
          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Icon System</Title>
              <BodyText size="sm">
                {iconResults.length} icons · stroke 1.5 · 24×24 · text-aligned · themed via
                currentColor
              </BodyText>
              <div className="icon-toolbar">
                <label className="icon-search">
                  <Icon name="search" label="Search icons" size="sm" />
                  <input
                    type="search"
                    value={iconQuery}
                    onChange={(e) => setIconQuery(e.target.value)}
                    placeholder="Search name, alias, category…"
                    aria-label="Search icons"
                  />
                </label>
                <select
                  value={iconCategory}
                  onChange={(e) => setIconCategory(e.target.value)}
                  aria-label="Category"
                >
                  <option value="all">All categories</option>
                  {ICON_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  value={iconVariant}
                  onChange={(e) => setIconVariant(e.target.value as IconVariant)}
                  aria-label="Variant"
                >
                  <option value="outlined">Outlined</option>
                  <option value="filled">Filled</option>
                  <option value="duotone">Duotone</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </StackLayout>
          </Section>

          <Section>
            <div className="icon-grid">
              {iconResults.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className="icon-tile dk-theme-transition"
                  title={`${item.name} · ${item.aliases.join(", ")}`}
                >
                  <Icon
                    name={item.name}
                    variant={iconVariant}
                    size="lg"
                    status={iconVariant === "status" ? "info" : undefined}
                  />
                  <Caption className="icon-tile-name">{item.name}</Caption>
                </button>
              ))}
            </div>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">With text · buttons · status · badge</Title>
              <div className="icon-demo-row">
                <IconLabel icon="settings" iconProps={{ size: "sm" }}>
                  <BodyText size="sm" as="span">
                    Settings
                  </BodyText>
                </IconLabel>
                <IconLabel icon="mail" iconProps={{ size: "sm" }}>
                  <BodyText size="sm" as="span">
                    Inbox
                  </BodyText>
                </IconLabel>
                <IconButton name="plus" label="Create" tone="primary" />
                <IconButton name="trash" label="Delete" tone="danger" />
                <IconButton name="share" label="Share" iconOnly={false} tone="filled" />
                <StatusIcon status="success" size="lg" label="Success" />
                <StatusIcon status="warning" size="lg" label="Warning" />
                <StatusIcon status="danger" size="lg" label="Error" />
                <AiIcon size="lg" label="AI assist" />
                <IconBadge name="bell" label="Notifications" count={3} size="lg" />
                <AnimatedIcon name="sparkles" animation="pulse" size="lg" label="Animating" status="ai" />
              </div>
            </StackLayout>
          </Section>
        </Container>
      ) : null}

      {view === "motion" ? (
        <Container>
          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Motion System</Title>
              <BodyText size="sm">
                Reduced motion active: <strong>{reducedMotion ? "yes" : "no"}</strong> · preference{" "}
                <strong>{motionPref}</strong>. Replay presets with the controls below.
              </BodyText>
              <div className="motion-controls">
                <button
                  type="button"
                  className="demo-btn demo-btn-secondary"
                  onClick={() => {
                    setShowModalDemo(false);
                    requestAnimationFrame(() => setShowModalDemo(true));
                  }}
                >
                  Replay enters
                </button>
                <button
                  type="button"
                  className="demo-btn demo-btn-secondary"
                  onClick={() => {
                    setLoadingDemo(true);
                    window.setTimeout(() => setLoadingDemo(false), 1200);
                  }}
                >
                  Loading
                </button>
              </div>
            </StackLayout>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Enter presets</Title>
              <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
                {(
                  [
                    ["fade", "Fade"],
                    ["scale", "Scale / modal"],
                    ["slide-up", "Slide up"],
                    ["page", "Page"],
                    ["notify", "Notify"],
                    ["success", "Success"],
                  ] as const
                ).map(([preset, label]) => (
                  <GridItem key={preset} span={{ sm: 4, md: 4, lg: 2 }}>
                    {showModalDemo ? (
                      <Motion
                        key={`${preset}-${showModalDemo}`}
                        preset={preset}
                        className="dk-surface dk-surface-card dk-surface-stack motion-tile"
                      >
                        <Caption>{label}</Caption>
                      </Motion>
                    ) : (
                      <div className="dk-surface dk-surface-card motion-tile" />
                    )}
                  </GridItem>
                ))}
              </ResponsiveGrid>
            </StackLayout>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Stagger · hover · press</Title>
              <MotionStagger className="motion-stagger-row" speed="fast">
                {["One", "Two", "Three", "Four"].map((label) => (
                  <div key={label} className="dk-surface dk-surface-panel motion-stagger-item">
                    <Caption>{label}</Caption>
                  </div>
                ))}
              </MotionStagger>
              <div className="motion-controls">
                <HoverAnimation className="dk-surface dk-surface-card motion-tile">
                  <Caption>Hover lift</Caption>
                </HoverAnimation>
                <PressAnimation className="demo-btn demo-btn-primary" highlight type="button">
                  Press + highlight
                </PressAnimation>
                <DragAnimation
                  dragging={dragDemo}
                  className="dk-surface dk-surface-card motion-tile"
                  onPointerDown={() => setDragDemo(true)}
                  onPointerUp={() => setDragDemo(false)}
                  onPointerLeave={() => setDragDemo(false)}
                >
                  <Caption>{dragDemo ? "Dragging" : "Hold to drag"}</Caption>
                </DragAnimation>
              </div>
            </StackLayout>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Loading · skeleton</Title>
              <div className="motion-controls">
                <LoadingTransition loading={loadingDemo}>
                  <button type="button" className="demo-btn demo-btn-primary">
                    Ready
                  </button>
                </LoadingTransition>
                <div className="motion-skeleton-card dk-surface dk-surface-card">
                  <SkeletonAnimation variant="avatar" />
                  <div style={{ flex: 1 }}>
                    <SkeletonAnimation variant="title" />
                    <SkeletonAnimation variant="text" />
                    <SkeletonAnimation variant="text" style={{ width: "70%" }} />
                  </div>
                </div>
              </div>
            </StackLayout>
          </Section>
        </Container>
      ) : null}

      {view === "elevation" ? (
        <Container>
          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Elevation levels</Title>
              <BodyText size="sm">
                Subtle multi-layer shadows · adaptive in dark mode · off in high contrast. Hover /
                press interactive tiles.
              </BodyText>
              <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} equalHeight gap="tight">
                {([0, 1, 2, 3, 4, 5] as const).map((level) => (
                  <GridItem key={level} span={{ sm: 4, md: 4, lg: 2 }}>
                    <Elevation
                      level={level}
                      interactive={level > 0}
                      className="dk-surface dk-surface-card dk-surface-stack elev-demo-tile"
                    >
                      <Caption>Level {level}</Caption>
                      <BodyText size="sm">{level === 0 ? "Flat" : "Hover me"}</BodyText>
                    </Elevation>
                  </GridItem>
                ))}
              </ResponsiveGrid>
            </StackLayout>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Semantic roles</Title>
              <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} equalHeight gap="tight">
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <Elevation semantic="button" as="button" type="button" className="demo-btn demo-btn-primary elev-demo-full">
                    Button
                  </Elevation>
                </GridItem>
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <Elevation semantic="card" interactive className="dk-surface dk-surface-card dk-surface-stack">
                    <Caption>Card</Caption>
                    <BodyText size="sm">Hover raises</BodyText>
                  </Elevation>
                </GridItem>
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <Elevation semantic="fab" as="button" type="button" className="elev-fab dk-theme-transition" aria-label="FAB">
                    +
                  </Elevation>
                </GridItem>
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <Elevation semantic="dropdown" className="dk-surface dk-surface-popover dk-surface-stack">
                    <Caption>Dropdown</Caption>
                    <BodyText size="sm">Menu face</BodyText>
                  </Elevation>
                </GridItem>
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <Elevation semantic="popover" className="dk-surface dk-surface-popover dk-surface-stack">
                    <Caption>Popover</Caption>
                    <BodyText size="sm">Floating</BodyText>
                  </Elevation>
                </GridItem>
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <Elevation semantic="tooltip" className="elev-tooltip dk-theme-transition">
                    Tooltip
                  </Elevation>
                </GridItem>
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <Elevation semantic="modal" className="dk-surface dk-surface-modal dk-surface-stack elev-demo-modal">
                    <Caption>Modal</Caption>
                    <BodyText size="sm">Dialog depth</BodyText>
                  </Elevation>
                </GridItem>
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <ShadowLayer level={3} className="dk-surface dk-surface-panel dk-surface-stack">
                    <Caption>Shadow layer</Caption>
                    <BodyText size="sm">Level 3 band</BodyText>
                  </ShadowLayer>
                </GridItem>
              </ResponsiveGrid>
            </StackLayout>
          </Section>

          <Section>
            <StackLayout gap="var(--space-stack-gap)">
              <Title variant="section">Nav · panel</Title>
              <Elevation semantic="nav" className="elev-nav dk-theme-transition">
                <Caption>Navigation bar</Caption>
              </Elevation>
              <Elevation semantic="panel-float" className="dk-surface dk-surface-panel dk-surface-stack">
                <Caption>Floating panel</Caption>
                <BodyText size="sm">Side inspector / tray</BodyText>
              </Elevation>
            </StackLayout>
          </Section>
        </Container>
      ) : null}

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
          <Section
            title="Surface System"
            description="Enterprise layers — semantic elevation, materials, interactive press, paint containment."
          >
            <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} equalHeight gap="tight">
              <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                <CardSurface contain>
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
                <OverlaySurface>
                  <Caption>Overlay face</Caption>
                  <BodyText size="sm">Elev 5 band</BodyText>
                </OverlaySurface>
              </GridItem>
            </ResponsiveGrid>
          </Section>

          <Section title="Floating roles" description="Tooltip, dropdown, menu, side panel.">
            <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
              <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                <TooltipSurface>Save changes</TooltipSurface>
              </GridItem>
              <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                <DropdownSurface>
                  <Caption>Dropdown</Caption>
                  <BodyText size="sm">Filter · Sort · Export</BodyText>
                </DropdownSurface>
              </GridItem>
              <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                <MenuSurface>
                  <Caption>Menu</Caption>
                  <BodyText size="sm">New · Open · Share</BodyText>
                </MenuSurface>
              </GridItem>
              <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                <SidePanelSurface>
                  <Caption>Side panel</Caption>
                  <BodyText size="sm">Inspector chrome</BodyText>
                </SidePanelSurface>
              </GridItem>
            </ResponsiveGrid>
          </Section>

          <Section title="Materials">
            <div className="surface-material-stage dk-theme-transition">
              <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <GlassSurface stack>
                    <Caption>Glass</Caption>
                    <BodyText size="sm">Thin + blur</BodyText>
                  </GlassSurface>
                </GridItem>
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <FrostedSurface stack>
                    <Caption>Frosted</Caption>
                    <BodyText size="sm">Thick material</BodyText>
                  </FrostedSurface>
                </GridItem>
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <Surface variant="card" material="translucent" elevation={2} stack>
                    <Caption>Translucent</Caption>
                    <BodyText size="sm">Soft blur</BodyText>
                  </Surface>
                </GridItem>
                <GridItem span={{ sm: 4, md: 4, lg: 3 }}>
                  <Surface variant="card" elevation={2} veil stack>
                    <Caption>Veil</Caption>
                    <BodyText size="sm">Accent wash</BodyText>
                  </Surface>
                </GridItem>
              </ResponsiveGrid>
            </div>
          </Section>

          <Section title="Elevation · outline · press">
            <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} equalHeight gap="tight">
              {([0, 1, 2, 3, 4, 5] as const).map((level) => (
                <GridItem key={level} span={{ sm: 2, md: 4, lg: 2 }}>
                  <Surface elevation={level} stack motion>
                    <Caption>Elev {level}</Caption>
                  </Surface>
                </GridItem>
              ))}
            </ResponsiveGrid>
            <Spacer preset="section" />
            <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
              <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                <Surface outlined interactive stack>
                  <Caption>Outlined</Caption>
                  <BodyText size="sm">Hover me</BodyText>
                </Surface>
              </GridItem>
              <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                <Surface interactive stack elevation={2}>
                  <Caption>Interactive</Caption>
                  <BodyText size="sm">Press for depth</BodyText>
                </Surface>
              </GridItem>
              <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                <Surface sunken quiet stack>
                  <Caption>Sunken</Caption>
                  <BodyText size="sm">Recessed</BodyText>
                </Surface>
              </GridItem>
            </ResponsiveGrid>
          </Section>

          <Section title="Modal / overlay">
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
            <Spacer preset="medium" />
            <ModalSurface size="sm" className="surface-inline-modal">
              <Caption>Inline modal face</Caption>
              <BodyText size="sm">Same chrome without the overlay root.</BodyText>
            </ModalSurface>
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
