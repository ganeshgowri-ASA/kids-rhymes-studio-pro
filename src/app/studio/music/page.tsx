"use client";
import { useState } from "react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Music, Play, Pause, Download } from "lucide-react";

const STYLES = [
  { id: "lullaby", label: "Lullaby", emoji: "🌙" },
  { id: "upbeat_kids", label: "Upbeat Kids", emoji: "🎉" },
  { id: "classical_indian", label: "Classical Indian", emoji: "🎵" },
  { id: "folk_indian", label: "Folk Indian", emoji: "🪘" },
  { id: "pop_kids", label: "Pop Kids", emoji: "🎤" },
];

export default function MusicStudioPage() {
  const [lyrics, setLyrics] = useState("");
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/music/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lyrics, style }),
      });
      const data = await res.json();
      setAudioUrl(data.audioUrl || null);
    } catch {
      // handled by error boundary
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs />
      <h1 className="font-heading text-3xl font-bold text-gray-800 mb-6">Music Studio</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Lyrics</label>
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="Paste your lyrics here or generate from Rhymes Engine..."
          className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Music Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                style === s.id
                  ? "border-pink-400 bg-pink-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-pink-200"
              }`}
            >
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-xs font-medium">{s.label}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generate}
        disabled={!lyrics || !style || loading}
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {loading ? "Generating Music..." : (
          <>
            <Music className="w-5 h-5" /> Generate Music
          </>
        )}
      </button>

      {audioUrl && (
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="font-heading text-lg font-bold mb-4">Generated Track</h3>
          <audio controls src={audioUrl} className="w-full mb-3" />
          <a
            href={audioUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" /> Download
          </a>
        </div>
      )}
    </div>
  );
}
