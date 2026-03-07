"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Star, RotateCcw } from "lucide-react";
import Link from "next/link";

interface GameWrapperProps {
  title: string;
  gameId: string;
  children: React.ReactNode;
}

export function GameWrapper({ title, gameId, children }: GameWrapperProps) {
  const [score, setScore] = useState(0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/games" className="inline-flex items-center gap-2 text-green-500 hover:text-green-600 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Games
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-200">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="font-heading text-lg font-bold text-yellow-700">{score}</span>
        </div>
      </div>
      {children}
    </div>
  );
}
