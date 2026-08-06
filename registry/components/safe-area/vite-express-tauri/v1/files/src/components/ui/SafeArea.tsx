import * as React from "react";

export type SafeAreaEdge = "top" | "right" | "bottom" | "left";
export type SafeAreaEdges =
  | "all"
  | "x"
  | "y"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | SafeAreaEdge[];

export type SafeAreaMode =
  | "default"
  | "immersive"
  | "fullscreen"
  | "nav"
  | "fab"
  | "panel"
  | "keyboard";

export type SafeAreaInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  /** On-screen keyboard / browser chrome encroachment (px) */
  keyboard: number;
  orientation: "portrait" | "landscape" | "unknown";
};

export type SafeAreaEdgeMap = Partial<Record<SafeAreaEdge, boolean | string | number>>;

export interface SafeAreaProps extends React.HTMLAttributes<HTMLElement> {
  /** Which edges receive safe padding (default all). Legacy: all | x | y | top | bottom */
  edges?: SafeAreaEdges;
  /** Per-edge enable or extra CSS length */
  top?: boolean | string | number;
  right?: boolean | string | number;
  bottom?: boolean | string | number;
  left?: boolean | string | number;
  /** Layout mode presets */
  mode?: SafeAreaMode;
  /** Extra offset beyond device insets */
  offset?: SafeAreaEdgeMap;
  /** Minimum padding floor per edge */
  min?: SafeAreaEdgeMap;
  /** Include keyboard inset in bottom (also via mode="keyboard") */
  keyboard?: boolean;
  /** Include fold/hinge insets when available */
  fold?: boolean;
  /** Nested — skip device insets (extra/mode still apply) */
  nested?: boolean;
  /** Animate padding on rotation / keyboard */
  motion?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

const EDGE_CLASS: Record<string, string> = {
  all: "dk-safe-area",
  x: "dk-safe-x",
  y: "dk-safe-y",
  top: "dk-safe-top",
  bottom: "dk-safe-bottom",
  left: "dk-safe-left",
  right: "dk-safe-right",
};

const MODE_CLASS: Record<SafeAreaMode, string> = {
  default: "",
  immersive: "dk-safe-mode-immersive",
  fullscreen: "dk-safe-mode-fullscreen",
  nav: "dk-safe-mode-nav",
  fab: "dk-safe-mode-fab",
  panel: "dk-safe-mode-panel",
  keyboard: "dk-safe-mode-keyboard",
};

function toCssLength(value: string | number | undefined): string | undefined {
  if (value == null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

function parsePx(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function readEnvInset(edge: SafeAreaEdge): number {
  if (typeof document === "undefined") return 0;
  const probe = document.createElement("div");
  probe.style.cssText = `
    position: fixed; visibility: hidden; pointer-events: none;
    padding-${edge}: env(safe-area-inset-${edge}, 0px);
  `;
  document.body.appendChild(probe);
  const px = parsePx(getComputedStyle(probe).getPropertyValue(`padding-${edge}`));
  document.body.removeChild(probe);
  return px;
}

function readKeyboardInset(): number {
  if (typeof window === "undefined" || !window.visualViewport) return 0;
  const vv = window.visualViewport;
  const occluded = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
  return Math.round(occluded);
}

function readOrientation(): SafeAreaInsets["orientation"] {
  if (typeof window === "undefined") return "unknown";
  if (window.matchMedia("(orientation: portrait)").matches) return "portrait";
  if (window.matchMedia("(orientation: landscape)").matches) return "landscape";
  return window.innerHeight >= window.innerWidth ? "portrait" : "landscape";
}

/** Snapshot current safe-area insets (env + visualViewport keyboard). */
export function getSafeAreaInsets(): SafeAreaInsets {
  return {
    top: readEnvInset("top"),
    right: readEnvInset("right"),
    bottom: readEnvInset("bottom"),
    left: readEnvInset("left"),
    keyboard: readKeyboardInset(),
    orientation: readOrientation(),
  };
}

type SafeAreaContextValue = SafeAreaInsets & {
  /** Re-measure now */
  refresh: () => void;
};

const SafeAreaContext = React.createContext<SafeAreaContextValue | null>(null);

export interface SafeAreaProviderProps {
  children?: React.ReactNode;
  /** Write measured values onto documentElement as --safe-measured-* */
  syncCssVars?: boolean;
  /** Also track visualViewport keyboard inset */
  trackKeyboard?: boolean;
}

/**
 * Measures safe-area + keyboard insets and exposes them via context / CSS vars.
 * Reacts to resize, orientation change, and visualViewport updates.
 */
export function SafeAreaProvider({
  children,
  syncCssVars = true,
  trackKeyboard = true,
}: SafeAreaProviderProps) {
  const [insets, setInsets] = React.useState<SafeAreaInsets>(() =>
    typeof window === "undefined"
      ? { top: 0, right: 0, bottom: 0, left: 0, keyboard: 0, orientation: "unknown" }
      : getSafeAreaInsets()
  );

  const refresh = React.useCallback(() => {
    const next = getSafeAreaInsets();
    if (!trackKeyboard) next.keyboard = 0;
    setInsets(next);

    if (syncCssVars && typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--safe-measured-top", `${next.top}px`);
      root.style.setProperty("--safe-measured-right", `${next.right}px`);
      root.style.setProperty("--safe-measured-bottom", `${next.bottom}px`);
      root.style.setProperty("--safe-measured-left", `${next.left}px`);
      root.style.setProperty("--safe-keyboard", `${next.keyboard}px`);
      root.dataset.safeOrientation = next.orientation;
    }
  }, [syncCssVars, trackKeyboard]);

  React.useEffect(() => {
    refresh();
    const onResize = () => refresh();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", onResize);
    vv?.addEventListener("scroll", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      vv?.removeEventListener("resize", onResize);
      vv?.removeEventListener("scroll", onResize);
    };
  }, [refresh]);

  const value = React.useMemo(() => ({ ...insets, refresh }), [insets, refresh]);

  return <SafeAreaContext.Provider value={value}>{children}</SafeAreaContext.Provider>;
}

/** Subscribe to live safe-area insets (requires SafeAreaProvider for live updates). */
export function useSafeArea(): SafeAreaContextValue {
  const ctx = React.useContext(SafeAreaContext);
  const [fallback, setFallback] = React.useState<SafeAreaInsets>(() =>
    typeof window === "undefined"
      ? { top: 0, right: 0, bottom: 0, left: 0, keyboard: 0, orientation: "unknown" }
      : getSafeAreaInsets()
  );

  React.useEffect(() => {
    if (ctx) return;
    const update = () => setFallback(getSafeAreaInsets());
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [ctx]);

  if (ctx) return ctx;
  return { ...fallback, refresh: () => setFallback(getSafeAreaInsets()) };
}

/** Alias — insets only */
export function useSafeAreaInsets(): SafeAreaInsets {
  const { top, right, bottom, left, keyboard, orientation } = useSafeArea();
  return { top, right, bottom, left, keyboard, orientation };
}

function resolveEdgeClasses(
  edges: SafeAreaEdges | undefined,
  perEdge: SafeAreaEdgeMap
): string {
  const enabled = new Set<SafeAreaEdge>();

  if (Array.isArray(edges)) {
    edges.forEach((e) => enabled.add(e));
  } else if (edges === "all" || edges == null) {
    enabled.add("top");
    enabled.add("right");
    enabled.add("bottom");
    enabled.add("left");
  } else if (edges === "x") {
    enabled.add("left");
    enabled.add("right");
  } else if (edges === "y") {
    enabled.add("top");
    enabled.add("bottom");
  } else {
    enabled.add(edges);
  }

  (["top", "right", "bottom", "left"] as const).forEach((edge) => {
    const v = perEdge[edge];
    if (v === false) enabled.delete(edge);
    else if (v === true || typeof v === "string" || typeof v === "number") enabled.add(edge);
  });

  if (enabled.size === 4) return "dk-safe-area";
  if (enabled.has("left") && enabled.has("right") && enabled.size === 2) return "dk-safe-x";
  if (enabled.has("top") && enabled.has("bottom") && enabled.size === 2) return "dk-safe-y";

  return Array.from(enabled)
    .map((e) => EDGE_CLASS[e])
    .filter(Boolean)
    .join(" ");
}

/**
 * SafeArea — pads content for notches, Dynamic Island, home indicators,
 * foldables, keyboards, and browser chrome.
 */
export function SafeArea({
  edges = "all",
  top,
  right,
  bottom,
  left,
  mode = "default",
  offset,
  min,
  keyboard = false,
  fold = false,
  nested = false,
  motion = true,
  as = "div",
  className = "",
  style,
  children,
  ...props
}: SafeAreaProps) {
  const perEdge: SafeAreaEdgeMap = { top, right, bottom, left };
  const edgeClass = resolveEdgeClasses(edges, perEdge);
  const resolvedMode = keyboard && mode === "default" ? "keyboard" : mode;

  const extraStyle: React.CSSProperties = {};
  const setExtra = (edge: SafeAreaEdge, value: boolean | string | number | undefined) => {
    if (typeof value === "string" || typeof value === "number") {
      (extraStyle as Record<string, string>)[`--safe-extra-${edge}`] = toCssLength(value)!;
    }
  };
  setExtra("top", top);
  setExtra("right", right);
  setExtra("bottom", bottom);
  setExtra("left", left);

  if (offset) {
    (["top", "right", "bottom", "left"] as const).forEach((edge) => {
      const v = offset[edge];
      if (v == null || v === false) return;
      const len = v === true ? undefined : toCssLength(v);
      if (len) {
        (extraStyle as Record<string, string>)[`--safe-extra-${edge}`] = len;
      }
    });
  }

  const minStyle: React.CSSProperties = {};
  if (min) {
    (["top", "right", "bottom", "left"] as const).forEach((edge) => {
      const v = min[edge];
      if (v == null || v === false) return;
      const len = v === true ? "0px" : toCssLength(v);
      if (len) (minStyle as Record<string, string>)[`--safe-min-${edge}`] = len;
    });
  }

  const classes = [
    edgeClass,
    MODE_CLASS[resolvedMode],
    fold ? "dk-safe-fold" : "",
    nested ? "dk-safe-nested" : "",
    motion ? "dk-safe-motion" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Tag = as as React.ElementType;

  return (
    <Tag
      className={classes}
      style={{ ...extraStyle, ...minStyle, ...style }}
      data-safe-mode={resolvedMode !== "default" ? resolvedMode : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** Fixed bottom bar that respects safe + keyboard insets */
export function SafeAreaBottomBar({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`dk-safe-fixed-bottom dk-safe-motion ${className}`.trim()} {...props} />;
}

/** Fixed top bar that respects safe insets */
export function SafeAreaTopBar({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`dk-safe-fixed-top dk-safe-motion ${className}`.trim()} {...props} />;
}

/** Floating action button anchor */
export function SafeAreaFab({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`dk-safe-fab dk-safe-motion ${className}`.trim()} {...props} />;
}

export { SafeAreaContext };
