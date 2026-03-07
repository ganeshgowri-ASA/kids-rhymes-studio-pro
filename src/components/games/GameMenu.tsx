'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/game-store';

interface GameMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export default function GameMenu({ onResume, onRestart, onQuit }: GameMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { soundEnabled, toggleSound } = useGameStore();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-3 left-3 bg-white/80 hover:bg-white rounded-lg px-3 py-1.5 text-sm font-medium shadow-md transition-colors z-10"
      >
        ⏸ Menu
      </button>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 rounded-2xl">
      <div className="bg-white rounded-2xl p-6 shadow-xl w-64 space-y-3">
        <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Paused</h3>

        <button
          onClick={() => { setIsOpen(false); onResume(); }}
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors"
        >
          ▶ Resume
        </button>

        <button
          onClick={() => { setIsOpen(false); onRestart(); }}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors"
        >
          🔄 Restart
        </button>

        <button
          onClick={toggleSound}
          className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold transition-colors"
        >
          {soundEnabled ? '🔊 Sound: On' : '🔇 Sound: Off'}
        </button>

        <button
          onClick={onQuit}
          className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors"
        >
          🚪 Quit
        </button>
      </div>
    </div>
  );
}
