"use client";

import * as React from "react";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4";
  tone?: "default" | "muted";
}

export function Typography({ as = "p", tone = "default", className = "", ...props }: TypographyProps) {
  const Comp = as;
  const sizeClass = as === "h1" ? "text-3xl font-semibold" : as === "h2" ? "text-2xl font-semibold" : as === "h3" ? "text-xl font-semibold" : as === "h4" ? "text-lg font-semibold" : "text-sm";
  const toneClass = tone === "muted" ? "text-[var(--color-text-subtle,var(--color-text))]" : "text-[var(--color-text)]";
  return <Comp className={`${sizeClass} ${toneClass} ${className}`} {...props} />;
}
