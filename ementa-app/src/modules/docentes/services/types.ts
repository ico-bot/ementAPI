/**
 * @file types.ts
 * @description Definições de interfaces e tipagens estritas para o domínio de Docentes e seus vínculos com disciplinas, espelhando os modelos em models.py.
 */

export type TitulacaoDocente =
  | 'Graduação'
  | 'Especialização'
  | 'Mestrado'
  | 'Doutorado'
  | 'Pós-Doutorado';

export type CargoDocente =
  | 'Professor Adjunto'
  | 'Professor Assistente'
  | 'Professor Titular'
  | 'Professor Substituto'
  | 'Professor Substituto do Magistério Superior'
  | 'Professor do Magistério Superior'
  | 'Professor do Magistério do EBTT'
  | 'PROFESSOR 3 GRAU - CONVÊNIO';

export interface Docente {
  id: string;
  nome: string;
  titulacao?: TitulacaoDocente;
  centroLotacao?: string;
  unidadeVinculoId?: string;
  unidadeVinculoNome?: string;
  cursosVinculados?: string[];
  cargo?: CargoDocente;
  jornada?: string;
  tempoCasa?: number;
  email?: string;
  editadoManualmente?: boolean;
  inseridoManualmente?: boolean;
}

export interface DocenteDisciplinaVinculo {
  id: string;
  docenteId: string;
  docenteNome: string;
  disciplinaId: string;
  disciplinaNome: string;
  codigoDisciplina?: string;
  cargaHoraria?: number;
  cursoId: string;
  cursoNome?: string;
  ano?: number | null;
  semestre: number;
  editadoManualmente?: boolean;
  inseridoManualmente?: boolean;
}

export interface FiltrosDocente {
  termo?: string;
  titulacao?: TitulacaoDocente | 'Todos';
  cargo?: CargoDocente | 'Todos';
}

export type { PaginatedResponse } from '../../../shared/types';
