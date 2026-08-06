import * as React from "react";

export type AlignValue = "start" | "center" | "end" | "stretch" | "baseline";
export type JustifyValue =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly"
  | "stretch";
export type ContentValue =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "between"
  | "around"
  | "evenly"
  | "baseline";
export type PlaceValue = "start" | "center" | "end" | "stretch";
export type TextAlignValue = "start" | "center" | "end";

export type AlignPreset =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "between"
  | "around"
  | "evenly"
  | "baseline"
  | "safe"
  | "adaptive";

export type AlignBreakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
export type ResponsiveAlign<T> =
  | T
  | (Partial<Record<Exclude<AlignBreakpoint, "base">, T>> & { base?: T });

export type AlignDisplay = "row" | "col" | "grid" | false;

export interface AlignProps extends React.HTMLAttributes<HTMLElement> {
  /** Named alignment + distribution preset */
  preset?: AlignPreset;
  /** Cross-axis — align-items */
  items?: ResponsiveAlign<AlignValue>;
  /** Main-axis — justify-content */
  justify?: ResponsiveAlign<JustifyValue>;
  /** Alias of justify */
  distribute?: ResponsiveAlign<JustifyValue>;
  /** Multi-line — align-content */
  content?: ResponsiveAlign<ContentValue>;
  /** Child self — align-self */
  self?: ResponsiveAlign<AlignValue>;
  /** place-items shorthand */
  place?: ResponsiveAlign<PlaceValue>;
  /** Logical text-align */
  text?: ResponsiveAlign<TextAlignValue>;
  /** Ensure flex/grid host */
  display?: AlignDisplay;
  /** Reset nested self-alignment */
  nested?: boolean;
  /** Animate alignment changes */
  motion?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

type ResponsiveMap<T> = Partial<Record<Exclude<AlignBreakpoint, "base">, T>> & { base?: T };

function isResponsiveObject<T>(
  value: ResponsiveAlign<T> | undefined
): value is ResponsiveMap<T> {
  return value != null && typeof value === "object";
}

function scaleClass(prefix: string, value: string, bp?: string): string {
  if (bp && bp !== "base") return `dk-${bp}:${prefix}-${value}`;
  return `dk-${prefix}-${value}`;
}

function responsiveClasses(
  prefix: string,
  value: ResponsiveAlign<string> | undefined
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

const PRESET_CLASS: Record<AlignPreset, string> = {
  start: "dk-align-preset-start",
  center: "dk-align-preset-center",
  end: "dk-align-preset-end",
  stretch: "dk-align-preset-stretch",
  between: "dk-align-preset-between",
  around: "dk-align-preset-around",
  evenly: "dk-align-preset-evenly",
  baseline: "dk-align-preset-baseline",
  safe: "dk-align-preset-safe",
  adaptive: "dk-align-preset-adaptive",
};

const DISPLAY_CLASS: Record<Exclude<AlignDisplay, false>, string> = {
  row: "dk-align-row",
  col: "dk-align-col",
  grid: "dk-align-grid",
};

function defaultDisplay(preset?: AlignPreset): AlignDisplay {
  if (!preset) return "row";
  if (preset === "adaptive" || preset === "between" || preset === "around" || preset === "evenly") {
    return "row";
  }
  return "row";
}

function buildAlignClasses(
  props: Omit<AlignProps, "as" | "children" | "style">
): string {
  const {
    preset,
    items,
    justify,
    distribute,
    content,
    self,
    place,
    text,
    display,
    nested,
    motion,
    className,
  } = props;

  const main = justify ?? distribute;
  const displayMode =
    display === false
      ? null
      : display
        ? DISPLAY_CLASS[display]
        : DISPLAY_CLASS[defaultDisplay(preset)];

  return [
    "dk-align-system",
    preset ? PRESET_CLASS[preset] : null,
    ...responsiveClasses("items", items),
    ...responsiveClasses("justify", main),
    ...responsiveClasses("content", content),
    ...responsiveClasses("self", self),
    ...responsiveClasses("place-items", place),
    ...responsiveClasses("text", text),
    nested ? "dk-align-nested" : null,
    motion ? "dk-align-motion" : null,
    displayMode,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Universal alignment container — logical start/end, distribution, self/place. */
export function Align({
  preset,
  items,
  justify,
  distribute,
  content,
  self,
  place,
  text,
  display,
  nested = false,
  motion = false,
  as,
  className,
  style,
  children,
  ...rest
}: AlignProps) {
  const Tag = (as || "div") as React.ElementType;
  const classes = buildAlignClasses({
    preset,
    items,
    justify,
    distribute,
    content,
    self,
    place,
    text,
    display,
    nested,
    motion,
    className,
  });

  return (
    <Tag className={classes} style={style} data-dk-align={preset || "custom"} {...rest}>
      {children}
    </Tag>
  );
}

export const AlignmentUtilities = Align;

function presetOf(preset: AlignPreset) {
  return function AlignPresetComponent(props: Omit<AlignProps, "preset">) {
    return <Align preset={preset} {...props} />;
  };
}

export const AlignStart = presetOf("start");
export const AlignCenter = presetOf("center");
export const AlignEnd = presetOf("end");
export const AlignStretch = presetOf("stretch");
export const AlignBetween = presetOf("between");
export const AlignAround = presetOf("around");
export const AlignEvenly = presetOf("evenly");
export const AlignBaseline = presetOf("baseline");
export const AlignSafe = presetOf("safe");
export const AlignAdaptive = presetOf("adaptive");

/** Build className for existing Flex/Stack/Grid hosts */
export function alignClassName(
  props: Omit<AlignProps, "as" | "children" | "style">
): string {
  return buildAlignClasses({ ...props, display: props.display ?? false });
}
