"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Music, Film, Gamepad2, BookOpen } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Music, label: "Rhymes", href: "/rhymes" },
  { icon: Film, label: "Studio", href: "/studio" },
  { icon: Gamepad2, label: "Games", href: "/games" },
  { icon: BookOpen, label: "Library", href: "/library" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav lg:hidden" aria-label="Mobile navigation">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-xs ${
                isActive
                  ? "text-pink-500 font-bold"
                  : "text-gray-400 dark:text-gray-500"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-pink-500" : "text-gray-400 dark:text-gray-500"}`} />
              <span>{item.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-pink-400 mt-0.5" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
