"use client";

import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

export function Avatar({ src, alt = "Avatar", fallback, className = "", ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const showFallback = !src || imageError;

  return (
    <div
      className={
        `inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] ` +
        `bg-[var(--color-bg-subtle,var(--color-bg))] text-sm text-[var(--color-text)] ${className}`
      }
      {...props}
    >
      {showFallback ? fallback ?? alt.slice(0, 1).toUpperCase() : <img src={src} alt={alt} onError={() => setImageError(true)} className="h-full w-full object-cover" />}
    </div>
  );
}
