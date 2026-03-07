"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Music, Film, Gamepad2, Settings, X, BookOpen } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import KidsSilhouette from "./KidsSilhouette";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Music, label: "Rhymes", href: "/rhymes" },
  { icon: Film, label: "Studio", href: "/studio" },
  { icon: Gamepad2, label: "Games", href: "/games" },
  { icon: BookOpen, label: "Library", href: "/library" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white border-r border-pink-100 flex flex-col transition-transform duration-300 w-64 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-5 flex items-center justify-between border-b border-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
              <KidsSilhouette pose="dancing" color="white" size={24} />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent leading-tight">
                Kids Rhymes
              </h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Studio Pro</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-pink-50 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-pink-500" : "text-gray-400"}`} />
                <span>{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-pink-50">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <KidsSilhouette pose="singing" color="#FFB6C1" size={20} />
            <span>v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
