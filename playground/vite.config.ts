import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(root, "..");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@registry": path.join(repoRoot, "registry"),
      "@devkit-theme": path.join(repoRoot, "cli/src/lib/theme.ts"),
    },
  },
  server: {
    port: 5173,
    open: true,
    fs: {
      allow: [repoRoot],
    },
  },
});
