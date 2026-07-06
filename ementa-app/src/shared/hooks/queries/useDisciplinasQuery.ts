/**
 * @file useDisciplinasQuery.ts
 * @description Hooks customizados do TanStack Query para busca, paginação e cache do catálogo de Disciplinas e Matrizes Curriculares.
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  fetchDisciplinasGlobal,
  fetchDisciplinasByCursoId,
  fetchCurriculoByCursoId,
  fetchPPCByCurriculoId,
} from '../../../modules/disciplinas/services/disciplinasService';
import type { FiltrosDisciplina, FiltrosDisciplinaGlobal } from '../../../modules/disciplinas/services/types';

export const DISCIPLINAS_QUERY_KEY = 'disciplinas';

/**
 * Hook para buscar o catálogo global de disciplinas de forma paginada e filtrada.
 */
export function useDisciplinasGlobalPaginated(page: number, itemsPerPage: number, filtros?: FiltrosDisciplinaGlobal) {
  return useQuery({
    queryKey: [DISCIPLINAS_QUERY_KEY, 'global-paginated', page, itemsPerPage, filtros],
    queryFn: () => fetchDisciplinasGlobal(page, itemsPerPage, filtros),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para buscar disciplinas lecionadas/vinculadas a um curso específico.
 */
export function useDisciplinasByCursoId(cursoId?: string, filtros?: FiltrosDisciplina) {
  return useQuery({
    queryKey: [DISCIPLINAS_QUERY_KEY, 'by-curso', cursoId, filtros],
    queryFn: () => fetchDisciplinasByCursoId(cursoId!, filtros),
    enabled: !!cursoId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para buscar o currículo corrente de um curso.
 */
export function useCurriculoByCursoId(cursoId?: string) {
  return useQuery({
    queryKey: [DISCIPLINAS_QUERY_KEY, 'curriculo', cursoId],
    queryFn: () => fetchCurriculoByCursoId(cursoId!),
    enabled: !!cursoId,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook para buscar o Projeto Pedagógico de Curso (PPC) de um currículo.
 */
export function usePPCByCurriculoId(curriculoId?: string) {
  return useQuery({
    queryKey: [DISCIPLINAS_QUERY_KEY, 'ppc', curriculoId],
    queryFn: () => fetchPPCByCurriculoId(curriculoId!),
    enabled: !!curriculoId,
    staleTime: 1000 * 60 * 15,
  });
}
