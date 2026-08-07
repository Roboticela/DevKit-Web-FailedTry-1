import * as React from "react";

/**
 * Media Metadata — secondary information for visual/media content.
 * Visually subordinate to titles. Compact or standard density.
 * Wraps/stacks on narrow viewports — never force one horizontal line.
 * Formatting helpers are locale-aware. Do not communicate meaning by color alone.
 */

export type MediaMetadataDensity = "compact" | "standard";

export type MediaMetadataKind =
  | "type"
  | "dimensions"
  | "duration"
  | "size"
  | "date"
  | "author"
  | "status"
  | "custom";

export type MediaMetadataItemData = {
  kind?: MediaMetadataKind;
  value: React.ReactNode;
  /** Accessible label when the visible value is ambiguous (e.g. status). */
  label?: string;
};

export type MediaMetadataProps = {
  density?: MediaMetadataDensity;
  /**
   * Prop-driven items. Prefer compound `MediaMetadata.Item` when composing.
   */
  items?: MediaMetadataItemData[];
  /**
   * Separator between items. Default middot. Hidden from AT.
   */
  separator?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

export type MediaMetadataItemProps = {
  kind?: MediaMetadataKind;
  /** Accessible name when value alone is unclear. */
  label?: string;
  children?: React.ReactNode;
  className?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ——— Localizable format helpers (host may also pass preformatted strings) ——— */

/**
 * Format byte count using the active locale (e.g. "2.4 MB").
 */
export function formatMediaFileSize(
  bytes: number,
  locale?: string,
  options?: Intl.NumberFormatOptions
): string {
  const abs = Math.abs(bytes);
  const units = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte"] as const;
  let unitIndex = 0;
  let value = abs;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  try {
    return new Intl.NumberFormat(locale, {
      style: "unit",
      unit: units[unitIndex],
      unitDisplay: unitIndex === 0 ? "long" : "short",
      maximumFractionDigits: unitIndex === 0 ? 0 : 1,
      ...options,
    }).format(bytes < 0 ? -value : value);
  } catch {
    const suffixes = ["B", "KB", "MB", "GB", "TB"];
    const rounded =
      unitIndex === 0 ? String(Math.round(value)) : value.toFixed(1);
    return `${bytes < 0 ? "-" : ""}${rounded} ${suffixes[unitIndex]}`;
  }
}

/**
 * Format duration from total seconds (e.g. "4:32", "1:04:32").
 * Uses ASCII digits; hosts may localize further if needed.
 */
export function formatMediaDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  return `${minutes}:${pad(seconds)}`;
}

/**
 * Format pixel dimensions (e.g. "1920 × 1080"). Uses × (multiplication sign).
 */
export function formatMediaDimensions(
  width: number,
  height: number,
  locale?: string
): string {
  try {
    const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    return `${nf.format(width)} × ${nf.format(height)}`;
  } catch {
    return `${Math.round(width)} × ${Math.round(height)}`;
  }
}

/**
 * Format a date/time with the active locale.
 */
export function formatMediaDate(
  value: Date | number | string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    ...options,
  }).format(date);
}

function MediaMetadataItem({
  kind = "custom",
  label,
  children,
  className = "",
}: MediaMetadataItemProps) {
  return (
    <span
      className={cx(
        "dk-media-metadata__item",
        `dk-media-metadata__item--${kind}`,
        className
      )}
      data-kind={kind}
      title={typeof label === "string" ? label : undefined}
    >
      {label != null && typeof children === "string" ? (
        <span className="dk-media-metadata__sr-only">{label}: </span>
      ) : label != null && children == null ? (
        <span className="dk-media-metadata__sr-only">{label}</span>
      ) : null}
      <span className="dk-media-metadata__value">{children}</span>
    </span>
  );
}
MediaMetadataItem.displayName = "MediaMetadata.Item";

function displayNameOf(child: React.ReactElement): string | undefined {
  return (child.type as { displayName?: string })?.displayName;
}

function MediaMetadataRoot(
  {
    density = "standard",
    items,
    separator = "·",
    children,
    className = "",
    id,
    "aria-label": ariaLabel,
  }: MediaMetadataProps,
  forwardedRef: React.ForwardedRef<HTMLElement>
) {
  const compoundItems: React.ReactElement[] = [];
  const other: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      other.push(child);
      return;
    }
    if (displayNameOf(child) === "MediaMetadata.Item") {
      compoundItems.push(child);
    } else {
      other.push(child);
    }
  });

  const fromProps =
    items?.map((item, index) => (
      <MediaMetadataItem
        key={`mm-${item.kind ?? "custom"}-${index}`}
        kind={item.kind}
        label={item.label}
      >
        {item.value}
      </MediaMetadataItem>
    )) ?? [];

  const list = compoundItems.length > 0 ? compoundItems : fromProps;

  const nodes: React.ReactNode[] = [];
  list.forEach((item, index) => {
    if (index > 0) {
      nodes.push(
        <span
          key={`sep-${index}`}
          className="dk-media-metadata__sep"
          aria-hidden="true"
        >
          {separator}
        </span>
      );
    }
    nodes.push(item);
  });

  return (
    <div
      ref={forwardedRef as React.Ref<HTMLDivElement>}
      id={id}
      className={cx(
        "dk-media-metadata",
        `dk-media-metadata--${density}`,
        className
      )}
      role="group"
      aria-label={ariaLabel ?? "Media details"}
    >
      <div className="dk-media-metadata__list">{nodes}</div>
      {other}
    </div>
  );
}

const MediaMetadataForward = React.forwardRef(MediaMetadataRoot);
MediaMetadataForward.displayName = "MediaMetadata";

export const MediaMetadata = Object.assign(MediaMetadataForward, {
  Item: MediaMetadataItem,
});

export default MediaMetadata;
