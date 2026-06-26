/**
 * @file cursosService.ts
 * @description Serviço responsável pelas operações assíncronas de busca e manipulação de Cursos.
 */

import { simulateNetworkDelay } from '../../../shared/services/mockClient';
import { CURSOS_MOCK } from './cursosMock';
import type { Curso, CursoInput } from './types';

let cursosLocalStore = [...CURSOS_MOCK];

export const fetchCursos = async (): Promise<Curso[]> => {
  await simulateNetworkDelay();
  return [...cursosLocalStore];
};

export const fetchCursoById = async (id: string): Promise<Curso | undefined> => {
  await simulateNetworkDelay();
  return cursosLocalStore.find((curso) => curso.id === id);
};

export const createCurso = async (input: CursoInput): Promise<Curso> => {
  await simulateNetworkDelay();
  const novoCurso: Curso = {
    ...input,
    id: String(Date.now()),
    ativo: true,
  };
  cursosLocalStore = [novoCurso, ...cursosLocalStore];
  return novoCurso;
};
