"use client";

import * as React from "react";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value" | "defaultValue"> {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  onChange,
  className = "",
  ...props
}: SelectProps) {
  const initial = defaultValue ?? options.find((option) => !option.disabled)?.value ?? "";
  const [internal, setInternal] = React.useState(initial);
  const isControlled = typeof value === "string";
  const current = isControlled ? value : internal;

  return (
    <select
      value={current}
      className={
        `h-10 w-full rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 ` +
        `text-sm text-[var(--color-text)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 ${className}`
      }
      onChange={(event) => {
        const next = event.target.value;
        if (!isControlled) setInternal(next);
        onValueChange?.(next);
        onChange?.(event);
      }}
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
