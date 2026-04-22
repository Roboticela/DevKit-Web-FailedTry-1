"use client";

import * as React from "react";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIds?: string[];
  multiple?: boolean;
  className?: string;
}

export function Accordion({ items, defaultOpenIds = [], multiple = false, className = "" }: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<string[]>(defaultOpenIds);

  const toggle = React.useCallback(
    (id: string) => {
      setOpenIds((current) => {
        const isOpen = current.includes(id);
        if (isOpen) return current.filter((item) => item !== id);
        if (!multiple) return [id];
        return [...current, id];
      });
    },
    [multiple]
  );

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => {
        const open = openIds.includes(item.id);
        return (
          <section key={item.id} className="overflow-hidden rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] bg-[var(--color-bg)]">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex h-11 w-full items-center justify-between px-3 text-left text-sm font-medium text-[var(--color-text)]"
              aria-expanded={open}
            >
              <span>{item.title}</span>
              <span aria-hidden>{open ? "-" : "+"}</span>
            </button>
            {open ? <div className="border-t border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text)]">{item.content}</div> : null}
          </section>
        );
      })}
    </div>
  );
}
