import * as React from "react";
import { PasswordVisibilityToggle } from "../../../../../../../password-visibility-toggle/nextjs-compact/v1/files/components/ui/PasswordVisibilityToggle";

export type PasswordInputSize = "xs" | "sm" | "md" | "lg" | "xl";

export type PasswordInputValidation = "none" | "error" | "success" | "warning";

/**
 * Password entry intent — drives autocomplete / password-manager hints.
 * - `new` — create a password
 * - `confirm` — confirm a new password
 * - `current` — sign-in / existing credential
 */
export type PasswordInputPurpose = "new" | "confirm" | "current";

export interface PasswordInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "value" | "defaultValue" | "onChange"
  > {
  label?: string;
  hideLabel?: boolean;
  description?: string;
  /** Compose Password Requirements (List + List Item) — separate from validation errors. */
  requirements?: React.ReactNode;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  validation?: PasswordInputValidation;
  size?: PasswordInputSize;
  purpose?: PasswordInputPurpose;
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
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  /**
   * Show/hide visibility. Default masked (`false`).
   * Controlled via `visible` / `defaultVisible` / `onVisibleChange`.
   */
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  /** Show the visibility toggle. Default: true. */
  visibilityToggle?: boolean;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
  /**
   * Slot for a composed Password Strength Indicator (or any status UI).
   * This primitive does not implement strength scoring.
   */
  strengthSlot?: React.ReactNode;
  /**
   * Allow paste. Default: true — disable only when app security requires it.
   */
  allowPaste?: boolean;
}

const SIZE_CLASS: Record<PasswordInputSize, string> = {
  xs: "dk-password--xs",
  sm: "dk-password--sm",
  md: "dk-password--md",
  lg: "dk-password--lg",
  xl: "dk-password--xl",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function defaultAutoComplete(purpose: PasswordInputPurpose): string {
  switch (purpose) {
    case "new":
    case "confirm":
      return "new-password";
    case "current":
    default:
      return "current-password";
  }
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
 * Password Input (ID 015) — masked credential entry with accessible show/hide.
 *
 * Visibility composes Password Visibility Toggle (Icon Button).
 * Does not implement password strength scoring — compose via `strengthSlot`.
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      label,
      hideLabel = false,
      description,
      requirements,
      helpText,
      errorMessage,
      successMessage,
      warningMessage,
      validation = "none",
      size = "md",
      purpose = "current",
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
      value: valueProp,
      defaultValue,
      onChange,
      onValueChange,
      visible: visibleProp,
      defaultVisible = false,
      onVisibleChange,
      visibilityToggle = true,
      showPasswordLabel = "Show password",
      hidePasswordLabel = "Hide password",
      strengthSlot,
      allowPaste = true,
      id: idProp,
      className,
      placeholder,
      name,
      autoComplete,
      onPaste,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const inputId = idProp ?? `dk-password-${reactId}`;
    const descId = `${inputId}-desc`;
    const reqId = `${inputId}-req`;
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;
    const warningId = `${inputId}-warning`;
    const strengthId = `${inputId}-strength`;

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "");
    const value = isControlled ? String(valueProp) : uncontrolled;
    const filled = value.length > 0;

    const isVisibilityControlled = visibleProp !== undefined;
    const [uncontrolledVisible, setUncontrolledVisible] = React.useState(defaultVisible);
    const visible = isVisibilityControlled ? Boolean(visibleProp) : uncontrolledVisible;

    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const resolvedValidation: PasswordInputValidation =
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
      helpText ||
        errorMessage ||
        successMessage ||
        warningMessage ||
        requirements ||
        strengthSlot
    );
    const reserveFooter = stableMessages ?? messageConfigured;

    const describedBy = [
      description ? descId : null,
      requirements ? reqId : null,
      strengthSlot ? strengthId : null,
      resolvedValidation === "error" && errorMessage ? errorId : null,
      resolvedValidation === "success" && successMessage ? successId : null,
      resolvedValidation === "warning" && warningMessage ? warningId : null,
      resolvedValidation === "none" && helpText ? helpId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const setVisible = (next: boolean) => {
      const el = inputRef.current;
      const start = el?.selectionStart ?? null;
      const end = el?.selectionEnd ?? null;
      if (!isVisibilityControlled) setUncontrolledVisible(next);
      onVisibleChange?.(next);
      // Restore caret after type swap
      requestAnimationFrame(() => {
        const node = inputRef.current;
        if (!node || start === null || end === null) return;
        try {
          node.setSelectionRange(start, end);
        } catch {
          /* some browsers restrict selection on type=password */
        }
        node.focus();
      });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value;
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
      onChange?.(event);
    };

    return (
      <div
        className={cx(
          "dk-field",
          "dk-password",
          SIZE_CLASS[size],
          fullWidth && "dk-field--full",
          disabled && "dk-field--disabled",
          readOnly && "dk-field--readonly",
          loading && "dk-password--loading",
          filled && "dk-password--filled",
          visible && "dk-password--visible",
          resolvedValidation !== "none" && `dk-field--${resolvedValidation}`,
          reserveFooter && "dk-field--stable-messages",
          className
        )}
        data-size={size}
        data-purpose={purpose}
        data-visible={visible || undefined}
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

        {requirements ? (
          <div id={reqId} className="dk-password__requirements">
            {requirements}
          </div>
        ) : null}

        <div className="dk-field__control dk-password__control">
          <span className="dk-field__hit" aria-hidden="true" />

          <input
            {...rest}
            ref={setRefs}
            id={inputId}
            name={name}
            className="dk-field__input dk-password__input"
            type={visible ? "text" : "password"}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly || loading}
            required={required}
            autoComplete={autoComplete ?? defaultAutoComplete(purpose)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
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
            onPaste={(event) => {
              if (!allowPaste) {
                event.preventDefault();
              }
              onPaste?.(event);
            }}
          />

          {loading ? (
            <span className="dk-password__loading" role="status" aria-label={loadingLabel}>
              <span className="dk-password__spinner" aria-hidden="true" />
            </span>
          ) : null}

          {visibilityToggle && !loading ? (
            <PasswordVisibilityToggle
              className="dk-password__visibility"
              size={size === "xl" ? "md" : size === "lg" ? "md" : size === "xs" ? "xs" : "sm"}
              variant="subtle"
              visible={visible}
              onVisibleChange={setVisible}
              showLabel={showPasswordLabel}
              hideLabel={hidePasswordLabel}
              controls={inputId}
              disabled={disabled}
              readOnly={readOnly}
            />
          ) : null}
        </div>

        {strengthSlot ? (
          <div id={strengthId} className="dk-password__strength-slot">
            {strengthSlot}
          </div>
        ) : null}

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

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
