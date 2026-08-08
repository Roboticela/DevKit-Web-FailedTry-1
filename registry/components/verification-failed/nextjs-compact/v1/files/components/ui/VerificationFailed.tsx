import * as React from "react";
import {
  Alert,
  type AlertAction,
  type AlertDensity,
  type AlertLive,
} from "../../../../../../../alert/nextjs-compact/v1/files/components/ui/Alert";

/**
 * Verification Failed — error UI after a failed auth check.
 * Composes Alert only. No custom status chrome.
 *
 * Flows: email-verification · phone-verification · passkeys · two-factor · password-reset
 */

export type VerificationFailedFlow =
  | "email-verification"
  | "phone-verification"
  | "passkeys"
  | "two-factor"
  | "password-reset";

/**
 * Semantic failure cause — drives default copy (still overridable).
 * - `invalid` — wrong code / credential
 * - `expired` — code or challenge timed out
 * - `locked` — too many attempts
 * - `network` — connectivity / server
 * - `unknown` — generic failure
 */
export type VerificationFailedReason =
  | "invalid"
  | "expired"
  | "locked"
  | "network"
  | "unknown";

/**
 * - `stacked` — standard Alert (default)
 * - `compact` — dense Alert
 * - `banner` — full-width Alert-forward
 */
export type VerificationFailedVariant = "stacked" | "compact" | "banner";

