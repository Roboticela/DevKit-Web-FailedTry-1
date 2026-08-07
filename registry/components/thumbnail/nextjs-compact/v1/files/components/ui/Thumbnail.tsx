import * as React from "react";

/**
 * Thumbnail — compact representation of larger visual content.
 * Preserves recognizable content. Cover for photos; contain for documents/full visibility.
 * Sparse overlays — do not overload small surfaces. Sizes use global tokens.
 */

export type ThumbnailSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ThumbnailAspect = "square" | "portrait" | "landscape" | "custom";

export type ThumbnailFit = "cover" | "contain";

export type ThumbnailKind =
  | "image"
  | "video"
  | "document"
  | "file"
  | "generic";

export type ThumbnailProps = {
  src?: string;
  alt?: string;
  /** Decorative preview inside a named parent control. */
  decorative?: boolean;
  size?: ThumbnailSize;
  /**
   * Preset aspect. Default `square`.
   * Use `custom` with `aspectRatio` for free ratios.
   */
  aspect?: ThumbnailAspect;
  /** CSS aspect-ratio when `aspect="custom"`, e.g. `"16 / 9"`. */
  aspectRatio?: string;
  /**
   * Default: `cover` for image/video; `contain` for document/file/generic.
   */
  objectFit?: ThumbnailFit;
  objectPosition?: string;
  kind?: ThumbnailKind;
  selected?: boolean;
  loading?: boolean;
  error?: boolean;
  disabled?: boolean;
  /**
   * Whole-thumbnail interactivity. Renders button (or link when `href`).
   * Provides focus + keyboard (Enter/Space).
   */
  interactive?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  onActivate?: (event: React.SyntheticEvent) => void;
  /** Play affordance for video — keep alone or with one other indicator. */
  showPlay?: boolean;
  playLabel?: string;
  /** Selection checkmark overlay (pairs with `selected`). */
  showSelection?: boolean;
  /** Status chip / dot — keep copy short. */
  status?: React.ReactNode;
  /** File type label, e.g. PDF — one short token. */
  fileType?: React.ReactNode;
  /** Duration for video, e.g. 3:42. */
  duration?: React.ReactNode;
  /** Custom fallback when no src / error. */
  fallback?: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

const ASPECT_RATIO: Record<Exclude<ThumbnailAspect, "custom">, string> = {
  square: "1",
  portrait: "3 / 4",
  landscape: "4 / 3",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function defaultFit(kind: ThumbnailKind, fit?: ThumbnailFit): ThumbnailFit {
  if (fit) return fit;
  if (kind === "document" || kind === "file" || kind === "generic") {
    return "contain";
  }
  return "cover";
}

function KindGlyph({ kind }: { kind: ThumbnailKind }) {
  const common = {
    viewBox: "0 0 24 24",
    width: "1.25em",
    height: "1.25em",
    fill: "none" as const,
    "aria-hidden": true as const,
  };
  if (kind === "video") {
    return (
      <svg {...common}>
        <rect x="3.5" y="6.5" width="17" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 9.5v5l4.5-2.5L10 9.5z" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "document") {
    return (
      <svg {...common}>
        <path
          d="M7 3.5h7l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M14 3.5V8h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "file") {
    return (
      <svg {...common}>
        <path
          d="M6.5 4.5h8l3 3V19a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5 19V6A1.5 1.5 0 0 1 6.5 4.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "generic") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <path d="M4 16l4.5-4.5L12 15l3-3 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.85" />
      <path d="M10 8.5v7l6-3.5-6-3.5z" fill="var(--color-surface-primary, #fff)" />
    </svg>
  );
}

export const Thumbnail = React.forwardRef<HTMLElement, ThumbnailProps>(
  function Thumbnail(
    {
      src,
      alt = "",
      decorative = false,
      size = "md",
      aspect = "square",
      aspectRatio: aspectRatioProp,
      objectFit: objectFitProp,
      objectPosition = "center",
      kind = "image",
      selected = false,
      loading = false,
      error: errorProp = false,
      disabled = false,
      interactive = false,
      href,
      target,
      rel,
      onActivate,
      showPlay = false,
      playLabel = "Play",
      showSelection = false,
      status,
      fileType,
      duration,
      fallback,
      className = "",
      id,
      "aria-label": ariaLabel,
    },
    forwardedRef
  ) {
    const [imgError, setImgError] = React.useState(false);
    React.useEffect(() => {
      setImgError(false);
    }, [src]);

    const failed = errorProp || imgError || !src;
    const objectFit = defaultFit(kind, objectFitProp);
    const ratio =
      aspect === "custom"
        ? aspectRatioProp ?? "1"
        : ASPECT_RATIO[aspect];

    const isInteractive =
      !disabled && (interactive || href != null || onActivate != null);
    const isLink = Boolean(href) && isInteractive;

    const overlayCount =
      (showPlay ? 1 : 0) +
      (showSelection || selected ? 1 : 0) +
      (status != null ? 1 : 0) +
      (fileType != null ? 1 : 0) +
      (duration != null ? 1 : 0);

    const label =
      ariaLabel ||
      (decorative ? undefined : alt) ||
      (showPlay ? playLabel : undefined) ||
      (kind !== "image" ? kind : undefined);

    const activate = (event: React.SyntheticEvent) => {
      if (disabled) return;
      onActivate?.(event);
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
      if (!isInteractive || isLink) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate(event);
      }
    };

    const media = !failed && src ? (
      <img
        className="dk-thumbnail__img"
        src={src}
        alt={decorative || isInteractive ? "" : alt}
        draggable={false}
        loading="lazy"
        decoding="async"
        onError={() => setImgError(true)}
        style={{
          objectFit,
          objectPosition,
        }}
      />
    ) : (
      <span className="dk-thumbnail__fallback" aria-hidden="true">
        {fallback ?? <KindGlyph kind={kind} />}
      </span>
    );

    const overlays = (
      <>
        {loading ? (
          <span className="dk-thumbnail__loading" aria-hidden="true" />
        ) : null}

        {showPlay ? (
          <span className="dk-thumbnail__play" aria-hidden="true">
            <PlayGlyph />
          </span>
        ) : null}

        {showSelection || selected ? (
          <span
            className={cx(
              "dk-thumbnail__selection",
              selected && "dk-thumbnail__selection--on"
            )}
            aria-hidden="true"
          >
            {selected ? (
              <svg viewBox="0 0 16 16" width="10" height="10" fill="none">
                <path
                  d="M3.5 8.5l3 3 6-6"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </span>
        ) : null}

        {status != null ? (
          <span className="dk-thumbnail__status">{status}</span>
        ) : null}

        {fileType != null ? (
          <span className="dk-thumbnail__filetype">{fileType}</span>
        ) : null}

        {duration != null ? (
          <span className="dk-thumbnail__duration">{duration}</span>
        ) : null}
      </>
    );

    const classNames = cx(
      "dk-thumbnail",
      `dk-thumbnail--${size}`,
      `dk-thumbnail--${aspect}`,
      `dk-thumbnail--${kind}`,
      `dk-thumbnail--fit-${objectFit}`,
      selected && "dk-thumbnail--selected",
      loading && "dk-thumbnail--loading",
      failed && "dk-thumbnail--error",
      disabled && "dk-thumbnail--disabled",
      isInteractive && "dk-thumbnail--interactive",
      overlayCount > 2 && "dk-thumbnail--busy",
      className
    );

    const style: React.CSSProperties = {
      aspectRatio: ratio,
    };

    const body = (
      <>
        <span className="dk-thumbnail__surface">{media}</span>
        {overlays}
      </>
    );

    if (isLink) {
      const linkRel =
        rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);
      return (
        <a
          ref={forwardedRef as React.Ref<HTMLAnchorElement>}
          id={id}
          href={href}
          target={target}
          rel={linkRel}
          className={classNames}
          style={style}
          aria-label={label}
          aria-disabled={disabled || undefined}
          aria-pressed={selected || undefined}
          data-overlay-count={overlayCount}
          onClick={activate}
        >
          {body}
        </a>
      );
    }

    if (isInteractive) {
      return (
        <button
          ref={forwardedRef as React.Ref<HTMLButtonElement>}
          type="button"
          id={id}
          className={classNames}
          style={style}
          aria-label={label}
          aria-pressed={selected || undefined}
          disabled={disabled}
          data-overlay-count={overlayCount}
          onClick={activate}
          onKeyDown={onKeyDown}
        >
          {body}
        </button>
      );
    }

    return (
      <span
        ref={forwardedRef as React.Ref<HTMLSpanElement>}
        id={id}
        className={classNames}
        style={style}
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : label}
        aria-hidden={decorative || undefined}
        data-overlay-count={overlayCount}
      >
        {body}
      </span>
    );
  }
);

Thumbnail.displayName = "Thumbnail";

export default Thumbnail;
