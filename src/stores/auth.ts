import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRefreshResponse,
  RegisterRequest,
  User,
} from 'src/interfaces';

const ACCESS_TOKEN_STORAGE_KEY = 'ps_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'ps_refresh_token';

function saveToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {}
}

function readToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveRefreshToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch {}
}

function readRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
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
        const { data } = await api.post<AuthLoginResponse>(
          '/auth/login',
          payload
        );

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
        await api.post('/auth/register', payload);
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
        const { data } = await api.post<AuthRefreshResponse>(
          '/auth/refresh',
          {},
          {
            headers: {
              Authorization: `Bearer ${this.refreshToken}`,
            },
          }
        );

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

    async logout(): Promise<void> {
      // Пытаемся отправить запрос на logout, но не критично если не получится
      try {
        if (this.token) {
          await api.post(
            '/auth/logout',
            {},
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          );
        }
      } catch (error) {
        // Игнорируем ошибки logout на сервере
        console.error('Logout error:', error);
      } finally {
        // В любом случае очищаем локальное состояние
        this.user = null;
        this.token = null;
        this.refreshToken = null;
        saveToken(null);
        saveRefreshToken(null);
      }
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
