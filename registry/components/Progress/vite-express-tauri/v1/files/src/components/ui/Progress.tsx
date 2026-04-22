"use client";

import * as React from "react";

export interface ProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
  barClassName?: string;
}

export function Progress({ value, max = 100, showLabel = false, className = "", barClassName = "" }: ProgressProps) {
  const safeMax = max <= 0 ? 100 : max;
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const percent = (safeValue / safeMax) * 100;

  return (
    <div className={`w-full ${className}`}>
      {showLabel ? <p className="mb-1 text-xs text-[var(--color-text-subtle,var(--color-text))]">{Math.round(percent)}%</p> : null}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
        className="h-2 w-full overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]"
      >
        <div
          className={`h-full bg-[var(--color-primary)] transition-all duration-200 ${barClassName}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
