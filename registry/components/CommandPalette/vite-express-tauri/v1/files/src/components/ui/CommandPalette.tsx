"use client";

import * as React from "react";

export interface CommandItem {
  id: string;
  label: string;
  keywords?: string[];
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  commands: CommandItem[];
  placeholder?: string;
  emptyLabel?: string;
  className?: string;
}

export function CommandPalette({
  open,
  onOpenChange,
  commands,
  placeholder = "Search commands...",
  emptyLabel = "No commands found",
  className = "",
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  if (!open) return null;

  const normalized = query.trim().toLowerCase();
  const filtered = commands.filter((command) => {
    if (!normalized) return true;
    if (command.label.toLowerCase().includes(normalized)) return true;
    return (command.keywords ?? []).some((keyword) => keyword.toLowerCase().includes(normalized));
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-20">
      <button type="button" aria-label="Close command palette" className="absolute inset-0 bg-black/30" onClick={() => onOpenChange(false)} />
      <div
        role="dialog"
        aria-modal="true"
        className={
          `relative z-10 w-full max-w-xl rounded-[var(--radius-lg,1rem)] border border-[var(--color-border)] ` +
          `bg-[var(--color-bg)] text-[var(--color-text)] ${className}`
        }
      >
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="h-11 w-full border-b border-[var(--color-border)] bg-transparent px-3 text-sm outline-none"
        />
        <div className="max-h-72 overflow-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-2 py-3 text-sm text-[var(--color-text-subtle,var(--color-text))]">{emptyLabel}</p>
          ) : (
            filtered.map((command) => (
              <button
                key={command.id}
                type="button"
                onClick={() => {
                  command.onSelect();
                  onOpenChange(false);
                }}
                className="flex w-full items-center rounded-[var(--radius-sm,0.375rem)] px-3 py-2 text-left text-sm"
              >
                {command.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
