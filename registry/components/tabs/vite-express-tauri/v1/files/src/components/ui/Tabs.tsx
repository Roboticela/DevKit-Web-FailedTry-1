import * as React from "react";

export type TabsSize = "sm" | "md" | "lg";

/**
 * Active indicator treatment (never color alone):
 * - `underline` — bottom edge mark (default)
 * - `surface` — filled track segment
 * - `pill` — rounded selected chip within the list
 */
export type TabsIndicator = "underline" | "surface" | "pill";

/**
 * - `automatic` — focus move also activates (arrow keys select)
 * - `manual` — arrow keys move focus; Enter / Space activates
 */
export type TabsActivation = "automatic" | "manual";

/**
 * - `scroll` (default) — single row with horizontal scroll on narrow viewports
 * - `wrap` — explicit multi-row wrap (never the default)
 */
export type TabsOverflow = "scroll" | "wrap";

export interface TabsItem {
  id: string;
  /** Visible label and accessible name. */
  label: string;
  icon?: React.ReactNode;
  /**
   * Icon-only tab. Use only when meaning is unambiguous.
   * `label` remains the accessible name.
   */
  iconOnly?: boolean;
  disabled?: boolean;
  /** Shows an inline spinner; tab stays focusable but cannot activate. */
  loading?: boolean;
  /** Panel content when using the `items` API. */
  panel?: React.ReactNode;
}

