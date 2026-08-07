import * as React from "react";

export type ToastVariant =
  | "neutral"
  | "informational"
  | "success"
  | "warning"
  | "error";

/**
 * Viewport placement (logical). `auto` → bottom-center on narrow viewports,
 * bottom-end on desktop — clears safe areas and typical bottom chrome.
 */
export type ToastPlacement =
  | "auto"
  | "top-start"
  | "top-center"
  | "top-end"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end";

export interface ToastAction {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  altText?: string;
}

export interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  /** Semantic tone. Default: `neutral`. */
  variant?: ToastVariant;
  /** Primary message — keep short. */
  message: React.ReactNode;
  /**
   * Leading icon. Omit for the default variant glyph; `false` to hide.
   */
  icon?: React.ReactNode | false;
  /** Optional single action (Undo, View, …). */
  action?: ToastAction;
  /** Show dismiss control. Default: true. */
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
  /**
   * Auto-dismiss duration in ms.
   * - omit → variant default (error is persistent)
   * - `null` / `0` → persistent until dismissed
   */
  duration?: number | null;
  /** Controlled visibility. Default: true. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Pause auto-dismiss while hovered / focused. Default: true. */
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
}

export interface ToastRecord {
  id: string;
  variant?: ToastVariant;
  message: React.ReactNode;
  icon?: React.ReactNode | false;
  action?: ToastAction;
  dismissible?: boolean;
  duration?: number | null;
  /** Optional grouping key — newer toasts with the same key replace older ones. */
  groupKey?: string;
}

export interface ToastProviderProps {
  children?: React.ReactNode;
  /** Max simultaneously visible toasts. Extra are queued. Default: 3. */
  maxVisible?: number;
  placement?: ToastPlacement;
  /** Extra offset above bottom chrome (e.g. bottom navigation). */
  bottomOffset?: number | string;
  label?: string;
}

