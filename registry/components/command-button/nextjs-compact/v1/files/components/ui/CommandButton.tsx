import * as React from "react";

export type CommandButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export type CommandButtonVariant = "subtle" | "outline" | "quiet" | "destructive";

export type CommandButtonStatus = "none" | "info" | "success" | "warning" | "error";

export interface CommandButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Primary command label (required). */
  label: string;
  /** Secondary contextual description — kept visually quiet. */
  description?: string;
  /** Leading command / category icon. */
  leadingIcon?: React.ReactNode;
  /**
   * Keyboard shortcut hint shown on desktop / fine pointer.
   * Hidden on narrow / coarse touch viewports. Announced via `aria-keyshortcuts` when possible.
   */
  shortcut?: string | string[];
  /** Trailing affordance (chevron, enter glyph, submenu indicator). */
  trailingAffordance?: React.ReactNode;
  /** Status indicator beside the label row. Default: none. */
  status?: CommandButtonStatus;
  /** Accessible label for the status indicator when present. */
  statusLabel?: string;
  size?: CommandButtonSize;
  variant?: CommandButtonVariant;
  /** Selected / active command in a palette or menu. Sets `aria-selected` when role is option/menuitem. */
  selected?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
  /**
   * Semantic role for palette / menu integration.
   * Default: `button`. Use `option` or `menuitem` inside listboxes / menus.
   */
  role?: "button" | "option" | "menuitem";
  /** Stable command id for hosts (command palettes). */
  commandId?: string;
}

const SIZE_CLASS: Record<CommandButtonSize, string> = {
  xs: "dk-cmd--xs",
  sm: "dk-cmd--sm",
  md: "dk-cmd--md",
  lg: "dk-cmd--lg",
  xl: "dk-cmd--xl",
};

const VARIANT_CLASS: Record<CommandButtonVariant, string> = {
  subtle: "dk-cmd--subtle",
  outline: "dk-cmd--outline",
  quiet: "dk-cmd--quiet",
  destructive: "dk-cmd--destructive",
};

const STATUS_CLASS: Record<Exclude<CommandButtonStatus, "none">, string> = {
  info: "dk-cmd__status--info",
  success: "dk-cmd__status--success",
  warning: "dk-cmd__status--warning",
  error: "dk-cmd__status--error",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function normalizeShortcut(shortcut?: string | string[]): string[] {
  if (!shortcut) return [];
  return (Array.isArray(shortcut) ? shortcut : [shortcut])
    .map((part) => String(part).trim())
    .filter(Boolean);
}

/**
 * Command Button (ID 009) — workflow action with optional description, shortcut, and status.
 *
 * Designed for command palettes and command menus. Keyboard is first-class; shortcut
 * chrome is desktop-oriented and hidden on mobile.
 */
export const CommandButton = React.forwardRef<HTMLButtonElement, CommandButtonProps>(
  function CommandButton(
    {
      label,
      description,
      leadingIcon,
      shortcut,
      trailingAffordance,
      status = "none",
      statusLabel,
      size = "md",
      variant = "subtle",
      selected = false,
      loading = false,
      loadingLabel,
      fullWidth = false,
      disabled = false,
      type = "button",
      role = "button",
      commandId,
      className,
      onClick,
      onKeyDown,
      "aria-label": ariaLabel,
      ...rest
    },
    ref
  ) {
    const isDisabled = disabled || loading;
    const keys = normalizeShortcut(shortcut);
    const ariaShortcut = keys.length ? keys.join(" ") : undefined;

    const accessibleName =
      loading
        ? (loadingLabel ?? `${label}, Loading`)
        : ariaLabel ??
          (description ? `${label}. ${description}` : label);

    const showStatus = status !== "none";

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        role={role === "button" ? undefined : role}
        className={cx(
          "dk-cmd",
          SIZE_CLASS[size],
          VARIANT_CLASS[variant],
          loading && "dk-cmd--loading",
          selected && "dk-cmd--selected",
          fullWidth && "dk-cmd--full",
          description && "dk-cmd--described",
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        aria-label={accessibleName}
        aria-keyshortcuts={ariaShortcut}
        aria-selected={
          role === "option" || role === "menuitem" ? selected : undefined
        }
        aria-pressed={role === "button" && selected ? true : undefined}
        data-size={size}
        data-variant={variant}
        data-selected={selected || undefined}
        data-loading={loading || undefined}
        data-command-id={commandId || undefined}
        data-status={showStatus ? status : undefined}
        onClick={isDisabled ? undefined : onClick}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || isDisabled) return;
          // Space/Enter activate natively for button; ensure option/menuitem do too
          if (
            (role === "option" || role === "menuitem") &&
            (event.key === "Enter" || event.key === " ")
          ) {
            event.preventDefault();
            event.currentTarget.click();
          }
        }}
      >
        <span className="dk-cmd__hit" aria-hidden="true" />

        <span
          className="dk-cmd__body"
          data-hidden={loading || undefined}
          aria-hidden={loading || undefined}
        >
          {leadingIcon ? (
            <span className="dk-cmd__icon" aria-hidden="true">
              {leadingIcon}
            </span>
          ) : null}

          <span className="dk-cmd__text">
            <span className="dk-cmd__title-row">
              <span className="dk-cmd__label">{label}</span>
              {showStatus ? (
                <span
                  className={cx("dk-cmd__status", STATUS_CLASS[status])}
                  role="img"
                  aria-label={statusLabel ?? status}
                />
              ) : null}
            </span>
            {description ? (
              <span className="dk-cmd__description">{description}</span>
            ) : null}
          </span>

          {keys.length > 0 ? (
            <span className="dk-cmd__shortcut" aria-hidden="true">
              {keys.map((key) => (
                <kbd key={key} className="dk-cmd__kbd">
                  {key}
                </kbd>
              ))}
            </span>
          ) : null}

          {trailingAffordance ? (
            <span className="dk-cmd__trailing" aria-hidden="true">
              {trailingAffordance}
            </span>
          ) : null}
        </span>

        {loading ? (
          <span className="dk-cmd__loader" aria-hidden="true">
            <span className="dk-cmd__spinner" />
          </span>
        ) : null}
      </button>
    );
  }
);

CommandButton.displayName = "CommandButton";

export default CommandButton;
