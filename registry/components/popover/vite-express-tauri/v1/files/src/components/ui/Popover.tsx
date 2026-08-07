import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Popover — contextual interactive surface anchored to a trigger.
 * Unlike Tooltip: may contain interactive content.
 * Non-modal by default (no focus trap). Set `modal` for modal focus behavior.
 */

export type PopoverPlacement = "top" | "bottom" | "left" | "right" | "auto";

export type PopoverProps = {
  /** Popover body — may include interactive controls. */
  content: React.ReactNode;
  /** Single trigger element. */
  children: React.ReactElement;
  /** Preferred side. `auto` picks the side with the most space. Default: `auto`. */
  placement?: PopoverPlacement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * When true: `aria-modal`, focus trap, restore focus on close.
   * When false (default): no focus trap; focus may move into the surface.
   */
  modal?: boolean;
  /** Dismiss on pointer outside trigger/surface. Default: true. */
  closeOnOutsideClick?: boolean;
  /** Dismiss on Escape. Default: true. */
  closeOnEscape?: boolean;
  /** Optional header title (localized by host). */
  title?: React.ReactNode;
  /** Show a dismiss control in the header/chrome. Default: false. */
  showCloseButton?: boolean;
  /** Accessible name for the close control. Default: "Close". */
  closeLabel?: string;
  /** Modest arrow pointing at the trigger. Default: false. */
  arrow?: boolean;
  disabled?: boolean;
  /** Max width of the surface. Default: 20rem. */
  maxWidth?: number | string;
  /** Max height before internal scroll. Default: min(24rem, viewport). */
  maxHeight?: number | string;
  /** Gap from trigger edge (px). Default: 8. */
  offset?: number;
  /** Viewport edge padding (px). Default: 8. */
  collisionPadding?: number;
  className?: string;
  id?: string;
  /** Accessible name when `title` is not text. */
  "aria-label"?: string;
};

type Side = Exclude<PopoverPlacement, "auto">;

type Coords = {
  top: number;
  left: number;
  placement: Side;
  maxHeight: number;
  arrowOffset: number;
};

const VIEWPORT_PAD_DEFAULT = 8;
const OFFSET_DEFAULT = 8;
const ARROW_SIZE = 8;

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function spaceFor(
  side: Side,
  trigger: DOMRect,
  size: { width: number; height: number },
  offset: number,
  pad: number
): number {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  switch (side) {
    case "top":
      return trigger.top - size.height - offset - pad;
    case "bottom":
      return vh - trigger.bottom - size.height - offset - pad;
    case "left":
      return trigger.left - size.width - offset - pad;
    case "right":
      return vw - trigger.right - size.width - offset - pad;
  }
}

function availableHeight(
  side: Side,
  trigger: DOMRect,
  offset: number,
  pad: number
): number {
  const vh = window.innerHeight;
  switch (side) {
    case "top":
      return Math.max(0, trigger.top - offset - pad);
    case "bottom":
      return Math.max(0, vh - trigger.bottom - offset - pad);
    case "left":
    case "right":
      return Math.max(0, vh - pad * 2);
  }
}

function computePosition(
  trigger: DOMRect,
  panel: { width: number; height: number },
  preferred: PopoverPlacement,
  offset: number,
  pad: number,
  requestedMaxHeight: number
): Coords {
  const ranked: Side[] =
    preferred === "auto"
      ? (["bottom", "top", "right", "left"] as Side[]).sort(
          (a, b) =>
            spaceFor(b, trigger, panel, offset, pad) -
            spaceFor(a, trigger, panel, offset, pad)
        )
      : [preferred];

  let placement = ranked[0];
  for (const side of ranked) {
    if (spaceFor(side, trigger, panel, offset, pad) >= 0) {
      placement = side;
      break;
    }
  }

  if (preferred !== "auto") {
    const flip: Record<Side, Side> = {
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left",
    };
    const alt = flip[preferred];
    if (
      spaceFor(preferred, trigger, panel, offset, pad) < 0 &&
      spaceFor(alt, trigger, panel, offset, pad) >
        spaceFor(preferred, trigger, panel, offset, pad)
    ) {
      placement = alt;
    }
  }

  const maxH = Math.min(
    requestedMaxHeight,
    availableHeight(placement, trigger, offset, pad)
  );
  const height = Math.min(panel.height, maxH || panel.height);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top = 0;
  let left = 0;

  switch (placement) {
    case "top":
      top = trigger.top - height - offset;
      left = trigger.left + trigger.width / 2 - panel.width / 2;
      break;
    case "bottom":
      top = trigger.bottom + offset;
      left = trigger.left + trigger.width / 2 - panel.width / 2;
      break;
    case "left":
      top = trigger.top + trigger.height / 2 - height / 2;
      left = trigger.left - panel.width - offset;
      break;
    case "right":
      top = trigger.top + trigger.height / 2 - height / 2;
      left = trigger.right + offset;
      break;
  }

  left = Math.min(Math.max(left, pad), Math.max(pad, vw - panel.width - pad));
  top = Math.min(Math.max(top, pad), Math.max(pad, vh - height - pad));

  // Arrow offset along the shared edge, relative to panel origin.
  let arrowOffset = 0;
  if (placement === "top" || placement === "bottom") {
    arrowOffset = trigger.left + trigger.width / 2 - left;
    arrowOffset = Math.min(Math.max(arrowOffset, 12), panel.width - 12);
  } else {
    arrowOffset = trigger.top + trigger.height / 2 - top;
    arrowOffset = Math.min(Math.max(arrowOffset, 12), height - 12);
  }

  return { top, left, placement, maxHeight: maxH, arrowOffset };
}

