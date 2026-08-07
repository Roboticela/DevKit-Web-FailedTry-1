import * as React from "react";

export type ChoiceChipsSize = "sm" | "md" | "lg";

export type ChoiceChipsSelectionMode = "single" | "multiple";

export type ChoiceChipsValidation = "none" | "error" | "success" | "warning";

export interface ChoiceChipOption {
  value: string;
  label: string;
  /** Meaningful leading icon only — never decorative noise. */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ChoiceChipsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Accessible name for the chip group. */
  label: string;
  hideLabel?: boolean;
  description?: string;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  validation?: ChoiceChipsValidation;
  size?: ChoiceChipsSize;
  required?: boolean;
  optional?: boolean;
  requiredIndicator?: React.ReactNode;
  optionalLabel?: string;
  disabled?: boolean;
  options: ChoiceChipOption[];
  /**
   * `single` — mutually exclusive (radiogroup).
   * `multiple` — each chip toggles independently.
   */
  selectionMode?: ChoiceChipsSelectionMode;
  /**
   * Selected value(s).
   * Single: `string | null`. Multiple: `string[]`.
   */
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onValueChange?: (value: string | string[] | null) => void;
  /** Allow clearing the single selection by pressing the selected chip again. */
  allowDeselect?: boolean;
  name?: string;
  fullWidth?: boolean;
  stableMessages?: boolean;
}

const SIZE_CLASS: Record<ChoiceChipsSize, string> = {
  sm: "dk-choice-chips--sm",
  md: "dk-choice-chips--md",
  lg: "dk-choice-chips--lg",
};

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

function SelectedMark() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

