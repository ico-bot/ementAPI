/**
 * @file index.ts
 * @description Exportações de tipagens genéricas e utilitários globais de paginação e resposta.
 */

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalCount?: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}
