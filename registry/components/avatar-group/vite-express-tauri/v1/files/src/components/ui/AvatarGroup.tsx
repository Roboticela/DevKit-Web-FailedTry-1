import * as React from "react";

/**
 * Avatar Group — compact arrangement of related identities.
 * Renders only max visible avatars + overflow count (does not mount hundreds).
 * Overlap stays modest so initials remain readable. Touch gets a click/focus alternative to hover.
 */

export type AvatarGroupSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type AvatarGroupLayout = "overlap" | "separated";

/** Minimal identity descriptor when not passing Avatar children. */
export type AvatarGroupItem = {
  key?: string;
  name?: string;
  initials?: string;
  src?: string;
  alt?: string;
  entity?: "person" | "organization" | "generic";
  "aria-label"?: string;
  decorative?: boolean;
};

export type AvatarGroupProps = {
  /** Avatar elements and/or custom nodes. Only the first `max` visible avatars are mounted. */
  children?: React.ReactNode;
  /**
   * Data-driven identities. Preferred for large sets — only `max` items are rendered.
   * When both `items` and `children` are set, `items` wins.
   */
  items?: AvatarGroupItem[];
  size?: AvatarGroupSize;
  layout?: AvatarGroupLayout;
  /** Tighter spacing / overlap. */
  compact?: boolean;
  /**
   * Maximum visible avatars before overflow.
   * Default: 5. Use with totalCount when the full set is larger than `items`/`children`.
   */
  max?: number;
  /**
   * Total identity count for overflow math when the full list is not passed
   * (virtualized / server-truncated). Defaults to items/children length.
   */
  totalCount?: number;
  /**
   * Custom overflow label. Receives remaining count.
   * Default: `+{count}` (localize via this prop).
   */
  formatOverflow?: (count: number) => string;
  /** Accessible name for the group. */
  "aria-label"?: string;
  /** Accessible name for the overflow control. Default describes remaining count. */
  overflowLabel?: (count: number) => string;
  /**
   * Details for overflow — shown in the disclosure panel (click/focus/touch)
   * and available for tooltip composition via `overflowTooltip`.
   */
  overflowDetails?: React.ReactNode;
  /**
   * Optional tooltip content slot. Compose with DevKit Tooltip around the
   * overflow control by using `renderOverflow` when you need full control.
   */
  overflowTooltip?: React.ReactNode;
  /**
   * Replace the overflow control entirely (tooltip wrappers, menus, etc.).
   */
  renderOverflow?: (props: {
    count: number;
    label: string;
    text: string;
    details: React.ReactNode;
  }) => React.ReactNode;
  /** Called when overflow is activated (click / Enter / Space). */
  onOverflowActivate?: () => void;
  /**
   * Render function for each visible item when using `items`.
   * Default renders a DevKit-shaped avatar surface via CSS classes only if
   * Avatar is composed by the host — prefer passing Avatar through children
   * or provide this render prop that returns <Avatar … />.
   */
  renderItem?: (item: AvatarGroupItem, index: number) => React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function defaultFormatOverflow(count: number) {
  return `+${count}`;
}

function defaultOverflowLabel(count: number) {
  return `${count} more`;
}

function isAvatarElement(child: React.ReactElement): boolean {
  const name = (child.type as { displayName?: string; name?: string })
    ?.displayName;
  const fnName = (child.type as { name?: string })?.name;
  return name === "Avatar" || fnName === "Avatar";
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup(
    {
      children,
      items,
      size = "md",
      layout = "overlap",
      compact = false,
      max = 5,
      totalCount,
      formatOverflow = defaultFormatOverflow,
      "aria-label": ariaLabel,
      overflowLabel = defaultOverflowLabel,
      overflowDetails,
      overflowTooltip,
      renderOverflow,
      onOverflowActivate,
      renderItem,
      className = "",
      id,
    },
    forwardedRef
  ) {
    const [detailsOpen, setDetailsOpen] = React.useState(false);
    const overflowRef = React.useRef<HTMLButtonElement | null>(null);
    const panelId = React.useId();

    const childArray = React.Children.toArray(children).filter(Boolean);
    const usingItems = Array.isArray(items);
    const sourceLength = usingItems ? items!.length : childArray.length;
    const total = totalCount ?? sourceLength;
    const visibleCap = Math.max(0, max);
    const visibleCount = Math.min(visibleCap, sourceLength);
    const remaining = Math.max(0, total - visibleCount);

    const visibleNodes: React.ReactNode[] = [];

    if (usingItems) {
      const slice = items!.slice(0, visibleCount);
      slice.forEach((item, index) => {
        if (renderItem) {
          visibleNodes.push(
            <span
              key={item.key ?? item.name ?? `item-${index}`}
              className="dk-avatar-group__item"
            >
              {renderItem(item, index)}
            </span>
          );
        } else {
          // Structural placeholder — host should pass renderItem returning <Avatar />
          // or use children. Still show initials surface for preview/fallback.
          visibleNodes.push(
            <span
              key={item.key ?? item.name ?? `item-${index}`}
              className="dk-avatar-group__item"
            >
              <span
                className={cx(
                  "dk-avatar",
                  `dk-avatar--${size}`,
                  "dk-avatar--circle",
                  "dk-avatar-group__avatar"
                )}
                role="img"
                aria-label={
                  item.decorative
                    ? undefined
                    : item["aria-label"] || item.alt || item.name || "Avatar"
                }
                aria-hidden={item.decorative || undefined}
              >
                <span className="dk-avatar__surface">
                  {item.src ? (
                    <img
                      className="dk-avatar__image"
                      src={item.src}
                      alt=""
                      draggable={false}
                    />
                  ) : (
                    <span className="dk-avatar__initials">
                      {item.initials ||
                        (item.name
                          ? item.name
                              .trim()
                              .split(/\s+/)
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((p) => Array.from(p)[0] ?? "")
                              .join("")
                              .toLocaleUpperCase()
                          : "?")}
                    </span>
                  )}
                </span>
              </span>
            </span>
          );
        }
      });
    } else {
      childArray.slice(0, visibleCount).forEach((child, index) => {
        if (!React.isValidElement(child)) {
          visibleNodes.push(
            <span key={`node-${index}`} className="dk-avatar-group__item">
              {child}
            </span>
          );
          return;
        }
        const key = child.key ?? `avatar-${index}`;
        const cloned = isAvatarElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ size?: AvatarGroupSize; className?: string }>,
              {
                size:
                  (child.props as { size?: AvatarGroupSize }).size ?? size,
                className: cx(
                  (child.props as { className?: string }).className,
                  "dk-avatar-group__avatar"
                ),
              }
            )
          : child;
        visibleNodes.push(
          <span key={key} className="dk-avatar-group__item">
            {cloned}
          </span>
        );
      });
    }

    const overflowText = formatOverflow(remaining);
    const overflowAria = overflowLabel(remaining);

    const closeDetails = React.useCallback(() => {
      setDetailsOpen(false);
    }, []);

    React.useEffect(() => {
      if (!detailsOpen) return;
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeDetails();
          overflowRef.current?.focus();
        }
      };
      const onPointer = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node | null;
        if (
          overflowRef.current?.contains(target) ||
          (target &&
            (target as Element).closest?.(
              `[data-dk-avatar-group-panel="${panelId}"]`
            ))
        ) {
          return;
        }
        closeDetails();
      };
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onPointer);
      document.addEventListener("touchstart", onPointer);
      return () => {
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("mousedown", onPointer);
        document.removeEventListener("touchstart", onPointer);
      };
    }, [detailsOpen, closeDetails, panelId]);

    const activateOverflow = () => {
      onOverflowActivate?.();
      if (overflowDetails != null || remaining > 0) {
        setDetailsOpen((open) => !open);
      }
    };

    const overflowControl =
      remaining > 0
        ? renderOverflow
          ? renderOverflow({
              count: remaining,
              label: overflowAria,
              text: overflowText,
              details: overflowDetails,
            })
          : (
            <span className="dk-avatar-group__overflow-wrap">
              <button
                ref={overflowRef}
                type="button"
                className={cx(
                  "dk-avatar-group__overflow",
                  `dk-avatar-group__overflow--${size}`,
                  detailsOpen && "dk-avatar-group__overflow--open"
                )}
                aria-label={overflowAria}
                aria-expanded={detailsOpen}
                aria-controls={
                  overflowDetails != null ? panelId : undefined
                }
                title={overflowTooltip ? undefined : overflowAria}
                onClick={activateOverflow}
              >
                <span className="dk-avatar-group__overflow-text" aria-hidden="true">
                  {overflowText}
                </span>
                {overflowTooltip ? (
                  <span className="dk-avatar-group__overflow-tooltip" role="tooltip">
                    {overflowTooltip}
                  </span>
                ) : null}
              </button>
              {detailsOpen && overflowDetails != null ? (
                <div
                  id={panelId}
                  role="region"
                  data-dk-avatar-group-panel={panelId}
                  className="dk-avatar-group__details"
                  tabIndex={-1}
                >
                  {overflowDetails}
                </div>
              ) : null}
            </span>
          )
        : null;

    return (
      <div
        ref={forwardedRef}
        id={id}
        className={cx(
          "dk-avatar-group",
          `dk-avatar-group--${size}`,
          `dk-avatar-group--${layout}`,
          compact && "dk-avatar-group--compact",
          className
        )}
        role="group"
        aria-label={ariaLabel}
      >
        <div className="dk-avatar-group__list">{visibleNodes}</div>
        {overflowControl}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

export default AvatarGroup;
