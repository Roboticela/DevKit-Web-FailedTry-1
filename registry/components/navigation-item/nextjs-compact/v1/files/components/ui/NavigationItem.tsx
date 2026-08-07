import * as React from "react";

export type NavigationItemSize = "sm" | "md" | "lg";

/**
 * Label layout:
 * - `single-line` — one line; set `truncate` only with an accessible full-label path
 * - `multiline` — label (and description) may wrap for localization / dynamic text
 */
export type NavigationItemLayout = "single-line" | "multiline";

/**
 * Active affordance (never color alone).
 * - `start` — leading bar (menus / lists)
 * - `underline` — bottom edge (bars / horizontal)
 * - `none` — weight + surface only
 */
export type NavigationItemIndicator = "start" | "underline" | "none";

export type NavigationItemBadgeTone = "neutral" | "accent" | "danger";

export interface NavigationItemBadge {
  label: string;
  tone?: NavigationItemBadgeTone;
}

export interface NavigationItemProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "children" | "onClick" | "onToggle"
  > {
  /** Primary label — required accessible name. */
  label: string;
  /** Optional secondary text under the label. */
  description?: string;
  /** Leading icon — meaning reinforcement, not decoration. */
  icon?: React.ReactNode;
  badge?: NavigationItemBadge | string | number;
  /** Marks the current destination. */
  active?: boolean;
  /**
   * Programmatic pressed surface (e.g. while a host menu is open).
   * Transient press also uses `:active`.
   */
  pressed?: boolean;
  disabled?: boolean;
  /**
   * Visited styling for link destinations when the host tracks history.
   * Prefer letting the browser manage `:visited` when using `href`.
   */
  visited?: boolean;
  size?: NavigationItemSize;
  layout?: NavigationItemLayout;
  /**
   * Truncate overflowing label. When true, the full label is exposed via
   * `title` and remains the accessible name — never silent truncation.
   */
  truncate?: boolean;
  indicator?: NavigationItemIndicator;
  /**
   * Destination URL. When set, renders an `<a>` (navigation semantics).
   * Do not use for actions — use Button / Link Button instead.
   */
  href?: string;
  /** Opens in a new browsing context; shows an external-link glyph. */
  external?: boolean;
  target?: string;
  rel?: string;
  /**
   * Parent item that reveals children / a submenu.
   * Renders a `<button>` with `aria-expanded` — not a navigation link.
   */
  expandable?: boolean;
  /** Controlled expanded state when `expandable`. */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Show disclosure chevron (defaults on when `expandable`). */
  disclosure?: boolean;
  /**
   * Selectable destination without a URL (SPA / composite hosts).
   * Prefer `href` when a real document destination exists.
   */
  onSelect?: (event: React.MouseEvent<HTMLElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const SIZE_CLASS: Record<NavigationItemSize, string> = {
  sm: "dk-nav-item--sm",
  md: "dk-nav-item--md",
  lg: "dk-nav-item--lg",
};

const LAYOUT_CLASS: Record<NavigationItemLayout, string> = {
  "single-line": "dk-nav-item--single-line",
  multiline: "dk-nav-item--multiline",
};

const INDICATOR_CLASS: Record<NavigationItemIndicator, string> = {
  start: "dk-nav-item--indicator-start",
  underline: "dk-nav-item--indicator-underline",
  none: "dk-nav-item--indicator-none",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatBadge(badge: NavigationItemBadge | string | number): {
  label: string;
  tone: NavigationItemBadgeTone;
} {
  if (typeof badge === "number") {
    return { label: badge > 99 ? "99+" : String(badge), tone: "accent" };
  }
  if (typeof badge === "string") {
    return { label: badge, tone: "neutral" };
  }
  return { label: badge.label, tone: badge.tone ?? "neutral" };
}

function ExternalIcon() {
  return (
    <svg
      className="dk-nav-item__glyph"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6.5 3.5H3.75A1.25 1.25 0 0 0 2.5 4.75v7.5c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25V9.5M9.5 2.5h4v4M13.5 2.5 7 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DisclosureIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={cx(
        "dk-nav-item__glyph",
        "dk-nav-item__disclosure-icon",
        open && "dk-nav-item__disclosure-icon--open"
      )}
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

/**
 * Navigation Item (ID 037) — atomic destination for navigation structures.
 *
 * Semantics:
 * - `href` → real link (navigates)
 * - `expandable` → disclosure control (submenu / children)
 * - otherwise → selectable destination button for composite hosts
 *
 * Do not use for arbitrary actions — use Button / Link Button.
 */
export const NavigationItem = React.forwardRef<HTMLElement, NavigationItemProps>(
  function NavigationItem(
    {
      label,
      description,
      icon,
      badge,
      active = false,
      pressed = false,
      disabled = false,
      visited = false,
      size = "md",
      layout = "single-line",
      truncate = false,
      indicator = "start",
      href,
      external = false,
      target,
      rel,
      expandable = false,
      expanded: expandedProp,
      defaultExpanded = false,
      onExpandedChange,
      disclosure,
      onSelect,
      onClick,
      className,
      id: idProp,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-nav-item-${reactId}`;
    const descId = description ? `${rootId}-desc` : undefined;

    const isExpandedControlled = expandedProp !== undefined;
    const [uncontrolledExpanded, setUncontrolledExpanded] =
      React.useState(defaultExpanded);
    const expanded = isExpandedControlled ? Boolean(expandedProp) : uncontrolledExpanded;

    const showDisclosure = disclosure ?? expandable;
    const badgeResolved = badge != null ? formatBadge(badge) : null;
    const isLink = Boolean(href) && !expandable;
    const isDisabled = disabled;

    const setExpanded = (next: boolean) => {
      if (!isExpandedControlled) setUncontrolledExpanded(next);
      onExpandedChange?.(next);
    };

    const classNames = cx(
      "dk-nav-item",
      SIZE_CLASS[size],
      LAYOUT_CLASS[layout],
      INDICATOR_CLASS[indicator],
      active && "dk-nav-item--active",
      pressed && "dk-nav-item--pressed",
      isDisabled && "dk-nav-item--disabled",
      visited && "dk-nav-item--visited",
      truncate && "dk-nav-item--truncate",
      expandable && "dk-nav-item--expandable",
      expanded && "dk-nav-item--expanded",
      external && "dk-nav-item--external",
      Boolean(icon) && "dk-nav-item--has-icon",
      Boolean(description) && "dk-nav-item--has-description",
      className
    );

    const content = (
      <>
        <span className="dk-nav-item__hit" aria-hidden="true" />
        {icon ? (
          <span className="dk-nav-item__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span className="dk-nav-item__text">
          <span className="dk-nav-item__label">{label}</span>
          {description ? (
            <span className="dk-nav-item__description" id={descId}>
              {description}
            </span>
          ) : null}
        </span>
        {badgeResolved ? (
          <span
            className={cx(
              "dk-nav-item__badge",
              `dk-nav-item__badge--${badgeResolved.tone}`
            )}
          >
            {badgeResolved.label}
          </span>
        ) : null}
        {external && isLink ? (
          <span className="dk-nav-item__external" aria-hidden="true">
            <ExternalIcon />
          </span>
        ) : null}
        {showDisclosure ? (
          <span className="dk-nav-item__disclosure" aria-hidden="true">
            <DisclosureIcon open={expanded} />
          </span>
        ) : null}
      </>
    );

    const shared = {
      id: rootId,
      className: classNames,
      title: truncate ? label : undefined,
      "aria-current": active && !expandable ? ("page" as const) : undefined,
      "aria-disabled": isDisabled || undefined,
      "aria-describedby": descId,
      "data-active": active || undefined,
      "data-pressed": pressed || undefined,
      "data-visited": visited || undefined,
      "data-size": size,
      "data-layout": layout,
      "data-indicator": indicator,
    };

    const handleActivate = (event: React.MouseEvent<HTMLElement>) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      if (expandable) {
        setExpanded(!expanded);
      }
      onSelect?.(event);
      onClick?.(event);
    };

    if (isLink && href) {
      const resolvedTarget = target ?? (external ? "_blank" : undefined);
      const resolvedRel =
        rel ??
        (resolvedTarget === "_blank" ? "noopener noreferrer" : undefined);

      return (
        <a
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          {...shared}
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={isDisabled ? undefined : href}
          target={resolvedTarget}
          rel={resolvedRel}
          tabIndex={isDisabled ? -1 : undefined}
          aria-disabled={isDisabled || undefined}
          onClick={handleActivate}
        >
          {content}
          {external ? <span className="dk-sr-only">(opens in a new tab)</span> : null}
        </a>
      );
    }

    return (
      <button
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        {...shared}
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={isDisabled}
        aria-expanded={expandable ? expanded : undefined}
        aria-haspopup={expandable ? "menu" : undefined}
        onClick={handleActivate}
      >
        {content}
      </button>
    );
  }
);

NavigationItem.displayName = "NavigationItem";

export default NavigationItem;
