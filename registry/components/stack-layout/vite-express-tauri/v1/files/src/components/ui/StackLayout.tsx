import * as React from "react";

export type StackDirection = "vertical" | "horizontal" | "column" | "row";
export type StackGap =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "equal"
  | "compact"
  | "comfortable"
  | "spacious"
  | "responsive"
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 8
  | 10
  | 12
  | (string & {});

export type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type StackJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly"
  | "stretch";

export type StackBreakpoint = "sm" | "md" | "lg" | "xl";

export type ResponsiveValue<T> = T | (Partial<Record<StackBreakpoint, T>> & { base?: T });

export type StackSeparator = boolean | "strong" | React.ReactNode;

export interface StackVirtualOptions {
  /** Fixed item height in px (required for windowing) */
  itemSize?: number;
  overscan?: number;
  /** Viewport height — number (px) or CSS length */
  height?: number | string;
}

export interface StackLayoutProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** vertical (default) | horizontal | aliases column/row */
  direction?: ResponsiveValue<StackDirection>;
  /** Token gap preset, scale step, CSS length, or responsive map */
  gap?: StackGap | ResponsiveValue<StackGap>;
  /** Cross-axis alignment */
  align?: ResponsiveValue<StackAlign>;
  /** Main-axis distribution */
  justify?: StackJustify;
  /** Allow wrapping (default true for inline) */
  wrap?: ResponsiveValue<boolean>;
  /** Reverse main axis */
  reverse?: boolean;
  /** Inline wrap stack (chips, toolbars) */
  inline?: boolean;
  /** Nested stack — slightly tighter gap */
  nested?: boolean;
  /** Insert separators between children */
  separator?: StackSeparator;
  /** CSS border-between items (no extra nodes) */
  divided?: boolean;
  /** Hide empty / hidden children */
  collapseEmpty?: boolean;
  /** Animate children on mount */
  animate?: boolean;
  /** Stagger enter delays */
  stagger?: boolean;
  /** Transition gap / direction changes */
  motion?: boolean;
  /** content-visibility on items */
  lazy?: boolean;
  /** Window long lists (fixed itemSize) */
  virtual?: boolean | StackVirtualOptions;
  /** Arrow-key focus movement between items */
  keyboardNav?: boolean;
  /** Equal flex grow on children */
  equal?: boolean;
  /** Landmark / semantic element */
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

type ResponsiveMap<T> = Partial<Record<StackBreakpoint, T>> & { base?: T };

function isResponsiveObject<T>(value: ResponsiveValue<T> | undefined): value is ResponsiveMap<T> {
  return (
    value != null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !React.isValidElement(value as React.ReactElement)
  );
}

function resolveDirection(dir: StackDirection | undefined): "row" | "column" {
  if (dir === "horizontal" || dir === "row") return "row";
  return "column";
}

const NAMED_GAPS = new Set([
  "none",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "equal",
  "compact",
  "comfortable",
  "spacious",
  "responsive",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
]);

const RESPONSIVE_GAPS = new Set(["none", "compact", "comfortable", "spacious"]);

function gapClass(gap: StackGap | undefined): string {
  if (gap == null || gap === "") return "";
  if (typeof gap === "number") return `dk-stack-gap-${gap}`;
  if (NAMED_GAPS.has(String(gap))) return `dk-stack-gap-${gap}`;
  return "";
}

function isCustomGap(gap: StackGap | undefined): gap is string {
  if (gap == null || typeof gap === "number") return false;
  return gapClass(gap) === "";
}

