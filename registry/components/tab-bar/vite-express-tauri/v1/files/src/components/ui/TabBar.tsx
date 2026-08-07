import * as React from "react";

export type TabBarSize = "sm" | "md";

/**
 * Where the bar sits in the application chrome:
 * - `bottom` — mobile-first persistent bottom bar (safe-area aware)
 * - `top` — desktop / large-layout primary bar
 * - `contextual` — embedded in a local shell (no sticky viewport chrome)
 * - `auto` — bottom under ~480px, top otherwise
 */
export type TabBarPlacement = "auto" | "bottom" | "top" | "contextual";

export interface TabBarItem {
  id: string;
  /** Visible label and accessible name. */
  label: string;
  /** Reinforces the label — not decoration. Required for icon-only. */
  icon?: React.ReactNode;
  /**
   * Hide the visible label. Use only when the icon meaning is unambiguous
   * in the application context. `label` remains the accessible name.
   */
  iconOnly?: boolean;
  /** Count / badge. Prefer numeric; strings for “9+”. */
  badge?: number | string;
  disabled?: boolean;
  /** When set, the item renders as a real link (browser navigation preserved). */
  href?: string;
}

export interface TabBarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "defaultValue" | "onChange"> {
  /** Accessible name for the navigation landmark. */
  label: string;
  /**
   * Primary destinations. Recommended 3–5; supported 2–5.
   * Do not overload with many unrelated actions.
   */
  items: TabBarItem[];
  size?: TabBarSize;
  placement?: TabBarPlacement;
  /** Controlled active destination id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * Apply `env(safe-area-inset-*)` padding for bottom placement.
   * Default: true when placement resolves to `bottom`.
   */
  safeArea?: boolean;
  disabled?: boolean;
}

