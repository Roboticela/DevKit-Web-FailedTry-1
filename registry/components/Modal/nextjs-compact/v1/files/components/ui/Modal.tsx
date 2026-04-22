"use client";

import * as React from "react";

export interface ModalProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export function Modal({ open, onOpenChange, children, className = "" }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button type="button" aria-label="Close modal" className="absolute inset-0 bg-black/30" onClick={() => onOpenChange(false)} />
      <div className={`relative z-10 w-full max-w-lg rounded-t-[var(--radius-lg,1rem)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] sm:rounded-[var(--radius-lg,1rem)] ${className}`}>{children}</div>
    </div>
  );
}
