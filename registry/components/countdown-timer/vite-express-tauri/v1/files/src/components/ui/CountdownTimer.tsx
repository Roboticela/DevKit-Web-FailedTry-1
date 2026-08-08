import * as React from "react";
import {
  ProgressBar,
  type ProgressBarDensity,
  type ProgressBarTone,
} from "../../../../../../../progress-bar/vite-express-tauri/v1/files/src/components/ui/ProgressBar";
import {
  Text,
  type TextSize,
} from "../../../../../../../text/vite-express-tauri/v1/files/src/components/ui/Text";
import {
  Badge,
  type BadgeSize,
} from "../../../../../../../badge/vite-express-tauri/v1/files/src/components/ui/Badge";
import {
  IconButton,
  type IconButtonSize,
  type IconButtonVariant,
} from "../../../../../../../icon-button/vite-express-tauri/v1/files/src/components/ui/IconButton";

/**
 * Countdown Timer — remaining-time UI for auth workflows.
 * Composes Progress Bar + Text (time) + Badge + Icon Button.
 * No custom meters, chips, or buttons.
 *
 * Flows: verification (OTP) · email-confirmation
 */

export type CountdownTimerFlow = "verification" | "email-confirmation";

export type CountdownTimerState = "idle" | "running" | "paused" | "expired";

/**
 * - `stacked` — time + badge + bar + controls (forms)
 * - `compact` — dense row
 * - `inline` — single-line time + badge
 * - `meter` — progress-forward
 */
export type CountdownTimerVariant = "stacked" | "compact" | "inline" | "meter";

export type CountdownTimerHandle = {
  pause: () => void;
  resume: () => void;
  reset: (nextDurationSeconds?: number) => void;
  getRemaining: () => number;
  getState: () => CountdownTimerState;
};

