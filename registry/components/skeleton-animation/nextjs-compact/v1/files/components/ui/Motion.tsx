import * as React from "react";

export type MotionPreset =
  | "fade"
  | "fade-out"
  | "scale"
  | "scale-out"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "slide-up-out"
  | "page"
  | "page-exit"
  | "modal"
  | "drawer"
  | "drawer-end"
  | "sheet"
  | "dropdown"
  | "tooltip"
  | "notify"
  | "success";

export type MotionSpeed = "fast" | "normal" | "slow";

export interface MotionProps extends React.HTMLAttributes<HTMLElement> {
  preset?: MotionPreset;
  /** When false, plays exit variant if available and hides after animation */
  in?: boolean;
  speed?: MotionSpeed;
  staggerIndex?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

const PRESET: Record<MotionPreset, string> = {
  fade: "dk-anim-fade-in",
  "fade-out": "dk-anim-fade-out",
  scale: "dk-anim-scale-in",
  "scale-out": "dk-anim-scale-out",
  "slide-up": "dk-anim-slide-up",
  "slide-down": "dk-anim-slide-down",
  "slide-left": "dk-anim-slide-left",
  "slide-right": "dk-anim-slide-right",
  "slide-up-out": "dk-anim-slide-up-out",
  page: "dk-anim-page",
  "page-exit": "dk-anim-page-exit",
  modal: "dk-anim-modal",
  drawer: "dk-anim-drawer",
  "drawer-end": "dk-anim-drawer-end",
  sheet: "dk-anim-sheet",
  dropdown: "dk-anim-dropdown",
  tooltip: "dk-anim-tooltip",
  notify: "dk-anim-notify",
  success: "dk-anim-success",
};

const EXIT: Partial<Record<MotionPreset, MotionPreset>> = {
  fade: "fade-out",
  scale: "scale-out",
  "slide-up": "slide-up-out",
  page: "page-exit",
  modal: "scale-out",
};

const SPEED: Record<MotionSpeed, string> = {
  fast: "dk-motion-fast",
  normal: "dk-motion-normal",
  slow: "dk-motion-slow",
};

/**
 * Purpose-driven motion wrapper — compositor-friendly presets.
 * Toggle `in` for interruptible enter/exit (CSS animation swap).
 */
export function Motion({
  preset = "fade",
  in: isIn = true,
  speed = "normal",
  staggerIndex,
  as = "div",
  className = "",
  children,
  style,
  onAnimationEnd,
  ...props
}: MotionProps) {
  const Tag = as as React.ElementType;
  const active = isIn ? preset : EXIT[preset] ?? "fade-out";
  const [mounted, setMounted] = React.useState(isIn);

  React.useEffect(() => {
    if (isIn) setMounted(true);
  }, [isIn]);

  if (!mounted && !isIn) return null;

  const classes = [
    "dk-animate",
    PRESET[active],
    SPEED[speed],
    staggerIndex != null ? `dk-delay-${Math.min(5, Math.max(1, staggerIndex))}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      className={classes}
      style={style}
      onAnimationEnd={(e: React.AnimationEvent<HTMLElement>) => {
        onAnimationEnd?.(e);
        if (!isIn) setMounted(false);
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function MotionStagger({
  as = "div",
  speed = "normal",
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  as?: keyof React.JSX.IntrinsicElements;
  speed?: "fast" | "normal" | "slow";
}) {
  const Tag = as as React.ElementType;
  const staggerSpeed =
    speed === "fast" ? "dk-stagger-fast" : speed === "slow" ? "dk-stagger-slow" : "";
  return (
    <Tag className={`dk-stagger ${staggerSpeed} ${className}`.trim()} {...props}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ className?: string }>, {
              className: `dk-animate dk-anim-fade-in ${SPEED[speed === "slow" ? "slow" : speed === "fast" ? "fast" : "normal"]} ${(child.props as { className?: string }).className ?? ""}`.trim(),
            })
          : child
      )}
    </Tag>
  );
}
