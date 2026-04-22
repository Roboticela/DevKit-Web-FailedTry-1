"use client";

import * as React from "react";

export interface TabsItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabsItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, defaultValue, onValueChange, className = "" }: TabsProps) {
  const initial = defaultValue ?? items.find((item) => !item.disabled)?.id ?? "";
  const [internalValue, setInternalValue] = React.useState(initial);
  const isControlled = typeof value === "string";
  const activeId = isControlled ? value : internalValue;

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <div className={`w-full space-y-3 ${className}`}>
      <div className="inline-flex w-full gap-2 overflow-auto rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] bg-[var(--color-bg)] p-1">
        {items.map((item) => {
          const selected = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={() => setValue(item.id)}
              className={
                `h-9 rounded-[var(--radius-sm,0.375rem)] px-3 text-sm whitespace-nowrap disabled:opacity-50 ` +
                `${selected ? "bg-[var(--color-primary)] text-[var(--color-primary-text,var(--color-bg))]" : "text-[var(--color-text)]"}`
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-[var(--color-text)]">
        {activeItem?.content}
      </div>
    </div>
  );
}
