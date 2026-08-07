import * as React from "react";

export type ActionMenuTriggerSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ActionMenuTriggerVariant = "secondary" | "outline" | "subtle" | "ghost";

/**
 * Visual trigger form:
 * - `labeled` — text button (optional leading icon) + disclosure chevron
 * - `icon` — icon-only control (default: more dots); `label` is the accessible name
 * - `contextual` — low-emphasis inline trigger for row/card menus
 */
export type ActionMenuTriggerAppearance = "labeled" | "icon" | "contextual";

/**
 * How the action list is presented:
 * - `auto` — menu on desktop / pointer; bottom sheet on narrow touch viewports
 * - `menu` — always dropdown (connected to trigger)
 * - `sheet` — always bottom sheet
 */
export type ActionMenuPresentation = "auto" | "menu" | "sheet";

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  /**
   * Marks a destructive action. Destructive items render in a separated group
   * and require confirmation before `onSelect` runs (unless `requiresConfirm` is false).
   */
  destructive?: boolean;
  /**
   * When true, selecting the item opens an inline confirm step.
   * Defaults to `true` for destructive items.
   */
  requiresConfirm?: boolean;
  /** Confirm button label. Default: "Confirm". */
  confirmLabel?: string;
  /** Cancel button label. Default: "Cancel". */
  cancelLabel?: string;
  onSelect?: () => void;
}

export interface ActionMenuGroup {
  id: string;
  /** Optional group heading announced to assistive tech. */
  label?: string;
  items: ActionMenuItem[];
}

export interface ActionMenuTriggerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  size?: ActionMenuTriggerSize;
  variant?: ActionMenuTriggerVariant;
  appearance?: ActionMenuTriggerAppearance;
  /**
   * Accessible name for the trigger and menu.
   * Required for icon / contextual appearances; used as fallback for labeled.
   */
  label: string;
  /** Visible label for `labeled` appearance. Defaults to `label`. */
  children?: React.ReactNode;
  /** Leading icon (labeled) or primary icon (icon appearance). */
  icon?: React.ReactNode;
  /**
   * Show disclosure chevron on labeled / contextual triggers.
   * Icon appearance always uses a more-actions glyph (or `icon`).
   * Default: true.
   */
  showChevron?: boolean;
  items?: ActionMenuItem[];
  /** Prefer groups when mixing safe and destructive actions. */
  groups?: ActionMenuGroup[];
  presentation?: ActionMenuPresentation;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Align dropdown menu. Ignored for sheet. Default: `end`. */
  align?: "start" | "end";
  type?: "button" | "submit" | "reset";
}

const SIZE_CLASS: Record<ActionMenuTriggerSize, string> = {
  xs: "dk-amt--xs",
  sm: "dk-amt--sm",
  md: "dk-amt--md",
  lg: "dk-amt--lg",
  xl: "dk-amt--xl",
};

const VARIANT_CLASS: Record<ActionMenuTriggerVariant, string> = {
  secondary: "dk-amt--secondary",
  outline: "dk-amt--outline",
  subtle: "dk-amt--subtle",
  ghost: "dk-amt--ghost",
};

