export const STORAGE_KEYS = {
  accessToken: 'ps_access_token',
  refreshToken: 'ps_refresh_token',
  language: 'ps_language',
  smartSearch: 'ps_smart_search',
  activeCharacterId: 'ps_active_character_id',
} as const;

export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage errors
  }
}

export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
}

export function safeSetOrRemoveItem(
  key: string,
  value: string | null | undefined
): void {
  if (value) {
    safeSetItem(key, value);
    return;
  }

  safeRemoveItem(key);
}
