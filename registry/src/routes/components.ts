import { Hono } from "hono";
import { getRegistryIndex, getComponentMeta, resolveVersion, getManifest } from "../lib/registry.js";

const app = new Hono();

// GET /api/v1/components
app.get("/", (c) => {
  const template = c.req.query("template");
  const category = c.req.query("category");
  const index = getRegistryIndex();

  let list = index.components;
  if (template) list = list.filter((comp) => comp.templates.includes(template));
  if (category) list = list.filter((comp) => comp.category === category);

  return c.json({ components: list, total: list.length });
});

// GET /api/v1/components/:name
app.get("/:name", (c) => {
  const { name } = c.req.param();
  const meta = getComponentMeta(name);
  if (!meta) return c.json({ message: "Component not found" }, 404);
  return c.json(meta);
});

// GET /api/v1/components/:name/versions
app.get("/:name/versions", (c) => {
  const { name } = c.req.param();
  const meta = getComponentMeta(name);
  if (!meta) return c.json({ message: "Component not found" }, 404);
  return c.json((meta["versions"] as { history: unknown[] }).history);
});

// GET /api/v1/components/:name/variants
app.get("/:name/variants", (c) => {
  const { name } = c.req.param();
  const meta = getComponentMeta(name);
  if (!meta) return c.json({ message: "Component not found" }, 404);
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
  if (!version) return c.json({ message: "Component or version not found" }, 404);

  const manifest = getManifest(name, template, version, variant);
  if (!manifest) return c.json({ message: "Manifest not found for this template/version/variant" }, 404);

  return c.json({ name, template, version, variant: variant ?? null, manifest });
});

export default app;
