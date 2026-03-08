"use client";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BookOpen, Music, Film, Heart, Search, Grid3X3, List, Download, SortAsc, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LANGUAGES } from "@/config/languages";

type Tab = "rhymes" | "videos" | "music" | "favorites";
type ViewMode = "grid" | "list";
type SortBy = "date" | "name" | "language";

interface LibraryItem {
  id: string;
  type: "Rhyme" | "Video" | "Music" | "Game";
  title: string;
  lang: string;
  langCode: string;
  date: string;
  favorite: boolean;
  color: string;
}

const allItems: LibraryItem[] = [
  { id: "1", type: "Rhyme", title: "Twinkle Twinkle Little Star", lang: "Telugu", langCode: "te", date: "2024-03-01", favorite: true, color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
  { id: "2", type: "Video", title: "Colors of India", lang: "Hindi", langCode: "hi", date: "2024-02-28", favorite: false, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
  { id: "3", type: "Rhyme", title: "Baa Baa Black Sheep", lang: "English", langCode: "en", date: "2024-02-25", favorite: true, color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
  { id: "4", type: "Music", title: "Lullaby in Tamil", lang: "Tamil", langCode: "ta", date: "2024-02-20", favorite: false, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
  { id: "5", type: "Rhyme", title: "Chandamama Raave", lang: "Telugu", langCode: "te", date: "2024-02-18", favorite: true, color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
  { id: "6", type: "Video", title: "Number Song", lang: "Bengali", langCode: "bn", date: "2024-02-15", favorite: false, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
  { id: "7", type: "Music", title: "Happy Birthday Remix", lang: "English", langCode: "en", date: "2024-02-10", favorite: true, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
  { id: "8", type: "Rhyme", title: "Nila Nila Odi Va", lang: "Tamil", langCode: "ta", date: "2024-02-05", favorite: false, color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
];

const tabs: { id: Tab; label: string; icon: typeof BookOpen; typeFilter?: string }[] = [
  { id: "rhymes", label: "My Rhymes", icon: BookOpen, typeFilter: "Rhyme" },
  { id: "videos", label: "My Videos", icon: Film, typeFilter: "Video" },
  { id: "music", label: "My Music", icon: Music, typeFilter: "Music" },
  { id: "favorites", label: "Favorites", icon: Heart },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("rhymes");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [langFilter, setLangFilter] = useState<string>("all");

  const filteredItems = useMemo(() => {
    let items = allItems;

    const tab = tabs.find(t => t.id === activeTab);
    if (activeTab === "favorites") {
      items = items.filter(i => i.favorite);
    } else if (tab?.typeFilter) {
      items = items.filter(i => i.type === tab.typeFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q) || i.lang.toLowerCase().includes(q));
    }

    if (langFilter !== "all") {
      items = items.filter(i => i.langCode === langFilter);
    }

    items = [...items].sort((a, b) => {
      if (sortBy === "date") return b.date.localeCompare(a.date);
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return a.lang.localeCompare(b.lang);
    });

    return items;
  }, [activeTab, searchQuery, sortBy, langFilter]);

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumbs />
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-heading text-3xl font-bold text-gray-800 dark:text-white mb-6"
      >
        My Library
      </motion.h1>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Search, Filter, Sort, View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center gap-3 mb-6"
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-300 dark:text-white"
            aria-label="Search library"
          />
        </div>

        <select
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm dark:text-white"
          aria-label="Filter by language"
        >
          <option value="all">All Languages</option>
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm dark:text-white"
          aria-label="Sort by"
        >
          <option value="date">Newest First</option>
          <option value="name">Name (A-Z)</option>
          <option value="language">Language</option>
        </select>

        <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            aria-label="Grid view"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Items */}
      <AnimatePresence mode="wait">
        {filteredItems.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-400 dark:text-gray-500 text-lg font-medium">No items found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your filters or start creating!</p>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-5 group hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.color}`}>{item.type}</span>
                  <button className={`p-1 rounded-full transition-colors ${item.favorite ? "text-red-500" : "text-gray-300 dark:text-gray-600 hover:text-red-400"}`} aria-label={item.favorite ? "Remove from favorites" : "Add to favorites"}>
                    <Heart className={`w-4 h-4 ${item.favorite ? "fill-current" : ""}`} />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1 truncate">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                  <span>{LANGUAGES.find(l => l.code === item.langCode)?.flag}</span> {item.lang}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{item.date}</span>
                  <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1" aria-label="Download item">
                    <Download className="w-3 h-3" /> Export
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-2xl divide-y divide-gray-100 dark:divide-gray-700"
          >
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.color} flex-shrink-0`}>{item.type}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white truncate">{item.title}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span>{LANGUAGES.find(l => l.code === item.langCode)?.flag}</span> {item.lang} &bull; {item.date}
                  </p>
                </div>
                <button className={`p-1 flex-shrink-0 ${item.favorite ? "text-red-500" : "text-gray-300 dark:text-gray-600"}`} aria-label="Toggle favorite">
                  <Heart className={`w-4 h-4 ${item.favorite ? "fill-current" : ""}`} />
                </button>
                <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 flex items-center gap-1" aria-label="Download item">
                  <Download className="w-3 h-3" /> Export
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
