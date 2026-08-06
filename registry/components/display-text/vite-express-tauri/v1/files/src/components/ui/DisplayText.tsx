import * as React from "react";

export type DisplayTextVariant = "display" | "hero";

export interface DisplayTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: DisplayTextVariant;
  as?: "h1" | "h2" | "p" | "span";
  truncate?: boolean;
  clamp?: 2 | 3;
}

const CLASS: Record<DisplayTextVariant, string> = {
  display: "dk-type-display",
  hero: "dk-type-hero",
};

/** Display / Hero text — marketing and feature impact. */
export function DisplayText({
  variant = "display",
  as = "h1",
  truncate = false,
  clamp,
  className = "",
  children,
  ...props
}: DisplayTextProps) {
  const Tag = as;
  const extras = [
    truncate ? "dk-truncate" : "",
    clamp === 2 ? "dk-line-clamp-2" : "",
    clamp === 3 ? "dk-line-clamp-3" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={`${CLASS[variant]} ${extras}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
