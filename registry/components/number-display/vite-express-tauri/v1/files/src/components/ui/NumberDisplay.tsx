import * as React from "react";

/**
 * Number Display — numeric information with strong visual clarity.
 * Locale-aware formatting via Intl (never hardcode comma/period).
 * Compact notation only when explicitly configured.
 * Not a metric card — optional label/trend/comparison stay secondary.
 * Screen readers get the complete meaningful value (not only abbreviations).
 */

export type NumberDisplayFormat =
  | "integer"
  | "decimal"
  | "currency"
  | "percent"
  | "signed"
  | "unit";

/**
 * Compact notation — opt-in only. Never auto-abbreviate when precision matters.
 * - `never` (default) — full precision formatting
 * - `short` — 1.2K / 4.8M
 * - `long` — 1.2 thousand (locale-dependent)
 */
export type NumberDisplayCompact = "never" | "short" | "long";

export type NumberDisplayState =
  | "value"
  | "loading"
  | "unknown"
  | "unavailable";

/**
 * Sign emphasis. Negative values stay distinguishable without color alone
 * (sign glyph + weight; tone is secondary).
 */
export type NumberDisplayTone = "neutral" | "positive" | "negative" | "auto";

export type NumberDisplaySize = "sm" | "md" | "lg";

export type NumberDisplayAlign = "start" | "end" | "center";

/**
 * How percent `value` is interpreted:
 * - `ratio` — Intl default (0.984 → 98.4%)
 * - `unit` — already in percent points (98.4 → 98.4%)
 */
export type NumberDisplayPercentAs = "ratio" | "unit";

export type NumberDisplayTrend = "up" | "down" | "flat";

