import categoriesCatalog from "@registry/categories.json";
import componentsIndex from "@registry/components/registry.json";
import pagesIndex from "@registry/pages/registry.json";
import scaffoldsIndex from "@registry/scaffolds/registry.json";

export type CategoryId = "components" | "pages" | "scaffolds";
export type PackageKind = "component" | "page" | "scaffold";

export type CatalogPackage = {
  id?: number;
  name: string;
  displayName: string;
  description: string;
  category: CategoryId;
  kind: PackageKind;
  stub?: boolean;
  templates: string[];
  platforms: string[];
  hasVariants: boolean;
  latestVersion: string;
  tags: string[];
  group?: string;
  groupName?: string;
  subgroup?: string;
  subgroupName?: string;
};

const KIND_BY_CATEGORY: Record<CategoryId, PackageKind> = {
  components: "component",
  pages: "page",
  scaffolds: "scaffold",
};

const metaModules = import.meta.glob("../../../registry/{components,pages,scaffolds}/*/component.json", {
  eager: true,
  import: "default",
}) as Record<string, Record<string, unknown>>;

function metaFor(category: CategoryId, name: string): Record<string, unknown> | null {
  const needle = `/${category}/${name}/component.json`;
  const entry = Object.entries(metaModules).find(([path]) => path.replace(/\\/g, "/").endsWith(needle));
  return entry?.[1] ?? null;
}

function normalizeList(
  category: CategoryId,
  list: Array<Record<string, unknown>> | undefined
): CatalogPackage[] {
  return (list ?? []).map((raw) => {
    const name = String(raw.name);
    const meta = metaFor(category, name) ?? {};
    return {
      id: (meta.id as number | undefined) ?? (raw.id as number | undefined),
      name,
      displayName: String(meta.displayName ?? raw.displayName ?? name),
      description: String(meta.description ?? raw.description ?? ""),
      category,
      kind: (meta.kind as PackageKind) ?? (raw.kind as PackageKind) ?? KIND_BY_CATEGORY[category],
      stub: Boolean(meta.stub ?? raw.stub),
      templates: (meta.templates as string[]) ?? (raw.templates as string[]) ?? [],
      platforms: (meta.platforms as string[]) ?? (raw.platforms as string[]) ?? [],
      hasVariants: Boolean(meta.hasVariants ?? raw.hasVariants),
      latestVersion: String(
        (meta.versions as { latest?: string } | undefined)?.latest ??
          raw.latestVersion ??
          "1.0.0"
      ),
      tags: (meta.tags as string[]) ?? (raw.tags as string[]) ?? [],
      group: meta.group as string | undefined,
      groupName: meta.groupName as string | undefined,
      subgroup: meta.subgroup as string | undefined,
      subgroupName: meta.subgroupName as string | undefined,
    };
  });
}

export const CATEGORIES = categoriesCatalog.categories as Array<{
  id: CategoryId;
  name: string;
  description: string;
  directory: string;
}>;

export function listAllPackages(): CatalogPackage[] {
  return [
    ...normalizeList("components", componentsIndex.components as Array<Record<string, unknown>>),
    ...normalizeList("pages", (pagesIndex as { pages?: Array<Record<string, unknown>> }).pages),
    ...normalizeList(
      "scaffolds",
      (scaffoldsIndex as { scaffolds?: Array<Record<string, unknown>> }).scaffolds
    ),
  ].sort((a, b) => (a.id ?? 0) - (b.id ?? 0) || a.name.localeCompare(b.name));
}

export function getPackage(kind: CategoryId, name: string): CatalogPackage | undefined {
  return listAllPackages().find((p) => p.category === kind && p.name === name);
}

export function filterPackages(
  packages: CatalogPackage[],
  opts: { category?: CategoryId; query?: string; subgroup?: string }
): CatalogPackage[] {
  const q = opts.query?.trim().toLowerCase() ?? "";
  return packages.filter((p) => {
    if (opts.category && p.category !== opts.category) return false;
    if (opts.subgroup && opts.subgroup !== "all" && p.subgroup !== opts.subgroup) return false;
    if (!q) return true;
    const hay = [p.name, p.displayName, p.description, ...(p.tags ?? [])]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function subgroupsFor(packages: CatalogPackage[]): Array<{ id: string; label: string }> {
  const map = new Map<string, string>();
  for (const p of packages) {
    if (p.subgroup) map.set(p.subgroup, p.subgroupName ?? p.subgroup);
  }
  return [{ id: "all", label: "All" }, ...[...map.entries()].map(([id, label]) => ({ id, label }))];
}

export function packagePath(pkg: CatalogPackage): string {
  return `/package/${pkg.category}/${pkg.name}`;
}
