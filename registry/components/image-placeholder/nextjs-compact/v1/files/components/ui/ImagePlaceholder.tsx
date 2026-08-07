import * as React from "react";

/**
 * Image Placeholder — media region where an image is unavailable or not yet available.
 * Not Skeleton (content-shape loading). Reserves aspect ratio to avoid layout shift.
 * Neutral by default — do not look like a system error unless state is `error`.
 */

export type ImagePlaceholderState =
  | "loading"
  | "missing"
  | "unavailable"
  | "error";

export type ImagePlaceholderAspect =
  | "square"
  | "portrait"
  | "landscape"
  | "wide"
  | "custom";

/**
 * Optional media-type hint for the glyph / label — not a full preview.
 */
export type ImagePlaceholderMediaType =
  | "image"
  | "photo"
  | "video"
  | "document"
  | "generic";

export type ImagePlaceholderRadius = "none" | "sm" | "md";

export type ImagePlaceholderProps = {
  /**
   * Placeholder condition. Default `missing`.
   * `error` is the only state that should read as a problem.
   */
  state?: ImagePlaceholderState;
  aspect?: ImagePlaceholderAspect;
  /** CSS aspect-ratio when `aspect="custom"`, e.g. `"16 / 9"`. */
  aspectRatio?: string;
  /**
   * Optional media-type hint. Affects default icon and optional type label.
   */
  mediaType?: ImagePlaceholderMediaType;
  /** Show a generic / type-appropriate icon. Default true. */
  showIcon?: boolean;
  /** Custom icon. Overrides the default glyph. */
  icon?: React.ReactNode;
  /** Short type label, e.g. PNG, JPG. Keep brief. */
  typeLabel?: React.ReactNode;
  /**
   * Short message. Do not place large error copy in small placeholders.
   * Prefer one short phrase.
   */
  message?: React.ReactNode;
  /**
   * Accessible name. Defaults from state when omitted.
   * Decorative placeholders may set `decorative`.
   */
  label?: string;
  decorative?: boolean;
  radius?: ImagePlaceholderRadius;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
};

const ASPECT_RATIO: Record<Exclude<ImagePlaceholderAspect, "custom">, string> = {
  square: "1",
  portrait: "3 / 4",
  landscape: "4 / 3",
  wide: "16 / 9",
};

const STATE_LABEL: Record<ImagePlaceholderState, string> = {
  loading: "Image loading",
  missing: "Image missing",
  unavailable: "Image unavailable",
  error: "Image failed to load",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function PlaceholderGlyph({
  mediaType,
}: {
  mediaType: ImagePlaceholderMediaType;
}) {
  const common = {
    viewBox: "0 0 24 24",
    width: "1.5rem",
    height: "1.5rem",
    fill: "none" as const,
    "aria-hidden": true as const,
  };

  if (mediaType === "video") {
    return (
      <svg {...common}>
        <rect
          x="3.5"
          y="6.5"
          width="17"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M10 9.5v5l4.5-2.5L10 9.5z" fill="currentColor" />
      </svg>
    );
  }

  if (mediaType === "document") {
    return (
      <svg {...common}>
        <path
          d="M7 3.5h7l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M14 3.5V8h4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  /* image / photo / generic */
  return (
    <svg {...common}>
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <path
        d="M4 16l4.5-4.5L12 15l3-3 4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const ImagePlaceholder = React.forwardRef<
  HTMLDivElement,
  ImagePlaceholderProps
>(function ImagePlaceholder(
  {
    state = "missing",
    aspect = "landscape",
    aspectRatio: aspectRatioProp,
    mediaType = "image",
    showIcon = true,
    icon,
    typeLabel,
    message,
    label,
    decorative = false,
    radius = "sm",
    className = "",
    id,
    style,
    "aria-label": ariaLabel,
  },
  forwardedRef
) {
  const ratio =
    aspect === "custom"
      ? aspectRatioProp ?? ASPECT_RATIO.landscape
      : aspectRatioProp ?? ASPECT_RATIO[aspect];

  const accessibleName =
    ariaLabel ?? label ?? (decorative ? undefined : STATE_LABEL[state]);

  const frameStyle: React.CSSProperties = {
    aspectRatio: ratio,
    ...style,
  };

  const hasCopy = typeLabel != null || message != null;

  return (
    <div
      ref={forwardedRef}
      id={id}
      className={cx(
        "dk-image-placeholder",
        `dk-image-placeholder--${state}`,
        `dk-image-placeholder--${aspect}`,
        `dk-image-placeholder--radius-${radius}`,
        `dk-image-placeholder--media-${mediaType}`,
        className
      )}
      style={frameStyle}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : accessibleName}
      aria-busy={state === "loading" || undefined}
    >
      <span className="dk-image-placeholder__content" aria-hidden="true">
        {showIcon ? (
          <span className="dk-image-placeholder__icon">
            {icon ?? <PlaceholderGlyph mediaType={mediaType} />}
          </span>
        ) : null}

        {hasCopy ? (
          <span className="dk-image-placeholder__copy">
            {typeLabel != null ? (
              <span className="dk-image-placeholder__type">{typeLabel}</span>
            ) : null}
            {message != null ? (
              <span className="dk-image-placeholder__message">{message}</span>
            ) : null}
          </span>
        ) : null}
      </span>
    </div>
  );
});

ImagePlaceholder.displayName = "ImagePlaceholder";

export default ImagePlaceholder;
