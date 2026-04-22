"use client";

import * as React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { size = "md", className = "", type = "button", ...props },
  ref
) {
  const sizeClass = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-11 w-11" : "h-10 w-10";
  return (
    <button
      ref={ref}
      type={type}
      className={
        `inline-flex items-center justify-center rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] ` +
        `bg-[var(--color-bg)] text-[var(--color-text)] transition-all duration-200 focus-visible:outline-none ` +
        `focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/35 disabled:opacity-50 ${sizeClass} ${className}`
      }
      {...props}
    />
  );
});
