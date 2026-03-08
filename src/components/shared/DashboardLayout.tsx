"use client";

import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";
import AnimatedBackground from "@/components/shared/AnimatedBackground";
import MobileBottomNav from "@/components/shared/MobileBottomNav";
import { useAppStore } from "@/store/app-store";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./ErrorBoundary";
import { OfflineDetector } from "./OfflineDetector";
import { useState } from "react";
import { X, Sparkles } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { darkMode } = useAppStore();
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-background text-foreground">
        <AnimatedBackground />
        <OfflineDetector />

        {/* Notification Banner */}
        {showBanner && (
          <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-center py-2 text-sm flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">New: AI-powered music generation & multilingual TTS now available!</span>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-3 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <div className={showBanner ? "mt-9" : ""}>
            <Header />
          </div>
          <main id="main-content" className="flex-1 p-4 lg:p-6 relative z-10 pb-20 lg:pb-6" role="main">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>

        <MobileBottomNav />
        <Toaster position="top-right" richColors closeButton />
      </div>
    </div>
  );
}
