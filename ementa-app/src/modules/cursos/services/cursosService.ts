/**
 * @file cursosService.ts
 * @description Serviço responsável pelas operações assíncronas de busca e manipulação de Cursos, integrando com a API Back-End Django.
 */

import { apiClient } from '../../../shared/services/apiClient';
import type { Curso, FiltrosCurso, ModalidadeCurso, NivelCurso, PaginatedResponse, StatusFuncionamento, TurnoCurso } from './types';

export interface CursoBackendDto {
  id_curso: number;
  codigo_curso: string;
  nome_curso: string;
  nivel_curso: string;
  turno_curso?: string;
  modalidade_curso?: string;
  area_conhecimento_curso?: string;
  funcionamento_curso: string;
  grau_academico?: string;
  ato_autorizacao_curso?: string;
  ato_reconhecimento_curso?: string;
  conceito_mec_curso?: string;
  coordenador?: number;
  nome_coordenador?: string;
  // Campos finais consolidados pela view do Django (Curso.objects.consolidados())
  nome_curso_final?: string;
  nivel_curso_final?: string;
  turno_curso_final?: string;
  modalidade_curso_final?: string;
  area_conhecimento_curso_final?: string;
  funcionamento_curso_final?: string;
  grau_academico_final?: string;
  conceito_mec_curso_final?: string;
  editado_manualmente?: boolean;
  inserido_manualmente?: boolean;
}

/**
 * Converte o DTO do Back-End (snake_case) para o modelo tipado estritamente no Front-End (camelCase).
 */
export function mapCursoDtoToFrontend(dto: CursoBackendDto): Curso {
  const nome = dto.nome_curso_final || dto.nome_curso || 'Curso Não Identificado';
  const codigo = dto.codigo_curso || 'SEM-CODIGO';
  const funcionamento = (dto.funcionamento_curso_final || dto.funcionamento_curso || 'Em atividade') as StatusFuncionamento;
  const nivel = (dto.nivel_curso_final || dto.nivel_curso || 'Graduação') as NivelCurso;
  const turno = (dto.turno_curso_final || dto.turno_curso) as TurnoCurso | undefined;
  const modalidade = (dto.modalidade_curso_final || dto.modalidade_curso) as ModalidadeCurso | undefined;

  return {
    id: String(dto.id_curso),
    nome,
    codigo,
    cargaHoraria: 3200, // Carga horária ideal como fallback até expansão no CursoSerializer via Curriculo
    periodos: 8,
    funcionamento,
    nivel,
    turno,
    modalidade,
    areaConhecimento: dto.area_conhecimento_curso_final || dto.area_conhecimento_curso || 'Ciências Exatas e da Terra',
    grauAcademico: dto.grau_academico_final || dto.grau_academico || undefined,
    conceitoMec: dto.conceito_mec_curso_final || dto.conceito_mec_curso || undefined,
    coordenador: dto.nome_coordenador ? { id: String(dto.coordenador || ''), nome: dto.nome_coordenador } : undefined,
    editadoManualmente: dto.editado_manualmente || false,
    inseridoManualmente: dto.inserido_manualmente || false,
  };
}

export const fetchCursos = async (filtros?: FiltrosCurso): Promise<Curso[]> => {
  try {
    const params: Record<string, string | number | undefined> = {
      page_size: 1000,
    };
    if (filtros?.termo) params.search = filtros.termo;
    if (filtros?.funcionamento && filtros.funcionamento !== 'Todos') params.funcionamento_curso = filtros.funcionamento;
    if (filtros?.nivel && filtros.nivel !== 'Todos') params.nivel_curso = filtros.nivel;
    if (filtros?.turno && filtros.turno !== 'Todos') params.turno_curso = filtros.turno;

    const response = await apiClient<CursoBackendDto[] | { results: CursoBackendDto[] }>('/cursos/', { params });
    const dtos = Array.isArray(response) ? response : (response.results || []);
    return dtos.map(mapCursoDtoToFrontend);
  } catch (error) {
    console.error('Erro ao buscar cursos na API:', error);
    throw error;
  }
};

export const fetchCursosPaginated = async (
  page: number,
  itemsPerPage: number,
  filtros?: FiltrosCurso
): Promise<PaginatedResponse<Curso>> => {
  try {
    const params: Record<string, string | number | undefined> = {
      page,
      page_size: itemsPerPage,
    };
    if (filtros?.termo && filtros.termo.trim() !== '') params.search = filtros.termo;
    if (filtros?.funcionamento && filtros.funcionamento !== 'Todos') params.funcionamento_curso = filtros.funcionamento;
    if (filtros?.nivel && filtros.nivel !== 'Todos') params.nivel_curso = filtros.nivel;
    if (filtros?.turno && filtros.turno !== 'Todos') params.turno_curso = filtros.turno;

    const response = await apiClient<any>('/cursos/', { params });
    const dtos: CursoBackendDto[] = Array.isArray(response) ? response : (response.results || []);
    const totalItems = Array.isArray(response) ? response.length : (response.count || dtos.length);
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const mapped = dtos.map(mapCursoDtoToFrontend);

    return {
      items: mapped,
      totalItems,
      totalCount: totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage,
    };
  } catch (error) {
    console.error('Erro ao buscar cursos paginados na API:', error);
    throw error;
  }
};

export const fetchCursoById = async (id: string): Promise<Curso | undefined> => {
  try {
    const response = await apiClient<CursoBackendDto>(`/cursos/${id}/`);
    if (response && response.id_curso) {
      return mapCursoDtoToFrontend(response);
    }
    return undefined;
  } catch (error) {
    console.error(`Erro ao buscar curso ${id} na API:`, error);
    throw error;
  }
};

/**
 * Mapeia modelo do Front-End para payload do Back-End com sinalizador de edição manual.
 */
function mapCursoFrontendToPayload(curso: Partial<Curso>, isNew = false): Record<string, any> {
  return {
    codigo_curso: curso.codigo || 'SEM-CODIGO',
    nome_curso: curso.nome || 'Novo Curso',
    nivel_curso: curso.nivel || 'Graduação',
    turno_curso: curso.turno || 'Integral',
    modalidade_curso: curso.modalidade || 'Presencial',
    area_conhecimento_curso: curso.areaConhecimento || 'Ciências Exatas e da Terra',
    funcionamento_curso: curso.funcionamento || 'Em atividade',
    grau_academico: curso.grauAcademico || 'Bacharelado',
    editado_manualmente: true,
    inserido_manualmente: isNew,
  };
}

export const createCurso = async (curso: Omit<Curso, 'id'>): Promise<Curso> => {
  try {
    const payload = mapCursoFrontendToPayload(curso, true);
    const response = await apiClient<CursoBackendDto>('/cursos/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapCursoDtoToFrontend(response);
  } catch (error) {
    console.error('Erro ao criar curso na API:', error);
    throw error;
  }
};

export const updateCurso = async (curso: Curso): Promise<Curso> => {
  try {
    const payload = mapCursoFrontendToPayload(curso, false);
    const response = await apiClient<CursoBackendDto>(`/cursos/${curso.id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapCursoDtoToFrontend(response);
  } catch (error) {
    console.error(`Erro ao atualizar curso ${curso.id} na API:`, error);
    throw error;
  }
};

export const deleteCurso = async (id: string): Promise<boolean> => {
  try {
    await apiClient(`/cursos/${id}/`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error(`Erro ao excluir curso ${id} na API:`, error);
    throw error;
  }
};
