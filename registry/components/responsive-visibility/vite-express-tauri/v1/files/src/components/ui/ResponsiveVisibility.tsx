/**
 * DevKit Responsive Visibility Engine — Layer 1 Foundation (id: 96)
 *
 * Conditional rendering by viewport, device, orientation, roles, permissions,
 * feature flags, app state, and accessibility prefs. CSS-first presets + JS gates.
 * SSR / hydration safe; lazy + intersection; preserve / accessible / animated modes.
 */
import * as React from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════════════ */

export type VisibilityPreset =
  | "mobile-only"
  | "tablet-only"
  | "desktop-only"
  | "large-only"
  | "large-screens"
  | "landscape-only"
  | "portrait-only"
  | "print-only"
  | "print"
  | "screen-only"
  | "foldable-only"
  | "foldables"
  | "a11y-only"
  | "accessibility"
  | "reduced-motion-only"
  | "motion-ok-only"
  | "touch-only"
  | "hover-capable"
  | "fine-pointer"
  | "coarse-pointer"
  | "from-sm"
  | "until-sm"
  | "from-md"
  | "until-md"
  | "from-lg"
  | "until-lg"
  | "from-xl"
  | "until-xl";

/**
 * When the gate evaluates false:
 * - `hide` — unmount / display:none (default)
 * - `preserve` — keep layout (`visibility:hidden`), removed from interaction
 * - `accessible` — visually hidden but remain in the a11y tree (sr-only)
 * - `collapse` — animate height closed
 * - `fade` — opacity transition
 * - `show` — force visible
 */
export type VisibilityMode =
  | "show"
  | "hide"
  | "collapse"
  | "preserve"
  | "accessible"
  | "fade";

export type VisibilityStrategy = "css" | "js" | "auto";

/** Aligns with Breakpoint Manager semantic tokens */
export type VisibilityBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export type VisibilityPointer = "fine" | "coarse" | "none";
export type VisibilityHover = "hover" | "none";
export type VisibilityMatchMode = "any" | "all";

export interface VisibilityContextValue {
  roles?: string[];
  permissions?: string[];
  flags?: Record<string, boolean>;
  /** Arbitrary app state keys used by `stateKey` / `whenState` */
  state?: Record<string, unknown>;
}

export interface VisibilityChangeEvent {
  visible: boolean;
  reason: "condition" | "media" | "intersection" | "controlled" | "hydration";
  entry?: IntersectionObserverEntry;
}

export interface ViewportObservation {
  width: number;
  height: number;
  offsetTop: number;
  offsetLeft: number;
  scale: number;
  /** visualViewport when available */
  visualWidth: number;
  visualHeight: number;
}

