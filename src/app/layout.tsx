import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { loadSiteConfig } from "@/lib/config/siteConfig.server";
import { DevAdminLink } from "@/components/admin/DevAdminLink";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadSiteConfig();
  const siteTitle = config.site.title || "kitakun03 Webtoon";

  return {
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: config.site.description,
    keywords: ["webtoon", "manga", "comic", "kitakun03", "read online"],
    authors: [{ name: config.author.name }],
    openGraph: {
      type: "website",
      siteName: siteTitle,
      title: siteTitle,
      description: config.site.description,
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: config.site.description,
    },
    manifest: "/manifest.json",
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icons/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased noise-bg`}
      >
        {children}
        <DevAdminLink />
      </body>
    </html>
  );
}
