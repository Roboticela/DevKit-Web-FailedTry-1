import * as React from "react";

export type DensityMode = "compact" | "comfortable" | "spacious" | "custom";

export type DensityCustomVars = {
  /** Master scale (default 1) */
  scale?: number;
  /** Typography scale multiplier */
  typeScale?: number;
  /** Min touch target CSS length */
  touchMin?: string;
  /** Control height */
  controlHeight?: string;
  /** List / table row height */
  rowHeight?: string;
  tableRowHeight?: string;
  listItemHeight?: string;
  /** Also scale --space-* rhythm tokens */
  scaleSpace?: boolean;
};

export interface DensityContextValue {
  density: DensityMode;
  setDensity: (density: DensityMode) => void;
  custom: DensityCustomVars;
  setCustom: (vars: DensityCustomVars) => void;
  /** Resolved scale number */
  scale: number;
}

const DensityContext = React.createContext<DensityContextValue | null>(null);

const STORAGE_KEY_DEFAULT = "devkit-density";

const CUSTOM_VAR_MAP: Record<keyof Omit<DensityCustomVars, "scaleSpace">, string> = {
  scale: "--density-custom-scale",
  typeScale: "--density-custom-type",
  touchMin: "--density-custom-touch",
  controlHeight: "--density-custom-control",
  rowHeight: "--density-custom-row",
  tableRowHeight: "--density-custom-table-row",
  listItemHeight: "--density-custom-list-item",
};

function applyDensityToElement(
  el: HTMLElement,
  density: DensityMode,
  custom: DensityCustomVars
) {
  el.dataset.density = density;

  if (density === "custom") {
    for (const [key, cssVar] of Object.entries(CUSTOM_VAR_MAP) as [
      keyof typeof CUSTOM_VAR_MAP,
      string,
    ][]) {
      const value = custom[key];
      if (value == null) {
        el.style.removeProperty(cssVar);
        continue;
      }
      el.style.setProperty(cssVar, typeof value === "number" ? String(value) : value);
    }
    if (custom.scaleSpace) el.dataset.densityScaleSpace = "true";
    else delete el.dataset.densityScaleSpace;
  } else {
    for (const cssVar of Object.values(CUSTOM_VAR_MAP)) {
      el.style.removeProperty(cssVar);
    }
    delete el.dataset.densityScaleSpace;
  }
}

export interface DensityProviderProps {
  /** Controlled density */
  density?: DensityMode;
  /** Uncontrolled default */
  defaultDensity?: DensityMode;
  /** Persist preference (localStorage) */
  storageKey?: string | false;
  /** Apply to documentElement (default true) */
  syncDocument?: boolean;
  /** Custom mode variables */
  custom?: DensityCustomVars;
  onDensityChange?: (density: DensityMode) => void;
  onCustomChange?: (vars: DensityCustomVars) => void;
  children?: React.ReactNode;
}

/**
 * Application-wide density. Sets `data-density` on `<html>` so spacing, padding,
 * gap, type, icons, and touch targets adapt without per-component config.
 */
export function DensityProvider({
  density: densityProp,
  defaultDensity = "comfortable",
  storageKey = STORAGE_KEY_DEFAULT,
  syncDocument = true,
  custom: customProp,
  onDensityChange,
  onCustomChange,
  children,
}: DensityProviderProps) {
  const [internal, setInternal] = React.useState<DensityMode>(() => {
    if (densityProp) return densityProp;
    if (storageKey && typeof localStorage !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey) as DensityMode | null;
        if (
          saved === "compact" ||
          saved === "comfortable" ||
          saved === "spacious" ||
          saved === "custom"
        ) {
          return saved;
        }
      } catch {
        /* ignore */
      }
    }
    return defaultDensity;
  });

  const [customInternal, setCustomInternal] = React.useState<DensityCustomVars>(
    () => customProp ?? { scale: 1 }
  );

  const density = densityProp ?? internal;
  const custom = customProp ?? customInternal;

  const setDensity = React.useCallback(
    (next: DensityMode) => {
      if (densityProp == null) setInternal(next);
      onDensityChange?.(next);
      if (storageKey && typeof localStorage !== "undefined") {
        try {
          localStorage.setItem(storageKey, next);
        } catch {
          /* ignore */
        }
      }
    },
    [densityProp, onDensityChange, storageKey]
  );

  const setCustom = React.useCallback(
    (vars: DensityCustomVars) => {
      const next = { ...(customProp ?? customInternal), ...vars };
      if (customProp == null) setCustomInternal(next);
      onCustomChange?.(next);
      if (density !== "custom") setDensity("custom");
    },
    [customProp, customInternal, density, setDensity, onCustomChange]
  );

  React.useEffect(() => {
    if (!syncDocument || typeof document === "undefined") return;
    applyDensityToElement(document.documentElement, density, custom);
  }, [density, custom, syncDocument]);

  const scale =
    density === "compact"
      ? 0.85
      : density === "spacious"
        ? 1.15
        : density === "custom"
          ? custom.scale ?? 1
          : 1;

  const value = React.useMemo<DensityContextValue>(
    () => ({ density, setDensity, custom, setCustom, scale }),
    [density, setDensity, custom, setCustom, scale]
  );

  return <DensityContext.Provider value={value}>{children}</DensityContext.Provider>;
}

export function useDensity(): DensityContextValue {
  const ctx = React.useContext(DensityContext);
  if (!ctx) {
    return {
      density: "comfortable",
      setDensity: () => undefined,
      custom: {},
      setCustom: () => undefined,
      scale: 1,
    };
  }
  return ctx;
}

export interface DensityScopeProps extends React.HTMLAttributes<HTMLElement> {
  density: DensityMode;
  custom?: DensityCustomVars;
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

/** Nested density override — e.g. compact table inside comfortable page */
export function DensityScope({
  density,
  custom = {},
  as,
  className,
  style,
  children,
  ...rest
}: DensityScopeProps) {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    applyDensityToElement(el, density, custom);
  }, [density, custom]);

  const Tag = (as || "div") as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={["dk-density-scope", "dk-density-motion", className].filter(Boolean).join(" ")}
      style={style}
      data-dk-density={density}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Inline script for SSR — apply stored density before paint */
export function getDensityInitScript(storageKey = STORAGE_KEY_DEFAULT): string {
  return `(function(){try{var k=${JSON.stringify(storageKey)};var d=localStorage.getItem(k);if(d==="compact"||d==="spacious"||d==="custom"||d==="comfortable"){document.documentElement.dataset.density=d;}}catch(e){}})();`;
}

export function DensityScript({ storageKey = STORAGE_KEY_DEFAULT }: { storageKey?: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: getDensityInitScript(storageKey) }}
    />
  );
}

/** Presentational helpers */
export function DensityCard(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div className={["dk-density-card", "dk-density-motion", className].filter(Boolean).join(" ")} {...rest} />;
}

export function DensityRow(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div className={["dk-density-row", "dk-density-motion", className].filter(Boolean).join(" ")} {...rest} />;
}

export function DensityControl(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, type = "button", ...rest } = props;
  return (
    <button
      type={type}
      className={["dk-density-control", "dk-density-motion", className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}
