import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from 'src/interfaces';
import axios from 'axios';

const apiBaseURL = process.env.API_BASE_URL || 'http://localhost:3000';
const authApi = axios.create({ baseURL: apiBaseURL });

export async function login(
  payload: AuthLoginRequest
): Promise<AuthLoginResponse> {
  const { data } = await authApi.post<AuthLoginResponse>('/auth/login', payload);
  return data;
}

export async function register(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  const { data } = await authApi.post<RegisterResponse>('/auth/register', payload);
  return data;
}

export async function refreshTokens(
  refreshToken: string
): Promise<AuthRefreshResponse> {
  const { data } = await authApi.post<AuthRefreshResponse>(
    '/auth/refresh',
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );
  return data;
}
