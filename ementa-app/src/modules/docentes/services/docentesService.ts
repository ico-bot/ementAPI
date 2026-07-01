/**
 * @file docentesService.ts
 * @description Serviço isolado para comunicação assíncrona com os endpoints /api/docentes/ e /api/docente-disciplinas/.
 */

import { apiClient } from '../../../shared/services/apiClient';
import { fetchCursos } from '../../cursos/services/cursosService';
import { DOCENTE_DISCIPLINAS_MOCK, DOCENTES_MOCK } from './docentesMock';
import type { CargoDocente, Docente, DocenteDisciplinaVinculo, FiltrosDocente, TitulacaoDocente } from './types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface DocenteBackendDto {
  id_docente: number;
  nome_docente: string;
  titulacao_docente?: string;
  centro_lotacao?: string;
  unidade_vinculo?: number;
  nome_unidade?: string;
  cursos_vinculados?: number[];
  cargo_docente?: string;
  jornada_docente?: string;
  tempo_casa_docente?: number;
  email?: string;
  editado_manualmente?: boolean;
  inserido_manualmente?: boolean;
}

export interface DocenteDisciplinaBackendDto {
  id_docente_disciplina: number;
  docente: number;
  nome_docente?: string;
  disciplina: number;
  nome_disciplina?: string;
  codigo_disciplina?: string;
  carga_horaria?: number;
  curso: number;
  nome_curso?: string;
  ano: number;
  semestre: number;
  editado_manualmente?: boolean;
  inserido_manualmente?: boolean;
}

/**
 * Mapeia DTO do Back-End para o modelo do Front-End de Docente.
 */
export function mapDocenteDtoToFrontend(dto: DocenteBackendDto): Docente {
  return {
    id: String(dto.id_docente),
    nome: dto.nome_docente || 'Professor Não Identificado',
    titulacao: (dto.titulacao_docente as TitulacaoDocente) || undefined,
    centroLotacao: dto.centro_lotacao || undefined,
    unidadeVinculoId: dto.unidade_vinculo ? String(dto.unidade_vinculo) : undefined,
    unidadeVinculoNome: dto.nome_unidade || undefined,
    cursosVinculados: dto.cursos_vinculados ? dto.cursos_vinculados.map(String) : [],
    cargo: (dto.cargo_docente as CargoDocente) || undefined,
    jornada: dto.jornada_docente || undefined,
    tempoCasa: dto.tempo_casa_docente || undefined,
    email: dto.email || undefined,
    editadoManualmente: dto.editado_manualmente || false,
    inseridoManualmente: dto.inserido_manualmente || false,
  };
}

/**
 * Mapeia DTO de vínculo docente-disciplina para o modelo do Front-End.
 */
export function mapVinculoDtoToFrontend(dto: DocenteDisciplinaBackendDto): DocenteDisciplinaVinculo {
  return {
    id: String(dto.id_docente_disciplina),
    docenteId: String(dto.docente),
    docenteNome: dto.nome_docente || `Docente #${dto.docente}`,
    disciplinaId: String(dto.disciplina),
    disciplinaNome: dto.nome_disciplina || `Disciplina #${dto.disciplina}`,
    codigoDisciplina: dto.codigo_disciplina || undefined,
    cargaHoraria: dto.carga_horaria || 60,
    cursoId: String(dto.curso),
    cursoNome: dto.nome_curso || `Curso #${dto.curso}`,
    ano: dto.ano || 2026,
    semestre: dto.semestre || 1,
    editadoManualmente: dto.editado_manualmente || false,
    inseridoManualmente: dto.inserido_manualmente || false,
  };
}

let docentesLocalStore = [...DOCENTES_MOCK];
let vinculosLocalStore = [...DOCENTE_DISCIPLINAS_MOCK];

/**
 * Enriquecedor que cruza vínculos de docentes com o catálogo de cursos para garantir nomes legíveis e carga horária.
 */
async function enrichVinculosWithCourses(vinculos: DocenteDisciplinaVinculo[]): Promise<DocenteDisciplinaVinculo[]> {
  try {
    const cursos = await fetchCursos();
    const cursoMap = new Map(cursos.map((c) => [c.id, c.nome]));

    return vinculos.map((v) => {
      const realCursoNome = cursoMap.get(v.cursoId);
      return {
        ...v,
        cursoNome: realCursoNome || (v.cursoNome?.startsWith('Curso #') ? `Curso (ID ${v.cursoId})` : v.cursoNome),
        cargaHoraria: v.cargaHoraria || 60,
      };
    });
  } catch (err) {
    return vinculos.map((v) => ({ ...v, cargaHoraria: v.cargaHoraria || 60 }));
  }
}