export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
  /** Accessible name for the tab list. */
  label: string;
  items: TabsItem[];
  size?: TabsSize;
  indicator?: TabsIndicator;
  activation?: TabsActivation;
  overflow?: TabsOverflow;
  /** Controlled active tab id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

const SIZE_CLASS: Record<TabsSize, string> = {
  sm: "dk-tabs--sm",
  md: "dk-tabs--md",
  lg: "dk-tabs--lg",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function LoadingSpinner() {
  return (
    <span className="dk-tabs__spinner" aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none">
        <circle
          cx="8"
          cy="8"
          r="5.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray="22 12"
        />
      </svg>
    </span>
  );
}

/**
 * Tabs (ID 031) — switch between a small set of related peer views.
 *
 * Not for unrelated destinations or large navigation structures.
 * Prefer horizontal scrolling on narrow screens over shrinking labels.
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    label,
    items,
    size = "md",
    indicator = "underline",
    activation = "automatic",
    overflow = "scroll",
    value: valueProp,
    defaultValue,
    onValueChange,
    disabled = false,
    fullWidth = true,
    className,
    id: idProp,
    ...rest
  },
  ref
) {
  const reactId = React.useId();
  const rootId = idProp ?? `dk-tabs-${reactId}`;
  const listId = `${rootId}-list`;

  const enabledIds = React.useMemo(
    () =>
      items
        .filter((item) => !item.disabled && !item.loading && !disabled)
        .map((item) => item.id),
    [items, disabled]
  );

  const firstEnabled = enabledIds[0] ?? items[0]?.id ?? "";
  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultValue ?? firstEnabled
  );
  const selected = isControlled ? String(valueProp) : uncontrolled;

  const [focusedId, setFocusedId] = React.useState(selected);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (enabledIds.includes(selected)) {
      setFocusedId(selected);
      return;
    }
    if (firstEnabled) {
      if (!isControlled) setUncontrolled(firstEnabled);
      setFocusedId(firstEnabled);
    }
  }, [selected, enabledIds, firstEnabled, isControlled]);

  const commit = (id: string) => {
    if (!enabledIds.includes(id)) return;
    if (!isControlled) setUncontrolled(id);
    onValueChange?.(id);
  };

  const focusTab = (id: string) => {
    setFocusedId(id);
    const safe =
      typeof CSS !== "undefined" && typeof CSS.escape === "function"
        ? CSS.escape(id)
        : id.replace(/"/g, '\\"');
    listRef.current
      ?.querySelector<HTMLElement>(`[data-tab-id="${safe}"]`)
      ?.focus();
  };

  const moveFocus = (direction: 1 | -1) => {
    if (enabledIds.length === 0) return;
    const current = enabledIds.includes(focusedId) ? focusedId : selected;
    const index = enabledIds.indexOf(current);
    const start = index === -1 ? 0 : index;
    const next =
      enabledIds[(start + direction + enabledIds.length) % enabledIds.length];
    if (!next) return;
    focusTab(next);
    if (activation === "automatic") commit(next);
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
        moveFocus(rtl ? -1 : 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveFocus(rtl ? 1 : -1);
        break;
      case "Home":
        event.preventDefault();
        if (enabledIds[0]) {
          focusTab(enabledIds[0]);
          if (activation === "automatic") commit(enabledIds[0]);
        }
        break;
      case "End": {
        event.preventDefault();
        const last = enabledIds[enabledIds.length - 1];
        if (last) {
          focusTab(last);
          if (activation === "automatic") commit(last);
        }
        break;
      }
      case "Enter":
      case " ":
        if (activation === "manual") {
          event.preventDefault();
          commit(focusedId);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      {...rest}
      ref={ref}
      id={rootId}
      className={cx(
        "dk-tabs",
        SIZE_CLASS[size],
        fullWidth && "dk-tabs--full",
        disabled && "dk-tabs--disabled",
        `dk-tabs--indicator-${indicator}`,
        `dk-tabs--overflow-${overflow}`,
        `dk-tabs--activation-${activation}`,
        className
      )}
      data-size={size}
      data-indicator={indicator}
      data-overflow={overflow}
      data-activation={activation}
      data-disabled={disabled || undefined}
    >
      <div
        className={cx(
          "dk-tabs__viewport",
          overflow === "scroll" && "dk-scroll dk-scroll--x"
        )}
      >
        <div
          ref={listRef}
          id={listId}
          className="dk-tabs__list"
          role="tablist"
          aria-label={label}
          aria-orientation="horizontal"
          onKeyDown={onListKeyDown}
        >
          {items.map((item) => {
            const isSelected = item.id === selected;
            const isFocusable =
              !disabled &&
              (item.id === focusedId ||
                (focusedId === selected && item.id === selected) ||
                (!enabledIds.includes(focusedId) && item.id === firstEnabled));
            const tabDisabled = Boolean(disabled || item.disabled);
            const cannotActivate = tabDisabled || Boolean(item.loading);

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`${rootId}-tab-${item.id}`}
                data-tab-id={item.id}
                className={cx(
                  "dk-tabs__tab",
                  isSelected && "dk-tabs__tab--active",
                  tabDisabled && "dk-tabs__tab--disabled",
                  item.loading && "dk-tabs__tab--loading",
                  item.iconOnly && "dk-tabs__tab--icon-only"
                )}
                aria-selected={isSelected}
                aria-controls={`${rootId}-panel-${item.id}`}
                aria-disabled={cannotActivate || undefined}
                disabled={tabDisabled}
                tabIndex={isFocusable && !tabDisabled ? 0 : -1}
                onClick={() => {
                  if (cannotActivate) return;
                  commit(item.id);
                  setFocusedId(item.id);
                }}
                onFocus={() => setFocusedId(item.id)}
              >
                <span className="dk-tabs__tab-hit" aria-hidden="true" />
                {item.icon ? (
                  <span className="dk-tabs__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                ) : null}
                {item.iconOnly ? (
                  <span className="dk-tabs__sr-label">{item.label}</span>
                ) : (
                  <span className="dk-tabs__label">{item.label}</span>
                )}
                {item.loading ? <LoadingSpinner /> : null}
              </button>
            );
          })}
        </div>
      </div>

      {items.map((item) => {
        const isActive = item.id === selected;
        return (
          <div
            key={item.id}
            id={`${rootId}-panel-${item.id}`}
            role="tabpanel"
            className={cx(
              "dk-tabs__panel",
              isActive && "dk-tabs__panel--active"
            )}
            aria-labelledby={`${rootId}-tab-${item.id}`}
            hidden={!isActive}
            tabIndex={isActive ? 0 : undefined}
          >
            {isActive ? item.panel : null}
          </div>
        );
      })}
    </div>
  );
});

Tabs.displayName = "Tabs";

export default Tabs;
