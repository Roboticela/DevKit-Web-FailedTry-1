import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Modal Surface — generic elevated temporary surface.
 * Low-level foundation for Dialog, Alert Dialog, and other modal compositions.
 * Does not include title, buttons, icons, or illustrations — consumers compose those.
 */

export type ModalSurfaceSize = "sm" | "md" | "lg" | "fullscreen";

export type ModalSurfacePosition = "center" | "top" | "bottom";

export type ModalSurfaceProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * When true (default): scrim, focus trap, scroll lock, blocks background.
   * When false: no trap; background interaction only if allowBackgroundInteraction.
   */
  modal?: boolean;
  size?: ModalSurfaceSize;
  position?: ModalSurfacePosition;
  /**
   * Escape closes. Default: true.
   * Set false for critical flows that must require an explicit action.
   */
  closeOnEscape?: boolean;
  /**
   * Outside / scrim press closes. Default: false —
   * avoid accidental dismiss of important work.
   */
  closeOnOutsideClick?: boolean;
  /** Show backdrop/scrim. Default: true when modal; false when non-modal. */
  showBackdrop?: boolean;
  /** Non-modal only: interact with page behind. Default: false. */
  allowBackgroundInteraction?: boolean;
  /**
   * Lock document scroll. Default: true when modal or when background is blocked.
   * Compensates scrollbar gutter so layout does not jump.
   */
  lockScroll?: boolean;
  /** Initial focus: `"auto"` | `"surface"` | CSS selector. */
  initialFocus?: "auto" | "surface" | string;
  /** Dialog role. Use `alertdialog` only for critical confirmations. */
  role?: "dialog" | "alertdialog";
  /** Portal target. Default: document.body. */
  container?: HTMLElement | null;
  children?: React.ReactNode;
  className?: string;
  surfaceClassName?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
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

/** Lock scroll and pad the body so removing the scrollbar does not shift layout. */
function lockBodyScroll() {
  const doc = document.documentElement;
  const scrollbar = Math.max(0, window.innerWidth - doc.clientWidth);
  const prev = {
    overflow: document.body.style.overflow,
    paddingRight: document.body.style.paddingRight,
  };
  document.body.style.overflow = "hidden";
  if (scrollbar > 0) {
    const current = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    document.body.style.paddingRight = `${current + scrollbar}px`;
  }
  return () => {
    document.body.style.overflow = prev.overflow;
    document.body.style.paddingRight = prev.paddingRight;
  };
}

/** Keep surface above the visual viewport (virtual keyboard). */
function useKeyboardInset(enabled: boolean) {
  const [inset, setInset] = React.useState(0);
  React.useEffect(() => {
    if (!enabled) {
      setInset(0);
      return;
    }
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
  }, [enabled]);
  return inset;
}

