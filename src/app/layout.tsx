import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import "@/components/ProfileCard.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "karim",
  description: "karim's portfolio",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E0DEDC" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0f13" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="bg-[var(--background)] dark"
    >
      <head>
        {/* Preconnect to external domains to reduce latency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Alice&family=Lato:wght@400;700&family=Aldrich&display=swap"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Alice&family=Lato:wght@400;700&family=Aldrich&display=swap"
        />

        {/* Prevent theme flash: set initial theme class before hydration */}
        <Script id="theme-init" strategy="beforeInteractive">{`
          (() => {
            try {
              const s = localStorage.getItem('theme');
              const t = s ?? 'dark';
              const el = document.documentElement;
              if (t === 'dark') el.classList.add('dark');
              else el.classList.remove('dark');
            } catch {}
          })();
        `}</Script>
      </head>
      <body className="bg-[var(--background)] relative">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
