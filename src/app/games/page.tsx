"use client";

import { Star, Volume2, VolumeX, Trophy } from "lucide-react";
import { useGameStore, GameType, Difficulty } from "@/store/game-store";
import { LANGUAGES } from "@/config/languages";
import ScoreBoard from "@/components/games/ScoreBoard";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { motion } from "framer-motion";
import { useState } from "react";

const games: { id: GameType; title: string; desc: string; color: string; icon: string; mascot: string }[] = [
  { id: "alphabet", title: "Alphabet Tracing", desc: "Learn to write letters by tracing", color: "from-pink-400 to-rose-400", icon: "ABC", mascot: "A" },
  { id: "counting", title: "Number Counting", desc: "Count objects and learn numbers", color: "from-blue-400 to-cyan-400", icon: "123", mascot: "#" },
  { id: "matching", title: "Memory Match", desc: "Find matching pairs of cards", color: "from-green-400 to-emerald-400", icon: "\uD83C\uDCCF", mascot: "M" },
  { id: "karaoke", title: "Rhyme Karaoke", desc: "Sing along with highlighted lyrics", color: "from-purple-400 to-violet-400", icon: "\uD83C\uDFA4", mascot: "K" },
  { id: "puzzle", title: "Jigsaw Puzzle", desc: "Solve fun picture puzzles", color: "from-yellow-400 to-orange-400", icon: "\uD83E\uDDE9", mascot: "P" },
];

const difficulties: { value: Difficulty; label: string; stars: number; color: string }[] = [
  { value: "easy", label: "Easy", stars: 1, color: "bg-green-500" },
  { value: "medium", label: "Medium", stars: 2, color: "bg-yellow-500" },
  { value: "hard", label: "Hard", stars: 3, color: "bg-red-500" },
];

export default function GamesPage() {
  const { language, setLanguage, difficulty, setDifficulty, progress } = useGameStore();
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumbs />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-4 mb-8"
      >
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-800 dark:text-white">Educational Games</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Fun learning experiences for kids</p>
        </div>

        <div className="flex items-center gap-3 ml-auto flex-wrap">
          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-green-500" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
          </button>

          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium shadow-sm dark:text-white"
            aria-label="Select language"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.nativeName}
              </option>
            ))}
          </select>

          {/* Difficulty selector */}
          <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            {difficulties.map((d) => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  difficulty === d.value
                    ? `${d.color} text-white shadow-sm`
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {d.label}
                <span className="text-xs opacity-70">{"*".repeat(d.stars)}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {games.map((g, index) => {
            const p = progress[g.id];
            const completion = p ? Math.min(100, (p.highScore / 100) * 100) : 0;
            return (
              <motion.a
                key={g.id}
                href={`/games/${g.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all group overflow-hidden relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${g.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-lg`}>
                    {g.icon.length <= 3 ? (
                      <span className="text-white font-bold text-sm">{g.icon}</span>
                    ) : (
                      <span>{g.icon}</span>
                    )}
                  </div>
                  {p && p.highScore >= 80 && (
                    <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-bold flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> Pro
                    </div>
                  )}
                </div>

                <h3 className="font-heading text-xl font-bold mb-1 text-gray-800 dark:text-white">{g.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{g.desc}</p>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(completion)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${g.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${completion}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 transition-all ${
                          p && p.stars > i
                            ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                            : "text-gray-200 dark:text-gray-600 fill-gray-200 dark:fill-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  {p && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Best: {p.highScore} | {p.timesPlayed}x played
                    </span>
                  )}
                </div>
              </motion.a>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <ScoreBoard />
        </motion.div>
      </div>
    </div>
  );
}
