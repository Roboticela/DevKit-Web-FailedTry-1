import * as React from "react";

export type SegmentedControlSize = "sm" | "md" | "lg";

/**
 * Narrow viewport behavior:
 * - `scroll` — keep a single row with horizontal scroll when needed
 * - `stack` — vertical stack of segments
 * - `equal` — force equal-width flex wrap (may wrap lines)
 */
export type SegmentedControlOverflow = "scroll" | "stack" | "equal";

export interface SegmentedControlOption {
  id: string;
  /** Visible label and accessible name (always required). */
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  /**
   * Icon-only segment. Use only when the icon meaning is obvious.
   * `label` remains the accessible name.
   */
  iconOnly?: boolean;
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Accessible name for the radiogroup. */
  label: string;
  options: SegmentedControlOption[];
  size?: SegmentedControlSize;
  /** Controlled selected option id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Stretch segments to equal width. Default: true. */
  equalWidth?: boolean;
  /** Compact overflow strategy. Default: `scroll`. */
  overflow?: SegmentedControlOverflow;
  disabled?: boolean;
}

const SIZE_CLASS: Record<SegmentedControlSize, string> = {
  sm: "dk-segmented--sm",
  md: "dk-segmented--md",
  lg: "dk-segmented--lg",
};

const OVERFLOW_CLASS: Record<SegmentedControlOverflow, string> = {
  scroll: "dk-segmented--overflow-scroll",
  stack: "dk-segmented--overflow-stack",
  equal: "dk-segmented--overflow-equal",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Segmented Control (ID 008) — mutually exclusive selection among a small set (2–5).
 *
 * Do not use for large option sets. Selected state is an integrated track fill, not a floating chip.
 */
export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    {
      label,
      options,
      size = "md",
      value: valueProp,
      defaultValue,
      onValueChange,
      equalWidth = true,
      overflow = "scroll",
      disabled = false,
      className,
      ...rest
    },
    ref
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

    const focusSegment = (id: string) => {
      const safe =
        typeof CSS !== "undefined" && typeof CSS.escape === "function"
          ? CSS.escape(id)
          : id.replace(/"/g, '\\"');
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
          if (overflow === "stack") {
            event.preventDefault();
            moveSelection(1);
          }
          break;
        case "ArrowUp":
          if (overflow === "stack") {
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
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const count = options.length;
    const tooMany = count > 5;

    return (
      <div
        {...rest}
        ref={setRefs}
        role="radiogroup"
        aria-label={label}
        aria-disabled={disabled || undefined}
        className={cx(
          "dk-segmented",
          SIZE_CLASS[size],
          OVERFLOW_CLASS[overflow],
          equalWidth && "dk-segmented--equal",
          disabled && "dk-segmented--disabled",
          tooMany && "dk-segmented--many",
          className
        )}
        data-size={size}
        data-overflow={overflow}
        data-count={count}
        onKeyDown={onTrackKeyDown}
      >
        <div className="dk-segmented__track">
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
                  "dk-segmented__segment",
                  selected && "dk-segmented__segment--selected",
                  iconOnly && "dk-segmented__segment--icon-only"
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
                <span className="dk-segmented__segment-inner">
                  {option.icon ? (
                    <span className="dk-segmented__icon" aria-hidden="true">
                      {option.icon}
                    </span>
                  ) : null}
                  {!iconOnly ? (
                    <span className="dk-segmented__label">{option.label}</span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

SegmentedControl.displayName = "SegmentedControl";

export default SegmentedControl;
