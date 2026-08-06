import * as React from "react";
import { Icon, type IconProps, type IconStatus } from "./Icon";
import type { IconName } from "./icon-registry";

export type IconButtonTone = "ghost" | "filled" | "primary" | "danger";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: IconName | (string & {});
  label: string;
  /** Hide visible text but keep accessible label */
  iconOnly?: boolean;
  tone?: IconButtonTone;
  iconProps?: Omit<IconProps, "name" | "label">;
}

/** Interactive control with a meaningful icon (+ optional label). */
export function IconButton({
  name,
  label,
  iconOnly = true,
  tone = "ghost",
  iconProps,
  className = "",
  children,
  ...props
}: IconButtonProps) {
  const toneClass =
    tone === "filled"
      ? "dk-icon-button-filled"
      : tone === "primary"
        ? "dk-icon-button-primary"
        : tone === "danger"
          ? "dk-icon-button-danger"
          : "dk-icon-button-ghost";

  return (
    <button
      type="button"
      className={`dk-icon-button ${toneClass} ${className}`.trim()}
      aria-label={iconOnly ? label : undefined}
      title={label}
      {...props}
    >
      <Icon name={name} label={iconOnly ? undefined : label} {...iconProps} />
      {!iconOnly ? <span>{children ?? label}</span> : null}
    </button>
  );
}

export function AnimatedIcon({
  animation = "spin",
  ...props
}: IconProps & { animation?: "spin" | "pulse" }) {
  return <Icon {...props} spin={animation === "spin"} pulse={animation === "pulse"} />;
}

export function StatusIcon({
  status = "info",
  name,
  ...props
}: Omit<IconProps, "status" | "variant"> & { status?: IconStatus }) {
  const resolved =
    name ??
    (status === "success"
      ? "success"
      : status === "warning"
        ? "warning"
        : status === "danger"
          ? "error"
          : "info");
  return <Icon name={resolved} variant="status" status={status} {...props} />;
}

export function BrandIcon({
  name = "devkit",
  variant = "duotone",
  ...props
}: Omit<IconProps, "name"> & { name?: IconName | string }) {
  return <Icon name={name} variant={variant} {...props} />;
}

export function FileIcon({
  name = "file",
  ...props
}: Omit<IconProps, "name"> & { name?: IconName | string }) {
  return <Icon name={name} {...props} />;
}

export function SocialIcon(props: IconProps) {
  return <Icon {...props} />;
}

export function AiIcon({
  name = "sparkles",
  status = "ai",
  variant = "duotone",
  ...props
}: Omit<IconProps, "name"> & { name?: IconName | string }) {
  return <Icon name={name} status={status} variant={variant} {...props} />;
}

export function EmojiRenderer({
  emoji,
  label,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { emoji: string; label?: string }) {
  return (
    <span
      className={`dk-icon dk-icon-md ${className}`.trim()}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...props}
    >
      {emoji}
    </span>
  );
}

export function IconBadge({
  name,
  count,
  dot = false,
  ...iconProps
}: IconProps & { count?: number; dot?: boolean }) {
  return (
    <span className="dk-icon-badge">
      <Icon name={name} {...iconProps} />
      {dot && (count == null || count <= 0) ? <span className="dk-icon-badge-dot" /> : null}
      {count != null && count > 0 ? (
        <span className="dk-icon-badge-count">{count > 99 ? "99+" : count}</span>
      ) : null}
    </span>
  );
}
