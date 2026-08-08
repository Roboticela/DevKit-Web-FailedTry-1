import * as React from "react";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "../../../../../../../button/nextjs-compact/v1/files/components/ui/Button";
import { Icon, type IconSize } from "../../../../../../../icon/nextjs-compact/v1/files/components/ui/Icon";
import {
  CountdownTimer,
  type CountdownTimerHandle,
  type CountdownTimerProps,
  type CountdownTimerVariant,
} from "../../../../../../../countdown-timer/nextjs-compact/v1/files/components/ui/CountdownTimer";

/**
 * Resend Verification — cooldown-gated resend for auth flows.
 * Composes Button, Icon, and Countdown Timer only. No custom countdown.
 */

export type ResendVerificationFlow =
  | "email-verification"
  | "otp-verification"
  | "password-reset"
  | "magic-link"
  | "two-factor";

/**
 * - `idle` — cooldown finished; resend available
 * - `cooldown` — waiting; interactions disabled
 * - `loading` — resend in flight
 * - `success` — last resend succeeded (restarts cooldown)
 * - `error` — last resend failed (resend stays available)
 */
export type ResendVerificationStatus = "idle" | "cooldown" | "loading" | "success" | "error";

/**
 * - `stacked` — timer above action (forms)
 * - `inline` — timer + button in one responsive row
 * - `compact` — dense stacked layout
 */
export type ResendVerificationVariant = "stacked" | "inline" | "compact";

export type ResendVerificationProps = {
  flow?: ResendVerificationFlow;
  variant?: ResendVerificationVariant;
  /** Cooldown seconds. Defaults from `flow`. */
  cooldownDuration?: number;
  /** Alias for `cooldownDuration`. */
  duration?: number;
  /** Start in cooldown on mount. Default: `true`. */
  autoStartCooldown?: boolean;
  /** Controlled status. When set, host owns transitions except countdown expire → idle. */
  status?: ResendVerificationStatus;
  defaultStatus?: ResendVerificationStatus;
  onStatusChange?: (status: ResendVerificationStatus) => void;
  /**
   * Called when the user activates Resend.
   * Returning a Promise: resolve → success + restart cooldown; reject → error.
   */
  onResend?: () => void | Promise<void>;
  /** Button label. Defaults from `flow`. */
  label?: string;
  /** Loading label override for Button. */
  loadingLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  buttonSize?: ButtonSize;
  buttonVariant?: ButtonVariant;
  iconSize?: IconSize;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Hide Countdown Timer chrome (status still driven by timer when mounted). */
  hideTimer?: boolean;
  timerVariant?: CountdownTimerVariant;
  showTimerProgress?: boolean;
  showTimerControls?: boolean;
  showTimerStatusBadge?: boolean;
  /** Slot: replace leading action icon. */
  iconSlot?: React.ReactNode;
  /** Slot: replace success icon. */
  successIconSlot?: React.ReactNode;
  /** Slot: replace error icon. */
  errorIconSlot?: React.ReactNode;
  /** Slot: replace Button. */
  buttonSlot?: React.ReactNode;
  /** Slot: replace Countdown Timer. */
  timerSlot?: React.ReactNode;
  /** Slot: replace status feedback region. */
  feedbackSlot?: React.ReactNode;
  className?: string;
  id?: string;
  /** Forwarded to Countdown Timer (minus conflicting props). */
  timerProps?: Omit<
    CountdownTimerProps,
    | "duration"
    | "autoStart"
    | "onExpire"
    | "expiredSlot"
    | "disabled"
    | "variant"
    | "showProgress"
    | "showControls"
    | "showStatusBadge"
  >;
};

export const RESEND_VERIFICATION_FLOW_DURATION: Record<ResendVerificationFlow, number> = {
  "email-verification": 60,
  "otp-verification": 60,
  "password-reset": 60,
  "magic-link": 120,
  "two-factor": 30,
};

const FLOW_COPY: Record<
  ResendVerificationFlow,
  { label: string; loadingLabel: string; success: string; error: string; timerLabel: string }
