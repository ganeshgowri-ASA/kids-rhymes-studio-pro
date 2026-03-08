"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import LanguageSwitcher from "./LanguageSwitcher";
import { Breadcrumbs } from "./Breadcrumbs";

export default function Header() {
  const { darkMode, toggleDarkMode, toggleSidebar } = useAppStore();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-pink-100 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="hidden md:block">
            <Breadcrumbs />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 text-pink-200 dark:text-pink-800 select-none" aria-hidden="true">
          {["\u266A", "\u266B", "\u2669"].map((note, i) => (
            <span
              key={i}
              className="text-xl"
              style={{ animation: `noteFloat 3s ease-in-out ${i * 0.5}s infinite` }}
            >
              {note}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors"
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
