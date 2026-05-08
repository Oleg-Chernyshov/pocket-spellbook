import { defineStore } from 'pinia';
import type { LanguageCode } from 'src/interfaces';
import { safeGetItem, safeSetItem, STORAGE_KEYS } from 'src/utils/storage';

function getStoredLanguage(): LanguageCode {
  const stored = safeGetItem(STORAGE_KEYS.language);

  if (stored === 'en' || stored === 'ru') {
    return stored;
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
      safeSetItem(STORAGE_KEYS.language, lang);
    },
  },
});
