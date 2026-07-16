import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { MobileFrame } from "@/components/layout/MobileFrame";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Liminal — Your first 90 days in a new city",
  description:
    "AI-powered companion for young adults navigating relocation",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#121212",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <MobileFrame>{children}</MobileFrame>
      </body>
    </html>
  );
}
