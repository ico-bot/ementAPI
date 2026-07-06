/**
 * @file useCursosQuery.ts
 * @description Hooks customizados do TanStack Query para busca, paginação e cache do catálogo de Cursos.
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCursos, fetchCursosPaginated, fetchCursoById } from '../../../modules/cursos/services/cursosService';
import type { FiltrosCurso } from '../../../modules/cursos/services/types';

export const CURSOS_QUERY_KEY = 'cursos';

/**
 * Hook para buscar a lista paginada e filtrada de cursos com cache inteligente.
 * @param page Número da página (1-indexed)
 * @param itemsPerPage Quantidade de itens por página
 * @param filtros Filtros aplicados no catálogo
 */
export function useCursosPaginated(page: number, itemsPerPage: number, filtros?: FiltrosCurso) {
  return useQuery({
    queryKey: [CURSOS_QUERY_KEY, 'paginated', page, itemsPerPage, filtros],
    queryFn: () => fetchCursosPaginated(page, itemsPerPage, filtros),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache fresco
  });
}

/**
 * Hook para buscar todos os cursos (geralmente usado em seletores e selects).
 * @param filtros Filtros opcionais
 */
export function useCursos(filtros?: FiltrosCurso) {
  return useQuery({
    queryKey: [CURSOS_QUERY_KEY, 'all', filtros],
    queryFn: () => fetchCursos(filtros),
    staleTime: 1000 * 60 * 10, // 10 minutos para listas de referência
  });
}

/**
 * Hook para buscar um curso específico por ID.
 * @param id ID do curso
 */
export function useCursoById(id?: string) {
  return useQuery({
    queryKey: [CURSOS_QUERY_KEY, 'detail', id],
    queryFn: () => fetchCursoById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
