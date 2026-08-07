import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import componentsRouter from "./routes/components.js";
import { getCategoriesCatalog } from "./lib/registry.js";

const app = new Hono();

app.use("*", logger());
app.use("*", cors({ origin: "*" }));

app.get("/health", (c) => c.json({ ok: true, version: "1.0.0", uptime: process.uptime() }));

app.get("/api/v1/categories", (c) => c.json(getCategoriesCatalog()));
app.route("/api/v1/components", componentsRouter);

app.notFound((c) => c.json({ message: "Not found" }, 404));

const PORT = Number(process.env.PORT ?? 4000);

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`\n  DevKit Registry running at http://localhost:${PORT}\n`);
  console.log(`     GET  /health`);
  console.log(`     GET  /api/v1/categories`);
  console.log(`     GET  /api/v1/components`);
  console.log(`     GET  /api/v1/components?category=components|pages|scaffolds`);
  console.log(`     GET  /api/v1/components/:name`);
  console.log(`     GET  /api/v1/components/:name/manifest?template=&version=&variant=\n`);
});

export default app;
