"use client";

import ImageGenerator from "@/components/studio/ImageGenerator";
import SceneGallery from "@/components/studio/SceneGallery";
import PromptTemplates from "@/components/studio/PromptTemplates";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { motion } from "framer-motion";
import { useState } from "react";
import { Paintbrush } from "lucide-react";

const stylePresets = [
  { id: "cartoon", label: "Cartoon", color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
  { id: "watercolor", label: "Watercolor", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
  { id: "3d", label: "3D Render", color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
  { id: "pixel", label: "Pixel Art", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
  { id: "realistic", label: "Realistic", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
];

export default function StudioImagesPage() {
  const [activeStyle, setActiveStyle] = useState("cartoon");

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumbs />
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-heading text-3xl font-bold text-gray-800 dark:text-white mb-2"
      >
        Image Generator
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Create beautiful cartoon and realistic scenes with Indian cultural themes
      </p>

      {/* Style Presets */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        <Paintbrush className="w-5 h-5 text-gray-400 self-center" />
        {stylePresets.map((style) => (
          <button
            key={style.id}
            onClick={() => setActiveStyle(style.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeStyle === style.id
                ? `${style.color} ring-2 ring-current ring-offset-2 dark:ring-offset-gray-900 shadow-sm`
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {style.label}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          <ImageGenerator />
          <PromptTemplates />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <SceneGallery />
        </motion.div>
      </div>
    </div>
  );
}
