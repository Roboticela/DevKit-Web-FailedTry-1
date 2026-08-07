import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Tooltip — brief supplementary information for a control.
 * Non-interactive. No focus trap. role="tooltip" + aria-describedby.
 * Do not put critical instructions exclusively inside a tooltip.
 */

export type TooltipPlacement = "top" | "bottom" | "left" | "right" | "auto";

export type TooltipProps = {
  /** Brief supplementary text (host-localized). Keep short; multiline only when needed. */
  content: React.ReactNode;
  /** Single trigger element (button, icon control, etc.). */
  children: React.ReactElement;
  /** Preferred side. `auto` picks the side with the most space. Default: `auto`. */
  placement?: TooltipPlacement;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Delay before show on pointer hover (ms).
   * Focus opens immediately (accessibility). Default: 200.
   */
  delayShow?: number;
  /** Delay before hide after pointer leave (ms). Default: 100. */
  delayHide?: number;
  /** Long-press duration for touch (ms). Default: 500. */
  longPressMs?: number;
  /** Disable open behavior entirely. */
  disabled?: boolean;
  /** Max content width. Default: 16rem. */
  maxWidth?: number | string;
  /** Offset from trigger edge (px). Default: 8. */
  offset?: number;
  /** Viewport edge padding (px). Default: 8. */
  collisionPadding?: number;
  className?: string;
  id?: string;
};

type Side = Exclude<TooltipPlacement, "auto">;
type Coords = { top: number; left: number; placement: Side };

const VIEWPORT_PAD_DEFAULT = 8;
const OFFSET_DEFAULT = 8;

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function preferCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function spaceFor(
  side: Side,
  trigger: DOMRect,
  tip: { width: number; height: number },
  offset: number,
  pad: number
): number {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  switch (side) {
    case "top":
      return trigger.top - tip.height - offset - pad;
    case "bottom":
      return vh - trigger.bottom - tip.height - offset - pad;
    case "left":
      return trigger.left - tip.width - offset - pad;
    case "right":
      return vw - trigger.right - tip.width - offset - pad;
  }
}