export interface ResponsiveVisibilityProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "role"> {
  preset?: VisibilityPreset;
  mode?: VisibilityMode;
  visible?: boolean;
  invert?: boolean;
  when?: boolean;
  unless?: boolean;
  match?: string;
  above?: VisibilityBreakpoint;
  below?: VisibilityBreakpoint;
  minWidth?: number;
  maxWidth?: number;
  orientation?: "landscape" | "portrait";
  /** Device: pointer capability */
  pointer?: VisibilityPointer;
  /** Device: hover capability */
  hover?: VisibilityHover;
  /** Require coarse pointer / touch-primary */
  touch?: boolean;
  role?: string | string[];
  permission?: string | string[];
  /** How multiple roles/permissions match (default any) */
  matchMode?: VisibilityMatchMode;
  flag?: string;
  /** All listed flags must be true */
  flagsAll?: string[];
  /** Any listed flag may be true */
  flagsAny?: string[];
  flags?: Record<string, boolean>;
  stateKey?: string;
  state?: Record<string, unknown>;
  /** Predicate over merged provider + inline state */
  whenState?: (state: Record<string, unknown>) => boolean;
  reducedMotion?: boolean | "show" | "hide";
  prefersContrast?: boolean;
  prefersReducedTransparency?: boolean;
  strategy?: VisibilityStrategy;
  block?: boolean;
  /** Don't mount children until visible */
  lazy?: boolean;
  /** Keep children mounted after first show (with lazy) */
  keepMounted?: boolean;
  /** Enable opacity/collapse transitions */
  motion?: boolean;
  /** Observe intersection — always mounts a sentinel so IO can fire with lazy+hide */
  intersection?: boolean | IntersectionObserverInit;
  /**
   * SSR / first paint assumption for media-dependent gates.
   * Default `true` (assume shown) to avoid empty first paint; set `false` for mobile-first hide.
   */
  ssrFallback?: boolean;
  /**
   * Defer JS media/device gates until after hydration (avoids mismatch).
   * Default true. CSS-only presets are always hydration-safe.
   */
  hydrateSafe?: boolean;
  onVisibilityChange?: (event: VisibilityChangeEvent) => void;
  onVisible?: (event: VisibilityChangeEvent) => void;
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Context · constants
   ═══════════════════════════════════════════════════════════════════════════ */

const VisibilityContext = React.createContext<VisibilityContextValue>({});

export function VisibilityProvider({
  children,
  roles,
  permissions,
  flags,
  state,
}: VisibilityContextValue & { children?: React.ReactNode }) {
  const value = React.useMemo(
    () => ({ roles, permissions, flags, state }),
    [roles, permissions, flags, state]
  );
  return <VisibilityContext.Provider value={value}>{children}</VisibilityContext.Provider>;
}

export function useVisibilityContext(): VisibilityContextValue {
  return React.useContext(VisibilityContext);
}

const PRESET_CLASS: Record<string, string> = {
  "mobile-only": "dk-vis-mobile-only",
  "tablet-only": "dk-vis-tablet-only",
  "desktop-only": "dk-vis-desktop-only",
  "large-only": "dk-vis-large-only",
  "large-screens": "dk-vis-large-only",
  "landscape-only": "dk-vis-landscape-only",
  "portrait-only": "dk-vis-portrait-only",
  "print-only": "dk-vis-print-only",
  print: "dk-vis-print-only",
  "screen-only": "dk-vis-screen-only",
  "foldable-only": "dk-vis-foldable-only",
  foldables: "dk-vis-foldable-only",
  "a11y-only": "dk-vis-a11y-only",
  accessibility: "dk-vis-a11y-only",
  "reduced-motion-only": "dk-vis-reduced-motion-only",
  "motion-ok-only": "dk-vis-motion-ok-only",
  "touch-only": "dk-vis-touch-only",
  "hover-capable": "dk-vis-hover-capable",
  "fine-pointer": "dk-vis-fine-pointer",
  "coarse-pointer": "dk-vis-coarse-pointer",
  "from-sm": "dk-vis-from-sm",
  "until-sm": "dk-vis-until-sm",
  "from-md": "dk-vis-from-md",
  "until-md": "dk-vis-until-md",
  "from-lg": "dk-vis-from-lg",
  "until-lg": "dk-vis-until-lg",
  "from-xl": "dk-vis-from-xl",
  "until-xl": "dk-vis-until-xl",
};

/** Semantic mins — match Breakpoint Manager */
const BP_MIN: Record<VisibilityBreakpoint, number> = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1440,
  "3xl": 1680,
};

const BP_MAX: Record<VisibilityBreakpoint, number> = {
  xs: 479.98,
  sm: 767.98,
  md: 1023.98,
  lg: 1279.98,
  xl: 1439.98,
  "2xl": 1679.98,
  "3xl": Number.POSITIVE_INFINITY,
};

function hasMatch(
  needles: string[] | undefined,
  haystack: string[] | undefined,
  mode: VisibilityMatchMode
): boolean {
  if (!needles?.length) return true;
  if (!haystack?.length) return false;
  const set = new Set(haystack);
  return mode === "all" ? needles.every((n) => set.has(n)) : needles.some((n) => set.has(n));
}

function toList(value: string | string[] | undefined): string[] | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value : [value];
}

