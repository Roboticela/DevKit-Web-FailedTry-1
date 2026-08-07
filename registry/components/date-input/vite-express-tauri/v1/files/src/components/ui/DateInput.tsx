import * as React from "react";

export type DateInputSize = "xs" | "sm" | "md" | "lg" | "xl";

export type DateInputValidation = "none" | "error" | "success" | "warning";

/**
 * Timezone-independent calendar date as `YYYY-MM-DD`, or `null` when empty.
 * Never conflate empty with an invalid partial string — use `onRawChange` for that.
 */
export type DateInputValue = string | null;

export interface DateInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "value" | "defaultValue" | "onChange" | "min" | "max"
  > {
  label?: string;
  hideLabel?: boolean;
  description?: string;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  validation?: DateInputValidation;
  size?: DateInputSize;
  required?: boolean;
  optional?: boolean;
  requiredIndicator?: React.ReactNode;
  optionalLabel?: string;
  loading?: boolean;
  loadingLabel?: string;
  readOnly?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  stableMessages?: boolean;
  /** BCP 47 locale for format / parse hints. Default: runtime locale. */
  locale?: string;
  /**
   * Committed ISO date `YYYY-MM-DD`, or `null` when empty.
   * Independent of display formatting.
   */
  value?: DateInputValue;
  defaultValue?: DateInputValue;
  onValueChange?: (value: DateInputValue) => void;
  /** Raw text currently shown (while typing). Not reformatted while focused. */
  onRawChange?: (raw: string) => void;
  /** Inclusive minimum ISO date. */
  min?: string;
  /** Inclusive maximum ISO date. */
  max?: string;
  /** Return true to mark a committed ISO date as unavailable. */
  isDateDisabled?: (isoDate: string) => boolean;
  clearable?: boolean;
  clearLabel?: string;
  onClear?: () => void;
  /**
   * Show calendar trigger. Opens via `onOpenPicker` — does not embed a calendar.
   * Compose with a future Date Picker.
   */
  showCalendarTrigger?: boolean;
  calendarLabel?: string;
  /** Whether an external picker is open (sets `aria-expanded`). */
  pickerOpen?: boolean;
  /** Called when the calendar trigger is activated. */
  onOpenPicker?: () => void;
  /**
   * Optional slot rendered after the field (e.g. anchored Date Picker).
   * Kept outside the primitive’s core chrome.
   */
  pickerSlot?: React.ReactNode;
}

const SIZE_CLASS: Record<DateInputSize, string> = {
  xs: "dk-date--xs",
  sm: "dk-date--sm",
  md: "dk-date--md",
  lg: "dk-date--lg",
  xl: "dk-date--xl",
};

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

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

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect
        x="3.25"
        y="4.75"
        width="13.5"
        height="11.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M3.25 8.25h13.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 3.25v3M13 3.25v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M6.5 6.5 13.5 13.5M13.5 6.5 6.5 13.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function isValidIsoDate(value: string): boolean {
  const match = ISO_RE.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  // Construct as UTC noon to avoid TZ day-shift when validating calendar parts
  const dt = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return (
    dt.getUTCFullYear() === year &&
    dt.getUTCMonth() === month - 1 &&
    dt.getUTCDate() === day
  );
}

function isoToUtcDate(iso: string): Date | null {
  if (!isValidIsoDate(iso)) return null;
  const [, y, m, d] = ISO_RE.exec(iso)!;
  return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 12, 0, 0));
}

function formatIso(locale: string, iso: string | null): string {
  if (!iso) return "";
  const date = isoToUtcDate(iso);
  if (!date) return iso;
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return iso;
  }
}

function placeholderForLocale(locale: string): string {
  // Derive an example skeleton from the locale — never hardcode MM/DD/YYYY
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    }).formatToParts(new Date(Date.UTC(2026, 10, 25)));
    return parts
      .map((part) => {
        if (part.type === "day") return "DD";
        if (part.type === "month") return "MM";
        if (part.type === "year") return "YYYY";
        return part.value;
      })
      .join("");
  } catch {
    return "YYYY-MM-DD";
  }
}

/**
 * Best-effort parse of user text into ISO.
 * Accepts ISO first, then locale-ordered numeric segments — never assumes US order.
 */
