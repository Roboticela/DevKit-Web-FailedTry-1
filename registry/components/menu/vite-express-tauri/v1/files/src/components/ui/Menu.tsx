import * as React from "react";

/**
 * Menu — generalized accessible collection for structured commands/options.
 * Foundation for Dropdown Menu, Context Menu, and other command surfaces.
 *
 * Does NOT position itself. Parents supply `style` / layout (fixed coords, sheet, etc.).
 */

export type MenuSize = "sm" | "md" | "lg";

type ItemBase = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  /** Visually secondary to the command name. */
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  /** Keep the menu open after activation. Default: false. */
  keepOpen?: boolean;
};

export type MenuCommandItem = ItemBase & {
  type?: "item";
  children?: MenuEntry[];
  onSelect?: () => void;
};

export type MenuCheckboxItem = ItemBase & {
  type: "checkbox";
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export type MenuRadioItem = ItemBase & {
  type: "radio";
  name: string;
  checked?: boolean;
  onSelect?: () => void;
};

export type MenuSeparator = {
  type: "separator";
  id?: string;
};

/** Non-interactive group heading. */
export type MenuGroupLabel = {
  type: "label";
  id: string;
  label: string;
};

export type MenuEntry =
  | MenuCommandItem
  | MenuCheckboxItem
  | MenuRadioItem
  | MenuSeparator
  | MenuGroupLabel;

export type MenuSubmenuRequest = {
  parentId: string;
  label: string;
  items: MenuEntry[];
  trigger: HTMLElement;
};

export type MenuProps = {
  items: MenuEntry[];
  /** Accessible name (`aria-label`). */
  label: string;
  size?: MenuSize;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  /** Focus first enabled item on mount. Default: true. */
  autoFocus?: boolean;
  /** Wrap arrow navigation. Default: true. */
  loop?: boolean;
  /**
   * `defer` — parent positions a flyout Menu via `onSubmenuOpen` (default).
   * `inline` — push a nested level inside this Menu (sheet-friendly).
   */
  submenuMode?: "defer" | "inline";
  openSubmenuId?: string | null;
  onSubmenuOpen?: (request: MenuSubmenuRequest) => void;
  onSubmenuClose?: () => void;
  /** Escape / close request (parent dismisses the overlay). */
  onClose?: () => void;
  /** After a leaf activation (before keepOpen check). */
  onAction?: (
    item: MenuCommandItem | MenuCheckboxItem | MenuRadioItem
  ) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function isMenuSeparator(e: MenuEntry): e is MenuSeparator {
  return e.type === "separator";
}

export function isMenuGroupLabel(e: MenuEntry): e is MenuGroupLabel {
  return e.type === "label";
}

export function isMenuCheckbox(e: MenuEntry): e is MenuCheckboxItem {
  return e.type === "checkbox";
}

export function isMenuRadio(e: MenuEntry): e is MenuRadioItem {
  return e.type === "radio";
}

export function isMenuCommand(e: MenuEntry): e is MenuCommandItem {
  return (
    !isMenuSeparator(e) &&
    !isMenuGroupLabel(e) &&
    e.type !== "checkbox" &&
    e.type !== "radio"
  );
}

export function menuHasSubmenu(
  e: MenuEntry
): e is MenuCommandItem & { children: MenuEntry[] } {
  return (
    isMenuCommand(e) &&
    Array.isArray(e.children) &&
    (e.children?.length ?? 0) > 0
  );
}

export function menuActionableItems(entries: MenuEntry[]) {
  return entries.filter(
    (e): e is MenuCommandItem | MenuCheckboxItem | MenuRadioItem => {
      if (isMenuSeparator(e) || isMenuGroupLabel(e)) return false;
      return !e.disabled;
    }
  );
}

type Level = { id: string; label: string; items: MenuEntry[] };

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M5 10.5l3.5 3.5L15 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ mirrored }: { mirrored?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="16"
      height="16"
      fill="none"
      aria-hidden="true"
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M7.5 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackIcon({ mirrored }: { mirrored?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="16"
      height="16"
      fill="none"
      aria-hidden="true"
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M12.5 5l-5 5 5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SIZE_CLASS: Record<MenuSize, string> = {
  sm: "dk-menu--sm",
  md: "dk-menu--md",
  lg: "dk-menu--lg",
};

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  function Menu(
    {
      items,
      label,
      size = "md",
      className = "",
      style,
      id,
      autoFocus = true,
      loop = true,
      submenuMode = "defer",
      openSubmenuId = null,
      onSubmenuOpen,
      onSubmenuClose,
      onClose,
      onAction,
    },
    forwardedRef
  ) {
    const reactId = React.useId();
    const menuId = id ?? `dk-menu-${reactId}`;
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const typeaheadRef = React.useRef({
      query: "",
      timer: null as ReturnType<typeof setTimeout> | null,
    });

    const [isRtl, setIsRtl] = React.useState(false);
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const [stack, setStack] = React.useState<Level[]>([
      { id: "root", label, items },
    ]);

    React.useEffect(() => {
      const updateRtl = () =>
        setIsRtl(document.documentElement.getAttribute("dir") === "rtl");
      updateRtl();
      const obs = new MutationObserver(updateRtl);
      obs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["dir"],
      });
      return () => obs.disconnect();
    }, []);

    React.useEffect(() => {
      setStack([{ id: "root", label, items }]);
    }, [items, label]);

    const current = stack[stack.length - 1];
    const enabled = React.useMemo(
      () => menuActionableItems(current.items),
      [current.items]
    );

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
        }
      },
      [forwardedRef]
    );

    const focusItem = React.useCallback((itemId: string | null) => {
      setActiveId(itemId);
      if (!itemId || !rootRef.current) return;
      rootRef.current
        .querySelector<HTMLElement>(`[data-dk-menu-id="${itemId}"]`)
        ?.focus();
    }, []);

    React.useEffect(() => {
      if (!autoFocus) return;
      const first = enabled[0]?.id ?? null;
      const frame = requestAnimationFrame(() => {
        if (first) focusItem(first);
        else rootRef.current?.focus();
      });
      return () => cancelAnimationFrame(frame);
    }, [autoFocus, current.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const moveActive = (dir: 1 | -1) => {
      if (enabled.length === 0) return;
      const ids = enabled.map((e) => e.id);
      const idx = activeId ? ids.indexOf(activeId) : -1;
      let next: number;
      if (idx === -1) {
        next = dir === 1 ? 0 : ids.length - 1;
      } else if (loop) {
        next = (idx + dir + ids.length) % ids.length;
      } else {
        next = Math.min(Math.max(idx + dir, 0), ids.length - 1);
      }
      focusItem(ids[next]);
    };

    const openSubmenu = (
      entry: MenuCommandItem & { children: MenuEntry[] },
      trigger: HTMLElement
    ) => {
      if (submenuMode === "inline") {
        setStack((s) => [
          ...s,
          { id: entry.id, label: entry.label, items: entry.children },
        ]);
        const first = menuActionableItems(entry.children)[0]?.id ?? null;
        requestAnimationFrame(() => focusItem(first));
        return;
      }
      onSubmenuOpen?.({
        parentId: entry.id,
        label: entry.label,
        items: entry.children,
        trigger,
      });
    };

    const activate = (
      entry: MenuCommandItem | MenuCheckboxItem | MenuRadioItem,
      trigger?: HTMLElement | null
    ) => {
      if (entry.disabled) return;

      if (menuHasSubmenu(entry)) {
        const el =
          trigger ??
          rootRef.current?.querySelector<HTMLElement>(
            `[data-dk-menu-id="${entry.id}"]`
          );
        if (el) openSubmenu(entry, el);
        return;
      }

      if (isMenuCheckbox(entry)) {
        entry.onCheckedChange?.(!entry.checked);
        onAction?.(entry);
        if (!entry.keepOpen) onClose?.();
        return;
      }

      if (isMenuRadio(entry)) {
        entry.onSelect?.();
        onAction?.(entry);
        if (!entry.keepOpen) onClose?.();
        return;
      }

      entry.onSelect?.();
      onAction?.(entry);
      if (!entry.keepOpen) onClose?.();
    };

    const onTypeahead = (key: string) => {
      if (key.length !== 1 || !/\S/.test(key)) return;
      const state = typeaheadRef.current;
      if (state.timer) clearTimeout(state.timer);
      state.query = (state.query + key).toLowerCase();
      state.timer = setTimeout(() => {
        state.query = "";
      }, 500);
      const match = enabled.find((e) =>
        e.label.toLowerCase().startsWith(state.query)
      );
      if (match) focusItem(match.id);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const openSubKey = isRtl ? "ArrowLeft" : "ArrowRight";
      const closeSubKey = isRtl ? "ArrowRight" : "ArrowLeft";

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          moveActive(1);
          break;
        case "ArrowUp":
          event.preventDefault();
          moveActive(-1);
          break;
        case "Home":
          event.preventDefault();
          focusItem(enabled[0]?.id ?? null);
          break;
        case "End":
          event.preventDefault();
          focusItem(enabled[enabled.length - 1]?.id ?? null);
          break;
        case "Escape":
          event.preventDefault();
          if (submenuMode === "inline" && stack.length > 1) {
            setStack((s) => s.slice(0, -1));
            return;
          }
          if (openSubmenuId) {
            onSubmenuClose?.();
            if (openSubmenuId) focusItem(openSubmenuId);
            return;
          }
          onClose?.();
          break;
        case "Enter":
        case " ": {
          event.preventDefault();
          const currentItem = enabled.find((e) => e.id === activeId);
          if (currentItem) activate(currentItem);
          break;
        }
        case openSubKey: {
          const currentItem = enabled.find((e) => e.id === activeId);
          if (currentItem && menuHasSubmenu(currentItem)) {
            event.preventDefault();
            activate(currentItem);
          }
          break;
        }
        case closeSubKey: {
          if (submenuMode === "inline" && stack.length > 1) {
            event.preventDefault();
            setStack((s) => s.slice(0, -1));
          } else if (openSubmenuId) {
            event.preventDefault();
            onSubmenuClose?.();
            focusItem(openSubmenuId);
          }
          break;
        }
        default:
          onTypeahead(event.key);
      }
    };

    return (
      <div
        ref={setRefs}
        id={menuId}
        role="menu"
        aria-label={current.label}
        tabIndex={-1}
        className={cx("dk-menu", SIZE_CLASS[size], className)}
        style={style}
        data-size={size}
        data-submenu-mode={submenuMode}
        onKeyDown={onKeyDown}
      >
        {submenuMode === "inline" && stack.length > 1 ? (
          <div className="dk-menu__level-header">
            <button
              type="button"
              className="dk-menu__back"
              aria-label="Back"
              onClick={() => setStack((s) => s.slice(0, -1))}
            >
              <BackIcon mirrored={isRtl} />
            </button>
            <p className="dk-menu__level-title">{current.label}</p>
          </div>
        ) : null}

        <div className="dk-menu__list" role="none">
          {current.items.map((entry, index) => {
            if (isMenuSeparator(entry)) {
              return (
                <div
                  key={entry.id ?? `sep-${index}`}
                  className="dk-menu__separator"
                  role="separator"
                />
              );
            }

            if (isMenuGroupLabel(entry)) {
              return (
                <div
                  key={entry.id}
                  className="dk-menu__group-label"
                  role="presentation"
                  id={`${menuId}-${entry.id}`}
                >
                  {entry.label}
                </div>
              );
            }

            const isActive = activeId === entry.id;
            const submenu = menuHasSubmenu(entry);
            const checked = isMenuCheckbox(entry)
              ? Boolean(entry.checked)
              : isMenuRadio(entry)
                ? Boolean(entry.checked)
                : false;
            const role = isMenuCheckbox(entry)
              ? "menuitemcheckbox"
              : isMenuRadio(entry)
                ? "menuitemradio"
                : "menuitem";

            return (
              <button
                key={entry.id}
                type="button"
                role={role}
                tabIndex={isActive ? 0 : -1}
                data-dk-menu-id={entry.id}
                className={cx(
                  "dk-menu__item",
                  entry.destructive && "dk-menu__item--destructive",
                  entry.disabled && "dk-menu__item--disabled",
                  isActive && "dk-menu__item--active",
                  checked && "dk-menu__item--selected",
                  submenu && "dk-menu__item--submenu"
                )}
                aria-disabled={entry.disabled || undefined}
                aria-checked={
                  isMenuCheckbox(entry) || isMenuRadio(entry)
                    ? checked
                    : undefined
                }
                aria-haspopup={submenu ? "menu" : undefined}
                aria-expanded={
                  submenu
                    ? openSubmenuId === entry.id ||
                      (submenuMode === "inline" &&
                        stack.some((l) => l.id === entry.id)) ||
                      undefined
                    : undefined
                }
                disabled={entry.disabled}
                onMouseEnter={(e) => {
                  if (entry.disabled) return;
                  setActiveId(entry.id);
                  if (submenuMode === "defer" && submenu) {
                    openSubmenu(entry, e.currentTarget);
                  } else if (submenuMode === "defer" && !submenu) {
                    onSubmenuClose?.();
                  }
                }}
                onClick={(e) => activate(entry, e.currentTarget)}
              >
                <span
                  className="dk-menu__cue"
                  aria-hidden="true"
                  data-active={isActive || undefined}
                  data-selected={checked || undefined}
                />

                <span className="dk-menu__leading" aria-hidden="true">
                  {isMenuCheckbox(entry) || isMenuRadio(entry) ? (
                    <span
                      className={cx(
                        "dk-menu__indicator",
                        isMenuRadio(entry) && "dk-menu__indicator--radio",
                        checked && "dk-menu__indicator--on"
                      )}
                    >
                      {checked ? <CheckIcon /> : null}
                    </span>
                  ) : entry.icon ? (
                    <span className="dk-menu__icon">{entry.icon}</span>
                  ) : (
                    <span className="dk-menu__icon-spacer" />
                  )}
                </span>

                <span className="dk-menu__label">{entry.label}</span>

                {entry.shortcut ? (
                  <kbd className="dk-menu__shortcut">{entry.shortcut}</kbd>
                ) : null}

                {submenu ? (
                  <span className="dk-menu__chevron" aria-hidden="true">
                    <ChevronIcon mirrored={isRtl} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

Menu.displayName = "Menu";

export default Menu;
