import * as React from "react";

export type AspectPreset = "video" | "square" | "photo" | "portrait" | "custom";

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  preset?: AspectPreset;
  ratio?: string;
}

/** Aspect-ratio box for media inside grid cells. */
export function AspectRatio({
  preset = "video",
  ratio,
  className = "",
  style,
  children,
  ...props
}: AspectRatioProps) {
  const presetClass =
    preset === "square"
      ? "dk-aspect-square"
      : preset === "photo"
        ? "dk-aspect-photo"
        : preset === "portrait"
          ? "dk-aspect-portrait"
          : preset === "video"
            ? "dk-aspect-video"
            : "";
  return (
    <div
      className={`dk-aspect ${presetClass} ${className}`.trim()}
      style={{ ...(ratio ? { ["--aspect-ratio" as string]: ratio } : null), ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
