import Image from "next/image";

export function HeroSection({
  headline = "Build faster. Ship smarter.",
  subheadline = "The DevKit that turns your ideas into production-ready apps in minutes.",
  primaryCta = { label: "Get started", href: "/auth/register" },
  secondaryCta = { label: "View docs", href: "/docs" },
  imageSrc = "/hero-screenshot.png",
  imageAlt = "App screenshot",
}: {
  headline?: string;
  subheadline?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "var(--space-16)",
        alignItems: "center",
        padding: "var(--space-20) var(--space-8)",
        maxWidth: "1280px",
        margin: "0 auto",
        background: "var(--color-bg)",
      }}
    >
      {/* Left — Text */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        <span
          style={{
            display: "inline-block",
            padding: "var(--space-1) var(--space-3)",
            borderRadius: "var(--radius-full)",
            background: "var(--color-primary-subtle)",
            color: "var(--color-primary)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-medium)",
            width: "fit-content",
          }}
        >
          Now in public beta
        </span>

        <h1
          style={{
            fontSize: "clamp(var(--text-3xl), 4vw, var(--text-5xl))",
            fontWeight: "var(--weight-extrabold)",
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
            lineHeight: "var(--leading-tight)",
          }}
        >
          {headline}
        </h1>

        <p style={{ fontSize: "var(--text-lg)", color: "var(--color-text-muted)", lineHeight: "var(--leading-relaxed)" }}>
          {subheadline}
        </p>

        <div style={{ display: "flex", gap: "var(--space-4)" }}>
          <a
            href={primaryCta.href}
            style={{
              padding: "var(--space-3) var(--space-6)",
              borderRadius: "var(--radius-md)",
              background: "var(--color-primary)",
              color: "var(--color-primary-text)",
              fontWeight: "var(--weight-semibold)",
              textDecoration: "none",
              fontSize: "var(--text-base)",
            }}
          >
            {primaryCta.label}
          </a>
          <a
            href={secondaryCta.href}
            style={{
              padding: "var(--space-3) var(--space-6)",
              borderRadius: "var(--radius-md)",
              background: "transparent",
              color: "var(--color-text)",
              fontWeight: "var(--weight-semibold)",
              textDecoration: "none",
              border: "1px solid var(--color-border)",
              fontSize: "var(--text-base)",
            }}
          >
            {secondaryCta.label}
          </a>
        </div>
      </div>

      {/* Right — Image */}
      <div
        style={{
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <Image src={imageSrc} alt={imageAlt} width={720} height={480} style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
    </section>
  );
}