export type CountdownTimerProps = {
  /**
   * Total duration in seconds. Defaults from `flow`
   * (verification: 60 · email-confirmation: 120).
   */
  duration?: number;
  /** Controlled remaining seconds. */
  remaining?: number;
  /** Uncontrolled initial remaining. Defaults to `duration`. */
  defaultRemaining?: number;
  /** Start counting automatically. Default: true. */
  autoStart?: boolean;
  /** Controlled pause. */
  paused?: boolean;
  defaultPaused?: boolean;
  flow?: CountdownTimerFlow;
  variant?: CountdownTimerVariant;
  showProgress?: boolean;
  showControls?: boolean;
  showStatusBadge?: boolean;
  /** Tick cadence in ms. Default: 250 (smooth bar; display still mm:ss). */
  tickIntervalMs?: number;
  formatRemaining?: (seconds: number) => string;
  label?: string;
  hideLabel?: boolean;
  expiredLabel?: string;
  timeSize?: TextSize;
  progressDensity?: ProgressBarDensity;
  badgeSize?: BadgeSize;
  controlSize?: IconButtonSize;
  controlVariant?: IconButtonVariant;
  disabled?: boolean;
  className?: string;
  id?: string;
  /** Slot: leading timer icon. */
  icon?: React.ReactNode;
  /** Slot: replace the time Text. */
  timeSlot?: React.ReactNode;
  /** Slot: replace Progress Bar. */
  progressSlot?: React.ReactNode;
  /** Slot: replace status Badge. */
  badgeSlot?: React.ReactNode;
  /** Slot: replace pause/resume/reset controls. */
  controlsSlot?: React.ReactNode;
  /** Slot: shown when expired (e.g. Resend Button). */
  expiredSlot?: React.ReactNode;
  onTick?: (remainingSeconds: number) => void;
  onExpire?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onReset?: (remainingSeconds: number) => void;
  onStateChange?: (state: CountdownTimerState) => void;
  onRemainingChange?: (remainingSeconds: number) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Default durations by auth flow (seconds). */
export const COUNTDOWN_TIMER_FLOW_DURATION: Record<CountdownTimerFlow, number> = {
  verification: 60,
  "email-confirmation": 120,
};

const FLOW_COPY: Record<
  CountdownTimerFlow,
  { label: string; expiredLabel: string }
> = {
  verification: {
    label: "Code expires in",
    expiredLabel: "Code expired",
  },
  "email-confirmation": {
    label: "Confirm within",
    expiredLabel: "Confirmation window ended",
  },
};

/** Format whole seconds as `m:ss` / `mm:ss`. */
export function formatCountdownSeconds(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function TimerIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3.5h4M10 3.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 8.25v3l2 1.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path d="M7 5.5v9M13 5.5v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M7.5 5.25v9.5L15 10 7.5 5.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
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

function ExpiredIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.5v4M10 13.25h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function resolveState(args: {
  remainingMs: number;
  paused: boolean;
  started: boolean;
}): CountdownTimerState {
  if (args.remainingMs <= 0) return "expired";
  if (!args.started && args.paused) return "idle";
  if (args.paused) return "paused";
  return "running";
}

function toneForState(state: CountdownTimerState, ratio: number): ProgressBarTone {
  if (state === "expired") return "negative";
  if (state === "paused" || state === "idle") return "neutral";
  if (ratio <= 0.25) return "warning";
  return "informational";
}

function badgeToneForState(state: CountdownTimerState) {
  if (state === "expired") return "negative" as const;
  if (state === "paused") return "warning" as const;
  if (state === "idle") return "neutral" as const;
  return "accent" as const;
}

function badgeLabelForState(state: CountdownTimerState): string {
  if (state === "expired") return "Expired";
  if (state === "paused") return "Paused";
  if (state === "idle") return "Ready";
  return "Active";
}

export const CountdownTimer = React.forwardRef<CountdownTimerHandle, CountdownTimerProps>(
  function CountdownTimer(
    {
      duration: durationProp,
      remaining: remainingProp,
      defaultRemaining,
      autoStart = true,
      paused: pausedProp,
      defaultPaused = false,
      flow = "verification",
      variant = "stacked",
      showProgress = true,
      showControls = true,
      showStatusBadge = true,
      tickIntervalMs = 250,
      formatRemaining = formatCountdownSeconds,
      label: labelProp,
      hideLabel = false,
      expiredLabel: expiredLabelProp,
      timeSize = "lg",
      progressDensity = "compact",
      badgeSize = "sm",
      controlSize = "sm",
      controlVariant = "subtle",
      disabled = false,
      className = "",
      id,
      icon,
      timeSlot,
      progressSlot,
      badgeSlot,
      controlsSlot,
      expiredSlot,
      onTick,
      onExpire,
      onPause,
      onResume,
      onReset,
      onStateChange,
      onRemainingChange,
    },
    ref
  ) {
    const flowCopy = FLOW_COPY[flow];
    const durationSeconds = Math.max(
      0,
      durationProp ?? COUNTDOWN_TIMER_FLOW_DURATION[flow]
    );
    const durationMs = durationSeconds * 1000;
    const label = labelProp ?? flowCopy.label;
    const expiredLabel = expiredLabelProp ?? flowCopy.expiredLabel;

    const isRemainingControlled = remainingProp !== undefined;
    const isPausedControlled = pausedProp !== undefined;

    const initialRemainingMs = Math.max(
      0,
      (defaultRemaining ?? durationSeconds) * 1000
    );

    const [internalRemainingMs, setInternalRemainingMs] = React.useState(initialRemainingMs);
    const [internalPaused, setInternalPaused] = React.useState(
      defaultPaused || !autoStart
    );
    const [started, setStarted] = React.useState(autoStart && !defaultPaused);

    const remainingMs = isRemainingControlled
      ? Math.max(0, (remainingProp as number) * 1000)
      : internalRemainingMs;
    const paused = isPausedControlled ? Boolean(pausedProp) : internalPaused;

    const endAtRef = React.useRef<number | null>(null);
    const remainingMsRef = React.useRef(remainingMs);
    const expiredFiredRef = React.useRef(remainingMs <= 0);
    const lastAnnouncedSecond = React.useRef(Math.ceil(remainingMs / 1000));
    const stateRef = React.useRef<CountdownTimerState>("idle");

    remainingMsRef.current = remainingMs;

    const setRemainingMs = React.useCallback(
      (nextMs: number) => {
        const clamped = Math.max(0, nextMs);
        remainingMsRef.current = clamped;
        if (!isRemainingControlled) setInternalRemainingMs(clamped);
        onRemainingChange?.(clamped / 1000);
      },
      [isRemainingControlled, onRemainingChange]
    );

    const setPaused = React.useCallback(
      (next: boolean) => {
        if (!isPausedControlled) setInternalPaused(next);
      },
      [isPausedControlled]
    );

    const syncEndAt = React.useCallback(() => {
      if (!paused && remainingMsRef.current > 0) {
        endAtRef.current = Date.now() + remainingMsRef.current;
      } else {
        endAtRef.current = null;
      }
    }, [paused]);

    React.useEffect(() => {
      syncEndAt();
    }, [syncEndAt, remainingMs, paused]);

    const state = resolveState({ remainingMs, paused, started });
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    const ratio = durationMs > 0 ? remainingMs / durationMs : 0;
    const progressValue = durationMs > 0 ? (remainingMs / durationMs) * 100 : 0;
    const progressTone = toneForState(state, ratio);

    React.useEffect(() => {
      if (stateRef.current === state) return;
      stateRef.current = state;
      onStateChange?.(state);
    }, [onStateChange, state]);

    React.useEffect(() => {
      if (disabled || paused) return;

      const id = window.setInterval(() => {
        if (remainingMsRef.current <= 0) return;
        const endAt = endAtRef.current;
        if (endAt == null) return;
        const next = Math.max(0, endAt - Date.now());
        setRemainingMs(next);

        const whole = Math.ceil(next / 1000);
        if (whole !== lastAnnouncedSecond.current) {
          lastAnnouncedSecond.current = whole;
          onTick?.(whole);
        }

        if (next <= 0 && !expiredFiredRef.current) {
          expiredFiredRef.current = true;
          setPaused(true);
          onExpire?.();
        }
      }, Math.max(50, tickIntervalMs));

      return () => window.clearInterval(id);
    }, [disabled, onExpire, onTick, paused, setPaused, setRemainingMs, tickIntervalMs]);

    const pause = React.useCallback(() => {
      if (disabled || remainingMsRef.current <= 0) return;
      if (endAtRef.current != null) {
        setRemainingMs(Math.max(0, endAtRef.current - Date.now()));
      }
      endAtRef.current = null;
      setPaused(true);
      onPause?.();
    }, [disabled, onPause, setPaused, setRemainingMs]);

    const resume = React.useCallback(() => {
      if (disabled || remainingMsRef.current <= 0) return;
      setStarted(true);
      expiredFiredRef.current = false;
      endAtRef.current = Date.now() + remainingMsRef.current;
      setPaused(false);
      onResume?.();
    }, [disabled, onResume, setPaused]);

    const reset = React.useCallback(
      (nextDurationSeconds?: number) => {
        if (disabled) return;
        const nextSeconds = Math.max(
          0,
          nextDurationSeconds ?? durationSeconds
        );
        const nextMs = nextSeconds * 1000;
        expiredFiredRef.current = nextMs <= 0;
        lastAnnouncedSecond.current = Math.ceil(nextMs / 1000);
        setRemainingMs(nextMs);
        setStarted(autoStart);
        setPaused(!autoStart);
        endAtRef.current = autoStart && nextMs > 0 ? Date.now() + nextMs : null;
        onReset?.(nextSeconds);
      },
      [autoStart, disabled, durationSeconds, onReset, setPaused, setRemainingMs]
    );

    React.useImperativeHandle(
      ref,
      () => ({
        pause,
        resume,
        reset,
        getRemaining: () => remainingMsRef.current / 1000,
        getState: () =>
          resolveState({
            remainingMs: remainingMsRef.current,
            paused,
            started,
          }),
      }),
      [pause, paused, reset, resume, started]
    );

    const displayText =
      state === "expired" ? expiredLabel : formatRemaining(remainingSeconds);
    const dateTime =
      state === "expired" ? undefined : `PT${Math.max(0, remainingSeconds)}S`;

    const leadingIcon =
      icon ?? (state === "expired" ? <ExpiredIcon /> : <TimerIcon />);

    const statusBadge =
      badgeSlot ??
      (showStatusBadge ? (
        <Badge
          appearance="icon-label"
          size={badgeSize}
          shape="soft"
          tone={badgeToneForState(state)}
          icon={state === "expired" ? <ExpiredIcon /> : leadingIcon}
          label={badgeLabelForState(state)}
          accessibleLabel={`Timer ${badgeLabelForState(state).toLowerCase()}`}
        />
      ) : null);

    const timeNode =
      timeSlot ?? (
        <Text
          as="time"
          dateTime={dateTime}
          size={timeSize}
          weight="semibold"
          color={state === "expired" ? "secondary" : "primary"}
          className="dk-countdown-timer__time"
        >
          <span className="dk-countdown-timer__icon" aria-hidden="true">
            {leadingIcon}
          </span>
          <span>{displayText}</span>
        </Text>
      );

    const progressNode =
      progressSlot ??
      (showProgress ? (
        <ProgressBar
          value={progressValue}
          min={0}
          max={100}
          mode="determinate"
          label={label}
          hideLabel
          density={progressDensity}
          tone={progressTone}
          showValue={false}
          description={
            variant === "meter"
              ? state === "expired"
                ? expiredLabel
                : formatRemaining(remainingSeconds)
              : undefined
          }
          meta={variant === "meter" ? statusBadge : undefined}
          className="dk-countdown-timer__progress"
        />
      ) : null);

    const controlsNode =
      controlsSlot ??
      (showControls ? (
        <div className="dk-countdown-timer__controls">
          {state === "expired" ? null : paused ? (
            <IconButton
              label="Resume timer"
              size={controlSize}
              variant={controlVariant}
              icon={<PlayIcon />}
              disabled={disabled}
              onClick={resume}
            />
          ) : (
            <IconButton
              label="Pause timer"
              size={controlSize}
              variant={controlVariant}
              icon={<PauseIcon />}
              disabled={disabled || state === "idle"}
              onClick={pause}
            />
          )}
          <IconButton
            label="Reset timer"
            size={controlSize}
            variant={controlVariant}
            icon={<ResetIcon />}
            disabled={disabled}
            onClick={() => reset()}
          />
        </div>
      ) : null);

    return (
      <div
        id={id}
        className={cx(
          "dk-countdown-timer",
          `dk-countdown-timer--${variant}`,
          `dk-countdown-timer--${flow}`,
          `dk-countdown-timer--${state}`,
          disabled && "dk-countdown-timer--disabled",
          className
        )}
        data-variant={variant}
        data-flow={flow}
        data-state={state}
        aria-disabled={disabled || undefined}
        role="group"
        aria-label={label}
      >
        {!hideLabel ? (
          <div className="dk-countdown-timer__label">{label}</div>
        ) : (
          <span className="dk-countdown-timer__sr-only">{label}</span>
        )}

        <div className="dk-countdown-timer__main">
          {variant !== "meter" ? (
            <div className="dk-countdown-timer__status">
              {timeNode}
              {statusBadge}
            </div>
          ) : null}

          {progressNode}

          {state === "expired" && expiredSlot ? (
            <div className="dk-countdown-timer__expired">{expiredSlot}</div>
          ) : (
            controlsNode
          )}
        </div>

        <div className="dk-countdown-timer__live" aria-live="polite">
          {state === "expired"
            ? expiredLabel
            : state === "paused"
              ? `Timer paused at ${formatRemaining(remainingSeconds)}`
              : `${formatRemaining(remainingSeconds)} remaining`}
        </div>
      </div>
    );
  }
);

CountdownTimer.displayName = "CountdownTimer";
export default CountdownTimer;
