import { create } from 'zustand';
interface MusicState { isPlaying: boolean; volume: number; currentTrack: string | null; setPlaying: (p: boolean) => void; setVolume: (v: number) => void; setTrack: (t: string) => void; }
export const useMusicStore = create<MusicState>((set) => ({ isPlaying: false, volume: 0.8, currentTrack: null, setPlaying: (p) => set({ isPlaying: p }), setVolume: (v) => set({ volume: v }), setTrack: (t) => set({ currentTrack: t }) }));
