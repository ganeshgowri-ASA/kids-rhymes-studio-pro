'use client';

import { useGameStore, GameType } from '@/store/game-store';

const GAME_NAMES: Record<GameType, string> = {
  alphabet: 'Alphabet Tracing',
  counting: 'Number Counting',
  matching: 'Memory Match',
  karaoke: 'Rhyme Karaoke',
  puzzle: 'Jigsaw Puzzle',
};

const GAME_ICONS: Record<GameType, string> = {
  alphabet: 'ABC',
  counting: '123',
  matching: '🃏',
  karaoke: '🎤',
  puzzle: '🧩',
};

export default function ScoreBoard() {
  const { progress, achievements } = useGameStore();
  const games: GameType[] = ['alphabet', 'counting', 'matching', 'karaoke', 'puzzle'];

  const totalStars = Object.values(progress).reduce((sum, p) => sum + p.stars, 0);
  const maxStars = games.length * 3;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Progress</h2>

      {/* Overall stars */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-50 rounded-xl">
        <span className="text-2xl">⭐</span>
        <div>
          <div className="font-bold text-yellow-700">{totalStars} / {maxStars} Stars</div>
          <div className="w-32 h-2 bg-yellow-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all"
              style={{ width: `${(totalStars / maxStars) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Per-game progress */}
      <div className="space-y-3">
        {games.map((game) => {
          const p = progress[game];
          return (
            <div key={game} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
              <span className="text-lg w-8 text-center">{GAME_ICONS[game]}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-700 truncate">{GAME_NAMES[game]}</div>
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={`text-sm ${p && p.stars > i ? 'opacity-100' : 'opacity-20'}`}>⭐</span>
                  ))}
                  {p && <span className="text-xs text-gray-400 ml-2">Best: {p.highScore}</span>}
                </div>
              </div>
              <span className="text-xs text-gray-400">{p ? `${p.timesPlayed}x` : '—'}</span>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">Achievements</h3>
      <div className="grid grid-cols-2 gap-2">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`p-2 rounded-lg text-xs ${a.unlocked ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-100 opacity-50'}`}
          >
            <div className="font-bold">{a.unlocked ? '🏆' : '🔒'} {a.title}</div>
            <div className="text-gray-500">{a.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
