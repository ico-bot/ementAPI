/**
 * @file disciplinasService.ts
 * @description Serviço responsável pelas operações assíncronas de busca e manipulação de Disciplinas.
 */

import { simulateNetworkDelay } from '../../../shared/services/mockClient';
import { DISCIPLINAS_MOCK } from './disciplinasMock';
import type { Disciplina, DisciplinaInput } from './types';

let disciplinasLocalStore = [...DISCIPLINAS_MOCK];

export const fetchDisciplinasByCursoId = async (cursoId: string): Promise<Disciplina[]> => {
  await simulateNetworkDelay();
  return disciplinasLocalStore.filter((disciplina) => disciplina.cursoId === cursoId);
};

export const createDisciplina = async (input: DisciplinaInput): Promise<Disciplina> => {
  await simulateNetworkDelay();
  const novaDisciplina: Disciplina = {
    ...input,
    id: String(Date.now()),
  };
  disciplinasLocalStore = [novaDisciplina, ...disciplinasLocalStore];
  return novaDisciplina;
};