function buildMediaQuery(props: {
  match?: string;
  above?: VisibilityBreakpoint;
  below?: VisibilityBreakpoint;
  minWidth?: number;
  maxWidth?: number;
  orientation?: "landscape" | "portrait";
  pointer?: VisibilityPointer;
  hover?: VisibilityHover;
  touch?: boolean;
  reducedMotion?: boolean | "show" | "hide";
  prefersContrast?: boolean;
  prefersReducedTransparency?: boolean;
}): string | null {
  const parts: string[] = [];
  if (props.match) parts.push(props.match);
  if (props.above) parts.push(`(min-width: ${BP_MIN[props.above]}px)`);
  if (props.below && BP_MAX[props.below] !== Number.POSITIVE_INFINITY) {
    parts.push(`(max-width: ${BP_MAX[props.below]}px)`);
  }
  if (props.minWidth != null) parts.push(`(min-width: ${props.minWidth}px)`);
  if (props.maxWidth != null) parts.push(`(max-width: ${props.maxWidth}px)`);
  if (props.orientation) parts.push(`(orientation: ${props.orientation})`);
  if (props.pointer) parts.push(`(pointer: ${props.pointer})`);
  if (props.hover) parts.push(`(hover: ${props.hover})`);
  if (props.touch === true) parts.push("(pointer: coarse)");
  if (props.touch === false) parts.push("(pointer: fine)");
  if (props.reducedMotion === true || props.reducedMotion === "show") {
    parts.push("(prefers-reduced-motion: reduce)");
  }
  if (props.prefersContrast) parts.push("(prefers-contrast: more)");
  if (props.prefersReducedTransparency) {
    parts.push("(prefers-reduced-transparency: reduce)");
  }
  if (!parts.length) return null;
  return parts.join(" and ");
}

/* ═══════════════════════════════════════════════════════════════════════════
   Hooks
   ═══════════════════════════════════════════════════════════════════════════ */

export function useHydrated(): boolean {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}

export function useMediaQuery(query: string | null | undefined, ssrFallback = false): boolean {
  const get = React.useCallback(() => {
    if (query == null || typeof window === "undefined" || !window.matchMedia) {
      return ssrFallback;
    }
    try {
      return window.matchMedia(query).matches;
    } catch {
      return ssrFallback;
    }
  }, [query, ssrFallback]);

  const [matches, setMatches] = React.useState(get);

  React.useEffect(() => {
    if (query == null || typeof window === "undefined" || !window.matchMedia) return;
    let mql: MediaQueryList;
    try {
      mql = window.matchMedia(query);
    } catch {
      return;
    }
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [query]);

  return matches;
}

export function usePrefersReducedMotion(ssrFallback = false): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", ssrFallback);
}

export function useIntersectionVisibility(
  ref: React.RefObject<Element | null>,
  options?: boolean | IntersectionObserverInit
): { inView: boolean; entry: IntersectionObserverEntry | null } {
  const enabled = options !== false && options != null;
  const [inView, setInView] = React.useState(!enabled);
  const [entry, setEntry] = React.useState<IntersectionObserverEntry | null>(null);

  React.useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;
    const node = ref.current;
    if (!node) return;
    const init: IntersectionObserverInit =
      typeof options === "object" ? options : { threshold: 0.01, rootMargin: "0px" };
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting);
      setEntry(e);
    }, init);
    io.observe(node);
    return () => io.disconnect();
  }, [enabled, options, ref]);

  return { inView, entry };
}

export function useViewportObservation(
  enabled = true
): ViewportObservation | null {
  const [obs, setObs] = React.useState<ViewportObservation | null>(null);

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const read = (): ViewportObservation => {
      const vv = window.visualViewport;
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        offsetTop: vv?.offsetTop ?? 0,
        offsetLeft: vv?.offsetLeft ?? 0,
        scale: vv?.scale ?? 1,
        visualWidth: vv?.width ?? window.innerWidth,
        visualHeight: vv?.height ?? window.innerHeight,
      };
    };

    setObs(read());
    const onChange = () => setObs(read());
    window.addEventListener("resize", onChange);
    window.visualViewport?.addEventListener("resize", onChange);
    window.visualViewport?.addEventListener("scroll", onChange);
    return () => {
      window.removeEventListener("resize", onChange);
      window.visualViewport?.removeEventListener("resize", onChange);
      window.visualViewport?.removeEventListener("scroll", onChange);
    };
  }, [enabled]);

  return obs;
}

