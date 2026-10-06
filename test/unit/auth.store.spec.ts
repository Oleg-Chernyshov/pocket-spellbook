import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from 'src/stores/auth';
import { STORAGE_KEYS } from 'src/utils/storage';

vi.mock('src/services/auth.service', () => ({
  login: vi.fn(),
  register: vi.fn(),
  refreshTokens: vi.fn(),
}));

import * as authService from 'src/services/auth.service';

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('stores tokens after login', async () => {
    vi.mocked(authService.login).mockResolvedValue({
      access_token: 'access',
      refresh_token: 'refresh',
      user: { id: 1, email: 'user@example.com', name: 'User' },
    });

    const store = useAuthStore();
    await store.login({ email: 'user@example.com', password: 'secret' });

    expect(store.isAuthenticated).toBe(true);
    expect(store.token).toBe('access');
    expect(localStorage.getItem(STORAGE_KEYS.accessToken)).toBe('access');
    expect(localStorage.getItem(STORAGE_KEYS.refreshToken)).toBe('refresh');
  });

  it('clears the session on logout', async () => {
    const store = useAuthStore();
    store.setTokens('access', 'refresh');
    store.user = { id: 1, email: 'user@example.com', name: 'User' };

    store.logout();

    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem(STORAGE_KEYS.accessToken)).toBeNull();
  });
});
