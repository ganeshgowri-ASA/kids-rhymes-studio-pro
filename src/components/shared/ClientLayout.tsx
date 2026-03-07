"use client";
import Sidebar from "./Sidebar";
import { ErrorBoundary } from "./ErrorBoundary";
import { OfflineDetector } from "./OfflineDetector";
import { useAppStore } from "@/store/app-store";
import { Toaster } from "sonner";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useAppStore();

  return (
    <>
      <OfflineDetector />
      <Sidebar />
      <main
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
