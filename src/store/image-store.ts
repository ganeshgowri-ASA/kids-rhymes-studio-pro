import { create } from "zustand";
import type { ImageStyle, AspectRatio } from "@/lib/image/replicate-client";

export interface GeneratedImage {
  id: string;
  prompt: string;
  style: ImageStyle;
  aspectRatio: AspectRatio;
  status: "starting" | "processing" | "succeeded" | "failed";
  imageUrl?: string;
  error?: string;
  createdAt: number;
}

interface ImageState {
  images: GeneratedImage[];
  selectedStyle: ImageStyle;
  selectedAspectRatio: AspectRatio;
  customPrompt: string;
  selectedTheme: string;
  isGenerating: boolean;
  lightboxImage: GeneratedImage | null;

  setStyle: (style: ImageStyle) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setCustomPrompt: (prompt: string) => void;
  setTheme: (theme: string) => void;
  setGenerating: (v: boolean) => void;
  addImage: (image: GeneratedImage) => void;
  updateImage: (id: string, updates: Partial<GeneratedImage>) => void;
  removeImage: (id: string) => void;
  setLightboxImage: (image: GeneratedImage | null) => void;
  clearImages: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
  images: [],
  selectedStyle: "cartoon",
  selectedAspectRatio: "16:9",
  customPrompt: "",
  selectedTheme: "",
  isGenerating: false,
  lightboxImage: null,

  setStyle: (style) => set({ selectedStyle: style }),
  setAspectRatio: (ratio) => set({ selectedAspectRatio: ratio }),
  setCustomPrompt: (prompt) => set({ customPrompt: prompt }),
  setTheme: (theme) => set({ selectedTheme: theme }),
  setGenerating: (v) => set({ isGenerating: v }),
  addImage: (image) => set((s) => ({ images: [image, ...s.images] })),
  updateImage: (id, updates) =>
    set((s) => ({
      images: s.images.map((img) => (img.id === id ? { ...img, ...updates } : img)),
    })),
  removeImage: (id) => set((s) => ({ images: s.images.filter((img) => img.id !== id) })),
  setLightboxImage: (image) => set({ lightboxImage: image }),
  clearImages: () => set({ images: [] }),
}));
