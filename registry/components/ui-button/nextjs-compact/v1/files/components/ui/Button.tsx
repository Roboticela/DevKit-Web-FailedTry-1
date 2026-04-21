"use client";

import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

/** DevKit UI primitive — styling comes from global design tokens only. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = "", variant = "primary", type = "button", ...props },
  ref
) {
  const base =
    "inline-flex items-center justify-center font-medium transition-colors " +
    "rounded-[var(--radius-md,0.5rem)] px-4 py-2 text-sm " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "focus-visible:outline-[var(--color-primary)] disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-[var(--color-primary)] text-[var(--color-primary-text)] hover:bg-[var(--color-primary-hover)]"
      : variant === "secondary"
        ? "bg-[var(--color-bg-muted)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)]"
        : "bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)]";
  return <button ref={ref} type={type} className={`${base} ${styles} ${className}`} {...props} />;
});

Button.displayName = "Button";
