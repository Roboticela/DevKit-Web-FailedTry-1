import * as React from "react";

export type NotificationDensity = "compact" | "comfortable";

/** Optional semantic tint for the leading mark — not a full alert surface. */
export type NotificationTone =
  | "neutral"
  | "informational"
  | "positive"
  | "warning"
  | "negative";

/**
 * Timestamp presentation:
 * - `relative` — “5 minutes ago”
 * - `absolute` — localized date/time
 * - `auto` — relative under ~7 days, otherwise absolute
 */
export type NotificationTimestampFormat = "relative" | "absolute" | "auto";

export interface NotificationAction {
  id?: string;
  label: string;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  emphasis?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  external?: boolean;
}

export interface NotificationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "children"> {
  /** Primary headline for the event. */
  title: React.ReactNode;
  /** Supporting detail. */
  description?: React.ReactNode;
  /**
   * Event time. Accepts `Date`, epoch ms, or ISO/localized string.
   * Prefer a `Date` / number so relative formatting can work.
   */
  timestamp?: Date | number | string;
  timestampFormat?: NotificationTimestampFormat;
  /** BCP 47 locale for time formatting. Defaults to runtime locale. */
  locale?: string;
  /** Unread vs read — reinforced beyond background color. Default: false (read). */
  unread?: boolean;
  /** Leading icon (category / event type). */
  icon?: React.ReactNode;
  /** Leading avatar (actor). Takes precedence visually when both are set beside icon slot. */
  avatar?: React.ReactNode;
  /** Optional trailing / below thumbnail (preview image). */
  thumbnail?: React.ReactNode;
  density?: NotificationDensity;
  tone?: NotificationTone;
  /**
   * Independent actions. Rendered as separate controls — the row is not
   * made wholesale clickable when actions are present.
   */
  actions?: NotificationAction[];
  /** Convenience primary action (merged ahead of `actions`). */
  primaryAction?: NotificationAction;
  /** Convenience secondary action. */
  secondaryAction?: NotificationAction;
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
  /**
   * Opt-in truncation for description. Full text remains available via
   * `title` tooltip and remains in the accessibility tree unless overridden.
   */
  truncateDescription?: boolean;
  /**
   * Optional destination for the title only (not the whole item).
   * Prefer this over wrapping the entire notification when multiple actions exist.
   */
  titleHref?: string;
  onTitleClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const DENSITY_CLASS: Record<NotificationDensity, string> = {
  compact: "dk-notification--compact",
  comfortable: "dk-notification--comfortable",
};

const TONE_CLASS: Record<NotificationTone, string> = {
  neutral: "dk-notification--neutral",
  informational: "dk-notification--informational",
  positive: "dk-notification--positive",
  warning: "dk-notification--warning",
  negative: "dk-notification--negative",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toDate(value: Date | number | string): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatAbsolute(date: Date, locale?: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

function formatRelative(date: Date, locale?: string, now = Date.now()): string {
  const diffSec = Math.round((date.getTime() - now) / 1000);
  const abs = Math.abs(diffSec);
  const rtf =
    typeof Intl !== "undefined" && typeof Intl.RelativeTimeFormat === "function"
      ? new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
      : null;

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  for (const [unit, seconds] of units) {
    if (abs >= seconds || unit === "second") {
      const value = Math.round(diffSec / seconds);
      if (rtf) return rtf.format(value, unit);
      const label = `${Math.abs(value)} ${unit}${Math.abs(value) === 1 ? "" : "s"}`;
      return value <= 0 ? `${label} ago` : `in ${label}`;
    }
  }
  return formatAbsolute(date, locale);
}

/**
 * Format a notification timestamp for display.
 * Exported for hosts that want the same rules outside the component.
 */
export function formatNotificationTimestamp(
  value: Date | number | string,
  options: {
    format?: NotificationTimestampFormat;
    locale?: string;
    now?: number;
  } = {}
): { display: string; absolute: string; date: Date } | null {
  const date = toDate(value);
  if (!date) {
    if (typeof value === "string") {
      return { display: value, absolute: value, date: new Date(NaN) };
    }
    return null;
  }
  const absolute = formatAbsolute(date, options.locale);
  const format = options.format ?? "auto";
  const ageMs = Math.abs((options.now ?? Date.now()) - date.getTime());
  const useRelative =
    format === "relative" ||
    (format === "auto" && ageMs < 7 * 24 * 60 * 60 * 1000);

  return {
    date,
    absolute,
    display: useRelative
      ? formatRelative(date, options.locale, options.now)
      : absolute,
  };
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

function mergeActions(
  primary?: NotificationAction,
  secondary?: NotificationAction,
  actions?: NotificationAction[]
): NotificationAction[] {
  const list: NotificationAction[] = [];
  if (primary) list.push({ emphasis: "primary", ...primary });
  if (secondary) list.push({ emphasis: "secondary", ...secondary });
  if (actions?.length) list.push(...actions);
  return list;
}

/**
 * Notification (ID 044) — reusable user-event item.
 *
 * Not a notification center. Keep independent actions as separate controls;
 * do not make the entire surface a single hit target when multiple actions exist.
 */
export const Notification = React.forwardRef<HTMLElement, NotificationProps>(
  function Notification(
    {
      title,
      description,
      timestamp,
      timestampFormat = "auto",
      locale,
      unread = false,
      icon,
      avatar,
      thumbnail,
      density = "comfortable",
      tone = "neutral",
      actions,
      primaryAction,
      secondaryAction,
      dismissible = false,
      onDismiss,
      dismissLabel = "Dismiss notification",
      truncateDescription = false,
      titleHref,
      onTitleClick,
      className,
      id: idProp,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-notification-${reactId}`;
    const titleId = `${rootId}-title`;
    const descId = description != null ? `${rootId}-desc` : undefined;
    const timeId = timestamp != null ? `${rootId}-time` : undefined;

    const resolvedActions = React.useMemo(
      () => mergeActions(primaryAction, secondaryAction, actions),
      [primaryAction, secondaryAction, actions]
    );

    const time = React.useMemo(() => {
      if (timestamp == null) return null;
      return formatNotificationTimestamp(timestamp, {
        format: timestampFormat,
        locale,
      });
    }, [timestamp, timestampFormat, locale]);

    const leading = avatar ?? icon;
    const descriptionText =
      typeof description === "string" ? description : undefined;

    return (
      <article
        {...rest}
        ref={ref as React.Ref<HTMLElement>}
        id={rootId}
        className={cx(
          "dk-notification",
          DENSITY_CLASS[density],
          TONE_CLASS[tone],
          unread && "dk-notification--unread",
          !unread && "dk-notification--read",
          truncateDescription && "dk-notification--truncate",
          className
        )}
        aria-labelledby={titleId}
        aria-describedby={
          [descId, timeId].filter(Boolean).join(" ") || undefined
        }
        data-density={density}
        data-tone={tone}
        data-unread={unread || undefined}
        data-read={!unread || undefined}
      >
        {unread ? (
          <span className="dk-notification__unread-mark" aria-hidden="true" />
        ) : null}
        <span className="dk-sr-only">{unread ? "Unread" : "Read"}</span>

        {leading ? (
          <div className="dk-notification__leading" aria-hidden={Boolean(avatar) || undefined}>
            {avatar ? (
              <span className="dk-notification__avatar">{avatar}</span>
            ) : (
              <span className="dk-notification__icon">{icon}</span>
            )}
          </div>
        ) : null}

        <div className="dk-notification__main">
          <div className="dk-notification__header">
            {titleHref ? (
              <a
                id={titleId}
                className="dk-notification__title dk-notification__title--link"
                href={titleHref}
                onClick={onTitleClick}
              >
                {title}
              </a>
            ) : onTitleClick ? (
              <button
                type="button"
                id={titleId}
                className="dk-notification__title dk-notification__title--button"
                onClick={onTitleClick}
              >
                {title}
              </button>
            ) : (
              <h3 id={titleId} className="dk-notification__title">
                {title}
              </h3>
            )}

            {time ? (
              <time
                id={timeId}
                className="dk-notification__time"
                dateTime={
                  time.date && !Number.isNaN(time.date.getTime())
                    ? time.date.toISOString()
                    : undefined
                }
                title={time.absolute}
              >
                {time.display}
              </time>
            ) : null}
          </div>

          {description != null ? (
            <p
              id={descId}
              className="dk-notification__description"
              title={
                truncateDescription && descriptionText
                  ? descriptionText
                  : undefined
              }
            >
              {description}
            </p>
          ) : null}

          {resolvedActions.length > 0 ? (
            <div className="dk-notification__actions">
              {resolvedActions.map((action, index) => {
                const key = action.id ?? `${rootId}-action-${index}`;
                const classNameAction = cx(
                  "dk-notification__action",
                  `dk-notification__action--${action.emphasis ?? (index === 0 ? "primary" : "secondary")}`
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
            </div>
          ) : null}
        </div>

        {thumbnail ? (
          <div className="dk-notification__thumbnail" aria-hidden="true">
            {thumbnail}
          </div>
        ) : null}

        {dismissible ? (
          <button
            type="button"
            className="dk-notification__dismiss"
            aria-label={dismissLabel}
            onClick={() => onDismiss?.()}
          >
            <span className="dk-notification__dismiss-hit" aria-hidden="true" />
            <DismissIcon />
          </button>
        ) : null}
      </article>
    );
  }
);

Notification.displayName = "Notification";

export default Notification;
