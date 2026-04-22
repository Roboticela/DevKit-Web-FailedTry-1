"use client";

import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "default", size = "md", className = "", type = "button", ...props },
  ref
) {
  const variantClass =
    variant === "default"
      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-text,var(--color-bg))]"
      : variant === "secondary"
        ? "border-[var(--color-border)] bg-[var(--color-bg-subtle,var(--color-bg))] text-[var(--color-text)]"
        : variant === "outline"
          ? "border-[var(--color-border)] bg-transparent text-[var(--color-text)]"
          : "border-transparent bg-transparent text-[var(--color-primary)]";

  const sizeClass = size === "sm" ? "h-8 px-3 text-xs" : size === "lg" ? "h-11 px-5 text-base" : "h-10 px-4 text-sm";

  return (
    <button
      ref={ref}
      type={type}
      className={
        `inline-flex items-center justify-center rounded-[var(--radius-md,0.625rem)] border font-medium transition-all duration-200 ` +
        `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/35 disabled:opacity-50 ${variantClass} ${sizeClass} ${className}`
      }
      {...props}
    />
  );
});
