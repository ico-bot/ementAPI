/**
 * @file disciplinasService.ts
 * @description Serviço isolado integrando com a API Back-End Django para o domínio de Disciplinas e Matrizes Curriculares.
 */

import { apiClient } from '../../../shared/services/apiClient';
import { fetchCursoById } from '../../cursos/services/cursosService';
import { fetchVinculosDocenteDisciplina } from '../../docentes/services/docentesService';
import { disciplinasGlobalMock } from './disciplinasGlobalMock';
import { CURRICULOS_MOCK, DISCIPLINAS_MOCK } from './disciplinasMock';
import type {
  Curriculo,
  Disciplina,
  DisciplinaGlobalItem,
  FiltrosDisciplina,
  FiltrosDisciplinaGlobal,
  NivelDisciplina,
  PaginatedResponse,
  TurnoDisciplina,
} from './types';

/**
 * Simula atraso de rede no fallback.
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface DisciplinaBackendDto {
  id_disciplina: number;
  codigo_disciplina: string;
  nome_disciplina: string;
  unidade?: number;
  nome_unidade?: string;
  cursos_vinculados?: number[];
  carga_horaria?: number;
  creditos?: number;
  nota_minima_aprovacao?: string | number;
  ementa?: string;
  programa?: string;
  objetivos?: string;
  metodologia?: string;
  avaliacao?: string;
  bibliografia_basica?: string;
  bibliografia_complementar?: string;
}

export interface CurriculoDisciplinaBackendDto {
  id_curriculo_disciplina: number;
  curriculo: number;
  disciplina: number;
  periodo: number;
  tipo_disciplina: string;
  ordem_exibicao?: number;
  codigo_disciplina?: string;
  nome_disciplina?: string;
  carga_horaria?: number;
}

const getInitialCourseForMock = (item: DisciplinaGlobalItem): { cursoId: string; cursoNome: string } => {
  if (item.codigo.startsWith('BSI')) return { cursoId: '1', cursoNome: 'Bacharelado em Sistemas de Informação' };
  if (item.codigo.startsWith('MAT') || item.codigo.startsWith('ESOFT') || item.codigo.startsWith('ENG')) return { cursoId: '2', cursoNome: 'Engenharia de Software' };
  if (item.codigo.startsWith('CCO') || item.codigo.startsWith('INF')) return { cursoId: '3', cursoNome: 'Ciência da Computação' };
  if (item.codigo.startsWith('POS') || item.codigo.startsWith('ARC')) return { cursoId: '4', cursoNome: 'Especialização em Arquitetura de Software e Cloud' };
  if (item.codigo.startsWith('MES') || item.codigo.startsWith('IA')) return { cursoId: '5', cursoNome: 'Mestrado em Inteligência Artificial' };
  if (item.area === 'Ciências Jurídicas e Sociais') return { cursoId: '6', cursoNome: 'ABI - Computação e Informática' };
  return { cursoId: '1', cursoNome: 'Bacharelado em Sistemas de Informação' };
};

// Cópia em memória mutável para simular CRUD no Front-End como fallback
let globalCatalogState: DisciplinaGlobalItem[] = disciplinasGlobalMock.map((item) => ({
  ...item,
  ...getInitialCourseForMock(item),
}));
let courseDisciplinasState: Record<string, Disciplina[]> = { ...DISCIPLINAS_MOCK };

/**
 * Converte DTO de Disciplina do Back-End para item de catálogo global do Front-End.
 */
export function mapDisciplinaDtoToGlobalItem(dto: DisciplinaBackendDto): DisciplinaGlobalItem {
  return {
    id: String(dto.id_disciplina),
    codigo: dto.codigo_disciplina || 'SEM-COD',
    nome: dto.nome_disciplina || 'Disciplina Não Identificada',
    area: 'Ciências Exatas e da Terra',
    nivel: 'Graduação',
    turno: 'Integral',
    status: 'Em atividade',
    cargaHoraria: dto.carga_horaria || 60,
    creditos: dto.creditos || 4,
    notaMinimaAprovacao: Number(dto.nota_minima_aprovacao) || 5.0,
    unidade: dto.nome_unidade || 'CCET',
    ementa: dto.ementa || undefined,
    objetivos: dto.objetivos || undefined,
    programa: dto.programa || undefined,
    metodologia: dto.metodologia || undefined,
    avaliacao: dto.avaliacao || undefined,
    bibliografiaBasica: dto.bibliografia_basica || undefined,
    bibliografiaComplementar: dto.bibliografia_complementar || undefined,
  };
}

/**
 * Busca a matriz curricular (currículo vigente) de um curso pelo seu ID.
 */
