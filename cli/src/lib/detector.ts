import { existsSync, readFileSync } from "fs";
import { join } from "path";

export type TemplateId = "nextjs-compact" | "vite-express-tauri" | "unknown";

export function detectTemplate(cwd = process.cwd()): TemplateId {
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) return "unknown";

  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as Record<string, unknown>;
  const deps = { ...(pkg["dependencies"] as Record<string,string> ?? {}), ...(pkg["devDependencies"] as Record<string,string> ?? {}) };

  // Next.js check
  if ("next" in deps) return "nextjs-compact";

  // Vite + Tauri check
  if ("vite" in deps && existsSync(join(cwd, "src-tauri"))) return "vite-express-tauri";
  if ("vite" in deps && existsSync(join(cwd, "server"))) return "vite-express-tauri";

  return "unknown";
}
