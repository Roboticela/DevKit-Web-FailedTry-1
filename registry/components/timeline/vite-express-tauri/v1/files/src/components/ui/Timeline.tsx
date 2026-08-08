import * as React from "react";
import { Icon, type IconSize } from "../../../../../../../icon/vite-express-tauri/v1/files/src/components/ui/Icon";
import { EmptyState } from "../../../../../../../empty-state/vite-express-tauri/v1/files/src/components/ui/EmptyState";

/**
 * Timeline — chronological event rail.
 * Composes Icon + Empty State. Feature packages (Security Events, audit logs)
 * must reuse this — do not fork timeline chrome.
 */

export type TimelineVariant = "stacked" | "compact";

export type TimelineOrientation = "vertical";

export type TimelineItemProps = {
  id?: string;
  /** Leading marker icon. */
  icon?: React.ReactNode;
  iconSize?: IconSize;
  /** ISO / Date / formatted string shown beside the title. */
  timestamp?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Optional status / category chip region. */
  badge?: React.ReactNode;
  /** Extra body content under description. */
  children?: React.ReactNode;
  /** Make the whole item activatable (Enter / Space / click). */
  onActivate?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  disabled?: boolean;
  className?: string;
};

export type TimelineGroupProps = {
  id?: string;
  /** Group heading (e.g. “Today”, “August 7, 2026”). */
  label: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export type TimelineProps = {
  variant?: TimelineVariant;
  orientation?: TimelineOrientation;
  /** Accessible name for the timeline list. */
  "aria-label"?: string;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  emptyActions?: React.ReactNode;
  emptySlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function DefaultMarkerIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="3.25" fill="currentColor" />
    </svg>
  );
}

function EmptyTimelineIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M6 4.5v15M6 7h8.5M6 12h11M6 17h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TimelineItem({
  id,
  icon,
  iconSize = "sm",
  timestamp,
  title,
  description,
  badge,
  children,
  onActivate,
  disabled = false,
  className = "",
}: TimelineItemProps) {
  const interactive = Boolean(onActivate) && !disabled;

  return (
    <li
      id={id}
      className={cx(
        "dk-timeline__item",
        interactive && "dk-timeline__item--interactive",
        disabled && "dk-timeline__item--disabled",
        className
      )}
      data-interactive={interactive || undefined}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      aria-disabled={disabled || undefined}
      onClick={
        interactive
          ? (event) => {
              onActivate?.(event);
            }
          : undefined
      }
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onActivate?.(event);
              }
            }
          : undefined
      }
    >
      <div className="dk-timeline__rail" aria-hidden="true">
        <span className="dk-timeline__marker">
          <Icon size={iconSize} className="dk-timeline__marker-icon">
            {icon ?? <DefaultMarkerIcon />}
          </Icon>
        </span>
        <span className="dk-timeline__line" />
      </div>
      <div className="dk-timeline__content">
        <div className="dk-timeline__header">
          <div className="dk-timeline__title-row">
            {title ? <div className="dk-timeline__title">{title}</div> : null}
            {badge}
          </div>
          {timestamp ? <div className="dk-timeline__timestamp">{timestamp}</div> : null}
        </div>
        {description ? <div className="dk-timeline__description">{description}</div> : null}
        {children ? <div className="dk-timeline__body">{children}</div> : null}
      </div>
    </li>
  );
}
TimelineItem.displayName = "Timeline.Item";

function TimelineGroup({ id, label, children, className = "" }: TimelineGroupProps) {
  return (
    <li id={id} className={cx("dk-timeline__group", className)} role="presentation">
      <div className="dk-timeline__group-label">{label}</div>
      <ol className="dk-timeline__group-list">{children}</ol>
    </li>
  );
}
TimelineGroup.displayName = "Timeline.Group";

function TimelineRoot({
  variant = "stacked",
  orientation = "vertical",
  "aria-label": ariaLabel = "Timeline",
  emptyTitle = "No events yet",
  emptyDescription = "Activity will appear here in chronological order.",
  emptyIcon,
  emptyActions,
  emptySlot,
  children,
  className = "",
  id,
}: TimelineProps) {
  const reactId = React.useId();
  const rootId = id ?? `dk-timeline-${reactId}`;
  const hasItems = React.Children.count(children) > 0;

  if (!hasItems) {
    return (
      <div
        id={rootId}
        className={cx("dk-timeline", `dk-timeline--${variant}`, className)}
        data-variant={variant}
        data-orientation={orientation}
        data-empty=""
      >
        {emptySlot ?? (
          <EmptyState
            variant={variant === "compact" ? "compact" : "stacked"}
            title={emptyTitle}
            description={emptyDescription}
            icon={emptyIcon ?? <EmptyTimelineIcon />}
            actions={emptyActions}
          />
        )}
      </div>
    );
  }

  return (
    <ol
      id={rootId}
      className={cx(
        "dk-timeline",
        `dk-timeline--${variant}`,
        `dk-timeline--${orientation}`,
        className
      )}
      data-variant={variant}
      data-orientation={orientation}
      aria-label={ariaLabel}
    >
      {children}
    </ol>
  );
}
TimelineRoot.displayName = "Timeline";

export const Timeline = Object.assign(TimelineRoot, {
  Item: TimelineItem,
  Group: TimelineGroup,
});

export default Timeline;
