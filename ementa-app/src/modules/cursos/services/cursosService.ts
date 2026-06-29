/**
 * @file cursosService.ts
 * @description Serviço responsável pelas operações assíncronas de busca e manipulação de Cursos.
 */

import { simulateNetworkDelay } from '../../../shared/services/mockClient';
import { CURSOS_MOCK } from './cursosMock';
import type { Curso, CursoInput, FiltrosCurso } from './types';

let cursosLocalStore = [...CURSOS_MOCK];

export const fetchCursos = async (filtros?: FiltrosCurso): Promise<Curso[]> => {
  await simulateNetworkDelay();
  
  return cursosLocalStore.filter((curso) => {
    if (filtros?.termo) {
      const normalizedQuery = filtros.termo.toLowerCase();
      const matchesName = curso.nome.toLowerCase().includes(normalizedQuery);
      const matchesCode = curso.codigo.toLowerCase().includes(normalizedQuery);
      if (!matchesName && !matchesCode) return false;
    }

    if (filtros?.funcionamento && filtros.funcionamento !== 'Todos') {
      if (curso.funcionamento !== filtros.funcionamento) return false;
    }

    if (filtros?.nivel && filtros.nivel !== 'Todos') {
      if (curso.nivel !== filtros.nivel) return false;
    }

    if (filtros?.turno && filtros.turno !== 'Todos') {
      if (curso.turno !== filtros.turno) return false;
    }

    return true;
  });
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
    funcionamento: 'Em atividade',
  };
  cursosLocalStore = [novoCurso, ...cursosLocalStore];
  return novoCurso;
};
