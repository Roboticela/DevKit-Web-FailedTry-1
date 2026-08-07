import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Dialog — modal surface for focused interaction.
 * Prefer Popover / non-modal content when the user can safely continue uninterrupted.
 */

export type DialogSize = "sm" | "md" | "lg" | "fullscreen";

export type DialogProps = {
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Dialog title (header). Required for accessible naming unless aria-label is set. */
  title?: React.ReactNode;
  /** Optional supporting text under the title. */
  description?: React.ReactNode;
  /** Main body — scrolls when long. */
  children?: React.ReactNode;
  /**
   * Size. `fullscreen` is full viewport; on narrow viewports `lg` may expand
   * toward full-height automatically via CSS.
   */
  size?: DialogSize;
  /** Show header dismiss control. Default: true when dismissible. */
  showCloseButton?: boolean;
  closeLabel?: string;
  /**
   * Escape closes. Default: true.
   * Set false for non-dismissible flows and handle Escape deliberately.
   */
  closeOnEscape?: boolean;
  /**
   * Outside / scrim press closes. Default: false —
   * important dialogs must not dismiss accidentally.
   */
  closeOnOutsideClick?: boolean;
  /** Primary footer action — compose DevKit Button. */
  primaryAction?: React.ReactNode;
  /** Secondary footer action — compose DevKit Button (quiet/secondary). */
  secondaryAction?: React.ReactNode;
  /** Replace default footer actions entirely. */
  footer?: React.ReactNode;
  /** Hide the footer region. */
  hideFooter?: boolean;
  /** Loading state — blocks dismiss by default chrome, shows busy. */
  loading?: boolean;
  loadingLabel?: string;
  /** Error message shown above the footer / below content. */
  error?: React.ReactNode;
  /** Sticky footer while body scrolls. Default: true. */
  stickyFooter?: boolean;
  /** Initial focus selector inside the dialog, or `"close"` / `"primary"`. */
  initialFocus?: "auto" | "close" | "primary" | string;
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

function SpinnerGlyph() {
  return (
    <svg
      className="dk-dialog__spinner-icon"
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="7"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.25"
      />
      <path
        d="M17 10a7 7 0 0 0-7-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  function Dialog(
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      title,
      description,
      children,
      size = "md",
      showCloseButton,
      closeLabel = "Close",
      closeOnEscape = true,
      closeOnOutsideClick = false,
      primaryAction,
      secondaryAction,
      footer,
      hideFooter = false,
      loading = false,
      loadingLabel = "Loading",
      error,
      stickyFooter = true,
      initialFocus = "auto",
      className = "",
      id,
      "aria-label": ariaLabel,
    },
    forwardedRef
  ) {
    const reactId = React.useId();
    const dialogId = id ?? `dk-dialog-${reactId}`;
    const titleId = `${dialogId}-title`;
    const descId = `${dialogId}-desc`;
    const errorId = `${dialogId}-error`;

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? Boolean(openProp) : uncontrolledOpen;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (loading && !next) return;
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, loading, onOpenChange]
    );

    const dismissibleClose =
      showCloseButton !== undefined ? showCloseButton : closeOnEscape || !loading;

    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const previouslyFocused = React.useRef<HTMLElement | null>(null);
    const [mounted, setMounted] = React.useState(false);

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

    // Body scroll lock + focus management
    React.useEffect(() => {
      if (!open) return;

      previouslyFocused.current =
        (document.activeElement as HTMLElement | null) ?? null;
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const panel = panelRef.current;
      const frame = requestAnimationFrame(() => {
        if (!panel) return;
        let target: HTMLElement | null = null;
        if (initialFocus === "close") {
          target = panel.querySelector<HTMLElement>("[data-dk-dialog-close]");
        } else if (initialFocus === "primary") {
          target = panel.querySelector<HTMLElement>("[data-dk-dialog-primary]");
        } else if (initialFocus !== "auto") {
          target = panel.querySelector<HTMLElement>(initialFocus);
        }
        if (!target) {
          const focusable = getFocusable(panel);
          target =
            focusable.find((el) => !el.hasAttribute("data-dk-dialog-close")) ??
            focusable[0] ??
            panel;
        }
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
    }, [open, initialFocus]);

    // Escape
    React.useEffect(() => {
      if (!open || !closeOnEscape || loading) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          event.preventDefault();
          setOpen(false);
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, closeOnEscape, loading, setOpen]);

    // Focus trap
    React.useEffect(() => {
      if (!open) return;
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
    }, [open]);

    const onScrimPointerDown = (event: React.PointerEvent) => {
      if (!closeOnOutsideClick || loading) return;
      if (event.target === event.currentTarget) {
        setOpen(false);
      }
    };

    const hasDefaultFooter =
      !hideFooter &&
      footer == null &&
      (primaryAction != null || secondaryAction != null);
    const hasCustomFooter = !hideFooter && footer != null;
    const showFooter = hasDefaultFooter || hasCustomFooter;

    const labelledBy = title != null ? titleId : undefined;
    const describedParts = [
      description != null ? descId : null,
      error != null ? errorId : null,
    ].filter(Boolean);
    const describedBy =
      describedParts.length > 0 ? describedParts.join(" ") : undefined;

    if (!mounted || !open || typeof document === "undefined") {
      return null;
    }

    return createPortal(
      <div
        className={cx("dk-dialog-root", open && "dk-dialog-root--open")}
        data-size={size}
      >
        <div
          className="dk-dialog__scrim"
          aria-hidden="true"
          onPointerDown={onScrimPointerDown}
        />

        <div
          className="dk-dialog__viewport"
          onPointerDown={onScrimPointerDown}
        >
          <div
            ref={setPanelRef}
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            aria-label={title == null ? ariaLabel : undefined}
            aria-busy={loading || undefined}
            tabIndex={-1}
            className={cx(
              "dk-dialog",
              `dk-dialog--${size}`,
              stickyFooter && "dk-dialog--sticky-footer",
              loading && "dk-dialog--loading",
              error != null && "dk-dialog--error",
              className
            )}
            data-state="open"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <header className="dk-dialog__header">
              <div className="dk-dialog__heading">
                {title != null ? (
                  <h2 id={titleId} className="dk-dialog__title">
                    {title}
                  </h2>
                ) : null}
                {description != null ? (
                  <p id={descId} className="dk-dialog__description">
                    {description}
                  </p>
                ) : null}
              </div>

              {dismissibleClose && !loading ? (
                <button
                  type="button"
                  className="dk-dialog__close"
                  data-dk-dialog-close=""
                  aria-label={closeLabel}
                  onClick={() => setOpen(false)}
                >
                  <CloseGlyph />
                </button>
              ) : null}
            </header>

            <div className="dk-dialog__body">
              {loading ? (
                <div className="dk-dialog__loading" role="status">
                  <SpinnerGlyph />
                  <span>{loadingLabel}</span>
                </div>
              ) : null}
              <div
                className="dk-dialog__content"
                data-hidden={loading || undefined}
                aria-hidden={loading || undefined}
              >
                {children}
              </div>
            </div>

            {error != null ? (
              <div
                id={errorId}
                className="dk-dialog__error"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            {showFooter ? (
              <footer
                className={cx(
                  "dk-dialog__footer",
                  stickyFooter && "dk-dialog__footer--sticky"
                )}
              >
                {hasCustomFooter ? (
                  footer
                ) : (
                  <div className="dk-dialog__actions">
                    {secondaryAction ? (
                      <div className="dk-dialog__action dk-dialog__action--secondary">
                        {secondaryAction}
                      </div>
                    ) : null}
                    {primaryAction ? (
                      <div
                        className="dk-dialog__action dk-dialog__action--primary"
                        data-dk-dialog-primary=""
                      >
                        {primaryAction}
                      </div>
                    ) : null}
                  </div>
                )}
              </footer>
            ) : null}
          </div>
        </div>
      </div>,
      document.body
    );
  }
);

Dialog.displayName = "Dialog";

export default Dialog;
