import * as React from "react";

export type BreadcrumbsSize = "sm" | "md";

/**
 * - `auto` — collapse intermediate levels when the trail is long
 * - `none` — always render the full trail
 */
export type BreadcrumbsCollapse = "auto" | "none";

/**
 * Narrow viewport presentation:
 * - `auto` — compact under ~480px (`ancestor`), full otherwise
 * - `full` — always full / collapsed trail
 * - `back` — Back control + current page
 * - `ancestor` — immediate parent › current
 */
export type BreadcrumbsMobile = "auto" | "full" | "back" | "ancestor";

export interface BreadcrumbItem {
  id: string;
  label: string;
  /** Ancestor links. Omit on the current page unless there is a specific reason. */
  href?: string;
  /** Optional click handler for SPA hosts (still prefer `href` when it is a real URL). */
  onNavigate?: () => void;
  /** Leading icon for this crumb (commonly used on Home). */
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Ordered trail from root → current. Last item is the current location. */
  items: BreadcrumbItem[];
  /** Accessible name for the navigation landmark. Default: `Breadcrumb`. */
  label?: string;
  size?: BreadcrumbsSize;
  collapse?: BreadcrumbsCollapse;
  /**
   * When collapsing, keep the first crumb, an overflow control, and this many
   * trailing crumbs (including current). Default: 2.
   */
  itemsAfterCollapse?: number;
  /**
   * Collapse when `items.length` exceeds this count (with `collapse="auto"`).
   * Default: 4.
   */
  maxVisible?: number;
  mobile?: BreadcrumbsMobile;
  /** Show a home icon on the first crumb when it has no custom `icon`. */
  showHomeIcon?: boolean;
  homeIcon?: React.ReactNode;
  /** Custom separator. Default: chevron (mirrors in RTL via CSS). */
  separator?: React.ReactNode;
  /** Fires when an ancestor is activated (in addition to `href` navigation). */
  onItemNavigate?: (item: BreadcrumbItem) => void;
}

const SIZE_CLASS: Record<BreadcrumbsSize, string> = {
  sm: "dk-breadcrumbs--sm",
  md: "dk-breadcrumbs--md",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function preferCompactMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 479px)").matches;
}

