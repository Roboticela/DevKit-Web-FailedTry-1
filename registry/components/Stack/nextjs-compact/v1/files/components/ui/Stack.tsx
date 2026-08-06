import * as React from "react";

export type StackSpace = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  gap?: StackSpace;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

const ALIGN: Record<NonNullable<StackProps["align"]>, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

const JUSTIFY: Record<NonNullable<StackProps["justify"]>, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
};

export function Stack({
  direction = "column",
  gap = 4,
  align = "stretch",
  justify = "start",
  wrap = false,
  as = "div",
  style,
  children,
  ...props
}: StackProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      style={{
        display: "flex",
        flexDirection: direction,
        gap: `var(--space-${gap})`,
        alignItems: ALIGN[align],
        justifyContent: JUSTIFY[justify],
        flexWrap: wrap ? "wrap" : "nowrap",
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
