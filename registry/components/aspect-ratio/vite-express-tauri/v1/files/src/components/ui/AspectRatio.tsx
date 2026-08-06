import * as React from "react";

export type AspectPreset =
  | "1:1"
  | "4:3"
  | "3:4"
  | "16:9"
  | "9:16"
  | "21:9"
  | "square"
  | "video"
  | "photo"
  | "portrait"
  | "ultrawide"
  | "a4"
  | "a4-landscape"
  | "card"
  | "widget"
  | "mobile"
  | "tablet"
  | "custom";

export type AspectFit = "cover" | "contain" | "fill" | "none" | "scale-down";
export type AspectPosition =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
export type AspectAlign = "center" | "start" | "end" | "stretch";
export type AspectOverflow = "hidden" | "visible" | "clip" | "auto";
export type AspectRadius = "none" | "sm" | "md" | "lg" | "xl" | "full";
export type AspectBreakpoint = "sm" | "md" | "lg";
export type ResponsiveValue<T> = T | (Partial<Record<AspectBreakpoint, T>> & { base?: T });

export type AspectRatioValue = number | string;

export interface AspectRatioProps extends Omit<React.HTMLAttributes<HTMLElement>, "placeholder"> {
  /** Named proportion preset */
  preset?: ResponsiveValue<AspectPreset>;
  /**
   * Custom ratio — number (w/h), `"16/9"`, `"16:9"`, or CSS `aspect-ratio` value.
   * Overrides preset when set.
   */
  ratio?: ResponsiveValue<AspectRatioValue>;
  /** object-fit for media */
  fit?: AspectFit;
  /** object-position / crop focus */
  position?: AspectPosition;
  /** Flex alignment for non-media content */
  align?: AspectAlign;
  overflow?: AspectOverflow;
  radius?: AspectRadius;
  /** Show skeleton while loading */
  loading?: boolean | "skeleton";
  /** Placeholder node behind media */
  placeholder?: React.ReactNode;
  /** Lazy-load media (content-visibility + loading=lazy on img) */
  lazy?: boolean;
  /** Animate aspect-ratio changes */
  motion?: boolean;
  /** Inline-block sizing */
  inline?: boolean;
  /** Fill parent height as well as width */
  fill?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

type ResponsiveMap<T> = Partial<Record<AspectBreakpoint, T>> & { base?: T };

function isResponsiveObject<T>(value: ResponsiveValue<T> | undefined): value is ResponsiveMap<T> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

const PRESET_CLASS: Record<Exclude<AspectPreset, "custom">, string> = {
  "1:1": "dk-aspect-1-1",
  "4:3": "dk-aspect-4-3",
  "3:4": "dk-aspect-3-4",
  "16:9": "dk-aspect-16-9",
  "9:16": "dk-aspect-9-16",
  "21:9": "dk-aspect-21-9",
  square: "dk-aspect-square",
  video: "dk-aspect-video",
  photo: "dk-aspect-photo",
  portrait: "dk-aspect-portrait",
  ultrawide: "dk-aspect-ultrawide",
  a4: "dk-aspect-a4",
  "a4-landscape": "dk-aspect-a4-landscape",
  card: "dk-aspect-card",
  widget: "dk-aspect-widget",
  mobile: "dk-aspect-mobile",
  tablet: "dk-aspect-tablet",
};

const RESPONSIVE_PRESET_KEY: Partial<Record<AspectPreset, string>> = {
  "1:1": "1-1",
  "4:3": "4-3",
  "16:9": "16-9",
  "9:16": "9-16",
  "21:9": "21-9",
  square: "1-1",
  video: "16-9",
  photo: "4-3",
  card: "card",
  widget: "widget",
  a4: "a4",
  "a4-landscape": "a4-landscape",
};

function normalizeRatio(ratio: AspectRatioValue): string {
  if (typeof ratio === "number") return String(ratio);
  const trimmed = ratio.trim();
  if (trimmed.includes(":")) {
    const [w, h] = trimmed.split(":").map((p) => p.trim());
    if (w && h) return `${w} / ${h}`;
  }
  return trimmed;
}

function presetClass(preset: AspectPreset | undefined): string {
  if (!preset || preset === "custom") return "";
  return PRESET_CLASS[preset] ?? "";
}

function buildPresetClasses(preset: ResponsiveValue<AspectPreset> | undefined): string {
  if (preset == null) return "";
  if (!isResponsiveObject(preset)) return presetClass(preset);
  const parts: string[] = [];
  if (preset.base && preset.base !== "custom") parts.push(presetClass(preset.base));
  (["sm", "md", "lg"] as const).forEach((bp) => {
    const v = preset[bp];
    if (!v || v === "custom") return;
    const key = RESPONSIVE_PRESET_KEY[v];
    if (key) parts.push(`dk-aspect-${bp}-${key}`);
  });
  return parts.join(" ");
}

function buildRatioStyle(
  ratio: ResponsiveValue<AspectRatioValue> | undefined
): React.CSSProperties | null {
  if (ratio == null) return null;
  if (!isResponsiveObject(ratio)) {
    return { ["--aspect-ratio" as string]: normalizeRatio(ratio) };
  }
  if (ratio.base != null) {
    return { ["--aspect-ratio" as string]: normalizeRatio(ratio.base) };
  }
  return null;
}

function isMediaElement(
  child: React.ReactElement
): child is React.ReactElement<React.ImgHTMLAttributes<HTMLImageElement> & { loading?: string }> {
  return (
    typeof child.type === "string" &&
    (child.type === "img" || child.type === "video" || child.type === "iframe" || child.type === "picture")
  );
}

/**
 * AspectRatio — keeps media and layouts in consistent proportions.
 */
export function AspectRatio({
  preset = "video",
  ratio,
  fit = "cover",
  position = "center",
  align = "center",
  overflow = "hidden",
  radius = "md",
  loading = false,
  placeholder,
  lazy = false,
  motion = true,
  inline = false,
  fill = false,
  as = "div",
  className = "",
  style,
  children,
  ...props
}: AspectRatioProps) {
  const [loaded, setLoaded] = React.useState(!loading && !lazy);
  const showSkeleton = loading === true || loading === "skeleton" || (lazy && !loaded);

  const basePreset = isResponsiveObject(preset) ? preset.base ?? "video" : preset;
  const hasCustomRatio = ratio != null;

  const classes = [
    "dk-aspect",
    !hasCustomRatio ? buildPresetClasses(preset) : "",
    `dk-aspect-fit-${fit}`,
    `dk-aspect-pos-${position}`,
    `dk-aspect-align-${align}`,
    `dk-aspect-overflow-${overflow}`,
    `dk-aspect-radius-${radius}`,
    motion ? "dk-aspect-motion" : "",
    lazy ? "dk-aspect-lazy" : "",
    inline ? "dk-aspect-inline" : "",
    fill ? "dk-aspect-fill" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const ratioStyle = buildRatioStyle(ratio);

  const childList = React.Children.toArray(children);
  const soleChild = childList.length === 1 && React.isValidElement(childList[0]) ? childList[0] : null;

  let content: React.ReactNode;
  if (soleChild && isMediaElement(soleChild)) {
    const child = soleChild;
    const mediaProps: Record<string, unknown> = {
      className: ["dk-aspect-media", (child.props as { className?: string }).className]
        .filter(Boolean)
        .join(" "),
    };

    if (child.type === "img") {
      const img = child as React.ReactElement<React.ImgHTMLAttributes<HTMLImageElement>>;
      mediaProps.loading = lazy ? "lazy" : img.props.loading;
      mediaProps.decoding = img.props.decoding ?? "async";
      mediaProps.onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        setLoaded(true);
        img.props.onLoad?.(e);
      };
      mediaProps.onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        setLoaded(true);
        img.props.onError?.(e);
      };
    } else if (child.type === "video") {
      const vid = child as React.ReactElement<React.VideoHTMLAttributes<HTMLVideoElement>>;
      mediaProps.onLoadedData = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        setLoaded(true);
        vid.props.onLoadedData?.(e);
      };
    } else if (child.type === "iframe") {
      const frame = child as React.ReactElement<React.IframeHTMLAttributes<HTMLIFrameElement>>;
      mediaProps.loading = lazy ? "lazy" : frame.props.loading;
      mediaProps.onLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
        setLoaded(true);
        frame.props.onLoad?.(e);
      };
    }

    content = React.cloneElement(child, mediaProps as Partial<unknown>);
  } else if (childList.length > 0) {
    content = (
      <div className={`dk-aspect-content dk-aspect-align-${align}`.trim()}>{children}</div>
    );
  } else {
    content = null;
  }

  const Tag = as as React.ElementType;

  return (
    <Tag
      className={classes}
      style={{ ...ratioStyle, ...style }}
      data-aspect={hasCustomRatio ? "custom" : basePreset}
      data-loaded={loaded ? "true" : "false"}
      {...props}
    >
      {showSkeleton ? (
        <div className="dk-aspect-skeleton dk-aspect-skeleton-pulse" aria-hidden>
          {typeof placeholder === "string" || placeholder == null ? null : placeholder}
        </div>
      ) : placeholder && !loaded ? (
        <div className="dk-aspect-placeholder">{placeholder}</div>
      ) : null}
      {content}
    </Tag>
  );
}

function presetAspect(preset: AspectPreset, defaults: Partial<AspectRatioProps> = {}) {
  return function PresetAspect(props: Omit<AspectRatioProps, "preset">) {
    return <AspectRatio preset={preset} {...defaults} {...props} />;
  };
}

export const AspectSquare = presetAspect("1:1");
export const AspectVideo = presetAspect("16:9");
export const AspectPhoto = presetAspect("4:3");
export const AspectPortrait = presetAspect("3:4");
export const AspectUltrawide = presetAspect("21:9");
export const AspectStory = presetAspect("9:16");
export const AspectA4 = presetAspect("a4");
export const AspectCard = presetAspect("card");
export const AspectWidget = presetAspect("widget");
export const AspectMobile = presetAspect("mobile");
export const AspectTablet = presetAspect("tablet");
