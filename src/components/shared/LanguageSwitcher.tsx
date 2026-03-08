"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { LANGUAGES, getLanguageByCode } from "@/config/languages";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useAppStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = getLanguageByCode(language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border border-pink-100 dark:border-gray-700 transition-colors text-sm"
        aria-label="Select language"
        aria-expanded={open}
      >
        <span className="text-lg">{current.flag}</span>
        <span className="hidden sm:inline text-gray-700 dark:text-gray-300 font-medium">{current.nativeName}</span>
        <span className="sm:hidden text-gray-700 dark:text-gray-300">{current.flag}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-pink-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-pink-50 dark:hover:bg-gray-700 transition-colors ${
                lang.code === language ? "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 font-medium" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <div className="flex-1 text-left">
                <span className="font-medium">{lang.nativeName}</span>
                <span className="block text-xs text-gray-400">{lang.script}</span>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
