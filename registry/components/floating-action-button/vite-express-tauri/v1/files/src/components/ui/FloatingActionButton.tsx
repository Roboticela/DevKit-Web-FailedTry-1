import * as React from "react";

export type FloatingActionButtonSize = "sm" | "md" | "lg";

/**
 * - `icon` — icon-only (label is accessible name only)
 * - `label` — icon + visible text
 * - `extended` — icon + text with expanded horizontal padding
 */
export type FloatingActionButtonAppearance = "icon" | "label" | "extended";

/**
 * Fixed corner placement, or `inline` for desktop contextual layout (not fixed).
 */
export type FloatingActionButtonPosition =
  | "bottom-end"
  | "bottom-start"
  | "top-end"
  | "top-start"
  | "inline";

export interface FloatingActionButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  size?: FloatingActionButtonSize;
  appearance?: FloatingActionButtonAppearance;
  /**
   * Placement. Mobile typically `bottom-end` with safe-area.
   * Desktop may use `inline` inside a contextual region instead of a corner.
   */
  position?: FloatingActionButtonPosition;
  /** Visible label for `label`/`extended`; always the accessible name. */
  label: string;
  /** Primary glyph. Default visual size 24px at MD. */
  icon: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  /**
   * When `auto` (default), extended/label collapse to icon-only under compact widths.
   * Pass `true` to always collapse; `false` to never.
   */
  compact?: boolean | "auto";
  /**
   * Extra offset above bottom chrome (bottom nav, browser UI).
   * Applied with safe-area. CSS also reads `--dk-fab-nav-offset` / `--dk-fab-keyboard-offset`.
   */
  offsetBottom?: string;
  /** Extra inset from the inline end/start edge. */
  offsetInline?: string;
}

const SIZE_CLASS: Record<FloatingActionButtonSize, string> = {
  sm: "dk-fab--sm",
  md: "dk-fab--md",
  lg: "dk-fab--lg",
};

const APPEARANCE_CLASS: Record<FloatingActionButtonAppearance, string> = {
  icon: "dk-fab--icon",
  label: "dk-fab--label",
  extended: "dk-fab--extended",
};

const POSITION_CLASS: Record<FloatingActionButtonPosition, string> = {
  "bottom-end": "dk-fab--bottom-end",
  "bottom-start": "dk-fab--bottom-start",
  "top-end": "dk-fab--top-end",
  "top-start": "dk-fab--top-start",
  inline: "dk-fab--inline",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Floating Action Button (ID 006) — one persistent contextual action above content.
 *
 * Use only when a single action deserves lasting prominence. Prefer tonal elevation (no heavy shadow).
 */
export const FloatingActionButton = React.forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(function FloatingActionButton(
  {
    size = "md",
    appearance = "icon",
    position = "bottom-end",
    label,
    icon,
    loading = false,
    loadingLabel,
    compact = "auto",
    offsetBottom,
    offsetInline,
    disabled = false,
    type = "button",
    className,
    style,
    onClick,
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;
  const showLabel = appearance === "label" || appearance === "extended";
  const accessibleName = loading ? (loadingLabel ?? `${label}, Loading`) : label;

  const compactClass =
    compact === true
      ? "dk-fab--compact"
      : compact === "auto"
        ? "dk-fab--compact-auto"
        : "dk-fab--compact-off";

  const cssVars = {
    ...(style as React.CSSProperties),
    ...(offsetBottom ? ({ ["--dk-fab-offset-bottom" as string]: offsetBottom } as object) : null),
    ...(offsetInline ? ({ ["--dk-fab-offset-inline" as string]: offsetInline } as object) : null),
  } as React.CSSProperties;

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={cx(
        "dk-fab",
        SIZE_CLASS[size],
        APPEARANCE_CLASS[appearance],
        POSITION_CLASS[position],
        compactClass,
        loading && "dk-fab--loading",
        className
      )}
      style={cssVars}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      aria-label={accessibleName}
      title={showLabel ? undefined : label}
      data-size={size}
      data-appearance={appearance}
      data-position={position}
      data-loading={loading || undefined}
      onClick={isDisabled ? undefined : onClick}
    >
      <span className="dk-fab__surface">
        <span
          className="dk-fab__content"
          data-hidden={loading || undefined}
          aria-hidden={loading || undefined}
        >
          <span className="dk-fab__icon" aria-hidden="true">
            {icon}
          </span>
          {showLabel ? <span className="dk-fab__label">{label}</span> : null}
        </span>

        {loading ? (
          <span className="dk-fab__loader" aria-hidden="true">
            <span className="dk-fab__spinner" />
          </span>
        ) : null}
      </span>
    </button>
  );
});

FloatingActionButton.displayName = "FloatingActionButton";

export default FloatingActionButton;
