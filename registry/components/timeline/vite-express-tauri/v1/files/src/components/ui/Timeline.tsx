import * as React from "react";

/**
 * Timeline — chronological / ordered event sequence.
 * Vertical is default for content-heavy descriptions.
 * Horizontal only when event content stays short.
 * State is not connector-color-only. Events are not clickable by default.
 */

export type TimelineOrientation = "vertical" | "horizontal" | "responsive";

export type TimelineItemStatus =
  | "completed"
  | "current"
  | "upcoming"
  | "warning"
  | "error"
  | "neutral";

export type TimelineProps = {
  /**
   * `responsive` — vertical on narrow screens; horizontal from tablet when content is short.
   * Prefer vertical for long descriptions.
   */
  orientation?: TimelineOrientation;
  /** Compact spacing between events. */
  compact?: boolean;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export type TimelineItemProps = {
  status?: TimelineItemStatus;
  /** Explicit marker content (number, icon, avatar, status). */
  marker?: React.ReactNode;
  /** Auto number when marker is omitted and numbering is enabled on the item. */
  index?: number;
  showIndex?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: React.ReactNode;
  /** Status mark in the content area — compose Badge / StatusIndicator. */
  statusLabel?: React.ReactNode;
  metadata?: React.ReactNode;
  icon?: React.ReactNode;
  avatar?: React.ReactNode;
  children?: React.ReactNode;
  /**
   * Opt-in interactivity. Prefer composing Button/LinkButton for actions
   * inside the item rather than making the whole event a control.
   */
  href?: string;
  onActivate?: (event: React.SyntheticEvent) => void;
  interactive?: boolean;
  className?: string;
  id?: string;
};

export type TimelineRegionProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

type TimelineContextValue = {
  orientation: TimelineOrientation;
  compact: boolean;
};

const TimelineContext = React.createContext<TimelineContextValue>({
  orientation: "vertical",
  compact: false,
});

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function displayNameOf(child: React.ReactElement): string | undefined {
  return (child.type as { displayName?: string })?.displayName;
}

function StatusGlyph({ status }: { status: TimelineItemStatus }) {
  if (status === "completed") {
    return (
      <svg viewBox="0 0 20 20" width="12" height="12" fill="none" aria-hidden="true">
        <path
          d="M5 10.5l3 3 7-7"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (status === "warning") {
    return (
      <svg viewBox="0 0 20 20" width="12" height="12" fill="none" aria-hidden="true">
        <path d="M10 5v6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="10" cy="14.5" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (status === "error") {
    return (
      <svg viewBox="0 0 20 20" width="12" height="12" fill="none" aria-hidden="true">
        <path
          d="M6.5 6.5l7 7M13.5 6.5l-7 7"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (status === "current") {
    return <span className="dk-timeline__marker-dot" aria-hidden="true" />;
  }
  return null;
}

const TimelineRoot = React.forwardRef<HTMLDivElement, TimelineProps>(
  function Timeline(
    {
      orientation = "vertical",
      compact = false,
      children,
      className = "",
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    },
    forwardedRef
  ) {
    const ctx = React.useMemo(
      () => ({ orientation, compact }),
      [orientation, compact]
    );

    const items = React.Children.toArray(children).filter(Boolean);

    return (
      <TimelineContext.Provider value={ctx}>
        <div
          ref={forwardedRef}
          id={id}
          className={cx(
            "dk-timeline",
            `dk-timeline--${orientation}`,
            compact && "dk-timeline--compact",
            className
          )}
          role="list"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-orientation={orientation}
        >
          {items.map((child, index) => {
            if (!React.isValidElement(child)) return child;
            return React.cloneElement(
              child as React.ReactElement<{ index?: number }>,
              {
                index:
                  (child.props as { index?: number }).index ?? index + 1,
              }
            );
          })}
        </div>
      </TimelineContext.Provider>
    );
  }
);
TimelineRoot.displayName = "Timeline";

function TimelineItem({
  status = "neutral",
  marker,
  index,
  showIndex = false,
  title,
  description,
  timestamp,
  statusLabel,
  metadata,
  icon,
  avatar,
  children,
  href,
  onActivate,
  interactive: interactiveProp,
  className = "",
  id,
}: TimelineItemProps) {
  const { orientation } = React.useContext(TimelineContext);
  void orientation;

  const interactive =
    interactiveProp === true || href != null || onActivate != null;

  const markerNodes: React.ReactNode[] = [];
  const titleNodes: React.ReactNode[] = [];
  const descriptionNodes: React.ReactNode[] = [];
  const timestampNodes: React.ReactNode[] = [];
  const metadataNodes: React.ReactNode[] = [];
  const statusNodes: React.ReactNode[] = [];
  const otherNodes: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      otherNodes.push(child);
      return;
    }
    const name = displayNameOf(child);
    if (name === "Timeline.Marker") markerNodes.push(child);
    else if (name === "Timeline.Title") titleNodes.push(child);
    else if (name === "Timeline.Description") descriptionNodes.push(child);
    else if (name === "Timeline.Timestamp") timestampNodes.push(child);
    else if (name === "Timeline.Metadata") metadataNodes.push(child);
    else if (name === "Timeline.Status") statusNodes.push(child);
    else otherNodes.push(child);
  });

  const resolvedMarker =
    markerNodes.length > 0
      ? markerNodes
      : marker != null
        ? marker
        : avatar != null
          ? avatar
          : icon != null
            ? icon
            : showIndex && index != null
              ? <span className="dk-timeline__marker-index">{index}</span>
              : <StatusGlyph status={status} />;

  const resolvedTitle =
    titleNodes.length > 0 ? titleNodes : title != null ? title : null;
  const resolvedDescription =
    descriptionNodes.length > 0
      ? descriptionNodes
      : description != null
        ? description
        : null;
  const resolvedTimestamp =
    timestampNodes.length > 0
      ? timestampNodes
      : timestamp != null
        ? timestamp
        : null;
  const resolvedMetadata =
    metadataNodes.length > 0
      ? metadataNodes
      : metadata != null
        ? metadata
        : null;
  const resolvedStatus =
    statusNodes.length > 0
      ? statusNodes
      : statusLabel != null
        ? statusLabel
        : null;

  const activate = (event: React.SyntheticEvent) => {
    onActivate?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!interactive || href) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate(event);
    }
  };

  const body = (
    <>
      <div className="dk-timeline__rail" aria-hidden="true">
        <div className="dk-timeline__marker">{resolvedMarker}</div>
        <div className="dk-timeline__connector" />
      </div>

      <div className="dk-timeline__content">
        {(resolvedTimestamp != null || resolvedStatus != null) && (
          <div className="dk-timeline__meta-row">
            {timestampNodes.length > 0 ? (
              timestampNodes
            ) : resolvedTimestamp != null ? (
              <div className="dk-timeline__timestamp">{resolvedTimestamp}</div>
            ) : null}
            {statusNodes.length > 0 ? (
              statusNodes
            ) : resolvedStatus != null ? (
              <div className="dk-timeline__status">{resolvedStatus}</div>
            ) : null}
          </div>
        )}

        {titleNodes.length > 0 ? (
          titleNodes
        ) : resolvedTitle != null ? (
          <div className="dk-timeline__title">{resolvedTitle}</div>
        ) : null}

        {descriptionNodes.length > 0 ? (
          descriptionNodes
        ) : resolvedDescription != null ? (
          <div className="dk-timeline__description">{resolvedDescription}</div>
        ) : null}

        {metadataNodes.length > 0 ? (
          metadataNodes
        ) : resolvedMetadata != null ? (
          <div className="dk-timeline__metadata">{resolvedMetadata}</div>
        ) : null}

        {otherNodes}
      </div>
    </>
  );

  const classNames = cx(
    "dk-timeline__item",
    `dk-timeline__item--${status}`,
    interactive && "dk-timeline__item--interactive",
    className
  );

  if (href) {
    return (
      <a
        id={id}
        href={href}
        className={classNames}
        role="listitem"
        data-status={status}
        onClick={activate}
      >
        {body}
      </a>
    );
  }

  return (
    <div
      id={id}
      className={classNames}
      role="listitem"
      data-status={status}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? activate : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
    >
      {body}
    </div>
  );
}
TimelineItem.displayName = "Timeline.Item";

function TimelineMarker({ className = "", children, ...rest }: TimelineRegionProps) {
  return (
    <div className={cx("dk-timeline__marker-slot", className)} {...rest}>
      {children}
    </div>
  );
}
TimelineMarker.displayName = "Timeline.Marker";

function TimelineTitle({ className = "", children, ...rest }: TimelineRegionProps) {
  return (
    <div className={cx("dk-timeline__title", className)} {...rest}>
      {children}
    </div>
  );
}
TimelineTitle.displayName = "Timeline.Title";

function TimelineDescription({
  className = "",
  children,
  ...rest
}: TimelineRegionProps) {
  return (
    <div className={cx("dk-timeline__description", className)} {...rest}>
      {children}
    </div>
  );
}
TimelineDescription.displayName = "Timeline.Description";

function TimelineTimestamp({
  className = "",
  children,
  ...rest
}: React.TimeHTMLAttributes<HTMLTimeElement> & { children?: React.ReactNode }) {
  return (
    <time className={cx("dk-timeline__timestamp", className)} {...rest}>
      {children}
    </time>
  );
}
TimelineTimestamp.displayName = "Timeline.Timestamp";

function TimelineMetadata({ className = "", children, ...rest }: TimelineRegionProps) {
  return (
    <div className={cx("dk-timeline__metadata", className)} {...rest}>
      {children}
    </div>
  );
}
TimelineMetadata.displayName = "Timeline.Metadata";

function TimelineStatus({ className = "", children, ...rest }: TimelineRegionProps) {
  return (
    <div className={cx("dk-timeline__status", className)} {...rest}>
      {children}
    </div>
  );
}
TimelineStatus.displayName = "Timeline.Status";

export const Timeline = Object.assign(TimelineRoot, {
  Item: TimelineItem,
  Marker: TimelineMarker,
  Title: TimelineTitle,
  Description: TimelineDescription,
  Timestamp: TimelineTimestamp,
  Metadata: TimelineMetadata,
  Status: TimelineStatus,
});

export default Timeline;
