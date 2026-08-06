import * as React from "react";

export type SurfaceVariant =
  | "default"
  | "page"
  | "card"
  | "panel"
  | "sheet"
  | "popover"
  | "tooltip"
  | "dropdown"
  | "menu"
  | "sidebar"
  | "side-panel"
  | "modal"
  | "dashboard"
  | "widget"
  | "overlay";

export type SurfaceElevation = 0 | 1 | 2 | 3 | 4 | 5;
export type SurfaceMaterial =
  | "solid"
  | "glass"
  | "frosted"
  | "material"
  | "translucent"
  | "veil";
export type SurfaceRadius =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "card"
  | "control";
export type SurfacePadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type ModalSize = "sm" | "md" | "lg" | "full";

export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  /** Semantic surface role */
  variant?: SurfaceVariant;
  /** Semantic elevation level (token-backed) */
  elevation?: SurfaceElevation;
  /** Fill / blur material */
  material?: SurfaceMaterial;
  /** Corner radius token */
  radius?: SurfaceRadius;
  /** Internal padding token */
  padding?: SurfacePadding;
  /** Soft borderless surface (hairline restored in high contrast) */
  quiet?: boolean;
  /** Outlined / hollow surface */
  outlined?: boolean;
  /** Recessed / inset surface */
  sunken?: boolean;
  /** Hover / press / focus interactions */
  interactive?: boolean;
  /** Force pressed appearance */
  pressed?: boolean;
  /** Remove padding */
  flush?: boolean;
  /** Flex column + token gap */
  stack?: boolean;
  /** Motion-aware elevation / color transitions */
  motion?: boolean;
  /** Layout/paint containment for performance */
  contain?: boolean;
  /** Soft accent veil wash */
  veil?: boolean;
  /** Sidebar / side-panel edge */
  side?: "start" | "end";
  /** Modal width preset */
  size?: ModalSize;
  as?: keyof React.JSX.IntrinsicElements;
}

const VARIANT: Record<SurfaceVariant, string> = {
  default: "",
  page: "dk-surface-page",
  card: "dk-surface-card",
  panel: "dk-surface-panel",
  sheet: "dk-surface-sheet",
  popover: "dk-surface-popover",
  tooltip: "dk-surface-tooltip",
  dropdown: "dk-surface-dropdown",
  menu: "dk-surface-menu",
  sidebar: "dk-surface-sidebar",
  "side-panel": "dk-surface-side-panel",
  modal: "dk-surface-modal",
  dashboard: "dk-surface-dashboard",
  widget: "dk-surface-widget",
  overlay: "dk-surface-overlay-face",
};

const MATERIAL: Record<SurfaceMaterial, string> = {
  solid: "dk-surface-solid",
  glass: "dk-surface-glass",
  frosted: "dk-surface-frosted",
  material: "dk-surface-material",
  translucent: "dk-surface-translucent",
  veil: "dk-surface-veil",
};

const DEFAULT_ELEVATION: Partial<Record<SurfaceVariant, SurfaceElevation>> = {
  card: 1,
  panel: 2,
  widget: 1,
  popover: 3,
  tooltip: 2,
  dropdown: 3,
  menu: 3,
  sheet: 4,
  modal: 4,
  overlay: 5,
  "side-panel": 3,
  sidebar: 1,
};

/**
 * Surface — every visual layer in the application.
 * Prefer semantic `variant` + token elevation/material over one-off styles.
 */
export function Surface({
  variant = "default",
  elevation,
  material = "solid",
  radius,
  padding,
  quiet = false,
  outlined = false,
  sunken = false,
  interactive = false,
  pressed = false,
  flush = false,
  stack = false,
  motion = true,
  contain = false,
  veil = false,
  side = "start",
  size = "md",
  as = "div",
  className = "",
  children,
  ...props
}: SurfaceProps) {
  const resolvedElevation = elevation ?? DEFAULT_ELEVATION[variant];
  const Tag = as as React.ElementType;

  const classes = [
    "dk-surface",
    "dk-theme-transition",
    VARIANT[variant],
    resolvedElevation != null ? `dk-surface-elev-${resolvedElevation}` : "",
    material !== "solid" ? MATERIAL[material] : "",
    veil || material === "veil" ? "dk-surface-veil" : "",
    radius ? `dk-surface-radius-${radius}` : "",
    padding ? `dk-surface-pad-${padding}` : "",
    quiet ? "dk-surface-quiet" : "",
    outlined ? "dk-surface-outlined" : "",
    sunken ? "dk-surface-sunken" : "",
    interactive ? "dk-surface-interactive" : "",
    pressed ? "dk-surface-pressed" : "",
    flush ? "dk-surface-flush" : "",
    stack ? "dk-surface-stack" : "",
    motion ? "dk-surface-motion" : "",
    contain ? "dk-surface-contain" : "",
    (variant === "sidebar" || variant === "side-panel") && side === "end"
      ? variant === "side-panel"
        ? "dk-surface-side-panel-end"
        : "dk-surface-sidebar-end"
      : "",
    variant === "modal" && size === "sm" ? "dk-surface-modal-sm" : "",
    variant === "modal" && size === "lg" ? "dk-surface-modal-lg" : "",
    variant === "modal" && size === "full" ? "dk-surface-modal-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      className={classes}
      data-surface={variant}
      data-elevation={resolvedElevation}
      data-pressed={pressed ? "true" : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}

function role(
  variant: SurfaceVariant,
  defaults: Partial<SurfaceProps> = {}
): React.FC<Omit<SurfaceProps, "variant">> {
  const Comp = (props: Omit<SurfaceProps, "variant">) => (
    <Surface variant={variant} {...defaults} {...props} />
  );
  Comp.displayName = `Surface(${variant})`;
  return Comp;
}

export const PageSurface = role("page", { padding: "none", quiet: true });
export const CardSurface = role("card", { elevation: 2, stack: true });
export const PanelSurface = role("panel", { elevation: 1 });
export const SheetSurface = role("sheet", { elevation: 3, material: "frosted" });
export const PopoverSurface = role("popover", { elevation: 3 });
export const TooltipSurface = role("tooltip", { elevation: 2, quiet: true });
export const DropdownSurface = role("dropdown", { elevation: 3, stack: true });
export const MenuSurface = role("menu", { elevation: 3, stack: true });
export const SidebarSurface = role("sidebar", { elevation: 1 });
export const SidePanelSurface = role("side-panel", { elevation: 3 });
export const ModalSurface = role("modal", { elevation: 4, stack: true });
export const DashboardSurface = role("dashboard", { quiet: true });
export const WidgetSurface = role("widget", {
  elevation: 2,
  stack: true,
  interactive: true,
  contain: true,
});
export const OverlaySurface = role("overlay", { elevation: 5, stack: true });
