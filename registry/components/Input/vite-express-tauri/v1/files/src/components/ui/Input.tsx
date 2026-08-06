"use client";

import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={
        `h-10 w-full rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm ` +
        `text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-subtle,var(--color-text))] ` +
        `focus:ring-2 focus:ring-[var(--color-primary)]/30 disabled:opacity-50 ${className}`
      }
      {...props}
    />
  );
});
