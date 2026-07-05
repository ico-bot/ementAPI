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
  ProjetoPedagogicoCurso,
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
  editado_manualmente?: boolean;
  inserido_manualmente?: boolean;
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
  editado_manualmente?: boolean;
  inserido_manualmente?: boolean;
}

export interface PPCBackendDto {
  id_ppc: number;
  curriculo: number;
  conteudo?: string;
  arquivo_url?: string;
  created_at?: string;
  updated_at?: string;
}

const PPCS_MOCK: Record<string, ProjetoPedagogicoCurso> = {
  '1': {
    id: '1',
    curriculoId: '1',
    conteudo: 'Projeto Pedagógico do Curso de Bacharelado em Sistemas de Informação - UFAC. Diretrizes curriculares nacionais, formação em engenharia de software, gestão de TI e ciência de dados. Ênfase em inovação tecnológica e práticas extensionistas.',
    arquivoUrl: 'https://www.ufac.br/portal/unidades-academicas/ccet/bsi/ppc_bsi_2023.pdf',
    createdAt: '2023-02-15T10:00:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  '2': {
    id: '2',
    curriculoId: '2',
    conteudo: 'Projeto Pedagógico do Curso de Engenharia de Software - UFAC. Estruturação baseada em métodos ágeis, arquitetura de sistemas escaláveis e qualidade de software profissional.',
    arquivoUrl: 'https://www.ufac.br/portal/unidades-academicas/ccet/esoft/ppc_esoft_2024.pdf',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-03-01T11:00:00Z',
  },
};

/**
 * Busca o Projeto Pedagógico de Curso (PPC) associado a uma matriz curricular (currículo).
 */
