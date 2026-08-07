import * as React from "react";
import { Checkbox, type CheckboxSize, type CheckboxValidation } from "./Checkbox";

export type CheckboxGroupOrientation = "vertical" | "horizontal" | "responsive";

export type CheckboxGroupSize = CheckboxSize;

export type CheckboxGroupValidation = CheckboxValidation;

export interface CheckboxGroupItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
  /** Visible group label — exposed to assistive tech via `aria-labelledby`. */
  label: string;
  hideLabel?: boolean;
  description?: string;
  errorMessage?: string;
  validation?: CheckboxGroupValidation;
  size?: CheckboxGroupSize;
  required?: boolean;
  optional?: boolean;
  requiredIndicator?: React.ReactNode;
  optionalLabel?: string;
  /** Disables every item and select-all. */
  disabled?: boolean;
  /**
   * Layout of items. Default `vertical`.
   * `horizontal` only when labels stay short; `responsive` stacks on compact.
   */
  orientation?: CheckboxGroupOrientation;
  /** Controlled selected values. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Declarative items. Prefer this for select-all and value wiring. */
  items?: CheckboxGroupItem[];
  /**
   * Custom checkbox children when not using `items`.
   * Each child remains independently accessible — group only provides chrome.
   */
  children?: React.ReactNode;
  /** Shared `name` for native form submission. */
  name?: string;
  /**
   * Show a derived parent “Select all” control above the items.
   * Pass a string for a custom label (default: “Select all”).
   */
  selectAll?: boolean | string;
  selectAllLabel?: string;
  stableMessages?: boolean;
}

const SIZE_CLASS: Record<CheckboxGroupSize, string> = {
  xs: "dk-checkbox-group--xs",
  sm: "dk-checkbox-group--sm",
  md: "dk-checkbox-group--md",
  lg: "dk-checkbox-group--lg",
  xl: "dk-checkbox-group--xl",
};

const ORIENTATION_CLASS: Record<CheckboxGroupOrientation, string> = {
  vertical: "dk-checkbox-group--vertical",
  horizontal: "dk-checkbox-group--horizontal",
  responsive: "dk-checkbox-group--responsive",
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

function toggleValue(list: string[], item: string, on: boolean): string[] {
  if (on) {
    return list.includes(item) ? list : [...list, item];
  }
  return list.filter((v) => v !== item);
}

/**
 * Checkbox Group (ID 022) — related independent multi-select choices.
 *
 * Select-all is derived from children (checked / unchecked / indeterminate) —
 * never a third persistent selection value.
 */
export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroup(
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
      defaultValue = [],
      onValueChange,
      items,
      children,
      name,
      selectAll = false,
      selectAllLabel,
      stableMessages,
      className,
      id: idProp,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-checkbox-group-${reactId}`;
    const labelId = `${rootId}-label`;
    const descId = `${rootId}-desc`;
    const errorId = `${rootId}-error`;
    const listId = `${rootId}-list`;

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue);
    const selected = isControlled ? valueProp! : uncontrolled;

    const resolvedValidation: CheckboxGroupValidation =
      validation !== "none" ? validation : errorMessage ? "error" : "none";

    const messageConfigured = Boolean(errorMessage);
    const reserveFooter = stableMessages ?? messageConfigured;

    const describedBy = [
      description ? descId : null,
      resolvedValidation === "error" && errorMessage ? errorId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const enabledValues = React.useMemo(
      () => (items ?? []).filter((item) => !item.disabled).map((item) => item.value),
      [items]
    );

    const selectedEnabled = enabledValues.filter((v) => selected.includes(v));
    const allSelected =
      enabledValues.length > 0 && selectedEnabled.length === enabledValues.length;
    const noneSelected = selectedEnabled.length === 0;
    const parentIndeterminate = !allSelected && !noneSelected;

    const showSelectAll = Boolean(selectAll) && Array.isArray(items) && items.length > 0;
    const resolvedSelectAllLabel =
      typeof selectAll === "string"
        ? selectAll
        : selectAllLabel ?? "Select all";

    const commit = (next: string[]) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    };

    const setItem = (itemValue: string, on: boolean) => {
      commit(toggleValue(selected, itemValue, on));
    };

    const setAll = (on: boolean) => {
      if (on) {
        const merged = new Set(selected);
        enabledValues.forEach((v) => merged.add(v));
        commit([...merged]);
      } else {
        commit(selected.filter((v) => !enabledValues.includes(v)));
      }
    };

    return (
      <div
        {...rest}
        ref={ref}
        id={rootId}
        role="group"
        className={cx(
          "dk-field",
          "dk-checkbox-group",
          SIZE_CLASS[size],
          ORIENTATION_CLASS[orientation],
          disabled && "dk-checkbox-group--disabled",
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
        <div className={cx("dk-checkbox-group__header", hideLabel && "dk-checkbox-group__header--sr")}>
          <div className="dk-checkbox-group__label-row">
            <span className="dk-checkbox-group__label" id={labelId}>
              {label}
            </span>
            {required ? (
              <span className="dk-checkbox-group__required" aria-hidden="true">
                {requiredIndicator}
              </span>
            ) : null}
            {!required && optional ? (
              <span className="dk-checkbox-group__optional">{optionalLabel}</span>
            ) : null}
          </div>
          {description ? (
            <p id={descId} className="dk-checkbox-group__description">
              {description}
            </p>
          ) : null}
        </div>

        <div className="dk-checkbox-group__body">
          {showSelectAll ? (
            <div className="dk-checkbox-group__select-all">
              <Checkbox
                size={size}
                label={resolvedSelectAllLabel}
                checked={allSelected}
                indeterminate={parentIndeterminate}
                disabled={disabled || enabledValues.length === 0}
                onCheckedChange={setAll}
                stableMessages={false}
              />
            </div>
          ) : null}

          <div className="dk-checkbox-group__list" id={listId} role="presentation">
            {items
              ? items.map((item) => (
                  <Checkbox
                    key={item.value}
                    size={size}
                    name={name}
                    value={item.value}
                    label={item.label}
                    description={item.description}
                    checked={selected.includes(item.value)}
                    disabled={disabled || Boolean(item.disabled)}
                    onCheckedChange={(on) => setItem(item.value, on)}
                    stableMessages={false}
                  />
                ))
              : children}
          </div>
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

CheckboxGroup.displayName = "CheckboxGroup";

export default CheckboxGroup;
