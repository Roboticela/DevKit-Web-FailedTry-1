import * as React from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Semantic breakpoints — source of truth (mirrors breakpoint-system.css)
   ═══════════════════════════════════════════════════════════════════════════ */

export const BREAKPOINTS = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1440,
  "3xl": 1680,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Ordered ascending — used for resolution & comparisons */
export const BREAKPOINT_ORDER: Breakpoint[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
];

/** Legacy device aliases → semantic tokens */
export const BREAKPOINT_ALIASES = {
  phone: "xs",
  phablet: "sm",
  tablet: "md",
  laptop: "lg",
  desktop: "xl",
  ultrawide: "2xl",
  "ultrawide-xl": "3xl",
} as const;

export type BreakpointAlias = keyof typeof BREAKPOINT_ALIASES;
export type BreakpointInput = Breakpoint | BreakpointAlias;

export type Orientation = "portrait" | "landscape";
export type PointerType = "fine" | "coarse" | "none";
export type HoverCapability = "hover" | "none";
export type ContrastPreference = "no-preference" | "more" | "less" | "custom";
export type ColorSchemePreference = "light" | "dark" | "no-preference";
export type BreakpointDirection = "up" | "down" | "only";

export interface BreakpointSnapshot {
  breakpoint: Breakpoint;
  width: number;
  height: number;
  orientation: Orientation;
  dpr: number;
  /** High-density display (DPR ≥ 2 or resolution media) */
  dense: boolean;
  touch: boolean;
  pointer: PointerType;
  hover: HoverCapability;
  reducedMotion: boolean;
  reducedTransparency: boolean;
  prefersContrast: ContrastPreference;
  prefersColorScheme: ColorSchemePreference;
  foldable: boolean;
  print: boolean;
  /** False until first client measurement (SSR / pre-hydrate) */
  hydrated: boolean;
}

export type BreakpointListener = (snapshot: BreakpointSnapshot, prev: BreakpointSnapshot | null) => void;

export const BREAKPOINT_EVENT = "devkit:breakpoint";
export const BREAKPOINT_RESIZE_EVENT = "devkit:breakpoint-resize";
export const BREAKPOINT_LAYOUT_EVENT = "devkit:layout-recalc";

const DEFAULT_SSR: Breakpoint = "md";

/* ═══════════════════════════════════════════════════════════════════════════
   Utilities
   ═══════════════════════════════════════════════════════════════════════════ */

export function normalizeBreakpoint(input: BreakpointInput): Breakpoint {
  if (input in BREAKPOINTS) return input as Breakpoint;
  return BREAKPOINT_ALIASES[input as BreakpointAlias] ?? "md";
}

export function resolveBreakpoint(width: number): Breakpoint {
  let current: Breakpoint = "xs";
  for (const bp of BREAKPOINT_ORDER) {
    if (width >= BREAKPOINTS[bp]) current = bp;
  }
  return current;
}

export function breakpointMin(bp: BreakpointInput): number {
  return BREAKPOINTS[normalizeBreakpoint(bp)];
}

export function breakpointMax(bp: BreakpointInput): number {
  const n = normalizeBreakpoint(bp);
  const idx = BREAKPOINT_ORDER.indexOf(n);
  if (idx < 0 || idx === BREAKPOINT_ORDER.length - 1) return Number.POSITIVE_INFINITY;
  return BREAKPOINTS[BREAKPOINT_ORDER[idx + 1]] - 0.02;
}

export function matchesBreakpoint(
  width: number,
  bp: BreakpointInput,
  direction: BreakpointDirection = "up"
): boolean {
  const n = normalizeBreakpoint(bp);
  const resolved = resolveBreakpoint(width);
  const a = BREAKPOINT_ORDER.indexOf(resolved);
  const b = BREAKPOINT_ORDER.indexOf(n);
  if (direction === "only") return resolved === n;
  if (direction === "up") return a >= b;
  return a <= b;
}

