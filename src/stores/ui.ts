import { defineStore } from 'pinia';
import type { LanguageCode } from 'src/interfaces';

const LANGUAGE_STORAGE_KEY = 'ps_language';

function getStoredLanguage(): LanguageCode {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'en' || stored === 'ru') {
      return stored;
    }
  } catch {
    // ignore storage errors
  }
  return (process.env.DEFAULT_LANGUAGE as LanguageCode) || 'ru';
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    leftDrawerOpen: false as boolean,
    dark: false as boolean,
    language: getStoredLanguage(),
  }),

  getters: {
    isDark(state): boolean {
      return state.dark;
    },
  },

  actions: {
    toggleDrawer(): void {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },

    setDrawer(open: boolean): void {
      this.leftDrawerOpen = open;
    },

    toggleDark(): void {
      this.dark = !this.dark;
    },

    setLanguage(lang: LanguageCode): void {
      this.language = lang;
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      } catch {
        // ignore storage errors
      }
    },
  },
});
