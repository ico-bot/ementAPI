import { apiClient } from '../../../shared/services/apiClient';
import { disciplinasGlobalMock } from './disciplinasGlobalMock';
import type { 
  Curriculo, 
  Disciplina, 
  FiltrosDisciplina, 
  RegimeLetivo, 
  StatusCurriculo,
  DisciplinaGlobalItem, 
  FiltrosDisciplinaGlobal, 
  PaginatedResponse 
} from './types';

// ==========================================
// 1. Busca a Matriz Curricular do Curso Real
// ==========================================
export async function fetchCurriculoByCursoId(cursoId: string): Promise<Curriculo | null> {
  try {
    const response = await apiClient.get('/curriculos/', { params: { curso: cursoId } });
    const listaCurriculos = response.data.results || response.data;

    if (listaCurriculos.length === 0) return null;

    const curr = listaCurriculos[0];

    return {
      id: String(curr.id_curriculo),
      cursoId: cursoId,
      cursoNome: curr.nome_curso || 'Curso Selecionado',
      versao: curr.versao,
      anoInicio: curr.ano_inicio,
      semestreInicio: curr.semestre_inicio,
      regimeLetivo: curr.regime_letivo as RegimeLetivo,
      numPeriodosIdeal: curr.num_periodos_ideal || 8,
      totalCreditos: curr.total_creditos || 0,
      cargaHorariaTotal: curr.carga_horaria_total,
      status: curr.status as StatusCurriculo,
    };
  } catch (error) {
    console.error(`Erro ao buscar currículo do curso ${cursoId}:`, error);
    return null;
  }
}

// ==========================================
// 2. Busca as Disciplinas daquele Currículo
// ==========================================
export async function fetchDisciplinasByCursoId(
  cursoId: string,
  filtros?: FiltrosDisciplina
): Promise<Disciplina[]> {
  try {
    const curriculo = await fetchCurriculoByCursoId(cursoId);
    if (!curriculo) return [];

    const params: any = { curriculo: curriculo.id };

    if (filtros?.periodo && filtros.periodo !== 'Todos') {
      params.periodo = filtros.periodo;
    }
    if (filtros?.tipo && filtros.tipo !== 'Todos') {
      params.tipo_disciplina = filtros.tipo;
    }

    const response = await apiClient.get('/curriculo-disciplinas/', { params });
    const materias = response.data.results || response.data;

    return materias.map((item: any): Disciplina => ({
      id: String(item.disciplina),
      codigo: item.codigo_disciplina,
      nome: item.nome_disciplina,
      tipo: item.tipo_disciplina,
      cargaHoraria: item.carga_horaria,
      creditos: Math.round(item.carga_horaria / 15),
      periodoIdeal: item.periodo || 0,
      notaMinimaAprovacao: 5.0,
    }));

  } catch (error) {
    console.error(`Erro ao buscar disciplinas do curso ${cursoId}:`, error);
    return [];
  }
}

// ==========================================
// FUNÇÕES RESTAURADAS (Evitam a Tela Branca!)
// ==========================================
let globalCatalogState: DisciplinaGlobalItem[] = [...disciplinasGlobalMock];
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchDisciplinasGlobal(
  page: number,
  itemsPerPage: number,
  filtros?: FiltrosDisciplinaGlobal
): Promise<PaginatedResponse<DisciplinaGlobalItem>> {
  await delay(300);
  let filtered = [...globalCatalogState];
  
  // Lógica resumida para não quebrar a tela global
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const validPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (validPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);
  
  return { items: paginatedItems, totalItems, totalPages, currentPage: validPage, itemsPerPage };
}

export async function deleteDisciplinaGlobal(id: string): Promise<boolean> {
  globalCatalogState = globalCatalogState.filter((item) => item.id !== id);
  return true;
}

export async function updateDisciplinaGlobal(updatedItem: DisciplinaGlobalItem): Promise<DisciplinaGlobalItem> {
  globalCatalogState = globalCatalogState.map((item) => (item.id === updatedItem.id ? updatedItem : item));
  return updatedItem;
}

export async function createDisciplina(cursoId: string, newDisc: Omit<Disciplina, 'id'>): Promise<Disciplina> {
  return { ...newDisc, id: `disc-${Date.now()}` };
}