import { create } from 'zustand';
import type { TTSProviderType } from '@/lib/tts/provider';
import type { VoiceEntry } from '@/lib/tts/voice-catalog';

export interface SubtitleEntry {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
}

interface TTSState {
  text: string;
  language: string;
  selectedVoice: VoiceEntry | null;
  provider: TTSProviderType;
  speed: number;
  pitch: number;
  isGenerating: boolean;
  audioUrl: string | null;
  audioBlob: Blob | null;
  subtitles: SubtitleEntry[];
  error: string | null;

  setText: (text: string) => void;
  setLanguage: (language: string) => void;
  setSelectedVoice: (voice: VoiceEntry | null) => void;
  setProvider: (provider: TTSProviderType) => void;
  setSpeed: (speed: number) => void;
  setPitch: (pitch: number) => void;
  setIsGenerating: (generating: boolean) => void;
  setAudio: (url: string | null, blob: Blob | null) => void;
  setSubtitles: (subtitles: SubtitleEntry[]) => void;
  updateSubtitle: (id: string, updates: Partial<SubtitleEntry>) => void;
  removeSubtitle: (id: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  text: '',
  language: 'hi',
  selectedVoice: null as VoiceEntry | null,
  provider: 'browser' as TTSProviderType,
  speed: 1.0,
  pitch: 1.0,
  isGenerating: false,
  audioUrl: null as string | null,
  audioBlob: null as Blob | null,
  subtitles: [] as SubtitleEntry[],
  error: null as string | null,
};

export const useTTSStore = create<TTSState>((set) => ({
  ...initialState,

  setText: (text) => set({ text }),
  setLanguage: (language) => set({ language, selectedVoice: null }),
  setSelectedVoice: (voice) =>
    set({ selectedVoice: voice, provider: voice?.provider || 'browser' }),
  setProvider: (provider) => set({ provider }),
  setSpeed: (speed) => set({ speed: Math.max(0.25, Math.min(4, speed)) }),
  setPitch: (pitch) => set({ pitch: Math.max(0.5, Math.min(2, pitch)) }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setAudio: (audioUrl, audioBlob) => set({ audioUrl, audioBlob }),
  setSubtitles: (subtitles) => set({ subtitles }),
  updateSubtitle: (id, updates) =>
    set((state) => ({
      subtitles: state.subtitles.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
  removeSubtitle: (id) =>
    set((state) => ({
      subtitles: state.subtitles.filter((s) => s.id !== id),
    })),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
