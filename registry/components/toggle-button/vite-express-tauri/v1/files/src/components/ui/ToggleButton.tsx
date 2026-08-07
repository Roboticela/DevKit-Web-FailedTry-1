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
  /**
   * - `icon` — icon-only (`label` is accessible name)
   * - `text` — text only
   * - `icon-text` — icon + text
   */
  appearance?: ToggleButtonAppearance;
  variant?: ToggleButtonVariant;
  /** Accessible name always; visible unless `appearance="icon"`. */
  label: string;
  /** Optional visible label while pressed. */
  pressedLabel?: string;
  icon?: React.ReactNode;
  /** Optional icon while pressed (semantic icon change). */
  pressedIcon?: React.ReactNode;
  /** Controlled pressed/selected state. */
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /**
   * Leading selection checkmark when pressed.
   * Default: off for icon-only (prefer `pressedIcon`); on for text modes.
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

function resolveAppearance(
  appearance: ToggleButtonAppearance | undefined,
  hasIcon: boolean
): ToggleButtonAppearance {
  if (appearance) return appearance;
  return hasIcon ? "icon-text" : "text";
}

/**
 * Toggle Button (ID 007) — binary / stateful action control.
 *
 * Prefer Switch for preference on/off. Do not use for navigation.
 * Selected state uses surface, stronger border, indicator, and optional icon/text changes — not color alone.
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

    const appearance = resolveAppearance(appearanceProp, Boolean(icon));
    const showIndicator = showIndicatorProp ?? appearance !== "icon";
    const visibleLabel = pressed && pressedLabel ? pressedLabel : label;
    const visibleIcon = pressed && pressedIcon ? pressedIcon : icon;

    const setPressed = (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onPressedChange?.(next);
    };

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        className={cx(
          "dk-toggle-button",
          SIZE_CLASS[size],
          APPEARANCE_CLASS[appearance],
          VARIANT_CLASS[variant],
          pressed && "dk-toggle-button--pressed",
          className
        )}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        aria-pressed={pressed}
        aria-label={appearance === "icon" ? label : undefined}
        title={appearance === "icon" ? (title ?? label) : title}
        data-size={size}
        data-appearance={appearance}
        data-variant={variant}
        data-pressed={pressed || undefined}
        onClick={(event) => {
          if (disabled) return;
          setPressed(!pressed);
          onClick?.(event);
        }}
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

          {appearance !== "text" && visibleIcon ? (
            <span className="dk-toggle-button__icon" aria-hidden="true">
              {visibleIcon}
            </span>
          ) : null}

          {appearance !== "icon" ? (
            <span className="dk-toggle-button__label">{visibleLabel}</span>
          ) : null}
        </span>
      </button>
    );
  }
);

ToggleButton.displayName = "ToggleButton";

export default ToggleButton;
