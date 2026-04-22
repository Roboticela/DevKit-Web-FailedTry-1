"use client";

import * as React from "react";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Surface({ padded = true, className = "", ...props }: SurfaceProps) {
  return (
    <div
      className={
        `rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] bg-[var(--color-card,var(--color-bg))] text-[var(--color-text)] ` +
        `${padded ? "p-3" : ""} ${className}`
      }
      {...props}
    />
  );
}
