import * as React from "react";

/**
 * Avatar — person, organization, object, or identity.
 * Fallback chain: image → initials → generic identity icon (deterministic).
 * Presence is not color-only. Decorative avatars can be hidden from AT.
 */

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type AvatarEntity = "person" | "organization" | "generic";

export type AvatarPresence =
  | "online"
  | "offline"
  | "busy"
  | "away"
  | "unknown";

export type AvatarShape = "circle" | "rounded" | "square";

export type AvatarProps = {
  size?: AvatarSize;
  /** Identity kind — influences default shape and fallback glyph. */
  entity?: AvatarEntity;
  /** Override shape. Defaults: person→circle, organization→rounded, generic→rounded. */
  shape?: AvatarShape;
  /** Image URL. On error, falls through to initials / icon. */
  src?: string;
  alt?: string;
  /**
   * Display name for initials and accessible naming.
   * Supports localized / single-token / multi-token names — not first+last only.
   */
  name?: string;
  /** Explicit initials override (already localized by host). */
  initials?: string;
  /** Custom icon when no image/initials (or as forced fallback). */
  icon?: React.ReactNode;
  /**
   * Force a step in the fallback chain.
   * Default resolves: image (if src loads) → initials → icon.
   */
  prefer?: "image" | "initials" | "icon";
  presence?: AvatarPresence;
  /** Accessible label for presence. Defaults are English — localize in host apps. */
  presenceLabel?: string;
  /** Optional status mark (badge, verified, etc.) — must not rely on color alone. */
  status?: React.ReactNode;
  statusLabel?: string;
  /**
   * Decorative — hide from assistive technology.
   * When false (default), exposes an accessible name from alt / name.
   */
  decorative?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  href?: string;
};

const PRESENCE_LABELS: Record<AvatarPresence, string> = {
  online: "Online",
  offline: "Offline",
  busy: "Busy",
  away: "Away",
  unknown: "Status unknown",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function defaultShape(entity: AvatarEntity): AvatarShape {
  if (entity === "person") return "circle";
  return "rounded";
}

/**
 * Deterministic initials from a display name.
 * - Uses up to 2 grapheme-aware-ish characters (UTF-16 code points / surrogate pairs via Array.from)
 * - Single token → first character(s) (2 if Latin letter pair useful, else 1 for CJK-like)
 * - Multiple tokens → first char of first + first char of last meaningful token
 * - Ignores empty / punctuation-only segments
 */
export function getAvatarInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";

  const parts = trimmed
    .split(/[\s\u00A0\u2000-\u200B\u202F\u205F\u3000]+/u)
    .map((p) => p.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ""))
    .filter(Boolean);

  if (parts.length === 0) {
    const chars = Array.from(trimmed);
    return (chars[0] ?? "").toLocaleUpperCase();
  }

  if (parts.length === 1) {
    const chars = Array.from(parts[0]);
    if (chars.length === 0) return "";
    // Prefer two Latin letters when the token is a single Latin word; one char for others
    const isLatinWord = /^[\p{Script=Latin}]+$/u.test(parts[0]);
    if (isLatinWord && chars.length >= 2) {
      return (chars[0] + chars[1]).toLocaleUpperCase();
    }
    return chars[0].toLocaleUpperCase();
  }

  const first = Array.from(parts[0])[0] ?? "";
  const last = Array.from(parts[parts.length - 1])[0] ?? "";
  return (first + last).toLocaleUpperCase();
}

function PersonGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 18.5c1.6-3 4-4.5 6.5-4.5s4.9 1.5 6.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OrganizationGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
      <path
        d="M4.5 19.5V7.5L12 4.5l7.5 3v12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 19.5v-5h6v5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 10h.01M12 10h.01M15 10h.01M9 13h.01M12 13h.01M15 13h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GenericGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" />
    </svg>
  );
}

