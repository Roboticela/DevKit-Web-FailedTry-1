import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Dialog — general modal surface for forms and confirmations.
 * role="dialog". Compose Button actions in footer. No custom modal chrome elsewhere.
 */

export type DialogSize = "sm" | "md" | "lg";

export type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Footer actions (compose Button). */
  actions?: React.ReactNode;
  actionSlot?: React.ReactNode;
  size?: DialogSize;
  /** Close when clicking the backdrop. Default: true. */
  closeOnOutsideClick?: boolean;
  /** Escape closes. Default: true. */
  closeOnEscape?: boolean;
  /** Initial focus target. Default: first focusable in dialog. */
  initialFocus?: "auto" | "title" | "close";
  showClose?: boolean;
  closeLabel?: string;
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

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="m6 6 8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    title,
    description,
    children,
    actions,
    actionSlot,
    size = "md",
    closeOnOutsideClick = true,
    closeOnEscape = true,
    initialFocus = "auto",
    showClose = true,
    closeLabel = "Close",
    className = "",
    id,
  },
  forwardedRef
) {
  const reactId = React.useId();
  const dialogId = id ?? `dk-dialog-${reactId}`;
  const titleId = `${dialogId}-title`;
  const descId = `${dialogId}-desc`;

  const controlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlled ? openProp! : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!controlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange]
  );

  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);
  const titleRef = React.useRef<HTMLHeadingElement | null>(null);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef]
  );

  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    if (panel) {
      const focusables = getFocusable(panel);
      if (initialFocus === "close" && closeRef.current) closeRef.current.focus();
      else if (initialFocus === "title" && titleRef.current) titleRef.current.focus();
      else if (focusables[0]) focusables[0].focus();
      else panel.focus();
    }
    return () => {
      prev?.focus?.();
    };
  }, [open, initialFocus]);

  React.useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key === "Tab" && panelRef.current) {
        const focusables = getFocusable(panelRef.current);
        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeOnEscape, open, setOpen]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="dk-dialog__root" data-open="true">
      <div
        className="dk-dialog__backdrop"
        aria-hidden="true"
        onMouseDown={() => {
          if (closeOnOutsideClick) setOpen(false);
        }}
      />
      <div
        ref={setRefs}
        id={dialogId}
        className={cx("dk-dialog", `dk-dialog--${size}`, className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        data-size={size}
      >
        <div className="dk-dialog__header">
          <div className="dk-dialog__heading">
            {title ? (
              <h2 ref={titleRef} id={titleId} className="dk-dialog__title" tabIndex={-1}>
                {title}
              </h2>
            ) : null}
            {description ? (
              <p id={descId} className="dk-dialog__description">
                {description}
              </p>
            ) : null}
          </div>
          {showClose ? (
            <button
              ref={closeRef}
              type="button"
              className="dk-dialog__close"
              aria-label={closeLabel}
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </button>
          ) : null}
        </div>
        {children ? <div className="dk-dialog__body">{children}</div> : null}
        {(actionSlot ?? actions) ? (
          <div className="dk-dialog__footer">{actionSlot ?? actions}</div>
        ) : null}
      </div>
    </div>,
    document.body
  );
});

Dialog.displayName = "Dialog";
export default Dialog;
