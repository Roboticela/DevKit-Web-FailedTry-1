import * as React from "react";

/**
 * Empty State — placeholder when a region has no items.
 * Slot-based; compose Button actions. No decorative chrome.
 */

export type EmptyStateVariant = "stacked" | "compact" | "inline";

export type EmptyStateProps = {
  variant?: EmptyStateVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  /** Primary / secondary actions (compose Button). */
  actions?: React.ReactNode;
  actionSlot?: React.ReactNode;
  iconSlot?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    {
      variant = "stacked",
      title = "Nothing here yet",
      description,
      icon,
      actions,
      actionSlot,
      iconSlot,
      className = "",
      id,
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        id={id}
        className={cx("dk-empty-state", `dk-empty-state--${variant}`, className)}
        data-variant={variant}
        role="status"
      >
        {(iconSlot ?? icon) ? (
          <div className="dk-empty-state__icon" aria-hidden={typeof title === "string" ? true : undefined}>
            {iconSlot ?? icon}
          </div>
        ) : null}
        <div className="dk-empty-state__copy">
          {title ? <h3 className="dk-empty-state__title">{title}</h3> : null}
          {description ? <p className="dk-empty-state__description">{description}</p> : null}
        </div>
        {(actionSlot ?? actions) ? (
          <div className="dk-empty-state__actions">{actionSlot ?? actions}</div>
        ) : null}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";
export default EmptyState;
