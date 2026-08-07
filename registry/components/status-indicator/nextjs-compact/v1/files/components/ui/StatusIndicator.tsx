import * as React from "react";

/**
 * DevKit visual tones — map application status vocabulary onto these.
 * Do not hardcode product words like “Active” / “Draft” into the primitive.
 */
export type StatusIndicatorTone =
  | "neutral"
  | "positive"
  | "warning"
  | "negative"
  | "informational";

/**
 * Compact presentations:
 * - `dot-text` — tone dot + label (default for secondary contexts)
 * - `icon-text` — semantic icon + label (preferred for important states)
 * - `text` — label only (tone still available via data attributes / SR text)
 * - `dot` — tone mark only; requires an accessible name (`label` / `aria-label`)
 */
export type StatusIndicatorAppearance =
  | "dot-text"
  | "icon-text"
  | "text"
  | "dot";

export type StatusIndicatorSize = "sm" | "md";

export interface StatusIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * Visible status label (application vocabulary).
   * Required for meaning — do not rely on color alone.
   * For `appearance="dot"`, still provide `label` (visually hidden) or `aria-label`.
   */
  label: string;
  /** Visual tone mapped from the host’s status model. */
  tone?: StatusIndicatorTone;
  appearance?: StatusIndicatorAppearance;
  size?: StatusIndicatorSize;
  /**
   * Host status key for analytics / styling hooks (e.g. `pending`, `online`).
   * Not interpreted by DevKit — preserves app vocabulary.
   */
  status?: string;
  /**
   * Custom icon. When omitted and `appearance` includes an icon, a tone glyph is used.
   * Pass `false` to suppress the default icon while keeping `icon-text` layout slot empty
   * (prefer switching to `dot-text` / `text` instead).
   */
  icon?: React.ReactNode | false;
  /**
   * Optional details for tooltip / expanded context.
   * Exposed via native `title` and `aria-describedby` when set.
   */
  details?: string;
  /**
   * Allow the label to wrap for long localized strings.
   * Default: true — do not silently truncate statuses into fragments.
   */
  wrap?: boolean;
}

const TONE_CLASS: Record<StatusIndicatorTone, string> = {
  neutral: "dk-status--neutral",
  positive: "dk-status--positive",
  warning: "dk-status--warning",
  negative: "dk-status--negative",
  informational: "dk-status--informational",
};

const APPEARANCE_CLASS: Record<StatusIndicatorAppearance, string> = {
  "dot-text": "dk-status--dot-text",
  "icon-text": "dk-status--icon-text",
  text: "dk-status--text",
  dot: "dk-status--dot-only",
};

const SIZE_CLASS: Record<StatusIndicatorSize, string> = {
  sm: "dk-status--sm",
  md: "dk-status--md",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function PositiveIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m5.5 8.1 1.7 1.7 3.3-3.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M7.3 2.9 1.95 12.2a.85.85 0 0 0 .74 1.275h10.62a.85.85 0 0 0 .74-1.275L8.7 2.9a.85.85 0 0 0-1.4 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 6.25v3M8 11.1h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NegativeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m6 6 4 4M10 6l-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InformationalIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 7.25V11M8 5.35h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NeutralIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 8h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const TONE_ICONS: Record<StatusIndicatorTone, React.ReactNode> = {
  neutral: <NeutralIcon />,
  positive: <PositiveIcon />,
  warning: <WarningIcon />,
  negative: <NegativeIcon />,
  informational: <InformationalIcon />,
};

const TONE_SR: Record<StatusIndicatorTone, string> = {
  neutral: "Neutral",
  positive: "Positive",
  warning: "Warning",
  negative: "Negative",
  informational: "Informational",
};

/**
 * Status Indicator (ID 042) — compact entity/process/resource state.
 *
 * Hosts map their own vocabulary (`Active`, `Draft`, …) onto DevKit tones.
 * Independent of tables, cards, and other composites.
 */
export const StatusIndicator = React.forwardRef<
  HTMLSpanElement,
  StatusIndicatorProps
>(function StatusIndicator(
  {
    label,
    tone = "neutral",
    appearance = "dot-text",
    size = "md",
    status,
    icon,
    details,
    wrap = true,
    className,
    id: idProp,
    title: titleProp,
    "aria-label": ariaLabel,
    ...rest
  },
  ref
) {
  const reactId = React.useId();
  const rootId = idProp ?? `dk-status-${reactId}`;
  const detailsId = details ? `${rootId}-details` : undefined;

  const showDot = appearance === "dot-text" || appearance === "dot";
  const showIcon = appearance === "icon-text" && icon !== false;
  const showLabel = appearance !== "dot";
  const iconNode =
    icon === false ? null : icon ?? (showIcon ? TONE_ICONS[tone] : null);

  const tooltip = titleProp ?? details;
  const accessibleName =
    ariaLabel ??
    (appearance === "dot"
      ? details
        ? `${label}. ${details}`
        : label
      : undefined);

  return (
    <span
      {...rest}
      ref={ref}
      id={rootId}
      className={cx(
        "dk-status",
        TONE_CLASS[tone],
        APPEARANCE_CLASS[appearance],
        SIZE_CLASS[size],
        wrap && "dk-status--wrap",
        !wrap && "dk-status--nowrap",
        className
      )}
      title={tooltip}
      aria-label={accessibleName}
      aria-describedby={detailsId}
      data-tone={tone}
      data-appearance={appearance}
      data-size={size}
      data-status={status || undefined}
    >
      <span className="dk-sr-only">{TONE_SR[tone]}</span>

      {showDot ? (
        <span className="dk-status__dot" aria-hidden="true" />
      ) : null}

      {showIcon ? (
        <span className="dk-status__icon" aria-hidden="true">
          {iconNode}
        </span>
      ) : null}

      {showLabel ? (
        <span className="dk-status__label">{label}</span>
      ) : (
        <span className="dk-sr-only">{label}</span>
      )}

      {details ? (
        <span className="dk-sr-only" id={detailsId}>
          {details}
        </span>
      ) : null}
    </span>
  );
});

StatusIndicator.displayName = "StatusIndicator";

export default StatusIndicator;