/**
 * Busca a listagem de docentes com suporte a filtros de busca por nome, titulação e cargo.
 */
export async function fetchDocentes(filtros?: FiltrosDocente): Promise<Docente[]> {
  try {
    const params: Record<string, string | undefined> = {};
    if (filtros?.termo && filtros.termo.trim() !== '') params.search = filtros.termo;
    if (filtros?.titulacao && filtros.titulacao !== 'Todos') params.titulacao_docente = filtros.titulacao;
    if (filtros?.cargo && filtros.cargo !== 'Todos') params.cargo_docente = filtros.cargo;

    const response = await apiClient<any>('/docentes', { params });
    if (response) {
      const dtos: DocenteBackendDto[] = Array.isArray(response) ? response : (response.results || []);
      if (dtos.length > 0) {
        const mapped = dtos.map(mapDocenteDtoToFrontend);
        return mapped;
      }
    }
  } catch (error) {
    console.warn('API /docentes indisponível. Utilizando fallback local:', error);
  }

  await delay(250);
  let lista = [...docentesLocalStore];

  if (filtros) {
    if (filtros.termo && filtros.termo.trim() !== '') {
      const q = filtros.termo.toLowerCase();
      lista = lista.filter((d) => d.nome.toLowerCase().includes(q) || (d.centroLotacao && d.centroLotacao.toLowerCase().includes(q)));
    }
    if (filtros.titulacao && filtros.titulacao !== 'Todos') {
      lista = lista.filter((d) => d.titulacao === filtros.titulacao);
    }
    if (filtros.cargo && filtros.cargo !== 'Todos') {
      lista = lista.filter((d) => d.cargo === filtros.cargo);
    }
  }

  return lista;
}

/**
 * Busca os detalhes de um docente pelo ID.
 */
export async function fetchDocenteById(id: string): Promise<Docente | null> {
  try {
    const response = await apiClient<DocenteBackendDto>(`/docentes/${id}`);
    if (response) {
      return mapDocenteDtoToFrontend(response);
    }
  } catch (error) {
    console.warn(`API /docentes/${id} indisponível. Utilizando fallback local:`, error);
  }

  await delay(200);
  return docentesLocalStore.find((d) => d.id === id) || null;
}

/**
 * Busca todos os vínculos de disciplinas lecionadas por um docente específico.
 */
export async function fetchDisciplinasByDocenteId(docenteId: string): Promise<DocenteDisciplinaVinculo[]> {
  try {
    const response = await apiClient<any>('/docente-disciplinas', { params: { docente: docenteId } });
    if (response) {
      const dtos: DocenteDisciplinaBackendDto[] = Array.isArray(response) ? response : (response.results || []);
      const mapped = dtos.map(mapVinculoDtoToFrontend);
      return await enrichVinculosWithCourses(mapped);
    }
  } catch (error) {
    console.warn(`API /docente-disciplinas para docente ${docenteId} indisponível. Utilizando fallback local:`, error);
  }

  await delay(200);
  const localFiltered = vinculosLocalStore.filter((v) => v.docenteId === docenteId);
  return await enrichVinculosWithCourses(localFiltered);
}

/**
 * Busca todos os vínculos de docentes para um curso específico ou para uma disciplina específica.
 */
export async function fetchVinculosDocenteDisciplina(params?: { cursoId?: string; disciplinaId?: string; docenteId?: string }): Promise<DocenteDisciplinaVinculo[]> {
  try {
    const apiParams: Record<string, string> = {};
    if (params?.cursoId) apiParams.curso = params.cursoId;
    if (params?.disciplinaId) apiParams.disciplina = params.disciplinaId;
    if (params?.docenteId) apiParams.docente = params.docenteId;

    const response = await apiClient<any>('/docente-disciplinas', { params: apiParams });
    if (response) {
      const dtos: DocenteDisciplinaBackendDto[] = Array.isArray(response) ? response : (response.results || []);
      const mapped = dtos.map(mapVinculoDtoToFrontend);
      return await enrichVinculosWithCourses(mapped);
    }
  } catch (error) {
    console.warn('API /docente-disciplinas indisponível. Utilizando fallback local:', error);
  }

  await delay(150);
  let lista = [...vinculosLocalStore];
  if (params?.cursoId) {
    lista = lista.filter((v) => v.cursoId === params.cursoId);
  }
  if (params?.disciplinaId) {
    lista = lista.filter((v) => v.disciplinaId === params.disciplinaId);
  }
  if (params?.docenteId) {
    lista = lista.filter((v) => v.docenteId === params.docenteId);
  }
  return await enrichVinculosWithCourses(lista);
}
