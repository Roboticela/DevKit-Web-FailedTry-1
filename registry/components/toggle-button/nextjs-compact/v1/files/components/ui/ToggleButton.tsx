import * as React from "react";

export type ToggleButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ToggleButtonAppearance = "icon" | "text" | "icon-text";

export type ToggleButtonVariant = "outline" | "subtle" | "filled";

export interface ToggleButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "onChange" | "aria-pressed"
  > {
  size?: ToggleButtonSize;
  /** Content layout. Default: `icon-text` when both icon and label exist. */
  appearance?: ToggleButtonAppearance;
  variant?: ToggleButtonVariant;
  /**
   * Accessible + visible label when not icon-only.
   * For icon-only, this is the accessible name (and default tooltip).
   */
  label: string;
  /** Optional label while pressed/selected. */
  pressedLabel?: string;
  icon?: React.ReactNode;
  /** Optional icon while pressed/selected (semantic icon change). */
  pressedIcon?: React.ReactNode;
  /** Controlled pressed state. */
  pressed?: boolean;
  /** Uncontrolled initial state. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /**
   * Shows a leading selection checkmark when pressed (non-color cue).
   * Default: true for text / icon-text; false for icon-only (prefer icon swap).
   */
  showIndicator?: boolean;
}

const SIZE_CLASS: Record<ToggleButtonSize, string> = {
  xs: "dk-toggle-button--xs",
  sm: "dk-toggle-button--sm",
  md: "dk-toggle-button--md",
  lg: "dk-toggle-button--lg",
  xl: "dk-toggle-button--xl",
};

const APPEARANCE_CLASS: Record<ToggleButtonAppearance, string> = {
  icon: "dk-toggle-button--icon",
  text: "dk-toggle-button--text",
  "icon-text": "dk-toggle-button--icon-text",
};

const VARIANT_CLASS: Record<ToggleButtonVariant, string> = {
  outline: "dk-toggle-button--outline",
  subtle: "dk-toggle-button--subtle",
  filled: "dk-toggle-button--filled",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.25 6.4 11.2 12.5 4.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Toggle Button (ID 007) — binary / stateful action control.
 *
 * Use Switch for settings on/off preferences. Do not use for navigation.
 * Selected state is conveyed with surface, border, indicator, and optional icon/text changes — not color alone.
 */
export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ToggleButton(
    {
      size = "md",
      appearance: appearanceProp,
      variant = "outline",
      label,
      pressedLabel,
      icon,
      pressedIcon,
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      showIndicator: showIndicatorProp,
      disabled = false,
      type = "button",
      className,
      onClick,
      title,
      ...rest
    },
    ref
  ) {
    const isControlled = pressedProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(defaultPressed);
    const pressed = isControlled ? Boolean(pressedProp) : uncontrolled;

    const appearance: ToggleButtonAppearance =
      appearanceProp ??
      (icon && !pressedLabel && !label
        ? "icon"
        : icon
          ? "icon-text"
          : "text");

    // Resolve: icon-only always needs label for a11y; text modes show label
    const resolvedAppearance: ToggleButtonAppearance =
      appearanceProp ?? (icon ? (appearanceProp === "text" ? "text" : "icon-text") : "text");

    const finalAppearance = appearanceProp
      ? appearanceProp
      : icon
        ? "icon-text"
        : "text";

    // If caller set appearance icon, use icon-only
    const mode = appearanceProp ?? (icon ? "icon-text" : "text");
    const useMode = mode === "icon" && !icon ? "text" : mode;

    const showIndicator =
      showIndicatorProp ?? (useMode === "icon" ? false : true);

    const visibleLabel = pressed && pressedLabel ? pressedLabel : label;
    const visibleIcon = pressed && pressedIcon ? pressedIcon : icon;

    const setPressed = (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onPressedChange?.(next);
    };

    const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      setPressed(!pressed);
      onClick?.(event);
    };

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        className={cx(
          "dk-toggle-button",
          SIZE_CLASS[size],
          APPEARANCE_CLASS[useMode],
          VARIANT_CLASS[variant],
          pressed && "dk-toggle-button--pressed",
          className
        )}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        aria-pressed={pressed}
        aria-label={useMode === "icon" ? label : undefined}
        title={useMode === "icon" ? (title ?? label) : title}
        data-size={size}
        data-appearance={useMode}
        data-variant={variant}
        data-pressed={pressed || undefined}
        onClick={toggle}
      >
        <span className="dk-toggle-button__hit" aria-hidden="true" />

        <span className="dk-toggle-button__content">
          {showIndicator ? (
            <span
              className="dk-toggle-button__indicator"
              data-on={pressed || undefined}
              aria-hidden="true"
            >
              <CheckIcon />
            </span>
          ) : null}

          {useMode !== "text" && visibleIcon ? (
            <span className="dk-toggle-button__icon" aria-hidden="true">
              {visibleIcon}
            </span>
          ) : null}

          {useMode !== "icon" ? (
            <span className="dk-toggle-button__label">{visibleLabel}</span>
          ) : null}
        </span>
      </button>
    );
  }
);

ToggleButton.displayName = "ToggleButton";

export default ToggleButton;
