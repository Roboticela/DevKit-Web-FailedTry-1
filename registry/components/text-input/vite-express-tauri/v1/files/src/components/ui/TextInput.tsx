import * as React from "react";

export type TextInputSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Semantic textual kinds. Visual chrome stays identical; only native behavior changes.
 * `username` maps to `type="text"` + username autocomplete.
 */
export type TextInputType =
  | "text"
  | "email"
  | "url"
  | "tel"
  | "search"
  | "username";

export type TextInputValidation = "none" | "error" | "success" | "warning";

export interface TextInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "prefix" | "type" | "value" | "defaultValue" | "onChange"
  > {
  /** Visible label. Prefer always providing one — placeholder is not a label. */
  label?: string;
  /** Hide the visible label while keeping it available to assistive tech via `aria-label`. */
  hideLabel?: boolean;
  description?: string;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  /** Validation chrome. Prefer pairing with a message (not color alone). */
  validation?: TextInputValidation;
  size?: TextInputSize;
  /** Semantic input kind. Default: `text`. */
  type?: TextInputType;
  required?: boolean;
  /** Show “Optional” when not required. Default: false. */
  optional?: boolean;
  /** Required marker text/symbol. Default: `*`. */
  requiredIndicator?: React.ReactNode;
  optionalLabel?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Static text before the value (e.g. `https://`). */
  prefix?: React.ReactNode;
  /** Static text after the value (e.g. `.com`). */
  suffix?: React.ReactNode;
  /** Show clear control when the value is non-empty. Default: false. */
  clearable?: boolean;
  clearLabel?: string;
  onClear?: () => void;
  loading?: boolean;
  loadingLabel?: string;
  readOnly?: boolean;
  disabled?: boolean;
  /** Show character counter when `maxLength` is set. Default: true if maxLength provided. */
  showCount?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  fullWidth?: boolean;
  /**
   * Reserve footer height to reduce layout jump when messages appear.
   * Default: true when any message/counter slot is configured.
   */
  stableMessages?: boolean;
}

