import { boot } from 'quasar/wrappers';
import axios, { AxiosError, AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const apiBaseURL = process.env.API_BASE_URL || 'http://localhost:3000';
const api = axios.create({ baseURL: apiBaseURL });

const ACCESS_TOKEN_STORAGE_KEY = 'ps_access_token';

function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function setAccessToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Placeholder for future refresh token flow
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function enqueueRequestPromise(
  resolve: (value?: unknown) => void,
  reject: (reason?: unknown) => void
) {
  pendingQueue.push({ resolve, reject });
}

function resolvePendingQueue() {
  pendingQueue.forEach(({ resolve }) => resolve(undefined));
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        // No refresh endpoint yet — perform soft logout behavior
        setAccessToken(null);
        isRefreshing = false;
        resolvePendingQueue();
      } else {
        await new Promise(enqueueRequestPromise);
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
