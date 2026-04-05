"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: "var(--space-3) var(--space-4)",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--color-border)",
    background: "var(--color-bg)",
    color: "var(--color-text)",
    fontSize: "var(--text-base)",
    outline: "none",
  };

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

      {(["Name", "Email", "Password"] as const).map((field) => (
        <div key={field} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <label
            htmlFor={field.toLowerCase()}
            style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text)" }}
          >
            {field}
          </label>
          <input
            id={field.toLowerCase()}
            type={field === "Password" ? "password" : field === "Email" ? "email" : "text"}
            required
            value={field === "Name" ? name : field === "Email" ? email : password}
            onChange={(e) => {
              if (field === "Name") setName(e.target.value);
              else if (field === "Email") setEmail(e.target.value);
              else setPassword(e.target.value);
            }}
            style={inputStyle}
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
          fontSize: "var(--text-base)",
          fontWeight: "var(--weight-semibold)",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background var(--transition-fast)",
        }}
      >
        {loading ? "Creating account…" : "Create account"}
      </button>

      <p style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        Already have an account?{" "}
        <a href="/auth/login" style={{ color: "var(--color-primary)", fontWeight: "var(--weight-medium)" }}>
          Sign in
        </a>
      </p>
    </form>
  );
}
