import * as React from "react";

export type SelectSize = "xs" | "sm" | "md" | "lg" | "xl";

export type SelectValidation = "none" | "error" | "success" | "warning";

/**
 * How choices are presented:
 * - `auto` — native picker on compact/touch; listbox popover on desktop
 * - `listbox` — always custom listbox (DevKit popover)
 * - `native` — always platform select (better for simple mobile cases)
 */
export type SelectPresentation = "auto" | "listbox" | "native";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  /** Optional leading mark (e.g. flag emoji or icon). */
  icon?: React.ReactNode;
}

export interface SelectProps
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
  validation?: SelectValidation;
  size?: SelectSize;
  required?: boolean;
  optional?: boolean;
  requiredIndicator?: React.ReactNode;
  optionalLabel?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  stableMessages?: boolean;
  placeholder?: string;
  /** Controlled selected value, or `null` when empty. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  options: SelectOption[];
  /** Meaningful leading icon only — never decorative noise. */
  leadingIcon?: React.ReactNode;
  clearable?: boolean;
  clearLabel?: string;
  presentation?: SelectPresentation;
  name?: string;
  /** Accessible name for the listbox. Defaults from label. */
  listLabel?: string;
  /**
   * Show a filter field in the listbox popover.
   * Defaults to `true` when there are 8+ options (large lists need search).
   */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Empty-state copy when search yields no options. */
  noResultsLabel?: string;
  /** Minimum popover width in px (useful for narrow triggers with long option labels). */
  menuMinWidth?: number;
}

