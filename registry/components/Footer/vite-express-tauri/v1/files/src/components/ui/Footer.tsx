"use client";

import * as React from "react";

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function Footer({ left, right, className = "", children, ...props }: FooterProps) {
  return (
    <footer className={`border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text-subtle,var(--color-text))] ${className}`} {...props}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>{left ?? children}</div>
        {right ? <div>{right}</div> : null}
      </div>
    </footer>
  );
}
