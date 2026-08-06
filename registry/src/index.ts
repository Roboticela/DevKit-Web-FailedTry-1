import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import componentsRouter from "./routes/components.js";
import { getLayersCatalog } from "./lib/registry.js";

const app = new Hono();

app.use("*", logger());
app.use("*", cors({ origin: "*" }));

// Health
app.get("/health", (c) => c.json({ ok: true, version: "1.0.0", uptime: process.uptime() }));

// API v1
app.get("/api/v1/layers", (c) => {
  const catalog = getLayersCatalog();
  if (!catalog) return c.json({ message: "Layers catalog not found" }, 404);
  return c.json(catalog);
});
app.route("/api/v1/components", componentsRouter);

// 404
app.notFound((c) => c.json({ message: "Not found" }, 404));

const PORT = Number(process.env.PORT ?? 4000);

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`\n  🚀 DevKit Registry running at http://localhost:${PORT}\n`);
  console.log(`     GET  /health`);
  console.log(`     GET  /api/v1/layers`);
  console.log(`     GET  /api/v1/components`);
  console.log(`     GET  /api/v1/components?layer=1&kind=component`);
  console.log(`     GET  /api/v1/components/:name`);
  console.log(`     GET  /api/v1/components/:name/manifest?template=&version=&variant=\n`);
});

export default app;
