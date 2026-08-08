import * as React from "react";
import {
  Alert,
  type AlertAction,
  type AlertDensity,
  type AlertLive,
} from "../../../../../../../alert/vite-express-tauri/v1/files/src/components/ui/Alert";

/**
 * Authentication Error — failure UI after an auth step fails.
 * Composes Alert only. No custom error chrome.
 *
 * Flows: sign-in · account-creation · password-reset · passkey ·
 * email-verification · two-factor · session-restoration
 */

export type AuthenticationErrorFlow =
  | "sign-in"
  | "account-creation"
  | "password-reset"
  | "passkey"
  | "email-verification"
  | "two-factor"
  | "session-restoration";

/**
 * Semantic failure cause — drives default copy and icon.
 * - `invalid` — wrong credentials / code
 * - `expired` — session, link, or challenge timed out
 * - `locked` — too many attempts
 * - `network` — connectivity / server
 * - `canceled` — user canceled (e.g. passkey prompt)
 * - `unknown` — generic failure
 */
export type AuthenticationErrorReason =
  | "invalid"
  | "expired"
  | "locked"
  | "network"
  | "canceled"
  | "unknown";

/**
 * - `stacked` — standard Alert (default)
 * - `compact` — dense Alert
 * - `banner` — full-width Alert-forward
 */
export type AuthenticationErrorVariant = "stacked" | "compact" | "banner";

export type AuthenticationErrorProps = {
  flow?: AuthenticationErrorFlow;
  reason?: AuthenticationErrorReason;
  variant?: AuthenticationErrorVariant;
  /** Alert heading. Defaults from `flow` + `reason`. */
  title?: React.ReactNode;
  /** Alert body. Defaults from `flow` + `reason`. */
  description?: React.ReactNode;
  /** Alias for `description` when hosting form-style error strings. */
  errorMessage?: React.ReactNode;
  density?: AlertDensity;
  /** Default: `assertive` for authentication errors. */
  live?: AlertLive;
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
  /** Convenience: primary Retry action when `actions` omitted. */
  onRetry?: (event: React.MouseEvent<HTMLElement>) => void;
  retryLabel?: string;
  showRetry?: boolean;
  /**
   * Convenience: secondary “try another method” action when `actions` omitted.
   * Use for password ↔ passkey ↔ email code fallbacks.
   */
  onTryAlternative?: (event: React.MouseEvent<HTMLElement>) => void;
  alternativeLabel?: string;
  showAlternative?: boolean;
  /** Disable convenience actions (e.g. while loading). */
  actionsDisabled?: boolean;
  /** Full Alert action list — overrides convenience Retry / Alternative. */
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

function CanceledIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const REASON_ICON: Record<AuthenticationErrorReason, React.ReactNode> = {
  invalid: <ErrorIcon />,
  expired: <ExpiredIcon />,
  locked: <LockedIcon />,
  network: <NetworkIcon />,
  canceled: <CanceledIcon />,
  unknown: <WarningIcon />,
};

const REASON_COPY: Record<AuthenticationErrorReason, { titleSuffix: string; hint: string }> = {
  invalid: {
    titleSuffix: "failed",
    hint: "Check your details and try again, or use another sign-in method.",
  },
  expired: {
    titleSuffix: "expired",
    hint: "This step timed out. Retry to start a fresh attempt.",
  },
  locked: {
    titleSuffix: "temporarily locked",
    hint: "Too many attempts. Wait a moment, then retry or choose another method.",
  },
  network: {
    titleSuffix: "couldn’t complete",
    hint: "A network problem interrupted authentication. Check your connection and retry.",
  },
  canceled: {
    titleSuffix: "canceled",
    hint: "Authentication was canceled. Retry when you are ready, or pick another method.",
  },
  unknown: {
    titleSuffix: "failed",
    hint: "Something went wrong. Retry or try a different authentication method.",
  },
};

export const AUTHENTICATION_ERROR_FLOW_COPY: Record<
  AuthenticationErrorFlow,
  { subject: string; retryLabel: string; alternativeLabel: string }
> = {
  "sign-in": {
    subject: "Sign-in",
    retryLabel: "Try again",
    alternativeLabel: "Other sign-in options",
  },
  "account-creation": {
    subject: "Account creation",
    retryLabel: "Try again",
    alternativeLabel: "Use another method",
  },
  "password-reset": {
    subject: "Password reset",
    retryLabel: "Try again",
    alternativeLabel: "Contact support",
  },
  passkey: {
    subject: "Passkey authentication",
    retryLabel: "Retry passkey",
    alternativeLabel: "Sign in another way",
  },
  "email-verification": {
    subject: "Email verification",
    retryLabel: "Try again",
    alternativeLabel: "Resend or use another method",
  },
  "two-factor": {
    subject: "Two-factor authentication",
    retryLabel: "Try again",
    alternativeLabel: "Use a backup method",
  },
  "session-restoration": {
    subject: "Session restoration",
    retryLabel: "Retry session",
    alternativeLabel: "Sign in again",
  },
};

export function resolveAuthenticationErrorCopy(
  flow: AuthenticationErrorFlow,
  reason: AuthenticationErrorReason
): { title: string; description: string; retryLabel: string; alternativeLabel: string } {
  const flowCopy = AUTHENTICATION_ERROR_FLOW_COPY[flow];
  const reasonCopy = REASON_COPY[reason];
  return {
    title: `${flowCopy.subject} ${reasonCopy.titleSuffix}`,
    description: reasonCopy.hint,
    retryLabel: flowCopy.retryLabel,
    alternativeLabel: flowCopy.alternativeLabel,
  };
}

export const AuthenticationError = React.forwardRef<HTMLDivElement, AuthenticationErrorProps>(
  function AuthenticationError(
    {
      flow = "sign-in",
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
      onTryAlternative,
      alternativeLabel: alternativeLabelProp,
      showAlternative = true,
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
    const defaults = resolveAuthenticationErrorCopy(flow, reason);
    const title = titleProp ?? defaults.title;
    const description = descriptionProp ?? errorMessage ?? defaults.description;
    const retryLabel = retryLabelProp ?? defaults.retryLabel;
    const alternativeLabel = alternativeLabelProp ?? defaults.alternativeLabel;
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
      if (showAlternative && onTryAlternative) {
        next.push({
          id: "alternative",
          label: alternativeLabel,
          onClick: onTryAlternative,
          emphasis: "secondary",
          disabled: actionsDisabled,
        });
      }
      return next.length > 0 ? next : undefined;
    }, [
      actionsDisabled,
      actionsProp,
      alternativeLabel,
      onRetry,
      onTryAlternative,
      retryLabel,
      showAlternative,
      showRetry,
    ]);

    const alertVariant =
      reason === "expired" || reason === "locked" || reason === "canceled"
        ? "warning"
        : "error";

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
          className="dk-authentication-error__alert"
        >
          {description}
        </Alert>
      );

    return (
      <div
        ref={ref}
        id={id}
        className={cx(
          "dk-authentication-error",
          `dk-authentication-error--${variant}`,
          `dk-authentication-error--${flow}`,
          `dk-authentication-error--${reason}`,
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

AuthenticationError.displayName = "AuthenticationError";
export default AuthenticationError;
