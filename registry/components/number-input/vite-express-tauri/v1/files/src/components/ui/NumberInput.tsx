import * as React from "react";

export type NumberInputSize = "xs" | "sm" | "md" | "lg" | "xl";

export type NumberInputValidation = "none" | "error" | "success" | "warning";

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | "size"
    | "type"
    | "value"
    | "defaultValue"
    | "onChange"
    | "prefix"
    | "min"
    | "max"
    | "step"
  > {
  label?: string;
  hideLabel?: boolean;
  description?: string;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  validation?: NumberInputValidation;
  size?: NumberInputSize;
  required?: boolean;
  optional?: boolean;
  requiredIndicator?: React.ReactNode;
  optionalLabel?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  readOnly?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  stableMessages?: boolean;
  /**
   * Submitted numeric value.
   * - `null` = empty (distinct from `0`)
   * - `0` = zero
   */
  value?: number | null;
  defaultValue?: number | null;
  /** Fires with the committed numeric value (`null` when empty). */
  onValueChange?: (value: number | null) => void;
  /** Raw text currently in the field (while typing / pasted). */
  onRawChange?: (raw: string) => void;
  min?: number;
  max?: number;
  /** Step for arrows / steppers. Default: 1 (or 0.1 when `decimal`). */
  step?: number;
  /** Max fraction digits when committing. Ignored for integer mode. */
  precision?: number;
  /** Allow fractional values. Default: false (integer). */
  decimal?: boolean;
  /** Disallow negatives (sets effective min ≥ 0 unless `min` is higher). Default: false. */
  positiveOnly?: boolean;
  /**
   * Optional increment/decrement buttons. Default: false —
   * keyboard / direct typing remain first-class without steppers.
   */
  stepper?: boolean;
  incrementLabel?: string;
  decrementLabel?: string;
  /**
   * Locale for blur formatting (e.g. `en-US`). When unset, uses a simple
   * precision string — never reformats while focused.
   */
  locale?: string;
  /** Format on blur using locale grouping. Default: true when `locale` is set. */
  formatOnBlur?: boolean;
}

