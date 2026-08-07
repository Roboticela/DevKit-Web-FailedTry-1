import * as React from "react";

/**
 * Image — fundamental visual-content primitive.
 * Preserves aspect ratio; does not default to distortion (fill is opt-in).
 * Meaningful images require alt; decorative images are hidden from AT.
 * Failed loads show a composed fallback — never broken-image artifacts.
 */

export type ImageObjectFit =
  | "contain"
  | "cover"
  | "fill"
  | "none"
  | "scale-down";

export type ImageLoading = "lazy" | "eager";

export type ImageRadius =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "full"
  | "square";

/** Optional `<source>` for responsive / format variants (picture). */
export type ImageSource = {
  srcSet: string;
  type?: string;
  media?: string;
  sizes?: string;
  width?: number;
  height?: number;
};

export type ImageProps = {
  /** Primary image URL. */
  src?: string;
  /**
   * Responsive resolution variants for the `<img>` (or fallback of `<picture>`).
   * Prefer this or `sources` over a single hard-coded resolution.
   */
  srcSet?: string;
  sizes?: string;
  /**
   * Extra `<source>` entries (formats / art direction).
   * When provided, renders a `<picture>` wrapping the img.
   */
  sources?: ImageSource[];
  /**
   * Alternative text for meaningful content.
   * Required unless `decorative` is true.
   */
  alt?: string;
  /**
   * Decorative — no alternative text; hidden from assistive technology.
   * Do not use for meaningful content.
   */
  decorative?: boolean;
  /** CSS aspect-ratio, e.g. `"16 / 9"`, `"1"`, `"4 / 3"`. Reserves space while loading. */
  aspectRatio?: string;
  width?: number | string;
  height?: number | string;
  /**
   * Object-fit. Default: `cover` when aspectRatio is set; `none` (natural) otherwise.
   * `fill` stretches — only when explicitly requested.
   */
  objectFit?: ImageObjectFit;
  objectPosition?: string;
  loading?: ImageLoading;
  /**
   * Hint for prioritization (`fetchpriority` on the img).
   * Use for LCP / above-the-fold images.
   */
  priority?: boolean;
  /** Cross-origin / referrer for the underlying img. */
  crossOrigin?: "anonymous" | "use-credentials" | "";
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  decoding?: "async" | "auto" | "sync";
  /**
   * Radius treatment via global tokens.
   * Default `none` — do not auto-round every image.
   * `square` forces 0 radius explicitly.
   */
  radius?: ImageRadius;
  /** Shown while the image is loading (when dimensions / aspectRatio reserve space). */
  placeholder?: React.ReactNode;
  /** Shown when the source fails — compose EmptyState / icon / text. */
  fallback?: React.ReactNode;
  /** Controlled error override. */
  error?: boolean;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  className?: string;
  imgClassName?: string;
  id?: string;
  style?: React.CSSProperties;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function defaultFit(
  aspectRatio: string | undefined,
  objectFit: ImageObjectFit | undefined
): ImageObjectFit {
  if (objectFit) return objectFit;
  return aspectRatio ? "cover" : "none";
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  function Image(
    {
      src,
      srcSet,
      sizes,
      sources,
      alt = "",
      decorative = false,
      aspectRatio,
      width,
      height,
      objectFit: objectFitProp,
      objectPosition = "center",
      loading = "lazy",
      priority = false,
      crossOrigin,
      referrerPolicy,
      decoding = "async",
      radius = "none",
      placeholder,
      fallback,
      error: errorProp,
      onLoad,
      onError,
      className = "",
      imgClassName = "",
      id,
      style,
    },
    forwardedRef
  ) {
    const [status, setStatus] = React.useState<
      "idle" | "loading" | "loaded" | "error"
    >(src || srcSet || (sources && sources.length > 0) ? "loading" : "idle");

    React.useEffect(() => {
      if (src || srcSet || (sources && sources.length > 0)) {
        setStatus("loading");
      } else {
        setStatus("idle");
      }
    }, [src, srcSet, sources]);

    const failed = errorProp === true || status === "error";
    const loaded = status === "loaded" && !failed;
    const loadingVisible = status === "loading" && !failed;

    const objectFit = defaultFit(aspectRatio, objectFitProp);

    const accessibleAlt = decorative ? "" : alt;

    const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus("loaded");
      onLoad?.(event);
    };

    const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus("error");
      onError?.(event);
    };

    const frameStyle: React.CSSProperties = {
      ...(aspectRatio ? { aspectRatio } : null),
      ...(width != null ? { width } : null),
      ...(height != null && !aspectRatio ? { height } : null),
      ["--dk-image-fit" as string]: objectFit,
      ["--dk-image-position" as string]: objectPosition,
      ...style,
    };

    const imgProps = {
      ref: forwardedRef,
      id,
      className: cx("dk-image__img", imgClassName),
      src: failed ? undefined : src,
      srcSet: failed ? undefined : srcSet,
      sizes: failed ? undefined : sizes,
      alt: accessibleAlt,
      loading: priority ? ("eager" as const) : loading,
      // React 18+: fetchPriority
      fetchPriority: priority ? ("high" as const) : undefined,
      decoding,
      crossOrigin: crossOrigin || undefined,
      referrerPolicy,
      width: typeof width === "number" ? width : undefined,
      height: typeof height === "number" ? height : undefined,
      draggable: false,
      onLoad: handleLoad,
      onError: handleError,
      "aria-hidden": decorative || undefined,
    };

    const media = !failed && (src || srcSet || (sources && sources.length > 0)) ? (
      sources && sources.length > 0 ? (
        <picture className="dk-image__picture">
          {sources.map((source, i) => (
            <source
              key={i}
              srcSet={source.srcSet}
              type={source.type}
              media={source.media}
              sizes={source.sizes}
              width={source.width}
              height={source.height}
            />
          ))}
          <img {...imgProps} />
        </picture>
      ) : (
        <img {...imgProps} />
      )
    ) : null;

    return (
      <span
        className={cx(
          "dk-image",
          `dk-image--radius-${radius}`,
          `dk-image--fit-${objectFit}`,
          loadingVisible && "dk-image--loading",
          loaded && "dk-image--loaded",
          failed && "dk-image--error",
          decorative && "dk-image--decorative",
          className
        )}
        data-status={failed ? "error" : status}
        style={frameStyle}
        role={decorative ? undefined : undefined}
      >
        {loadingVisible && placeholder != null ? (
          <span className="dk-image__placeholder" aria-hidden="true">
            {placeholder}
          </span>
        ) : null}

        {loadingVisible && placeholder == null ? (
          <span className="dk-image__skeleton" aria-hidden="true" />
        ) : null}

        {media}

        {failed ? (
          <span className="dk-image__fallback" role="img" aria-label={decorative ? undefined : accessibleAlt || "Image unavailable"}>
            {fallback != null ? (
              fallback
            ) : (
              <span className="dk-image__fallback-default" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
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
              </span>
            )}
          </span>
        ) : null}
      </span>
    );
  }
);

Image.displayName = "Image";

export default Image;
