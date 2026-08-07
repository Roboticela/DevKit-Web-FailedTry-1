import * as React from "react";

export type MultiSelectSize = "xs" | "sm" | "md" | "lg" | "xl";

export type MultiSelectValidation = "none" | "error" | "success" | "warning";

/**
 * How selected values appear in the trigger.
 * `auto` picks chips / compact text / count based on selection size.
 */
export type MultiSelectDisplayMode = "auto" | "chips" | "text" | "count";

export type MultiSelectPresentation = "auto" | "popover" | "sheet";

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  /** Optional group key; options sharing a key render under one heading. */
  group?: string;
}

export interface MultiSelectGroup {
  id: string;
  label: string;
}

export type MultiSelectFilterFn = (
  query: string,
  option: MultiSelectOption
) => boolean;

export interface MultiSelectProps
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
  validation?: MultiSelectValidation;
  size?: MultiSelectSize;
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
  leadingIcon?: React.ReactNode;
  listLabel?: string;

  /** Controlled selected values. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;

  options: MultiSelectOption[];
  /** Optional explicit group labels (otherwise `option.group` is used as heading). */
  groups?: MultiSelectGroup[];

  filter?: boolean | MultiSelectFilterFn;
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Fires when the search field changes — use with `filter={false}` for async lists. */
  onSearchChange?: (query: string) => void;

  clearable?: boolean;
  clearAllLabel?: string;
  selectAll?: boolean;
  selectAllLabel?: string;

  loading?: boolean;
  loadingLabel?: string;
  noResultsLabel?: string;

  maxSelections?: number;
  minSelections?: number;
  maxExceededMessage?: string;
  minNotMetMessage?: string;

  displayMode?: MultiSelectDisplayMode;
  /** Max chips shown before collapsing to a “+N” / count summary. */
  maxVisibleChips?: number;
  presentation?: MultiSelectPresentation;
  removeLabel?: (label: string) => string;
  countLabel?: (count: number) => string;

  /**
   * Row height for virtualized lists (px). Virtualization engages when
   * filtered option count exceeds `virtualizeThreshold`.
   */
  optionHeight?: number;
  virtualizeThreshold?: number;
}

const SIZE_CLASS: Record<MultiSelectSize, string> = {
  xs: "dk-multiselect--xs",
  sm: "dk-multiselect--sm",
  md: "dk-multiselect--md",
  lg: "dk-multiselect--lg",
  xl: "dk-multiselect--xl",
};

const DEFAULT_OPTION_HEIGHT = 44;
const DEFAULT_VIRTUALIZE_AT = 80;
const WINDOW_OVERSCAN = 6;

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

