import * as React from "react";

export type TimeWheelHourCycle = "auto" | "h12" | "h23";

type WheelOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

const ITEM_H = 44;
const VISIBLE = 5;

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

function resolveHourCycle(locale: string, hourCycle: TimeWheelHourCycle): "h12" | "h23" {
  if (hourCycle === "h12" || hourCycle === "h23") return hourCycle;
  try {
    const cycle = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions()
      .hourCycle;
    if (cycle === "h11" || cycle === "h12") return "h12";
    return "h23";
  } catch {
    return "h23";
  }
}

function parseTime(value: string | null): { h: number; m: number; s: number } {
  if (!value) return { h: 12, m: 0, s: 0 };
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
  if (!match) return { h: 12, m: 0, s: 0 };
  return {
    h: Number(match[1]),
    m: Number(match[2]),
    s: match[3] !== undefined ? Number(match[3]) : 0,
  };
}

function toCanonical(h: number, m: number, s: number, withSeconds: boolean): string {
  const base = `${pad2(h)}:${pad2(m)}`;
  return withSeconds ? `${base}:${pad2(s)}` : base;
}

function toSeconds(h: number, m: number, s: number): number {
  return h * 3600 + m * 60 + s;
}

function dayPeriodLabel(locale: string, hour24: number): string {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      hourCycle: "h12",
      timeZone: "UTC",
    }).formatToParts(new Date(Date.UTC(1970, 0, 1, hour24, 0, 0)));
    return parts.find((p) => p.type === "dayPeriod")?.value ?? (hour24 < 12 ? "AM" : "PM");
  } catch {
    return hour24 < 12 ? "AM" : "PM";
  }
}

function hour12From24(h: number): number {
  const mod = h % 12;
  return mod === 0 ? 12 : mod;
}

function hour24From12(h12: number, period: "am" | "pm"): number {
  if (period === "am") return h12 === 12 ? 0 : h12;
  return h12 === 12 ? 12 : h12 + 12;
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
    <div className="dk-wheel" role="listbox" aria-label={ariaLabel} aria-activedescendant={`${ariaLabel}-${value}`}>
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
              id={`${ariaLabel}-${opt.value}`}
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

export interface TimeWheelPickerProps {
  value: string | null;
  locale: string;
  hourCycle?: TimeWheelHourCycle;
  withSeconds?: boolean;
  min?: string;
  max?: string;
  step?: number;
  onChange: (value: string) => void;
  onDone?: () => void;
  doneLabel?: string;
}

/**
 * Mobile-style drum time picker with a rounded center selection lens per column.
 */
export function TimeWheelPicker({
  value,
  locale,
  hourCycle = "auto",
  withSeconds = false,
  min,
  max,
  step = 60,
  onChange,
  onDone,
  doneLabel = "Done",
}: TimeWheelPickerProps) {
  const cycle = resolveHourCycle(locale, hourCycle);
  const parts = parseTime(value);
  const minParts = parseTime(min ?? "00:00:00");
  const maxParts = parseTime(max ?? "23:59:59");
  const minSecs = toSeconds(minParts.h, minParts.m, minParts.s);
  const maxSecs = toSeconds(maxParts.h, maxParts.m, maxParts.s);

  const minuteStep =
    step > 0 && step % 60 === 0 ? Math.max(1, Math.min(30, Math.floor(step / 60))) : 1;
  const secondStep =
    withSeconds && step > 0 && step < 60 ? Math.max(1, Math.min(30, step)) : 1;

  const period: "am" | "pm" = parts.h < 12 ? "am" : "pm";
  const hourDisplay = cycle === "h12" ? hour12From24(parts.h) : parts.h;

  const isDisabledTime = (h: number, m: number, s: number) => {
    const secs = toSeconds(h, m, s);
    return secs < minSecs || secs > maxSecs;
  };

  const emit = (h: number, m: number, s: number) => {
    if (isDisabledTime(h, m, s)) return;
    onChange(toCanonical(h, m, withSeconds ? s : 0, withSeconds));
  };

  const hourOptions: WheelOption[] =
    cycle === "h12"
      ? Array.from({ length: 12 }, (_, i) => {
          const h12 = i + 1;
          const h24 = hour24From12(h12, period);
          return {
            value: String(h12),
            label: String(h12),
            disabled: isDisabledTime(h24, parts.m, parts.s),
          };
        })
      : Array.from({ length: 24 }, (_, h) => ({
          value: String(h),
          label: pad2(h),
          disabled: isDisabledTime(h, parts.m, parts.s),
        }));

  const minuteOptions: WheelOption[] = Array.from(
    { length: Math.floor(60 / minuteStep) },
    (_, i) => {
      const m = i * minuteStep;
      return {
        value: String(m),
        label: pad2(m),
        disabled: isDisabledTime(parts.h, m, parts.s),
      };
    }
  );

  const secondOptions: WheelOption[] = Array.from(
    { length: Math.floor(60 / secondStep) },
    (_, i) => {
      const s = i * secondStep;
      return {
        value: String(s),
        label: pad2(s),
        disabled: isDisabledTime(parts.h, parts.m, s),
      };
    }
  );

  const periodOptions: WheelOption[] = [
    {
      value: "am",
      label: dayPeriodLabel(locale, 0),
      disabled: isDisabledTime(hour24From12(hour12From24(parts.h), "am"), parts.m, parts.s),
    },
    {
      value: "pm",
      label: dayPeriodLabel(locale, 13),
      disabled: isDisabledTime(hour24From12(hour12From24(parts.h), "pm"), parts.m, parts.s),
    },
  ];

  return (
    <div className="dk-wheel-panel" role="dialog" aria-label="Time picker">
      <div className="dk-wheel-panel__columns">
        <WheelColumn
          aria-label="Hour"
          options={hourOptions}
          value={String(hourDisplay)}
          onChange={(next) => {
            const hNum = Number(next);
            const h = cycle === "h12" ? hour24From12(hNum, period) : hNum;
            emit(h, parts.m, parts.s);
          }}
        />
        <WheelColumn
          aria-label="Minute"
          options={minuteOptions}
          value={String(parts.m - (parts.m % minuteStep))}
          onChange={(next) => emit(parts.h, Number(next), parts.s)}
        />
        {withSeconds ? (
          <WheelColumn
            aria-label="Second"
            options={secondOptions}
            value={String(parts.s - (parts.s % secondStep))}
            onChange={(next) => emit(parts.h, parts.m, Number(next))}
          />
        ) : null}
        {cycle === "h12" ? (
          <WheelColumn
            aria-label="Period"
            options={periodOptions}
            value={period}
            onChange={(next) => {
              const p = next as "am" | "pm";
              emit(hour24From12(hour12From24(parts.h), p), parts.m, parts.s);
            }}
          />
        ) : null}
      </div>
      {onDone ? (
        <button type="button" className="dk-wheel-panel__done" onClick={onDone}>
          {doneLabel}
        </button>
      ) : null}
    </div>
  );
}
