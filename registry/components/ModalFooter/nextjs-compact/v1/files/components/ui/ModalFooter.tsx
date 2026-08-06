"use client";

import * as React from "react";

export type ModalFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function ModalFooter({ className = "", ...props }: ModalFooterProps) {
  return <div className={`mt-4 flex items-center justify-end gap-2 border-t border-[var(--color-border)] pt-3 ${className}`} {...props} />;
}
