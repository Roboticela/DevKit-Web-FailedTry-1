"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to send reset email");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg-subtle)",
        padding: "var(--space-4)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "var(--color-bg)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border)",
          padding: "var(--space-8)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {submitted ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>📬</div>
            <h1 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", color: "var(--color-text)" }}>
              Check your email
            </h1>
            <p style={{ marginTop: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
              We sent a password reset link to <strong>{email}</strong>
            </p>
            <a
              href="/auth/login"
              style={{
                display: "inline-block",
                marginTop: "var(--space-6)",
                color: "var(--color-primary)",
                fontSize: "var(--text-sm)",
              }}
            >
              ← Back to sign in
            </a>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
              <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", color: "var(--color-text)" }}>
                Forgot password?
              </h1>
              <p style={{ marginTop: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {error && (
              <div
                style={{
                  marginBottom: "var(--space-4)",
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

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <label htmlFor="email" style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text)" }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: "var(--space-3) var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg)",
                    color: "var(--color-text)",
                    fontSize: "var(--text-base)",
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
                  fontWeight: "var(--weight-semibold)",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
              <a
                href="/auth/login"
                style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}
              >
                ← Back to sign in
              </a>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