/** Media-query builders — use these instead of hardcoding px in components */
export const mq = {
  up: (bp: BreakpointInput) => `(min-width: ${breakpointMin(bp)}px)`,
  down: (bp: BreakpointInput) => {
    const max = breakpointMax(bp);
    if (!Number.isFinite(max)) return "(min-width: 0px)";
    return `(max-width: ${max}px)`;
  },
  only: (bp: BreakpointInput) => {
    const n = normalizeBreakpoint(bp);
    const min = BREAKPOINTS[n];
    const max = breakpointMax(n);
    if (!Number.isFinite(max)) return `(min-width: ${min}px)`;
    return `(min-width: ${min}px) and (max-width: ${max}px)`;
  },
  between: (min: BreakpointInput, max: BreakpointInput) =>
    `(min-width: ${breakpointMin(min)}px) and (max-width: ${breakpointMax(max)}px)`,
  orientation: (value: Orientation) => `(orientation: ${value})`,
  pointer: (value: PointerType) => `(pointer: ${value})`,
  hover: (value: HoverCapability) => `(hover: ${value})`,
  reducedMotion: () => "(prefers-reduced-motion: reduce)",
  reducedTransparency: () => "(prefers-reduced-transparency: reduce)",
  contrastMore: () => "(prefers-contrast: more)",
  dense: () => "(resolution >= 2dppx)",
  foldable: () =>
    "(horizontal-viewport-segments: 2), (vertical-viewport-segments: 2)",
  print: () => "print",
};

export function readBreakpointsFromCss(
  el: Element = typeof document !== "undefined" ? document.documentElement : (null as unknown as Element)
): Record<Breakpoint, number> {
  const fallback = { ...BREAKPOINTS };
  if (typeof window === "undefined" || !el) return fallback;
  const styles = getComputedStyle(el);
  const out = { ...fallback };
  for (const bp of BREAKPOINT_ORDER) {
    const raw = styles.getPropertyValue(`--bp-${bp}`).trim();
    const n = Number.parseFloat(raw);
    if (!Number.isNaN(n)) out[bp] = n;
  }
  return out;
}

function safeMatch(query: string, fallback = false): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return fallback;
  try {
    return window.matchMedia(query).matches;
  } catch {
    return fallback;
  }
}

