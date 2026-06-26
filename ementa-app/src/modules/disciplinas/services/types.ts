/**
 * @file types.ts
 * @description Definições de interfaces e tipagens estritas para o domínio de Disciplinas.
 */

export interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
  cargaHoraria: number;
  ementa: string;
  cursoId: string;
  obrigatoria: boolean;
}

export interface DisciplinaInput {
  nome: string;
  codigo: string;
  cargaHoraria: number;
  ementa: string;
  cursoId: string;
  obrigatoria: boolean;
}
