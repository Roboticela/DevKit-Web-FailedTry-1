"use client";

import * as React from "react";

export type ModalBodyProps = React.HTMLAttributes<HTMLDivElement>;

export function ModalBody({ className = "", ...props }: ModalBodyProps) {
  return <div className={`py-1 ${className}`} {...props} />;
}
