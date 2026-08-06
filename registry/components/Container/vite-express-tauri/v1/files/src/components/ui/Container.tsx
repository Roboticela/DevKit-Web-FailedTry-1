"use client";

import * as React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function Container({ maxWidth = "xl", className = "", ...props }: ContainerProps) {
  const widthClass =
    maxWidth === "sm"
      ? "max-w-xl"
      : maxWidth === "md"
        ? "max-w-3xl"
        : maxWidth === "lg"
          ? "max-w-5xl"
          : maxWidth === "2xl"
            ? "max-w-7xl"
            : maxWidth === "full"
              ? "max-w-full"
              : "max-w-6xl";

  return <div className={`mx-auto w-full px-4 sm:px-6 ${widthClass} ${className}`} {...props} />;
}
