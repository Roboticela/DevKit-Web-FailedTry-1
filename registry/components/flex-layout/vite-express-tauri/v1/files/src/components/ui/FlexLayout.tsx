import * as React from "react";

export interface FlexLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  wrap?: boolean;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around";
  gap?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

const ALIGN = {
  start: "dk-items-start",
  center: "dk-items-center",
  end: "dk-items-end",
  stretch: "dk-items-stretch",
  baseline: "dk-items-baseline",
} as const;

const JUSTIFY = {
  start: "dk-content-start",
  center: "dk-content-center",
  end: "dk-content-end",
  between: "dk-content-between",
  around: "dk-content-around",
} as const;

/** Flex layout primitive with alignment utilities. */
export function FlexLayout({
  direction = "row",
  wrap = false,
  align = "stretch",
  justify = "start",
  gap,
  as = "div",
  className = "",
  style,
  children,
  ...props
}: FlexLayoutProps) {
  const Tag = as as React.ElementType;
  const classes = [
    "dk-flex",
    direction === "column" ? "dk-flex-col" : "dk-flex-row",
    wrap ? "dk-flex-wrap" : "dk-flex-nowrap",
    ALIGN[align],
    JUSTIFY[justify],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag
      className={classes}
      style={{ ...(gap ? { gap } : null), ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