function getFocusable(root: HTMLElement): HTMLElement[] {
  const nodes = root.querySelectorAll<HTMLElement>(
    'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
  );
  return Array.from(nodes).filter(
    (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1 && !el.closest("[inert]")
  );
}

function CloseGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M5.5 5.5l9 9M14.5 5.5l-9 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const Popover = React.forwardRef<HTMLSpanElement, PopoverProps>(
  function Popover(
    {
      content,
      children,
      placement = "auto",
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      modal = false,
      closeOnOutsideClick = true,
      closeOnEscape = true,
      title,
      showCloseButton = false,
      closeLabel = "Close",
      arrow = false,
      disabled = false,
      maxWidth = "20rem",
      maxHeight = "24rem",
      offset = OFFSET_DEFAULT,
      collisionPadding = VIEWPORT_PAD_DEFAULT,
      className = "",
      id,
      "aria-label": ariaLabel,
    },
    forwardedRef
  ) {
    const reactId = React.useId();
    const popoverId = id ?? `dk-popover-${reactId}`;
    const titleId = `${popoverId}-title`;

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? Boolean(openProp) : uncontrolledOpen;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (disabled && next) return;
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [disabled, isControlled, onOpenChange]
    );

    const anchorRef = React.useRef<HTMLSpanElement | null>(null);
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const previouslyFocused = React.useRef<HTMLElement | null>(null);
    const [coords, setCoords] = React.useState<Coords | null>(null);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const resolveMaxPx = React.useCallback(() => {
      if (typeof maxHeight === "number") return maxHeight;
      if (typeof window === "undefined") return 384;
      const raw = String(maxHeight).trim();
      if (raw.endsWith("rem")) {
        const rem = Number.parseFloat(raw);
        const root =
          Number.parseFloat(
            getComputedStyle(document.documentElement).fontSize
          ) || 16;
        return rem * root;
      }
      if (raw.endsWith("px")) return Number.parseFloat(raw) || 384;
      return Number.parseFloat(raw) || 384;
    }, [maxHeight]);

    const updatePosition = React.useCallback(() => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor || !panel || typeof window === "undefined") return;
      const tRect = anchor.getBoundingClientRect();
      panel.style.maxHeight = "none";
      const raw = panel.getBoundingClientRect();
      const next = computePosition(
        tRect,
        { width: raw.width, height: raw.height },
        placement,
        offset + (arrow ? ARROW_SIZE / 2 : 0),
        collisionPadding,
        resolveMaxPx()
      );
      panel.style.maxHeight = `${next.maxHeight}px`;
      setCoords(next);
    }, [arrow, collisionPadding, offset, placement, resolveMaxPx]);

    React.useLayoutEffect(() => {
      if (!open) {
        setCoords(null);
        return;
      }
      updatePosition();
    }, [open, content, title, showCloseButton, updatePosition]);

    React.useEffect(() => {
      if (!open) return;
      const onScrollOrResize = () => updatePosition();
      window.addEventListener("resize", onScrollOrResize);
      window.addEventListener("scroll", onScrollOrResize, true);
      return () => {
        window.removeEventListener("resize", onScrollOrResize);
        window.removeEventListener("scroll", onScrollOrResize, true);
      };
    }, [open, updatePosition]);

    // Focus management on open/close
    React.useEffect(() => {
      if (!open) return;
      previouslyFocused.current =
        (document.activeElement as HTMLElement | null) ?? null;
      const panel = panelRef.current;
      if (!panel) return;

      const focusable = getFocusable(panel);
      const target =
        focusable[0] ??
        (panel.querySelector<HTMLElement>("[data-dk-popover-close]") || panel);
      // Defer so portal is painted.
      const id = window.requestAnimationFrame(() => {
        target.focus({ preventScroll: true });
      });

      return () => {
        window.cancelAnimationFrame(id);
        const prev = previouslyFocused.current;
        if (prev && typeof prev.focus === "function") {
          prev.focus({ preventScroll: true });
        }
      };
    }, [open]);

    // Escape
    React.useEffect(() => {
      if (!open || !closeOnEscape) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          event.preventDefault();
          setOpen(false);
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, closeOnEscape, setOpen]);

    // Outside pointer — do not close when interacting inside the popover
    React.useEffect(() => {
      if (!open || !closeOnOutsideClick) return;
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target as Node | null;
        if (panelRef.current?.contains(target)) return;
        if (anchorRef.current?.contains(target)) return;
        setOpen(false);
      };
      document.addEventListener("pointerdown", onPointerDown, true);
      return () => document.removeEventListener("pointerdown", onPointerDown, true);
    }, [open, closeOnOutsideClick, setOpen]);

    // Modal focus trap
    React.useEffect(() => {
      if (!open || !modal) return;
      const panel = panelRef.current;
      if (!panel) return;

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Tab") return;
        const focusable = getFocusable(panel);
        if (focusable.length === 0) {
          event.preventDefault();
          panel.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (event.shiftKey) {
          if (active === first || !panel.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last || !panel.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, modal]);

    const toggle = () => {
      if (disabled) return;
      setOpen(!open);
    };

    const child = React.Children.only(children);
    const childProps = child.props as Record<string, unknown>;

    const trigger = React.cloneElement(child, {
      "aria-haspopup": "dialog",
      "aria-expanded": open,
      "aria-controls": open ? popoverId : undefined,
      onClick: (event: React.MouseEvent) => {
        (childProps.onClick as ((e: React.MouseEvent) => void) | undefined)?.(
          event
        );
        if (!event.defaultPrevented) toggle();
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        (childProps.onKeyDown as ((e: React.KeyboardEvent) => void) | undefined)?.(
          event
        );
        if (event.defaultPrevented) return;
        if (event.key === "ArrowDown" && !open) {
          event.preventDefault();
          setOpen(true);
        }
      },
    } as Partial<typeof child.props>);

    const setAnchorRef = React.useCallback(
      (node: HTMLSpanElement | null) => {
        anchorRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLSpanElement | null>).current =
            node;
        }
      },
      [forwardedRef]
    );

    const panelStyle: React.CSSProperties = {
      maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
      top: coords?.top ?? 0,
      left: coords?.left ?? 0,
      maxHeight: coords ? `${coords.maxHeight}px` : undefined,
      visibility: coords ? "visible" : "hidden",
      ["--dk-popover-arrow-offset" as string]: coords
        ? `${coords.arrowOffset}px`
        : "50%",
    };

    const labelledBy = title != null ? titleId : undefined;

    const panel =
      mounted && open && typeof document !== "undefined"
        ? createPortal(
            <>
              {modal ? (
                <div
                  className="dk-popover-backdrop"
                  aria-hidden="true"
                  data-state="open"
                />
              ) : null}
              <div
                ref={panelRef}
                id={popoverId}
                role="dialog"
                aria-modal={modal || undefined}
                aria-labelledby={labelledBy}
                aria-label={title == null ? ariaLabel : undefined}
                tabIndex={-1}
                className={cx(
                  "dk-popover",
                  open && "dk-popover--open",
                  modal && "dk-popover--modal",
                  arrow && "dk-popover--arrow",
                  coords && `dk-popover--${coords.placement}`,
                  className
                )}
                data-state="open"
                data-placement={coords?.placement}
                style={panelStyle}
              >
                {(title != null || showCloseButton) && (
                  <div className="dk-popover__header">
                    {title != null ? (
                      <h2 id={titleId} className="dk-popover__title">
                        {title}
                      </h2>
                    ) : (
                      <span className="dk-popover__title-spacer" />
                    )}
                    {showCloseButton ? (
                      <button
                        type="button"
                        className="dk-popover__close"
                        data-dk-popover-close=""
                        aria-label={closeLabel}
                        onClick={() => setOpen(false)}
                      >
                        <CloseGlyph />
                      </button>
                    ) : null}
                  </div>
                )}

                <div className="dk-popover__body">{content}</div>

                {arrow ? (
                  <span className="dk-popover__arrow" aria-hidden="true" />
                ) : null}
              </div>
            </>,
            document.body
          )
        : null;

    return (
      <span
        ref={setAnchorRef}
        className="dk-popover-anchor"
        data-disabled={disabled || undefined}
      >
        {trigger}
        {panel}
      </span>
    );
  }
);

Popover.displayName = "Popover";

export default Popover;