function measureSnapshot(hydrated: boolean, ssrBreakpoint: Breakpoint): BreakpointSnapshot {
  if (typeof window === "undefined") {
    return {
      breakpoint: ssrBreakpoint,
      width: BREAKPOINTS[ssrBreakpoint] || 1024,
      height: 768,
      orientation: "landscape",
      dpr: 1,
      dense: false,
      touch: false,
      pointer: "fine",
      hover: "hover",
      reducedMotion: false,
      reducedTransparency: false,
      prefersContrast: "no-preference",
      prefersColorScheme: "no-preference",
      foldable: false,
      print: false,
      hydrated: false,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  const orientation: Orientation =
    height >= width || safeMatch("(orientation: portrait)") ? "portrait" : "landscape";

  let pointer: PointerType = "fine";
  if (safeMatch("(pointer: coarse)")) pointer = "coarse";
  else if (safeMatch("(pointer: none)")) pointer = "none";

  const hover: HoverCapability = safeMatch("(hover: hover)") ? "hover" : "none";
  const touch =
    pointer === "coarse" ||
    (typeof navigator !== "undefined" && (navigator.maxTouchPoints ?? 0) > 0);

  let prefersContrast: ContrastPreference = "no-preference";
  if (safeMatch("(prefers-contrast: more)")) prefersContrast = "more";
  else if (safeMatch("(prefers-contrast: less)")) prefersContrast = "less";
  else if (safeMatch("(prefers-contrast: custom)")) prefersContrast = "custom";

  let prefersColorScheme: ColorSchemePreference = "no-preference";
  if (safeMatch("(prefers-color-scheme: dark)")) prefersColorScheme = "dark";
  else if (safeMatch("(prefers-color-scheme: light)")) prefersColorScheme = "light";

  return {
    breakpoint: resolveBreakpoint(width),
    width,
    height,
    orientation,
    dpr,
    dense: dpr >= 2 || safeMatch("(resolution >= 2dppx)"),
    touch,
    pointer,
    hover,
    reducedMotion: safeMatch("(prefers-reduced-motion: reduce)"),
    reducedTransparency: safeMatch("(prefers-reduced-transparency: reduce)"),
    prefersContrast,
    prefersColorScheme,
    foldable: safeMatch(mq.foldable()),
    print: safeMatch("print"),
    hydrated,
  };
}

function snapshotsEqual(a: BreakpointSnapshot, b: BreakpointSnapshot): boolean {
  return (
    a.breakpoint === b.breakpoint &&
    a.width === b.width &&
    a.height === b.height &&
    a.orientation === b.orientation &&
    a.dpr === b.dpr &&
    a.dense === b.dense &&
    a.touch === b.touch &&
    a.pointer === b.pointer &&
    a.hover === b.hover &&
    a.reducedMotion === b.reducedMotion &&
    a.reducedTransparency === b.reducedTransparency &&
    a.prefersContrast === b.prefersContrast &&
    a.prefersColorScheme === b.prefersColorScheme &&
    a.foldable === b.foldable &&
    a.print === b.print &&
    a.hydrated === b.hydrated
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Layout recalc · animation coordination
   ═══════════════════════════════════════════════════════════════════════════ */

let recalcRaf = 0;
let resizeFlagTimer = 0;

export function scheduleLayoutRecalc(fn?: () => void): void {
  if (typeof window === "undefined") {
    fn?.();
    return;
  }
  const root = document.documentElement;
  root.dataset.bpResizing = "true";
  window.clearTimeout(resizeFlagTimer);
  resizeFlagTimer = window.setTimeout(() => {
    delete root.dataset.bpResizing;
  }, 150);

  window.cancelAnimationFrame(recalcRaf);
  recalcRaf = window.requestAnimationFrame(() => {
    recalcRaf = window.requestAnimationFrame(() => {
      const run = () => {
        fn?.();
        window.dispatchEvent(
          new CustomEvent(BREAKPOINT_LAYOUT_EVENT, { detail: getBreakpointSnapshot() })
        );
      };
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => void;
      };
      if (
        typeof doc.startViewTransition === "function" &&
        !getBreakpointSnapshot().reducedMotion
      ) {
        try {
          doc.startViewTransition(run);
          return;
        } catch {
          /* fall through */
        }
      }
      run();
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   Singleton manager
   ═══════════════════════════════════════════════════════════════════════════ */

type ManagerOptions = {
  ssrBreakpoint?: Breakpoint;
  syncDocument?: boolean;
  syncCssVars?: boolean;
};

let snapshot: BreakpointSnapshot = measureSnapshot(false, DEFAULT_SSR);
let listeners = new Set<BreakpointListener>();
let started = false;
let managerOpts: Required<ManagerOptions> = {
  ssrBreakpoint: DEFAULT_SSR,
  syncDocument: true,
  syncCssVars: true,
};
let stopFns: Array<() => void> = [];

function applyDocument(next: BreakpointSnapshot): void {
  if (typeof document === "undefined") return;
  if (!managerOpts.syncDocument) return;
  const root = document.documentElement;
  root.dataset.bp = next.breakpoint;
  root.dataset.orientation = next.orientation;
  root.dataset.pointer = next.pointer;
  root.dataset.hover = next.hover;
  root.dataset.touch = next.touch ? "true" : "false";
  root.dataset.density = next.dense ? "high" : "standard";
  root.dataset.fold = next.foldable ? "true" : "false";
  if (!root.dataset.motion) {
    root.dataset.motionPref = next.reducedMotion ? "reduce" : "full";
  }
  root.dataset.transparency = next.reducedTransparency ? "reduce" : "full";
  root.dataset.contrast = next.prefersContrast;
  root.dataset.colorSchemePref = next.prefersColorScheme;

  if (managerOpts.syncCssVars) {
    root.style.setProperty("--bp-current", `var(--bp-${next.breakpoint})`);
    root.style.setProperty("--bp-width", `${next.width}px`);
    root.style.setProperty("--bp-height", `${next.height}px`);
    root.style.setProperty("--bp-dpr", String(next.dpr));
  }
}

function emit(next: BreakpointSnapshot, prev: BreakpointSnapshot | null, kind: "change" | "resize") {
  snapshot = next;
  applyDocument(next);
  for (const listener of listeners) listener(next, prev);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(kind === "resize" ? BREAKPOINT_RESIZE_EVENT : BREAKPOINT_EVENT, {
        detail: { snapshot: next, prev },
      })
    );
  }
}

function refresh(kind: "change" | "resize" = "change"): void {
  const prev = snapshot;
  const next = measureSnapshot(true, managerOpts.ssrBreakpoint);
  if (snapshotsEqual(prev, next) && prev.hydrated) {
    if (kind === "resize") {
      /* width may be equal after orientation-only — still notify resize channel lightly */
    }
    return;
  }
  const bpChanged = prev.breakpoint !== next.breakpoint || !prev.hydrated;
  emit(next, prev.hydrated ? prev : null, bpChanged ? "change" : "resize");
  if (bpChanged || kind === "resize") {
    scheduleLayoutRecalc();
  }
}

function bindMedia(query: string): void {
  if (typeof window === "undefined" || !window.matchMedia) return;
  try {
    const mql = window.matchMedia(query);
    const onChange = () => refresh("change");
    mql.addEventListener?.("change", onChange);
    stopFns.push(() => mql.removeEventListener?.("change", onChange));
  } catch {
    /* ignore unsupported queries */
  }
}

export function configureBreakpointManager(options: ManagerOptions = {}): void {
  managerOpts = {
    ssrBreakpoint: options.ssrBreakpoint ?? DEFAULT_SSR,
    syncDocument: options.syncDocument ?? true,
    syncCssVars: options.syncCssVars ?? true,
  };
  if (!snapshot.hydrated) {
    snapshot = { ...snapshot, breakpoint: managerOpts.ssrBreakpoint };
  }
}

export function startBreakpointManager(options?: ManagerOptions): () => void {
  if (options) configureBreakpointManager(options);
  if (typeof window === "undefined") return () => undefined;
  if (started) {
    refresh("change");
    return stopBreakpointManager;
  }
  started = true;
  refresh("change");

  const onResize = () => {
    scheduleLayoutRecalc(() => refresh("resize"));
  };
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onResize);
  window.visualViewport?.addEventListener("resize", onResize);
  stopFns.push(() => {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
    window.visualViewport?.removeEventListener("resize", onResize);
  });

  bindMedia(mq.orientation("portrait"));
  bindMedia(mq.pointer("fine"));
  bindMedia(mq.pointer("coarse"));
  bindMedia(mq.hover("hover"));
  bindMedia(mq.reducedMotion());
  bindMedia(mq.reducedTransparency());
  bindMedia(mq.contrastMore());
  bindMedia("(prefers-color-scheme: dark)");
  bindMedia(mq.dense());
  bindMedia(mq.foldable());
  bindMedia("print");

  return stopBreakpointManager;
}

export function stopBreakpointManager(): void {
  for (const stop of stopFns) stop();
  stopFns = [];
  started = false;
}

export function getBreakpointSnapshot(): BreakpointSnapshot {
  return snapshot;
}

export function subscribeBreakpoints(listener: BreakpointListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Inline script — set data-bp before paint to avoid SSR mismatch flash */
export function getBreakpointInitScript(ssrBreakpoint: Breakpoint = DEFAULT_SSR): string {
  const points = BREAKPOINT_ORDER.map((bp) => `"${bp}":${BREAKPOINTS[bp]}`).join(",");
  return `(function(){try{var b={${points}};var w=window.innerWidth||0;var c="${ssrBreakpoint}";for(var k of ["xs","sm","md","lg","xl","2xl","3xl"]){if(w>=b[k])c=k;}var d=document.documentElement;d.dataset.bp=c;d.dataset.orientation=window.innerHeight>=w?"portrait":"landscape";d.style.setProperty("--bp-width",w+"px");d.style.setProperty("--bp-current","var(--bp-"+c+")");}catch(e){}})();`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   React context · provider
   ═══════════════════════════════════════════════════════════════════════════ */

const BreakpointContext = React.createContext<BreakpointSnapshot | null>(null);

export interface BreakpointProviderProps {
  children?: React.ReactNode;
  /** Assumed breakpoint for SSR / first paint (default md) */
  ssrBreakpoint?: Breakpoint;
  syncDocument?: boolean;
  syncCssVars?: boolean;
  /** Debounce resize measurements (ms) — 0 = rAF only */
  resizeDebounce?: number;
}

export function BreakpointProvider({
  children,
  ssrBreakpoint = DEFAULT_SSR,
  syncDocument = true,
  syncCssVars = true,
}: BreakpointProviderProps) {
  const [state, setState] = React.useState<BreakpointSnapshot>(() => ({
    ...measureSnapshot(false, ssrBreakpoint),
    breakpoint: ssrBreakpoint,
    hydrated: false,
  }));

  React.useEffect(() => {
    const stop = startBreakpointManager({ ssrBreakpoint, syncDocument, syncCssVars });
    setState(getBreakpointSnapshot());
    return subscribeBreakpoints((next) => setState(next));
  }, [ssrBreakpoint, syncDocument, syncCssVars]);

  return (
    <BreakpointContext.Provider value={state}>{children}</BreakpointContext.Provider>
  );
}

/** Alias — centralized manager entry */
export const BreakpointManager = BreakpointProvider;

export function BreakpointScript({ ssrBreakpoint = DEFAULT_SSR }: { ssrBreakpoint?: Breakpoint }) {
  const code = getBreakpointInitScript(ssrBreakpoint);
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Hooks
   ═══════════════════════════════════════════════════════════════════════════ */

export function useBreakpointSnapshot(): BreakpointSnapshot {
  const ctx = React.useContext(BreakpointContext);
  const [local, setLocal] = React.useState<BreakpointSnapshot>(
    () => ctx ?? getBreakpointSnapshot()
  );

  React.useEffect(() => {
    if (ctx) return;
    startBreakpointManager();
    setLocal(getBreakpointSnapshot());
    return subscribeBreakpoints((next) => setLocal(next));
  }, [ctx]);

  return ctx ?? local;
}

export function useBreakpoint(): Breakpoint {
  return useBreakpointSnapshot().breakpoint;
}

export function useBreakpointMatch(
  bp: BreakpointInput,
  direction: BreakpointDirection = "up"
): boolean {
  const { width } = useBreakpointSnapshot();
  return matchesBreakpoint(width, bp, direction);
}

export function useMediaQuery(query: string | null | undefined, ssrFallback = false): boolean {
  const get = React.useCallback(() => {
    if (query == null) return ssrFallback;
    return safeMatch(query, ssrFallback);
  }, [query, ssrFallback]);

  const [matches, setMatches] = React.useState(get);

  React.useEffect(() => {
    if (query == null || typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [query]);

  return matches;
}

export function useOrientation(): Orientation {
  return useBreakpointSnapshot().orientation;
}

export function usePointer(): PointerType {
  return useBreakpointSnapshot().pointer;
}

export function useHoverCapability(): HoverCapability {
  return useBreakpointSnapshot().hover;
}

export function useTouch(): boolean {
  return useBreakpointSnapshot().touch;
}

export function usePrefersReducedMotion(): boolean {
  return useBreakpointSnapshot().reducedMotion;
}

export function usePrefersReducedTransparency(): boolean {
  return useBreakpointSnapshot().reducedTransparency;
}

export function useFoldable(): boolean {
  return useBreakpointSnapshot().foldable;
}

export function useDensity(): { dpr: number; dense: boolean } {
  const { dpr, dense } = useBreakpointSnapshot();
  return { dpr, dense };
}

/**
 * Pick a value by active breakpoint (mobile-first cascade).
 * @example useBreakpointValue({ xs: 1, md: 2, lg: 3 })
 */
export function useBreakpointValue<T>(
  map: Partial<Record<Breakpoint, T>> & { base?: T },
  fallback?: T
): T | undefined {
  const bp = useBreakpoint();
  const idx = BREAKPOINT_ORDER.indexOf(bp);
  let value = map.base ?? fallback;
  for (let i = 0; i <= idx; i++) {
    const key = BREAKPOINT_ORDER[i];
    if (map[key] !== undefined) value = map[key];
  }
  return value;
}

export interface ContainerQueryOptions {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  /** Named semantic size using --cq-* scale */
  from?: "sm" | "md" | "lg" | "xl";
}

const CQ_MIN = { sm: 480, md: 768, lg: 1024, xl: 1280 } as const;

export function useContainerQuery(
  ref: React.RefObject<Element | null>,
  options: ContainerQueryOptions
): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const minW = options.minWidth ?? (options.from ? CQ_MIN[options.from] : 0);
    const maxW = options.maxWidth ?? Number.POSITIVE_INFINITY;
    const minH = options.minHeight ?? 0;
    const maxH = options.maxHeight ?? Number.POSITIVE_INFINITY;

    const check = (w: number, h: number) => {
      setMatches(w >= minW && w <= maxW && h >= minH && h <= maxH);
    };

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) check(cr.width, cr.height);
    });
    ro.observe(node);
    const rect = node.getBoundingClientRect();
    check(rect.width, rect.height);
    return () => ro.disconnect();
  }, [ref, options.minWidth, options.maxWidth, options.minHeight, options.maxHeight, options.from]);

  return matches;
}

/** Subscribe to layout recalc after breakpoint / resize coordination */
export function useLayoutRecalc(callback: (snapshot: BreakpointSnapshot) => void): void {
  const cb = React.useRef(callback);
  cb.current = callback;

  React.useEffect(() => {
    const onLayout = (event: Event) => {
      const detail = (event as CustomEvent).detail as BreakpointSnapshot | undefined;
      cb.current(detail ?? getBreakpointSnapshot());
    };
    window.addEventListener(BREAKPOINT_LAYOUT_EVENT, onLayout);
    return () => window.removeEventListener(BREAKPOINT_LAYOUT_EVENT, onLayout);
  }, []);
}

export function useBreakpointEvent(listener: BreakpointListener): void {
  const ref = React.useRef(listener);
  ref.current = listener;
  React.useEffect(() => subscribeBreakpoints((n, p) => ref.current(n, p)), []);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Components
   ═══════════════════════════════════════════════════════════════════════════ */

export interface BreakpointMatchProps {
  above?: BreakpointInput;
  below?: BreakpointInput;
  only?: BreakpointInput;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

/** Conditional render from the centralized manager (prefer this over ad-hoc matchMedia). */
export function BreakpointMatch({
  above,
  below,
  only,
  children,
  fallback = null,
}: BreakpointMatchProps) {
  const { width } = useBreakpointSnapshot();
  let ok = true;
  if (only != null) ok = matchesBreakpoint(width, only, "only");
  if (above != null) ok = ok && matchesBreakpoint(width, above, "up");
  if (below != null) ok = ok && matchesBreakpoint(width, below, "down");
  return <>{ok ? children : fallback}</>;
}

export interface DeviceDetectorProps extends React.HTMLAttributes<HTMLElement> {
  /** Mirror snapshot onto element data-* attributes */
  mirror?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

/**
 * Presentational mirror of the manager — sets data attributes for CSS hooks.
 * Prefer `BreakpointProvider` at the app root; use this for scoped debug / demos.
 */
export function DeviceDetector({
  mirror = true,
  as,
  className,
  children,
  ...rest
}: DeviceDetectorProps) {
  const snap = useBreakpointSnapshot();
  const Tag = (as || "div") as React.ElementType;
  const classes = ["dk-device-detector", className].filter(Boolean).join(" ");

  return (
    <Tag
      className={classes}
      data-bp={mirror ? snap.breakpoint : undefined}
      data-orientation={mirror ? snap.orientation : undefined}
      data-pointer={mirror ? snap.pointer : undefined}
      data-hover={mirror ? snap.hover : undefined}
      data-touch={mirror ? String(snap.touch) : undefined}
      data-density={mirror ? (snap.dense ? "high" : "standard") : undefined}
      data-fold={mirror ? String(snap.foldable) : undefined}
      data-hydrated={String(snap.hydrated)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
