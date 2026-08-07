/** Small UI building blocks vs full app features (auth, billing, heroes). */
export type PackageKind = "component" | "scaffold";

export type ComponentLayer = 1 | 2 | 3 | 4 | 5;

export type ComponentCategory =
  | "foundation"
  | "basic"
  | "composite"
  | "advanced"
  | "templates";

export const LAYER_CATEGORY: Record<ComponentLayer, ComponentCategory> = {
  1: "foundation",
  2: "basic",
  3: "composite",
  4: "advanced",
  5: "templates",
};

export const LAYER_ID_RANGE: Record<ComponentLayer, { min: number; max: number }> = {
  1: { min: 1, max: 100 },
  2: { min: 101, max: 500 },
  3: { min: 501, max: 1500 },
  4: { min: 1501, max: 2500 },
  5: { min: 2501, max: 3000 },
};

export interface ComponentEntry {
  /** Stable catalog ID within the layer ranges (1–3000). Required for UI components. */
  id?: number;
  name: string;
  displayName: string;
  description: string;
  /** Layer slug for components; free-form topic for scaffolds. */
  category: string;
  /** Parent group (e.g. foundations-interface-primitives). */
  group?: string;
  groupName?: string;
  /** Subgroup within a parent group (e.g. interaction-controls). */
  subgroup?: string;
  subgroupName?: string;
  /** `component` = reusable UI; `scaffold` = full feature (empty for now). */
  kind: PackageKind;
  /** 1 Foundation … 5 Templates — set on reusable components. */
  layer?: ComponentLayer;
  /** Empty stub awaiting implementation. */
  stub?: boolean;
  templates: string[];
  platforms: string[];
  hasVariants: boolean;
  variants?: { id: string; label: string; description: string }[];
  latestVersion: string;
  tags: string[];
}

export function normalizeKind(value: unknown): PackageKind {
  return value === "component" ? "component" : "scaffold";
}

export function normalizeLayer(value: unknown): ComponentLayer | undefined {
  const n = typeof value === "string" ? Number(value) : value;
  if (n === 1 || n === 2 || n === 3 || n === 4 || n === 5) return n;
  return undefined;
}

export function normalizeCategory(value: unknown): ComponentCategory | undefined {
  if (
    value === "foundation" ||
    value === "basic" ||
    value === "composite" ||
    value === "advanced" ||
    value === "templates"
  ) {
    return value;
  }
  return undefined;
}

/** Filters for listing registry packages (components + scaffolds). */
export interface ListComponentsFilters {
  template?: string;
  kind?: PackageKind;
  layer?: ComponentLayer;
  category?: string;
  group?: string;
}
