import { apiClient } from '../../../shared/services/apiClient';
import type { Curso, CursoInput, FiltrosCurso } from './types';

const mapDjangoToCurso = (data: any): Curso => ({
  id: String(data.id_curso),
  codigo: data.codigo_curso,
  nome: data.nome_curso,
  nivel: data.nivel_curso,
  turno: data.turno_curso || 'Não definido',
  funcionamento: data.funcionamento_curso,
  cargaHoraria: Number(data.carga_horaria || 0),
  modalidade: data.modalidade_curso || undefined,
  areaConhecimento: data.area_conhecimento_curso || undefined,
  grauAcademico: data.grau_academico || undefined,
  conceitoMec: data.conceito_mec_curso || undefined,
  coordenador: data.nome_coordenador 
    ? { id: String(data.coordenador), nome: data.nome_coordenador } 
    : undefined,
});

export const fetchCursos = async (filtros?: FiltrosCurso): Promise<Curso[]> => {
  const params: any = {};
  if (filtros?.termo) params.search = filtros.termo;
  if (filtros?.nivel && filtros.nivel !== 'Todos') params.nivel_curso = filtros.nivel;
  if (filtros?.turno && filtros.turno !== 'Todos') params.turno_curso = filtros.turno;
  if (filtros?.funcionamento && filtros.funcionamento !== 'Todos') params.funcionamento_curso = filtros.funcionamento;

  try {
    const response = await apiClient.get('/cursos/', { params });
    
    // VERIFICAÇÃO: Se for um objeto paginado, pegamos o .results
    // Se for uma lista pura, pegamos o .data diretamente
    const listaDeCursos = response.data.results || response.data;
    
    return listaDeCursos.map(mapDjangoToCurso);
  } catch (error) {
    console.error('Erro ao buscar cursos na API:', error);
    return [];
  }
};

export const fetchCursoById = async (id: string): Promise<Curso | undefined> => {
  try {
    const response = await apiClient.get(`/cursos/${id}/`);
    return mapDjangoToCurso(response.data);
  } catch (error) {
    console.error(`Erro ao buscar curso ${id}:`, error);
    return undefined;
  }
};

export const createCurso = async (input: CursoInput): Promise<Curso> => {
  try {
    // Mapeia de volta para o formato que o Django espera criar
    const payload = {
      codigo_curso: input.codigo,
      nome_curso: input.nome,
      nivel_curso: input.nivel,
      turno_curso: input.turno,
    };
    const response = await apiClient.post('/cursos/', payload);
    return mapDjangoToCurso(response.data);
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    throw error;
  }
};