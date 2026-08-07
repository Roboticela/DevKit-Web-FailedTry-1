import * as React from "react";

/**
 * Sizes mapped to DevKit icon / control scale:
 * XS 16 · SM 20 · MD 24 · LG 32 · XL 40
 */
export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export type SpinnerTone =
  | "neutral"
  | "accent"
  | "inverse"
  | "positive"
  | "warning"
  | "negative";

/**
 * How the status label is exposed:
 * - `sr-only` — announce once via status region (default)
 * - `visible` — show label beside/below for sighted + AT users
 * - `none` — no label from the spinner; host must set `aria-busy` / status elsewhere
 */
export type SpinnerLabelMode = "sr-only" | "visible" | "none";

export type SpinnerLabelPlacement = "end" | "bottom";

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  /**
   * Status text. Announced politely once — not on every animation frame.
   * Default: `Loading`.
   */
  label?: string;
  labelMode?: SpinnerLabelMode;
  /** When `labelMode="visible"`. Default: `end` (inline). */
  labelPlacement?: SpinnerLabelPlacement;
  /**
   * Composition hint only — does not place overlays or page chrome.
   * - `inline` — sits in text/control flow (default)
   * - `block` — centered block for host-built page/overlay regions
   */
  layout?: "inline" | "block";
}

const SIZE_PX: Record<SpinnerSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};

const STROKE_PX: Record<SpinnerSize, number> = {
  xs: 2,
  sm: 2,
  md: 2.5,
  lg: 3,
  xl: 3.5,
};

const SIZE_CLASS: Record<SpinnerSize, string> = {
  xs: "dk-spinner--xs",
  sm: "dk-spinner--sm",
  md: "dk-spinner--md",
  lg: "dk-spinner--lg",
  xl: "dk-spinner--xl",
};

const TONE_CLASS: Record<SpinnerTone, string> = {
  neutral: "dk-spinner--neutral",
  accent: "dk-spinner--accent",
  inverse: "dk-spinner--inverse",
  positive: "dk-spinner--positive",
  warning: "dk-spinner--warning",
  negative: "dk-spinner--negative",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Spinner (ID 048) — indeterminate activity.
 *
 * Use Progress Bar / Progress Circle when progress is known.
 * Do not embed page overlays here — hosts compose placement and `aria-busy`.
 */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  function Spinner(
    {
      size = "md",
      tone = "accent",
      label = "Loading",
      labelMode = "sr-only",
      labelPlacement = "end",
      layout = "inline",
      className,
      id: idProp,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-spinner-${reactId}`;
    const labelId = `${rootId}-label`;

    const dim = SIZE_PX[size];
    const stroke = STROKE_PX[size];
    const center = dim / 2;
    const radius = (dim - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    /* Partial arc — activity without implying a percent */
    const arcLength = circumference * 0.28;

    const showVisibleLabel = labelMode === "visible";
    const showSrLabel = labelMode === "sr-only" || labelMode === "visible";

    return (
      <span
        {...rest}
        ref={ref}
        id={rootId}
        className={cx(
          "dk-spinner",
          SIZE_CLASS[size],
          TONE_CLASS[tone],
          `dk-spinner--layout-${layout}`,
          showVisibleLabel && `dk-spinner--label-${labelPlacement}`,
          className
        )}
        data-size={size}
        data-tone={tone}
        data-layout={layout}
        /* Hosts should set aria-busy on the busy region; spinner is the indicator. */
        aria-hidden={labelMode === "none" ? true : undefined}
      >
        <span className="dk-spinner__graphic" aria-hidden="true">
          <svg
            className="dk-spinner__svg"
            width={dim}
            height={dim}
            viewBox={`0 0 ${dim} ${dim}`}
            focusable="false"
          >
            <circle
              className="dk-spinner__track"
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              strokeWidth={stroke}
            />
            <circle
              className="dk-spinner__arc"
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${circumference}`}
              transform={`rotate(-90 ${center} ${center})`}
            />
          </svg>
          {/* Reduced-motion fallback: static marks (CSS toggles visibility) */}
          <span className="dk-spinner__static" aria-hidden="true">
            <span className="dk-spinner__static-dot" />
            <span className="dk-spinner__static-dot" />
            <span className="dk-spinner__static-dot" />
          </span>
        </span>

        {showSrLabel ? (
          <span
            id={labelId}
            className={showVisibleLabel ? "dk-spinner__label" : "dk-sr-only"}
            /* Polite status once — not tied to animation frames */
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {label}
          </span>
        ) : null}
      </span>
    );
  }
);

Spinner.displayName = "Spinner";

export default Spinner;
