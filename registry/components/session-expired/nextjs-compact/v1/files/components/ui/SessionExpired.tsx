import * as React from "react";
import {
  Alert,
  type AlertDensity,
  type AlertLive,
} from "../../../../../../../alert/nextjs-compact/v1/files/components/ui/Alert";
import {
  Button,
  type ButtonSize,
} from "../../../../../../../button/nextjs-compact/v1/files/components/ui/Button";

/**
 * Session Expired — re-authentication prompt when a protected session ends.
 * Composes Alert + Button only. No custom dialog chrome.
 *
 * Use on protected routes, API 401 interceptors, and idle / absolute timeouts.
 */

/**
 * Why the session ended — drives copy and icon.
 * - `idle` — inactivity timeout
 * - `absolute` — max session lifetime
 * - `revoked` — signed out elsewhere / admin revoke
 * - `unknown` — generic expiry
 */
export type SessionExpiredReason = "idle" | "absolute" | "revoked" | "unknown";

/**
 * - `stacked` — standard Alert + buttons (default)
 * - `compact` — dense Alert
 * - `banner` — full-width route banner
 * - `page` — centered protected-route takeover
 */
export type SessionExpiredVariant = "stacked" | "compact" | "banner" | "page";

export type SessionExpiredProps = {
  reason?: SessionExpiredReason;
  variant?: SessionExpiredVariant;
  /** Alert heading. Defaults from `reason`. */
  title?: React.ReactNode;
  /** Alert body explaining why re-auth is required. */
  description?: React.ReactNode;
  density?: AlertDensity;
  /** Default: `assertive` — session loss should interrupt. */
  live?: AlertLive;
  /**
   * Optional path the user was trying to reach.
   * Shown in the message; hosts can pass to sign-in as `returnUrl`.
   */
  returnUrl?: string;
  /** Primary: re-authenticate. */
  onSignIn?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  signInLabel?: string;
  showSignIn?: boolean;
  signInLoading?: boolean;
  /** Secondary action (e.g. go home, dismiss to public area). */
  onSecondary?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  secondaryLabel?: string;
  showSecondary?: boolean;
  secondaryLoading?: boolean;
  buttonSize?: ButtonSize;
  /** Stretch action buttons on narrow layouts. Default: true for `page`. */
  fullWidthActions?: boolean;
  actionsDisabled?: boolean;
  /** Slot: replace the Button action row. */
  actionsSlot?: React.ReactNode;
  /** Slot: replace Alert entirely (advanced). */
  alertSlot?: React.ReactNode;
  /** Slot: leading security / time icon. */
  icon?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function SessionClockIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3.5h4M10 3.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 8.25v3l2 1.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldClockIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M10 2.5 15.5 5v4.2c0 3.4-2.2 5.9-5.5 7.3C6.7 15.1 4.5 12.6 4.5 9.2V5L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 7.25v2.75l1.75 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RevokedIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="4.75" y="9" width="10.5" height="7.25" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9V6.75a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.25 12.75h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SignInLeadingIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M8.5 10h7.25M13.25 7.25 16 10l-2.75 2.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 4.75H6.75A2.25 2.25 0 0 0 4.5 7v6a2.25 2.25 0 0 0 2.25 2.25H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HomeLeadingIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M3.75 9.25 10 3.75l6.25 5.5V16a1.25 1.25 0 0 1-1.25 1.25H5A1.25 1.25 0 0 1 3.75 16V9.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 17.25v-4.5h4v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

const REASON_ICON: Record<SessionExpiredReason, React.ReactNode> = {
  idle: <SessionClockIcon />,
  absolute: <ShieldClockIcon />,
  revoked: <RevokedIcon />,
  unknown: <ShieldClockIcon />,
};

export const SESSION_EXPIRED_REASON_COPY: Record<
  SessionExpiredReason,
  { title: string; description: string; secondaryLabel: string }
> = {
  idle: {
    title: "Session expired",
    description:
      "You were signed out after a period of inactivity to protect your account. Sign in again to continue.",
    secondaryLabel: "Go to home",
  },
  absolute: {
    title: "Session timed out",
    description:
      "Your secure session reached its maximum lifetime. Sign in again to continue where you left off.",
    secondaryLabel: "Go to home",
  },
  revoked: {
    title: "Session ended",
    description:
      "This session is no longer valid. It may have been signed out elsewhere. Sign in again to continue.",
    secondaryLabel: "Go to home",
  },
  unknown: {
    title: "Session expired",
    description:
      "Your session is no longer active. Sign in again to access protected content.",
    secondaryLabel: "Go to home",
  },
};

export const SessionExpired = React.forwardRef<HTMLDivElement, SessionExpiredProps>(
  function SessionExpired(
    {
      reason = "idle",
      variant = "stacked",
      title: titleProp,
      description: descriptionProp,
      density = "standard",
      live = "assertive",
      returnUrl,
      onSignIn,
      signInLabel = "Sign in again",
      showSignIn = true,
      signInLoading = false,
      onSecondary,
      secondaryLabel: secondaryLabelProp,
      showSecondary = true,
      secondaryLoading = false,
      buttonSize = "md",
      fullWidthActions: fullWidthActionsProp,
      actionsDisabled = false,
      actionsSlot,
      alertSlot,
      icon: iconProp,
      className = "",
      id,
    },
    ref
  ) {
    const copy = SESSION_EXPIRED_REASON_COPY[reason];
    const title = titleProp ?? copy.title;
    const secondaryLabel = secondaryLabelProp ?? copy.secondaryLabel;
    const securityIcon = iconProp ?? REASON_ICON[reason];
    const fullWidthActions = fullWidthActionsProp ?? variant === "page";

    const description = (
      <>
        {descriptionProp ?? copy.description}
        {returnUrl ? (
          <>
            {" "}
            <span className="dk-session-expired__return">
              You were trying to open <span className="dk-session-expired__path">{returnUrl}</span>.
            </span>
          </>
        ) : null}
      </>
    );

    const defaultActions = (
      <div
        className={cx(
          "dk-session-expired__actions",
          fullWidthActions && "dk-session-expired__actions--full"
        )}
      >
        {showSignIn ? (
          <Button
            type="button"
            size={buttonSize}
            variant="primary"
            leadingIcon={<SignInLeadingIcon />}
            loading={signInLoading}
            loadingLabel={`${signInLabel}, Loading`}
            disabled={actionsDisabled}
            fullWidth={fullWidthActions}
            onClick={onSignIn}
          >
            {signInLabel}
          </Button>
        ) : null}
        {showSecondary && onSecondary ? (
          <Button
            type="button"
            size={buttonSize}
            variant="secondary"
            leadingIcon={<HomeLeadingIcon />}
            loading={secondaryLoading}
            loadingLabel={`${secondaryLabel}, Loading`}
            disabled={actionsDisabled}
            fullWidth={fullWidthActions}
            onClick={onSecondary}
          >
            {secondaryLabel}
          </Button>
        ) : null}
      </div>
    );

    const alertNode =
      alertSlot ?? (
        <Alert
          variant="warning"
          density={variant === "compact" ? "compact" : density}
          title={title}
          icon={securityIcon}
          live={live}
          actionSlot={actionsSlot ?? defaultActions}
          className="dk-session-expired__alert"
        >
          {description}
        </Alert>
      );

    return (
      <div
        ref={ref}
        id={id}
        className={cx(
          "dk-session-expired",
          `dk-session-expired--${variant}`,
          `dk-session-expired--${reason}`,
          className
        )}
        data-variant={variant}
        data-reason={reason}
        data-return-url={returnUrl || undefined}
      >
        <div className="dk-session-expired__inner">{alertNode}</div>
      </div>
    );
  }
);

SessionExpired.displayName = "SessionExpired";
export default SessionExpired;