function CheckIcon() {
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

function defaultFilter(query: string, option: MultiSelectOption) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    option.label.toLowerCase().includes(q) ||
    option.value.toLowerCase().includes(q) ||
    (option.description?.toLowerCase().includes(q) ?? false) ||
    (option.group?.toLowerCase().includes(q) ?? false)
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function preferSheetPresentation(): boolean {
  if (typeof window === "undefined") return false;
  const narrow = window.matchMedia("(max-width: 479px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return narrow || coarse;
}

type FlatRow =
  | { type: "group"; id: string; label: string }
  | { type: "option"; option: MultiSelectOption; index: number };

function buildFlatRows(
  options: MultiSelectOption[],
  groups?: MultiSelectGroup[]
): FlatRow[] {
  const groupLabel = new Map(groups?.map((g) => [g.id, g.label]) ?? []);
  const hasGroups = options.some((o) => o.group);
  if (!hasGroups) {
    return options.map((option, index) => ({ type: "option", option, index }));
  }

  const order: string[] = [];
  const buckets = new Map<string, MultiSelectOption[]>();
  for (const opt of options) {
    const key = opt.group ?? "";
    if (!buckets.has(key)) {
      buckets.set(key, []);
      order.push(key);
    }
    buckets.get(key)!.push(opt);
  }

  const rows: FlatRow[] = [];
  let optionIndex = 0;
  for (const key of order) {
    if (key) {
      rows.push({
        type: "group",
        id: key,
        label: groupLabel.get(key) ?? key,
      });
    }
    for (const option of buckets.get(key)!) {
      rows.push({ type: "option", option, index: optionIndex++ });
    }
  }
  return rows;
}

/**
 * Multi-Select (ID 028) — multiple choices from a predefined collection.
 * Adaptive selected display (chips / text / count). Virtualizes large lists.
 */
export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  function MultiSelect(
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
      placeholder = "Select…",
      name,
      leadingIcon,
      listLabel,
      value: valueProp,
      defaultValue = [],
      onValueChange,
      options,
      groups,
      filter = true,
      searchable = true,
      searchPlaceholder = "Search…",
      onSearchChange,
      clearable = true,
      clearAllLabel = "Clear all",
      selectAll = true,
      selectAllLabel = "Select all",
      loading = false,
      loadingLabel = "Loading options",
      noResultsLabel = "No results found",
      maxSelections,
      minSelections,
      maxExceededMessage = "Maximum selections reached",
      minNotMetMessage,
      displayMode = "auto",
      maxVisibleChips = 3,
      presentation = "auto",
      removeLabel = (itemLabel) => `Remove ${itemLabel}`,
      countLabel = (count) => `${count} selected`,
      optionHeight = DEFAULT_OPTION_HEIGHT,
      virtualizeThreshold = DEFAULT_VIRTUALIZE_AT,
      id: idProp,
      className,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-multiselect-${reactId}`;
    const labelId = `${rootId}-label`;
    const descId = `${rootId}-desc`;
    const helpId = `${rootId}-help`;
    const errorId = `${rootId}-error`;
    const successId = `${rootId}-success`;
    const warningId = `${rootId}-warning`;
    const listboxId = `${rootId}-listbox`;
    const searchId = `${rootId}-search`;
    const statusId = `${rootId}-status`;

    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue);
    const selected = isControlled ? valueProp! : uncontrolled;

    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [useSheet, setUseSheet] = React.useState(presentation === "sheet");
    const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({});
    const [scrollTop, setScrollTop] = React.useState(0);
    const [viewportH, setViewportH] = React.useState(240);

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const controlRef = React.useRef<HTMLDivElement | null>(null);
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const searchRef = React.useRef<HTMLInputElement | null>(null);

    const setTriggerRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    React.useEffect(() => {
      if (presentation === "popover") {
        setUseSheet(false);
        return;
      }
      if (presentation === "sheet") {
        setUseSheet(true);
        return;
      }
      const sync = () => setUseSheet(preferSheetPresentation());
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

    const commit = React.useCallback(
      (next: string[]) => {
        if (!isControlled) setUncontrolled(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange]
    );

    const filtered = React.useMemo(() => {
      if (filter === false) return options;
      const fn = typeof filter === "function" ? filter : defaultFilter;
      return options.filter((opt) => fn(query, opt));
    }, [filter, options, query]);

    const flatRows = React.useMemo(
      () => buildFlatRows(filtered, groups),
      [filtered, groups]
    );

    const optionRows = React.useMemo(
      () => flatRows.filter((r): r is Extract<FlatRow, { type: "option" }> => r.type === "option"),
      [flatRows]
    );

    const enabledOptionIndexes = React.useMemo(
      () =>
        optionRows
          .map((row, i) => ({ row, i }))
          .filter(({ row }) => !row.option.disabled)
          .map(({ i }) => i),
      [optionRows]
    );

    const selectedSet = React.useMemo(() => new Set(selected), [selected]);
    const selectedOptions = React.useMemo(
      () => options.filter((o) => selectedSet.has(o.value)),
      [options, selectedSet]
    );

    const atMax =
      maxSelections != null && selected.length >= maxSelections;
    const belowMin =
      minSelections != null && selected.length < minSelections && selected.length > 0;

    const validationState: MultiSelectValidation = (() => {
      if (validation !== "none") return validation;
      if (errorMessage) return "error";
      if (successMessage) return "success";
      if (warningMessage) return "warning";
      if (belowMin) return "warning";
      return "none";
    })();

    const messageConfigured = Boolean(
      helpText ||
        errorMessage ||
        successMessage ||
        warningMessage ||
        (belowMin && minNotMetMessage)
    );
    const reserveFooter = stableMessages ?? messageConfigured;

    const describedBy = [
      description ? descId : null,
      validationState === "error" && errorMessage ? errorId : null,
      validationState === "success" && successMessage ? successId : null,
      validationState === "warning" && (warningMessage || minNotMetMessage)
        ? warningId
        : null,
      validationState === "none" && helpText ? helpId : null,
      open ? statusId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const resolvedDisplay: Exclude<MultiSelectDisplayMode, "auto"> = (() => {
      if (displayMode !== "auto") return displayMode;
      const n = selected.length;
      if (n === 0) return "text";
      if (n <= maxVisibleChips) return "chips";
      return "count";
    })();

    const close = React.useCallback(() => {
      setOpen(false);
      setQuery("");
      setActiveIndex(0);
      triggerRef.current?.focus();
    }, []);

    const positionMenu = React.useCallback(() => {
      if (useSheet) {
        setMenuStyle({});
        return;
      }
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
      const maxH = Math.min(320, viewHeight - 24);
      const spaceBelow = viewBottom - rect.bottom - gap - 8;
      const spaceAbove = rect.top - viewTop - gap - 8;
      const placeAbove = spaceBelow < 180 && spaceAbove > spaceBelow;
      const height = Math.max(120, Math.min(maxH, placeAbove ? spaceAbove : spaceBelow));
      const width = rect.width;
      const left = clamp(rect.left, viewLeft + 8, viewLeft + viewWidth - width - 8);
      const top = placeAbove
        ? clamp(rect.top - gap - height, viewTop + 8, viewBottom - height - 8)
        : clamp(rect.bottom + gap, viewTop + 8, viewBottom - height - 8);

      setViewportH(height - (searchable ? 52 : 0) - 48);
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
    }, [useSheet, searchable]);

    const openMenu = React.useCallback(() => {
      if (disabled || readOnly) return;
      setOpen(true);
      const first = enabledOptionIndexes[0] ?? 0;
      setActiveIndex(first);
    }, [disabled, readOnly, enabledOptionIndexes]);

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
    }, [open, positionMenu, filtered.length, loading, useSheet]);

    React.useEffect(() => {
      if (!open) return;
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target as Node | null;
        if (rootRef.current && target && !rootRef.current.contains(target)) {
          if (useSheet) return; // sheet uses explicit Done / backdrop
          close();
        }
      };
      document.addEventListener("pointerdown", onPointerDown);
      return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open, close, useSheet]);

    React.useEffect(() => {
      if (!open) return;
      const t = window.setTimeout(() => {
        if (searchable) searchRef.current?.focus();
        else listRef.current?.focus();
      }, 0);
      return () => window.clearTimeout(t);
    }, [open, searchable]);

    const toggleValue = (optionValue: string, optionDisabled?: boolean) => {
      if (optionDisabled || disabled || readOnly) return;
      const isOn = selectedSet.has(optionValue);
      if (isOn) {
        commit(selected.filter((v) => v !== optionValue));
        return;
      }
      if (maxSelections != null && selected.length >= maxSelections) return;
      commit([...selected, optionValue]);
    };

    const removeValue = (optionValue: string) => {
      if (disabled || readOnly) return;
      commit(selected.filter((v) => v !== optionValue));
    };

    const clearAll = () => {
      if (disabled || readOnly) return;
      commit([]);
    };

    const selectableFiltered = filtered.filter((o) => !o.disabled);
    const allFilteredSelected =
      selectableFiltered.length > 0 &&
      selectableFiltered.every((o) => selectedSet.has(o.value));

    const toggleSelectAll = () => {
      if (disabled || readOnly) return;
      if (allFilteredSelected) {
        const drop = new Set(selectableFiltered.map((o) => o.value));
        commit(selected.filter((v) => !drop.has(v)));
        return;
      }
      const next = new Set(selected);
      for (const opt of selectableFiltered) {
        if (maxSelections != null && next.size >= maxSelections) break;
        next.add(opt.value);
      }
      commit([...next]);
    };

    const moveActive = (direction: 1 | -1) => {
      if (enabledOptionIndexes.length === 0) return;
      const pos = enabledOptionIndexes.indexOf(activeIndex);
      const start = pos === -1 ? (direction === 1 ? -1 : 0) : pos;
      const next =
        enabledOptionIndexes[
          (start + direction + enabledOptionIndexes.length * 10) %
            enabledOptionIndexes.length
        ];
      setActiveIndex(next);
    };

    const onListKeyDown = (event: React.KeyboardEvent) => {
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
        if (enabledOptionIndexes[0] !== undefined) setActiveIndex(enabledOptionIndexes[0]);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        const last = enabledOptionIndexes[enabledOptionIndexes.length - 1];
        if (last !== undefined) setActiveIndex(last);
        return;
      }
      if (event.key === " ") {
        event.preventDefault();
        const row = optionRows[activeIndex];
        if (row) toggleValue(row.option.value, row.option.disabled);
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        // Confirm / close — selection already toggled via Space
        close();
      }
    };

    // Virtualization
    const useVirtual = optionRows.length > virtualizeThreshold;
    const rowH = optionHeight;
    // Approximate: group headers also need space — use flatRows length for scroll height
    const virtualItemCount = flatRows.length;
    const startIndex = useVirtual
      ? Math.max(0, Math.floor(scrollTop / rowH) - WINDOW_OVERSCAN)
      : 0;
    const endIndex = useVirtual
      ? Math.min(
          virtualItemCount,
          Math.ceil((scrollTop + viewportH) / rowH) + WINDOW_OVERSCAN
        )
      : virtualItemCount;
    const visibleRows = useVirtual
      ? flatRows.slice(startIndex, endIndex)
      : flatRows;
    const padTop = useVirtual ? startIndex * rowH : 0;
    const padBottom = useVirtual
      ? Math.max(0, (virtualItemCount - endIndex) * rowH)
      : 0;

    React.useEffect(() => {
      if (!open || activeIndex < 0 || useVirtual) return;
      const el = listRef.current?.querySelector<HTMLElement>(
        `[data-option-index="${activeIndex}"]`
      );
      el?.scrollIntoView({ block: "nearest" });
    }, [activeIndex, open, useVirtual]);

    const statusText = loading
      ? loadingLabel
      : open && filtered.length === 0
        ? noResultsLabel
        : open
          ? `${selected.length} selected, ${filtered.length} option${filtered.length === 1 ? "" : "s"} shown`
          : `${selected.length} selected`;

    const showClearAll = clearable && !disabled && !readOnly && selected.length > 0;
    const showSelectAll =
      selectAll && !disabled && !readOnly && selectableFiltered.length > 0;

    const renderOptionRow = (
      option: MultiSelectOption,
      optionIndex: number,
      style?: React.CSSProperties
    ) => {
      const isSelected = selectedSet.has(option.value);
      const isActive = optionIndex === activeIndex;
      const blocked =
        !isSelected && maxSelections != null && selected.length >= maxSelections;
      return (
        <div
          key={option.value}
          id={`${rootId}-opt-${optionIndex}`}
          role="option"
          data-option-index={optionIndex}
          aria-selected={isSelected}
          aria-disabled={option.disabled || blocked || undefined}
          className={cx(
            "dk-multiselect__option",
            isSelected && "dk-multiselect__option--selected",
            isActive && "dk-multiselect__option--active",
            (option.disabled || blocked) && "dk-multiselect__option--disabled"
          )}
          style={style}
          onMouseEnter={() => {
            if (!option.disabled) setActiveIndex(optionIndex);
          }}
          onClick={() => {
            if (blocked) return;
            toggleValue(option.value, option.disabled);
          }}
        >
          <span className="dk-multiselect__check" aria-hidden="true">
            {isSelected ? <CheckIcon /> : null}
          </span>
          <span className="dk-multiselect__option-body">
            <span className="dk-multiselect__option-label">{option.label}</span>
            {option.description ? (
              <span className="dk-multiselect__option-desc">{option.description}</span>
            ) : null}
          </span>
        </div>
      );
    };

    const panel = open ? (
      <div
        className={cx(
          "dk-multiselect__panel",
          useSheet && "dk-multiselect__panel--sheet"
        )}
        style={useSheet ? undefined : menuStyle}
        role="presentation"
      >
        {useSheet ? (
          <button
            type="button"
            className="dk-multiselect__backdrop"
            aria-label="Close"
            onClick={close}
          />
        ) : null}

        <div className="dk-multiselect__panel-inner">
          {useSheet ? (
            <div className="dk-multiselect__sheet-bar">
              <span className="dk-multiselect__sheet-title">
                {listLabel ?? label ?? "Select"}
              </span>
              <button type="button" className="dk-multiselect__done" onClick={close}>
                Done
              </button>
            </div>
          ) : null}

          {searchable ? (
            <div className="dk-multiselect__search">
              <input
                ref={searchRef}
                id={searchId}
                type="search"
                className="dk-multiselect__search-input"
                placeholder={searchPlaceholder}
                value={query}
                disabled={disabled}
                aria-controls={listboxId}
                aria-autocomplete="list"
                onChange={(event) => {
                  const next = event.target.value;
                  setQuery(next);
                  onSearchChange?.(next);
                  setActiveIndex(0);
                  setScrollTop(0);
                  if (listRef.current) listRef.current.scrollTop = 0;
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "ArrowDown" ||
                    event.key === "ArrowUp" ||
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    onListKeyDown(event);
                  } else if (event.key === "Escape") {
                    event.preventDefault();
                    close();
                  }
                }}
              />
            </div>
          ) : null}

          <div className="dk-multiselect__toolbar">
            {showSelectAll ? (
              <button
                type="button"
                className="dk-multiselect__tool"
                onClick={toggleSelectAll}
              >
                {allFilteredSelected ? "Clear filtered" : selectAllLabel}
              </button>
            ) : (
              <span />
            )}
            {showClearAll ? (
              <button type="button" className="dk-multiselect__tool" onClick={clearAll}>
                {clearAllLabel}
              </button>
            ) : null}
          </div>

          {atMax ? (
            <p className="dk-multiselect__cap" role="status">
              {maxExceededMessage}
            </p>
          ) : null}

          <div
            ref={listRef}
            id={listboxId}
            className="dk-multiselect__listbox"
            role="listbox"
            aria-multiselectable="true"
            aria-label={listLabel ?? label ?? "Options"}
            aria-activedescendant={
              optionRows[activeIndex]
                ? `${rootId}-opt-${activeIndex}`
                : undefined
            }
            tabIndex={searchable ? -1 : 0}
            style={useSheet ? { maxHeight: "min(50vh, 360px)" } : { maxHeight: viewportH }}
            onScroll={(event) => {
              if (useVirtual) setScrollTop(event.currentTarget.scrollTop);
            }}
            onKeyDown={onListKeyDown}
          >
            {loading && filtered.length === 0 ? (
              <div className="dk-multiselect__empty" role="status">
                <span
                  className={cx(
                    "dk-multiselect__loading",
                    "dk-multiselect__loading--visible"
                  )}
                >
                  <span className="dk-multiselect__spinner" aria-hidden="true" />
                </span>
                {loadingLabel}
              </div>
            ) : null}

            {!loading && filtered.length === 0 ? (
              <div className="dk-multiselect__empty" role="status">
                {noResultsLabel}
              </div>
            ) : null}

            {useVirtual ? <div style={{ height: padTop }} aria-hidden="true" /> : null}

            {visibleRows.map((row) => {
              if (row.type === "group") {
                return (
                  <div
                    key={`g-${row.id}`}
                    className="dk-multiselect__group"
                    role="presentation"
                    style={useVirtual ? { height: rowH } : undefined}
                  >
                    {row.label}
                  </div>
                );
              }
              return renderOptionRow(
                row.option,
                row.index,
                useVirtual ? { minHeight: rowH } : undefined
              );
            })}

            {useVirtual ? <div style={{ height: padBottom }} aria-hidden="true" /> : null}
          </div>
        </div>
      </div>
    ) : null;

    return (
      <div
        {...rest}
        ref={rootRef}
        id={rootId}
        className={cx(
          "dk-field",
          "dk-multiselect",
          SIZE_CLASS[size],
          fullWidth && "dk-field--full",
          disabled && "dk-multiselect--disabled",
          readOnly && "dk-multiselect--readonly",
          open && "dk-multiselect--open",
          loading && "dk-multiselect--loading",
          selected.length > 0 && "dk-multiselect--filled",
          validationState !== "none" && `dk-field--${validationState}`,
          reserveFooter && "dk-field--stable-messages",
          useSheet && "dk-multiselect--sheet",
          className
        )}
        data-size={size}
        data-display={resolvedDisplay}
        data-presentation={useSheet ? "sheet" : "popover"}
        data-validation={validationState}
        data-disabled={disabled || undefined}
        data-open={open || undefined}
        data-count={selected.length}
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

        <div ref={controlRef} className="dk-multiselect__control">
          {leadingIcon ? (
            <span className="dk-multiselect__leading" aria-hidden="true">
              {leadingIcon}
            </span>
          ) : null}

          <div
            className="dk-multiselect__value"
            onClick={() => {
              if (disabled || readOnly) return;
              if (!open) openMenu();
              else triggerRef.current?.focus();
            }}
          >
            {selected.length === 0 ? (
              <span className="dk-multiselect__placeholder">{placeholder}</span>
            ) : resolvedDisplay === "count" ? (
              <span className="dk-multiselect__summary">{countLabel(selected.length)}</span>
            ) : resolvedDisplay === "text" ? (
              <span className="dk-multiselect__summary dk-multiselect__summary--text">
                {selectedOptions.map((o) => o.label).join(", ")}
              </span>
            ) : (
              <ul className="dk-multiselect__chips">
                {selectedOptions.slice(0, maxVisibleChips).map((opt) => (
                  <li key={opt.value} className="dk-multiselect__chip">
                    <span className="dk-multiselect__chip-label">{opt.label}</span>
                    {!disabled && !readOnly ? (
                      <button
                        type="button"
                        className="dk-multiselect__chip-remove"
                        aria-label={removeLabel(opt.label)}
                        onClick={(event) => {
                          event.stopPropagation();
                          removeValue(opt.value);
                        }}
                      >
                        <ClearIcon />
                      </button>
                    ) : null}
                  </li>
                ))}
                {selectedOptions.length > maxVisibleChips ? (
                  <li className="dk-multiselect__chip dk-multiselect__chip--more">
                    +{selectedOptions.length - maxVisibleChips}
                  </li>
                ) : null}
              </ul>
            )}
          </div>

          <span className="dk-multiselect__trailing">
            <span
              className={cx(
                "dk-multiselect__loading",
                loading && "dk-multiselect__loading--visible"
              )}
              role={loading ? "status" : undefined}
              aria-label={loading ? loadingLabel : undefined}
            >
              <span className="dk-multiselect__spinner" aria-hidden="true" />
            </span>

            {showClearAll && resolvedDisplay !== "chips" ? (
              <button
                type="button"
                className="dk-multiselect__clear"
                aria-label={clearAllLabel}
                tabIndex={-1}
                onClick={(event) => {
                  event.stopPropagation();
                  clearAll();
                }}
              >
                <span className="dk-multiselect__clear-hit" aria-hidden="true" />
                <ClearIcon />
              </button>
            ) : null}

            <button
              ref={setTriggerRefs}
              id={`${rootId}-trigger`}
              type="button"
              className="dk-multiselect__trigger"
              disabled={disabled}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={listboxId}
              aria-labelledby={label && !hideLabel ? labelId : undefined}
              aria-label={
                !label || hideLabel
                  ? label ?? listLabel
                  : undefined
              }
              aria-describedby={describedBy || undefined}
              aria-invalid={validationState === "error" || undefined}
              aria-required={required || undefined}
              onClick={() => {
                if (open) close();
                else openMenu();
              }}
              onKeyDown={(event) => {
                if (disabled || readOnly) return;
                if (
                  (event.key === "ArrowDown" ||
                    event.key === "Enter" ||
                    event.key === " ") &&
                  !open
                ) {
                  event.preventDefault();
                  openMenu();
                }
              }}
            >
              <span className="dk-multiselect__chevron" aria-hidden="true">
                <ChevronIcon />
              </span>
            </button>
          </span>
        </div>

        {/* When chips are shown, count is still announced */}
        <div id={statusId} className="dk-multiselect__live" role="status" aria-live="polite">
          {statusText}
        </div>

        {name
          ? selected.map((v) => (
              <input key={v} type="hidden" name={name} value={v} />
            ))
          : null}

        {panel}

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
            {validationState === "warning" && (warningMessage || (belowMin && minNotMetMessage)) ? (
              <p id={warningId} className="dk-field__message dk-field__message--warning">
                <span className="dk-field__message-icon" aria-hidden="true">
                  <StatusIcon kind="warning" />
                </span>
                <span>
                  {warningMessage ??
                    minNotMetMessage ??
                    `Select at least ${minSelections}`}
                </span>
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

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
