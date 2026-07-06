/**
 * @file disciplinasService.ts
 * @description Serviço isolado integrando com a API Back-End Django para o domínio de Disciplinas e Matrizes Curriculares.
 */

import { apiClient } from '../../../shared/services/apiClient';
import { fetchVinculosDocenteDisciplina } from '../../docentes/services/docentesService';
import type {
  Curriculo,
  Disciplina,
  DisciplinaGlobalItem,
  FiltrosDisciplina,
  FiltrosDisciplinaGlobal,
  PaginatedResponse,
  ProjetoPedagogicoCurso,
} from './types';

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

/**
 * Busca o Projeto Pedagógico de Curso (PPC) associado a uma matriz curricular (currículo).
 */
export async function fetchPPCByCurriculoId(curriculoId: string): Promise<ProjetoPedagogicoCurso | null> {
  try {
    const response = await apiClient<any>('/ppcs/');
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
    return null;
  } catch (error) {
    console.error(`Erro ao buscar PPC para o currículo ${curriculoId} na API:`, error);
    throw error;
  }
}

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
  try {
    const response = await apiClient<any>('/curriculos/', { params: { curso: cursoId, status: 'Corrente' } });
    const dtos = Array.isArray(response) ? response : (response.results || []);
    if (dtos.length > 0) {
      const c = dtos[0];
      let curr: Curriculo = {
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

      return curr;
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar currículo para o curso ${cursoId} na API:`, error);
    throw error;
  }
}

/**
 * Busca a lista de disciplinas de um curso, aplicando filtros de busca por termo, período ideal ou tipo.
 */
export async function fetchDisciplinasByCursoId(
  cursoId: string,
  filtros?: FiltrosDisciplina
): Promise<Disciplina[]> {
  try {
    const curriculo = await fetchCurriculoByCursoId(cursoId);
    let disciplinas: Disciplina[] = [];
    if (curriculo) {
      const response = await apiClient<any>('/curriculo-disciplinas/', { params: { curriculo: curriculo.id } });
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
  } catch (error) {
    console.error(`Erro ao buscar disciplinas do curso ${cursoId} na API:`, error);
    throw error;
  }
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

    const response = await apiClient<any>('/disciplinas/', { params });
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
  } catch (error) {
    console.error('Erro ao buscar catálogo global de disciplinas na API:', error);
    throw error;
  }
}

/**
 * Exclui uma disciplina global pelo ID via API.
 */
export async function deleteDisciplinaGlobal(id: string): Promise<boolean> {
  try {
    await apiClient(`/disciplinas/${id}/`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error(`Erro ao excluir disciplina ${id} via API:`, error);
    throw error;
  }
}

/**
 * Atualiza os dados básicos de uma disciplina global via API.
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
      return mapDisciplinaDtoToGlobalItem(response);
    }
    throw new Error('Resposta inválida do servidor ao atualizar disciplina.');
  } catch (error) {
    console.error(`Erro ao atualizar disciplina ${updatedItem.id} via API:`, error);
    throw error;
  }
}

/**
 * Cadastra uma nova disciplina na matriz curricular via API.
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
      return {
        ...newDisc,
        id: String(response.id_disciplina),
        inseridoManualmente: true,
      };
    }
    throw new Error('Resposta inválida do servidor ao cadastrar disciplina.');
  } catch (error) {
    console.error(`Erro ao cadastrar disciplina via API para o curso ${cursoId}:`, error);
    throw error;
  }
}
