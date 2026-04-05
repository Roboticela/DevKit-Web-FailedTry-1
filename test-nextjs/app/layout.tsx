import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test NextJS — DevKit",
  description: "DevKit nextjs-compact test project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "var(--font-sans)", background: "var(--color-bg)", color: "var(--color-text)" }}>
        {/* devkit:auth:provider */}
        {children}
      </body>
    </html>
  );
}
