"use client";

import * as React from "react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { checked, defaultChecked = false, onCheckedChange, className = "", disabled, ...props },
  ref
) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isControlled = typeof checked === "boolean";
  const current = isControlled ? checked : internal;

  return (
    <input
      {...props}
      ref={ref}
      type="checkbox"
      checked={current}
      disabled={disabled}
      onChange={(event) => {
        const next = event.target.checked;
        if (!isControlled) setInternal(next);
        onCheckedChange?.(next);
      }}
      className={
        `h-4 w-4 rounded-[var(--radius-sm,0.375rem)] border border-[var(--color-border)] ` +
        `accent-[var(--color-primary)] disabled:opacity-50 ${className}`
      }
    />
  );
});
