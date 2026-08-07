import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Bottom Sheet — temporary surface from the bottom of the viewport.
 * Touch-oriented. On desktop may present as a dialog-like panel (not forced sheet UX).
 */

export type BottomSheetSize = "compact" | "standard" | "expanded" | "full";

/**
 * `modal` — scrim, focus trap, blocks background.
 * `non-modal` — no trap; background only if allowBackgroundInteraction.
 * `persistent` — deliberate dismiss only (no outside / drag dismiss; Escape configurable).
 */
export type BottomSheetVariant = "modal" | "non-modal" | "persistent";

/**
 * Desktop (≥1024px) presentation.
 * `auto` — dialog-like panel; `sheet` — keep bottom sheet; `dialog` — same as auto.
 */
export type BottomSheetDesktopPresentation = "auto" | "sheet" | "dialog";

export type BottomSheetProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: BottomSheetSize;
  variant?: BottomSheetVariant;
  desktopPresentation?: BottomSheetDesktopPresentation;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Optional drag handle. Default: true on touch / sheet presentation. */
  showHandle?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
  /**
   * Escape closes when keyboard access exists.
   * Default: true for modal/non-modal; false for persistent.
   */
  closeOnEscape?: boolean;
  /**
   * Tap / click outside. Default: true for modal/non-modal; false for persistent.
   */
  closeOnOutsideClick?: boolean;
  /** Drag down to dismiss. Default: true except persistent. Not the only close path. */
  dragToDismiss?: boolean;
  /** Non-modal only: interact with page behind. Default: false. */
  allowBackgroundInteraction?: boolean;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  footer?: React.ReactNode;
  hideFooter?: boolean;
  stickyFooter?: boolean;
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

function useIsDesktop() {
  const [desktop, setDesktop] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

/** Keep sheet above the visual viewport (virtual keyboard). */
function useKeyboardInset() {
  const [inset, setInset] = React.useState(0);
  React.useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const covered = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setInset(covered);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);
  return inset;
}

