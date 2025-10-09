import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  RegisterRequest,
  User,
} from 'src/interfaces';

const ACCESS_TOKEN_STORAGE_KEY = 'ps_access_token';

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

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: readToken() as string | null,
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

        saveToken(this.token);
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

    logout(): void {
      this.user = null;
      this.token = null;
      saveToken(null);
    },
  },
});
