import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Context Menu — actions for a specific object, region, or selection.
 * Triggered by right/secondary click, long-press, ContextMenu/Shift+F10,
 * or controlled open from an explicit host action.
 * Not rendered in the accessibility tree when closed.
 */

export type ContextMenuPresentation = "auto" | "menu" | "sheet";

type ItemBase = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  /** When true, selecting does not close the menu. Default: false. */
  keepOpen?: boolean;
};

export type ContextMenuCommandItem = ItemBase & {
  type?: "item";
  children?: ContextMenuEntry[];
  onSelect?: () => void;
};

export type ContextMenuSeparator = {
  type: "separator";
  id?: string;
};

export type ContextMenuEntry = ContextMenuCommandItem | ContextMenuSeparator;

export type ContextMenuProps = {
  /** Contextual command collection. */
  items: ContextMenuEntry[];
  /** Contextual target (object / region). */
  children: React.ReactElement;
  /** Accessible name for the menu. */
  label: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Point to open at when using controlled open / keyboard without a pointer.
   * Defaults to the target’s center.
   */
  anchorPoint?: { x: number; y: number } | null;
  /**
   * `auto` — floating menu; sheet on narrow/coarse touch after long-press.
   * Default: `auto`.
   */
  presentation?: ContextMenuPresentation;
  /** Long-press duration for touch (ms). Default: 550. */
  longPressMs?: number;
  disabled?: boolean;
  className?: string;
  id?: string;
};

type Coords = {
  top: number;
  left: number;
  maxHeight: number;
};

type FlatRow =
  | {
      kind: "item";
      entry: ContextMenuCommandItem;
      index: number;
    }
  | { kind: "separator"; id: string };

