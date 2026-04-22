"use client";

import * as React from "react";

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value" | "defaultValue"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Slider({
  value,
  defaultValue = 0,
  onValueChange,
  onChange,
  className = "",
  min = 0,
  max = 100,
  step = 1,
  ...props
}: SliderProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = typeof value === "number";
  const current = isControlled ? value : internal;

  return (
    <input
      type="range"
      value={current}
      min={min}
      max={max}
      step={step}
      onChange={(event) => {
        const next = Number(event.target.value);
        if (!isControlled) setInternal(next);
        onValueChange?.(next);
        onChange?.(event);
      }}
      className={`h-2 w-full cursor-pointer accent-[var(--color-primary)] ${className}`}
      {...props}
    />
  );
}
