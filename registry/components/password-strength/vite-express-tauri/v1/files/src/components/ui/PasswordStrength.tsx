import * as React from "react";
import {
  ProgressBar,
  type ProgressBarDensity,
  type ProgressBarTone,
} from "../../../../../../../progress-bar/vite-express-tauri/v1/files/src/components/ui/ProgressBar";
import {
  Badge,
  type BadgeSize,
  type BadgeTone,
} from "../../../../../../../badge/vite-express-tauri/v1/files/src/components/ui/Badge";

/**
 * Password Strength — quality meter for credential fields.
 * Composes Progress Bar + Badge (status). No custom meters or status chips.
 * Pair with Password Input via `strengthSlot`.
 */

export type PasswordStrengthLevel = "empty" | "weak" | "fair" | "good" | "strong";

export type PasswordStrengthResult = {
  level: PasswordStrengthLevel;
  /** 0–100 fill for Progress Bar. */
  score: number;
  /** Short status label for the Badge. */
  label: string;
  /** Optional sentence-level feedback. */
  feedback?: string;
  /** Optional actionable tips. */
  recommendations?: string[];
};

export type PasswordStrengthAlgorithm = (password: string) => PasswordStrengthResult;

/**
 * Display layout.
 * - `stacked` — badge + bar + feedback (default, forms)
 * - `compact` — dense bar + badge
 * - `inline` — single row
 * - `detailed` — includes recommendations list
 * - `meter` — bar-forward, badge secondary
 */
export type PasswordStrengthVariant = "stacked" | "compact" | "inline" | "detailed" | "meter";

