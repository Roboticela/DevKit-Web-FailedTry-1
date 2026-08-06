import * as React from "react";

export type PaddingScale =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 8
  | 10
  | 12
  | 16
  | 20
  | 24;

export type PaddingPreset =
  | "none"
  | "compact"
  | "comfortable"
  | "spacious"
  | "hero"
  | "hero-x"
  | "hero-y"
  | "modal"
  | "sheet"
  | "card"
  | "dashboard"
  | "table-cell"
  | "table-header"
  | "form-field"
  | "input"
  | "button"
  | "nav"
  | "nav-x"
  | "nav-y"
  | "container"
  | "section"
  | "page";

export type PaddingBreakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
export type ResponsivePadding<T> =
  | T
  | (Partial<Record<Exclude<PaddingBreakpoint, "base">, T>> & { base?: T });

export type PaddingSafeArea =
  | boolean
  | "t"
  | "b"
  | "s"
  | "e"
  | "x"
  | "y"
  | "page"
  | "nav";

export interface PaddingProps extends React.HTMLAttributes<HTMLElement> {
  /** Semantic role — preferred over raw scale */
  preset?: PaddingPreset;
  p?: ResponsivePadding<PaddingScale>;
  px?: ResponsivePadding<PaddingScale>;
  py?: ResponsivePadding<PaddingScale>;
  pt?: ResponsivePadding<PaddingScale>;
  pb?: ResponsivePadding<PaddingScale>;
  /** Inline start (RTL-aware) */
  ps?: ResponsivePadding<PaddingScale>;
  /** Inline end (RTL-aware) */
  pe?: ResponsivePadding<PaddingScale>;
  /** @deprecated Prefer ps */
  pl?: ResponsivePadding<PaddingScale>;
  /** @deprecated Prefer pe */
  pr?: ResponsivePadding<PaddingScale>;
  safe?: PaddingSafeArea;
  /** Animate padding changes (honors reduced motion) */
  motion?: boolean;
  /** Zero inline padding inside containers */
  nested?: boolean;
  /** Flush helpers */
  flush?: boolean | "x" | "y";
  stable?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

type ResponsiveMap<T> = Partial<Record<Exclude<PaddingBreakpoint, "base">, T>> & { base?: T };

function isResponsiveObject<T>(
  value: ResponsivePadding<T> | undefined
): value is ResponsiveMap<T> {
  return value != null && typeof value === "object";
}

function scaleClass(prefix: string, scale: PaddingScale, bp?: string): string {
  const key = String(scale);
  if (bp && bp !== "base") return `dk-${bp}:${prefix}-${key}`;
  return `dk-${prefix}-${key}`;
}

function responsiveClasses(
  prefix: string,
  value: ResponsivePadding<PaddingScale> | undefined
): string[] {
  if (value == null) return [];
  if (!isResponsiveObject(value)) return [scaleClass(prefix, value)];
  const out: string[] = [];
  if (value.base != null) out.push(scaleClass(prefix, value.base));
  for (const bp of ["sm", "md", "lg", "xl", "2xl"] as const) {
    if (value[bp] != null) out.push(scaleClass(prefix, value[bp]!, bp));
  }
  return out;
}

const PRESET_CLASS: Record<PaddingPreset, string> = {
  none: "dk-p-none",
  compact: "dk-p-compact",
  comfortable: "dk-p-comfortable",
  spacious: "dk-p-spacious",
  hero: "dk-p-hero",
  "hero-x": "dk-p-hero-x",
  "hero-y": "dk-p-hero-y",
  modal: "dk-p-modal",
  sheet: "dk-p-sheet",
  card: "dk-p-card",
  dashboard: "dk-p-dashboard",
  "table-cell": "dk-p-table-cell",
  "table-header": "dk-p-table-header",
  "form-field": "dk-p-form-field",
  input: "dk-p-input",
  button: "dk-p-button",
  nav: "dk-p-nav",
  "nav-x": "dk-p-nav-x",
  "nav-y": "dk-p-nav-y",
  container: "dk-p-container",
  section: "dk-p-section",
  page: "dk-p-page",
};

const SAFE_CLASS: Record<Exclude<PaddingSafeArea, boolean>, string> = {
  t: "dk-p-safe-t",
  b: "dk-p-safe-b",
  s: "dk-p-safe-s",
  e: "dk-p-safe-e",
  x: "dk-p-safe-x",
  y: "dk-p-safe-y",
  page: "dk-p-safe-page",
  nav: "dk-p-safe-nav",
};

function buildPaddingClasses(
  props: Omit<PaddingProps, "as" | "children" | "style">
): string {
  const {
    preset,
    p,
    px,
    py,
    pt,
    pb,
    ps,
    pe,
    pl,
    pr,
    safe,
    motion,
    nested,
    flush,
    stable,
    className,
  } = props;

  return [
    preset ? PRESET_CLASS[preset] : null,
    ...responsiveClasses("p", p),
    ...responsiveClasses("px", px),
    ...responsiveClasses("py", py),
    ...responsiveClasses("pt", pt),
    ...responsiveClasses("pb", pb),
    ...responsiveClasses("ps", ps),
    ...responsiveClasses("pe", pe),
    ...responsiveClasses("pl", pl),
    ...responsiveClasses("pr", pr),
    safe === true ? "dk-p-safe" : safe ? SAFE_CLASS[safe] : null,
    motion ? "dk-p-motion" : null,
    nested ? "dk-padding-nested" : null,
    flush === true ? "dk-p-flush" : flush === "x" ? "dk-p-flush-x" : flush === "y" ? "dk-p-flush-y" : null,
    stable ? "dk-p-stable" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Tokenized padding box — never pass raw px. */
export function Padding({
  preset,
  p,
  px,
  py,
  pt,
  pb,
  ps,
  pe,
  pl,
  pr,
  safe,
  motion = false,
  nested = false,
  flush,
  stable = false,
  as,
  className,
  style,
  children,
  ...rest
}: PaddingProps) {
  const Tag = (as || "div") as React.ElementType;
  const classes = buildPaddingClasses({
    preset,
    p,
    px,
    py,
    pt,
    pb,
    ps,
    pe,
    pl,
    pr,
    safe,
    motion,
    nested,
    flush,
    stable,
    className,
  });

  return (
    <Tag className={classes} style={style} data-dk-padding={preset || "custom"} {...rest}>
      {children}
    </Tag>
  );
}

export const PaddingUtilities = Padding;

function presetOf(preset: PaddingPreset) {
  return function PaddingPresetComponent(props: Omit<PaddingProps, "preset">) {
    return <Padding preset={preset} {...props} />;
  };
}

export const PaddingNone = presetOf("none");
export const PaddingCompact = presetOf("compact");
export const PaddingComfortable = presetOf("comfortable");
export const PaddingSpacious = presetOf("spacious");
export const PaddingHero = presetOf("hero");
export const PaddingModal = presetOf("modal");
export const PaddingCard = presetOf("card");
export const PaddingDashboard = presetOf("dashboard");
export const PaddingTableCell = presetOf("table-cell");
export const PaddingFormField = presetOf("form-field");
export const PaddingNav = presetOf("nav");
export const PaddingSheet = presetOf("sheet");

/** Build className without a wrapper element */
export function paddingClassName(
  props: Omit<PaddingProps, "as" | "children" | "style">
): string {
  return buildPaddingClasses(props);
}