function flattenChildren(children: React.ReactNode, collapseEmpty: boolean): React.ReactElement[] {
  const out: React.ReactElement[] = [];
  React.Children.forEach(children, (child) => {
    if (child == null || child === false || child === true) return;
    if (typeof child === "string" && collapseEmpty && child.trim() === "") return;
    if (typeof child === "string" || typeof child === "number") {
      out.push(
        <span key={`text-${out.length}`} className="dk-stack-item">
          {child}
        </span>
      );
      return;
    }
    if (!React.isValidElement(child)) return;
    if (collapseEmpty) {
      const childProps = child.props as { hidden?: boolean; "data-empty"?: string | boolean };
      if (childProps.hidden || childProps["data-empty"] === true || childProps["data-empty"] === "true") {
        return;
      }
    }
    out.push(child);
  });
  return out;
}

function withItemWrapper(
  child: React.ReactElement,
  index: number,
  opts: { stagger: boolean; lazy: boolean; list: boolean }
): React.ReactElement {
  const key = child.key ?? `stack-item-${index}`;
  const childProps = child.props as {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  };
  const itemClass = ["dk-stack-item", opts.lazy ? "dk-stack-item-lazy" : "", childProps.className]
    .filter(Boolean)
    .join(" ");

  const style: React.CSSProperties = {
    ...childProps.style,
    ...(opts.stagger ? { ["--stack-stagger-index" as string]: index } : null),
  };

  const roleProps = opts.list ? { role: "listitem" as const } : {};

  if (child.type === React.Fragment) {
    return (
      <div key={key} className={itemClass} style={style} {...roleProps}>
        {childProps.children}
      </div>
    );
  }

  return React.cloneElement(child, {
    key,
    className: itemClass,
    style,
    ...roleProps,
  } as Partial<unknown>);
}

/**
 * Stack Layout — preferred method for consistent vertical / horizontal spacing.
 * Replaces manual margins. Token gaps, responsive direction, separators, a11y.
 */
