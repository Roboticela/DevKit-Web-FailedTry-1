import * as React from "react";

export type BodyTextSize = "md" | "sm";

export interface BodyTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: BodyTextSize;
  as?: "p" | "span" | "div";
  truncate?: boolean;
  clamp?: 2 | 3;
  hyphens?: boolean;
}

/** Body and small-body reading text. */
export function BodyText({
  size = "md",
  as = "p",
  truncate = false,
  clamp,
  hyphens = false,
  className = "",
  children,
  ...props
}: BodyTextProps) {
  const Tag = as as React.ElementType;
  const base = size === "sm" ? "dk-type-body-sm" : "dk-type-body";
  const extras = [
    truncate ? "dk-truncate" : "",
    clamp === 2 ? "dk-line-clamp-2" : "",
    clamp === 3 ? "dk-line-clamp-3" : "",
    hyphens ? "dk-hyphens" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={`${base} ${extras}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
