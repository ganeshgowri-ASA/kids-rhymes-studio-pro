"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { LANGUAGES } from "@/config/languages";
import {
  Music,
  Film,
  Gamepad2,
  BookOpen,
  Home,
  ChevronLeft,
  ChevronRight,
  Wand2,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/rhymes", label: "Rhymes Engine", icon: Music },
  { href: "/studio", label: "Production Studio", icon: Film },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/library", label: "My Library", icon: BookOpen },
  { href: "/wizard", label: "Create Video", icon: Wand2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, language, setLanguage } = useAppStore();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-pink-100 shadow-sm z-40 transition-all duration-300 flex flex-col ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-pink-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Music className="w-5 h-5 text-white" />
        </div>
        {sidebarOpen && (
          <span className="font-heading text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent truncate">
            Kids Rhymes Studio
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
              title={item.label}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-pink-500" : ""}`} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Language Selector */}
      {sidebarOpen && (
        <div className="px-3 pb-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-pink-200 text-sm bg-white"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.nativeName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={toggleSidebar}
        className="p-3 border-t border-pink-100 hover:bg-gray-50 transition-colors flex items-center justify-center"
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>
    </aside>
  );
}