export type VerificationFailedProps = {
  flow?: VerificationFailedFlow;
  reason?: VerificationFailedReason;
  variant?: VerificationFailedVariant;
  /** Alert heading. Defaults from `flow` + `reason`. */
  title?: React.ReactNode;
  /** Alert body. Defaults from `flow` + `reason`. */
  description?: React.ReactNode;
  /** Alias for `description` when hosting form-style error strings. */
  errorMessage?: React.ReactNode;
  density?: AlertDensity;
  /** Default: `assertive` for verification errors. */
  live?: AlertLive;
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
  /** Convenience: adds a primary Retry action when `actions` omitted. */
  onRetry?: (event: React.MouseEvent<HTMLElement>) => void;
  retryLabel?: string;
  showRetry?: boolean;
  /** Convenience: adds a secondary Resend action when `actions` omitted. */
  onResend?: (event: React.MouseEvent<HTMLElement>) => void;
  resendLabel?: string;
  showResend?: boolean;
  /** Disable Retry / Resend (e.g. while loading). */
  actionsDisabled?: boolean;
  /** Full Alert action list — overrides convenience Retry / Resend. */
  actions?: AlertAction[];
  /** Free-form action slot. */
  actionSlot?: React.ReactNode;
  /** Slot: replace Alert entirely (advanced). */
  alertSlot?: React.ReactNode;
  /** Slot: leading warning / error icon. */
  icon?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M9.13 3.66 2.6 15.1a1 1 0 0 0 .87 1.5h13.06a1 1 0 0 0 .87-1.5L10.87 3.66a1 1 0 0 0-1.74 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 8v3.5M10 13.75h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7.5 7.5 12.5 12.5M12.5 7.5 7.5 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ExpiredIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3.5h4M10 3.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 8.25v3l2 1.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockedIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="4.75" y="9" width="10.5" height="7.25" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9V6.75a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M4 13.5c2.5-2.5 9.5-2.5 12 0M6.25 11c1.75-1.5 5.75-1.5 7.5 0M8.5 8.5c.85-.6 2.15-.6 3 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M10 15.25h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const REASON_ICON: Record<VerificationFailedReason, React.ReactNode> = {
  invalid: <ErrorIcon />,
  expired: <ExpiredIcon />,
  locked: <LockedIcon />,
  network: <NetworkIcon />,
  unknown: <WarningIcon />,
};

const REASON_COPY: Record<VerificationFailedReason, { titleSuffix: string; hint: string }> = {
  invalid: {
    titleSuffix: "failed",
    hint: "The code or credential did not match. Try again.",
  },
  expired: {
    titleSuffix: "expired",
    hint: "This challenge has expired. Request a new code and try again.",
  },
  locked: {
    titleSuffix: "temporarily locked",
    hint: "Too many attempts. Wait a moment, then try again or resend a code.",
  },
  network: {
    titleSuffix: "couldn’t complete",
    hint: "A network problem interrupted verification. Check your connection and retry.",
  },
  unknown: {
    titleSuffix: "failed",
    hint: "Verification did not succeed. Retry or request a new code.",
  },
};

export const VERIFICATION_FAILED_FLOW_COPY: Record<
  VerificationFailedFlow,
  { subject: string; retryLabel: string; resendLabel: string }
> = {
  "email-verification": {
    subject: "Email verification",
    retryLabel: "Try again",
    resendLabel: "Resend email code",
  },
  "phone-verification": {
    subject: "Phone verification",
    retryLabel: "Try again",
    resendLabel: "Resend SMS code",
  },
  passkeys: {
    subject: "Passkey verification",
    retryLabel: "Retry passkey",
    resendLabel: "Use another method",
  },
  "two-factor": {
    subject: "Two-factor verification",
    retryLabel: "Try again",
    resendLabel: "Resend 2FA code",
  },
  "password-reset": {
    subject: "Password reset verification",
    retryLabel: "Try again",
    resendLabel: "Resend reset code",
  },
};

export function resolveVerificationFailedCopy(
  flow: VerificationFailedFlow,
  reason: VerificationFailedReason
): { title: string; description: string; retryLabel: string; resendLabel: string } {
  const flowCopy = VERIFICATION_FAILED_FLOW_COPY[flow];
  const reasonCopy = REASON_COPY[reason];
  return {
    title: `${flowCopy.subject} ${reasonCopy.titleSuffix}`,
    description: reasonCopy.hint,
    retryLabel: flowCopy.retryLabel,
    resendLabel: flowCopy.resendLabel,
  };
}

export const VerificationFailed = React.forwardRef<HTMLDivElement, VerificationFailedProps>(
  function VerificationFailed(
    {
      flow = "email-verification",
      reason = "invalid",
      variant = "stacked",
      title: titleProp,
      description: descriptionProp,
      errorMessage,
      density = "standard",
      live = "assertive",
      dismissible = false,
      onDismiss,
      dismissLabel,
      onRetry,
      retryLabel: retryLabelProp,
      showRetry = true,
      onResend,
      resendLabel: resendLabelProp,
      showResend = true,
      actionsDisabled = false,
      actions: actionsProp,
      actionSlot,
      alertSlot,
      icon: iconProp,
      className = "",
      id,
    },
    ref
  ) {
    const defaults = resolveVerificationFailedCopy(flow, reason);
    const title = titleProp ?? defaults.title;
    const description = descriptionProp ?? errorMessage ?? defaults.description;
    const retryLabel = retryLabelProp ?? defaults.retryLabel;
    const resendLabel = resendLabelProp ?? defaults.resendLabel;
    const warningIcon = iconProp ?? REASON_ICON[reason];

    const convenienceActions = React.useMemo(() => {
      if (actionsProp) return actionsProp;
      const next: AlertAction[] = [];
      if (showRetry && onRetry) {
        next.push({
          id: "retry",
          label: retryLabel,
          onClick: onRetry,
          emphasis: "primary",
          disabled: actionsDisabled,
        });
      }
      if (showResend && onResend) {
        next.push({
          id: "resend",
          label: resendLabel,
          onClick: onResend,
          emphasis: "secondary",
          disabled: actionsDisabled,
        });
      }
      return next.length > 0 ? next : undefined;
    }, [
      actionsDisabled,
      actionsProp,
      onResend,
      onRetry,
      resendLabel,
      retryLabel,
      showResend,
      showRetry,
    ]);

    const alertVariant = reason === "expired" || reason === "locked" ? "warning" : "error";

    const alertNode =
      alertSlot ?? (
        <Alert
          variant={alertVariant}
          density={variant === "compact" ? "compact" : density}
          title={title}
          icon={warningIcon}
          live={live}
          dismissible={dismissible}
          onDismiss={onDismiss}
          dismissLabel={dismissLabel}
          actions={convenienceActions}
          actionSlot={actionSlot}
          className="dk-verification-failed__alert"
        >
          {description}
        </Alert>
      );

    return (
      <div
        ref={ref}
        id={id}
        className={cx(
          "dk-verification-failed",
          `dk-verification-failed--${variant}`,
          `dk-verification-failed--${flow}`,
          `dk-verification-failed--${reason}`,
          className
        )}
        data-variant={variant}
        data-flow={flow}
        data-reason={reason}
      >
        {alertNode}
      </div>
    );
  }
);

VerificationFailed.displayName = "VerificationFailed";
export default VerificationFailed;
