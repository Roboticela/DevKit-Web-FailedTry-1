import * as React from "react";

export type ComboboxSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ComboboxValidation = "none" | "error" | "success" | "warning";

/**
 * Selection cardinality. Only `single` is implemented; `multiple` is reserved
 * for future Multi-Select composition without breaking the API.
 */
export type ComboboxSelectionMode = "single" | "multiple";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  /** Optional leading mark (flag, place icon, …). */
  icon?: React.ReactNode;
}

export type ComboboxFilterFn = (
  query: string,
  option: ComboboxOption
) => boolean;

export interface ComboboxProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "defaultValue" | "onChange"
  > {
  label?: string;
  hideLabel?: boolean;
  description?: string;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  validation?: ComboboxValidation;
  size?: ComboboxSize;
  required?: boolean;
  optional?: boolean;
  requiredIndicator?: React.ReactNode;
  optionalLabel?: string;
  disabled?: boolean;
  readOnly?: boolean;
  fullWidth?: boolean;
  stableMessages?: boolean;
  placeholder?: string;
  name?: string;
  /** Meaningful leading icon only. */
  leadingIcon?: React.ReactNode;
  clearable?: boolean;
  clearLabel?: string;
  listLabel?: string;

  /**
   * Selected option value (`null` when empty).
   * Independent of the editable input string when `allowsCustomValue` is false.
   */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;

  /** Controlled editable text. Typed value is never cleared merely because suggestions are empty. */
  inputValue?: string;
  defaultInputValue?: string;
  onInputChange?: (input: string) => void;

  /** Static / current suggestion list (parent updates for async). */
  options?: ComboboxOption[];

  /**
   * Client-side filter when `true` (default label match) or a custom predicate.
   * Set `false` when the parent fully owns filtering (typical async).
   */
  filter?: boolean | ComboboxFilterFn;

  /**
   * When `true`, Enter / blur can commit free text as the selected value.
   * When `false` (default), only a chosen option becomes the selection —
   * typed strings are not treated as valid selections automatically.
   */
  allowsCustomValue?: boolean;

  /** Async / remote suggestion loading. Slot is reserved to avoid layout shift. */
  loading?: boolean;
  loadingLabel?: string;
  noResultsLabel?: string;
  openOnFocus?: boolean;
  /** Debounce hint for parents driving async fetch (ms). Not applied internally. */
  debounceMs?: number;

  selectionMode?: ComboboxSelectionMode;
}

