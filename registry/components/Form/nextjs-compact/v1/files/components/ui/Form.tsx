"use client";

import * as React from "react";

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  spacing?: "compact" | "normal" | "spacious";
}

export function Form({ className = "", spacing = "normal", ...props }: FormProps) {
  const gapClass = spacing === "compact" ? "space-y-2" : spacing === "spacious" ? "space-y-4" : "space-y-3";
  return (
    <form
      className={
        `w-full rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] bg-[var(--color-bg)] ` +
        `p-3 text-[var(--color-text)] transition-all duration-200 ease-out ${gapClass} ${className}`
      }
      {...props}
    />
  );
}
