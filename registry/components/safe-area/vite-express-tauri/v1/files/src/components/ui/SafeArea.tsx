import * as React from "react";

export type SafeAreaEdges = "all" | "x" | "y" | "top" | "bottom";

export interface SafeAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  edges?: SafeAreaEdges;
  as?: keyof React.JSX.IntrinsicElements;
}

const EDGE: Record<SafeAreaEdges, string> = {
  all: "dk-safe-area",
  x: "dk-safe-x",
  y: "dk-safe-y",
  top: "dk-safe-top",
  bottom: "dk-safe-bottom",
};

/** Applies env(safe-area-inset-*) padding for notches and home indicators. */
export function SafeArea({
  edges = "all",
  as = "div",
  className = "",
  children,
  ...props
}: SafeAreaProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={`${EDGE[edges]} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
