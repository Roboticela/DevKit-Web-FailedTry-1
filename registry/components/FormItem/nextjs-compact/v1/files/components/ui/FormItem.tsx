"use client";

import * as React from "react";

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  horizontal?: boolean;
}

export function FormItem({ horizontal = false, className = "", ...props }: FormItemProps) {
  return <div className={`${horizontal ? "flex items-center gap-3" : "space-y-2"} ${className}`} {...props} />;
}
