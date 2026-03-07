import type { Metadata } from "next";
import "./globals.css";
import DashboardLayout from "@/components/shared/DashboardLayout";

export const metadata: Metadata = {
  title: "Kids Rhymes Studio Pro",
  description: "AI-powered Kids Rhymes, Videos & Games Production Studio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
