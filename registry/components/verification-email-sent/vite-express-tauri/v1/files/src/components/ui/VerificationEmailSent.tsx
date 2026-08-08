import * as React from "react";
import {
  Alert,
  type AlertAction,
  type AlertDensity,
  type AlertLive,
} from "../../../../../../../alert/vite-express-tauri/v1/files/src/components/ui/Alert";
import { Card, type CardVariant } from "../../../../../../../card/vite-express-tauri/v1/files/src/components/ui/Card";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../../../../../../button/vite-express-tauri/v1/files/src/components/ui/Button";
import {
  CountdownTimer,
  type CountdownTimerProps,
  type CountdownTimerVariant,
} from "../../../../../../../countdown-timer/vite-express-tauri/v1/files/src/components/ui/CountdownTimer";
import {
  ResendVerification,
  type ResendVerificationProps,
  type ResendVerificationStatus,
} from "../../../../../../../resend-verification/vite-express-tauri/v1/files/src/components/ui/ResendVerification";

/**
 * Verification Email Sent — confirmation after sending a verification email.
 * Composes Alert, Card, Button, Countdown Timer, and Resend Verification.
 * Do not reimplement resend or countdown logic.
 */

/**
 * - `stacked` — card with alert, expiry timer, resend, then actions
 * - `compact` — dense card
 * - `split` — alert in header; timer + resend + actions in body/footer
 */
export type VerificationEmailSentVariant = "stacked" | "compact" | "split";

/**
 * Host / send lifecycle (separate from Resend Verification status).
 * - `sent` — confirmation shown (default)
 * - `loading` — send/resend UI busy at the page level
 * - `error` — send failed; show error Alert
 */
export type VerificationEmailSentStatus = "sent" | "loading" | "error";

export type VerificationEmailSentProps = {
  /** Destination address shown in the confirmation. */
  email: string;
  variant?: VerificationEmailSentVariant;
  cardVariant?: CardVariant;
  status?: VerificationEmailSentStatus;
  title?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  /** Verification-link expiry window (Countdown Timer). Default: 120s. */
  linkExpiryDuration?: number;
  showLinkExpiry?: boolean;
  linkExpiryLabel?: string;
  linkExpiredLabel?: string;
  timerVariant?: CountdownTimerVariant;
  onLinkExpire?: () => void;
  /** Forwarded to Resend Verification (`flow` fixed to email-verification). */
  onResend?: () => void | Promise<void>;
  resendCooldownDuration?: number;
  resendStatus?: ResendVerificationStatus;
  onResendStatusChange?: (status: ResendVerificationStatus) => void;
  resendDisabled?: boolean;
  showResend?: boolean;
  /** Opens the user’s mail client / inbox. Defaults to `mailto:` when omitted. */
  onOpenEmailApp?: () => void;
  openEmailAppHref?: string;
  openEmailAppLabel?: string;
  showOpenEmailApp?: boolean;
  /** Change / correct the destination address. */
  onChangeEmail?: () => void;
  changeEmailLabel?: string;
  showChangeEmail?: boolean;
  openEmailButtonSize?: ButtonSize;
  openEmailButtonVariant?: ButtonVariant;
  changeEmailButtonSize?: ButtonSize;
  changeEmailButtonVariant?: ButtonVariant;
  density?: AlertDensity;
  live?: AlertLive;
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
  /** Extra Alert actions (appended after convenience actions when provided alone). */
  actions?: AlertAction[];
  actionSlot?: React.ReactNode;
  alertSlot?: React.ReactNode;
  cardSlot?: React.ReactNode;
  timerSlot?: React.ReactNode;
  resendSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  id?: string;
  timerProps?: Omit<
    CountdownTimerProps,
    "duration" | "flow" | "label" | "expiredLabel" | "onExpire" | "variant" | "autoStart"
  >;
  resendProps?: Omit<
    ResendVerificationProps,
    | "flow"
    | "onResend"
    | "status"
    | "onStatusChange"
    | "cooldownDuration"
    | "duration"
    | "disabled"
  >;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function MailSentIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.75" y="4.75" width="14.5" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 6.25 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="m12.25 11.25 1.5 1.5 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M3.5 6.5h13v8.25a1.5 1.5 0 0 1-1.5 1.5h-10a1.5 1.5 0 0 1-1.5-1.5V6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M3.5 6.5 10 11l6.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3.5 12.5h3.25L8 14.5h4l1.25-2H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function EditEmailIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M11.5 4.75h-6a1.5 1.5 0 0 0-1.5 1.5v8.5a1.5 1.5 0 0 0 1.5 1.5h8.5a1.5 1.5 0 0 0 1.5-1.5v-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="m10.75 9.5 5.5-5.5 1.75 1.75-5.5 5.5-2.25.5.5-2.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function defaultDescription(email: string): React.ReactNode {
  return (
    <>
      We sent a verification link to{" "}
      <strong className="dk-verification-email-sent__email">{email}</strong>. Open your inbox to
      continue.
    </>
  );
}

