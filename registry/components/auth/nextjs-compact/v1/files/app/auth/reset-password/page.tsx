"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to reset password");
      }
      router.push("/auth/login?reset=success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p style={{ color: "var(--color-error)", textAlign: "center" }}>
        Invalid or missing reset token.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {error && (
        <div
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
      {(["New password", "Confirm password"] as const).map((label) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <label style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text)" }}>
            {label}
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={label === "New password" ? password : confirm}
            onChange={(e) => label === "New password" ? setPassword(e.target.value) : setConfirm(e.target.value)}
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
      ))}
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
        {loading ? "Resetting…" : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", color: "var(--color-text)" }}>
            Reset password
          </h1>
          <p style={{ marginTop: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
            Choose a new password for your account.
          </p>
        </div>
        <Suspense fallback={<p>Loading…</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </main>
  );
}
