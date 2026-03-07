"use client";
import { useState, useMemo } from "react";
import { GameWrapper } from "@/components/games/GameWrapper";
import { RotateCcw } from "lucide-react";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function PuzzleGamePage() {
  const [tiles, setTiles] = useState(() => {
    const nums = Array.from({ length: 15 }, (_, i) => i + 1);
    return [...shuffleArray(nums), 0]; // 0 = empty
  });
  const [moves, setMoves] = useState(0);

  const isSolved = tiles.every((t, i) => (i === 15 ? t === 0 : t === i + 1));
  const emptyIndex = tiles.indexOf(0);

  const canMove = (index: number) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;
    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const handleMove = (index: number) => {
    if (!canMove(index)) return;
    const newTiles = [...tiles];
    [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
    setTiles(newTiles);
    setMoves(moves + 1);
  };

  return (
    <GameWrapper title="Jigsaw Puzzle" gameId="puzzle">
      <div className="bg-white rounded-2xl p-6 shadow-sm border text-center">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Moves: {moves}</span>
          <button
            onClick={() => {
              setTiles([...shuffleArray(Array.from({ length: 15 }, (_, i) => i + 1)), 0]);
              setMoves(0);
            }}
            className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
          {tiles.map((tile, i) => (
            <button
              key={i}
              onClick={() => handleMove(i)}
              disabled={tile === 0}
              className={`aspect-square rounded-xl text-xl font-bold flex items-center justify-center transition-all ${
                tile === 0
                  ? "bg-gray-100"
                  : canMove(i)
                    ? "bg-gradient-to-br from-yellow-400 to-orange-400 text-white hover:shadow-lg hover:scale-105 cursor-pointer"
                    : "bg-gradient-to-br from-yellow-300 to-orange-300 text-white"
              }`}
            >
              {tile || ""}
            </button>
          ))}
        </div>
        {isSolved && moves > 0 && (
          <p className="mt-4 font-heading text-2xl font-bold text-yellow-500">Puzzle Solved!</p>
        )}
      </div>
    </GameWrapper>
  );
}