export function StackLayout({
  direction = "vertical",
  gap = "comfortable",
  align,
  justify = "start",
  wrap,
  reverse = false,
  inline = false,
  nested = false,
  separator = false,
  divided = false,
  collapseEmpty = true,
  animate = false,
  stagger = false,
  motion = true,
  lazy = false,
  virtual = false,
  keyboardNav = false,
  equal = false,
  as = "div",
  className = "",
  style,
  children,
  onKeyDown,
  role,
  ...props
}: StackLayoutProps) {
  const rootRef = React.useRef<HTMLElement>(null);
  const virtualOpts: StackVirtualOptions =
    typeof virtual === "object" ? virtual : virtual ? { itemSize: 48, overscan: 4, height: 320 } : {};
  const isVirtual = Boolean(virtual) && (virtualOpts.itemSize ?? 0) > 0;

  const baseDirection = isResponsiveObject(direction) ? direction.base ?? "vertical" : direction;
  const isRow = inline || resolveDirection(baseDirection) === "row";
  const defaultAlign: ResponsiveValue<StackAlign> = align ?? (isRow ? "center" : "stretch");
  const defaultWrap: ResponsiveValue<boolean> = wrap ?? (inline ? true : false);

  const customGapStyle = (() => {
    if (!isResponsiveObject(gap) && isCustomGap(gap as StackGap)) {
      return { ["--stack-gap" as string]: gap as string };
    }
    if (isResponsiveObject(gap) && gap.base != null && isCustomGap(gap.base)) {
      return { ["--stack-gap" as string]: gap.base };
    }
    return null;
  })();

  const gapUtilities = (() => {
    if (isResponsiveObject(gap)) {
      const parts: string[] = [];
      if (gap.base != null && !isCustomGap(gap.base)) parts.push(gapClass(gap.base));
      (["sm", "md", "lg", "xl"] as const).forEach((bp) => {
        const v = gap[bp];
        if (v == null || isCustomGap(v)) return;
        if (RESPONSIVE_GAPS.has(String(v))) parts.push(`dk-stack-${bp}-gap-${v}`);
        else parts.push(gapClass(v));
      });
      return parts.join(" ");
    }
    return gapClass(gap as StackGap);
  })();

  const dirUtilities = (() => {
    if (!isResponsiveObject(direction)) {
      if (inline) return "";
      return isRow ? "dk-stack-dir-row" : "dk-stack-dir-column";
    }
    const parts: string[] = [];
    if (direction.base != null) parts.push(`dk-stack-dir-${resolveDirection(direction.base)}`);
    (["sm", "md", "lg", "xl"] as const).forEach((bp) => {
      if (direction[bp] != null) parts.push(`dk-stack-${bp}-dir-${resolveDirection(direction[bp]!)}`);
    });
    return parts.join(" ");
  })();

  const alignUtilities = (() => {
    if (!isResponsiveObject(defaultAlign)) {
      return defaultAlign ? `dk-stack-align-${defaultAlign}` : "";
    }
    const parts: string[] = [];
    if (defaultAlign.base != null) parts.push(`dk-stack-align-${defaultAlign.base}`);
    (["sm", "md", "lg", "xl"] as const).forEach((bp) => {
      if (defaultAlign[bp] != null) parts.push(`dk-stack-${bp}-align-${defaultAlign[bp]}`);
    });
    return parts.join(" ");
  })();

  const wrapUtilities = (() => {
    if (!isResponsiveObject(defaultWrap)) {
      if (defaultWrap == null) return "";
      return defaultWrap ? "dk-stack-wrap" : "dk-stack-nowrap";
    }
    const parts: string[] = [];
    if (defaultWrap.base != null) parts.push(defaultWrap.base ? "dk-stack-wrap" : "dk-stack-nowrap");
    (["sm", "md", "lg", "xl"] as const).forEach((bp) => {
      if (defaultWrap[bp] != null) {
        parts.push(defaultWrap[bp] ? `dk-stack-${bp}-wrap` : `dk-stack-${bp}-nowrap`);
      }
    });
    return parts.join(" ");
  })();

  const items = flattenChildren(children, collapseEmpty);
  const [range, setRange] = React.useState({ start: 0, end: items.length });

  React.useEffect(() => {
    if (!isVirtual) {
      setRange({ start: 0, end: items.length });
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const itemSize = virtualOpts.itemSize ?? 48;
    const overscan = virtualOpts.overscan ?? 4;

    const update = () => {
      const scrollTop = el.scrollTop;
      const height = el.clientHeight;
      const start = Math.max(0, Math.floor(scrollTop / itemSize) - overscan);
      const end = Math.min(items.length, Math.ceil((scrollTop + height) / itemSize) + overscan);
      setRange({ start, end });
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro?.disconnect();
    };
  }, [isVirtual, items.length, virtualOpts.itemSize, virtualOpts.overscan]);

  const visibleItems = isVirtual ? items.slice(range.start, range.end) : items;
  const rendered: React.ReactNode[] = [];
  const listSemantics = as === "ul" || as === "ol" || as === "menu";

  if (isVirtual) {
    const itemSize = virtualOpts.itemSize ?? 48;
    rendered.push(
      <div
        key="virtual-top"
        className="dk-stack-virtual-spacer"
        style={{ height: range.start * itemSize }}
        aria-hidden
      />
    );
  }

  visibleItems.forEach((child, i) => {
    const index = isVirtual ? range.start + i : i;
    if (separator && index > 0) {
      if (separator === true || separator === "strong") {
        rendered.push(
          <hr
            key={`sep-${index}`}
            className={`dk-stack-separator${separator === "strong" ? " dk-stack-separator-strong" : ""}`}
            role="separator"
            aria-orientation={isRow ? "vertical" : "horizontal"}
          />
        );
      } else if (React.isValidElement(separator)) {
        rendered.push(React.cloneElement(separator, { key: `sep-${index}` }));
      } else {
        rendered.push(
          <div key={`sep-${index}`} className="dk-stack-separator" role="separator">
            {separator}
          </div>
        );
      }
    }

    rendered.push(
      withItemWrapper(child, index, {
        stagger,
        lazy,
        list: listSemantics,
      })
    );
  });

  if (isVirtual) {
    const itemSize = virtualOpts.itemSize ?? 48;
    rendered.push(
      <div
        key="virtual-bottom"
        className="dk-stack-virtual-spacer"
        style={{ height: Math.max(0, (items.length - range.end) * itemSize) }}
        aria-hidden
      />
    );
  }

  const classes = [
    "dk-stack",
    inline ? "dk-stack-inline dk-inline" : "",
    isRow && !inline ? "dk-stack-h" : "",
    !isRow && !inline ? "dk-stack-v" : "",
    reverse ? "dk-stack-reverse" : "",
    nested ? "dk-stack-nested" : "",
    divided ? "dk-stack-divided" : "",
    collapseEmpty ? "dk-stack-collapse-empty" : "",
    animate ? "dk-stack-animate" : "",
    stagger ? "dk-stack-stagger" : "",
    motion ? "dk-stack-motion" : "",
    lazy ? "dk-stack-lazy" : "",
    isVirtual ? "dk-stack-virtual" : "",
    keyboardNav ? "dk-stack-nav" : "",
    equal ? "dk-stack-full" : "",
    justify !== "start" ? `dk-stack-justify-${justify}` : "",
    dirUtilities,
    gapUtilities,
    alignUtilities,
    wrapUtilities,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle: React.CSSProperties = {
    ...customGapStyle,
    ...(isVirtual
      ? {
          height:
            typeof virtualOpts.height === "number"
              ? `${virtualOpts.height}px`
              : virtualOpts.height ?? "20rem",
        }
      : null),
    ...style,
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (!keyboardNav || event.defaultPrevented) return;
    const root = rootRef.current;
    if (!root) return;

    const itemsEls = Array.from(root.children).filter((el) =>
      (el as HTMLElement).classList?.contains("dk-stack-item")
    ) as HTMLElement[];
    if (!itemsEls.length) return;

    const active = document.activeElement as HTMLElement | null;
    const idx = itemsEls.findIndex((el) => el === active || el.contains(active));
    if (idx < 0) return;

    const forward = isRow
      ? event.key === "ArrowRight" || event.key === "ArrowDown"
      : event.key === "ArrowDown" || event.key === "ArrowRight";
    const backward = isRow
      ? event.key === "ArrowLeft" || event.key === "ArrowUp"
      : event.key === "ArrowUp" || event.key === "ArrowLeft";

    if (!forward && !backward && event.key !== "Home" && event.key !== "End") return;

    event.preventDefault();
    let next = idx;
    if (forward) next = Math.min(itemsEls.length - 1, idx + 1);
    if (backward) next = Math.max(0, idx - 1);
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = itemsEls.length - 1;

    const target = itemsEls[next];
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.tabIndex = 0;
    target.focus();
  };

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={rootRef}
      {...props}
      className={classes}
      style={mergedStyle}
      data-direction={isRow ? "row" : "column"}
      role={listSemantics ? undefined : role ?? (keyboardNav ? "group" : undefined)}
      tabIndex={keyboardNav ? 0 : props.tabIndex}
      aria-orientation={keyboardNav ? (isRow ? "horizontal" : "vertical") : undefined}
      onKeyDown={handleKeyDown}
    >
      {rendered}
    </Tag>
  );
}

/** Alias — primary Stack API */
export const Stack = StackLayout;

/** Horizontal stack */
export function HStack(props: Omit<StackLayoutProps, "direction" | "inline">) {
  return <StackLayout direction="horizontal" {...props} />;
}

/** Vertical stack */
export function VStack(props: Omit<StackLayoutProps, "direction" | "inline">) {
  return <StackLayout direction="vertical" {...props} />;
}

/** Inline wrapping stack (chips, actions) */
export function InlineStack(props: Omit<StackLayoutProps, "inline" | "direction">) {
  return <StackLayout inline direction="horizontal" {...props} />;
}
