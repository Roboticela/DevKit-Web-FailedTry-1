import * as React from "react";

/**
 * Conceptual sizes mapped to DevKit sizing:
 * SM 24 · MD 40 · LG 64
 */
export type ProgressCircleSize = "sm" | "md" | "lg";

export type ProgressCircleTone =
  | "neutral"
  | "informational"
  | "positive"
  | "warning"
  | "negative";

export type ProgressCircleMode = "determinate" | "indeterminate";

export interface ProgressCircleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Current value for determinate progress.
   * Omit / `null` for indeterminate (unless `mode` forces determinate).
   */
  value?: number | null;
  /** Lower bound. Default: 0. */
  min?: number;
  /** Upper bound. Default: 100. */
  max?: number;
  mode?: ProgressCircleMode;
  size?: ProgressCircleSize;
  tone?: ProgressCircleTone;
  /** Accessible name for the process. */
  label?: string;
  /** Hide the visible external label; still used for assistive tech. */
  hideLabel?: boolean;
  /**
   * Short center value (e.g. `45%`). Only for meaningful values —
   * do not place long text inside the circle. Hidden at `sm` by default.
   */
  showValue?: boolean;
  formatValue?: (value: number, min: number, max: number) => string;
  /** Status text outside the circle. */
  description?: React.ReactNode;
}

const SIZE_PX: Record<ProgressCircleSize, number> = {
  sm: 24,
  md: 40,
  lg: 64,
};

const STROKE_PX: Record<ProgressCircleSize, number> = {
  sm: 2.5,
  md: 3.5,
  lg: 4.5,
};

const SIZE_CLASS: Record<ProgressCircleSize, string> = {
  sm: "dk-progress-circle--sm",
  md: "dk-progress-circle--md",
  lg: "dk-progress-circle--lg",
};

const TONE_CLASS: Record<ProgressCircleTone, string> = {
  neutral: "dk-progress-circle--neutral",
  informational: "dk-progress-circle--informational",
  positive: "dk-progress-circle--positive",
  warning: "dk-progress-circle--warning",
  negative: "dk-progress-circle--negative",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  if (max <= min) return min;
  return Math.min(max, Math.max(min, value));
}

function defaultFormatValue(value: number, min: number, max: number): string {
  if (max <= min) return "0%";
  const pct = ((value - min) / (max - min)) * 100;
  return `${Math.round(pct)}%`;
}

/**
 * Progress Circle (ID 047) — compact measurable progress.
 *
 * Not decorative. Prefer Progress Bar when horizontal space is available and
 * richer labeling is needed. Prefer Spinner when no progress value exists.
 */
export const ProgressCircle = React.forwardRef<
  HTMLDivElement,
  ProgressCircleProps
>(function ProgressCircle(
  {
    value = null,
    min = 0,
    max = 100,
    mode: modeProp,
    size = "md",
    tone = "informational",
    label,
    hideLabel = false,
    showValue = false,
    formatValue = defaultFormatValue,
    description,
    className,
    id: idProp,
    ...rest
  },
  ref
) {
  const reactId = React.useId();
  const rootId = idProp ?? `dk-progress-circle-${reactId}`;
  const labelId = label ? `${rootId}-label` : undefined;
  const descId = description != null ? `${rootId}-desc` : undefined;
  const valueId = `${rootId}-value`;

  const isDeterminate =
    modeProp === "determinate" ||
    (modeProp !== "indeterminate" &&
      typeof value === "number" &&
      Number.isFinite(value));

  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 100;
  const safeValue = isDeterminate
    ? clamp(value as number, safeMin, safeMax)
    : null;

  const percent =
    safeValue != null && safeMax > safeMin
      ? ((safeValue - safeMin) / (safeMax - safeMin)) * 100
      : 0;

  const dim = SIZE_PX[size];
  const stroke = STROKE_PX[size];
  const center = dim / 2;
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = isDeterminate
    ? circumference - (percent / 100) * circumference
    : circumference * 0.75;

  const showCenterValue = showValue && isDeterminate && size !== "sm";

  return (
    <div
      {...rest}
      ref={ref}
      id={rootId}
      className={cx(
        "dk-progress-circle",
        SIZE_CLASS[size],
        TONE_CLASS[tone],
        isDeterminate
          ? "dk-progress-circle--determinate"
          : "dk-progress-circle--indeterminate",
        className
      )}
      data-size={size}
      data-tone={tone}
      data-mode={isDeterminate ? "determinate" : "indeterminate"}
    >
      {label && !hideLabel ? (
        <span className="dk-progress-circle__label" id={labelId}>
          {label}
        </span>
      ) : label ? (
        <span className="dk-sr-only" id={labelId}>
          {label}
        </span>
      ) : null}

      <div className="dk-progress-circle__graphic">
        <svg
          className="dk-progress-circle__svg"
          width={dim}
          height={dim}
          viewBox={`0 0 ${dim} ${dim}`}
          role="progressbar"
          aria-valuemin={isDeterminate ? safeMin : undefined}
          aria-valuemax={isDeterminate ? safeMax : undefined}
          aria-valuenow={isDeterminate ? safeValue ?? undefined : undefined}
          aria-valuetext={
            isDeterminate && safeValue != null
              ? formatValue(safeValue, safeMin, safeMax)
              : "In progress"
          }
          aria-labelledby={labelId}
          aria-label={!labelId ? label ?? "Progress" : undefined}
          aria-describedby={descId}
        >
          <circle
            className="dk-progress-circle__track"
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={stroke}
          />
          <circle
            className="dk-progress-circle__arc"
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            /* Rotate so progress starts at 12 o'clock */
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>

        {showCenterValue && safeValue != null ? (
          <span className="dk-progress-circle__center" id={valueId} aria-hidden="true">
            {formatValue(safeValue, safeMin, safeMax)}
          </span>
        ) : null}
      </div>

      {description != null ? (
        <div className="dk-progress-circle__description" id={descId}>
          {description}
        </div>
      ) : null}
    </div>
  );
});

ProgressCircle.displayName = "ProgressCircle";

export default ProgressCircle;
