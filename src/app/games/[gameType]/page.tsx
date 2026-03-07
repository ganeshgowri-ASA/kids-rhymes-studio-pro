'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useGameStore, GameType } from '@/store/game-store';
import GameMenu from '@/components/games/GameMenu';
import { useRef } from 'react';

const GameWrapper = dynamic(() => import('@/components/games/GameWrapper'), { ssr: false });

const VALID_GAMES: GameType[] = ['alphabet', 'counting', 'matching', 'karaoke', 'puzzle'];

const GAME_TITLES: Record<GameType, string> = {
  alphabet: 'Alphabet Tracing',
  counting: 'Number Counting',
  matching: 'Memory Match',
  karaoke: 'Rhyme Karaoke',
  puzzle: 'Jigsaw Puzzle',
};

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameType = params.gameType as GameType;
  const gameKey = useRef(0);

  if (!VALID_GAMES.includes(gameType)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Game not found</h1>
          <a href="/games" className="text-green-500 hover:underline">Back to Games</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <a href="/games" className="inline-flex items-center gap-2 text-green-500 hover:text-green-600">
            <ArrowLeft className="w-4 h-4" /> Games
          </a>
          <h1 className="font-heading text-2xl font-bold text-gray-800">{GAME_TITLES[gameType]}</h1>
        </div>

        <div className="relative">
          <GameMenu
            onResume={() => {}}
            onRestart={() => { gameKey.current++; router.refresh(); }}
            onQuit={() => router.push('/games')}
          />
          <GameWrapper key={gameKey.current} gameType={gameType} />
        </div>
      </div>
    </div>
  );
}
