"use client";

import * as React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

export function Skeleton({ lines = 1, className = "", ...props }: SkeletonProps) {
  if (lines <= 1) {
    return (
      <div
        className={`h-4 w-full animate-pulse rounded-[var(--radius-sm,0.375rem)] bg-[var(--color-bg-subtle,var(--color-border))] ${className}`}
        {...props}
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 w-full animate-pulse rounded-[var(--radius-sm,0.375rem)] bg-[var(--color-bg-subtle,var(--color-border))]"
        />
      ))}
    </div>
  );
}
