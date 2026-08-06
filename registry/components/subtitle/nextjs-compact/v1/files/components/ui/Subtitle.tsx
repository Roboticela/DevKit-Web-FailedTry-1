import * as React from "react";

export interface SubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "h2" | "h3" | "span";
  truncate?: boolean;
  clamp?: 2 | 3;
}

/** Supporting line under titles. */
export function Subtitle({
  as = "p",
  truncate = false,
  clamp,
  className = "",
  children,
  ...props
}: SubtitleProps) {
  const Tag = as as React.ElementType;
  const extras = [
    truncate ? "dk-truncate" : "",
    clamp === 2 ? "dk-line-clamp-2" : "",
    clamp === 3 ? "dk-line-clamp-3" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={`dk-type-subtitle ${extras}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
