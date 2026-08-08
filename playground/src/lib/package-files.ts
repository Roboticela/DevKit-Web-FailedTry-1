const docsModules = import.meta.glob(
  "../../../registry/{components,pages}/*/vite-express-tauri/v1/files/docs/*.{md,MD}",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
) as Record<string, string>;

const sourceModules = import.meta.glob(
  "../../../registry/{components,pages}/*/vite-express-tauri/v1/files/src/components/ui/*.{tsx,ts}",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
) as Record<string, string>;

export function getPackageDocs(category: string, name: string): string | null {
  const needle = `/${category}/${name}/`;
  const entry = Object.entries(docsModules).find(([path]) => path.replace(/\\/g, "/").includes(needle));
  return entry?.[1] ?? null;
}

export function getPackageSource(category: string, name: string): string | null {
  const needle = `/${category}/${name}/`;
  const entries = Object.entries(sourceModules).filter(([path]) =>
    path.replace(/\\/g, "/").includes(needle)
  );
  if (entries.length === 0) return null;

  const pascal = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");

  const exact = entries.find(([path]) => path.replace(/\\/g, "/").endsWith(`/${pascal}.tsx`));
  if (exact) return exact[1];

  entries.sort(([a], [b]) => a.length - b.length);
  return entries[0]?.[1] ?? null;
}
