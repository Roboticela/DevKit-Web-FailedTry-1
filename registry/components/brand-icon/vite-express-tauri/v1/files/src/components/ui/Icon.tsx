import * as React from "react";
import {
  getIcon,
  ICON_STROKE_ATTRS,
  type IconName,
  type IconVariant,
} from "./icon-registry";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
export type IconStatus = "success" | "warning" | "danger" | "info" | "ai" | "neutral";

export interface IconProps extends Omit<React.SVGAttributes<SVGSVGElement>, "name"> {
  name: IconName | (string & {});
  variant?: IconVariant;
  size?: IconSize;
  /** Accessible name — sets aria-label; omit for decorative (aria-hidden) */
  label?: string;
  status?: IconStatus;
  muted?: boolean;
  spin?: boolean;
  pulse?: boolean;
  className?: string;
}

/**
 * Icon — consistent 24×24 geometry, themed via currentColor.
 * Prefer semantic `name` from the registry; use `label` for interactive meaning.
 */
export function Icon({
  name,
  variant = "outlined",
  size = "md",
  label,
  status,
  muted = false,
  spin = false,
  pulse = false,
  className = "",
  ...svgProps
}: IconProps) {
  const def = getIcon(name);
  const title = label ?? def?.label;
  const decorative = !label && !svgProps["aria-label"];

  const draw: IconVariant = variant === "status" ? "outlined" : variant;

  const classes = [
    "dk-icon",
    `dk-icon-${size}`,
    "dk-icon-text",
    draw === "duotone" ? "dk-icon-duotone" : "",
    status ? `dk-icon-status-${status}` : "",
    variant === "status" && !status ? "dk-icon-status-info" : "",
    muted ? "dk-icon-muted" : "",
    spin ? "dk-icon-spin" : "",
    pulse ? "dk-icon-pulse" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!def) {
    return (
      <span
        className={classes}
        role="img"
        aria-label={title ?? String(name)}
        data-missing-icon={name}
      />
    );
  }

  return (
    <span
      className={classes}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" focusable="false" {...svgProps}>
        {draw === "duotone" && def.duotone ? (
          <path className="dk-icon-fill" d={def.duotone} fill="currentColor" stroke="none" />
        ) : null}
        {draw === "filled" ? (
          <path d={def.filled ?? def.outlined} fill="currentColor" stroke="none" />
        ) : (
          <path d={def.outlined} {...ICON_STROKE_ATTRS} />
        )}
      </svg>
    </span>
  );
}

export interface IconLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: IconName | (string & {});
  children: React.ReactNode;
  iconProps?: Omit<IconProps, "name">;
}

/** Icon + text with optical alignment. */
export function IconLabel({ icon, children, iconProps, className = "", ...props }: IconLabelProps) {
  return (
    <span className={`dk-icon-label ${className}`.trim()} {...props}>
      <Icon name={icon} {...iconProps} />
      <span>{children}</span>
    </span>
  );
}

export {
  ICON_REGISTRY,
  ICON_CATEGORIES,
  searchIcons,
  getIcon,
  iconsByCategory,
  type IconDefinition,
  type IconCategory,
  type IconName,
  type IconVariant,
} from "./icon-registry";
