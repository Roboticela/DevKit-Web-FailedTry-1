import * as React from "react";
import { DateInput } from "./DateInput";
import { TimeInput, type TimeInputHourCycle } from "./TimeInput";

export type DateTimeInputSize = "xs" | "sm" | "md" | "lg" | "xl";

export type DateTimeInputValidation = "none" | "error" | "success" | "warning";

/**
 * Which temporal parts are active.
 * Default `datetime` = date + hours + minutes (no seconds / timezone until disclosed).
 */
export type DateTimeInputMode = "date" | "time" | "datetime";

export type DateTimeInputParts = {
  date: string | null;
  time: string | null;
};

/**
 * Canonical local value (no Z / offset unless timezone is disclosed separately):
 * - `datetime`: `YYYY-MM-DDTHH:mm` or `YYYY-MM-DDTHH:mm:ss`
 * - `date`: `YYYY-MM-DD`
 * - `time`: `HH:mm` or `HH:mm:ss`
 * `null` when the active parts are empty.
 */
export type DateTimeInputValue = string | null;

export interface DateTimeInputProps {
  label?: string;
  hideLabel?: boolean;
  description?: string;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  validation?: DateTimeInputValidation;
  size?: DateTimeInputSize;
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
  className?: string;
  id?: string;
  name?: string;
  /** BCP 47 locale for child formatters. */
  locale?: string;
  mode?: DateTimeInputMode;
  /** Progressive: include seconds on the time part. Default false. */
  withSeconds?: boolean;
  hourCycle?: TimeInputHourCycle;
  /** Time step in seconds. Default 60. */
  step?: number;
  value?: DateTimeInputValue;
  defaultValue?: DateTimeInputValue;
  onValueChange?: (value: DateTimeInputValue) => void;
  /** Fires whenever either part changes (including incomplete combinations). */
  onPartsChange?: (parts: DateTimeInputParts) => void;
  /**
   * Inclusive minimum as a canonical value matching `mode`
   * (e.g. `2026-01-01T08:00` or `2026-01-01` or `08:00`).
   */
  min?: string;
  max?: string;
  clearable?: boolean;
  clearLabel?: string;
  onClear?: () => void;
  /** Visible segment labels. */
  dateLabel?: string;
  timeLabel?: string;
  /**
   * Layout of date + time segments.
   * `responsive` (default): stack on compact, horizontal from tablet up.
   */
  orientation?: "responsive" | "horizontal" | "vertical";
  showCalendarTrigger?: boolean;
  showTimePickerTrigger?: boolean;
  datePickerOpen?: boolean;
  timePickerOpen?: boolean;
  onOpenDatePicker?: () => void;
  onOpenTimePicker?: () => void;
  datePickerSlot?: React.ReactNode;
  timePickerSlot?: React.ReactNode;
  /**
   * Progressive: show a timezone indicator. Default false.
   * Does not embed a timezone picker — use `timeZoneSlot` for advanced UI.
   */
  showTimeZone?: boolean;
  /** IANA timezone id for the indicator (e.g. `America/New_York`). */
  timeZone?: string;
  timeZoneLabel?: string;
  /** Advanced temporal configuration slot (timezone picker, offsets, etc.). */
  advancedSlot?: React.ReactNode;
  /** Whether advanced slot content is visible (controlled disclosure). */
  advancedOpen?: boolean;
  onAdvancedOpenChange?: (open: boolean) => void;
  advancedToggleLabel?: string;
}

