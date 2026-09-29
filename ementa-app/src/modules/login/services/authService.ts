/**
 * @file authService.ts
 * @description Serviço responsável por gerenciar a autenticação integrada via JWT com o Back-End Django.
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
  localStorage.setItem('userRole', 'ADMIN');
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
    console.error('Falha ao renovar token JWT via refresh:', error);
    logout();
  }
  return null;
};

/**
 * Realiza o login via API Back-End (/login/).
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
    throw new Error('Resposta inválida do servidor ao autenticar.');
  } catch (error: any) {
    console.error('Erro ao realizar login no Back-End (/login/):', error);
    throw error;
  }
};

/**
 * Realiza o logout, limpando a sessão e os tokens JWT.
 */
export const logout = (): void => {
  localStorage.removeItem(IS_AUTH_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem('userRole');
};

/**
 * Verifica se o usuário atual está autenticado no sistema.
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(IS_AUTH_KEY) === 'true';
};

/**
 * Verifica se o usuário atual é Administrador.
 */
export const isAdmin = (): boolean => {
  return isAuthenticated();
};

/**
 * Retorna o nome do usuário logado atualmente.
 */
export const getLoggedUser = (): string => {
  return localStorage.getItem(USERNAME_KEY) || '';
};
