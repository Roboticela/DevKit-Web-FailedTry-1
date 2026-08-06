import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@devkit/color-tokens.css";
import "@devkit/typography-tokens.css";
import "@devkit/responsive-spacing.css";
import "@devkit/theme-engine.css";
import "@devkit/shape-system.css";
import "@devkit/surface-system.css";
import "@devkit/responsive-grid.css";
import "./app.css";
import { ThemeProvider } from "@devkit/ThemeProvider";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="devkit-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
);
