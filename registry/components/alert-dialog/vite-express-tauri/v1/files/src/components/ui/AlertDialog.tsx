import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Alert Dialog — high-priority modal requiring deliberate attention.
 * Use for destructive confirmation, irreversible actions, critical warnings,
 * security-sensitive decisions, and serious errors needing acknowledgement.
 *
 * role="alertdialog". Outside click never dismisses. Escape is deliberate.
 * Initial focus goes to the safest action — never the destructive action by default.
 */

export type AlertDialogTone = "destructive" | "warning" | "critical";

export type AlertDialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** What happened / what is at stake (concise). */
  title: React.ReactNode;
  /** What will happen and what choices mean (concise). */
  description: React.ReactNode;
  /**
   * Consequence action — prefer specific labels (“Delete”, “Revoke access”).
   * Compose DevKit Button; use `variant="destructive"` when destructive.
   */
  action: React.ReactNode;
  /**
   * Safest dismiss / alternative — prefer “Cancel”, “Keep editing”, etc.
   * Receives initial focus by default.
   */
  cancelAction: React.ReactNode;
  /** Visual tone of the chrome (not a substitute for clear action labels). */
  tone?: AlertDialogTone;
  /**
   * Escape behavior. Default: `cancel` — invokes cancel (safe path).
   * `none` — Escape does nothing (host must handle deliberately).
   * `close` — closes without calling cancel handlers inside the slot.
   */
  escapeBehavior?: "cancel" | "close" | "none";
  /**
   * Where to place initial focus. Default: `cancel` (safest).
   * Do not use `action` merely because it is visually primary.
   */
  initialFocus?: "cancel" | "action" | "title";
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
  id?: string;
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

function SpinnerGlyph() {
  return (
    <svg
      className="dk-alert-dialog__spinner-icon"
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

export const AlertDialog = React.forwardRef<HTMLDivElement, AlertDialogProps>(
  function AlertDialog(
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      title,
      description,
      action,
      cancelAction,
      tone = "destructive",
      escapeBehavior = "cancel",
      initialFocus = "cancel",
      loading = false,
      loadingLabel = "Working",
      className = "",
      id,
    },
    forwardedRef
  ) {
    const reactId = React.useId();
    const dialogId = id ?? `dk-alert-dialog-${reactId}`;
    const titleId = `${dialogId}-title`;
    const descId = `${dialogId}-desc`;

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

    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const cancelSlotRef = React.useRef<HTMLDivElement | null>(null);
    const actionSlotRef = React.useRef<HTMLDivElement | null>(null);
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

    const focusSafeTarget = React.useCallback(() => {
      const panel = panelRef.current;
      if (!panel) return;

      if (initialFocus === "title") {
        panel.querySelector<HTMLElement>("[data-dk-alert-dialog-title]")?.focus({
          preventScroll: true,
        });
        return;
      }

      const slot =
        initialFocus === "action" ? actionSlotRef.current : cancelSlotRef.current;
      const inSlot = slot ? getFocusable(slot)[0] : null;
      if (inSlot) {
        inSlot.focus({ preventScroll: true });
        return;
      }

      // Fallback: first focusable that is not the consequence action when preferring cancel
      const all = getFocusable(panel);
      if (initialFocus !== "action" && actionSlotRef.current) {
        const safe = all.find((el) => !actionSlotRef.current!.contains(el));
        if (safe) {
          safe.focus({ preventScroll: true });
          return;
        }
      }
      (all[0] ?? panel).focus({ preventScroll: true });
    }, [initialFocus]);

    React.useEffect(() => {
      if (!open) return;

      previouslyFocused.current =
        (document.activeElement as HTMLElement | null) ?? null;
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const frame = requestAnimationFrame(() => focusSafeTarget());

      return () => {
        cancelAnimationFrame(frame);
        document.body.style.overflow = prevOverflow;
        const prev = previouslyFocused.current;
        if (prev && typeof prev.focus === "function") {
          prev.focus({ preventScroll: true });
        }
      };
    }, [open, focusSafeTarget]);

    // Escape — deliberate
    React.useEffect(() => {
      if (!open || loading) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Escape") return;
        if (escapeBehavior === "none") {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (escapeBehavior === "cancel") {
          const btn = cancelSlotRef.current
            ? getFocusable(cancelSlotRef.current)[0]
            : null;
          if (btn) {
            btn.click();
            return;
          }
        }
        setOpen(false);
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, loading, escapeBehavior, setOpen]);

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

    if (!mounted || !open || typeof document === "undefined") {
      return null;
    }

    return createPortal(
      <div
        className={cx(
          "dk-alert-dialog-root",
          open && "dk-alert-dialog-root--open"
        )}
        data-tone={tone}
      >
        {/* Scrim — never dismisses on press (critical decisions). */}
        <div className="dk-alert-dialog__scrim" aria-hidden="true" />

        <div className="dk-alert-dialog__viewport">
          <div
            ref={setPanelRef}
            id={dialogId}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            aria-busy={loading || undefined}
            tabIndex={-1}
            className={cx(
              "dk-alert-dialog",
              `dk-alert-dialog--${tone}`,
              loading && "dk-alert-dialog--loading",
              className
            )}
            data-state="open"
          >
            <div className="dk-alert-dialog__body">
              <h2
                id={titleId}
                className="dk-alert-dialog__title"
                data-dk-alert-dialog-title=""
                tabIndex={-1}
              >
                {title}
              </h2>
              <p id={descId} className="dk-alert-dialog__description">
                {description}
              </p>

              {loading ? (
                <div className="dk-alert-dialog__loading" role="status">
                  <SpinnerGlyph />
                  <span>{loadingLabel}</span>
                </div>
              ) : null}
            </div>

            <div
              className="dk-alert-dialog__actions"
              data-hidden={loading || undefined}
            >
              <div
                ref={cancelSlotRef}
                className="dk-alert-dialog__action dk-alert-dialog__action--cancel"
                data-dk-alert-dialog-cancel=""
              >
                {cancelAction}
              </div>
              <div
                ref={actionSlotRef}
                className="dk-alert-dialog__action dk-alert-dialog__action--confirm"
                data-dk-alert-dialog-action=""
              >
                {action}
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }
);

AlertDialog.displayName = "AlertDialog";

export default AlertDialog;
