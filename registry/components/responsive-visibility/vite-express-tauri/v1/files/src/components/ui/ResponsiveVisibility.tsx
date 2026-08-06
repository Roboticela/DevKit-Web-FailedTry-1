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
  | "from-md"
  | "until-md"
  | "from-lg"
  | "until-lg";

export type VisibilityMode = "show" | "hide" | "collapse" | "preserve" | "fade";

/** How matching is enforced. `css` = class-only (zero JS). `js` = conditional render. */
export type VisibilityStrategy = "css" | "js" | "auto";

export type VisibilityBreakpoint = "sm" | "md" | "lg" | "xl";

export interface VisibilityContextValue {
  roles?: string[];
  permissions?: string[];
  flags?: Record<string, boolean>;
  /** Arbitrary app state keys used by `state` / `whenState` */
  state?: Record<string, unknown>;
}

export interface VisibilityChangeEvent {
  visible: boolean;
  reason: "condition" | "media" | "intersection" | "controlled";
  entry?: IntersectionObserverEntry;
}

export interface ResponsiveVisibilityProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "role"> {
  /** Named responsive / a11y / print preset (CSS-first) */
  preset?: VisibilityPreset;
  /**
   * Visibility mode when the gate evaluates false (or controlled `visible={false}`):
   * - `hide` — unmount or `display:none` (default with JS strategy)
   * - `preserve` — keep layout (`visibility:hidden`)
   * - `collapse` — animate height closed
   * - `fade` — opacity transition
   * - `show` — force visible (ignore negative gates)
   */
  mode?: VisibilityMode;
  /** Force visible / hidden (overrides gates when set) */
  visible?: boolean;
  /** Invert the match result */
  invert?: boolean;
  /** Boolean gate — false hides */
  when?: boolean;
  /** Boolean gate — true hides */
  unless?: boolean;
  /** Custom media query, e.g. `(min-width: 900px)` */
  match?: string;
  /** Show at/above breakpoint */
  above?: VisibilityBreakpoint;
  /** Show below breakpoint */
  below?: VisibilityBreakpoint;
  /** Min viewport width in px */
  minWidth?: number;
  /** Max viewport width in px */
  maxWidth?: number;
  orientation?: "landscape" | "portrait";
  /** Required role(s) — any match when array */
  role?: string | string[];
  /** Required permission(s) — any match when array */
  permission?: string | string[];
  /** Feature flag key — must be true in provider / `flags` prop */
  flag?: string;
  /** Inline flags map (merged over provider) */
  flags?: Record<string, boolean>;
  /** App-state key that must be truthy */
  stateKey?: string;
  /** Inline state map (merged over provider) */
  state?: Record<string, unknown>;
  /**
   * Reduced-motion preference:
   * - `true` / `"show"` — only when reduced motion
   * - `false` / `"hide"` — hide when reduced motion
   */
  reducedMotion?: boolean | "show" | "hide";
  /** Only when prefers-contrast: more */
  prefersContrast?: boolean;
  /** css | js | auto (default). Auto uses CSS for presets-only, JS when gates need evaluation. */
  strategy?: VisibilityStrategy;
  /** Prefer block wrapper instead of display:contents for CSS presets */
  block?: boolean;
  /** Don't mount children until visible (JS strategy) */
  lazy?: boolean;
  /** Keep children mounted after first show (with lazy) */
  keepMounted?: boolean;
  /** Enable opacity/collapse transitions */
  motion?: boolean;
  /** Observe intersection — gate on in-view (also fires onVisible) */
  intersection?: boolean | IntersectionObserverInit;
  /** SSR / first paint: assume shown until hydrated when unknown */
  ssrFallback?: boolean;
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
  "from-md": "dk-vis-from-md",
  "until-md": "dk-vis-until-md",
  "from-lg": "dk-vis-from-lg",
  "until-lg": "dk-vis-until-lg",
};

const BP_MIN: Record<VisibilityBreakpoint, number> = {
  sm: 0,
  md: 768,
  lg: 1024,
  xl: 1280,
};

/** Align with Breakpoint Manager (`device-detector`) — prefer mq / useBreakpoint there. */
const BP_MAX: Record<VisibilityBreakpoint, number> = {
  sm: 767.98,
  md: 1023.98,
  lg: 1279.98,
  xl: Number.POSITIVE_INFINITY,
};

