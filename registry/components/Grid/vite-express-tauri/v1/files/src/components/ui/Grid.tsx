import * as React from "react";

export type GridGap = 2 | 3 | 4 | 5 | 6 | 8;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | { sm?: number; md?: number; lg?: number };
  gap?: GridGap;
  maxWidth?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

export function Grid({
  columns = 12,
  gap = 4,
  maxWidth = false,
  as = "div",
  style,
  children,
  ...props
}: GridProps) {
  const Tag = as as React.ElementType;
  const cols =
    typeof columns === "number"
      ? columns
      : columns.lg ?? columns.md ?? columns.sm ?? 12;

  return (
    <Tag
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: `var(--space-${gap})`,
        width: "100%",
        maxWidth: maxWidth ? "var(--grid-max-width)" : undefined,
        marginInline: maxWidth ? "auto" : undefined,
        paddingInline: maxWidth ? "var(--container-padding)" : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

export function GridItem({
  span = 1,
  as = "div",
  style,
  children,
  ...props
}: GridItemProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      style={{
        gridColumn: `span ${span} / span ${span}`,
        minWidth: 0,
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
