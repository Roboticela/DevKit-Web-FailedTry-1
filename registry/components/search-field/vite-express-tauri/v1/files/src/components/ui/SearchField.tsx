import * as React from "react";

export type SearchFieldSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Host-driven results chrome (does not render suggestion lists).
 * - `idle` — no query / not searched yet
 * - `available` — results exist for the current query
 * - `empty` — search completed with no results
 */
export type SearchFieldResultsStatus = "idle" | "available" | "empty";

export interface SearchFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "value" | "defaultValue" | "onChange" | "results"
  > {
  /**
   * Accessible name. Prefer a visible `label`, or set this / `aria-label`.
   * Placeholder alone is never sufficient.
   */
  label?: string;
  /** Hide visible label while keeping it for assistive tech. Common in toolbars. */
  hideLabel?: boolean;
  description?: string;
  helpText?: string;
  /** Localized placeholder — supplementary only. */
  placeholder?: string;
  size?: SearchFieldSize;
  /**
   * Layout density.
   * - `field` — full form field (default, often full-width on mobile)
   * - `toolbar` — compact control for desktop toolbars / headers
   */
  appearance?: "field" | "toolbar";
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  /** Show clear when the value is non-empty. Default: true. */
  clearable?: boolean;
  clearLabel?: string;
  onClear?: () => void;
  /**
   * Escape behavior when the field is focused.
   * - `clear` — clear value if present (default)
   * - `dismiss` — call `onDismiss` (and clear if filled when clearable)
   * - `none` — do not handle Escape
   */
  escapeAction?: "clear" | "dismiss" | "none";
  onDismiss?: () => void;
  /** Results availability signal for hosts / SR — does not render result UI. */
  resultsStatus?: SearchFieldResultsStatus;
  /** Accessible announcement when `resultsStatus` is `available` or `empty`. */
  resultsStatusLabel?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Fires on every value change (instant search hosts). */
  onValueChange?: (value: string) => void;
  /**
   * Optional debounced value callback. Debounce is opt-in via `debounceMs`.
   * Does not replace `onValueChange`.
   */
  onDebouncedChange?: (value: string) => void;
  /** Debounce delay for `onDebouncedChange` only. Default: unset (no debounce). */
  debounceMs?: number;
  /**
   * Submit / search. Fired on Enter when the field is not composing.
   * Hosts decide whether search is submit-based, instant, or async.
   */
  onSearch?: (value: string) => void;
  fullWidth?: boolean;
  /** Custom leading icon. Default: search glyph. */
  searchIcon?: React.ReactNode;
}

