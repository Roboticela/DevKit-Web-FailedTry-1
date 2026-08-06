import * as React from "react";
import { Motion, type MotionProps } from "./Motion";

function wrap(preset: MotionProps["preset"], defaults?: Partial<MotionProps>) {
  const Comp = (props: Omit<MotionProps, "preset">) => (
    <Motion preset={preset} {...defaults} {...props} />
  );
  Comp.displayName = `Motion(${preset})`;
  return Comp;
}

export const FadeAnimation = wrap("fade");
export const ScaleAnimation = wrap("scale");
export const SlideAnimation = wrap("slide-up");
export const PageTransition = wrap("page");

export interface HoverAnimationProps extends React.HTMLAttributes<HTMLElement> {
  lift?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

export function HoverAnimation({
  lift = true,
  as = "div",
  className = "",
  children,
  ...props
}: HoverAnimationProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={`${lift ? "dk-hover-lift" : "dk-hover-scale"} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}

export interface PressAnimationProps extends React.HTMLAttributes<HTMLElement> {
  highlight?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

export function PressAnimation({
  highlight = false,
  as = "button",
  className = "",
  children,
  ...props
}: PressAnimationProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={`dk-press ${highlight ? "dk-press-highlight" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function RippleAlternative(props: PressAnimationProps) {
  return <PressAnimation highlight {...props} />;
}

export function LoadingTransition({
  loading,
  children,
  className = "",
}: {
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  if (loading) {
    return <span className={`dk-spinner ${className}`.trim()} role="status" aria-label="Loading" />;
  }
  return <>{children}</>;
}

export function SkeletonAnimation({
  variant = "text",
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "text" | "title" | "avatar" | "block";
}) {
  const v =
    variant === "title"
      ? "dk-skeleton-title"
      : variant === "avatar"
        ? "dk-skeleton-avatar"
        : variant === "block"
          ? ""
          : "dk-skeleton-text";
  return <div className={`dk-skeleton ${v} ${className}`.trim()} aria-hidden {...props} />;
}

export function DragAnimation({
  dragging = false,
  as = "div",
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  dragging?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={`dk-drag ${dragging ? "dk-drag-active" : ""} ${className}`.trim()}
      data-dragging={dragging ? "true" : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