function DefaultSeparator() {
  return (
    <svg className="dk-breadcrumbs__sep-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

function DefaultHomeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.75 7.25 8 3.25l5.25 4V13a.75.75 0 0 1-.75.75H3.5A.75.75 0 0 1 2.75 13V7.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6.25 13.75V9.5h3.5v4.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

/**
 * Breadcrumbs (ID 033) — hierarchical location within a content structure.
 *
 * Current page is not a link by default. Long trails collapse intermediate
 * levels into an overflow menu rather than clipping without discovery.
 */
export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  function Breadcrumbs(
    {
      items,
      label = "Breadcrumb",
      size = "md",
      collapse = "auto",
      itemsAfterCollapse = 2,
      maxVisible = 4,
      mobile = "auto",
      showHomeIcon = false,
      homeIcon,
      separator,
      onItemNavigate,
      className,
      id: idProp,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-breadcrumbs-${reactId}`;
    const menuId = `${rootId}-overflow`;

    const [compact, setCompact] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const overflowRef = React.useRef<HTMLLIElement | null>(null);

    React.useEffect(() => {
      if (mobile === "full") {
        setCompact(false);
        return;
      }
      if (mobile === "back" || mobile === "ancestor") {
        setCompact(true);
        return;
      }
      const sync = () => setCompact(preferCompactMobile());
      sync();
      const mq = window.matchMedia("(max-width: 479px)");
      mq.addEventListener("change", sync);
      return () => mq.removeEventListener("change", sync);
    }, [mobile]);

    React.useEffect(() => {
      if (!menuOpen) return;
      const onPointer = (event: PointerEvent) => {
        const target = event.target as Node | null;
        if (overflowRef.current && target && !overflowRef.current.contains(target)) {
          setMenuOpen(false);
        }
      };
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") setMenuOpen(false);
      };
      document.addEventListener("pointerdown", onPointer);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("pointerdown", onPointer);
        document.removeEventListener("keydown", onKey);
      };
    }, [menuOpen]);

    const trail = items.filter(Boolean);
    if (trail.length === 0) return null;

    const current = trail[trail.length - 1]!;
    const ancestors = trail.slice(0, -1);
    const parent = ancestors[ancestors.length - 1] ?? null;

    const shouldCollapse =
      collapse === "auto" &&
      !compact &&
      trail.length > maxVisible &&
      trail.length > itemsAfterCollapse + 1;

    const afterCount = Math.max(1, itemsAfterCollapse);
    const hidden = shouldCollapse
      ? trail.slice(1, Math.max(1, trail.length - afterCount))
      : [];
    const visibleHead = shouldCollapse ? [trail[0]!] : trail.slice(0, -afterCount);
    const visibleTail = shouldCollapse
      ? trail.slice(trail.length - afterCount)
      : trail.slice(Math.max(0, trail.length - afterCount));

    // When not collapsing, render full trail once
    const fullModeCrumbs = !shouldCollapse ? trail : null;

    const sep = separator ?? <DefaultSeparator />;
    const home = homeIcon ?? <DefaultHomeIcon />;

    const activate = (item: BreadcrumbItem, event?: React.SyntheticEvent) => {
      item.onNavigate?.();
      onItemNavigate?.(item);
      if (!item.href && event) event.preventDefault();
    };

    const renderCrumb = (
      item: BreadcrumbItem,
      options: { isCurrent?: boolean; isFirst?: boolean }
    ) => {
      const { isCurrent = false, isFirst = false } = options;
      const icon =
        item.icon ?? (isFirst && showHomeIcon ? home : null);

      if (isCurrent) {
        return (
          <span className="dk-breadcrumbs__current" aria-current="page">
            {icon ? (
              <span className="dk-breadcrumbs__icon" aria-hidden="true">
                {icon}
              </span>
            ) : null}
            <span className="dk-breadcrumbs__text">{item.label}</span>
          </span>
        );
      }

      const classNameLink = "dk-breadcrumbs__link";
      const body = (
        <>
          {icon ? (
            <span className="dk-breadcrumbs__icon" aria-hidden="true">
              {icon}
            </span>
          ) : null}
          <span className="dk-breadcrumbs__text">{item.label}</span>
        </>
      );

      if (item.href) {
        return (
          <a
            className={classNameLink}
            href={item.href}
            onClick={() => activate(item)}
          >
            {body}
          </a>
        );
      }

      return (
        <button
          type="button"
          className={classNameLink}
          onClick={(event) => activate(item, event)}
        >
          {body}
        </button>
      );
    };

    const renderSeparator = (key: string) => (
      <li key={key} className="dk-breadcrumbs__separator" aria-hidden="true">
        {sep}
      </li>
    );

    const compactMode: "back" | "ancestor" | null = compact
      ? mobile === "back"
        ? "back"
        : "ancestor"
      : null;

    return (
      <nav
        {...rest}
        ref={ref}
        id={rootId}
        className={cx(
          "dk-breadcrumbs",
          SIZE_CLASS[size],
          compact && "dk-breadcrumbs--compact",
          compactMode && `dk-breadcrumbs--${compactMode}`,
          shouldCollapse && "dk-breadcrumbs--collapsed",
          className
        )}
        aria-label={label}
        data-size={size}
        data-collapse={shouldCollapse || undefined}
        data-mobile={compactMode ?? "full"}
      >
        {compactMode === "back" ? (
          <ol className="dk-breadcrumbs__list">
            <li className="dk-breadcrumbs__item">
              {parent ? (
                parent.href ? (
                  <a
                    className="dk-breadcrumbs__back"
                    href={parent.href}
                    onClick={() => activate(parent)}
                  >
                    <span className="dk-breadcrumbs__back-icon" aria-hidden="true">
                      <BackIcon />
                    </span>
                    <span className="dk-breadcrumbs__text">Back</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    className="dk-breadcrumbs__back"
                    onClick={(event) => activate(parent, event)}
                  >
                    <span className="dk-breadcrumbs__back-icon" aria-hidden="true">
                      <BackIcon />
                    </span>
                    <span className="dk-breadcrumbs__text">Back</span>
                  </button>
                )
              ) : (
                <span className="dk-breadcrumbs__back dk-breadcrumbs__back--disabled">
                  <span className="dk-breadcrumbs__back-icon" aria-hidden="true">
                    <BackIcon />
                  </span>
                  <span className="dk-breadcrumbs__text">Back</span>
                </span>
              )}
            </li>
            {renderSeparator("sep-back")}
            <li className="dk-breadcrumbs__item dk-breadcrumbs__item--current">
              {renderCrumb(current, { isCurrent: true })}
            </li>
          </ol>
        ) : compactMode === "ancestor" ? (
          <ol className="dk-breadcrumbs__list">
            {parent ? (
              <>
                <li className="dk-breadcrumbs__item">
                  {renderCrumb(parent, { isFirst: ancestors.length === 1 })}
                </li>
                {renderSeparator("sep-ancestor")}
              </>
            ) : null}
            <li className="dk-breadcrumbs__item dk-breadcrumbs__item--current">
              {renderCrumb(current, { isCurrent: true })}
            </li>
          </ol>
        ) : (
          <ol className="dk-breadcrumbs__list">
            {fullModeCrumbs
              ? fullModeCrumbs.map((item, index) => {
                  const isCurrent = index === fullModeCrumbs.length - 1;
                  return (
                    <React.Fragment key={item.id}>
                      {index > 0 ? renderSeparator(`sep-${item.id}`) : null}
                      <li
                        className={cx(
                          "dk-breadcrumbs__item",
                          isCurrent && "dk-breadcrumbs__item--current"
                        )}
                      >
                        {renderCrumb(item, {
                          isCurrent,
                          isFirst: index === 0,
                        })}
                      </li>
                    </React.Fragment>
                  );
                })
              : (
                <>
                  {visibleHead.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 ? renderSeparator(`sep-h-${item.id}`) : null}
                      <li className="dk-breadcrumbs__item">
                        {renderCrumb(item, { isFirst: index === 0 })}
                      </li>
                    </React.Fragment>
                  ))}

                  {hidden.length > 0 ? (
                    <>
                      {visibleHead.length > 0
                        ? renderSeparator("sep-before-overflow")
                        : null}
                      <li
                        ref={overflowRef}
                        className="dk-breadcrumbs__item dk-breadcrumbs__item--overflow"
                      >
                        <button
                          type="button"
                          className="dk-breadcrumbs__overflow"
                          aria-haspopup="menu"
                          aria-expanded={menuOpen}
                          aria-controls={menuId}
                          aria-label={`Show ${hidden.length} more levels`}
                          onClick={() => setMenuOpen((open) => !open)}
                        >
                          <span aria-hidden="true">…</span>
                        </button>
                        {menuOpen ? (
                          <ul
                            id={menuId}
                            className="dk-breadcrumbs__menu dk-scroll"
                            role="menu"
                          >
                            {hidden.map((item) => (
                              <li key={item.id} role="none">
                                {item.href ? (
                                  <a
                                    role="menuitem"
                                    className="dk-breadcrumbs__menu-item"
                                    href={item.href}
                                    onClick={() => {
                                      activate(item);
                                      setMenuOpen(false);
                                    }}
                                  >
                                    {item.label}
                                  </a>
                                ) : (
                                  <button
                                    type="button"
                                    role="menuitem"
                                    className="dk-breadcrumbs__menu-item"
                                    onClick={(event) => {
                                      activate(item, event);
                                      setMenuOpen(false);
                                    }}
                                  >
                                    {item.label}
                                  </button>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    </>
                  ) : null}

                  {visibleTail.map((item, index) => {
                    const isCurrent = index === visibleTail.length - 1;
                    return (
                      <React.Fragment key={item.id}>
                        {renderSeparator(`sep-t-${item.id}`)}
                        <li
                          className={cx(
                            "dk-breadcrumbs__item",
                            isCurrent && "dk-breadcrumbs__item--current"
                          )}
                        >
                          {renderCrumb(item, { isCurrent })}
                        </li>
                      </React.Fragment>
                    );
                  })}
                </>
              )}
          </ol>
        )}
      </nav>
    );
  }
);

Breadcrumbs.displayName = "Breadcrumbs";

export default Breadcrumbs;
