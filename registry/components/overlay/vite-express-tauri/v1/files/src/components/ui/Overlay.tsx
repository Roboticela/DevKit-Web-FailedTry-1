import * as React from "react";
import { Surface, type SurfaceProps } from "./Surface";

export type OverlayPlacement = "center" | "bottom";

export interface OverlayProps extends Omit<SurfaceProps, "variant"> {
  open?: boolean;
  onClose?: () => void;
  placement?: OverlayPlacement;
  /** Content surface variant — modal (default) or sheet */
  contentVariant?: "modal" | "sheet";
  scrimClassName?: string;
  labelledBy?: string;
  describedBy?: string;
}

/**
 * Overlay — scrim + elevated content (modal/sheet). Presentational; pair with a portal if needed.
 */
export function Overlay({
  open = false,
  onClose,
  placement = "center",
  contentVariant = "modal",
  scrimClassName = "",
  labelledBy,
  describedBy,
  children,
  className = "",
  ...surfaceProps
}: OverlayProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="dk-surface-overlay-root"
      data-placement={placement}
      role="presentation"
    >
      <button
        type="button"
        className={`dk-surface-scrim ${scrimClassName}`.trim()}
        aria-label="Close"
        onClick={() => onClose?.()}
      />
      <div className="dk-surface-overlay-content">
        <Surface
          variant={contentVariant}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          className={className}
          {...surfaceProps}
        >
          {children}
        </Surface>
      </div>
    </div>
  );
}
