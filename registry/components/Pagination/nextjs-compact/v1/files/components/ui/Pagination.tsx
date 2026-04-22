"use client";

import * as React from "react";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onChange,
  siblingCount = 1,
  className = "",
}: PaginationProps) {
  const current = Math.max(1, Math.min(totalPages, page));
  const start = Math.max(1, current - siblingCount);
  const end = Math.min(totalPages, current + siblingCount);
  const pages: number[] = [];
  for (let p = start; p <= end; p += 1) pages.push(p);

  const buttonClass =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--radius-sm,0.375rem)] border border-[var(--color-border)] px-2 text-sm";

  return (
    <nav className={`flex items-center justify-center gap-2 ${className}`} aria-label="Pagination">
      <button
        type="button"
        className={`${buttonClass} disabled:opacity-50`}
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
      >
        Prev
      </button>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`${buttonClass} ${item === current ? "bg-[var(--color-primary)] text-[var(--color-primary-text,var(--color-bg))] border-[var(--color-primary)]" : "bg-[var(--color-bg)] text-[var(--color-text)]"}`}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        className={`${buttonClass} disabled:opacity-50`}
        onClick={() => onChange(current + 1)}
        disabled={current >= totalPages}
      >
        Next
      </button>
    </nav>
  );
}
