"use client";

import * as React from "react";

export type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function ModalHeader({ className = "", ...props }: ModalHeaderProps) {
  return <div className={`mb-3 border-b border-[var(--color-border)] pb-3 ${className}`} {...props} />;
}
