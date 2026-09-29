/**
 * @file useDocentesMutations.ts
 * @description Hooks de mutação reativos do TanStack Query (useMutation) para o domínio de Corpo Docente e vínculos com disciplinas.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDocente, updateDocente, deleteDocente } from '../../../modules/docentes/services/docentesService';
import type { Docente } from '../../../modules/docentes/services/types';
import { DOCENTES_QUERY_KEY } from './useDocentesQuery';

/**
 * Hook de mutação para cadastrar um novo Docente com proteção de sobrescrita automática.
 */
export function useCreateDocenteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newDocente: Omit<Docente, 'id'>) => {
      return await createDocente(newDocente);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCENTES_QUERY_KEY] });
    },
  });
}

/**
 * Hook de mutação para editar informações cadastrais ou funcionais de um Docente.
 */
export function useUpdateDocenteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedDocente: Docente) => {
      return await updateDocente(updatedDocente);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCENTES_QUERY_KEY] });
    },
  });
}

/**
 * Hook de mutação para excluir um Docente e remover seus vínculos.
 */
export function useDeleteDocenteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteDocente(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCENTES_QUERY_KEY] });
    },
  });
}
