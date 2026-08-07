import * as React from "react";

/**
 * Surface — structural chrome container for nav / panels.
 * Elevation via background + border only (no shadow, no blur glass).
 */

export type SurfaceVariant = "flat" | "subtle" | "elevated" | "sticky";
export type SurfaceDensity = "compact" | "standard" | "comfortable";
export type SurfacePadding = "none" | "sm" | "md" | "lg";

export type SurfaceProps = {
  as?: "div" | "header" | "footer" | "section" | "aside" | "nav" | "main";
  variant?: SurfaceVariant;
  density?: SurfaceDensity;
  padding?: SurfacePadding;
  /** Apply env(safe-area-inset-*) padding. */
  safeArea?: boolean | "top" | "bottom" | "x" | "y";
  bordered?: boolean;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  role?: React.AriaRole;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const Surface = React.forwardRef<HTMLElement, SurfaceProps>(function Surface(
  {
    as = "div",
    variant = "flat",
    density = "standard",
    padding = "md",
    safeArea = false,
    bordered = true,
    children,
    className = "",
    id,
    role,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  },
  ref
) {
  const Tag = as;
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      id={id}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cx(
        "dk-surface",
        `dk-surface--${variant}`,
        `dk-surface--density-${density}`,
        `dk-surface--pad-${padding}`,
        bordered && "dk-surface--bordered",
        safeArea === true && "dk-surface--safe",
        safeArea === "top" && "dk-surface--safe-top",
        safeArea === "bottom" && "dk-surface--safe-bottom",
        safeArea === "x" && "dk-surface--safe-x",
        safeArea === "y" && "dk-surface--safe-y",
        className
      )}
    >
      {children}
    </Tag>
  );
});

Surface.displayName = "Surface";
export default Surface;
