/**
 * @file docentesService.ts
 * @description Serviço isolado para comunicação assíncrona com os endpoints /api/docentes/ e /api/docente-disciplinas/.
 */

import { apiClient } from '../../../shared/services/apiClient';
import { fetchCursos } from '../../cursos/services/cursosService';
import type { CargoDocente, Docente, DocenteDisciplinaVinculo, FiltrosDocente, TitulacaoDocente } from './types';

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
  ano?: number | null;
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
    ano: dto.ano !== null && dto.ano !== undefined ? dto.ano : undefined,
    semestre: dto.semestre || 1,
    editadoManualmente: dto.editado_manualmente || false,
    inseridoManualmente: dto.inserido_manualmente || false,
  };
}

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

    const response = await apiClient<any>('/docentes/', { params });
    const dtos: DocenteBackendDto[] = Array.isArray(response) ? response : (response.results || []);
    return dtos.map(mapDocenteDtoToFrontend);
  } catch (error) {
    console.error('Erro ao buscar docentes na API:', error);
    throw error;
  }
}

/**
 * Busca os detalhes de um docente pelo ID.
 */
export async function fetchDocenteById(id: string): Promise<Docente | null> {
  try {
    const response = await apiClient<DocenteBackendDto>(`/docentes/${id}/`);
    if (response && response.id_docente) {
      return mapDocenteDtoToFrontend(response);
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar docente ${id} na API:`, error);
    throw error;
  }
}

/**
 * Busca todos os vínculos de disciplinas lecionadas por um docente específico.
 */
export async function fetchDisciplinasByDocenteId(docenteId: string): Promise<DocenteDisciplinaVinculo[]> {
  try {
    const response = await apiClient<any>('/docente-disciplinas/', { params: { docente: docenteId } });
    const dtos: DocenteDisciplinaBackendDto[] = Array.isArray(response) ? response : (response.results || []);
    const mapped = dtos.map(mapVinculoDtoToFrontend);
    return await enrichVinculosWithCourses(mapped);
  } catch (error) {
    console.error(`Erro ao buscar disciplinas para o docente ${docenteId} na API:`, error);
    throw error;
  }
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

    const response = await apiClient<any>('/docente-disciplinas/', { params: apiParams });
    const dtos: DocenteDisciplinaBackendDto[] = Array.isArray(response) ? response : (response.results || []);
    const mapped = dtos.map(mapVinculoDtoToFrontend);
    return await enrichVinculosWithCourses(mapped);
  } catch (error) {
    console.error('Erro ao buscar vínculos docente-disciplina na API:', error);
    throw error;
  }
}
