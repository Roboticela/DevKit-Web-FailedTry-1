export function HeroSection({
  headline = "Build faster. Ship smarter.",
  subheadline = "The DevKit that turns your ideas into production-ready apps in minutes.",
  primaryCta = { label: "Get started", href: "/auth/register" },
  secondaryCta = { label: "View docs", href: "/docs" },
}: {
  headline?: string;
  subheadline?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "var(--space-24) var(--space-4)",
        gap: "var(--space-6)",
        background: "var(--color-bg)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          padding: "var(--space-1) var(--space-3)",
          borderRadius: "var(--radius-full)",
          background: "var(--color-primary-subtle)",
          color: "var(--color-primary)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--weight-medium)",
        }}
      >
        Now in public beta
      </span>

      <h1
        style={{
          fontSize: "clamp(var(--text-4xl), 6vw, var(--text-6xl))",
          fontWeight: "var(--weight-extrabold)",
          fontFamily: "var(--font-display)",
          color: "var(--color-text)",
          lineHeight: "var(--leading-tight)",
          maxWidth: "720px",
        }}
      >
        {headline}
      </h1>

      <p
        style={{
          fontSize: "var(--text-xl)",
          color: "var(--color-text-muted)",
          maxWidth: "560px",
          lineHeight: "var(--leading-relaxed)",
        }}
      >
        {subheadline}
      </p>

      <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href={primaryCta.href}
          style={{
            padding: "var(--space-3) var(--space-8)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-primary)",
            color: "var(--color-primary-text)",
            fontSize: "var(--text-base)",
            fontWeight: "var(--weight-semibold)",
            textDecoration: "none",
            transition: "background var(--transition-fast)",
          }}
        >
          {primaryCta.label}
        </a>
        <a
          href={secondaryCta.href}
          style={{
            padding: "var(--space-3) var(--space-8)",
            borderRadius: "var(--radius-md)",
            background: "transparent",
            color: "var(--color-text)",
            fontSize: "var(--text-base)",
            fontWeight: "var(--weight-semibold)",
            textDecoration: "none",
            border: "1px solid var(--color-border)",
            transition: "border-color var(--transition-fast)",
          }}
        >
          {secondaryCta.label}
        </a>
      </div>
    </section>
  );
}
