'use client';

import { THEMES, type ThemeId } from '@/lib/ai/prompts';
import { motion } from 'framer-motion';

interface ThemeSelectorProps {
  selected: string;
  onSelect: (theme: ThemeId) => void;
}

export default function ThemeSelector({ selected, onSelect }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {THEMES.map((t, i) => (
        <motion.button
          key={t.id}
          onClick={() => onSelect(t.id)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.08, rotate: [-1, 1, -1, 0] }}
          whileTap={{ scale: 0.95 }}
          className={`p-4 rounded-xl border-2 transition-all text-center ${
            selected === t.id
              ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/30 shadow-md ring-2 ring-pink-200 dark:ring-pink-800'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-pink-200 dark:hover:border-pink-700 hover:shadow-sm'
          }`}
        >
          <div className="text-3xl mb-1">{t.emoji}</div>
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t.label}</div>
        </motion.button>
      ))}
    </div>
  );
}
