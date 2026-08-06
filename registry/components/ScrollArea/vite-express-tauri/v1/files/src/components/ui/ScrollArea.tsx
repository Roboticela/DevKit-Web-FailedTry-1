"use client";

import * as React from "react";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: number;
}

export function ScrollArea({ maxHeight = 320, className = "", style, ...props }: ScrollAreaProps) {
  return (
    <div
      className={`overflow-auto rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] custom-scrollbar ${className}`}
      style={{ maxHeight, ...style }}
      {...props}
    />
  );
}
