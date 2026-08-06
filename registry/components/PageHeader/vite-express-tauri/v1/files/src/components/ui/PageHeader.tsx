"use client";

import * as React from "react";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions, className = "", children, ...props }: PageHeaderProps) {
  return (
    <header className={`space-y-2 border-b border-[var(--color-border)] pb-3 ${className}`} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div>
          {title ? <h1 className="text-xl font-semibold text-[var(--color-text)]">{title}</h1> : null}
          {subtitle ? <p className="text-sm text-[var(--color-text-subtle,var(--color-text))]">{subtitle}</p> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {children}
    </header>
  );
}
