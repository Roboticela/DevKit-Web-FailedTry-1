import * as React from "react";
import {
  Alert,
  type AlertDensity,
  type AlertLive,
} from "../../../../../../../alert/vite-express-tauri/v1/files/src/components/ui/Alert";
import {
  Button,
  type ButtonSize,
} from "../../../../../../../button/vite-express-tauri/v1/files/src/components/ui/Button";

/**
 * Account Locked — restriction prompt when an account cannot sign in.
 * Composes Alert + Button only. No custom dialog chrome.
 *
 * Enterprise auth: lockouts, admin holds, policy blocks, and risk signals.
 */

/**
 * Why the account is locked — drives copy and icon.
 * - `attempts` — too many failed sign-ins
 * - `admin` — administrator hold
 * - `policy` — compliance / password-policy enforcement
 * - `risk` — suspicious activity / risk engine
 * - `unknown` — generic lock
 */
export type AccountLockedReason =
  | "attempts"
  | "admin"
  | "policy"
  | "risk"
  | "unknown";

/**
 * - `stacked` — standard Alert + buttons (default)
 * - `compact` — dense Alert
 * - `banner` — full-width banner
 * - `page` — centered auth-route takeover
 */
export type AccountLockedVariant = "stacked" | "compact" | "banner" | "page";

