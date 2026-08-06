"use client";

import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "primary" | "success" | "warning" | "danger";
}

export function Badge({ variant = "neutral", className = "", ...props }: BadgeProps) {
  const variantClass =
    variant === "primary"
      ? "border-[var(--color-primary)] text-[var(--color-primary)]"
      : variant === "success"
        ? "border-[var(--color-success,#22c55e)] text-[var(--color-success,#22c55e)]"
        : variant === "warning"
          ? "border-[var(--color-warning,#f59e0b)] text-[var(--color-warning,#f59e0b)]"
          : variant === "danger"
            ? "border-[var(--color-danger,#ef4444)] text-[var(--color-danger,#ef4444)]"
            : "border-[var(--color-border)] text-[var(--color-text-subtle,var(--color-text))]";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${variantClass} ${className}`}
      {...props}
    />
  );
}
