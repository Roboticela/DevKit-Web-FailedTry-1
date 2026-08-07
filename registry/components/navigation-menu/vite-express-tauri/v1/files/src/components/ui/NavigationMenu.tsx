import * as React from "react";

export type NavigationMenuSize = "sm" | "md";

/**
 * Visual density for a collapsible host surface.
 * - `expanded` — labels visible (default)
 * - `collapsed` — icon-forward; labels available to assistive tech
 */
export type NavigationMenuDensity = "expanded" | "collapsed";

export interface NavigationMenuBadge {
  /** Visible badge text (e.g. `3`, `New`). */
  label: string;
  /** Optional tone hint for host styling hooks. */
  tone?: "neutral" | "accent" | "danger";
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: NavigationMenuBadge | string | number;
  disabled?: boolean;
  /** Nested children — keep ≤ 3 visible levels by default. */
  children?: NavigationMenuItem[];
  /** Start expanded when this item has children. */
  defaultExpanded?: boolean;
}

export interface NavigationMenuGroup {
  id: string;
  /** Optional section label above the group. */
  label?: string;
  items: NavigationMenuItem[];
}

export interface NavigationMenuProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Accessible name for the navigation landmark. */
  label: string;
  /** Flat item list when groups are unnecessary. */
  items?: NavigationMenuItem[];
  /** Grouped sections (preferred for primary + secondary clusters). */
  groups?: NavigationMenuGroup[];
  /** Controlled active destination id. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  size?: NavigationMenuSize;
  density?: NavigationMenuDensity;
  /**
   * Controlled expanded group/item ids (items with children).
   * When omitted, expansion is uncontrolled per item.
   */
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (expandedIds: string[]) => void;
  /** Soft warn depth — items deeper than this get a data attribute. Default: 3. */
  maxDepth?: number;
  disabled?: boolean;
}

