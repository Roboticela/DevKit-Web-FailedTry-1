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
  TouchOnly,
  HoverCapable,
  useMediaQuery,
  useVisibility,
  useViewportObservation,
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
  Margin,
  MarginPage,
  MarginSection,
  MarginCard,
  MarginForm,
  marginClassName,
} from "@devkit/Margin";
import {
  Padding,
  PaddingCompact,
  PaddingComfortable,
  PaddingSpacious,
  PaddingHero,
  PaddingModal,
  PaddingCard,
  PaddingDashboard,
  PaddingTableCell,
  PaddingFormField,
  PaddingNav,
  paddingClassName,
} from "@devkit/Padding";
import {
  Gap,
  GapStack,
  GapInline,
  GapToolbar,
  GapForm,
  GapList,
  GapCompact,
  GapComfortable,
  GapSpacious,
  gapClassName,
} from "@devkit/Gap";
import {
  Align,
  AlignCenter,
  AlignBetween,
  AlignBaseline,
  AlignSafe,
  AlignAdaptive,
  AlignStart,
  AlignEnd,
  alignClassName,
} from "@devkit/Align";
import {
  Position,
  PositionFab,
  PositionStickyHeader,
  PositionToast,
  PositionBadge,
  PositionAnchor,
  FloatingPosition,
  positionClassName,
} from "@devkit/Position";
import {
  Overflow,
  OverflowX,
  useOverflowDetection,
} from "@devkit/Overflow";
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
import {
  DensityProvider,
  DensityScope,
  DensityCard,
  DensityRow,
  DensityControl,
  useDensity,
  type DensityMode,
  type DensityCustomVars,
} from "@devkit/DensityProvider";
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
  | "density"
  | "overflow"
  | "position"
  | "align"
  | "gap"
  | "padding"
  | "margin"
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
        <GridItem span={{ sm: 4, md: 8, lg: 6 }}>
          <Caption>accessible (sr-only when off)</Caption>
          <Visibility visible={open} mode="accessible" block className="vis-demo-tile">
            <BodyText size="sm">Hidden visually, still in a11y tree</BodyText>
          </Visibility>
        </GridItem>
      </ResponsiveGrid>
    </VStack>
  );
}

function VisibilityMatchDemo() {
  const wide = useMediaQuery("(min-width: 1024px)");
  const showAdmin = useVisibility({ role: "admin", flag: "beta" });
  const viewport = useViewportObservation();
  return (
    <Surface stack padding="sm" elevation={1} className="vis-demo-tile">
      <Caption>hooks</Caption>
      <BodyText size="sm">useMediaQuery ≥1024 → {String(wide)}</BodyText>
      <BodyText size="sm">useVisibility admin+beta → {String(showAdmin)}</BodyText>
      <BodyText size="sm">
        viewport {viewport ? `${viewport.width}×${viewport.height}` : "…"} · scale=
        {viewport?.scale.toFixed(2) ?? "—"}
      </BodyText>
    </Surface>
  );
}

