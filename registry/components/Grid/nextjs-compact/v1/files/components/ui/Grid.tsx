"use client";

import * as React from "react";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export function Grid({ columns = 3, gap = "md", className = "", ...props }: GridProps) {
  const cols = columns === 1 ? "grid-cols-1" : columns === 2 ? "grid-cols-1 sm:grid-cols-2" : columns === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  const gapClass = gap === "sm" ? "gap-2" : gap === "lg" ? "gap-4" : "gap-3";
  return <div className={`grid ${cols} ${gapClass} ${className}`} {...props} />;
}
