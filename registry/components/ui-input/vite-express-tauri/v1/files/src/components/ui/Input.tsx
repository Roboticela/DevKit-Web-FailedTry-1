import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/** DevKit UI primitive — styling comes from global design tokens only. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", type = "text", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={
        `w-full rounded-[var(--radius-md,0.5rem)] border border-[var(--color-border)] ` +
        `bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)] ` +
        `placeholder:text-[var(--color-text-subtle)] ` +
        `focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25 ` +
        `disabled:opacity-50 ${className}`
      }
      {...props}
    />
  );
});

Input.displayName = "Input";
