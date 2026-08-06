import * as React from "react";

export type MarginScale =
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
  | 24
  | "auto";

export type MarginPreset =
  | "page"
  | "page-x"
  | "page-y"
  | "section"
  | "section-gap"
  | "container"
  | "card"
  | "form"
  | "form-field"
  | "form-section"
  | "modal"
  | "table"
  | "nav"
  | "nav-section"
  | "stack"
  | "inline"
  | "control"
  | "type"
  | "type-heading"
  | "gutter"
  | "gutter-x"
  | "gutter-y";

export type MarginBreakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
export type ResponsiveMargin<T> =
  | T
  | (Partial<Record<Exclude<MarginBreakpoint, "base">, T>> & { base?: T });

export type MarginSafeArea =
  | boolean
  | "t"
  | "b"
  | "s"
  | "e"
  | "x"
  | "y"
  | "page-x"
  | "page-y";

export type MarginCollapse = boolean | "x" | "y" | "max";

export interface MarginProps extends React.HTMLAttributes<HTMLElement> {
  /** Semantic role — preferred over raw scale */
  preset?: MarginPreset;
  m?: ResponsiveMargin<MarginScale>;
  mx?: ResponsiveMargin<MarginScale>;
  my?: ResponsiveMargin<MarginScale>;
  mt?: ResponsiveMargin<MarginScale>;
  mb?: ResponsiveMargin<MarginScale>;
  /** Inline start (RTL-aware) */
  ms?: ResponsiveMargin<MarginScale>;
  /** Inline end (RTL-aware) */
  me?: ResponsiveMargin<MarginScale>;
  /** @deprecated Prefer ms */
  ml?: ResponsiveMargin<MarginScale>;
  /** @deprecated Prefer me */
  mr?: ResponsiveMargin<MarginScale>;
  safe?: MarginSafeArea;
  /** Collapse adjacent margins in flex/grid children */
  collapse?: MarginCollapse;
  flow?: "stack" | "form" | "card" | "section";
  motion?: boolean;
  nested?: boolean;
  stable?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

type ResponsiveMap<T> = Partial<Record<Exclude<MarginBreakpoint, "base">, T>> & { base?: T };

function isResponsiveObject<T>(
  value: ResponsiveMargin<T> | undefined
): value is ResponsiveMap<T> {
  return value != null && typeof value === "object";
}

function scaleClass(prefix: string, scale: MarginScale, bp?: string): string {
  const key = scale === "auto" ? "auto" : String(scale);
  if (bp && bp !== "base") return `dk-${bp}:${prefix}-${key}`;
  return `dk-${prefix}-${key}`;
}

function responsiveClasses(
  prefix: string,
  value: ResponsiveMargin<MarginScale> | undefined
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

const PRESET_CLASS: Record<MarginPreset, string> = {
  page: "dk-m-page",
  "page-x": "dk-m-page-x",
  "page-y": "dk-m-page-y",
  section: "dk-m-section",
  "section-gap": "dk-m-section-gap",
  container: "dk-m-container",
  card: "dk-m-card",
  form: "dk-m-form",
  "form-field": "dk-m-form-field",
  "form-section": "dk-m-form-section",
  modal: "dk-m-modal",
  table: "dk-m-table",
  nav: "dk-m-nav",
  "nav-section": "dk-m-nav-section",
  stack: "dk-m-stack",
  inline: "dk-m-inline",
  control: "dk-m-control",
  type: "dk-m-type",
  "type-heading": "dk-m-type-heading",
  gutter: "dk-m-gutter",
  "gutter-x": "dk-m-gutter-x",
  "gutter-y": "dk-m-gutter-y",
};

const SAFE_CLASS: Record<Exclude<MarginSafeArea, boolean>, string> = {
  t: "dk-m-safe-t",
  b: "dk-m-safe-b",
  s: "dk-m-safe-s",
  e: "dk-m-safe-e",
  x: "dk-m-safe-x",
  y: "dk-m-safe-y",
  "page-x": "dk-m-safe-page-x",
  "page-y": "dk-m-safe-page-y",
};

const FLOW_CLASS = {
  stack: "dk-m-stack-flow",
  form: "dk-m-form-flow",
  card: "dk-m-card-flow",
  section: "dk-m-section-flow",
} as const;

function buildMarginClasses(
  props: Omit<MarginProps, "as" | "children" | "style">
): string {
  const {
    preset,
    m,
    mx,
    my,
    mt,
    mb,
    ms,
    me,
    ml,
    mr,
    safe,
    collapse,
    flow,
    motion,
    nested,
    stable,
    className,
  } = props;

  return [
    preset ? PRESET_CLASS[preset] : null,
    ...responsiveClasses("m", m),
    ...responsiveClasses("mx", mx),
    ...responsiveClasses("my", my),
    ...responsiveClasses("mt", mt),
    ...responsiveClasses("mb", mb),
    ...responsiveClasses("ms", ms),
    ...responsiveClasses("me", me),
    ...responsiveClasses("ml", ml),
    ...responsiveClasses("mr", mr),
    safe === true ? "dk-m-safe" : safe ? SAFE_CLASS[safe] : null,
    collapse === true || collapse === "y" ? "dk-margin-collapse" : null,
    collapse === "x" ? "dk-margin-collapse-x" : null,
    collapse === "max" ? "dk-margin-collapse-max" : null,
    flow ? FLOW_CLASS[flow] : null,
    motion ? "dk-m-motion" : null,
    nested ? "dk-margin-nested" : null,
    stable ? "dk-m-stable" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Tokenized margin box — never pass raw px. */
export function Margin({
  preset,
  m,
  mx,
  my,
  mt,
  mb,
  ms,
  me,
  ml,
  mr,
  safe,
  collapse,
  flow,
  motion = false,
  nested = false,
  stable = false,
  as,
  className,
  style,
  children,
  ...rest
}: MarginProps) {
  const Tag = (as || "div") as React.ElementType;
  const classes = buildMarginClasses({
    preset,
    m,
    mx,
    my,
    mt,
    mb,
    ms,
    me,
    ml,
    mr,
    safe,
    collapse,
    flow,
    motion,
    nested,
    stable,
    className,
  });

  return (
    <Tag className={classes} style={style} data-dk-margin={preset || "custom"} {...rest}>
      {children}
    </Tag>
  );
}

export const MarginUtilities = Margin;

function presetOf(preset: MarginPreset) {
  return function MarginPresetComponent(props: Omit<MarginProps, "preset">) {
    return <Margin preset={preset} {...props} />;
  };
}

export const MarginPage = presetOf("page");
export const MarginSection = presetOf("section");
export const MarginCard = presetOf("card");
export const MarginForm = presetOf("form");
export const MarginModal = presetOf("modal");
export const MarginStack = presetOf("stack");
export const MarginInline = presetOf("inline");

/** Build className without a wrapper element */
export function marginClassName(
  props: Omit<MarginProps, "as" | "children" | "style">
): string {
  return buildMarginClasses(props);
}
