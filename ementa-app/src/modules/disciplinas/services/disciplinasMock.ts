/**
 * @file disciplinasMock.ts
 * @description Mock estático de dados tipados para simulação de retornos da API de Disciplinas.
 */

import type { Disciplina } from './types';

export const DISCIPLINAS_MOCK: Disciplina[] = [
  {
    id: '101',
    nome: 'Algoritmos e Estruturas de Dados I',
    codigo: 'BSI101',
    cargaHoraria: 72,
    ementa: 'Introdução aos algoritmos, estruturas sequenciais, condicionais, de repetição e vetores.',
    cursoId: '1',
    obrigatoria: true,
  },
  {
    id: '102',
    nome: 'Engenharia de Requisitos',
    codigo: 'ESOFT102',
    cargaHoraria: 60,
    ementa: 'Técnicas de elicitação, análise, especificação e validação de requisitos de software.',
    cursoId: '2',
    obrigatoria: true,
  },
];
