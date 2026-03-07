"use client";
import { useState, useEffect } from "react";
import { GameWrapper } from "@/components/games/GameWrapper";
import { Play, Pause } from "lucide-react";

const SAMPLE_LYRICS = [
  { text: "Twinkle twinkle little star", time: 0 },
  { text: "How I wonder what you are", time: 3 },
  { text: "Up above the world so high", time: 6 },
  { text: "Like a diamond in the sky", time: 9 },
  { text: "Twinkle twinkle little star", time: 12 },
  { text: "How I wonder what you are", time: 15 },
];

export default function KaraokeGamePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;
        const lineIndex = SAMPLE_LYRICS.findIndex((l, i) => {
          const nextLine = SAMPLE_LYRICS[i + 1];
          return next >= l.time && (!nextLine || next < nextLine.time);
        });
        if (lineIndex >= 0) setCurrentLine(lineIndex);
        if (next >= 18) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <GameWrapper title="Rhyme Karaoke" gameId="karaoke">
      <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
        <div className="space-y-3 mb-8">
          {SAMPLE_LYRICS.map((line, i) => (
            <p
              key={i}
              className={`text-xl transition-all duration-300 ${
                i === currentLine
                  ? "font-bold text-purple-600 scale-110"
                  : i < currentLine
                    ? "text-gray-400"
                    : "text-gray-300"
              }`}
            >
              {line.text}
            </p>
          ))}
        </div>
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (!isPlaying) { setElapsed(0); setCurrentLine(0); }
          }}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
        >
          {isPlaying ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> Sing Along</>}
        </button>
      </div>
    </GameWrapper>
  );
}
