import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/shared/ClientLayout";

export const metadata: Metadata = {
  title: "Kids Rhymes Studio Pro",
  description: "AI-powered Kids Rhymes, Videos & Games Production Studio for Indian languages",
  keywords: ["kids", "rhymes", "nursery", "Telugu", "Tamil", "Hindi", "educational", "games"],
  openGraph: {
    title: "Kids Rhymes Studio Pro",
    description: "AI-powered Kids Rhymes, Videos & Games Production Studio",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#FF6B9D" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
