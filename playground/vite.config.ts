import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const ui = (name: string, file: string) =>
  resolve(
    __dirname,
    `../registry/components/${name}/vite-express-tauri/v1/files/src/components/ui/${file}`
  );

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
      "@devkit/typography-tokens.css": resolve(
        __dirname,
        "../registry/components/typography-tokens/vite-express-tauri/v1/files/src/styles/typography-tokens.css"
      ),
      "@devkit/DisplayText": ui("display-text", "DisplayText.tsx"),
      "@devkit/Heading": ui("heading", "Heading.tsx"),
      "@devkit/Title": ui("title", "Title.tsx"),
      "@devkit/Subtitle": ui("subtitle", "Subtitle.tsx"),
      "@devkit/BodyText": ui("body-text", "BodyText.tsx"),
      "@devkit/Caption": ui("caption", "Caption.tsx"),
      "@devkit/Label": ui("label", "Label.tsx"),
      "@devkit/HelperText": ui("helper-text", "HelperText.tsx"),
      "@devkit/CodeText": ui("code-text", "CodeText.tsx"),
      "@devkit/NumericDisplay": ui("numeric-display", "NumericDisplay.tsx"),
    },
  },
});
