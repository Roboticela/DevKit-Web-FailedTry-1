import { Hono } from "hono";
import {
  listPackages,
  getComponentMeta,
  resolveVersion,
  getManifest,
  type PackageKind,
  type CategoryId,
} from "../lib/registry.js";

const app = new Hono();

function packageKind(comp: { kind?: PackageKind; category?: string }): PackageKind {
  if (comp.kind === "component" || comp.kind === "page" || comp.kind === "scaffold") {
    return comp.kind;
  }
  if (comp.category === "pages") return "page";
  if (comp.category === "scaffolds") return "scaffold";
  return "component";
}

function asCategory(value: string | undefined): CategoryId | undefined {
  if (value === "components" || value === "pages" || value === "scaffolds") return value;
  return undefined;
}

function asKind(value: string | undefined): PackageKind | undefined {
  if (value === "component" || value === "page" || value === "scaffold") return value;
  return undefined;
}

// GET /api/v1/components
app.get("/", (c) => {
  const template = c.req.query("template");
  const category = asCategory(c.req.query("category") ?? undefined);
  const kind = asKind(c.req.query("kind") ?? undefined);

  const list = listPackages({ template: template ?? undefined, category, kind }).map((comp) => ({
    ...comp,
    kind: packageKind(comp),
  }));

  return c.json({ components: list, total: list.length });
});

// GET /api/v1/components/:name
app.get("/:name", (c) => {
  const { name } = c.req.param();
  const meta = getComponentMeta(name);
  if (!meta) return c.json({ message: "Package not found" }, 404);
  return c.json({
    ...meta,
    kind: packageKind(meta as { kind?: PackageKind; category?: string }),
  });
});

// GET /api/v1/components/:name/versions
app.get("/:name/versions", (c) => {
  const { name } = c.req.param();
  const meta = getComponentMeta(name);
  if (!meta) return c.json({ message: "Package not found" }, 404);
  return c.json((meta["versions"] as { history: unknown[] }).history);
});

// GET /api/v1/components/:name/variants
app.get("/:name/variants", (c) => {
  const { name } = c.req.param();
  const meta = getComponentMeta(name);
  if (!meta) return c.json({ message: "Package not found" }, 404);
  if (!meta["hasVariants"]) return c.json({ variants: [] });
  return c.json({ variants: meta["variants"] ?? [] });
});

// GET /api/v1/components/:name/manifest?template=...&version=...&variant=...
app.get("/:name/manifest", (c) => {
  const { name } = c.req.param();
  const template = c.req.query("template");
  const versionReq = c.req.query("version") ?? "latest";
  const variant = c.req.query("variant");

  if (!template) return c.json({ message: "template query param required" }, 400);

  const version = resolveVersion(name, versionReq);
  if (!version) return c.json({ message: "Package or version not found" }, 404);

  const manifest = getManifest(name, template, version, variant);
  if (!manifest) return c.json({ message: "Manifest not found for this template/version/variant" }, 404);

  return c.json({ name, template, version, variant: variant ?? null, manifest });
});

export default app;
