import * as React from "react";

export type SwitchSize = "xs" | "sm" | "md" | "lg" | "xl";

export type SwitchValidation = "none" | "error";

export interface SwitchProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "onChange" | "value" | "type"
  > {
  /** Visible label. Clicking/tapping the label toggles the switch. */
  label?: string;
  /** Hide the visible label while keeping an accessible name. */
  hideLabel?: boolean;
  /** Supporting text under the label. */
  description?: string;
  /**
   * Visible status cue (e.g. “On” / “Off”). Reinforces state beyond thumb position.
   * Pass `false` to hide. Defaults to On/Off when omitted.
   */
  status?: string | false;
  /** Labels used when `status` is auto-generated. */
  onLabel?: string;
  offLabel?: string;
  errorMessage?: string;
  validation?: SwitchValidation;
  size?: SwitchSize;
  disabled?: boolean;
  /**
   * Controlled on/off. Prefer Switch only for immediate binary settings —
   * not as a Checkbox replacement, navigation, or multi-choice control.
   */
  checked?: boolean;
  /** Uncontrolled initial state. */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Async in-flight state. Blocks toggles, sets `aria-busy`, shows progress.
   * Keep `checked` aligned with the real application result on success/failure.
   */
  loading?: boolean;
  loadingLabel?: string;
  /** Stable message footer to limit layout jump. */
  stableMessages?: boolean;
}

const SIZE_CLASS: Record<SwitchSize, string> = {
  xs: "dk-switch--xs",
  sm: "dk-switch--sm",
  md: "dk-switch--md",
  lg: "dk-switch--lg",
  xl: "dk-switch--xl",
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
 * Switch (ID 025) — immediate binary ON/OFF setting.
 *
 * Do not use for independent form multi-select (Checkbox), mutually exclusive
 * choices (Radio), navigation, form submission, or large option sets.
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch(
    {
      label,
      hideLabel = false,
      description,
      status,
      onLabel = "On",
      offLabel = "Off",
      errorMessage,
      validation = "none",
      size = "md",
      disabled = false,
      checked: checkedProp,
      defaultChecked = false,
      onCheckedChange,
      loading = false,
      loadingLabel = "Updating",
      stableMessages,
      id: idProp,
      className,
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
    const controlId = idProp ?? `dk-switch-${reactId}`;
    const labelId = `${controlId}-label`;
    const descId = `${controlId}-desc`;
    const statusId = `${controlId}-status`;
    const errorId = `${controlId}-error`;
    const loadingId = `${controlId}-loading`;

    const isControlled = checkedProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(Boolean(defaultChecked));
    const checked = isControlled ? Boolean(checkedProp) : uncontrolled;

    const resolvedValidation: SwitchValidation =
      validation !== "none" ? validation : errorMessage ? "error" : "none";

    const messageConfigured = Boolean(errorMessage);
    const reserveFooter = stableMessages ?? messageConfigured;

    const interactive = !disabled && !loading;

    const resolvedStatus =
      status === false ? null : status ?? (checked ? onLabel : offLabel);

    const describedBy = [
      description ? descId : null,
      resolvedStatus ? statusId : null,
      loading ? loadingId : null,
      resolvedValidation === "error" && errorMessage ? errorId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const commit = (next: boolean) => {
      if (!interactive) return;
      if (!isControlled) setUncontrolled(next);
      onCheckedChange?.(next);
    };

    const toggle = () => commit(!checked);

    return (
      <div
        className={cx(
          "dk-field",
          "dk-switch",
          SIZE_CLASS[size],
          checked && "dk-switch--on",
          !checked && "dk-switch--off",
          disabled && "dk-switch--disabled",
          loading && "dk-switch--loading",
          resolvedValidation === "error" && "dk-field--error",
          reserveFooter && "dk-field--stable-messages",
          className
        )}
        data-size={size}
        data-state={checked ? "on" : "off"}
        data-loading={loading || undefined}
        data-validation={resolvedValidation}
        data-disabled={disabled || undefined}
      >
        <div className="dk-switch__row">
          {label || description ? (
            <div className={cx("dk-switch__copy", hideLabel && "dk-switch__copy--sr")}>
              {label ? (
                <label className="dk-switch__label" id={labelId} htmlFor={controlId}>
                  {label}
                </label>
              ) : null}
              {description ? (
                <span id={descId} className="dk-switch__description">
                  {description}
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="dk-switch__end">
            {resolvedStatus ? (
              <span id={statusId} className="dk-switch__status" aria-hidden="true">
                {resolvedStatus}
              </span>
            ) : null}

            <span className="dk-switch__hit">
              <button
                {...rest}
                ref={ref}
                id={controlId}
                type="button"
                role="switch"
                className="dk-switch__control"
                aria-checked={checked}
                aria-busy={loading || undefined}
                aria-invalid={resolvedValidation === "error" || undefined}
                aria-disabled={disabled || loading || undefined}
                aria-describedby={describedBy || undefined}
                aria-label={
                  !label || hideLabel
                    ? ariaLabel ?? (typeof label === "string" ? label : undefined)
                    : ariaLabel
                }
                aria-labelledby={
                  !hideLabel && label && !ariaLabel ? labelId : ariaLabelledBy
                }
                disabled={disabled || loading}
                onClick={() => toggle()}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={(event) => {
                  onKeyDown?.(event);
                  if (event.defaultPrevented || !interactive) return;
                  if (event.key === " " || event.key === "Enter") {
                    event.preventDefault();
                    toggle();
                  }
                }}
              >
                <span className="dk-switch__track" aria-hidden="true">
                  <span className="dk-switch__thumb">
                    {loading ? (
                      <span className="dk-switch__spinner" aria-hidden="true" />
                    ) : null}
                  </span>
                </span>
              </button>
            </span>
          </div>
        </div>

        {loading ? (
          <span id={loadingId} className="dk-switch__sr-status" role="status">
            {loadingLabel}
          </span>
        ) : null}

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

Switch.displayName = "Switch";

export default Switch;
