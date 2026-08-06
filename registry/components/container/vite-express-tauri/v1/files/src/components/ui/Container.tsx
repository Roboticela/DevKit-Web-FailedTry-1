import * as React from "react";

export type ContainerVariant =
  | "fluid"
  | "fixed"
  | "centered"
  | "full"
  | "narrow"
  | "wide"
  | "reading"
  | "dashboard"
  | "form"
  | "hero"
  | "modal"
  | "custom";

/** @deprecated Prefer `variant` — kept for back-compat with grid companion API */
export type ContainerWidth = "default" | "fluid" | "narrow" | "wide";

export type ContainerPadding = "none" | "sm" | "md" | "lg" | "xl" | "responsive";
export type ContainerAlign = "start" | "center" | "end" | "stretch";
export type ContainerOverflow = "visible" | "auto" | "hidden" | "clip";
export type ContainerSticky = boolean | "top" | "bottom";
export type ContainerSafeArea = boolean | "x" | "y" | "all";
export type ContainerLandmark =
  | "div"
  | "main"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "nav";

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  /** Semantic layout role */
  variant?: ContainerVariant;
  /** @deprecated Use `variant` */
  width?: ContainerWidth;
  /** Custom max-width (px/rem/%) when variant="custom" — or overrides any variant */
  maxWidth?: string | number;
  padding?: ContainerPadding;
  paddingX?: ContainerPadding;
  paddingY?: ContainerPadding | "section";
  align?: ContainerAlign;
  safeArea?: ContainerSafeArea;
  sticky?: ContainerSticky;
  /** Locks document scroll while mounted / true */
  scrollLock?: boolean;
  overflow?: ContainerOverflow;
  /** Mark as nested (or auto when inside another container) */
  nested?: boolean;
  /** Animate max-width / padding on breakpoint changes */
  motion?: boolean;
  /** Inherit canvas background */
  surface?: boolean;
  /** Soft elevated shell */
  elevated?: boolean;
  /** Flex column + token gap */
  stack?: boolean;
  /** Foldable-aware progressive layout */
  fold?: boolean;
  as?: ContainerLandmark | keyof React.JSX.IntrinsicElements;
}

const VARIANT: Record<ContainerVariant, string> = {
  fluid: "dk-container-fluid",
  fixed: "dk-container-fixed",
  centered: "dk-container-centered",
  full: "dk-container-full",
  narrow: "dk-container-narrow",
  wide: "dk-container-wide",
  reading: "dk-container-reading",
  dashboard: "dk-container-dashboard",
  form: "dk-container-form",
  hero: "dk-container-hero",
  modal: "dk-container-modal",
  custom: "dk-container-custom",
};

const WIDTH_LEGACY: Record<ContainerWidth, ContainerVariant> = {
  default: "centered",
  fluid: "fluid",
  narrow: "narrow",
  wide: "wide",
};

const PAD_X: Record<ContainerPadding, string> = {
  none: "dk-container-px-none",
  sm: "dk-container-px-sm",
  md: "dk-container-px-md",
  lg: "dk-container-px-lg",
  xl: "dk-container-px-xl",
  responsive: "",
};

const PAD_Y: Record<ContainerPadding | "section", string> = {
  none: "dk-container-py-none",
  sm: "dk-container-py-sm",
  md: "dk-container-py-md",
  lg: "dk-container-py-lg",
  xl: "dk-container-py-xl",
  responsive: "",
  section: "dk-container-py-section",
};

/**
 * Responsive Container — primary layout wrapper for screens, modals, dashboards, forms.
 * Mobile-first, safe-area aware, nested-safe, token padding.
 */
export function Container({
  variant,
  width = "default",
  maxWidth,
  padding = "responsive",
  paddingX,
  paddingY,
  align = "center",
  safeArea = true,
  sticky = false,
  scrollLock = false,
  overflow = "visible",
  nested = false,
  motion = true,
  surface = false,
  elevated = false,
  stack = false,
  fold = false,
  as = "div",
  className = "",
  style,
  children,
  ...props
}: ContainerProps) {
  const resolvedVariant = variant ?? WIDTH_LEGACY[width] ?? "centered";
  const px = paddingX ?? padding;
  const py = paddingY ?? (padding === "responsive" ? "none" : padding);

  React.useEffect(() => {
    if (!scrollLock) return;
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("dk-scroll-lock");
    body.classList.add("dk-scroll-lock");
    return () => {
      html.classList.remove("dk-scroll-lock");
      body.classList.remove("dk-scroll-lock");
    };
  }, [scrollLock]);

  const classes = [
    "dk-container",
    "dk-rc",
    VARIANT[resolvedVariant],
    align !== "center" ? `dk-container-align-${align}` : "",
    px !== "responsive" ? PAD_X[px] : "",
    py !== "responsive" && py !== "none" ? PAD_Y[py] : py === "none" ? PAD_Y.none : "",
    safeArea === true || safeArea === "all" ? "dk-container-safe-x" : "",
    safeArea === "x" ? "dk-container-safe-x" : "",
    safeArea === "y" ? "dk-container-safe-y" : "",
    sticky === true || sticky === "top" ? "dk-container-sticky" : "",
    sticky === "bottom" ? "dk-container-sticky-bottom" : "",
    overflow !== "visible" ? `dk-container-overflow-${overflow}` : "",
    nested ? "dk-container-nested" : "",
    motion ? "dk-container-motion" : "",
    surface ? "dk-container-surface" : "",
    elevated ? "dk-container-elevated" : "",
    stack ? "dk-container-stack" : "",
    fold ? "dk-container-fold" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle: React.CSSProperties = {
    ...(maxWidth != null
      ? {
          ["--container-custom-width" as string]:
            typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
          maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
        }
      : null),
    ...style,
  };

  const Tag = as as React.ElementType;

  return (
    <Tag className={classes} style={mergedStyle} {...props}>
      {children}
    </Tag>
  );
}

export { Container as ResponsiveContainer };
