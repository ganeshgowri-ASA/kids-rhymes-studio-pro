"use client";
import { useState } from "react";
import GameWrapper from "@/components/games/GameWrapper";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AlphabetGamePage() {
  const [currentLetter, setCurrentLetter] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(new Array(26).fill(false));

  const handleTrace = () => {
    const updated = [...completed];
    updated[currentLetter] = true;
    setCompleted(updated);
    if (currentLetter < 25) setCurrentLetter(currentLetter + 1);
  };

  return (
    <GameWrapper title="Alphabet Tracing" gameId="alphabet">
      <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
        <div className="text-9xl font-heading font-bold text-pink-400 mb-6 select-none">
          {LETTERS[currentLetter]}
        </div>
        <p className="text-gray-500 mb-6">Trace the letter by clicking below!</p>
        <button
          onClick={handleTrace}
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
        >
          {completed[currentLetter] ? "Next Letter" : "Trace!"}
        </button>
        <div className="flex flex-wrap gap-2 justify-center mt-8">
          {LETTERS.map((l, i) => (
            <div
              key={l}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                completed[i]
                  ? "bg-green-100 text-green-600"
                  : i === currentLetter
                    ? "bg-pink-100 text-pink-600 ring-2 ring-pink-300"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </GameWrapper>
  );
}
