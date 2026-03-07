import { create } from 'zustand';
interface AppState {
  language: string;
  setLanguage: (lang: string) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}
export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
