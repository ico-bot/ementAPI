/**
 * @file authService.ts
 * @description Serviço responsável por gerenciar a autenticação integrada via JWT com o Back-End Django e fallback local em memória.
 */

import { apiClient } from '../../../shared/services/apiClient';
import type { JwtTokenDto, LoginCredentials, LoginResponse } from './types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const IS_AUTH_KEY = 'isAuthenticated';
const USERNAME_KEY = 'username';

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (access: string, refresh: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  localStorage.setItem(IS_AUTH_KEY, 'true');
};

/**
 * Tenta obter um novo Access Token usando o Refresh Token armazenado.
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const response = await apiClient<{ access: string }>('/login/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
      skipAuth: true,
    } as any);

    if (response && response.access) {
      localStorage.setItem(ACCESS_TOKEN_KEY, response.access);
      return response.access;
    }
  } catch (error) {
    console.warn('Falha ao renovar token JWT via refresh:', error);
    logout();
  }
  return null;
};

/**
 * Realiza o login via API Back-End (/login/) com fallback para autenticação local em memória.
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const username = credentials.username || '';
  const password = credentials.password || '';

  try {
    const response = await apiClient<JwtTokenDto>('/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      skipAuth: true,
    } as any);

    if (response && response.access && response.refresh) {
      setTokens(response.access, response.refresh);
      localStorage.setItem(USERNAME_KEY, username);

      return {
        success: true,
        username,
        accessToken: response.access,
        refreshToken: response.refresh,
      };
    }
  } catch (error) {
    console.warn('API de Login (/login/) indisponível ou falha nas credenciais remotas. Avaliando fallback local:', error);
  }

  // Fallback local em memória para manter simetria e funcionamento off-line durante desenvolvimento
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (username.trim() === 'admin' && password === 'admin123') {
    localStorage.setItem(IS_AUTH_KEY, 'true');
    localStorage.setItem(USERNAME_KEY, username);

    return {
      success: true,
      username,
    };
  }

  throw new Error('Usuário ou senha incorretos.');
};

/**
 * Realiza o logout, limpando a sessão e os tokens JWT.
 */
export const logout = (): void => {
  localStorage.removeItem(IS_AUTH_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Verifica se o usuário atual está autenticado no sistema.
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(IS_AUTH_KEY) === 'true';
};

/**
 * Retorna o nome do usuário logado atualmente.
 */
export const getLoggedUser = (): string => {
  return localStorage.getItem(USERNAME_KEY) || '';
};
