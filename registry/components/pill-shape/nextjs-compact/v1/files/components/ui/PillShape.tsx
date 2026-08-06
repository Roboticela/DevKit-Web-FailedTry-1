import * as React from "react";

export type PillSize = "sm" | "md" | "lg";

export interface PillShapeProps extends React.HTMLAttributes<HTMLElement> {
  size?: PillSize;
  /** Chip chrome (background + border) */
  chip?: boolean;
  interactive?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

/** Pill / capsule shape for chips, tags, and filter controls. */
export function PillShape({
  size = "md",
  chip = false,
  interactive = false,
  as = "span",
  className = "",
  children,
  ...props
}: PillShapeProps) {
  const Tag = as as React.ElementType;
  const classes = [
    chip ? "dk-chip" : "dk-pill",
    !chip && size !== "md" ? `dk-pill-${size}` : "",
    chip && interactive ? "dk-chip-interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}
