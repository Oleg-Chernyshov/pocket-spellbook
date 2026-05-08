import { boot } from 'quasar/wrappers';
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { Router } from 'vue-router';
import { Notify } from 'quasar';
import { i18n } from './i18n';
import { useAuthStore } from 'src/stores/auth';
import type { AuthRefreshResponse } from 'src/interfaces';
import { refreshTokens as refreshTokensRequest } from 'src/services/auth.service';
import {
  safeGetItem,
  safeSetOrRemoveItem,
  STORAGE_KEYS,
} from 'src/utils/storage';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const apiBaseURL = process.env.API_BASE_URL || 'http://localhost:3000';
const api = axios.create({ baseURL: apiBaseURL });

let router: Router;

function getAccessToken(): string | null {
  return safeGetItem(STORAGE_KEYS.accessToken);
}

function setAccessToken(token: string | null): void {
  safeSetOrRemoveItem(STORAGE_KEYS.accessToken, token);
}

function getRefreshToken(): string | null {
  return safeGetItem(STORAGE_KEYS.refreshToken);
}

function setRefreshToken(token: string | null): void {
  safeSetOrRemoveItem(STORAGE_KEYS.refreshToken, token);
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Refresh token flow
let isRefreshing = false;

let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: Error | null, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
}

export async function refreshTokens(
  refreshTokenValue?: string
): Promise<AuthRefreshResponse> {
  const refreshToken = refreshTokenValue ?? getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const data = await refreshTokensRequest(refreshToken);
  setAccessToken(data.access_token);
  setRefreshToken(data.refresh_token);

  return data;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Проверяем, что это 401 ошибка и это не запрос на refresh или login
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        // Если уже идет обновление токена, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokenData = await refreshTokens();
        processQueue(null, tokenData.access_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${tokenData.access_token}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);

        // Очищаем токены и состояние при неудачной попытке обновления
        const authStore = useAuthStore();
        authStore.clearSession();
        setAccessToken(null);
        setRefreshToken(null);

        // Показываем уведомление пользователю
        Notify.create({
          type: 'negative',
          message: i18n.global.t('errors.sessionExpired'),
          position: 'top',
        });

        // Перенаправляем на страницу логина
        if (router) {
          router.push({ name: 'login' }).catch(() => {
            // Игнорируем ошибку если уже на странице логина
          });
        } else if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default boot(({ app, router: appRouter }) => {
  router = appRouter;
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
