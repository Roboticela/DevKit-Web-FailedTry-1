import * as React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  compact?: boolean;
  as?: "section" | "div" | "main" | "aside";
}

/** Vertical page section with responsive rhythm. */
export function Section({
  compact = false,
  as = "section",
  className = "",
  children,
  ...props
}: SectionProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={`dk-section ${compact ? "dk-section-compact" : ""} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