type ToastContextValue = {
  publish: (toast: Omit<ToastRecord, "id"> & { id?: string }) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const VARIANT_CLASS: Record<ToastVariant, string> = {
  neutral: "dk-toast--neutral",
  informational: "dk-toast--informational",
  success: "dk-toast--success",
  warning: "dk-toast--warning",
  error: "dk-toast--error",
};

const DEFAULT_DURATION: Record<ToastVariant, number | null> = {
  neutral: 4000,
  informational: 4500,
  success: 4000,
  warning: 6000,
  /** Critical errors should not rely solely on a disappearing toast. */
  error: null,
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function preferMobilePlacement(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(max-width: 479px)").matches;
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 9v4.5M10 6.75h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m6.75 10.25 2.25 2.25 4.25-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M9.13 3.66 2.6 15.1a1 1 0 0 0 .87 1.5h13.06a1 1 0 0 0 .87-1.5L10.87 3.66a1 1 0 0 0-1.74 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 8v3.5M10 13.75h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m7.5 7.5 5 5M12.5 7.5l-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NeutralIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.75 10h6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DismissIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m4 4 8 8M12 4 4 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const DEFAULT_ICONS: Record<ToastVariant, React.ReactNode> = {
  neutral: <NeutralIcon />,
  informational: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
};

function resolveDuration(
  variant: ToastVariant,
  duration: number | null | undefined
): number | null {
  if (duration === null || duration === 0) return null;
  if (typeof duration === "number") return duration;
  return DEFAULT_DURATION[variant];
}

/**
 * Toast (ID 045) — temporary event feedback.
 *
 * Not for critical information that must persist in-context (prefer Alert).
 * Pair with `ToastProvider` for queued viewport delivery.
 */
export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  function Toast(
    {
      variant = "neutral",
      message,
      icon,
      action,
      dismissible = true,
      onDismiss,
      dismissLabel = "Dismiss",
      duration,
      open: openProp = true,
      onOpenChange,
      pauseOnHover = true,
      pauseOnFocus = true,
      className,
      id: idProp,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-toast-${reactId}`;
    const isControlled = typeof onOpenChange === "function";
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(true);
    const open = isControlled ? Boolean(openProp) : uncontrolledOpen;

    const close = React.useCallback(() => {
      if (isControlled) onOpenChange?.(false);
      else setUncontrolledOpen(false);
      onDismiss?.();
    }, [isControlled, onOpenChange, onDismiss]);

    const resolvedDuration = resolveDuration(variant, duration);
    const pausedRef = React.useRef(false);
    const remainingRef = React.useRef<number | null>(resolvedDuration);
    const startedRef = React.useRef<number | null>(null);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const startTimer = React.useCallback(() => {
      clearTimer();
      if (resolvedDuration == null || !open) return;
      const wait = remainingRef.current ?? resolvedDuration;
      startedRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        close();
      }, wait);
    }, [resolvedDuration, open, close]);

    const pauseTimer = () => {
      if (resolvedDuration == null || pausedRef.current) return;
      pausedRef.current = true;
      if (startedRef.current != null && remainingRef.current != null) {
        const elapsed = Date.now() - startedRef.current;
        remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      }
      clearTimer();
    };

    const resumeTimer = () => {
      if (resolvedDuration == null || !pausedRef.current) return;
      pausedRef.current = false;
      startTimer();
    };

    React.useEffect(() => {
      remainingRef.current = resolvedDuration;
      pausedRef.current = false;
      if (open) startTimer();
      return clearTimer;
    }, [open, resolvedDuration, startTimer]);

    if (!open) return null;

    const showIcon = icon !== false;
    const iconNode = icon === false ? null : icon ?? DEFAULT_ICONS[variant];
    const liveRole = variant === "error" || variant === "warning" ? "alert" : "status";

    return (
      <div
        {...rest}
        ref={ref}
        id={rootId}
        className={cx("dk-toast", VARIANT_CLASS[variant], className)}
        role={liveRole}
        aria-live={liveRole === "alert" ? "assertive" : "polite"}
        aria-atomic="true"
        data-variant={variant}
        data-duration={resolvedDuration ?? "persistent"}
        onMouseEnter={() => {
          if (pauseOnHover) pauseTimer();
        }}
        onMouseLeave={() => {
          if (pauseOnHover) resumeTimer();
        }}
        onFocusCapture={() => {
          if (pauseOnFocus) pauseTimer();
        }}
        onBlurCapture={(event) => {
          if (
            pauseOnFocus &&
            !event.currentTarget.contains(event.relatedTarget as Node)
          ) {
            resumeTimer();
          }
        }}
      >
        {showIcon ? (
          <span className="dk-toast__icon" aria-hidden="true">
            {iconNode}
          </span>
        ) : null}

        <div className="dk-toast__body">
          <div className="dk-toast__message">{message}</div>
          {action ? (
            action.href ? (
              <a
                className="dk-toast__action"
                href={action.href}
                aria-label={action.altText}
                onClick={action.onClick}
              >
                {action.label}
              </a>
            ) : (
              <button
                type="button"
                className="dk-toast__action"
                aria-label={action.altText}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            )
          ) : null}
        </div>

        {dismissible ? (
          <button
            type="button"
            className="dk-toast__dismiss"
            aria-label={dismissLabel}
            onClick={close}
          >
            <span className="dk-toast__dismiss-hit" aria-hidden="true" />
            <DismissIcon />
          </button>
        ) : null}
      </div>
    );
  }
);

Toast.displayName = "Toast";

function ToastViewportItem({
  record,
  onDismiss,
}: {
  record: ToastRecord;
  onDismiss: (id: string) => void;
}) {
  return (
    <Toast
      variant={record.variant}
      message={record.message}
      icon={record.icon}
      action={record.action}
      dismissible={record.dismissible}
      duration={record.duration}
      onDismiss={() => onDismiss(record.id)}
    />
  );
}

/**
 * Queues and positions toasts. Limits visible count; extras wait in queue.
 * Same `groupKey` replaces an existing toast instead of stacking duplicates.
 */
export function ToastProvider({
  children,
  maxVisible = 3,
  placement = "auto",
  bottomOffset,
  label = "Notifications",
}: ToastProviderProps) {
  const [queue, setQueue] = React.useState<ToastRecord[]>([]);
  const [mobile, setMobile] = React.useState(true);

  React.useEffect(() => {
    if (placement !== "auto") return;
    const sync = () => setMobile(preferMobilePlacement());
    sync();
    const mq = window.matchMedia("(max-width: 479px)");
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [placement]);

  const resolvedPlacement: Exclude<ToastPlacement, "auto"> =
    placement === "auto"
      ? mobile
        ? "bottom-center"
        : "bottom-end"
      : placement;

  const publish = React.useCallback(
    (toast: Omit<ToastRecord, "id"> & { id?: string }) => {
      const id =
        toast.id ??
        `toast-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
      setQueue((prev) => {
        let next = prev;
        if (toast.groupKey) {
          next = prev.filter((item) => item.groupKey !== toast.groupKey);
        }
        return [...next, { ...toast, id }];
      });
      return id;
    },
    []
  );

  const dismiss = React.useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => setQueue([]), []);

  const value = React.useMemo(
    () => ({ publish, dismiss, dismissAll }),
    [publish, dismiss, dismissAll]
  );

  const visible = queue.slice(0, Math.max(1, maxVisible));
  const pending = Math.max(0, queue.length - visible.length);

  const style: React.CSSProperties | undefined =
    bottomOffset != null
      ? ({
          ["--dk-toast-bottom-offset" as string]:
            typeof bottomOffset === "number"
              ? `${bottomOffset}px`
              : bottomOffset,
        } as React.CSSProperties)
      : undefined;

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className={cx(
          "dk-toast-viewport",
          `dk-toast-viewport--${resolvedPlacement}`
        )}
        style={style}
        data-placement={resolvedPlacement}
        data-count={visible.length}
        data-pending={pending || undefined}
      >
        <div className="dk-toast-viewport__list" role="region" aria-label={label}>
          {visible.map((record) => (
            <ToastViewportItem
              key={record.id}
              record={record}
              onDismiss={dismiss}
            />
          ))}
        </div>
        {pending > 0 ? (
          <div className="dk-toast-viewport__pending dk-sr-only" aria-live="polite">
            {pending} more notification{pending === 1 ? "" : "s"} waiting
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

/** Imperative publish / dismiss API for hosts inside `ToastProvider`. */
export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

export default Toast;
