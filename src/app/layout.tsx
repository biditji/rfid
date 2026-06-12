import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rfidhub.com"),
  title: {
    default: "RFIDHub — Enterprise RFID Solutions",
    template: "%s | RFIDHub",
  },
  description:
    "Professional RFID products and inventory management solutions for modern enterprises. Tags, readers, antennas, and complete tracking systems.",
  keywords: [
    "RFID",
    "RFID tags",
    "RFID readers",
    "inventory management",
    "asset tracking",
    "supply chain",
    "UHF RFID",
  ],
  authors: [{ name: "RFIDHub" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "RFIDHub",
    title: "RFIDHub — Enterprise RFID Solutions",
    description:
      "Professional RFID products and inventory management solutions for modern enterprises.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RFIDHub — Enterprise RFID Solutions",
    description:
      "Professional RFID products and inventory management solutions for modern enterprises.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
