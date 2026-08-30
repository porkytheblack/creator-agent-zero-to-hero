import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://creator-agent-field-guide.denv.chatgpt.site"),
  title: "Creator Agent Field Guide",
  description: "A 36-unit, code-guided course for content creators learning how production AI agents fit together from zero.",
  alternates: {
    canonical: "https://creator-agent-field-guide.denv.chatgpt.site"
  },
  openGraph: {
    title: "Creator Agent Field Guide",
    description: "Understand every boundary, file, and runtime step in a production creator agent.",
    type: "website",
    url: "https://creator-agent-field-guide.denv.chatgpt.site",
    images: [
      {
        url: "https://creator-agent-field-guide.denv.chatgpt.site/og.png",
        width: 1200,
        height: 630,
        alt: "Creator Agent Field Guide — build your first creator agent from zero to production"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Creator Agent Field Guide",
    description: "Understand every boundary, file, and runtime step in a production creator agent.",
    images: ["https://creator-agent-field-guide.denv.chatgpt.site/og.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
