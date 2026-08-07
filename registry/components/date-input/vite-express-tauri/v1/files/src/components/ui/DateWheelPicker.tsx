import * as React from "react";

type WheelOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

const ITEM_H = 44;
const VISIBLE = 5;
const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function preferReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function isValidIsoDate(value: string): boolean {
  const match = ISO_RE.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const dt = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return (
    dt.getUTCFullYear() === year &&
    dt.getUTCMonth() === month - 1 &&
    dt.getUTCDate() === day
  );
}

function parseIso(value: string | null): { y: number; m: number; d: number } {
  if (value && isValidIsoDate(value)) {
    const [, ys, ms, ds] = ISO_RE.exec(value)!;
    return { y: Number(ys), m: Number(ms), d: Number(ds) };
  }
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

function toIso(y: number, m: number, d: number): string {
  return `${String(y).padStart(4, "0")}-${pad2(m)}-${pad2(d)}`;
}

function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0, 12, 0, 0)).getUTCDate();
}

function clampDay(y: number, m: number, d: number): number {
  return Math.min(d, daysInMonth(y, m));
}

function datePartOrder(locale: string): Array<"year" | "month" | "day"> {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: "UTC",
    }).formatToParts(new Date(Date.UTC(2020, 5, 15)));
    const order = parts
      .filter((p) => p.type === "year" || p.type === "month" || p.type === "day")
      .map((p) => p.type as "year" | "month" | "day");
    if (order.length === 3) return order;
  } catch {
    /* fall through */
  }
  return ["month", "day", "year"];
}

function monthLabel(locale: string, month: number): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2020, month - 1, 15)));
  } catch {
    return pad2(month);
  }
}

function WheelColumn({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
}: {
  options: WheelOption[];
  value: string;
  onChange: (value: string) => void;
  "aria-label": string;
}) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const settleRef = React.useRef<number | null>(null);
  const lockRef = React.useRef(false);
  const pad = Math.floor(VISIBLE / 2);

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );

  const scrollToIndex = React.useCallback((index: number, smooth: boolean) => {
    const el = scrollerRef.current;
    if (!el) return;
    const top = index * ITEM_H;
    if (smooth && !preferReducedMotion()) {
      el.scrollTo({ top, behavior: "smooth" });
    } else {
      el.scrollTop = top;
    }
  }, []);

  React.useLayoutEffect(() => {
    if (lockRef.current) return;
    scrollToIndex(selectedIndex, false);
  }, [selectedIndex, options.length, scrollToIndex]);

  const settle = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el || options.length === 0) return;

    let i = Math.round(el.scrollTop / ITEM_H);
    i = Math.max(0, Math.min(options.length - 1, i));

    if (options[i]?.disabled) {
      let found = -1;
      for (let d = 0; d < options.length; d += 1) {
        const up = i + d;
        const down = i - d;
        if (up < options.length && !options[up].disabled) {
          found = up;
          break;
        }
        if (down >= 0 && !options[down].disabled) {
          found = down;
          break;
        }
      }
      if (found >= 0) i = found;
    }

    lockRef.current = true;
    scrollToIndex(i, true);
    const opt = options[i];
    if (opt && !opt.disabled && opt.value !== value) onChange(opt.value);
    window.setTimeout(() => {
      lockRef.current = false;
    }, 160);
  }, [onChange, options, scrollToIndex, value]);

  const onScroll = () => {
    if (settleRef.current !== null) window.clearTimeout(settleRef.current);
    settleRef.current = window.setTimeout(settle, 90);
  };

  React.useEffect(() => {
    return () => {
      if (settleRef.current !== null) window.clearTimeout(settleRef.current);
    };
  }, []);

  return (
    <div className="dk-wheel" role="listbox" aria-label={ariaLabel}>
      <div className="dk-wheel__lens" aria-hidden="true" />
      <div
        ref={scrollerRef}
        className="dk-wheel__scroller"
        tabIndex={0}
        onScroll={onScroll}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            const dir = event.key === "ArrowUp" ? -1 : 1;
            let next = selectedIndex + dir;
            while (next >= 0 && next < options.length && options[next]?.disabled) {
              next += dir;
            }
            if (next >= 0 && next < options.length && !options[next].disabled) {
              onChange(options[next].value);
            }
          }
        }}
      >
        <div className="dk-wheel__spacer" style={{ height: pad * ITEM_H }} aria-hidden="true" />
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <div
              key={opt.value}
              role="option"
              aria-selected={selected}
              aria-disabled={opt.disabled || undefined}
              className={cx(
                "dk-wheel__item",
                selected && "dk-wheel__item--selected",
                opt.disabled && "dk-wheel__item--disabled"
              )}
              style={{ height: ITEM_H }}
              onClick={() => {
                if (!opt.disabled) onChange(opt.value);
              }}
            >
              {opt.label}
            </div>
          );
        })}
        <div className="dk-wheel__spacer" style={{ height: pad * ITEM_H }} aria-hidden="true" />
      </div>
    </div>
  );
}

