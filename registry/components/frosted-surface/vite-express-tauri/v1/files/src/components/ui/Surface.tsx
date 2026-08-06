import * as React from "react";

export type SurfaceVariant =
  | "default"
  | "page"
  | "card"
  | "panel"
  | "sheet"
  | "popover"
  | "sidebar"
  | "modal"
  | "dashboard"
  | "widget";

export type SurfaceElevation = 0 | 1 | 2 | 3 | 4;
export type SurfaceMaterial = "solid" | "glass" | "frosted" | "material";
export type SurfaceRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl";
export type SurfacePadding = "none" | "sm" | "md" | "lg" | "xl";
export type ModalSize = "sm" | "md" | "lg" | "full";

export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  variant?: SurfaceVariant;
  elevation?: SurfaceElevation;
  material?: SurfaceMaterial;
  radius?: SurfaceRadius;
  padding?: SurfacePadding;
  /** Soft borderless surface (hairline restored in high contrast). */
  quiet?: boolean;
  sunken?: boolean;
  interactive?: boolean;
  flush?: boolean;
  stack?: boolean;
  /** Sidebar edge */
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
  sidebar: "dk-surface-sidebar",
  modal: "dk-surface-modal",
  dashboard: "dk-surface-dashboard",
  widget: "dk-surface-widget",
};

const MATERIAL: Record<SurfaceMaterial, string> = {
  solid: "dk-surface-solid",
  glass: "dk-surface-glass",
  frosted: "dk-surface-frosted",
  material: "dk-surface-material",
};

/**
 * Layered surface primitive — prefer semantic `variant` over one-off styles.
 * Depth via elevation + materials; consumes color / spacing / theme tokens.
 */
export function Surface({
  variant = "default",
  elevation,
  material = "solid",
  radius,
  padding,
  quiet = false,
  sunken = false,
  interactive = false,
  flush = false,
  stack = false,
  side = "start",
  size = "md",
  as = "div",
  className = "",
  children,
  ...props
}: SurfaceProps) {
  const Tag = as as React.ElementType;
  const classes = [
    "dk-surface",
    "dk-theme-transition",
    VARIANT[variant],
    elevation != null ? `dk-surface-elev-${elevation}` : "",
    material !== "solid" ? MATERIAL[material] : "",
    radius ? `dk-surface-radius-${radius}` : "",
    padding ? `dk-surface-pad-${padding}` : "",
    quiet ? "dk-surface-quiet" : "",
    sunken ? "dk-surface-sunken" : "",
    interactive ? "dk-surface-interactive" : "",
    flush ? "dk-surface-flush" : "",
    stack ? "dk-surface-stack" : "",
    variant === "sidebar" && side === "end" ? "dk-surface-sidebar-end" : "",
    variant === "modal" && size === "sm" ? "dk-surface-modal-sm" : "",
    variant === "modal" && size === "lg" ? "dk-surface-modal-lg" : "",
    variant === "modal" && size === "full" ? "dk-surface-modal-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} {...props}>
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
export const SidebarSurface = role("sidebar", { elevation: 1 });
export const ModalSurface = role("modal", { elevation: 4, stack: true });
export const DashboardSurface = role("dashboard", { quiet: true });
export const WidgetSurface = role("widget", { elevation: 2, stack: true, interactive: true });
