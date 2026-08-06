import * as React from "react";

export interface StackLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/** Vertical stack with tokenized gap. */
export function StackLayout({
  gap,
  as = "div",
  className = "",
  style,
  children,
  ...props
}: StackLayoutProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={`dk-stack ${className}`.trim()}
      style={{ ...(gap ? { ["--stack-gap" as string]: gap } : null), ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