export type NumberDisplayProps = {
  /**
   * Numeric value. Prefer `null` / `undefined` with `state` for unknown / N/A.
   */
  value?: number | null;
  /**
   * Formatting intent. Default `decimal` (or `integer` when value has no fraction).
   */
  format?: NumberDisplayFormat;
  /** BCP 47 locale. Defaults to runtime locale. */
  locale?: string | string[];
  /** ISO 4217 currency code when `format="currency"`. Default `USD`. */
  currency?: string;
  /**
   * CLDR unit when `format="unit"` (e.g. `kilogram`, `meter`).
   * Custom units can use `suffix` instead.
   */
  unit?: string;
  unitDisplay?: "short" | "long" | "narrow";
  compact?: NumberDisplayCompact;
  percentAs?: NumberDisplayPercentAs;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  /**
   * Intl `signDisplay`. Default: `exceptZero` for `signed` / percent deltas;
   * `auto` otherwise.
   */
  signDisplay?: "auto" | "always" | "exceptZero" | "never";
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  /** Optional secondary label above/beside the number — keep brief. */
  label?: React.ReactNode;
  /** Optional quieter context under the number. */
  context?: React.ReactNode;
  /** Optional comparison fragment (e.g. “vs last week”) — not a card. */
  comparison?: React.ReactNode;
  /**
   * Optional trend mark. Prefer with `comparison` text — not color alone.
   * Pass a custom node to override the default glyph.
   */
  trend?: NumberDisplayTrend | React.ReactNode;
  state?: NumberDisplayState;
  loading?: boolean;
  /** Placeholder width while loading (ch). Default derived from size. */
  loadingWidthCh?: number;
  unknownLabel?: string;
  unavailableLabel?: string;
  loadingLabel?: string;
  tone?: NumberDisplayTone;
  size?: NumberDisplaySize;
  align?: NumberDisplayAlign;
  /**
   * Tabular figures for columns / financial alignment. Default true for
   * currency / integer / decimal in analytical use — set explicitly.
   */
  tabular?: boolean;
  /**
   * Accessible value override. When omitted and compact is used, the full
   * (non-compact) formatted number is announced.
   */
  "aria-label"?: string;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function resolveState(
  state: NumberDisplayState | undefined,
  loading: boolean | undefined,
  value: number | null | undefined
): NumberDisplayState {
  if (state) return state;
  if (loading) return "loading";
  if (value === null) return "unavailable";
  if (value === undefined) return "unknown";
  return "value";
}

function resolveTone(
  tone: NumberDisplayTone,
  value: number | null | undefined
): "neutral" | "positive" | "negative" {
  if (tone === "auto") {
    if (typeof value === "number" && value > 0) return "positive";
    if (typeof value === "number" && value < 0) return "negative";
    return "neutral";
  }
  return tone;
}

function defaultSignDisplay(
  format: NumberDisplayFormat,
  signDisplay: NumberDisplayProps["signDisplay"]
): Intl.NumberFormatOptions["signDisplay"] {
  if (signDisplay) return signDisplay;
  if (format === "signed") return "exceptZero";
  return "auto";
}

function buildFormatOptions(
  props: {
    format: NumberDisplayFormat;
    currency: string;
    unit?: string;
    unitDisplay: "short" | "long" | "narrow";
    compact: NumberDisplayCompact;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    signDisplay: Intl.NumberFormatOptions["signDisplay"];
  },
  forceFull: boolean
): Intl.NumberFormatOptions {
  const {
    format,
    currency,
    unit,
    unitDisplay,
    compact,
    minimumFractionDigits,
    maximumFractionDigits,
    signDisplay,
  } = props;

  const options: Intl.NumberFormatOptions = {
    signDisplay,
  };

  if (!forceFull && compact !== "never") {
    options.notation = "compact";
    options.compactDisplay = compact === "long" ? "long" : "short";
  }

  switch (format) {
    case "integer":
      options.style = "decimal";
      options.maximumFractionDigits =
        maximumFractionDigits ?? (compact !== "never" && !forceFull ? undefined : 0);
      options.minimumFractionDigits = minimumFractionDigits ?? 0;
      break;
    case "currency":
      options.style = "currency";
      options.currency = currency;
      if (minimumFractionDigits != null)
        options.minimumFractionDigits = minimumFractionDigits;
      if (maximumFractionDigits != null)
        options.maximumFractionDigits = maximumFractionDigits;
      break;
    case "percent":
      options.style = "percent";
      if (minimumFractionDigits != null)
        options.minimumFractionDigits = minimumFractionDigits;
      if (maximumFractionDigits != null)
        options.maximumFractionDigits = maximumFractionDigits;
      break;
    case "unit":
      options.style = "unit";
      options.unit = unit || "unit";
      options.unitDisplay = unitDisplay;
      if (minimumFractionDigits != null)
        options.minimumFractionDigits = minimumFractionDigits;
      if (maximumFractionDigits != null)
        options.maximumFractionDigits = maximumFractionDigits;
      break;
    case "signed":
    case "decimal":
    default:
      options.style = "decimal";
      if (minimumFractionDigits != null)
        options.minimumFractionDigits = minimumFractionDigits;
      if (maximumFractionDigits != null)
        options.maximumFractionDigits = maximumFractionDigits;
      break;
  }

  return options;
}

function scalePercent(
  value: number,
  format: NumberDisplayFormat,
  percentAs: NumberDisplayPercentAs
): number {
  if (format !== "percent") return value;
  if (percentAs === "unit") return value / 100;
  return value;
}

function formatPair(
  value: number,
  locale: string | string[] | undefined,
  options: {
    format: NumberDisplayFormat;
    currency: string;
    unit?: string;
    unitDisplay: "short" | "long" | "narrow";
    compact: NumberDisplayCompact;
    percentAs: NumberDisplayPercentAs;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    signDisplay: Intl.NumberFormatOptions["signDisplay"];
  }
): { visual: string; accessible: string } {
  const scaled = scalePercent(value, options.format, options.percentAs);

  let visual: string;
  let accessible: string;

  try {
    const visualNf = new Intl.NumberFormat(
      locale,
      buildFormatOptions(options, false)
    );
    visual = visualNf.format(scaled);

    if (options.compact !== "never") {
      const fullNf = new Intl.NumberFormat(
        locale,
        buildFormatOptions(options, true)
      );
      accessible = fullNf.format(scaled);
    } else {
      accessible = visual;
    }
  } catch {
    // Invalid currency/unit — fall back to plain decimal
    const fallback = new Intl.NumberFormat(locale, {
      style: "decimal",
      signDisplay: options.signDisplay,
    });
    visual = fallback.format(value);
    accessible = visual;
  }

  return { visual, accessible };
}

function TrendGlyph({ trend }: { trend: NumberDisplayTrend }) {
  if (trend === "up") {
    return (
      <svg viewBox="0 0 12 12" width="0.85em" height="0.85em" fill="none" aria-hidden="true">
        <path
          d="M2.5 7.5 6 3.5l3.5 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (trend === "down") {
    return (
      <svg viewBox="0 0 12 12" width="0.85em" height="0.85em" fill="none" aria-hidden="true">
        <path
          d="M2.5 4.5 6 8.5l3.5-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 12 12" width="0.85em" height="0.85em" fill="none" aria-hidden="true">
      <path
        d="M2.5 6h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function defaultTabular(
  tabular: boolean | undefined,
  format: NumberDisplayFormat
): boolean {
  if (tabular != null) return tabular;
  return (
    format === "currency" ||
    format === "integer" ||
    format === "decimal" ||
    format === "signed" ||
    format === "percent"
  );
}

export const NumberDisplay = React.forwardRef<HTMLElement, NumberDisplayProps>(
  function NumberDisplay(
    {
      value,
      format: formatProp,
      locale,
      currency = "USD",
      unit,
      unitDisplay = "short",
      compact = "never",
      percentAs = "ratio",
      minimumFractionDigits,
      maximumFractionDigits,
      signDisplay: signDisplayProp,
      prefix,
      suffix,
      label,
      context,
      comparison,
      trend,
      state: stateProp,
      loading = false,
      loadingWidthCh,
      unknownLabel = "Unknown",
      unavailableLabel = "Not available",
      loadingLabel = "Loading",
      tone = "auto",
      size = "md",
      align = "start",
      tabular: tabularProp,
      "aria-label": ariaLabel,
      className = "",
      id,
      style,
    },
    forwardedRef
  ) {
    const format: NumberDisplayFormat =
      formatProp ??
      (typeof value === "number" && Number.isInteger(value)
        ? "integer"
        : "decimal");

    const status = resolveState(stateProp, loading, value);
    const signDisplay = defaultSignDisplay(format, signDisplayProp);
    const tabular = defaultTabular(tabularProp, format);
    const resolvedTone = resolveTone(
      tone,
      status === "value" ? value : undefined
    );

    const formatted =
      status === "value" && typeof value === "number" && Number.isFinite(value)
        ? formatPair(value, locale, {
            format,
            currency,
            unit,
            unitDisplay,
            compact,
            percentAs,
            minimumFractionDigits,
            maximumFractionDigits,
            signDisplay,
          })
        : null;

    const accessibleName =
      ariaLabel ??
      (formatted
        ? [
            typeof label === "string" ? label : null,
            formatted.accessible,
            typeof context === "string" ? context : null,
            typeof comparison === "string" ? comparison : null,
          ]
            .filter(Boolean)
            .join(", ")
        : status === "loading"
          ? loadingLabel
          : status === "unknown"
            ? unknownLabel
            : status === "unavailable"
              ? unavailableLabel
              : undefined);

    const trendNode =
      trend == null
        ? null
        : typeof trend === "string"
          ? (
              <span
                className={cx(
                  "dk-number-display__trend",
                  `dk-number-display__trend--${trend}`
                )}
                aria-hidden="true"
              >
                <TrendGlyph trend={trend} />
              </span>
            )
          : (
              <span className="dk-number-display__trend" aria-hidden="true">
                {trend}
              </span>
            );

    const loadingCh =
      loadingWidthCh ??
      (size === "lg" ? 6 : size === "sm" ? 3.5 : 4.5);

    return (
      <span
        ref={forwardedRef as React.Ref<HTMLSpanElement>}
        id={id}
        className={cx(
          "dk-number-display",
          `dk-number-display--${size}`,
          `dk-number-display--align-${align}`,
          `dk-number-display--${status}`,
          `dk-number-display--tone-${resolvedTone}`,
          tabular && "dk-number-display--tabular",
          compact !== "never" && "dk-number-display--compact",
          className
        )}
        style={style}
        data-format={format}
        data-state={status}
        data-tone={resolvedTone}
      >
        {label != null ? (
          <span className="dk-number-display__label">{label}</span>
        ) : null}

        <span className="dk-number-display__main">
          <span
            className="dk-number-display__value"
            aria-label={accessibleName}
            aria-busy={status === "loading" || undefined}
          >
            {status === "loading" ? (
              <span
                className="dk-number-display__skeleton"
                style={{ width: `${loadingCh}ch` }}
                aria-hidden="true"
              />
            ) : null}

            {status === "unknown" ? (
              <span className="dk-number-display__placeholder" aria-hidden="true">
                {unknownLabel}
              </span>
            ) : null}

            {status === "unavailable" ? (
              <span className="dk-number-display__placeholder" aria-hidden="true">
                {unavailableLabel}
              </span>
            ) : null}

            {status === "value" && formatted ? (
              <>
                {prefix != null ? (
                  <span className="dk-number-display__prefix" aria-hidden="true">
                    {prefix}
                  </span>
                ) : null}
                <span className="dk-number-display__figure" aria-hidden="true">
                  {formatted.visual}
                </span>
                {suffix != null ? (
                  <span className="dk-number-display__suffix" aria-hidden="true">
                    {suffix}
                  </span>
                ) : null}
              </>
            ) : null}
          </span>

          {trendNode}
        </span>

        {comparison != null ? (
          <span className="dk-number-display__comparison">{comparison}</span>
        ) : null}

        {context != null ? (
          <span className="dk-number-display__context">{context}</span>
        ) : null}
      </span>
    );
  }
);

NumberDisplay.displayName = "NumberDisplay";

export default NumberDisplay;