export type PasswordStrengthProps = {
  /** Live password value — re-evaluates while typing. */
  value?: string;
  /**
   * Controlled result. When set, skips the algorithm for that render
   * (still accepts `value` for empty detection if result omitted).
   */
  result?: PasswordStrengthResult;
  /** Pluggable evaluator. Default: `defaultPasswordStrengthAlgorithm`. */
  algorithm?: PasswordStrengthAlgorithm;
  variant?: PasswordStrengthVariant;
  /** Progress Bar density. */
  density?: ProgressBarDensity;
  badgeSize?: BadgeSize;
  /** Show textual feedback under the bar. Default: true except `compact`. */
  showFeedback?: boolean;
  /** Show recommendation list. Default: true for `detailed` only. */
  showRecommendations?: boolean;
  /** Show percent on the Progress Bar. Default: false (level label is enough). */
  showValue?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  /** Accessible name for the meter region. */
  label?: string;
  /** Hide visible section title while keeping it for AT. */
  hideLabel?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  /** Slot: leading security icon (overrides level default). */
  icon?: React.ReactNode;
  /** Slot: replace the status Badge entirely. */
  badgeSlot?: React.ReactNode;
  /** Slot: replace the Progress Bar entirely. */
  progressSlot?: React.ReactNode;
  /** Slot: replace feedback text. */
  feedbackSlot?: React.ReactNode;
  /** Slot: replace recommendations block. */
  recommendationsSlot?: React.ReactNode;
  /** Called whenever evaluation changes (typing / controlled result). */
  onStrengthChange?: (result: PasswordStrengthResult) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
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
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M10 3.25 16.75 15.5H3.25L10 3.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 8.25v3.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="13.75" r="0.85" fill="currentColor" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <rect x="4.5" y="8.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 8.5V6.75a3 3 0 0 1 6 0V8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckShieldIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M10 2.5 15.5 5v4.2c0 3.4-2.2 5.9-5.5 7.3C6.7 15.1 4.5 12.6 4.5 9.2V5L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 9.75 9.25 11.5 12.75 7.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const LEVEL_META: Record<
  PasswordStrengthLevel,
  {
    progressTone: ProgressBarTone;
    badgeTone: BadgeTone;
    icon: React.ReactNode;
  }
> = {
  empty: { progressTone: "neutral", badgeTone: "neutral", icon: <ShieldIcon /> },
  weak: { progressTone: "negative", badgeTone: "negative", icon: <AlertIcon /> },
  fair: { progressTone: "warning", badgeTone: "warning", icon: <LockIcon /> },
  good: { progressTone: "informational", badgeTone: "accent", icon: <ShieldIcon /> },
  strong: { progressTone: "positive", badgeTone: "positive", icon: <CheckShieldIcon /> },
};

/** Default heuristic — length + character-class variety. Replace via `algorithm`. */
export function defaultPasswordStrengthAlgorithm(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      level: "empty",
      score: 0,
      label: "Enter a password",
      feedback: "Start typing to check password quality.",
      recommendations: [
        "Use at least 12 characters",
        "Mix upper and lower case letters",
        "Include a number and a symbol",
      ],
    };
  }

  let score = 0;
  const recommendations: string[] = [];

  const length = password.length;
  if (length >= 16) score += 35;
  else if (length >= 12) score += 28;
  else if (length >= 8) score += 18;
  else {
    score += Math.min(12, length * 2);
    recommendations.push("Use at least 12 characters");
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const classes = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
  score += classes * 14;

  if (!hasLower || !hasUpper) recommendations.push("Mix upper and lower case letters");
  if (!hasDigit) recommendations.push("Include at least one number");
  if (!hasSymbol) recommendations.push("Include at least one symbol");

  if (/(.)\1{2,}/.test(password)) {
    score -= 8;
    recommendations.push("Avoid repeating the same character");
  }
  if (/^[0-9]+$/.test(password) || /^[A-Za-z]+$/.test(password)) {
    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  let level: PasswordStrengthLevel;
  let label: string;
  let feedback: string;

  if (score < 30) {
    level = "weak";
    label = "Weak";
    feedback = "This password is easy to guess.";
  } else if (score < 55) {
    level = "fair";
    label = "Fair";
    feedback = "Better — add more length or character variety.";
  } else if (score < 80) {
    level = "good";
    label = "Good";
    feedback = "Solid password. A bit more variety makes it stronger.";
  } else {
    level = "strong";
    label = "Strong";
    feedback = "Strong password for most accounts.";
  }

  return {
    level,
    score,
    label,
    feedback,
    recommendations: recommendations.slice(0, 4),
  };
}

export const PasswordStrength = React.forwardRef<HTMLDivElement, PasswordStrengthProps>(
  function PasswordStrength(
    {
      value = "",
      result: resultProp,
      algorithm = defaultPasswordStrengthAlgorithm,
      variant = "stacked",
      density = "compact",
      badgeSize = "sm",
      showFeedback: showFeedbackProp,
      showRecommendations: showRecommendationsProp,
      showValue = false,
      loading = false,
      loadingLabel = "Checking password strength",
      label = "Password strength",
      hideLabel = true,
      disabled = false,
      className = "",
      id,
      icon,
      badgeSlot,
      progressSlot,
      feedbackSlot,
      recommendationsSlot,
      onStrengthChange,
    },
    ref
  ) {
    const evaluated = React.useMemo(() => {
      if (resultProp) return resultProp;
      return algorithm(value);
    }, [algorithm, resultProp, value]);

    const onStrengthChangeRef = React.useRef(onStrengthChange);
    onStrengthChangeRef.current = onStrengthChange;
    const lastEmitted = React.useRef<string>("");

    React.useEffect(() => {
      const key = `${evaluated.level}:${evaluated.score}:${evaluated.label}`;
      if (lastEmitted.current === key) return;
      lastEmitted.current = key;
      onStrengthChangeRef.current?.(evaluated);
    }, [evaluated]);

    const showFeedback =
      showFeedbackProp ?? (variant !== "compact" && variant !== "inline");
    const showRecommendations =
      showRecommendationsProp ?? variant === "detailed";

    const meta = LEVEL_META[evaluated.level];
    const progressTone = loading ? "informational" : meta.progressTone;
    const badgeTone = loading ? "neutral" : meta.badgeTone;
    const statusIcon = icon ?? meta.icon;
    const badgeLabel = loading ? "Checking" : evaluated.label;
    const feedbackText = loading ? loadingLabel : evaluated.feedback;
    const tips = evaluated.recommendations ?? [];

    const progress = progressSlot ?? (
      <ProgressBar
        label={label}
        hideLabel={hideLabel}
        value={loading ? null : evaluated.score}
        mode={loading ? "indeterminate" : "determinate"}
        min={0}
        max={100}
        density={density}
        tone={progressTone}
        showValue={showValue && !loading}
        description={undefined}
      />
    );

    const badge = badgeSlot ?? (
      <Badge
        appearance="icon-label"
        tone={badgeTone}
        size={badgeSize}
        label={badgeLabel}
        icon={statusIcon}
        accessibleLabel={
          loading
            ? loadingLabel
            : `Password strength: ${evaluated.label}${
                evaluated.feedback ? `. ${evaluated.feedback}` : ""
              }`
        }
      />
    );

    const feedbackNode =
      feedbackSlot ??
      (showFeedback && feedbackText ? (
        <p className="dk-password-strength__feedback">{feedbackText}</p>
      ) : null);

    const recommendationsNode =
      recommendationsSlot ??
      (showRecommendations && tips.length > 0 && !loading ? (
        <ul className="dk-password-strength__tips" aria-label="Password recommendations">
          {tips.map((tip) => (
            <li key={tip} className="dk-password-strength__tip">
              <span className="dk-password-strength__tip-icon" aria-hidden="true">
                <ShieldIcon />
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      ) : null);

    return (
      <div
        ref={ref}
        id={id}
        className={cx(
          "dk-password-strength",
          `dk-password-strength--${variant}`,
          loading && "dk-password-strength--loading",
          disabled && "dk-password-strength--disabled",
          `dk-password-strength--${evaluated.level}`,
          className
        )}
        data-level={evaluated.level}
        data-score={evaluated.score}
        data-loading={loading || undefined}
        data-variant={variant}
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
      >
        <div className="dk-password-strength__header">
          <div className="dk-password-strength__badge">{badge}</div>
        </div>
        <div className="dk-password-strength__meter">{progress}</div>
        {feedbackNode ? (
          <div className="dk-password-strength__message" aria-live="polite">
            {feedbackNode}
          </div>
        ) : null}
        {recommendationsNode}
      </div>
    );
  }
);

PasswordStrength.displayName = "PasswordStrength";
export default PasswordStrength;
