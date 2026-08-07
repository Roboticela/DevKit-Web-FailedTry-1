import * as React from "react";

export type IconButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export type IconButtonVariant =
  | "neutral"
  | "subtle"
  | "filled"
  | "outlined"
  | "destructive"
  | "inverse";

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> {
  /** Control size. Default: `md` (40px visual). Hit area ≥44×44. */
  size?: IconButtonSize;
  /** Visual style. Default: `neutral`. */
  variant?: IconButtonVariant;
  /**
   * Required accessible name. Also used for the desktop tooltip unless `tooltip` overrides.
   * Tooltips must never be the only accessible name — this prop is.
   */
  label: string;
  /**
   * Desktop hover tooltip text. Defaults to `label`.
   * Pass `false` to suppress the native tooltip without removing the accessible name.
   */
  tooltip?: string | false;
  /** Icon node. Prefer a single meaningful SVG at 16–24px. */
  icon?: React.ReactNode;
  /** Alternate icon slot (same as `icon`). */
  children?: React.ReactNode;
  /** Loading preserves dimensions and blocks interaction. */
  loading?: boolean;
  /** Accessible name while loading. Defaults to `label, Loading`. */
  loadingLabel?: string;
  /** Toggle/selected appearance. Sets `aria-pressed`. */
  selected?: boolean;
}

const SIZE_CLASS: Record<IconButtonSize, string> = {
  xs: "dk-icon-button--xs",
  sm: "dk-icon-button--sm",
  md: "dk-icon-button--md",
  lg: "dk-icon-button--lg",
  xl: "dk-icon-button--xl",
};

const VARIANT_CLASS: Record<IconButtonVariant, string> = {
  neutral: "dk-icon-button--neutral",
  subtle: "dk-icon-button--subtle",
  filled: "dk-icon-button--filled",
  outlined: "dk-icon-button--outlined",
  destructive: "dk-icon-button--destructive",
  inverse: "dk-icon-button--inverse",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Icon Button (ID 002) — compact icon-only action control.
 *
 * Never use when the icon meaning is ambiguous — prefer Button (001) with a label.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      size = "md",
      variant = "neutral",
      label,
      tooltip,
      icon,
      children,
      loading = false,
      loadingLabel,
      selected = false,
      disabled = false,
      type = "button",
      className,
      onClick,
      ...rest
    },
    ref
  ) {
    const isDisabled = disabled || loading;
    const graphic = icon ?? children;
    const title =
      tooltip === false ? undefined : tooltip === undefined ? label : tooltip;
    const accessibleName = loading
      ? (loadingLabel ?? `${label}, Loading`)
      : label;

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        className={cx(
          "dk-icon-button",
          SIZE_CLASS[size],
          VARIANT_CLASS[variant],
          loading && "dk-icon-button--loading",
          selected && "dk-icon-button--selected",
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        aria-label={accessibleName}
        aria-pressed={selected || undefined}
        title={title}
        data-size={size}
        data-variant={variant}
        data-loading={loading || undefined}
        data-selected={selected || undefined}
        onClick={isDisabled ? undefined : onClick}
      >
        <span className="dk-icon-button__hit" aria-hidden="true" />

        <span
          className="dk-icon-button__glyph"
          data-hidden={loading || undefined}
          aria-hidden="true"
        >
          {graphic}
        </span>

        {loading ? (
          <span className="dk-icon-button__loader" aria-hidden="true">
            <span className="dk-icon-button__spinner" />
          </span>
        ) : null}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
