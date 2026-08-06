import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@devkit/color-tokens.css";
import "@devkit/typography-tokens.css";
import "@devkit/responsive-spacing.css";
import "@devkit/theme-engine.css";
import "@devkit/elevation-system.css";
import "@devkit/motion-system.css";
import "@devkit/shape-system.css";
import "@devkit/icon-system.css";
import "@devkit/surface-system.css";
import "@devkit/responsive-grid.css";
import "@devkit/container-system.css";
import "@devkit/stack-system.css";
import "@devkit/flex-system.css";
import "@devkit/spacer-system.css";
import "@devkit/section-system.css";
import "@devkit/safe-area-system.css";
import "@devkit/aspect-system.css";
import "@devkit/visibility-system.css";
import "@devkit/breakpoint-system.css";
import "./app.css";
import { ThemeProvider } from "@devkit/ThemeProvider";
import { SafeAreaProvider } from "@devkit/SafeArea";
import { BreakpointProvider } from "@devkit/BreakpointManager";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="devkit-theme">
      <BreakpointProvider ssrBreakpoint="md" syncDocument syncCssVars>
        <SafeAreaProvider>
          <App />
        </SafeAreaProvider>
      </BreakpointProvider>
    </ThemeProvider>
  </StrictMode>
);
