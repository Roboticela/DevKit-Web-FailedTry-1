import * as React from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════════════ */

export type PositionMode =
  | "static"
  | "relative"
  | "absolute"
  | "fixed"
  | "sticky"
  | "floating"
  | "anchor"
  | "layered";

export type PositionPreset =
  | "fab"
  | "fab-start"
  | "sticky-header"
  | "sticky-footer"
  | "floating-nav"
  | "floating-nav-top"
  | "overlay"
  | "modal"
  | "toast"
  | "toast-bottom"
  | "badge"
  | "badge-start"
  | "tooltip"
  | "popover"
  | "menu";

export type PositionLayer =
  | "base"
  | "raised"
  | "sticky"
  | "nav"
  | "fab"
  | "overlay"
  | "dropdown"
  | "popover"
  | "tooltip"
  | "modal"
  | "toast"
  | "max";

export type PositionInset = 0 | "auto" | "offset" | "safe";
export type FloatPlacement =
  | "top"
  | "bottom"
  | "start"
  | "end"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end";

export type PositionBreakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
export type ResponsivePosition<T> =
  | T
  | (Partial<Record<Exclude<PositionBreakpoint, "base">, T>> & { base?: T });

export interface PositionProps extends React.HTMLAttributes<HTMLElement> {
  mode?: PositionMode;
  preset?: PositionPreset;
  layer?: PositionLayer;
  /** Logical insets */
  inset?: PositionInset;
  top?: PositionInset;
  bottom?: PositionInset;
  start?: PositionInset;
  end?: PositionInset;
  safe?: boolean | "t" | "b" | "s" | "e";
  stickyOffset?: string | number;
  scrollContainer?: boolean;
  stacking?: boolean;
  motion?: boolean;
  /** CSS-only placement inside an anchor parent */
  place?: "top" | "bottom" | "start" | "end";
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

export interface FloatingPositionProps extends Omit<PositionProps, "mode" | "preset" | "place"> {
  /** Anchor element to position against */
  anchorRef: React.RefObject<Element | null>;
  placement?: FloatPlacement;
  /** Gap between anchor and floating node */
  offset?: number;
  /** Flip when overflowing viewport */
  flip?: boolean;
  /** Shift along axis to stay in view */
  shift?: boolean;
  /** Padding from viewport edges */
  padding?: number;
  /** Role layer for z-index */
  role?: "tooltip" | "popover" | "menu" | "dropdown";
  open?: boolean;
  portal?: boolean;
}

export interface FloatingCoords {
  top: number;
  left: number;
  placement: FloatPlacement;
  ready: boolean;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Class maps
   ═══════════════════════════════════════════════════════════════════════════ */

const MODE_CLASS: Record<PositionMode, string> = {
  static: "dk-pos-static",
  relative: "dk-pos-relative",
  absolute: "dk-pos-absolute",
  fixed: "dk-pos-fixed",
  sticky: "dk-pos-sticky",
  floating: "dk-pos-floating",
  anchor: "dk-pos-anchor",
  layered: "dk-pos-layered",
};

const PRESET_CLASS: Record<PositionPreset, string> = {
  fab: "dk-pos-fab",
  "fab-start": "dk-pos-fab-start",
  "sticky-header": "dk-pos-sticky-header",
  "sticky-footer": "dk-pos-sticky-footer",
  "floating-nav": "dk-pos-floating-nav",
  "floating-nav-top": "dk-pos-floating-nav-top",
  overlay: "dk-pos-overlay",
  modal: "dk-pos-modal",
  toast: "dk-pos-toast",
  "toast-bottom": "dk-pos-toast-bottom",
  badge: "dk-pos-badge",
  "badge-start": "dk-pos-badge-start",
  tooltip: "dk-pos-tooltip",
  popover: "dk-pos-popover",
  menu: "dk-pos-menu",
};

const LAYER_CLASS: Record<PositionLayer, string> = {
  base: "dk-z-base",
  raised: "dk-z-raised",
  sticky: "dk-z-sticky",
  nav: "dk-z-nav",
  fab: "dk-z-fab",
  overlay: "dk-z-overlay",
  dropdown: "dk-z-dropdown",
  popover: "dk-z-popover",
  tooltip: "dk-z-tooltip",
  modal: "dk-z-modal",
  toast: "dk-z-toast",
  max: "dk-z-max",
};

const INSET_CLASS: Record<string, string> = {
  "inset-0": "dk-inset-0",
  "inset-auto": "dk-inset-auto",
  "top-0": "dk-inset-t-0",
  "top-auto": "dk-inset-t-auto",
  "top-offset": "dk-inset-t-offset",
  "top-safe": "dk-inset-safe-t",
  "bottom-0": "dk-inset-b-0",
  "bottom-auto": "dk-inset-b-auto",
  "bottom-offset": "dk-inset-b-offset",
  "bottom-safe": "dk-inset-safe-b",
  "start-0": "dk-inset-s-0",
  "start-auto": "dk-inset-s-auto",
  "start-offset": "dk-inset-s-offset",
  "start-safe": "dk-inset-safe-s",
  "end-0": "dk-inset-e-0",
  "end-auto": "dk-inset-e-auto",
  "end-offset": "dk-inset-e-offset",
  "end-safe": "dk-inset-safe-e",
};

const PLACE_CLASS = {
  top: "dk-pos-place-top",
  bottom: "dk-pos-place-bottom",
  start: "dk-pos-place-start",
  end: "dk-pos-place-end",
} as const;

const ROLE_LAYER: Record<NonNullable<FloatingPositionProps["role"]>, PositionLayer> = {
  tooltip: "tooltip",
  popover: "popover",
  menu: "dropdown",
  dropdown: "dropdown",
};

function insetSideClass(
  side: "top" | "bottom" | "start" | "end",
  value: PositionInset | undefined
): string | null {
  if (value == null) return null;
  if (value === 0) return INSET_CLASS[`${side}-0`];
  if (value === "auto") return INSET_CLASS[`${side}-auto`];
  if (value === "offset") return INSET_CLASS[`${side}-offset`];
  if (value === "safe") return INSET_CLASS[`${side}-safe`];
  return null;
}

function buildPositionClasses(
  props: Omit<PositionProps, "as" | "children" | "style" | "stickyOffset">
): string {
  const {
    mode,
    preset,
    layer,
    inset,
    top,
    bottom,
    start,
    end,
    safe,
    scrollContainer,
    stacking,
    motion,
    place,
    className,
  } = props;

  return [
    "dk-position-system",
    mode ? MODE_CLASS[mode] : null,
    preset ? PRESET_CLASS[preset] : null,
    layer ? LAYER_CLASS[layer] : null,
    inset === 0 ? "dk-inset-0" : inset === "auto" ? "dk-inset-auto" : null,
    insetSideClass("top", top),
    insetSideClass("bottom", bottom),
    insetSideClass("start", start),
    insetSideClass("end", end),
    safe === true ? "dk-inset-safe" : null,
    safe === "t" ? "dk-inset-safe-t" : null,
    safe === "b" ? "dk-inset-safe-b" : null,
    safe === "s" ? "dk-inset-safe-s" : null,
    safe === "e" ? "dk-inset-safe-e" : null,
    scrollContainer ? "dk-pos-scroll" : null,
    stacking ? "dk-pos-stacking" : null,
    motion ? "dk-pos-motion" : null,
    place ? PLACE_CLASS[place] : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Semantic position box — modes, presets, layers, insets. */
export function Position({
  mode,
  preset,
  layer,
  inset,
  top,
  bottom,
  start,
  end,
  safe,
  stickyOffset,
  scrollContainer = false,
  stacking = false,
  motion = false,
  place,
  as,
  className,
  style,
  children,
  ...rest
}: PositionProps) {
  const Tag = (as || "div") as React.ElementType;
  const classes = buildPositionClasses({
    mode,
    preset,
    layer,
    inset,
    top,
    bottom,
    start,
    end,
    safe,
    scrollContainer,
    stacking,
    motion,
    place,
    className,
  });

  const mergedStyle: React.CSSProperties = {
    ...style,
    ...(stickyOffset != null
      ? {
          ["--pos-sticky-offset" as string]:
            typeof stickyOffset === "number" ? `${stickyOffset}px` : stickyOffset,
        }
      : null),
  };

  return (
    <Tag
      className={classes}
      style={mergedStyle}
      data-dk-position={preset || mode || "custom"}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export const PositionUtilities = Position;

function presetOf(preset: PositionPreset) {
  return function PositionPresetComponent(props: Omit<PositionProps, "preset">) {
    return <Position preset={preset} {...props} />;
  };
}

export const PositionFab = presetOf("fab");
export const PositionStickyHeader = presetOf("sticky-header");
export const PositionStickyFooter = presetOf("sticky-footer");
export const PositionFloatingNav = presetOf("floating-nav");
export const PositionOverlay = presetOf("overlay");
export const PositionModal = presetOf("modal");
export const PositionToast = presetOf("toast");
export const PositionBadge = presetOf("badge");
export const PositionTooltip = presetOf("tooltip");
export const PositionPopover = presetOf("popover");
export const PositionMenu = presetOf("menu");

export function positionClassName(
  props: Omit<PositionProps, "as" | "children" | "style" | "stickyOffset">
): string {
  return buildPositionClasses(props);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Floating placement · collision
   ═══════════════════════════════════════════════════════════════════════════ */

const FLIP: Record<FloatPlacement, FloatPlacement> = {
  top: "bottom",
  bottom: "top",
  start: "end",
  end: "start",
  "top-start": "bottom-start",
  "top-end": "bottom-end",
  "bottom-start": "top-start",
  "bottom-end": "top-end",
};

function isRTL(el: Element | null): boolean {
  if (typeof document === "undefined") return false;
  const node = el ?? document.documentElement;
  return getComputedStyle(node).direction === "rtl";
}

function computeFloating(
  anchor: DOMRect,
  floating: DOMRect,
  placement: FloatPlacement,
  offset: number,
  padding: number,
  flip: boolean,
  shift: boolean,
  rtl: boolean
): FloatingCoords {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let place = placement;

  const tryPlace = (p: FloatPlacement) => {
    let top = 0;
    let left = 0;
    const startSide = rtl ? "right" : "left";
    const endSide = rtl ? "left" : "right";

    switch (p) {
      case "top":
        top = anchor.top - floating.height - offset;
        left = anchor.left + anchor.width / 2 - floating.width / 2;
        break;
      case "bottom":
        top = anchor.bottom + offset;
        left = anchor.left + anchor.width / 2 - floating.width / 2;
        break;
      case "start":
        top = anchor.top + anchor.height / 2 - floating.height / 2;
        left =
          startSide === "left"
            ? anchor.left - floating.width - offset
            : anchor.right + offset;
        break;
      case "end":
        top = anchor.top + anchor.height / 2 - floating.height / 2;
        left =
          endSide === "right"
            ? anchor.right + offset
            : anchor.left - floating.width - offset;
        break;
      case "top-start":
        top = anchor.top - floating.height - offset;
        left = rtl ? anchor.right - floating.width : anchor.left;
        break;
      case "top-end":
        top = anchor.top - floating.height - offset;
        left = rtl ? anchor.left : anchor.right - floating.width;
        break;
      case "bottom-start":
        top = anchor.bottom + offset;
        left = rtl ? anchor.right - floating.width : anchor.left;
        break;
      case "bottom-end":
        top = anchor.bottom + offset;
        left = rtl ? anchor.left : anchor.right - floating.width;
        break;
    }
    return { top, left };
  };

  let { top, left } = tryPlace(place);

  if (flip) {
    const overflowY = top < padding || top + floating.height > vh - padding;
    const overflowX = left < padding || left + floating.width > vw - padding;
    if (overflowY || overflowX) {
      const alt = FLIP[place];
      const next = tryPlace(alt);
      const altOverflow =
        next.top < padding ||
        next.top + floating.height > vh - padding ||
        next.left < padding ||
        next.left + floating.width > vw - padding;
      if (!altOverflow || overflowY || overflowX) {
        place = alt;
        top = next.top;
        left = next.left;
      }
    }
  }

  if (shift) {
    left = Math.min(Math.max(left, padding), vw - floating.width - padding);
    top = Math.min(Math.max(top, padding), vh - floating.height - padding);
  }

  return { top, left, placement: place, ready: true };
}

export function useFloatingPosition(
  anchorRef: React.RefObject<Element | null>,
  floatingRef: React.RefObject<Element | null>,
  options: {
    placement?: FloatPlacement;
    offset?: number;
    flip?: boolean;
    shift?: boolean;
    padding?: number;
    open?: boolean;
  } = {}
): FloatingCoords {
  const {
    placement = "bottom",
    offset = 8,
    flip = true,
    shift = true,
    padding = 12,
    open = true,
  } = options;

  const [coords, setCoords] = React.useState<FloatingCoords>({
    top: 0,
    left: 0,
    placement,
    ready: false,
  });

  const update = React.useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating || !open) {
      setCoords((c) => ({ ...c, ready: false }));
      return;
    }
    const rtl = isRTL(anchor);
    const next = computeFloating(
      anchor.getBoundingClientRect(),
      floating.getBoundingClientRect(),
      placement,
      offset,
      padding,
      flip,
      shift,
      rtl
    );
    setCoords(next);
  }, [anchorRef, floatingRef, placement, offset, padding, flip, shift, open]);

  React.useEffect(() => {
    if (!open) return;
    update();
    const onScroll = () => update();
    window.addEventListener("resize", onScroll);
    window.addEventListener("scroll", onScroll, true);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => update())
        : null;
    if (anchorRef.current) ro?.observe(anchorRef.current);
    if (floatingRef.current) ro?.observe(floatingRef.current);
    return () => {
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scroll", onScroll, true);
      ro?.disconnect();
    };
  }, [update, open, anchorRef, floatingRef]);

  return coords;
}

/** Fixed floating layer with viewport collision (flip + shift). */
export function FloatingPosition({
  anchorRef,
  placement = "bottom",
  offset = 8,
  flip = true,
  shift = true,
  padding = 12,
  role = "popover",
  open = true,
  motion = true,
  className,
  style,
  children,
  as: _as,
  ...rest
}: FloatingPositionProps) {
  const floatingRef = React.useRef<HTMLDivElement | null>(null);
  const coords = useFloatingPosition(anchorRef, floatingRef, {
    placement,
    offset,
    flip,
    shift,
    padding,
    open,
  });

  if (!open) return null;

  const classes = [
    "dk-position-system",
    "dk-pos-floating",
    "dk-pos-viewport-safe",
    LAYER_CLASS[ROLE_LAYER[role]],
    motion ? "dk-pos-motion" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={floatingRef}
      className={classes}
      data-dk-position="floating"
      data-placement={coords.placement}
      style={{
        ...style,
        position: "fixed",
        top: coords.ready ? coords.top : -9999,
        left: coords.ready ? coords.left : -9999,
        visibility: coords.ready ? "visible" : "hidden",
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Anchor containing block for CSS-placed children */
export function PositionAnchor({
  children,
  className,
  ...rest
}: Omit<PositionProps, "mode">) {
  return (
    <Position mode="anchor" stacking className={className} {...rest}>
      {children}
    </Position>
  );
}
