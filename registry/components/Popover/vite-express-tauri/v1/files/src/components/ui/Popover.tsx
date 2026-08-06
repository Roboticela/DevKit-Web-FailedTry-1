"use client";

import * as React from "react";

export interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (next: boolean) => void;
  closeOnOutsideClick?: boolean;
  className?: string;
  contentClassName?: string;
}

export function Popover({
  trigger,
  content,
  defaultOpen = false,
  open,
  onOpenChange,
  closeOnOutsideClick = true,
  className = "",
  contentClassName = "",
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const isControlled = typeof open === "boolean";
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  React.useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!closeOnOutsideClick || !rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [closeOnOutsideClick, isOpen, setOpen]);

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setOpen(!isOpen)}>{trigger}</div>
      {isOpen ? (
        <div
          role="dialog"
          className={
            `absolute left-0 top-full z-30 mt-2 min-w-48 rounded-[var(--radius-md,0.625rem)] border ` +
            `border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-[var(--color-text)] ${contentClassName}`
          }
        >
          {content}
        </div>
      ) : null}
    </div>
  );
}
