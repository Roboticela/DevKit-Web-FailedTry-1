import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

function Home() {
  return (
    <main style={{ padding: "var(--space-8)", textAlign: "center" }}>
      {/* devkit:hero-section */}
      <h1 style={{ fontSize: "var(--text-4xl)", fontWeight: "var(--weight-bold)", color: "var(--color-primary)" }}>
        Test Vite+Express Project
      </h1>
      <p style={{ color: "var(--color-text-muted)", marginTop: "var(--space-4)" }}>
        Run <code>devkit add auth</code> to get started.
      </p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* devkit:auth:routes */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