const SIZE_CLASS: Record<SearchFieldSize, string> = {
  xs: "dk-search--xs",
  sm: "dk-search--sm",
  md: "dk-search--md",
  lg: "dk-search--lg",
  xl: "dk-search--xl",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="5.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M13.25 13.25 16.5 16.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
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

/**
 * Search Field (ID 013) — specialized find/content query control.
 *
 * Semantically distinct from Text Input (011). Does not embed suggestions,
 * command palettes, or results lists — hosts compose those separately.
 */
export const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  function SearchField(
    {
      label,
      hideLabel = false,
      description,
      helpText,
      placeholder = "Search",
      size = "md",
      appearance = "field",
      disabled = false,
      loading = false,
      loadingLabel = "Searching",
      clearable = true,
      clearLabel = "Clear search",
      onClear,
      escapeAction = "clear",
      onDismiss,
      resultsStatus = "idle",
      resultsStatusLabel,
      value: valueProp,
      defaultValue,
      onChange,
      onValueChange,
      onDebouncedChange,
      debounceMs,
      onSearch,
      fullWidth,
      searchIcon,
      id: idProp,
      className,
      name,
      onKeyDown,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-controls": ariaControls,
      "aria-expanded": ariaExpanded,
      "aria-autocomplete": ariaAutocomplete,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const inputId = idProp ?? `dk-search-${reactId}`;
    const descId = `${inputId}-desc`;
    const helpId = `${inputId}-help`;
    const statusId = `${inputId}-status`;

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "");
    const value = isControlled ? String(valueProp) : uncontrolled;
    const filled = value.trim().length > 0;
    const typing = filled && !loading;

    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const debounceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    React.useEffect(() => {
      return () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
      };
    }, []);

    const stretch =
      fullWidth ?? (appearance === "field");

    const showClear = clearable && filled && !disabled;

    const resolvedResultsLabel =
      resultsStatusLabel ??
      (resultsStatus === "available"
        ? "Results available"
        : resultsStatus === "empty"
          ? "No results"
          : undefined);

    const describedBy = [
      description ? descId : null,
      helpText ? helpId : null,
      resolvedResultsLabel ? statusId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const accessibleName =
      ariaLabel ??
      (!label || hideLabel ? label ?? "Search" : undefined);

    const commitValue = (next: string, event?: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
      if (event) onChange?.(event);

      if (onDebouncedChange && typeof debounceMs === "number" && debounceMs >= 0) {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
          onDebouncedChange(next);
        }, debounceMs);
      }
    };

    const clearValue = () => {
      if (!isControlled) setUncontrolled("");
      onValueChange?.("");
      onDebouncedChange?.("");
      onClear?.();
      inputRef.current?.focus();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled) return;

      if (event.key === "Enter") {
        // Submit-based search; hosts may also search on change.
        if (event.nativeEvent.isComposing) return;
        event.preventDefault();
        onSearch?.(value);
        return;
      }

      if (event.key === "Escape") {
        if (escapeAction === "none") return;
        event.preventDefault();
        if (escapeAction === "dismiss") {
          if (filled && clearable) clearValue();
          onDismiss?.();
          return;
        }
        // clear
        if (filled) clearValue();
        else onDismiss?.();
        return;
      }

      // Arrow keys are intentionally not handled — reserved for suggestion hosts.
    };

    return (
      <div
        className={cx(
          "dk-field",
          "dk-search",
          SIZE_CLASS[size],
          appearance === "toolbar" && "dk-search--toolbar",
          stretch && "dk-field--full",
          disabled && "dk-field--disabled",
          loading && "dk-search--loading",
          filled && "dk-search--populated",
          typing && "dk-search--typing",
          resultsStatus !== "idle" && `dk-search--results-${resultsStatus}`,
          className
        )}
        role="search"
        data-size={size}
        data-appearance={appearance}
        data-loading={loading || undefined}
        data-populated={filled || undefined}
        data-results={resultsStatus}
      >
        {label ? (
          <div className={cx("dk-field__label-row", hideLabel && "dk-field__label-row--sr")}>
            <label className="dk-field__label" htmlFor={inputId}>
              {label}
            </label>
          </div>
        ) : null}

        {description ? (
          <p id={descId} className="dk-field__description">
            {description}
          </p>
        ) : null}

        <div className="dk-field__control dk-search__control">
          <span className="dk-field__hit" aria-hidden="true" />

          <span className="dk-search__icon" aria-hidden="true" title="Search">
            {searchIcon ?? <SearchIcon />}
          </span>

          <input
            {...rest}
            ref={setRefs}
            id={inputId}
            name={name}
            className="dk-field__input dk-search__input"
            type="search"
            role="searchbox"
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            inputMode="search"
            aria-label={accessibleName}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={describedBy || undefined}
            aria-busy={loading || undefined}
            aria-controls={ariaControls}
            aria-expanded={ariaExpanded}
            aria-autocomplete={ariaAutocomplete}
            data-empty={!filled || undefined}
            onChange={(event) => commitValue(event.target.value, event)}
            onKeyDown={handleKeyDown}
          />

          {/* Reserved trailing slot — loading / clear swap without layout shift */}
          <span className="dk-search__trail">
            {loading ? (
              <span className="dk-search__loading" role="status" aria-label={loadingLabel}>
                <span className="dk-search__spinner" aria-hidden="true" />
              </span>
            ) : showClear ? (
              <button
                type="button"
                className="dk-search__clear"
                aria-label={clearLabel}
                onClick={clearValue}
              >
                <span className="dk-search__clear-hit" aria-hidden="true" />
                <ClearIcon />
              </button>
            ) : (
              <span className="dk-search__trail-spacer" aria-hidden="true" />
            )}
          </span>
        </div>

        {(helpText || resolvedResultsLabel) && (
          <div className="dk-field__footer dk-search__footer">
            <div className="dk-field__messages">
              {helpText ? (
                <p id={helpId} className="dk-field__message dk-field__message--help">
                  {helpText}
                </p>
              ) : null}
              {resolvedResultsLabel ? (
                <p
                  id={statusId}
                  className={cx(
                    "dk-field__message",
                    "dk-search__results-status",
                    resultsStatus === "empty" && "dk-search__results-status--empty",
                    resultsStatus === "available" && "dk-search__results-status--available"
                  )}
                  role="status"
                  aria-live="polite"
                >
                  {resolvedResultsLabel}
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  }
);

SearchField.displayName = "SearchField";

export default SearchField;