const SIZE_CLASS: Record<TextInputSize, string> = {
  xs: "dk-field--xs",
  sm: "dk-field--sm",
  md: "dk-field--md",
  lg: "dk-field--lg",
  xl: "dk-field--xl",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function resolveNativeType(type: TextInputType): React.HTMLInputTypeAttribute {
  return type === "username" ? "text" : type;
}

function defaultAutoComplete(type: TextInputType): string | undefined {
  switch (type) {
    case "email":
      return "email";
    case "tel":
      return "tel";
    case "url":
      return "url";
    case "username":
      return "username";
    case "search":
      return "off";
    default:
      return undefined;
  }
}

function defaultInputMode(
  type: TextInputType
): React.HTMLAttributes<HTMLInputElement>["inputMode"] | undefined {
  switch (type) {
    case "email":
      return "email";
    case "tel":
      return "tel";
    case "url":
      return "url";
    case "search":
      return "search";
    default:
      return "text";
  }
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
 * Text Input (ID 011) — foundational single-line textual data-entry control.
 *
 * Visible label by default (not floating). Semantic types share one visual identity.
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
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
      type = "text",
      required = false,
      optional = false,
      requiredIndicator = "*",
      optionalLabel = "Optional",
      leadingIcon,
      trailingIcon,
      prefix,
      suffix,
      clearable = false,
      clearLabel = "Clear",
      onClear,
      loading = false,
      loadingLabel = "Loading",
      readOnly = false,
      disabled = false,
      showCount,
      value: valueProp,
      defaultValue,
      onChange,
      onValueChange,
      fullWidth = true,
      stableMessages,
      id: idProp,
      className,
      placeholder,
      maxLength,
      autoComplete,
      inputMode,
      name,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const inputId = idProp ?? `dk-text-input-${reactId}`;
    const descId = `${inputId}-desc`;
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;
    const warningId = `${inputId}-warning`;
    const countId = `${inputId}-count`;

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "");
    const value = isControlled ? String(valueProp) : uncontrolled;
    const filled = value.length > 0;

    const resolvedValidation: TextInputValidation =
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
      showCount ?? (typeof maxLength === "number" && maxLength > 0);
    const count = value.length;

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

    const showClear =
      clearable && filled && !disabled && !readOnly && !loading;

    const setValue = (next: string, event?: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
      if (event) onChange?.(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value, event);
    };

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const handleClear = () => {
      if (!isControlled) setUncontrolled("");
      onValueChange?.("");
      onClear?.();
      inputRef.current?.focus();
    };

    const nativeType = resolveNativeType(type);
    const isInvalid = resolvedValidation === "error";

    return (
      <div
        className={cx(
          "dk-field",
          "dk-text-input",
          SIZE_CLASS[size],
          fullWidth && "dk-field--full",
          disabled && "dk-field--disabled",
          readOnly && "dk-field--readonly",
          loading && "dk-field--loading",
          filled && "dk-field--filled",
          resolvedValidation !== "none" && `dk-field--${resolvedValidation}`,
          reserveFooter && "dk-field--stable-messages",
          className
        )}
        data-size={size}
        data-type={type}
        data-validation={resolvedValidation}
        data-filled={filled || undefined}
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

        <div className="dk-field__control">
          <span className="dk-field__hit" aria-hidden="true" />

          {leadingIcon ? (
            <span className="dk-field__affordance dk-field__affordance--leading" aria-hidden="true">
              {leadingIcon}
            </span>
          ) : null}

          {prefix ? (
            <span className="dk-field__addon dk-field__addon--prefix">{prefix}</span>
          ) : null}

          <input
            {...rest}
            ref={setRefs}
            id={inputId}
            name={name}
            className="dk-field__input"
            type={nativeType}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly || loading}
            required={required}
            maxLength={maxLength}
            autoComplete={autoComplete ?? defaultAutoComplete(type)}
            inputMode={inputMode ?? defaultInputMode(type)}
            aria-invalid={isInvalid || undefined}
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
          />

          {suffix ? (
            <span className="dk-field__addon dk-field__addon--suffix">{suffix}</span>
          ) : null}

          {loading ? (
            <span className="dk-field__loading" role="status" aria-label={loadingLabel}>
              <span className="dk-field__spinner" aria-hidden="true" />
            </span>
          ) : null}

          {showClear ? (
            <button
              type="button"
              className="dk-field__clear"
              aria-label={clearLabel}
              onClick={handleClear}
            >
              <span className="dk-field__clear-hit" aria-hidden="true" />
              <ClearIcon />
            </button>
          ) : null}

          {!loading && trailingIcon ? (
            <span className="dk-field__affordance dk-field__affordance--trailing" aria-hidden="true">
              {trailingIcon}
            </span>
          ) : null}

          {!loading && !trailingIcon && resolvedValidation === "error" ? (
            <span className="dk-field__affordance dk-field__affordance--status" aria-hidden="true">
              <StatusIcon kind="error" />
            </span>
          ) : null}
          {!loading && !trailingIcon && resolvedValidation === "success" ? (
            <span className="dk-field__affordance dk-field__affordance--status" aria-hidden="true">
              <StatusIcon kind="success" />
            </span>
          ) : null}
          {!loading && !trailingIcon && resolvedValidation === "warning" ? (
            <span className="dk-field__affordance dk-field__affordance--status" aria-hidden="true">
              <StatusIcon kind="warning" />
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
          </div>

          {counterEnabled ? (
            <p
              id={countId}
              className={cx(
                "dk-field__count",
                typeof maxLength === "number" &&
                  count >= maxLength &&
                  "dk-field__count--limit"
              )}
              aria-live="polite"
            >
              {typeof maxLength === "number" ? `${count}/${maxLength}` : count}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
