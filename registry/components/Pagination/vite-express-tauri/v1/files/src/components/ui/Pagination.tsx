"use client";

import * as React from "react";

export interface PaginationProps {
  totalPages: number;
  currentPage?: number;
  page?: number;
  defaultPage?: number;
  siblingCount?: number;
  onPageChange?: (page: number) => void;
  onChange?: (page: number) => void;
  className?: string;
}

export function Pagination({
  totalPages,
  currentPage,
  page,
  defaultPage = 1,
  siblingCount = 1,
  onPageChange,
  onChange,
  className = "",
}: PaginationProps) {
  const externalPage = typeof currentPage === "number" ? currentPage : page;
  const isControlled = typeof externalPage === "number";
  const [internal, setInternal] = React.useState(defaultPage);
  const active = isControlled ? (externalPage as number) : internal;

  const safeCurrent = Math.max(1, Math.min(totalPages, active));
  const start = Math.max(1, safeCurrent - siblingCount);
  const end = Math.min(totalPages, safeCurrent + siblingCount);
  const pages: number[] = [];
  for (let p = start; p <= end; p += 1) pages.push(p);

  const setPage = (next: number) => {
    const safe = Math.max(1, Math.min(totalPages, next));
    if (!isControlled) setInternal(safe);
    onPageChange?.(safe);
    onChange?.(safe);
  };

  const buttonClass =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--radius-sm,0.375rem)] border border-[var(--color-border)] px-2 text-sm";

  return (
    <nav className={`flex items-center justify-center gap-2 ${className}`} aria-label="Pagination">
      <button type="button" className={`${buttonClass} disabled:opacity-50`} onClick={() => setPage(safeCurrent - 1)} disabled={safeCurrent <= 1}>
        Prev
      </button>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setPage(item)}
          className={`${buttonClass} ${item === safeCurrent ? "bg-[var(--color-primary)] text-[var(--color-primary-text,var(--color-bg))] border-[var(--color-primary)]" : "bg-[var(--color-bg)] text-[var(--color-text)]"}`}
        >
          {item}
        </button>
      ))}
      <button type="button" className={`${buttonClass} disabled:opacity-50`} onClick={() => setPage(safeCurrent + 1)} disabled={safeCurrent >= totalPages}>
        Next
      </button>
    </nav>
  );
}
