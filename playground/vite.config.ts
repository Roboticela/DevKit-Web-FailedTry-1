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
      "@devkit/container-system.css": style("container", "container-system.css"),
      "@devkit/stack-system.css": style("stack-layout", "stack-system.css"),
      "@devkit/flex-system.css": style("flex-layout", "flex-system.css"),
      "@devkit/spacer-system.css": style("spacer", "spacer-system.css"),
      "@devkit/section-system.css": style("section", "section-system.css"),
      "@devkit/safe-area-system.css": style("safe-area", "safe-area-system.css"),
      "@devkit/aspect-system.css": style("aspect-ratio", "aspect-system.css"),
      "@devkit/visibility-system.css": style(
        "responsive-visibility",
        "visibility-system.css"
      ),
      "@devkit/breakpoint-system.css": style(
        "device-detector",
        "breakpoint-system.css"
      ),
      "@devkit/responsive-spacing.css": style("responsive-spacing", "responsive-spacing.css"),
      "@devkit/theme-engine.css": style("dynamic-theme", "theme-engine.css"),
      "@devkit/elevation-system.css": style("elevation-tokens", "elevation-system.css"),
      "@devkit/motion-system.css": style("motion-tokens", "motion-system.css"),
      "@devkit/surface-system.css": style("surface", "surface-system.css"),
      "@devkit/shape-system.css": style("rounded-corner", "shape-system.css"),
      "@devkit/icon-system.css": style("icon", "icon-system.css"),
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
      "@devkit/AspectRatio": ui("aspect-ratio", "AspectRatio.tsx"),
      "@devkit/ResponsiveVisibility": ui(
        "responsive-visibility",
        "ResponsiveVisibility.tsx"
      ),
      "@devkit/BreakpointManager": ui("device-detector", "BreakpointManager.tsx"),
      "@devkit/DeviceDetector": ui("device-detector", "DeviceDetector.tsx"),
      "@devkit/Surface": ui("surface", "Surface.tsx"),
      "@devkit/Overlay": ui("surface", "Overlay.tsx"),
      "@devkit/GlassSurface": ui("surface", "GlassSurface.tsx"),
      "@devkit/FrostedSurface": ui("surface", "FrostedSurface.tsx"),
      "@devkit/RoundedCorner": ui("rounded-corner", "RoundedCorner.tsx"),
      "@devkit/CircleShape": ui("rounded-corner", "CircleShape.tsx"),
      "@devkit/PillShape": ui("rounded-corner", "PillShape.tsx"),
      "@devkit/AvatarShape": ui("rounded-corner", "AvatarShape.tsx"),
      "@devkit/Border": ui("rounded-corner", "Border.tsx"),
      "@devkit/Divider": ui("rounded-corner", "Divider.tsx"),
      "@devkit/Section": ui("section", "Section.tsx"),
      "@devkit/StackLayout": ui("stack-layout", "StackLayout.tsx"),
      "@devkit/FlexLayout": ui("flex-layout", "FlexLayout.tsx"),
      "@devkit/Spacer": ui("spacer", "Spacer.tsx"),
      "@devkit/DensityProvider": ui("responsive-spacing", "DensityProvider.tsx"),
      "@devkit/Space": ui("responsive-spacing", "Space.tsx"),
      "@devkit/ThemeProvider": ui("dynamic-theme", "ThemeProvider.tsx"),
      "@devkit/Elevation": ui("elevation-tokens", "Elevation.tsx"),
      "@devkit/ShadowLayer": ui("elevation-tokens", "ShadowLayer.tsx"),
      "@devkit/Motion": ui("motion-tokens", "Motion.tsx"),
      "@devkit/MotionPresets": ui("motion-tokens", "MotionPresets.tsx"),
      "@devkit/useReducedMotion": ui("motion-tokens", "useReducedMotion.ts"),
      "@devkit/Icon": ui("icon", "Icon.tsx"),
      "@devkit/IconExtras": ui("icon", "IconExtras.tsx"),
      "@devkit/theme": resolve(
        __dirname,
        "../registry/components/dynamic-theme/vite-express-tauri/v1/files/src/components/ui/theme.ts"
      ),
    },
  },
});
