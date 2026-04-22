"use client";

import * as React from "react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function Spinner({ size = "md", label, className = "", ...props }: SpinnerProps) {
  const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6";

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} {...props}>
      <span
        className={`${sizeClass} inline-block animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]`}
        aria-hidden
      />
      {label ? <span className="text-sm text-[var(--color-text)]">{label}</span> : null}
    </div>
  );
}
