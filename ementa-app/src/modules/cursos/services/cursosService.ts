/**
 * @file cursosService.ts
 * @description Serviço responsável pelas operações assíncronas de busca e manipulação de Cursos, integrando com a API Back-End Django.
 */

import { apiClient } from '../../../shared/services/apiClient';
import { simulateNetworkDelay } from '../../../shared/services/mockClient';
import { CURSOS_MOCK } from './cursosMock';
import type { Curso, FiltrosCurso, ModalidadeCurso, NivelCurso, StatusFuncionamento, TurnoCurso } from './types';

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
  };
}

let cursosLocalStore = [...CURSOS_MOCK];

export const fetchCursos = async (filtros?: FiltrosCurso): Promise<Curso[]> => {
  try {
    const params: Record<string, string | undefined> = {};
    if (filtros?.termo) params.search = filtros.termo;
    if (filtros?.funcionamento && filtros.funcionamento !== 'Todos') params.funcionamento_curso = filtros.funcionamento;
    if (filtros?.nivel && filtros.nivel !== 'Todos') params.nivel_curso = filtros.nivel;
    if (filtros?.turno && filtros.turno !== 'Todos') params.turno_curso = filtros.turno;

    const response = await apiClient<CursoBackendDto[] | { results: CursoBackendDto[] }>('/cursos', { params });
    const dtos = Array.isArray(response) ? response : (response.results || []);
    const mapped = dtos.map(mapCursoDtoToFrontend);
    
    // Se a API retornou cursos, atualizamos nosso cache local
    if (mapped.length > 0) {
      cursosLocalStore = mapped;
    }
    return mapped;
  } catch (error) {
    console.warn('API de Cursos indisponível. Utilizando fallback em memória local:', error);
    await simulateNetworkDelay(200);

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
  }
};

export const fetchCursoById = async (id: string): Promise<Curso | undefined> => {
  try {
    const response = await apiClient<CursoBackendDto>(`/cursos/${id}`);
    if (response && response.id_curso) {
      return mapCursoDtoToFrontend(response);
    }
  } catch (error) {
    console.warn(`API indisponível ao buscar curso ${id}. Utilizando fallback em memória local:`, error);
  }

  await simulateNetworkDelay(150);
  return cursosLocalStore.find((curso) => curso.id === id);
};
