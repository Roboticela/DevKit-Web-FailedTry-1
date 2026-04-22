"use client";

import * as React from "react";

export type SideNavProps = React.HTMLAttributes<HTMLElement>;

export function SideNav({ className = "", ...props }: SideNavProps) {
  return <aside className={`hidden h-full w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg)] p-3 lg:block ${className}`} {...props} />;
}
