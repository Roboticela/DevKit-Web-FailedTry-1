import * as React from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════════════ */

export type OverflowMode = "auto" | "hidden" | "clip" | "scroll" | "visible";
export type OverflowAxis = "x" | "y" | "both";
export type OverscrollBehavior = "auto" | "contain" | "none";

export interface OverflowState {
  overflowX: boolean;
  overflowY: boolean;
  top: boolean;
  bottom: boolean;
  start: boolean;
  end: boolean;
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
  progressY: number;
  progressX: number;
}

export interface ScrollPosition {
  x: number;
  y: number;
  progressX: number;
  progressY: number;
}

export interface OverflowVirtualOptions {
  itemSize?: number;
  overscan?: number;
  height?: number | string;
}

export interface OverflowProps extends React.HTMLAttributes<HTMLElement> {
  mode?: OverflowMode;
  axis?: OverflowAxis;
  /** Fade edges when content overflows */
  fade?: boolean | "mask" | "edges";
  scrollbar?: boolean | "hidden";
  momentum?: boolean;
  overscroll?: OverscrollBehavior;
  nested?: boolean;
  smooth?: boolean;
  snap?: "x" | "y";
  /** Make region keyboard-focusable (tabIndex=0) */
  focusable?: boolean;
  /** Virtualize children (fixed item height) */
  virtual?: boolean | OverflowVirtualOptions;
  /** Fire when near end — lazy load */
  onEndReached?: () => void;
  endReachedThreshold?: number;
  /** Persist scroll key in sessionStorage */
  preserveScrollKey?: string;
  /** Sync scroll with other containers sharing this channel */
  syncId?: string;
  onOverflowChange?: (state: OverflowState) => void;
  onScrollPosition?: (pos: ScrollPosition) => void;
  /** Pull-to-refresh */
  onRefresh?: () => void | Promise<void>;
  pullToRefresh?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

const MODE_CLASS: Record<OverflowMode, string> = {
  auto: "dk-overflow-auto",
  hidden: "dk-overflow-hidden",
  clip: "dk-overflow-clip",
  scroll: "dk-overflow-scroll",
  visible: "dk-overflow-visible",
};

const AXIS_CLASS: Record<OverflowAxis, Partial<Record<OverflowMode, string>>> = {
  x: {
    auto: "dk-overflow-x-auto",
    scroll: "dk-overflow-x-scroll",
    hidden: "dk-overflow-x-hidden",
    clip: "dk-overflow-x-clip",
  },
  y: {
    auto: "dk-overflow-y-auto",
    scroll: "dk-overflow-y-scroll",
    hidden: "dk-overflow-y-hidden",
    clip: "dk-overflow-y-clip",
  },
  both: {},
};

/* ═══════════════════════════════════════════════════════════════════════════
   Measurement helpers
   ═══════════════════════════════════════════════════════════════════════════ */

export function measureOverflow(el: HTMLElement): OverflowState {
  const {
    scrollTop,
    scrollLeft,
    scrollHeight,
    scrollWidth,
    clientHeight,
    clientWidth,
  } = el;
  const overflowY = scrollHeight > clientHeight + 1;
  const overflowX = scrollWidth > clientWidth + 1;
  const maxY = Math.max(1, scrollHeight - clientHeight);
  const maxX = Math.max(1, scrollWidth - clientWidth);
  return {
    overflowX,
    overflowY,
    top: overflowY && scrollTop > 1,
    bottom: overflowY && scrollTop < maxY - 1,
    start: overflowX && scrollLeft > 1,
    end: overflowX && scrollLeft < maxX - 1,
    scrollTop,
    scrollLeft,
    scrollHeight,
    scrollWidth,
    clientHeight,
    clientWidth,
    progressY: Math.min(1, Math.max(0, scrollTop / maxY)),
    progressX: Math.min(1, Math.max(0, scrollLeft / maxX)),
  };
}

const syncChannels = new Map<string, Set<HTMLElement>>();

function broadcastScroll(syncId: string, source: HTMLElement, top: number, left: number) {
  const set = syncChannels.get(syncId);
  if (!set) return;
  for (const el of set) {
    if (el === source) continue;
    if (Math.abs(el.scrollTop - top) > 1) el.scrollTop = top;
    if (Math.abs(el.scrollLeft - left) > 1) el.scrollLeft = left;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Hooks
   ═══════════════════════════════════════════════════════════════════════════ */

export function useOverflowDetection(
  ref: React.RefObject<HTMLElement | null>,
  deps: unknown[] = []
): OverflowState {
  const [state, setState] = React.useState<OverflowState>(() => ({
    overflowX: false,
    overflowY: false,
    top: false,
    bottom: false,
    start: false,
    end: false,
    scrollTop: 0,
    scrollLeft: 0,
    scrollHeight: 0,
    scrollWidth: 0,
    clientHeight: 0,
    clientWidth: 0,
    progressY: 0,
    progressX: 0,
  }));

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setState(measureOverflow(el));
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    if (el.firstElementChild) ro?.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", update);
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);

  return state;
}

export function useScrollPosition(
  ref: React.RefObject<HTMLElement | null>,
  onChange?: (pos: ScrollPosition) => void
): ScrollPosition {
  const [pos, setPos] = React.useState<ScrollPosition>({
    x: 0,
    y: 0,
    progressX: 0,
    progressY: 0,
  });

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const m = measureOverflow(el);
      const next = {
        x: m.scrollLeft,
        y: m.scrollTop,
        progressX: m.progressX,
        progressY: m.progressY,
      };
      setPos(next);
      onChange?.(next);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [ref, onChange]);

  return pos;
}

export function useScrollSync(syncId: string | undefined, ref: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    if (!syncId) return;
    const el = ref.current;
    if (!el) return;
    let set = syncChannels.get(syncId);
    if (!set) {
      set = new Set();
      syncChannels.set(syncId, set);
    }
    set.add(el);
    const onScroll = () => broadcastScroll(syncId, el, el.scrollTop, el.scrollLeft);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      set!.delete(el);
      if (set!.size === 0) syncChannels.delete(syncId);
    };
  }, [syncId, ref]);
}

