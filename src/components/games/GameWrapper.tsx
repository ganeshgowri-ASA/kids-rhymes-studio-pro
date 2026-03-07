'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore, GameType } from '@/store/game-store';

interface GameWrapperProps {
  gameType: GameType;
}

export default function GameWrapper({ gameType }: GameWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { language, difficulty, updateProgress } = useGameStore();

  const handleGameComplete = useCallback(
    (data: { game: string; score: number; stars: number }) => {
      updateProgress(data.game as GameType, data.score, data.stars);
    },
    [updateProgress]
  );

  useEffect(() => {
    let mounted = true;

    async function initGame() {
      // Dynamic import - no SSR
      const Phaser = (await import('phaser')).default;
      const { createGameConfig } = await import('@/games/config');

      // Import the correct scene
      let SceneClass: typeof Phaser.Scene;
      switch (gameType) {
        case 'alphabet':
          SceneClass = (await import('@/games/alphabet/AlphabetScene')).default;
          break;
        case 'counting':
          SceneClass = (await import('@/games/counting/CountingScene')).default;
          break;
        case 'matching':
          SceneClass = (await import('@/games/matching/MatchingScene')).default;
          break;
        case 'karaoke':
          SceneClass = (await import('@/games/rhyme-karaoke/KaraokeScene')).default;
          break;
        case 'puzzle':
          SceneClass = (await import('@/games/puzzle/PuzzleScene')).default;
          break;
        default:
          return;
      }

      if (!mounted || !containerRef.current) return;

      // Destroy existing game
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }

      const config = createGameConfig(SceneClass as unknown as typeof Phaser.Scene);
      config.parent = containerRef.current;

      const game = new Phaser.Game(config);
      gameRef.current = game;

      // Pass data to scene
      game.events.once('ready', () => {
        const scene = game.scene.getScene(SceneClass.name || gameType);
        if (scene) {
          scene.scene.restart({ language, difficulty });
        }
      });

      // Listen for game completion
      game.events.on('gameComplete', handleGameComplete);
    }

    initGame();

    return () => {
      mounted = false;
      if (gameRef.current) {
        gameRef.current.events.off('gameComplete', handleGameComplete);
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [gameType, language, difficulty, handleGameComplete]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        id="phaser-game"
        className="rounded-2xl overflow-hidden shadow-lg mx-auto"
        style={{ maxWidth: 800, aspectRatio: '4/3' }}
      />
      <button
        onClick={toggleFullscreen}
        className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-lg px-3 py-1.5 text-sm font-medium shadow-md transition-colors z-10"
      >
        {isFullscreen ? '⬜ Exit' : '⬛ Fullscreen'}
      </button>
    </div>
  );
}
