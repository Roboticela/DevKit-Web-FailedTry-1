"use client";

import * as React from "react";

export interface ContextMenuItem {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  className?: string;
}

export function ContextMenu({ items, children, className = "" }: ContextMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div
      className={className}
      onContextMenu={(event) => {
        event.preventDefault();
        setPosition({ x: event.clientX, y: event.clientY });
        setOpen(true);
      }}
    >
      {children}
      {open ? (
        <div style={{ left: position.x, top: position.y }} className="fixed z-50 min-w-40 rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] bg-[var(--color-bg)] p-1">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;
                item.onSelect();
                setOpen(false);
              }}
              className="flex w-full rounded-[var(--radius-sm,0.375rem)] px-3 py-2 text-left text-sm text-[var(--color-text)] disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
