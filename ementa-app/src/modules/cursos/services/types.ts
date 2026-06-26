/**
 * @file types.ts
 * @description Definições de interfaces e tipagens estritas para o domínio de Cursos.
 */

export interface Curso {
  id: string;
  nome: string;
  codigo: string;
  cargaHoraria: number;
  ativo: boolean;
  descricao?: string;
}

export interface CursoInput {
  nome: string;
  codigo: string;
  cargaHoraria: number;
  descricao?: string;
}
