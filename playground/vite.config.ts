import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const ui = (name: string, file: string) =>
  resolve(
    __dirname,
    `../registry/components/${name}/vite-express-tauri/v1/files/src/components/ui/${file}`
  );

const style = (name: string, file: string) =>
  resolve(
    __dirname,
    `../registry/components/${name}/vite-express-tauri/v1/files/src/styles/${file}`
  );

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      "@devkit/color-tokens.css": style("color-tokens", "color-tokens.css"),
      "@devkit/typography-tokens.css": style("typography-tokens", "typography-tokens.css"),
      "@devkit/responsive-grid.css": style("responsive-grid", "responsive-grid.css"),
      "@devkit/responsive-spacing.css": style("responsive-spacing", "responsive-spacing.css"),
      "@devkit/theme-engine.css": style("dynamic-theme", "theme-engine.css"),
      "@devkit/surface-system.css": style("surface", "surface-system.css"),
      "@devkit/shape-system.css": style("rounded-corner", "shape-system.css"),
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
      "@devkit/ResponsiveGrid": ui("responsive-grid", "ResponsiveGrid.tsx"),
      "@devkit/Container": ui("container", "Container.tsx"),
      "@devkit/SafeArea": ui("safe-area", "SafeArea.tsx"),
      "@devkit/Surface": ui("surface", "Surface.tsx"),
      "@devkit/Overlay": ui("surface", "Overlay.tsx"),
      "@devkit/GlassSurface": ui("surface", "GlassSurface.tsx"),
      "@devkit/FrostedSurface": ui("surface", "FrostedSurface.tsx"),
      "@devkit/ShadowLayer": ui("surface", "ShadowLayer.tsx"),
      "@devkit/RoundedCorner": ui("rounded-corner", "RoundedCorner.tsx"),
      "@devkit/CircleShape": ui("rounded-corner", "CircleShape.tsx"),
      "@devkit/PillShape": ui("rounded-corner", "PillShape.tsx"),
      "@devkit/AvatarShape": ui("rounded-corner", "AvatarShape.tsx"),
      "@devkit/Border": ui("rounded-corner", "Border.tsx"),
      "@devkit/Divider": ui("rounded-corner", "Divider.tsx"),
      "@devkit/Section": ui("section", "Section.tsx"),
      "@devkit/StackLayout": ui("stack-layout", "StackLayout.tsx"),
      "@devkit/DensityProvider": ui("responsive-spacing", "DensityProvider.tsx"),
      "@devkit/Space": ui("responsive-spacing", "Space.tsx"),
      "@devkit/ThemeProvider": ui("dynamic-theme", "ThemeProvider.tsx"),
      "@devkit/theme": resolve(
        __dirname,
        "../registry/components/dynamic-theme/vite-express-tauri/v1/files/src/components/ui/theme.ts"
      ),
    },
  },
});
