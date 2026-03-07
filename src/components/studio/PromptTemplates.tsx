"use client";

import { useState } from "react";
import { SCENE_TEMPLATES, CATEGORY_LABELS, type TemplateCategory } from "@/lib/image/prompt-templates";
import { useImageStore } from "@/store/image-store";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as TemplateCategory[];

const CATEGORY_COLORS: Record<TemplateCategory, string> = {
  animals: "bg-orange-100 text-orange-700 border-orange-200",
  festivals: "bg-pink-100 text-pink-700 border-pink-200",
  nature: "bg-green-100 text-green-700 border-green-200",
  daily_life: "bg-blue-100 text-blue-700 border-blue-200",
  learning: "bg-purple-100 text-purple-700 border-purple-200",
};

const CATEGORY_ACTIVE_COLORS: Record<TemplateCategory, string> = {
  animals: "bg-orange-500 text-white",
  festivals: "bg-pink-500 text-white",
  nature: "bg-green-500 text-white",
  daily_life: "bg-blue-500 text-white",
  learning: "bg-purple-500 text-white",
};

export default function PromptTemplates() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all");
  const { setCustomPrompt, setTheme } = useImageStore();

  const filtered =
    activeCategory === "all"
      ? SCENE_TEMPLATES
      : SCENE_TEMPLATES.filter((t) => t.category === activeCategory);

  function handleSelect(prompt: string, theme?: string) {
    setCustomPrompt(prompt);
    setTheme(theme ?? "");
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <h2 className="font-heading text-xl font-bold mb-4">Scene Templates</h2>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeCategory === "all"
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat
                ? CATEGORY_ACTIVE_COLORS[cat]
                : `${CATEGORY_COLORS[cat]} hover:opacity-80`
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filtered.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelect(template.prompt, template.theme)}
            className={`text-left p-3 rounded-xl border hover:shadow-md transition-all hover:-translate-y-0.5 ${CATEGORY_COLORS[template.category]}`}
          >
            <p className="font-medium text-sm">{template.title}</p>
            <p className="text-xs mt-1 opacity-70 line-clamp-2">{template.prompt}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
