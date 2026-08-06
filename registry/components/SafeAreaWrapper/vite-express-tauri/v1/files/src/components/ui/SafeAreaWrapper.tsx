"use client";

import * as React from "react";

export type SafeAreaWrapperProps = React.HTMLAttributes<HTMLDivElement>;

export function SafeAreaWrapper({ className = "", ...props }: SafeAreaWrapperProps) {
  return <div className={`px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] ${className}`} {...props} />;
}