const SIZE_CLASS: Record<NumberInputSize, string> = {
  xs: "dk-number--xs",
  sm: "dk-number--sm",
  md: "dk-number--md",
  lg: "dk-number--lg",
  xl: "dk-number--xl",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
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

function ChevronUpIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M3 7.5 6 4.5 9 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M3 4.5 6 7.5 9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function roundToPrecision(n: number, precision: number | undefined, decimal: boolean) {
  if (!decimal) return Math.trunc(n);
  if (precision === undefined) return n;
  const f = 10 ** precision;
  return Math.round(n * f) / f;
}

function clamp(n: number, min?: number, max?: number) {
  let next = n;
  if (min !== undefined && next < min) next = min;
  if (max !== undefined && next > max) next = max;
  return next;
}

function parseRaw(raw: string, decimal: boolean, positiveOnly: boolean): number | null {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "-" || trimmed === "." || trimmed === "-.") {
    return null;
  }
  // Normalize locale-ish grouping commas for paste (simple)
  const normalized = trimmed.replace(/,/g, "");
  if (!decimal && normalized.includes(".")) return Number.NaN;
  if (positiveOnly && normalized.startsWith("-")) return Number.NaN;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

function isAllowedRaw(raw: string, decimal: boolean, positiveOnly: boolean) {
  if (raw === "") return true;
  if (!positiveOnly && raw === "-") return true;
  if (decimal && (raw === "." || raw === "-.")) return true;
  const pattern = decimal
    ? positiveOnly
      ? /^\d*\.?\d*$/
      : /^-?\d*\.?\d*$/
    : positiveOnly
      ? /^\d*$/
      : /^-?\d*$/;
  return pattern.test(raw);
}

function formatCommitted(
  value: number | null,
  {
    locale,
    formatOnBlur,
    decimal,
    precision,
  }: {
    locale?: string;
    formatOnBlur: boolean;
    decimal: boolean;
    precision?: number;
  }
): string {
  if (value === null) return "";
  if (locale && formatOnBlur) {
    try {
      return new Intl.NumberFormat(locale, {
        maximumFractionDigits: decimal ? (precision ?? 20) : 0,
        minimumFractionDigits: decimal && precision !== undefined ? precision : 0,
        useGrouping: true,
      }).format(value);
    } catch {
      /* fall through */
    }
  }
  if (!decimal) return String(Math.trunc(value));
  if (precision !== undefined) return value.toFixed(precision);
  return String(value);
}

function valueToRaw(value: number | null, decimal: boolean, precision?: number): string {
  if (value === null) return "";
  if (!decimal) return String(Math.trunc(value));
  if (precision !== undefined) return String(Number(value.toFixed(precision)));
  return String(value);
}

/**
 * Number Input (ID 014) — numeric entry with optional steppers.
 *
 * Empty (`null`) is distinct from `0`. Does not reformat while focused.
 * Direct typing is first-class; steppers are optional.
 */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
    {
      label,
      hideLabel = false,
      description,
      helpText,
      errorMessage,
      successMessage,
      warningMessage,
      validation = "none",
      size = "md",
      required = false,
      optional = false,
      requiredIndicator = "*",
      optionalLabel = "Optional",
      prefix,
      suffix,
      loading = false,
      loadingLabel = "Loading",
      readOnly = false,
      disabled = false,
      fullWidth = true,
      stableMessages,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      onRawChange,
      min: minProp,
      max,
      step: stepProp,
      precision,
      decimal = false,
      positiveOnly = false,
      stepper = false,
      incrementLabel = "Increment",
      decrementLabel = "Decrement",
      locale,
      formatOnBlur,
      id: idProp,
      className,
      placeholder,
      name,
      onBlur,
      onFocus,
      onKeyDown,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const inputId = idProp ?? `dk-number-${reactId}`;
    const descId = `${inputId}-desc`;
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;
    const warningId = `${inputId}-warning`;

    const min =
      minProp !== undefined
        ? minProp
        : positiveOnly
          ? 0
          : undefined;
    const step = stepProp ?? (decimal ? 0.1 : 1);
    const shouldFormatOnBlur = formatOnBlur ?? Boolean(locale);

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState<number | null>(defaultValue);
    const committed = isControlled ? valueProp! : uncontrolled;

    const [raw, setRaw] = React.useState(() =>
      valueToRaw(committed, decimal, precision)
    );
    const [focused, setFocused] = React.useState(false);

    // Sync raw from committed when not focused (external updates)
    React.useEffect(() => {
      if (!focused) {
        setRaw(
          shouldFormatOnBlur && committed !== null
            ? formatCommitted(committed, {
                locale,
                formatOnBlur: shouldFormatOnBlur,
                decimal,
                precision,
              })
            : valueToRaw(committed, decimal, precision)
        );
      }
    }, [committed, focused, decimal, precision, locale, shouldFormatOnBlur]);

    const resolvedValidation: NumberInputValidation =
      validation !== "none"
        ? validation
        : errorMessage
          ? "error"
          : successMessage
            ? "success"
            : warningMessage
              ? "warning"
              : "none";

    const messageConfigured = Boolean(
      helpText || errorMessage || successMessage || warningMessage
    );
    const reserveFooter = stableMessages ?? messageConfigured;

    const describedBy = [
      description ? descId : null,
      resolvedValidation === "error" && errorMessage ? errorId : null,
      resolvedValidation === "success" && successMessage ? successId : null,
      resolvedValidation === "warning" && warningMessage ? warningId : null,
      resolvedValidation === "none" && helpText ? helpId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const commit = (next: number | null) => {
      let value = next;
      if (value !== null && !Number.isNaN(value)) {
        value = roundToPrecision(value, precision, decimal);
        value = clamp(value, min, max);
      } else if (value !== null && Number.isNaN(value)) {
        // invalid — keep previous committed, surface via raw
        return;
      }
      if (!isControlled) setUncontrolled(value);
      onValueChange?.(value);
    };

    const applyStep = (direction: 1 | -1) => {
      if (disabled || readOnly || loading) return;
      const base = committed === null ? 0 : committed;
      const next = roundToPrecision(base + direction * step, precision, decimal);
      const clamped = clamp(next, min, max);
      if (positiveOnly && clamped < 0) return;
      const nextRaw = valueToRaw(clamped, decimal, precision);
      commit(clamped);
      setRaw(nextRaw);
      onRawChange?.(nextRaw);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextRaw = event.target.value;
      if (!isAllowedRaw(nextRaw, decimal, positiveOnly)) return;
      setRaw(nextRaw);
      onRawChange?.(nextRaw);

      const parsed = parseRaw(nextRaw, decimal, positiveOnly);
      if (parsed === null) {
        if (!isControlled) setUncontrolled(null);
        onValueChange?.(null);
        return;
      }
      if (Number.isNaN(parsed)) {
        // Incomplete or invalid mid-type (e.g. "1.") — keep raw, don't commit NaN
        return;
      }
      // Soft commit while typing without reformatting display
      const soft = roundToPrecision(parsed, precision, decimal);
      if (!isControlled) setUncontrolled(soft);
      onValueChange?.(soft);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      const parsed = parseRaw(raw, decimal, positiveOnly);
      if (parsed === null) {
        commit(null);
        setRaw("");
      } else if (Number.isNaN(parsed)) {
        // Revert display to last committed
        setRaw(
          shouldFormatOnBlur
            ? formatCommitted(committed, {
                locale,
                formatOnBlur: shouldFormatOnBlur,
                decimal,
                precision,
              })
            : valueToRaw(committed, decimal, precision)
        );
      } else {
        const next = clamp(roundToPrecision(parsed, precision, decimal), min, max);
        commit(next);
        setRaw(
          formatCommitted(next, {
            locale,
            formatOnBlur: shouldFormatOnBlur,
            decimal,
            precision,
          })
        );
      }
      onBlur?.(event);
    };

    const atMin = committed !== null && min !== undefined && committed <= min;
    const atMax = committed !== null && max !== undefined && committed >= max;
    const isEmpty = committed === null;
    const isZero = committed === 0;

    return (
      <div
        className={cx(
          "dk-field",
          "dk-number",
          SIZE_CLASS[size],
          fullWidth && "dk-field--full",
          disabled && "dk-field--disabled",
          readOnly && "dk-field--readonly",
          loading && "dk-number--loading",
          !isEmpty && "dk-number--filled",
          isEmpty && "dk-number--empty",
          isZero && "dk-number--zero",
          stepper && "dk-number--stepper",
          resolvedValidation !== "none" && `dk-field--${resolvedValidation}`,
          reserveFooter && "dk-field--stable-messages",
          className
        )}
        data-size={size}
        data-empty={isEmpty || undefined}
        data-zero={isZero || undefined}
        data-validation={resolvedValidation}
        data-loading={loading || undefined}
      >
        {label ? (
          <div className={cx("dk-field__label-row", hideLabel && "dk-field__label-row--sr")}>
            <label className="dk-field__label" htmlFor={inputId}>
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

        <div className="dk-field__control dk-number__control">
          <span className="dk-field__hit" aria-hidden="true" />

          {prefix ? (
            <span className="dk-number__addon dk-number__addon--prefix">{prefix}</span>
          ) : null}

          <input
            {...rest}
            ref={setRefs}
            id={inputId}
            name={name}
            className="dk-field__input dk-number__input"
            type="text"
            inputMode={decimal ? "decimal" : "numeric"}
            pattern={decimal ? undefined : positiveOnly ? "[0-9]*" : undefined}
            value={raw}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly || loading}
            required={required}
            aria-invalid={resolvedValidation === "error" || undefined}
            aria-busy={loading || undefined}
            aria-describedby={describedBy || undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={committed === null ? undefined : committed}
            aria-label={
              !label || hideLabel
                ? ariaLabel ?? (typeof label === "string" ? label : undefined)
                : ariaLabel
            }
            aria-labelledby={ariaLabelledBy}
            data-empty={isEmpty || undefined}
            data-zero={isZero || undefined}
            onChange={handleChange}
            onFocus={(event) => {
              setFocused(true);
              // Editable raw while focused — don't reformat mid-edit
              if (!focused) {
                setRaw(valueToRaw(committed, decimal, precision));
              }
              onFocus?.(event);
            }}
            onBlur={handleBlur}
            onKeyDown={(event) => {
              onKeyDown?.(event);
              if (event.defaultPrevented || disabled || readOnly || loading) return;
              if (event.key === "ArrowUp") {
                event.preventDefault();
                applyStep(1);
              } else if (event.key === "ArrowDown") {
                event.preventDefault();
                applyStep(-1);
              }
            }}
          />

          {suffix ? (
            <span className="dk-number__addon dk-number__addon--suffix">{suffix}</span>
          ) : null}

          {loading ? (
            <span className="dk-number__loading" role="status" aria-label={loadingLabel}>
              <span className="dk-number__spinner" aria-hidden="true" />
            </span>
          ) : null}

          {stepper && !loading ? (
            <div className="dk-number__steppers">
              <button
                type="button"
                className="dk-number__step dk-number__step--inc"
                aria-label={incrementLabel}
                disabled={disabled || readOnly || atMax}
                tabIndex={-1}
                onPointerDown={(event) => {
                  // Keep focus on the input so blur doesn't revert mid-step.
                  event.preventDefault();
                }}
                onClick={() => applyStep(1)}
              >
                <span className="dk-number__step-hit" aria-hidden="true" />
                <ChevronUpIcon />
              </button>
              <button
                type="button"
                className="dk-number__step dk-number__step--dec"
                aria-label={decrementLabel}
                disabled={disabled || readOnly || atMin || (positiveOnly && (committed ?? 0) <= 0)}
                tabIndex={-1}
                onPointerDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => applyStep(-1)}
              >
                <span className="dk-number__step-hit" aria-hidden="true" />
                <ChevronDownIcon />
              </button>
            </div>
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
          </div>
        </div>
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
