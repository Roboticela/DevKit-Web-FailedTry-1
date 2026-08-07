import * as React from "react";

export type SliderSize = "sm" | "md" | "lg";

export type SliderValidation = "none" | "error" | "success" | "warning";

/**
 * `single` — one thumb (default).
 * `range` — reserved for future dual-thumb composition; not fully interactive yet.
 */
export type SliderMode = "single" | "range";

export interface SliderProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  label: string;
  hideLabel?: boolean;
  description?: string;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  validation?: SliderValidation;
  size?: SliderSize;
  required?: boolean;
  optional?: boolean;
  requiredIndicator?: React.ReactNode;
  optionalLabel?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  stableMessages?: boolean;
  name?: string;

  min?: number;
  max?: number;
  /** Step increment. Supports integers and decimals. */
  step?: number;
  /** Controlled single value. */
  value?: number;
  defaultValue?: number;
  /**
   * Fires continuously while dragging / stepping.
   * Debounce expensive side effects at a higher layer.
   */
  onValueChange?: (value: number) => void;
  /** Fires when the user commits (pointer up / blur of input). */
  onValueCommit?: (value: number) => void;

  /** Unit shown with the value (e.g. `%`, `px`, `kg`). */
  unit?: string;
  /** Show the current value beside the label. Default true. */
  showValue?: boolean;
  /** Format the displayed / announced value. */
  formatValue?: (value: number, unit?: string) => string;
  /** Optional numeric input for precise adjustment. */
  showInput?: boolean;
  inputLabel?: string;
  /** Larger keyboard jump as a multiple of `step`. Default 10. */
  pageSteps?: number;

  mode?: SliderMode;
  /**
   * Reserved for future range composition (`mode="range"`).
   * Ignored for single-value mode.
   */
  valueEnd?: number;
  defaultValueEnd?: number;
  onValueEndChange?: (value: number) => void;
}