export type AccountLockedProps = {
  reason?: AccountLockedReason;
  variant?: AccountLockedVariant;
  /** Alert heading. Defaults from `reason`. */
  title?: React.ReactNode;
  /** Explain the restriction. Defaults from `reason`. */
  description?: React.ReactNode;
  /** Optional lock reference for support tickets (ticket id, correlation id). */
  referenceId?: string;
  /** Optional unlock / cool-down hint (e.g. “15 minutes”). */
  unlockHint?: string;
  density?: AlertDensity;
  /** Default: `assertive` — lockouts should interrupt. */
  live?: AlertLive;
  /** Primary recovery action (reset password, request unlock, …). */
  onRecover?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  recoverLabel?: string;
  showRecover?: boolean;
  recoverLoading?: boolean;
  /** Secondary support action (contact IT / help desk). */
  onSupport?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  supportLabel?: string;
  showSupport?: boolean;
  supportLoading?: boolean;
  buttonSize?: ButtonSize;
  /** Stretch action buttons on narrow layouts. Default: true for `page`. */
  fullWidthActions?: boolean;
  actionsDisabled?: boolean;
  /** Slot: replace the Button action row. */
  actionsSlot?: React.ReactNode;
  /** Slot: replace Alert entirely (advanced). */
  alertSlot?: React.ReactNode;
  /** Slot: leading security icon. */
  icon?: React.ReactNode;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="4.75" y="9" width="10.5" height="7.25" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9V6.75a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 12v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AdminLockIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M10 2.5 15.5 5v4.2c0 3.4-2.2 5.9-5.5 7.3C6.7 15.1 4.5 12.6 4.5 9.2V5L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8.25 10.25h3.5M10 8.75v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PolicyIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M6 3.75h8A1.25 1.25 0 0 1 15.25 5v11.5L10 14.25 4.75 16.5V5A1.25 1.25 0 0 1 6 3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7.75 8.25h4.5M7.75 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RiskIcon() {
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

function RecoverLeadingIcon() {
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

function SupportLeadingIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7.75a2 2 0 1 1 2.6 1.9c-.7.3-1.1.8-1.1 1.6V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 14.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const REASON_ICON: Record<AccountLockedReason, React.ReactNode> = {
  attempts: <LockIcon />,
  admin: <AdminLockIcon />,
  policy: <PolicyIcon />,
  risk: <RiskIcon />,
  unknown: <LockIcon />,
};

export const ACCOUNT_LOCKED_REASON_COPY: Record<
  AccountLockedReason,
  { title: string; description: string; recoverLabel: string; supportLabel: string }
> = {
  attempts: {
    title: "Account locked",
    description:
      "Too many unsuccessful sign-in attempts. Your account is temporarily locked to protect it. Recover access or contact support if you need help sooner.",
    recoverLabel: "Reset password",
    supportLabel: "Contact support",
  },
  admin: {
    title: "Account held by administrator",
    description:
      "An administrator has restricted this account. Contact your IT support team to request access restoration.",
    recoverLabel: "Request unlock",
    supportLabel: "Contact IT support",
  },
  policy: {
    title: "Account locked by policy",
    description:
      "Organization security policy requires this account to stay locked until recovery steps are completed.",
    recoverLabel: "Start recovery",
    supportLabel: "Contact compliance",
  },
  risk: {
    title: "Account locked for security",
    description:
      "Unusual activity was detected on this account. Sign-in is blocked until you verify recovery and clear the risk check.",
    recoverLabel: "Verify identity",
    supportLabel: "Contact security",
  },
  unknown: {
    title: "Account locked",
    description:
      "This account cannot sign in right now. Use recovery options or contact support for assistance.",
    recoverLabel: "Recover account",
    supportLabel: "Contact support",
  },
};

export const AccountLocked = React.forwardRef<HTMLDivElement, AccountLockedProps>(
  function AccountLocked(
    {
      reason = "attempts",
      variant = "stacked",
      title: titleProp,
      description: descriptionProp,
      referenceId,
      unlockHint,
      density = "standard",
      live = "assertive",
      onRecover,
      recoverLabel: recoverLabelProp,
      showRecover = true,
      recoverLoading = false,
      onSupport,
      supportLabel: supportLabelProp,
      showSupport = true,
      supportLoading = false,
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
    const copy = ACCOUNT_LOCKED_REASON_COPY[reason];
    const title = titleProp ?? copy.title;
    const recoverLabel = recoverLabelProp ?? copy.recoverLabel;
    const supportLabel = supportLabelProp ?? copy.supportLabel;
    const securityIcon = iconProp ?? REASON_ICON[reason];
    const fullWidthActions = fullWidthActionsProp ?? variant === "page";

    const description = (
      <>
        {descriptionProp ?? copy.description}
        {unlockHint ? (
          <>
            {" "}
            <span className="dk-account-locked__hint">
              Estimated unlock: {unlockHint}.
            </span>
          </>
        ) : null}
        {referenceId ? (
          <>
            {" "}
            <span className="dk-account-locked__reference">
              Reference: <span className="dk-account-locked__ref-id">{referenceId}</span>
            </span>
          </>
        ) : null}
      </>
    );

    const defaultActions = (
      <div
        className={cx(
          "dk-account-locked__actions",
          fullWidthActions && "dk-account-locked__actions--full"
        )}
      >
        {showRecover && onRecover ? (
          <Button
            type="button"
            size={buttonSize}
            variant="primary"
            leadingIcon={<RecoverLeadingIcon />}
            loading={recoverLoading}
            loadingLabel={`${recoverLabel}, Loading`}
            disabled={actionsDisabled}
            fullWidth={fullWidthActions}
            onClick={onRecover}
          >
            {recoverLabel}
          </Button>
        ) : null}
        {showSupport && onSupport ? (
          <Button
            type="button"
            size={buttonSize}
            variant="secondary"
            leadingIcon={<SupportLeadingIcon />}
            loading={supportLoading}
            loadingLabel={`${supportLabel}, Loading`}
            disabled={actionsDisabled}
            fullWidth={fullWidthActions}
            onClick={onSupport}
          >
            {supportLabel}
          </Button>
        ) : null}
      </div>
    );

    const alertNode =
      alertSlot ?? (
        <Alert
          variant={reason === "risk" || reason === "admin" ? "error" : "warning"}
          density={variant === "compact" ? "compact" : density}
          title={title}
          icon={securityIcon}
          live={live}
          actionSlot={actionsSlot ?? defaultActions}
          className="dk-account-locked__alert"
        >
          {description}
        </Alert>
      );

    return (
      <div
        ref={ref}
        id={id}
        className={cx(
          "dk-account-locked",
          `dk-account-locked--${variant}`,
          `dk-account-locked--${reason}`,
          className
        )}
        data-variant={variant}
        data-reason={reason}
        data-reference-id={referenceId || undefined}
      >
        <div className="dk-account-locked__inner">{alertNode}</div>
      </div>
    );
  }
);

AccountLocked.displayName = "AccountLocked";
export default AccountLocked;
