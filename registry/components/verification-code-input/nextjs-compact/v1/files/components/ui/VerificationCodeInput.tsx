import * as React from "react";
import {
  TextInput,
  type TextInputSize,
  type TextInputValidation,
} from "../../../../../../../text-input/nextjs-compact/v1/files/components/ui/TextInput";
import { Label } from "../../../../../../../label/nextjs-compact/v1/files/components/ui/Label";
import { Text } from "../../../../../../../text/nextjs-compact/v1/files/components/ui/Text";
import { Alert } from "../../../../../../../alert/nextjs-compact/v1/files/components/ui/Alert";
import { Spinner } from "../../../../../../../spinner/nextjs-compact/v1/files/components/ui/Spinner";

/**
 * Verification Code Input — multi-cell auth code entry.
 * Composes Text Input for every cell (+ Label, Text, Alert, Spinner).
 * Do not invent raw `<input>` cells — always use Text Input.
 *
 * Flows: email-verification · password-reset · authenticator · two-factor
 */

export type VerificationCodeLength = 4 | 5 | 6 | 8;

export type VerificationCodeMode = "numeric" | "alphanumeric";

export type VerificationCodeValidation = TextInputValidation;

export type VerificationCodeFlow =
  | "email-verification"
  | "password-reset"
  | "authenticator"
  | "two-factor";

