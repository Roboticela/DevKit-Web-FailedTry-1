import * as React from "react";

/**
 * Color Palette — selectable accent / semantic color swatches.
 * Grid or popover trigger for toolbars. No gradients. No box-shadows.
 */

export type ColorPaletteItem = {
  id: string;
  label: string;
  /** CSS color for the swatch (hex / token). */
  color: string;
  disabled?: boolean;
};

export type ColorPaletteProps = {
  /** Accessible name for the radiogroup. */
  label?: string;
  colors: ColorPaletteItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  columns?: number;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  /**
   * `grid` — inline swatches.
   * `popover` — compact trigger + panel (toolbar / navbar).
   */
  variant?: "grid" | "popover";
  /** Trigger label when variant is popover. */
  triggerLabel?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function PaletteIcon() {
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="6" cy="7" r="2" fill="currentColor" opacity="0.9" />
      <circle cx="11" cy="5.5" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="14.5" cy="9.5" r="2" fill="currentColor" opacity="0.55" />
      <path
        d="M3.5 12.5c1.8-3 4.2-4.5 6.8-4.5 2.2 0 3.7 1.1 3.7 2.7 0 1.5-1.2 2.5-2.7 2.5-.7 0-1.2-.2-1.7-.6-.3.7-.9 1.2-1.8 1.2-1.3 0-2.1-1-2.1-2.2 0-.3 0-.6.1-.9-.8.5-1.5 1.2-2.3 1.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const ColorPalette = React.forwardRef<HTMLDivElement, ColorPaletteProps>(
  function ColorPalette(
    {
      label = "Color palette",
      colors,
      value: valueProp,
      defaultValue,
      onValueChange,
      columns,
      size = "md",
      showLabels = false,
      variant = "grid",
      triggerLabel = "Colors",
      disabled = false,
      className = "",
      id,
    },
    ref
  ) {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? colors[0]?.id ?? "");
    const [open, setOpen] = React.useState(false);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp! : uncontrolled;
    const active = colors.find((c) => c.id === value) ?? colors[0];

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    React.useEffect(() => {
      if (!open) return;
      const onDoc = (e: MouseEvent) => {
        if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("mousedown", onDoc);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onDoc);
        document.removeEventListener("keydown", onKey);
      };
    }, [open]);

    const select = (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
      if (variant === "popover") setOpen(false);
    };

    const grid = (
      <div
        className={cx(
          "dk-color-palette__grid",
          `dk-color-palette--${size}`,
          showLabels && "dk-color-palette--labels"
        )}
        role="radiogroup"
        aria-label={label}
        style={
          columns
            ? ({ ["--dk-cp-columns" as string]: String(columns) } as React.CSSProperties)
            : undefined
        }
      >
        {colors.map((item) => {
          const selected = item.id === value;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={item.label}
              title={item.label}
              disabled={disabled || item.disabled}
              className={cx(
                "dk-color-palette__swatch",
                selected && "dk-color-palette__swatch--selected"
              )}
              style={{ ["--dk-cp-color" as string]: item.color }}
              onClick={() => select(item.id)}
            >
              <span className="dk-color-palette__dot" aria-hidden="true" />
              {showLabels ? <span className="dk-color-palette__label">{item.label}</span> : null}
            </button>
          );
        })}
      </div>
    );

    if (variant === "popover") {
      return (
        <div
          ref={setRefs}
          id={id}
          className={cx(
            "dk-color-palette",
            "dk-color-palette--popover",
            disabled && "dk-color-palette--disabled",
            className
          )}
        >
          <button
            type="button"
            className={cx("dk-color-palette__trigger", open && "dk-color-palette__trigger--open")}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`${label}, ${active?.label ?? triggerLabel}`}
            disabled={disabled}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className="dk-color-palette__trigger-dot"
              style={{ ["--dk-cp-color" as string]: active?.color ?? "#0071e3" }}
              aria-hidden="true"
            />
            <span className="dk-color-palette__trigger-icon" aria-hidden="true">
              <PaletteIcon />
            </span>
            <span className="dk-color-palette__trigger-label">{triggerLabel}</span>
          </button>
          {open ? <div className="dk-color-palette__panel">{grid}</div> : null}
        </div>
      );
    }

    return (
      <div
        ref={setRefs}
        id={id}
        className={cx("dk-color-palette", disabled && "dk-color-palette--disabled", className)}
      >
        {grid}
      </div>
    );
  }
);

ColorPalette.displayName = "ColorPalette";
export default ColorPalette;
