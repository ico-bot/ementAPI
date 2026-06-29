/**
 * @file types.ts
 * @description Definições de tipos e interfaces para o módulo de Login e Autenticação.
 */

export interface LoginCredentials {
  username?: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  username: string;
}