const SIZE_CLASS: Record<SelectSize, string> = {
  xs: "dk-select--xs",
  sm: "dk-select--sm",
  md: "dk-select--md",
  lg: "dk-select--lg",
  xl: "dk-select--xl",
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

function OptionCheckIcon() {
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

function preferNativePresentation(): boolean {
  if (typeof window === "undefined") return false;
  const narrow = window.matchMedia("(max-width: 479px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return narrow || coarse;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SEARCHABLE_OPTION_THRESHOLD = 8;

function defaultOptionFilter(query: string, opt: SelectOption) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    opt.label.toLowerCase().includes(q) ||
    opt.value.toLowerCase().includes(q) ||
    (opt.description?.toLowerCase().includes(q) ?? false)
  );
}

/**
 * Select (ID 026) — choose one option from a predefined list.
 *
 * Not a Combobox: options are not freely typed. Adapts presentation by platform
 * (`auto` → native on compact/touch, listbox on desktop).
 */
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  function Select(
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
      fullWidth = true,
      stableMessages,
      placeholder = "Select…",
      value: valueProp,
      defaultValue = null,
      onValueChange,
      options,
      leadingIcon,
      clearable = false,
      clearLabel = "Clear selection",
      presentation = "auto",
      name,
      listLabel,
      searchable: searchableProp,
      searchPlaceholder = "Search…",
      noResultsLabel = "No results",
      menuMinWidth,
      id: idProp,
      className,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-select-${reactId}`;
    const labelId = `${rootId}-label`;
    const descId = `${rootId}-desc`;
    const helpId = `${rootId}-help`;
    const errorId = `${rootId}-error`;
    const successId = `${rootId}-success`;
    const warningId = `${rootId}-warning`;
    const listboxId = `${rootId}-listbox`;
    const searchId = `${rootId}-search`;

    const isSearchable =
      searchableProp ?? options.length >= SEARCHABLE_OPTION_THRESHOLD;

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState<string | null>(defaultValue);
    const selected = isControlled ? valueProp! : uncontrolled;

    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [query, setQuery] = React.useState("");
    const [useNative, setUseNative] = React.useState(presentation === "native");
    const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({});

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const controlRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const popupRef = React.useRef<HTMLDivElement | null>(null);
    const listRef = React.useRef<HTMLUListElement | null>(null);
    const searchRef = React.useRef<HTMLInputElement | null>(null);
    const nativeRef = React.useRef<HTMLSelectElement | null>(null);
    const typeaheadRef = React.useRef({ query: "", timer: 0 as number | null });

    const setTriggerRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    React.useEffect(() => {
      if (presentation === "listbox") {
        setUseNative(false);
        return;
      }
      if (presentation === "native") {
        setUseNative(true);
        return;
      }
      const sync = () => setUseNative(preferNativePresentation());
      sync();
      const mqNarrow = window.matchMedia("(max-width: 479px)");
      const mqCoarse = window.matchMedia("(pointer: coarse)");
      mqNarrow.addEventListener("change", sync);
      mqCoarse.addEventListener("change", sync);
      return () => {
        mqNarrow.removeEventListener("change", sync);
        mqCoarse.removeEventListener("change", sync);
      };
    }, [presentation]);

    const filtered = React.useMemo(
      () =>
        isSearchable
          ? options.filter((opt) => defaultOptionFilter(query, opt))
          : options,
      [isSearchable, options, query]
    );

    const enabledIndexes = React.useMemo(
      () =>
        filtered
          .map((opt, index) => ({ opt, index }))
          .filter(({ opt }) => !opt.disabled)
          .map(({ index }) => index),
      [filtered]
    );

    const selectedOption = options.find((o) => o.value === selected) ?? null;
    const selectedFilteredIndex = selected
      ? filtered.findIndex((o) => o.value === selected)
      : -1;

    const resolvedValidation: SelectValidation =
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

    const commit = (next: string | null) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    };

    const close = React.useCallback(() => {
      setOpen(false);
      setQuery("");
      triggerRef.current?.focus();
    }, []);

    const positionMenu = React.useCallback(() => {
      const control = controlRef.current ?? triggerRef.current;
      if (!control) return;
      const rect = control.getBoundingClientRect();
      const gap = 4;
      const maxH = Math.min(isSearchable ? 320 : 280, window.innerHeight - 16);
      const spaceBelow = window.innerHeight - rect.bottom - gap - 8;
      const spaceAbove = rect.top - gap - 8;
      const placeAbove = spaceBelow < 160 && spaceAbove > spaceBelow;
      const height = Math.min(maxH, placeAbove ? spaceAbove : spaceBelow);
      // Match the field control width exactly (not the inner trigger alone),
      // but allow a wider menu when the trigger is intentionally narrow.
      const width = Math.max(rect.width, menuMinWidth ?? 0);
      const left = clamp(rect.left, 8, window.innerWidth - width - 8);
      const top = placeAbove
        ? clamp(rect.top - gap - height, 8, window.innerHeight - height - 8)
        : clamp(rect.bottom + gap, 8, window.innerHeight - height - 8);

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
    }, [isSearchable, menuMinWidth]);

    const openListbox = React.useCallback(() => {
      if (disabled) return;
      setQuery("");
      const start =
        selectedFilteredIndex >= 0 && enabledIndexes.includes(selectedFilteredIndex)
          ? selectedFilteredIndex
          : enabledIndexes[0] ?? 0;
      setActiveIndex(start);
      setOpen(true);
    }, [disabled, enabledIndexes, selectedFilteredIndex]);

    React.useLayoutEffect(() => {
      if (!open || useNative) return;
      positionMenu();
      const onResize = () => positionMenu();
      window.addEventListener("resize", onResize);
      window.addEventListener("scroll", onResize, true);
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onResize, true);
      };
    }, [open, useNative, positionMenu, filtered.length, isSearchable]);

    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target as Node | null;
        if (rootRef.current && target && !rootRef.current.contains(target)) {
          setOpen(false);
          setQuery("");
        }
      };
      document.addEventListener("pointerdown", onPointerDown);
      return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open]);

    React.useEffect(() => {
      if (!open || useNative) return;
      const el = listRef.current?.querySelector<HTMLElement>(
        `[data-index="${activeIndex}"]`
      );
      el?.scrollIntoView({ block: "nearest" });
    }, [activeIndex, open, useNative, filtered]);

    React.useEffect(() => {
      if (!open || useNative) return;
      if (isSearchable) {
        searchRef.current?.focus();
        return;
      }
      listRef.current?.focus();
    }, [open, useNative, isSearchable]);

    React.useEffect(() => {
      if (!open || !isSearchable) return;
      const next =
        selectedFilteredIndex >= 0 && enabledIndexes.includes(selectedFilteredIndex)
          ? selectedFilteredIndex
          : enabledIndexes[0] ?? 0;
      setActiveIndex(next);
      // Only re-sync highlight when the filter query changes.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const selectIndex = (index: number) => {
      const opt = filtered[index];
      if (!opt || opt.disabled) return;
      commit(opt.value);
      close();
    };

    const moveActive = (direction: 1 | -1) => {
      if (enabledIndexes.length === 0) return;
      const pos = enabledIndexes.indexOf(activeIndex);
      const start = pos === -1 ? 0 : pos;
      const next =
        enabledIndexes[
          (start + direction + enabledIndexes.length * 10) % enabledIndexes.length
        ];
      setActiveIndex(next);
    };

    const typeahead = (key: string) => {
      if (isSearchable) return;
      if (key.length !== 1 || /\s/.test(key)) return;
      const state = typeaheadRef.current;
      if (state.timer) window.clearTimeout(state.timer);
      state.query += key.toLowerCase();
      state.timer = window.setTimeout(() => {
        state.query = "";
      }, 500);
      const q = state.query;
      const from = Math.max(0, activeIndex);
      const order = [...filtered.slice(from), ...filtered.slice(0, from)];
      const match = order.find(
        (opt) => !opt.disabled && opt.label.toLowerCase().startsWith(q)
      );
      if (match) {
        const index = filtered.indexOf(match);
        if (open) setActiveIndex(index);
        else {
          commit(match.value);
        }
      }
    };

    const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActive(1);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActive(-1);
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        if (enabledIndexes[0] !== undefined) setActiveIndex(enabledIndexes[0]);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        const last = enabledIndexes[enabledIndexes.length - 1];
        if (last !== undefined) setActiveIndex(last);
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        selectIndex(activeIndex);
      }
    };

    const openNative = () => {
      const el = nativeRef.current;
      if (!el || disabled) return;
      try {
        if (typeof el.showPicker === "function") {
          el.showPicker();
          return;
        }
      } catch {
        /* fall through */
      }
      el.focus();
      el.click();
    };

    const onTriggerClick = () => {
      if (disabled) return;
      if (useNative) {
        openNative();
        return;
      }
      if (open) close();
      else openListbox();
    };

    const showClear =
      clearable && !disabled && selected != null && selected !== "";

    const displayLabel = selectedOption?.label ?? null;

    return (
      <div
        {...rest}
        ref={rootRef}
        id={rootId}
        className={cx(
          "dk-field",
          "dk-select",
          SIZE_CLASS[size],
          fullWidth && "dk-field--full",
          disabled && "dk-select--disabled",
          open && "dk-select--open",
          selected != null && "dk-select--filled",
          resolvedValidation !== "none" && `dk-field--${resolvedValidation}`,
          reserveFooter && "dk-field--stable-messages",
          className
        )}
        data-size={size}
        data-presentation={useNative ? "native" : "listbox"}
        data-searchable={isSearchable || undefined}
        data-validation={resolvedValidation}
        data-disabled={disabled || undefined}
        data-open={open || undefined}
      >
        {label ? (
          <div className={cx("dk-field__label-row", hideLabel && "dk-field__label-row--sr")}>
            <label className="dk-field__label" id={labelId} htmlFor={`${rootId}-trigger`}>
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

        <div ref={controlRef} className="dk-select__control">
          {leadingIcon || selectedOption?.icon ? (
            <span className="dk-select__leading" aria-hidden="true">
              {selectedOption?.icon ?? leadingIcon}
            </span>
          ) : null}

          <button
            ref={setTriggerRefs}
            id={`${rootId}-trigger`}
            type="button"
            className="dk-select__trigger"
            disabled={disabled}
            aria-haspopup={useNative ? undefined : "listbox"}
            aria-expanded={useNative ? undefined : open}
            aria-controls={useNative ? undefined : listboxId}
            aria-labelledby={label && !hideLabel ? labelId : undefined}
            aria-label={!label || hideLabel ? label ?? listLabel : undefined}
            aria-describedby={describedBy || undefined}
            aria-invalid={resolvedValidation === "error" || undefined}
            aria-required={required || undefined}
            onClick={onTriggerClick}
            onKeyDown={(event) => {
              if (disabled) return;
              if (useNative) {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  openNative();
                }
                return;
              }
              if (
                (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") &&
                !open
              ) {
                event.preventDefault();
                openListbox();
                return;
              }
              if (event.key === "ArrowUp" && !open) {
                event.preventDefault();
                openListbox();
                return;
              }
              if (!open && event.key.length === 1) {
                typeahead(event.key);
              }
            }}
          >
            <span
              className={cx(
                "dk-select__value",
                !displayLabel && "dk-select__value--placeholder"
              )}
            >
              {displayLabel ?? placeholder}
            </span>
            <span className="dk-select__chevron" aria-hidden="true">
              <ChevronIcon />
            </span>
          </button>

          {showClear ? (
            <button
              type="button"
              className="dk-select__clear"
              aria-label={clearLabel}
              disabled={disabled}
              onClick={(event) => {
                event.stopPropagation();
                commit(null);
                setOpen(false);
              }}
            >
              <span className="dk-select__clear-hit" aria-hidden="true" />
              <ClearIcon />
            </button>
          ) : null}

          {/* Native select — used for platform picker when presentation is native/auto-mobile */}
          <select
            ref={nativeRef}
            className="dk-select__native"
            tabIndex={-1}
            aria-hidden="true"
            disabled={disabled}
            name={useNative ? name : undefined}
            value={selected ?? ""}
            required={required}
            onChange={(event) => {
              const next = event.target.value;
              commit(next === "" ? null : next);
            }}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {!useNative && name ? (
            <input type="hidden" name={name} value={selected ?? ""} />
          ) : null}
        </div>

        {open && !useNative ? (
          <div
            ref={popupRef}
            className="dk-select__popup"
            style={menuStyle}
            data-searchable={isSearchable || undefined}
          >
            {isSearchable ? (
              <div className="dk-select__search">
                <input
                  ref={searchRef}
                  id={searchId}
                  type="search"
                  className="dk-select__search-input"
                  placeholder={searchPlaceholder}
                  value={query}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-autocomplete="list"
                  aria-controls={listboxId}
                  aria-activedescendant={
                    filtered.length > 0 ? `${rootId}-opt-${activeIndex}` : undefined
                  }
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={onSearchKeyDown}
                />
              </div>
            ) : null}

            <ul
              ref={listRef}
              id={listboxId}
              className="dk-select__listbox dk-scroll"
              role="listbox"
              aria-label={listLabel ?? label ?? "Options"}
              aria-activedescendant={
                filtered.length > 0 ? `${rootId}-opt-${activeIndex}` : undefined
              }
              tabIndex={isSearchable ? -1 : 0}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  close();
                  return;
                }
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  moveActive(1);
                  return;
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  moveActive(-1);
                  return;
                }
                if (event.key === "Home") {
                  event.preventDefault();
                  if (enabledIndexes[0] !== undefined) setActiveIndex(enabledIndexes[0]);
                  return;
                }
                if (event.key === "End") {
                  event.preventDefault();
                  const last = enabledIndexes[enabledIndexes.length - 1];
                  if (last !== undefined) setActiveIndex(last);
                  return;
                }
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  selectIndex(activeIndex);
                  return;
                }
                if (event.key.length === 1) typeahead(event.key);
              }}
            >
              {filtered.length === 0 ? (
                <li className="dk-select__empty" role="presentation">
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
                      "dk-select__option",
                      isSelected && "dk-select__option--selected",
                      isActive && "dk-select__option--active",
                      opt.disabled && "dk-select__option--disabled"
                    )}
                    onMouseEnter={() => {
                      if (!opt.disabled) setActiveIndex(index);
                    }}
                    onClick={() => selectIndex(index)}
                  >
                    {opt.icon ? (
                      <span className="dk-select__option-icon" aria-hidden="true">
                        {opt.icon}
                      </span>
                    ) : null}
                    <span className="dk-select__option-text">
                      <span className="dk-select__option-label">{opt.label}</span>
                      {opt.description ? (
                        <span className="dk-select__option-desc">{opt.description}</span>
                      ) : null}
                    </span>
                    <span
                      className={cx(
                        "dk-select__option-check",
                        isSelected && "dk-select__option-check--on"
                      )}
                      aria-hidden="true"
                    >
                      {isSelected ? <OptionCheckIcon /> : null}
                    </span>
                  </li>
                );
              })}
            </ul>
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

Select.displayName = "Select";

export default Select;