export interface DateWheelPickerProps {
  value: string | null;
  locale: string;
  min?: string;
  max?: string;
  isDateDisabled?: (isoDate: string) => boolean;
  onChange: (value: string) => void;
  onDone?: () => void;
  doneLabel?: string;
}

/**
 * Mobile-style drum date picker with a rounded center selection lens per column.
 */
export function DateWheelPicker({
  value,
  locale,
  min,
  max,
  isDateDisabled,
  onChange,
  onDone,
  doneLabel = "Done",
}: DateWheelPickerProps) {
  const parts = parseIso(value);
  const minY = min && isValidIsoDate(min) ? Number(min.slice(0, 4)) : parts.y - 80;
  const maxY = max && isValidIsoDate(max) ? Number(max.slice(0, 4)) : parts.y + 20;
  const yearStart = Math.min(minY, maxY);
  const yearEnd = Math.max(minY, maxY);

  const isUnavailable = (y: number, m: number, d: number) => {
    const iso = toIso(y, m, clampDay(y, m, d));
    if (!isValidIsoDate(iso)) return true;
    if (min && iso < min) return true;
    if (max && iso > max) return true;
    if (isDateDisabled?.(iso)) return true;
    return false;
  };

  const emit = (y: number, m: number, d: number) => {
    const day = clampDay(y, m, d);
    const iso = toIso(y, m, day);
    if (isUnavailable(y, m, day)) return;
    onChange(iso);
  };

  const yearOptions: WheelOption[] = Array.from(
    { length: yearEnd - yearStart + 1 },
    (_, i) => {
      const y = yearStart + i;
      return {
        value: String(y),
        label: String(y),
        disabled: isUnavailable(y, parts.m, parts.d),
      };
    }
  );

  const monthOptions: WheelOption[] = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    return {
      value: String(m),
      label: monthLabel(locale, m),
      disabled: isUnavailable(parts.y, m, parts.d),
    };
  });

  const dim = daysInMonth(parts.y, parts.m);
  const dayOptions: WheelOption[] = Array.from({ length: dim }, (_, i) => {
    const d = i + 1;
    return {
      value: String(d),
      label: String(d),
      disabled: isUnavailable(parts.y, parts.m, d),
    };
  });

  const order = datePartOrder(locale);
  const columns = order.map((part) => {
    if (part === "year") {
      return (
        <WheelColumn
          key="year"
          aria-label="Year"
          options={yearOptions}
          value={String(parts.y)}
          onChange={(next) => emit(Number(next), parts.m, parts.d)}
        />
      );
    }
    if (part === "month") {
      return (
        <WheelColumn
          key="month"
          aria-label="Month"
          options={monthOptions}
          value={String(parts.m)}
          onChange={(next) => emit(parts.y, Number(next), parts.d)}
        />
      );
    }
    return (
      <WheelColumn
        key="day"
        aria-label="Day"
        options={dayOptions}
        value={String(clampDay(parts.y, parts.m, parts.d))}
        onChange={(next) => emit(parts.y, parts.m, Number(next))}
      />
    );
  });

  return (
    <div className="dk-wheel-panel" role="dialog" aria-label="Date picker">
      <div className="dk-wheel-panel__columns">{columns}</div>
      {onDone ? (
        <button type="button" className="dk-wheel-panel__done" onClick={onDone}>
          {doneLabel}
        </button>
      ) : null}
    </div>
  );
}
