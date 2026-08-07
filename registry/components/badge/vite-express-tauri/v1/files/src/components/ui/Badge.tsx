import * as React from "react";

export type BadgeTone =
  | "neutral"
  | "accent"
  | "positive"
  | "warning"
  | "negative"
  | "inverse";

/**
 * - `text` — short label / category
 * - `numeric` — count with overflow (e.g. 99+)
 * - `dot` — unread / presence mark without a numeral
 * - `icon-label` — compact icon + short label
 */
export type BadgeAppearance = "text" | "numeric" | "dot" | "icon-label";

/**
 * Shape from the global radius scale — not every badge is a pill.
 * - `soft` — radius-2 (labels / categories)
 * - `rounded` — radius-3 (default numeric)
 * - `pill` — radius-full (compact counts / dots)
 * - `auto` — soft for text/icon-label, pill for numeric/dot
 */
export type BadgeShape = "auto" | "soft" | "rounded" | "pill";

export type BadgeSize = "sm" | "md";

/** Overlay anchor when attached to a host control (logical, RTL-safe). */
export type BadgeAnchor =
  | "top-end"
  | "top-start"
  | "bottom-end"
  | "bottom-start";

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * Host control to attach the badge to. When provided, the badge overlays
   * using DevKit positioning (logical inset) and does not replace the control.
   */
  children?: React.ReactNode;
  /** Short text label (text / icon-label). Do not use for long messages. */
  label?: string;
  /** Numeric count. Prefer over putting digits in `label`. */
  count?: number;
  /**
   * Overflow threshold. Counts above this render as `{max}+` (default 99).
   * Pass `null` to disable overflow formatting.
   */
  max?: number | null;
  /** Show a numeric badge when count is 0. Default: false. */
  showZero?: boolean;
  appearance?: BadgeAppearance;
  tone?: BadgeTone;
  shape?: BadgeShape;
  size?: BadgeSize;
  /** Leading icon for `icon-label` (or custom mark). */
  icon?: React.ReactNode;
  /** Overlay corner when `children` (host) is present. Default: `top-end`. */
  anchor?: BadgeAnchor;
  /**
   * Accessible name for meaningful badges (counts, status).
   * Example: `3 unread messages`.
   */
  accessibleLabel?: string;
  /**
   * Hide from assistive technology when the badge is decorative
   * (visual reinforcement only; meaning is elsewhere).
   */
  decorative?: boolean;
}

const TONE_CLASS: Record<BadgeTone, string> = {
  neutral: "dk-badge--neutral",
  accent: "dk-badge--accent",
  positive: "dk-badge--positive",
  warning: "dk-badge--warning",
  negative: "dk-badge--negative",
  inverse: "dk-badge--inverse",
};

const APPEARANCE_CLASS: Record<BadgeAppearance, string> = {
  text: "dk-badge--text",
  numeric: "dk-badge--numeric",
  dot: "dk-badge--dot",
  "icon-label": "dk-badge--icon-label",
};

const SIZE_CLASS: Record<BadgeSize, string> = {
  sm: "dk-badge--sm",
  md: "dk-badge--md",
};

const ANCHOR_CLASS: Record<BadgeAnchor, string> = {
  "top-end": "dk-badge-anchor--top-end",
  "top-start": "dk-badge-anchor--top-start",
  "bottom-end": "dk-badge-anchor--bottom-end",
  "bottom-start": "dk-badge-anchor--bottom-start",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function resolveAppearance(
  appearance: BadgeAppearance | undefined,
  count: number | undefined,
  label: string | undefined,
  icon: React.ReactNode | undefined
): BadgeAppearance {
  if (appearance) return appearance;
  if (count != null) return "numeric";
  if (icon && label) return "icon-label";
  if (label) return "text";
  return "dot";
}

function resolveShape(
  shape: BadgeShape,
  appearance: BadgeAppearance
): Exclude<BadgeShape, "auto"> {
  if (shape !== "auto") return shape;
  if (appearance === "numeric" || appearance === "dot") return "pill";
  return "soft";
}

/**
 * Format a count with overflow, e.g. 100 → "99+" when max is 99.
 */
export function formatBadgeCount(
  count: number,
  max: number | null | undefined = 99
): string {
  if (max == null) return String(count);
  if (count > max) return `${max}+`;
  return String(count);
}

/**
 * Badge (ID 043) — compact indicator attached to another UI element.
 *
 * For counts, labels, categories, compact status, unread marks.
 * Not for long messages. Critical info must not rely on a badge alone.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    {
      children,
      label,
      count,
      max = 99,
      showZero = false,
      appearance: appearanceProp,
      tone = "neutral",
      shape = "auto",
      size = "md",
      icon,
      anchor = "top-end",
      accessibleLabel,
      decorative = false,
      className,
      id: idProp,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-badge-${reactId}`;

    const appearance = resolveAppearance(appearanceProp, count, label, icon);
    const resolvedShape = resolveShape(shape, appearance);

    const hideNumeric =
      appearance === "numeric" &&
      count != null &&
      count === 0 &&
      !showZero;

    if (hideNumeric) {
      if (children) {
        return (
          <span className={cx("dk-badge-anchor", className)}>{children}</span>
        );
      }
      return null;
    }

    const displayText =
      appearance === "numeric" && count != null
        ? formatBadgeCount(count, max)
        : appearance === "dot"
          ? null
          : label;

    const defaultA11y =
      appearance === "numeric" && count != null
        ? count === 0
          ? "0"
          : count > (max ?? Number.POSITIVE_INFINITY)
            ? `More than ${max}`
            : String(count)
        : label;

    const a11yName = decorative ? undefined : accessibleLabel ?? defaultA11y;

    const mark = (
      <span
        {...(children ? {} : rest)}
        ref={children ? undefined : ref}
        id={rootId}
        className={cx(
          "dk-badge",
          TONE_CLASS[tone],
          APPEARANCE_CLASS[appearance],
          SIZE_CLASS[size],
          `dk-badge--shape-${resolvedShape}`,
          children && "dk-badge--overlay",
          className && !children ? className : undefined
        )}
        data-tone={tone}
        data-appearance={appearance}
        data-shape={resolvedShape}
        data-size={size}
        data-count={count != null ? String(count) : undefined}
        aria-hidden={decorative || undefined}
        aria-label={!decorative ? a11yName : undefined}
        role={!decorative && a11yName ? "status" : undefined}
      >
        {appearance === "icon-label" && icon ? (
          <span className="dk-badge__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {appearance !== "dot" && displayText != null ? (
          <span className="dk-badge__label">{displayText}</span>
        ) : null}
        {appearance === "dot" ? (
          <span className="dk-badge__dot-core" aria-hidden="true" />
        ) : null}
      </span>
    );

    if (!children) return mark;

    return (
      <span
        {...rest}
        ref={ref}
        className={cx(
          "dk-badge-anchor",
          ANCHOR_CLASS[anchor],
          className
        )}
        data-anchor={anchor}
      >
        <span className="dk-badge-anchor__host">{children}</span>
        {mark}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
