import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'cleanpro-theme';

/** Read persisted mode synchronously so first paint matches <html> boot script and avoid light→dark flicker. */
export function getStoredThemeMode() {
  if (typeof window === 'undefined') return 'light';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 'light';
    const p = JSON.parse(raw);
    return p?.state?.mode === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: getStoredThemeMode(),
      toggle: () => set({ mode: get().mode === 'dark' ? 'light' : 'dark' }),
      setMode: (mode) => set({ mode: mode === 'dark' ? 'dark' : 'light' }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);

/** Apply <html class="dark"> from current store (call after rehydrate or from ThemeSync). */
export function applyThemeToDocument(mode) {
  document.documentElement.classList.toggle('dark', mode === 'dark');
}
