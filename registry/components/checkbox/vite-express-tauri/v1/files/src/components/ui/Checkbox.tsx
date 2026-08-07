import * as React from "react";

export type CheckboxSize = "xs" | "sm" | "md" | "lg" | "xl";

export type CheckboxValidation = "none" | "error";

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "checked" | "defaultChecked" | "onChange"
  > {
  /** Visible label. Clicking/tapping the label toggles the control. */
  label?: string;
  /** Hide the visible label while keeping it available to assistive tech via `aria-label`. */
  hideLabel?: boolean;
  /** Supporting text under the label. */
  description?: string;
  errorMessage?: string;
  validation?: CheckboxValidation;
  size?: CheckboxSize;
  required?: boolean;
  optional?: boolean;
  requiredIndicator?: React.ReactNode;
  optionalLabel?: string;
  disabled?: boolean;
  /**
   * Controlled checked state.
   * Prefer a Switch when the choice is an immediate system setting.
   */
  checked?: boolean;
  /** Uncontrolled initial checked state. */
  defaultChecked?: boolean;
  /**
   * Derived partial-selection state. Not a third user-selectable value —
   * Space / click resolve it toward checked (platform convention).
   */
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Stable message footer to limit layout jump when validation appears. */
  stableMessages?: boolean;
}

const SIZE_CLASS: Record<CheckboxSize, string> = {
  xs: "dk-checkbox--xs",
  sm: "dk-checkbox--sm",
  md: "dk-checkbox--md",
  lg: "dk-checkbox--lg",
  xl: "dk-checkbox--xl",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function CheckIcon() {
  return (
    <svg className="dk-checkbox__mark" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.25 6.5 11.25 12.5 4.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IndeterminateIcon() {
  return (
    <svg className="dk-checkbox__mark" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StatusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  );
}

/**
 * Checkbox (ID 021) — independent boolean or multi-select item.
 *
 * Indeterminate is derived / partial only — never a third selectable state.
 * Prefer Switch for immediate on/off system settings.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      hideLabel = false,
      description,
      errorMessage,
      validation = "none",
      size = "md",
      required = false,
      optional = false,
      requiredIndicator = "*",
      optionalLabel = "Optional",
      disabled = false,
      checked: checkedProp,
      defaultChecked = false,
      indeterminate = false,
      onCheckedChange,
      stableMessages,
      id: idProp,
      className,
      name,
      value,
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
    const inputId = idProp ?? `dk-checkbox-${reactId}`;
    const labelId = `${inputId}-label`;
    const descId = `${inputId}-desc`;
    const errorId = `${inputId}-error`;

    const isControlled = checkedProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(Boolean(defaultChecked));
    const checked = isControlled ? Boolean(checkedProp) : uncontrolled;

    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate, checked]);

    const resolvedValidation: CheckboxValidation =
      validation !== "none" ? validation : errorMessage ? "error" : "none";

    const messageConfigured = Boolean(errorMessage);
    const reserveFooter = stableMessages ?? messageConfigured;

    const describedBy = [
      description ? descId : null,
      resolvedValidation === "error" && errorMessage ? errorId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const commit = (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onCheckedChange?.(next);
    };

    const showMark = indeterminate || checked;

    return (
      <div
        className={cx(
          "dk-field",
          "dk-checkbox",
          SIZE_CLASS[size],
          disabled && "dk-checkbox--disabled",
          checked && !indeterminate && "dk-checkbox--checked",
          indeterminate && "dk-checkbox--indeterminate",
          !checked && !indeterminate && "dk-checkbox--unchecked",
          resolvedValidation === "error" && "dk-field--error",
          reserveFooter && "dk-field--stable-messages",
          className
        )}
        data-size={size}
        data-checked={checked && !indeterminate ? true : undefined}
        data-indeterminate={indeterminate || undefined}
        data-validation={resolvedValidation}
        data-disabled={disabled || undefined}
      >
        <label
          className={cx("dk-checkbox__row", hideLabel && "dk-checkbox__row--label-sr")}
          htmlFor={inputId}
        >
          <span className="dk-checkbox__hit">
            <input
              {...rest}
              ref={setRefs}
              id={inputId}
              className="dk-checkbox__input"
              type="checkbox"
              name={name}
              value={value}
              checked={checked}
              disabled={disabled}
              required={required}
              aria-checked={indeterminate ? "mixed" : checked}
              aria-invalid={resolvedValidation === "error" || undefined}
              aria-required={required || undefined}
              aria-describedby={describedBy || undefined}
              aria-label={
                !label || hideLabel
                  ? ariaLabel ?? (typeof label === "string" ? label : undefined)
                  : ariaLabel
              }
              aria-labelledby={
                !hideLabel && label && !ariaLabel ? labelId : ariaLabelledBy
              }
              onChange={(event) => {
                commit(event.target.checked);
              }}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
            />
            <span
              className={cx(
                "dk-checkbox__box",
                showMark && "dk-checkbox__box--marked"
              )}
              aria-hidden="true"
            >
              {indeterminate ? <IndeterminateIcon /> : checked ? <CheckIcon /> : null}
            </span>
          </span>

          {label || description ? (
            <span className="dk-checkbox__copy">
              {label ? (
                <span className="dk-checkbox__label-row">
                  <span
                    className={cx(
                      "dk-checkbox__label",
                      hideLabel && "dk-checkbox__label--sr"
                    )}
                    id={labelId}
                  >
                    {label}
                  </span>
                  {required ? (
                    <span className="dk-checkbox__required" aria-hidden="true">
                      {requiredIndicator}
                    </span>
                  ) : null}
                  {!required && optional ? (
                    <span className="dk-checkbox__optional">{optionalLabel}</span>
                  ) : null}
                </span>
              ) : null}
              {description ? (
                <span id={descId} className="dk-checkbox__description">
                  {description}
                </span>
              ) : null}
            </span>
          ) : null}
        </label>

        <div className="dk-field__footer">
          <div className="dk-field__messages">
            {resolvedValidation === "error" && errorMessage ? (
              <p id={errorId} className="dk-field__message dk-field__message--error" role="alert">
                <span className="dk-field__message-icon" aria-hidden="true">
                  <StatusIcon />
                </span>
                <span>{errorMessage}</span>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
