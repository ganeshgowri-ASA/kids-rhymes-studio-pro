"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Music, Film, Gamepad2, Settings, X, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import KidsSilhouette from "./KidsSilhouette";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", href: "/", tooltip: "Dashboard" },
  { icon: Music, label: "Rhymes", href: "/rhymes", tooltip: "Rhymes Engine" },
  { icon: Film, label: "Studio", href: "/studio", tooltip: "Production Studio" },
  { icon: Gamepad2, label: "Games", href: "/games", tooltip: "Educational Games" },
  { icon: BookOpen, label: "Library", href: "/library", tooltip: "My Library" },
  { icon: Settings, label: "Settings", href: "/settings", tooltip: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white dark:bg-gray-900 border-r border-pink-100 dark:border-gray-800 flex-col transition-all duration-300 hidden lg:flex ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-pink-50 dark:border-gray-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <KidsSilhouette pose="dancing" color="white" size={20} />
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="overflow-hidden">
                <h1 className="font-heading text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent leading-tight whitespace-nowrap">Kids Rhymes</h1>
                <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Studio Pro</p>
              </motion.div>
            )}
          </div>
        </div>

        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-16 w-6 h-6 bg-white dark:bg-gray-800 border border-pink-100 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-pink-500 transition-colors shadow-sm z-10"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>

        <nav className="flex-1 px-2 py-4 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.tooltip : undefined}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 text-pink-600 dark:text-pink-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white"
                } ${sidebarOpen ? "" : "justify-center"}`}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-pink-500 dark:text-pink-400" : "text-gray-400 dark:text-gray-500"}`} />
                {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                {isActive && sidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-pink-50 dark:border-gray-800">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <KidsSilhouette pose="singing" color="#FFB6C1" size={16} />
            {sidebarOpen && <span>v2.0 Pro</span>}
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white dark:bg-gray-900 border-r border-pink-100 dark:border-gray-800 flex flex-col transition-transform duration-300 w-64 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-pink-50 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
              <KidsSilhouette pose="dancing" color="white" size={24} />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent leading-tight">Kids Rhymes</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Studio Pro</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors" aria-label="Close sidebar">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

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
                    ? "bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 text-pink-600 dark:text-pink-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-pink-500" : "text-gray-400"}`} />
                <span>{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-400" />}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
