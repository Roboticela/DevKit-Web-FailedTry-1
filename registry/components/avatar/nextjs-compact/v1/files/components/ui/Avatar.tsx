import * as React from "react";

/**
 * Avatar — person / entity representation.
 * Image, initials, or placeholder. Status and badge via slots/composition.
 * No gradients. No box-shadows.
 */

export type AvatarSize = 24 | 28 | 32 | 36 | 40 | 48 | 56 | 64;
export type AvatarShape = "circle" | "rounded" | "square";
export type AvatarStatus = "online" | "offline" | "away" | "busy" | "dnd" | "unknown";

export type AvatarProps = {
  /** Accessible name (person / entity). Required. */
  label: string;
  src?: string;
  alt?: string;
  /** Initials when no image. Max 2 characters recommended. */
  initials?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus | null;
  /** Compose Badge / IconButton overlays. */
  badge?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function StatusDot({ status }: { status: AvatarStatus }) {
  return (
    <span
      className={cx("dk-avatar__status", `dk-avatar__status--${status}`)}
      data-status={status}
      aria-hidden="true"
    />
  );
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    label,
    src,
    alt,
    initials,
    size = 40,
    shape = "circle",
    status = null,
    badge,
    disabled = false,
    className = "",
    id,
    onClick,
  },
  ref
) {
  const [failed, setFailed] = React.useState(false);
  const showImage = Boolean(src) && !failed;
  const letters =
    initials?.slice(0, 2).toUpperCase() ??
    label
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");

  const interactive = Boolean(onClick) && !disabled;

  return (
    <span
      ref={ref}
      id={id}
      className={cx(
        "dk-avatar",
        `dk-avatar--${shape}`,
        interactive && "dk-avatar--interactive",
        disabled && "dk-avatar--disabled",
        className
      )}
      style={{ ["--dk-avatar-size" as string]: `${size}px` }}
      role={interactive ? "button" : "img"}
      aria-label={status ? `${label}, ${status}` : label}
      tabIndex={interactive ? 0 : undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
              }
            }
          : undefined
      }
    >
      <span className="dk-avatar__face">
        {showImage ? (
          <img
            className="dk-avatar__image"
            src={src}
            alt={alt ?? ""}
            onError={() => setFailed(true)}
          />
        ) : letters ? (
          <span className="dk-avatar__initials" aria-hidden="true">
            {letters}
          </span>
        ) : (
          <span className="dk-avatar__placeholder" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none">
              <circle cx="12" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M5.5 18.25c1.6-2.4 3.8-3.5 6.5-3.5s4.9 1.1 6.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </span>
      {status ? <StatusDot status={status} /> : null}
      {badge ? <span className="dk-avatar__badge">{badge}</span> : null}
    </span>
  );
});

Avatar.displayName = "Avatar";

export const AvatarStatus = StatusDot;
export default Avatar;
