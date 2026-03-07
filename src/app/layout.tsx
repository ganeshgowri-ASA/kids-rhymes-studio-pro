import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kids Rhymes Studio Pro",
  description:
    "AI-powered Kids Rhymes, Videos & Games Production Studio - Create content in Telugu, Tamil, Hindi, Bengali, Gujarati, Kannada & English",
  keywords: [
    "kids rhymes",
    "nursery rhymes",
    "Indian languages",
    "AI music",
    "educational games",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 antialiased font-body">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
