"use client";

import * as React from "react";

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  className?: string;
}

export function RadioGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  className = "",
}: RadioGroupProps) {
  const initial = defaultValue ?? options.find((option) => !option.disabled)?.value ?? "";
  const [internal, setInternal] = React.useState(initial);
  const isControlled = typeof value === "string";
  const current = isControlled ? value : internal;

  return (
    <div role="radiogroup" className={`flex flex-col gap-2 ${className}`}>
      {options.map((option) => {
        const id = `${name ?? "radio"}-${option.value}`;
        return (
          <label key={option.value} htmlFor={id} className={`inline-flex items-center gap-2 text-sm ${option.disabled ? "opacity-50" : ""}`}>
            <input
              id={id}
              type="radio"
              name={name}
              value={option.value}
              checked={current === option.value}
              disabled={option.disabled}
              onChange={() => {
                if (!isControlled) setInternal(option.value);
                onValueChange?.(option.value);
              }}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            <span className="text-[var(--color-text)]">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
