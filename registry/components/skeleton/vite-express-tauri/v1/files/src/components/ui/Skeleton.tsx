import * as React from "react";

/**
 * Structural shapes that approximate expected content — not generic slabs.
 */
export type SkeletonShape =
  | "text"
  | "title"
  | "avatar"
  | "thumbnail"
  | "rectangle"
  | "circle";

export type SkeletonSize = "sm" | "md" | "lg";

export interface SkeletonProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Content geometry to approximate. Default: `text`. */
  shape?: SkeletonShape;
  size?: SkeletonSize;
  /**
   * Explicit width (CSS length or number → px). Prefer matching final content.
   */
  width?: number | string;
  /** Explicit height (CSS length or number → px). */
  height?: number | string;
  /**
   * Subtle activity cue via opacity pulse (not a bright shimmer).
   * Default: true. Forced off under `prefers-reduced-motion`.
   */
  animated?: boolean;
  /**
   * For `text` / `title`: number of stacked lines with staggered widths.
   * Default: 1.
   */
  lines?: number;
  /** Accessible name when this skeleton is the sole loading affordance. */
  label?: string;
}

export interface SkeletonGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Grouped placeholder composition. */
  children: React.ReactNode;
  /** Accessible status for the loading region. Default: `Loading`. */
  label?: string;
  gap?: "sm" | "md" | "lg";
  orientation?: "vertical" | "horizontal";
}

const SHAPE_CLASS: Record<SkeletonShape, string> = {
  text: "dk-skeleton--text",
  title: "dk-skeleton--title",
  avatar: "dk-skeleton--avatar",
  thumbnail: "dk-skeleton--thumbnail",
  rectangle: "dk-skeleton--rectangle",
  circle: "dk-skeleton--circle",
};

const SIZE_CLASS: Record<SkeletonSize, string> = {
  sm: "dk-skeleton--sm",
  md: "dk-skeleton--md",
  lg: "dk-skeleton--lg",
};

const LINE_WIDTHS = ["100%", "92%", "78%", "88%", "64%"] as const;

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toCssSize(value: number | string | undefined): string | undefined {
  if (value == null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

/**
 * Skeleton (ID 049) — structural placeholder for content that is expected to load.
 *
 * Not for empty, error, or completed states. Not interactive.
 * Prefer calm opacity pulse over bright shimmer; static under reduced motion.
 */
export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(
  function Skeleton(
    {
      shape = "text",
      size = "md",
      width,
      height,
      animated = true,
      lines = 1,
      label,
      className,
      style,
      id: idProp,
      ...rest
    },
    ref
  ) {
    const reactId = React.useId();
    const rootId = idProp ?? `dk-skeleton-${reactId}`;
    const lineCount = Math.max(1, Math.min(8, Math.floor(lines)));
    const isLineShape = shape === "text" || shape === "title";

    const baseStyle: React.CSSProperties = {
      ...style,
      width: toCssSize(width) ?? style?.width,
      height: toCssSize(height) ?? style?.height,
    };

    if (isLineShape && lineCount > 1) {
      return (
        <span
          {...rest}
          ref={ref}
          id={rootId}
          className={cx(
            "dk-skeleton-stack",
            SIZE_CLASS[size],
            animated && "dk-skeleton-stack--animated",
            className
          )}
          style={style}
          role="presentation"
          aria-hidden={label ? undefined : true}
          aria-label={label}
          data-shape={shape}
          data-size={size}
        >
          {Array.from({ length: lineCount }, (_, index) => (
            <span
              key={index}
              className={cx(
                "dk-skeleton",
                SHAPE_CLASS[shape],
                SIZE_CLASS[size],
                animated && "dk-skeleton--animated"
              )}
              style={{
                width:
                  index === lineCount - 1
                    ? LINE_WIDTHS[index % LINE_WIDTHS.length]
                    : LINE_WIDTHS[index % LINE_WIDTHS.length],
              }}
              aria-hidden="true"
            />
          ))}
          {label ? <span className="dk-sr-only">{label}</span> : null}
        </span>
      );
    }

    return (
      <span
        {...rest}
        ref={ref}
        id={rootId}
        className={cx(
          "dk-skeleton",
          SHAPE_CLASS[shape],
          SIZE_CLASS[size],
          animated && "dk-skeleton--animated",
          className
        )}
        style={baseStyle}
        role="presentation"
        aria-hidden={label ? undefined : true}
        aria-label={label}
        data-shape={shape}
        data-size={size}
        data-animated={animated || undefined}
      >
        {label ? <span className="dk-sr-only">{label}</span> : null}
      </span>
    );
  }
);

Skeleton.displayName = "Skeleton";

/**
 * Groups related skeleton shapes into one loading composition.
 * Set `aria-busy` on a parent content region when replacing live content.
 */
export const SkeletonGroup = React.forwardRef<
  HTMLDivElement,
  SkeletonGroupProps
>(function SkeletonGroup(
  {
    children,
    label = "Loading",
    gap = "md",
    orientation = "vertical",
    className,
    id: idProp,
    ...rest
  },
  ref
) {
  const reactId = React.useId();
  const rootId = idProp ?? `dk-skeleton-group-${reactId}`;

  return (
    <div
      {...rest}
      ref={ref}
      id={rootId}
      className={cx(
        "dk-skeleton-group",
        `dk-skeleton-group--${orientation}`,
        `dk-skeleton-group--gap-${gap}`,
        className
      )}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
      data-orientation={orientation}
    >
      {children}
    </div>
  );
});

SkeletonGroup.displayName = "SkeletonGroup";

export default Skeleton;
