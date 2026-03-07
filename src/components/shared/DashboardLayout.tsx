"use client";

import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";
import AnimatedBackground from "@/components/shared/AnimatedBackground";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AnimatedBackground />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 lg:p-6 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
