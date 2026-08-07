import * as React from "react";

/**
 * Media Overlay — controlled content over visual media.
 * Placements: top · bottom · corner · full.
 * Contrast protection uses a solid scrim (not a heavy decorative gradient).
 * Controls need focus, touch targets, and clear states — compose DevKit actions.
 * Hover may enhance visibility; never be the only path to important controls.
 */

export type MediaOverlayPlacement = "top" | "bottom" | "corner" | "full";

/**
 * Corner when `placement="corner"`. Logical — RTL mirrors start/end.
 */
export type MediaOverlayCorner =
  | "start-start"
  | "start-end"
  | "end-start"
  | "end-end";

/**
 * Solid contrast scrim strength. Prefer the minimum needed for readability.
 */
export type MediaOverlayProtection = "none" | "subtle" | "medium";

export type MediaOverlayProps = {
  /**
   * Where the overlay sits on the media. Default `bottom`.
   * Prefer `bottom` on mobile for thumb reach.
   */
  placement?: MediaOverlayPlacement;
  /** Corner when `placement="corner"`. Default `end-end`. */
  corner?: MediaOverlayCorner;
  /**
   * Contrast protection over media. Default `subtle` when content exists.
   * Solid scrim only — not a heavy gradient.
   */
  protection?: MediaOverlayProtection | boolean;
  /**
   * Purely decorative chrome — hidden from assistive technology.
   * Do not use when the overlay carries meaning (title, status, duration, …).
   */
  decorative?: boolean;
  /**
   * On coarse pointers / always: content stays visible.
   * On fine pointer desktop: may fade until hover/focus-within — enhancement only.
   * Important controls must remain reachable without hover (keyboard / always visible actions).
   */
  revealOnHover?: boolean;
  /** Selection / selected chrome. */
  selected?: boolean;
  /** Optional play mark (visual). Wire real play via Action / host control. */
  showPlay?: boolean;
  playLabel?: string;
  status?: React.ReactNode;
  duration?: React.ReactNode;
  title?: React.ReactNode;
  metadata?: React.ReactNode;
  /** Action slot — compose DevKit Button / IconButton. */
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

export type MediaOverlayRegionProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function displayNameOf(child: React.ReactElement): string | undefined {
  return (child.type as { displayName?: string })?.displayName;
}

function resolveProtection(
  protection: MediaOverlayProps["protection"],
  hasContent: boolean
): MediaOverlayProtection {
  if (protection === false || protection === "none") return "none";
  if (protection === true) return "subtle";
  if (protection === "subtle" || protection === "medium") return protection;
  return hasContent ? "subtle" : "none";
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M10 8.5v7l6-3.5-6-3.5z" fill="#fff" />
    </svg>
  );
}

function MediaOverlayTitle({
  className = "",
  children,
  ...rest
}: MediaOverlayRegionProps) {
  return (
    <div className={cx("dk-media-overlay__title", className)} {...rest}>
      {children}
    </div>
  );
}
MediaOverlayTitle.displayName = "MediaOverlay.Title";

function MediaOverlayMetadata({
  className = "",
  children,
  ...rest
}: MediaOverlayRegionProps) {
  return (
    <div className={cx("dk-media-overlay__metadata", className)} {...rest}>
      {children}
    </div>
  );
}
MediaOverlayMetadata.displayName = "MediaOverlay.Metadata";

function MediaOverlayStatus({
  className = "",
  children,
  ...rest
}: MediaOverlayRegionProps) {
  return (
    <div className={cx("dk-media-overlay__status", className)} {...rest}>
      {children}
    </div>
  );
}
MediaOverlayStatus.displayName = "MediaOverlay.Status";

function MediaOverlayDuration({
  className = "",
  children,
  ...rest
}: MediaOverlayRegionProps) {
  return (
    <div className={cx("dk-media-overlay__duration", className)} {...rest}>
      {children}
    </div>
  );
}
MediaOverlayDuration.displayName = "MediaOverlay.Duration";

function MediaOverlayAction({
  className = "",
  children,
  ...rest
}: MediaOverlayRegionProps) {
  return (
    <div
      className={cx("dk-media-overlay__action", className)}
      data-dk-media-overlay-action=""
      {...rest}
    >
      {children}
    </div>
  );
}
MediaOverlayAction.displayName = "MediaOverlay.Action";

function MediaOverlayPlay({
  className = "",
  label = "Play",
  ...rest
}: Omit<MediaOverlayRegionProps, "children"> & { label?: string }) {
  return (
    <span
      className={cx("dk-media-overlay__play", className)}
      aria-hidden="true"
      title={label}
      {...rest}
    >
      <PlayGlyph />
    </span>
  );
}
MediaOverlayPlay.displayName = "MediaOverlay.Play";

