"use client";

import * as React from "react";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title = "No data", description, action, className = "", ...props }: EmptyStateProps) {
  return (
    <div
      className={
        `flex min-h-40 w-full flex-col items-center justify-center rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] ` +
        `bg-[var(--color-bg)] p-4 text-center ${className}`
      }
      {...props}
    >
      <p className="text-base font-medium text-[var(--color-text)]">{title}</p>
      {description ? <p className="mt-1 text-sm text-[var(--color-text-subtle,var(--color-text))]">{description}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
