"use client";

import * as React from "react";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
}

export function Icon({ size = "md", className = "", ...props }: IconProps) {
  const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  return <span aria-hidden className={`inline-flex items-center justify-center ${sizeClass} ${className}`} {...props} />;
}