export async function fetchPPCByCurriculoId(curriculoId: string): Promise<ProjetoPedagogicoCurso | null> {
  try {
    const response = await apiClient<any>('/ppcs');
    const dtos: PPCBackendDto[] = Array.isArray(response) ? response : (response.results || []);
    const foundDto = dtos.find((p) => String(p.curriculo) === String(curriculoId));
    if (foundDto) {
      return {
        id: String(foundDto.id_ppc),
        curriculoId: String(foundDto.curriculo),
        conteudo: foundDto.conteudo || undefined,
        arquivoUrl: foundDto.arquivo_url || undefined,
        createdAt: foundDto.created_at,
        updatedAt: foundDto.updated_at,
      };
    }
  } catch (error) {
    console.warn(`API de PPC indisponível ao buscar para o currículo ${curriculoId}. Utilizando mock local:`, error);
  }

  await delay(150);
  return PPCS_MOCK[curriculoId] || {
    id: `mock-ppc-${curriculoId}`,
    curriculoId,
    conteudo: 'Projeto Pedagógico do Curso vigente. Documento oficial contendo diretrizes curriculares, perfil do egresso, estrutura curricular e ementário institucional aprovado pelos conselhos superiores da universidade.',
    arquivoUrl: 'https://www.ufac.br/portal/graduacao/ppc_institucional_vigente.pdf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Salva (cria ou atualiza) o Projeto Pedagógico de Curso no Back-End (/api/ppcs/).
 * Previne sobrescrita automática e preserva edições manuais no ementário.
 */
export async function savePPC(
  curriculoId: string,
  data: { ppcId?: string; conteudo?: string; arquivoUrl?: string }
): Promise<ProjetoPedagogicoCurso> {
  const isUpdate = Boolean(data.ppcId && !data.ppcId.startsWith('mock-'));

  try {
    if (isUpdate) {
      const response = await apiClient<PPCBackendDto>(`/ppcs/${data.ppcId}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          conteudo: data.conteudo,
          arquivo_url: data.arquivoUrl,
        }),
      });
      if (response && response.id_ppc) {
        const saved: ProjetoPedagogicoCurso = {
          id: String(response.id_ppc),
          curriculoId: String(response.curriculo),
          conteudo: response.conteudo || undefined,
          arquivoUrl: response.arquivo_url || undefined,
          createdAt: response.created_at,
          updatedAt: response.updated_at || new Date().toISOString(),
        };
        PPCS_MOCK[curriculoId] = saved;
        return saved;
      }
    } else {
      const response = await apiClient<PPCBackendDto>('/ppcs/', {
        method: 'POST',
        body: JSON.stringify({
          curriculo: Number(curriculoId) || 1,
          conteudo: data.conteudo,
          arquivo_url: data.arquivoUrl,
        }),
      });
      if (response && response.id_ppc) {
        const saved: ProjetoPedagogicoCurso = {
          id: String(response.id_ppc),
          curriculoId: String(response.curriculo),
          conteudo: response.conteudo || undefined,
          arquivoUrl: response.arquivo_url || undefined,
          createdAt: response.created_at || new Date().toISOString(),
          updatedAt: response.updated_at || new Date().toISOString(),
        };
        PPCS_MOCK[curriculoId] = saved;
        return saved;
      }
    }
  } catch (error) {
    console.warn('Falha ao salvar PPC na API /api/ppcs/. Atualizando no mock local em memória:', error);
  }

  // Fallback local em memória para garantir continuidade de desenvolvimento e edições manuais
  await delay(400);
  const updatedMock: ProjetoPedagogicoCurso = {
    id: data.ppcId || `mock-ppc-${curriculoId}-${Date.now()}`,
    curriculoId,
    conteudo: data.conteudo,
    arquivoUrl: data.arquivoUrl,
    createdAt: PPCS_MOCK[curriculoId]?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  PPCS_MOCK[curriculoId] = updatedMock;
  return updatedMock;
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
    editadoManualmente: dto.editado_manualmente || false,
    inseridoManualmente: dto.inserido_manualmente || false,
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

    try {
      const ppcData = await fetchPPCByCurriculoId(curr.id);
      curr = { ...curr, ppc: ppcData };
    } catch (err) {
      console.warn('Erro ao buscar PPC da matriz curricular:', err);
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
  let curriculo: Curriculo | null = null;
  try {
    curriculo = await fetchCurriculoByCursoId(cursoId);
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
          editadoManualmente: cd.editado_manualmente || false,
          inseridoManualmente: cd.inserido_manualmente || false,
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

  // Garantir que curriculo foi carregado caso falhe no try
  if (!curriculo) {
    curriculo = await fetchCurriculoByCursoId(cursoId);
  }

  // Enriquecer cada disciplina com os docentes vinculados e o PPC da matriz
  try {
    const vinculos = await fetchVinculosDocenteDisciplina({ cursoId });
    disciplinas = disciplinas.map((disc) => {
      const docentesDestaMateria = vinculos
        .filter((v) => v.disciplinaId === disc.id || (v.codigoDisciplina && v.codigoDisciplina === disc.codigo))
        .map((v) => ({ id: v.docenteId, nome: v.docenteNome }));
      
      return {
        ...disc,
        docentes: docentesDestaMateria.length > 0 ? docentesDestaMateria : disc.docentes,
        ppc: curriculo?.ppc || disc.ppc || null,
      };
    });
  } catch (err) {
    console.warn('Erro ao mapear professores para disciplinas do curso:', err);
    disciplinas = disciplinas.map((disc) => ({
      ...disc,
      ppc: curriculo?.ppc || disc.ppc || null,
    }));
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
      editado_manualmente: true,
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
  const updatedWithFlag = { ...updatedItem, editadoManualmente: true };
  globalCatalogState = globalCatalogState.map((item) => (item.id === updatedItem.id ? updatedWithFlag : item));
  return updatedWithFlag;
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
      inserido_manualmente: true,
    };

    const response = await apiClient<DisciplinaBackendDto>('/disciplinas/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response && response.id_disciplina) {
      const created: Disciplina = {
        ...newDisc,
        id: String(response.id_disciplina),
        inseridoManualmente: true,
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
    inseridoManualmente: true,
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
    inseridoManualmente: true,
    cursoId: curso?.id || cursoId,
    cursoNome: curso?.nome || 'Curso Associado',
  };
  globalCatalogState.push(createdGlobal);

  return created;
}
