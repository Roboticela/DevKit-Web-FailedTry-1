import * as React from "react";

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type ElevationRole =
  | "flat"
  | "button"
  | "card"
  | "fab"
  | "nav"
  | "modal"
  | "drawer"
  | "dropdown"
  | "popover"
  | "tooltip"
  | "panel"
  | "panel-float";

export interface ElevationProps extends React.HTMLAttributes<HTMLElement> {
  /** Numeric depth 0–5 */
  level?: ElevationLevel;
  /** Semantic role (preferred for product UI) */
  semantic?: ElevationRole;
  /** Hover raises / press insets */
  interactive?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

const ROLE_CLASS: Record<ElevationRole, string> = {
  flat: "dk-shadow-0",
  button: "dk-elev-button",
  card: "dk-elev-card",
  fab: "dk-elev-fab",
  nav: "dk-elev-nav",
  modal: "dk-elev-modal",
  drawer: "dk-elev-drawer",
  dropdown: "dk-elev-dropdown",
  popover: "dk-elev-popover",
  tooltip: "dk-elev-tooltip",
  panel: "dk-elev-panel",
  "panel-float": "dk-elev-panel-float",
};

/**
 * Applies Shadow & Elevation System depth. Prefer `semantic` for components;
 * use `level` + `interactive` for custom floating chrome.
 */
export function Elevation({
  level,
  semantic,
  interactive = false,
  as = "div",
  className = "",
  children,
  ...props
}: ElevationProps) {
  const Tag = as as React.ElementType;
  const classes = [
    semantic ? ROLE_CLASS[semantic] : "",
    level != null && !semantic ? `dk-elev-${level}` : "",
    level != null && !semantic ? `dk-shadow-${level}` : "",
    interactive && semantic === "card" ? "dk-elev-card-interactive" : "",
    interactive && !semantic ? "dk-elev-interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      className={classes}
      data-level={interactive && !semantic && level != null ? level : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
