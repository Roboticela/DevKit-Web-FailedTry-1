import * as React from "react";

export type SpacerAxis = "auto" | "x" | "y" | "both" | "horizontal" | "vertical" | "adaptive";
export type SpacerPreset =
  | "tiny"
  | "small"
  | "medium"
  | "large"
  | "xl"
  | "section"
  | "card"
  | "form"
  | "modal"
  | "nav"
  | "hero"
  | "stack"
  | "inline"
  | "page"
  | "responsive";

export type SpacerScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
export type SpacerSafeArea = boolean | "top" | "bottom" | "left" | "right" | "x" | "y";
export type SpacerBreakpoint = "sm" | "md" | "lg" | "xl";
export type ResponsiveValue<T> = T | (Partial<Record<SpacerBreakpoint, T>> & { base?: T });

export interface SpacerProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Axis / mode:
   * - `auto` — flex grow (push siblings apart)
   * - `x` / `horizontal` — fixed width token gap
   * - `y` / `vertical` — fixed height token gap
   * - `adaptive` — picks x/y from parent flex/stack direction
   * - `both` — equal width & height
   */
  axis?: ResponsiveValue<SpacerAxis>;
  /** Semantic size preset (preferred over raw size) */
  preset?: ResponsiveValue<SpacerPreset>;
  /** Spacing scale step (`--space-*`) */
  space?: ResponsiveValue<SpacerScale>;
  /**
   * @deprecated Prefer `preset` or `space` — still sets `--spacer-size` for back-compat
   */
  size?: string;
  /** Flex grow (proportional). `true` ≡ 1. Implies axis auto when no fixed axis set. */
  grow?: boolean | 0 | 1 | 2 | 3;
  /** Flex shrink */
  shrink?: boolean | 0 | 1;
  /** Percentage of parent along the axis (e.g. 0.05 or "8%") */
  proportion?: number | string;
  /** Invisible separator hairline through the spacer */
  separator?: boolean | "strong";
  /** Device safe-area inset spacer */
  safeArea?: SpacerSafeArea;
  /** Reserve space for on-screen keyboard (progressive) */
  keyboard?: boolean;
  /** Animate size / flex changes */
  motion?: boolean;
  /** Render as hr for separator semantics when separator is set */
  as?: "span" | "div" | "hr";
}

type ResponsiveMap<T> = Partial<Record<SpacerBreakpoint, T>> & { base?: T };

function isResponsiveObject<T>(value: ResponsiveValue<T> | undefined): value is ResponsiveMap<T> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function resolveAxis(axis: SpacerAxis | undefined): "auto" | "x" | "y" | "both" | "adaptive" {
  if (axis === "horizontal") return "x";
  if (axis === "vertical") return "y";
  if (axis == null) return "auto";
  return axis;
}

const PRESET_CLASS: Record<SpacerPreset, string> = {
  tiny: "dk-spacer-tiny",
  small: "dk-spacer-small",
  medium: "dk-spacer-medium",
  large: "dk-spacer-large",
  xl: "dk-spacer-xl",
  section: "dk-spacer-section",
  card: "dk-spacer-card",
  form: "dk-spacer-form",
  modal: "dk-spacer-modal",
  nav: "dk-spacer-nav",
  hero: "dk-spacer-hero",
  stack: "dk-spacer-stack",
  inline: "dk-spacer-inline",
  page: "dk-spacer-page",
  responsive: "dk-spacer-responsive",
};

const AXIS_CLASS = {
  auto: "dk-spacer",
  x: "dk-spacer-x",
  y: "dk-spacer-y",
  both: "dk-spacer-both",
  adaptive: "dk-spacer-adaptive",
} as const;

function axisClass(axis: SpacerAxis | undefined, prefix = ""): string {
  const resolved = resolveAxis(axis);
  if (!prefix) return AXIS_CLASS[resolved];
  if (resolved === "x" || resolved === "y") return `${prefix}${resolved}`;
  return "";
}

/**
 * Spacer — tokenized whitespace. Prefer presets over margins or arbitrary px.
 * Works inside Stack, Flex, Grid, and Container.
 */
