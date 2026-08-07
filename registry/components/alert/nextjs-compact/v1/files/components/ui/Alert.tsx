import * as React from "react";

export type AlertVariant =
  | "informational"
  | "success"
  | "warning"
  | "error"
  | "neutral";

export type AlertDensity = "standard" | "compact";

/**
 * Live-region urgency. Defaults are chosen per variant:
 * - `error` → assertive (`role="alert"`)
 * - others → polite (`role="status"`)
 * Use `off` for purely static persistent conditions that should not re-announce.
 */
export type AlertLive = "polite" | "assertive" | "off";

export interface AlertAction {
  id?: string;
  label: string;
  /** Real link when navigating. Prefer over button for document destinations. */
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Visual emphasis within the alert action row. Default: `secondary`. */
  emphasis?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  external?: boolean;
}

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "children"> {
  /** Semantic tone. Communicated via icon + text + surface — not color alone. */
  variant?: AlertVariant;
  /** Optional heading. Short alerts may omit this and use only a message. */
  title?: React.ReactNode;
  /** Message body. Required for a meaningful alert. */
  children: React.ReactNode;
  /**
   * Leading status icon.
   * - omit → default semantic icon for the variant
   * - `false` → hide icon (ensure text still conveys status)
   * - node → custom meaningful icon
   */
  icon?: React.ReactNode | false;
  /** Density. Default: `standard`. */
  density?: AlertDensity;
  /**
   * Show a dismiss control. Only enable when dismissal is appropriate —
   * not for persistent conditions that dismissal would falsely “resolve”.
   */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Accessible name for the dismiss control. */
  dismissLabel?: string;
  /**
   * Structured actions, clearly separated from the alert body.
   * Prefer this or the `actions` slot — not both for the same controls.
   */
  actions?: AlertAction[];
  /** Free-form action slot (e.g. composed Buttons / Links). */
  actionSlot?: React.ReactNode;
  /** Override live-region behavior. */
  live?: AlertLive;
}

const VARIANT_CLASS: Record<AlertVariant, string> = {
  informational: "dk-alert--informational",
  success: "dk-alert--success",
  warning: "dk-alert--warning",
  error: "dk-alert--error",
  neutral: "dk-alert--neutral",
};

const DENSITY_CLASS: Record<AlertDensity, string> = {
  standard: "dk-alert--standard",
  compact: "dk-alert--compact",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 9v4.5M10 6.75h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m6.75 10.25 2.25 2.25 4.25-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M9.13 3.66 2.6 15.1a1 1 0 0 0 .87 1.5h13.06a1 1 0 0 0 .87-1.5L10.87 3.66a1 1 0 0 0-1.74 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 8v3.5M10 13.75h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m7.5 7.5 5 5M12.5 7.5l-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NeutralIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.75 10h6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DismissIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m4 4 8 8M12 4 4 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const DEFAULT_ICONS: Record<AlertVariant, React.ReactNode> = {
  informational: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
  neutral: <NeutralIcon />,
};

const DEFAULT_STATUS_LABEL: Record<AlertVariant, string> = {
  informational: "Information",
  success: "Success",
  warning: "Warning",
  error: "Error",
  neutral: "Notice",
};

function resolveLive(
  variant: AlertVariant,
  live: AlertLive | undefined
): { role: "alert" | "status" | undefined; live: "polite" | "assertive" | "off" } {
  if (live === "off") return { role: undefined, live: "off" };
  if (live === "assertive") return { role: "alert", live: "assertive" };
  if (live === "polite") return { role: "status", live: "polite" };
  if (variant === "error") return { role: "alert", live: "assertive" };
  return { role: "status", live: "polite" };
}

/**
 * Alert (ID 041) — persistent contextual feedback within the current UI context.
 *
 * Not a toast. Dismissal is opt-in only when appropriate for the condition.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(
    {
      variant = "informational",
      title,
      children,
      icon,
      density = "standard",
      dismissible = false,
      onDismiss,
      dismissLabel = "Dismiss",
      actions,
      actionSlot,
      live,
      className,
      id: idProp,
      role: roleProp,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-alert-${reactId}`;
    const titleId = title != null ? `${rootId}-title` : undefined;
    const bodyId = `${rootId}-body`;

    const liveResolved = resolveLive(variant, live);
    const showIcon = icon !== false;
    const iconNode = icon === false ? null : icon ?? DEFAULT_ICONS[variant];
    const hasActions =
      (actions != null && actions.length > 0) || actionSlot != null;

    return (
      <div
        {...rest}
        ref={ref}
        id={rootId}
        className={cx(
          "dk-alert",
          VARIANT_CLASS[variant],
          DENSITY_CLASS[density],
          dismissible && "dk-alert--dismissible",
          hasActions && "dk-alert--has-actions",
          !title && "dk-alert--message-only",
          className
        )}
        role={roleProp ?? liveResolved.role}
        aria-live={
          roleProp != null
            ? undefined
            : liveResolved.live === "off"
              ? "off"
              : liveResolved.live
        }
        aria-atomic={liveResolved.live === "off" ? undefined : true}
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        data-variant={variant}
        data-density={density}
        data-dismissible={dismissible || undefined}
      >
        {showIcon ? (
          <span className="dk-alert__icon" aria-hidden="true">
            {iconNode}
          </span>
        ) : null}

        <span className="dk-sr-only">{DEFAULT_STATUS_LABEL[variant]}</span>

        <div className="dk-alert__body">
          {title != null && title !== false ? (
            <div className="dk-alert__title" id={titleId}>
              {title}
            </div>
          ) : null}
          <div className="dk-alert__message" id={bodyId}>
            {children}
          </div>

          {hasActions ? (
            <div className="dk-alert__actions">
              {actions?.map((action, index) => {
                const key = action.id ?? `${rootId}-action-${index}`;
                const classNameAction = cx(
                  "dk-alert__action",
                  `dk-alert__action--${action.emphasis ?? "secondary"}`
                );
                if (action.href) {
                  return (
                    <a
                      key={key}
                      className={classNameAction}
                      href={action.href}
                      target={action.external ? "_blank" : undefined}
                      rel={
                        action.external ? "noopener noreferrer" : undefined
                      }
                      aria-disabled={action.disabled || undefined}
                      onClick={(event) => {
                        if (action.disabled) {
                          event.preventDefault();
                          return;
                        }
                        action.onClick?.(event);
                      }}
                    >
                      {action.label}
                    </a>
                  );
                }
                return (
                  <button
                    key={key}
                    type="button"
                    className={classNameAction}
                    disabled={action.disabled}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </button>
                );
              })}
              {actionSlot}
            </div>
          ) : null}
        </div>

        {dismissible ? (
          <button
            type="button"
            className="dk-alert__dismiss"
            aria-label={dismissLabel}
            onClick={() => onDismiss?.()}
          >
            <span className="dk-alert__dismiss-hit" aria-hidden="true" />
            <DismissIcon />
          </button>
        ) : null}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export default Alert;
