import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://creator-agent-field-guide.denv.chatgpt.site"),
  title: "Creator Agent Field Guide",
  description: "A patient, hands-on course for content creators learning to build production AI agents from zero.",
  alternates: {
    canonical: "https://creator-agent-field-guide.denv.chatgpt.site"
  },
  openGraph: {
    title: "Creator Agent Field Guide",
    description: "Build your first creator agent, from zero to production.",
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
    description: "Build your first creator agent, from zero to production.",
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