function MediaOverlaySelection({
  className = "",
  selected = false,
  ...rest
}: Omit<MediaOverlayRegionProps, "children"> & { selected?: boolean }) {
  return (
    <span
      className={cx(
        "dk-media-overlay__selection",
        selected && "dk-media-overlay__selection--on",
        className
      )}
      aria-hidden="true"
      {...rest}
    >
      {selected ? (
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
          <path
            d="M3.5 8.5l3 3 6-6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  );
}
MediaOverlaySelection.displayName = "MediaOverlay.Selection";

function MediaOverlayRoot(
  {
    placement = "bottom",
    corner = "end-end",
    protection,
    decorative = false,
    revealOnHover = false,
    selected = false,
    showPlay = false,
    playLabel = "Play",
    status,
    duration,
    title,
    metadata,
    action,
    children,
    className = "",
    id,
    "aria-label": ariaLabel,
  }: MediaOverlayProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
  const titleNodes: React.ReactNode[] = [];
  const metadataNodes: React.ReactNode[] = [];
  const statusNodes: React.ReactNode[] = [];
  const durationNodes: React.ReactNode[] = [];
  const actionNodes: React.ReactNode[] = [];
  const playNodes: React.ReactNode[] = [];
  const selectionNodes: React.ReactNode[] = [];
  const otherNodes: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      otherNodes.push(child);
      return;
    }
    const name = displayNameOf(child);
    if (name === "MediaOverlay.Title") titleNodes.push(child);
    else if (name === "MediaOverlay.Metadata") metadataNodes.push(child);
    else if (name === "MediaOverlay.Status") statusNodes.push(child);
    else if (name === "MediaOverlay.Duration") durationNodes.push(child);
    else if (name === "MediaOverlay.Action") actionNodes.push(child);
    else if (name === "MediaOverlay.Play") playNodes.push(child);
    else if (name === "MediaOverlay.Selection") selectionNodes.push(child);
    else otherNodes.push(child);
  });

  const hasContent =
    titleNodes.length > 0 ||
    title != null ||
    metadataNodes.length > 0 ||
    metadata != null ||
    statusNodes.length > 0 ||
    status != null ||
    durationNodes.length > 0 ||
    duration != null ||
    actionNodes.length > 0 ||
    action != null ||
    playNodes.length > 0 ||
    showPlay ||
    selectionNodes.length > 0 ||
    selected ||
    otherNodes.length > 0;

  const protectionLevel = resolveProtection(protection, hasContent);
  const meaningful = !decorative && hasContent;

  return (
    <div
      ref={forwardedRef}
      id={id}
      className={cx(
        "dk-media-overlay",
        `dk-media-overlay--${placement}`,
        placement === "corner" && `dk-media-overlay--corner-${corner}`,
        `dk-media-overlay--protection-${protectionLevel}`,
        revealOnHover && "dk-media-overlay--reveal-hover",
        selected && "dk-media-overlay--selected",
        className
      )}
      role={decorative ? "presentation" : meaningful ? "group" : undefined}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : ariaLabel}
      data-placement={placement}
    >
      {protectionLevel !== "none" ? (
        <span className="dk-media-overlay__scrim" aria-hidden="true" />
      ) : null}

      <div className="dk-media-overlay__content">
        {(showPlay || playNodes.length > 0) && (
          <div className="dk-media-overlay__play-slot">
            {playNodes.length > 0
              ? playNodes
              : (
                  <MediaOverlayPlay label={playLabel} />
                )}
          </div>
        )}

        {(selectionNodes.length > 0 || selected) && (
          <div className="dk-media-overlay__selection-slot">
            {selectionNodes.length > 0
              ? selectionNodes
              : (
                  <MediaOverlaySelection selected={selected} />
                )}
          </div>
        )}

        <div className="dk-media-overlay__main">
          {titleNodes.length > 0
            ? titleNodes
            : title != null
              ? (
                  <div className="dk-media-overlay__title">{title}</div>
                )
              : null}

          {metadataNodes.length > 0
            ? metadataNodes
            : metadata != null
              ? (
                  <div className="dk-media-overlay__metadata">{metadata}</div>
                )
              : null}

          {(statusNodes.length > 0 ||
            status != null ||
            durationNodes.length > 0 ||
            duration != null) && (
            <div className="dk-media-overlay__meta-row">
              {statusNodes.length > 0
                ? statusNodes
                : status != null
                  ? (
                      <div className="dk-media-overlay__status">{status}</div>
                    )
                  : null}
              {durationNodes.length > 0
                ? durationNodes
                : duration != null
                  ? (
                      <div className="dk-media-overlay__duration">{duration}</div>
                    )
                  : null}
            </div>
          )}
        </div>

        {(actionNodes.length > 0 || action != null) && (
          <div className="dk-media-overlay__action-slot">
            {actionNodes.length > 0
              ? actionNodes
              : (
                  <div
                    className="dk-media-overlay__action"
                    data-dk-media-overlay-action=""
                  >
                    {action}
                  </div>
                )}
          </div>
        )}

        {otherNodes}
      </div>
    </div>
  );
}

const MediaOverlayForward = React.forwardRef(MediaOverlayRoot);
MediaOverlayForward.displayName = "MediaOverlay";

export const MediaOverlay = Object.assign(MediaOverlayForward, {
  Title: MediaOverlayTitle,
  Metadata: MediaOverlayMetadata,
  Status: MediaOverlayStatus,
  Duration: MediaOverlayDuration,
  Action: MediaOverlayAction,
  Play: MediaOverlayPlay,
  Selection: MediaOverlaySelection,
});

export default MediaOverlay;
