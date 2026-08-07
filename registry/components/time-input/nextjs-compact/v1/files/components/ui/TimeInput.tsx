import * as React from "react";
import { TimeWheelPicker } from "./TimeWheelPicker";

export type TimeInputSize = "xs" | "sm" | "md" | "lg" | "xl";

export type TimeInputValidation = "none" | "error" | "success" | "warning";

/**
 * Hour cycle for display. `auto` follows the locale — never assumes AM/PM.
 */
export type TimeInputHourCycle = "auto" | "h12" | "h23";

/**
 * Timezone-independent wall-clock time as `HH:mm` or `HH:mm:ss` (24-hour),
 * or `null` when empty.
 */
export type TimeInputValue = string | null;

export interface TimeInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
  > {
  label?: string;
  hideLabel?: boolean;
  description?: string;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  validation?: TimeInputValidation;
  size?: TimeInputSize;
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
  /** BCP 47 locale for format / parse. Default: runtime locale. */
  locale?: string;
  /**
   * Display hour cycle. Default `auto` (locale-driven).
   * Use `h12` / `h23` to override application preference.
   */
  hourCycle?: TimeInputHourCycle;
  /** Include seconds in value and display. Default: hours + minutes only. */
  withSeconds?: boolean;
  /**
   * Committed time `HH:mm` or `HH:mm:ss`, or `null` when empty.
   * Independent of display formatting.
   */
  value?: TimeInputValue;
  defaultValue?: TimeInputValue;
  onValueChange?: (value: TimeInputValue) => void;
  /** Raw text currently shown (while typing). Not reformatted while focused. */
  onRawChange?: (raw: string) => void;
  /** Inclusive minimum as `HH:mm` or `HH:mm:ss`. */
  min?: string;
  /** Inclusive maximum as `HH:mm` or `HH:mm:ss`. */
  max?: string;
  /**
   * Step in seconds (HTML time semantics). Default 60 (one minute).
   * ArrowUp / ArrowDown adjust by this amount when a value is committed.
   */
  step?: number;
  clearable?: boolean;
  clearLabel?: string;
  onClear?: () => void;
  /**
   * Show clock trigger. Opens the built-in mobile wheel picker unless
   * `pickerSlot` overrides it.
   */
  showPickerTrigger?: boolean;
  pickerLabel?: string;
  /** Controlled open state for the picker. Omit for internal open state. */
  pickerOpen?: boolean;
  /** Called when the clock trigger is activated (toggle). */
  onOpenPicker?: () => void;
  /** Optional slot after the field — replaces the built-in wheel picker when set. */
  pickerSlot?: React.ReactNode;
}

const SIZE_CLASS: Record<TimeInputSize, string> = {
  xs: "dk-time--xs",
  sm: "dk-time--sm",
  md: "dk-time--md",
  lg: "dk-time--lg",
  xl: "dk-time--xl",
};

const TIME_RE = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

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

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="6.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6.5V10l2.5 1.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
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

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function toCanonical(
  hours: number,
  minutes: number,
  seconds: number,
  withSeconds: boolean
): string {
  const base = `${pad2(hours)}:${pad2(minutes)}`;
  return withSeconds ? `${base}:${pad2(seconds)}` : base;
}

function parseCanonical(value: string): { h: number; m: number; s: number } | null {
  const match = TIME_RE.exec(value.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  const s = match[3] !== undefined ? Number(match[3]) : 0;
  if (h > 23 || m > 59 || s > 59) return null;
  return { h, m, s };
}

function isValidTimeValue(value: string): boolean {
  return parseCanonical(value) !== null;
}

function toSeconds(value: string): number | null {
  const parts = parseCanonical(value);
  if (!parts) return null;
  return parts.h * 3600 + parts.m * 60 + parts.s;
}

function fromSeconds(total: number, withSeconds: boolean): string {
  const day = ((total % 86400) + 86400) % 86400;
  const h = Math.floor(day / 3600);
  const m = Math.floor((day % 3600) / 60);
  const s = day % 60;
  return toCanonical(h, m, s, withSeconds);
}

function resolveHourCycle(locale: string, hourCycle: TimeInputHourCycle): "h12" | "h23" {
  if (hourCycle === "h12" || hourCycle === "h23") return hourCycle;
  try {
    const cycle = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions()
      .hourCycle;
    if (cycle === "h11" || cycle === "h12") return "h12";
    return "h23";
  } catch {
    return "h23";
  }
}

function formatTime(
  locale: string,
  value: string | null,
  withSeconds: boolean,
  hourCycle: TimeInputHourCycle
): string {
  if (!value) return "";
  const parts = parseCanonical(value);
  if (!parts) return value;
  const date = new Date(Date.UTC(1970, 0, 1, parts.h, parts.m, parts.s));
  const cycle = resolveHourCycle(locale, hourCycle);
  try {
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
      ...(withSeconds ? { second: "2-digit" as const } : {}),
      hourCycle: cycle,
      timeZone: "UTC",
    }).format(date);
  } catch {
    return toCanonical(parts.h, parts.m, parts.s, withSeconds);
  }
}

