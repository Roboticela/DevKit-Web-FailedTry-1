import * as React from "react";

export type NumericDisplayVariant = "numeric" | "stat";

export interface NumericDisplayProps extends React.HTMLAttributes<HTMLElement> {
  variant?: NumericDisplayVariant;
  as?: "span" | "p" | "div";
}

/** Tabular numbers and KPI statistics. */
export function NumericDisplay({
  variant = "numeric",
  as = "span",
  className = "",
  children,
  ...props
}: NumericDisplayProps) {
  const Tag = as as React.ElementType;
  const base = variant === "stat" ? "dk-type-stat" : "dk-type-numeric";
  return (
    <Tag className={`${base} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
