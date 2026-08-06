import * as React from "react";

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: "horizontal" | "vertical";
  strong?: boolean;
  inset?: boolean;
  as?: "hr" | "div" | "span";
}

/** Visual divider — hairline separator between content. */
export function Divider({
  orientation = "horizontal",
  strong = false,
  inset = false,
  as,
  className = "",
  ...props
}: DividerProps) {
  const Tag = (as ?? (orientation === "horizontal" ? "hr" : "div")) as React.ElementType;
  const classes = [
    "dk-divider",
    orientation === "vertical" ? "dk-divider-v" : "dk-divider-h",
    strong ? "dk-divider-strong" : "",
    inset ? "dk-divider-inset" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes} role="separator" aria-orientation={orientation} {...props} />;
}

export const Separator = Divider;
