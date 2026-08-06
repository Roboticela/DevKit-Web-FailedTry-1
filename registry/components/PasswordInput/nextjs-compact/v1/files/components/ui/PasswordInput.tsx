"use client";

import * as React from "react";

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  revealLabel?: string;
  hideLabel?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { revealLabel = "Show", hideLabel = "Hide", className = "", ...props },
  ref
) {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        className={
          `h-10 w-full rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 pr-16 text-sm ` +
          `text-[var(--color-text)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 ${className}`
        }
        {...props}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 px-3 text-xs text-[var(--color-text-subtle,var(--color-text))]"
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? hideLabel : revealLabel}
      </button>
    </div>
  );
});
