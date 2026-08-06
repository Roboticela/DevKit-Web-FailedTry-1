import * as React from "react";

export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
export type FlexWrap = boolean | "wrap" | "nowrap" | "wrap-reverse";
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type FlexJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly"
  | "stretch";
export type FlexContent =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly"
  | "stretch";
export type FlexGap =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "compact"
  | "comfortable"
  | "spacious"
  | "responsive"
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 8
  | (string & {});
export type FlexOverflow = "visible" | "hidden" | "auto" | "clip" | "x-auto" | "y-auto";
export type FlexBreakpoint = "sm" | "md" | "lg" | "xl";
export type ResponsiveValue<T> = T | (Partial<Record<FlexBreakpoint, T>> & { base?: T });

export type FlexPreset =
  | "navbar"
  | "toolbar"
  | "form-row"
  | "dashboard-summary"
  | "action-group"
  | "profile-header"
  | "card-footer"
  | "filter-bar"
  | "stats-row"
  | "button-group";

export type FlexBasis =
  | "auto"
  | "0"
  | "full"
  | "content"
  | "max"
  | "min"
  | "fit"
  | (string & {});

export type FlexItemRole = "label" | "control" | "avatar" | "identity" | "actions" | "filters" | "meta";

type ResponsiveMap<T> = Partial<Record<FlexBreakpoint, T>> & { base?: T };

