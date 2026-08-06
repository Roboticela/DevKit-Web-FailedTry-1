"use client";

import * as React from "react";

export type AppHeaderProps = React.HTMLAttributes<HTMLElement>;

export function AppHeader({ className = "", ...props }: AppHeaderProps) {
  return <header className={`flex min-h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)] px-3 ${className}`} {...props} />;
}
