import * as React from "react";

/**
 * Split Button (ID 093) — Action & Control Compositions.
 * Primary action executes immediately; menu region opens related alternatives.
 * Compose DevKit Button styles + Dropdown Menu / Menu primitives.
 * Do not implement the menu inside this component — pass it via `menu`.
 * Regions are independently disableable and separately focusable.
 */

export type ActionSplitButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ActionSplitButtonVariant =
  | "primary"
  | "secondary"
  | "destructive";

export type ActionSplitMenuTriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label"
> & {
  /** Required accessible name — distinct from the primary action. */
  label: string;
  size?: ActionSplitButtonSize;
  variant?: ActionSplitButtonVariant;
  /** Reflect menu open state for assistive tech when not set by a menu primitive. */
  expanded?: boolean;
  icon?: React.ReactNode;
};

export type ActionSplitButtonProps = {
  /** Primary action label / content. */
  children: React.ReactNode;
  /**
   * Menu region — compose Dropdown Menu (or Action Menu Trigger) wrapping
   * `ActionSplitMenuTrigger`. The menu surface is not implemented here.
   */
  menu: React.ReactNode;
  size?: ActionSplitButtonSize;
  variant?: ActionSplitButtonVariant;
  leadingIcon?: React.ReactNode;
  onPrimaryClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Accessible name for the primary control when `children` is not plain text.
   */
  primaryLabel?: string;
  loading?: boolean;
  loadingLabel?: string;
  /** Disables both regions. Prefer per-region props when states differ. */
  disabled?: boolean;
  /** Disables only the primary action — menu may stay available. */
  primaryDisabled?: boolean;
  /** Disables only the menu region — primary may stay available. */
  menuDisabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  /** Accessible name for the split cluster. */
  "aria-label"?: string;
};

const SIZE_CLASS: Record<ActionSplitButtonSize, string> = {
  xs: "dk-button--xs",
  sm: "dk-button--sm",
  md: "dk-button--md",
  lg: "dk-button--lg",
  xl: "dk-button--xl",
};

const VARIANT_CLASS: Record<ActionSplitButtonVariant, string> = {
  primary: "dk-button--primary",
  secondary: "dk-button--secondary",
  destructive: "dk-button--destructive",
};

const TRIGGER_SIZE_CLASS: Record<ActionSplitButtonSize, string> = {
  xs: "dk-action-split__trigger--xs",
  sm: "dk-action-split__trigger--sm",
  md: "dk-action-split__trigger--md",
  lg: "dk-action-split__trigger--lg",
  xl: "dk-action-split__trigger--xl",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M5.5 7.75 10 12.25l4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Menu-trigger region for Split Button.
 * Pass as the child of Dropdown Menu (or similar). Communicates that more actions exist.
 * Hit area meets the global minimum touch target.
 */
export const ActionSplitMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  ActionSplitMenuTriggerProps
>(function ActionSplitMenuTrigger(
  {
    label,
    size = "md",
    variant = "primary",
    expanded,
    icon,
    disabled = false,
    type = "button",
    className = "",
    ...rest
  },
  forwardedRef
) {
  return (
    <button
      {...rest}
      ref={forwardedRef}
      type={type}
      className={cx(
        "dk-action-split__trigger",
        TRIGGER_SIZE_CLASS[size],
        `dk-action-split__trigger--${variant}`,
        SIZE_CLASS[size],
        VARIANT_CLASS[variant],
        "dk-button",
        className
      )}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-label={label}
      aria-haspopup={"aria-haspopup" in rest ? rest["aria-haspopup"] : "menu"}
      aria-expanded={
        expanded ??
        ("aria-expanded" in rest
          ? (rest["aria-expanded"] as boolean | undefined)
          : undefined)
      }
      data-size={size}
      data-variant={variant}
      title={label}
    >
      <span className="dk-action-split__trigger-hit" aria-hidden="true" />
      <span className="dk-action-split__trigger-glyph" aria-hidden="true">
        {icon ?? <ChevronDownIcon />}
      </span>
    </button>
  );
});

ActionSplitMenuTrigger.displayName = "ActionSplitMenuTrigger";

export const ActionSplitButton = React.forwardRef<
  HTMLDivElement,
  ActionSplitButtonProps
>(function ActionSplitButton(
  {
    children,
    menu,
    size = "md",
    variant = "primary",
    leadingIcon,
    onPrimaryClick,
    primaryLabel,
    loading = false,
    loadingLabel,
    disabled = false,
    primaryDisabled = false,
    menuDisabled = false,
    fullWidth = false,
    type = "button",
    className = "",
    id,
    style,
    "aria-label": ariaLabel,
  },
  forwardedRef
) {
  const primaryIsDisabled = disabled || primaryDisabled || loading;
  const menuRegionDisabled = disabled || menuDisabled;

  const accessiblePrimary =
    primaryLabel ??
    (typeof children === "string" || typeof children === "number"
      ? String(children)
      : "Primary action");

  const accessibleLoading =
    loadingLabel ?? `${accessiblePrimary}, Loading`;

  const menuNode = React.useMemo(() => {
    if (!React.isValidElement(menu)) return menu;
    // Soft-disable menu host when menuDisabled — host primitives may honor `disabled`
    if (menuRegionDisabled) {
      return React.cloneElement(
        menu as React.ReactElement<{ disabled?: boolean }>,
        { disabled: true }
      );
    }
    return menu;
  }, [menu, menuRegionDisabled]);

  return (
    <div
      ref={forwardedRef}
      id={id}
      role="group"
      aria-label={ariaLabel ?? accessiblePrimary}
      className={cx(
        "dk-action-split",
        `dk-action-split--${size}`,
        `dk-action-split--${variant}`,
        fullWidth && "dk-action-split--full",
        loading && "dk-action-split--loading",
        className
      )}
      style={style}
      data-size={size}
      data-variant={variant}
      data-primary-disabled={primaryIsDisabled || undefined}
      data-menu-disabled={menuRegionDisabled || undefined}
    >
      <button
        type={type}
        className={cx(
          "dk-button",
          SIZE_CLASS[size],
          VARIANT_CLASS[variant],
          "dk-action-split__primary",
          loading && "dk-button--loading",
          fullWidth && "dk-button--full"
        )}
        disabled={primaryIsDisabled}
        aria-disabled={primaryIsDisabled || undefined}
        aria-busy={loading || undefined}
        aria-label={loading ? accessibleLoading : undefined}
        data-size={size}
        data-variant={variant}
        data-loading={loading || undefined}
        onClick={primaryIsDisabled ? undefined : onPrimaryClick}
      >
        <span className="dk-button__hit" aria-hidden="true" />
        <span
          className="dk-button__content"
          data-hidden={loading || undefined}
          aria-hidden={loading || undefined}
        >
          {leadingIcon ? (
            <span
              className="dk-button__icon dk-button__icon--leading"
              aria-hidden="true"
            >
              {leadingIcon}
            </span>
          ) : null}
          <span className="dk-button__label">{children}</span>
        </span>
        {loading ? (
          <span className="dk-button__loader" aria-hidden="true">
            <span className="dk-button__spinner" />
          </span>
        ) : null}
      </button>

      <div
        className={cx(
          "dk-action-split__menu",
          menuRegionDisabled && "dk-action-split__menu--disabled"
        )}
      >
        {menuNode}
      </div>
    </div>
  );
});

ActionSplitButton.displayName = "ActionSplitButton";

/** Catalog alias */
export const SplitButton = ActionSplitButton;

export default ActionSplitButton;
