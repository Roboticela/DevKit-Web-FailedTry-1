import * as React from "react";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive"
  | "success"
  | "quiet"
  | "inverse";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Control height. Default: `md` (40px). */
  size?: ButtonSize;
  /** Visual hierarchy. Default: `primary`. */
  variant?: ButtonVariant;
  /** Leading action/category icon (18–20px recommended). */
  leadingIcon?: React.ReactNode;
  /** Trailing navigation/expansion icon. */
  trailingIcon?: React.ReactNode;
  /** Shows a loading indicator and disables interaction. Preserves dimensions. */
  loading?: boolean;
  /** Accessible name announced while loading. Defaults to label + “Loading”. */
  loadingLabel?: string;
  /** Stretch to container width. */
  fullWidth?: boolean;
  /**
   * Visible label. Required — icon-only actions belong on Icon Button (002).
   * Do not pass icon-only children.
   */
  children: React.ReactNode;
}

const SIZE_CLASS: Record<ButtonSize, string> = {
  xs: "dk-button--xs",
  sm: "dk-button--sm",
  md: "dk-button--md",
  lg: "dk-button--lg",
  xl: "dk-button--xl",
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "dk-button--primary",
  secondary: "dk-button--secondary",
  tertiary: "dk-button--tertiary",
  destructive: "dk-button--destructive",
  success: "dk-button--success",
  quiet: "dk-button--quiet",
  inverse: "dk-button--inverse",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Button (ID 001) — foundational generic action control.
 *
 * Use Icon Button (002) for icon-only actions. This component always requires a text label.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      size = "md",
      variant = "primary",
      leadingIcon,
      trailingIcon,
      loading = false,
      loadingLabel,
      fullWidth = false,
      disabled = false,
      type = "button",
      className,
      children,
      onClick,
      "aria-label": ariaLabel,
      ...rest
    },
    ref
  ) {
    const isDisabled = disabled || loading;

    const accessibleLoadingLabel =
      loadingLabel ??
      (typeof children === "string" || typeof children === "number"
        ? `${children}, Loading`
        : "Loading");

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        className={cx(
          "dk-button",
          SIZE_CLASS[size],
          VARIANT_CLASS[variant],
          loading && "dk-button--loading",
          fullWidth && "dk-button--full",
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        aria-label={loading ? accessibleLoadingLabel : ariaLabel}
        data-size={size}
        data-variant={variant}
        data-loading={loading || undefined}
        onClick={isDisabled ? undefined : onClick}
      >
        <span className="dk-button__hit" aria-hidden="true" />

        <span
          className="dk-button__content"
          data-hidden={loading || undefined}
          aria-hidden={loading || undefined}
        >
          {leadingIcon ? (
            <span className="dk-button__icon dk-button__icon--leading" aria-hidden="true">
              {leadingIcon}
            </span>
          ) : null}

          <span className="dk-button__label">{children}</span>

          {trailingIcon ? (
            <span className="dk-button__icon dk-button__icon--trailing" aria-hidden="true">
              {trailingIcon}
            </span>
          ) : null}
        </span>

        {loading ? (
          <span className="dk-button__loader" aria-hidden="true">
            <span className="dk-button__spinner" />
          </span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
