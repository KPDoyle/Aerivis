import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Aerivis | Mould Evidence and Legal Support for Tenants",
    description:
      "A resident-first service helping tenants document damp and mould, build a traceable evidence record and connect with a partner law firm.",
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "32x32" },
      ],
      shortcut: "/favicon.ico",
    },
    openGraph: {
      title: "Mould in your home? Start with evidence.",
      description:
        "A resident-first route for tenants and families to document damp and mould and connect with a partner law firm.",
      type: "website",
      images: [
        {
          url: `${origin}/og-resident.jpg`,
          width: 1200,
          height: 630,
          alt: "Aerivis mould evidence and legal support for tenants",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Mould in your home? Start with evidence.",
      description:
        "A resident-first route for tenants and families to document damp and mould and connect with a partner law firm.",
      images: [`${origin}/og-resident.jpg`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
