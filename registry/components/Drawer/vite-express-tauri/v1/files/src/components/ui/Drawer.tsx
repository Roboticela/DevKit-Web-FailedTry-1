"use client";

import * as React from "react";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  side?: "left" | "right" | "bottom";
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onOpenChange,
  side = "bottom",
  title,
  children,
  className = "",
}: DrawerProps) {
  if (!open) return null;

  const sideClass =
    side === "left"
      ? "inset-y-0 left-0 h-full w-full max-w-sm"
      : side === "right"
        ? "inset-y-0 right-0 h-full w-full max-w-sm"
        : "inset-x-0 bottom-0 w-full rounded-t-[var(--radius-lg,1rem)]";

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close drawer" className="absolute inset-0 bg-black/30" onClick={() => onOpenChange(false)} />
      <section
        className={
          `absolute border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-[var(--color-text)] ${sideClass} ${className}`
        }
      >
        <div className="mb-3 flex items-center justify-between">
          {title ? <h2 className="text-base font-semibold">{title}</h2> : <span />}
          <button type="button" className="text-sm" onClick={() => onOpenChange(false)}>
            Close
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
