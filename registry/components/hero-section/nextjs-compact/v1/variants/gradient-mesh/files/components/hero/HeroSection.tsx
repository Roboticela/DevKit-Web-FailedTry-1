"use client";

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
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "var(--space-20) var(--space-4)",
        gap: "var(--space-6)",
        overflow: "hidden",
        background: "var(--color-bg)",
      }}
    >
      {/* Animated gradient blobs */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "60%",
            height: "60%",
            borderRadius: "var(--radius-full)",
            background: "var(--color-primary)",
            opacity: 0.15,
            filter: "blur(80px)",
            animation: "drift1 12s ease-in-out infinite alternate",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "60%",
            height: "60%",
            borderRadius: "var(--radius-full)",
            background: "var(--color-secondary)",
            opacity: 0.12,
            filter: "blur(80px)",
            animation: "drift2 15s ease-in-out infinite alternate",
          }}
        />
      </div>

      <style>{`
        @keyframes drift1 { from { transform: translate(0,0) scale(1); } to { transform: translate(5%,8%) scale(1.1); } }
        @keyframes drift2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-5%,-8%) scale(1.15); } }
      `}</style>

      {/* Content */}
      <span
        style={{
          position: "relative",
          zIndex: 1,
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
          position: "relative",
          zIndex: 1,
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
          position: "relative",
          zIndex: 1,
          fontSize: "var(--text-xl)",
          color: "var(--color-text-muted)",
          maxWidth: "560px",
          lineHeight: "var(--leading-relaxed)",
        }}
      >
        {subheadline}
      </p>

      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "var(--space-4)", flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href={primaryCta.href}
          style={{
            padding: "var(--space-3) var(--space-8)",
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
            padding: "var(--space-3) var(--space-8)",
            borderRadius: "var(--radius-md)",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
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
    </section>
  );
}