function parseToIso(raw: string, locale: string): string | null | "invalid" {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (ISO_RE.test(trimmed)) {
    return isValidIsoDate(trimmed) ? trimmed : "invalid";
  }

  const digits = trimmed.match(/\d+/g);
  if (!digits || digits.length < 3) return "invalid";

  let year: number | undefined;
  let month: number | undefined;
  let day: number | undefined;

  // Infer order from locale pattern using a known UTC date
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: "UTC",
    }).formatToParts(new Date(Date.UTC(2026, 10, 25)));
    const order = parts.filter((p) => p.type === "year" || p.type === "month" || p.type === "day");
    const nums = digits.map((d) => Number(d));
    order.forEach((part, index) => {
      const n = nums[index];
      if (n === undefined) return;
      if (part.type === "year") year = n < 100 ? 2000 + n : n;
      if (part.type === "month") month = n;
      if (part.type === "day") day = n;
    });
  } catch {
    // Fallback: ISO-like year-first when locale tools fail
    year = Number(digits[0]);
    month = Number(digits[1]);
    day = Number(digits[2]);
  }

  if (year === undefined || month === undefined || day === undefined) return "invalid";
  const iso = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return isValidIsoDate(iso) ? iso : "invalid";
}

function compareIso(a: string, b: string): number {
  return a.localeCompare(b);
}

/**
 * Date Input (ID 017) — locale-aware calendar date field.
 *
 * Committed value is timezone-independent ISO `YYYY-MM-DD`.
 * Manual entry is first-class; calendar trigger opens an external Date Picker.
 */
