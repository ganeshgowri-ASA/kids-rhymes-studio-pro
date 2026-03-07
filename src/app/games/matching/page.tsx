"use client";
import { useState, useMemo, useCallback } from "react";
import { GameWrapper } from "@/components/games/GameWrapper";

const CARD_EMOJIS = ["🐶", "🐱", "🐰", "🦁", "🐸", "🦊", "🐼", "🐨"];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MatchingGamePage() {
  const [cards] = useState(() => {
    const pairs = CARD_EMOJIS.slice(0, 6);
    return shuffleArray([...pairs, ...pairs].map((emoji, i) => ({ id: i, emoji, matched: false })));
  });
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);

  const handleFlip = useCallback(
    (id: number) => {
      if (flipped.length === 2 || flipped.includes(id) || matched.has(id)) return;
      const newFlipped = [...flipped, id];
      setFlipped(newFlipped);
      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        const [a, b] = newFlipped;
        if (cards[a].emoji === cards[b].emoji) {
          setMatched((prev) => new Set([...Array.from(prev), a, b]));
          setFlipped([]);
        } else {
          setTimeout(() => setFlipped([]), 800);
        }
      }
    },
    [flipped, matched, cards]
  );

  const isComplete = matched.size === cards.length;

  return (
    <GameWrapper title="Memory Match" gameId="matching">
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Moves: {moves}</span>
          <span className="text-sm text-gray-500">Matched: {matched.size / 2} / {cards.length / 2}</span>
        </div>
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {cards.map((card) => {
            const isFlipped = flipped.includes(card.id) || matched.has(card.id);
            return (
              <button
                key={card.id}
                onClick={() => handleFlip(card.id)}
                className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all duration-300 ${
                  isFlipped
                    ? "bg-white border-2 border-green-300 shadow-md"
                    : "bg-gradient-to-br from-green-400 to-emerald-500 hover:shadow-lg hover:scale-105"
                }`}
              >
                {isFlipped ? card.emoji : "?"}
              </button>
            );
          })}
        </div>
        {isComplete && (
          <div className="text-center mt-6">
            <p className="font-heading text-2xl font-bold text-green-500">You Won!</p>
            <p className="text-gray-500">Completed in {moves} moves</p>
          </div>
        )}
      </div>
    </GameWrapper>
  );
}
