"use client";

import * as React from "react";

export interface AppHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

/**
 * AppHeader uses design tokens from the host app and keeps a flat, modern UI style.
 */
export function AppHeader({ className = "", ...props }: AppHeaderProps) {
  return (
    <div
      className={
        `w-full rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] ` +
        `bg-[var(--color-bg)] text-[var(--color-text)] p-3 ` +
        `transition-all duration-200 ease-out ${className}`
      }
      {...props}
    />
  );
}
