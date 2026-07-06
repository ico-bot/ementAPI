/**
 * @file useDocentesQuery.ts
 * @description Hooks customizados do TanStack Query para busca, paginação e cache do catálogo de Docentes e vínculos com disciplinas.
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  fetchDocentes,
  fetchDocentesPaginated,
  fetchDocenteById,
  fetchVinculosDocenteDisciplina,
  fetchDisciplinasByDocenteId,
} from '../../../modules/docentes/services/docentesService';
import type { FiltrosDocente } from '../../../modules/docentes/services/types';

export const DOCENTES_QUERY_KEY = 'docentes';

/**
 * Hook para buscar o catálogo de docentes de forma paginada com suporte a filtros.
 */
export function useDocentesPaginated(page: number, itemsPerPage: number, filtros?: FiltrosDocente) {
  return useQuery({
    queryKey: [DOCENTES_QUERY_KEY, 'paginated', page, itemsPerPage, filtros],
    queryFn: () => fetchDocentesPaginated(page, itemsPerPage, filtros),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para buscar a lista completa de docentes (para seletores/referência).
 */
export function useDocentes(filtros?: FiltrosDocente) {
  return useQuery({
    queryKey: [DOCENTES_QUERY_KEY, 'all', filtros],
    queryFn: () => fetchDocentes(filtros),
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook para buscar os detalhes de um docente por ID.
 */
export function useDocenteById(id?: string) {
  return useQuery({
    queryKey: [DOCENTES_QUERY_KEY, 'detail', id],
    queryFn: () => fetchDocenteById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para buscar vínculos docente-disciplina (com cache prolongado pois é dado de referência).
 */
export function useVinculosDocenteDisciplina(params?: { cursoId?: string; disciplinaId?: string; docenteId?: string }) {
  return useQuery({
    queryKey: [DOCENTES_QUERY_KEY, 'vinculos', params],
    queryFn: () => fetchVinculosDocenteDisciplina(params),
    staleTime: 1000 * 60 * 10, // 10 minutos de cache para evitar requisições repetidas nas listagens
  });
}

/**
 * Hook para buscar disciplinas lecionadas por um docente específico.
 */
export function useDisciplinasByDocenteId(docenteId?: string) {
  return useQuery({
    queryKey: [DOCENTES_QUERY_KEY, 'disciplinas-by-docente', docenteId],
    queryFn: () => fetchDisciplinasByDocenteId(docenteId!),
    enabled: !!docenteId,
    staleTime: 1000 * 60 * 5,
  });
}
