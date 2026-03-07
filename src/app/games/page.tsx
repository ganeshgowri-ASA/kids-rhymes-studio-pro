"use client";

import { ArrowLeft, Star } from "lucide-react";
import { useGameStore, GameType, Difficulty } from "@/store/game-store";
import { LANGUAGES } from "@/config/languages";
import ScoreBoard from "@/components/games/ScoreBoard";

const games: { id: GameType; title: string; desc: string; color: string; icon: string }[] = [
  { id: "alphabet", title: "Alphabet Tracing", desc: "Learn to write letters by tracing", color: "from-pink-400 to-rose-400", icon: "ABC" },
  { id: "counting", title: "Number Counting", desc: "Count objects and learn numbers", color: "from-blue-400 to-cyan-400", icon: "123" },
  { id: "matching", title: "Memory Match", desc: "Find matching pairs of cards", color: "from-green-400 to-emerald-400", icon: "🃏" },
  { id: "karaoke", title: "Rhyme Karaoke", desc: "Sing along with highlighted lyrics", color: "from-purple-400 to-violet-400", icon: "🎤" },
  { id: "puzzle", title: "Jigsaw Puzzle", desc: "Solve fun picture puzzles", color: "from-yellow-400 to-orange-400", icon: "🧩" },
];

const difficulties: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export default function GamesPage() {
  const { language, setLanguage, difficulty, setDifficulty, progress } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <a href="/" className="inline-flex items-center gap-2 text-green-500 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </a>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <h1 className="font-heading text-3xl font-bold text-gray-800">Educational Games</h1>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="ml-auto px-3 py-2 rounded-xl border bg-white text-sm font-medium shadow-sm"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.nativeName}
              </option>
            ))}
          </select>

          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border">
            {difficulties.map((d) => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  difficulty === d.value
                    ? "bg-green-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {games.map((g) => {
              const p = progress[g.id];
              return (
                <a
                  key={g.id}
                  href={`/games/${g.id}`}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center mb-4 text-2xl`}
                  >
                    {g.icon.length <= 3 ? (
                      <span className="text-white font-bold text-sm">{g.icon}</span>
                    ) : (
                      <span>{g.icon}</span>
                    )}
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-2">{g.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">{g.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            p && p.stars > i
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-200 fill-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    {p && (
                      <span className="text-xs text-gray-400">
                        Best: {p.highScore} | Played: {p.timesPlayed}x
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <ScoreBoard />
          </div>
        </div>
      </div>
    </div>
  );
}
