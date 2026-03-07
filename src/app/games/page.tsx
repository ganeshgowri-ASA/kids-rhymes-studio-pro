"use client";
import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Star, Gamepad2 } from "lucide-react";

const games = [
  { id: "alphabet", title: "Alphabet Tracing", desc: "Learn to write letters by tracing", color: "from-pink-400 to-rose-400", stars: 3 },
  { id: "counting", title: "Number Counting", desc: "Count objects and learn numbers", color: "from-blue-400 to-cyan-400", stars: 3 },
  { id: "matching", title: "Memory Match", desc: "Find matching pairs of cards", color: "from-green-400 to-emerald-400", stars: 3 },
  { id: "karaoke", title: "Rhyme Karaoke", desc: "Sing along with highlighted lyrics", color: "from-purple-400 to-violet-400", stars: 3 },
  { id: "puzzle", title: "Jigsaw Puzzle", desc: "Solve fun picture puzzles", color: "from-yellow-400 to-orange-400", stars: 3 },
];

export default function GamesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs />
      <h1 className="font-heading text-3xl font-bold text-gray-800 mb-8">Educational Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((g) => (
          <Link key={g.id} href={`/games/${g.id}`} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center mb-4`}>
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-2">{g.title}</h3>
            <p className="text-gray-500 text-sm mb-3">{g.desc}</p>
            <div className="flex gap-1">{Array(g.stars).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
