"use client";

import * as React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items, className = "", ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm text-[var(--color-text-subtle,var(--color-text))] ${className}`} {...props}>
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {item.href ? <a href={item.href} className="hover:text-[var(--color-text)]">{item.label}</a> : <span className="text-[var(--color-text)]">{item.label}</span>}
          {index < items.length - 1 ? <span aria-hidden>/</span> : null}
        </React.Fragment>
      ))}
    </nav>
  );
}
