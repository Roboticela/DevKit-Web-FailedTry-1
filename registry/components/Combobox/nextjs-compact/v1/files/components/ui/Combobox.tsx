"use client";

import * as React from "react";

export interface ComboboxOption {
  label: string;
  value: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Combobox({
  options,
  value = "",
  onValueChange,
  placeholder = "Search...",
  className = "",
}: ComboboxProps) {
  const [query, setQuery] = React.useState(value);
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setQuery(value);
  }, [value]);

  React.useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  const filtered = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      <input
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          onValueChange?.(next);
          setOpen(true);
        }}
        placeholder={placeholder}
        className={
          `h-10 w-full rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] bg-[var(--color-bg)] ` +
          `px-3 text-sm text-[var(--color-text)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30`
        }
      />
      {open ? (
        <div className="absolute left-0 top-full z-20 mt-1 max-h-56 w-full overflow-auto rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] bg-[var(--color-bg)] p-1">
          {filtered.length === 0 ? (
            <p className="px-2 py-2 text-sm text-[var(--color-text-subtle,var(--color-text))]">No results</p>
          ) : (
            filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                className="flex w-full rounded-[var(--radius-sm,0.375rem)] px-2 py-2 text-left text-sm text-[var(--color-text)]"
                onClick={() => {
                  setQuery(option.label);
                  onValueChange?.(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
