"use client";

import * as React from "react";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: SelectOption[];
  onChange?: (value: string) => void;
}

export function Select({ options, onChange, className = "", ...props }: SelectProps) {
  return (
    <select
      className={
        `h-10 w-full rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] ` +
        `bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text)] outline-none focus:ring-2 ` +
        `focus:ring-[var(--color-primary)]/30 ${className}`
      }
      onChange={(event) => onChange?.(event.target.value)}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
