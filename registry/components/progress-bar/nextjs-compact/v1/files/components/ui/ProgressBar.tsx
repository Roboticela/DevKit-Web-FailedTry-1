import * as React from "react";

export type ProgressBarDensity = "standard" | "compact";

/** Optional semantic tint — progress is still conveyed by fill length / motion. */
export type ProgressBarTone =
  | "neutral"
  | "informational"
  | "positive"
  | "warning"
  | "negative";

export type ProgressBarMode = "determinate" | "indeterminate";

export interface ProgressBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Current value for determinate progress.
   * Omit / `null` to render indeterminate (when `mode` is not forced).
   */
  value?: number | null;
  /** Lower bound. Default: 0. */
  min?: number;
  /** Upper bound. Default: 100. */
  max?: number;
  /**
   * Force mode. Default: determinate when `value` is a finite number,
   * otherwise indeterminate.
   */
  mode?: ProgressBarMode;
  /** Accessible name. Prefer a visible `label` when possible. */
  label?: string;
  /** Hide the visible label while keeping it for assistive tech. */
  hideLabel?: boolean;
  /**
   * Show a percentage (or formatted value). Only enable when the value is
   * meaningful — prefer status text like “Uploading…” when it is not.
   */
  showValue?: boolean;
  /** Custom value formatter. Default: rounded percent of the range. */
  formatValue?: (value: number, min: number, max: number) => string;
  /** Supporting / status text under the track (phase, items, guidance). */
  description?: React.ReactNode;
  density?: ProgressBarDensity;
  tone?: ProgressBarTone;
  /**
   * Extra content for long-running ops (time remaining, phase, …).
   * Kept as a slot so those concerns stay outside the primitive.
   */
  meta?: React.ReactNode;
}

const DENSITY_CLASS: Record<ProgressBarDensity, string> = {
  standard: "dk-progress-bar--standard",
  compact: "dk-progress-bar--compact",
};

const TONE_CLASS: Record<ProgressBarTone, string> = {
  neutral: "dk-progress-bar--neutral",
  informational: "dk-progress-bar--informational",
  positive: "dk-progress-bar--positive",
  warning: "dk-progress-bar--warning",
  negative: "dk-progress-bar--negative",
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
 * Progress Bar (ID 046) — measurable progress toward a known completion point.
 *
 * Use Spinner when progress is unknown. Do not imply precision with a percentage
 * when the underlying value is not meaningful.
 */
export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  function ProgressBar(
    {
      value = null,
      min = 0,
      max = 100,
      mode: modeProp,
      label,
      hideLabel = false,
      showValue = false,
      formatValue = defaultFormatValue,
      description,
      density = "standard",
      tone = "informational",
      meta,
      className,
      id: idProp,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-progress-bar-${reactId}`;
    const labelId = label ? `${rootId}-label` : undefined;
    const descId = description != null ? `${rootId}-desc` : undefined;
    const valueId = showValue ? `${rootId}-value` : undefined;

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

    /* Avoid visually exaggerating tiny differences — snap display width
       to a stable precision while aria uses the true value. */
    const displayPercent = Math.round(percent * 10) / 10;

    const labelledBy = [labelId, valueId].filter(Boolean).join(" ") || undefined;
    const describedBy = descId;

    return (
      <div
        {...rest}
        ref={ref}
        id={rootId}
        className={cx(
          "dk-progress-bar",
          DENSITY_CLASS[density],
          TONE_CLASS[tone],
          isDeterminate
            ? "dk-progress-bar--determinate"
            : "dk-progress-bar--indeterminate",
          className
        )}
        data-density={density}
        data-tone={tone}
        data-mode={isDeterminate ? "determinate" : "indeterminate"}
      >
        {(label && !hideLabel) || showValue || meta ? (
          <div className="dk-progress-bar__header">
            {label && !hideLabel ? (
              <span className="dk-progress-bar__label" id={labelId}>
                {label}
              </span>
            ) : label && hideLabel ? (
              <span className="dk-sr-only" id={labelId}>
                {label}
              </span>
            ) : null}

            <span className="dk-progress-bar__header-end">
              {meta ? (
                <span className="dk-progress-bar__meta">{meta}</span>
              ) : null}
              {showValue && safeValue != null ? (
                <span className="dk-progress-bar__value" id={valueId}>
                  {formatValue(safeValue, safeMin, safeMax)}
                </span>
              ) : null}
            </span>
          </div>
        ) : label ? (
          <span className="dk-sr-only" id={labelId}>
            {label}
          </span>
        ) : null}

        <div
          className="dk-progress-bar__track"
          role="progressbar"
          aria-valuemin={isDeterminate ? safeMin : undefined}
          aria-valuemax={isDeterminate ? safeMax : undefined}
          aria-valuenow={isDeterminate ? safeValue ?? undefined : undefined}
          aria-valuetext={
            isDeterminate && safeValue != null
              ? formatValue(safeValue, safeMin, safeMax)
              : description
                ? undefined
                : "In progress"
          }
          aria-labelledby={labelledBy}
          aria-label={!labelledBy ? label ?? "Progress" : undefined}
          aria-describedby={describedBy}
        >
          <div
            className="dk-progress-bar__fill"
            style={
              isDeterminate
                ? { width: `${displayPercent}%` }
                : undefined
            }
          />
        </div>

        {description != null ? (
          <div className="dk-progress-bar__description" id={descId}>
            {description}
          </div>
        ) : null}
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;
