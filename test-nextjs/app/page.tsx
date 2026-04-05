export default function Home() {
  return (
    <main style={{ padding: "var(--space-8)", textAlign: "center" }}>
      {/* devkit:hero-section */}
      <h1 style={{ fontSize: "var(--text-4xl)", fontWeight: "var(--weight-bold)", color: "var(--color-primary)" }}>
        Test NextJS Project
      </h1>
      <p style={{ color: "var(--color-text-muted)", marginTop: "var(--space-4)" }}>
        Run <code>devkit add auth</code> or <code>devkit add hero-section --variant=centered</code> to get started.
      </p>
    </main>
  );
}
