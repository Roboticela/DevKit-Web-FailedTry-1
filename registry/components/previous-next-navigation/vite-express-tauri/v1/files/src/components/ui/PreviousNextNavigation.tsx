import * as React from "react";

export type PreviousNextSize = "sm" | "md";

/**
 * Layout:
 * - `split` — Previous and Next on opposite edges (desktop-balanced)
 * - `stack` — stacked when titles are long / narrow viewports
 * - `auto` — split by default; stack under ~480px or when titles are long
 */
export type PreviousNextLayout = "auto" | "split" | "stack";

/**
 * How to treat a missing direction at the sequence boundary.
 * - `disable` — render an inert, disabled control
 * - `hide` — omit that direction entirely
 */
export type PreviousNextBoundary = "disable" | "hide";

export interface PreviousNextDestination {
  /**
   * Destination URL. When set, renders a real `<a>` (document navigation).
   * Prefer this over action buttons for page-to-page movement.
   */
  href?: string;
  /** Destination title for context (e.g. next article name). */
  title?: string;
  /** Overrides the default direction label (“Previous” / “Next”). */
  label?: string;
  /** Optional leading/trailing icon; defaults to a direction chevron. */
  icon?: React.ReactNode;
  disabled?: boolean;
  /** SPA / host callback when `href` is omitted. Prefer `href` for documents. */
  onSelect?: (event: React.MouseEvent<HTMLElement>) => void;
}

export interface PreviousNextNavigationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Accessible name for the navigation landmark. */
  label?: string;
  /** Previous destination. Omit / `null` at the first item. */
  previous?: PreviousNextDestination | null;
  /** Next destination. Omit / `null` at the last item. */
  next?: PreviousNextDestination | null;
  /** Default direction label for Previous. */
  previousLabel?: string;
  /** Default direction label for Next. */
  nextLabel?: string;
  /** Show “Previous” / “Next” (or localized) labels. Default: true. */
  showLabels?: boolean;
  /** Show destination titles when provided. Default: true. */
  showTitles?: boolean;
  /** Show direction icons. Default: true. */
  showIcons?: boolean;
  /** Boundary treatment when a direction is missing. Default: `disable`. */
  boundary?: PreviousNextBoundary;
  layout?: PreviousNextLayout;
  size?: PreviousNextSize;
  disabled?: boolean;
}

