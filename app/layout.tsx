import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE OTHER SIDE — a two-player psychological mystery",
  description:
    "You are in the same place. But you are not in the same reality. A psychological co-op mystery for two.",
  applicationName: "THE OTHER SIDE",
  openGraph: {
    title: "THE OTHER SIDE",
    description:
      "Kalian berada di tempat yang sama. Tapi kalian tidak berada di realitas yang sama.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0908",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-dvh bg-ink text-bone antialiased">{children}</body>
    </html>
  );
}
