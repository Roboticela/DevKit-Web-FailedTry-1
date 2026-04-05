"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {error && (
        <div
          role="alert"
          style={{
            padding: "var(--space-3) var(--space-4)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-error-subtle)",
            color: "var(--color-error-text)",
            fontSize: "var(--text-sm)",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <label htmlFor="email" style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text)" }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "var(--space-3) var(--space-4)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg)",
            color: "var(--color-text)",
            fontSize: "var(--text-base)",
            outline: "none",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label htmlFor="password" style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text)" }}>
            Password
          </label>
          <a href="/auth/forgot-password" style={{ fontSize: "var(--text-sm)", color: "var(--color-primary)" }}>
            Forgot password?
          </a>
        </div>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "var(--space-3) var(--space-4)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg)",
            color: "var(--color-text)",
            fontSize: "var(--text-base)",
            outline: "none",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "var(--space-3) var(--space-4)",
          borderRadius: "var(--radius-md)",
          background: loading ? "var(--color-bg-muted)" : "var(--color-primary)",
          color: "var(--color-primary-text)",
          fontSize: "var(--text-base)",
          fontWeight: "var(--weight-semibold)",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background var(--transition-fast)",
        }}
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <p style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        No account?{" "}
        <a href="/auth/register" style={{ color: "var(--color-primary)", fontWeight: "var(--weight-medium)" }}>
          Create one
        </a>
      </p>
    </form>
  );
}