> = {
  "email-verification": {
    label: "Resend verification email",
    loadingLabel: "Sending verification email",
    success: "Verification email sent",
    error: "Could not resend verification email",
    timerLabel: "Resend available in",
  },
  "otp-verification": {
    label: "Resend code",
    loadingLabel: "Sending code",
    success: "Code sent",
    error: "Could not resend code",
    timerLabel: "Resend available in",
  },
  "password-reset": {
    label: "Resend reset link",
    loadingLabel: "Sending reset link",
    success: "Reset link sent",
    error: "Could not resend reset link",
    timerLabel: "Resend available in",
  },
  "magic-link": {
    label: "Resend magic link",
    loadingLabel: "Sending magic link",
    success: "Magic link sent",
    error: "Could not resend magic link",
    timerLabel: "Resend available in",
  },
  "two-factor": {
    label: "Resend authentication code",
    loadingLabel: "Sending authentication code",
    success: "Authentication code sent",
    error: "Could not resend authentication code",
    timerLabel: "Resend available in",
  },
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function SendIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M3.5 10.25 16.5 4.5l-4.25 11.25-2.5-4.5-6.25-.999Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9.75 11.25 16.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="2.75" y="4.75" width="14.5" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 6.25 6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="7.25" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10.5 10h6.25v2.25M14.25 10v2.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M8.25 11.25a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 0 0-5-5l-1 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11.75 8.75a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5l1-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M10 2.75 4.75 5v4.25c0 3.5 2.35 5.9 5.25 6.75 2.9-.85 5.25-3.25 5.25-6.75V5L10 2.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 10.1 9.4 11.5 12.25 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m6.75 10.25 2.25 2.25 4.5-4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorMarkIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.75v4M10 13.25h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function flowActionIcon(flow: ResendVerificationFlow) {
  switch (flow) {
    case "email-verification":
      return <MailIcon />;
    case "password-reset":
      return <KeyIcon />;
    case "magic-link":
      return <LinkIcon />;
    case "two-factor":
      return <ShieldIcon />;
    case "otp-verification":
    default:
      return <SendIcon />;
  }
}

function resolveInitialStatus(
  status: ResendVerificationStatus | undefined,
  defaultStatus: ResendVerificationStatus | undefined,
  autoStartCooldown: boolean
): ResendVerificationStatus {
  if (status) return status;
  if (defaultStatus) return defaultStatus;
  return autoStartCooldown ? "cooldown" : "idle";
}

export const ResendVerification = React.forwardRef<HTMLDivElement, ResendVerificationProps>(
  function ResendVerification(
    {
      flow = "otp-verification",
      variant = "stacked",
      cooldownDuration,
      duration,
      autoStartCooldown = true,
      status: statusProp,
      defaultStatus,
      onStatusChange,
      onResend,
      label,
      loadingLabel,
      successMessage,
      errorMessage,
      buttonSize = "sm",
      buttonVariant = "secondary",
      iconSize = "sm",
      fullWidth = false,
      disabled = false,
      hideTimer = false,
      timerVariant = "compact",
      showTimerProgress = false,
      showTimerControls = false,
      showTimerStatusBadge = true,
      iconSlot,
      successIconSlot,
      errorIconSlot,
      buttonSlot,
      timerSlot,
      feedbackSlot,
      className = "",
      id,
      timerProps,
    },
    ref
  ) {
    const copy = FLOW_COPY[flow];
    const cooldown = cooldownDuration ?? duration ?? RESEND_VERIFICATION_FLOW_DURATION[flow];
    const timerFlow =
      flow === "email-verification" || flow === "magic-link" ? "email-confirmation" : "verification";

    const controlled = statusProp !== undefined;
    const [uncontrolledStatus, setUncontrolledStatus] = React.useState<ResendVerificationStatus>(() =>
      resolveInitialStatus(undefined, defaultStatus, autoStartCooldown)
    );
    const status = controlled ? statusProp! : uncontrolledStatus;
    const [feedback, setFeedback] = React.useState<"success" | "error" | null>(
      status === "success" ? "success" : status === "error" ? "error" : null
    );

    const setStatus = React.useCallback(
      (next: ResendVerificationStatus) => {
        if (!controlled) setUncontrolledStatus(next);
        onStatusChange?.(next);
      },
      [controlled, onStatusChange]
    );

    const timerRef = React.useRef<CountdownTimerHandle>(null);
    const [coolingDown, setCoolingDown] = React.useState(
      () => resolveInitialStatus(statusProp, defaultStatus, autoStartCooldown) === "cooldown"
    );

    React.useEffect(() => {
      if (status === "cooldown" || status === "success") setCoolingDown(true);
      if (status === "idle" || status === "error") setCoolingDown(false);
      if (status === "success") setFeedback("success");
      if (status === "error") setFeedback("error");
      if (status === "loading") setFeedback(null);
    }, [status]);

    const restartCooldown = React.useCallback(() => {
      setCoolingDown(true);
      setStatus("cooldown");
      // Defer so Countdown Timer is mounted if it was hidden while idle.
      requestAnimationFrame(() => {
        timerRef.current?.reset(cooldown);
      });
    }, [cooldown, setStatus]);

    const handleExpire = React.useCallback(() => {
      setCoolingDown(false);
      if (statusProp === undefined) {
        setUncontrolledStatus((prev) => (prev === "cooldown" || prev === "success" ? "idle" : prev));
      }
      onStatusChange?.("idle");
    }, [onStatusChange, statusProp]);

    const handleResend = React.useCallback(async () => {
      if (disabled || coolingDown || status === "loading" || status === "cooldown") return;
      setFeedback(null);
      setStatus("loading");
      try {
        await onResend?.();
        setFeedback("success");
        setStatus("success");
        restartCooldown();
      } catch {
        setFeedback("error");
        setStatus("error");
        setCoolingDown(false);
      }
    }, [coolingDown, disabled, onResend, restartCooldown, setStatus, status]);

    const actionDisabled = disabled || status === "loading" || coolingDown || status === "cooldown";

    const actionIcon = iconSlot ?? <Icon size={iconSize}>{flowActionIcon(flow)}</Icon>;

    const feedbackNode =
      feedbackSlot !== undefined
        ? feedbackSlot
        : feedback === "success"
          ? (
              <div
                className="dk-resend-verification__feedback"
                data-status="success"
                role="status"
                aria-live="polite"
              >
                {successIconSlot ?? (
                  <Icon size={iconSize} label="Success">
                    <CheckIcon />
                  </Icon>
                )}
                <span>{successMessage ?? copy.success}</span>
              </div>
            )
          : feedback === "error"
            ? (
                <div
                  className="dk-resend-verification__feedback"
                  data-status="error"
                  role="alert"
                  aria-live="assertive"
                >
                  {errorIconSlot ?? (
                    <Icon size={iconSize} label="Error">
                      <ErrorMarkIcon />
                    </Icon>
                  )}
                  <span>{errorMessage ?? copy.error}</span>
                </div>
              )
            : null;

    const buttonNode =
      buttonSlot !== undefined ? (
        buttonSlot
      ) : (
        <Button
          type="button"
          size={buttonSize}
          variant={feedback === "success" ? "success" : buttonVariant}
          leadingIcon={actionIcon}
          loading={status === "loading"}
          loadingLabel={loadingLabel ?? copy.loadingLabel}
          disabled={actionDisabled && status !== "loading"}
          fullWidth={fullWidth || variant !== "inline"}
          onClick={() => {
            void handleResend();
          }}
        >
          {label ?? copy.label}
        </Button>
      );

    const timerVisible = coolingDown && !hideTimer;
    const timerNode =
      timerSlot !== undefined ? (
        timerSlot
      ) : hideTimer ? null : (
        <CountdownTimer
          ref={timerRef}
          flow={timerFlow}
          duration={cooldown}
          autoStart={autoStartCooldown && coolingDown}
          paused={!coolingDown}
          variant={timerVariant}
          showProgress={showTimerProgress}
          showControls={showTimerControls}
          showStatusBadge={showTimerStatusBadge}
          label={copy.timerLabel}
          disabled={disabled || status === "loading"}
          onExpire={handleExpire}
          {...timerProps}
        />
      );

    return (
      <div
        ref={ref}
        id={id}
        className={cx(
          "dk-resend-verification",
          `dk-resend-verification--${variant}`,
          `dk-resend-verification--${flow}`,
          `dk-resend-verification--${status}`,
          disabled && "dk-resend-verification--disabled",
          className
        )}
        data-variant={variant}
        data-flow={flow}
        data-status={status}
        data-cooling-down={coolingDown ? "true" : "false"}
        role="group"
        aria-label={label ?? copy.label}
      >
        {feedbackNode}
        <div className="dk-resend-verification__body">
          {timerNode ? (
            <div
              className={cx(
                "dk-resend-verification__timer",
                !timerVisible && "dk-resend-verification__timer--inactive"
              )}
              hidden={!timerVisible}
              aria-hidden={!timerVisible}
            >
              {timerNode}
            </div>
          ) : null}
          <div className="dk-resend-verification__action">{buttonNode}</div>
        </div>
      </div>
    );
  }
);

ResendVerification.displayName = "ResendVerification";
export default ResendVerification;