function PresenceMark({
  presence,
  label,
}: {
  presence: AvatarPresence;
  label: string;
}) {
  return (
    <span
      className={cx(
        "dk-avatar__presence",
        `dk-avatar__presence--${presence}`
      )}
      role="img"
      aria-label={label}
      title={label}
    >
      <span className="dk-avatar__presence-glyph" aria-hidden="true">
        {presence === "online" ? "●" : null}
        {presence === "offline" ? "○" : null}
        {presence === "busy" ? "■" : null}
        {presence === "away" ? "◐" : null}
        {presence === "unknown" ? "?" : null}
      </span>
    </span>
  );
}

export const Avatar = React.forwardRef<HTMLElement, AvatarProps>(
  function Avatar(
    {
      size = "md",
      entity = "person",
      shape: shapeProp,
      src,
      alt,
      name,
      initials: initialsProp,
      icon,
      prefer,
      presence,
      presenceLabel,
      status,
      statusLabel,
      decorative = false,
      className = "",
      id,
      "aria-label": ariaLabel,
      onClick,
      href,
    },
    forwardedRef
  ) {
    const shape = shapeProp ?? defaultShape(entity);
    const [imageFailed, setImageFailed] = React.useState(false);

    React.useEffect(() => {
      setImageFailed(false);
    }, [src]);

    const resolvedInitials =
      initialsProp?.trim() ||
      (name ? getAvatarInitials(name) : "");

    const showImage =
      prefer !== "initials" &&
      prefer !== "icon" &&
      Boolean(src) &&
      !imageFailed;

    const showInitials =
      !showImage &&
      prefer !== "icon" &&
      resolvedInitials.length > 0;

    const showIcon = !showImage && !showInitials;

    const defaultIcon =
      entity === "organization" ? (
        <OrganizationGlyph />
      ) : entity === "generic" ? (
        <GenericGlyph />
      ) : (
        <PersonGlyph />
      );

    const accessibleName =
      ariaLabel ||
      alt ||
      name ||
      (decorative ? undefined : "Avatar");

    const presenceText =
      presence != null
        ? presenceLabel ?? PRESENCE_LABELS[presence]
        : undefined;

    const classNames = cx(
      "dk-avatar",
      `dk-avatar--${size}`,
      `dk-avatar--${shape}`,
      `dk-avatar--${entity}`,
      (onClick || href) && "dk-avatar--interactive",
      className
    );

    const content = (
      <>
        <span className="dk-avatar__surface" aria-hidden={decorative || undefined}>
          {showImage ? (
            <img
              className="dk-avatar__image"
              src={src}
              alt=""
              draggable={false}
              onError={() => setImageFailed(true)}
            />
          ) : null}
          {showInitials ? (
            <span className="dk-avatar__initials">{resolvedInitials}</span>
          ) : null}
          {showIcon ? (
            <span className="dk-avatar__icon">{icon ?? defaultIcon}</span>
          ) : null}
        </span>

        {presence != null ? (
          <PresenceMark presence={presence} label={presenceText!} />
        ) : null}

        {status != null ? (
          <span
            className="dk-avatar__status"
            role={statusLabel ? "img" : undefined}
            aria-label={statusLabel}
            title={statusLabel}
          >
            {status}
          </span>
        ) : null}
      </>
    );

    const a11y = decorative
      ? { "aria-hidden": true as const }
      : {
          "aria-label":
            presenceText && accessibleName
              ? `${accessibleName}, ${presenceText}`
              : accessibleName,
          role: onClick || href ? undefined : ("img" as const),
        };

    if (href && !decorative) {
      return (
        <a
          ref={forwardedRef as React.Ref<HTMLAnchorElement>}
          id={id}
          href={href}
          className={classNames}
          {...a11y}
        >
          {content}
        </a>
      );
    }

    if (onClick) {
      return (
        <button
          ref={forwardedRef as React.Ref<HTMLButtonElement>}
          type="button"
          id={id}
          className={classNames}
          {...a11y}
          onClick={onClick}
        >
          {content}
        </button>
      );
    }

    return (
      <span
        ref={forwardedRef as React.Ref<HTMLSpanElement>}
        id={id}
        className={classNames}
        {...a11y}
      >
        {content}
      </span>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
