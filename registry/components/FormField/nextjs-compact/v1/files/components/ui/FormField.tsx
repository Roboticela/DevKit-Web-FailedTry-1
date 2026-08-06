"use client";

import * as React from "react";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
}

export function FormField({ label, hint, error, htmlFor, className = "", children, ...props }: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`} {...props}>
      {label ? <label htmlFor={htmlFor} className="text-sm font-medium text-[var(--color-text)]">{label}</label> : null}
      <div>{children}</div>
      {error ? <p className="text-xs text-[var(--color-danger,#ef4444)]">{error}</p> : hint ? <p className="text-xs text-[var(--color-text-subtle,var(--color-text))]">{hint}</p> : null}
    </div>
  );
}
