/**
 * @file disciplinasService.ts
 * @description Serviço isolado simulando requisições assíncronas para o domínio de Disciplinas e Matrizes Curriculares.
 */

import { disciplinasGlobalMock } from './disciplinasGlobalMock';
import { CURRICULOS_MOCK, DISCIPLINAS_MOCK } from './disciplinasMock';
import type {
  Curriculo,
  Disciplina,
  DisciplinaGlobalItem,
  FiltrosDisciplina,
  FiltrosDisciplinaGlobal,
  PaginatedResponse,
} from './types';

/**
 * Simula atraso de rede (latência artificial).
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Cópia em memória mutável para simular CRUD no Front-End
let globalCatalogState: DisciplinaGlobalItem[] = [...disciplinasGlobalMock];

/**
 * Busca a matriz curricular (currículo vigente) de um curso pelo seu ID.
 */
export async function fetchCurriculoByCursoId(cursoId: string): Promise<Curriculo | null> {
  await delay(250);
  const curriculo = CURRICULOS_MOCK.find((curr) => curr.cursoId === cursoId);
  return curriculo || null;
}

/**
 * Busca a lista de disciplinas de um curso, aplicando filtros de busca por termo, período ideal ou tipo.
 */
export async function fetchDisciplinasByCursoId(
  cursoId: string,
  filtros?: FiltrosDisciplina
): Promise<Disciplina[]> {
  await delay(350);
  let disciplinas = DISCIPLINAS_MOCK[cursoId] || [];

  if (!filtros) {
    return disciplinas;
  }

  if (filtros.termo && filtros.termo.trim() !== '') {
    const termoLower = filtros.termo.toLowerCase();
    disciplinas = disciplinas.filter(
      (disc) =>
        disc.nome.toLowerCase().includes(termoLower) ||
        disc.codigo.toLowerCase().includes(termoLower) ||
        (disc.ementa && disc.ementa.toLowerCase().includes(termoLower))
    );
  }

  if (filtros.periodo && filtros.periodo !== 'Todos') {
    disciplinas = disciplinas.filter((disc) => disc.periodoIdeal === Number(filtros.periodo));
  }

  if (filtros.tipo && filtros.tipo !== 'Todos') {
    disciplinas = disciplinas.filter((disc) => disc.tipo === filtros.tipo);
  }

  return disciplinas;
}

/**
 * Busca todas as disciplinas do sistema de forma paginada e filtrada.
 */
export async function fetchDisciplinasGlobal(
  page: number,
  itemsPerPage: number,
  filtros?: FiltrosDisciplinaGlobal
): Promise<PaginatedResponse<DisciplinaGlobalItem>> {
  await delay(300);

  let filtered = [...globalCatalogState];

  if (filtros) {
    if (filtros.termo && filtros.termo.trim() !== '') {
      const query = filtros.termo.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.nome.toLowerCase().includes(query) ||
          item.codigo.toLowerCase().includes(query) ||
          item.area.toLowerCase().includes(query)
      );
    }

    if (filtros.area && filtros.area !== 'Todos') {
      filtered = filtered.filter((item) => item.area === filtros.area);
    }

    if (filtros.nivel && filtros.nivel !== 'Todos') {
      filtered = filtered.filter((item) => item.nivel === filtros.nivel);
    }

    if (filtros.status && filtros.status !== 'Todos') {
      filtered = filtered.filter((item) => item.status === filtros.status);
    }
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const validPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (validPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return {
    items: paginatedItems,
    totalItems,
    totalPages,
    currentPage: validPage,
    itemsPerPage,
  };
}

/**
 * Exclui simuladamente uma disciplina global pelo ID.
 */
export async function deleteDisciplinaGlobal(id: string): Promise<boolean> {
  await delay(250);
  globalCatalogState = globalCatalogState.filter((item) => item.id !== id);
  return true;
}

/**
 * Atualiza simuladamente os dados básicos de uma disciplina global.
 */
export async function updateDisciplinaGlobal(updatedItem: DisciplinaGlobalItem): Promise<DisciplinaGlobalItem> {
  await delay(250);
  globalCatalogState = globalCatalogState.map((item) => (item.id === updatedItem.id ? updatedItem : item));
  return updatedItem;
}

