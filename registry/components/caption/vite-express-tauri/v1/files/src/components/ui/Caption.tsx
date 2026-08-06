import * as React from "react";

export interface CaptionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "figcaption";
  truncate?: boolean;
}

/** Caption / metadata text. */
export function Caption({
  as = "p",
  truncate = false,
  className = "",
  children,
  ...props
}: CaptionProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={`dk-type-caption ${truncate ? "dk-truncate" : ""} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
