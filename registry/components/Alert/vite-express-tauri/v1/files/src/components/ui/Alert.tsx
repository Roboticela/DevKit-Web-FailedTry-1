"use client";

import * as React from "react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
}

export function Alert({ variant = "info", title, className = "", children, ...props }: AlertProps) {
  const variantClass =
    variant === "success"
      ? "border-[var(--color-success,#22c55e)]"
      : variant === "warning"
        ? "border-[var(--color-warning,#f59e0b)]"
        : variant === "error"
          ? "border-[var(--color-danger,#ef4444)]"
          : "border-[var(--color-primary)]";

  return (
    <div
      role="alert"
      className={`rounded-[var(--radius-md,0.625rem)] border bg-[var(--color-bg)] p-3 text-[var(--color-text)] ${variantClass} ${className}`}
      {...props}
    >
      {title ? <p className="text-sm font-medium">{title}</p> : null}
      <div className="text-sm text-[var(--color-text-subtle,var(--color-text))]">{children}</div>
    </div>
  );
}
