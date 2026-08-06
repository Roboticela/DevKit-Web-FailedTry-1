import * as React from "react";

export type GapScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

export type GapPreset =
  | "none"
  | "compact"
  | "comfortable"
  | "spacious"
  | "stack"
  | "inline"
  | "grid"
  | "grid-tight"
  | "grid-loose"
  | "form"
  | "form-field"
  | "nav"
  | "nav-section"
  | "toolbar"
  | "card"
  | "list"
  | "table"
  | "control"
  | "section"
  | "responsive";

export type GapBreakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
export type ResponsiveGap<T> =
  | T
  | (Partial<Record<Exclude<GapBreakpoint, "base">, T>> & { base?: T });

export type GapDivider = boolean | "x" | "y";
export type GapDisplay = "row" | "col" | "grid" | false;

export interface GapProps extends React.HTMLAttributes<HTMLElement> {
  /** Semantic role — preferred over raw scale */
  preset?: GapPreset;
  /** Both axes */
  gap?: ResponsiveGap<GapScale>;
  /** Column gap (horizontal) */
  gapX?: ResponsiveGap<GapScale>;
  /** Row gap (vertical) */
  gapY?: ResponsiveGap<GapScale>;
  /** Alias of gapX */
  column?: ResponsiveGap<GapScale>;
  /** Alias of gapY */
  row?: ResponsiveGap<GapScale>;
  /** Insert dividers between children */
  divider?: GapDivider;
  /** Stronger divider border */
  dividerStrong?: boolean;
  /** Use padding instead of CSS gap with dividers */
  dividerGapless?: boolean;
  /** Nested dampening of parent --dk-gap */
  nested?: boolean | "x" | "y";
  /** Inherit parent gap custom properties */
  inherit?: boolean;
  /** Multiply by density scale */
  auto?: boolean;
  /** Animate gap changes */
  motion?: boolean;
  /** Ensure flex/grid display for gap to apply */
  display?: GapDisplay;
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

type ResponsiveMap<T> = Partial<Record<Exclude<GapBreakpoint, "base">, T>> & { base?: T };

function isResponsiveObject<T>(value: ResponsiveGap<T> | undefined): value is ResponsiveMap<T> {
  return value != null && typeof value === "object";
}

function scaleClass(prefix: string, scale: GapScale, bp?: string): string {
  const key = String(scale);
  if (bp && bp !== "base") return `dk-${bp}:${prefix}-${key}`;
  return `dk-${prefix}-${key}`;
}

function responsiveClasses(
  prefix: string,
  value: ResponsiveGap<GapScale> | undefined
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

const PRESET_CLASS: Record<GapPreset, string> = {
  none: "dk-gap-none",
  compact: "dk-gap-compact",
  comfortable: "dk-gap-comfortable",
  spacious: "dk-gap-spacious",
  stack: "dk-gap-stack",
  inline: "dk-gap-inline",
  grid: "dk-gap-grid",
  "grid-tight": "dk-gap-grid-tight",
  "grid-loose": "dk-gap-grid-loose",
  form: "dk-gap-form",
  "form-field": "dk-gap-form-field",
  nav: "dk-gap-nav",
  "nav-section": "dk-gap-nav-section",
  toolbar: "dk-gap-toolbar",
  card: "dk-gap-card",
  list: "dk-gap-list",
  table: "dk-gap-table",
  control: "dk-gap-control",
  section: "dk-gap-section",
  responsive: "dk-gap-responsive",
};

const DISPLAY_CLASS: Record<Exclude<GapDisplay, false>, string> = {
  row: "dk-gap-row",
  col: "dk-gap-col",
  grid: "dk-gap-grid-flow",
};

function buildGapClasses(props: Omit<GapProps, "as" | "children" | "style">): string {
  const {
    preset,
    gap,
    gapX,
    gapY,
    column,
    row,
    divider,
    dividerStrong,
    dividerGapless,
    nested,
    inherit: inheritGap,
    auto,
    motion,
    display,
    className,
  } = props;

  const x = gapX ?? column;
  const y = gapY ?? row;

  let dividerClass: string | null = null;
  if (divider === true || divider === "y") dividerClass = "dk-gap-divider-y";
  else if (divider === "x") dividerClass = "dk-gap-divider-x";

  let nestedClass: string | null = null;
  if (nested === true) nestedClass = "dk-gap-nested";
  else if (nested === "x") nestedClass = "dk-gap-nested-x";
  else if (nested === "y") nestedClass = "dk-gap-nested-y";

  const displayMode =
    display === false
      ? null
      : display
        ? DISPLAY_CLASS[display]
        : preset === "stack" || preset === "list" || preset === "section" || preset === "form"
          ? "dk-gap-col"
          : preset === "inline" || preset === "toolbar" || preset === "nav" || preset === "control"
            ? "dk-gap-row"
            : preset === "grid" || preset === "grid-tight" || preset === "grid-loose"
              ? "dk-gap-grid-flow"
              : "dk-gap-col";

  return [
    "dk-gap-system",
    preset ? PRESET_CLASS[preset] : null,
    ...responsiveClasses("gap", gap),
    ...responsiveClasses("gap-x", x),
    ...responsiveClasses("gap-y", y),
    dividerClass,
    dividerStrong ? "dk-gap-divider-strong" : null,
    dividerGapless ? "dk-gap-divider-gapless" : null,
    nestedClass,
    inheritGap ? "dk-gap-inherit" : null,
    auto ? "dk-gap-auto" : null,
    motion ? "dk-gap-motion" : null,
    displayMode,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Tokenized gap container — spacing between children only. */
export function Gap({
  preset,
  gap,
  gapX,
  gapY,
  column,
  row,
  divider,
  dividerStrong = false,
  dividerGapless = false,
  nested = false,
  inherit: inheritGap = false,
  auto = false,
  motion = false,
  display,
  as,
  className,
  style,
  children,
  ...rest
}: GapProps) {
  const Tag = (as || "div") as React.ElementType;
  const classes = buildGapClasses({
    preset,
    gap,
    gapX,
    gapY,
    column,
    row,
    divider,
    dividerStrong,
    dividerGapless,
    nested,
    inherit: inheritGap,
    auto,
    motion,
    display,
    className,
  });

  return (
    <Tag className={classes} style={style} data-dk-gap={preset || "custom"} {...rest}>
      {children}
    </Tag>
  );
}

export const GapUtilities = Gap;

function presetOf(preset: GapPreset, display?: GapDisplay) {
  return function GapPresetComponent(props: Omit<GapProps, "preset">) {
    return <Gap preset={preset} display={props.display ?? display} {...props} />;
  };
}

export const GapNone = presetOf("none", false);
export const GapCompact = presetOf("compact");
export const GapComfortable = presetOf("comfortable");
export const GapSpacious = presetOf("spacious");
export const GapStack = presetOf("stack", "col");
export const GapInline = presetOf("inline", "row");
export const GapGrid = presetOf("grid", "grid");
export const GapForm = presetOf("form", "col");
export const GapNav = presetOf("nav", "row");
export const GapToolbar = presetOf("toolbar", "row");
export const GapCard = presetOf("card", "col");
export const GapList = presetOf("list", "col");

/** Build className without a wrapper (apply on existing Flex/Stack/Grid). */
export function gapClassName(props: Omit<GapProps, "as" | "children" | "style">): string {
  return buildGapClasses({ ...props, display: props.display ?? false });
}
