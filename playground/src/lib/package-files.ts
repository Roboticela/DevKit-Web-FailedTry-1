const docsModules = import.meta.glob(
  "../../../registry/components/*/vite-express-tauri/v1/files/docs/*.{md,MD}",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
) as Record<string, string>;

const sourceModules = import.meta.glob(
  "../../../registry/components/*/vite-express-tauri/v1/files/src/components/ui/*.{tsx,ts}",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
) as Record<string, string>;

export function getPackageDocs(_category: string, name: string): string | null {
  const needle = `/components/${name}/`;
  const entry = Object.entries(docsModules).find(([path]) => path.includes(needle));
  return entry?.[1] ?? null;
}

export function getPackageSource(_category: string, name: string): string | null {
  const needle = `/components/${name}/`;
  const entries = Object.entries(sourceModules).filter(([path]) => path.includes(needle));
  if (entries.length === 0) return null;

  const pascal = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");

  const exact = entries.find(([path]) => path.endsWith(`/${pascal}.tsx`));
  if (exact) return exact[1];

  entries.sort(([a], [b]) => a.length - b.length);
  return entries[0]?.[1] ?? null;
}
