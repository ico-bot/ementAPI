/**
 * @file cursosMock.ts
 * @description Mock estático de dados tipados para simulação de retornos da API de Cursos.
 */

import type { Curso } from './types';

export const CURSOS_MOCK: Curso[] = [
  {
    id: '1',
    nome: 'Bacharelado em Sistemas de Informação',
    codigo: 'BSI001',
    cargaHoraria: 3200,
    ativo: true,
    descricao: 'Formação sólida em engenharia de software, banco de dados e gestão de TI.',
  },
  {
    id: '2',
    nome: 'Engenharia de Software',
    codigo: 'ESOFT002',
    cargaHoraria: 3600,
    ativo: true,
    descricao: 'Foco intensivo no ciclo de vida de desenvolvimento, arquitetura e qualidade de software.',
  },
  {
    id: '3',
    nome: 'Ciência da Computação',
    codigo: 'CCO003',
    cargaHoraria: 3400,
    ativo: false,
    descricao: 'Fundamentos teóricos de computação, algoritmos avançados e inteligência artificial.',
  },
];
