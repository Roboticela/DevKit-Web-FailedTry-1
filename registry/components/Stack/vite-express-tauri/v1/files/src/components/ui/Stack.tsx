"use client";

import * as React from "react";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "column" | "row";
  gap?: "sm" | "md" | "lg";
  wrap?: boolean;
}

export function Stack({ direction = "column", gap = "md", wrap = false, className = "", ...props }: StackProps) {
  const directionClass = direction === "row" ? "flex-row" : "flex-col";
  const gapClass = gap === "sm" ? "gap-2" : gap === "lg" ? "gap-4" : "gap-3";
  return <div className={`flex ${directionClass} ${gapClass} ${wrap ? "flex-wrap" : ""} ${className}`} {...props} />;
}