type Level = {
  id: string;
  label: string;
  items: ContextMenuEntry[];
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function isSeparator(e: ContextMenuEntry): e is ContextMenuSeparator {
  return e.type === "separator";
}

function hasSubmenu(
  e: ContextMenuEntry
): e is ContextMenuCommandItem & { children: ContextMenuEntry[] } {
  return (
    !isSeparator(e) &&
    Array.isArray(e.children) &&
    (e.children?.length ?? 0) > 0
  );
}

function flatten(entries: ContextMenuEntry[]): FlatRow[] {
  const rows: FlatRow[] = [];
  let i = 0;
  for (const entry of entries) {
    if (isSeparator(entry)) {
      rows.push({ kind: "separator", id: entry.id ?? `sep-${i}` });
    } else {
      rows.push({ kind: "item", entry, index: i });
      i += 1;
    }
  }
  return rows;
}

function actionable(entries: ContextMenuEntry[]) {
  return entries.filter((e): e is ContextMenuCommandItem => {
    if (isSeparator(e)) return false;
    return !e.disabled;
  });
}

function usePrefersSheet(presentation: ContextMenuPresentation) {
  const [sheet, setSheet] = React.useState(presentation === "sheet");

  React.useEffect(() => {
    if (presentation === "menu") {
      setSheet(false);
      return;
    }
    if (presentation === "sheet") {
      setSheet(true);
      return;
    }
    const mqNarrow = window.matchMedia("(max-width: 479px)");
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const update = () => {
      setSheet(mqNarrow.matches || (mqCoarse.matches && window.innerWidth < 768));
    };
    update();
    mqNarrow.addEventListener("change", update);
    mqCoarse.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mqNarrow.removeEventListener("change", update);
      mqCoarse.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [presentation]);

  return sheet;
}

/** Keep the menu inside the viewport with comfortable edge padding. */
function positionAtPoint(
  x: number,
  y: number,
  size: { width: number; height: number },
  pad: number
): Coords {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left = x;
  let top = y;

  if (left + size.width + pad > vw) left = vw - size.width - pad;
  if (left < pad) left = pad;
  if (top + size.height + pad > vh) top = vh - size.height - pad;
  if (top < pad) top = pad;

  const maxHeight = Math.max(120, vh - top - pad);
  return { top, left, maxHeight };
}

function targetCenter(el: HTMLElement): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function CheckChevron({ mirrored }: { mirrored?: boolean }) {
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

const EDGE_PAD = 12;

export const ContextMenu = React.forwardRef<HTMLElement, ContextMenuProps>(
  function ContextMenu(
    {
      items,
      children,
      label,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      anchorPoint = null,
      presentation = "auto",
      longPressMs = 550,
      disabled = false,
      className = "",
      id,
    },
    forwardedRef
  ) {
    const reactId = React.useId();
    const menuId = id ?? `dk-ctx-${reactId}`;

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? Boolean(openProp) : uncontrolledOpen;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (disabled && next) return;
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [disabled, isControlled, onOpenChange]
    );

    const prefersSheet = usePrefersSheet(presentation);
    const useSheet = open && prefersSheet;

    const targetRef = React.useRef<HTMLElement | null>(null);
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const submenuRef = React.useRef<HTMLDivElement | null>(null);
    const pointRef = React.useRef({ x: 0, y: 0 });
    const longPressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const longPressOrigin = React.useRef<{ x: number; y: number } | null>(null);
    const typeaheadRef = React.useRef({
      query: "",
      timer: null as ReturnType<typeof setTimeout> | null,
    });
    const previouslyFocused = React.useRef<HTMLElement | null>(null);

    const [mounted, setMounted] = React.useState(false);
    const [coords, setCoords] = React.useState<Coords | null>(null);
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const [submenuParentId, setSubmenuParentId] = React.useState<string | null>(
      null
    );
    const [submenuCoords, setSubmenuCoords] = React.useState<{
      top: number;
      left: number;
      maxHeight: number;
    } | null>(null);
    const [sheetStack, setSheetStack] = React.useState<Level[]>([
      { id: "root", label, items },
    ]);
    const [isRtl, setIsRtl] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
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
      if (!open) {
        setSubmenuParentId(null);
        setSubmenuCoords(null);
        setActiveId(null);
        setCoords(null);
        setSheetStack([{ id: "root", label, items }]);
        return;
      }
      setSheetStack([{ id: "root", label, items }]);
    }, [open, items, label]);

    // Controlled open without a pointer event — use anchorPoint or target center
    React.useEffect(() => {
      if (!open || !targetRef.current) return;
      if (anchorPoint) {
        pointRef.current = anchorPoint;
      } else if (pointRef.current.x === 0 && pointRef.current.y === 0) {
        pointRef.current = targetCenter(targetRef.current);
      }
    }, [open, anchorPoint]);

    const currentSheet = sheetStack[sheetStack.length - 1];
    const menuItems = useSheet ? currentSheet.items : items;
    const enabled = React.useMemo(() => actionable(menuItems), [menuItems]);

    const updatePosition = React.useCallback(() => {
      const panel = panelRef.current;
      if (!panel || useSheet || typeof window === "undefined") return;
      panel.style.maxHeight = "none";
      const raw = panel.getBoundingClientRect();
      const next = positionAtPoint(
        pointRef.current.x,
        pointRef.current.y,
        { width: raw.width, height: raw.height },
        EDGE_PAD
      );
      panel.style.maxHeight = `${next.maxHeight}px`;
      setCoords(next);
    }, [useSheet]);

    React.useLayoutEffect(() => {
      if (!open || useSheet) return;
      updatePosition();
    }, [open, useSheet, menuItems, updatePosition]);

    React.useEffect(() => {
      if (!open || useSheet) return;
      const onScrollOrResize = () => updatePosition();
      window.addEventListener("resize", onScrollOrResize);
      window.addEventListener("scroll", onScrollOrResize, true);
      return () => {
        window.removeEventListener("resize", onScrollOrResize);
        window.removeEventListener("scroll", onScrollOrResize, true);
      };
    }, [open, useSheet, updatePosition]);

    React.useEffect(() => {
      if (!open) return;
      previouslyFocused.current =
        (document.activeElement as HTMLElement | null) ?? null;
      const first = enabled[0]?.id ?? null;
      setActiveId(first);
      const frame = requestAnimationFrame(() => {
        if (first) {
          panelRef.current
            ?.querySelector<HTMLElement>(`[data-dk-ctx-id="${first}"]`)
            ?.focus();
        } else {
          panelRef.current?.focus();
        }
      });
      return () => {
        cancelAnimationFrame(frame);
        const prev = previouslyFocused.current;
        if (prev && typeof prev.focus === "function") {
          prev.focus({ preventScroll: true });
        }
      };
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
      if (!useSheet) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }, [useSheet]);

    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target as Node | null;
        if (panelRef.current?.contains(target)) return;
        if (submenuRef.current?.contains(target)) return;
        // Allow re-triggering context on the same target without flicker
        if (targetRef.current?.contains(target) && event.button === 2) return;
        setOpen(false);
      };
      document.addEventListener("pointerdown", onPointerDown, true);
      return () =>
        document.removeEventListener("pointerdown", onPointerDown, true);
    }, [open, setOpen]);

    React.useEffect(
      () => () => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
      },
      []
    );

    const openAt = (x: number, y: number) => {
      if (disabled) return;
      pointRef.current = { x, y };
      setOpen(true);
    };

    const focusItem = (itemId: string | null) => {
      setActiveId(itemId);
      if (!itemId) return;
      const root = submenuParentId ? submenuRef.current : panelRef.current;
      root?.querySelector<HTMLElement>(`[data-dk-ctx-id="${itemId}"]`)?.focus();
    };

    const moveActive = (dir: 1 | -1, list: ContextMenuCommandItem[]) => {
      if (list.length === 0) return;
      const ids = list.map((e) => e.id);
      const idx = activeId ? ids.indexOf(activeId) : -1;
      const next =
        idx === -1
          ? dir === 1
            ? 0
            : ids.length - 1
          : (idx + dir + ids.length) % ids.length;
      focusItem(ids[next]);
    };

    const closeSubmenu = () => {
      setSubmenuParentId(null);
      setSubmenuCoords(null);
    };

    const openSubmenuFor = (entry: ContextMenuCommandItem, el: HTMLElement) => {
      if (!hasSubmenu(entry) || useSheet) return;
      setSubmenuParentId(entry.id);
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = 12 * 16;
      const openRight = isRtl
        ? rect.left < width + EDGE_PAD
        : rect.right + width + EDGE_PAD < vw;
      const left = openRight
        ? isRtl
          ? rect.left - width - 4
          : rect.right + 4
        : isRtl
          ? rect.right + 4
          : rect.left - width - 4;
      const top = Math.min(Math.max(rect.top, EDGE_PAD), vh - EDGE_PAD - 80);
      setSubmenuCoords({
        top,
        left: Math.min(Math.max(left, EDGE_PAD), vw - width - EDGE_PAD),
        maxHeight: Math.max(120, vh - top - EDGE_PAD),
      });
      const first = actionable(entry.children!)[0]?.id ?? null;
      requestAnimationFrame(() => focusItem(first));
    };

    const activate = (entry: ContextMenuCommandItem) => {
      if (entry.disabled) return;

      if (useSheet && hasSubmenu(entry)) {
        setSheetStack((stack) => [
          ...stack,
          { id: entry.id, label: entry.label, items: entry.children! },
        ]);
        setActiveId(actionable(entry.children!)[0]?.id ?? null);
        return;
      }

      if (!useSheet && hasSubmenu(entry)) {
        const el = panelRef.current?.querySelector<HTMLElement>(
          `[data-dk-ctx-id="${entry.id}"]`
        );
        if (el) openSubmenuFor(entry, el);
        return;
      }

      entry.onSelect?.();
      if (!entry.keepOpen) setOpen(false);
    };

    const onTypeahead = (key: string, list: ContextMenuCommandItem[]) => {
      if (key.length !== 1 || !/\S/.test(key)) return;
      const state = typeaheadRef.current;
      if (state.timer) clearTimeout(state.timer);
      state.query = (state.query + key).toLowerCase();
      state.timer = setTimeout(() => {
        state.query = "";
      }, 500);
      const match = list.find((e) =>
        e.label.toLowerCase().startsWith(state.query)
      );
      if (match) focusItem(match.id);
    };

    const submenuEntries = React.useMemo(() => {
      if (!submenuParentId) return [] as ContextMenuEntry[];
      const parent = items.find(
        (e) => !isSeparator(e) && e.id === submenuParentId
      ) as ContextMenuCommandItem | undefined;
      return parent?.children ?? [];
    }, [items, submenuParentId]);

    const submenuEnabled = React.useMemo(
      () => actionable(submenuEntries),
      [submenuEntries]
    );

    const onPanelKeyDown = (
      event: React.KeyboardEvent,
      list: ContextMenuCommandItem[],
      opts?: { isSubmenu?: boolean }
    ) => {
      const openSubKey = isRtl ? "ArrowLeft" : "ArrowRight";
      const closeSubKey = isRtl ? "ArrowRight" : "ArrowLeft";

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          moveActive(1, list);
          break;
        case "ArrowUp":
          event.preventDefault();
          moveActive(-1, list);
          break;
        case "Home":
          event.preventDefault();
          focusItem(list[0]?.id ?? null);
          break;
        case "End":
          event.preventDefault();
          focusItem(list[list.length - 1]?.id ?? null);
          break;
        case "Escape":
          event.preventDefault();
          if (opts?.isSubmenu || submenuParentId) {
            const parent = submenuParentId;
            closeSubmenu();
            if (parent) focusItem(parent);
          } else if (useSheet && sheetStack.length > 1) {
            setSheetStack((s) => s.slice(0, -1));
          } else {
            setOpen(false);
          }
          break;
        case "Enter":
        case " ": {
          event.preventDefault();
          const current = list.find((e) => e.id === activeId);
          if (current) activate(current);
          break;
        }
        case openSubKey: {
          const current = list.find((e) => e.id === activeId);
          if (current && hasSubmenu(current) && !opts?.isSubmenu) {
            event.preventDefault();
            activate(current);
          }
          break;
        }
        case closeSubKey: {
          if (opts?.isSubmenu || submenuParentId) {
            event.preventDefault();
            const parent = submenuParentId;
            closeSubmenu();
            if (parent) focusItem(parent);
          } else if (useSheet && sheetStack.length > 1) {
            event.preventDefault();
            setSheetStack((s) => s.slice(0, -1));
          }
          break;
        }
        default:
          onTypeahead(event.key, list);
      }
    };

    const child = React.Children.only(children);
    const childProps = child.props as Record<string, unknown>;

    const clearLongPress = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      longPressOrigin.current = null;
    };

    const target = React.cloneElement(child, {
      "aria-haspopup": "menu",
      "aria-expanded": open || undefined,
      "aria-controls": open ? menuId : undefined,
      ref: (node: HTMLElement | null) => {
        targetRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLElement | null>).current =
            node;
        }
        const r = (child as { ref?: React.Ref<HTMLElement> }).ref;
        if (typeof r === "function") r(node);
        else if (r && typeof r === "object") {
          (r as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      },
      onContextMenu: (event: React.MouseEvent) => {
        (childProps.onContextMenu as ((e: React.MouseEvent) => void) | undefined)?.(
          event
        );
        if (disabled || event.defaultPrevented) return;
        event.preventDefault();
        openAt(event.clientX, event.clientY);
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        (childProps.onKeyDown as ((e: React.KeyboardEvent) => void) | undefined)?.(
          event
        );
        if (disabled || event.defaultPrevented) return;
        // Keyboard equivalent — never rely on right-click alone
        if (
          event.key === "ContextMenu" ||
          (event.key === "F10" && event.shiftKey)
        ) {
          event.preventDefault();
          const el = targetRef.current;
          if (el) {
            const c = targetCenter(el);
            openAt(c.x, c.y);
          }
        }
      },
      onTouchStart: (event: React.TouchEvent) => {
        (childProps.onTouchStart as ((e: React.TouchEvent) => void) | undefined)?.(
          event
        );
        if (disabled) return;
        const touch = event.touches[0];
        if (!touch) return;
        clearLongPress();
        longPressOrigin.current = { x: touch.clientX, y: touch.clientY };
        longPressTimer.current = setTimeout(() => {
          const origin = longPressOrigin.current;
          if (!origin) return;
          openAt(origin.x, origin.y);
        }, longPressMs);
      },
      onTouchMove: (event: React.TouchEvent) => {
        (childProps.onTouchMove as ((e: React.TouchEvent) => void) | undefined)?.(
          event
        );
        const touch = event.touches[0];
        const origin = longPressOrigin.current;
        if (!touch || !origin) return;
        const dx = touch.clientX - origin.x;
        const dy = touch.clientY - origin.y;
        if (dx * dx + dy * dy > 100) clearLongPress();
      },
      onTouchEnd: (event: React.TouchEvent) => {
        (childProps.onTouchEnd as ((e: React.TouchEvent) => void) | undefined)?.(
          event
        );
        clearLongPress();
      },
      onTouchCancel: (event: React.TouchEvent) => {
        (
          childProps.onTouchCancel as ((e: React.TouchEvent) => void) | undefined
        )?.(event);
        clearLongPress();
      },
    } as Partial<typeof child.props> & { ref?: React.Ref<HTMLElement> });

    const renderRows = (entries: ContextMenuEntry[]) => {
      return flatten(entries).map((row) => {
        if (row.kind === "separator") {
          return (
            <div
              key={row.id}
              className="dk-ctx__separator"
              role="separator"
            />
          );
        }
        const entry = row.entry;
        const isActive = activeId === entry.id;
        const submenu = hasSubmenu(entry);

        return (
          <button
            key={entry.id}
            type="button"
            role="menuitem"
            tabIndex={isActive ? 0 : -1}
            data-dk-ctx-id={entry.id}
            className={cx(
              "dk-ctx__item",
              entry.destructive && "dk-ctx__item--destructive",
              entry.disabled && "dk-ctx__item--disabled",
              isActive && "dk-ctx__item--active",
              submenu && "dk-ctx__item--submenu"
            )}
            aria-disabled={entry.disabled || undefined}
            aria-haspopup={submenu ? "menu" : undefined}
            aria-expanded={
              submenu ? submenuParentId === entry.id || undefined : undefined
            }
            disabled={entry.disabled}
            onMouseEnter={(e) => {
              if (entry.disabled) return;
              setActiveId(entry.id);
              if (!useSheet && submenu) openSubmenuFor(entry, e.currentTarget);
              else if (!submenu) closeSubmenu();
            }}
            onClick={() => activate(entry)}
          >
            <span className="dk-ctx__leading" aria-hidden="true">
              {entry.icon ? (
                <span className="dk-ctx__icon">{entry.icon}</span>
              ) : (
                <span className="dk-ctx__icon-spacer" />
              )}
            </span>
            <span className="dk-ctx__label">{entry.label}</span>
            {entry.shortcut ? (
              <span className="dk-ctx__shortcut">{entry.shortcut}</span>
            ) : null}
            {submenu ? (
              <span className="dk-ctx__chevron">
                <CheckChevron mirrored={isRtl} />
              </span>
            ) : null}
          </button>
        );
      });
    };

    const panelStyle: React.CSSProperties | undefined = useSheet
      ? undefined
      : {
          top: coords?.top ?? 0,
          left: coords?.left ?? 0,
          maxHeight: coords ? `${coords.maxHeight}px` : undefined,
          visibility: coords ? "visible" : "hidden",
        };

    // Closed → nothing in the tree (a11y + DOM)
    const surface =
      mounted && open && typeof document !== "undefined"
        ? createPortal(
            <>
              {useSheet ? (
                <button
                  type="button"
                  className="dk-ctx__scrim"
                  aria-label="Dismiss"
                  onClick={() => setOpen(false)}
                />
              ) : null}

              <div
                ref={panelRef}
                id={menuId}
                role="menu"
                aria-label={useSheet ? currentSheet.label : label}
                tabIndex={-1}
                className={cx(
                  "dk-ctx",
                  useSheet ? "dk-ctx--sheet" : "dk-ctx--menu",
                  className
                )}
                data-state="open"
                style={panelStyle}
                onKeyDown={(e) =>
                  onPanelKeyDown(e, enabled, { isSubmenu: false })
                }
                onContextMenu={(e) => e.preventDefault()}
              >
                {useSheet ? (
                  <>
                    <div className="dk-ctx__sheet-handle" aria-hidden="true" />
                    <div className="dk-ctx__sheet-header">
                      {sheetStack.length > 1 ? (
                        <button
                          type="button"
                          className="dk-ctx__back"
                          aria-label="Back"
                          onClick={() => setSheetStack((s) => s.slice(0, -1))}
                        >
                          <BackIcon mirrored={isRtl} />
                        </button>
                      ) : (
                        <span className="dk-ctx__back-spacer" />
                      )}
                      <p className="dk-ctx__sheet-title">{currentSheet.label}</p>
                    </div>
                  </>
                ) : null}

                <div className="dk-ctx__list" role="none">
                  {renderRows(menuItems)}
                </div>
              </div>

              {!useSheet &&
              submenuParentId &&
              submenuCoords &&
              submenuEntries.length > 0
                ? createPortal(
                    <div
                      ref={submenuRef}
                      role="menu"
                      aria-label={
                        (
                          items.find(
                            (e) => !isSeparator(e) && e.id === submenuParentId
                          ) as ContextMenuCommandItem | undefined
                        )?.label
                      }
                      className="dk-ctx dk-ctx--menu dk-ctx--submenu"
                      style={{
                        top: submenuCoords.top,
                        left: submenuCoords.left,
                        maxHeight: `${submenuCoords.maxHeight}px`,
                      }}
                      onKeyDown={(e) =>
                        onPanelKeyDown(e, submenuEnabled, { isSubmenu: true })
                      }
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <div className="dk-ctx__list" role="none">
                        {renderRows(submenuEntries)}
                      </div>
                    </div>,
                    document.body
                  )
                : null}
            </>,
            document.body
          )
        : null;

    return (
      <>
        {target}
        {surface}
      </>
    );
  }
);

ContextMenu.displayName = "ContextMenu";

export default ContextMenu;
