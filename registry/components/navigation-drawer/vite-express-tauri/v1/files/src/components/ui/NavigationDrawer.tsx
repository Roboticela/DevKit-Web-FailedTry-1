import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Navigation Drawer — mobile/tablet primary navigation overlay.
 * Host composes Brand, NavItem, IconButton (close) as children/slots.
 * Focus trap + Escape. No shadows. Scrim uses --color-scrim.
 */

export type NavigationDrawerSide = "start" | "end";

export type NavigationDrawerProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: NavigationDrawerSide;
  /** Accessible name for the dialog. */
  label: string;
  /** Optional header row (brand + close). */
  header?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** Close control rendered in header when provided. */
  closeControl?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => el.getAttribute("aria-hidden") !== "true");
}

export const NavigationDrawer = React.forwardRef<HTMLDivElement, NavigationDrawerProps>(
  function NavigationDrawer(
    {
      open,
      onOpenChange,
      side = "start",
      label,
      header,
      children,
      footer,
      closeControl,
      className = "",
      id,
    },
    ref
  ) {
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        panelRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    React.useEffect(() => {
      if (!open) return;
      const prev = document.activeElement as HTMLElement | null;
      const panel = panelRef.current;
      if (panel) {
        const focusables = getFocusable(panel);
        (focusables[0] ?? panel).focus();
      }
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onOpenChange?.(false);
          return;
        }
        if (e.key !== "Tab" || !panelRef.current) return;
        const focusables = getFocusable(panelRef.current);
        if (focusables.length === 0) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener("keydown", onKey);
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = original;
        prev?.focus?.();
      };
    }, [open, onOpenChange]);

    if (!open || typeof document === "undefined") return null;

    return createPortal(
      <div className={cx("dk-nav-drawer", `dk-nav-drawer--${side}`, className)} data-open={open || undefined}>
        <button
          type="button"
          className="dk-nav-drawer__scrim"
          aria-label="Close navigation"
          onClick={() => onOpenChange?.(false)}
        />
        <div
          ref={setRefs}
          id={id}
          className="dk-nav-drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
        >
          {(header || closeControl) && (
            <div className="dk-nav-drawer__header">
              <div className="dk-nav-drawer__header-main">{header}</div>
              {closeControl ? <div className="dk-nav-drawer__close">{closeControl}</div> : null}
            </div>
          )}
          <div className="dk-nav-drawer__body">{children}</div>
          {footer ? <div className="dk-nav-drawer__footer">{footer}</div> : null}
        </div>
      </div>,
      document.body
    );
  }
);

NavigationDrawer.displayName = "NavigationDrawer";
export default NavigationDrawer;
