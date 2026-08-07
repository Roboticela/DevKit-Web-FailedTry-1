import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Dropdown Menu — command-oriented action collection anchored to a trigger.
 * Not a generic form container. On narrow/coarse pointers, adapts to a sheet.
 */

export type DropdownMenuPresentation = "auto" | "menu" | "sheet";

export type DropdownMenuAlign = "start" | "end";

type ItemBase = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  /** Visually distinct — calm, not alarming. */
  destructive?: boolean;
};

export type DropdownMenuCommandItem = ItemBase & {
  type?: "item";
  /** Nested submenu entries. */
  children?: DropdownMenuEntry[];
  onSelect?: () => void;
};

export type DropdownMenuCheckboxItem = ItemBase & {
  type: "checkbox";
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export type DropdownMenuRadioItem = ItemBase & {
  type: "radio";
  /** Radio group id — only one checked per name. */
  name: string;
  checked?: boolean;
  onSelect?: () => void;
};

export type DropdownMenuSeparator = {
  type: "separator";
  id?: string;
};

export type DropdownMenuEntry =
  | DropdownMenuCommandItem
  | DropdownMenuCheckboxItem
  | DropdownMenuRadioItem
  | DropdownMenuSeparator;

export type DropdownMenuProps = {
  /** Command collection. Use separators sparingly between meaningful groups. */
  items: DropdownMenuEntry[];
  /** Trigger control (button, etc.). */
  children: React.ReactElement;
  /** Accessible name for the menu. */
  label: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * `auto` — menu on desktop / pointer; sheet on narrow touch viewports.
   * Default: `auto`.
   */
  presentation?: DropdownMenuPresentation;
  /** Menu alignment relative to trigger. Default: `end`. */
  align?: DropdownMenuAlign;
  disabled?: boolean;
  className?: string;
  id?: string;
};

type Side = "top" | "bottom";

type Coords = {
  top: number;
  left: number;
  side: Side;
  maxHeight: number;
};

type FlatRow =
  | { kind: "item"; entry: Exclude<DropdownMenuEntry, DropdownMenuSeparator>; index: number }
  | { kind: "separator"; id: string };

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function isSeparator(e: DropdownMenuEntry): e is DropdownMenuSeparator {
  return e.type === "separator";
}

function isCheckbox(e: DropdownMenuEntry): e is DropdownMenuCheckboxItem {
  return e.type === "checkbox";
}

function isRadio(e: DropdownMenuEntry): e is DropdownMenuRadioItem {
  return e.type === "radio";
}

function hasSubmenu(
  e: DropdownMenuEntry
): e is DropdownMenuCommandItem & { children: DropdownMenuEntry[] } {
  return (
    !isSeparator(e) &&
    e.type !== "checkbox" &&
    e.type !== "radio" &&
    Array.isArray((e as DropdownMenuCommandItem).children) &&
    ((e as DropdownMenuCommandItem).children?.length ?? 0) > 0
  );
}

function usePrefersSheet(presentation: DropdownMenuPresentation) {
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

function flatten(entries: DropdownMenuEntry[]): FlatRow[] {
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

function actionableEntries(entries: DropdownMenuEntry[]) {
  return entries.filter((e): e is Exclude<DropdownMenuEntry, DropdownMenuSeparator> => {
    if (isSeparator(e)) return false;
    return !e.disabled;
  });
}

function computeMenuPosition(
  trigger: DOMRect,
  panel: { width: number; height: number },
  align: DropdownMenuAlign,
  pad: number,
  isRtl: boolean
): Coords {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gap = 4;
  const spaceBelow = vh - trigger.bottom - gap - pad;
  const spaceAbove = trigger.top - gap - pad;
  const side: Side =
    spaceBelow >= Math.min(panel.height, 160) || spaceBelow >= spaceAbove
      ? "bottom"
      : "top";

  const maxHeight =
    side === "bottom"
      ? Math.max(120, spaceBelow)
      : Math.max(120, spaceAbove);

  let left =
    align === "end"
      ? isRtl
        ? trigger.left
        : trigger.right - panel.width
      : isRtl
        ? trigger.right - panel.width
        : trigger.left;

  left = Math.min(Math.max(left, pad), Math.max(pad, vw - panel.width - pad));
  const top =
    side === "bottom"
      ? trigger.bottom + gap
      : Math.max(pad, trigger.top - Math.min(panel.height, maxHeight) - gap);

  return { top, left, side, maxHeight };
}

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

type Level = {
  id: string;
  label: string;
  items: DropdownMenuEntry[];
};

export const DropdownMenu = React.forwardRef<HTMLSpanElement, DropdownMenuProps>(
  function DropdownMenu(
    {
      items,
      children,
      label,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      presentation = "auto",
      align = "end",
      disabled = false,
      className = "",
      id,
    },
    forwardedRef
  ) {
    const reactId = React.useId();
    const menuId = id ?? `dk-ddm-${reactId}`;

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

    const anchorRef = React.useRef<HTMLSpanElement | null>(null);
    const triggerElRef = React.useRef<HTMLElement | null>(null);
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const submenuRef = React.useRef<HTMLDivElement | null>(null);
    const typeaheadRef = React.useRef({ query: "", timer: null as ReturnType<typeof setTimeout> | null });

    const [mounted, setMounted] = React.useState(false);
    const [coords, setCoords] = React.useState<Coords | null>(null);
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const [submenuParentId, setSubmenuParentId] = React.useState<string | null>(null);
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
        setSheetStack([{ id: "root", label, items }]);
        return;
      }
      setSheetStack([{ id: "root", label, items }]);
    }, [open, items, label]);

    const currentSheet = sheetStack[sheetStack.length - 1];
    const menuItems = useSheet ? currentSheet.items : items;
    const flat = React.useMemo(() => flatten(menuItems), [menuItems]);
    const enabled = React.useMemo(
      () => actionableEntries(menuItems),
      [menuItems]
    );

    const updatePosition = React.useCallback(() => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor || !panel || useSheet || typeof window === "undefined") return;
      const tRect = anchor.getBoundingClientRect();
      panel.style.maxHeight = "none";
      const raw = panel.getBoundingClientRect();
      const next = computeMenuPosition(tRect, raw, align, 8, isRtl);
      panel.style.maxHeight = `${next.maxHeight}px`;
      setCoords(next);
    }, [align, isRtl, useSheet]);

    React.useLayoutEffect(() => {
      if (!open || useSheet) {
        setCoords(null);
        return;
      }
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

    // Focus into menu on open; restore trigger on close
    React.useEffect(() => {
      if (!open) return;
      const first = enabled[0]?.id ?? null;
      setActiveId(first);
      const frame = requestAnimationFrame(() => {
        if (first) {
          panelRef.current
            ?.querySelector<HTMLElement>(`[data-dk-ddm-id="${first}"]`)
            ?.focus();
        } else {
          panelRef.current?.focus();
        }
      });
      return () => {
        cancelAnimationFrame(frame);
        triggerElRef.current?.focus?.({ preventScroll: true });
      };
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps -- only on open edge

    React.useEffect(() => {
      if (!useSheet) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }, [useSheet]);

    // Outside dismiss
    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target as Node | null;
        if (anchorRef.current?.contains(target)) return;
        if (panelRef.current?.contains(target)) return;
        if (submenuRef.current?.contains(target)) return;
        setOpen(false);
      };
      document.addEventListener("pointerdown", onPointerDown, true);
      return () => document.removeEventListener("pointerdown", onPointerDown, true);
    }, [open, setOpen]);

    const focusItem = (itemId: string | null) => {
      setActiveId(itemId);
      if (!itemId) return;
      const root = submenuParentId ? submenuRef.current : panelRef.current;
      root?.querySelector<HTMLElement>(`[data-dk-ddm-id="${itemId}"]`)?.focus();
    };

    const moveActive = (dir: 1 | -1, list: Exclude<DropdownMenuEntry, DropdownMenuSeparator>[]) => {
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

    const openSubmenuFor = (entry: DropdownMenuCommandItem, el: HTMLElement) => {
      if (!hasSubmenu(entry) || useSheet) return;
      setSubmenuParentId(entry.id);
      const rect = el.getBoundingClientRect();
      const pad = 8;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = 12 * 16;
      const openRight = isRtl ? rect.left < width + pad : rect.right + width + pad < vw;
      const left = openRight
        ? isRtl
          ? rect.left - width - 4
          : rect.right + 4
        : isRtl
          ? rect.right + 4
          : rect.left - width - 4;
      const top = Math.min(Math.max(rect.top, pad), vh - pad - 80);
      setSubmenuCoords({
        top,
        left: Math.min(Math.max(left, pad), vw - width - pad),
        maxHeight: Math.max(120, vh - top - pad),
      });
      const first = actionableEntries(entry.children!)[0]?.id ?? null;
      requestAnimationFrame(() => focusItem(first));
    };

    const activate = (entry: Exclude<DropdownMenuEntry, DropdownMenuSeparator>) => {
      if (entry.disabled) return;

      if (useSheet && hasSubmenu(entry)) {
        setSheetStack((stack) => [
          ...stack,
          { id: entry.id, label: entry.label, items: entry.children! },
        ]);
        setActiveId(actionableEntries(entry.children!)[0]?.id ?? null);
        return;
      }

      if (!useSheet && hasSubmenu(entry)) {
        const el = panelRef.current?.querySelector<HTMLElement>(
          `[data-dk-ddm-id="${entry.id}"]`
        );
        if (el) openSubmenuFor(entry, el);
        return;
      }

      if (isCheckbox(entry)) {
        entry.onCheckedChange?.(!entry.checked);
        return;
      }

      if (isRadio(entry)) {
        entry.onSelect?.();
        setOpen(false);
        return;
      }

      (entry as DropdownMenuCommandItem).onSelect?.();
      setOpen(false);
    };

    const onTypeahead = (key: string, list: Exclude<DropdownMenuEntry, DropdownMenuSeparator>[]) => {
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
      if (!submenuParentId) return [] as DropdownMenuEntry[];
      const parent = items.find(
        (e) => !isSeparator(e) && e.id === submenuParentId
      ) as DropdownMenuCommandItem | undefined;
      return parent?.children ?? [];
    }, [items, submenuParentId]);

    const submenuEnabled = React.useMemo(
      () => actionableEntries(submenuEntries),
      [submenuEntries]
    );

    const onPanelKeyDown = (
      event: React.KeyboardEvent,
      list: Exclude<DropdownMenuEntry, DropdownMenuSeparator>[],
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

    const toggle = () => {
      if (disabled) return;
      setOpen(!open);
    };

    const child = React.Children.only(children);
    const childProps = child.props as Record<string, unknown>;

    const trigger = React.cloneElement(child, {
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "aria-controls": open ? menuId : undefined,
      ref: (node: HTMLElement | null) => {
        triggerElRef.current = node;
        const r = (child as { ref?: React.Ref<HTMLElement> }).ref;
        if (typeof r === "function") r(node);
        else if (r && typeof r === "object") {
          (r as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      },
      onClick: (event: React.MouseEvent) => {
        (childProps.onClick as ((e: React.MouseEvent) => void) | undefined)?.(
          event
        );
        if (!event.defaultPrevented) toggle();
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        (childProps.onKeyDown as ((e: React.KeyboardEvent) => void) | undefined)?.(
          event
        );
        if (event.defaultPrevented || disabled) return;
        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
          if (!open) {
            event.preventDefault();
            setOpen(true);
          }
        }
      },
    } as Partial<typeof child.props> & { ref?: React.Ref<HTMLElement> });

    const setAnchorRef = React.useCallback(
      (node: HTMLSpanElement | null) => {
        anchorRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLSpanElement | null>).current =
            node;
        }
      },
      [forwardedRef]
    );

    const renderRows = (
      entries: DropdownMenuEntry[],
      opts?: { submenu?: boolean }
    ) => {
      const rows = flatten(entries);
      return rows.map((row) => {
        if (row.kind === "separator") {
          return (
            <div
              key={row.id}
              className="dk-ddm__separator"
              role="separator"
            />
          );
        }
        const entry = row.entry;
        const isActive = activeId === entry.id;
        const submenu = hasSubmenu(entry);
        const checked = isCheckbox(entry)
          ? Boolean(entry.checked)
          : isRadio(entry)
            ? Boolean(entry.checked)
            : false;
        const role = isCheckbox(entry)
          ? "menuitemcheckbox"
          : isRadio(entry)
            ? "menuitemradio"
            : "menuitem";

        return (
          <button
            key={entry.id}
            type="button"
            role={role}
            tabIndex={isActive ? 0 : -1}
            data-dk-ddm-id={entry.id}
            className={cx(
              "dk-ddm__item",
              entry.destructive && "dk-ddm__item--destructive",
              entry.disabled && "dk-ddm__item--disabled",
              isActive && "dk-ddm__item--active",
              submenu && "dk-ddm__item--submenu"
            )}
            aria-disabled={entry.disabled || undefined}
            aria-checked={
              isCheckbox(entry) || isRadio(entry) ? checked : undefined
            }
            aria-haspopup={submenu ? "menu" : undefined}
            aria-expanded={
              submenu ? submenuParentId === entry.id || undefined : undefined
            }
            disabled={entry.disabled}
            onMouseEnter={(e) => {
              if (entry.disabled) return;
              setActiveId(entry.id);
              if (!useSheet && submenu) {
                openSubmenuFor(entry, e.currentTarget);
              } else if (!submenu) {
                closeSubmenu();
              }
            }}
            onClick={() => activate(entry)}
          >
            <span className="dk-ddm__leading" aria-hidden="true">
              {isCheckbox(entry) || isRadio(entry) ? (
                <span
                  className={cx(
                    "dk-ddm__indicator",
                    isRadio(entry) && "dk-ddm__indicator--radio",
                    checked && "dk-ddm__indicator--on"
                  )}
                >
                  {checked ? <CheckIcon /> : null}
                </span>
              ) : entry.icon ? (
                <span className="dk-ddm__icon">{entry.icon}</span>
              ) : (
                <span className="dk-ddm__icon-spacer" />
              )}
            </span>
            <span className="dk-ddm__label">{entry.label}</span>
            {entry.shortcut ? (
              <span className="dk-ddm__shortcut">{entry.shortcut}</span>
            ) : null}
            {submenu ? (
              <span className="dk-ddm__chevron">
                <ChevronIcon mirrored={isRtl} />
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

    const surface =
      mounted && open && typeof document !== "undefined"
        ? createPortal(
            <>
              {useSheet ? (
                <button
                  type="button"
                  className="dk-ddm__scrim"
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
                  "dk-ddm",
                  useSheet ? "dk-ddm--sheet" : "dk-ddm--menu",
                  !useSheet && coords && `dk-ddm--${coords.side}`,
                  className
                )}
                data-state="open"
                style={panelStyle}
                onKeyDown={(e) =>
                  onPanelKeyDown(e, enabled, { isSubmenu: false })
                }
              >
                {useSheet ? (
                  <>
                    <div className="dk-ddm__sheet-handle" aria-hidden="true" />
                    <div className="dk-ddm__sheet-header">
                      {sheetStack.length > 1 ? (
                        <button
                          type="button"
                          className="dk-ddm__back"
                          aria-label="Back"
                          onClick={() => setSheetStack((s) => s.slice(0, -1))}
                        >
                          <BackIcon mirrored={isRtl} />
                        </button>
                      ) : (
                        <span className="dk-ddm__back-spacer" />
                      )}
                      <p className="dk-ddm__sheet-title">{currentSheet.label}</p>
                    </div>
                  </>
                ) : null}

                <div className="dk-ddm__list" role="none">
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
                          ) as DropdownMenuCommandItem | undefined
                        )?.label
                      }
                      className="dk-ddm dk-ddm--menu dk-ddm--submenu"
                      style={{
                        top: submenuCoords.top,
                        left: submenuCoords.left,
                        maxHeight: `${submenuCoords.maxHeight}px`,
                      }}
                      onKeyDown={(e) =>
                        onPanelKeyDown(e, submenuEnabled, { isSubmenu: true })
                      }
                    >
                      <div className="dk-ddm__list" role="none">
                        {renderRows(submenuEntries, { submenu: true })}
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
      <span
        ref={setAnchorRef}
        className="dk-ddm-anchor"
        data-disabled={disabled || undefined}
      >
        {trigger}
        {surface}
      </span>
    );
  }
);

DropdownMenu.displayName = "DropdownMenu";

export default DropdownMenu;
