import { create } from "zustand";
import { MusicStyle } from "@/lib/music/suno-client";

export interface Track {
  id: string;
  title: string;
  style: MusicStyle;
  audioUrl: string;
  duration: number;
  lyrics?: string;
  createdAt: number;
}

interface MusicState {
  // Playback
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  playbackSpeed: number;
  currentTime: number;

  // Generation
  isGenerating: boolean;
  generationTaskId: string | null;
  generationError: string | null;

  // Library
  tracks: Track[];
  selectedStyle: MusicStyle;

  // Actions
  setPlaying: (playing: boolean) => void;
  setCurrentTrack: (track: Track | null) => void;
  setVolume: (volume: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setCurrentTime: (time: number) => void;
  setGenerating: (generating: boolean) => void;
  setGenerationTaskId: (taskId: string | null) => void;
  setGenerationError: (error: string | null) => void;
  setSelectedStyle: (style: MusicStyle) => void;
  addTrack: (track: Track) => void;
  removeTrack: (id: string) => void;
}

export const useMusicStore = create<MusicState>((set) => ({
  isPlaying: false,
  currentTrack: null,
  volume: 0.8,
  playbackSpeed: 1,
  currentTime: 0,

  isGenerating: false,
  generationTaskId: null,
  generationError: null,

  tracks: [],
  selectedStyle: "lullaby",

  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTrack: (currentTrack) => set({ currentTrack, currentTime: 0 }),
  setVolume: (volume) => set({ volume }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationTaskId: (generationTaskId) => set({ generationTaskId }),
  setGenerationError: (generationError) => set({ generationError }),
  setSelectedStyle: (selectedStyle) => set({ selectedStyle }),
  addTrack: (track) =>
    set((state) => ({ tracks: [track, ...state.tracks] })),
  removeTrack: (id) =>
    set((state) => ({ tracks: state.tracks.filter((t) => t.id !== id) })),
}));
