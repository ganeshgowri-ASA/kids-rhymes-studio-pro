import { create } from 'zustand';
interface RhymesState { currentLyrics: string; theme: string; isGenerating: boolean; setLyrics: (l: string) => void; setTheme: (t: string) => void; setGenerating: (g: boolean) => void; }
export const useRhymesStore = create<RhymesState>((set) => ({ currentLyrics: '', theme: '', isGenerating: false, setLyrics: (l) => set({ currentLyrics: l }), setTheme: (t) => set({ theme: t }), setGenerating: (g) => set({ isGenerating: g }) }));
