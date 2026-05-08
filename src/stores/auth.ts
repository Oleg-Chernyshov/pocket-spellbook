import { defineStore } from 'pinia';
import {
  login as loginRequest,
  refreshTokens as refreshTokensRequest,
  register as registerRequest,
} from 'src/services/auth.service';
import {
  safeGetItem,
  safeSetOrRemoveItem,
  STORAGE_KEYS,
} from 'src/utils/storage';

import type {
  AuthLoginRequest,
  RegisterRequest,
  User,
} from 'src/interfaces';

function saveToken(token: string | null): void {
  safeSetOrRemoveItem(STORAGE_KEYS.accessToken, token);
}

function readToken(): string | null {
  return safeGetItem(STORAGE_KEYS.accessToken);
}

function saveRefreshToken(token: string | null): void {
  safeSetOrRemoveItem(STORAGE_KEYS.refreshToken, token);
}

function readRefreshToken(): string | null {
  return safeGetItem(STORAGE_KEYS.refreshToken);
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: readToken() as string | null,
    refreshToken: readRefreshToken() as string | null,
    isLoading: false as boolean,
  }),

  getters: {
    isAuthenticated(state): boolean {
      return Boolean(state.token);
    },
  },

  actions: {
    async login(payload: AuthLoginRequest): Promise<void> {
      this.isLoading = true;

      try {
        const data = await loginRequest(payload);

        this.user = data.user;
        this.token = data.access_token;
        this.refreshToken = data.refresh_token;

        saveToken(this.token);
        saveRefreshToken(this.refreshToken);
      } finally {
        this.isLoading = false;
      }
    },

    async register(payload: RegisterRequest): Promise<void> {
      this.isLoading = true;

      try {
        await registerRequest(payload);
        await this.login({ email: payload.email, password: payload.password });
      } finally {
        this.isLoading = false;
      }
    },

    async refresh(): Promise<void> {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }

      try {
        const data = await refreshTokensRequest(this.refreshToken);
        this.token = data.access_token;
        this.refreshToken = data.refresh_token;

        saveToken(this.token);
        saveRefreshToken(this.refreshToken);
      } catch (error) {
        // Если refresh токен невалиден, выполняем logout
        this.logout();
        throw error;
      }
    },

    logout(): void {
      // Очищаем локальное состояние
      this.user = null;
      this.token = null;
      this.refreshToken = null;
      saveToken(null);
      saveRefreshToken(null);
    },

    // Метод для установки токенов (используется в axios interceptor)
    setTokens(accessToken: string, refreshToken: string): void {
      this.token = accessToken;
      this.refreshToken = refreshToken;
      saveToken(accessToken);
      saveRefreshToken(refreshToken);
    },

    // Получить refresh token
    getRefreshToken(): string | null {
      return this.refreshToken;
    },

    // Очистить сессию без вызова API (используется при истечении refresh токена)
    clearSession(): void {
      this.user = null;
      this.token = null;
      this.refreshToken = null;
      saveToken(null);
      saveRefreshToken(null);
    },
  },
});
