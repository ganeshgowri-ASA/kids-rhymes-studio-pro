"use client";
import { useAppStore } from "@/store/app-store";
import { LANGUAGES } from "@/config/languages";
import { Music, Film, Gamepad2, BookOpen, Sparkles } from "lucide-react";

const features = [
  { icon: Music, title: "Rhymes Engine", desc: "AI-generated lyrics in 6+ Indian languages", color: "from-pink-400 to-rose-400", href: "/rhymes" },
  { icon: Film, title: "Production Studio", desc: "Create videos with cartoon & realistic scenes", color: "from-blue-400 to-cyan-400", href: "/studio" },
  { icon: Gamepad2, title: "Educational Games", desc: "5 fun learning games for kids", color: "from-green-400 to-emerald-400", href: "/games" },
  { icon: BookOpen, title: "My Library", desc: "Saved rhymes, videos, and progress", color: "from-purple-400 to-violet-400", href: "/library" },
];

export default function Home() {
  const { language, setLanguage } = useAppStore();
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Kids Rhymes Studio Pro
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="px-3 py-1.5 rounded-lg border border-pink-200 text-sm bg-white">
              {LANGUAGES.map((l) => (<option key={l.code} value={l.code}>{l.flag} {l.nativeName}</option>))}
            </select>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-yellow-700 text-sm mb-4">
            <Sparkles className="w-4 h-4" /> AI-Powered Kids Content Studio
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Create Amazing Kids Content
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate rhymes, music, videos, and educational games in Telugu, Tamil, Hindi, Bengali, Gujarati & more!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((f, i) => (
            <a key={i} href={f.href} className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </a>
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
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        Kids Rhymes Studio Pro v1.0 | Made with AI
      </footer>
    </div>
  );
}
