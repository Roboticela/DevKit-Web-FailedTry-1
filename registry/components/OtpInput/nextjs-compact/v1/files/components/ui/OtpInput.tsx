"use client";

import * as React from "react";

export interface OtpInputProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  inputClassName?: string;
}

export function OtpInput({
  length = 6,
  value,
  defaultValue = "",
  onValueChange,
  className = "",
  inputClassName = "",
}: OtpInputProps) {
  const [internal, setInternal] = React.useState(defaultValue.slice(0, length));
  const isControlled = typeof value === "string";
  const current = (isControlled ? value : internal).slice(0, length);

  const update = React.useCallback(
    (next: string) => {
      const trimmed = next.slice(0, length);
      if (!isControlled) setInternal(trimmed);
      onValueChange?.(trimmed);
    },
    [isControlled, length, onValueChange]
  );

  const cells = Array.from({ length }, (_, index) => current[index] ?? "");

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {cells.map((digit, index) => (
        <input
          key={index}
          value={digit}
          maxLength={1}
          inputMode="numeric"
          onChange={(event) => {
            const chars = current.split("");
            chars[index] = event.target.value.slice(-1);
            update(chars.join(""));
          }}
          className={
            `h-10 w-10 rounded-[var(--radius-sm,0.375rem)] border border-[var(--color-border)] bg-[var(--color-bg)] text-center ` +
            `text-sm text-[var(--color-text)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 ${inputClassName}`
          }
        />
      ))}
    </div>
  );
}
