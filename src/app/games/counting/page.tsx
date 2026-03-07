"use client";
import { useState, useMemo } from "react";
import GameWrapper from "@/components/games/GameWrapper";

const OBJECTS = ["🍎", "🌟", "🐟", "🦋", "🎈", "🌸", "🍰", "🐱"];

export default function CountingGamePage() {
  const [level, setLevel] = useState(1);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const count = useMemo(() => level + 2, [level]);
  const emoji = useMemo(() => OBJECTS[level % OBJECTS.length], [level]);

  const check = () => {
    if (parseInt(answer) === count) {
      setFeedback("Correct! Great job!");
      setTimeout(() => {
        setLevel(level + 1);
        setAnswer("");
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback("Try again!");
    }
  };

  return (
    <GameWrapper title="Number Counting" gameId="counting">
      <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
        <p className="text-gray-500 mb-4">Level {level} - How many do you see?</p>
        <div className="flex flex-wrap gap-3 justify-center mb-8 max-w-md mx-auto">
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} className="text-5xl animate-bounce_slow" style={{ animationDelay: `${i * 0.1}s` }}>
              {emoji}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3">
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-24 px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            placeholder="?"
          />
          <button
            onClick={check}
            disabled={!answer}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all"
          >
            Check
          </button>
        </div>
        {feedback && (
          <p className={`mt-4 text-lg font-bold ${feedback.includes("Correct") ? "text-green-500" : "text-red-400"}`}>
            {feedback}
          </p>
        )}
      </div>
    </GameWrapper>
  );
}