const SIZE_CLASS: Record<DateTimeInputSize, string> = {
  xs: "dk-datetime--xs",
  sm: "dk-datetime--sm",
  md: "dk-datetime--md",
  lg: "dk-datetime--lg",
  xl: "dk-datetime--xl",
};

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
const DATETIME_RE =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{1,2}):(\d{2})(?::(\d{2}))?$/;

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

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function normalizeTime(raw: string, withSeconds: boolean): string | null {
  const match = TIME_RE.exec(raw.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  const s = match[3] !== undefined ? Number(match[3]) : 0;
  if (h > 23 || m > 59 || s > 59) return null;
  const base = `${pad2(h)}:${pad2(m)}`;
  return withSeconds ? `${base}:${pad2(s)}` : base;
}

function normalizeDate(raw: string): string | null {
  const match = DATE_RE.exec(raw.trim());
  return match ? raw.trim() : null;
}

export function parseDateTimeValue(
  value: string | null | undefined,
  mode: DateTimeInputMode,
  withSeconds: boolean
): DateTimeInputParts {
  if (!value) return { date: null, time: null };

  if (mode === "date") {
    return { date: normalizeDate(value), time: null };
  }
  if (mode === "time") {
    return { date: null, time: normalizeTime(value, withSeconds) };
  }

  const dt = DATETIME_RE.exec(value.trim());
  if (dt) {
    const date = `${dt[1]}-${dt[2]}-${dt[3]}`;
    const time = normalizeTime(
      `${dt[4]}:${dt[5]}${dt[6] !== undefined ? `:${dt[6]}` : ""}`,
      withSeconds
    );
    return { date, time };
  }

  if (DATE_RE.test(value.trim())) {
    return { date: normalizeDate(value), time: null };
  }
  if (TIME_RE.test(value.trim())) {
    return { date: null, time: normalizeTime(value, withSeconds) };
  }
  return { date: null, time: null };
}

export function combineDateTimeParts(
  parts: DateTimeInputParts,
  mode: DateTimeInputMode,
  withSeconds: boolean
): DateTimeInputValue {
  if (mode === "date") {
    return parts.date;
  }
  if (mode === "time") {
    return parts.time ? normalizeTime(parts.time, withSeconds) : null;
  }
  if (!parts.date && !parts.time) return null;
  if (parts.date && parts.time) {
    const time = normalizeTime(parts.time, withSeconds);
    return time ? `${parts.date}T${time}` : parts.date;
  }
  // Incomplete datetime — no combined canonical until both parts exist
  return null;
}

function toComparable(value: string, mode: DateTimeInputMode, withSeconds: boolean): number | null {
  const parts = parseDateTimeValue(value, mode, withSeconds);
  if (mode === "date") {
    if (!parts.date) return null;
    return Date.parse(`${parts.date}T00:00:00Z`);
  }
  if (mode === "time") {
    if (!parts.time) return null;
    const t = normalizeTime(parts.time, true);
    if (!t) return null;
    const [h, m, s] = t.split(":").map(Number);
    return h * 3600 + m * 60 + (s || 0);
  }
  if (!parts.date || !parts.time) return null;
  const t = normalizeTime(parts.time, true);
  if (!t) return null;
  return Date.parse(`${parts.date}T${t}Z`);
}

function formatTimeZoneLabel(timeZone: string, locale: string): string {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      timeZone,
      timeZoneName: "short",
    }).formatToParts(new Date());
    const name = parts.find((p) => p.type === "timeZoneName")?.value;
    return name ? `${timeZone} (${name})` : timeZone;
  } catch {
    return timeZone;
  }
}

/**
 * Date & Time Input (ID 019) — coherent date + time composition.
 *
 * Default: date + hours + minutes. Seconds and timezone are progressive.
 * Composes Date Input and Time Input inside one shared shell.
 */