function hasAny(needles: string[] | undefined, haystack: string[] | undefined): boolean {
  if (!needles?.length) return true;
  if (!haystack?.length) return false;
  const set = new Set(haystack);
  return needles.some((n) => set.has(n));
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
  reducedMotion?: boolean | "show" | "hide";
  prefersContrast?: boolean;
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
  if (props.reducedMotion === true || props.reducedMotion === "show") {
    parts.push("(prefers-reduced-motion: reduce)");
  }
  if (props.prefersContrast) parts.push("(prefers-contrast: more)");
  if (!parts.length) return null;
  return parts.join(" and ");
}

/* ═══════════════════════════════════════════════════════════════════════════
   Hooks
   ═══════════════════════════════════════════════════════════════════════════ */

export function useMediaQuery(query: string | null | undefined, ssrFallback = false): boolean {
  const get = React.useCallback(() => {
    if (query == null || typeof window === "undefined" || !window.matchMedia) {
      return ssrFallback;
    }
    return window.matchMedia(query).matches;
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

export function usePrefersReducedMotion(ssrFallback = false): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", ssrFallback);
}

export function useIntersectionVisibility(
  ref: React.RefObject<Element | null>,
  options?: boolean | IntersectionObserverInit
): boolean {
  const enabled = options !== false && options != null;
  const [inView, setInView] = React.useState(!enabled);

  React.useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;
    const node = ref.current;
    if (!node) return;
    const init: IntersectionObserverInit =
      typeof options === "object" ? options : { threshold: 0.01, rootMargin: "0px" };
    const io = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, init);
    io.observe(node);
    return () => io.disconnect();
  }, [enabled, options, ref]);

  return inView;
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
  role?: string | string[];
  permission?: string | string[];
  flag?: string;
  flags?: Record<string, boolean>;
  stateKey?: string;
  state?: Record<string, unknown>;
  reducedMotion?: boolean | "show" | "hide";
  prefersContrast?: boolean;
  invert?: boolean;
  visible?: boolean;
  ssrFallback?: boolean;
}

