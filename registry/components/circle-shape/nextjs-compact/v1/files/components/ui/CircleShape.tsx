import * as React from "react";

export type CircleSize = "sm" | "md" | "lg" | "xl";

export interface CircleShapeProps extends React.HTMLAttributes<HTMLElement> {
  size?: CircleSize;
  as?: keyof React.JSX.IntrinsicElements;
}

/** Perfect circle — icon wells, badges, media thumbs. */
export function CircleShape({
  size = "md",
  as = "div",
  className = "",
  children,
  ...props
}: CircleShapeProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={`dk-circle dk-circle-${size} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
