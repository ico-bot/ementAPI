/**
 * @file authService.ts
 * @description Serviço responsável por gerenciar a autenticação e sessão local de usuários no sistema.
 */

import type { LoginCredentials, LoginResponse } from './types';

/**
 * Simula a chamada de autenticação em uma API.
 * Permite acesso apenas com as credenciais admin / admin123.
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const username = credentials.username || '';
  const password = credentials.password || '';

  // Atraso artificial de rede de 1 segundo
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (username.trim() === 'admin' && password === 'admin123') {
    // Grava informações no localStorage para persistência de sessão
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', username);

    return {
      success: true,
      username,
    };
  }

  throw new Error('Usuário ou senha incorretos.');
};

/**
 * Realiza o logout, limpando a sessão.
 */
export const logout = (): void => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
};

/**
 * Verifica se o usuário atual está autenticado.
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

/**
 * Retorna o nome do usuário logado atualmente.
 */
export const getLoggedUser = (): string => {
  return localStorage.getItem('username') || '';
};
