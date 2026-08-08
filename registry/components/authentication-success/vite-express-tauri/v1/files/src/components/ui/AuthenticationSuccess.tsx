import * as React from "react";
import {
  Alert,
  type AlertAction,
  type AlertDensity,
  type AlertLive,
} from "../../../../../../../alert/vite-express-tauri/v1/files/src/components/ui/Alert";

/**
 * Authentication Success — confirmation after a successful auth step.
 * Composes Alert only. No custom success chrome.
 *
 * Flows: sign-in · account-creation · password-reset · passkey ·
 * email-verification · two-factor · session-restoration
 */

export type AuthenticationSuccessFlow =
  | "sign-in"
  | "account-creation"
  | "password-reset"
  | "passkey"
  | "email-verification"
  | "two-factor"
  | "session-restoration";

/**
 * - `stacked` — standard Alert (default)
 * - `compact` — dense Alert
 * - `banner` — full-width Alert-forward
 */
export type AuthenticationSuccessVariant = "stacked" | "compact" | "banner";

export type AuthenticationSuccessProps = {
  flow?: AuthenticationSuccessFlow;
  variant?: AuthenticationSuccessVariant;
  /** Alert heading. Defaults from `flow`. */
  title?: React.ReactNode;
  /** Alert body. Defaults from `flow`. */
  description?: React.ReactNode;
  density?: AlertDensity;
  live?: AlertLive;
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
  /**
   * Optional destination hint (URL or route name).
   * Shown in the Alert body with the redirect countdown.
   */
  redirectTo?: string;
  /** Seconds until `onRedirect`. When set, Alert body shows a live countdown. */
  redirectDelay?: number;
  /** Prefix for countdown copy. Default: “Continuing”. */
  redirectLabel?: string;
  showRedirectCountdown?: boolean;
  /** Fires when the redirect delay elapses (host performs navigation). */
  onRedirect?: () => void;
  /** Alert structured actions (Continue, Go to dashboard, …). */
  actions?: AlertAction[];
  /** Free-form action slot — prefer Alert actions when possible. */
  actionSlot?: React.ReactNode;
  /**
   * Convenience Continue action when `actions` omitted.
   * Uses `redirectTo` as `href` when provided.
   */
  onContinue?: (event: React.MouseEvent<HTMLElement>) => void;
  continueLabel?: string;
  showContinue?: boolean;
  /** Slot: replace Alert entirely (advanced). */
  alertSlot?: React.ReactNode;
  /** Slot: leading success icon. */
  icon?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
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

function SignInIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M8.5 10h7.25M13.25 7.25 16 10l-2.75 2.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 4.75H6.75A2.25 2.25 0 0 0 4.5 7v6a2.25 2.25 0 0 0 2.25 2.25H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="7" r="2.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.75 16.25c.7-2.6 2.6-3.75 5.25-3.75s4.55 1.15 5.25 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="8" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5 16 16M14.25 14.25l1.75 1.75M14.25 16l1.75-1.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="3.25" y="5.25" width="13.5" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4.5 6.75 5.5 4 5.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M10 2.5 15.5 5v4.2c0 3.4-2.2 5.9-5.5 7.3C6.7 15.1 4.5 12.6 4.5 9.2V5L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="m7.5 9.75 1.75 1.75 3.25-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SessionIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M4.5 6.5h11M4.5 10h11M4.5 13.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3.25" y="3.75" width="13.5" height="12.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M4.75 10a5.25 5.25 0 0 1 9.05-3.6M15.25 10a5.25 5.25 0 0 1-9.05 3.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M14.25 3.75v3.5h-3.5M5.75 16.25v-3.5h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FLOW_ICON: Record<AuthenticationSuccessFlow, React.ReactNode> = {
  "sign-in": <SignInIcon />,
  "account-creation": <AccountIcon />,
  "password-reset": <ResetIcon />,
  passkey: <KeyIcon />,
  "email-verification": <EmailIcon />,
  "two-factor": <ShieldIcon />,
  "session-restoration": <SessionIcon />,
};

export const AUTHENTICATION_SUCCESS_FLOW_COPY: Record<
  AuthenticationSuccessFlow,
  { title: string; description: string; continueLabel: string }
> = {
  "sign-in": {
    title: "Signed in",
    description: "You are signed in successfully.",
    continueLabel: "Continue",
  },
  "account-creation": {
    title: "Account created",
    description: "Your account is ready. You can continue to your workspace.",
    continueLabel: "Get started",
  },
  "password-reset": {
    title: "Password updated",
    description: "Your password was changed successfully.",
    continueLabel: "Sign in",
  },
  passkey: {
    title: "Passkey authenticated",
    description: "Your passkey was accepted. You are signed in securely.",
    continueLabel: "Continue",
  },
  "email-verification": {
    title: "Email verified",
    description: "Your email address is confirmed.",
    continueLabel: "Continue",
  },
  "two-factor": {
    title: "Two-factor complete",
    description: "Second-factor authentication succeeded.",
    continueLabel: "Continue",
  },
  "session-restoration": {
    title: "Session restored",
    description: "Your secure session is ready.",
    continueLabel: "Go to app",
  },
};

export const AuthenticationSuccess = React.forwardRef<
  HTMLDivElement,
  AuthenticationSuccessProps
>(function AuthenticationSuccess(
  {
    flow = "sign-in",
    variant = "stacked",
    title: titleProp,
    description: descriptionProp,
    density = "standard",
    live = "polite",
    dismissible = false,
    onDismiss,
    dismissLabel,
    redirectTo,
    redirectDelay,
    redirectLabel = "Continuing",
    showRedirectCountdown = true,
    onRedirect,
    actions: actionsProp,
    actionSlot,
    onContinue,
    continueLabel: continueLabelProp,
    showContinue = true,
    alertSlot,
    icon: iconProp,
    className = "",
    id,
  },
  ref
) {
  const copy = AUTHENTICATION_SUCCESS_FLOW_COPY[flow];
  const title = titleProp ?? copy.title;
  const description = descriptionProp ?? copy.description;
  const continueLabel = continueLabelProp ?? copy.continueLabel;
  const successIcon = iconProp ?? FLOW_ICON[flow] ?? <SuccessIcon />;

  const [secondsLeft, setSecondsLeft] = React.useState(
    typeof redirectDelay === "number" && redirectDelay > 0 ? Math.ceil(redirectDelay) : null
  );
  const redirectedRef = React.useRef(false);

  React.useEffect(() => {
    if (typeof redirectDelay !== "number" || redirectDelay <= 0) {
      setSecondsLeft(null);
      return;
    }
    redirectedRef.current = false;
    setSecondsLeft(Math.ceil(redirectDelay));
    const started = Date.now();
    const totalMs = redirectDelay * 1000;
    const timerId = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((totalMs - (Date.now() - started)) / 1000));
      setSecondsLeft(left);
      if (left <= 0 && !redirectedRef.current) {
        redirectedRef.current = true;
        window.clearInterval(timerId);
        onRedirect?.();
      }
    }, 250);
    return () => window.clearInterval(timerId);
  }, [onRedirect, redirectDelay]);

  const redirectActive = showRedirectCountdown && secondsLeft != null;

  const convenienceActions = React.useMemo(() => {
    if (actionsProp) return actionsProp;
    if (!showContinue || (!onContinue && !redirectTo)) return undefined;
    return [
      {
        id: "continue",
        label: continueLabel,
        href: redirectTo,
        onClick: onContinue,
        emphasis: "primary" as const,
      },
    ];
  }, [actionsProp, continueLabel, onContinue, redirectTo, showContinue]);

  const body = (
    <>
      {description}
      {redirectTo && !redirectActive ? (
        <>
          {" "}
          <span className="dk-authentication-success__redirect">
            Next: {redirectTo}
          </span>
        </>
      ) : null}
      {redirectActive ? (
        <>
          {" "}
          <span className="dk-authentication-success__redirect" aria-live="polite">
            {redirectTo
              ? `${redirectLabel} to ${redirectTo} in ${secondsLeft}s…`
              : `${redirectLabel} in ${secondsLeft}s…`}
          </span>
        </>
      ) : null}
    </>
  );

  const alertNode =
    alertSlot ?? (
      <Alert
        variant="success"
        density={variant === "compact" ? "compact" : density}
        title={title}
        icon={successIcon}
        live={live}
        dismissible={dismissible}
        onDismiss={onDismiss}
        dismissLabel={dismissLabel}
        actions={convenienceActions}
        actionSlot={actionSlot}
        className="dk-authentication-success__alert"
      >
        {body}
      </Alert>
    );

  return (
    <div
      ref={ref}
      id={id}
      className={cx(
        "dk-authentication-success",
        `dk-authentication-success--${variant}`,
        `dk-authentication-success--${flow}`,
        redirectActive && "dk-authentication-success--redirecting",
        className
      )}
      data-variant={variant}
      data-flow={flow}
      data-redirecting={redirectActive || undefined}
      role="status"
    >
      {alertNode}
    </div>
  );
});

AuthenticationSuccess.displayName = "AuthenticationSuccess";
export default AuthenticationSuccess;
