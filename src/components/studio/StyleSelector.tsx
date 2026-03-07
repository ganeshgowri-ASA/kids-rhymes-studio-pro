"use client";

import { MusicStyle, MUSIC_STYLES } from "@/lib/music/suno-client";
import { useMusicStore } from "@/store/music-store";
import { Music, Sparkles, Star, Drum, Zap } from "lucide-react";

const STYLE_ICONS: Record<MusicStyle, React.ReactNode> = {
  lullaby: <Moon className="w-6 h-6" />,
  upbeat_kids: <Zap className="w-6 h-6" />,
  classical_indian: <Music className="w-6 h-6" />,
  folk_indian: <Drum className="w-6 h-6" />,
  pop_kids: <Star className="w-6 h-6" />,
};

const STYLE_COLORS: Record<MusicStyle, string> = {
  lullaby: "from-indigo-300 to-purple-300 border-indigo-200",
  upbeat_kids: "from-yellow-300 to-orange-300 border-yellow-200",
  classical_indian: "from-rose-300 to-pink-300 border-rose-200",
  folk_indian: "from-green-300 to-emerald-300 border-green-200",
  pop_kids: "from-cyan-300 to-blue-300 border-cyan-200",
};

function Moon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export default function StyleSelector() {
  const { selectedStyle, setSelectedStyle } = useMusicStore();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {(Object.keys(MUSIC_STYLES) as MusicStyle[]).map((style) => {
        const info = MUSIC_STYLES[style];
        const isSelected = selectedStyle === style;

        return (
          <button
            key={style}
            onClick={() => setSelectedStyle(style)}
            className={`
              relative rounded-xl p-4 text-left transition-all border-2
              ${
                isSelected
                  ? `bg-gradient-to-br ${STYLE_COLORS[style]} shadow-lg scale-105`
                  : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md"
              }
            `}
          >
            {isSelected && (
              <Sparkles className="absolute top-2 right-2 w-4 h-4 text-white/80" />
            )}
            <div
              className={`mb-2 ${isSelected ? "text-white" : "text-gray-500"}`}
            >
              {STYLE_ICONS[style]}
            </div>
            <h4
              className={`font-bold text-sm ${
                isSelected ? "text-white" : "text-gray-800"
              }`}
            >
              {info.label}
            </h4>
            <p
              className={`text-xs mt-1 ${
                isSelected ? "text-white/80" : "text-gray-400"
              }`}
            >
              {info.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