function placeholderForLocale(
  locale: string,
  withSeconds: boolean,
  hourCycle: TimeInputHourCycle
): string {
  const sample = withSeconds ? "14:30:00" : "14:30";
  return formatTime(locale, sample, withSeconds, hourCycle);
}

function detectPeriod(raw: string): "am" | "pm" | null {
  const lower = raw.toLowerCase();
  if (
    /\b(a\.?\s*m\.?|am|午前)\b/i.test(lower) ||
    lower.includes("上午") ||
    /\ba\.?m\.?\s*$/i.test(lower)
  ) {
    return "am";
  }
  if (
    /\b(p\.?\s*m\.?|pm|午後)\b/i.test(lower) ||
    lower.includes("下午") ||
    /\bp\.?m\.?\s*$/i.test(lower)
  ) {
    return "pm";
  }
  return null;
}

/**
 * Best-effort parse into canonical 24h time.
 * Never assumes AM/PM — only applies period when explicitly present.
 */
function parseToTime(
  raw: string,
  withSeconds: boolean
): string | null | "invalid" {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (TIME_RE.test(trimmed)) {
    const parts = parseCanonical(trimmed);
    if (!parts) return "invalid";
    return toCanonical(parts.h, parts.m, withSeconds ? parts.s : 0, withSeconds);
  }

  const period = detectPeriod(trimmed);
  const digits = trimmed.match(/\d+/g);
  if (!digits || digits.length < 2) return "invalid";

  let h = Number(digits[0]);
  const m = Number(digits[1]);
  const s = withSeconds ? Number(digits[2] ?? 0) : 0;

  if (Number.isNaN(h) || Number.isNaN(m) || Number.isNaN(s) || m > 59 || s > 59) {
    return "invalid";
  }

  if (period) {
    if (h < 1 || h > 12) return "invalid";
    if (period === "am") {
      h = h === 12 ? 0 : h;
    } else {
      h = h === 12 ? 12 : h + 12;
    }
  }

  if (h > 23) return "invalid";
  return toCanonical(h, m, s, withSeconds);
}

function snapToStep(value: string, step: number, withSeconds: boolean): string {
  if (!step || step <= 0) return value;
  const secs = toSeconds(value);
  if (secs === null) return value;
  const snapped = Math.round(secs / step) * step;
  return fromSeconds(snapped, withSeconds);
}

function withinRange(value: string, min?: string, max?: string): boolean {
  const secs = toSeconds(value);
  if (secs === null) return false;
  if (min) {
    const minSecs = toSeconds(min);
    if (minSecs !== null && secs < minSecs) return false;
  }
  if (max) {
    const maxSecs = toSeconds(max);
    if (maxSecs !== null && secs > maxSecs) return false;
  }
  return true;
}

/**
 * Time Input (ID 018) — locale-aware time field.
 *
 * Committed value is timezone-independent `HH:mm` / `HH:mm:ss`.
 * Manual entry is first-class; clock trigger opens a mobile wheel picker.
 */
