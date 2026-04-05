import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
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
          <h1
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: "var(--weight-bold)",
              color: "var(--color-text)",
              fontFamily: "var(--font-display)",
            }}
          >
            Welcome back
          </h1>
          <p style={{ marginTop: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
            Sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
