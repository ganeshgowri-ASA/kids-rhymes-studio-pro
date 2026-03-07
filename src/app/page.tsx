"use client";
import Link from "next/link";
import { Music, Film, Gamepad2, BookOpen, Sparkles, Wand2 } from "lucide-react";

const features = [
  { icon: Music, title: "Rhymes Engine", desc: "AI-generated lyrics in 6+ Indian languages", color: "from-pink-400 to-rose-400", href: "/rhymes" },
  { icon: Film, title: "Production Studio", desc: "Create videos with cartoon & realistic scenes", color: "from-blue-400 to-cyan-400", href: "/studio" },
  { icon: Gamepad2, title: "Educational Games", desc: "5 fun learning games for kids", color: "from-green-400 to-emerald-400", href: "/games" },
  { icon: BookOpen, title: "My Library", desc: "Saved rhymes, videos, and progress", color: "from-purple-400 to-violet-400", href: "/library" },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-yellow-700 text-sm mb-4">
          <Sparkles className="w-4 h-4" /> AI-Powered Kids Content Studio
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Create Amazing Kids Content
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
          Generate rhymes, music, videos, and educational games in Telugu, Tamil, Hindi, Bengali, Gujarati & more!
        </p>
        <Link
          href="/wizard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
        >
          <Wand2 className="w-5 h-5" /> Create Video from Rhyme
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((f, i) => (
          <Link
            key={i}
            href={f.href}
            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <f.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-heading text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        {[["7", "Languages"], ["5", "Games"], ["4", "AI Models"]].map(([num, label], i) => (
          <div key={i} className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="font-heading text-3xl font-bold text-pink-500">{num}</div>
            <div className="text-gray-500 text-sm">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
