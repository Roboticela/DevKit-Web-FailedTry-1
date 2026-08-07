import * as React from "react";

export type TextareaValidation = "none" | "error" | "success" | "warning";

/**
 * Height / resize behavior:
 * - `none` — fixed (or min/max clamped) height, not user-resizable
 * - `vertical` — manually resizable vertically (desktop)
 * - `both` — manually resizable both axes where appropriate
 * - `auto` — grows with content from min → max, then scrolls
 */
export type TextareaResize = "none" | "vertical" | "both" | "auto";

/** Recommended height presets (px). Default min is `sm` (96). */
export type TextareaHeightPreset = "sm" | "md" | "lg" | "xl";

const HEIGHT_PRESET: Record<TextareaHeightPreset, number> = {
  sm: 96,
  md: 128,
  lg: 160,
  xl: 240,
};

export interface TextareaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "defaultValue" | "onChange" | "children"
  > {
  label?: string;
  hideLabel?: boolean;
  description?: string;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  validation?: TextareaValidation;
  required?: boolean;
  optional?: boolean;
  requiredIndicator?: React.ReactNode;
  optionalLabel?: string;
  /**
   * Optional contextual affordance outside the text stream (e.g. section glyph).
   * Prefer empty — do not place decorative icons inside the textarea.
   */
  leadingAffordance?: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  readOnly?: boolean;
  disabled?: boolean;
  showCount?: boolean;
  /** Soft minimum length hint for counter / validation messaging. */
  minLength?: number;
  maxLength?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onValueChange?: (value: string) => void;
  fullWidth?: boolean;
  stableMessages?: boolean;
  /** Fixed height in px, CSS length, or preset. Overrides preset when set. */
  height?: number | string | TextareaHeightPreset;
  /** Minimum height. Default: 96 (`sm`). */
  minHeight?: number | string | TextareaHeightPreset;
  /** Maximum height for auto-grow / clamp. Default: 240 (`xl`) when `resize="auto"`. */
  maxHeight?: number | string | TextareaHeightPreset;
  /** Resize / grow mode. Default: `none`. */
  resize?: TextareaResize;
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function resolvePx(
  value: number | string | TextareaHeightPreset | undefined,
  fallback: number
): number {
  if (value === undefined) return fallback;
  if (typeof value === "number") return value;
  if (value in HEIGHT_PRESET) return HEIGHT_PRESET[value as TextareaHeightPreset];
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function cssLength(
  value: number | string | TextareaHeightPreset | undefined,
  fallbackPx: number
): string {
  if (value === undefined) return `${fallbackPx}px`;
  if (typeof value === "number") return `${value}px`;
  if (value in HEIGHT_PRESET) return `${HEIGHT_PRESET[value as TextareaHeightPreset]}px`;
  return String(value);
}

function StatusIcon({ kind }: { kind: "error" | "success" | "warning" }) {
  if (kind === "success") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M3.5 8.25 6.5 11.25 12.5 4.75"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "warning") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 3.25 13.25 12.5H2.75L8 3.25Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M8 7v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11.25" r="0.75" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  );
}

/**
 * Textarea (ID 012) — foundational multi-line textual input.
 *
 * Visually related to Text Input (011). Supports fixed, manual resize, and auto-grow
 * (min → max, then internal scroll).
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      hideLabel = false,
      description,
      helpText,
      errorMessage,
      successMessage,
      warningMessage,
      validation = "none",
      required = false,
      optional = false,
      requiredIndicator = "*",
      optionalLabel = "Optional",
      leadingAffordance,
      loading = false,
      loadingLabel = "Loading",
      readOnly = false,
      disabled = false,
      showCount,
      minLength,
      maxLength,
      value: valueProp,
      defaultValue,
      onChange,
      onValueChange,
      fullWidth = true,
      stableMessages,
      height,
      minHeight = "sm",
      maxHeight,
      resize = "none",
      id: idProp,
      className,
      placeholder,
      name,
      rows,
      onFocus,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const fieldId = idProp ?? `dk-textarea-${reactId}`;
    const descId = `${fieldId}-desc`;
    const helpId = `${fieldId}-help`;
    const errorId = `${fieldId}-error`;
    const successId = `${fieldId}-success`;
    const warningId = `${fieldId}-warning`;
    const countId = `${fieldId}-count`;

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "");
    const value = isControlled ? String(valueProp) : uncontrolled;
    const filled = value.length > 0;

    const autoGrow = resize === "auto";
    const minPx = resolvePx(minHeight, 96);
    const maxPx = resolvePx(
      maxHeight,
      autoGrow ? 240 : resolvePx(height, minPx)
    );
    const fixedPx = height !== undefined ? resolvePx(height, minPx) : minPx;

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const syncAutoHeight = React.useCallback(() => {
      const el = textareaRef.current;
      if (!el || !autoGrow) return;
      // Collapse first so scrollHeight reflects content, not a stretched parent.
      el.style.height = "auto";
      const content = el.scrollHeight;
      const next = Math.min(Math.max(content, minPx), maxPx);
      el.style.height = `${next}px`;
      el.style.overflowY = content > maxPx ? "auto" : "hidden";
    }, [autoGrow, minPx, maxPx]);

    React.useLayoutEffect(() => {
      syncAutoHeight();
    }, [value, syncAutoHeight]);

    const resolvedValidation: TextareaValidation =
      validation !== "none"
        ? validation
        : errorMessage
          ? "error"
          : successMessage
            ? "success"
            : warningMessage
              ? "warning"
              : "none";

    const counterEnabled =
      showCount ??
      ((typeof maxLength === "number" && maxLength > 0) ||
        (typeof minLength === "number" && minLength > 0));

    const count = value.length;
    const belowMin =
      typeof minLength === "number" && minLength > 0 && count > 0 && count < minLength;
    const atMax =
      typeof maxLength === "number" && maxLength > 0 && count >= maxLength;

    const messageConfigured = Boolean(
      helpText || errorMessage || successMessage || warningMessage || counterEnabled
    );
    const reserveFooter = stableMessages ?? messageConfigured;

    const describedBy = [
      description ? descId : null,
      resolvedValidation === "error" && errorMessage ? errorId : null,
      resolvedValidation === "success" && successMessage ? successId : null,
      resolvedValidation === "warning" && warningMessage ? warningId : null,
      resolvedValidation === "none" && helpText ? helpId : null,
      counterEnabled ? countId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = event.target.value;
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
      onChange?.(event);
    };

    const manualResize = resize === "vertical" || resize === "both";

    // Auto: size the textarea (content box). Control follows — do not clamp the
    // padded shell to the same px as the textarea or the shell overflows.
    // Manual resize: unlock control height so the textarea can be dragged.
    const controlStyle: React.CSSProperties = autoGrow
      ? {
          minHeight: undefined,
          height: "auto",
          maxHeight: undefined,
        }
      : manualResize
        ? {
            height: "auto",
            minHeight: cssLength(minHeight, 96),
            maxHeight: undefined,
          }
        : height !== undefined
          ? {
              height: cssLength(height, minPx),
              minHeight: cssLength(minHeight, minPx),
              maxHeight: maxHeight !== undefined ? cssLength(maxHeight, maxPx) : undefined,
            }
          : {
              minHeight: cssLength(minHeight, 96),
              height: cssLength(minHeight, 96),
              maxHeight: maxHeight !== undefined ? cssLength(maxHeight, maxPx) : undefined,
            };

    const resizeClass =
      resize === "auto"
        ? "dk-textarea--resize-auto"
        : resize === "vertical"
          ? "dk-textarea--resize-vertical"
          : resize === "both"
            ? "dk-textarea--resize-both"
            : "dk-textarea--resize-none";

    return (
      <div
        className={cx(
          "dk-field",
          "dk-textarea",
          resizeClass,
          fullWidth && "dk-field--full",
          disabled && "dk-field--disabled",
          readOnly && "dk-field--readonly",
          loading && "dk-field--loading",
          filled && "dk-field--filled",
          resolvedValidation !== "none" && `dk-field--${resolvedValidation}`,
          reserveFooter && "dk-field--stable-messages",
          leadingAffordance && "dk-textarea--with-affordance",
          className
        )}
        data-resize={resize}
        data-validation={resolvedValidation}
        data-filled={filled || undefined}
        data-loading={loading || undefined}
        style={
          {
            "--dk-textarea-min": cssLength(minHeight, 96),
            "--dk-textarea-max":
              maxHeight !== undefined || autoGrow
                ? cssLength(maxHeight ?? "xl", 240)
                : "none",
            "--dk-textarea-height": cssLength(height ?? minHeight, minPx),
          } as React.CSSProperties
        }
      >
        {label ? (
          <div className={cx("dk-field__label-row", hideLabel && "dk-field__label-row--sr")}>
            <label className="dk-field__label" htmlFor={fieldId}>
              {label}
            </label>
            {required ? (
              <span className="dk-field__required" aria-hidden="true">
                {requiredIndicator}
              </span>
            ) : null}
            {!required && optional ? (
              <span className="dk-field__optional">{optionalLabel}</span>
            ) : null}
          </div>
        ) : null}

        {description ? (
          <p id={descId} className="dk-field__description">
            {description}
          </p>
        ) : null}

        <div className="dk-field__control dk-textarea__control" style={controlStyle}>
          {leadingAffordance ? (
            <span className="dk-textarea__affordance" aria-hidden="true">
              {leadingAffordance}
            </span>
          ) : null}

          <textarea
            {...rest}
            ref={setRefs}
            id={fieldId}
            name={name}
            className="dk-field__input dk-textarea__input"
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly || loading}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            rows={rows ?? 3}
            aria-invalid={resolvedValidation === "error" || undefined}
            aria-busy={loading || undefined}
            aria-describedby={describedBy || undefined}
            aria-label={
              !label || hideLabel
                ? ariaLabel ?? (typeof label === "string" ? label : undefined)
                : ariaLabel
            }
            aria-labelledby={ariaLabelledBy}
            data-empty={!filled || undefined}
            onChange={handleChange}
            onFocus={(event) => {
              onFocus?.(event);
              // Keep caret region visible above mobile virtual keyboard when possible
              requestAnimationFrame(() => {
                event.currentTarget.scrollIntoView({
                  block: "nearest",
                  inline: "nearest",
                });
              });
            }}
          />

          {loading ? (
            <span className="dk-textarea__loading" role="status" aria-label={loadingLabel}>
              <span className="dk-field__spinner" aria-hidden="true" />
            </span>
          ) : null}
        </div>

        <div className="dk-field__footer">
          <div className="dk-field__messages">
            {resolvedValidation === "error" && errorMessage ? (
              <p id={errorId} className="dk-field__message dk-field__message--error" role="alert">
                <span className="dk-field__message-icon" aria-hidden="true">
                  <StatusIcon kind="error" />
                </span>
                <span>{errorMessage}</span>
              </p>
            ) : null}
            {resolvedValidation === "success" && successMessage ? (
              <p id={successId} className="dk-field__message dk-field__message--success">
                <span className="dk-field__message-icon" aria-hidden="true">
                  <StatusIcon kind="success" />
                </span>
                <span>{successMessage}</span>
              </p>
            ) : null}
            {resolvedValidation === "warning" && warningMessage ? (
              <p id={warningId} className="dk-field__message dk-field__message--warning">
                <span className="dk-field__message-icon" aria-hidden="true">
                  <StatusIcon kind="warning" />
                </span>
                <span>{warningMessage}</span>
              </p>
            ) : null}
            {resolvedValidation === "none" && helpText ? (
              <p id={helpId} className="dk-field__message dk-field__message--help">
                {helpText}
              </p>
            ) : null}
            {resolvedValidation === "none" && belowMin && !helpText ? (
              <p className="dk-field__message dk-field__message--help">
                {minLength! - count} more character{minLength! - count === 1 ? "" : "s"} needed
              </p>
            ) : null}
          </div>

          {counterEnabled ? (
            <p
              id={countId}
              className={cx(
                "dk-field__count",
                "dk-textarea__count",
                (atMax || belowMin) && "dk-field__count--limit"
              )}
              aria-live="polite"
            >
              {typeof maxLength === "number"
                ? `${count}/${maxLength}`
                : typeof minLength === "number"
                  ? `${count}/${minLength}+`
                  : count}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
