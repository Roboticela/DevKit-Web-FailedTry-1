"use client";

import * as React from "react";

export interface AlertDialogProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
  className?: string;
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  destructive = false,
  className = "",
}: AlertDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button type="button" aria-label="Close alert dialog" className="absolute inset-0 bg-black/30" onClick={() => onOpenChange(false)} />
      <div
        role="alertdialog"
        aria-modal="true"
        className={
          `relative z-10 w-full max-w-md rounded-t-[var(--radius-lg,1rem)] border border-[var(--color-border)] ` +
          `bg-[var(--color-bg)] p-4 text-[var(--color-text)] sm:rounded-[var(--radius-lg,1rem)] ${className}`
        }
      >
        <h2 className="text-base font-semibold">{title}</h2>
        {description ? <p className="mt-1 text-sm text-[var(--color-text-subtle,var(--color-text))]">{description}</p> : null}
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            className="h-9 rounded-[var(--radius-sm,0.375rem)] border border-[var(--color-border)] px-3 text-sm"
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={
              `h-9 rounded-[var(--radius-sm,0.375rem)] border px-3 text-sm ` +
              `${destructive ? "border-[var(--color-danger,#ef4444)] bg-[var(--color-danger,#ef4444)] text-white" : "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-text,var(--color-bg))]"}`
            }
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
