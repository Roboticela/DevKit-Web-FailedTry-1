"use client";

import * as React from "react";

export type BannerVariant = "neutral" | "info" | "success" | "warning" | "error";

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  variant?: BannerVariant;
  action?: React.ReactNode;
}

export function Banner({
  title,
  variant = "neutral",
  action,
  children,
  className = "",
  ...props
}: BannerProps) {
  const variantClass =
    variant === "info"
      ? "border-[var(--color-primary)]"
      : variant === "success"
        ? "border-[var(--color-success,#22c55e)]"
        : variant === "warning"
          ? "border-[var(--color-warning,#f59e0b)]"
          : variant === "error"
            ? "border-[var(--color-danger,#ef4444)]"
            : "border-[var(--color-border)]";

  return (
    <div
      className={
        `w-full rounded-[var(--radius-md,0.625rem)] border bg-[var(--color-bg-subtle,var(--color-bg))] p-3 text-[var(--color-text)] ` +
        `${variantClass} ${className}`
      }
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {title ? <p className="text-sm font-medium">{title}</p> : null}
          <div className="text-sm text-[var(--color-text-subtle,var(--color-text))]">{children}</div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