export function usePreservedScroll(
  key: string | undefined,
  ref: React.RefObject<HTMLElement | null>
) {
  React.useEffect(() => {
    if (!key || typeof sessionStorage === "undefined") return;
    const el = ref.current;
    if (!el) return;
    try {
      const raw = sessionStorage.getItem(`dk-overflow:${key}`);
      if (raw) {
        const { top, left } = JSON.parse(raw) as { top: number; left: number };
        el.scrollTop = top;
        el.scrollLeft = left;
      }
    } catch {
      /* ignore */
    }
    const save = () => {
      try {
        sessionStorage.setItem(
          `dk-overflow:${key}`,
          JSON.stringify({ top: el.scrollTop, left: el.scrollLeft })
        );
      } catch {
        /* ignore */
      }
    };
    el.addEventListener("scroll", save, { passive: true });
    return () => el.removeEventListener("scroll", save);
  }, [key, ref]);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════════════════ */

export const Overflow = React.forwardRef<HTMLElement, OverflowProps>(function Overflow(
  {
  mode = "auto",
  axis = "y",
  fade = false,
  scrollbar = true,
  momentum = true,
  overscroll = "contain",
  nested = false,
  smooth = false,
  snap,
  focusable = false,
  virtual = false,
  onEndReached,
  endReachedThreshold = 0.85,
  preserveScrollKey,
  syncId,
  onOverflowChange,
  onScrollPosition,
  onRefresh,
  pullToRefresh = false,
  as,
  className,
  style,
  children,
  ...rest
},
  forwardedRef
) {
  const localRef = React.useRef<HTMLElement | null>(null);
  const setRefs = React.useCallback(
    (node: HTMLElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [forwardedRef]
  );
  const ref = localRef;
  const [ptrState, setPtrState] = React.useState<"idle" | "pulling" | "ready" | "refreshing">(
    "idle"
  );
  const pullStart = React.useRef<number | null>(null);
  const endFired = React.useRef(false);

  const virtualOpts: OverflowVirtualOptions =
    typeof virtual === "object"
      ? virtual
      : virtual
        ? { itemSize: 48, overscan: 4, height: 320 }
        : {};
  const isVirtual = Boolean(virtual) && (virtualOpts.itemSize ?? 0) > 0;
  const items = React.Children.toArray(children);
  const [range, setRange] = React.useState({ start: 0, end: 20 });

  const overflowState = useOverflowDetection(ref, [children, isVirtual, range]);
  useScrollSync(syncId, ref);
  usePreservedScroll(preserveScrollKey, ref);

  React.useEffect(() => {
    onOverflowChange?.(overflowState);
  }, [overflowState, onOverflowChange]);

  React.useEffect(() => {
    onScrollPosition?.({
      x: overflowState.scrollLeft,
      y: overflowState.scrollTop,
      progressX: overflowState.progressX,
      progressY: overflowState.progressY,
    });
  }, [overflowState, onScrollPosition]);

  React.useEffect(() => {
    if (!onEndReached) return;
    if (overflowState.progressY >= endReachedThreshold) {
      if (!endFired.current) {
        endFired.current = true;
        onEndReached();
      }
    } else if (overflowState.progressY < endReachedThreshold - 0.1) {
      endFired.current = false;
    }
  }, [overflowState.progressY, endReachedThreshold, onEndReached]);

  React.useEffect(() => {
    if (!isVirtual) return;
    const el = ref.current;
    if (!el) return;
    const itemSize = virtualOpts.itemSize ?? 48;
    const overscan = virtualOpts.overscan ?? 4;
    const onScroll = () => {
      const start = Math.max(0, Math.floor(el.scrollTop / itemSize) - overscan);
      const visible = Math.ceil(el.clientHeight / itemSize) + overscan * 2;
      setRange({ start, end: Math.min(items.length, start + visible) });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isVirtual, items.length, virtualOpts.itemSize, virtualOpts.overscan]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (!pullToRefresh || !onRefresh) return;
    const el = ref.current;
    if (!el || el.scrollTop > 0) return;
    pullStart.current = e.touches[0]?.clientY ?? null;
    setPtrState("pulling");
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!pullToRefresh || pullStart.current == null) return;
    const dy = (e.touches[0]?.clientY ?? 0) - pullStart.current;
    if (dy > 64) setPtrState("ready");
    else if (dy > 8) setPtrState("pulling");
  };

  const onTouchEnd = async () => {
    if (!pullToRefresh || !onRefresh) return;
    if (ptrState === "ready") {
      setPtrState("refreshing");
      try {
        await onRefresh();
      } finally {
        setPtrState("idle");
      }
    } else {
      setPtrState("idle");
    }
    pullStart.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const el = ref.current;
    if (!el || !focusable) return;
    const page = Math.max(40, el.clientHeight * 0.9);
    if (e.key === "ArrowDown") {
      el.scrollBy({ top: 40, behavior: smooth ? "smooth" : "auto" });
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      el.scrollBy({ top: -40, behavior: smooth ? "smooth" : "auto" });
      e.preventDefault();
    } else if (e.key === "PageDown") {
      el.scrollBy({ top: page, behavior: smooth ? "smooth" : "auto" });
      e.preventDefault();
    } else if (e.key === "PageUp") {
      el.scrollBy({ top: -page, behavior: smooth ? "smooth" : "auto" });
      e.preventDefault();
    } else if (e.key === "Home") {
      el.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
      e.preventDefault();
    } else if (e.key === "End") {
      el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
      e.preventDefault();
    }
  };

  const Tag = (as || "div") as React.ElementType;
  const axisClass =
    axis === "both" ? MODE_CLASS[mode] : AXIS_CLASS[axis][mode] || MODE_CLASS[mode];

  const classes = [
    "dk-overflow",
    axisClass,
    fade === true || fade === "mask" ? "dk-overflow-fade" : null,
    fade === "edges" ? "dk-overflow-edges" : null,
    scrollbar === "hidden" ? "dk-overflow-scrollbar-hidden" : scrollbar ? "dk-overflow-scrollbar" : null,
    momentum ? "dk-overflow-momentum" : null,
    overscroll === "contain" ? "dk-overflow-contain" : null,
    overscroll === "none" ? "dk-overflow-none-overscroll" : null,
    nested ? "dk-overflow-nested" : null,
    smooth ? "dk-overflow-scroll-smooth" : null,
    snap === "x" ? "dk-overflow-snap-x" : null,
    snap === "y" ? "dk-overflow-snap-y" : null,
    focusable ? "dk-overflow-focusable" : null,
    isVirtual ? "dk-overflow-virtual" : null,
    pullToRefresh ? "dk-overflow-ptr" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  let body: React.ReactNode = children;
  if (isVirtual) {
    const itemSize = virtualOpts.itemSize ?? 48;
    const top = range.start * itemSize;
    const bottom = Math.max(0, (items.length - range.end) * itemSize);
    body = (
      <>
        <div className="dk-overflow-virtual-spacer" style={{ height: top }} aria-hidden />
        {items.slice(range.start, range.end)}
        <div className="dk-overflow-virtual-spacer" style={{ height: bottom }} aria-hidden />
      </>
    );
  }

  const mergedStyle: React.CSSProperties = {
    ...style,
    ...(isVirtual
      ? {
          height:
            typeof virtualOpts.height === "number"
              ? `${virtualOpts.height}px`
              : virtualOpts.height ?? "20rem",
        }
      : null),
  };

  return (
    <Tag
      ref={setRefs}
      className={classes}
      style={mergedStyle}
      tabIndex={focusable ? 0 : undefined}
      role={focusable ? "region" : undefined}
      data-dk-overflow={mode}
      data-overflow-top={overflowState.top ? "true" : "false"}
      data-overflow-bottom={overflowState.bottom ? "true" : "false"}
      data-overflow-start={overflowState.start ? "true" : "false"}
      data-overflow-end={overflowState.end ? "true" : "false"}
      data-ptr={pullToRefresh ? ptrState : undefined}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      {...rest}
    >
      {pullToRefresh ? (
        <div className="dk-overflow-ptr-indicator" aria-live="polite">
          {ptrState === "refreshing"
            ? "Refreshing…"
            : ptrState === "ready"
              ? "Release to refresh"
              : "Pull to refresh"}
        </div>
      ) : null}
      {body}
    </Tag>
  );
});

Overflow.displayName = "Overflow";

export const OverflowUtilities = Overflow;

export function OverflowX(props: Omit<OverflowProps, "axis">) {
  return <Overflow axis="x" {...props} />;
}

export function OverflowY(props: Omit<OverflowProps, "axis">) {
  return <Overflow axis="y" {...props} />;
}

export function OverflowHidden(props: Omit<OverflowProps, "mode">) {
  return <Overflow mode="hidden" {...props} />;
}

export function OverflowClip(props: Omit<OverflowProps, "mode">) {
  return <Overflow mode="clip" {...props} />;
}

/** Build className for existing scroll hosts */
export function overflowClassName(
  props: Pick<
    OverflowProps,
    | "mode"
    | "axis"
    | "fade"
    | "scrollbar"
    | "momentum"
    | "overscroll"
    | "nested"
    | "smooth"
    | "snap"
    | "className"
  >
): string {
  const {
    mode = "auto",
    axis = "y",
    fade,
    scrollbar = true,
    momentum = true,
    overscroll = "contain",
    nested,
    smooth,
    snap,
    className,
  } = props;
  const axisClass =
    axis === "both" ? MODE_CLASS[mode] : AXIS_CLASS[axis][mode] || MODE_CLASS[mode];
  return [
    "dk-overflow",
    axisClass,
    fade === true || fade === "mask" ? "dk-overflow-fade" : null,
    fade === "edges" ? "dk-overflow-edges" : null,
    scrollbar === "hidden" ? "dk-overflow-scrollbar-hidden" : scrollbar ? "dk-overflow-scrollbar" : null,
    momentum ? "dk-overflow-momentum" : null,
    overscroll === "contain" ? "dk-overflow-contain" : null,
    overscroll === "none" ? "dk-overflow-none-overscroll" : null,
    nested ? "dk-overflow-nested" : null,
    smooth ? "dk-overflow-scroll-smooth" : null,
    snap === "x" ? "dk-overflow-snap-x" : null,
    snap === "y" ? "dk-overflow-snap-y" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
