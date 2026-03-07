"use client";
import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { THEMES, RHYME_PROMPT } from "@/lib/ai/prompts";
import { LANGUAGES } from "@/config/languages";
import { Sparkles, Copy, Download, ArrowLeft, Music } from "lucide-react";

export default function RhymesPage() {
  const { language } = useAppStore();
  const [theme, setTheme] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, language, provider: "groq" }),
      });
      const data = await res.json();
      setLyrics(data.lyrics);
      setTitle(data.title);
    } catch { setLyrics("Error generating lyrics. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <a href="/" className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</a>
        <h1 className="font-heading text-3xl font-bold text-gray-800 mb-8">Rhymes Engine</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {THEMES.map((t) => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className={`p-3 rounded-xl border-2 transition-all text-center ${theme === t.id ? "border-pink-400 bg-pink-50 shadow-md" : "border-gray-200 bg-white hover:border-pink-200"}`}>
              <div className="text-2xl mb-1">{t.emoji}</div>
              <div className="text-xs font-medium">{t.label}</div>
            </button>
          ))}
        </div>

        <button onClick={generate} disabled={!theme || loading}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2">
          {loading ? "Generating..." : <><Sparkles className="w-5 h-5" /> Generate Rhyme</>}
        </button>

        {lyrics && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="font-heading text-xl font-bold mb-4">{title}</h2>
            <pre className="whitespace-pre-wrap font-body text-lg text-gray-700 leading-relaxed">{lyrics}</pre>
            <div className="flex gap-3 mt-4">
              <button onClick={() => navigator.clipboard.writeText(lyrics)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm flex items-center gap-2"><Copy className="w-4 h-4" /> Copy</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