export interface UseVisibilityOptions {
  when?: boolean;
  unless?: boolean;
  match?: string;
  above?: VisibilityBreakpoint;
  below?: VisibilityBreakpoint;
  minWidth?: number;
  maxWidth?: number;
  orientation?: "landscape" | "portrait";
  pointer?: VisibilityPointer;
  hover?: VisibilityHover;
  touch?: boolean;
  role?: string | string[];
  permission?: string | string[];
  matchMode?: VisibilityMatchMode;
  flag?: string;
  flagsAll?: string[];
  flagsAny?: string[];
  flags?: Record<string, boolean>;
  stateKey?: string;
  state?: Record<string, unknown>;
  whenState?: (state: Record<string, unknown>) => boolean;
  reducedMotion?: boolean | "show" | "hide";
  prefersContrast?: boolean;
  prefersReducedTransparency?: boolean;
  invert?: boolean;
  visible?: boolean;
  ssrFallback?: boolean;
  hydrateSafe?: boolean;
}

export function useVisibility(options: UseVisibilityOptions = {}): boolean {
  const ctx = useVisibilityContext();
  const hydrated = useHydrated();
  const matchMode = options.matchMode ?? "any";

  const query = React.useMemo(
    () =>
      buildMediaQuery({
        match: options.match,
        above: options.above,
        below: options.below,
        minWidth: options.minWidth,
        maxWidth: options.maxWidth,
        orientation: options.orientation,
        pointer: options.pointer,
        hover: options.hover,
        touch: options.touch,
        reducedMotion:
          options.reducedMotion === true || options.reducedMotion === "show"
            ? options.reducedMotion
            : undefined,
        prefersContrast: options.prefersContrast,
        prefersReducedTransparency: options.prefersReducedTransparency,
      }),
    [
      options.match,
      options.above,
      options.below,
      options.minWidth,
      options.maxWidth,
      options.orientation,
      options.pointer,
      options.hover,
      options.touch,
      options.reducedMotion,
      options.prefersContrast,
      options.prefersReducedTransparency,
    ]
  );

  const mediaOk = useMediaQuery(query, options.ssrFallback ?? true);
  const reduceMotion = usePrefersReducedMotion(false);
  const hydrateSafe = options.hydrateSafe !== false;
  const effectiveMediaOk =
    hydrateSafe && !hydrated && query != null ? (options.ssrFallback ?? true) : mediaOk;

  return React.useMemo(() => {
    if (options.visible != null) return options.visible;

    let ok = true;
    if (options.when === false) ok = false;
    if (options.unless === true) ok = false;
    if (query && !effectiveMediaOk) ok = false;

    if (options.reducedMotion === false || options.reducedMotion === "hide") {
      if (reduceMotion) ok = false;
    }

    const roles = toList(options.role);
    const perms = toList(options.permission);
    if (!hasMatch(roles, ctx.roles, matchMode)) ok = false;
    if (!hasMatch(perms, ctx.permissions, matchMode)) ok = false;

    const flags = { ...ctx.flags, ...options.flags };
    if (options.flag && !flags[options.flag]) ok = false;
    if (options.flagsAll?.length && !options.flagsAll.every((f) => flags[f])) ok = false;
    if (options.flagsAny?.length && !options.flagsAny.some((f) => flags[f])) ok = false;

    const state = { ...ctx.state, ...options.state };
    if (options.stateKey && !state[options.stateKey]) ok = false;
    if (options.whenState && !options.whenState(state)) ok = false;

    return options.invert ? !ok : ok;
  }, [
    options.visible,
    options.when,
    options.unless,
    options.reducedMotion,
    options.flag,
    options.flagsAll,
    options.flagsAny,
    options.flags,
    options.stateKey,
    options.state,
    options.whenState,
    options.role,
    options.permission,
    options.invert,
    matchMode,
    query,
    effectiveMediaOk,
    reduceMotion,
    ctx.roles,
    ctx.permissions,
    ctx.flags,
    ctx.state,
  ]);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════════════════ */

function needsJsEvaluation(props: ResponsiveVisibilityProps): boolean {
  return (
    props.visible != null ||
    props.when != null ||
    props.unless != null ||
    props.match != null ||
    props.above != null ||
    props.below != null ||
    props.minWidth != null ||
    props.maxWidth != null ||
    props.orientation != null ||
    props.pointer != null ||
    props.hover != null ||
    props.touch != null ||
    props.role != null ||
    props.permission != null ||
    props.flag != null ||
    props.flagsAll != null ||
    props.flagsAny != null ||
    props.stateKey != null ||
    props.whenState != null ||
    props.reducedMotion != null ||
    props.prefersContrast != null ||
    props.prefersReducedTransparency != null ||
    props.intersection != null ||
    props.lazy === true ||
    props.mode === "collapse" ||
    props.mode === "preserve" ||
    props.mode === "accessible" ||
    props.mode === "fade" ||
    props.invert === true
  );
}

export function ResponsiveVisibility({
  preset,
  mode = "hide",
  visible: visibleProp,
  invert = false,
  when,
  unless,
  match,
  above,
  below,
  minWidth,
  maxWidth,
  orientation,
  pointer,
  hover,
  touch,
  role,
  permission,
  matchMode,
  flag,
  flagsAll,
  flagsAny,
  flags,
  stateKey,
  state,
  whenState,
  reducedMotion,
  prefersContrast,
  prefersReducedTransparency,
  strategy = "auto",
  block = false,
  lazy = false,
  keepMounted = false,
  motion = false,
  intersection,
  ssrFallback = true,
  hydrateSafe = true,
  onVisibilityChange,
  onVisible,
  as,
  className,
  style,
  children,
  ...rest
}: ResponsiveVisibilityProps) {
  const useJs =
    strategy === "js" ||
    (strategy === "auto" &&
      (needsJsEvaluation({
        visible: visibleProp,
        when,
        unless,
        match,
        above,
        below,
        minWidth,
        maxWidth,
        orientation,
        pointer,
        hover,
        touch,
        role,
        permission,
        flag,
        flagsAll,
        flagsAny,
        stateKey,
        whenState,
        reducedMotion,
        prefersContrast,
        prefersReducedTransparency,
        intersection,
        lazy,
        mode,
        invert,
      }) ||
        !preset));

  const ref = React.useRef<HTMLElement | null>(null);
  const intersectionEnabled = intersection !== false && intersection != null;
  const { inView, entry } = useIntersectionVisibility(
    ref,
    intersectionEnabled ? (intersection === true ? true : intersection) : false
  );

  const matched = useVisibility({
    when,
    unless,
    match,
    above,
    below,
    minWidth,
    maxWidth,
    orientation,
    pointer,
    hover,
    touch,
    role,
    permission,
    matchMode,
    flag,
    flagsAll,
    flagsAny,
    flags,
    stateKey,
    state,
    whenState,
    reducedMotion,
    prefersContrast,
    prefersReducedTransparency,
    invert,
    visible: visibleProp,
    ssrFallback,
    hydrateSafe,
  });

  const gateOk = matched && (!intersectionEnabled || inView);
  const isVisible = mode === "show" ? true : gateOk;

  const [everShown, setEverShown] = React.useState(isVisible);
  React.useEffect(() => {
    if (isVisible) setEverShown(true);
  }, [isVisible]);

  const prev = React.useRef<boolean | null>(null);
  React.useEffect(() => {
    if (prev.current === isVisible) return;
    prev.current = isVisible;
    const event: VisibilityChangeEvent = {
      visible: isVisible,
      reason:
        visibleProp != null
          ? "controlled"
          : intersectionEnabled
            ? "intersection"
            : match || above || below || minWidth || maxWidth || orientation || pointer || hover
              ? "media"
              : "condition",
      entry: entry ?? undefined,
    };
    onVisibilityChange?.(event);
    if (isVisible) onVisible?.(event);
  }, [
    isVisible,
    visibleProp,
    intersectionEnabled,
    match,
    above,
    below,
    minWidth,
    maxWidth,
    orientation,
    pointer,
    hover,
    entry,
    onVisibilityChange,
    onVisible,
  ]);

  const presetClass = preset ? PRESET_CLASS[preset] : undefined;
  const Tag = (as || "div") as React.ElementType;

  // CSS-only path — zero JS gates (hydration-safe)
  if (!useJs) {
    const classes = ["dk-vis", presetClass, block ? "dk-vis-block" : null, className]
      .filter(Boolean)
      .join(" ");

    return (
      <Tag
        ref={ref}
        className={classes}
        style={style}
        data-dk-vis={preset || "custom"}
        suppressHydrationWarning
        {...rest}
      >
        {children}
      </Tag>
    );
  }

  /**
   * Intersection + lazy + hide: keep a sentinel mounted so IO can observe.
   * Children still lazy-mount when in view.
   */
  const needsSentinel = intersectionEnabled;
  const shouldMountChildren = lazy
    ? keepMounted
      ? everShown || isVisible
      : isVisible
    : true;

  if (!shouldMountChildren && mode === "hide" && !needsSentinel && !motion) {
    return null;
  }

  if (!isVisible && mode === "hide" && !lazy && !needsSentinel && !motion && !keepMounted) {
    return null;
  }

  const classes = [
    "dk-vis",
    presetClass,
    block ? "dk-vis-block" : null,
    motion || mode === "fade" || mode === "collapse" ? "dk-vis-motion" : null,
    mode === "preserve" && !isVisible ? "dk-vis-preserve" : null,
    mode === "accessible" && !isVisible ? "dk-vis-accessible" : null,
    mode === "fade" ? "dk-vis-fade" : null,
    mode === "collapse" ? "dk-vis-collapse" : null,
    !isVisible && mode === "hide" ? "dk-vis-hide" : null,
    needsSentinel && !shouldMountChildren ? "dk-vis-sentinel" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const hideFromA11y = !isVisible && mode !== "accessible" && mode !== "show";

  const dataAttrs: Record<string, string | boolean> = {
    "data-dk-vis": preset || "custom",
    "data-visible": isVisible,
  };
  if (mode === "collapse") dataAttrs["data-open"] = isVisible;

  const content =
    mode === "collapse" ? (
      <div className="dk-vis-collapse-inner">{shouldMountChildren ? children : null}</div>
    ) : shouldMountChildren ? (
      children
    ) : null;

  return (
    <Tag
      ref={ref}
      className={classes}
      style={style}
      hidden={mode === "hide" && !isVisible ? true : undefined}
      aria-hidden={hideFromA11y ? true : undefined}
      suppressHydrationWarning
      {...dataAttrs}
      {...rest}
    >
      {content}
    </Tag>
  );
}

export const Visibility = ResponsiveVisibility;

/* ═══════════════════════════════════════════════════════════════════════════
   Preset helpers · SSR script
   ═══════════════════════════════════════════════════════════════════════════ */

function presetOf(preset: VisibilityPreset) {
  return function VisibilityPresetComponent(props: Omit<ResponsiveVisibilityProps, "preset">) {
    return <ResponsiveVisibility preset={preset} {...props} />;
  };
}

export const MobileOnly = presetOf("mobile-only");
export const TabletOnly = presetOf("tablet-only");
export const DesktopOnly = presetOf("desktop-only");
export const LargeScreens = presetOf("large-screens");
export const LandscapeOnly = presetOf("landscape-only");
export const PortraitOnly = presetOf("portrait-only");
export const PrintMode = presetOf("print");
export const ScreenOnly = presetOf("screen-only");
export const Foldables = presetOf("foldables");
export const AccessibilityMode = presetOf("accessibility");
export const TouchOnly = presetOf("touch-only");
export const HoverCapable = presetOf("hover-capable");

export function Show(props: Omit<ResponsiveVisibilityProps, "mode">) {
  return <ResponsiveVisibility mode="show" {...props} />;
}

/** Invert gates — e.g. `<Hide when={isAdmin}>` shows for non-admins. */
export function Hide(props: Omit<ResponsiveVisibilityProps, "invert">) {
  return <ResponsiveVisibility {...props} invert mode={props.mode ?? "hide"} />;
}

/** Inline script optional — marks html as hydrated for CSS that waits on JS */
export function getVisibilityInitScript(): string {
  return `(function(){try{document.documentElement.dataset.dkVisHydrated="0";}catch(e){}})();`;
}

export function VisibilityScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `${getVisibilityInitScript()};document.addEventListener("DOMContentLoaded",function(){document.documentElement.dataset.dkVisHydrated="1";});`,
      }}
    />
  );
}