function normalizeSingle(value: string | string[] | null | undefined): string | null {
  if (value == null) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function normalizeMultiple(value: string | string[] | null | undefined): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

/**
 * Choice Chips (ID 029) — compact selection among a small related set.
 *
 * Visually distinct from Button, Tag, Badge, Checkbox, and Radio.
 * Selection-only — do not mix action semantics in the same group.
 * Prefer small option sets; avoid large collections (use Multi-Select / Select).
 */
export const ChoiceChips = React.forwardRef<HTMLDivElement, ChoiceChipsProps>(
  function ChoiceChips(
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
      disabled = false,
      options,
      selectionMode = "single",
      value: valueProp,
      defaultValue,
      onValueChange,
      allowDeselect = false,
      name,
      fullWidth = true,
      stableMessages,
      id: idProp,
      className,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-choice-chips-${reactId}`;
    const labelId = `${rootId}-label`;
    const descId = `${rootId}-desc`;
    const helpId = `${rootId}-help`;
    const errorId = `${rootId}-error`;
    const successId = `${rootId}-success`;
    const warningId = `${rootId}-warning`;

    const isMultiple = selectionMode === "multiple";
    const isControlled = valueProp !== undefined;

    const [uncontrolledSingle, setUncontrolledSingle] = React.useState<string | null>(
      () => normalizeSingle(defaultValue)
    );
    const [uncontrolledMulti, setUncontrolledMulti] = React.useState<string[]>(() =>
      normalizeMultiple(defaultValue)
    );

    const singleValue = isControlled
      ? normalizeSingle(valueProp)
      : uncontrolledSingle;
    const multiValue = isControlled
      ? normalizeMultiple(valueProp)
      : uncontrolledMulti;

    const selectedSet = React.useMemo(() => {
      if (isMultiple) return new Set(multiValue);
      return new Set(singleValue != null ? [singleValue] : []);
    }, [isMultiple, multiValue, singleValue]);

    const listRef = React.useRef<HTMLDivElement | null>(null);

    const enabledIndexes = React.useMemo(
      () =>
        options
          .map((opt, index) => ({ opt, index }))
          .filter(({ opt }) => !opt.disabled && !disabled)
          .map(({ index }) => index),
      [options, disabled]
    );

    const validationState: ChoiceChipsValidation =
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
      validationState === "error" && errorMessage ? errorId : null,
      validationState === "success" && successMessage ? successId : null,
      validationState === "warning" && warningMessage ? warningId : null,
      validationState === "none" && helpText ? helpId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const commitSingle = (next: string | null) => {
      if (!isControlled) setUncontrolledSingle(next);
      onValueChange?.(next);
    };

    const commitMulti = (next: string[]) => {
      if (!isControlled) setUncontrolledMulti(next);
      onValueChange?.(next);
    };

    const selectIndex = (index: number) => {
      const opt = options[index];
      if (!opt || opt.disabled || disabled) return;

      if (isMultiple) {
        const next = new Set(multiValue);
        if (next.has(opt.value)) next.delete(opt.value);
        else next.add(opt.value);
        commitMulti([...next]);
        return;
      }

      if (singleValue === opt.value && allowDeselect) {
        commitSingle(null);
        return;
      }
      commitSingle(opt.value);
    };

    const focusChip = (index: number) => {
      const el = listRef.current?.querySelector<HTMLElement>(
        `[data-index="${index}"]`
      );
      el?.focus();
    };

    const moveFocus = (fromIndex: number, direction: 1 | -1) => {
      if (enabledIndexes.length === 0) return;
      const pos = enabledIndexes.indexOf(fromIndex);
      const start = pos === -1 ? 0 : pos;
      const next =
        enabledIndexes[
          (start + direction + enabledIndexes.length * 10) % enabledIndexes.length
        ];
      focusChip(next);
    };

    const onChipKeyDown = (
      event: React.KeyboardEvent<HTMLButtonElement>,
      index: number
    ) => {
      if (disabled) return;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        moveFocus(index, 1);
        return;
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        moveFocus(index, -1);
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        if (enabledIndexes[0] !== undefined) focusChip(enabledIndexes[0]);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        const last = enabledIndexes[enabledIndexes.length - 1];
        if (last !== undefined) focusChip(last);
        return;
      }
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        selectIndex(index);
      }
    };

    const groupRole = isMultiple ? "group" : "radiogroup";

    return (
      <div
        {...rest}
        ref={ref}
        id={rootId}
        className={cx(
          "dk-field",
          "dk-choice-chips",
          SIZE_CLASS[size],
          fullWidth && "dk-field--full",
          disabled && "dk-choice-chips--disabled",
          isMultiple && "dk-choice-chips--multiple",
          !isMultiple && "dk-choice-chips--single",
          validationState !== "none" && `dk-field--${validationState}`,
          reserveFooter && "dk-field--stable-messages",
          className
        )}
        data-size={size}
        data-selection-mode={selectionMode}
        data-validation={validationState}
        data-disabled={disabled || undefined}
      >
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

        {description ? (
          <p id={descId} className="dk-field__description">
            {description}
          </p>
        ) : null}

        <div
          ref={listRef}
          className="dk-choice-chips__list"
          role={groupRole}
          aria-labelledby={labelId}
          aria-describedby={describedBy || undefined}
          aria-required={required || undefined}
          aria-disabled={disabled || undefined}
          aria-invalid={validationState === "error" || undefined}
        >
          {options.map((opt, index) => {
            const selected = selectedSet.has(opt.value);
            const chipDisabled = disabled || Boolean(opt.disabled);
            // Roving tabindex: selected (or first enabled) is tabbable in single mode;
            // each enabled chip is tabbable in multi mode for independent toggles,
            // but still use roving for efficiency — first selected or first enabled.
            const focusTarget =
              enabledIndexes.length === 0
                ? false
                : isMultiple
                  ? index === enabledIndexes[0]
                  : singleValue != null
                    ? opt.value === singleValue
                    : index === enabledIndexes[0];

            return (
              <button
                key={opt.value}
                type="button"
                id={`${rootId}-chip-${index}`}
                data-index={index}
                className={cx(
                  "dk-choice-chips__chip",
                  selected && "dk-choice-chips__chip--selected",
                  chipDisabled && "dk-choice-chips__chip--disabled"
                )}
                disabled={chipDisabled}
                tabIndex={chipDisabled ? -1 : focusTarget ? 0 : -1}
                role={isMultiple ? "checkbox" : "radio"}
                aria-checked={selected}
                aria-disabled={chipDisabled || undefined}
                onClick={() => selectIndex(index)}
                onKeyDown={(event) => onChipKeyDown(event, index)}
                onFocus={() => {
                  // Keep roving tabindex on the focused chip
                  const buttons =
                    listRef.current?.querySelectorAll<HTMLButtonElement>(
                      ".dk-choice-chips__chip:not(:disabled)"
                    );
                  buttons?.forEach((btn) => {
                    btn.tabIndex = btn === document.activeElement ? 0 : -1;
                  });
                }}
              >
                {selected ? (
                  <span className="dk-choice-chips__mark" aria-hidden="true">
                    <SelectedMark />
                  </span>
                ) : null}
                {opt.icon ? (
                  <span className="dk-choice-chips__icon" aria-hidden="true">
                    {opt.icon}
                  </span>
                ) : null}
                <span className="dk-choice-chips__label">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {name
          ? isMultiple
            ? multiValue.map((v) => (
                <input key={v} type="hidden" name={name} value={v} />
              ))
            : singleValue != null
              ? (
                  <input type="hidden" name={name} value={singleValue} />
                )
              : null
          : null}

        <div className="dk-field__footer">
          <div className="dk-field__messages">
            {validationState === "error" && errorMessage ? (
              <p id={errorId} className="dk-field__message dk-field__message--error" role="alert">
                <span className="dk-field__message-icon" aria-hidden="true">
                  <StatusIcon kind="error" />
                </span>
                <span>{errorMessage}</span>
              </p>
            ) : null}
            {validationState === "success" && successMessage ? (
              <p id={successId} className="dk-field__message dk-field__message--success">
                <span className="dk-field__message-icon" aria-hidden="true">
                  <StatusIcon kind="success" />
                </span>
                <span>{successMessage}</span>
              </p>
            ) : null}
            {validationState === "warning" && warningMessage ? (
              <p id={warningId} className="dk-field__message dk-field__message--warning">
                <span className="dk-field__message-icon" aria-hidden="true">
                  <StatusIcon kind="warning" />
                </span>
                <span>{warningMessage}</span>
              </p>
            ) : null}
            {validationState === "none" && helpText ? (
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

ChoiceChips.displayName = "ChoiceChips";

export default ChoiceChips;