export async function fetchCurriculoByCursoId(cursoId: string): Promise<Curriculo | null> {
  let curr: Curriculo | null = null;
  try {
    const response = await apiClient<any>('/curriculos', { params: { curso: cursoId, status: 'Corrente' } });
    const dtos = Array.isArray(response) ? response : (response.results || []);
    if (dtos.length > 0) {
      const c = dtos[0];
      curr = {
        id: String(c.id_curriculo),
        cursoId: String(c.curso),
        cursoNome: c.nome_curso || 'Matriz Curricular',
        versao: c.versao,
        anoInicio: c.ano_inicio,
        semestreInicio: c.semestre_inicio,
        regimeLetivo: c.regime_letivo as any,
        numPeriodosIdeal: c.num_periodos_ideal || 8,
        totalCreditos: c.total_creditos || 200,
        cargaHorariaTotal: c.carga_horaria_total || 3200,
        status: c.status as any,
      };
    }
  } catch (error) {
    console.warn(`API indisponível ao buscar currículo para o curso ${cursoId}. Utilizando mock local:`, error);
  }

  if (!curr) {
    await delay(250);
    curr = CURRICULOS_MOCK.find((c) => c.cursoId === cursoId) || null;
  }

  if (curr) {
    try {
      const vinculos = await fetchVinculosDocenteDisciplina({ cursoId });
      const mapaDocentes = new Map<string, { id: string; nome: string }>();
      vinculos.forEach((v) => {
        if (v.docenteId && v.docenteNome) {
          mapaDocentes.set(v.docenteId, { id: v.docenteId, nome: v.docenteNome });
        }
      });
      if (mapaDocentes.size > 0) {
        curr = { ...curr, corpoDocente: Array.from(mapaDocentes.values()) };
      }
    } catch (err) {
      console.warn('Erro ao carregar corpo docente da matriz curricular:', err);
    }
  }

  return curr;
}

/**
 * Busca a lista de disciplinas de um curso, aplicando filtros de busca por termo, período ideal ou tipo.
 */
