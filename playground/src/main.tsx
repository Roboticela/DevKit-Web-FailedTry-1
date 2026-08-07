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
import "../../registry/components/command-button/vite-express-tauri/v1/files/src/styles/command-button.css";
import "../../registry/components/text-input/vite-express-tauri/v1/files/src/styles/text-input.css";
import "../../registry/components/textarea/vite-express-tauri/v1/files/src/styles/textarea.css";
import "../../registry/components/search-field/vite-express-tauri/v1/files/src/styles/search-field.css";
import "../../registry/components/number-input/vite-express-tauri/v1/files/src/styles/number-input.css";
import "../../registry/components/password-input/vite-express-tauri/v1/files/src/styles/password-input.css";
import "../../registry/components/otp-input/vite-express-tauri/v1/files/src/styles/otp-input.css";
import "../../registry/components/date-input/vite-express-tauri/v1/files/src/styles/date-input.css";
import "../../registry/components/time-input/vite-express-tauri/v1/files/src/styles/time-input.css";
import "../../registry/components/date-time-input/vite-express-tauri/v1/files/src/styles/date-time-input.css";
import "../../registry/components/input-group/vite-express-tauri/v1/files/src/styles/input-group.css";
import "../../registry/components/checkbox/vite-express-tauri/v1/files/src/styles/checkbox.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
