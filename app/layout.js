import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

/* ── Fonts ──────────────────────────────────────────────────────────────────
   JetBrains Mono → default UI font (nav, labels, terminal text)
   Inter           → longer paragraph / body copy inside windows
   Both are loaded with `variable` so they are exposed as CSS custom
   properties that globals.css maps into --font-mono / --font-body.
   ────────────────────────────────────────────────────────────────────────── */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Portfolio",
  description: "Hacker desktop portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${inter.variable} h-full`}
    >
      <head>
        {/* Tabler Icons webfont — provides ti-* icon classes */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/dist/tabler-icons.min.css"
        />
      </head>
      <body className="min-h-full bg-void text-ink">{children}</body>
    </html>
  );
}
