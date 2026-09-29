/**
 * @file useCursosMutations.ts
 * @description Hooks de mutação reativos do TanStack Query (useMutation) para o domínio de Cursos, com invalidação automática de cache.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCurso, updateCurso, deleteCurso } from '../../../modules/cursos/services/cursosService';
import type { Curso } from '../../../modules/cursos/services/types';
import { CURSOS_QUERY_KEY } from './useCursosQuery';

/**
 * Hook de mutação para criar um novo Curso no sistema com preservação de edição manual.
 */
export function useCreateCursoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCurso: Omit<Curso, 'id'>) => {
      return await createCurso(newCurso);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CURSOS_QUERY_KEY] });
    },
  });
}

/**
 * Hook de mutação para atualizar os dados de um Curso existente no catálogo.
 */
export function useUpdateCursoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedCurso: Curso) => {
      return await updateCurso(updatedCurso);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CURSOS_QUERY_KEY] });
    },
  });
}

/**
 * Hook de mutação para remover um Curso por ID no banco de dados.
 */
export function useDeleteCursoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteCurso(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CURSOS_QUERY_KEY] });
    },
  });
}
