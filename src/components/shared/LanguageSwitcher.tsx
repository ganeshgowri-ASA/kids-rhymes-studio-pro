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
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 hover:bg-white border border-pink-100 transition-colors text-sm"
        aria-label="Select language"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4 text-pink-400" />
        <span className="hidden sm:inline">{current.flag} {current.nativeName}</span>
        <span className="sm:hidden">{current.flag}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-pink-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-pink-50 transition-colors ${
                lang.code === language ? "bg-pink-50 text-pink-600 font-medium" : "text-gray-700"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.nativeName}</span>
              <span className="text-xs text-gray-400 ml-auto">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
