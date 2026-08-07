import * as React from "react";

export type InputGroupSize = "xs" | "sm" | "md" | "lg" | "xl";

export type InputGroupValidation = "none" | "error" | "success" | "warning";

export type InputGroupOrientation = "responsive" | "horizontal" | "vertical";

type InputGroupContextValue = {
  size: InputGroupSize;
  disabled: boolean;
  readOnly: boolean;
  loading: boolean;
  validation: InputGroupValidation;
  attached: boolean;
};

const InputGroupContext = React.createContext<InputGroupContextValue | null>(null);

export function useInputGroup(): InputGroupContextValue | null {
  return React.useContext(InputGroupContext);
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

export interface InputGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label?: string;
  hideLabel?: boolean;
  description?: string;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  validation?: InputGroupValidation;
  size?: InputGroupSize;
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
  /**
   * Join segments into one shared border shell (default).
   * Set false only when spacing related controls without merging chrome.
   */
  attached?: boolean;
  /**
   * Layout of segments.
   * `responsive` (default): horizontal when space allows, stack on compact.
   */
  orientation?: InputGroupOrientation;
  children: React.ReactNode;
}

export interface InputGroupAddonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual placement hint for styling / RTL. */
  position?: "start" | "end";
  children: React.ReactNode;
}

export interface InputGroupIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  position?: "start" | "end";
  /** Accessible name. Omit when decorative (defaults to aria-hidden). */
  label?: string;
  children: React.ReactNode;
}

export interface InputGroupInputProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface InputGroupButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SIZE_CLASS: Record<InputGroupSize, string> = {
  xs: "dk-input-group--xs",
  sm: "dk-input-group--sm",
  md: "dk-input-group--md",
  lg: "dk-input-group--lg",
  xl: "dk-input-group--xl",
};

/**
 * Input Group (ID 020) — contextual composition around form controls.
 *
 * Join related prefixes, suffixes, icons, units, currency, and actions
 * with an input. Do not merge unrelated controls.
 */
export const InputGroupRoot = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup(
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
      attached = true,
      orientation = "responsive",
      className,
      id: idProp,
      children,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-input-group-${reactId}`;
    const labelId = `${rootId}-label`;
    const descId = `${rootId}-desc`;
    const helpId = `${rootId}-help`;
    const errorId = `${rootId}-error`;
    const successId = `${rootId}-success`;
    const warningId = `${rootId}-warning`;

    const resolvedValidation: InputGroupValidation =
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

    const ctx = React.useMemo<InputGroupContextValue>(
      () => ({
        size,
        disabled,
        readOnly,
        loading,
        validation: resolvedValidation,
        attached,
      }),
      [size, disabled, readOnly, loading, resolvedValidation, attached]
    );

    return (
      <InputGroupContext.Provider value={ctx}>
        <div
          {...rest}
          ref={ref}
          id={rootId}
          role="group"
          className={cx(
            "dk-field",
            "dk-input-group",
            SIZE_CLASS[size],
            fullWidth && "dk-field--full",
            disabled && "dk-field--disabled",
            readOnly && "dk-field--readonly",
            loading && "dk-input-group--loading",
            attached && "dk-input-group--attached",
            !attached && "dk-input-group--spaced",
            `dk-input-group--${orientation}`,
            resolvedValidation !== "none" && `dk-field--${resolvedValidation}`,
            reserveFooter && "dk-field--stable-messages",
            className
          )}
          data-size={size}
          data-orientation={orientation}
          data-attached={attached || undefined}
          data-validation={resolvedValidation}
          data-loading={loading || undefined}
          aria-labelledby={label && !hideLabel ? labelId : undefined}
          aria-describedby={describedBy || undefined}
          aria-disabled={disabled || undefined}
          aria-busy={loading || undefined}
        >
          {label ? (
            <div className={cx("dk-field__label-row", hideLabel && "dk-field__label-row--sr")}>
              <span className="dk-field__label" id={labelId}>
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

          <div className="dk-input-group__shell">
            <div className="dk-input-group__segments">{children}</div>

            {loading ? (
              <span className="dk-input-group__loading" role="status" aria-label={loadingLabel}>
                <span className="dk-input-group__spinner" aria-hidden="true" />
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
          </div>
        </div>
      </InputGroupContext.Provider>
    );
  }
);

InputGroupRoot.displayName = "InputGroup";

/** Static prefix / suffix / unit / currency text. Not focusable. */
export const InputGroupAddon = React.forwardRef<HTMLSpanElement, InputGroupAddonProps>(
  function InputGroupAddon({ position = "start", className, children, ...rest }, ref) {
    return (
      <span
        {...rest}
        ref={ref}
        className={cx(
          "dk-input-group__addon",
          position === "start" && "dk-input-group__addon--start",
          position === "end" && "dk-input-group__addon--end",
          className
        )}
        data-position={position}
      >
        {children}
      </span>
    );
  }
);

InputGroupAddon.displayName = "InputGroup.Addon";

/** Leading / trailing icon. Decorative unless `label` is provided. */
export const InputGroupIcon = React.forwardRef<HTMLSpanElement, InputGroupIconProps>(
  function InputGroupIcon({ position = "start", label, className, children, ...rest }, ref) {
    return (
      <span
        {...rest}
        ref={ref}
        className={cx(
          "dk-input-group__icon",
          position === "start" && "dk-input-group__icon--start",
          position === "end" && "dk-input-group__icon--end",
          className
        )}
        data-position={position}
        aria-hidden={label ? undefined : true}
        aria-label={label}
        role={label ? "img" : undefined}
      >
        {children}
      </span>
    );
  }
);

InputGroupIcon.displayName = "InputGroup.Icon";

/**
 * Wraps a form control (Text Input, Number Input, Search Field, …).
 * Use `hideLabel` on the child when the group already shows a label.
 */
export const InputGroupInput = React.forwardRef<HTMLDivElement, InputGroupInputProps>(
  function InputGroupInput({ className, children, ...rest }, ref) {
    const group = useInputGroup();
    return (
      <div
        {...rest}
        ref={ref}
        className={cx("dk-input-group__input", className)}
        data-disabled={group?.disabled || undefined}
        data-readonly={group?.readOnly || undefined}
        data-loading={group?.loading || undefined}
      >
        {children}
      </div>
    );
  }
);

InputGroupInput.displayName = "InputGroup.Input";

/**
 * Wraps a related Button or Icon Button.
 * Remains independently focusable and activatable.
 */
export const InputGroupButton = React.forwardRef<HTMLDivElement, InputGroupButtonProps>(
  function InputGroupButton({ className, children, ...rest }, ref) {
    const group = useInputGroup();
    return (
      <div
        {...rest}
        ref={ref}
        className={cx("dk-input-group__button", className)}
        data-disabled={group?.disabled || undefined}
      >
        {children}
      </div>
    );
  }
);

InputGroupButton.displayName = "InputGroup.Button";

type InputGroupComponent = typeof InputGroupRoot & {
  Addon: typeof InputGroupAddon;
  Icon: typeof InputGroupIcon;
  Input: typeof InputGroupInput;
  Button: typeof InputGroupButton;
};

const InputGroup = InputGroupRoot as InputGroupComponent;
InputGroup.Addon = InputGroupAddon;
InputGroup.Icon = InputGroupIcon;
InputGroup.Input = InputGroupInput;
InputGroup.Button = InputGroupButton;

export { InputGroup };
export default InputGroup;
