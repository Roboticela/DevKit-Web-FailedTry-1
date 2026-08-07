import * as React from "react";

export type SplitButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export type SplitButtonVariant = "primary" | "secondary" | "destructive";

export interface SplitButtonItem {
  /** Stable id for keys and selection. */
  id: string;
  /** Visible + accessible menu item label. */
  label: string;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
}

export interface SplitButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  size?: SplitButtonSize;
  variant?: SplitButtonVariant;
  /** Primary action label. */
  children: React.ReactNode;
  leadingIcon?: React.ReactNode;
  /** Fires when the primary region is activated. */
  onPrimaryClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Alternative actions shown in the menu. */
  items: SplitButtonItem[];
  /**
   * Accessible name for the menu trigger (required, distinct from primary).
   * Example: "More export options"
   */
  menuLabel: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  type?: "button" | "submit" | "reset";
}

const SIZE_CLASS: Record<SplitButtonSize, string> = {
  xs: "dk-split-button--xs",
  sm: "dk-split-button--sm",
  md: "dk-split-button--md",
  lg: "dk-split-button--lg",
  xl: "dk-split-button--xl",
};

const VARIANT_CLASS: Record<SplitButtonVariant, string> = {
  primary: "dk-split-button--primary",
  secondary: "dk-split-button--secondary",
  destructive: "dk-split-button--destructive",
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

/**
 * Split Button (ID 004) — primary action + independent menu of alternatives.
 */
export const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  function SplitButton(
    {
      size = "md",
      variant = "primary",
      children,
      leadingIcon,
      onPrimaryClick,
      items,
      menuLabel,
      loading = false,
      disabled = false,
      fullWidth = false,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      type = "button",
      className,
      ...rest
    },
    ref
  ) {
    const isDisabled = disabled || loading;
    const listId = React.useId();
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const menuRef = React.useRef<HTMLUListElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const [activeIndex, setActiveIndex] = React.useState(0);

    const isControlled = openProp !== undefined;
    const open = isControlled ? Boolean(openProp) : uncontrolledOpen;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange]
    );

    const enabledIndexes = React.useMemo(
      () =>
        items
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => !item.disabled)
          .map(({ index }) => index),
      [items]
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
    }, [open, setOpen]);

    React.useEffect(() => {
      if (!open) return;
      const first = enabledIndexes[0] ?? 0;
      setActiveIndex(first);
      // Focus menu after open for arrow navigation
      requestAnimationFrame(() => {
        const option = menuRef.current?.querySelector<HTMLElement>(
          `[data-index="${first}"]`
        );
        option?.focus();
      });
    }, [open, enabledIndexes]);

    const moveActive = (direction: 1 | -1) => {
      if (enabledIndexes.length === 0) return;
      const position = enabledIndexes.indexOf(activeIndex);
      const nextPos =
        position === -1
          ? 0
          : (position + direction + enabledIndexes.length) % enabledIndexes.length;
      const nextIndex = enabledIndexes[nextPos];
      setActiveIndex(nextIndex);
      menuRef.current
        ?.querySelector<HTMLElement>(`[data-index="${nextIndex}"]`)
        ?.focus();
    };

    const selectItem = (item: SplitButtonItem) => {
      if (item.disabled || isDisabled) return;
      item.onSelect?.();
      setOpen(false);
      triggerRef.current?.focus();
    };

    const onMenuKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
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
            menuRef.current
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
              menuRef.current
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

    const primaryLabel =
      typeof children === "string" || typeof children === "number"
        ? String(children)
        : "Primary action";

    return (
      <div
        {...rest}
        ref={setRefs}
        className={cx(
          "dk-split-button",
          SIZE_CLASS[size],
          VARIANT_CLASS[variant],
          open && "dk-split-button--open",
          loading && "dk-split-button--loading",
          fullWidth && "dk-split-button--full",
          className
        )}
        data-size={size}
        data-variant={variant}
        data-open={open || undefined}
        data-loading={loading || undefined}
      >
        <span className="dk-split-button__hit" aria-hidden="true" />

        <div className="dk-split-button__control">
          <button
            type={type}
            className="dk-split-button__primary"
            disabled={isDisabled}
            aria-disabled={isDisabled || undefined}
            aria-busy={loading || undefined}
            aria-label={loading ? `${primaryLabel}, Loading` : undefined}
            onClick={(event) => {
              if (isDisabled) return;
              onPrimaryClick?.(event);
            }}
          >
            <span
              className="dk-split-button__primary-content"
              data-hidden={loading || undefined}
              aria-hidden={loading || undefined}
            >
              {leadingIcon ? (
                <span className="dk-split-button__icon" aria-hidden="true">
                  {leadingIcon}
                </span>
              ) : null}
              <span className="dk-split-button__label">{children}</span>
            </span>
            {loading ? (
              <span className="dk-split-button__loader" aria-hidden="true">
                <span className="dk-split-button__spinner" />
              </span>
            ) : null}
          </button>

          <button
            ref={triggerRef}
            type="button"
            className="dk-split-button__trigger"
            disabled={isDisabled}
            aria-disabled={isDisabled || undefined}
            aria-label={menuLabel}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            onClick={() => {
              if (isDisabled) return;
              setOpen(!open);
            }}
            onKeyDown={(event) => {
              if (isDisabled) return;
              if (event.key === "ArrowDown" && !open) {
                event.preventDefault();
                setOpen(true);
              }
            }}
          >
            <span className="dk-split-button__trigger-hit" aria-hidden="true" />
            <span className="dk-split-button__chevron" aria-hidden="true">
              <ChevronDownIcon />
            </span>
          </button>
        </div>

        {open ? (
          <ul
            ref={menuRef}
            id={listId}
            className="dk-split-button__menu"
            role="menu"
            aria-label={menuLabel}
            onKeyDown={onMenuKeyDown}
          >
            {items.map((item, index) => (
              <li key={item.id} role="presentation">
                <button
                  type="button"
                  role="menuitem"
                  className={cx(
                    "dk-split-button__item",
                    item.destructive && "dk-split-button__item--destructive",
                    index === activeIndex && "dk-split-button__item--active"
                  )}
                  data-index={index}
                  disabled={item.disabled || isDisabled}
                  tabIndex={index === activeIndex ? 0 : -1}
                  onMouseEnter={() => {
                    if (!item.disabled) setActiveIndex(index);
                  }}
                  onClick={() => selectItem(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectItem(item);
                    }
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }
);

SplitButton.displayName = "SplitButton";

export default SplitButton;
