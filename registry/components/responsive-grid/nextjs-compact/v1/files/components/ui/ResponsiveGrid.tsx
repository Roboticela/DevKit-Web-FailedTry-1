import * as React from "react";

type BreakpointColumns = number | { sm?: number; md?: number; lg?: number; xl?: number };
type GapScale = "none" | "tight" | "default" | "loose";

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: BreakpointColumns;
  gap?: GapScale;
  equalHeight?: boolean;
  nested?: boolean;
  autofit?: boolean;
  autofill?: boolean;
  masonry?: boolean;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "stretch";
  as?: keyof React.JSX.IntrinsicElements;
}

const GAP_CLASS: Record<GapScale, string> = {
  none: "dk-gap-none",
  tight: "dk-gap-tight",
  default: "",
  loose: "dk-gap-loose",
};

const ALIGN_CLASS = {
  start: "dk-items-start",
  center: "dk-items-center",
  end: "dk-items-end",
  stretch: "dk-items-stretch",
  baseline: "dk-items-baseline",
} as const;

const JUSTIFY_CLASS = {
  start: "dk-justify-start",
  center: "dk-justify-center",
  end: "dk-justify-end",
  stretch: "dk-justify-stretch",
} as const;

function colsClass(prefix: string, n: number | undefined): string {
  if (n == null) return "";
  return `${prefix}grid-cols-${n}`;
}

function columnsToClass(columns: BreakpointColumns | undefined): string {
  if (columns == null) return "";
  if (typeof columns === "number") return `dk-grid-cols-${columns}`;
  return [
    colsClass("dk-", columns.sm ?? 4),
    colsClass("dk-md-", columns.md),
    colsClass("dk-lg-", columns.lg),
    colsClass("dk-xl-", columns.xl),
  ]
    .filter(Boolean)
    .join(" ");
}

/** Responsive structural grid — mobile-first columns & gutters. */
export function ResponsiveGrid({
  columns,
  gap = "default",
  equalHeight = false,
  nested = false,
  autofit = false,
  autofill = false,
  masonry = false,
  align = "stretch",
  justify = "stretch",
  as = "div",
  className = "",
  children,
  ...props
}: ResponsiveGridProps) {
  const Tag = as as React.ElementType;
  const base = masonry
    ? "dk-masonry"
    : autofit
      ? "dk-grid-autofit"
      : autofill
        ? "dk-grid-autofill"
        : "dk-grid";

  const classes = [
    base,
    !autofit && !autofill && !masonry ? columnsToClass(columns) : "",
    nested ? "dk-grid-nested" : "",
    equalHeight && !masonry ? "dk-equal-height" : "",
    GAP_CLASS[gap],
    !autofit && !autofill && !masonry ? ALIGN_CLASS[align] : "",
    !autofit && !autofill && !masonry ? JUSTIFY_CLASS[justify] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}

type SpanValue =
  | number
  | "full"
  | { sm?: number | "full"; md?: number | "full"; lg?: number | "full"; xl?: number | "full" };

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: SpanValue;
  start?: number | "auto";
  as?: keyof React.JSX.IntrinsicElements;
}

function spanClass(prefix: string, value: number | "full" | undefined): string {
  if (value == null) return "";
  if (value === "full") return `${prefix}col-full`;
  return `${prefix}col-${value}`;
}

/** Grid cell with responsive span. */
export function GridItem({
  span = 1,
  start,
  as = "div",
  className = "",
  style,
  children,
  ...props
}: GridItemProps) {
  const Tag = as as React.ElementType;
  let classes = "";

  if (typeof span === "number" || span === "full") {
    classes = spanClass("dk-", span);
  } else {
    classes = [
      spanClass("dk-", span.sm ?? 4),
      spanClass("dk-md-", span.md),
      spanClass("dk-lg-", span.lg),
      spanClass("dk-xl-", span.xl),
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (start != null) {
    classes += start === "auto" ? " dk-col-start-auto" : ` dk-col-start-${start}`;
  }

  return (
    <Tag className={`${classes} ${className}`.trim()} style={{ minWidth: 0, ...style }} {...props}>
      {children}
    </Tag>
  );
}

export { ResponsiveGrid as Grid };
