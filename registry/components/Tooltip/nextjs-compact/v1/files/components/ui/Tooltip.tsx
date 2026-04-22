"use client";

import * as React from "react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom";
  delayMs?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  delayMs = 120,
  className = "",
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<number | null>(null);

  const onEnter = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delayMs);
  };

  const onLeave = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setOpen(false);
  };

  React.useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <span className={`relative inline-flex ${className}`} onMouseEnter={onEnter} onMouseLeave={onLeave} onFocus={onEnter} onBlur={onLeave}>
      {children}
      {open ? (
        <span
          role="tooltip"
          className={
            `pointer-events-none absolute left-1/2 z-40 -translate-x-1/2 rounded-[var(--radius-sm,0.375rem)] border ` +
            `border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-xs text-[var(--color-text)] ` +
            `${side === "top" ? "bottom-full mb-2" : "top-full mt-2"}`
          }
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