export type VerificationCodeInputProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue" | "children"
> & {
  flow?: VerificationCodeFlow;
  label?: string;
  hideLabel?: boolean;
  description?: string;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  validation?: VerificationCodeValidation;
  /** Code length. Defaults from `flow` (usually 6). */
  length?: VerificationCodeLength | number;
  mode?: VerificationCodeMode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
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
  size?: TextInputSize;
  autoFocus?: boolean;
  preserveOnInvalid?: boolean;
  name?: string;
  id?: string;
  inputLabel?: (index: number, length: number) => string;
  /** Slot: under the cells (e.g. Countdown Timer). */
  footerSlot?: React.ReactNode;
  /** Slot: replace the loading Spinner. */
  loadingSlot?: React.ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const VERIFICATION_CODE_FLOW_DEFAULTS: Record<
  VerificationCodeFlow,
  {
    length: number;
    mode: VerificationCodeMode;
    label: string;
    description: string;
  }
> = {
  "email-verification": {
    length: 6,
    mode: "numeric",
    label: "Email verification code",
    description: "Enter the code we sent to your email.",
  },
  "password-reset": {
    length: 6,
    mode: "numeric",
    label: "Password reset code",
    description: "Enter the code from your reset email.",
  },
  authenticator: {
    length: 6,
    mode: "numeric",
    label: "Authenticator code",
    description: "Enter the 6-digit code from your authenticator app.",
  },
  "two-factor": {
    length: 6,
    mode: "numeric",
    label: "Two-factor code",
    description: "Enter the verification code from your second factor.",
  },
};

export function sanitizeVerificationChar(
  char: string,
  mode: VerificationCodeMode
): string | null {
  if (!char) return null;
  const c = char[0] ?? "";
  if (mode === "numeric") {
    return /^\d$/.test(c) ? c : null;
  }
  return /^[a-zA-Z0-9]$/.test(c) ? c.toUpperCase() : null;
}

export function sanitizeVerificationCode(
  text: string,
  length: number,
  mode: VerificationCodeMode
): string {
  const chars: string[] = [];
  for (const ch of text) {
    const next = sanitizeVerificationChar(ch, mode);
    if (next) chars.push(next);
    if (chars.length >= length) break;
  }
  return chars.join("");
}

function toCells(value: string, length: number): string[] {
  return Array.from({ length }, (_, i) => value[i] ?? "");
}

export const VerificationCodeInput = React.forwardRef<
  HTMLDivElement,
  VerificationCodeInputProps
>(function VerificationCodeInput(
  {
    flow = "email-verification",
    label: labelProp,
    hideLabel = false,
    description: descriptionProp,
    helpText,
    errorMessage,
    successMessage,
    warningMessage,
    validation = "none",
    length: lengthProp,
    mode: modeProp,
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
    size = "md",
    autoFocus = false,
    preserveOnInvalid = true,
    name,
    id: idProp,
    inputLabel,
    footerSlot,
    loadingSlot,
    className,
    onKeyDown,
    ...rest
  },
  ref
) {
  const flowDefaults = VERIFICATION_CODE_FLOW_DEFAULTS[flow];
  const length = Math.max(1, Math.floor(lengthProp ?? flowDefaults.length));
  const mode = modeProp ?? flowDefaults.mode;
  const label = labelProp ?? flowDefaults.label;
  const description = descriptionProp ?? flowDefaults.description;

  const reactId = React.useId();
  const rootId = idProp ?? `dk-verification-code-${reactId}`;
  const labelId = `${rootId}-label`;
  const descId = `${rootId}-desc`;
  const helpId = `${rootId}-help`;
  const statusId = `${rootId}-status`;
  const alertId = `${rootId}-alert`;

  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(() =>
    sanitizeVerificationCode(defaultValue, length, mode)
  );
  const value = sanitizeVerificationCode(
    isControlled ? String(valueProp) : uncontrolled,
    length,
    mode
  );
  const cells = toCells(value, length);

  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  const resolvedValidation: VerificationCodeValidation =
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

  const setValue = (next: string, opts?: { complete?: boolean }) => {
    const clean = sanitizeVerificationCode(next, length, mode);
    if (!isControlled) setUncontrolled(clean);
    onValueChange?.(clean);
    if (opts?.complete || clean.length === length) {
      onComplete?.(clean);
    }
  };

  const focusIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(length - 1, index));
    const node = inputRefs.current[clamped];
    node?.focus();
    node?.select();
  };

  const updateAt = (index: number, char: string | null) => {
    const next = [...cells];
    next[index] = char ?? "";
    const joined = next.join("");
    setValue(joined, { complete: joined.length === length && !next.includes("") });
    return joined;
  };

  const handleCellChange = (index: number, nextRaw: string) => {
    if (disabled || readOnly || loading) return;

    if (nextRaw.length > 1) {
      const clean = sanitizeVerificationCode(nextRaw, length, mode);
      setValue(clean, { complete: clean.length === length });
      focusIndex(Math.min(clean.length, length - 1));
      return;
    }

    const nextChar = sanitizeVerificationChar(nextRaw.slice(-1), mode);
    if (!nextChar) {
      if (nextRaw === "") updateAt(index, "");
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
    const clean = sanitizeVerificationCode(text, length, mode);
    setValue(clean, { complete: clean.length === length });
    focusIndex(Math.min(Math.max(clean.length - 1, 0), length - 1));
  };

  const handleAutofill = (raw: string) => {
    if (disabled || readOnly || loading) return;
    const clean = sanitizeVerificationCode(raw, length, mode);
    if (!clean) return;
    setValue(clean, { complete: clean.length === length });
    focusIndex(Math.min(clean.length, length - 1));
  };

  React.useEffect(() => {
    if (autoFocus && !disabled) focusIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus, disabled]);

  const cellAriaLabel =
    inputLabel ??
    ((index: number, total: number) => `Digit ${index + 1} of ${total}`);

  const alertMessage =
    resolvedValidation === "error"
      ? errorMessage
      : resolvedValidation === "success"
        ? successMessage
        : resolvedValidation === "warning"
          ? warningMessage
          : null;

  const alertVariant =
    resolvedValidation === "error"
      ? "error"
      : resolvedValidation === "success"
        ? "success"
        : resolvedValidation === "warning"
          ? "warning"
          : null;

  return (
    <div
      {...rest}
      ref={ref}
      id={rootId}
      className={cx(
        "dk-verification-code",
        `dk-verification-code--${flow}`,
        fullWidth && "dk-verification-code--full",
        disabled && "dk-verification-code--disabled",
        readOnly && "dk-verification-code--readonly",
        loading && "dk-verification-code--loading",
        isEmpty && "dk-verification-code--empty",
        isPartial && "dk-verification-code--partial",
        isComplete && "dk-verification-code--complete",
        resolvedValidation !== "none" && `dk-verification-code--${resolvedValidation}`,
        className
      )}
      data-flow={flow}
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
        <div
          className={cx(
            "dk-verification-code__label-row",
            hideLabel && "dk-verification-code__label-row--sr"
          )}
        >
          <Label
            as="span"
            id={labelId}
            size="md"
            required={required}
            optional={!required && optional}
            requiredIndicator={requiredIndicator}
            optionalLabel={optionalLabel}
          >
            {label}
          </Label>
        </div>
      ) : null}

      {description ? (
        <Text
          as="p"
          id={descId}
          size="xs"
          color="secondary"
          className="dk-verification-code__description"
        >
          {description}
        </Text>
      ) : null}

      {/* Autofill sink — Text Input, not a raw field */}
      <TextInput
        className="dk-verification-code__autofill"
        label="One-time code autofill"
        hideLabel
        size={size}
        fullWidth={false}
        value=""
        name={name ? `${name}-autofill` : undefined}
        autoComplete="one-time-code"
        inputMode={mode === "numeric" ? "numeric" : "text"}
        disabled={disabled}
        readOnly={readOnly || loading}
        tabIndex={-1}
        aria-hidden="true"
        stableMessages={false}
        showCount={false}
        onValueChange={handleAutofill}
      />

      <div
        className="dk-verification-code__control"
        role="group"
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={
          [
            description ? descId : null,
            alertMessage ? alertId : null,
            helpText && resolvedValidation === "none" ? helpId : null,
            statusId,
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
      >
        {cells.map((char, index) => (
          <TextInput
            key={index}
            ref={(node) => {
              inputRefs.current[index] = node;
            }}
            className={cx(
              "dk-verification-code__cell",
              char && "dk-verification-code__cell--filled"
            )}
            label={cellAriaLabel(index, length)}
            hideLabel
            size={size}
            fullWidth={false}
            value={char}
            name={name && index === 0 ? name : undefined}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            inputMode={mode === "numeric" ? "numeric" : "text"}
            maxLength={index === 0 ? length : 1}
            disabled={disabled}
            readOnly={readOnly || loading}
            required={required && index === 0}
            validation={resolvedValidation === "error" ? "error" : "none"}
            stableMessages={false}
            showCount={false}
            onValueChange={(next) => handleCellChange(index, next)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            onFocus={(event) => event.currentTarget.select()}
          />
        ))}

        {loading
          ? (loadingSlot ?? (
              <span className="dk-verification-code__loading">
                <Spinner size="sm" label={loadingLabel} labelMode="sr-only" />
              </span>
            ))
          : null}
      </div>

      <p id={statusId} className="dk-verification-code__sr-status" aria-live="polite">
        {isComplete
          ? "Code complete"
          : isPartial
            ? `${filledCount} of ${length} characters entered`
            : "Code empty"}
      </p>

      {alertVariant && alertMessage ? (
        <Alert
          id={alertId}
          variant={alertVariant}
          density="compact"
          className="dk-verification-code__alert"
        >
          {alertMessage}
        </Alert>
      ) : null}

      {resolvedValidation === "none" && helpText ? (
        <Text
          as="p"
          id={helpId}
          size="xs"
          color="secondary"
          className="dk-verification-code__help"
        >
          {helpText}
        </Text>
      ) : null}

      {footerSlot ? (
        <div className="dk-verification-code__footer-slot">{footerSlot}</div>
      ) : null}
    </div>
  );
});

VerificationCodeInput.displayName = "VerificationCodeInput";
export default VerificationCodeInput;
