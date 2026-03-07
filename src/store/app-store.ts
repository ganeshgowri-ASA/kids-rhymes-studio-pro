import { create } from "zustand";

interface AppState {
  language: string;
  setLanguage: (lang: string) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: "en",
  setLanguage: (lang) => set({ language: lang }),
  theme: "light",
  setTheme: (theme) => set({ theme }),
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
