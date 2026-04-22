"use client";

import * as React from "react";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  id,
  name,
  className = "",
}: SwitchProps) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isControlled = typeof checked === "boolean";
  const current = isControlled ? checked : internal;

  const toggle = React.useCallback(() => {
    if (disabled) return;
    const next = !current;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  }, [current, disabled, isControlled, onCheckedChange]);

  return (
    <button
      type="button"
      id={id}
      name={name}
      role="switch"
      aria-checked={current}
      disabled={disabled}
      onClick={toggle}
      className={
        `relative inline-flex h-6 w-11 items-center rounded-full border border-[var(--color-border)] ` +
        `${current ? "bg-[var(--color-primary)]" : "bg-[var(--color-bg)]"} ` +
        `disabled:opacity-50 ${className}`
      }
    >
      <span
        className={
          `inline-block h-4 w-4 transform rounded-full bg-[var(--color-bg)] transition-transform ` +
          `${current ? "translate-x-6" : "translate-x-1"}`
        }
      />
    </button>
  );
}