function DensityLabPanel() {
  const { density, setDensity, custom, setCustom, scale } = useDensity();

  return (
    <div className="density-lab">
      <Container variant="dashboard" paddingY="section" as="main" aria-label="Density lab">
        <VStack gap="spacious">
          <VStack gap="sm">
            <Title variant="section">Density System</Title>
            <BodyText size="sm">
              App-wide Compact / Comfortable / Spacious / Custom — spacing, type, icons, touch
              targets, rows, cards, tables, nav, and forms adapt from one preference.
            </BodyText>
            <Caption>
              mode={density} · scale={scale.toFixed(2)} · html data-density
            </Caption>
          </VStack>

          <Section title="Modes" description="Same controls as the header — preference is document-wide.">
            <div className="density-mode-row" role="group" aria-label="Density mode">
              {(["compact", "comfortable", "spacious", "custom"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  className="theme-btn"
                  aria-pressed={density === d}
                  onClick={() => {
                    if (d === "custom") {
                      setCustom({
                        scale: custom.scale ?? 1.08,
                        typeScale: custom.typeScale ?? 1.02,
                        scaleSpace: true,
                      });
                    } else {
                      setDensity(d);
                    }
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </Section>

          {density === "custom" ? (
            <Section title="Custom scale" description="Administrators tune --density-custom-* vars.">
              <label className="density-slider">
                <span>Scale {((custom.scale ?? 1) * 100).toFixed(0)}%</span>
                <input
                  type="range"
                  min={70}
                  max={140}
                  value={Math.round((custom.scale ?? 1) * 100)}
                  onChange={(e) =>
                    setCustom({
                      ...custom,
                      scale: Number(e.target.value) / 100,
                      scaleSpace: true,
                    })
                  }
                />
              </label>
              <label className="density-slider">
                <span>Type {(custom.typeScale ?? 1).toFixed(2)}</span>
                <input
                  type="range"
                  min={85}
                  max={120}
                  value={Math.round((custom.typeScale ?? 1) * 100)}
                  onChange={(e) =>
                    setCustom({
                      ...custom,
                      typeScale: Number(e.target.value) / 100,
                      scaleSpace: true,
                    })
                  }
                />
              </label>
            </Section>
          ) : null}

          <Section title="Cards · controls · type">
            <div className="density-demo-grid">
              <DensityCard className="density-demo-card">
                <p className="dk-density-type-label">Card</p>
                <p className="dk-density-type-body">
                  Padding and gap follow density tokens — no per-card props.
                </p>
                <DensityControl>Primary action</DensityControl>
              </DensityCard>
              <DensityCard className="density-demo-card">
                <p className="dk-density-type-caption">Caption scales with density</p>
                <div className="density-icon-row">
                  <Icon name="settings" size="sm" />
                  <Icon name="settings" size="md" />
                  <Icon name="settings" size="lg" />
                </div>
              </DensityCard>
            </div>
          </Section>

          <Section title="Table · list · nav">
            <div className="density-demo-table" role="table" aria-label="Density table demo">
              {["Name", "Role", "Status"].map((h) => (
                <div key={h} className="dk-density-table-row density-demo-th" role="columnheader">
                  {h}
                </div>
              ))}
              {["Ada Lovelace", "Engineer", "Active"].map((cell, i) => (
                <div key={i} className="dk-density-table-row" role="cell">
                  {cell}
                </div>
              ))}
              {["Grace Hopper", "Admiral", "Active"].map((cell, i) => (
                <div key={`b${i}`} className="dk-density-table-row" role="cell">
                  {cell}
                </div>
              ))}
            </div>
            <nav className="density-demo-nav" aria-label="Density nav demo">
              {["Overview", "Projects", "Settings"].map((item) => (
                <a key={item} href="#density" className="dk-density-nav-item density-demo-nav-item">
                  {item}
                </a>
              ))}
            </nav>
            <VStack gap="none">
              {["Inbox", "Archive", "Trash"].map((item) => (
                <DensityRow key={item} className="density-demo-list-row">
                  <Icon name="chevron-right" size="sm" />
                  <span className="dk-density-type-body">{item}</span>
                </DensityRow>
              ))}
            </VStack>
          </Section>

          <Section title="Form rhythm">
            <form className="dk-density-form density-demo-form" onSubmit={(e) => e.preventDefault()}>
              <div className="dk-density-form-field">
                <label className="dk-density-type-label" htmlFor="dk-density-name">
                  Name
                </label>
                <input id="dk-density-name" className="dk-density-control density-demo-input" />
              </div>
              <div className="dk-density-form-field">
                <label className="dk-density-type-label" htmlFor="dk-density-email">
                  Email
                </label>
                <input
                  id="dk-density-email"
                  type="email"
                  className="dk-density-control density-demo-input"
                />
              </div>
              <DensityControl type="submit">Save</DensityControl>
            </form>
          </Section>

          <Section title="Scoped override" description="Compact table inside the current page density.">
            <DensityScope density="compact" className="density-scope-demo">
              <Caption>data-density=&quot;compact&quot; on this scope only</Caption>
              <DensityRow className="density-demo-list-row">Scoped row A</DensityRow>
              <DensityRow className="density-demo-list-row">Scoped row B</DensityRow>
              <DensityControl>Compact control</DensityControl>
            </DensityScope>
          </Section>

          <Section title="Touch floor">
            <div className="density-touch-row">
              <button type="button" className="dk-density-touch density-demo-touch">
                <Icon name="plus" size="md" />
              </button>
              <Caption>min touch = --density-touch-min (compact ≥ 40px)</Caption>
            </div>
          </Section>
        </VStack>
      </Container>
    </div>
  );
}

function OverflowLabPanel() {
  const [rows, setRows] = useState(() =>
    Array.from({ length: 80 }, (_, i) => `Row ${i + 1}`)
  );
  const [loads, setLoads] = useState(0);
  const overflowProbe = useRef<HTMLDivElement | null>(null);
  const detected = useOverflowDetection(overflowProbe, [rows]);

  return (
    <div className="overflow-lab">
      <Container variant="dashboard" paddingY="section" as="main" aria-label="Overflow lab">
        <VStack gap="spacious">
          <VStack gap="sm">
            <Title variant="section">Overflow Manager</Title>
            <BodyText size="sm">
              Scroll, fade edges, virtual lists, sync channels, and lazy load — tuned for large
              datasets.
            </BodyText>
          </VStack>

          <Section title="Fade · custom scrollbar">
            <Overflow
              ref={overflowProbe}
              fade
              scrollbar
              momentum
              focusable
              className="overflow-demo-box"
              style={{ maxHeight: "10rem" }}
            >
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="overflow-demo-row">
                  Line {i + 1} — scroll to see edge fades
                </div>
              ))}
            </Overflow>
            <Caption className="overflow-demo-meta">
              overflowY={String(detected.overflowY)} · top={String(detected.top)} · bottom=
              {String(detected.bottom)} · progress={detected.progressY.toFixed(2)}
            </Caption>
          </Section>

          <Section title="Virtual scroll · lazy load">
            <Overflow
              virtual={{ itemSize: 40, height: 240, overscan: 5 }}
              scrollbar
              onEndReached={() => {
                setLoads((n) => n + 1);
                setRows((r) => [
                  ...r,
                  ...Array.from({ length: 20 }, (_, i) => `Row ${r.length + i + 1}`),
                ]);
              }}
              className="overflow-demo-box"
            >
              {rows.map((label) => (
                <div key={label} className="overflow-demo-row" style={{ height: 40 }}>
                  {label}
                </div>
              ))}
            </Overflow>
            <Caption className="overflow-demo-meta">
              {rows.length} rows · endReached loads: {loads}
            </Caption>
          </Section>

          <Section title="Horizontal · sync">
            <OverflowX fade scrollbar className="overflow-demo-box overflow-demo-x">
              {Array.from({ length: 16 }, (_, i) => (
                <div key={i} className="overflow-demo-chip">
                  Chip {i + 1}
                </div>
              ))}
            </OverflowX>
            <div className="overflow-demo-sync">
              <Overflow syncId="demo-sync" className="overflow-demo-box" style={{ maxHeight: "6rem" }}>
                {Array.from({ length: 30 }, (_, i) => (
                  <div key={i} className="overflow-demo-row">
                    Sync A · {i + 1}
                  </div>
                ))}
              </Overflow>
              <Overflow syncId="demo-sync" className="overflow-demo-box" style={{ maxHeight: "6rem" }}>
                {Array.from({ length: 30 }, (_, i) => (
                  <div key={i} className="overflow-demo-row">
                    Sync B · {i + 1}
                  </div>
                ))}
              </Overflow>
            </div>
            <Caption className="overflow-demo-meta">syncId=&quot;demo-sync&quot; — scroll either pane</Caption>
          </Section>
        </VStack>
      </Container>
    </div>
  );
}

function PositionLabPanel() {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="position-lab">
      <Container variant="dashboard" paddingY="section" as="main" aria-label="Position lab">
        <VStack gap="spacious">
          <VStack gap="sm">
            <Title variant="section">Position System</Title>
            <BodyText size="sm">
              Semantic modes and role presets — FAB, sticky, toast, badge, floating menus with
              viewport collision.
            </BodyText>
          </VStack>

          <Section title="Sticky header">
            <div className="position-demo-scroll dk-pos-scroll">
              <PositionStickyHeader className="position-demo-sticky">
                <Caption>sticky-header · safe top</Caption>
              </PositionStickyHeader>
              <BodyText size="sm">Scroll this pane — header stays pinned.</BodyText>
              <div className="position-demo-spacer" />
            </div>
          </Section>

          <Section title="Anchor · CSS place">
            <PositionAnchor className="position-demo-anchor">
              <button type="button" className="demo-btn">
                Anchor host
              </button>
              <Position place="bottom" preset="popover" className="position-demo-float">
                <Caption>place=bottom</Caption>
              </Position>
            </PositionAnchor>
          </Section>

          <Section title="Floating collision">
            <button
              ref={anchorRef}
              type="button"
              className="demo-btn"
              onClick={() => setMenuOpen((v) => !v)}
            >
              Toggle menu
            </button>
            <FloatingPosition
              anchorRef={anchorRef}
              open={menuOpen}
              placement="bottom-start"
              role="menu"
              className="position-demo-float"
            >
              <Caption>FloatingPosition · flip + shift</Caption>
              <BodyText size="sm">Stays in viewport on scroll/resize.</BodyText>
            </FloatingPosition>
          </Section>

          <Section title="Badge · toast · layers">
            <Position mode="relative" className="position-demo-anchor">
              <div className="position-demo-avatar">A</div>
              <PositionBadge className="position-demo-badge">3</PositionBadge>
            </Position>
            <Caption className="position-demo-code">
              {positionClassName({ preset: "fab", layer: "fab" })}
            </Caption>
            <BodyText size="sm">
              FAB preview is fixed to the viewport corner (see bottom-end). Toast preset stacks at
              top center.
            </BodyText>
            <PositionToast className="position-demo-toast-inline">
              <div className="position-demo-float">Toast layer (z-toast)</div>
            </PositionToast>
          </Section>
        </VStack>
      </Container>
      <PositionFab className="position-demo-fab" aria-label="Demo FAB">
        +
      </PositionFab>
    </div>
  );
}

function AlignLabPanel() {
  return (
    <div className="align-lab">
      <Container variant="dashboard" paddingY="section" as="main" aria-label="Alignment lab">
        <VStack gap="spacious">
          <VStack gap="sm">
            <Title variant="section">Alignment System</Title>
            <BodyText size="sm">
              Logical start/end (RTL-safe), distribution, self/content/place — Apple-clean balance
              without physical left/right.
            </BodyText>
          </VStack>

          <Section title="Presets">
            <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
              {(
                [
                  ["start", AlignStart],
                  ["center", AlignCenter],
                  ["end", AlignEnd],
                  ["between", AlignBetween],
                  ["baseline", AlignBaseline],
                  ["safe", AlignSafe],
                ] as const
              ).map(([label, Comp]) => (
                <GridItem key={label} span={{ sm: 4, md: 4, lg: 4 }}>
                  <Caption>{label}</Caption>
                  <Comp className="align-demo-box">
                    <div className="align-demo-item">A</div>
                    <div className="align-demo-item align-demo-tall">B</div>
                    <div className="align-demo-item">C</div>
                  </Comp>
                </GridItem>
              ))}
            </ResponsiveGrid>
          </Section>

          <Section title="Adaptive · responsive">
            <AlignAdaptive className="align-demo-box align-demo-wide">
              <div className="align-demo-item">Brand</div>
              <div className="align-demo-item">Actions</div>
            </AlignAdaptive>
            <Caption className="align-demo-hint">
              adaptive: center → between (md) → stretch/between (lg)
            </Caption>
            <Align
              items={{ base: "center", md: "stretch" }}
              justify={{ base: "center", md: "between" }}
              motion
              className="align-demo-box align-demo-wide"
              style={{ marginTop: "var(--space-4)" }}
            >
              <div className="align-demo-item">items/justify maps</div>
              <div className="align-demo-item">motion</div>
            </Align>
            <Caption className="align-demo-code">
              {alignClassName({
                items: { base: "center", md: "stretch" },
                justify: { base: "center", md: "between" },
                display: false,
              })}
            </Caption>
          </Section>

          <Section title="Baseline · text">
            <Align items="baseline" justify="start" className="align-demo-box">
              <span className="align-demo-type-lg">Display</span>
              <span className="align-demo-type-sm">with body baseline</span>
            </Align>
            <Align text="end" display="col" className="align-demo-box" style={{ marginTop: "var(--space-3)" }}>
              <BodyText size="sm">text=end (logical)</BodyText>
              <Caption>RTL-safe</Caption>
            </Align>
          </Section>
        </VStack>
      </Container>
    </div>
  );
}

function GapLabPanel() {
  return (
    <div className="gap-lab">
      <Container variant="dashboard" paddingY="section" as="main" aria-label="Gap lab">
        <VStack gap="spacious">
          <VStack gap="sm">
            <Title variant="section">Gap System</Title>
            <BodyText size="sm">
              Spacing between children — no manual sibling margins. Toggle density in the header to
              see compact / spacious retarget tokens.
            </BodyText>
          </VStack>

          <Section title="Density presets">
            <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
              {(
                [
                  ["compact", GapCompact],
                  ["comfortable", GapComfortable],
                  ["spacious", GapSpacious],
                ] as const
              ).map(([label, Comp]) => (
                <GridItem key={label} span={{ sm: 4, md: 4, lg: 4 }}>
                  <Comp className="gap-demo-box">
                    <div className="gap-demo-item">{label} A</div>
                    <div className="gap-demo-item">{label} B</div>
                    <div className="gap-demo-item">{label} C</div>
                  </Comp>
                </GridItem>
              ))}
            </ResponsiveGrid>
          </Section>

          <Section title="Layout roles">
            <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight">
              <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                <Caption>stack</Caption>
                <GapStack className="gap-demo-box">
                  <div className="gap-demo-item">One</div>
                  <div className="gap-demo-item">Two</div>
                </GapStack>
              </GridItem>
              <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                <Caption>inline / toolbar</Caption>
                <GapInline className="gap-demo-box">
                  <div className="gap-demo-chip">A</div>
                  <div className="gap-demo-chip">B</div>
                  <div className="gap-demo-chip">C</div>
                </GapInline>
                <GapToolbar className="gap-demo-box" style={{ marginTop: "var(--space-3)" }}>
                  <div className="gap-demo-chip">Save</div>
                  <div className="gap-demo-chip">Cancel</div>
                </GapToolbar>
              </GridItem>
              <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                <Caption>form · list</Caption>
                <GapForm className="gap-demo-box">
                  <div className="gap-demo-item">Field</div>
                  <div className="gap-demo-item">Field</div>
                </GapForm>
              </GridItem>
            </ResponsiveGrid>
          </Section>

          <Section title="Responsive · nested · divider">
            <Gap gap={{ base: 2, md: 4, lg: 6 }} motion className="gap-demo-box">
              <div className="gap-demo-item">gap base→md→lg · motion</div>
              <Gap nested className="gap-demo-nested">
                <div className="gap-demo-item">nested child</div>
                <div className="gap-demo-item">dampened gap</div>
              </Gap>
            </Gap>
            <GapList divider="y" dividerGapless className="gap-demo-box" style={{ marginTop: "var(--space-4)" }}>
              <div className="gap-demo-item">Row with divider</div>
              <div className="gap-demo-item">Next row</div>
              <div className="gap-demo-item">Third</div>
            </GapList>
            <Caption className="gap-demo-code">
              {gapClassName({ preset: "toolbar", display: false })}
            </Caption>
          </Section>
        </VStack>
      </Container>
    </div>
  );
}

function PaddingLabPanel() {
  return (
    <div className="padding-lab">
      <Container variant="dashboard" paddingY="section" as="main" aria-label="Padding lab">
        <VStack gap="spacious">
          <VStack gap="sm">
            <Title variant="section">Responsive Padding</Title>
            <BodyText size="sm">
              Semantic internal spacing — change density in the header to see compact / comfortable /
              spacious retarget tokens. No raw px.
            </BodyText>
          </VStack>

          <Section title="Density presets">
            <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
              {(
                [
                  ["compact", PaddingCompact],
                  ["comfortable", PaddingComfortable],
                  ["spacious", PaddingSpacious],
                ] as const
              ).map(([label, Comp]) => (
                <GridItem key={label} span={{ sm: 4, md: 4, lg: 4 }}>
                  <Comp className="padding-demo-box">
                    <Caption>{label}</Caption>
                    <BodyText size="sm">Density-aware inset</BodyText>
                  </Comp>
                </GridItem>
              ))}
            </ResponsiveGrid>
          </Section>

          <Section title="Component presets">
            <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight" equalHeight>
              {(
                [
                  ["hero", PaddingHero],
                  ["modal", PaddingModal],
                  ["card", PaddingCard],
                  ["dashboard", PaddingDashboard],
                  ["table-cell", PaddingTableCell],
                  ["form-field", PaddingFormField],
                  ["nav", PaddingNav],
                ] as const
              ).map(([label, Comp]) => (
                <GridItem key={label} span={{ sm: 4, md: 4, lg: 3 }}>
                  <Comp className="padding-demo-box">
                    <Caption>{label}</Caption>
                  </Comp>
                </GridItem>
              ))}
            </ResponsiveGrid>
          </Section>

          <Section title="Logical · responsive">
            <Padding
              px={{ base: 3, md: 6, lg: 8 }}
              py={{ base: 2, md: 4 }}
              ps="4"
              motion
              className="padding-demo-box"
            >
              <Caption>px / py maps · ps=4 · motion</Caption>
              <BodyText size="sm">Resize to see horizontal rhythm expand.</BodyText>
            </Padding>
            <Caption className="padding-demo-code">
              {paddingClassName({ px: { base: 3, md: 6, lg: 8 }, py: { base: 2, md: 4 } })}
            </Caption>
          </Section>

          <Section title="Safe area · flush">
            <Padding preset="nav" safe="nav" className="padding-demo-box">
              <Caption>nav + safe=nav</Caption>
              <BodyText size="sm">Bottom inset respects home indicator.</BodyText>
            </Padding>
            <Padding preset="card" flush="x" className="padding-demo-box">
              <Caption>card · flush=x</Caption>
            </Padding>
          </Section>
        </VStack>
      </Container>
    </div>
  );
}

function MarginLabPanel() {
  return (
    <div className="margin-lab">
      <Container variant="dashboard" paddingY="section" as="main" aria-label="Margin lab">
        <VStack gap="spacious">
          <VStack gap="sm">
            <Title variant="section">Responsive Margin</Title>
            <BodyText size="sm">
              Semantic tokens — no hardcoded px. Logical sides (ms/me), density via the header
              control, responsive maps, collapse in flex/grid.
            </BodyText>
          </VStack>

          <Section title="Presets" description="Roles inherit --space-* + density.">
            <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="tight">
              {(
                [
                  ["page-x", MarginPage],
                  ["section", MarginSection],
                  ["card", MarginCard],
                  ["form", MarginForm],
                ] as const
              ).map(([label, Comp]) => (
                <GridItem key={label} span={{ sm: 4, md: 4, lg: 3 }}>
                  <Comp className="margin-demo-box">
                    <Caption>{label}</Caption>
                  </Comp>
                </GridItem>
              ))}
            </ResponsiveGrid>
          </Section>

          <Section title="Logical · responsive">
            <Margin
              mt={{ base: 2, md: 6, lg: 10 }}
              ms="auto"
              me={{ base: 2, md: 4 }}
              motion
              className="margin-demo-box"
            >
              <Caption>mt base→md→lg · ms=auto · me responsive · motion</Caption>
              <BodyText size="sm">Resize the viewport to see rhythm change.</BodyText>
            </Margin>
            <Caption className="margin-demo-code">
              {marginClassName({ mt: { base: 2, md: 6, lg: 10 }, ms: "auto" })}
            </Caption>
          </Section>

          <Section title="Flow · collapse" description="Adjacent margins in flex/grid without doubling.">
            <Margin flow="stack" className="margin-demo-flow">
              <div className="margin-demo-item">Item A</div>
              <div className="margin-demo-item">Item B</div>
              <div className="margin-demo-item">Item C</div>
            </Margin>
            <Margin collapse className="margin-demo-flow margin-demo-flex">
              <Margin mt="6" className="margin-demo-item">
                mt=6
              </Margin>
              <Margin mt="6" className="margin-demo-item">
                mt=6 (collapsed start)
              </Margin>
            </Margin>
          </Section>

          <Section title="Safe area · nested">
            <Margin safe="page-x" nested className="margin-demo-box">
              <Caption>safe=page-x · nested</Caption>
              <BodyText size="sm">
                Uses max(page token, env(safe-area-inset-*)). Nested zeroes page-x inside containers.
              </BodyText>
            </Margin>
          </Section>
        </VStack>
      </Container>
    </div>
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
  const [view, setView] = useState<View>("density");
  const [sectionOpen, setSectionOpen] = useState(true);
  const [sectionVisibleLog, setSectionVisibleLog] = useState("—");
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [density, setDensity] = useState<DensityMode>("comfortable");
  const [densityCustom, setDensityCustom] = useState<DensityCustomVars>({
    scale: 1.08,
    typeScale: 1.02,
    scaleSpace: true,
  });
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
    <DensityProvider
      density={density}
      custom={densityCustom}
      storageKey={false}
      onDensityChange={setDensity}
      onCustomChange={setDensityCustom}
    >
    <div className="playground">
      <header className="playground-header">
        <div>
          <h1 className="playground-brand">DevKit</h1>
          <p className="playground-sub">
            Foundation labs — density, overflow, aspect, safe area, surface, section, spacer, flex,
            stack, container, icons, motion, elevation, shape, theme, spacing, grid, typography, and
            color. Edit packages under <code>registry/components/</code> and hot-reload.
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
          {(["compact", "comfortable", "spacious", "custom"] as const).map((d) => (
            <button
              key={d}
              type="button"
              className="theme-btn"
              aria-pressed={density === d}
              onClick={() => {
                if (d === "custom") {
                  setDensity("custom");
                  setDensityCustom((c) => ({ ...c, scaleSpace: true }));
                } else {
                  setDensity(d);
                }
              }}
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
            ["density", "Density Lab"],
            ["overflow", "Overflow Lab"],
            ["position", "Position Lab"],
            ["align", "Alignment Lab"],
            ["gap", "Gap Lab"],
            ["padding", "Padding Lab"],
            ["margin", "Margin Lab"],
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

      {view === "density" ? <DensityLabPanel /> : null}

      {view === "overflow" ? <OverflowLabPanel /> : null}

      {view === "position" ? <PositionLabPanel /> : null}

      {view === "align" ? <AlignLabPanel /> : null}

      {view === "gap" ? <GapLabPanel /> : null}

      {view === "padding" ? <PaddingLabPanel /> : null}

      {view === "margin" ? <MarginLabPanel /> : null}

      {view === "breakpoints" ? <BreakpointLabPanel /> : null}

      {view === "visibility" ? (
        <div className="visibility-lab">
          <VisibilityProvider roles={["admin", "editor"]} flags={{ beta: true, legacy: false }}>
            <Container variant="dashboard" paddingY="section" as="main" aria-label="Visibility lab">
              <VStack gap="spacious">
                <VStack gap="sm">
                  <Title variant="section">Responsive Visibility Engine</Title>
                  <BodyText size="sm">
                    Conditional render by viewport, device, orientation, roles, flags, app state, and
                    a11y — CSS presets, lazy/intersection, preserve &amp; accessible modes, SSR-safe.
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
                        ["Touch", TouchOnly],
                        ["Hover", HoverCapable],
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

                <Section title="Modes" description="hide · preserve · accessible · collapse · fade">
                  <VisibilityModesDemo />
                </Section>

                <Section title="Roles · flags · media · state">
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
                    <GridItem span={{ sm: 4, md: 4, lg: 4 }}>
                      <Visibility
                        whenState={(s) => Boolean(s.demoReady)}
                        state={{ demoReady: true }}
                        block
                        className="vis-demo-tile"
                      >
                        <Caption>whenState</Caption>
                        <BodyText size="sm">App-state predicate</BodyText>
                      </Visibility>
                    </GridItem>
                    <GridItem span={{ sm: 4, md: 8, lg: 4 }}>
                      <Visibility above="md" block className="vis-demo-tile">
                        <Caption>above=md (JS media)</Caption>
                        <BodyText size="sm">matchMedia ≥ 768px</BodyText>
                      </Visibility>
                    </GridItem>
                    <GridItem span={{ sm: 4, md: 8, lg: 4 }}>
                      <VisibilityMatchDemo />
                    </GridItem>
                  </ResponsiveGrid>
                </Section>

                <Section
                  title="Lazy · intersection"
                  description="Scroll — heavy block mounts when near the viewport (sentinel keeps IO alive)."
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
