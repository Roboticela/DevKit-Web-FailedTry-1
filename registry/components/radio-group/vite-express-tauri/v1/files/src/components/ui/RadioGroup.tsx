import * as React from "react";
import { Radio, type RadioSize, type RadioValidation } from "./Radio";

export type RadioGroupOrientation = "vertical" | "horizontal" | "responsive";

export type RadioGroupSize = RadioSize;

export type RadioGroupValidation = RadioValidation;

export interface RadioGroupItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
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
  /** Disables every option. */
  disabled?: boolean;
  /**
   * Layout of options. Default `vertical`.
   * `horizontal` only for short labels; `responsive` stacks on compact / mobile.
   */
  orientation?: RadioGroupOrientation;
  /** Controlled selected value, or `null` when none selected. */
  value?: string | null;
  /** Uncontrolled initial selection. */
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  /** Declarative options. Prefer this for keyboard wiring. */
  items?: RadioGroupItem[];
  /**
   * Custom radio children when not using `items`.
   * Group provides chrome only — manage selection yourself.
   */
  children?: React.ReactNode;
  /** Shared `name` for form submission. Auto-generated when omitted. */
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
 * Radio Group (ID 024) — mutually exclusive collection of options.
 *
 * Only one option may be selected. Do not use when multiple values are allowed
 * (use Checkbox Group). Tab enters/leaves; arrows move and select; Space selects.
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
      defaultValue = null,
      onValueChange,
      items,
      children,
      name: nameProp,
      stableMessages,
      className,
      id: idProp,
      onKeyDown,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-radio-group-${reactId}`;
    const labelId = `${rootId}-label`;
    const descId = `${rootId}-desc`;
    const errorId = `${rootId}-error`;
    const name = nameProp ?? rootId;

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState<string | null>(defaultValue);
    const selected = isControlled ? valueProp! : uncontrolled;

    const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

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

    const enabledIndexes = React.useMemo(() => {
      if (!items) return [] as number[];
      return items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !item.disabled && !disabled)
        .map(({ index }) => index);
    }, [items, disabled]);

    const focusIndex = (index: number) => {
      const node = inputRefs.current[index];
      node?.focus();
    };

    const moveSelection = (fromIndex: number, direction: 1 | -1) => {
      if (enabledIndexes.length === 0) return;
      const pos = enabledIndexes.indexOf(fromIndex);
      const start = pos === -1 ? 0 : pos;
      const nextPos =
        (start + direction + enabledIndexes.length * 10) % enabledIndexes.length;
      const nextIndex = enabledIndexes[nextPos];
      const item = items?.[nextIndex];
      if (!item) return;
      commit(item.value);
      focusIndex(nextIndex);
    };

    const tabStopIndex = React.useMemo(() => {
      if (!items || items.length === 0) return -1;
      if (selected != null) {
        const selectedIndex = items.findIndex((item) => item.value === selected);
        if (
          selectedIndex >= 0 &&
          !items[selectedIndex].disabled &&
          !disabled
        ) {
          return selectedIndex;
        }
      }
      return enabledIndexes[0] ?? -1;
    }, [items, selected, enabledIndexes, disabled]);

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
        onKeyDown={onKeyDown}
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

        <div className="dk-radio-group__list" role="presentation">
          {items
            ? items.map((item, index) => {
                const isSelected = selected === item.value;
                const itemDisabled = disabled || Boolean(item.disabled);
                return (
                  <Radio
                    key={item.value}
                    ref={(node) => {
                      inputRefs.current[index] = node;
                    }}
                    size={size}
                    name={name}
                    value={item.value}
                    label={item.label}
                    description={item.description}
                    checked={isSelected}
                    disabled={itemDisabled}
                    tabIndex={itemDisabled ? -1 : index === tabStopIndex ? 0 : -1}
                    stableMessages={false}
                    onCheckedChange={() => commit(item.value)}
                    onKeyDown={(event) => {
                      if (itemDisabled) return;
                      if (
                        event.key === "ArrowDown" ||
                        event.key === "ArrowRight"
                      ) {
                        event.preventDefault();
                        moveSelection(index, 1);
                        return;
                      }
                      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                        event.preventDefault();
                        moveSelection(index, -1);
                        return;
                      }
                      if (event.key === "Home") {
                        event.preventDefault();
                        const first = enabledIndexes[0];
                        if (first !== undefined && items[first]) {
                          commit(items[first].value);
                          focusIndex(first);
                        }
                        return;
                      }
                      if (event.key === "End") {
                        event.preventDefault();
                        const last = enabledIndexes[enabledIndexes.length - 1];
                        if (last !== undefined && items[last]) {
                          commit(items[last].value);
                          focusIndex(last);
                        }
                      }
                    }}
                  />
                );
              })
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

export default RadioGroup;
