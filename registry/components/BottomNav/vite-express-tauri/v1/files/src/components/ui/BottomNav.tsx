"use client";

import * as React from "react";

export type BottomNavProps = React.HTMLAttributes<HTMLElement>;

export function BottomNav({ className = "", ...props }: BottomNavProps) {
  return <nav className={`fixed inset-x-0 bottom-0 z-20 flex h-14 items-center justify-around border-t border-[var(--color-border)] bg-[var(--color-bg)] px-2 ${className}`} {...props} />;
}
