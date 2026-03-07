'use client';

import { THEMES, type ThemeId } from '@/lib/ai/prompts';

interface ThemeSelectorProps {
  selected: string;
  onSelect: (theme: ThemeId) => void;
}

export default function ThemeSelector({ selected, onSelect }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`p-4 rounded-xl border-2 transition-all text-center hover:scale-105 ${
            selected === t.id
              ? 'border-pink-400 bg-pink-50 shadow-md ring-2 ring-pink-200'
              : 'border-gray-200 bg-white hover:border-pink-200 hover:shadow-sm'
          }`}
        >
          <div className="text-3xl mb-1">{t.emoji}</div>
          <div className="text-xs font-semibold text-gray-700">{t.label}</div>
        </button>
      ))}
    </div>
  );
}