function isResponsiveObject<T>(value: ResponsiveValue<T> | undefined): value is ResponsiveMap<T> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function toCssSize(value: string | number | undefined): string | undefined {
  if (value == null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

const NAMED_GAPS = new Set([
  "none",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "compact",
  "comfortable",
  "spacious",
  "responsive",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
]);

const RESPONSIVE_GAPS = new Set(["none", "compact", "comfortable", "spacious"]);

function gapClass(gap: FlexGap | undefined): string {
  if (gap == null || gap === "") return "";
  if (typeof gap === "number") return `dk-flex-gap-${gap}`;
  if (NAMED_GAPS.has(String(gap))) return `dk-flex-gap-${gap}`;
  return "";
}

function isCustomGap(gap: FlexGap | undefined): gap is string {
  if (gap == null || typeof gap === "number") return false;
  return gapClass(gap) === "";
}

function directionToken(dir: FlexDirection): string {
  if (dir === "column") return "col";
  if (dir === "column-reverse") return "col-reverse";
  if (dir === "row-reverse") return "row-reverse";
  return "row";
}

function wrapToken(wrap: FlexWrap | undefined): string {
  if (wrap == null) return "";
  if (wrap === true || wrap === "wrap") return "wrap";
  if (wrap === "wrap-reverse") return "wrap-reverse";
  return "nowrap";
}

export interface FlexLayoutProps extends React.HTMLAttributes<HTMLElement> {
  /** Flex direction — supports responsive maps */
  direction?: ResponsiveValue<FlexDirection>;
  /** Wrapping behavior */
  wrap?: ResponsiveValue<FlexWrap>;
  /** Cross-axis alignment */
  align?: ResponsiveValue<FlexAlign>;
  /** Main-axis justification */
  justify?: ResponsiveValue<FlexJustify>;
  /** Multi-line align-content */
  content?: FlexContent;
  /** Token gap, scale step, CSS length, or responsive map */
  gap?: FlexGap | ResponsiveValue<FlexGap>;
  /** Equal flex distribution of children */
  equal?: boolean;
  /** Inline flex */
  inline?: boolean;
  /** Nested flex — slightly tighter gap */
  nested?: boolean;
  /** Animate gap / direction changes */
  motion?: boolean;
  /** Overflow on the container */
  overflow?: FlexOverflow;
  /** Semantic layout preset */
  preset?: FlexPreset;
  /** Landmark / semantic element */
  as?: keyof React.JSX.IntrinsicElements;
}

export interface FlexItemProps extends React.HTMLAttributes<HTMLElement> {
  grow?: boolean | 0 | 1 | 2 | 3;
  shrink?: boolean | 0 | 1;
  basis?: FlexBasis;
  order?: "first" | "last" | 0 | 1 | 2 | 3 | 4 | 5 | number;
  align?: FlexAlign | "auto";
  /** Shorthand: flex 1 1 0% */
  flex?: boolean | "auto" | "none" | "initial" | "1";
  minWidth?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  overflow?: FlexOverflow;
  /** max-content width capped at 100% */
  intrinsic?: boolean;
  /** Role for preset CSS hooks */
  flexRole?: FlexItemRole;
  as?: keyof React.JSX.IntrinsicElements;
}

function buildResponsiveDirection(direction: ResponsiveValue<FlexDirection> | undefined): string {
  if (direction == null) return "dk-flex-row";
  if (!isResponsiveObject(direction)) return `dk-flex-${directionToken(direction)}`;
  const parts: string[] = [];
  if (direction.base != null) parts.push(`dk-flex-${directionToken(direction.base)}`);
  else parts.push("dk-flex-row");
  (["sm", "md", "lg", "xl"] as const).forEach((bp) => {
    if (direction[bp] != null) parts.push(`dk-flex-${bp}-${directionToken(direction[bp]!)}`);
  });
  return parts.join(" ");
}

function buildResponsiveWrap(wrap: ResponsiveValue<FlexWrap> | undefined): string {
  if (wrap == null) return "";
  if (!isResponsiveObject(wrap)) {
    const t = wrapToken(wrap);
    return t ? `dk-flex-${t}` : "";
  }
  const parts: string[] = [];
  if (wrap.base != null) {
    const t = wrapToken(wrap.base);
    if (t) parts.push(`dk-flex-${t}`);
  }
  (["sm", "md", "lg", "xl"] as const).forEach((bp) => {
    if (wrap[bp] != null) {
      const t = wrapToken(wrap[bp]);
      if (t) parts.push(`dk-flex-${bp}-${t}`);
    }
  });
  return parts.join(" ");
}

function buildResponsiveAlign(align: ResponsiveValue<FlexAlign> | undefined): string {
  if (align == null) return "";
  if (!isResponsiveObject(align)) return `dk-flex-align-${align}`;
  const parts: string[] = [];
  if (align.base != null) parts.push(`dk-flex-align-${align.base}`);
  (["sm", "md", "lg", "xl"] as const).forEach((bp) => {
    if (align[bp] != null) parts.push(`dk-flex-${bp}-align-${align[bp]}`);
  });
  return parts.join(" ");
}

function buildResponsiveJustify(justify: ResponsiveValue<FlexJustify> | undefined): string {
  if (justify == null) return "";
  if (!isResponsiveObject(justify)) return `dk-flex-justify-${justify}`;
  const parts: string[] = [];
  if (justify.base != null) parts.push(`dk-flex-justify-${justify.base}`);
  (["sm", "md", "lg", "xl"] as const).forEach((bp) => {
    if (justify[bp] != null) parts.push(`dk-flex-${bp}-justify-${justify[bp]}`);
  });
  return parts.join(" ");
}

function buildGapUtilities(gap: FlexGap | ResponsiveValue<FlexGap> | undefined): {
  className: string;
  style: React.CSSProperties | null;
} {
  if (gap == null) return { className: "", style: null };
  if (!isResponsiveObject(gap)) {
    if (isCustomGap(gap)) return { className: "", style: { ["--flex-gap" as string]: gap, gap } };
    return { className: gapClass(gap), style: null };
  }
  const parts: string[] = [];
  let style: React.CSSProperties | null = null;
  if (gap.base != null) {
    if (isCustomGap(gap.base)) style = { ["--flex-gap" as string]: gap.base, gap: gap.base };
    else parts.push(gapClass(gap.base));
  }
  (["sm", "md", "lg", "xl"] as const).forEach((bp) => {
    const v = gap[bp];
    if (v == null || isCustomGap(v)) return;
    if (RESPONSIVE_GAPS.has(String(v))) parts.push(`dk-flex-${bp}-gap-${v}`);
    else parts.push(gapClass(v));
  });
  return { className: parts.join(" "), style };
}

const PRESET_DEFAULTS: Record<
  FlexPreset,
  Partial<Pick<FlexLayoutProps, "direction" | "wrap" | "align" | "justify" | "gap">>
> = {
  navbar: { direction: "row", wrap: true, align: "center", justify: "between", gap: "comfortable" },
  toolbar: { direction: "row", wrap: true, align: "center", justify: "start", gap: "compact" },
  "form-row": {
    direction: { base: "column", md: "row" },
    align: { base: "stretch", md: "center" },
    gap: "comfortable",
  },
  "dashboard-summary": { direction: "row", wrap: true, align: "stretch", gap: "comfortable" },
  "action-group": { direction: "row", wrap: true, align: "center", justify: "end", gap: "compact" },
  "profile-header": { direction: "row", wrap: true, align: "center", gap: "comfortable" },
  "card-footer": { direction: "row", wrap: true, align: "center", justify: "between", gap: "compact" },
  "filter-bar": { direction: "row", wrap: true, align: "center", gap: "compact" },
  "stats-row": { direction: "row", wrap: true, align: "stretch", justify: "between", gap: "comfortable" },
  "button-group": {
    direction: { base: "column", sm: "row" },
    wrap: true,
    align: { base: "stretch", sm: "center" },
    gap: "compact",
  },
};

/**
 * Flex Layout — eliminates raw Flexbox CSS in application code.
 * Directions, grow/shrink/basis, presets, responsive maps, token gaps.
 */
export function FlexLayout({
  direction,
  wrap,
  align,
  justify,
  content,
  gap,
  equal = false,
  inline = false,
  nested = false,
  motion = true,
  overflow,
  preset,
  as = "div",
  className = "",
  style,
  children,
  ...props
}: FlexLayoutProps) {
  const defaults = preset ? PRESET_DEFAULTS[preset] : null;
  const resolvedDirection = direction ?? defaults?.direction ?? "row";
  const resolvedWrap = wrap ?? defaults?.wrap;
  const resolvedAlign = align ?? defaults?.align ?? (preset ? undefined : "stretch");
  const resolvedJustify = justify ?? defaults?.justify ?? (preset ? undefined : "start");
  const resolvedGap = gap ?? defaults?.gap ?? (preset ? undefined : "comfortable");

  const gapUtils = buildGapUtilities(resolvedGap);

  const classes = [
    "dk-flex",
    inline ? "dk-flex-inline" : "",
    motion ? "dk-flex-motion" : "",
    nested ? "dk-flex-nested" : "",
    equal ? "dk-flex-equal" : "",
    overflow ? `dk-flex-overflow-${overflow}` : "",
    preset ? `dk-flex-preset-${preset}` : "",
    // When using a preset, CSS owns most layout — only apply responsive overrides
    preset && !direction && !isResponsiveObject(resolvedDirection)
      ? ""
      : buildResponsiveDirection(resolvedDirection),
    buildResponsiveWrap(resolvedWrap),
    buildResponsiveAlign(resolvedAlign),
    buildResponsiveJustify(resolvedJustify),
    content ? `dk-flex-content-${content}` : "",
    gapUtils.className,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Tag = as as React.ElementType;

  return (
    <Tag
      {...props}
      className={classes}
      style={{ ...gapUtils.style, ...style }}
      data-flex-preset={preset || undefined}
    >
      {children}
    </Tag>
  );
}

/** Flex child with grow / shrink / basis / order / constraints */
export function FlexItem({
  grow,
  shrink,
  basis,
  order,
  align = "auto",
  flex,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  overflow,
  intrinsic = false,
  flexRole,
  as = "div",
  className = "",
  style,
  children,
  ...props
}: FlexItemProps) {
  const growClass =
    grow === true || grow === 1
      ? "dk-flex-grow-1"
      : grow === 2
        ? "dk-flex-grow-2"
        : grow === 3
          ? "dk-flex-grow-3"
          : grow === 0 || grow === false
            ? "dk-flex-grow-0"
            : "";

  const shrinkClass =
    shrink === false || shrink === 0
      ? "dk-flex-shrink-0"
      : shrink === true || shrink === 1
        ? "dk-flex-shrink-1"
        : "";

  const basisClass =
    basis == null
      ? ""
      : ["auto", "0", "full", "content", "max", "min", "fit"].includes(basis)
        ? `dk-flex-basis-${basis}`
        : "";

  const flexClass =
    flex === true || flex === "1"
      ? "dk-flex-1"
      : flex === "auto"
        ? "dk-flex-auto"
        : flex === "none"
          ? "dk-flex-none"
          : flex === "initial"
            ? "dk-flex-initial"
            : "";

  const orderClass =
    order === "first"
      ? "dk-flex-order-first"
      : order === "last"
        ? "dk-flex-order-last"
        : typeof order === "number" && order >= 0 && order <= 5
          ? `dk-flex-order-${order}`
          : "";

  const constrained =
    minWidth != null || maxWidth != null || minHeight != null || maxHeight != null || (basis != null && !basisClass);

  const classes = [
    "dk-flex-item",
    growClass,
    shrinkClass,
    basisClass,
    flexClass,
    orderClass,
    align !== "auto" ? `dk-flex-self-${align}` : "",
    overflow ? `dk-flex-overflow-${overflow}` : "",
    intrinsic ? "dk-flex-intrinsic" : "",
    constrained ? "dk-flex-constrained" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle: React.CSSProperties = {
    ...(constrained
      ? {
          ["--flex-min-w" as string]: toCssSize(minWidth),
          ["--flex-max-w" as string]: toCssSize(maxWidth),
          ["--flex-min-h" as string]: toCssSize(minHeight),
          ["--flex-max-h" as string]: toCssSize(maxHeight),
          ...(basis && !basisClass ? { ["--flex-basis" as string]: basis, flexBasis: basis } : null),
          ...(typeof order === "number" && (order < 0 || order > 5) ? { order } : null),
        }
      : typeof order === "number" && (order < 0 || order > 5)
        ? { order }
        : null),
    ...style,
  };

  const Tag = as as React.ElementType;

  return (
    <Tag
      {...props}
      className={classes}
      style={mergedStyle}
      data-flex-role={flexRole || undefined}
    >
      {children}
    </Tag>
  );
}

/** Spacer that absorbs free space between flex children */
export function FlexSpacer({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`dk-flex-auto ${className}`.trim()} aria-hidden {...props} />;
}

export const Flex = FlexLayout;

function presetComponent(preset: FlexPreset) {
  return function PresetFlex(props: Omit<FlexLayoutProps, "preset">) {
    return <FlexLayout preset={preset} {...props} />;
  };
}

export const FlexNavbar = presetComponent("navbar");
export const FlexToolbar = presetComponent("toolbar");
export const FlexFormRow = presetComponent("form-row");
export const FlexDashboardSummary = presetComponent("dashboard-summary");
export const FlexActionGroup = presetComponent("action-group");
export const FlexProfileHeader = presetComponent("profile-header");
export const FlexCardFooter = presetComponent("card-footer");
export const FlexFilterBar = presetComponent("filter-bar");
export const FlexStatsRow = presetComponent("stats-row");
export const FlexButtonGroup = presetComponent("button-group");
