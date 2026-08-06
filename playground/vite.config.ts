import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      "@devkit/color-tokens.css": resolve(
        __dirname,
        "../registry/components/color-tokens/vite-express-tauri/v1/files/src/styles/color-tokens.css"
      ),
    },
  },
});
