import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Drawer — temporary surface entering from the side of the viewport.
 * Modal by default (focus trap, no background interaction).
 * Non-modal background interaction only when explicitly enabled.
 */

export type DrawerSide = "left" | "right";

/**
 * `physical` — left/right are viewport sides (do not flip in RTL).
 * `logical` — maps to inline-start / inline-end in RTL.
 */
export type DrawerSideMode = "physical" | "logical";

export type DrawerSize = "sm" | "md" | "lg";

export type DrawerProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Physical side. Default: `right`. */
  side?: DrawerSide;
  /** How `side` maps under RTL. Default: `physical`. */
  sideMode?: DrawerSideMode;
  size?: DrawerSize;
  /**
   * Modal: focus trap, scrim, no background interaction.
   * Default: true.
   */
  modal?: boolean;
  /**
   * When `modal={false}`, allow interacting with the page behind.
   * Default: false — must be explicitly enabled.
   */
  allowBackgroundInteraction?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  closeLabel?: string;
  closeOnEscape?: boolean;
  /** Scrim / outside dismiss. Default: true when modal. */
  closeOnOutsideClick?: boolean;
  /** Enable swipe-to-dismiss on touch. Default: true. */
  swipeToDismiss?: boolean;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  footer?: React.ReactNode;
  hideFooter?: boolean;
  stickyFooter?: boolean;
  /**
   * On narrow viewports, present as a bottom sheet instead of a side panel.
   * Default: true.
   */
  mobileAsSheet?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function getFocusable(root: HTMLElement): HTMLElement[] {
  const nodes = root.querySelectorAll<HTMLElement>(
    'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
  );
  return Array.from(nodes).filter(
    (el) =>
      !el.hasAttribute("disabled") &&
      el.getAttribute("aria-hidden") !== "true" &&
      !el.closest("[inert]")
  );
}

function CloseGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M5.5 5.5l9 9M14.5 5.5l-9 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function resolveSide(
  side: DrawerSide,
  sideMode: DrawerSideMode,
  isRtl: boolean
): DrawerSide {
  if (sideMode === "physical" || !isRtl) return side;
  return side === "left" ? "right" : "left";
}

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  function Drawer(
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      side = "right",
      sideMode = "physical",
      size = "md",
      modal = true,
      allowBackgroundInteraction = false,
      title,
      description,
      children,
      showCloseButton = true,
      closeLabel = "Close",
      closeOnEscape = true,
      closeOnOutsideClick,
      swipeToDismiss = true,
      primaryAction,
      secondaryAction,
      footer,
      hideFooter = false,
      stickyFooter = true,
      mobileAsSheet = true,
      className = "",
      id,
      "aria-label": ariaLabel,
    },
    forwardedRef
  ) {
    const reactId = React.useId();
    const drawerId = id ?? `dk-drawer-${reactId}`;
    const titleId = `${drawerId}-title`;
    const descId = `${drawerId}-desc`;

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? Boolean(openProp) : uncontrolledOpen;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange]
    );

    const dismissOutside =
      closeOnOutsideClick !== undefined ? closeOnOutsideClick : modal;

    const backgroundInteractive =
      !modal && allowBackgroundInteraction === true;

    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const previouslyFocused = React.useRef<HTMLElement | null>(null);
    const [mounted, setMounted] = React.useState(false);
    const [isRtl, setIsRtl] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState(0);
    const [dragging, setDragging] = React.useState(false);
    const dragStart = React.useRef<{ x: number; y: number } | null>(null);

    const resolvedSide = resolveSide(side, sideMode, isRtl);

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

    const setPanelRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        panelRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
        }
      },
      [forwardedRef]
    );

    React.useEffect(() => {
      if (!open) {
        setDragOffset(0);
        setDragging(false);
        return;
      }

      previouslyFocused.current =
        (document.activeElement as HTMLElement | null) ?? null;

      const prevOverflow = document.body.style.overflow;
      if (modal || !backgroundInteractive) {
        document.body.style.overflow = "hidden";
      }

      const frame = requestAnimationFrame(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = getFocusable(panel);
        const target =
          focusable.find((el) => !el.hasAttribute("data-dk-drawer-close")) ??
          focusable[0] ??
          panel;
        target.focus({ preventScroll: true });
      });

      return () => {
        cancelAnimationFrame(frame);
        document.body.style.overflow = prevOverflow;
        const prev = previouslyFocused.current;
        if (prev && typeof prev.focus === "function") {
          prev.focus({ preventScroll: true });
        }
      };
    }, [open, modal, backgroundInteractive]);

    React.useEffect(() => {
      if (!open || !closeOnEscape) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, closeOnEscape, setOpen]);

    // Focus trap (modal only)
    React.useEffect(() => {
      if (!open || !modal) return;
      const panel = panelRef.current;
      if (!panel) return;

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Tab") return;
        const focusable = getFocusable(panel);
        if (focusable.length === 0) {
          event.preventDefault();
          panel.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (event.shiftKey) {
          if (active === first || !panel.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last || !panel.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, modal]);

    const onScrimPointerDown = () => {
      if (!dismissOutside) return;
      setOpen(false);
    };

    // Swipe to dismiss
    const onTouchStart = (event: React.TouchEvent) => {
      if (!swipeToDismiss || event.touches.length !== 1) return;
      const t = event.touches[0];
      dragStart.current = { x: t.clientX, y: t.clientY };
      setDragging(true);
    };

    const onTouchMove = (event: React.TouchEvent) => {
      if (!dragging || !dragStart.current) return;
      const t = event.touches[0];
      const dx = t.clientX - dragStart.current.x;
      const dy = t.clientY - dragStart.current.y;

      // Mobile sheet: vertical dismiss
      const isSheet =
        typeof window !== "undefined" &&
        mobileAsSheet &&
        window.matchMedia("(max-width: 639px)").matches;

      if (isSheet) {
        if (dy > 0 && Math.abs(dy) > Math.abs(dx)) {
          setDragOffset(dy);
        }
        return;
      }

      // Side drawer: swipe toward edge
      if (resolvedSide === "right" && dx > 0 && Math.abs(dx) > Math.abs(dy)) {
        setDragOffset(dx);
      } else if (
        resolvedSide === "left" &&
        dx < 0 &&
        Math.abs(dx) > Math.abs(dy)
      ) {
        setDragOffset(dx);
      }
    };

    const onTouchEnd = () => {
      if (!dragging) return;
      const threshold = 80;
      const isSheet =
        typeof window !== "undefined" &&
        mobileAsSheet &&
        window.matchMedia("(max-width: 639px)").matches;

      const shouldClose = isSheet
        ? dragOffset > threshold
        : Math.abs(dragOffset) > threshold;

      setDragging(false);
      dragStart.current = null;
      setDragOffset(0);
      if (shouldClose) setOpen(false);
    };

    const hasDefaultFooter =
      !hideFooter &&
      footer == null &&
      (primaryAction != null || secondaryAction != null);
    const hasCustomFooter = !hideFooter && footer != null;
    const showFooter = hasDefaultFooter || hasCustomFooter;

    const labelledBy = title != null ? titleId : undefined;
    const describedBy = description != null ? descId : undefined;

    const dragStyle: React.CSSProperties | undefined = (() => {
      if (!dragOffset) return undefined;
      const isSheet =
        typeof window !== "undefined" &&
        mobileAsSheet &&
        window.matchMedia("(max-width: 639px)").matches;
      if (isSheet) {
        return { transform: `translateY(${Math.max(0, dragOffset)}px)` };
      }
      return { transform: `translateX(${dragOffset}px)` };
    })();

    if (!mounted || !open || typeof document === "undefined") {
      return null;
    }

    return createPortal(
      <div
        className={cx(
          "dk-drawer-root",
          open && "dk-drawer-root--open",
          modal && "dk-drawer-root--modal",
          backgroundInteractive && "dk-drawer-root--bg-interactive"
        )}
        data-side={resolvedSide}
        data-size={size}
        data-mobile-sheet={mobileAsSheet || undefined}
      >
        {modal || !backgroundInteractive ? (
          <div
            className="dk-drawer__scrim"
            aria-hidden="true"
            onPointerDown={onScrimPointerDown}
          />
        ) : null}

        <div
          ref={setPanelRef}
          id={drawerId}
          role="dialog"
          aria-modal={modal || undefined}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-label={title == null ? ariaLabel : undefined}
          tabIndex={-1}
          className={cx(
            "dk-drawer",
            `dk-drawer--${resolvedSide}`,
            `dk-drawer--${size}`,
            stickyFooter && "dk-drawer--sticky-footer",
            mobileAsSheet && "dk-drawer--mobile-sheet",
            className
          )}
          data-state="open"
          style={dragStyle}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          <header className="dk-drawer__header">
            {mobileAsSheet ? (
              <div className="dk-drawer__handle" aria-hidden="true" />
            ) : null}
            <div className="dk-drawer__heading">
              {title != null ? (
                <h2 id={titleId} className="dk-drawer__title">
                  {title}
                </h2>
              ) : null}
              {description != null ? (
                <p id={descId} className="dk-drawer__description">
                  {description}
                </p>
              ) : null}
            </div>
            {showCloseButton ? (
              <button
                type="button"
                className="dk-drawer__close"
                data-dk-drawer-close=""
                aria-label={closeLabel}
                onClick={() => setOpen(false)}
              >
                <CloseGlyph />
              </button>
            ) : null}
          </header>

          <div className="dk-drawer__body">
            <div className="dk-drawer__content">{children}</div>
          </div>

          {showFooter ? (
            <footer
              className={cx(
                "dk-drawer__footer",
                stickyFooter && "dk-drawer__footer--sticky"
              )}
            >
              {hasCustomFooter ? (
                footer
              ) : (
                <div className="dk-drawer__actions">
                  {secondaryAction ? (
                    <div className="dk-drawer__action dk-drawer__action--secondary">
                      {secondaryAction}
                    </div>
                  ) : null}
                  {primaryAction ? (
                    <div className="dk-drawer__action dk-drawer__action--primary">
                      {primaryAction}
                    </div>
                  ) : null}
                </div>
              )}
            </footer>
          ) : null}
        </div>
      </div>,
      document.body
    );
  }
);

Drawer.displayName = "Drawer";

export default Drawer;
