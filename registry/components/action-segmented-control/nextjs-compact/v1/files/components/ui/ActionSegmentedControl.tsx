import * as React from "react";

/**
 * Segmented Control (ID 094) — Action & Control Compositions.
 * Small set of mutually exclusive choices (practical range 2–5).
 * Distinct from Interaction 008 — default narrow adaptation is wrap/stack,
 * not forced scroll or auto-dropdown.
 * Selected state uses surface + border + weight (not color alone).
 */

export type ActionSegmentedControlSize = "sm" | "md" | "lg";

/**
 * Narrow / overflow behavior — must be explicit for scroll.
 * - `wrap` (default) — allow wrapping rather than squeezing labels
 * - `stack` — vertical stack
 * - `scroll` — single-row horizontal scroll (opt-in only)
 *
 * Never auto-converts to a dropdown.
 */
export type ActionSegmentedControlOverflow = "wrap" | "stack" | "scroll";

export type ActionSegmentedControlOption = {
  id: string;
  /** Visible label and accessible name (required). */
  label: string;
  /** Optional icon — only when it improves recognition. */
  icon?: React.ReactNode;
  disabled?: boolean;
  /**
   * Icon-only segment. Use only when meaning is obvious.
   * `label` remains the accessible name.
   */
  iconOnly?: boolean;
};

export type ActionSegmentedControlProps = {
  /** Accessible name for the radiogroup. */
  label: string;
  options: ActionSegmentedControlOption[];
  size?: ActionSegmentedControlSize;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Stretch segments to equal width within a row. Default: true. */
  equalWidth?: boolean;
  overflow?: ActionSegmentedControlOverflow;
  disabled?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
};

const SIZE_CLASS: Record<ActionSegmentedControlSize, string> = {
  sm: "dk-ac-segmented--sm",
  md: "dk-ac-segmented--md",
  lg: "dk-ac-segmented--lg",
};

const OVERFLOW_CLASS: Record<ActionSegmentedControlOverflow, string> = {
  wrap: "dk-ac-segmented--overflow-wrap",
  stack: "dk-ac-segmented--overflow-stack",
  scroll: "dk-ac-segmented--overflow-scroll",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const ActionSegmentedControl = React.forwardRef<
  HTMLDivElement,
  ActionSegmentedControlProps
>(function ActionSegmentedControl(
  {
    label,
    options,
    size = "md",
    value: valueProp,
    defaultValue,
    onValueChange,
    equalWidth = true,
    overflow = "wrap",
    disabled = false,
    className = "",
    id,
    style,
  },
  forwardedRef
) {
  const isControlled = valueProp !== undefined;
  const firstEnabled = options.find((o) => !o.disabled)?.id;
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultValue ?? firstEnabled ?? options[0]?.id ?? ""
  );
  const value = isControlled ? String(valueProp) : uncontrolled;
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const setValue = (next: string) => {
    if (!isControlled) setUncontrolled(next);
    onValueChange?.(next);
  };

  const enabledIds = React.useMemo(
    () => options.filter((o) => !o.disabled && !disabled).map((o) => o.id),
    [options, disabled]
  );

  const focusSegment = (segmentId: string) => {
    const safe =
      typeof CSS !== "undefined" && typeof CSS.escape === "function"
        ? CSS.escape(segmentId)
        : segmentId.replace(/"/g, '\\"');
    listRef.current
      ?.querySelector<HTMLElement>(`[data-segment-id="${safe}"]`)
      ?.focus();
  };

  const moveSelection = (direction: 1 | -1) => {
    if (enabledIds.length === 0) return;
    const index = enabledIds.indexOf(value);
    const start = index === -1 ? 0 : index;
    const next =
      enabledIds[(start + direction + enabledIds.length) % enabledIds.length];
    setValue(next);
    focusSegment(next);
  };

  const onTrackKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const rtl =
      typeof document !== "undefined" &&
      (document.documentElement.dir === "rtl" ||
        getComputedStyle(event.currentTarget).direction === "rtl");

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        moveSelection(rtl ? -1 : 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveSelection(rtl ? 1 : -1);
        break;
      case "ArrowDown":
        if (overflow === "stack" || overflow === "wrap") {
          event.preventDefault();
          moveSelection(1);
        }
        break;
      case "ArrowUp":
        if (overflow === "stack" || overflow === "wrap") {
          event.preventDefault();
          moveSelection(-1);
        }
        break;
      case "Home":
        event.preventDefault();
        if (enabledIds[0]) {
          setValue(enabledIds[0]);
          focusSegment(enabledIds[0]);
        }
        break;
      case "End":
        event.preventDefault();
        {
          const last = enabledIds[enabledIds.length - 1];
          if (last) {
            setValue(last);
            focusSegment(last);
          }
        }
        break;
      default:
        break;
    }
  };

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef]
  );

  const count = options.length;
  const tooMany = count > 5;

  return (
    <div
      ref={setRefs}
      id={id}
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={cx(
        "dk-ac-segmented",
        SIZE_CLASS[size],
        OVERFLOW_CLASS[overflow],
        equalWidth && "dk-ac-segmented--equal",
        disabled && "dk-ac-segmented--disabled",
        tooMany && "dk-ac-segmented--many",
        className
      )}
      style={style}
      data-size={size}
      data-overflow={overflow}
      data-count={count}
      onKeyDown={onTrackKeyDown}
    >
      <div className="dk-ac-segmented__track">
        {options.map((option) => {
          const selected = option.id === value;
          const isDisabled = disabled || Boolean(option.disabled);
          const iconOnly = Boolean(option.iconOnly && option.icon);

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              className={cx(
                "dk-ac-segmented__segment",
                selected && "dk-ac-segmented__segment--selected",
                iconOnly && "dk-ac-segmented__segment--icon-only"
              )}
              data-segment-id={option.id}
              data-selected={selected || undefined}
              aria-checked={selected}
              aria-label={iconOnly ? option.label : undefined}
              title={iconOnly ? option.label : undefined}
              disabled={isDisabled}
              tabIndex={selected ? 0 : -1}
              onClick={() => {
                if (isDisabled) return;
                setValue(option.id);
              }}
            >
              <span className="dk-ac-segmented__segment-inner">
                {option.icon ? (
                  <span className="dk-ac-segmented__icon" aria-hidden="true">
                    {option.icon}
                  </span>
                ) : null}
                {!iconOnly ? (
                  <span className="dk-ac-segmented__label">{option.label}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

ActionSegmentedControl.displayName = "ActionSegmentedControl";

/** Catalog alias */
export const SegmentedControl = ActionSegmentedControl;

export default ActionSegmentedControl;