function ModalSurfaceRoot(
  {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    modal = true,
    size = "md",
    position = "center",
    closeOnEscape = true,
    closeOnOutsideClick = false,
    showBackdrop,
    allowBackgroundInteraction = false,
    lockScroll,
    initialFocus = "auto",
    role = "dialog",
    container,
    children,
    className = "",
    surfaceClassName = "",
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
  }: ModalSurfaceProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>
) {
  const reactId = React.useId();
  const surfaceId = id ?? `dk-modal-surface-${reactId}`;

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

  const backdropVisible =
    showBackdrop !== undefined ? showBackdrop : modal === true;
  const backgroundInteractive =
    !modal && allowBackgroundInteraction === true;
  const shouldLockScroll =
    lockScroll !== undefined
      ? lockScroll
      : modal || !backgroundInteractive;

  const surfaceRef = React.useRef<HTMLDivElement | null>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const keyboardInset = useKeyboardInset(open && !backgroundInteractive);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const setSurfaceRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      surfaceRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
      }
    },
    [forwardedRef]
  );

  // Scroll lock + focus in / restore
  React.useEffect(() => {
    if (!open) return;

    previouslyFocused.current =
      (document.activeElement as HTMLElement | null) ?? null;

    const unlock = shouldLockScroll ? lockBodyScroll() : () => {};

    const frame = requestAnimationFrame(() => {
      const surface = surfaceRef.current;
      if (!surface) return;
      let target: HTMLElement | null = null;
      if (initialFocus === "surface") {
        target = surface;
      } else if (initialFocus !== "auto") {
        target = surface.querySelector<HTMLElement>(initialFocus);
      }
      if (!target) {
        const focusable = getFocusable(surface);
        target = focusable[0] ?? surface;
      }
      target.focus({ preventScroll: true });
    });

    return () => {
      cancelAnimationFrame(frame);
      unlock();
      const prev = previouslyFocused.current;
      if (prev && typeof prev.focus === "function") {
        prev.focus({ preventScroll: true });
      }
    };
  }, [open, shouldLockScroll, initialFocus]);

  // Escape
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
    const surface = surfaceRef.current;
    if (!surface) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = getFocusable(surface);
      if (focusable.length === 0) {
        event.preventDefault();
        surface.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey) {
        if (active === first || !surface.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !surface.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, modal]);

  const dismissOutside = () => {
    if (!closeOnOutsideClick) return;
    setOpen(false);
  };

  const onBackdropPointerDown = () => {
    dismissOutside();
  };

  const onViewportPointerDown = (event: React.PointerEvent) => {
    if (event.target === event.currentTarget) {
      dismissOutside();
    }
  };

  if (!mounted || !open || typeof document === "undefined") {
    return null;
  }

  const portalTarget = container ?? document.body;

  const viewportStyle: React.CSSProperties =
    keyboardInset > 0
      ? { paddingBottom: `max(var(--space-4, 16px), ${keyboardInset}px)` }
      : undefined;

  return createPortal(
    <div
      className={cx(
        "dk-modal-surface-root",
        open && "dk-modal-surface-root--open",
        modal && "dk-modal-surface-root--modal",
        backgroundInteractive && "dk-modal-surface-root--bg-interactive",
        className
      )}
      data-size={size}
      data-position={position}
      data-modal={modal ? "true" : "false"}
    >
      {backdropVisible ? (
        <div
          className="dk-modal-surface__backdrop"
          aria-hidden="true"
          onPointerDown={onBackdropPointerDown}
        />
      ) : null}

      <div
        className={cx(
          "dk-modal-surface__viewport",
          `dk-modal-surface__viewport--${position}`
        )}
        style={viewportStyle}
        onPointerDown={onViewportPointerDown}
      >
        <div
          ref={setSurfaceRef}
          id={surfaceId}
          role={role}
          aria-modal={modal || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          tabIndex={-1}
          className={cx(
            "dk-modal-surface",
            `dk-modal-surface--${size}`,
            `dk-modal-surface--${position}`,
            surfaceClassName
          )}
          data-state="open"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>,
    portalTarget
  );
}

const ModalSurfaceForward = React.forwardRef(ModalSurfaceRoot);
ModalSurfaceForward.displayName = "ModalSurface";

export type ModalSurfaceRegionProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

function ModalSurfaceHeader({
  className = "",
  children,
  ...rest
}: ModalSurfaceRegionProps) {
  return (
    <div className={cx("dk-modal-surface__header", className)} {...rest}>
      {children}
    </div>
  );
}
ModalSurfaceHeader.displayName = "ModalSurface.Header";

function ModalSurfaceBody({
  className = "",
  children,
  ...rest
}: ModalSurfaceRegionProps) {
  return (
    <div className={cx("dk-modal-surface__body", className)} {...rest}>
      {children}
    </div>
  );
}
ModalSurfaceBody.displayName = "ModalSurface.Body";

function ModalSurfaceFooter({
  className = "",
  children,
  ...rest
}: ModalSurfaceRegionProps) {
  return (
    <div className={cx("dk-modal-surface__footer", className)} {...rest}>
      {children}
    </div>
  );
}
ModalSurfaceFooter.displayName = "ModalSurface.Footer";

export const ModalSurface = Object.assign(ModalSurfaceForward, {
  Header: ModalSurfaceHeader,
  Body: ModalSurfaceBody,
  Footer: ModalSurfaceFooter,
});

export default ModalSurface;