const SIZE_CLASS: Record<TabBarSize, string> = {
  sm: "dk-tab-bar--sm",
  md: "dk-tab-bar--md",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function preferBottomPlacement(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(max-width: 479px)").matches;
}

function formatBadge(badge: number | string): string {
  if (typeof badge === "number") {
    if (badge > 99) return "99+";
    return String(badge);
  }
  return badge;
}

/**
 * Tab Bar (ID 032) — persistent primary navigation within a bounded app context.
 *
 * Related to Tabs, but for destinations — not in-page peer panels.
 * Prefer 3–5 items. Do not place unrelated actions here.
 */
export const TabBar = React.forwardRef<HTMLElement, TabBarProps>(function TabBar(
  {
    label,
    items,
    size = "md",
    placement = "auto",
    value: valueProp,
    defaultValue,
    onValueChange,
    safeArea,
    disabled = false,
    className,
    id: idProp,
    ...rest
  },
  ref
) {
  const reactId = React.useId();
  const rootId = idProp ?? `dk-tab-bar-${reactId}`;

  const [autoBottom, setAutoBottom] = React.useState(
    placement === "bottom" || (placement === "auto" && true)
  );

  React.useEffect(() => {
    if (placement !== "auto") {
      setAutoBottom(placement === "bottom");
      return;
    }
    const sync = () => setAutoBottom(preferBottomPlacement());
    sync();
    const mq = window.matchMedia("(max-width: 479px)");
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [placement]);

  const resolvedPlacement: Exclude<TabBarPlacement, "auto"> =
    placement === "auto"
      ? autoBottom
        ? "bottom"
        : "top"
      : placement;

  const applySafeArea = safeArea ?? resolvedPlacement === "bottom";

  const enabledIds = React.useMemo(
    () => items.filter((item) => !item.disabled && !disabled).map((item) => item.id),
    [items, disabled]
  );

  const firstEnabled = enabledIds[0] ?? items[0]?.id ?? "";
  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultValue ?? firstEnabled
  );
  const selected = isControlled ? String(valueProp) : uncontrolled;

  const listRef = React.useRef<HTMLDivElement | null>(null);

  const commit = (id: string) => {
    if (!enabledIds.includes(id)) return;
    if (!isControlled) setUncontrolled(id);
    onValueChange?.(id);
  };

  const focusItem = (id: string) => {
    const safe =
      typeof CSS !== "undefined" && typeof CSS.escape === "function"
        ? CSS.escape(id)
        : id.replace(/"/g, '\\"');
    listRef.current
      ?.querySelector<HTMLElement>(`[data-tab-bar-id="${safe}"]`)
      ?.focus();
  };

  const move = (direction: 1 | -1) => {
    if (enabledIds.length === 0) return;
    const index = enabledIds.indexOf(selected);
    const start = index === -1 ? 0 : index;
    const next =
      enabledIds[(start + direction + enabledIds.length) % enabledIds.length];
    if (!next) return;
    commit(next);
    focusItem(next);
  };

  const onListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rtl =
      typeof document !== "undefined" &&
      (document.documentElement.dir === "rtl" ||
        getComputedStyle(event.currentTarget).direction === "rtl");

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        move(rtl ? -1 : 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        move(rtl ? 1 : -1);
        break;
      case "Home":
        event.preventDefault();
        if (enabledIds[0]) {
          commit(enabledIds[0]);
          focusItem(enabledIds[0]);
        }
        break;
      case "End": {
        event.preventDefault();
        const last = enabledIds[enabledIds.length - 1];
        if (last) {
          commit(last);
          focusItem(last);
        }
        break;
      }
      default:
        break;
    }
  };

  const count = items.length;
  const densityHint = count < 2 ? "under" : count > 5 ? "over" : "ok";

  return (
    <nav
      {...rest}
      ref={ref as React.Ref<HTMLElement>}
      id={rootId}
      className={cx(
        "dk-tab-bar",
        SIZE_CLASS[size],
        `dk-tab-bar--${resolvedPlacement}`,
        applySafeArea && "dk-tab-bar--safe-area",
        disabled && "dk-tab-bar--disabled",
        className
      )}
      aria-label={label}
      data-size={size}
      data-placement={resolvedPlacement}
      data-safe-area={applySafeArea || undefined}
      data-count={count}
      data-density={densityHint}
      data-disabled={disabled || undefined}
    >
      <div
        ref={listRef}
        className="dk-tab-bar__list"
        role="list"
        onKeyDown={onListKeyDown}
      >
        {items.map((item) => {
          const isActive = item.id === selected;
          const isDisabled = Boolean(disabled || item.disabled);
          const showBadge =
            item.badge !== undefined &&
            item.badge !== null &&
            item.badge !== "" &&
            !(typeof item.badge === "number" && item.badge <= 0);

          const sharedProps = {
            id: `${rootId}-item-${item.id}`,
            "data-tab-bar-id": item.id,
            className: cx(
              "dk-tab-bar__item",
              isActive && "dk-tab-bar__item--active",
              isDisabled && "dk-tab-bar__item--disabled",
              item.iconOnly && "dk-tab-bar__item--icon-only"
            ),
            "aria-current": isActive ? ("page" as const) : undefined,
            "aria-disabled": isDisabled || undefined,
            "aria-label":
              showBadge || item.iconOnly
                ? showBadge
                  ? `${item.label}, ${formatBadge(item.badge as number | string)}`
                  : item.label
                : undefined,
            tabIndex: isDisabled ? -1 : isActive ? 0 : -1,
            onClick: (event: React.MouseEvent) => {
              if (isDisabled) {
                event.preventDefault();
                return;
              }
              commit(item.id);
            },
            onKeyDown: (event: React.KeyboardEvent) => {
              if (isDisabled) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                commit(item.id);
              }
            },
          };

          const content = (
            <>
              <span className="dk-tab-bar__hit" aria-hidden="true" />
              <span className="dk-tab-bar__icon-wrap">
                {item.icon ? (
                  <span className="dk-tab-bar__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                ) : null}
                {showBadge ? (
                  <span className="dk-tab-bar__badge" aria-hidden="true">
                    {formatBadge(item.badge as number | string)}
                  </span>
                ) : null}
              </span>
              {item.iconOnly ? (
                <span className="dk-tab-bar__sr-label">{item.label}</span>
              ) : (
                <span className="dk-tab-bar__label">{item.label}</span>
              )}
            </>
          );

          if (item.href && !isDisabled) {
            return (
              <a
                key={item.id}
                {...sharedProps}
                role="listitem"
                href={item.href}
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={item.id}
              {...sharedProps}
              role="listitem"
              type="button"
              disabled={isDisabled}
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
});

TabBar.displayName = "TabBar";

export default TabBar;
