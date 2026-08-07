import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";
import "../../registry/components/button/vite-express-tauri/v1/files/src/styles/button.css";
import "../../registry/components/icon-button/vite-express-tauri/v1/files/src/styles/icon-button.css";
import "../../registry/components/button-group/vite-express-tauri/v1/files/src/styles/button-group.css";
import "../../registry/components/split-button/vite-express-tauri/v1/files/src/styles/split-button.css";
import "../../registry/components/link-button/vite-express-tauri/v1/files/src/styles/link-button.css";
import "../../registry/components/floating-action-button/vite-express-tauri/v1/files/src/styles/floating-action-button.css";
import "../../registry/components/toggle-button/vite-express-tauri/v1/files/src/styles/toggle-button.css";
import "../../registry/components/segmented-control/vite-express-tauri/v1/files/src/styles/segmented-control.css";
import "../../registry/components/action-menu-trigger/vite-express-tauri/v1/files/src/styles/action-menu-trigger.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
