/**
 * @file types.ts
 * @description Definições de interfaces e tipagens estritas para o domínio de Cursos com simetria ao Back-End.
 */

export type NivelCurso = 'Graduação' | 'Pós-Graduação';
export type TurnoCurso = 'Integral' | 'Matutino' | 'Vespertino' | 'Noturno' | 'Diurno';
export type StatusFuncionamento = 'Em atividade' | 'Inativo' | 'Suspenso';

export type ModalidadeCurso =
  | 'Bacharelado'
  | 'Licenciatura'
  | 'Residência'
  | 'Especialização'
  | 'Mestrado Acadêmico'
  | 'Mestrado Profissional'
  | 'Doutorado'
  | 'ABI';

export interface Curso {
  id: string;
  nome: string;
  codigo: string;
  cargaHoraria: number;
  periodos?: number;
  funcionamento: StatusFuncionamento;
  nivel: NivelCurso;
  turno?: TurnoCurso;
  modalidade?: ModalidadeCurso;
  areaConhecimento?: string;
  grauAcademico?: string;
  conceitoMec?: string;
  coordenador?: {
    id: string;
    nome: string;
  };
  descricao?: string;
  editadoManualmente?: boolean;
  inseridoManualmente?: boolean;
}

export interface FiltrosCurso {
  termo?: string;
  funcionamento?: StatusFuncionamento | 'Todos';
  nivel?: NivelCurso | 'Todos';
  turno?: TurnoCurso | 'Todos';
}