export function useVisibility(options: UseVisibilityOptions = {}): boolean {
  const ctx = useVisibilityContext();
  const query = React.useMemo(
    () =>
      buildMediaQuery({
        match: options.match,
        above: options.above,
        below: options.below,
        minWidth: options.minWidth,
        maxWidth: options.maxWidth,
        orientation: options.orientation,
        reducedMotion:
          options.reducedMotion === true || options.reducedMotion === "show"
            ? options.reducedMotion
            : undefined,
        prefersContrast: options.prefersContrast,
      }),
    [
      options.match,
      options.above,
      options.below,
      options.minWidth,
      options.maxWidth,
      options.orientation,
      options.reducedMotion,
      options.prefersContrast,
    ]
  );

  const mediaOk = useMediaQuery(query, options.ssrFallback ?? true);
  const reduceMotion = usePrefersReducedMotion(false);

  return React.useMemo(() => {
    if (options.visible != null) return options.visible;

    let ok = true;
    if (options.when === false) ok = false;
    if (options.unless === true) ok = false;
    if (query && !mediaOk) ok = false;

    if (options.reducedMotion === false || options.reducedMotion === "hide") {
      if (reduceMotion) ok = false;
    }

    const roles = toList(options.role);
    const perms = toList(options.permission);
    if (!hasAny(roles, ctx.roles)) ok = false;
    if (!hasAny(perms, ctx.permissions)) ok = false;

    if (options.flag) {
      const flags = { ...ctx.flags, ...options.flags };
      if (!flags[options.flag]) ok = false;
    }

    if (options.stateKey) {
      const state = { ...ctx.state, ...options.state };
      if (!state[options.stateKey]) ok = false;
    }

    return options.invert ? !ok : ok;
  }, [
    options.visible,
    options.when,
    options.unless,
    options.reducedMotion,
    options.flag,
    options.flags,
    options.stateKey,
    options.state,
    options.role,
    options.permission,
    options.invert,
    query,
    mediaOk,
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
    props.role != null ||
    props.permission != null ||
    props.flag != null ||
    props.stateKey != null ||
    props.reducedMotion != null ||
    props.prefersContrast != null ||
    props.intersection != null ||
    props.lazy === true ||
    props.mode === "collapse" ||
    props.mode === "preserve" ||
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
  role,
  permission,
  flag,
  flags,
  stateKey,
  state,
  reducedMotion,
  prefersContrast,
  strategy = "auto",
  block = false,
  lazy = false,
  keepMounted = false,
  motion = false,
  intersection,
  ssrFallback = true,
  onVisibilityChange,
  onVisible,
  as,
  className,
  style,
  children,
  ...rest
}: ResponsiveVisibilityProps) {
  const useJs =
    strategy === "js" || (strategy === "auto" && (needsJsEvaluation({
      visible: visibleProp,
      when,
      unless,
      match,
      above,
      below,
      minWidth,
      maxWidth,
      orientation,
      role,
      permission,
      flag,
      stateKey,
      reducedMotion,
      prefersContrast,
      intersection,
      lazy,
      mode,
      invert,
    }) || !preset));

  const ref = React.useRef<HTMLElement | null>(null);
  const inView = useIntersectionVisibility(ref, intersection === true ? true : intersection || false);

  const matched = useVisibility({
    when,
    unless,
    match,
    above,
    below,
    minWidth,
    maxWidth,
    orientation,
    role,
    permission,
    flag,
    flags,
    stateKey,
    state,
    reducedMotion,
    prefersContrast,
    invert,
    visible: visibleProp,
    ssrFallback,
  });

  const gateOk = matched && (intersection == null || intersection === false || inView);
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
          : intersection
            ? "intersection"
            : match || above || below || minWidth || maxWidth || orientation
              ? "media"
              : "condition",
    };
    onVisibilityChange?.(event);
    if (isVisible) onVisible?.(event);
  }, [
    isVisible,
    visibleProp,
    intersection,
    match,
    above,
    below,
    minWidth,
    maxWidth,
    orientation,
    onVisibilityChange,
    onVisible,
  ]);

  const presetClass = preset ? PRESET_CLASS[preset] : undefined;
  const Tag = (as || "div") as React.ElementType;

  // CSS-only path — zero JS evaluation beyond render
  if (!useJs) {
    const classes = [
      "dk-vis",
      presetClass,
      block ? "dk-vis-block" : null,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Tag ref={ref} className={classes} style={style} data-dk-vis={preset || "custom"} {...rest}>
        {children}
      </Tag>
    );
  }

  const shouldMount = lazy ? (keepMounted ? everShown || isVisible : isVisible) : true;
  if (!shouldMount && mode === "hide") {
    return null;
  }

  if (!isVisible && mode === "hide" && !lazy) {
    // Soft: still allow CSS preset wrapper for hybrid, but default unmount
    if (!motion && !keepMounted) return null;
  }

  const classes = [
    "dk-vis",
    presetClass,
    block ? "dk-vis-block" : null,
    motion || mode === "fade" || mode === "collapse" ? "dk-vis-motion" : null,
    mode === "preserve" && !isVisible ? "dk-vis-preserve" : null,
    mode === "fade" ? "dk-vis-fade" : null,
    mode === "collapse" ? "dk-vis-collapse" : null,
    !isVisible && mode === "hide" ? "dk-vis-hide" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const dataAttrs: Record<string, string | boolean> = {
    "data-dk-vis": preset || "custom",
    "data-visible": isVisible,
  };
  if (mode === "collapse") dataAttrs["data-open"] = isVisible;

  const content =
    mode === "collapse" ? (
      <div className="dk-vis-collapse-inner">{shouldMount ? children : null}</div>
    ) : shouldMount ? (
      children
    ) : null;

  return (
    <Tag
      ref={ref}
      className={classes}
      style={style}
      hidden={mode === "hide" && !isVisible ? true : undefined}
      aria-hidden={!isVisible ? true : undefined}
      {...dataAttrs}
      {...rest}
    >
      {content}
    </Tag>
  );
}

export const Visibility = ResponsiveVisibility;

/* ═══════════════════════════════════════════════════════════════════════════
   Preset helpers
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

export function Show(props: Omit<ResponsiveVisibilityProps, "mode">) {
  return <ResponsiveVisibility mode="show" {...props} />;
}

/** Invert gates — e.g. `<Hide when={isAdmin}>` shows for non-admins. */
export function Hide(props: Omit<ResponsiveVisibilityProps, "invert">) {
  return <ResponsiveVisibility {...props} invert mode={props.mode ?? "hide"} />;
}