export function Spacer({
  axis,
  preset,
  space,
  size,
  grow,
  shrink,
  proportion,
  separator = false,
  safeArea = false,
  keyboard = false,
  motion = true,
  as,
  className = "",
  style,
  ...props
}: SpacerProps) {
  const baseAxis = isResponsiveObject(axis) ? axis.base : axis;
  const resolvedAxis: SpacerAxis =
    baseAxis ??
    (safeArea || keyboard
      ? "y"
      : grow != null && grow !== false
        ? "auto"
        : preset != null || space != null || size != null
          ? "y"
          : "auto");

  const basePreset = isResponsiveObject(preset) ? preset.base : preset;
  const baseSpace = isResponsiveObject(space) ? space.base : space;

  const sizeClasses: string[] = [];
  if (basePreset) sizeClasses.push(PRESET_CLASS[basePreset]);
  if (baseSpace != null) sizeClasses.push(`dk-spacer-size-${baseSpace}`);

  if (isResponsiveObject(preset)) {
    (["sm", "md", "lg"] as const).forEach((bp) => {
      const v = preset[bp];
      if (v) sizeClasses.push(`dk-spacer-${bp}-${v}`);
    });
    if (preset.xl) sizeClasses.push(`dk-spacer-xl-bp-${preset.xl}`);
  }

  if (isResponsiveObject(axis)) {
    (["sm", "md", "lg"] as const).forEach((bp) => {
      const v = axis[bp];
      if (!v) return;
      const a = resolveAxis(v);
      if (a === "x" || a === "y") sizeClasses.push(`dk-spacer-${bp}-${a}`);
    });
  }

  const growClass =
    grow === true || grow === 1
      ? "dk-spacer-grow-1"
      : grow === 2
        ? "dk-spacer-grow-2"
        : grow === 3
          ? "dk-spacer-grow-3"
          : grow === 0 || grow === false
            ? "dk-spacer-grow-0"
            : "";

  const shrinkClass =
    shrink === false || shrink === 0
      ? "dk-spacer-shrink-0"
      : shrink === true || shrink === 1
        ? "dk-spacer-shrink-1"
        : "";

  const safeClass =
    safeArea === true || safeArea === "bottom"
      ? "dk-spacer-safe-bottom"
      : safeArea === "top"
        ? "dk-spacer-safe-top"
        : safeArea === "left"
          ? "dk-spacer-safe-left"
          : safeArea === "right"
            ? "dk-spacer-safe-right"
            : safeArea === "x"
              ? "dk-spacer-safe-x"
              : safeArea === "y"
                ? "dk-spacer-safe-y"
                : "";

  const hasTokenSize = Boolean(basePreset || baseSpace != null || size);
  const useAxisClass = !safeArea && !keyboard;

  const classes = [
    useAxisClass ? axisClass(resolvedAxis) : "",
    ...sizeClasses,
    growClass,
    shrinkClass,
    proportion != null ? "dk-spacer-proportion" : "",
    separator ? "dk-spacer-separator" : "",
    separator === "strong" ? "dk-spacer-separator-strong" : "",
    safeClass,
    keyboard ? "dk-spacer-keyboard" : "",
    (safeArea || keyboard) && hasTokenSize ? "dk-spacer-with-size" : "",
    motion ? "dk-spacer-motion" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const proportionValue =
    proportion == null
      ? undefined
      : typeof proportion === "number"
        ? proportion <= 1
          ? `${proportion * 100}%`
          : `${proportion}%`
        : proportion;

  const mergedStyle: React.CSSProperties = {
    ...(size ? { ["--spacer-size" as string]: size } : null),
    ...(proportionValue ? { ["--spacer-proportion" as string]: proportionValue } : null),
    ...style,
  };

  const Tag = (as ?? (separator ? "hr" : "span")) as React.ElementType;

  return (
    <Tag
      aria-hidden
      className={classes}
      style={mergedStyle}
      data-spacer-axis={resolveAxis(resolvedAxis)}
      data-spacer-preset={basePreset || undefined}
      {...props}
    />
  );
}

/** Flex-growing spacer (pushes siblings apart) */
export function FlexGrowSpacer(props: Omit<SpacerProps, "axis" | "grow">) {
  return <Spacer axis="auto" grow={1} {...props} />;
}

function presetSpacer(preset: SpacerPreset, defaultAxis: SpacerAxis = "y") {
  return function PresetSpacer(props: Omit<SpacerProps, "preset">) {
    return <Spacer preset={preset} axis={props.axis ?? defaultAxis} {...props} />;
  };
}

export const SpacerTiny = presetSpacer("tiny");
export const SpacerSmall = presetSpacer("small");
export const SpacerMedium = presetSpacer("medium");
export const SpacerLarge = presetSpacer("large");
export const SpacerXL = presetSpacer("xl");
export const SpacerSection = presetSpacer("section");
export const SpacerCard = presetSpacer("card");
export const SpacerForm = presetSpacer("form");
export const SpacerModal = presetSpacer("modal");
export const SpacerNav = presetSpacer("nav");
export const SpacerHero = presetSpacer("hero");