export async function fetchDisciplinasByCursoId(
  cursoId: string,
  filtros?: FiltrosDisciplina
): Promise<Disciplina[]> {
  let disciplinas: Disciplina[] = [];
  try {
    const curriculo = await fetchCurriculoByCursoId(cursoId);
    if (curriculo) {
      const response = await apiClient<any>('/curriculo-disciplinas', { params: { curriculo: curriculo.id } });
      const dtos: CurriculoDisciplinaBackendDto[] = Array.isArray(response) ? response : (response.results || []);
      
      if (dtos.length > 0) {
        disciplinas = dtos.map((cd) => ({
          id: String(cd.disciplina),
          codigo: cd.codigo_disciplina || `COD-${cd.disciplina}`,
          nome: cd.nome_disciplina || `Disciplina ${cd.disciplina}`,
          cargaHoraria: cd.carga_horaria || 60,
          creditos: Math.round((cd.carga_horaria || 60) / 15),
          periodoIdeal: cd.periodo,
          tipo: (cd.tipo_disciplina as any) || 'Obrigatória',
          notaMinimaAprovacao: 5.0,
        }));
      }
    }
  } catch (error) {
    console.warn(`API indisponível para disciplinas do curso ${cursoId}. Utilizando fallback local:`, error);
  }

  if (disciplinas.length === 0) {
    await delay(250);
    disciplinas = courseDisciplinasState[cursoId] || [];
  }

  // Enriquecer cada disciplina com os docentes vinculados ao lecionamento (/api/docente-disciplinas)
  try {
    const vinculos = await fetchVinculosDocenteDisciplina({ cursoId });
    disciplinas = disciplinas.map((disc) => {
      const docentesDestaMateria = vinculos
        .filter((v) => v.disciplinaId === disc.id || (v.codigoDisciplina && v.codigoDisciplina === disc.codigo))
        .map((v) => ({ id: v.docenteId, nome: v.docenteNome }));
      
      if (docentesDestaMateria.length > 0) {
        return { ...disc, docentes: docentesDestaMateria };
      }
      return disc;
    });
  } catch (err) {
    console.warn('Erro ao mapear professores para disciplinas do curso:', err);
  }

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
  try {
    const params: Record<string, string | number | undefined> = {
      page,
      page_size: itemsPerPage,
    };
    if (filtros?.termo && filtros.termo.trim() !== '') params.search = filtros.termo;
    if (filtros?.cursoId && filtros.cursoId !== 'Todos') params.cursos_vinculados = filtros.cursoId;

    const response = await apiClient<any>('/disciplinas', { params });
    if (response) {
      const dtos: DisciplinaBackendDto[] = Array.isArray(response) ? response : (response.results || []);
      const totalItems = Array.isArray(response) ? response.length : (response.count || dtos.length);
      const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
      const mapped = dtos.map(mapDisciplinaDtoToGlobalItem);

      return {
        items: mapped,
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage,
      };
    }
  } catch (error) {
    console.warn('API de Disciplinas indisponível. Utilizando catálogo em memória local:', error);
  }

  await delay(250);

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

    if (filtros.cursoId && filtros.cursoId !== 'Todos') {
      filtered = filtered.filter((item) => item.cursoId === filtros.cursoId);
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
 * Exclui uma disciplina global pelo ID via API ou localmente no fallback.
 */
export async function deleteDisciplinaGlobal(id: string): Promise<boolean> {
  try {
    await apiClient(`/disciplinas/${id}/`, { method: 'DELETE' });
  } catch (error) {
    console.warn(`Erro na remoção via API (${id}). Apagando localmente no fallback:`, error);
  }

  await delay(200);
  globalCatalogState = globalCatalogState.filter((item) => item.id !== id);
  return true;
}

/**
 * Atualiza os dados básicos de uma disciplina global via API ou localmente.
 */
export async function updateDisciplinaGlobal(updatedItem: DisciplinaGlobalItem): Promise<DisciplinaGlobalItem> {
  try {
    const payload = {
      codigo_disciplina: updatedItem.codigo,
      nome_disciplina: updatedItem.nome,
      carga_horaria: updatedItem.cargaHoraria,
      creditos: updatedItem.creditos,
      nota_minima_aprovacao: updatedItem.notaMinimaAprovacao,
      ementa: updatedItem.ementa,
      objetivos: updatedItem.objetivos,
      programa: updatedItem.programa,
      metodologia: updatedItem.metodologia,
      avaliacao: updatedItem.avaliacao,
      bibliografia_basica: updatedItem.bibliografiaBasica,
      bibliografia_complementar: updatedItem.bibliografiaComplementar,
    };
    const response = await apiClient<DisciplinaBackendDto>(`/disciplinas/${updatedItem.id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    if (response && response.id_disciplina) {
      const mapped = mapDisciplinaDtoToGlobalItem(response);
      globalCatalogState = globalCatalogState.map((item) => (item.id === mapped.id ? mapped : item));
      return mapped;
    }
  } catch (error) {
    console.warn(`Erro ao atualizar disciplina via API (${updatedItem.id}). Atualizando localmente:`, error);
  }

  await delay(200);
  globalCatalogState = globalCatalogState.map((item) => (item.id === updatedItem.id ? updatedItem : item));
  return updatedItem;
}

/**
 * Cadastra uma nova disciplina na matriz curricular do curso específico.
 */
export async function createDisciplina(
  cursoId: string,
  newDisc: Omit<Disciplina, 'id'>
): Promise<Disciplina> {
  try {
    const payload = {
      codigo_disciplina: newDisc.codigo,
      nome_disciplina: newDisc.nome,
      carga_horaria: newDisc.cargaHoraria,
      creditos: newDisc.creditos,
      nota_minima_aprovacao: newDisc.notaMinimaAprovacao || 5.0,
      ementa: newDisc.ementa,
      objetivos: newDisc.objetivos,
      programa: newDisc.programa,
      metodologia: newDisc.metodologia,
      avaliacao: newDisc.avaliacao,
      bibliografia_basica: newDisc.bibliografiaBasica,
      bibliografia_complementar: newDisc.bibliografiaComplementar,
      cursos_vinculados: [Number(cursoId)],
    };

    const response = await apiClient<DisciplinaBackendDto>('/disciplinas/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response && response.id_disciplina) {
      const created: Disciplina = {
        ...newDisc,
        id: String(response.id_disciplina),
      };
      if (!courseDisciplinasState[cursoId]) {
        courseDisciplinasState[cursoId] = [];
      }
      courseDisciplinasState[cursoId].push(created);
      return created;
    }
  } catch (error) {
    console.warn(`Erro no cadastro via API para o curso ${cursoId}. Cadastrando no fallback local:`, error);
  }

  await delay(250);
  const id = `disc-${Date.now()}`;
  const created: Disciplina = {
    ...newDisc,
    id,
  };

  if (!courseDisciplinasState[cursoId]) {
    courseDisciplinasState[cursoId] = [];
  }
  courseDisciplinasState[cursoId].push(created);

  const curso = await fetchCursoById(cursoId);

  const createdGlobal: DisciplinaGlobalItem = {
    id,
    codigo: created.codigo,
    nome: created.nome,
    area: curso?.areaConhecimento || 'Ciências Exactas e Tecnológicas',
    nivel: (curso?.nivel as NivelDisciplina) || 'Graduação',
    turno: (curso?.turno as TurnoDisciplina) || 'Integral',
    status: 'Em atividade',
    cargaHoraria: created.cargaHoraria || 60,
    creditos: created.creditos,
    notaMinimaAprovacao: created.notaMinimaAprovacao,
    unidade: created.unidade || 'CCET',
    ementa: created.ementa,
    bibliografiaBasica: created.bibliografiaBasica,
    preRequisitos: created.preRequisitos,
    cursoId: curso?.id || cursoId,
    cursoNome: curso?.nome || 'Curso Associado',
  };
  globalCatalogState.push(createdGlobal);

  return created;
}
