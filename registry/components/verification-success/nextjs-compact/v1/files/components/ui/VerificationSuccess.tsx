import * as React from "react";
import {
  Alert,
  type AlertAction,
  type AlertDensity,
  type AlertLive,
} from "../../../../../../../alert/nextjs-compact/v1/files/components/ui/Alert";
import {
  Badge,
  type BadgeSize,
} from "../../../../../../../badge/nextjs-compact/v1/files/components/ui/Badge";

/**
 * Verification Success — confirmation UI after a successful auth check.
 * Composes Alert + Badge only. No custom status chrome.
 *
 * Flows: email-verification · phone-verification · passkeys · two-factor
 */

export type VerificationSuccessFlow =
  | "email-verification"
  | "phone-verification"
  | "passkeys"
  | "two-factor";

/**
 * - `stacked` — badges above Alert (default)
 * - `compact` — dense Alert + inline badge
 * - `inline` — single-row meta + alert body
 * - `banner` — full-width Alert-forward
 */
export type VerificationSuccessVariant = "stacked" | "compact" | "inline" | "banner";

export type VerificationSuccessProps = {
  flow?: VerificationSuccessFlow;
  variant?: VerificationSuccessVariant;
  /** Alert heading. Defaults from `flow`. */
  title?: React.ReactNode;
  /** Alert body. Defaults from `flow`. */
  description?: React.ReactNode;
  /** Status Badge label. Default: “Verified”. */
  badgeLabel?: string;
  showStatusBadge?: boolean;
  badgeSize?: BadgeSize;
  density?: AlertDensity;
  live?: AlertLive;
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
  /**
   * Optional destination hint (URL or route name).
   * Shown in the Alert body and/or redirect Badge.
   */
  redirectTo?: string;
  /** Seconds until `onRedirect`. When set, shows a live redirect Badge. */
  redirectDelay?: number;
  /** Override redirect Badge / copy prefix. */
  redirectLabel?: string;
  showRedirectBadge?: boolean;
  /** Fires when the redirect delay elapses (host performs navigation). */
  onRedirect?: () => void;
  /** Alert structured actions (Continue, Go to dashboard, …). */
  actions?: AlertAction[];
  /** Free-form action slot — prefer Alert actions when possible. */
  actionSlot?: React.ReactNode;
  /** Slot: replace status Badge. */
  badgeSlot?: React.ReactNode;
  /** Slot: replace redirect Badge. */
  redirectBadgeSlot?: React.ReactNode;
  /** Slot: replace Alert entirely (advanced). */
  alertSlot?: React.ReactNode;
  /** Slot: leading confirmation icon (Alert + Badge). */
  icon?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function VerifiedIcon() {
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

function EmailIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="3.25" y="5.25" width="13.5" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4.5 6.75 5.5 4 5.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="6.25" y="2.75" width="7.5" height="14.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 14.75h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PasskeyIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="8" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5 16 16M14.25 14.25l1.75 1.75M14.25 16l1.75-1.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

function RedirectIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M11.5 4.75H15.25V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.25 4.75 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 5.5H6.75A2.25 2.25 0 0 0 4.5 7.75v5.5A2.25 2.25 0 0 0 6.75 15.5h5.5a2.25 2.25 0 0 0 2.25-2.25V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const FLOW_ICON: Record<VerificationSuccessFlow, React.ReactNode> = {
  "email-verification": <EmailIcon />,
  "phone-verification": <PhoneIcon />,
  passkeys: <PasskeyIcon />,
  "two-factor": <ShieldIcon />,
};

export const VERIFICATION_SUCCESS_FLOW_COPY: Record<
  VerificationSuccessFlow,
  { title: string; description: string; badgeLabel: string }
> = {
  "email-verification": {
    title: "Email verified",
    description: "Your email address is confirmed. You can continue.",
    badgeLabel: "Email verified",
  },
  "phone-verification": {
    title: "Phone verified",
    description: "Your phone number is confirmed. You can continue.",
    badgeLabel: "Phone verified",
  },
  passkeys: {
    title: "Passkey verified",
    description: "Your passkey was accepted. You are signed in securely.",
    badgeLabel: "Passkey OK",
  },
  "two-factor": {
    title: "Two-factor verified",
    description: "Second-factor authentication succeeded.",
    badgeLabel: "2FA verified",
  },
};

export const VerificationSuccess = React.forwardRef<HTMLDivElement, VerificationSuccessProps>(
  function VerificationSuccess(
    {
      flow = "email-verification",
      variant = "stacked",
      title: titleProp,
      description: descriptionProp,
      badgeLabel: badgeLabelProp,
      showStatusBadge = true,
      badgeSize = "sm",
      density = "standard",
      live = "polite",
      dismissible = false,
      onDismiss,
      dismissLabel,
      redirectTo,
      redirectDelay,
      redirectLabel = "Continuing",
      showRedirectBadge = true,
      onRedirect,
      actions,
      actionSlot,
      badgeSlot,
      redirectBadgeSlot,
      alertSlot,
      icon: iconProp,
      className = "",
      id,
    },
    ref
  ) {
    const copy = VERIFICATION_SUCCESS_FLOW_COPY[flow];
    const title = titleProp ?? copy.title;
    const description = descriptionProp ?? copy.description;
    const badgeLabel = badgeLabelProp ?? copy.badgeLabel;
    const confirmationIcon = iconProp ?? FLOW_ICON[flow];

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
      const id = window.setInterval(() => {
        const left = Math.max(0, Math.ceil((totalMs - (Date.now() - started)) / 1000));
        setSecondsLeft(left);
        if (left <= 0 && !redirectedRef.current) {
          redirectedRef.current = true;
          window.clearInterval(id);
          onRedirect?.();
        }
      }, 250);
      return () => window.clearInterval(id);
    }, [onRedirect, redirectDelay]);

    const statusBadge =
      badgeSlot ??
      (showStatusBadge ? (
        <Badge
          appearance="icon-label"
          tone="positive"
          shape="soft"
          size={badgeSize}
          icon={confirmationIcon ?? <VerifiedIcon />}
          label={badgeLabel}
          accessibleLabel={badgeLabel}
        />
      ) : null);

    const redirectActive = secondsLeft != null;
    const redirectBadge =
      redirectBadgeSlot ??
      (showRedirectBadge && (redirectActive || redirectTo) ? (
        <Badge
          appearance="icon-label"
          tone={redirectActive ? "accent" : "neutral"}
          shape="soft"
          size={badgeSize}
          icon={<RedirectIcon />}
          label={
            redirectActive
              ? `${redirectLabel} in ${secondsLeft}s`
              : redirectTo
                ? `Next: ${redirectTo}`
                : redirectLabel
          }
          accessibleLabel={
            redirectActive
              ? `${redirectLabel} in ${secondsLeft} seconds`
              : redirectTo
                ? `Next destination ${redirectTo}`
                : redirectLabel
          }
        />
      ) : null);

    const body = (
      <>
        {description}
        {redirectTo && !redirectActive ? (
          <>
            {" "}
            <span className="dk-verification-success__redirect-text">
              Next: {redirectTo}
            </span>
          </>
        ) : null}
        {redirectActive && redirectTo ? (
          <>
            {" "}
            <span className="dk-verification-success__redirect-text">
              Redirecting to {redirectTo}…
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
          icon={confirmationIcon}
          live={live}
          dismissible={dismissible}
          onDismiss={onDismiss}
          dismissLabel={dismissLabel}
          actions={actions}
          actionSlot={actionSlot}
          className="dk-verification-success__alert"
        >
          {body}
        </Alert>
      );

    return (
      <div
        ref={ref}
        id={id}
        className={cx(
          "dk-verification-success",
          `dk-verification-success--${variant}`,
          `dk-verification-success--${flow}`,
          redirectActive && "dk-verification-success--redirecting",
          className
        )}
        data-variant={variant}
        data-flow={flow}
        data-redirecting={redirectActive || undefined}
        role="status"
      >
        {(statusBadge || redirectBadge) && variant !== "banner" ? (
          <div className="dk-verification-success__meta">
            {statusBadge}
            {redirectBadge}
          </div>
        ) : null}

        {variant === "banner" && (statusBadge || redirectBadge) ? (
          <div className="dk-verification-success__meta dk-verification-success__meta--banner">
            {statusBadge}
            {redirectBadge}
          </div>
        ) : null}

        {alertNode}
      </div>
    );
  }
);

VerificationSuccess.displayName = "VerificationSuccess";
export default VerificationSuccess;
