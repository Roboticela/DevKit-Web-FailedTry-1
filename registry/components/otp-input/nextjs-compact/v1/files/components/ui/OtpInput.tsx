import * as React from "react";

export type OtpInputLength = 4 | 5 | 6 | 8;

export type OtpInputMode = "numeric" | "alphanumeric";

export type OtpInputValidation = "none" | "error" | "success" | "warning";

export interface OtpInputProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue" | "children"
  > {
  /** Visible label — never rely on placeholder alone. */
  label?: string;
  hideLabel?: boolean;
  description?: string;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  validation?: OtpInputValidation;
  /** Code length. Default: 6. Supported: 4, 5, 6, 8 (or any positive integer). */
  length?: OtpInputLength | number;
  /** Character set. Default: `numeric`. */
  mode?: OtpInputMode;
  /** Combined code string. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fires when all cells are filled with valid characters. */
  onComplete?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  required?: boolean;
  optional?: boolean;
  requiredIndicator?: React.ReactNode;
  optionalLabel?: string;
  fullWidth?: boolean;
  stableMessages?: boolean;
  name?: string;
  id?: string;
  autoFocus?: boolean;
  /**
   * When true (default), an invalid validation state does not wipe the entry.
   * Hosts clear explicitly if needed.
   */
  preserveOnInvalid?: boolean;
  inputLabel?: (index: number, length: number) => string;
}

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

function sanitizeChar(char: string, mode: OtpInputMode): string | null {
  if (!char) return null;
  const c = char[0] ?? "";
  if (mode === "numeric") {
    return /^\d$/.test(c) ? c : null;
  }
  return /^[a-zA-Z0-9]$/.test(c) ? c.toUpperCase() : null;
}

function sanitizeCode(text: string, length: number, mode: OtpInputMode): string {
  const chars: string[] = [];
  for (const ch of text) {
    const next = sanitizeChar(ch, mode);
    if (next) chars.push(next);
    if (chars.length >= length) break;
  }
  return chars.join("");
}

function toCells(value: string, length: number): string[] {
  const cells = Array.from({ length }, (_, i) => value[i] ?? "");
  return cells;
}

/**
 * OTP / Verification Input (ID 016) — short verification code entry.
 *
 * Visual cells with one logical value. Paste fills the whole code.
 * Does not clear the entry on invalid by default.
 */
