"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { darkMode, toggleDarkMode, toggleSidebar } = useAppStore();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-pink-100">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left: mobile menu + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-pink-50 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="font-heading text-xl font-bold text-gray-800 hidden md:block">
            Kids Rhymes Studio Pro
          </h2>
        </div>

        {/* Animated notes (decorative) */}
        <div className="hidden lg:flex items-center gap-4 text-pink-200 select-none" aria-hidden="true">
          {["\u266A", "\u266B", "\u2669"].map((note, i) => (
            <span
              key={i}
              className="text-xl"
              style={{
                animation: `noteFloat 3s ease-in-out ${i * 0.5}s infinite`,
              }}
            >
              {note}
            </span>
          ))}
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl hover:bg-pink-50 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes noteFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(10deg); }
        }
      `}</style>
    </header>
  );
}
