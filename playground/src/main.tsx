import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@devkit/color-tokens.css";
import "./app.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
