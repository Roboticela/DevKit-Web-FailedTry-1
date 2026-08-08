import * as React from "react";
import {
  IconButton,
  type IconButtonSize,
  type IconButtonVariant,
} from "../../../../../../../icon-button/nextjs-compact/v1/files/components/ui/IconButton";

/**
 * Password Visibility Toggle — show/hide control for password fields.
 * Composes Icon Button only. No custom button chrome.
 * Use across login, register, reset, change-password, and security forms.
 */

export type PasswordVisibilityToggleSize = IconButtonSize;
export type PasswordVisibilityToggleVariant = IconButtonVariant;

export type PasswordVisibilityToggleProps = Omit<
  React.ComponentPropsWithoutRef<typeof IconButton>,
  "label" | "icon" | "children" | "selected" | "onClick" | "type"
> & {
  /** Whether the password is currently visible (controlled). */
  visible?: boolean;
  /** Uncontrolled initial visibility. Default: masked (`false`). */
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  size?: PasswordVisibilityToggleSize;
  variant?: PasswordVisibilityToggleVariant;
  /**
   * When true, the toggle does not change visibility (field is read-only).
   * Still announced; interaction is blocked.
   */
  readOnly?: boolean;
  disabled?: boolean;
  loading?: boolean;
  /** Accessible name while masked. Default: "Show password". */
  showLabel?: string;
  /** Accessible name while revealed. Default: "Hide password". */
  hideLabel?: string;
  /** Optional tooltip while masked. Defaults to `showLabel`. */
  showTooltip?: string | false;
  /** Optional tooltip while revealed. Defaults to `hideLabel`. */
  hideTooltip?: string | false;
  /** `aria-controls` id of the related password input. */
  controls?: string;
  /** Slot: icon while masked (reveal action). Default: Eye. */
  showIcon?: React.ReactNode;
  /** Slot: icon while revealed (mask action). Default: Eye Off. */
  hideIcon?: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Semantic Eye — reveal password. */
export function PasswordVisibilityEyeIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M2.5 10S5.5 4.75 10 4.75 17.5 10 17.5 10 14.5 15.25 10 15.25 2.5 10 2.5 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Semantic Eye Off — mask password. */
export function PasswordVisibilityEyeOffIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M3 3.5 17 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M8.2 8.35A2.25 2.25 0 0 0 11.6 11.8M5.1 5.4C3.55 6.55 2.5 8.2 2.5 10S5.5 15.25 10 15.25c1.35 0 2.55-.3 3.6-.75M8.05 4.95C8.68 4.82 9.33 4.75 10 4.75c4.5 0 7.5 5.25 7.5 5.25a12.4 12.4 0 0 1-1.55 1.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const PasswordVisibilityToggle = React.forwardRef<
  HTMLButtonElement,
  PasswordVisibilityToggleProps
>(function PasswordVisibilityToggle(
  {
    visible: visibleProp,
    defaultVisible = false,
    onVisibleChange,
    size = "sm",
    variant = "subtle",
    readOnly = false,
    disabled = false,
    loading = false,
    showLabel = "Show password",
    hideLabel = "Hide password",
    showTooltip,
    hideTooltip,
    controls,
    showIcon,
    hideIcon,
    className = "",
    id,
    onClick,
    ...rest
  },
  ref
) {
  const isControlled = visibleProp !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(defaultVisible);
  const visible = isControlled ? Boolean(visibleProp) : uncontrolled;

  const locked = disabled || loading;
  const label = visible ? hideLabel : showLabel;
  const tooltip =
    visible
      ? hideTooltip === undefined
        ? hideLabel
        : hideTooltip
      : showTooltip === undefined
        ? showLabel
        : showTooltip;
  const icon = visible
    ? (hideIcon ?? <PasswordVisibilityEyeOffIcon />)
    : (showIcon ?? <PasswordVisibilityEyeIcon />);

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || locked || readOnly) return;
    const next = !visible;
    if (!isControlled) setUncontrolled(next);
    onVisibleChange?.(next);
  };

  return (
    <IconButton
      {...rest}
      ref={ref}
      id={id}
      type="button"
      size={size}
      variant={variant}
      label={label}
      tooltip={tooltip}
      icon={icon}
      selected={visible}
      disabled={locked}
      loading={loading}
      aria-controls={controls}
      aria-readonly={readOnly || undefined}
      data-visible={visible || undefined}
      data-readonly={readOnly || undefined}
      className={cx(
        "dk-password-visibility",
        visible && "dk-password-visibility--visible",
        readOnly && "dk-password-visibility--readonly",
        className
      )}
      onClick={toggle}
    />
  );
});

PasswordVisibilityToggle.displayName = "PasswordVisibilityToggle";
export default PasswordVisibilityToggle;
