"use client";

import * as React from "react";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className = "", ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={
        `min-h-24 w-full rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm ` +
        `text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-subtle,var(--color-text))] ` +
        `focus:ring-2 focus:ring-[var(--color-primary)]/30 disabled:opacity-50 ${className}`
      }
      {...props}
    />
  );
});
