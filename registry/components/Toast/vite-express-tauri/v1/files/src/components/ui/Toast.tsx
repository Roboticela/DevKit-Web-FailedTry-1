"use client";

import * as React from "react";

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  title: string;
  description?: string;
  variant?: ToastVariant;
  autoCloseMs?: number;
  className?: string;
}

export function Toast({
  open,
  onOpenChange,
  title,
  description,
  variant = "info",
  autoCloseMs = 3000,
  className = "",
}: ToastProps) {
  React.useEffect(() => {
    if (!open || autoCloseMs <= 0) return;
    const timer = window.setTimeout(() => onOpenChange(false), autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [autoCloseMs, onOpenChange, open]);

  if (!open) return null;

  const variantClass =
    variant === "success"
      ? "border-[var(--color-success,#22c55e)]"
      : variant === "warning"
        ? "border-[var(--color-warning,#f59e0b)]"
        : variant === "error"
          ? "border-[var(--color-danger,#ef4444)]"
          : "border-[var(--color-border)]";

  return (
    <div className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:justify-end">
      <div
        role="status"
        className={
          `w-full max-w-sm rounded-[var(--radius-md,0.625rem)] border bg-[var(--color-bg)] p-3 text-[var(--color-text)] ` +
          `${variantClass} ${className}`
        }
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium">{title}</p>
            {description ? <p className="mt-1 text-xs text-[var(--color-text-subtle,var(--color-text))]">{description}</p> : null}
          </div>
          <button type="button" className="text-xs" onClick={() => onOpenChange(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