const SIZE_CLASS: Record<SliderSize, string> = {
  sm: "dk-slider--sm",
  md: "dk-slider--md",
  lg: "dk-slider--lg",
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

function decimalsOf(step: number) {
  const s = String(step);
  if (!s.includes(".")) return 0;
  return s.split(".")[1]?.replace(/0+$/, "").length ?? 0;
}

function roundToStep(value: number, min: number, step: number) {
  const decimals = decimalsOf(step);
  const raw = Math.round((value - min) / step) * step + min;
  const factor = 10 ** decimals;
  return Math.round(raw * factor) / factor;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function defaultFormat(value: number, unit?: string) {
  const decimals = Number.isInteger(value) ? 0 : decimalsOf(value) || 2;
  const text = value.toLocaleString(undefined, {
    maximumFractionDigits: Math.max(decimals, 0),
    minimumFractionDigits: 0,
  });
  return unit ? `${text}${unit.length === 1 || unit.startsWith("%") || unit.startsWith("°") ? "" : " "}${unit}` : text;
}

/**
 * Slider (ID 030) — numeric value from a continuous or stepped range.
 *
 * Default is a single thumb. Not for categorical choices (use Select / Radio / Choice Chips).
 * Optional numeric input for precise values. Continuous `onValueChange`; commit via `onValueCommit`.
 */
export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  function Slider(
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
      disabled = false,
      fullWidth = true,
      stableMessages,
      name,
      min = 0,
      max = 100,
      step = 1,
      value: valueProp,
      defaultValue,
      onValueChange,
      onValueCommit,
      unit,
      showValue = true,
      formatValue = defaultFormat,
      showInput = false,
      inputLabel = "Exact value",
      pageSteps = 10,
      mode = "single",
      valueEnd: _valueEnd,
      defaultValueEnd: _defaultValueEnd,
      onValueEndChange: _onValueEndChange,
      id: idProp,
      className,
      ...rest
    },
    ref
  ) {
    void mode;
    void _valueEnd;
    void _defaultValueEnd;
    void _onValueEndChange;

    const reactId = React.useId();
    const rootId = idProp ?? `dk-slider-${reactId}`;
    const labelId = `${rootId}-label`;
    const descId = `${rootId}-desc`;
    const helpId = `${rootId}-help`;
    const errorId = `${rootId}-error`;
    const successId = `${rootId}-success`;
    const warningId = `${rootId}-warning`;
    const valueId = `${rootId}-value`;
    const inputId = `${rootId}-input`;
    const minId = `${rootId}-min`;
    const maxId = `${rootId}-max`;

    const safeMin = Math.min(min, max);
    const safeMax = Math.max(min, max);
    const safeStep = step > 0 ? step : 1;
    const fallback =
      defaultValue ?? clamp(roundToStep((safeMin + safeMax) / 2, safeMin, safeStep), safeMin, safeMax);

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(fallback);
    const value = clamp(
      roundToStep(isControlled ? valueProp! : uncontrolled, safeMin, safeStep),
      safeMin,
      safeMax
    );

    const [dragging, setDragging] = React.useState(false);
    const [inputText, setInputText] = React.useState(() => String(value));

    const trackRef = React.useRef<HTMLDivElement | null>(null);
    const thumbRef = React.useRef<HTMLDivElement | null>(null);
    const valueRef = React.useRef(value);
    valueRef.current = value;

    const validationState: SliderValidation =
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
      showValue ? valueId : null,
      validationState === "error" && errorMessage ? errorId : null,
      validationState === "success" && successMessage ? successId : null,
      validationState === "warning" && warningMessage ? warningId : null,
      validationState === "none" && helpText ? helpId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const percent =
      safeMax === safeMin ? 0 : ((value - safeMin) / (safeMax - safeMin)) * 100;

    const commit = React.useCallback(
      (next: number, opts?: { commit?: boolean }) => {
        const clamped = clamp(roundToStep(next, safeMin, safeStep), safeMin, safeMax);
        if (!isControlled) setUncontrolled(clamped);
        onValueChange?.(clamped);
        if (opts?.commit) onValueCommit?.(clamped);
        setInputText(String(clamped));
        return clamped;
      },
      [isControlled, onValueChange, onValueCommit, safeMin, safeMax, safeStep]
    );

    React.useEffect(() => {
      if (!dragging) setInputText(String(value));
    }, [value, dragging]);

    const valueFromClientX = React.useCallback(
      (clientX: number) => {
        const track = trackRef.current;
        if (!track) return valueRef.current;
        const rect = track.getBoundingClientRect();
        if (rect.width <= 0) return valueRef.current;
        const rtl =
          getComputedStyle(track).direction === "rtl" ||
          track.closest("[dir='rtl']") != null;
        let ratio = (clientX - rect.left) / rect.width;
        if (rtl) ratio = 1 - ratio;
        ratio = clamp(ratio, 0, 1);
        return safeMin + ratio * (safeMax - safeMin);
      },
      [safeMin, safeMax]
    );

    const onPointerDown = (event: React.PointerEvent) => {
      if (disabled) return;
      event.preventDefault();
      const target = event.currentTarget as HTMLElement;
      target.setPointerCapture(event.pointerId);
      setDragging(true);
      commit(valueFromClientX(event.clientX));
      thumbRef.current?.focus();
    };

    const onPointerMove = (event: React.PointerEvent) => {
      if (disabled || !dragging) return;
      if (!(event.currentTarget as HTMLElement).hasPointerCapture(event.pointerId)) {
        return;
      }
      commit(valueFromClientX(event.clientX));
    };

    const endDrag = (event: React.PointerEvent) => {
      if (!dragging) return;
      try {
        (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
      setDragging(false);
      onValueCommit?.(valueRef.current);
    };

    const onThumbKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;
      const page = safeStep * Math.max(1, pageSteps);
      const rtl =
        trackRef.current != null &&
        (getComputedStyle(trackRef.current).direction === "rtl" ||
          trackRef.current.closest("[dir='rtl']") != null);
      const forward = rtl ? -1 : 1;
      let next: number | null = null;

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          next = value + safeStep * forward;
          break;
        case "ArrowLeft":
          event.preventDefault();
          next = value - safeStep * forward;
          break;
        case "ArrowUp":
          event.preventDefault();
          next = value + safeStep;
          break;
        case "ArrowDown":
          event.preventDefault();
          next = value - safeStep;
          break;
        case "PageUp":
          event.preventDefault();
          next = value + page;
          break;
        case "PageDown":
          event.preventDefault();
          next = value - page;
          break;
        case "Home":
          event.preventDefault();
          next = safeMin;
          break;
        case "End":
          event.preventDefault();
          next = safeMax;
          break;
        default:
          break;
      }

      if (next != null) {
        commit(next, { commit: true });
      }
    };

    const applyInput = (raw: string, commitChange: boolean) => {
      const parsed = Number(raw.replace(",", "."));
      if (Number.isFinite(parsed)) {
        commit(parsed, { commit: commitChange });
      } else {
        setInputText(String(value));
      }
    };

    const display = formatValue(value, unit);
    const minLabel = formatValue(safeMin, unit);
    const maxLabel = formatValue(safeMax, unit);

    return (
      <div
        {...rest}
        ref={ref}
        id={rootId}
        className={cx(
          "dk-field",
          "dk-slider",
          SIZE_CLASS[size],
          fullWidth && "dk-field--full",
          disabled && "dk-slider--disabled",
          dragging && "dk-slider--dragging",
          showInput && "dk-slider--with-input",
          validationState !== "none" && `dk-field--${validationState}`,
          reserveFooter && "dk-field--stable-messages",
          className
        )}
        data-size={size}
        data-mode="single"
        data-validation={validationState}
        data-disabled={disabled || undefined}
        data-dragging={dragging || undefined}
      >
        <div className={cx("dk-field__label-row", hideLabel && "dk-field__label-row--sr")}>
          <label className="dk-field__label" id={labelId} htmlFor={showInput ? inputId : undefined}>
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
          {showValue ? (
            <span id={valueId} className="dk-slider__value" aria-live="polite">
              {display}
            </span>
          ) : null}
        </div>

        {description ? (
          <p id={descId} className="dk-field__description">
            {description}
          </p>
        ) : null}

        <div className="dk-slider__body">
          <div
            className="dk-slider__rail"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <span className="dk-slider__hit" aria-hidden="true" />

            <div ref={trackRef} className="dk-slider__track">
              <div
                className="dk-slider__fill"
                style={{ inlineSize: `${percent}%` }}
              />
              <div
                ref={thumbRef}
                className="dk-slider__thumb"
                style={{ insetInlineStart: `${percent}%` }}
                role="slider"
                tabIndex={disabled ? -1 : 0}
                aria-valuemin={safeMin}
                aria-valuemax={safeMax}
                aria-valuenow={value}
                aria-valuetext={display}
                aria-labelledby={labelId}
                aria-describedby={describedBy || undefined}
                aria-disabled={disabled || undefined}
                aria-invalid={validationState === "error" || undefined}
                aria-required={required || undefined}
                aria-orientation="horizontal"
                onKeyDown={onThumbKeyDown}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  onPointerDown(event);
                }}
              >
                <span className="dk-slider__thumb-visual" aria-hidden="true" />
              </div>
            </div>
          </div>

          {showInput ? (
            <div className="dk-slider__input-wrap">
              <label className="dk-slider__input-label" htmlFor={inputId}>
                {inputLabel}
              </label>
              <input
                id={inputId}
                className="dk-slider__input"
                type="text"
                inputMode="decimal"
                disabled={disabled}
                value={inputText}
                aria-describedby={describedBy || undefined}
                onChange={(event) => setInputText(event.target.value)}
                onBlur={() => applyInput(inputText, true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyInput(inputText, true);
                    (event.target as HTMLInputElement).blur();
                  }
                }}
              />
              {unit ? (
                <span className="dk-slider__input-unit" aria-hidden="true">
                  {unit}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="dk-slider__bounds" aria-hidden="true">
          <span id={minId}>{minLabel}</span>
          <span id={maxId}>{maxLabel}</span>
        </div>

        {name ? <input type="hidden" name={name} value={value} /> : null}

        <div className="dk-field__footer">
          <div className="dk-field__messages">
            {validationState === "error" && errorMessage ? (
              <p id={errorId} className="dk-field__message dk-field__message--error" role="alert">
                <span className="dk-field__message-icon" aria-hidden="true">
                  <StatusIcon kind="error" />
                </span>
                <span>{errorMessage}</span>
              </p>
            ) : null}
            {validationState === "success" && successMessage ? (
              <p id={successId} className="dk-field__message dk-field__message--success">
                <span className="dk-field__message-icon" aria-hidden="true">
                  <StatusIcon kind="success" />
                </span>
                <span>{successMessage}</span>
              </p>
            ) : null}
            {validationState === "warning" && warningMessage ? (
              <p id={warningId} className="dk-field__message dk-field__message--warning">
                <span className="dk-field__message-icon" aria-hidden="true">
                  <StatusIcon kind="warning" />
                </span>
                <span>{warningMessage}</span>
              </p>
            ) : null}
            {validationState === "none" && helpText ? (
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

Slider.displayName = "Slider";

export default Slider;