export const VerificationEmailSent = React.forwardRef<HTMLDivElement, VerificationEmailSentProps>(
  function VerificationEmailSent(
    {
      email,
      variant = "stacked",
      cardVariant = "outlined",
      status = "sent",
      title,
      description,
      errorMessage,
      linkExpiryDuration = 120,
      showLinkExpiry = true,
      linkExpiryLabel = "Verification link expires in",
      linkExpiredLabel = "Verification link expired",
      timerVariant = "compact",
      onLinkExpire,
      onResend,
      resendCooldownDuration,
      resendStatus,
      onResendStatusChange,
      resendDisabled = false,
      showResend = true,
      onOpenEmailApp,
      openEmailAppHref,
      openEmailAppLabel = "Open email app",
      showOpenEmailApp = true,
      onChangeEmail,
      changeEmailLabel = "Change email",
      showChangeEmail = true,
      openEmailButtonSize = "sm",
      openEmailButtonVariant = "primary",
      changeEmailButtonSize = "sm",
      changeEmailButtonVariant = "secondary",
      density,
      live,
      dismissible,
      onDismiss,
      dismissLabel,
      actions,
      actionSlot,
      alertSlot,
      cardSlot,
      timerSlot,
      resendSlot,
      actionsSlot,
      icon,
      className = "",
      id,
      timerProps,
      resendProps,
    },
    ref
  ) {
    const isError = status === "error";
    const isLoading = status === "loading";

    const resolvedTitle =
      title ??
      (isError
        ? "Could not send verification email"
        : isLoading
          ? "Sending verification email"
          : "Verification email sent");

    const resolvedDescription =
      description ??
      (isError
        ? (errorMessage ?? "Something went wrong while sending the verification email. Try again.")
        : isLoading
          ? (
              <>
                Sending a verification link to{" "}
                <strong className="dk-verification-email-sent__email">{email}</strong>…
              </>
            )
          : defaultDescription(email));

    const alertNode =
      alertSlot !== undefined ? (
        alertSlot
      ) : (
        <Alert
          variant={isError ? "error" : isLoading ? "informational" : "success"}
          density={variant === "compact" ? "compact" : density}
          title={resolvedTitle}
          icon={icon === undefined ? <MailSentIcon /> : icon}
          live={live ?? (isError ? "assertive" : "polite")}
          dismissible={dismissible}
          onDismiss={onDismiss}
          dismissLabel={dismissLabel}
          actions={actions}
          actionSlot={actionSlot}
        >
          {resolvedDescription}
        </Alert>
      );

    const timerNode =
      timerSlot !== undefined
        ? timerSlot
        : showLinkExpiry && !isError
          ? (
              <CountdownTimer
                flow="email-confirmation"
                duration={linkExpiryDuration}
                autoStart={!isLoading}
                variant={timerVariant}
                label={linkExpiryLabel}
                expiredLabel={linkExpiredLabel}
                showControls={false}
                showProgress={variant !== "compact"}
                disabled={isLoading}
                onExpire={onLinkExpire}
                {...timerProps}
              />
            )
          : null;

    const resendNode =
      resendSlot !== undefined
        ? resendSlot
        : showResend
          ? (
              <ResendVerification
                flow="email-verification"
                variant={variant === "compact" ? "compact" : "stacked"}
                cooldownDuration={resendCooldownDuration}
                status={resendStatus}
                onStatusChange={onResendStatusChange}
                onResend={onResend}
                disabled={resendDisabled || isLoading}
                fullWidth
                {...resendProps}
              />
            )
          : null;

    const mailtoHref = openEmailAppHref ?? (email ? `mailto:${email}` : "mailto:");

    const openEmailButton = showOpenEmailApp ? (
      <Button
        type="button"
        size={openEmailButtonSize}
        variant={openEmailButtonVariant}
        leadingIcon={<InboxIcon />}
        loading={isLoading && !showResend}
        disabled={isLoading}
        fullWidth={variant !== "split"}
        onClick={() => {
          if (onOpenEmailApp) {
            onOpenEmailApp();
            return;
          }
          if (typeof window !== "undefined") {
            window.location.assign(mailtoHref);
          }
        }}
      >
        {openEmailAppLabel}
      </Button>
    ) : null;

    const changeEmailButton =
      showChangeEmail && onChangeEmail ? (
        <Button
          type="button"
          size={changeEmailButtonSize}
          variant={changeEmailButtonVariant}
          leadingIcon={<EditEmailIcon />}
          disabled={isLoading}
          fullWidth={variant !== "split"}
          onClick={onChangeEmail}
        >
          {changeEmailLabel}
        </Button>
      ) : null;

    const footerActions =
      actionsSlot !== undefined ? (
        actionsSlot
      ) : (
        <Card.Actions className="dk-verification-email-sent__actions">
          {openEmailButton}
          {changeEmailButton}
        </Card.Actions>
      );

    const body = (
      <>
        {variant === "split" ? null : <div className="dk-verification-email-sent__alert">{alertNode}</div>}
        {timerNode ? <div className="dk-verification-email-sent__timer">{timerNode}</div> : null}
        {resendNode ? <div className="dk-verification-email-sent__resend">{resendNode}</div> : null}
      </>
    );

    const cardInner = (
      <>
        {variant === "split" ? (
          <Card.Header className="dk-verification-email-sent__header">
            {alertNode}
          </Card.Header>
        ) : null}
        <Card.Body className="dk-verification-email-sent__body">{body}</Card.Body>
        {(showOpenEmailApp || (showChangeEmail && onChangeEmail) || actionsSlot) && (
          <Card.Footer className="dk-verification-email-sent__footer">{footerActions}</Card.Footer>
        )}
      </>
    );

    const cardNode =
      cardSlot !== undefined ? (
        cardSlot
      ) : (
        <Card
          variant={cardVariant}
          className="dk-verification-email-sent__card"
          aria-label={typeof resolvedTitle === "string" ? resolvedTitle : "Verification email sent"}
        >
          {cardInner}
        </Card>
      );

    return (
      <div
        ref={ref}
        id={id}
        className={cx(
          "dk-verification-email-sent",
          `dk-verification-email-sent--${variant}`,
          `dk-verification-email-sent--${status}`,
          className
        )}
        data-variant={variant}
        data-status={status}
        data-email={email}
        role="region"
        aria-label={typeof resolvedTitle === "string" ? resolvedTitle : "Verification email sent"}
        aria-busy={isLoading || undefined}
      >
        {cardNode}
      </div>
    );
  }
);

VerificationEmailSent.displayName = "VerificationEmailSent";
export default VerificationEmailSent;
