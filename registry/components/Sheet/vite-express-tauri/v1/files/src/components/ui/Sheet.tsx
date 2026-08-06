"use client";

import * as React from "react";

export interface SheetProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  side?: "left" | "right";
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Sheet({
  open,
  onOpenChange,
  side = "right",
  title,
  children,
  className = "",
}: SheetProps) {
  if (!open) return null;

  const sideClass = side === "left" ? "left-0" : "right-0";

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close sheet" className="absolute inset-0 bg-black/30" onClick={() => onOpenChange(false)} />
      <aside
        className={
          `absolute ${sideClass} inset-y-0 w-full max-w-sm border-l border-[var(--color-border)] ` +
          `bg-[var(--color-bg)] p-4 text-[var(--color-text)] ${className}`
        }
      >
        <div className="mb-3 flex items-center justify-between">
          {title ? <h2 className="text-base font-semibold">{title}</h2> : <span />}
          <button type="button" className="text-sm" onClick={() => onOpenChange(false)}>
            Close
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}
