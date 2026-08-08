import * as React from "react";
import { Radio, type RadioSize, type RadioValidation } from "./Radio";

export type RadioGroupOrientation = "vertical" | "horizontal" | "responsive";

export type RadioGroupSize = RadioSize;

export type RadioGroupValidation = RadioValidation;

export interface RadioGroupItem {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  /** Leading visual — prefer Icon-wrapped SVG. */
  icon?: React.ReactNode;
  /** Trailing meta (e.g. recommended Badge). */
  trailing?: React.ReactNode;
}

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
  /** Visible group label — exposed via `aria-labelledby`. */
  label: string;
  hideLabel?: boolean;
  description?: string;
  errorMessage?: string;
  validation?: RadioGroupValidation;
  size?: RadioGroupSize;
  required?: boolean;
  optional?: boolean;
  requiredIndicator?: React.ReactNode;
  optionalLabel?: string;
  disabled?: boolean;
  orientation?: RadioGroupOrientation;
  /** Controlled selected value. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Declarative items. Prefer this for wiring. */
  items?: RadioGroupItem[];
  /** Custom Radio children when not using `items`. */
  children?: React.ReactNode;
  /** Shared `name` for native form submission. */
  name?: string;
  stableMessages?: boolean;
}

const SIZE_CLASS: Record<RadioGroupSize, string> = {
  xs: "dk-radio-group--xs",
  sm: "dk-radio-group--sm",
  md: "dk-radio-group--md",
  lg: "dk-radio-group--lg",
  xl: "dk-radio-group--xl",
};

const ORIENTATION_CLASS: Record<RadioGroupOrientation, string> = {
  vertical: "dk-radio-group--vertical",
  horizontal: "dk-radio-group--horizontal",
  responsive: "dk-radio-group--responsive",
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
 * Radio Group — mutually exclusive single-select choices.
 * role="radiogroup". Compose Radio items — do not invent custom selection controls.
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
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
      orientation = "vertical",
      value: valueProp,
      defaultValue = "",
      onValueChange,
      items,
      children,
      name,
      stableMessages,
      className,
      id: idProp,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-radio-group-${reactId}`;
    const labelId = `${rootId}-label`;
    const descId = `${rootId}-desc`;
    const errorId = `${rootId}-error`;
    const listId = `${rootId}-list`;
    const groupName = name ?? rootId;

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const selected = isControlled ? valueProp! : uncontrolled;

    const resolvedValidation: RadioGroupValidation =
      validation !== "none" ? validation : errorMessage ? "error" : "none";

    const messageConfigured = Boolean(errorMessage);
    const reserveFooter = stableMessages ?? messageConfigured;

    const describedBy = [
      description ? descId : null,
      resolvedValidation === "error" && errorMessage ? errorId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const commit = (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    };

    return (
      <div
        {...rest}
        ref={ref}
        id={rootId}
        role="radiogroup"
        className={cx(
          "dk-field",
          "dk-radio-group",
          SIZE_CLASS[size],
          ORIENTATION_CLASS[orientation],
          disabled && "dk-radio-group--disabled",
          resolvedValidation === "error" && "dk-field--error",
          reserveFooter && "dk-field--stable-messages",
          className
        )}
        data-size={size}
        data-orientation={orientation}
        data-validation={resolvedValidation}
        data-disabled={disabled || undefined}
        aria-labelledby={labelId}
        aria-describedby={describedBy || undefined}
        aria-required={required || undefined}
        aria-invalid={resolvedValidation === "error" || undefined}
        aria-disabled={disabled || undefined}
      >
        <div className={cx("dk-radio-group__header", hideLabel && "dk-radio-group__header--sr")}>
          <div className="dk-radio-group__label-row">
            <span className="dk-radio-group__label" id={labelId}>
              {label}
            </span>
            {required ? (
              <span className="dk-radio-group__required" aria-hidden="true">
                {requiredIndicator}
              </span>
            ) : null}
            {!required && optional ? (
              <span className="dk-radio-group__optional">{optionalLabel}</span>
            ) : null}
          </div>
          {description ? (
            <p id={descId} className="dk-radio-group__description">
              {description}
            </p>
          ) : null}
        </div>

        <div className="dk-radio-group__list" id={listId} role="presentation">
          {items
            ? items.map((item) => (
                <Radio
                  key={item.value}
                  size={size}
                  name={groupName}
                  value={item.value}
                  label={item.label}
                  description={item.description}
                  icon={item.icon}
                  trailing={item.trailing}
                  checked={selected === item.value}
                  disabled={disabled || Boolean(item.disabled)}
                  onCheckedChange={(on) => {
                    if (on) commit(item.value);
                  }}
                  stableMessages={false}
                />
              ))
            : children}
        </div>

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

RadioGroup.displayName = "RadioGroup";

export { Radio };
export default RadioGroup;