const SIZE_CLASS: Record<NavigationMenuSize, string> = {
  sm: "dk-nav-menu--sm",
  md: "dk-nav-menu--md",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatBadge(badge: NavigationMenuBadge | string | number): {
  label: string;
  tone: string;
} {
  if (typeof badge === "number") {
    return { label: badge > 99 ? "99+" : String(badge), tone: "accent" };
  }
  if (typeof badge === "string") {
    return { label: badge, tone: "neutral" };
  }
  return { label: badge.label, tone: badge.tone ?? "neutral" };
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={cx("dk-nav-menu__chevron-icon", open && "dk-nav-menu__chevron-icon--open")}
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

function collectDefaultExpanded(items: NavigationMenuItem[], acc: string[] = []) {
  for (const item of items) {
    if (item.children?.length && item.defaultExpanded) acc.push(item.id);
    if (item.children?.length) collectDefaultExpanded(item.children, acc);
  }
  return acc;
}

function flattenGroups(
  groups: NavigationMenuGroup[] | undefined,
  items: NavigationMenuItem[] | undefined
): NavigationMenuGroup[] {
  if (groups?.length) return groups;
  if (items?.length) return [{ id: "default", items }];
  return [];
}

/**
 * Navigation Menu (ID 036) — hierarchical destinations, shell-independent.
 *
 * Do not embed a sidebar/drawer here — hosts compose those. Recommended visible
 * depth is ≤ 3 levels.
 */
export const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(
  function NavigationMenu(
    {
      label,
      items,
      groups,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      size = "md",
      density = "expanded",
      expandedIds: expandedProp,
      defaultExpandedIds,
      onExpandedChange,
      maxDepth = 3,
      disabled = false,
      className,
      id: idProp,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-nav-menu-${reactId}`;
    const resolvedGroups = React.useMemo(
      () => flattenGroups(groups, items),
      [groups, items]
    );

    const isActiveControlled = valueProp !== undefined;
    const [uncontrolledActive, setUncontrolledActive] = React.useState<string | null>(
      defaultValue
    );
    const active = isActiveControlled ? valueProp ?? null : uncontrolledActive;

    const allDefaultExpanded = React.useMemo(() => {
      if (defaultExpandedIds) return defaultExpandedIds;
      const acc: string[] = [];
      for (const group of resolvedGroups) collectDefaultExpanded(group.items, acc);
      return acc;
    }, [defaultExpandedIds, resolvedGroups]);

    const isExpandedControlled = expandedProp !== undefined;
    const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState<string[]>(
      allDefaultExpanded
    );
    const expandedIds = isExpandedControlled ? expandedProp! : uncontrolledExpanded;
    const expandedSet = React.useMemo(() => new Set(expandedIds), [expandedIds]);

    const listRef = React.useRef<HTMLDivElement | null>(null);

    const setActive = (id: string) => {
      if (disabled) return;
      if (!isActiveControlled) setUncontrolledActive(id);
      onValueChange?.(id);
    };

    const setExpanded = (next: string[]) => {
      if (!isExpandedControlled) setUncontrolledExpanded(next);
      onExpandedChange?.(next);
    };

    const toggleExpanded = (id: string) => {
      if (disabled) return;
      const next = expandedSet.has(id)
        ? expandedIds.filter((x) => x !== id)
        : [...expandedIds, id];
      setExpanded(next);
    };

    const focusById = (id: string) => {
      const safe =
        typeof CSS !== "undefined" && typeof CSS.escape === "function"
          ? CSS.escape(id)
          : id.replace(/"/g, '\\"');
      listRef.current
        ?.querySelector<HTMLElement>(`[data-nav-id="${safe}"]`)
        ?.focus();
    };

    const getFocusable = () =>
      Array.from(
        listRef.current?.querySelectorAll<HTMLElement>(
          '[data-nav-focusable="true"]:not([aria-disabled="true"])'
        ) ?? []
      );

    const onTreeKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;
      const focusables = getFocusable();
      if (focusables.length === 0) return;
      const currentIndex = focusables.indexOf(event.target as HTMLElement);
      if (currentIndex === -1) return;

      const rtl =
        typeof document !== "undefined" &&
        (document.documentElement.dir === "rtl" ||
          getComputedStyle(event.currentTarget).direction === "rtl");

      const move = (delta: number) => {
        event.preventDefault();
        const next =
          focusables[(currentIndex + delta + focusables.length) % focusables.length];
        next?.focus();
      };

      switch (event.key) {
        case "ArrowDown":
          move(1);
          break;
        case "ArrowUp":
          move(-1);
          break;
        case "Home":
          event.preventDefault();
          focusables[0]?.focus();
          break;
        case "End":
          event.preventDefault();
          focusables[focusables.length - 1]?.focus();
          break;
        case "ArrowRight": {
          event.preventDefault();
          const id = (event.target as HTMLElement).dataset.navId;
          const expandable = (event.target as HTMLElement).dataset.navExpandable === "true";
          if (!id) break;
          if (!rtl && expandable && !expandedSet.has(id)) {
            toggleExpanded(id);
          } else if (rtl && expandable && expandedSet.has(id)) {
            toggleExpanded(id);
          } else {
            move(rtl ? -1 : 1);
          }
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          const id = (event.target as HTMLElement).dataset.navId;
          const expandable = (event.target as HTMLElement).dataset.navExpandable === "true";
          if (!id) break;
          if (!rtl && expandable && expandedSet.has(id)) {
            toggleExpanded(id);
          } else if (rtl && expandable && !expandedSet.has(id)) {
            toggleExpanded(id);
          } else {
            move(rtl ? 1 : -1);
          }
          break;
        }
        case "Enter":
        case " ": {
          const target = event.target as HTMLElement;
          const expandable = target.dataset.navExpandable === "true";
          const id = target.dataset.navId;
          if (expandable && id && !target.dataset.navHref) {
            event.preventDefault();
            toggleExpanded(id);
          }
          break;
        }
        case "Escape": {
          const id = (event.target as HTMLElement).dataset.navParent;
          if (id && expandedSet.has(id)) {
            event.preventDefault();
            toggleExpanded(id);
            focusById(id);
          }
          break;
        }
        default:
          break;
      }
    };

    const renderItem = (
      item: NavigationMenuItem,
      depth: number,
      parentId?: string
    ): React.ReactNode => {
      const hasChildren = Boolean(item.children?.length);
      const isExpanded = hasChildren && expandedSet.has(item.id);
      const isActive = active === item.id;
      const isDisabled = Boolean(disabled || item.disabled);
      const badge = item.badge != null ? formatBadge(item.badge) : null;
      const overDepth = depth > maxDepth;

      const shared = {
        id: `${rootId}-item-${item.id}`,
        "data-nav-id": item.id,
        "data-nav-focusable": "true" as const,
        "data-nav-expandable": hasChildren ? ("true" as const) : undefined,
        "data-nav-parent": parentId,
        "data-nav-href": item.href,
        "data-depth": depth,
        "data-over-depth": overDepth || undefined,
        className: cx(
          "dk-nav-menu__item",
          isActive && "dk-nav-menu__item--active",
          isDisabled && "dk-nav-menu__item--disabled",
          hasChildren && "dk-nav-menu__item--branch",
          isExpanded && "dk-nav-menu__item--expanded"
        ),
        title: item.label,
        "aria-current": isActive ? ("page" as const) : undefined,
        "aria-disabled": isDisabled || undefined,
        "aria-expanded": hasChildren ? isExpanded : undefined,
        tabIndex: isDisabled ? -1 : 0,
        onClick: (event: React.MouseEvent) => {
          if (isDisabled) {
            event.preventDefault();
            return;
          }
          if (hasChildren && !item.href) {
            toggleExpanded(item.id);
            return;
          }
          setActive(item.id);
        },
      };

      const content = (
        <>
          <span className="dk-nav-menu__hit" aria-hidden="true" />
          {item.icon ? (
            <span className="dk-nav-menu__icon" aria-hidden="true">
              {item.icon}
            </span>
          ) : (
            <span className="dk-nav-menu__icon dk-nav-menu__icon--spacer" aria-hidden="true" />
          )}
          <span className="dk-nav-menu__label">{item.label}</span>
          {badge ? (
            <span
              className={cx(
                "dk-nav-menu__badge",
                `dk-nav-menu__badge--${badge.tone}`
              )}
              aria-label={`${badge.label}`}
            >
              {badge.label}
            </span>
          ) : null}
          {hasChildren ? (
            <span className="dk-nav-menu__chevron" aria-hidden="true">
              <ChevronIcon open={Boolean(isExpanded)} />
            </span>
          ) : null}
        </>
      );

      return (
        <li
          key={item.id}
          className={cx(
            "dk-nav-menu__node",
            `dk-nav-menu__node--depth-${Math.min(depth, 4)}`
          )}
          role="none"
        >
          {item.href && !isDisabled ? (
            <a {...shared} href={item.href} role="treeitem">
              {content}
            </a>
          ) : (
            <button {...shared} type="button" role="treeitem" disabled={isDisabled}>
              {content}
            </button>
          )}

          {hasChildren && isExpanded ? (
            <ul
              className="dk-nav-menu__sublist"
              role="group"
              aria-label={item.label}
            >
              {item.children!.map((child) =>
                renderItem(child, depth + 1, item.id)
              )}
            </ul>
          ) : null}
        </li>
      );
    };

    return (
      <nav
        {...rest}
        ref={ref}
        id={rootId}
        className={cx(
          "dk-nav-menu",
          SIZE_CLASS[size],
          `dk-nav-menu--${density}`,
          disabled && "dk-nav-menu--disabled",
          className
        )}
        aria-label={label}
        data-size={size}
        data-density={density}
        data-disabled={disabled || undefined}
      >
        <div
          ref={listRef}
          className="dk-nav-menu__scroll dk-scroll"
          onKeyDown={onTreeKeyDown}
        >
          {resolvedGroups.map((group) => (
            <div key={group.id} className="dk-nav-menu__group">
              {group.label && density === "expanded" ? (
                <p className="dk-nav-menu__section" id={`${rootId}-section-${group.id}`}>
                  {group.label}
                </p>
              ) : null}
              <ul
                className="dk-nav-menu__list"
                role="tree"
                aria-labelledby={
                  group.label && density === "expanded"
                    ? `${rootId}-section-${group.id}`
                    : undefined
                }
                aria-label={!group.label ? label : undefined}
              >
                {group.items.map((item) => renderItem(item, 1))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    );
  }
);

NavigationMenu.displayName = "NavigationMenu";

export default NavigationMenu;
