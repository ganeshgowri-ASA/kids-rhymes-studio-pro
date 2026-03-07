import { create } from 'zustand';
import type { LLMProvider } from '@/lib/ai/provider';

interface SavedRhyme {
  id: string;
  title: string;
  lyrics: string;
  theme: string;
  language: string;
  provider: LLMProvider;
  createdAt: number;
}

interface RhymesState {
  currentLyrics: string;
  currentTitle: string;
  theme: string;
  provider: LLMProvider;
  isGenerating: boolean;
  savedRhymes: SavedRhyme[];
  setLyrics: (lyrics: string) => void;
  appendLyrics: (chunk: string) => void;
  setTitle: (title: string) => void;
  setTheme: (theme: string) => void;
  setProvider: (provider: LLMProvider) => void;
  setGenerating: (generating: boolean) => void;
  saveRhyme: (language: string) => void;
  deleteRhyme: (id: string) => void;
  clearCurrent: () => void;
}

export const useRhymesStore = create<RhymesState>((set, get) => ({
  currentLyrics: '',
  currentTitle: '',
  theme: '',
  provider: 'groq',
  isGenerating: false,
  savedRhymes: [],

  setLyrics: (lyrics) => set({ currentLyrics: lyrics }),
  appendLyrics: (chunk) => set((s) => ({ currentLyrics: s.currentLyrics + chunk })),
  setTitle: (title) => set({ currentTitle: title }),
  setTheme: (theme) => set({ theme }),
  setProvider: (provider) => set({ provider }),
  setGenerating: (generating) => set({ isGenerating: generating }),

  saveRhyme: (language) => {
    const { currentLyrics, currentTitle, theme, provider, savedRhymes } = get();
    if (!currentLyrics.trim()) return;
    const rhyme: SavedRhyme = {
      id: Date.now().toString(36),
      title: currentTitle || `${theme} Rhyme`,
      lyrics: currentLyrics,
      theme,
      language,
      provider,
      createdAt: Date.now(),
    };
    set({ savedRhymes: [rhyme, ...savedRhymes] });
  },

  deleteRhyme: (id) =>
    set((s) => ({ savedRhymes: s.savedRhymes.filter((r) => r.id !== id) })),

  clearCurrent: () => set({ currentLyrics: '', currentTitle: '' }),
}));