export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  function DateInput(
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
      loading = false,
      loadingLabel = "Loading",
      readOnly = false,
      disabled = false,
      fullWidth = true,
      stableMessages,
      locale: localeProp,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      onRawChange,
      min,
      max,
      isDateDisabled,
      clearable = false,
      clearLabel = "Clear date",
      onClear,
      showCalendarTrigger = true,
      calendarLabel = "Open calendar",
      pickerOpen = false,
      onOpenPicker,
      pickerSlot,
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
    const locale =
      localeProp ??
      (typeof navigator !== "undefined" ? navigator.language : "en-US");

    const reactId = React.useId();
    const inputId = idProp ?? `dk-date-${reactId}`;
    const descId = `${inputId}-desc`;
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;
    const warningId = `${inputId}-warning`;

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState<DateInputValue>(defaultValue);
    const committed = isControlled ? valueProp! : uncontrolled;

    const [raw, setRaw] = React.useState(() => formatIso(locale, committed));
    const [focused, setFocused] = React.useState(false);
    const [localInvalid, setLocalInvalid] = React.useState(false);

    React.useEffect(() => {
      if (!focused) {
        setRaw(formatIso(locale, committed));
        setLocalInvalid(false);
      }
    }, [committed, focused, locale]);

    const resolvedValidation: DateInputValidation =
      validation !== "none"
        ? validation
        : errorMessage
          ? "error"
          : localInvalid
            ? "error"
            : successMessage
              ? "success"
              : warningMessage
                ? "warning"
                : "none";

    const messageConfigured = Boolean(
      helpText || errorMessage || successMessage || warningMessage || localInvalid
    );
    const reserveFooter = stableMessages ?? messageConfigured;

    const describedBy = [
      description ? descId : null,
      (resolvedValidation === "error" && (errorMessage || localInvalid)) || null
        ? errorId
        : null,
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

    const commit = (next: DateInputValue) => {
      if (next && min && compareIso(next, min) < 0) {
        setLocalInvalid(true);
        return;
      }
      if (next && max && compareIso(next, max) > 0) {
        setLocalInvalid(true);
        return;
      }
      if (next && isDateDisabled?.(next)) {
        setLocalInvalid(true);
        return;
      }
      setLocalInvalid(false);
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    };

    const filled = committed !== null || raw.trim().length > 0;
    const showClear =
      clearable &&
      !disabled &&
      !readOnly &&
      !loading &&
      (committed !== null || raw.trim().length > 0);

    const resolvedPlaceholder = placeholder ?? placeholderForLocale(locale);

    const handleClear = () => {
      setRaw("");
      onRawChange?.("");
      commit(null);
      onClear?.();
      inputRef.current?.focus();
    };

    const invalidMessage =
      errorMessage ||
      (localInvalid ? "Enter a valid date" : undefined);

    return (
      <div
        className={cx(
          "dk-field",
          "dk-date",
          SIZE_CLASS[size],
          fullWidth && "dk-field--full",
          disabled && "dk-field--disabled",
          readOnly && "dk-field--readonly",
          loading && "dk-date--loading",
          filled && "dk-date--filled",
          committed === null && !raw.trim() && "dk-date--empty",
          resolvedValidation !== "none" && `dk-field--${resolvedValidation}`,
          reserveFooter && "dk-field--stable-messages",
          className
        )}
        data-size={size}
        data-locale={locale}
        data-validation={resolvedValidation}
        data-empty={committed === null && !raw.trim() ? true : undefined}
        data-loading={loading || undefined}
        data-picker-open={pickerOpen || undefined}
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

        <div className="dk-field__control dk-date__control">
          <span className="dk-field__hit" aria-hidden="true" />

          <input
            {...rest}
            ref={setRefs}
            id={inputId}
            name={name}
            className="dk-field__input dk-date__input"
            type="text"
            inputMode="numeric"
            autoComplete="bday"
            spellCheck={false}
            value={raw}
            placeholder={resolvedPlaceholder}
            disabled={disabled}
            readOnly={readOnly || loading}
            required={required}
            aria-invalid={resolvedValidation === "error" || undefined}
            aria-busy={loading || undefined}
            aria-describedby={describedBy || undefined}
            aria-label={
              !label || hideLabel
                ? ariaLabel ?? (typeof label === "string" ? label : undefined)
                : ariaLabel
            }
            aria-labelledby={ariaLabelledBy}
            aria-haspopup={showCalendarTrigger ? "dialog" : undefined}
            data-empty={committed === null && !raw.trim() ? true : undefined}
            onChange={(event) => {
              const next = event.target.value;
              setRaw(next);
              setLocalInvalid(false);
              onRawChange?.(next);
              // Soft-commit only when the raw text is already a valid ISO —
              // never rewrite the user's typing mid-edit.
              if (ISO_RE.test(next.trim()) && isValidIsoDate(next.trim())) {
                commit(next.trim());
              } else if (!next.trim()) {
                commit(null);
              }
            }}
            onFocus={(event) => {
              setFocused(true);
              // Show editable text; if committed, prefer current raw or ISO for correction
              if (committed && !raw) setRaw(formatIso(locale, committed));
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              const parsed = parseToIso(raw, locale);
              if (parsed === null) {
                commit(null);
                setRaw("");
              } else if (parsed === "invalid") {
                // Keep typed text so the user can correct it
                setLocalInvalid(true);
              } else {
                commit(parsed);
                setRaw(formatIso(locale, parsed));
              }
              onBlur?.(event);
            }}
            onKeyDown={(event) => {
              onKeyDown?.(event);
              if (event.defaultPrevented || disabled || readOnly || loading) return;
              if (
                (event.key === "ArrowDown" || event.key === "F4") &&
                showCalendarTrigger &&
                onOpenPicker
              ) {
                event.preventDefault();
                onOpenPicker();
              }
            }}
          />

          {loading ? (
            <span className="dk-date__loading" role="status" aria-label={loadingLabel}>
              <span className="dk-date__spinner" aria-hidden="true" />
            </span>
          ) : null}

          {showClear ? (
            <button
              type="button"
              className="dk-date__clear"
              aria-label={clearLabel}
              onClick={handleClear}
            >
              <span className="dk-date__clear-hit" aria-hidden="true" />
              <ClearIcon />
            </button>
          ) : null}

          {showCalendarTrigger && !loading ? (
            <button
              type="button"
              className="dk-date__calendar"
              aria-label={calendarLabel}
              aria-expanded={pickerOpen}
              aria-haspopup="dialog"
              disabled={disabled || readOnly}
              onClick={() => onOpenPicker?.()}
            >
              <span className="dk-date__calendar-hit" aria-hidden="true" />
              <CalendarIcon />
            </button>
          ) : null}
        </div>

        {pickerSlot ? <div className="dk-date__picker-slot">{pickerSlot}</div> : null}

        <div className="dk-field__footer">
          <div className="dk-field__messages">
            {resolvedValidation === "error" && invalidMessage ? (
              <p id={errorId} className="dk-field__message dk-field__message--error" role="alert">
                <span className="dk-field__message-icon" aria-hidden="true">
                  <StatusIcon kind="error" />
                </span>
                <span>{invalidMessage}</span>
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

DateInput.displayName = "DateInput";

export default DateInput;
