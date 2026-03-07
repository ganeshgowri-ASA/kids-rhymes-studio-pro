import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GameType = 'alphabet' | 'counting' | 'matching' | 'karaoke' | 'puzzle';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameProgress {
  highScore: number;
  stars: number; // 0-3
  timesPlayed: number;
  lastPlayed: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

interface GameState {
  currentGame: GameType | null;
  language: string;
  difficulty: Difficulty;
  soundEnabled: boolean;
  progress: Record<string, GameProgress>;
  achievements: Achievement[];

  setGame: (game: GameType | null) => void;
  setLanguage: (lang: string) => void;
  setDifficulty: (d: Difficulty) => void;
  toggleSound: () => void;
  updateProgress: (game: GameType, score: number, stars: number) => void;
  unlockAchievement: (id: string) => void;
  getProgress: (game: GameType) => GameProgress;
}

const DEFAULT_PROGRESS: GameProgress = {
  highScore: 0,
  stars: 0,
  timesPlayed: 0,
  lastPlayed: null,
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_game', title: 'First Steps', description: 'Play your first game', unlocked: false },
  { id: 'perfect_score', title: 'Perfect!', description: 'Get 3 stars in any game', unlocked: false },
  { id: 'all_games', title: 'Explorer', description: 'Try all 5 games', unlocked: false },
  { id: 'ten_games', title: 'Dedicated', description: 'Play 10 games total', unlocked: false },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentGame: null,
      language: 'en',
      difficulty: 'easy',
      soundEnabled: true,
      progress: {},
      achievements: INITIAL_ACHIEVEMENTS,

      setGame: (game) => set({ currentGame: game }),
      setLanguage: (lang) => set({ language: lang }),
      setDifficulty: (d) => set({ difficulty: d }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      updateProgress: (game, score, stars) =>
        set((s) => {
          const prev = s.progress[game] || DEFAULT_PROGRESS;
          const newProgress = {
            ...s.progress,
            [game]: {
              highScore: Math.max(prev.highScore, score),
              stars: Math.max(prev.stars, stars),
              timesPlayed: prev.timesPlayed + 1,
              lastPlayed: new Date().toISOString(),
            },
          };

          // Check achievements
          const achievements = [...s.achievements];
          const totalPlayed = Object.values(newProgress).reduce((sum, p) => sum + p.timesPlayed, 0);
          const gamesWithPlays = Object.keys(newProgress).filter((k) => newProgress[k].timesPlayed > 0);

          if (totalPlayed >= 1) {
            const a = achievements.find((x) => x.id === 'first_game');
            if (a) a.unlocked = true;
          }
          if (stars >= 3) {
            const a = achievements.find((x) => x.id === 'perfect_score');
            if (a) a.unlocked = true;
          }
          if (gamesWithPlays.length >= 5) {
            const a = achievements.find((x) => x.id === 'all_games');
            if (a) a.unlocked = true;
          }
          if (totalPlayed >= 10) {
            const a = achievements.find((x) => x.id === 'ten_games');
            if (a) a.unlocked = true;
          }

          return { progress: newProgress, achievements };
        }),

      unlockAchievement: (id) =>
        set((s) => ({
          achievements: s.achievements.map((a) =>
            a.id === id ? { ...a, unlocked: true } : a
          ),
        })),

      getProgress: (game) => get().progress[game] || DEFAULT_PROGRESS,
    }),
    { name: 'kids-game-progress' }
  )
);
