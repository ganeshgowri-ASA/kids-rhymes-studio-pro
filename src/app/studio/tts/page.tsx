"use client";
import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { LANGUAGES } from "@/config/languages";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Mic, Play, Volume2 } from "lucide-react";

export default function TTSPage() {
  const { language } = useAppStore();
  const [text, setText] = useState("");
  const [speed, setSpeed] = useState(1);
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      en: "en-US", hi: "hi-IN", te: "te-IN", ta: "ta-IN",
      bn: "bn-IN", gu: "gu-IN", kn: "kn-IN",
    };
    utterance.lang = langMap[language] || "en-US";
    utterance.rate = speed;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs />
      <h1 className="font-heading text-3xl font-bold text-gray-800 mb-6">TTS Narration</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text to Speak ({LANGUAGES.find((l) => l.code === language)?.nativeName || "English"})
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text for narration..."
          className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Volume2 className="w-4 h-4 inline mr-1" /> Speed: {speed}x
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full accent-purple-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0.5x</span>
          <span>1x</span>
          <span>2x</span>
        </div>
      </div>

      <button
        onClick={speak}
        disabled={!text || speaking}
        className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl font-bold text-lg hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {speaking ? (
          <>Speaking...</>
        ) : (
          <>
            <Play className="w-5 h-5" /> Speak Now
          </>
        )}
      </button>
    </div>
  );
}