const APPEARANCE_CLASS: Record<ActionMenuTriggerAppearance, string> = {
  labeled: "dk-amt--labeled",
  icon: "dk-amt--icon",
  contextual: "dk-amt--contextual",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5.5 7.75 10 12.25l4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="4.5" r="1.5" fill="currentColor" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
      <circle cx="10" cy="15.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function usePrefersSheet(presentation: ActionMenuPresentation) {
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

function flattenGroups(
  items: ActionMenuItem[] | undefined,
  groups: ActionMenuGroup[] | undefined
): ActionMenuGroup[] {
  if (groups && groups.length > 0) return groups;
  if (items && items.length > 0) {
    const safe = items.filter((i) => !i.destructive);
    const danger = items.filter((i) => i.destructive);
    const result: ActionMenuGroup[] = [];
    if (safe.length) result.push({ id: "actions", items: safe });
    if (danger.length) {
      result.push({ id: "destructive", label: "Destructive", items: danger });
    }
    return result;
  }
  return [];
}

function itemNeedsConfirm(item: ActionMenuItem) {
  if (item.requiresConfirm !== undefined) return item.requiresConfirm;
  return Boolean(item.destructive);
}

/**
 * Action Menu Trigger (ID 010) — opens a contextual collection of actions.
 *
 * Communicates that more actions exist (chevron / more glyph). On narrow touch
 * screens the menu becomes a bottom sheet. Destructive actions require confirmation.
 */
export const ActionMenuTrigger = React.forwardRef<
  HTMLDivElement,
  ActionMenuTriggerProps
>(function ActionMenuTrigger(
  {
    size = "md",
    variant = "secondary",
    appearance = "labeled",
    label,
    children,
    icon,
    showChevron = true,
    items,
    groups,
    presentation = "auto",
    disabled = false,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    align = "end",
    type = "button",
    className,
    ...rest
  },
  ref
) {
  const menuId = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [pendingConfirm, setPendingConfirm] = React.useState<ActionMenuItem | null>(
    null
  );

  const isControlled = openProp !== undefined;
  const open = isControlled ? Boolean(openProp) : uncontrolledOpen;
  const prefersSheet = usePrefersSheet(presentation);
  const useSheet = open && prefersSheet;

  const resolvedGroups = React.useMemo(
    () => flattenGroups(items, groups),
    [items, groups]
  );

  const flatItems = React.useMemo(
    () => resolvedGroups.flatMap((g) => g.items),
    [resolvedGroups]
  );

  const enabledIndexes = React.useMemo(
    () =>
      flatItems
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !item.disabled)
        .map(({ index }) => index),
    [flatItems]
  );

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
      if (!next) setPendingConfirm(null);
    },
    [isControlled, onOpenChange]
  );

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (pendingConfirm) {
          setPendingConfirm(null);
          return;
        }
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen, pendingConfirm]);

  React.useEffect(() => {
    if (!open) return;
    if (pendingConfirm) {
      requestAnimationFrame(() => {
        panelRef.current
          ?.querySelector<HTMLElement>("[data-amt-confirm-primary]")
          ?.focus();
      });
      return;
    }
    const first = enabledIndexes[0] ?? 0;
    setActiveIndex(first);
    requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLElement>(`[data-index="${first}"]`)
        ?.focus();
    });
  }, [open, enabledIndexes, pendingConfirm]);

  React.useEffect(() => {
    if (!useSheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [useSheet]);

  const moveActive = (direction: 1 | -1) => {
    if (enabledIndexes.length === 0) return;
    const position = enabledIndexes.indexOf(activeIndex);
    const nextPos =
      position === -1
        ? 0
        : (position + direction + enabledIndexes.length) % enabledIndexes.length;
    const nextIndex = enabledIndexes[nextPos];
    setActiveIndex(nextIndex);
    panelRef.current
      ?.querySelector<HTMLElement>(`[data-index="${nextIndex}"]`)
      ?.focus();
  };

  const activateItem = (item: ActionMenuItem) => {
    if (item.disabled || disabled) return;
    if (itemNeedsConfirm(item)) {
      setPendingConfirm(item);
      return;
    }
    item.onSelect?.();
    setOpen(false);
    triggerRef.current?.focus();
  };

  const confirmPending = () => {
    if (!pendingConfirm || pendingConfirm.disabled) return;
    pendingConfirm.onSelect?.();
    setPendingConfirm(null);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onPanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (pendingConfirm) {
      if (event.key === "Escape") {
        event.preventDefault();
        setPendingConfirm(null);
      }
      return;
    }

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
        if (enabledIndexes[0] !== undefined) {
          setActiveIndex(enabledIndexes[0]);
          panelRef.current
            ?.querySelector<HTMLElement>(`[data-index="${enabledIndexes[0]}"]`)
            ?.focus();
        }
        break;
      case "End":
        event.preventDefault();
        {
          const last = enabledIndexes[enabledIndexes.length - 1];
          if (last !== undefined) {
            setActiveIndex(last);
            panelRef.current
              ?.querySelector<HTMLElement>(`[data-index="${last}"]`)
              ?.focus();
          }
        }
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const visibleLabel =
    appearance === "labeled" ? (children ?? label) : undefined;
  const triggerIcon =
    appearance === "icon" ? (icon ?? <MoreIcon />) : icon;
  const showDisclosure =
    appearance !== "icon" && showChevron !== false;

  let flatIndex = -1;

  const panel = open ? (
    <>
      {useSheet ? (
        <button
          type="button"
          className="dk-amt__scrim"
          aria-label="Dismiss menu"
          tabIndex={-1}
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        ref={panelRef}
        id={menuId}
        className={cx(
          "dk-amt__panel",
          useSheet ? "dk-amt__panel--sheet" : "dk-amt__panel--menu",
          !useSheet && align === "start" && "dk-amt__panel--align-start",
          !useSheet && align === "end" && "dk-amt__panel--align-end",
          pendingConfirm && "dk-amt__panel--confirm"
        )}
        role={pendingConfirm ? "dialog" : "menu"}
        aria-label={pendingConfirm ? pendingConfirm.label : label}
        aria-modal={useSheet || pendingConfirm ? true : undefined}
        onKeyDown={onPanelKeyDown}
      >
        {useSheet && !pendingConfirm ? (
          <div className="dk-amt__sheet-handle" aria-hidden="true" />
        ) : null}

        {useSheet && !pendingConfirm ? (
          <div className="dk-amt__sheet-title">{label}</div>
        ) : null}

        {pendingConfirm ? (
          <div className="dk-amt__confirm">
            <p className="dk-amt__confirm-message">
              {pendingConfirm.destructive
                ? `Confirm “${pendingConfirm.label}”? This cannot be undone from this menu.`
                : `Confirm “${pendingConfirm.label}”?`}
            </p>
            <div className="dk-amt__confirm-actions">
              <button
                type="button"
                className="dk-amt__confirm-btn dk-amt__confirm-btn--cancel"
                onClick={() => setPendingConfirm(null)}
              >
                {pendingConfirm.cancelLabel ?? "Cancel"}
              </button>
              <button
                type="button"
                className={cx(
                  "dk-amt__confirm-btn",
                  "dk-amt__confirm-btn--primary",
                  pendingConfirm.destructive &&
                    "dk-amt__confirm-btn--destructive"
                )}
                data-amt-confirm-primary=""
                onClick={confirmPending}
              >
                {pendingConfirm.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        ) : (
          resolvedGroups.map((group, groupIndex) => (
            <div
              key={group.id}
              className={cx(
                "dk-amt__group",
                groupIndex > 0 && "dk-amt__group--separated"
              )}
              role="group"
              aria-label={group.label}
            >
              {group.label && group.id === "destructive" ? (
                <div className="dk-amt__group-label">{group.label}</div>
              ) : group.label && groups ? (
                <div className="dk-amt__group-label">{group.label}</div>
              ) : null}
              <ul className="dk-amt__list" role="none">
                {group.items.map((item) => {
                  flatIndex += 1;
                  const index = flatIndex;
                  return (
                    <li key={item.id} role="presentation">
                      <button
                        type="button"
                        role="menuitem"
                        className={cx(
                          "dk-amt__item",
                          item.destructive && "dk-amt__item--destructive",
                          index === activeIndex && "dk-amt__item--active"
                        )}
                        data-index={index}
                        disabled={item.disabled || disabled}
                        tabIndex={index === activeIndex ? 0 : -1}
                        onMouseEnter={() => {
                          if (!item.disabled) setActiveIndex(index);
                        }}
                        onClick={() => activateItem(item)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            activateItem(item);
                          }
                        }}
                      >
                        {item.icon ? (
                          <span className="dk-amt__item-icon" aria-hidden="true">
                            {item.icon}
                          </span>
                        ) : null}
                        <span className="dk-amt__item-label">{item.label}</span>
                        {itemNeedsConfirm(item) ? (
                          <span className="dk-amt__item-hint" aria-hidden="true">
                            …
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </>
  ) : null;

  return (
    <div
      {...rest}
      ref={setRefs}
      className={cx(
        "dk-amt",
        SIZE_CLASS[size],
        VARIANT_CLASS[variant],
        APPEARANCE_CLASS[appearance],
        open && "dk-amt--open",
        useSheet && "dk-amt--sheet",
        !useSheet && open && "dk-amt--connected",
        disabled && "dk-amt--disabled",
        className
      )}
      data-size={size}
      data-variant={variant}
      data-appearance={appearance}
      data-open={open || undefined}
      data-presentation={prefersSheet ? "sheet" : "menu"}
    >
      <button
        ref={triggerRef}
        type={type}
        className="dk-amt__trigger"
        disabled={disabled}
        aria-disabled={disabled || undefined}
        aria-haspopup={prefersSheet ? "dialog" : "menu"}
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={
          appearance === "labeled" && visibleLabel === label
            ? undefined
            : label
        }
        title={appearance === "icon" ? label : undefined}
        onClick={() => {
          if (disabled) return;
          setOpen(!open);
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className="dk-amt__hit" aria-hidden="true" />
        <span className="dk-amt__trigger-inner">
          {triggerIcon ? (
            <span className="dk-amt__icon" aria-hidden="true">
              {triggerIcon}
            </span>
          ) : null}
          {visibleLabel != null ? (
            <span className="dk-amt__label">{visibleLabel}</span>
          ) : null}
          {showDisclosure ? (
            <span className="dk-amt__chevron" aria-hidden="true">
              <ChevronDownIcon />
            </span>
          ) : null}
        </span>
      </button>

      {panel}
    </div>
  );
});

ActionMenuTrigger.displayName = "ActionMenuTrigger";

export default ActionMenuTrigger;