const SIZE_CLASS: Record<ComboboxSize, string> = {
  xs: "dk-combobox--xs",
  sm: "dk-combobox--sm",
  md: "dk-combobox--md",
  lg: "dk-combobox--lg",
  xl: "dk-combobox--xl",
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

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5.5 7.75 10 12.25l4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function defaultFilter(query: string, option: ComboboxOption) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    option.label.toLowerCase().includes(q) ||
    option.value.toLowerCase().includes(q) ||
    (option.description?.toLowerCase().includes(q) ?? false)
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Combobox (ID 027) — editable text + suggestions for searchable / type-ahead
 * selection. Not a Select: the input stays editable when used for search.
 */
export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
  function Combobox(
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
      readOnly = false,
      fullWidth = true,
      stableMessages,
      placeholder = "Search…",
      name,
      leadingIcon,
      clearable = true,
      clearLabel = "Clear",
      listLabel,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      inputValue: inputValueProp,
      defaultInputValue = "",
      onInputChange,
      options = [],
      filter = true,
      allowsCustomValue = false,
      loading = false,
      loadingLabel = "Loading suggestions",
      noResultsLabel = "No results found",
      openOnFocus = true,
      selectionMode = "single",
      debounceMs: _debounceMs,
      id: idProp,
      className,
      ...rest
    },
    ref
  ) {
    void selectionMode; // reserved for future multi composition
    void _debounceMs; // documented hint for async parents; not applied internally

    const reactId = React.useId();
    const rootId = idProp ?? `dk-combobox-${reactId}`;
    const inputId = `${rootId}-input`;
    const labelId = `${rootId}-label`;
    const descId = `${rootId}-desc`;
    const helpId = `${rootId}-help`;
    const errorId = `${rootId}-error`;
    const successId = `${rootId}-success`;
    const warningId = `${rootId}-warning`;
    const listboxId = `${rootId}-listbox`;
    const statusId = `${rootId}-status`;

    const isValueControlled = valueProp !== undefined;
    const isInputControlled = inputValueProp !== undefined;

    const [uncontrolledValue, setUncontrolledValue] = React.useState<string | null>(
      defaultValue
    );
    const [uncontrolledInput, setUncontrolledInput] = React.useState(defaultInputValue);
    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({});

    const selected = isValueControlled ? valueProp! : uncontrolledValue;
    const inputText = isInputControlled ? inputValueProp! : uncontrolledInput;

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const controlRef = React.useRef<HTMLDivElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const listRef = React.useRef<HTMLUListElement | null>(null);
    const inputTextRef = React.useRef(inputText);
    inputTextRef.current = inputText;
    const optionsRef = React.useRef(options);
    optionsRef.current = options;
    const allowsCustomRef = React.useRef(allowsCustomValue);
    allowsCustomRef.current = allowsCustomValue;
    const onValueChangeRef = React.useRef(onValueChange);
    onValueChangeRef.current = onValueChange;
    const onInputChangeRef = React.useRef(onInputChange);
    onInputChangeRef.current = onInputChange;
    const isValueControlledRef = React.useRef(isValueControlled);
    isValueControlledRef.current = isValueControlled;
    const isInputControlledRef = React.useRef(isInputControlled);
    isInputControlledRef.current = isInputControlled;

    const setInputRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const commitValue = React.useCallback((next: string | null) => {
      if (!isValueControlledRef.current) setUncontrolledValue(next);
      onValueChangeRef.current?.(next);
    }, []);

    const commitInput = React.useCallback((next: string) => {
      if (!isInputControlledRef.current) setUncontrolledInput(next);
      onInputChangeRef.current?.(next);
    }, []);

    const filtered = React.useMemo(() => {
      if (filter === false) return options;
      const fn = typeof filter === "function" ? filter : defaultFilter;
      return options.filter((opt) => fn(inputText, opt));
    }, [filter, options, inputText]);

    const enabledIndexes = React.useMemo(
      () =>
        filtered
          .map((opt, index) => ({ opt, index }))
          .filter(({ opt }) => !opt.disabled)
          .map(({ index }) => index),
      [filtered]
    );

    const resolvedValidation: ComboboxValidation =
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
      open ? statusId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const close = React.useCallback(() => {
      setOpen(false);
      setActiveIndex(-1);
    }, []);

    const positionMenu = React.useCallback(() => {
      const control = controlRef.current;
      if (!control) return;

      const rect = control.getBoundingClientRect();
      const vv = window.visualViewport;
      const viewTop = vv?.offsetTop ?? 0;
      const viewHeight = vv?.height ?? window.innerHeight;
      const viewLeft = vv?.offsetLeft ?? 0;
      const viewWidth = vv?.width ?? window.innerWidth;
      const viewBottom = viewTop + viewHeight;

      const gap = 4;
      const maxH = Math.min(240, viewHeight - 24);
      const spaceBelow = viewBottom - rect.bottom - gap - 8;
      const spaceAbove = rect.top - viewTop - gap - 8;
      const placeAbove = spaceBelow < 140 && spaceAbove > spaceBelow;
      const height = Math.max(80, Math.min(maxH, placeAbove ? spaceAbove : spaceBelow));
      const width = rect.width;
      const left = clamp(rect.left, viewLeft + 8, viewLeft + viewWidth - width - 8);
      const top = placeAbove
        ? clamp(rect.top - gap - height, viewTop + 8, viewBottom - height - 8)
        : clamp(rect.bottom + gap, viewTop + 8, viewBottom - height - 8);

      setMenuStyle({
        position: "fixed",
        top,
        left,
        width,
        minWidth: width,
        maxWidth: width,
        maxHeight: height,
        boxSizing: "border-box",
        zIndex: 40,
      });
    }, []);

    const openList = React.useCallback(() => {
      if (disabled || readOnly) return;
      setOpen(true);
    }, [disabled, readOnly]);

    React.useLayoutEffect(() => {
      if (!open) return;
      positionMenu();
      const onReposition = () => positionMenu();
      window.addEventListener("resize", onReposition);
      window.addEventListener("scroll", onReposition, true);
      const vv = window.visualViewport;
      vv?.addEventListener("resize", onReposition);
      vv?.addEventListener("scroll", onReposition);
      return () => {
        window.removeEventListener("resize", onReposition);
        window.removeEventListener("scroll", onReposition, true);
        vv?.removeEventListener("resize", onReposition);
        vv?.removeEventListener("scroll", onReposition);
      };
    }, [open, positionMenu, filtered.length, loading]);

    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target as Node | null;
        if (rootRef.current && target && !rootRef.current.contains(target)) {
          close();
        }
      };
      document.addEventListener("pointerdown", onPointerDown);
      return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open, close]);

    React.useEffect(() => {
      if (!open || activeIndex < 0) return;
      const el = listRef.current?.querySelector<HTMLElement>(
        `[data-index="${activeIndex}"]`
      );
      el?.scrollIntoView({ block: "nearest" });
    }, [activeIndex, open]);

    const selectOption = (option: ComboboxOption) => {
      if (option.disabled) return;
      commitValue(option.value);
      commitInput(option.label);
      close();
      inputRef.current?.focus();
    };

    const selectIndex = (index: number) => {
      const opt = filtered[index];
      if (opt) selectOption(opt);
    };

    const moveActive = (direction: 1 | -1) => {
      if (enabledIndexes.length === 0) {
        setActiveIndex(-1);
        return;
      }
      const pos = enabledIndexes.indexOf(activeIndex);
      const start = pos === -1 ? (direction === 1 ? -1 : 0) : pos;
      const next =
        enabledIndexes[
          (start + direction + enabledIndexes.length * 10) % enabledIndexes.length
        ];
      setActiveIndex(next);
    };

    const tryCommitCustom = React.useCallback(() => {
      if (!allowsCustomRef.current) return;
      const trimmed = inputTextRef.current.trim();
      if (!trimmed) {
        commitValue(null);
        return;
      }
      const exact = optionsRef.current.find(
        (o) =>
          !o.disabled &&
          (o.label.toLowerCase() === trimmed.toLowerCase() || o.value === trimmed)
      );
      if (exact) {
        commitValue(exact.value);
        commitInput(exact.label);
      } else {
        commitValue(trimmed);
      }
    }, [commitValue, commitInput]);

    const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled || readOnly) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!open) {
          openList();
          if (enabledIndexes[0] !== undefined) setActiveIndex(enabledIndexes[0]);
        } else {
          moveActive(1);
        }
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!open) {
          openList();
          const last = enabledIndexes[enabledIndexes.length - 1];
          if (last !== undefined) setActiveIndex(last);
        } else {
          moveActive(-1);
        }
        return;
      }

      if (event.key === "Home" && open) {
        event.preventDefault();
        if (enabledIndexes[0] !== undefined) setActiveIndex(enabledIndexes[0]);
        return;
      }

      if (event.key === "End" && open) {
        event.preventDefault();
        const last = enabledIndexes[enabledIndexes.length - 1];
        if (last !== undefined) setActiveIndex(last);
        return;
      }

      if (event.key === "Escape") {
        if (open) {
          event.preventDefault();
          close();
        }
        return;
      }

      if (event.key === "Enter") {
        if (open && activeIndex >= 0) {
          event.preventDefault();
          selectIndex(activeIndex);
          return;
        }
        if (open && allowsCustomValue) {
          event.preventDefault();
          tryCommitCustom();
          close();
          return;
        }
        if (open && !allowsCustomValue) {
          // Do not treat free text as a valid selection
          event.preventDefault();
          close();
        }
      }
    };

    const showClear =
      clearable &&
      !disabled &&
      !readOnly &&
      (inputText.length > 0 || selected != null);

    const showNoResults = open && !loading && filtered.length === 0;
    const statusText = loading
      ? loadingLabel
      : showNoResults
        ? noResultsLabel
        : open
          ? `${filtered.length} suggestion${filtered.length === 1 ? "" : "s"} available`
          : "";

    return (
      <div
        {...rest}
        ref={rootRef}
        id={rootId}
        className={cx(
          "dk-field",
          "dk-combobox",
          SIZE_CLASS[size],
          fullWidth && "dk-field--full",
          disabled && "dk-combobox--disabled",
          readOnly && "dk-combobox--readonly",
          open && "dk-combobox--open",
          loading && "dk-combobox--loading",
          (selected != null || inputText) && "dk-combobox--filled",
          resolvedValidation !== "none" && `dk-field--${resolvedValidation}`,
          reserveFooter && "dk-field--stable-messages",
          className
        )}
        data-size={size}
        data-validation={resolvedValidation}
        data-disabled={disabled || undefined}
        data-loading={loading || undefined}
        data-open={open || undefined}
        data-allows-custom={allowsCustomValue || undefined}
      >
        {label ? (
          <div className={cx("dk-field__label-row", hideLabel && "dk-field__label-row--sr")}>
            <label className="dk-field__label" id={labelId} htmlFor={inputId}>
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

        <div ref={controlRef} className="dk-combobox__control">
          {leadingIcon ? (
            <span className="dk-combobox__leading" aria-hidden="true">
              {leadingIcon}
            </span>
          ) : null}

          <input
            ref={setInputRefs}
            id={inputId}
            type="text"
            className="dk-combobox__input"
            role="combobox"
            name={name}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            placeholder={placeholder}
            value={inputText}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={
              open && activeIndex >= 0 ? `${rootId}-opt-${activeIndex}` : undefined
            }
            aria-labelledby={label && !hideLabel ? labelId : undefined}
            aria-label={!label || hideLabel ? label ?? listLabel : undefined}
            aria-describedby={describedBy || undefined}
            aria-invalid={resolvedValidation === "error" || undefined}
            aria-busy={loading || undefined}
            onChange={(event) => {
              const next = event.target.value;
              commitInput(next);
              // Typing filters / requests suggestions; keep typed value even if empty results
              if (selected != null) {
                const match = options.find((o) => o.value === selected);
                if (!match || match.label !== next) {
                  commitValue(null);
                }
              }
              if (!open) openList();
              setActiveIndex(-1);
            }}
            onFocus={() => {
              if (openOnFocus) openList();
            }}
            onBlur={() => {
              // Defer so option click can commit first
              window.setTimeout(() => {
                if (!rootRef.current?.contains(document.activeElement)) {
                  if (allowsCustomValue) tryCommitCustom();
                  close();
                }
              }, 0);
            }}
            onKeyDown={onInputKeyDown}
          />

          {/* Trailing slot reserved so loading never shifts layout */}
          <span className="dk-combobox__trailing" aria-hidden={!loading}>
            <span
              className={cx(
                "dk-combobox__loading",
                loading && "dk-combobox__loading--visible"
              )}
              role={loading ? "status" : undefined}
              aria-label={loading ? loadingLabel : undefined}
            >
              <span className="dk-combobox__spinner" aria-hidden="true" />
            </span>

            {showClear ? (
              <button
                type="button"
                className="dk-combobox__clear"
                aria-label={clearLabel}
                tabIndex={-1}
                disabled={disabled}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  commitInput("");
                  commitValue(null);
                  openList();
                  inputRef.current?.focus();
                }}
              >
                <span className="dk-combobox__clear-hit" aria-hidden="true" />
                <ClearIcon />
              </button>
            ) : null}

            <button
              type="button"
              className="dk-combobox__toggle"
              tabIndex={-1}
              disabled={disabled || readOnly}
              aria-label={open ? "Close suggestions" : "Open suggestions"}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                if (open) close();
                else {
                  openList();
                  inputRef.current?.focus();
                }
              }}
            >
              <span className="dk-combobox__chevron" aria-hidden="true">
                <ChevronIcon />
              </span>
            </button>
          </span>
        </div>

        <div id={statusId} className="dk-combobox__live" role="status" aria-live="polite">
          {statusText}
        </div>

        {open ? (
          <ul
            ref={listRef}
            id={listboxId}
            className="dk-combobox__listbox"
            role="listbox"
            aria-label={listLabel ?? label ?? "Suggestions"}
            style={menuStyle}
          >
            {loading && filtered.length === 0 ? (
              <li className="dk-combobox__empty" role="presentation">
                {loadingLabel}
              </li>
            ) : null}

            {showNoResults ? (
              <li className="dk-combobox__empty" role="presentation">
                {noResultsLabel}
              </li>
            ) : null}

            {filtered.map((opt, index) => {
              const isSelected = opt.value === selected;
              const isActive = index === activeIndex;
              return (
                <li
                  key={opt.value}
                  id={`${rootId}-opt-${index}`}
                  role="option"
                  data-index={index}
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled || undefined}
                  className={cx(
                    "dk-combobox__option",
                    isSelected && "dk-combobox__option--selected",
                    isActive && "dk-combobox__option--active",
                    opt.disabled && "dk-combobox__option--disabled"
                  )}
                  onMouseEnter={() => {
                    if (!opt.disabled) setActiveIndex(index);
                  }}
                  onMouseDown={(event) => {
                    // Keep input focus; prevent blur commit race
                    event.preventDefault();
                  }}
                  onClick={() => selectOption(opt)}
                >
                  {opt.icon ? (
                    <span className="dk-combobox__option-icon" aria-hidden="true">
                      {opt.icon}
                    </span>
                  ) : null}
                  <span className="dk-combobox__option-text">
                    <span className="dk-combobox__option-label">{opt.label}</span>
                    {opt.description ? (
                      <span className="dk-combobox__option-desc">{opt.description}</span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}

        {/* Hidden selected value for forms when custom text differs from option value */}
        {name && selected != null && selected !== inputText ? (
          <input type="hidden" name={`${name}Value`} value={selected} />
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

Combobox.displayName = "Combobox";

export default Combobox;
