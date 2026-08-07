/** Package kinds map 1:1 to registry categories. */
export type PackageKind = "component" | "page" | "scaffold";

export type CategoryId = "components" | "pages" | "scaffolds";

export const KIND_CATEGORY: Record<PackageKind, CategoryId> = {
  component: "components",
  page: "pages",
  scaffold: "scaffolds",
};

export interface ComponentEntry {
  id?: number;
  name: string;
  displayName: string;
  description: string;
  category: CategoryId | string;
  group?: string;
  groupName?: string;
  subgroup?: string;
  subgroupName?: string;
  kind: PackageKind;
  stub?: boolean;
  templates: string[];
  platforms: string[];
  hasVariants: boolean;
  variants?: { id: string; label: string; description: string }[];
  latestVersion: string;
  tags: string[];
  /** @deprecated Removed — use category instead */
  layer?: number;
}

export function normalizeKind(value: unknown): PackageKind {
  if (value === "page") return "page";
  if (value === "scaffold") return "scaffold";
  return "component";
}

export function normalizeCategory(value: unknown): CategoryId | undefined {
  if (value === "components" || value === "pages" || value === "scaffolds") return value;
  return undefined;
}

/** @deprecated Layers removed — kept so old call sites compile until cleaned up */
export function normalizeLayer(_value: unknown): undefined {
  return undefined;
}

export interface ListComponentsFilters {
  template?: string;
  kind?: PackageKind;
  category?: string;
  group?: string;
  /** @deprecated */
  layer?: number;
}
