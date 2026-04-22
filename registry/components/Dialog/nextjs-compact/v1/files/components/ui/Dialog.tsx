"use client";

import * as React from "react";

export interface DialogProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  title?: string;
  description?: string;
  closeOnOverlayClick?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  closeOnOverlayClick = true,
  children,
  footer,
  className = "",
}: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close dialog overlay"
        className="absolute inset-0 bg-black/30"
        onClick={() => closeOnOverlayClick && onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={
          `relative z-10 w-full max-w-lg rounded-t-[var(--radius-lg,1rem)] border border-[var(--color-border)] ` +
          `bg-[var(--color-bg)] text-[var(--color-text)] p-4 sm:rounded-[var(--radius-lg,1rem)] ${className}`
        }
      >
        {(title || description) && (
          <div className="mb-3 space-y-1 border-b border-[var(--color-border)] pb-3">
            {title ? <h2 className="text-base font-semibold">{title}</h2> : null}
            {description ? <p className="text-sm text-[var(--color-text-subtle,var(--color-text))]">{description}</p> : null}
          </div>
        )}
        <div>{children}</div>
        {footer ? <div className="mt-4 border-t border-[var(--color-border)] pt-3">{footer}</div> : null}
      </div>
    </div>
  );
}
