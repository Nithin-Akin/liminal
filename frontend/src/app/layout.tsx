import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "liiminal",
  description: "AI transition intelligence for moving cities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
