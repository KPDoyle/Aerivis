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
    title: "Aerivis | Evidence Infrastructure for Housing Litigation",
    description:
      "A legal partnership prototype connecting controlled air capture, expert interpretation and a traceable evidence record for housing litigation.",
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "32x32" },
      ],
      shortcut: "/favicon.ico",
    },
    openGraph: {
      title: "Aerivis | From disputed exposure to defensible evidence",
      description:
        "Evidence infrastructure for legal teams handling damp, mould and Awaab’s Law matters.",
      type: "website",
      images: [
        {
          url: `${origin}/og-legal.jpg`,
          width: 1200,
          height: 630,
          alt: "Aerivis legal partnership prototype",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Aerivis | From disputed exposure to defensible evidence",
      description:
        "Evidence infrastructure for legal teams handling damp, mould and Awaab’s Law matters.",
      images: [`${origin}/og-legal.jpg`],
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
