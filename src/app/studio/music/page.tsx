"use client";

import MusicGenerator from "@/components/studio/MusicGenerator";
import MusicPlayer from "@/components/studio/MusicPlayer";
import MusicLibrary from "@/components/studio/MusicLibrary";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { motion } from "framer-motion";

export default function MusicStudioPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumbs />
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-heading text-3xl font-bold text-gray-800 dark:text-white mb-8"
      >
        Music Studio
      </motion.h1>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <MusicGenerator />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <MusicPlayer />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <MusicLibrary />
        </motion.div>
      </div>
    </div>
  );
}
