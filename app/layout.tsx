import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creator Agent Field Guide",
  description: "A patient, hands-on course for content creators learning to build production AI agents from zero.",
  openGraph: {
    title: "Creator Agent Field Guide",
    description: "Build your first creator agent, from zero to production.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Creator Agent Field Guide",
    description: "Build your first creator agent, from zero to production."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