export const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  function TimeInput(
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
      hourCycle = "auto",
      withSeconds = false,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      onRawChange,
      min,
      max,
      step = 60,
      clearable = false,
      clearLabel = "Clear time",
      onClear,
      showPickerTrigger = true,
      pickerLabel = "Open time picker",
      pickerOpen: pickerOpenProp,
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
    const inputId = idProp ?? `dk-time-${reactId}`;
    const descId = `${inputId}-desc`;
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;
    const warningId = `${inputId}-warning`;

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState<TimeInputValue>(defaultValue);
    const committed = isControlled ? valueProp! : uncontrolled;

    const [raw, setRaw] = React.useState(() =>
      formatTime(locale, committed, withSeconds, hourCycle)
    );
    const [focused, setFocused] = React.useState(false);
    const [localInvalid, setLocalInvalid] = React.useState(false);

    React.useEffect(() => {
      if (!focused) {
        setRaw(formatTime(locale, committed, withSeconds, hourCycle));
        setLocalInvalid(false);
      }
    }, [committed, focused, locale, withSeconds, hourCycle]);

    const resolvedValidation: TimeInputValidation =
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
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const isPickerControlled = pickerOpenProp !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(false);
    const pickerOpen = isPickerControlled ? Boolean(pickerOpenProp) : internalOpen;

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const setPickerOpen = React.useCallback(
      (next: boolean) => {
        if (!isPickerControlled) setInternalOpen(next);
      },
      [isPickerControlled]
    );

    const togglePicker = React.useCallback(() => {
      onOpenPicker?.();
      if (!isPickerControlled) setInternalOpen((open) => !open);
    }, [isPickerControlled, onOpenPicker]);

    React.useEffect(() => {
      if (!pickerOpen) return;
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target as Node | null;
        if (rootRef.current && target && !rootRef.current.contains(target)) {
          setPickerOpen(false);
        }
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") setPickerOpen(false);
      };
      document.addEventListener("pointerdown", onPointerDown);
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("pointerdown", onPointerDown);
        document.removeEventListener("keydown", onKeyDown);
      };
    }, [pickerOpen, setPickerOpen]);

    const commit = (next: TimeInputValue, options?: { snap?: boolean }) => {
      if (next) {
        if (!isValidTimeValue(next)) {
          setLocalInvalid(true);
          return;
        }
        let normalized = next;
        const parts = parseCanonical(next);
        if (parts) {
          normalized = toCanonical(parts.h, parts.m, withSeconds ? parts.s : 0, withSeconds);
        }
        if (options?.snap && step > 0) {
          normalized = snapToStep(normalized, step, withSeconds);
        }
        if (!withinRange(normalized, min, max)) {
          setLocalInvalid(true);
          return;
        }
        setLocalInvalid(false);
        if (!isControlled) setUncontrolled(normalized);
        onValueChange?.(normalized);
        return;
      }
      setLocalInvalid(false);
      if (!isControlled) setUncontrolled(null);
      onValueChange?.(null);
    };

    const filled = committed !== null || raw.trim().length > 0;
    const showClear =
      clearable &&
      !disabled &&
      !readOnly &&
      !loading &&
      (committed !== null || raw.trim().length > 0);

    const resolvedPlaceholder =
      placeholder ?? placeholderForLocale(locale, withSeconds, hourCycle);

    const handleClear = () => {
      setRaw("");
      onRawChange?.("");
      commit(null);
      onClear?.();
      inputRef.current?.focus();
    };

    const adjustByStep = (direction: 1 | -1) => {
      const base = committed ?? fromSeconds(0, withSeconds);
      const secs = toSeconds(base);
      if (secs === null) return;
      const next = fromSeconds(secs + direction * step, withSeconds);
      if (!withinRange(next, min, max)) {
        setLocalInvalid(true);
        return;
      }
      commit(next);
      setRaw(formatTime(locale, next, withSeconds, hourCycle));
    };

    const openPicker = () => {
      togglePicker();
    };

    const invalidMessage =
      errorMessage || (localInvalid ? "Enter a valid time" : undefined);

    const showBuiltInPicker = pickerOpen && !pickerSlot;

    return (
      <div
        ref={rootRef}
        className={cx(
          "dk-field",
          "dk-time",
          SIZE_CLASS[size],
          fullWidth && "dk-field--full",
          disabled && "dk-field--disabled",
          readOnly && "dk-field--readonly",
          loading && "dk-time--loading",
          filled && "dk-time--filled",
          committed === null && !raw.trim() && "dk-time--empty",
          resolvedValidation !== "none" && `dk-field--${resolvedValidation}`,
          reserveFooter && "dk-field--stable-messages",
          className
        )}
        data-size={size}
        data-locale={locale}
        data-hour-cycle={resolveHourCycle(locale, hourCycle)}
        data-with-seconds={withSeconds || undefined}
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

        <div className="dk-field__control dk-time__control">
          <span className="dk-field__hit" aria-hidden="true" />

          <input
            {...rest}
            ref={setRefs}
            id={inputId}
            name={name}
            className="dk-field__input dk-time__input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
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
            aria-haspopup={showPickerTrigger ? "dialog" : undefined}
            data-empty={committed === null && !raw.trim() ? true : undefined}
            onChange={(event) => {
              const next = event.target.value;
              setRaw(next);
              setLocalInvalid(false);
              onRawChange?.(next);

              if (TIME_RE.test(next.trim()) && parseCanonical(next.trim())) {
                const parts = parseCanonical(next.trim())!;
                commit(toCanonical(parts.h, parts.m, withSeconds ? parts.s : 0, withSeconds));
              } else if (!next.trim()) {
                commit(null);
              }
            }}
            onFocus={(event) => {
              setFocused(true);
              if (committed && !raw) {
                setRaw(formatTime(locale, committed, withSeconds, hourCycle));
              }
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              const parsed = parseToTime(raw, withSeconds);
              if (parsed === null) {
                commit(null);
                setRaw("");
              } else if (parsed === "invalid") {
                setLocalInvalid(true);
              } else if (!withinRange(parsed, min, max)) {
                setLocalInvalid(true);
              } else {
                const snapped = step > 0 ? snapToStep(parsed, step, withSeconds) : parsed;
                if (!withinRange(snapped, min, max)) {
                  setLocalInvalid(true);
                } else {
                  commit(snapped);
                  setRaw(formatTime(locale, snapped, withSeconds, hourCycle));
                }
              }
              onBlur?.(event);
            }}
            onKeyDown={(event) => {
              onKeyDown?.(event);
              if (event.defaultPrevented || disabled || readOnly || loading) return;

              if (event.key === "ArrowUp") {
                event.preventDefault();
                adjustByStep(1);
                return;
              }
              if (event.key === "ArrowDown" && !event.altKey) {
                event.preventDefault();
                adjustByStep(-1);
                return;
              }
              if (
                (event.key === "F4" || (event.key === "ArrowDown" && event.altKey)) &&
                showPickerTrigger
              ) {
                event.preventDefault();
                openPicker();
              }
            }}
          />

          {loading ? (
            <span className="dk-time__loading" role="status" aria-label={loadingLabel}>
              <span className="dk-time__spinner" aria-hidden="true" />
            </span>
          ) : null}

          {showClear ? (
            <button
              type="button"
              className="dk-time__clear"
              aria-label={clearLabel}
              onClick={handleClear}
            >
              <span className="dk-time__clear-hit" aria-hidden="true" />
              <ClearIcon />
            </button>
          ) : null}

          {showPickerTrigger && !loading ? (
            <button
              type="button"
              className="dk-time__picker"
              aria-label={pickerLabel}
              aria-expanded={pickerOpen}
              aria-haspopup="dialog"
              disabled={disabled || readOnly}
              onClick={() => openPicker()}
            >
              <span className="dk-time__picker-hit" aria-hidden="true" />
              <ClockIcon />
            </button>
          ) : null}
        </div>

        {pickerSlot ? <div className="dk-time__picker-slot">{pickerSlot}</div> : null}
        {showBuiltInPicker ? (
          <div className="dk-time__picker-slot">
            <TimeWheelPicker
              value={committed}
              locale={locale}
              hourCycle={hourCycle}
              withSeconds={withSeconds}
              min={min}
              max={max}
              step={step}
              onChange={(next) => {
                commit(next, { snap: true });
                setRaw(formatTime(locale, next, withSeconds, hourCycle));
                onRawChange?.(formatTime(locale, next, withSeconds, hourCycle));
                setLocalInvalid(false);
              }}
              onDone={() => setPickerOpen(false)}
            />
          </div>
        ) : null}

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

TimeInput.displayName = "TimeInput";

export default TimeInput;