export const DateTimeInput = React.forwardRef<HTMLDivElement, DateTimeInputProps>(
  function DateTimeInput(
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
      className,
      id: idProp,
      name,
      locale: localeProp,
      mode = "datetime",
      withSeconds = false,
      hourCycle = "auto",
      step = 60,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      onPartsChange,
      min,
      max,
      clearable = false,
      clearLabel = "Clear date and time",
      onClear,
      dateLabel = "Date",
      timeLabel = "Time",
      orientation = "responsive",
      showCalendarTrigger = true,
      showTimePickerTrigger = true,
      datePickerOpen,
      timePickerOpen,
      onOpenDatePicker,
      onOpenTimePicker,
      datePickerSlot,
      timePickerSlot,
      showTimeZone = false,
      timeZone,
      timeZoneLabel,
      advancedSlot,
      advancedOpen: advancedOpenProp,
      onAdvancedOpenChange,
      advancedToggleLabel = "More options",
    },
    ref
  ) {
    const locale =
      localeProp ??
      (typeof navigator !== "undefined" ? navigator.language : "en-US");

    const reactId = React.useId();
    const rootId = idProp ?? `dk-datetime-${reactId}`;
    const descId = `${rootId}-desc`;
    const helpId = `${rootId}-help`;
    const errorId = `${rootId}-error`;
    const successId = `${rootId}-success`;
    const warningId = `${rootId}-warning`;
    const dateId = `${rootId}-date`;
    const timeId = `${rootId}-time`;

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState<DateTimeInputValue>(defaultValue);
    const committed = isControlled ? valueProp! : uncontrolled;

    const [parts, setParts] = React.useState<DateTimeInputParts>(() =>
      parseDateTimeValue(committed, mode, withSeconds)
    );
    const [localInvalid, setLocalInvalid] = React.useState(false);
    const [advancedUncontrolled, setAdvancedUncontrolled] = React.useState(false);
    const advancedOpen = advancedOpenProp ?? advancedUncontrolled;

    React.useEffect(() => {
      setParts(parseDateTimeValue(committed, mode, withSeconds));
      setLocalInvalid(false);
    }, [committed, mode, withSeconds]);

    const showDate = mode === "date" || mode === "datetime";
    const showTime = mode === "time" || mode === "datetime";

    const minParts = min ? parseDateTimeValue(min, mode, withSeconds) : null;
    const maxParts = max ? parseDateTimeValue(max, mode, withSeconds) : null;

    const emit = (nextParts: DateTimeInputParts) => {
      setParts(nextParts);
      onPartsChange?.(nextParts);

      const incomplete =
        mode === "datetime" &&
        ((nextParts.date && !nextParts.time) || (!nextParts.date && nextParts.time));

      if (incomplete) {
        // Keep parts, withhold combined value until both sides exist
        setLocalInvalid(false);
        return;
      }

      const combined = combineDateTimeParts(nextParts, mode, withSeconds);

      if (combined && min) {
        const a = toComparable(combined, mode, withSeconds);
        const b = toComparable(min, mode, withSeconds);
        if (a !== null && b !== null && a < b) {
          setLocalInvalid(true);
          return;
        }
      }
      if (combined && max) {
        const a = toComparable(combined, mode, withSeconds);
        const b = toComparable(max, mode, withSeconds);
        if (a !== null && b !== null && a > b) {
          setLocalInvalid(true);
          return;
        }
      }

      setLocalInvalid(false);
      if (!isControlled) setUncontrolled(combined);
      onValueChange?.(combined);
    };

    const handleDateChange = (date: string | null) => {
      emit({ ...parts, date });
    };

    const handleTimeChange = (time: string | null) => {
      emit({ ...parts, time });
    };

    const setAdvanced = (open: boolean) => {
      if (advancedOpenProp === undefined) setAdvancedUncontrolled(open);
      onAdvancedOpenChange?.(open);
    };

    const filled =
      (showDate && parts.date !== null) || (showTime && parts.time !== null);

    const incomplete =
      mode === "datetime" &&
      ((parts.date && !parts.time) || (!parts.date && parts.time));

    const incompleteMessage =
      incomplete && !errorMessage
        ? parts.date && !parts.time
          ? "Enter a time as well as a date"
          : "Enter a date as well as a time"
        : undefined;

    const resolvedValidation: DateTimeInputValidation =
      validation !== "none"
        ? validation
        : errorMessage
          ? "error"
          : localInvalid
            ? "error"
            : incomplete && required
              ? "error"
              : successMessage
                ? "success"
                : warningMessage
                  ? "warning"
                  : "none";

    const invalidMessage =
      errorMessage ||
      (localInvalid ? "Enter a valid date and time" : undefined) ||
      (incomplete && required ? incompleteMessage : undefined);

    const messageConfigured = Boolean(
      helpText ||
        errorMessage ||
        successMessage ||
        warningMessage ||
        localInvalid ||
        incompleteMessage
    );
    const reserveFooter = stableMessages ?? messageConfigured;

    const describedBy = [
      description ? descId : null,
      resolvedValidation === "error" && invalidMessage ? errorId : null,
      resolvedValidation === "success" && successMessage ? successId : null,
      resolvedValidation === "warning" && warningMessage ? warningId : null,
      resolvedValidation === "none" && (helpText || incompleteMessage) ? helpId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const resolvedTzLabel =
      timeZoneLabel ||
      (timeZone ? formatTimeZoneLabel(timeZone, locale) : undefined);

    const orientationClass =
      orientation === "horizontal"
        ? "dk-datetime__fields--horizontal"
        : orientation === "vertical"
          ? "dk-datetime__fields--vertical"
          : "dk-datetime__fields--responsive";

    const showMeta = Boolean(showTimeZone || advancedSlot);

    return (
      <div
        ref={ref}
        className={cx(
          "dk-field",
          "dk-datetime",
          SIZE_CLASS[size],
          fullWidth && "dk-field--full",
          disabled && "dk-field--disabled",
          readOnly && "dk-field--readonly",
          loading && "dk-datetime--loading",
          filled && "dk-datetime--filled",
          !filled && "dk-datetime--empty",
          resolvedValidation !== "none" && `dk-field--${resolvedValidation}`,
          reserveFooter && "dk-field--stable-messages",
          className
        )}
        data-size={size}
        data-mode={mode}
        data-orientation={orientation}
        data-with-seconds={withSeconds || undefined}
        data-show-timezone={showTimeZone || undefined}
        data-validation={resolvedValidation}
        data-empty={!filled ? true : undefined}
        data-loading={loading || undefined}
        data-incomplete={incomplete || undefined}
        role="group"
        aria-labelledby={label && !hideLabel ? `${rootId}-label` : undefined}
        aria-describedby={describedBy || undefined}
        aria-disabled={disabled || undefined}
        aria-busy={loading || undefined}
      >
        {label ? (
          <div className={cx("dk-field__label-row", hideLabel && "dk-field__label-row--sr")}>
            <span className="dk-field__label" id={`${rootId}-label`}>
              {label}
            </span>
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

        {mode === "datetime" ? (
          <p className="dk-datetime__hint" id={`${rootId}-parts-hint`}>
            Date and time
          </p>
        ) : null}

        <div className="dk-datetime__shell">
          <div className={cx("dk-datetime__fields", orientationClass)}>
            {showDate ? (
              <div className="dk-datetime__segment dk-datetime__segment--date">
                <DateInput
                  id={dateId}
                  name={name ? `${name}-date` : undefined}
                  label={dateLabel}
                  hideLabel={mode !== "datetime" && Boolean(label)}
                  locale={locale}
                  size={size}
                  value={parts.date}
                  onValueChange={handleDateChange}
                  min={minParts?.date ?? undefined}
                  max={maxParts?.date ?? undefined}
                  required={required && mode === "datetime"}
                  disabled={disabled}
                  readOnly={readOnly}
                  loading={loading}
                  loadingLabel={loadingLabel}
                  clearable={clearable}
                  clearLabel={mode === "datetime" ? "Clear date" : clearLabel}
                  onClear={mode !== "datetime" ? onClear : undefined}
                  showCalendarTrigger={showCalendarTrigger}
                  pickerOpen={datePickerOpen}
                  onOpenPicker={onOpenDatePicker}
                  pickerSlot={datePickerSlot}
                  fullWidth
                  validation="none"
                  stableMessages={false}
                  aria-describedby={
                    [describedBy, mode === "datetime" ? `${rootId}-parts-hint` : null]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                />
              </div>
            ) : null}

            {showDate && showTime ? (
              <div className="dk-datetime__join" aria-hidden="true">
                <span className="dk-datetime__join-rule" />
              </div>
            ) : null}

            {showTime ? (
              <div className="dk-datetime__segment dk-datetime__segment--time">
                <TimeInput
                  id={timeId}
                  name={name ? `${name}-time` : undefined}
                  label={timeLabel}
                  hideLabel={mode !== "datetime" && Boolean(label)}
                  locale={locale}
                  size={size}
                  hourCycle={hourCycle}
                  withSeconds={withSeconds}
                  step={step}
                  value={parts.time}
                  onValueChange={handleTimeChange}
                  min={mode === "time" ? minParts?.time ?? undefined : undefined}
                  max={mode === "time" ? maxParts?.time ?? undefined : undefined}
                  required={required && mode === "datetime"}
                  disabled={disabled}
                  readOnly={readOnly}
                  loading={loading}
                  loadingLabel={loadingLabel}
                  clearable={clearable}
                  clearLabel={mode === "datetime" ? "Clear time" : clearLabel}
                  onClear={mode !== "datetime" ? onClear : undefined}
                  showPickerTrigger={showTimePickerTrigger}
                  pickerOpen={timePickerOpen}
                  onOpenPicker={onOpenTimePicker}
                  pickerSlot={timePickerSlot}
                  fullWidth
                  validation="none"
                  stableMessages={false}
                  aria-describedby={
                    [describedBy, mode === "datetime" ? `${rootId}-parts-hint` : null]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                />
              </div>
            ) : null}
          </div>

          {showMeta ? (
            <div className="dk-datetime__meta">
              {showTimeZone && resolvedTzLabel ? (
                <span className="dk-datetime__timezone" title={timeZone}>
                  {resolvedTzLabel}
                </span>
              ) : null}

              {advancedSlot ? (
                <button
                  type="button"
                  className="dk-datetime__advanced-toggle"
                  aria-expanded={advancedOpen}
                  disabled={disabled || readOnly || loading}
                  onClick={() => setAdvanced(!advancedOpen)}
                >
                  {advancedToggleLabel}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        {advancedSlot && advancedOpen ? (
          <div className="dk-datetime__advanced">{advancedSlot}</div>
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
            {resolvedValidation === "none" && (helpText || incompleteMessage) ? (
              <p id={helpId} className="dk-field__message dk-field__message--help">
                {incompleteMessage || helpText}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

DateTimeInput.displayName = "DateTimeInput";

export default DateTimeInput;