export const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(
  function OtpInput(
    {
      label,
      hideLabel = false,
      description,
      helpText,
      errorMessage,
      successMessage,
      warningMessage,
      validation = "none",
      length: lengthProp = 6,
      mode = "numeric",
      value: valueProp,
      defaultValue = "",
      onValueChange,
      onComplete,
      disabled = false,
      readOnly = false,
      loading = false,
      loadingLabel = "Verifying",
      required = false,
      optional = false,
      requiredIndicator = "*",
      optionalLabel = "Optional",
      fullWidth = false,
      stableMessages,
      name,
      id: idProp,
      autoFocus = false,
      preserveOnInvalid = true,
      inputLabel,
      className,
      onKeyDown,
      ...rest
    },
    ref
  ) {
    const length = Math.max(1, Math.floor(lengthProp));
    const reactId = React.useId();
    const rootId = idProp ?? `dk-otp-${reactId}`;
    const descId = `${rootId}-desc`;
    const helpId = `${rootId}-help`;
    const errorId = `${rootId}-error`;
    const successId = `${rootId}-success`;
    const warningId = `${rootId}-warning`;
    const statusId = `${rootId}-status`;

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(() =>
      sanitizeCode(defaultValue, length, mode)
    );
    const value = sanitizeCode(
      isControlled ? String(valueProp) : uncontrolled,
      length,
      mode
    );
    const cells = toCells(value, length);

    const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);
    const hiddenRef = React.useRef<HTMLInputElement | null>(null);

    const resolvedValidation: OtpInputValidation =
      validation !== "none"
        ? validation
        : errorMessage
          ? "error"
          : successMessage
            ? "success"
            : warningMessage
              ? "warning"
              : "none";

    const filledCount = cells.filter(Boolean).length;
    const isEmpty = filledCount === 0;
    const isPartial = filledCount > 0 && filledCount < length;
    const isComplete = filledCount === length;

    const reserveFooter = stableMessages ?? true;

    const describedBy = [
      description ? descId : null,
      resolvedValidation === "error" && errorMessage ? errorId : null,
      resolvedValidation === "success" && successMessage ? successId : null,
      resolvedValidation === "warning" && warningMessage ? warningId : null,
      resolvedValidation === "none" && helpText ? helpId : null,
      statusId,
    ]
      .filter(Boolean)
      .join(" ");

    const setValue = (next: string, opts?: { complete?: boolean }) => {
      const clean = sanitizeCode(next, length, mode);
      if (!isControlled) setUncontrolled(clean);
      onValueChange?.(clean);
      if (opts?.complete || clean.length === length) {
        onComplete?.(clean);
      }
    };

    const focusIndex = (index: number) => {
      const clamped = Math.max(0, Math.min(length - 1, index));
      inputRefs.current[clamped]?.focus();
      inputRefs.current[clamped]?.select();
    };

    const updateAt = (index: number, char: string | null) => {
      const next = [...cells];
      next[index] = char ?? "";
      const joined = next.join("");
      setValue(joined, { complete: joined.length === length && !next.includes("") });
      return joined;
    };

    const handleCellChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || readOnly || loading) return;
      const raw = event.target.value;

      // Mobile autofill / multi-char insert into a cell
      if (raw.length > 1) {
        const clean = sanitizeCode(raw, length, mode);
        setValue(clean, { complete: clean.length === length });
        focusIndex(Math.min(clean.length, length - 1));
        return;
      }

      const nextChar = sanitizeChar(raw.slice(-1), mode);
      if (!nextChar) {
        // Clear if emptied
        if (raw === "") {
          updateAt(index, "");
        }
        return;
      }

      updateAt(index, nextChar);
      if (index < length - 1) focusIndex(index + 1);
    };

    const handleKeyDown = (
      index: number,
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      onKeyDown?.(event as unknown as React.KeyboardEvent<HTMLDivElement>);
      if (event.defaultPrevented || disabled || readOnly || loading) return;

      const key = event.key;

      if (key === "Backspace") {
        event.preventDefault();
        if (cells[index]) {
          updateAt(index, "");
        } else if (index > 0) {
          updateAt(index - 1, "");
          focusIndex(index - 1);
        }
        return;
      }

      if (key === "Delete") {
        event.preventDefault();
        updateAt(index, "");
        return;
      }

      if (key === "ArrowLeft") {
        event.preventDefault();
        focusIndex(index - 1);
        return;
      }

      if (key === "ArrowRight") {
        event.preventDefault();
        focusIndex(index + 1);
        return;
      }

      if (key === "Home") {
        event.preventDefault();
        focusIndex(0);
        return;
      }

      if (key === "End") {
        event.preventDefault();
        focusIndex(length - 1);
        return;
      }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      if (disabled || readOnly || loading) return;
      const text = event.clipboardData.getData("text");
      if (!text) return;
      event.preventDefault();
      const clean = sanitizeCode(text, length, mode);
      setValue(clean, { complete: clean.length === length });
      focusIndex(Math.min(Math.max(clean.length - 1, 0), length - 1));
    };

    // Hidden field captures platform one-time-code autofill
    const handleHiddenInput = (event: React.FormEvent<HTMLInputElement>) => {
      if (disabled || readOnly || loading) return;
      const clean = sanitizeCode(event.currentTarget.value, length, mode);
      if (!clean) return;
      setValue(clean, { complete: clean.length === length });
      focusIndex(Math.min(clean.length, length - 1));
      event.currentTarget.value = "";
    };

    React.useEffect(() => {
      if (autoFocus && !disabled) {
        focusIndex(0);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoFocus, disabled]);

    const cellAriaLabel =
      inputLabel ??
      ((index: number, total: number) => `Digit ${index + 1} of ${total}`);

    return (
      <div
        {...rest}
        ref={ref}
        id={rootId}
        className={cx(
          "dk-field",
          "dk-otp",
          fullWidth && "dk-field--full",
          disabled && "dk-field--disabled",
          readOnly && "dk-field--readonly",
          loading && "dk-otp--loading",
          isEmpty && "dk-otp--empty",
          isPartial && "dk-otp--partial",
          isComplete && "dk-otp--complete",
          resolvedValidation !== "none" && `dk-field--${resolvedValidation}`,
          reserveFooter && "dk-field--stable-messages",
          className
        )}
        data-length={length}
        data-mode={mode}
        data-validation={resolvedValidation}
        data-empty={isEmpty || undefined}
        data-partial={isPartial || undefined}
        data-complete={isComplete || undefined}
        data-loading={loading || undefined}
        data-preserve-on-invalid={preserveOnInvalid ? true : undefined}
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

        {/* Platform OTP autofill sink */}
        <input
          ref={hiddenRef}
          className="dk-otp__autofill"
          type="text"
          inputMode={mode === "numeric" ? "numeric" : "text"}
          autoComplete="one-time-code"
          name={name ? `${name}-autofill` : undefined}
          tabIndex={-1}
          aria-hidden="true"
          value=""
          readOnly={readOnly || loading}
          disabled={disabled}
          onInput={handleHiddenInput}
          onChange={handleHiddenInput}
        />

        <div
          className="dk-otp__control"
          role="group"
          aria-labelledby={label ? `${rootId}-label` : undefined}
          aria-describedby={describedBy || undefined}
        >
          {cells.map((char, index) => (
            <input
              key={index}
              ref={(node) => {
                inputRefs.current[index] = node;
              }}
              className={cx(
                "dk-otp__cell",
                char && "dk-otp__cell--filled",
                resolvedValidation === "error" && "dk-otp__cell--invalid"
              )}
              type="text"
              inputMode={mode === "numeric" ? "numeric" : "text"}
              pattern={mode === "numeric" ? "[0-9]*" : undefined}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              name={name && index === 0 ? name : undefined}
              aria-label={cellAriaLabel(index, length)}
              aria-invalid={resolvedValidation === "error" || undefined}
              aria-busy={loading || undefined}
              maxLength={index === 0 ? length : 1}
              value={char}
              disabled={disabled}
              readOnly={readOnly || loading}
              required={required && index === 0}
              onChange={(event) => handleCellChange(index, event)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              onFocus={(event) => event.currentTarget.select()}
            />
          ))}

          {loading ? (
            <span className="dk-otp__loading" role="status" aria-label={loadingLabel}>
              <span className="dk-otp__spinner" aria-hidden="true" />
            </span>
          ) : null}
        </div>

        <p id={statusId} className="dk-otp__sr-status" aria-live="polite">
          {isComplete
            ? "Code complete"
            : isPartial
              ? `${filledCount} of ${length} characters entered`
              : "Code empty"}
        </p>

        <div className="dk-field__footer dk-otp__footer">
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

OtpInput.displayName = "OtpInput";

export default OtpInput;
