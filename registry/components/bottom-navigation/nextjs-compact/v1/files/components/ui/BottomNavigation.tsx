import * as React from "react";

export type BottomNavigationSize = "sm" | "md";

/**
 * How the bar reacts when the on-screen keyboard (or other bottom chrome) opens.
 * - `hide` — leave the viewport so it cannot cover focused inputs (default)
 * - `persist` — stay visible; host must ensure inputs scroll above the bar
 * - `none` — no automatic adaptation (host owns visibility)
 */
export type BottomNavigationKeyboardBehavior = "hide" | "persist" | "none";

export interface BottomNavigationItem {
  id: string;
  /** Visible label — required; do not hide unfamiliar icons. */
  label: string;
  /** Destination icon — reinforces the label. */
  icon: React.ReactNode;
  /** Count / badge. Prefer numeric; strings for “9+”. */
  badge?: number | string;
  disabled?: boolean;
  /** Real link when navigating to a URL / route document. */
  href?: string;
}

export interface BottomNavigationProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "children" | "defaultValue" | "onChange"
  > {
  /** Accessible name for the navigation landmark. */
  label: string;
  /**
   * Primary destinations. Recommended 3–5.
   * More than 5 visible items is discouraged (`data-density="over"`).
   */
  items: BottomNavigationItem[];
  size?: BottomNavigationSize;
  /** Controlled active destination id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Apply `env(safe-area-inset-bottom)` for the home indicator. Default: true. */
  safeArea?: boolean;
  /**
   * Keyboard / bottom-inset adaptation.
   * Default: `hide` — bar yields when the visual viewport shrinks (keyboard).
   */
  keyboardBehavior?: BottomNavigationKeyboardBehavior;
  /**
   * Controlled keyboard / overlay open state.
   * When set, overrides automatic visualViewport detection.
   */
  keyboardOpen?: boolean;
  /**
   * Called when automatic keyboard detection changes.
   * Useful for hosts that pad content or dismiss sheets.
   */
  onKeyboardOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

const SIZE_CLASS: Record<BottomNavigationSize, string> = {
  sm: "dk-bottom-nav--sm",
  md: "dk-bottom-nav--md",
};

const MAX_VISIBLE = 5;
const MIN_RECOMMENDED = 3;

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatBadge(badge: number | string): string {
  if (typeof badge === "number") {
    if (badge > 99) return "99+";
    return String(badge);
  }
  return badge;
}

function detectKeyboardOpen(): boolean {
  if (typeof window === "undefined") return false;
  const vv = window.visualViewport;
  if (!vv) return false;
  /* Heuristic: keyboard (or other inset) has shrunk the visual viewport notably. */
  const inset = window.innerHeight - vv.height - vv.offsetTop;
  return inset > 120;
}

/**
 * Bottom Navigation (ID 038) — persistent primary destinations at the bottom
 * of a mobile-oriented interface.
 *
 * Distinct from Tab Bar (032): always bottom-anchored, labels stay visible,
 * keyboard-aware so it does not cover active inputs. Not a floating ornament —
 * edge-integrated with a top border separator (no shadows).
 */
export const BottomNavigation = React.forwardRef<
  HTMLElement,
  BottomNavigationProps
>(function BottomNavigation(
  {
    label,
    items,
    size = "md",
    value: valueProp,
    defaultValue,
    onValueChange,
    safeArea = true,
    keyboardBehavior = "hide",
    keyboardOpen: keyboardOpenProp,
    onKeyboardOpenChange,
    disabled = false,
    className,
    id: idProp,
    style,
    ...rest
  },
  ref
) {
  const reactId = React.useId();
  const rootId = idProp ?? `dk-bottom-nav-${reactId}`;

  const visibleItems = React.useMemo(
    () => items.slice(0, MAX_VISIBLE),
    [items]
  );

  const enabledIds = React.useMemo(
    () =>
      visibleItems
        .filter((item) => !item.disabled && !disabled)
        .map((item) => item.id),
    [visibleItems, disabled]
  );

  const firstEnabled = enabledIds[0] ?? visibleItems[0]?.id ?? "";
  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultValue ?? firstEnabled
  );
  const selected = isControlled ? String(valueProp) : uncontrolled;

  const keyboardControlled = keyboardOpenProp !== undefined;
  const [autoKeyboardOpen, setAutoKeyboardOpen] = React.useState(false);
  const keyboardOpen = keyboardControlled
    ? Boolean(keyboardOpenProp)
    : autoKeyboardOpen;

  React.useEffect(() => {
    if (keyboardControlled || keyboardBehavior === "none") return;

    const sync = () => {
      const open = detectKeyboardOpen();
      setAutoKeyboardOpen((prev) => {
        if (prev !== open) onKeyboardOpenChange?.(open);
        return open;
      });
    };

    sync();
    const vv = window.visualViewport;
    vv?.addEventListener("resize", sync);
    vv?.addEventListener("scroll", sync);
    window.addEventListener("resize", sync);
    return () => {
      vv?.removeEventListener("resize", sync);
      vv?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [keyboardControlled, keyboardBehavior, onKeyboardOpenChange]);

  const listRef = React.useRef<HTMLDivElement | null>(null);
  const yieldForKeyboard =
    keyboardBehavior === "hide" && keyboardOpen;

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
      ?.querySelector<HTMLElement>(`[data-bottom-nav-id="${safe}"]`)
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
    if (disabled || yieldForKeyboard) return;
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

  const count = visibleItems.length;
  const densityHint =
    count < MIN_RECOMMENDED ? "under" : count > MAX_VISIBLE ? "over" : "ok";
  const truncated = items.length > MAX_VISIBLE;

  return (
    <nav
      {...rest}
      ref={ref as React.Ref<HTMLElement>}
      id={rootId}
      className={cx(
        "dk-bottom-nav",
        SIZE_CLASS[size],
        safeArea && "dk-bottom-nav--safe-area",
        yieldForKeyboard && "dk-bottom-nav--keyboard-hidden",
        keyboardOpen && "dk-bottom-nav--keyboard-open",
        disabled && "dk-bottom-nav--disabled",
        className
      )}
      style={style}
      aria-label={label}
      aria-hidden={yieldForKeyboard || undefined}
      data-size={size}
      data-safe-area={safeArea || undefined}
      data-count={count}
      data-density={densityHint}
      data-truncated={truncated || undefined}
      data-keyboard-behavior={keyboardBehavior}
      data-keyboard-open={keyboardOpen || undefined}
      data-disabled={disabled || undefined}
    >
      <div
        ref={listRef}
        className="dk-bottom-nav__list"
        role="list"
        onKeyDown={onListKeyDown}
      >
        {visibleItems.map((item) => {
          const isActive = item.id === selected;
          const isDisabled = Boolean(disabled || item.disabled);
          const showBadge =
            item.badge !== undefined &&
            item.badge !== null &&
            item.badge !== "" &&
            !(typeof item.badge === "number" && item.badge <= 0);

          const sharedProps = {
            id: `${rootId}-item-${item.id}`,
            "data-bottom-nav-id": item.id,
            className: cx(
              "dk-bottom-nav__item",
              isActive && "dk-bottom-nav__item--active",
              isDisabled && "dk-bottom-nav__item--disabled"
            ),
            "aria-current": isActive ? ("page" as const) : undefined,
            "aria-disabled": isDisabled || undefined,
            "aria-label": showBadge
              ? `${item.label}, ${formatBadge(item.badge as number | string)}`
              : undefined,
            tabIndex: isDisabled || yieldForKeyboard ? -1 : isActive ? 0 : -1,
            onClick: (event: React.MouseEvent) => {
              if (isDisabled || yieldForKeyboard) {
                event.preventDefault();
                return;
              }
              commit(item.id);
            },
            onKeyDown: (event: React.KeyboardEvent) => {
              if (isDisabled || yieldForKeyboard) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                commit(item.id);
              }
            },
          };

          const content = (
            <>
              <span className="dk-bottom-nav__hit" aria-hidden="true" />
              <span className="dk-bottom-nav__icon-wrap">
                <span className="dk-bottom-nav__icon" aria-hidden="true">
                  {item.icon}
                </span>
                {showBadge ? (
                  <span className="dk-bottom-nav__badge" aria-hidden="true">
                    {formatBadge(item.badge as number | string)}
                  </span>
                ) : null}
              </span>
              <span className="dk-bottom-nav__label">{item.label}</span>
            </>
          );

          if (item.href && !isDisabled) {
            return (
              <a
                key={item.id}
                {...sharedProps}
                role="listitem"
                href={item.href}
                tabIndex={sharedProps.tabIndex}
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

BottomNavigation.displayName = "BottomNavigation";

export default BottomNavigation;
