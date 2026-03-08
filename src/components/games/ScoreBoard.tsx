'use client';

import { useGameStore, GameType } from '@/store/game-store';
import { motion } from 'framer-motion';

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
  matching: '\uD83C\uDCCF',
  karaoke: '\uD83C\uDFA4',
  puzzle: '\uD83E\uDDE9',
};

export default function ScoreBoard() {
  const { progress, achievements } = useGameStore();
  const games: GameType[] = ['alphabet', 'counting', 'matching', 'karaoke', 'puzzle'];

  const totalStars = Object.values(progress).reduce((sum, p) => sum + p.stars, 0);
  const maxStars = games.length * 3;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="font-heading text-xl font-bold text-gray-800 dark:text-white mb-4">Progress</h2>

      {/* Overall stars */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl"
      >
        <span className="text-2xl">{"\u2B50"}</span>
        <div className="flex-1">
          <div className="font-bold text-yellow-700 dark:text-yellow-400">{totalStars} / {maxStars} Stars</div>
          <div className="w-full h-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-full overflow-hidden mt-1">
            <motion.div
              className="h-full bg-yellow-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(totalStars / maxStars) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Per-game progress */}
      <div className="space-y-2">
        {games.map((game, idx) => {
          const p = progress[game];
          return (
            <motion.div
              key={game}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <span className="text-lg w-8 text-center">{GAME_ICONS[game]}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{GAME_NAMES[game]}</div>
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={`text-sm ${p && p.stars > i ? 'opacity-100' : 'opacity-20'}`}>{"\u2B50"}</span>
                  ))}
                  {p && <span className="text-xs text-gray-400 ml-2">Best: {p.highScore}</span>}
                </div>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">{p ? `${p.timesPlayed}x` : '\u2014'}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Achievements */}
      <h3 className="font-heading text-lg font-bold text-gray-800 dark:text-white mt-6 mb-3">Achievements</h3>
      <div className="grid grid-cols-2 gap-2">
        {achievements.map((a) => (
          <motion.div
            key={a.id}
            whileHover={{ scale: 1.03 }}
            className={`p-2 rounded-lg text-xs ${a.unlocked ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 opacity-50'}`}
          >
            <div className="font-bold text-gray-800 dark:text-white">{a.unlocked ? '\uD83C\uDFC6' : '\uD83D\uDD12'} {a.title}</div>
            <div className="text-gray-500 dark:text-gray-400">{a.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
