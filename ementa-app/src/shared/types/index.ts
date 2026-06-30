/**
 * @file index.ts
 * @description Exportações de tipagens genéricas e utilitários globais de paginação e resposta.
 */

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
