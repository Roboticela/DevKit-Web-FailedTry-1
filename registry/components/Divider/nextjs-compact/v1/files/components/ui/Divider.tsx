"use client";

import * as React from "react";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
}

export function Divider({ orientation = "horizontal", className = "", ...props }: DividerProps) {
  return (
    <hr
      className={orientation === "vertical" ? `h-full min-h-4 w-px border-0 bg-[var(--color-border)] ${className}` : `h-px w-full border-0 bg-[var(--color-border)] ${className}`}
      {...props}
    />
  );
}
