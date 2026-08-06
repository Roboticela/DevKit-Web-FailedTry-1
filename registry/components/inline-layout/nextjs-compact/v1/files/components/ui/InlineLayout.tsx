import * as React from "react";

export interface InlineLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/** Horizontal wrapping inline cluster. */
export function InlineLayout({
  gap,
  as = "div",
  className = "",
  style,
  children,
  ...props
}: InlineLayoutProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={`dk-inline ${className}`.trim()}
      style={{ ...(gap ? { ["--inline-gap" as string]: gap } : null), ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
