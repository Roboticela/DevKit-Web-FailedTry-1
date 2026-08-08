import * as React from "react";

export type RadioSize = "xs" | "sm" | "md" | "lg" | "xl";

export type RadioValidation = "none" | "error";

export interface RadioProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "checked" | "defaultChecked" | "onChange"
  > {
  /** Visible label. Clicking/tapping the label selects the control. */
  label?: React.ReactNode;
  /** Hide the visible label while keeping it for assistive tech. */
  hideLabel?: boolean;
  /** Supporting text under the label. */
  description?: React.ReactNode;
  errorMessage?: string;
  validation?: RadioValidation;
  size?: RadioSize;
  required?: boolean;
  disabled?: boolean;
  /** Controlled selected state for this option. */
  checked?: boolean;
  /** Uncontrolled initial selected state. */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Leading visual — prefer Icon-wrapped SVG. */
  icon?: React.ReactNode;
  /** Trailing meta (e.g. recommended Badge). */
  trailing?: React.ReactNode;
  /** Stable message footer. Default: true when errorMessage set. */
  stableMessages?: boolean;
}

const SIZE_CLASS: Record<RadioSize, string> = {
  xs: "dk-radio--xs",
  sm: "dk-radio--sm",
  md: "dk-radio--md",
  lg: "dk-radio--lg",
  xl: "dk-radio--xl",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
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
 * Radio — single option within a Radio Group.
 * Mutually exclusive selection. Do not invent custom radio chrome.
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    label,
    hideLabel = false,
    description,
    errorMessage,
    validation = "none",
    size = "md",
    required = false,
    disabled = false,
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    icon,
    trailing,
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
  const inputId = idProp ?? `dk-radio-${reactId}`;
  const labelId = `${inputId}-label`;
  const descId = `${inputId}-desc`;
  const errorId = `${inputId}-error`;

  const isControlled = checkedProp !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(Boolean(defaultChecked));
  const checked = isControlled ? Boolean(checkedProp) : uncontrolled;

  const resolvedValidation: RadioValidation =
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

  return (
    <div
      className={cx(
        "dk-field",
        "dk-radio",
        SIZE_CLASS[size],
        disabled && "dk-radio--disabled",
        checked && "dk-radio--checked",
        !checked && "dk-radio--unchecked",
        resolvedValidation === "error" && "dk-field--error",
        reserveFooter && "dk-field--stable-messages",
        className
      )}
      data-size={size}
      data-checked={checked || undefined}
      data-validation={resolvedValidation}
      data-disabled={disabled || undefined}
    >
      <label
        className={cx("dk-radio__row", hideLabel && "dk-radio__row--label-sr")}
        htmlFor={inputId}
      >
        <span className="dk-radio__hit">
          <input
            {...rest}
            ref={ref}
            id={inputId}
            className="dk-radio__input"
            type="radio"
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            required={required}
            aria-invalid={resolvedValidation === "error" || undefined}
            aria-required={required || undefined}
            aria-describedby={describedBy || undefined}
            aria-label={
              !label || hideLabel
                ? ariaLabel ?? (typeof label === "string" ? label : undefined)
                : ariaLabel
            }
            aria-labelledby={!hideLabel && label && !ariaLabel ? labelId : ariaLabelledBy}
            onChange={(event) => {
              if (event.target.checked) commit(true);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
          <span
            className={cx("dk-radio__control", checked && "dk-radio__control--checked")}
            aria-hidden="true"
          >
            <span className="dk-radio__dot" />
          </span>
        </span>

        {icon ? <span className="dk-radio__icon">{icon}</span> : null}

        {label || description ? (
          <span className="dk-radio__copy">
            {label ? (
              <span
                className={cx("dk-radio__label", hideLabel && "dk-radio__label--sr")}
                id={labelId}
              >
                {label}
              </span>
            ) : null}
            {description ? (
              <span id={descId} className="dk-radio__description">
                {description}
              </span>
            ) : null}
          </span>
        ) : null}

        {trailing ? <span className="dk-radio__trailing">{trailing}</span> : null}
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
});

Radio.displayName = "Radio";
export default Radio;