export const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  function BottomSheet(
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      size = "standard",
      variant = "modal",
      desktopPresentation = "auto",
      title,
      description,
      children,
      showHandle,
      showCloseButton = true,
      closeLabel = "Close",
      closeOnEscape,
      closeOnOutsideClick,
      dragToDismiss,
      allowBackgroundInteraction = false,
      primaryAction,
      secondaryAction,
      footer,
      hideFooter = false,
      stickyFooter = true,
      className = "",
      id,
      "aria-label": ariaLabel,
    },
    forwardedRef
  ) {
    const reactId = React.useId();
    const sheetId = id ?? `dk-bottom-sheet-${reactId}`;
    const titleId = `${sheetId}-title`;
    const descId = `${sheetId}-desc`;

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

    const isPersistent = variant === "persistent";
    const isModal = variant === "modal" || isPersistent;
    const escapeEnabled =
      closeOnEscape !== undefined ? closeOnEscape : !isPersistent;
    const outsideEnabled =
      closeOnOutsideClick !== undefined ? closeOnOutsideClick : !isPersistent;
    const dragEnabled =
      dragToDismiss !== undefined ? dragToDismiss : !isPersistent;
    const backgroundInteractive =
      variant === "non-modal" && allowBackgroundInteraction === true;

    const isDesktop = useIsDesktop();
    const keyboardInset = useKeyboardInset();
    const asDialog =
      isDesktop &&
      (desktopPresentation === "auto" || desktopPresentation === "dialog");

    const handleVisible =
      showHandle !== undefined ? showHandle : !asDialog;

    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const bodyRef = React.useRef<HTMLDivElement | null>(null);
    const previouslyFocused = React.useRef<HTMLElement | null>(null);
    const [mounted, setMounted] = React.useState(false);
    const [dragY, setDragY] = React.useState(0);
    const [dragging, setDragging] = React.useState(false);
    const dragStartY = React.useRef<number | null>(null);
    const dragFromHandle = React.useRef(false);

    React.useEffect(() => {
      setMounted(true);
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
        setDragY(0);
        setDragging(false);
        return;
      }

      previouslyFocused.current =
        (document.activeElement as HTMLElement | null) ?? null;

      const prevOverflow = document.body.style.overflow;
      if (isModal || !backgroundInteractive) {
        document.body.style.overflow = "hidden";
      }

      const frame = requestAnimationFrame(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = getFocusable(panel);
        const target =
          focusable.find((el) => !el.hasAttribute("data-dk-sheet-close")) ??
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
    }, [open, isModal, backgroundInteractive]);

    React.useEffect(() => {
      if (!open || !escapeEnabled) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, escapeEnabled, setOpen]);

    React.useEffect(() => {
      if (!open || !isModal) return;
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
    }, [open, isModal]);

    const onScrimPointerDown = () => {
      if (!outsideEnabled) return;
      setOpen(false);
    };

    const beginDrag = (clientY: number, fromHandle: boolean) => {
      if (!dragEnabled || asDialog) return;
      dragStartY.current = clientY;
      dragFromHandle.current = fromHandle;
      setDragging(true);
    };

    const moveDrag = (clientY: number) => {
      if (!dragging || dragStartY.current == null) return;
      const dy = clientY - dragStartY.current;
      // Only drag downward to dismiss; allow upward only from handle for expand feel (clamp 0+)
      if (dy > 0) setDragY(dy);
      else if (dragFromHandle.current) setDragY(0);
    };

    const endDrag = () => {
      if (!dragging) return;
      const shouldClose = dragY > 96;
      setDragging(false);
      dragStartY.current = null;
      setDragY(0);
      if (shouldClose) setOpen(false);
    };

    const onHandleTouchStart = (e: React.TouchEvent) => {
      if (e.touches[0]) beginDrag(e.touches[0].clientY, true);
    };
    const onPanelTouchStart = (e: React.TouchEvent) => {
      if (!dragEnabled || asDialog) return;
      const body = bodyRef.current;
      if (body && body.scrollTop > 0) return;
      if (e.touches[0]) beginDrag(e.touches[0].clientY, false);
    };
    const onTouchMove = (e: React.TouchEvent) => {
      if (e.touches[0]) moveDrag(e.touches[0].clientY);
    };

    const hasDefaultFooter =
      !hideFooter &&
      footer == null &&
      (primaryAction != null || secondaryAction != null);
    const showFooter = hasDefaultFooter || (!hideFooter && footer != null);

    const labelledBy = title != null ? titleId : undefined;
    const describedBy = description != null ? descId : undefined;

    const panelStyle: React.CSSProperties = {
      transform: dragY ? `translateY(${dragY}px)` : undefined,
      marginBottom: keyboardInset > 0 ? keyboardInset : undefined,
      transition: dragging ? "none" : undefined,
    };

    if (!mounted || !open || typeof document === "undefined") {
      return null;
    }

    return createPortal(
      <div
        className={cx(
          "dk-bottom-sheet-root",
          open && "dk-bottom-sheet-root--open",
          isModal && "dk-bottom-sheet-root--modal",
          backgroundInteractive && "dk-bottom-sheet-root--bg-interactive",
          asDialog && "dk-bottom-sheet-root--desktop-dialog"
        )}
        data-size={size}
        data-variant={variant}
      >
        {(isModal || !backgroundInteractive) && (
          <div
            className="dk-bottom-sheet__scrim"
            aria-hidden="true"
            onPointerDown={onScrimPointerDown}
          />
        )}

        <div
          ref={setPanelRef}
          id={sheetId}
          role="dialog"
          aria-modal={isModal || undefined}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-label={title == null ? ariaLabel : undefined}
          tabIndex={-1}
          className={cx(
            "dk-bottom-sheet",
            `dk-bottom-sheet--${size}`,
            asDialog && "dk-bottom-sheet--dialog",
            stickyFooter && "dk-bottom-sheet--sticky-footer",
            className
          )}
          data-state="open"
          style={panelStyle}
          onTouchStart={onPanelTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={endDrag}
          onTouchCancel={endDrag}
        >
          <header className="dk-bottom-sheet__header">
            {handleVisible ? (
              <div
                className="dk-bottom-sheet__handle"
                aria-hidden="true"
                onTouchStart={onHandleTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={endDrag}
              />
            ) : null}

            <div className="dk-bottom-sheet__heading-row">
              <div className="dk-bottom-sheet__heading">
                {title != null ? (
                  <h2 id={titleId} className="dk-bottom-sheet__title">
                    {title}
                  </h2>
                ) : null}
                {description != null ? (
                  <p id={descId} className="dk-bottom-sheet__description">
                    {description}
                  </p>
                ) : null}
              </div>

              {showCloseButton ? (
                <button
                  type="button"
                  className="dk-bottom-sheet__close"
                  data-dk-sheet-close=""
                  aria-label={closeLabel}
                  onClick={() => setOpen(false)}
                >
                  <CloseGlyph />
                </button>
              ) : null}
            </div>
          </header>

          <div ref={bodyRef} className="dk-bottom-sheet__body">
            <div className="dk-bottom-sheet__content">{children}</div>
          </div>

          {showFooter ? (
            <footer
              className={cx(
                "dk-bottom-sheet__footer",
                stickyFooter && "dk-bottom-sheet__footer--sticky"
              )}
            >
              {footer != null ? (
                footer
              ) : (
                <div className="dk-bottom-sheet__actions">
                  {secondaryAction ? (
                    <div className="dk-bottom-sheet__action dk-bottom-sheet__action--secondary">
                      {secondaryAction}
                    </div>
                  ) : null}
                  {primaryAction ? (
                    <div className="dk-bottom-sheet__action dk-bottom-sheet__action--primary">
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

BottomSheet.displayName = "BottomSheet";

export default BottomSheet;
