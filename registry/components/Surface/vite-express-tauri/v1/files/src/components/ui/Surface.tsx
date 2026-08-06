import * as React from "react";

export type SurfaceElevation = 0 | 1 | 2 | 3;

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: SurfaceElevation;
  padded?: boolean;
  bordered?: boolean;
  radius?: "sm" | "md" | "lg" | "xl" | "none";
  as?: keyof React.JSX.IntrinsicElements;
}

const ELEVATION_BG: Record<SurfaceElevation, string> = {
  0: "var(--elevation-0)",
  1: "var(--elevation-1)",
  2: "var(--elevation-2)",
  3: "var(--elevation-3)",
};

const RADIUS_MAP = {
  none: "var(--radius-none)",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
} as const;

/** Soft surface via background elevation — no heavy shadows. */
export function Surface({
  elevation = 1,
  padded = true,
  bordered = false,
  radius = "lg",
  as = "div",
  style,
  children,
  ...props
}: SurfaceProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      style={{
        background: ELEVATION_BG[elevation],
        borderRadius: RADIUS_MAP[radius],
        border: bordered ? "var(--border-width) solid var(--color-border-subtle)" : "none",
        padding: padded ? "var(--space-4)" : undefined,
        color: "var(--color-text)",
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