const SIZE_CLASS: Record<PreviousNextSize, string> = {
  sm: "dk-prev-next--sm",
  md: "dk-prev-next--md",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function ChevronPrev() {
  return (
    <svg
      className="dk-prev-next__chevron dk-prev-next__chevron--prev"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 3.5 5.5 8 10 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronNext() {
  return (
    <svg
      className="dk-prev-next__chevron dk-prev-next__chevron--next"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 3.5 10.5 8 6 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function preferStackLayout(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 479px)").matches;
}

type Direction = "previous" | "next";

/**
 * Previous / Next Navigation (ID 040) — sequential movement through related content.
 *
 * DOM order is always Previous then Next. In RTL, visual placement flips via
 * logical CSS — semantic meaning does **not** reverse.
 */
export const PreviousNextNavigation = React.forwardRef<
  HTMLElement,
  PreviousNextNavigationProps
>(function PreviousNextNavigation(
  {
    label = "Sequential navigation",
    previous = null,
    next = null,
    previousLabel = "Previous",
    nextLabel = "Next",
    showLabels = true,
    showTitles = true,
    showIcons = true,
    boundary = "disable",
    layout = "auto",
    size = "md",
    disabled = false,
    className,
    id: idProp,
    ...rest
  },
  ref
) {
  const reactId = React.useId();
  const rootId = idProp ?? `dk-prev-next-${reactId}`;

  const [autoStack, setAutoStack] = React.useState(
    layout === "stack" || (layout === "auto" && false)
  );

  React.useEffect(() => {
    if (layout !== "auto") {
      setAutoStack(layout === "stack");
      return;
    }
    const sync = () => setAutoStack(preferStackLayout());
    sync();
    const mq = window.matchMedia("(max-width: 479px)");
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [layout]);

  const resolvedLayout: "split" | "stack" =
    layout === "auto" ? (autoStack ? "stack" : "split") : layout === "stack" ? "stack" : "split";

  const longTitles =
    (previous?.title?.length ?? 0) > 48 || (next?.title?.length ?? 0) > 48;
  const effectiveLayout: "split" | "stack" =
    layout === "auto" && longTitles ? "stack" : resolvedLayout;

  const renderSide = (direction: Direction) => {
    const dest = direction === "previous" ? previous : next;
    const defaultLabel = direction === "previous" ? previousLabel : nextLabel;
    const missing = dest == null;

    if (missing && boundary === "hide") return null;

    const isDisabled = Boolean(
      disabled || missing || dest?.disabled || (dest && !dest.href && !dest.onSelect)
    );
    const dirLabel = dest?.label ?? defaultLabel;
    const title = dest?.title;
    const showTitle = showTitles && Boolean(title);
    const accessibleName = showTitle ? `${dirLabel}: ${title}` : dirLabel;

    const iconNode =
      dest?.icon ??
      (direction === "previous" ? <ChevronPrev /> : <ChevronNext />);

    const body = (
      <>
        <span className="dk-prev-next__hit" aria-hidden="true" />
        {showIcons && direction === "previous" ? (
          <span className="dk-prev-next__icon" aria-hidden="true">
            {iconNode}
          </span>
        ) : null}
        <span className="dk-prev-next__text">
          {showLabels ? (
            <span className="dk-prev-next__dir">{dirLabel}</span>
          ) : null}
          {showTitle ? (
            <span className="dk-prev-next__title">{title}</span>
          ) : null}
          {!showLabels && !showTitle ? (
            <span className="dk-sr-only">{accessibleName}</span>
          ) : null}
        </span>
        {showIcons && direction === "next" ? (
          <span className="dk-prev-next__icon" aria-hidden="true">
            {iconNode}
          </span>
        ) : null}
      </>
    );

    const classNameSide = cx(
      "dk-prev-next__item",
      `dk-prev-next__item--${direction}`,
      isDisabled && "dk-prev-next__item--disabled",
      showTitle && "dk-prev-next__item--has-title"
    );

    if (!isDisabled && dest?.href) {
      return (
        <a
          key={direction}
          className={classNameSide}
          href={dest.href}
          aria-label={accessibleName}
          title={title || dirLabel}
          onClick={dest.onSelect}
        >
          {body}
        </a>
      );
    }

    if (!isDisabled && dest?.onSelect) {
      return (
        <button
          key={direction}
          type="button"
          className={classNameSide}
          aria-label={accessibleName}
          title={title || dirLabel}
          onClick={dest.onSelect}
        >
          {body}
        </button>
      );
    }

    /* Boundary disabled / inert — not a fake link */
    return (
      <span
        key={direction}
        className={classNameSide}
        aria-disabled="true"
        aria-label={accessibleName}
        title={title || dirLabel}
      >
        {body}
      </span>
    );
  };

  const positionHint =
    previous == null && next != null
      ? "first"
      : previous != null && next == null
        ? "last"
        : previous == null && next == null
          ? "empty"
          : "middle";

  return (
    <nav
      {...rest}
      ref={ref}
      id={rootId}
      className={cx(
        "dk-prev-next",
        SIZE_CLASS[size],
        `dk-prev-next--${effectiveLayout}`,
        disabled && "dk-prev-next--disabled",
        className
      )}
      aria-label={label}
      data-size={size}
      data-layout={effectiveLayout}
      data-boundary={boundary}
      data-position={positionHint}
      data-disabled={disabled || undefined}
    >
      <div className="dk-prev-next__row">
        {renderSide("previous")}
        {effectiveLayout === "split" ? (
          <span className="dk-prev-next__spacer" aria-hidden="true" />
        ) : null}
        {renderSide("next")}
      </div>
    </nav>
  );
});

PreviousNextNavigation.displayName = "PreviousNextNavigation";

export default PreviousNextNavigation;
