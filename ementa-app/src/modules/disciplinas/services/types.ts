/**
 * @file types.ts
 * @description Tipagens estritas para o domínio de Disciplinas e Matrizes Curriculares, espelhando models.py e adaptadas à realidade do ementário da UFAC.
 */

export type RegimeLetivo = 'Semestral' | 'Anual';
export type StatusCurriculo = 'Corrente' | 'Ativa Anterior' | 'Inativo';
export type TipoDisciplina = 'Obrigatória' | 'Optativa' | 'Eletiva';

export type NivelDisciplina = 'Graduação' | 'Pós-Graduação';
export type TurnoDisciplina = 'Integral' | 'Matutino' | 'Vespertino' | 'Noturno' | 'Diurno';
export type StatusDisciplina = 'Em atividade' | 'Inativo' | 'Suspenso';

export interface DocenteResumo {
  id: string;
  nome: string;
  titulacao?: string;
}

export interface Disciplina {
  id: string;
  codigo: string;
  nome: string;
  tipo: TipoDisciplina;
  periodoIdeal: number; // Ex: 1, 2... 8 (ou 0 para optativas sem período fixo)
  unidade?: string;
  notaMinimaAprovacao: number; // Ex: 5.0 ou 7.0
  creditos: number;
  cargaHoraria?: number;
  docentes?: DocenteResumo[];
  objetivos?: string;
  ementa?: string;
  programa?: string;
  metodologia?: string;
  avaliacao?: string;
  bibliografiaBasica?: string;
  bibliografiaComplementar?: string;
  preRequisitos?: string;
}

export interface DisciplinaGlobalItem {
  id: string;
  codigo: string;
  nome: string;
  area: string;
  cursoId?: string;
  cursoNome?: string;
  nivel: NivelDisciplina;
  turno: TurnoDisciplina;
  status: StatusDisciplina;
  cargaHoraria: number;
  creditos: number;
  notaMinimaAprovacao: number;
  unidade?: string;
  ementa?: string;
  objetivos?: string;
  programa?: string;
  metodologia?: string;
  avaliacao?: string;
  bibliografiaBasica?: string;
  bibliografiaComplementar?: string;
  preRequisitos?: string;
}

export interface Curriculo {
  id: string;
  cursoId: string;
  cursoNome: string;
  versao: string;
  anoInicio: number;
  semestreInicio: number;
  regimeLetivo: RegimeLetivo;
  numPeriodosIdeal: number;
  totalCreditos: number;
  cargaHorariaTotal: number;
  status: StatusCurriculo;
  corpoDocente?: DocenteResumo[]; // Todos os professores vinculados ao curso na matriz
}

export interface FiltrosDisciplina {
  termo?: string;
  periodo?: number | 'Todos';
  tipo?: TipoDisciplina | 'Todos';
}

export interface FiltrosDisciplinaGlobal {
  termo?: string;
  area?: string | 'Todos';
  nivel?: NivelDisciplina | 'Todos';
  status?: StatusDisciplina | 'Todos';
  cursoId?: string | 'Todos';
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