function computePosition(
  trigger: DOMRect,
  tip: { width: number; height: number },
  preferred: TooltipPlacement,
  offset: number,
  pad: number
): Coords {
  const ranked: Side[] =
    preferred === "auto"
      ? (["top", "bottom", "right", "left"] as Side[]).sort(
          (a, b) =>
            spaceFor(b, trigger, tip, offset, pad) -
            spaceFor(a, trigger, tip, offset, pad)
        )
      : [preferred];

  let placement = ranked[0];
  for (const side of ranked) {
    if (spaceFor(side, trigger, tip, offset, pad) >= 0) {
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
      spaceFor(preferred, trigger, tip, offset, pad) < 0 &&
      spaceFor(alt, trigger, tip, offset, pad) >
        spaceFor(preferred, trigger, tip, offset, pad)
    ) {
      placement = alt;
    }
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top = 0;
  let left = 0;

  switch (placement) {
    case "top":
      top = trigger.top - tip.height - offset;
      left = trigger.left + trigger.width / 2 - tip.width / 2;
      break;
    case "bottom":
      top = trigger.bottom + offset;
      left = trigger.left + trigger.width / 2 - tip.width / 2;
      break;
    case "left":
      top = trigger.top + trigger.height / 2 - tip.height / 2;
      left = trigger.left - tip.width - offset;
      break;
    case "right":
      top = trigger.top + trigger.height / 2 - tip.height / 2;
      left = trigger.right + offset;
      break;
  }

  left = Math.min(Math.max(left, pad), Math.max(pad, vw - tip.width - pad));
  top = Math.min(Math.max(top, pad), Math.max(pad, vh - tip.height - pad));

  return { top, left, placement };
}

export const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(
  function Tooltip(
    {
      content,
      children,
      placement = "auto",
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      delayShow = 200,
      delayHide = 100,
      longPressMs = 500,
      disabled = false,
      maxWidth = "16rem",
      offset = OFFSET_DEFAULT,
      collisionPadding = VIEWPORT_PAD_DEFAULT,
      className = "",
      id,
    },
    forwardedRef
  ) {
    const reactId = React.useId();
    const tooltipId = id ?? `dk-tooltip-${reactId}`;

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
    const tipRef = React.useRef<HTMLDivElement | null>(null);
    const showTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const longPressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const longPressActive = React.useRef(false);
    const openReason = React.useRef<"pointer" | "focus" | "touch" | null>(null);
    const [coords, setCoords] = React.useState<Coords | null>(null);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const clearTimers = React.useCallback(() => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      showTimer.current = null;
      hideTimer.current = null;
      longPressTimer.current = null;
    }, []);

    const hasContent = content != null && content !== false && content !== "";

    const scheduleShow = React.useCallback(
      (reason: "pointer" | "focus" | "touch", immediate = false) => {
        if (disabled || !hasContent) return;
        clearTimers();
        const run = () => {
          openReason.current = reason;
          setOpen(true);
        };
        if (immediate || reason === "focus" || reason === "touch") {
          run();
        } else {
          showTimer.current = setTimeout(run, delayShow);
        }
      },
      [clearTimers, delayShow, disabled, hasContent, setOpen]
    );

    const scheduleHide = React.useCallback(
      (immediate = false) => {
        clearTimers();
        const run = () => {
          openReason.current = null;
          setOpen(false);
        };
        if (immediate) run();
        else hideTimer.current = setTimeout(run, delayHide);
      },
      [clearTimers, delayHide, setOpen]
    );

    const updatePosition = React.useCallback(() => {
      const anchor = anchorRef.current;
      const tip = tipRef.current;
      if (!anchor || !tip || typeof window === "undefined") return;
      const tRect = anchor.getBoundingClientRect();
      const tipRect = tip.getBoundingClientRect();
      if (tipRect.width === 0 && tipRect.height === 0) return;
      setCoords(
        computePosition(
          tRect,
          { width: tipRect.width, height: tipRect.height },
          placement,
          offset,
          collisionPadding
        )
      );
    }, [collisionPadding, offset, placement]);

    React.useLayoutEffect(() => {
      if (!open) {
        setCoords(null);
        return;
      }
      updatePosition();
    }, [open, content, updatePosition]);

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

    React.useEffect(() => {
      if (!open) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          scheduleHide(true);
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, scheduleHide]);

    React.useEffect(() => () => clearTimers(), [clearTimers]);

    React.useEffect(() => {
      if (!open || openReason.current !== "touch") return;
      const onPointerDown = (event: PointerEvent) => {
        const tip = tipRef.current;
        const anchor = anchorRef.current;
        const target = event.target as Node | null;
        if (tip?.contains(target) || anchor?.contains(target)) return;
        scheduleHide(true);
      };
      document.addEventListener("pointerdown", onPointerDown, true);
      const autoHide = setTimeout(() => scheduleHide(true), 3000);
      return () => {
        document.removeEventListener("pointerdown", onPointerDown, true);
        clearTimeout(autoHide);
      };
    }, [open, scheduleHide]);

    const child = React.Children.only(children);
    const childProps = child.props as Record<string, unknown>;

    const onPointerEnter = (event: React.PointerEvent) => {
      (childProps.onPointerEnter as ((e: React.PointerEvent) => void) | undefined)?.(
        event
      );
      if (event.pointerType === "touch" || preferCoarsePointer()) return;
      scheduleShow("pointer");
    };

    const onPointerLeave = (event: React.PointerEvent) => {
      (childProps.onPointerLeave as ((e: React.PointerEvent) => void) | undefined)?.(
        event
      );
      if (event.pointerType === "touch") return;
      if (openReason.current === "focus") return;
      if (anchorRef.current?.contains(document.activeElement)) return;
      scheduleHide();
    };

    const onFocus = (event: React.FocusEvent) => {
      (childProps.onFocus as ((e: React.FocusEvent) => void) | undefined)?.(event);
      scheduleShow("focus", true);
    };

    const onBlur = (event: React.FocusEvent) => {
      (childProps.onBlur as ((e: React.FocusEvent) => void) | undefined)?.(event);
      scheduleHide(true);
    };

    const onTouchStart = (event: React.TouchEvent) => {
      (childProps.onTouchStart as ((e: React.TouchEvent) => void) | undefined)?.(event);
      longPressActive.current = false;
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      longPressTimer.current = setTimeout(() => {
        longPressActive.current = true;
        scheduleShow("touch", true);
      }, longPressMs);
    };

    const onTouchEnd = (event: React.TouchEvent) => {
      (childProps.onTouchEnd as ((e: React.TouchEvent) => void) | undefined)?.(event);
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      if (longPressActive.current) {
        // Suppress the synthetic click after long-press; short taps still activate.
        event.preventDefault();
      }
    };

    const onTouchMove = (event: React.TouchEvent) => {
      (childProps.onTouchMove as ((e: React.TouchEvent) => void) | undefined)?.(event);
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    };

    const onClick = (event: React.MouseEvent) => {
      if (longPressActive.current) {
        event.preventDefault();
        event.stopPropagation();
        longPressActive.current = false;
        return;
      }
      (childProps.onClick as ((e: React.MouseEvent) => void) | undefined)?.(event);
    };

    const trigger = React.cloneElement(child, {
      "aria-describedby": open
        ? tooltipId
        : (childProps["aria-describedby"] as string | undefined),
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
      onTouchStart,
      onTouchEnd,
      onTouchMove,
      onClick,
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

    const tipStyle: React.CSSProperties = {
      maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
      top: coords?.top ?? 0,
      left: coords?.left ?? 0,
      // First paint measures before coords land — keep off-screen but laid out.
      ...(coords
        ? { visibility: "visible" as const }
        : { visibility: "hidden" as const }),
    };

    const tooltipNode =
      mounted && open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={tipRef}
              id={tooltipId}
              role="tooltip"
              className={cx(
                "dk-tooltip",
                "dk-tooltip--open",
                coords && `dk-tooltip--${coords.placement}`,
                className
              )}
              data-state="open"
              data-placement={coords?.placement}
              style={tipStyle}
            >
              <div className="dk-tooltip__content">{content}</div>
            </div>,
            document.body
          )
        : null;

    return (
      <span
        ref={setAnchorRef}
        className="dk-tooltip-anchor"
        data-disabled={disabled || undefined}
      >
        {trigger}
        {tooltipNode}
      </span>
    );
  }
);

Tooltip.displayName = "Tooltip";

export default Tooltip;
