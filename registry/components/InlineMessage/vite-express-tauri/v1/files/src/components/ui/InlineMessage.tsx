"use client";

import * as React from "react";

export interface InlineMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: "info" | "success" | "warning" | "danger";
}

export function InlineMessage({ tone = "info", className = "", ...props }: InlineMessageProps) {
  const toneClass =
    tone === "success"
      ? "text-[var(--color-success,#22c55e)]"
      : tone === "warning"
        ? "text-[var(--color-warning,#f59e0b)]"
        : tone === "danger"
          ? "text-[var(--color-danger,#ef4444)]"
          : "text-[var(--color-text-subtle,var(--color-text))]";
  return <p className={`text-sm ${toneClass} ${className}`} {...props} />;
}
