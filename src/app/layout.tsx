import type { Metadata, Viewport } from "next";
import "./globals.css";
import DashboardLayout from "@/components/shared/DashboardLayout";

export const metadata: Metadata = {
  title: "Kids Rhymes Studio Pro - AI-Powered Kids Content Creation",
  description: "Create amazing rhymes, music, videos, and educational games in Telugu, Tamil, Hindi, Bengali, Gujarati, Kannada & English. AI-powered kids content production studio.",
  keywords: ["kids rhymes", "Indian languages", "Telugu rhymes", "Hindi rhymes", "Tamil rhymes", "educational games", "AI content", "kids videos"],
  authors: [{ name: "Kids Rhymes Studio" }],
  openGraph: {
    title: "Kids Rhymes Studio Pro",
    description: "AI-Powered Kids Rhymes, Videos & Games Production Studio",
    type: "website",
    locale: "en_US",
    siteName: "Kids Rhymes Studio Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kids Rhymes Studio Pro",
    description: "AI-Powered Kids Rhymes, Videos & Games Production Studio",
  },
  manifest: "/manifest.json",
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ec4899",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen animated-gradient">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
