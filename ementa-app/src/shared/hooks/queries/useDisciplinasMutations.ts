/**
 * @file useDisciplinasMutations.ts
 * @description Hooks customizados do TanStack Query (useMutation) para operações de escrita, edição e exclusão de Disciplinas com invalidação de cache.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createDisciplina,
  updateDisciplinaGlobal,
  deleteDisciplinaGlobal,
} from '../../../modules/disciplinas/services/disciplinasService';
import type { Disciplina, DisciplinaGlobalItem } from '../../../modules/disciplinas/services/types';
import { DISCIPLINAS_QUERY_KEY } from './useDisciplinasQuery';
import { CURSOS_QUERY_KEY } from './useCursosQuery';

/**
 * Hook de mutação para criar uma nova disciplina no catálogo ou vinculada a um curso.
 */
export function useCreateDisciplinaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cursoId, disciplina }: { cursoId: string; disciplina: Omit<Disciplina, 'id'> }) => {
      return await createDisciplina(cursoId, disciplina);
    },
    onSuccess: () => {
      // Invalida tanto as listas globais quanto as listas específicas de disciplinas por curso
      queryClient.invalidateQueries({ queryKey: [DISCIPLINAS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CURSOS_QUERY_KEY] });
    },
  });
}

/**
 * Hook de mutação para atualizar uma disciplina existente no catálogo geral.
 */
export function useUpdateDisciplinaGlobalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedItem: DisciplinaGlobalItem) => {
      return await updateDisciplinaGlobal(updatedItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DISCIPLINAS_QUERY_KEY] });
    },
  });
}

/**
 * Hook de mutação para excluir uma disciplina globalmente.
 */
export function useDeleteDisciplinaGlobalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteDisciplinaGlobal(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DISCIPLINAS_QUERY_KEY] });
    },
  });
}
