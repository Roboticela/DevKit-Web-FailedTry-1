"use client";

import * as React from "react";

export type TopNavProps = React.HTMLAttributes<HTMLElement>;

export function TopNav({ className = "", ...props }: TopNavProps) {
  return <nav className={`sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)] px-3 ${className}`} {...props} />;
}
