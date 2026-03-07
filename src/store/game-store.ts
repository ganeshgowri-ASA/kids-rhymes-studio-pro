import { create } from 'zustand';
interface GameState { currentGame: string | null; scores: Record<string, number>; difficulty: string; setGame: (g: string) => void; setScore: (game: string, score: number) => void; }
export const useGameStore = create<GameState>((set) => ({ currentGame: null, scores: {}, difficulty: 'easy', setGame: (g) => set({ currentGame: g }), setScore: (game, score) => set((s) => ({ scores: { ...s.scores, [game]: score } })) }));
