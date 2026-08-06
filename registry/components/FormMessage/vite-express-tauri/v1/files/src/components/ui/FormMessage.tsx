"use client";

import * as React from "react";

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: "error" | "info" | "success";
}

export function FormMessage({ tone = "error", className = "", ...props }: FormMessageProps) {
  const toneClass = tone === "success" ? "text-[var(--color-success,#22c55e)]" : tone === "info" ? "text-[var(--color-text-subtle,var(--color-text))]" : "text-[var(--color-danger,#ef4444)]";
  return <p className={`text-xs ${toneClass} ${className}`} {...props} />;
}
